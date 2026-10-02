import { ChevronLeft, ChevronRight, Download, Search, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterSelect } from "../components/FilterSelect";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import type { DemoData, UnitStatus, UnitSummary, UnitType } from "../types";
import { ALL_VALUE, downloadCsv, formatDecimal, formatNumber, formatPercent, normalizeText } from "../lib/analytics";

interface UnitsPageProps {
  allData: DemoData;
  summaries: UnitSummary[];
}

const statusOptions: Array<{ value: string; label: string }> = [
  { value: ALL_VALUE, label: "Todos" },
  { value: "Ativa", label: "Ativa" },
  { value: "Inscrita sem presença", label: "Inscrita sem presença" },
  { value: "Lacuna", label: "Lacuna" },
];

const typeOptions: Array<{ value: string; label: string }> = [
  { value: ALL_VALUE, label: "Todos" },
  { value: "Integral", label: "Integral" },
  { value: "Técnica", label: "Técnica" },
  { value: "Urbana", label: "Urbana" },
  { value: "Rural", label: "Rural" },
  { value: "Híbrida", label: "Híbrida" },
];

export function UnitsPage({ allData, summaries }: UnitsPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL_VALUE);
  const [type, setType] = useState<string>(ALL_VALUE);
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);

  const regionById = useMemo(() => new Map(allData.regions.map((region) => [region.id, region.name])), [allData.regions]);
  const hubById = useMemo(() => new Map(allData.hubs.map((hub) => [hub.id, hub.name])), [allData.hubs]);

  const filtered = useMemo(() => {
    const query = normalizeText(search);
    return summaries.filter((unit) => {
      const statusMatch = status === ALL_VALUE || unit.status === status;
      const typeMatch = type === ALL_VALUE || unit.type === type;
      const queryMatch =
        !query ||
        [unit.name, unit.code, unit.municipality, regionById.get(unit.regionId), hubById.get(unit.hubId), unit.status, unit.type]
          .map(normalizeText)
          .some((value) => value.includes(query));
      return statusMatch && typeMatch && queryMatch;
    });
  }, [hubById, regionById, search, status, summaries, type]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);

  function exportRows() {
    downloadCsv(
      "orbit-unidades-demo.csv",
      ["Código", "Unidade", "Município", "Região", "Polo", "Tipo", "Status", "Previsto", "Inscritos", "Presenças", "Satisfação", "Eficiência"],
      filtered.map((unit) => [
        unit.code,
        unit.name,
        unit.municipality,
        regionById.get(unit.regionId) ?? "",
        hubById.get(unit.hubId) ?? "",
        unit.type,
        unit.status,
        unit.target,
        unit.registered,
        unit.checkedIn,
        formatDecimal(unit.satisfaction),
        unit.efficiencyScore,
      ]),
    );
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeader
          eyebrow="Unidades"
          title="Base operacional explorável"
          description="Tabela sintética com status, presença, avaliação, filtros e exportação para análise externa."
        />
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent px-4 text-sm font-medium text-white transition hover:bg-sky-300"
          onClick={exportRows}
        >
          <Download size={17} aria-hidden="true" />
          CSV
        </button>
      </div>

      <section className="panel p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <label className="grid grid-cols-1 min-w-0 flex-1 gap-1.5">
            <span className="field-label">Busca</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} aria-hidden="true" />
              <input
                className="focus-ring h-10 w-full rounded-lg border border-line bg-panel/75 pl-10 pr-3 text-sm font-normal text-ink placeholder:text-muted/65"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por unidade, código, município, região ou status"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-3">
            <FilterSelect label="Status" value={status} options={statusOptions} onChange={(value) => updateFilter(setStatus, value)} />
            <FilterSelect label="Tipo" value={type} options={typeOptions} onChange={(value) => updateFilter(setType, value)} />
            <FilterSelect
              label="Linhas"
              value={pageSize}
              options={[
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "40", label: "40" },
              ]}
              onChange={(value) => updateFilter(setPageSize, value)}
            />
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <Table2 size={18} className="text-accent" aria-hidden="true" />
            <h3 className="text-sm font-medium text-ink">Unidades filtradas</h3>
          </div>
          <span className="text-xs font-normal text-muted">{formatNumber(filtered.length)} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse">
            <thead>
              <tr className="border-b border-line bg-panelStrong/55 text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-muted">Código</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-muted">Unidade</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-muted">Território</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-muted">Tipo</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-muted">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.05em] text-muted">Previsto</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.05em] text-muted">Presenças</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.05em] text-muted">Satisfação</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.05em] text-muted">Score</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((unit) => (
                <tr key={unit.id} className="border-b border-line/80 transition hover:bg-panel/80">
                  <td className="px-4 py-3 text-sm font-normal text-muted">{unit.code}</td>
                  <td className="px-4 py-3">
                    <strong className="block text-sm font-medium text-ink">{unit.name}</strong>
                    <span className="text-xs text-muted">{unit.municipality}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-sm font-normal text-muted">{regionById.get(unit.regionId)}</span>
                    <span className="text-xs text-muted">{hubById.get(unit.hubId)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{unit.type as UnitType}</td>
                  <td className="px-4 py-3"><StatusBadge status={unit.status as UnitStatus} /></td>
                  <td className="px-4 py-3 text-right text-sm font-normal text-muted">{formatNumber(unit.target)}</td>
                  <td className="px-4 py-3 text-right text-sm font-normal text-muted">{formatNumber(unit.checkedIn)} <span className="text-xs text-muted">({formatPercent(unit.attendanceRate)})</span></td>
                  <td className="px-4 py-3 text-right text-sm font-normal text-muted">{formatDecimal(unit.satisfaction)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-accent">{unit.efficiencyScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-3 px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line bg-panel/75 text-muted transition hover:bg-panelStrong disabled:opacity-45"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line bg-panel/75 text-muted transition hover:bg-panelStrong disabled:opacity-45"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              title="Próxima página"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
