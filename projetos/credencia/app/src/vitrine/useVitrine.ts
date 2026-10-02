import { useEffect, useRef } from "react";
import { modoVitrine } from "../lib/env";
import { useStore } from "../state/store";
import type { Tela } from "./celular/Celular";
import { CANCELADO, Roteiro, avisarHost, esconderCursor, novoToken } from "./motor";
import { roteiroCelular, roteiroDesktop } from "./roteiros";

// Liga o app à home: a home manda { tipo: "vitrine:passo", passo }, o app
// volta ao ponto de partida daquele passo e executa o roteiro. Ao terminar,
// avisa { tipo: "fim" } para a home poder avançar.
export function useVitrine(opcoes: { setTela?: (tela: Tela) => void } = {}) {
  const store = useStore();
  const storeRef = useRef(store);
  storeRef.current = store;
  const setTelaRef = useRef(opcoes.setTela);
  setTelaRef.current = opcoes.setTela;

  useEffect(() => {
    if (!modoVitrine) return;
    const tela = modoVitrine;

    async function executar(passo: number) {
      const roteiro = new Roteiro(novoToken());
      esconderCursor();
      storeRef.current.reset(passo);
      const ctx = {
        estado: () => storeRef.current.state,
        setTela: (t: Tela) => setTelaRef.current?.(t),
      };
      try {
        await roteiro.esperar(120);
        if (tela === "desktop") await roteiroDesktop(passo, roteiro, ctx);
        else await roteiroCelular(passo, roteiro, ctx);
        esconderCursor();
        avisarHost({ tipo: "fim", passo, tela });
      } catch (erro) {
        if (erro === CANCELADO) return;
        console.warn("[vitrine]", erro);
        esconderCursor();
        avisarHost({ tipo: "fim", passo, tela });
      }
    }

    const aoReceber = (event: MessageEvent) => {
      const dado = event.data;
      if (dado && dado.tipo === "vitrine:passo" && typeof dado.passo === "number") executar(dado.passo);
      if (dado && dado.tipo === "vitrine:parar") {
        novoToken();
        esconderCursor();
      }
    };
    window.addEventListener("message", aoReceber);
    avisarHost({ tipo: "pronto", tela });
    return () => window.removeEventListener("message", aoReceber);
  }, []);
}
