import type { Category, Channel, DemoData, Evaluation, Formacao, Hub, Participant, Region, Role, Unit, UnitType } from "../types";

export const regions: Region[] = [
  { id: "north", name: "Norte Atlântico", shortName: "Norte", color: "#2563eb" },
  { id: "central", name: "Vale Central", shortName: "Central", color: "#22c55e" },
  { id: "highlands", name: "Serra Azul", shortName: "Serra", color: "#f59e0b" },
  { id: "south", name: "Sul Metropolitano", shortName: "Sul", color: "#a78bfa" },
];

export const hubs: Hub[] = [
  { id: "aurora", name: "Polo Aurora", regionId: "north" },
  { id: "maris", name: "Polo Maris", regionId: "north" },
  { id: "nexo", name: "Polo Nexo", regionId: "central" },
  { id: "orion", name: "Polo Orion", regionId: "central" },
  { id: "altus", name: "Polo Altus", regionId: "highlands" },
  { id: "lumia", name: "Polo Lumia", regionId: "highlands" },
  { id: "delta", name: "Polo Delta", regionId: "south" },
  { id: "vertice", name: "Polo Vértice", regionId: "south" },
];

const municipalities = [
  "Aurença",
  "Braville",
  "Cedro Alto",
  "Domira",
  "Estiva Nova",
  "Faroeste",
  "Grão Vale",
  "Helianto",
  "Ibiral",
  "Jardim Leste",
  "Lagoa Clara",
  "Monte Vero",
  "Nativa",
  "Outeiro Azul",
  "Porto Dália",
  "Quinta Serena",
  "Riacho Novo",
  "Solânea Alta",
  "Três Fontes",
  "Urbe Norte",
  "Vereda Sul",
  "Zênite",
  "Alvorim",
  "Boa Mirra",
  "Campo Íris",
  "Dunas Verdes",
  "Encosta Bela",
  "Figueira Lume",
  "Granito Sul",
  "Horta Nova",
  "Ilha Serena",
  "Jatobá Claro",
  "Limoeiro Alto",
  "Mirante Dois",
  "Nascente Azul",
  "Olivares",
  "Pedra Lúcida",
  "Ramada",
  "Santa Brisa",
  "Terramar",
];

const unitNames = [
  "Unidade Solar",
  "Unidade Horizonte",
  "Unidade Raiz",
  "Unidade Prisma",
  "Unidade Mosaico",
  "Unidade Alameda",
  "Unidade Farol",
  "Unidade Veredas",
  "Unidade Mirante",
  "Unidade Atlante",
  "Unidade Semente",
  "Unidade Terral",
  "Unidade Nascente",
  "Unidade Pioneira",
  "Unidade Integra",
  "Unidade Vetor",
  "Unidade Portal",
  "Unidade Prisma Norte",
  "Unidade Rota Viva",
  "Unidade Círculo",
  "Unidade Horizonte Sul",
  "Unidade Arco",
  "Unidade Campo Alto",
  "Unidade Recanto",
  "Unidade Núcleo",
  "Unidade Florença",
  "Unidade Riacho",
  "Unidade Marina",
  "Unidade Estação",
  "Unidade Vila Nova",
  "Unidade Essência",
  "Unidade Matriz",
  "Unidade Trilhas",
  "Unidade Sinapse",
  "Unidade Progresso",
  "Unidade Elo",
  "Unidade Jardim",
  "Unidade Metrópole",
  "Unidade Conviva",
  "Unidade Norte Azul",
];

