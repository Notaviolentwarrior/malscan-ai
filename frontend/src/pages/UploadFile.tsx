import { useState } from "react";
import { UploadCloud, FileCheck2, AlertTriangle } from "lucide-react";
import { uploadFile, type FileUploadResponse } from "../services/fileService";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<FileUploadResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setResult(null);

      const response = await uploadFile(selectedFile);
      setResult(response);
    } catch {
      setError("Upload failed. Please check the backend or file type.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Upload File</h1>
        <p className="mt-2 text-slate-400">
          Upload suspicious files for safe static malware analysis.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center">
          <UploadCloud className="mb-4 text-cyan-400" size={48} />

          <p className="text-lg font-medium text-white">
            Select a file to analyze
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Allowed: exe, dll, pdf, docx, apk, jar, zip, bin, txt, xml
          </p>

          <input
            type="file"
            className="mt-6 block text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0] ?? null);
              setResult(null);
              setError("");
            }}
          />

          {selectedFile && (
            <p className="mt-4 text-sm text-slate-300">
              Selected: {selectedFile.name}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <div className="mb-4 flex items-center gap-3 text-emerald-300">
              <FileCheck2 size={22} />
              <h2 className="text-lg font-semibold">{result.message}</h2>
            </div>

            <div className="space-y-3 text-sm">
              <p>
                <span className="text-slate-400">Original file:</span>{" "}
                <span className="text-white">{result.originalFilename}</span>
              </p>

              <p>
                <span className="text-slate-400">Stored file:</span>{" "}
                <span className="text-white">{result.storedFilename}</span>
              </p>

              <p>
                <span className="text-slate-400">Content type:</span>{" "}
                <span className="text-white">{result.contentType}</span>
              </p>

              <p>
                <span className="text-slate-400">Size:</span>{" "}
                <span className="text-white">{result.size} bytes</span>
              </p>

              <p className="break-all">
                <span className="text-slate-400">SHA-256:</span>{" "}
                <span className="text-cyan-300">{result.sha256}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFile;
