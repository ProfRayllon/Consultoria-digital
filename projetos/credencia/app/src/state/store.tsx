import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { MAIN_FORMACAO_ID, demoData, mainFormacao, otherFormacoes, ticketCode } from "../data/syntheticData";
import type { Channel, DemoData, Formacao, Participant, Role } from "../types";
import { modoVitrine, canalVitrine } from "../lib/env";

// ============================================================================
// ESTADO VIVO DO CRM
// ----------------------------------------------------------------------------
// A base sintética é o ponto de partida; em cima dela o app aceita ações
// reais (publicar formação, inscrever, credenciar). Cada ação também é
// transmitida por BroadcastChannel: uma inscrição feita na página pública,
// em outra aba ou no iframe do celular da vitrine, aparece no CRM na hora.
// ============================================================================

export interface Toast {
  id: number;
  title: string;
  detail?: string;
  tone: "info" | "success";
}

// Ações que viajam entre abas. As locais (toast, reset) não são transmitidas.
export type SyncAction =
  | { type: "publicar"; formacao: Formacao }
  | { type: "inscrever"; participant: Participant }
  | { type: "credenciar"; participantId: string; method: "QR code" | "Busca manual"; at: string }
  | { type: "campanha"; channel: Channel; reach: number };

type LocalAction =
  | { type: "reset"; passo: number }
  | { type: "toast"; toast: Omit<Toast, "id"> }
  | { type: "fecharToast"; id: number };

type Action = SyncAction | LocalAction;

export interface StoreState {
  formacoes: Formacao[];
  participants: Participant[];
  evaluations: DemoData["evaluations"];
  campanhas: number;
  // Incrementa a cada reset: as telas usam como key para recomeçar limpas.
  rodada: number;
  // Último registro tocado por uma ação — a interface usa para destacar a linha.
  recente: { kind: "formacao" | "participante"; id: string; at: number } | null;
  toasts: Toast[];
}

// Participante que a vitrine inscreve pelo celular e depois credencia por QR.
export const VITRINE_INSCRITA: Participant = {
  id: "part-vitrine-marina",
  name: "Marina Duarte",
  email: "marina.duarte@rede.exemplo",
  ticket: "JFT-2026",
  channel: "WhatsApp",
  unitId: "unit-01",
  role: "Coordenador(a)",
  category: "Prioritário",
  registered: true,
  checkedIn: false,
  registeredAt: "2026-04-10T19:42:00",
  checkedInAt: null,
};

// Monta o estado de partida. Na vitrine, cada passo começa de um ponto fixo,
// para a sequência funcionar igual mesmo se o visitante pular passos.
export function estadoInicial(passo = -1): StoreState {
  const vitrine = passo >= 0;
  const publicada = !vitrine || passo >= 1;
  let participants = demoData.participants;
  if (vitrine && passo >= 3) {
    const marina = passo >= 4
      ? { ...VITRINE_INSCRITA, checkedIn: true, checkedInAt: "2026-04-17T15:30:00", checkInMethod: "QR code" as const }
      : VITRINE_INSCRITA;
    participants = [marina, ...participants];
  }
  return {
    formacoes: publicada ? [mainFormacao, ...otherFormacoes] : otherFormacoes,
    participants,
    evaluations: demoData.evaluations,
    campanhas: 0,
    rodada: 0,
    recente: null,
    toasts: [],
  };
}

