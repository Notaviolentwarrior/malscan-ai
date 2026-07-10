import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
