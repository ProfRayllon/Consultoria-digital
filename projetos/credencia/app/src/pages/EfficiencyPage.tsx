import { BadgeCheck, Building2, Gauge, ListChecks, Radar, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { ChartPanel } from "../components/ChartPanel";
import { FilterSelect } from "../components/FilterSelect";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import type { DemoData, UnitSummary } from "../types";
import { ALL_VALUE, formatDecimal, formatNumber, formatPercent, mean, percent } from "../lib/analytics";

interface EfficiencyPageProps {
  allData: DemoData;
  summaries: UnitSummary[];
}

const tooltipStyle = {
  background: "rgb(var(--color-panel-strong))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: 8,
  color: "rgb(var(--color-ink))",
};

const statusOptions = [
  { value: ALL_VALUE, label: "Todos" },
  { value: "Ativa", label: "Ativa" },
  { value: "Inscrita sem presença", label: "Inscrita sem presença" },
  { value: "Lacuna", label: "Lacuna" },
];

export function EfficiencyPage({ allData, summaries }: EfficiencyPageProps) {
  const [status, setStatus] = useState<string>(ALL_VALUE);

  const visible = useMemo(() => {
    return summaries.filter((unit) => status === ALL_VALUE || unit.status === status);
  }, [summaries, status]);

  const total = visible.length;
  const active = visible.filter((unit) => unit.status === "Ativa").length;
  const pending = visible.filter((unit) => unit.status === "Inscrita sem presença").length;
  const gaps = visible.filter((unit) => unit.status === "Lacuna").length;
  const averageEfficiency = mean(visible.map((unit) => unit.efficiencyScore));

  const regionData = allData.regions.map((region) => {
    const rows = visible.filter((unit) => unit.regionId === region.id);
    return {
      name: region.shortName,
      ativas: rows.filter((unit) => unit.status === "Ativa").length,
      pendentes: rows.filter((unit) => unit.status === "Inscrita sem presença").length,
      lacunas: rows.filter((unit) => unit.status === "Lacuna").length,
      eficiência: Number(percent(rows.filter((unit) => unit.status === "Ativa").length, Math.max(rows.length, 1)).toFixed(1)),
    };
  });

  const scatterData = visible
    .filter((unit) => unit.status === "Ativa")
    .map((unit) => ({
      name: unit.name,
      attendance: Number(unit.attendanceRate.toFixed(1)),
      satisfaction: Number((unit.satisfaction ?? 0).toFixed(1)),
      target: unit.target,
      score: unit.efficiencyScore,
    }));

  const topUnits = [...visible].sort((a, b) => b.efficiencyScore - a.efficiencyScore).slice(0, 6);
  const attentionUnits = [...visible].sort((a, b) => a.efficiencyScore - b.efficiencyScore || b.target - a.target).slice(0, 6);

  const hubRows = allData.hubs
    .map((hub) => {
      const rows = visible.filter((unit) => unit.hubId === hub.id);
      return {
        name: hub.name,
        units: rows.length,
        active: rows.filter((unit) => unit.status === "Ativa").length,
        score: mean(rows.map((unit) => unit.efficiencyScore)) ?? 0,
      };
    })
    .filter((hub) => hub.units > 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeader
          eyebrow="Eficiência operacional"
          title="Cruzamento de unidades e participação"
          description="Classificação das unidades previstas a partir de inscrição, presença, resposta de avaliação e nota consolidada."
        />
        <FilterSelect label="Status da unidade" value={status} options={statusOptions} onChange={setStatus} />
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <KpiCard label="Unidades" value={formatNumber(total)} detail="base sintética filtrada" icon={Building2} tone="blue" />
        <KpiCard label="Ativas" value={formatNumber(active)} detail={`${formatPercent(percent(active, total))} da base`} icon={BadgeCheck} tone="green" trend="up" />
        <KpiCard label="Sem presença" value={formatNumber(pending)} detail={`${formatPercent(percent(pending, total))} da base`} icon={ListChecks} tone="amber" trend="flat" />
        <KpiCard label="Lacunas" value={formatNumber(gaps)} detail={`${formatPercent(percent(gaps, total))} da base`} icon={TriangleAlert} tone="rose" trend="down" />
        <KpiCard label="Score médio" value={formatDecimal(averageEfficiency)} detail="0 a 100 pontos" icon={Gauge} tone="violet" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ChartPanel title="Status por região" subtitle="Ativas, pendentes, lacunas e eficiência">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={regionData} margin={{ left: -16, right: 18, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#2563eb", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar yAxisId="left" dataKey="ativas" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="pendentes" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="lacunas" stackId="a" fill="#fb7185" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="eficiência" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Quadrante operacional" subtitle="Presença comparada à satisfação média">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: -14, right: 18, top: 12, bottom: 6 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="attendance" name="Presença" unit="%" domain={[0, 120]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="satisfaction" name="Satisfação" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="target" range={[64, 240]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
                <Scatter data={scatterData} fill="#2563eb">
                  {scatterData.map((entry) => (
                    <Cell key={entry.name} fill={entry.score >= 88 ? "#22c55e" : entry.score >= 74 ? "#2563eb" : "#f59e0b"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartPanel title="Ranking de maior eficiência" subtitle="Unidades com melhor combinação de presença e avaliação">
          <div className="space-y-2">
            {topUnits.map((unit, index) => (
              <article key={unit.id} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-lg border border-line bg-panelStrong/45 p-3">
                <span className="grid grid-cols-1 h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-sm font-medium text-emerald-600">{index + 1}</span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-medium text-ink">{unit.name}</strong>
                  <span className="text-xs text-muted">{unit.municipality} - {formatPercent(unit.attendanceRate)} presença</span>
                </div>
                <span className="text-lg font-medium text-emerald-600">{unit.efficiencyScore}</span>
              </article>
            ))}
          </div>
        </ChartPanel>

        <ChartPanel title="Unidades em atenção" subtitle="Baixo score, ausência ou lacuna de adesão">
          <div className="space-y-2">
            {attentionUnits.map((unit) => (
              <article key={unit.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-line bg-panelStrong/45 p-3">
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-medium text-ink">{unit.name}</strong>
                  <span className="text-xs text-muted">{unit.municipality} - {formatNumber(unit.checkedIn)} presença(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={unit.status} />
                  <span className="w-9 text-right text-sm font-medium text-rose-600">{unit.efficiencyScore}</span>
                </div>
              </article>
            ))}
          </div>
        </ChartPanel>
      </section>

      <section className="panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <Radar size={18} className="text-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-ink">Performance por polo</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {hubRows.map((hub) => (
            <article key={hub.name} className="rounded-lg border border-line bg-panelStrong/45 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <strong className="truncate text-sm font-medium text-ink">{hub.name}</strong>
                <span className="text-lg font-medium text-accent">{formatDecimal(hub.score)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{formatNumber(hub.active)} de {formatNumber(hub.units)} unidades ativas</p>
              <div className="mt-3 h-2 rounded-full bg-muted/20">
                <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, hub.score)}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
