type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default StatCard;
