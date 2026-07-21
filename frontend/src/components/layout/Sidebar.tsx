import { BarChart3, ShieldCheck, UploadCloud } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/dashboard" },
  { label: "Upload File", icon: UploadCloud, path: "/upload" },
];

function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-slate-950/35 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="flex h-full flex-col px-4 py-4 sm:px-6 lg:px-5 lg:py-6">
        <div className="surface-panel rounded-[28px] p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200 shadow-lg shadow-cyan-500/10">
              <ShieldCheck size={30} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                Malware Triage
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white">MalScan AI</h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Read-only static analysis for Windows PE samples. Upload,
                score, and review from one surface.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 px-2 py-3">
              <p className="font-semibold text-white">PE</p>
              <p className="mt-1 text-[11px] text-slate-400">.exe .dll</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 px-2 py-3">
              <p className="font-semibold text-white">FastAPI</p>
              <p className="mt-1 text-[11px] text-slate-400">Analyzer</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 px-2 py-3">
              <p className="font-semibold text-white">MongoDB</p>
              <p className="mt-1 text-[11px] text-slate-400">Results</p>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `group flex min-w-fit items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition lg:w-full ${
                    isActive
                      ? "border-cyan-400/20 bg-cyan-500/12 text-cyan-200 shadow-lg shadow-cyan-950/20"
                      : "border-white/8 bg-slate-950/55 text-slate-300 hover:border-white/16 hover:bg-slate-900/90 hover:text-white"
                  }`
                }
              >
                <span className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <Icon size={18} />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="surface-panel mt-4 hidden rounded-[28px] p-5 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Pipeline
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-3">
              <p className="text-sm font-semibold text-white">1. Intake</p>
              <p className="mt-1 text-sm text-slate-400">
                Spring Boot validates and quarantines the PE upload.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-3">
              <p className="text-sm font-semibold text-white">2. Analyze</p>
              <p className="mt-1 text-sm text-slate-400">
                FastAPI extracts EMBER features and scores the file.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-3">
              <p className="text-sm font-semibold text-white">3. Persist</p>
              <p className="mt-1 text-sm text-slate-400">
                MongoDB stores verdict, probability, model, and status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
