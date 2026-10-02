import type { UnitStatus } from "../types";

interface StatusBadgeProps {
  status: UnitStatus;
}

const statusClasses: Record<UnitStatus, string> = {
  Ativa: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Inscrita sem presença": "border-amber-200 bg-amber-50 text-amber-700",
  Lacuna: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
