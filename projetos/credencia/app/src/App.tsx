import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardCheck,
  ExternalLink,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  ScanLine,
  SearchCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BrandLockup } from "./components/BrandLockup";
import { FilterSelect } from "./components/FilterSelect";
import { Toasts } from "./components/Toasts";
import { MAIN_FORMACAO_ID } from "./data/syntheticData";
import { ALL_VALUE, buildUnitSummaries, filterDemoData, periodOptions } from "./lib/analytics";
import { modoVitrine, urlPublica } from "./lib/env";
import { navegar, useRota } from "./lib/router";
import { AccreditationPage } from "./pages/AccreditationPage";
import { CheckinPage } from "./pages/CheckinPage";
import { DivulgacaoPage } from "./pages/DivulgacaoPage";
import { EfficiencyPage } from "./pages/EfficiencyPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { FormacoesPage } from "./pages/FormacoesPage";
import { InscricoesPage } from "./pages/InscricoesPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PublicPage } from "./pages/PublicPage";
import { UnitsPage } from "./pages/UnitsPage";
import { useFormacoes, useStore } from "./state/store";
import type { DashboardFilters, PageId } from "./types";
import { Celular } from "./vitrine/celular/Celular";
import { Cursor } from "./vitrine/Cursor";
import { useVitrine } from "./vitrine/useVitrine";

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

// A navegação segue o ciclo de vida de uma formação.
const navGroups: Array<{ titulo: string; itens: NavItem[] }> = [
  { titulo: "Cadastro", itens: [{ id: "formacoes", label: "Formações", icon: GraduationCap }] },
  { titulo: "Divulgação", itens: [{ id: "divulgacao", label: "Página e campanhas", icon: Megaphone }] },
  {
    titulo: "Credenciamento",
    itens: [
      { id: "inscricoes", label: "Inscrições", icon: UsersRound },
      { id: "checkin", label: "Check-in", icon: ScanLine },
    ],
  },
  {
    titulo: "Análise",
    itens: [
      { id: "overview", label: "Visão geral", icon: LayoutDashboard },
      { id: "accreditation", label: "Presença", icon: ClipboardCheck },
      { id: "evaluation", label: "Avaliação", icon: BarChart3 },
      { id: "efficiency", label: "Eficiência", icon: Gauge },
      { id: "units", label: "Unidades", icon: SearchCheck },
    ],
  },
];

const paginasDeAnalise: PageId[] = ["overview", "accreditation", "evaluation", "efficiency", "units"];

const initialFilters: DashboardFilters = {
  period: ALL_VALUE,
  regionId: ALL_VALUE,
  hubId: ALL_VALUE,
};

function App() {
  if (modoVitrine === "celular") return <Celular />;
  return <AppPrincipal />;
}

function AppPrincipal() {
  const rota = useRota();
  if (rota === "publica") {
    return (
      <>
        <PublicPage />
        <Toasts compact />
      </>
    );
  }
  return <Crm activePage={rota} />;
}

