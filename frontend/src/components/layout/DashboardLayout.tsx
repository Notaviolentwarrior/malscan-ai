import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute left-[-5rem] top-12 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div
          className="animate-float absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="animate-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      <div className="relative lg:flex">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
