import {
  BarChart3,
  UploadCloud,
  History,
  FileText,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/dashboard" },
  { label: "Upload File", icon: UploadCloud, path: "/upload" },
  { label: "Scan History", icon: History, path: "/scan-history" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "IOC Explorer", icon: Search, path: "/ioc-explorer" },
  { label: "Settings", icon: Settings, path: "/settings" },
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
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-cyan-400"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
