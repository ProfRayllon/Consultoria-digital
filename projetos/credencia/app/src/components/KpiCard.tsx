import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "rose" | "violet";
  trend?: "up" | "down" | "flat";
}

const toneClass = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export function KpiCard({ label, value, detail, icon: Icon, tone = "blue", trend = "flat" }: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <article className="panel grid min-h-[118px] min-w-0 grid-cols-1 gap-2 p-3 sm:grid-cols-[40px_1fr] sm:gap-3 sm:p-4">
      <div className={`grid h-10 w-10 place-items-center rounded-lg border ${toneClass[tone]}`}>
        <Icon size={19} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <span className="field-label block">{label}</span>
        <strong className="mt-2 block truncate text-xl font-medium leading-none text-ink sm:text-2xl">{value}</strong>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-muted">
          <TrendIcon size={14} aria-hidden="true" />
          {detail}
        </span>
      </div>
    </article>
  );
}