const roles: Role[] = ["Gestor(a)", "Coordenador(a)", "Professor(a)", "Articulador(a)"];
const categories: Category[] = ["Prioritário", "Regular", "Observador"];
const types: UnitType[] = ["Integral", "Técnica", "Urbana", "Rural", "Híbrida"];
const monthDays = ["2026-04-02", "2026-04-03", "2026-04-04", "2026-04-09", "2026-04-10", "2026-04-11", "2026-04-16", "2026-04-17"];
const checkInTimes = ["08:10", "08:35", "09:00", "09:25", "10:05", "13:15", "14:20"];
const firstNames = [
  "Ana", "Bruno", "Camila", "Diego", "Elisa", "Fábio", "Gabriela", "Heitor", "Isadora", "João",
  "Larissa", "Marcos", "Natália", "Otávio", "Paula", "Rafael", "Sabrina", "Tiago", "Vitória", "Yuri",
  "Beatriz", "Caio", "Débora", "Eduardo", "Fernanda", "Gustavo", "Helena", "Igor", "Júlia", "Lucas",
];
const lastNames = [
  "Almeida", "Barros", "Cardoso", "Duarte", "Esteves", "Farias", "Gomes", "Henriques", "Lopes", "Moraes",
  "Nogueira", "Oliveira", "Pacheco", "Queiroz", "Rocha", "Sampaio", "Teixeira", "Vasconcelos", "Xavier", "Zanetti",
  "Matos", "Ribeiro", "Costa",
];
const channels: Channel[] = ["WhatsApp", "WhatsApp", "E-mail", "Site", "WhatsApp", "Indicação", "E-mail"];

export function slugEmail(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, ".");
}

export function ticketCode(seed: number) {
  return `JFT-${String(1000 + ((seed * 7919) % 9000)).padStart(4, "0")}`;
}

const positiveTopics = ["Conteúdos", "Formadores", "Metodologias", "Aplicabilidade", "Organização"];
const improvementTopics = ["Alimentação", "Horários", "Materiais", "Credenciamento", "Espaço"];

function buildUnits(): Unit[] {
  return unitNames.map((name, index) => {
    const hub = hubs[index % hubs.length];
    return {
      id: `unit-${String(index + 1).padStart(2, "0")}`,
      code: `UA${String(48000000 + index * 137 + (index % 7) * 19)}`,
      name,
      municipality: municipalities[index % municipalities.length],
      regionId: hub.regionId,
      hubId: hub.id,
      type: types[(index + Math.floor(index / 3)) % types.length],
      target: 3 + (index % 4),
      priority: index % 9 === 0 ? "Alta" : index % 4 === 0 ? "Média" : "Baixa",
    };
  });
}

function buildParticipants(units: Unit[]): Participant[] {
  return units.flatMap((unit, unitIndex) =>
    Array.from({ length: unit.target }, (_, roleIndex) => {
      const registered = (unitIndex + roleIndex * 2) % 10 !== 0;
      const checkedIn = registered && (unitIndex * 3 + roleIndex) % 8 !== 0;
      const date = monthDays[(unitIndex + roleIndex) % monthDays.length];
      const time = checkInTimes[(unitIndex + roleIndex * 2) % checkInTimes.length];
      const seq = unitIndex * 6 + roleIndex;
      const name = `${firstNames[(seq * 7) % firstNames.length]} ${lastNames[(seq * 5 + unitIndex) % lastNames.length]}`;
      return {
        id: `part-${unit.id}-${roleIndex + 1}`,
        name,
        email: `${slugEmail(name)}@rede.exemplo`,
        ticket: ticketCode(seq + 1),
        channel: channels[seq % channels.length],
        unitId: unit.id,
        role: roles[(unitIndex + roleIndex) % roles.length],
        category: categories[(unitIndex + roleIndex * 2) % categories.length],
        registered,
        checkedIn,
        registeredAt: registered ? `${date}T${time}:00` : null,
        checkedInAt: checkedIn ? `${date}T${time}:00` : null,
        checkInMethod: checkedIn ? (seq % 3 === 0 ? "Busca manual" : "QR code") : undefined,
      } satisfies Participant;
    }),
  );
}

function clampScore(value: number) {
  return Math.max(5.8, Math.min(10, Number(value.toFixed(1))));
}

