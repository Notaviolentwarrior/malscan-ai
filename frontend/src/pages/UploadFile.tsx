import { useState } from "react";
import {
  AlertTriangle,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getApiErrorMessage,
  uploadFile,
  type FileUploadResponse,
} from "../services/fileService";
import {
  formatDate,
  formatFileSize,
  formatProbability,
  getProbabilityBarClass,
  getStatusClass,
  getVerdictClass,
} from "../utils/scanPresentation";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<FileUploadResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(forceRescan = false) {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setResult(null);

      const response = await uploadFile(selectedFile, forceRescan);
      setResult(response);
    } catch (uploadError) {
      setError(
        getApiErrorMessage(
          uploadError,
          "Upload failed. Please check the backend, MongoDB, or analyzer service."
        )
      );
    } finally {
      setIsUploading(false);
    }
  }

  const probabilityWidth =
    result?.probability === null || result?.probability === undefined
      ? "12%"
      : `${Math.max(result.probability * 100, 8)}%`;

  return (
    <div className="space-y-6">
      <section className="surface-panel-strong relative overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative">
          <span className="section-kicker">Read-Only Submission</span>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Upload a Windows PE sample.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            The MVP accepts `.exe` and `.dll` files only, quarantines them on
            upload, and sends them to the FastAPI analyzer for static scoring.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <section className="surface-panel rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="status-pill border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
              EMBER static scoring
            </span>
            <span className="status-pill border border-slate-700 bg-slate-950/80 text-slate-300">
              Duplicate hashes are reused automatically
            </span>
          </div>

          <div className="scan-grid mt-6 rounded-[30px] border border-white/10 p-6 sm:p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 shadow-lg shadow-cyan-950/20">
                <UploadCloud size={36} />
              </div>

              <h2 className="mt-5 text-3xl font-semibold text-white">
                Select a PE file to analyze
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Allowed extensions are `.exe` and `.dll`. Uploaded files are
                quarantined and scanned without being executed.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <label
                  htmlFor="pe-upload"
                  className="cursor-pointer rounded-2xl border border-cyan-400/20 bg-cyan-500/12 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18"
                >
                  Choose sample
                </label>
                <input
                  id="pe-upload"
                  type="file"
                  accept=".exe,.dll"
                  className="sr-only"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] ?? null);
                    setResult(null);
                    setError("");
                  }}
                />

                <button
                  onClick={() => {
                    void handleUpload();
                  }}
                  disabled={isUploading || !selectedFile}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? "Analyzing sample..." : "Upload and analyze"}
                </button>
              </div>

              {selectedFile ? (
                <div className="mt-8 rounded-[26px] border border-white/10 bg-slate-950/70 p-5 text-left">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Selected file
                      </p>
                      <p className="mt-2 break-all text-lg font-semibold text-white">
                        {selectedFile.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="status-pill border border-slate-700 bg-slate-900/80 text-slate-300">
                        {selectedFile.name.split(".").pop()?.toUpperCase() ?? "PE"}
                      </span>
                      <span className="status-pill border border-slate-700 bg-slate-900/80 text-slate-300">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm font-semibold text-white">Scope</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Windows PE files only. No APK, PDF, or other formats.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm font-semibold text-white">Safety</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Samples stay in quarantine and are never executed.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm font-semibold text-white">Output</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Probability, verdict, model name, status, and errors.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              <AlertTriangle size={20} />
              <p>{error}</p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="surface-panel rounded-[32px] p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-200">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Scan policy
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  What this demo does
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                <p className="font-medium text-white">Validate and quarantine</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Spring Boot enforces `.exe` and `.dll` uploads and stores the
                  sample before analysis.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                <p className="font-medium text-white">Reuse duplicates by default</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Matching SHA-256 uploads return the existing record instantly,
                  with an explicit force re-scan path when needed.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                <p className="font-medium text-white">Persist the outcome</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  MongoDB stores the verdict, status, model name, timestamps,
                  and any analyzer errors.
                </p>
              </div>
            </div>
          </section>

          <section className="surface-panel rounded-[32px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-200">
                  <FileCheck2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Latest result
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {result ? result.message : "Awaiting submission"}
                  </h2>
                </div>
              </div>
            </div>

            {result ? (
              <div className="mt-5 space-y-5">
                {result.reusedExistingResult && (
                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-4">
                    <p className="text-sm font-semibold text-cyan-100">
                      Existing SHA-256 match found
                    </p>
                    <p className="mt-2 text-sm leading-6 text-cyan-50/90">
                      This upload matched a previous sample, so the backend
                      returned the saved result instead of creating a new scan.
                    </p>
                    <button
                      onClick={() => {
                        void handleUpload(true);
                      }}
                      disabled={isUploading || !selectedFile}
                      className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw size={16} />
                      Force re-scan
                    </button>
                  </div>
                )}

                <div className="rounded-[26px] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`status-pill border ${getStatusClass(result.status)}`}
                    >
                      {result.status}
                    </span>
                    <span
                      className={`status-pill border ${getVerdictClass(result.verdict)}`}
                    >
                      {result.verdict ?? "Unavailable"}
                    </span>
                    <span className="status-pill border border-slate-700 bg-slate-900/80 text-slate-300">
                      {result.modelName ?? "Model unavailable"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Malware probability
                        </p>
                        <p className="mt-2 text-4xl font-bold text-white">
                          {formatProbability(result.probability)}
                        </p>
                      </div>
                      <p className="text-sm text-slate-400">
                        SHA-256 stored for traceability
                      </p>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-slate-800">
                      <div
                        className={`h-2 rounded-full ${getProbabilityBarClass(result.verdict)}`}
                        style={{ width: probabilityWidth }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Original file
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {result.originalFilename}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Stored file
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {result.storedFilename}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Uploaded at
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {formatDate(result.uploadedAt)}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Analyzed at
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {formatDate(result.analyzedAt)}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Content type
                    </p>
                    <p className="mt-2 text-sm text-white">{result.contentType}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Size
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {formatFileSize(result.size)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    SHA-256
                  </p>
                  <p className="mt-2 break-all font-mono text-sm text-cyan-200">
                    {result.sha256}
                  </p>
                </div>

                {result.duplicateOfScanId && (
                  <div className="rounded-[24px] border border-orange-400/20 bg-orange-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200/80">
                      Previous matching scan
                    </p>
                    <Link
                      to={`/scans/${result.duplicateOfScanId}`}
                      className="mt-2 inline-flex text-sm font-medium text-orange-100 underline decoration-orange-300/40 underline-offset-4"
                    >
                      Open the earlier matching record
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/scans/${result.scanId}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View scan details
                  </Link>
                  <Link
                    to="/dashboard"
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
                  >
                    Open dashboard
                  </Link>
                </div>

                {result.error && (
                  <div className="rounded-[24px] border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
                      Analyzer error
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-100">
                      {result.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-[26px] border border-dashed border-white/10 bg-slate-950/65 p-6 text-sm leading-6 text-slate-400">
                Upload a `.exe` or `.dll` file to see the verdict, malware
                probability, model name, SHA-256, and stored scan metadata here.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default UploadFile;
