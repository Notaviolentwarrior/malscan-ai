from __future__ import annotations

import json
import logging
import math
import os
from functools import lru_cache
from pathlib import Path

import lightgbm as lgb
import pefile
import signify.authenticode
from fastapi import FastAPI, File, Request, UploadFile
from huggingface_hub import hf_hub_download
from pydantic import BaseModel
from signify.authenticode.signed_file import SignedPEFile

LOGGER = logging.getLogger("malscan-analyzer")
logging.basicConfig(level=logging.INFO)

REPO_ROOT = Path(__file__).resolve().parents[2]
MODEL_REPO_ID = os.getenv("ANALYZER_MODEL_REPO_ID", "joyce8/EMBER2024-benchmark-models")
MODEL_FILENAME = os.getenv("ANALYZER_MODEL_FILENAME", "EMBER2024_PE.model")
MODEL_DIR = Path(os.getenv("ANALYZER_MODEL_DIR", REPO_ROOT / "analyzer" / "models")).resolve()
UPLOAD_ROOT = Path(os.getenv("ANALYZER_UPLOAD_ROOT", REPO_ROOT / "uploads")).resolve()
MALICIOUS_THRESHOLD = float(os.getenv("ANALYZER_MALICIOUS_THRESHOLD", "0.5"))
ALLOWED_EXTENSIONS = {".exe", ".dll"}


class AnalyzeResponse(BaseModel):
    status: str
    modelName: str | None = None
    probability: float | None = None
    verdict: str | None = None
    error: str | None = None


def patch_thrember_compatibility() -> None:
    if not hasattr(SignedPEFile, "iter_signed_datas"):
        SignedPEFile.iter_signed_datas = SignedPEFile.iter_embedded_signatures
    signify.authenticode.SignedPEFile = SignedPEFile


class AnalyzerRuntime:
    def __init__(self) -> None:
        patch_thrember_compatibility()
        import thrember

        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        self.model_path = Path(
                hf_hub_download(
                        repo_id=MODEL_REPO_ID,
                        filename=MODEL_FILENAME,
                        local_dir=str(MODEL_DIR),
                )
        ).resolve()
        self.extractor = thrember.PEFeatureExtractor()
        self.model = lgb.Booster(model_file=str(self.model_path))
        self.model_name = MODEL_FILENAME

    def analyze(self, file_path: str) -> AnalyzeResponse:
        path = Path(file_path).expanduser().resolve()

        if not is_path_within_root(path, UPLOAD_ROOT):
            return self.failure("Requested file is outside the analyzer upload root")

        if path.suffix.lower() not in ALLOWED_EXTENSIONS:
            return self.failure("Only .exe and .dll files are supported")

        if not path.exists() or not path.is_file():
            return self.failure("Uploaded file was not found in quarantine")

        try:
            bytez = path.read_bytes()
        except OSError:
            return self.failure("Failed to read the quarantined file")

        if not is_valid_pe(bytez):
            return self.failure("The uploaded file is not a valid Windows PE binary")

        try:
            vector = self.extractor.feature_vector(bytez)
            score = float(self.model.predict(vector.reshape(1, -1))[0])
        except Exception:
            LOGGER.exception("Static analysis failed for %s", path)
            return self.failure("Static analysis failed while processing the PE file")

        if not math.isfinite(score):
            return self.failure("Model returned an invalid malware probability")

        verdict = "MALICIOUS" if score >= MALICIOUS_THRESHOLD else "BENIGN"
        return AnalyzeResponse(
                status="COMPLETED",
                modelName=self.model_name,
                probability=round(score, 6),
                verdict=verdict,
                error=None,
        )

    def analyze_bytes(self, filename: str, bytez: bytes) -> AnalyzeResponse:
        suffix = Path(filename).suffix.lower()

        if suffix not in ALLOWED_EXTENSIONS:
            return self.failure("Only .exe and .dll files are supported")

        if not is_valid_pe(bytez):
            return self.failure("The uploaded file is not a valid Windows PE binary")

        try:
            vector = self.extractor.feature_vector(bytez)
            score = float(self.model.predict(vector.reshape(1, -1))[0])
        except Exception:
            LOGGER.exception("Static analysis failed for uploaded file %s", filename)
            return self.failure("Static analysis failed while processing the PE file")

        if not math.isfinite(score):
            return self.failure("Model returned an invalid malware probability")

        verdict = "MALICIOUS" if score >= MALICIOUS_THRESHOLD else "BENIGN"
        return AnalyzeResponse(
                status="COMPLETED",
                modelName=self.model_name,
                probability=round(score, 6),
                verdict=verdict,
                error=None,
        )

    def failure(self, error: str) -> AnalyzeResponse:
        return AnalyzeResponse(
                status="FAILED",
                modelName=MODEL_FILENAME,
                probability=None,
                verdict=None,
                error=error,
        )


def is_valid_pe(bytez: bytes) -> bool:
    try:
        pe = pefile.PE(data=bytez, fast_load=True)
        pe.close()
        return True
    except pefile.PEFormatError:
        return False
    except Exception:
        return False


def is_path_within_root(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


@lru_cache(maxsize=1)
def get_runtime() -> AnalyzerRuntime:
    return AnalyzerRuntime()


app = FastAPI(title="MalScan AI Analyzer", version="1.0.0")


@app.get("/health")
def health() -> dict[str, str]:
    runtime = get_runtime()
    return {
            "status": "UP",
            "service": "MalScan AI Analyzer",
            "modelName": runtime.model_name,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: Request, file: UploadFile | None = File(default=None)) -> AnalyzeResponse:
    try:
        runtime = get_runtime()
    except Exception:
        LOGGER.exception("Analyzer bootstrap failed")
        return AnalyzeResponse(
                status="FAILED",
                modelName=MODEL_FILENAME,
                probability=None,
                verdict=None,
                error="Analyzer model could not be loaded",
        )

    if file is not None:
        filename = file.filename or "uploaded-sample"
        bytez = await file.read()

        if not bytez:
            return AnalyzeResponse(
                    status="FAILED",
                    modelName=MODEL_FILENAME,
                    probability=None,
                    verdict=None,
                    error="Uploaded analyzer file is empty",
            )

        return runtime.analyze_bytes(filename, bytez)

    file_path = request.query_params.get("filePath") or request.query_params.get("file_path")
    raw_body = await request.body()
    LOGGER.info("Analyzer raw request body: %r", raw_body)

    if not file_path and raw_body:
        try:
            payload = json.loads(raw_body)
        except json.JSONDecodeError:
            payload = raw_body.decode("utf-8", errors="ignore").strip()

        if isinstance(payload, dict):
            file_path = payload.get("filePath") or payload.get("file_path")
        elif isinstance(payload, str) and payload:
            file_path = payload

    if not file_path:
        return AnalyzeResponse(
                status="FAILED",
                modelName=MODEL_FILENAME,
                probability=None,
                verdict=None,
                error="Analyzer request is missing filePath",
        )

    return runtime.analyze(file_path)
