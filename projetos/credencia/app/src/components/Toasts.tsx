import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "../state/store";

export function Toasts({ compact = false }: { compact?: boolean }) {
  const { state, fecharToast } = useStore();

  useEffect(() => {
    if (!state.toasts.length) return;
    const timers = state.toasts.map((t) => window.setTimeout(() => fecharToast(t.id), 3600));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [state.toasts, fecharToast]);

  return (
    <div
      className={`pointer-events-none fixed z-50 grid gap-2 ${
        compact ? "inset-x-3 top-12" : "bottom-5 right-5 w-[340px]"
      }`}
      aria-live="polite"
    >
      {state.toasts.map((t) => {
        const Icon = t.tone === "success" ? CheckCircle2 : Info;
        return (
          <div key={t.id} className="toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-panelStrong/95 p-3 shadow-panel backdrop-blur">
            <Icon size={18} className={t.tone === "success" ? "mt-0.5 text-emerald-600" : "mt-0.5 text-accent"} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-medium text-ink">{t.title}</strong>
              {t.detail ? <span className="mt-0.5 block text-xs leading-5 text-muted">{t.detail}</span> : null}
            </div>
            <button type="button" className="text-muted hover:text-ink" onClick={() => fecharToast(t.id)} aria-label="Fechar aviso">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
