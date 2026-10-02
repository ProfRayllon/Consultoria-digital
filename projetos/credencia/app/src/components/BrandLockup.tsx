interface BrandLockupProps {
  compact?: boolean;
  className?: string;
}

export function BrandLockup({ compact = false, className = "" }: BrandLockupProps) {
  return (
    <div className={`flex min-w-0 items-center ${compact ? "justify-center" : "gap-3"} ${className}`}>
      <div className="grid grid-cols-1 h-10 w-10 shrink-0 place-items-center rounded-lg border border-sky-400/35 bg-sky-500/10 shadow-[0_0_28px_rgba(56,189,248,0.16)]">
        <img src="./logo/logo.png" alt="Rayllon Soares" className="h-8 w-8 object-contain" />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <strong className="block truncate text-[15px] font-semibold text-ink">Credencia</strong>
          <span className="field-label block whitespace-nowrap text-sky-300">Portfolio Edition</span>
        </div>
      ) : null}
    </div>
  );
}
