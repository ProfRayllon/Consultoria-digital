import { BatteryFull, Bell, CheckCircle2, ChevronLeft, QrCode as QrIcon, ScanLine, Signal, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { QrCode } from "../../components/QrCode";
import { Toasts } from "../../components/Toasts";
import { MAIN_FORMACAO_ID, demoData } from "../../data/syntheticData";
import { averageEvaluation, formatDecimal, formatNumber, formatPercent, mean, percent, periodOptions } from "../../lib/analytics";
import { horarioAgora } from "../../pages/CheckinPage";
import { statusTone } from "../../pages/FormacoesPage";
import { PublicPage } from "../../pages/PublicPage";
import { VITRINE_INSCRITA, useFormacoes, useStore } from "../../state/store";
import { Cursor } from "../Cursor";
import { useVitrine } from "../useVitrine";

export type Tela = "gestor" | "mensagens" | "publica" | "scanner" | "painel";

// Tela do celular na vitrine da home. Cada passo do roteiro escolhe qual
// "app" está aberto: o do gestor, as mensagens, a página pública, o leitor
// de QR da equipe de recepção ou o painel resumido.
export function Celular() {
  const [tela, setTela] = useState<Tela>("gestor");
  const { state } = useStore();
  useVitrine({ setTela });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-panelStrong">
      <BarraStatus />
      <div className="relative min-h-0 flex-1 overflow-y-auto sem-barra" data-rolagem key={`${tela}-${state.rodada}`}>
        {tela === "gestor" ? <TelaGestor /> : null}
        {tela === "mensagens" ? <TelaMensagens onAbrir={() => setTela("publica")} /> : null}
        {tela === "publica" ? <PublicPage /> : null}
        {tela === "scanner" ? <TelaScanner /> : null}
        {tela === "painel" ? <TelaPainel /> : null}
      </div>
      <Toasts compact />
      <Cursor tipo="toque" />
    </div>
  );
}

function BarraStatus() {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between bg-panelStrong px-7 pt-1 text-[13px] font-semibold text-ink">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal size={14} aria-hidden="true" />
        <Wifi size={14} aria-hidden="true" />
        <BatteryFull size={18} aria-hidden="true" />
      </span>
    </div>
  );
}

function Topo({ titulo, sub }: { titulo: string; sub?: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-line px-4 py-3">
      <img src="./logo/logo.png" alt="" className="h-8 w-8 object-contain" />
      <div className="min-w-0">
        <strong className="block truncate text-[15px] text-ink">{titulo}</strong>
        {sub ? <span className="block truncate text-[11px] text-muted">{sub}</span> : null}
      </div>
    </header>
  );
}

