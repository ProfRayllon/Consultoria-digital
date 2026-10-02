import type { ReactNode } from "react";

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ChartPanel({ title, subtitle, children, actions, className = "" }: ChartPanelProps) {
  return (
    <section className={`panel min-w-0 p-4 ${className}`}>
      <header className="mb-3 flex min-h-10 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-ink">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs leading-5 text-muted">{subtitle}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}
