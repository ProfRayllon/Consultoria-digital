import { BadgeCheck, Clock3, QrCode as QrIcon, Radio, Search, UserCheck, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { formatNumber, formatPercent, getUnitMaps, normalizeText, percent } from "../lib/analytics";
import { useStore } from "../state/store";
import { iniciais, quando } from "./InscricoesPage";

// Horário dos credenciamentos feitos agora: depois de todos os da base,
// para entrarem no topo do "ao vivo".
export function horarioAgora(seq: number) {
  return `2026-04-17T15:${String(10 + (seq % 50)).padStart(2, "0")}:00`;
}

export function CheckinPage() {
  const { state, data, enviar, toast } = useStore();
  const { unitById } = useMemo(() => getUnitMaps(data), [data]);
  const [busca, setBusca] = useState("");

  const inscritos = state.participants.filter((p) => p.registered);
  const credenciados = inscritos.filter((p) => p.checkedIn);
  const pendentes = inscritos.length - credenciados.length;
  const viaQr = credenciados.filter((p) => p.checkInMethod === "QR code").length;

  const termo = normalizeText(busca);
  const resultados = inscritos
    .filter((p) => !termo || normalizeText(`${p.name} ${p.ticket}`).includes(termo))
    .sort((a, b) => Number(a.checkedIn) - Number(b.checkedIn))
    .slice(0, 7);
  const primeiroPendente = resultados.find((p) => !p.checkedIn)?.id;

  const aoVivo = [...credenciados].sort((a, b) => (b.checkedInAt ?? "").localeCompare(a.checkedInAt ?? "")).slice(0, 7);

  function credenciar(id: string, nome: string) {
    enviar({ type: "credenciar", participantId: id, method: "Busca manual", at: horarioAgora(credenciados.length) });
    toast({ tone: "success", title: "Credenciamento confirmado", detail: `${nome} liberado para o encontro.` });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Credenciamento"
        title="Check-in do encontro"
        description="Recepção no dia: leitura do QR code do ingresso pelo celular da equipe ou busca por nome. Cada confirmação atualiza o painel na hora."
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Inscritos" value={formatNumber(inscritos.length)} detail="esperados no ciclo" icon={UsersRound} tone="blue" trend="flat" />
        <KpiCard label="Credenciados" value={formatNumber(credenciados.length)} detail={`${formatPercent(percent(credenciados.length, inscritos.length))} de presença`} icon={BadgeCheck} tone="green" trend="up" />
        <KpiCard label="Pendentes" value={formatNumber(pendentes)} detail="ainda não chegaram" icon={Clock3} tone="amber" trend="down" />
        <KpiCard label="Via QR code" value={formatPercent(percent(viaQr, credenciados.length))} detail="sem fila de digitação" icon={QrIcon} tone="violet" trend="up" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-4">
          <label className="grid grid-cols-1 gap-1.5">
            <span className="field-label">Buscar participante</span>
            <span className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input data-tour="busca-checkin" className="input h-11 pl-10 text-base" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome ou código do ingresso" />
            </span>
          </label>
          <ul className="mt-3 grid grid-cols-1 gap-2">
            {resultados.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-line bg-panelStrong/45 px-3 py-2.5">
                <span className="grid grid-cols-1 h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent">{iniciais(p.name)}</span>
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-medium text-ink">{p.name}</strong>
                  <span className="block truncate text-xs text-muted">{p.ticket} · {unitById.get(p.unitId)?.name} · {p.role}</span>
                </div>
                {p.checkedIn ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600"><BadgeCheck size={15} aria-hidden="true" /> {quando(p.checkedInAt).slice(6)}</span>
                ) : (
                  <button
                    type="button"
                    data-tour={p.id === primeiroPendente ? "credenciar-primeiro" : undefined}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-white hover:brightness-110"
                    onClick={() => credenciar(p.id, p.name)}
                  >
                    <UserCheck size={14} aria-hidden="true" /> Credenciar
                  </button>
                )}
              </li>
            ))}
            {!resultados.length ? <li className="rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">Ninguém encontrado com esse termo.</li> : null}
          </ul>
        </div>

        <div className="panel p-4" data-tour="ao-vivo">
          <header className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink">Chegadas ao vivo</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700">
              <Radio size={12} className="animate-pulse" aria-hidden="true" /> sincronizado
            </span>
          </header>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted">
              <span>Presença do ciclo</span>
              <span>{formatNumber(credenciados.length)} / {formatNumber(inscritos.length)}</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-muted/15">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-700" style={{ width: `${percent(credenciados.length, inscritos.length)}%` }} />
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-1.5">
            {aoVivo.map((p) => {
              const nova = state.recente?.kind === "participante" && state.recente.id === p.id;
              return (
                <li key={p.id + (nova ? state.recente?.at : "")} className={`flex items-center gap-3 rounded-lg px-2 py-2 ${nova ? "linha-nova surge" : ""}`}>
                  <span className="grid grid-cols-1 h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-600">{iniciais(p.name)}</span>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-medium text-ink">{p.name}</strong>
                    <span className="block truncate text-xs text-muted">{unitById.get(p.unitId)?.name}</span>
                  </div>
                  <span className="text-right text-[11px] leading-4 text-muted">
                    {quando(p.checkedInAt).slice(6)}
                    <span className="block">{p.checkInMethod ?? "QR code"}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
