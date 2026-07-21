import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const isScanDetails = location.pathname.startsWith("/scans/");
  const title = isDashboard
    ? "Dashboard"
    : isScanDetails
      ? "Scan Details"
      : "Upload File";
  const subtitle = isDashboard
    ? "Recent MongoDB-backed scan results"
    : isScanDetails
      ? "Full metadata, verdict, and duplicate lineage"
      : "PE-only static malware analysis";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <span className="section-kicker">MalScan Control Room</span>
          <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="status-pill border border-cyan-400/20 bg-cyan-500/10 text-cyan-200">
            .exe / .dll only
          </span>
          <span className="status-pill border border-emerald-400/20 bg-emerald-500/10 text-emerald-200">
            Never execute
          </span>
          <span className="status-pill border border-slate-700 bg-slate-900/80 text-slate-300">
            MongoDB-backed
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
