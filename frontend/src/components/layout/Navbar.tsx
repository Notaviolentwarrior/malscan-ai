import { Bell, Search, UserCircle2 } from "lucide-react";

function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <button className="rounded-xl bg-slate-900 p-2 hover:bg-slate-800">
          <Bell size={20} className="text-slate-300" />
        </button>

        <button className="rounded-xl bg-slate-900 p-2 hover:bg-slate-800">
          <UserCircle2 size={22} className="text-cyan-400" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
