export type PageId =
  | "formacoes"
  | "divulgacao"
  | "inscricoes"
  | "checkin"
  | "overview"
  | "accreditation"
  | "evaluation"
  | "efficiency"
  | "units";

export type Channel = "WhatsApp" | "E-mail" | "Site" | "Indicação";
export type FormacaoStatus = "Rascunho" | "Inscrições abertas" | "Em andamento" | "Concluída";

export interface Formacao {
  id: string;
  title: string;
  status: FormacaoStatus;
  modality: "Presencial" | "Híbrida" | "On-line";
  period: string;
  workload: number;
  seats: number;
  audience: string;
  place: string;
  cover: string;
  registered: number;
  checkedIn: number;
}

export type Role = "Gestor(a)" | "Coordenador(a)" | "Professor(a)" | "Articulador(a)";
export type Category = "Prioritário" | "Regular" | "Observador";
export type UnitType = "Integral" | "Técnica" | "Urbana" | "Rural" | "Híbrida";
export type UnitStatus = "Ativa" | "Inscrita sem presença" | "Lacuna";
export type Sentiment = "positivo" | "melhoria";

export interface Region {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Hub {
  id: string;
  name: string;
  regionId: string;
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  municipality: string;
  regionId: string;
  hubId: string;
  type: UnitType;
  target: number;
  priority: "Alta" | "Média" | "Baixa";
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  ticket: string;
  channel: Channel;
  unitId: string;
  role: Role;
  category: Category;
  registered: boolean;
  checkedIn: boolean;
  registeredAt: string | null;
  checkedInAt: string | null;
  checkInMethod?: "QR code" | "Busca manual";
}

export interface EvaluationScores {
  content: number;
  facilitation: number;
  methodology: number;
  workload: number;
  resources: number;
  food: number;
  organization: number;
  schedule: number;
  applicability: number;
  satisfaction: number;
}

export interface Evaluation {
  id: string;
  participantId: string;
  unitId: string;
  role: Role;
  submittedAt: string;
  scores: EvaluationScores;
  sentiment: Sentiment;
  topic: string;
}

export interface DemoData {
  regions: Region[];
  hubs: Hub[];
  units: Unit[];
  participants: Participant[];
  evaluations: Evaluation[];
}

export interface DashboardFilters {
  period: string;
  regionId: string;
  hubId: string;
}

export interface FilteredData extends DemoData {
  activeUnitIds: Set<string>;
}

export interface UnitSummary extends Unit {
  status: UnitStatus;
  registered: number;
  checkedIn: number;
  absent: number;
  responseCount: number;
  attendanceRate: number;
  satisfaction: number | null;
  efficiencyScore: number;
}
