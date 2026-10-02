import { CalendarDays, Copy, ExternalLink, Mail, MapPin, MessageCircle, MousePointerClick, Send, UserCheck, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartPanel } from "../components/ChartPanel";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { QrCode } from "../components/QrCode";
import { MAIN_FORMACAO_ID, channelVisitRatio } from "../data/syntheticData";
import { formatNumber, formatPercent, percent, periodOptions } from "../lib/analytics";
import { urlPublica } from "../lib/env";
import { useFormacoes, useStore } from "../state/store";
import type { Channel } from "../types";

const tooltipStyle = {
  background: "rgb(var(--color-panel-strong))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: 8,
  color: "rgb(var(--color-ink))",
};

const canais: Channel[] = ["WhatsApp", "E-mail", "Site", "Indicação"];
const corCanal: Record<Channel, string> = {
  WhatsApp: "#22c55e",
  "E-mail": "#2563eb",
  Site: "#a78bfa",
  Indicação: "#f59e0b",
};

export function DivulgacaoPage() {
  const { state, enviar, toast } = useStore();
  const formacao = useFormacoes().find((f) => f.id === MAIN_FORMACAO_ID);
  const link = urlPublica();

  const inscritos = state.participants.filter((p) => p.registered);
  const credenciados = inscritos.filter((p) => p.checkedIn).length;
  const avaliacoes = state.evaluations.length;

  const porCanal = useMemo(
    () =>
      canais.map((canal) => {
        const n = inscritos.filter((p) => p.channel === canal).length;
        return { canal, inscritos: n, visitas: Math.round(n * channelVisitRatio[canal]) };
      }),
    [inscritos],
  );
  const visitas = porCanal.reduce((s, c) => s + c.visitas, 0);
  const iniciaram = Math.round(inscritos.length * 1.42);

  const funil = [
    { etapa: "Visitas à página", valor: visitas, icon: MousePointerClick },
    { etapa: "Iniciaram inscrição", valor: iniciaram, icon: Send },
    { etapa: "Inscrições concluídas", valor: inscritos.length, icon: UsersRound },
    { etapa: "Credenciados", valor: credenciados, icon: UserCheck },
  ];

  const porDia = periodOptions
    .filter((o) => o.value !== "all")
    .map((o) => ({ dia: o.label, inscrições: inscritos.filter((p) => p.registeredAt?.startsWith(o.value)).length }));

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Sem permissão de área de transferência (iframe): o aviso vale igual.
    }
    toast({ tone: "info", title: "Link copiado", detail: "Cole no material de divulgação ou nas redes." });
  }

  function disparar(canal: Channel, alcance: number) {
    enviar({ type: "campanha", channel: canal, reach: alcance });
    toast({ tone: "success", title: `Campanha enviada por ${canal}`, detail: `${formatNumber(alcance)} contatos da rede receberam o convite.` });
  }

  if (!formacao) {
    return <PageHeader eyebrow="Divulgação" title="Nenhuma formação publicada" description="Publique uma formação para gerar a página pública e o link de inscrição." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Divulgação"
        title={formacao.title}
        description="Página pública de inscrição, link rastreável por canal, QR code para material impresso e disparo de convites para a rede."
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Visitas à página" value={formatNumber(visitas)} detail={`${formatNumber(state.campanhas + 3)} campanhas enviadas`} icon={MousePointerClick} tone="blue" trend="up" />
        <KpiCard label="Inscrições" value={formatNumber(inscritos.length)} detail={`${formatPercent(percent(inscritos.length, visitas))} de conversão`} icon={UsersRound} tone="green" trend="up" />
        <KpiCard label="Ocupação" value={formatPercent(percent(inscritos.length, formacao.seats))} detail={`${formatNumber(formacao.seats)} vagas`} icon={CalendarDays} tone="violet" trend="up" />
        <KpiCard label="Avaliações" value={formatNumber(avaliacoes)} detail="respostas pós-encontro" icon={Send} tone="amber" trend="flat" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ChartPanel title="Página pública" subtitle="O que o profissional vê ao abrir o link">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
            <div className="overflow-hidden rounded-xl border border-line bg-panelStrong">
              <div className="relative h-36">
                <img src={formacao.cover} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-slate-950/10" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="field-label text-sky-200">Inscrições abertas</span>
                  <strong className="mt-1 block text-lg font-semibold leading-tight text-white">{formacao.title}</strong>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 p-4 text-xs text-muted">
                <span className="flex items-center gap-2"><CalendarDays size={14} aria-hidden="true" />{formacao.period} · {formacao.workload}h</span>
                <span className="flex items-center gap-2"><MapPin size={14} aria-hidden="true" />{formacao.place}</span>
                <span className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">Quero me inscrever</span>
              </div>
            </div>
            <div className="grid grid-cols-1 content-start justify-items-center gap-3 rounded-xl border border-line bg-panelStrong/60 p-4">
              <QrCode value={link} size={132} />
              <span className="text-center text-[11px] leading-4 text-muted">QR code para cartazes e materiais impressos</span>
              <div className="grid grid-cols-1 w-full gap-2">
                <button type="button" data-tour="copiar-link" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line text-xs text-ink hover:bg-panel" onClick={copiar}>
                  <Copy size={14} aria-hidden="true" /> Copiar link
                </button>
                <a href={link} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line text-xs text-ink hover:bg-panel">
                  <ExternalLink size={14} aria-hidden="true" /> Abrir página
                </a>
              </div>
            </div>
          </div>
        </ChartPanel>

        <ChartPanel title="Disparar convite" subtitle="Contatos segmentados por função e unidade">
          <div className="grid grid-cols-1 gap-3">
            {[
              { canal: "WhatsApp" as Channel, alcance: 214, icon: MessageCircle, texto: "Mensagem com link curto e cartão de pré-visualização." },
              { canal: "E-mail" as Channel, alcance: 386, icon: Mail, texto: "Convite institucional com botão de inscrição e QR code." },
            ].map(({ canal, alcance, icon: Icon, texto }) => (
              <div key={canal} className="flex items-center gap-3 rounded-xl border border-line bg-panelStrong/50 p-3">
                <div className="grid grid-cols-1 h-10 w-10 shrink-0 place-items-center rounded-lg border" style={{ borderColor: `${corCanal[canal]}55`, background: `${corCanal[canal]}18`, color: corCanal[canal] }}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-sm font-medium text-ink">{canal} · {formatNumber(alcance)} contatos</strong>
                  <span className="block text-xs leading-5 text-muted">{texto}</span>
                </div>
                <button
                  type="button"
                  data-tour={`enviar-${canal === "WhatsApp" ? "whatsapp" : "email"}`}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-white hover:brightness-110"
                  onClick={() => disparar(canal, alcance)}
                >
                  <Send size={13} aria-hidden="true" /> Enviar
                </button>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-line p-3 text-xs leading-5 text-muted">
              Cada canal recebe um link com parâmetro de origem. É assim que o funil ao lado sabe de onde veio cada inscrição.
            </div>
          </div>
        </ChartPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartPanel title="Funil de inscrição" subtitle="Da visita ao credenciamento">
          <div className="grid grid-cols-1 gap-3 pt-1" data-tour="funil">
            {funil.map(({ etapa, valor, icon: Icon }, i) => (
              <div key={etapa}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-ink"><Icon size={14} className="text-accent" aria-hidden="true" />{etapa}</span>
                  <span className="text-muted">
                    {formatNumber(valor)}
                    {i > 0 ? ` · ${formatPercent(percent(valor, funil[i - 1].valor))}` : ""}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 rounded-full bg-muted/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-[width] duration-700"
                    style={{ width: `${Math.max(4, percent(valor, funil[0].valor))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartPanel>

        <ChartPanel title="Inscrições por canal" subtitle="Origem rastreada pelo link">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porCanal} margin={{ left: -22, right: 8, top: 6, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="canal" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Bar dataKey="inscritos" radius={[6, 6, 0, 0]}>
                  {porCanal.map((c) => (
                    <Cell key={c.canal} fill={corCanal[c.canal]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Ritmo de inscrições" subtitle="Novas inscrições por dia">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={porDia} margin={{ left: -22, right: 8, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="divFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="inscrições" stroke="#2563eb" strokeWidth={2.4} fill="url(#divFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>
    </div>
  );
}