function Crm({ activePage }: { activePage: PageId }) {
  const { data, state } = useStore();
  const formacao = useFormacoes().find((f) => f.id === MAIN_FORMACAO_ID);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useVitrine();

  const filteredData = useMemo(() => filterDemoData(data, filters), [data, filters]);
  const summaries = useMemo(
    () => buildUnitSummaries(filteredData.units, filteredData.participants, filteredData.evaluations),
    [filteredData.evaluations, filteredData.participants, filteredData.units],
  );

  const regionOptions = useMemo(
    () => [
      { value: ALL_VALUE, label: "Todas as regiões" },
      ...data.regions.map((region) => ({ value: region.id, label: region.name })),
    ],
    [data.regions],
  );

  const hubOptions = useMemo(() => {
    const scopedHubs = filters.regionId === ALL_VALUE
      ? data.hubs
      : data.hubs.filter((hub) => hub.regionId === filters.regionId);
    return [
      { value: ALL_VALUE, label: "Todos os polos" },
      ...scopedHubs.map((hub) => ({ value: hub.id, label: hub.name })),
    ];
  }, [data.hubs, filters.regionId]);

  function updateFilter(key: keyof DashboardFilters, value: string) {
    setFilters((current) => {
      if (key === "regionId") {
        const nextHub = value === ALL_VALUE || data.hubs.some((hub) => hub.id === current.hubId && hub.regionId === value)
          ? current.hubId
          : ALL_VALUE;
        return { ...current, regionId: value, hubId: nextHub };
      }
      return { ...current, [key]: value };
    });
  }

  const page = {
    formacoes: <FormacoesPage />,
    divulgacao: <DivulgacaoPage />,
    inscricoes: <InscricoesPage />,
    checkin: <CheckinPage />,
    overview: <OverviewPage data={filteredData} allData={data} summaries={summaries} />,
    accreditation: <AccreditationPage data={filteredData} allData={data} />,
    evaluation: <EvaluationPage data={filteredData} allData={data} />,
    efficiency: <EfficiencyPage allData={data} summaries={summaries} />,
    units: <UnitsPage allData={data} summaries={summaries} />,
  }[activePage];

  const analise = paginasDeAnalise.includes(activePage);

  return (
    <div className="min-h-screen bg-transparent text-ink">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`tema-escuro border-b border-line bg-[#0b1220] px-3 py-3 backdrop-blur transition-[width] duration-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r ${
            sidebarCollapsed ? "lg:w-[76px]" : "lg:w-[272px]"
          }`}
        >
          <div className={`grid gap-2 py-2 ${sidebarCollapsed ? "justify-items-center px-0" : "grid-cols-[1fr_auto] items-center px-2"}`}>
            <BrandLockup compact={sidebarCollapsed} />
            <button
              type="button"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-line bg-panel/75 text-muted transition hover:bg-panelStrong hover:text-ink lg:grid"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
              aria-expanded={!sidebarCollapsed}
              title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={17} aria-hidden="true" /> : <PanelLeftClose size={17} aria-hidden="true" />}
            </button>
          </div>

          <nav className="sem-barra mt-3 flex gap-1 overflow-x-auto lg:mt-4 lg:grid lg:gap-0 lg:overflow-visible" aria-label="Navegação principal">
            {navGroups.map((grupo) => (
              <div key={grupo.titulo} className="flex gap-1 lg:mb-3 lg:grid">
                {!sidebarCollapsed ? <span className="field-label hidden px-3 pb-1 pt-2 text-[0.62rem] lg:block">{grupo.titulo}</span> : null}
                {grupo.itens.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-tour={`nav-${item.id}`}
                      className={`flex h-10 shrink-0 items-center rounded-lg text-sm font-medium transition ${
                        active ? "nav-active" : "text-muted hover:bg-panel hover:text-ink"
                      } ${sidebarCollapsed ? "justify-center px-0 lg:w-full" : "gap-3 px-3 text-left"}`}
                      onClick={() => navegar(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={17} aria-hidden="true" />
                      {!sidebarCollapsed ? <span className="whitespace-nowrap">{item.label}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-line bg-panelStrong/90 px-4 py-3 backdrop-blur xl:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <span className="field-label text-accent">Eventos · credenciamento · análise</span>
                <h2 className="mt-1 text-lg font-medium leading-snug text-ink sm:truncate">
                  {formacao ? formacao.title : "Nenhuma formação publicada"}
                  {formacao ? <span className="block text-xs font-normal text-accent sm:ml-3 sm:inline sm:align-middle">● {formacao.status}</span> : null}
                </h2>
              </div>
              {analise ? (
                <div className="flex flex-wrap items-end gap-3">
                  <FilterSelect label="Período" value={filters.period} options={periodOptions} onChange={(value) => updateFilter("period", value)} />
                  <FilterSelect label="Região" value={filters.regionId} options={regionOptions} onChange={(value) => updateFilter("regionId", value)} />
                  <FilterSelect label="Polo" value={filters.hubId} options={hubOptions} onChange={(value) => updateFilter("hubId", value)} />
                  <button
                    type="button"
                    className="grid grid-cols-1 h-9 w-9 place-items-center rounded-lg border border-line bg-panel/75 text-muted transition hover:bg-panelStrong hover:text-ink"
                    onClick={() => setFilters(initialFilters)}
                    title="Limpar filtros"
                    aria-label="Limpar filtros"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                  </button>
                </div>
              ) : formacao ? (
                <a
                  href={urlPublica()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-fit items-center gap-2 rounded-lg border border-line bg-panel/75 px-3 text-sm text-ink transition hover:bg-panelStrong"
                >
                  <ExternalLink size={15} aria-hidden="true" /> Página pública
                </a>
              ) : null}
            </div>
          </header>

          <div className="px-4 py-5 xl:px-6" key={state.rodada}>{page}</div>
        </main>
      </div>
      <Toasts />
      {modoVitrine ? <Cursor tipo="seta" /> : null}
    </div>
  );
}

export default App;
