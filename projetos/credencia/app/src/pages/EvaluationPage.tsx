import { MessageSquareText, Percent, SlidersHorizontal, Star, TrendingUp, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "../components/ChartPanel";
import { FilterSelect } from "../components/FilterSelect";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SegmentedControl } from "../components/SegmentedControl";
import type { DemoData, Evaluation, EvaluationScores, FilteredData, Sentiment } from "../types";
import {
  ALL_VALUE,
  averageEvaluation,
  averageScores,
  countBy,
  formatDecimal,
  formatNumber,
  formatPercent,
  logisticKeys,
  mean,
  pedagogicalKeys,
  percent,
  scoreLabels,
} from "../lib/analytics";

interface EvaluationPageProps {
  data: FilteredData;
  allData: DemoData;
}

type SentimentFilter = "todos" | Sentiment;

const tooltipStyle = {
  background: "rgb(var(--color-panel-strong))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: 8,
  color: "rgb(var(--color-ink))",
};

const sentimentOptions: Array<{ value: SentimentFilter; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "positivo", label: "Positivos" },
  { value: "melhoria", label: "A melhorar" },
];

function scoreFor(evaluations: Evaluation[], key: keyof EvaluationScores) {
  return mean(evaluations.map((evaluation) => evaluation.scores[key])) ?? 0;
}