let toastSeq = 1;

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "reset":
      return { ...estadoInicial(action.passo), rodada: state.rodada + 1 };
    case "publicar": {
      const resto = state.formacoes.filter((f) => f.id !== action.formacao.id);
      return {
        ...state,
        formacoes: [action.formacao, ...resto],
        recente: { kind: "formacao", id: action.formacao.id, at: Date.now() },
      };
    }
    case "inscrever": {
      if (state.participants.some((p) => p.id === action.participant.id)) return state;
      return {
        ...state,
        participants: [action.participant, ...state.participants],
        recente: { kind: "participante", id: action.participant.id, at: Date.now() },
      };
    }
    case "credenciar":
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.participantId
            ? { ...p, registered: true, checkedIn: true, checkedInAt: action.at, checkInMethod: action.method }
            : p,
        ),
        recente: { kind: "participante", id: action.participantId, at: Date.now() },
      };
    case "campanha":
      return { ...state, campanhas: state.campanhas + 1 };
    case "toast":
      return { ...state, toasts: [...state.toasts.slice(-2), { ...action.toast, id: toastSeq++ }] };
    case "fecharToast":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

type Listener = (action: SyncAction, remota: boolean) => void;


interface StoreApi {
  state: StoreState;
  data: DemoData;
  enviar: (action: SyncAction) => void;
  toast: (toast: Omit<Toast, "id">) => void;
  fecharToast: (id: number) => void;
  reset: (passo: number) => void;
  // Escuta ações (locais e vindas de outras abas). Usado pelos roteiros da vitrine.
  ouvir: (listener: Listener) => () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

function nomeDoCanal() {
  if (modoVitrine) return `credencia-vitrine-${canalVitrine || "padrao"}`;
  return "credencia-demo";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => estadoInicial(modoVitrine ? 0 : -1));
  const canalRef = useRef<BroadcastChannel | null>(null);
  const ouvintes = useRef(new Set<Listener>());

  const notificar = useCallback((action: SyncAction, remota: boolean) => {
    ouvintes.current.forEach((fn) => fn(action, remota));
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const canal = new BroadcastChannel(nomeDoCanal());
    canal.onmessage = (event: MessageEvent<SyncAction>) => {
      dispatch(event.data);
      notificar(event.data, true);
    };
    canalRef.current = canal;
    return () => canal.close();
  }, [notificar]);

  const enviar = useCallback(
    (action: SyncAction) => {
      dispatch(action);
      canalRef.current?.postMessage(action);
      notificar(action, false);
    },
    [notificar],
  );

  const toast = useCallback((t: Omit<Toast, "id">) => dispatch({ type: "toast", toast: t }), []);
  const fecharToast = useCallback((id: number) => dispatch({ type: "fecharToast", id }), []);
  const reset = useCallback((passo: number) => dispatch({ type: "reset", passo }), []);
  const ouvir = useCallback((fn: Listener) => {
    ouvintes.current.add(fn);
    return () => {
      ouvintes.current.delete(fn);
    };
  }, []);

  const data = useMemo<DemoData>(
    () => ({ ...demoData, participants: state.participants, evaluations: state.evaluations }),
    [state.participants, state.evaluations],
  );

  const api = useMemo(
    () => ({ state, data, enviar, toast, fecharToast, reset, ouvir }),
    [state, data, enviar, toast, fecharToast, reset, ouvir],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore fora do StoreProvider");
  return ctx;
}

// Formação com contadores calculados a partir dos participantes vivos.
export function useFormacoes() {
  const { state } = useStore();
  return useMemo(() => {
    const registered = state.participants.filter((p) => p.registered).length;
    const checkedIn = state.participants.filter((p) => p.checkedIn).length;
    return state.formacoes.map((f) => (f.id === MAIN_FORMACAO_ID ? { ...f, registered, checkedIn } : f));
  }, [state.formacoes, state.participants]);
}

export function novoParticipante(input: { name: string; email: string; role: Role; unitId: string; channel: Channel }): Participant {
  const seq = Date.now() % 100000;
  return {
    id: `part-novo-${seq}`,
    name: input.name,
    email: input.email,
    ticket: ticketCode(seq),
    channel: input.channel,
    unitId: input.unitId,
    role: input.role,
    category: "Regular",
    registered: true,
    checkedIn: false,
    registeredAt: "2026-04-10T19:42:00",
    checkedInAt: null,
  };
}
