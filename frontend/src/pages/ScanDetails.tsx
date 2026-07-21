import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Link2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getApiErrorMessage,
  getScan,
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

function ScanDetails() {
  const { scanId } = useParams();
  const [scan, setScan] = useState<FileUploadResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadScanDetails() {
      if (!scanId) {
        if (isActive) {
          setError("Scan ID is missing from the URL.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getScan(scanId);
        if (isActive) {
          setScan(response);
          setError("");
        }
      } catch (scanLoadError) {
        if (isActive) {
          setError(
            getApiErrorMessage(
              scanLoadError,
              "Failed to load the scan details from the backend."
            )
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadScanDetails();

    return () => {
      isActive = false;
    };
  }, [scanId]);

  if (isLoading) {
    return (
      <div className="surface-panel rounded-[32px] p-8 text-sm text-slate-300">
        Loading scan details...
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="rounded-[24px] border border-red-500/30 bg-red-500/10 p-5 text-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} />
            <p>{error || "Scan record could not be loaded."}</p>
          </div>
        </div>
      </div>
    );
  }

  const probabilityWidth =
    scan.probability === null ? "12%" : `${Math.max(scan.probability * 100, 8)}%`;

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <section className="surface-panel-strong rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">Scan Details</span>
            <h1 className="mt-4 break-all text-3xl font-bold text-white sm:text-4xl">
              {scan.originalFilename}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {scan.message}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`status-pill border ${getStatusClass(scan.status)}`}
            >
              {scan.status}
            </span>
            <span
              className={`status-pill border ${getVerdictClass(scan.verdict)}`}
            >
              {scan.verdict ?? "Unavailable"}
            </span>
            <span className="status-pill border border-slate-700 bg-slate-900/80 text-slate-300">
              {scan.modelName ?? "Model unavailable"}
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/55 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Malware probability
              </p>
              <p className="mt-3 text-5xl font-bold text-white">
                {formatProbability(scan.probability)}
              </p>
            </div>
            <div className="text-sm text-slate-400">
              <p>Uploaded {formatDate(scan.uploadedAt)}</p>
              <p className="mt-1">Analyzed {formatDate(scan.analyzedAt)}</p>
            </div>
          </div>

          <div className="mt-5 h-2 rounded-full bg-slate-800">
            <div
              className={`h-2 rounded-full ${getProbabilityBarClass(scan.verdict)}`}
              style={{ width: probabilityWidth }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <section className="surface-panel rounded-[32px] p-6">
          <span className="section-kicker">Metadata</span>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Scan ID
              </p>
              <p className="mt-2 break-all font-mono text-sm text-slate-200">
                {scan.scanId}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Content type
              </p>
              <p className="mt-2 text-sm text-white">{scan.contentType}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Stored file
              </p>
              <p className="mt-2 break-all text-sm text-white">
                {scan.storedFilename}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                File size
              </p>
              <p className="mt-2 text-sm text-white">{formatFileSize(scan.size)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Uploaded at
              </p>
              <p className="mt-2 text-sm text-white">{formatDate(scan.uploadedAt)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Analyzed at
              </p>
              <p className="mt-2 text-sm text-white">{formatDate(scan.analyzedAt)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              SHA-256
            </p>
            <p className="mt-2 break-all font-mono text-sm text-cyan-200">
              {scan.sha256}
            </p>
          </div>

          {scan.error && (
            <div className="mt-5 rounded-[24px] border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/80">
                Analyzer error
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-100">
                {scan.error}
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="surface-panel rounded-[32px] p-6">
            <span className="section-kicker">Related Records</span>
            <div className="mt-5 space-y-3">
              {scan.duplicateOfScanId ? (
                <div className="rounded-[24px] border border-orange-400/20 bg-orange-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-orange-300/20 bg-orange-300/10 p-2 text-orange-100">
                      <Link2 size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-orange-100">
                        This scan re-analyzed a previously seen SHA-256.
                      </p>
                      <Link
                        to={`/scans/${scan.duplicateOfScanId}`}
                        className="mt-2 inline-flex text-sm font-medium text-orange-50 underline decoration-orange-300/40 underline-offset-4"
                      >
                        Open the earlier matching record
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-400">
                  No earlier matching SHA-256 is linked to this record.
                </div>
              )}
            </div>
          </section>

          <section className="surface-panel rounded-[32px] p-6">
            <span className="section-kicker">Actions</span>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/upload"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Upload another file
              </Link>
              <Link
                to="/dashboard"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
              >
                Return to dashboard
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ScanDetails;
