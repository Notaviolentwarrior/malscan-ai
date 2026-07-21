import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
  valueClass?: string;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accentClass,
  valueClass = "text-white",
}: StatCardProps) {
  return (
    <div className="surface-panel metric-card rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          <h3 className={`mt-4 text-4xl font-bold ${valueClass}`}>{value}</h3>
        </div>

        <div className={`rounded-2xl border p-3 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 max-w-[17rem] text-sm leading-6 text-slate-300">
        {description}
      </p>
    </div>
  );
}

export default StatCard;
