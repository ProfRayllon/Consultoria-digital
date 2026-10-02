import { Activity, BadgeCheck, ClipboardList, Gauge, MessageSquareText, UsersRound } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "../components/ChartPanel";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { TrainingCarousel } from "../components/TrainingCarousel";
import type { DemoData, FilteredData, Hub, Region, UnitSummary } from "../types";
import {
  averageEvaluation,
  averageScores,
  formatDecimal,
  formatNumber,
  formatPercent,
  logisticKeys,
  mean,
  pedagogicalKeys,
  percent,
  periodOptions,
  scoreLabels,
} from "../lib/analytics";

interface OverviewPageProps {
  data: FilteredData;
  allData: DemoData;
  summaries: UnitSummary[];
}

const tooltipStyle = {
  background: "rgb(var(--color-panel-strong))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: 8,
  color: "rgb(var(--color-ink))",
};

function nameById<T extends { id: string; name: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row.name]));
}

export function OverviewPage({ data, allData, summaries }: OverviewPageProps) {
  const regionNames = nameById<Region>(allData.regions);
  const hubNames = nameById<Hub>(allData.hubs);
  const target = data.units.reduce((sum, unit) => sum + unit.target, 0);
  const registered = data.participants.filter((participant) => participant.registered).length;
  const checkedIn = data.participants.filter((participant) => participant.checkedIn).length;
  const responseCount = data.evaluations.length;
  const averageSatisfaction = mean(data.evaluations.map(averageEvaluation));
  const positiveRate = percent(data.evaluations.filter((evaluation) => evaluation.sentiment === "positivo").length, responseCount);
  const activeUnits = summaries.filter((unit) => unit.status === "Ativa").length;
  const efficiency = percent(activeUnits, Math.max(summaries.length, 1));

  const timelineData = periodOptions
    .filter((option) => option.value !== "all")
    .map((option) => ({
      day: option.label,
      inscritos: data.participants.filter((participant) => participant.registeredAt?.startsWith(option.value)).length,
      presenças: data.participants.filter((participant) => participant.checkedInAt?.startsWith(option.value)).length,
      avaliações: data.evaluations.filter((evaluation) => evaluation.submittedAt.startsWith(option.value)).length,
    }));

  const regionData = allData.regions.map((region) => {
    const regionUnits = summaries.filter((unit) => unit.regionId === region.id);
    const regionTarget = regionUnits.reduce((sum, unit) => sum + unit.target, 0);
    const regionPresence = regionUnits.reduce((sum, unit) => sum + unit.checkedIn, 0);
    return {
      name: region.shortName,
      previsto: regionTarget,
      presenças: regionPresence,
      eficiência: percent(regionUnits.filter((unit) => unit.status === "Ativa").length, Math.max(regionUnits.length, 1)),
    };
  });

  const dimensionData = Object.entries(scoreLabels).map(([key, label]) => ({
    dimension: label,
    score: Number((mean(data.evaluations.map((evaluation) => evaluation.scores[key as keyof typeof evaluation.scores])) ?? 0).toFixed(1)),
  }));

  const priorityUnits = [...summaries]
    .sort((a, b) => a.efficiencyScore - b.efficiencyScore || b.target - a.target)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Análise"
        title="Visão geral da formação"
        description="Leitura consolidada do ciclo: adesão, presença, satisfação e eficiência por território, alimentada pelas inscrições e pelo credenciamento."
      />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <KpiCard label="Público previsto" value={formatNumber(target)} detail={`${formatPercent(percent(registered, target))} inscritos`} icon={UsersRound} tone="blue" trend="up" />
        <KpiCard label="Credenciados" value={formatNumber(checkedIn)} detail={`${formatPercent(percent(checkedIn, registered))} dos inscritos`} icon={BadgeCheck} tone="green" trend="up" />
        <KpiCard label="Avaliações" value={formatNumber(responseCount)} detail={`${formatPercent(percent(responseCount, checkedIn))} de retorno`} icon={MessageSquareText} tone="violet" trend="flat" />
        <KpiCard label="Satisfação média" value={formatDecimal(averageSatisfaction)} detail={`${formatPercent(positiveRate)} positivas`} icon={Activity} tone="amber" trend="flat" />
        <KpiCard label="Eficiência" value={formatPercent(efficiency)} detail={`${formatNumber(activeUnits)} unidades ativas`} icon={Gauge} tone="green" trend="up" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <ChartPanel title="Evolução operacional" subtitle="Inscrições, presenças e avaliações por dia">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="presenceFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#2563eb", strokeOpacity: 0.35 }} />
                <Area type="monotone" dataKey="inscritos" stroke="#2563eb" fill="url(#presenceFill)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="presenças" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="avaliações" stroke="#a78bfa" strokeWidth={2.2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <TrainingCarousel />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartPanel title="Eficiência por território" subtitle="Presenças e unidades ativas por região fictícia">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ left: -18, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="presenças" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="previsto" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Qualidade percebida" subtitle={`Pedagógico ${formatDecimal(averageScores(data.evaluations, pedagogicalKeys))} / Logístico ${formatDecimal(averageScores(data.evaluations, logisticKeys))}`}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionData} outerRadius="72%">
                <PolarGrid stroke="rgba(148,163,184,0.16)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "#475569", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="panel p-4">
        <header className="mb-3 flex items-center gap-2">
          <ClipboardList size={18} className="text-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-ink">Fila de atenção</h3>
        </header>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-5">
          {priorityUnits.map((unit) => (
            <article key={unit.id} className="rounded-lg border border-line bg-panelStrong/45 p-3">
              <span className="field-label">{regionNames.get(unit.regionId)} - {hubNames.get(unit.hubId)}</span>
              <strong className="mt-2 block truncate text-sm font-medium text-ink">{unit.name}</strong>
              <div className="mt-3 h-2 rounded-full bg-muted/20">
                <div className="h-full rounded-full bg-rose-400" style={{ width: `${Math.max(8, unit.efficiencyScore)}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted">{unit.efficiencyScore}/100 de eficiência</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
