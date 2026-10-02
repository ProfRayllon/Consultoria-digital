import { BadgeCheck, Download, Mail, MessageSquareText, Search, Ticket, UserPlus, UsersRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterSelect } from "../components/FilterSelect";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { QrCode } from "../components/QrCode";
import { SegmentedControl } from "../components/SegmentedControl";
import { ALL_VALUE, downloadCsv, formatNumber, formatPercent, getUnitMaps, normalizeText, percent } from "../lib/analytics";
import { useStore } from "../state/store";
import type { Participant } from "../types";

type Filtro = "todos" | "pendentes" | "credenciados";

export function quando(iso: string | null) {
  if (!iso) return "-";
  const [data, hora] = iso.split("T");
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes} ${hora.slice(0, 5)}`;
}

export function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

const POR_PAGINA = 9;

export function InscricoesPage() {
  const { state, data } = useStore();
  const { unitById, hubById } = useMemo(() => getUnitMaps(data), [data]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [canal, setCanal] = useState(ALL_VALUE);
  const [pagina, setPagina] = useState(0);
  const [fichaId, setFichaId] = useState<string | null>(null);

  const inscritos = state.participants.filter((p) => p.registered);
  const credenciados = inscritos.filter((p) => p.checkedIn).length;
  const avaliaram = new Set(state.evaluations.map((e) => e.participantId));

  const linhas = useMemo(() => {
    const termo = normalizeText(busca);
    return inscritos.filter((p) => {
      if (filtro === "pendentes" && p.checkedIn) return false;
      if (filtro === "credenciados" && !p.checkedIn) return false;
      if (canal !== ALL_VALUE && p.channel !== canal) return false;
      if (!termo) return true;
      const unidade = unitById.get(p.unitId)?.name ?? "";
      return normalizeText(`${p.name} ${p.email} ${p.ticket} ${unidade}`).includes(termo);
    });
  }, [inscritos, busca, filtro, canal, unitById]);

  const totalPaginas = Math.max(1, Math.ceil(linhas.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const visiveis = linhas.slice(paginaAtual * POR_PAGINA, (paginaAtual + 1) * POR_PAGINA);
  const ficha = fichaId ? state.participants.find((p) => p.id === fichaId) ?? null : null;

  function exportar() {
    downloadCsv(
      "inscricoes.csv",
      ["Nome", "E-mail", "Ingresso", "Unidade", "Função", "Canal", "Inscrição", "Credenciamento"],
      linhas.map((p) => [p.name, p.email, p.ticket, unitById.get(p.unitId)?.name ?? "", p.role, p.channel, quando(p.registeredAt), quando(p.checkedInAt)]),
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Credenciamento"
        title="Inscrições"
        description="Base de inscritos da formação, com origem da inscrição, ingresso e histórico de cada pessoa — do convite à avaliação."
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Inscritos" value={formatNumber(inscritos.length)} detail="inscrições confirmadas" icon={UsersRound} tone="blue" trend="up" />
        <KpiCard label="Credenciados" value={formatNumber(credenciados)} detail={`${formatPercent(percent(credenciados, inscritos.length))} dos inscritos`} icon={BadgeCheck} tone="green" trend="up" />
        <KpiCard label="Pendentes" value={formatNumber(inscritos.length - credenciados)} detail="ainda sem credenciamento" icon={Ticket} tone="amber" trend="down" />
        <KpiCard label="Avaliaram" value={formatNumber(avaliaram.size)} detail={`${formatPercent(percent(avaliaram.size, credenciados))} dos presentes`} icon={MessageSquareText} tone="violet" trend="flat" />
      </section>

      <section className="panel p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid grid-cols-1 min-w-[240px] flex-1 gap-1.5">
            <span className="field-label">Buscar</span>
            <span className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                data-tour="busca-inscricoes"
                className="input pl-9"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(0);
                }}
                placeholder="Nome, e-mail, ingresso ou unidade"
              />
            </span>
          </label>
          <SegmentedControl
            label="Situação"
            value={filtro}
            onChange={(v) => {
              setFiltro(v);
              setPagina(0);
            }}
            options={[
              { value: "todos", label: "Todos" },
              { value: "pendentes", label: "Pendentes" },
              { value: "credenciados", label: "Credenciados" },
            ]}
          />
          <FilterSelect
            label="Canal"
            value={canal}
            onChange={(v) => {
              setCanal(v);
              setPagina(0);
            }}
            options={[{ value: ALL_VALUE, label: "Todos os canais" }, ...["WhatsApp", "E-mail", "Site", "Indicação"].map((c) => ({ value: c, label: c }))]}
          />
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm text-ink hover:bg-panelStrong" onClick={exportar}>
            <Download size={15} aria-hidden="true" /> CSV
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="py-2.5 pr-3 font-medium">Participante</th>
                <th className="py-2.5 pr-3 font-medium">Unidade</th>
                <th className="py-2.5 pr-3 font-medium">Função</th>
                <th className="py-2.5 pr-3 font-medium">Canal</th>
                <th className="py-2.5 pr-3 font-medium">Inscrição</th>
                <th className="py-2.5 font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((p, i) => {
                const nova = state.recente?.kind === "participante" && state.recente.id === p.id;
                const unidade = unitById.get(p.unitId);
                return (
                  <tr
                    key={p.id + (nova ? state.recente?.at : "")}
                    data-tour={i === 0 ? "linha-primeira" : `linha-${p.id}`}
                    className={`cursor-pointer border-b border-line/60 transition hover:bg-panelStrong/60 ${nova ? "linha-nova" : ""}`}
                    onClick={() => setFichaId(p.id)}
                  >
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="grid grid-cols-1 h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">{iniciais(p.name)}</span>
                        <div className="min-w-0">
                          <strong className="block truncate font-medium text-ink">
                            {p.name}
                            {nova ? <span className="ml-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">agora</span> : null}
                          </strong>
                          <span className="block truncate text-xs text-muted">{p.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="block text-ink">{unidade?.name}</span>
                      <span className="text-xs text-muted">{unidade ? hubById.get(unidade.hubId)?.name : ""}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-muted">{p.role}</td>
                    <td className="py-2.5 pr-3 text-muted">{p.channel}</td>
                    <td className="py-2.5 pr-3 text-muted">{quando(p.registeredAt)}</td>
                    <td className="py-2.5">
                      {p.checkedIn ? (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">Credenciado</span>
                      ) : (
                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-700">Inscrito</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>{formatNumber(linhas.length)} registros</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={paginaAtual === 0} className="h-8 rounded-lg border border-line px-3 disabled:opacity-40" onClick={() => setPagina(paginaAtual - 1)}>Anterior</button>
            <span>{paginaAtual + 1} / {totalPaginas}</span>
            <button type="button" disabled={paginaAtual >= totalPaginas - 1} className="h-8 rounded-lg border border-line px-3 disabled:opacity-40" onClick={() => setPagina(paginaAtual + 1)}>Próxima</button>
          </div>
        </div>
      </section>

      {ficha ? <Ficha participante={ficha} avaliou={avaliaram.has(ficha.id)} unidade={unitById.get(ficha.unitId)?.name ?? ""} onFechar={() => setFichaId(null)} /> : null}
    </div>
  );
}

function Ficha({ participante: p, avaliou, unidade, onFechar }: { participante: Participant; avaliou: boolean; unidade: string; onFechar: () => void }) {
  const eventos = [
    { icon: UserPlus, titulo: "Inscrição concluída", detalhe: `Pelo link de ${p.channel} · ${quando(p.registeredAt)}`, feito: true },
    { icon: Mail, titulo: "Ingresso enviado", detalhe: `E-mail com QR code ${p.ticket}`, feito: true },
    {
      icon: BadgeCheck,
      titulo: p.checkedIn ? "Credenciado" : "Aguardando credenciamento",
      detalhe: p.checkedIn ? `${p.checkInMethod ?? "QR code"} · ${quando(p.checkedInAt)}` : "Apresenta o QR code na chegada",
      feito: p.checkedIn,
    },
    { icon: MessageSquareText, titulo: avaliou ? "Avaliação respondida" : "Avaliação pendente", detalhe: avaliou ? "Formulário pós-encontro" : "Liberada após o encontro", feito: avaliou },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm" onClick={onFechar}>
      <aside className="surge flex h-full w-full max-w-[420px] flex-col border-l border-line bg-panelStrong" onClick={(e) => e.stopPropagation()} data-tour="ficha">
        <header className="flex items-start justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid grid-cols-1 h-12 w-12 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">{iniciais(p.name)}</span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{p.name}</h2>
              <span className="text-xs text-muted">{p.role} · {unidade}</span>
            </div>
          </div>
          <button type="button" className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-ink" onClick={onFechar} aria-label="Fechar ficha">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-4 rounded-xl border border-line bg-panel/70 p-3">
            <QrCode value={p.ticket} size={84} />
            <div className="text-xs leading-5 text-muted">
              <span className="field-label block">Ingresso</span>
              <strong className="block text-base text-ink">{p.ticket}</strong>
              {p.email}
            </div>
          </div>
          <div>
            <span className="field-label">Linha do tempo</span>
            <ol className="mt-3 grid grid-cols-1 gap-0">
              {eventos.map(({ icon: Icon, titulo, detalhe, feito }, i) => (
                <li key={titulo} className="relative grid grid-cols-[32px_1fr] gap-3 pb-5">
                  {i < eventos.length - 1 ? <span className="absolute left-[15px] top-8 h-[calc(100%-26px)] w-px bg-line" /> : null}
                  <span className={`grid h-8 w-8 place-items-center rounded-full border ${feito ? "border-accent/40 bg-accent/15 text-accent" : "border-line text-muted"}`}>
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <div className={feito ? "" : "opacity-60"}>
                    <strong className="block text-sm font-medium text-ink">{titulo}</strong>
                    <span className="text-xs text-muted">{detalhe}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}
