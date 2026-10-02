import { CalendarDays, Clock3, GraduationCap, MapPin, Megaphone, Plus, Send, UsersRound, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { MAIN_FORMACAO_ID, mainFormacao } from "../data/syntheticData";
import { formatNumber, formatPercent, normalizeText, percent } from "../lib/analytics";
import { modoVitrine } from "../lib/env";
import { navegar } from "../lib/router";
import { useFormacoes, useStore } from "../state/store";
import type { Formacao, FormacaoStatus } from "../types";

export const statusTone: Record<FormacaoStatus, string> = {
  Rascunho: "border-slate-200 bg-slate-50 text-slate-700",
  "Inscrições abertas": "border-sky-200 bg-sky-50 text-sky-700",
  "Em andamento": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Concluída: "border-violet-200 bg-violet-50 text-violet-700",
};

const capas = ["./formacao/pedagogica.jpg", "./formacao/organizacao.jpg", "./formacao/logistica.jpg"];

const vazio = {
  title: "",
  modality: "Presencial" as Formacao["modality"],
  period: "",
  workload: "",
  seats: "",
  place: "",
  audience: "",
  cover: capas[0],
};

export function FormacoesPage() {
  const formacoes = useFormacoes();
  const { state, enviar, toast } = useStore();
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(vazio);

  const ativas = formacoes.filter((f) => f.status === "Inscrições abertas" || f.status === "Em andamento");
  const vagas = ativas.reduce((sum, f) => sum + f.seats, 0);
  const inscritos = ativas.reduce((sum, f) => sum + f.registered, 0);

  function campo<K extends keyof typeof vazio>(key: K, value: (typeof vazio)[K]) {
    setForm((atual) => ({ ...atual, [key]: value }));
  }

  function publicar(status: FormacaoStatus) {
    const title = form.title.trim() || "Nova formação";
    // A formação principal da base é publicada pelo mesmo formulário na vitrine.
    const principal = modoVitrine !== null || normalizeText(title) === normalizeText(mainFormacao.title);
    const formacao: Formacao = {
      ...(principal ? mainFormacao : { registered: 0, checkedIn: 0 }),
      id: principal ? MAIN_FORMACAO_ID : `formacao-${Date.now()}`,
      title,
      status,
      modality: form.modality,
      period: form.period || "A definir",
      workload: Number(form.workload) || 8,
      seats: Number(form.seats) || 40,
      place: form.place || "A definir",
      audience: form.audience || "Profissionais da rede",
      cover: form.cover,
    } as Formacao;
    enviar({ type: "publicar", formacao });
    toast({
      tone: "success",
      title: status === "Rascunho" ? "Rascunho salvo" : "Inscrições abertas",
      detail: status === "Rascunho" ? title : `${title} já tem página pública e link de divulgação.`,
    });
    setAberto(false);
    setForm(vazio);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Cadastro"
          title="Formações"
          description="Carteira de formações da rede: cada uma nasce aqui, ganha página pública de inscrição e acompanha vagas, credenciamento e avaliação."
        />
        <button
          type="button"
          data-tour="nova-formacao"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(56,189,248,0.8)] transition hover:brightness-110"
          onClick={() => setAberto(true)}
        >
          <Plus size={16} aria-hidden="true" />
          Nova formação
        </button>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Formações ativas" value={formatNumber(ativas.length)} detail={`${formatNumber(formacoes.length)} na carteira`} icon={GraduationCap} tone="blue" trend="up" />
        <KpiCard label="Vagas ofertadas" value={formatNumber(vagas)} detail="nas formações ativas" icon={UsersRound} tone="violet" trend="flat" />
        <KpiCard label="Inscritos" value={formatNumber(inscritos)} detail={`${formatPercent(percent(inscritos, vagas))} de ocupação`} icon={Send} tone="green" trend="up" />
        <KpiCard label="Carga horária" value={`${formatNumber(ativas.reduce((s, f) => s + f.workload, 0))}h`} detail="em andamento ou com inscrições" icon={Clock3} tone="amber" trend="flat" />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {formacoes.map((f) => {
          const nova = state.recente?.kind === "formacao" && state.recente.id === f.id;
          const ocupacao = percent(f.registered, f.seats);
          return (
            <article
              key={f.id + (nova ? state.recente?.at : "")}
              data-tour={`formacao-${f.id}`}
              className={`panel overflow-hidden ${nova ? "surge ring-2 ring-accent/70" : ""}`}
            >
              <div className="relative h-32 overflow-hidden">
                <img src={f.cover} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
                <span className={`absolute left-3 top-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur ${statusTone[f.status]}`}>
                  {f.status}
                </span>
                <span className="absolute bottom-3 left-3 text-xs text-sky-100/85">{f.modality} · {f.workload}h</span>
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-base font-semibold leading-snug text-ink">{f.title}</h3>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-muted">
                  <span className="flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" />{f.period}</span>
                  <span className="flex items-center gap-2"><MapPin size={14} aria-hidden="true" />{f.place}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>{formatNumber(f.registered)} de {formatNumber(f.seats)} vagas</span>
                    <span>{formatPercent(ocupacao)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted/20">
                    <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${Math.min(100, ocupacao)}%` }} />
                  </div>
                </div>
                {f.id === MAIN_FORMACAO_ID ? (
                  <div className="flex gap-2 pt-1">
                    <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-ink hover:bg-panelStrong" onClick={() => navegar("divulgacao")}>
                      <Megaphone size={13} aria-hidden="true" /> Divulgar
                    </button>
                    <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-ink hover:bg-panelStrong" onClick={() => navegar("inscricoes")}>
                      <UsersRound size={13} aria-hidden="true" /> Inscrições
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      {aberto ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm" onClick={() => setAberto(false)}>
          <aside className="surge flex h-full w-full max-w-[460px] flex-col border-l border-line bg-panelStrong" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <span className="field-label text-accent">Cadastro</span>
                <h2 className="mt-1 text-lg font-semibold text-ink">Nova formação</h2>
              </div>
              <button type="button" className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-ink" onClick={() => setAberto(false)} aria-label="Fechar">
                <X size={16} aria-hidden="true" />
              </button>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" data-rolagem>
              <Campo label="Título">
                <input data-tour="f-titulo" className="input" value={form.title} onChange={(e) => campo("title", e.target.value)} placeholder="Ex.: Jornada de Práticas Pedagógicas" />
              </Campo>
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Modalidade">
                  <select data-tour="f-modalidade" className="input" value={form.modality} onChange={(e) => campo("modality", e.target.value as Formacao["modality"])}>
                    <option>Presencial</option>
                    <option>Híbrida</option>
                    <option>On-line</option>
                  </select>
                </Campo>
                <Campo label="Carga horária">
                  <input data-tour="f-carga" className="input" inputMode="numeric" value={form.workload} onChange={(e) => campo("workload", e.target.value)} placeholder="40" />
                </Campo>
              </div>
              <Campo label="Período">
                <input data-tour="f-periodo" className="input" value={form.period} onChange={(e) => campo("period", e.target.value)} placeholder="02 a 17 de abril" />
              </Campo>
              <div className="grid grid-cols-2 gap-3">
                <Campo label="Vagas">
                  <input data-tour="f-vagas" className="input" inputMode="numeric" value={form.seats} onChange={(e) => campo("seats", e.target.value)} placeholder="180" />
                </Campo>
                <Campo label="Local">
                  <input data-tour="f-local" className="input" value={form.place} onChange={(e) => campo("place", e.target.value)} placeholder="Polos regionais" />
                </Campo>
              </div>
              <Campo label="Público-alvo">
                <input data-tour="f-publico" className="input" value={form.audience} onChange={(e) => campo("audience", e.target.value)} placeholder="Gestores, coordenadores e professores" />
              </Campo>
              <Campo label="Capa da página pública">
                <div className="grid grid-cols-3 gap-2">
                  {capas.map((capa, i) => (
                    <button
                      key={capa}
                      type="button"
                      data-tour={`f-capa-${i}`}
                      className={`h-16 overflow-hidden rounded-lg border-2 transition ${form.cover === capa ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                      onClick={() => campo("cover", capa)}
                    >
                      <img src={capa} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </Campo>
            </div>
            <footer className="flex gap-2 border-t border-line px-5 py-4">
              <button type="button" className="h-10 flex-1 rounded-lg border border-line text-sm text-ink hover:bg-panel" onClick={() => publicar("Rascunho")}>
                Salvar rascunho
              </button>
              <button type="button" data-tour="f-publicar" className="h-10 flex-[1.4] rounded-lg bg-accent text-sm font-semibold text-white hover:brightness-110" onClick={() => publicar("Inscrições abertas")}>
                Publicar inscrições
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-1.5">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
