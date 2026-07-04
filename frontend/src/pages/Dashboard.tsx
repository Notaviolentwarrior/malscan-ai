import StatCard from "../components/ui/StatCard";

function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Overview of malware scans, threats, and AI analysis.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Scans" value="0" description="Files analyzed so far" />
        <StatCard title="Threats Detected" value="0" description="Malicious files found" />
        <StatCard title="Safe Files" value="0" description="Clean files detected" />
        <StatCard title="AI Risk Score" value="0%" description="Average risk level" />
      </div>
    </div>
  );
}

export default Dashboard;