export function EvaluationPage({ data, allData }: EvaluationPageProps) {
  const [role, setRole] = useState<string>(ALL_VALUE);
  const [sentiment, setSentiment] = useState<SentimentFilter>("todos");
  const [topicMode, setTopicMode] = useState<Sentiment>("positivo");

  const unitById = useMemo(() => new Map(data.units.map((unit) => [unit.id, unit])), [data.units]);

  const evaluations = useMemo(() => {
    return data.evaluations.filter((evaluation) => {
      const roleMatch = role === ALL_VALUE || evaluation.role === role;
      const sentimentMatch = sentiment === "todos" || evaluation.sentiment === sentiment;
      return roleMatch && sentimentMatch;
    });
  }, [data.evaluations, role, sentiment]);

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(data.evaluations.map((evaluation) => evaluation.role))).sort((a, b) => a.localeCompare(b, "pt-BR"));
    return [{ value: ALL_VALUE, label: "Todas" }, ...roles.map((item) => ({ value: item, label: item }))];
  }, [data.evaluations]);

  const responseCount = evaluations.length;
  const averageGeneral = mean(evaluations.map(averageEvaluation));
  const averagePedagogical = averageScores(evaluations, pedagogicalKeys);
  const averageLogistic = averageScores(evaluations, logisticKeys);
  const positiveRate = percent(evaluations.filter((evaluation) => evaluation.sentiment === "positivo").length, responseCount);

  const questionData = Object.entries(scoreLabels)
    .map(([key, label]) => ({
      name: label,
      score: Number(scoreFor(evaluations, key as keyof EvaluationScores).toFixed(1)),
      kind: pedagogicalKeys.includes(key as keyof EvaluationScores) ? "pedagógico" : "logístico",
    }))
    .reverse();

  const roleData = Array.from(new Set(data.evaluations.map((evaluation) => evaluation.role)))
    .map((roleName) => {
      const rows = evaluations.filter((evaluation) => evaluation.role === roleName);
      return {
        name: roleName,
        respostas: rows.length,
        média: Number((mean(rows.map(averageEvaluation)) ?? 0).toFixed(1)),
      };
    })
    .filter((row) => row.respostas > 0);

  const hubData = allData.hubs
    .map((hub) => {
      const rows = evaluations.filter((evaluation) => unitById.get(evaluation.unitId)?.hubId === hub.id);
      return {
        name: hub.name.replace("Polo ", ""),
        respostas: rows.length,
        média: Number((mean(rows.map(averageEvaluation)) ?? 0).toFixed(1)),
      };
    })
    .filter((row) => row.respostas > 0);

  const topicData = countBy(
    evaluations.filter((evaluation) => evaluation.sentiment === topicMode),
    (evaluation) => evaluation.topic,
  ).slice(0, 6).reverse();

  const radarData = [
    { dimension: "Conteúdo", score: scoreFor(evaluations, "content") },
    { dimension: "Formadores", score: scoreFor(evaluations, "facilitation") },
    { dimension: "Método", score: scoreFor(evaluations, "methodology") },
    { dimension: "Logística", score: averageLogistic ?? 0 },
    { dimension: "Aplicação", score: scoreFor(evaluations, "applicability") },
    { dimension: "Satisfação", score: scoreFor(evaluations, "satisfaction") },
  ].map((item) => ({ ...item, score: Number(item.score.toFixed(1)) }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeader
          eyebrow="Avaliação"
          title="Qualidade percebida da jornada"
          description="Leitura das respostas por dimensão, função, polo e tópico recorrente, com dados sintéticos de satisfação."
        />
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Função" value={role} options={roleOptions} onChange={setRole} />
          <SegmentedControl label="Sentimento" value={sentiment} options={sentimentOptions} onChange={setSentiment} />
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <KpiCard label="Respostas" value={formatNumber(responseCount)} detail="avaliações filtradas" icon={MessageSquareText} tone="blue" />
        <KpiCard label="Média pedagógica" value={formatDecimal(averagePedagogical)} detail="conteúdo, método e aplicação" icon={Star} tone="green" trend="up" />
        <KpiCard label="Média logística" value={formatDecimal(averageLogistic)} detail="estrutura e organização" icon={TrendingUp} tone="amber" trend="flat" />
        <KpiCard label="Média geral" value={formatDecimal(averageGeneral)} detail="escala 0 a 10" icon={UsersRound} tone="violet" />
        <KpiCard label="Positivas" value={formatPercent(positiveRate)} detail={`${formatNumber(evaluations.filter((item) => item.sentiment === "positivo").length)} respostas`} icon={Percent} tone="green" trend="up" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <ChartPanel title="Notas por pergunta" subtitle="Médias em escala de 0 a 10">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionData} layout="vertical" margin={{ left: 16, right: 20, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} width={108} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}/10`, "média"]} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={18}>
                  {questionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.kind === "pedagógico" ? "#2563eb" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Radar de qualidade" subtitle="Síntese das dimensões críticas">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="rgba(148,163,184,0.16)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "#475569", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Radar dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.24} strokeWidth={2.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartPanel title="Resultado por função" subtitle="Média geral por perfil respondente">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} margin={{ left: -16, right: 18, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="média" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Participação por polo" subtitle="Volume de respostas e nota média">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hubData} margin={{ left: -16, right: 14, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: "#f59e0b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar yAxisId="left" dataKey="respostas" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={24} />
                <Line yAxisId="right" type="monotone" dataKey="média" stroke="#f59e0b" strokeWidth={2.4} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel
          title={topicMode === "positivo" ? "Pontos positivos" : "Pontos a melhorar"}
          subtitle="Temas extraídos de comentários sintéticos"
          actions={
            <SegmentedControl
              label="Tipo de tópico"
              value={topicMode}
              onChange={setTopicMode}
              options={[
                { value: "positivo", label: "Positivos" },
                { value: "melhoria", label: "Melhorias" },
              ]}
            />
          }
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: 12, right: 22, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} width={96} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill={topicMode === "positivo" ? "#22c55e" : "#f59e0b"} radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-ink">Síntese por dimensão</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {questionData.slice().reverse().map((item) => (
            <article key={item.name} className="rounded-lg border border-line bg-panelStrong/45 p-3">
              <span className="field-label">{item.kind}</span>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <strong className="text-sm font-medium text-ink">{item.name}</strong>
                <span className="text-lg font-medium text-accent">{formatDecimal(item.score)}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted/20">
                <div className="h-full rounded-full bg-accent" style={{ width: `${item.score * 10}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