function TelaGestor() {
  const formacoes = useFormacoes();
  const { state } = useStore();
  const aviso = state.recente?.kind === "formacao" ? formacoes.find((f) => f.id === state.recente?.id) : null;

  return (
    <div>
      <Topo titulo="Credencia" sub="Equipe de eventos · Rede" />
      {aviso ? (
        <div className="surge mx-3 mt-3 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-3">
          <Bell size={18} className="mt-0.5 text-accent" aria-hidden="true" />
          <div className="text-xs leading-5">
            <strong className="block text-ink">Formação publicada</strong>
            <span className="text-muted">{aviso.title} está com inscrições abertas.</span>
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-3 p-3">
        <span className="field-label px-1 pt-1">Minhas formações</span>
        {formacoes.map((f) => {
          const nova = state.recente?.kind === "formacao" && state.recente.id === f.id;
          return (
            <article key={f.id} className={`overflow-hidden rounded-2xl border border-line bg-panel ${nova ? "surge ring-2 ring-accent/70" : ""}`}>
              <div className="flex gap-3 p-3">
                <img src={f.cover} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${statusTone[f.status]}`}>{f.status}</span>
                  <strong className="mt-1 block text-sm leading-tight text-ink">{f.title}</strong>
                  <span className="text-[11px] text-muted">{f.period}</span>
                </div>
              </div>
              <div className="px-3 pb-3">
                <div className="h-1.5 rounded-full bg-muted/20">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, percent(f.registered, f.seats))}%` }} />
                </div>
                <span className="mt-1 block text-[11px] text-muted">{formatNumber(f.registered)} de {formatNumber(f.seats)} vagas</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TelaMensagens({ onAbrir }: { onAbrir: () => void }) {
  const { state } = useStore();
  const formacao = useFormacoes().find((f) => f.id === MAIN_FORMACAO_ID);

  return (
    <div className="flex min-h-full flex-col bg-[#e9eef6]">
      <header className="flex items-center gap-3 border-b border-line bg-panelStrong px-3 py-3">
        <ChevronLeft size={20} className="text-accent" aria-hidden="true" />
        <span className="grid grid-cols-1 h-9 w-9 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent">RF</span>
        <div>
          <strong className="block text-sm text-ink">Rede de Formação</strong>
          <span className="text-[11px] text-muted">Comunicados oficiais</span>
        </div>
      </header>
      <div className="flex-1 space-y-3 p-3">
        <span className="mx-auto block w-fit rounded-full bg-white/80 px-3 py-1 text-[10px] text-muted">Hoje</span>
        <Bolha hora="08:02">Bom dia, equipe! O calendário de formações do semestre já está no portal.</Bolha>
        <Bolha hora="08:05">Fiquem atentos: as próximas inscrições serão feitas só pelo link oficial.</Bolha>
        {state.campanhas > 0 && formacao ? (
          <div className="surge">
            <Bolha hora="09:41">
              <button type="button" data-tour="link-inscricao" className="mb-2 block w-full overflow-hidden rounded-xl border border-line bg-[#0b1220] text-left" onClick={onAbrir}>
                <img src={formacao.cover} alt="" className="h-24 w-full object-cover" />
                <span className="block p-2.5">
                  <strong className="block text-[13px] leading-tight text-white">Inscrições abertas · {formacao.title}</strong>
                  <span className="mt-1 block text-[11px] text-sky-200/80">credencia.exemplo/inscricao</span>
                </span>
              </button>
              Estão abertas as inscrições da {formacao.title}. São {formatNumber(formacao.seats)} vagas, garanta a sua pelo link.
            </Bolha>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Bolha({ hora, children }: { hora: string; children: ReactNode }) {
  return (
    <div className="max-w-[86%] rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[13px] leading-5 text-ink shadow">
      {children}
      <span className="mt-1 block text-right text-[10px] text-muted">{hora}</span>
    </div>
  );
}

function TelaScanner() {
  const { state, enviar } = useStore();
  const [fase, setFase] = useState<"pronto" | "lendo" | "lido" | "ok">("pronto");
  const marina = state.participants.find((p) => p.id === VITRINE_INSCRITA.id) ?? VITRINE_INSCRITA;
  const unidade = demoData.units.find((u) => u.id === marina.unitId)?.name;

  useEffect(() => {
    if (fase !== "lendo") return;
    const t = window.setTimeout(() => setFase("lido"), 2200);
    return () => window.clearTimeout(t);
  }, [fase]);

  function confirmar() {
    const total = state.participants.filter((p) => p.checkedIn).length;
    enviar({ type: "credenciar", participantId: marina.id, method: "QR code", at: horarioAgora(total) });
    setFase("ok");
  }

  return (
    <div className="flex min-h-full flex-col bg-black">
      <header className="flex items-center gap-3 px-4 py-3">
        <ScanLine size={20} className="text-accent" aria-hidden="true" />
        <div>
          <strong className="block text-sm text-white">Recepção · Check-in</strong>
          <span className="text-[11px] text-slate-400">Polo Aurora · Encontro 4</span>
        </div>
      </header>

      <div className="relative mx-5 mt-4 aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950">
        {fase === "pronto" ? (
          <div className="grid grid-cols-1 h-full place-items-center p-6 text-center">
            <div className="grid grid-cols-1 justify-items-center gap-3">
              <QrIcon size={44} className="text-slate-500" aria-hidden="true" />
              <span className="text-sm text-slate-300">Aponte a câmera para o ingresso do participante</span>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 grid grid-cols-1 place-items-center">
              <div className={`rounded-xl bg-white p-2 transition duration-500 ${fase === "lendo" ? "rotate-[-4deg] scale-90" : "scale-75 opacity-40"}`}>
                <QrCode value={marina.ticket} size={150} />
              </div>
            </div>
            {fase === "lendo" ? <span className="scan-linha absolute left-[12%] right-[12%] h-0.5 bg-accent shadow-[0_0_18px_4px_rgba(56,189,248,0.8)]" /> : null}
            {["left-4 top-4 border-l-4 border-t-4", "right-4 top-4 border-r-4 border-t-4", "left-4 bottom-4 border-b-4 border-l-4", "right-4 bottom-4 border-b-4 border-r-4"].map((c) => (
              <span key={c} className={`absolute h-10 w-10 rounded-md border-accent ${c}`} />
            ))}
          </>
        )}
      </div>

      <div className="mt-auto p-4">
        {fase === "pronto" ? (
          <button type="button" data-tour="ler-qr" className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-white" onClick={() => setFase("lendo")}>
            Ler ingresso
          </button>
        ) : null}
        {fase === "lendo" ? <p className="py-3 text-center text-sm text-slate-300">Lendo QR code…</p> : null}
        {fase === "lido" || fase === "ok" ? (
          <div className="surge rounded-2xl border border-line bg-panelStrong p-4">
            <div className="flex items-center gap-3">
              <span className="grid grid-cols-1 h-11 w-11 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">MD</span>
              <div className="min-w-0">
                <strong className="block text-[15px] text-ink">{marina.name}</strong>
                <span className="block text-xs text-muted">{marina.role} · {unidade}</span>
                <span className="text-[11px] text-muted">Ingresso {marina.ticket}</span>
              </div>
            </div>
            {fase === "lido" ? (
              <button type="button" data-tour="confirmar-credenciamento" className="mt-4 h-11 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white" onClick={confirmar}>
                Confirmar credenciamento
              </button>
            ) : (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-medium text-emerald-600">
                <CheckCircle2 size={18} aria-hidden="true" /> Credenciada · enviado ao painel
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TelaPainel() {
  const { state } = useStore();
  const inscritos = state.participants.filter((p) => p.registered);
  const credenciados = inscritos.filter((p) => p.checkedIn);
  const satisfacao = mean(state.evaluations.map(averageEvaluation));

  const serie = periodOptions
    .filter((o) => o.value !== "all")
    .map((o) => ({ dia: o.label.slice(0, 2), presenças: credenciados.filter((p) => p.checkedInAt?.startsWith(o.value)).length }));

  const polos = useMemo(() => {
    const unitHub = new Map(demoData.units.map((u) => [u.id, u.hubId]));
    return demoData.hubs
      .map((h) => {
        const doPolo = inscritos.filter((p) => unitHub.get(p.unitId) === h.id);
        return { nome: h.name, taxa: percent(doPolo.filter((p) => p.checkedIn).length, doPolo.length) };
      })
      .sort((a, b) => b.taxa - a.taxa);
  }, [inscritos]);

  const kpis = [
    { rotulo: "Inscritos", valor: formatNumber(inscritos.length) },
    { rotulo: "Credenciados", valor: formatNumber(credenciados.length) },
    { rotulo: "Presença", valor: formatPercent(percent(credenciados.length, inscritos.length)) },
    { rotulo: "Satisfação", valor: formatDecimal(satisfacao) },
  ];

  return (
    <div>
      <Topo titulo="Painel da formação" sub="Jornada Formativa Territorial 2026" />
      <div className="grid grid-cols-2 gap-2.5 p-3">
        {kpis.map((k) => (
          <div key={k.rotulo} className="rounded-2xl border border-line bg-panel p-3">
            <span className="field-label">{k.rotulo}</span>
            <strong className="mt-1.5 block text-2xl font-medium text-ink">{k.valor}</strong>
          </div>
        ))}
      </div>
      <div className="mx-3 rounded-2xl border border-line bg-panel p-3">
        <span className="field-label">Presenças por dia</span>
        <div className="mt-2 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serie} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="celFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dia" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="presenças" stroke="#22c55e" strokeWidth={2} fill="url(#celFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="m-3 rounded-2xl border border-line bg-panel p-3" data-tour="painel-polos">
        <span className="field-label">Presença por polo</span>
        <ul className="mt-2 grid grid-cols-1 gap-2.5">
          {polos.map((p) => (
            <li key={p.nome}>
              <div className="flex justify-between text-xs">
                <span className="text-ink">{p.nome}</span>
                <span className="text-muted">{formatPercent(p.taxa)}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted/20">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${p.taxa}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
