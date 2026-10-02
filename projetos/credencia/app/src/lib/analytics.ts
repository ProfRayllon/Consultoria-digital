import type {
  DashboardFilters,
  DemoData,
  Evaluation,
  EvaluationScores,
  FilteredData,
  Participant,
  Unit,
  UnitStatus,
  UnitSummary,
} from "../types";

export const ALL_VALUE = "all";

export const periodOptions = [
  { value: ALL_VALUE, label: "Todo o ciclo" },
  { value: "2026-04-02", label: "02 abr" },
  { value: "2026-04-03", label: "03 abr" },
  { value: "2026-04-04", label: "04 abr" },
  { value: "2026-04-09", label: "09 abr" },
  { value: "2026-04-10", label: "10 abr" },
  { value: "2026-04-11", label: "11 abr" },
  { value: "2026-04-16", label: "16 abr" },
  { value: "2026-04-17", label: "17 abr" },
];

export const scoreLabels: Record<keyof EvaluationScores, string> = {
  content: "Conteúdos",
  facilitation: "Formadores",
  methodology: "Metodologias",
  workload: "Carga horária",
  resources: "Recursos",
  food: "Alimentação",
  organization: "Organização",
  schedule: "Programação",
  applicability: "Aplicabilidade",
  satisfaction: "Satisfação",
};

export const pedagogicalKeys: Array<keyof EvaluationScores> = ["content", "facilitation", "methodology", "applicability"];
export const logisticKeys: Array<keyof EvaluationScores> = ["workload", "resources", "food", "organization", "schedule"];

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(Math.round(value));
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value)}%`;
}

export function formatDecimal(value: number | null) {
  if (value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(value);
}

export function percent(part: number, total: number) {
  return total ? (part / total) * 100 : 0;
}

export function mean(values: Array<number | null | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function statusForUnit(registered: number, checkedIn: number): UnitStatus {
  if (checkedIn > 0) return "Ativa";
  if (registered > 0) return "Inscrita sem presença";
  return "Lacuna";
}

export function getUnitMaps(data: DemoData) {
  return {
    unitById: new Map(data.units.map((unit) => [unit.id, unit])),
    regionById: new Map(data.regions.map((region) => [region.id, region])),
    hubById: new Map(data.hubs.map((hub) => [hub.id, hub])),
  };
}

function unitMatches(unit: Unit, filters: DashboardFilters) {
  return (
    (filters.regionId === ALL_VALUE || unit.regionId === filters.regionId) &&
    (filters.hubId === ALL_VALUE || unit.hubId === filters.hubId)
  );
}

function inPeriod(value: string | null, period: string) {
  if (period === ALL_VALUE) return true;
  return Boolean(value?.startsWith(period));
}

export function filterDemoData(data: DemoData, filters: DashboardFilters): FilteredData {
  const units = data.units.filter((unit) => unitMatches(unit, filters));
  const unitIds = new Set(units.map((unit) => unit.id));

  const participants = data.participants.filter((participant) => {
    if (!unitIds.has(participant.unitId)) return false;
    return inPeriod(participant.registeredAt, filters.period) || inPeriod(participant.checkedInAt, filters.period);
  });

  const participantUnitIds = new Set(participants.map((participant) => participant.unitId));
  const activeUnitIds = filters.period === ALL_VALUE ? unitIds : participantUnitIds;

  const evaluations = data.evaluations.filter((evaluation) => {
    return activeUnitIds.has(evaluation.unitId) && inPeriod(evaluation.submittedAt, filters.period);
  });

  return {
    regions: data.regions,
    hubs: data.hubs,
    units: units.filter((unit) => activeUnitIds.has(unit.id)),
    participants,
    evaluations,
    activeUnitIds,
  };
}

export function averageEvaluation(evaluation: Evaluation) {
  return mean(Object.values(evaluation.scores)) ?? 0;
}

export function averageScores(evaluations: Evaluation[], keys: Array<keyof EvaluationScores>) {
  return mean(evaluations.map((evaluation) => mean(keys.map((key) => evaluation.scores[key]))));
}

export function buildUnitSummaries(units: Unit[], participants: Participant[], evaluations: Evaluation[]): UnitSummary[] {
  const participantsByUnit = groupBy(participants, (participant) => participant.unitId);
  const evaluationsByUnit = groupBy(evaluations, (evaluation) => evaluation.unitId);

  return units.map((unit) => {
    const unitParticipants = participantsByUnit.get(unit.id) ?? [];
    const unitEvaluations = evaluationsByUnit.get(unit.id) ?? [];
    const registered = unitParticipants.filter((participant) => participant.registered).length;
    const checkedIn = unitParticipants.filter((participant) => participant.checkedIn).length;
    const absent = unitParticipants.filter((participant) => participant.registered && !participant.checkedIn).length;
    const satisfaction = mean(unitEvaluations.map(averageEvaluation));
    const attendanceRate = percent(checkedIn, unit.target);
    const responseRate = percent(unitEvaluations.length, Math.max(checkedIn, 1));
    const satisfactionScore = satisfaction === null ? 0 : satisfaction * 10;
    const efficiencyScore = Math.round(attendanceRate * 0.52 + responseRate * 0.18 + satisfactionScore * 0.3);

    return {
      ...unit,
      status: statusForUnit(registered, checkedIn),
      registered,
      checkedIn,
      absent,
      responseCount: unitEvaluations.length,
      attendanceRate,
      satisfaction,
      efficiencyScore,
    };
  });
}

export function groupBy<T>(rows: T[], getKey: (row: T) => string | null | undefined) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = getKey(row) ?? "Sem informação";
    map.set(key, [...(map.get(key) ?? []), row]);
  }
  return map;
}

export function countBy<T>(rows: T[], getKey: (row: T) => string | null | undefined) {
  return Array.from(groupBy(rows, getKey).entries())
    .map(([name, values]) => ({ name, value: values.length }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "pt-BR"));
}

export function downloadCsv(fileName: string, headers: string[], rows: Array<Array<string | number | null>>) {
  const cell = (value: string | number | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = `\uFEFF${[headers.map(cell).join(";"), ...rows.map((row) => row.map(cell).join(";"))].join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
