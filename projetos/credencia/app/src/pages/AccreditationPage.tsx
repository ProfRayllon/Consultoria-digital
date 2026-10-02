import { BadgeCheck, Clock3, Layers3, UserCheck, UserRoundX, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
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
import type { DemoData, FilteredData, Participant } from "../types";
import { ALL_VALUE, countBy, formatNumber, formatPercent, percent, periodOptions } from "../lib/analytics";

interface AccreditationPageProps {
  data: FilteredData;
  allData: DemoData;
}

type EvolutionMode = "day" | "hour";
type CredentialStatus = "all" | "credenciado" | "ausente" | "nao-inscrito";

const tooltipStyle = {
  background: "rgb(var(--color-panel-strong))",
  border: "1px solid rgb(var(--color-line))",
  borderRadius: 8,
  color: "rgb(var(--color-ink))",
};

const statusOptions: Array<{ value: CredentialStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "credenciado", label: "Credenciado" },
  { value: "ausente", label: "Ausente" },
  { value: "nao-inscrito", label: "Não inscrito" },
];

function participantStatus(participant: Participant): CredentialStatus {
  if (participant.checkedIn) return "credenciado";
  if (participant.registered) return "ausente";
  return "nao-inscrito";
}

export function AccreditationPage({ data, allData }: AccreditationPageProps) {
  const [role, setRole] = useState<string>(ALL_VALUE);
  const [status, setStatus] = useState<CredentialStatus>("all");
  const [mode, setMode] = useState<EvolutionMode>("day");

  const unitById = useMemo(() => new Map(data.units.map((unit) => [unit.id, unit])), [data.units]);
  const hubById = useMemo(() => new Map(allData.hubs.map((hub) => [hub.id, hub])), [allData.hubs]);

  const participants = useMemo(() => {
    return data.participants.filter((participant) => {
      const roleMatch = role === ALL_VALUE || participant.role === role;
      const statusMatch = status === "all" || participantStatus(participant) === status;
      return roleMatch && statusMatch;
    });
  }, [data.participants, role, status]);

  const target = data.units.reduce((sum, unit) => sum + unit.target, 0);
  const registered = participants.filter((participant) => participant.registered).length;
  const checkedIn = participants.filter((participant) => participant.checkedIn).length;
  const absent = participants.filter((participant) => participant.registered && !participant.checkedIn).length;
  const notRegistered = participants.filter((participant) => !participant.registered).length;

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(data.participants.map((participant) => participant.role))).sort((a, b) => a.localeCompare(b, "pt-BR"));
    return [{ value: ALL_VALUE, label: "Todas" }, ...roles.map((item) => ({ value: item, label: item }))];
  }, [data.participants]);

  const regionData = allData.regions.map((region) => {
    const rows = participants.filter((participant) => unitById.get(participant.unitId)?.regionId === region.id);
    const regionRegistered = rows.filter((participant) => participant.registered).length;
    const regionCheckedIn = rows.filter((participant) => participant.checkedIn).length;
    return {
      name: region.shortName,
      inscritos: regionRegistered,
      credenciados: regionCheckedIn,
      taxa: Number(percent(regionCheckedIn, regionRegistered).toFixed(1)),
    };
  });

  const hubStatusData = allData.hubs
    .map((hub) => {
      const rows = participants.filter((participant) => unitById.get(participant.unitId)?.hubId === hub.id);
      return {
        name: hub.name.replace("Polo ", ""),
        credenciados: rows.filter((participant) => participant.checkedIn).length,
        ausentes: rows.filter((participant) => participant.registered && !participant.checkedIn).length,
        "não inscritos": rows.filter((participant) => !participant.registered).length,
      };
    })
    .filter((row) => row.credenciados + row.ausentes + row["não inscritos"] > 0);

  const evolutionData = mode === "day"
    ? periodOptions
        .filter((option) => option.value !== "all")
        .map((option) => ({
          label: option.label,
          inscrições: participants.filter((participant) => participant.registeredAt?.startsWith(option.value)).length,
          credenciamentos: participants.filter((participant) => participant.checkedInAt?.startsWith(option.value)).length,
        }))
    : ["08", "09", "10", "13", "14"].map((hour) => ({
        label: `${hour}h`,
        credenciamentos: participants.filter((participant) => participant.checkedInAt?.slice(11, 13) === hour).length,
      }));

  const categoryData = countBy(participants, (participant) => participant.category);
  const roleData = countBy(participants, (participant) => participant.role).map((item) => ({
    name: item.name,
    total: item.value,
    credenciados: participants.filter((participant) => participant.role === item.name && participant.checkedIn).length,
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <PageHeader
          eyebrow="Credenciamento"
          title="Adesão e presença em tempo real"
          description="Acompanhamento de público previsto, inscrições, ausências e presenças por região, polo e perfil participante."
        />
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Função" value={role} options={roleOptions} onChange={setRole} />
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={(value) => setStatus(value as CredentialStatus)} />
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <KpiCard label="Público base" value={formatNumber(target)} detail={`${formatNumber(participants.length)} perfis filtrados`} icon={UsersRound} tone="blue" />
        <KpiCard label="Inscritos" value={formatNumber(registered)} detail={`${formatPercent(percent(registered, participants.length))} do filtro`} icon={UserCheck} tone="green" trend="up" />
        <KpiCard label="Credenciados" value={formatNumber(checkedIn)} detail={`${formatPercent(percent(checkedIn, registered))} dos inscritos`} icon={BadgeCheck} tone="green" trend="up" />
        <KpiCard label="Ausentes" value={formatNumber(absent)} detail={`${formatPercent(percent(absent, registered))} dos inscritos`} icon={Clock3} tone="amber" trend="flat" />
        <KpiCard label="Não inscritos" value={formatNumber(notRegistered)} detail={`${formatPercent(percent(notRegistered, participants.length))} do público`} icon={UserRoundX} tone="rose" trend="down" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartPanel title="Taxa por região" subtitle="Credenciados sobre inscritos">
          <div className="h-[318px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ left: -18, right: 14, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [name === "taxa" ? `${value}%` : value, name]} />
                <Bar dataKey="taxa" radius={[8, 8, 0, 0]} barSize={42}>
                  {regionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.taxa >= 84 ? "#22c55e" : entry.taxa >= 74 ? "#f59e0b" : "#fb7185"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Status por polo" subtitle="Distribuição operacional do credenciamento">
          <div className="h-[318px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hubStatusData} margin={{ left: -10, right: 10, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="credenciados" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ausentes" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="não inscritos" stackId="a" fill="#64748b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartPanel
          title={mode === "day" ? "Evolução por data" : "Credenciamento por horário"}
          subtitle="Comparação entre adesão e presença"
          actions={
            <SegmentedControl
              label="Modo de evolução"
              value={mode}
              onChange={setMode}
              options={[
                { value: "day", label: "Data" },
                { value: "hour", label: "Hora" },
              ]}
            />
          }
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ left: -18, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                {mode === "day" ? <Line type="monotone" dataKey="inscrições" stroke="#2563eb" strokeWidth={2.6} dot={{ r: 3 }} /> : null}
                <Line type="monotone" dataKey="credenciamentos" stroke="#22c55e" strokeWidth={2.8} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="Perfil de público" subtitle="Categoria e função dos participantes">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={["#2563eb", "#22c55e", "#a78bfa"][index % 3]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {roleData.map((item) => (
                <div key={item.name} className="rounded-lg border border-line bg-panelStrong/45 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="text-muted">{formatNumber(item.credenciados)} / {formatNumber(item.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/20">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${percent(item.credenciados, item.total)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartPanel>
      </section>

      <section className="panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <Layers3 size={18} className="text-accent" aria-hidden="true" />
          <h3 className="text-sm font-medium text-ink">Leitura territorial</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {allData.regions.map((region) => {
            const hubs = allData.hubs.filter((hub) => hub.regionId === region.id);
            const rows = participants.filter((participant) => unitById.get(participant.unitId)?.regionId === region.id);
            return (
              <article key={region.id} className="rounded-lg border border-line bg-panelStrong/45 p-4">
                <span className="field-label">{hubs.map((hub) => hubById.get(hub.id)?.name.replace("Polo ", "")).join(" + ")}</span>
                <strong className="mt-2 block text-base font-medium text-ink">{region.name}</strong>
                <p className="mt-1 text-xs text-muted">{formatNumber(rows.length)} registros - {formatPercent(percent(rows.filter((item) => item.checkedIn).length, rows.filter((item) => item.registered).length))} presença</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