function buildEvaluations(participants: Participant[], units: Unit[]): Evaluation[] {
  const unitById = new Map(units.map((unit) => [unit.id, unit]));

  return participants
    .filter((participant, index) => participant.checkedIn && index % 7 !== 0)
    .map((participant, index) => {
      const unit = unitById.get(participant.unitId)!;
      const base = 7.1 + ((index + unit.target) % 7) * 0.33 + (unit.priority === "Alta" ? -0.18 : 0.08);
      const sentiment = base >= 8 || index % 5 !== 0 ? "positivo" : "melhoria";
      return {
        id: `eval-${String(index + 1).padStart(3, "0")}`,
        participantId: participant.id,
        unitId: participant.unitId,
        role: participant.role,
        submittedAt: participant.checkedInAt ?? "2026-04-18T10:00:00",
        scores: {
          content: clampScore(base + 0.8),
          facilitation: clampScore(base + 0.65),
          methodology: clampScore(base + 0.35),
          workload: clampScore(base - 0.25),
          resources: clampScore(base - 0.35 + (index % 3) * 0.2),
          food: clampScore(base - 0.7 + (index % 4) * 0.18),
          organization: clampScore(base + 0.1),
          schedule: clampScore(base - 0.45),
          applicability: clampScore(base + 0.55),
          satisfaction: clampScore(base + 0.4),
        },
        sentiment,
        topic: sentiment === "positivo"
          ? positiveTopics[index % positiveTopics.length]
          : improvementTopics[index % improvementTopics.length],
      };
    });
}

const units = buildUnits();
const participants = buildParticipants(units);
const evaluations = buildEvaluations(participants, units);

// A formação principal: é ela que carrega participantes, credenciamento e
// avaliações. As demais existem para o CRM ter cara de carteira real.
export const MAIN_FORMACAO_ID = "jornada-territorial-2026";

export const mainFormacao: Formacao = {
  id: MAIN_FORMACAO_ID,
  title: "Jornada Formativa Territorial 2026",
  status: "Inscrições abertas",
  modality: "Presencial",
  period: "02 a 17 de abril",
  workload: 40,
  seats: units.reduce((sum, unit) => sum + unit.target, 0),
  audience: "Gestores, coordenadores, professores e articuladores",
  place: "8 polos regionais",
  cover: "./formacao/pedagogica.jpg",
  registered: 0,
  checkedIn: 0,
};

export const otherFormacoes: Formacao[] = [
  {
    id: "encontro-gestores",
    title: "Encontro de Gestores Escolares",
    status: "Em andamento",
    modality: "Híbrida",
    period: "12 a 14 de março",
    workload: 16,
    seats: 120,
    audience: "Gestores e vice-gestores",
    place: "Polo Nexo + transmissão",
    cover: "./formacao/organizacao.jpg",
    registered: 112,
    checkedIn: 97,
  },
  {
    id: "oficina-avaliacao",
    title: "Oficina de Avaliação Diagnóstica",
    status: "Concluída",
    modality: "Presencial",
    period: "18 e 19 de fevereiro",
    workload: 12,
    seats: 80,
    audience: "Coordenadores pedagógicos",
    place: "Polo Aurora",
    cover: "./formacao/logistica.jpg",
    registered: 78,
    checkedIn: 71,
  },
  {
    id: "seminario-inclusao",
    title: "Seminário de Práticas Inclusivas",
    status: "Rascunho",
    modality: "On-line",
    period: "A definir",
    workload: 8,
    seats: 300,
    audience: "Professores da rede",
    place: "Ambiente virtual",
    cover: "./formacao/pedagogica.jpg",
    registered: 0,
    checkedIn: 0,
  },
];

// Tráfego da página pública por canal. Não há visitas individuais na base:
// a razão visita/inscrição por canal é fixa e coerente com o funil.
export const channelVisitRatio: Record<Channel, number> = {
  WhatsApp: 2.6,
  "E-mail": 4.1,
  Site: 5.3,
  Indicação: 1.6,
};

export const demoData: DemoData = {
  regions,
  hubs,
  units,
  participants,
  evaluations,
};
