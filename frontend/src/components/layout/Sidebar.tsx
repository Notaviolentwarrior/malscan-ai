import {
  BarChart3,
  UploadCloud,
  History,
  FileText,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Upload File", icon: UploadCloud },
  { label: "Scan History", icon: History },
  { label: "Reports", icon: FileText },
  { label: "IOC Explorer", icon: Search },
  { label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">MalScan AI</h1>
          <p className="text-xs text-slate-500">Threat Intelligence</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-cyan-400"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
