import { useDeferredValue, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import {
  getApiErrorMessage,
  getDashboardSummary,
  getScans,
  type DashboardSummaryResponse,
  type ScanListItemResponse,
} from "../services/fileService";
import {
  formatProbability,
  getProbabilityBarClass,
  getStatusClass,
  getVerdictClass,
} from "../utils/scanPresentation";

type RetryButtonProps = {
  label: string;
  onClick: () => void;
};

function RetryButton({ label, onClick }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
    >
      <RotateCcw size={16} />
      {label}
    </button>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="surface-panel metric-card rounded-[28px] p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-28 rounded-full bg-white/10" />
        </div>

        <div className="h-11 w-11 rounded-2xl border border-white/8 bg-white/5" />
      </div>

      <div className="mt-4 h-3 w-40 rounded-full bg-white/10" />
      <div className="mt-3 h-3 w-32 rounded-full bg-white/8" />
    </div>
  );
}

function ScanCardSkeleton() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950/62 p-5 shadow-lg shadow-slate-950/20 animate-pulse">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-44 rounded-full bg-white/10" />
          <div className="mt-3 h-3 w-full rounded-full bg-white/8" />
          <div className="mt-2 h-3 w-3/4 rounded-full bg-white/8" />
        </div>

        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-white/8" />
          <div className="h-8 w-24 rounded-full bg-white/8" />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-3 w-32 rounded-full bg-white/8" />
          <div className="h-3 w-16 rounded-full bg-white/8" />
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/8" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-white/8" />
          <div className="h-3 w-24 rounded-full bg-white/8" />
        </div>

        <div className="h-10 w-32 rounded-2xl bg-white/8" />
      </div>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [scans, setScans] = useState<ScanListItemResponse[]>([]);
  const [summaryError, setSummaryError] = useState("");
  const [scansError, setScansError] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [summaryRequestKey, setSummaryRequestKey] = useState(0);
  const [scansRequestKey, setScansRequestKey] = useState(0);
  const deferredSearch = useDeferredValue(search);
  const latestScan = summary?.recentScans[0] ?? scans[0] ?? null;

  useEffect(() => {
    let isActive = true;

    async function loadSummary() {
      try {
        if (isActive) {
          setIsLoadingSummary(true);
        }

        const response = await getDashboardSummary();
        if (isActive) {
          setSummary(response);
          setSummaryError("");
        }
      } catch (summaryLoadError) {
        if (isActive) {
          setSummaryError(
            getApiErrorMessage(
              summaryLoadError,
              "Failed to load dashboard data from the backend."
            )
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingSummary(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isActive = false;
    };
  }, [summaryRequestKey]);

  useEffect(() => {
    let isActive = true;

    async function loadScans() {
      try {
        setIsLoadingScans(true);
        const response = await getScans({
          search: deferredSearch.trim() || undefined,
          status: statusFilter === "ALL" ? undefined : statusFilter,
          verdict: verdictFilter === "ALL" ? undefined : verdictFilter,
          sort,
        });

        if (isActive) {
          setScans(response);
          setScansError("");
        }
      } catch (scanLoadError) {
        if (isActive) {
          setScansError(
            getApiErrorMessage(
              scanLoadError,
              "Failed to load scan records from the backend."
            )
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingScans(false);
        }
      }
    }

    void loadScans();

    return () => {
      isActive = false;
    };
  }, [deferredSearch, sort, statusFilter, verdictFilter, scansRequestKey]);

  return (
    <div className="space-y-6">
      <section className="surface-panel-strong relative overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="section-kicker">Live Overview</span>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              Malware triage at a glance.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Review scan volume, drill into individual records, and filter the
              PE archive by verdict, status, risk, or hash.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[30rem]">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Latest Verdict
              </p>
              {isLoadingSummary || isLoadingScans ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-5 w-28 rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-36 rounded-full bg-white/8" />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {latestScan?.verdict ?? "No scans yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {latestScan?.originalFilename ?? "Upload a PE sample to begin."}
                  </p>
                </>
              )}
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Failed Jobs
              </p>
              {isLoadingSummary ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-5 w-16 rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-40 rounded-full bg-white/8" />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {summary?.failedScans ?? 0}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Analyzer or validation issues captured in MongoDB.
                  </p>
                </>
              )}
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Matching Results
              </p>
              {isLoadingScans ? (
                <div className="mt-3 animate-pulse">
                  <div className="h-5 w-20 rounded-full bg-white/10" />
                  <div className="mt-3 h-3 w-40 rounded-full bg-white/8" />
                </div>
              ) : (
                <>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {scans.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Records matching the current dashboard filters.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {summaryError && !isLoadingSummary && (
        <div className="flex flex-col gap-4 rounded-[24px] border border-red-500/30 bg-red-500/10 p-4 text-red-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} />
            <p>{summaryError}</p>
          </div>

          <RetryButton
            label="Retry summary"
            onClick={() => setSummaryRequestKey((value) => value + 1)}
          />
        </div>
      )}

      {isLoadingSummary ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Scans"
            value={summary ? `${summary.totalScans}` : "Unavailable"}
            description="Files processed so far"
            icon={FileCheck2}
            accentClass="border-cyan-400/20 bg-cyan-500/10 text-cyan-200"
          />
          <StatCard
            title="Threats Detected"
            value={summary ? `${summary.maliciousScans}` : "Unavailable"}
            description="Samples flagged as malicious"
            icon={AlertTriangle}
            accentClass="border-red-500/20 bg-red-500/10 text-red-200"
            valueClass="text-red-100"
          />
          <StatCard
            title="Safe Files"
            value={summary ? `${summary.benignScans}` : "Unavailable"}
            description="Samples flagged as benign"
            icon={ShieldCheck}
            accentClass="border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
            valueClass="text-emerald-100"
          />
          <StatCard
            title="Average Risk"
            value={
              summary
                ? `${(summary.averageProbability * 100).toFixed(1)}%`
                : "Unavailable"
            }
            description="Mean malware probability"
            icon={Activity}
            accentClass="border-amber-400/20 bg-amber-500/10 text-amber-200"
            valueClass="text-amber-100"
          />
        </div>
      )}

      <section className="surface-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="section-kicker">Scan Explorer</span>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Search and filter scans
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Search by filename, SHA-256, stored filename, or scan ID. Then
              narrow by status, verdict, or sort order.
            </p>
          </div>

          {isLoadingScans ? (
            <div className="h-10 w-44 animate-pulse rounded-full border border-white/10 bg-white/5" />
          ) : (
            <div className="status-pill border border-slate-700 bg-slate-950/80 text-slate-300">
              Showing {scans.length} record{scans.length === 1 ? "" : "s"}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <label className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Search
            </span>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <Search size={16} className="text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filename, SHA-256, or scan ID"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>

          <label className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="UPLOADED">Uploaded</option>
            </select>
          </label>

          <label className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Verdict
            </span>
            <select
              value={verdictFilter}
              onChange={(event) => setVerdictFilter(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">All verdicts</option>
              <option value="MALICIOUS">Malicious</option>
              <option value="BENIGN">Benign</option>
            </select>
          </label>

          <label className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="risk-high">Highest risk</option>
              <option value="risk-low">Lowest risk</option>
              <option value="name">Filename A-Z</option>
            </select>
          </label>
        </div>

        {scansError && !isLoadingScans && (
          <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-red-500/30 bg-red-500/10 p-4 text-red-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} />
              <p>{scansError}</p>
            </div>

            <RetryButton
              label="Retry scan list"
              onClick={() => setScansRequestKey((value) => value + 1)}
            />
          </div>
        )}

        {isLoadingScans ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <ScanCardSkeleton key={index} />
            ))}
          </div>
        ) : scans.length ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {scans.map((scan) => (
              <article
                key={scan.scanId}
                className="rounded-[26px] border border-white/10 bg-slate-950/62 p-5 shadow-lg shadow-slate-950/20"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-white">
                      {scan.originalFilename}
                    </p>
                    <p className="mt-2 break-all text-sm text-slate-400">
                      {scan.sha256}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
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
                    {scan.duplicateOfScanId && (
                      <span className="status-pill border border-orange-400/20 bg-orange-500/10 text-orange-200">
                        Re-scan
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-400">Malware probability</span>
                    <span className="font-medium text-white">
                      {formatProbability(scan.probability)}
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${getProbabilityBarClass(scan.verdict)}`}
                      style={{
                        width:
                          scan.probability === null
                            ? "12%"
                            : `${Math.max(scan.probability * 100, 8)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-slate-400">
                    <p>{new Date(scan.uploadedAt).toLocaleString()}</p>
                    <p className="mt-1 text-slate-500">
                      {scan.modelName ?? "Model unavailable"}
                    </p>
                  </div>

                  <Link
                    to={`/scans/${scan.scanId}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    View details
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {scan.error && (
                  <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">
                    {scan.error}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : scansError ? (
          <div className="mt-6 rounded-[26px] border border-dashed border-white/10 bg-slate-950/65 p-8 text-sm text-slate-400">
            Scan records are temporarily unavailable. Use the retry action above
            to request them again.
          </div>
        ) : (
          <div className="mt-6 rounded-[26px] border border-dashed border-white/10 bg-slate-950/65 p-8 text-sm text-slate-400">
            No scans match the current filters. Adjust the search, verdict, or
            status criteria.
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
