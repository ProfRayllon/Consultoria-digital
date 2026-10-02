import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, UsersRound } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { QrCode } from "../components/QrCode";
import { MAIN_FORMACAO_ID, demoData, mainFormacao } from "../data/syntheticData";
import { formatNumber } from "../lib/analytics";
import { modoVitrine } from "../lib/env";
import { VITRINE_INSCRITA, novoParticipante, useFormacoes, useStore } from "../state/store";
import type { Participant, Role } from "../types";

const funcoes: Role[] = ["Gestor(a)", "Coordenador(a)", "Professor(a)", "Articulador(a)"];

const programa = [
  { dia: "02 abr", tema: "Abertura e diagnóstico da rede" },
  { dia: "09 abr", tema: "Práticas de mediação em sala" },
  { dia: "16 abr", tema: "Avaliação formativa e devolutivas" },
  { dia: "17 abr", tema: "Plano de ação por unidade" },
];

// Página que o profissional abre pelo link de divulgação. Pensada para o
// celular: informação → formulário curto → ingresso com QR code.
export function PublicPage() {
  const { enviar } = useStore();
  const formacao = useFormacoes().find((f) => f.id === MAIN_FORMACAO_ID) ?? mainFormacao;
  const [etapa, setEtapa] = useState<"info" | "form" | "ok">("info");
  const [form, setForm] = useState({ name: "", email: "", role: "" as Role | "", unitId: "", aceite: false });
  const [inscrito, setInscrito] = useState<Participant | null>(null);
  const vagasRestantes = Math.max(0, formacao.seats - formacao.registered);
  const pronto = form.name.trim() && form.email.includes("@") && form.role && form.unitId && form.aceite;

  function confirmar() {
    if (!pronto) return;
    const base = { name: form.name.trim(), email: form.email.trim(), role: form.role as Role, unitId: form.unitId };
    const participante = modoVitrine
      ? { ...VITRINE_INSCRITA, ...base }
      : novoParticipante({ ...base, channel: "Site" });
    enviar({ type: "inscrever", participant: participante });
    setInscrito(participante);
    setEtapa("ok");
  }

  return (
    <div className="min-h-screen bg-[#eef3fb]">
      <div className="mx-auto min-h-screen max-w-[480px] bg-panelStrong sm:border-x sm:border-line">
        {etapa === "info" ? (
          <>
            <div className="relative h-56">
              <img src={formacao.cover} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/5" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-slate-950/55 px-2.5 py-1 backdrop-blur">
                <img src="./logo/logo.png" alt="" className="h-5 w-5 object-contain" />
                <span className="text-[11px] font-medium text-white">Credencia</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">Inscrições abertas</span>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-white">{formacao.title}</h1>
              </div>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <Info icon={CalendarDays} titulo="Período" valor={formacao.period} />
                <Info icon={Clock3} titulo="Carga horária" valor={`${formacao.workload} horas`} />
                <Info icon={MapPin} titulo="Local" valor={formacao.place} />
                <Info icon={UsersRound} titulo="Vagas" valor={`${formatNumber(vagasRestantes)} restantes`} />
              </div>
              <p className="text-sm leading-6 text-muted">
                Formação presencial para {formacao.audience.toLowerCase()}. Quatro encontros com certificação ao final, mediante presença registrada no credenciamento.
              </p>
              <div>
                <span className="field-label">Programação</span>
                <ul className="mt-2 grid grid-cols-1 gap-2">
                  {programa.map((p) => (
                    <li key={p.dia} className="flex items-center gap-3 rounded-lg border border-line bg-panel/60 px-3 py-2.5">
                      <span className="w-12 shrink-0 text-xs font-semibold text-accent">{p.dia}</span>
                      <span className="text-sm text-ink">{p.tema}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-line bg-panelStrong/95 p-4 backdrop-blur">
              <button type="button" data-tour="quero-inscrever" className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-white" onClick={() => setEtapa("form")}>
                Quero me inscrever
              </button>
            </div>
          </>
        ) : null}

        {etapa === "form" ? (
          <div className="flex min-h-screen flex-col">
            <header className="flex items-center gap-3 border-b border-line px-4 py-4">
              <button type="button" className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line text-muted" onClick={() => setEtapa("info")} aria-label="Voltar">
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <span className="field-label text-accent">Inscrição</span>
                <strong className="block truncate text-sm text-ink">{formacao.title}</strong>
              </div>
            </header>
            <div className="flex-1 space-y-4 p-5">
              <Campo label="Nome completo">
                <input data-tour="p-nome" className="input h-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como no documento" autoComplete="name" />
              </Campo>
              <Campo label="E-mail">
                <input data-tour="p-email" className="input h-11" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@rede.exemplo" autoComplete="email" />
              </Campo>
              <Campo label="Função">
                <select data-tour="p-funcao" className="input h-11" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                  <option value="">Selecione</option>
                  {funcoes.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Unidade">
                <select data-tour="p-unidade" className="input h-11" value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}>
                  <option value="">Selecione</option>
                  {demoData.units.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </Campo>
              <label className="flex items-start gap-3 rounded-lg border border-line bg-panel/60 p-3 text-xs leading-5 text-muted">
                <input data-tour="p-aceite" type="checkbox" className="mt-0.5 h-4 w-4 accent-sky-400" checked={form.aceite} onChange={(e) => setForm({ ...form, aceite: e.target.checked })} />
                Autorizo o uso dos meus dados para a gestão desta formação e a emissão do certificado.
              </label>
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                data-tour="p-confirmar"
                disabled={!pronto}
                className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-white transition disabled:bg-muted/25 disabled:text-muted"
                onClick={confirmar}
              >
                Confirmar inscrição
              </button>
            </div>
          </div>
        ) : null}

        {etapa === "ok" && inscrito ? (
          <div className="surge flex min-h-screen flex-col items-center px-6 pb-8 pt-12 text-center" data-tour="ingresso">
            <CheckCircle2 size={44} className="text-emerald-600" aria-hidden="true" />
            <h1 className="mt-3 text-xl font-bold text-ink">Inscrição confirmada!</h1>
            <p className="mt-1 text-sm text-muted">Apresente este QR code na recepção do encontro.</p>
            <div className="mt-6 w-full rounded-2xl border border-line bg-panel p-5">
              <div className="grid grid-cols-1 justify-items-center">
                <QrCode value={inscrito.ticket} size={168} />
              </div>
              <strong className="mt-4 block text-lg tracking-wider text-ink">{inscrito.ticket}</strong>
              <span className="block text-sm text-ink">{inscrito.name}</span>
              <span className="block text-xs text-muted">{inscrito.role} · {demoData.units.find((u) => u.id === inscrito.unitId)?.name}</span>
              <div className="mt-4 border-t border-dashed border-line pt-3 text-xs text-muted">
                {formacao.title}
                <br />
                {formacao.period} · {formacao.place}
              </div>
            </div>
            <span className="mt-4 text-xs text-muted">Uma cópia foi enviada para {inscrito.email}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Info({ icon: Icon, titulo, valor }: { icon: typeof CalendarDays; titulo: string; valor: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel/60 p-3">
      <span className="flex items-center gap-1.5 text-muted"><Icon size={13} aria-hidden="true" />{titulo}</span>
      <strong className="mt-1 block font-medium text-ink">{valor}</strong>
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
