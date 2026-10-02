import { useEffect, useState } from "react";
import type { PageId } from "../types";

// Rotas por hash: o build abre de qualquer pasta, sem servidor configurado.
export const rotas: Record<PageId, string> = {
  formacoes: "formacoes",
  divulgacao: "divulgacao",
  inscricoes: "inscricoes",
  checkin: "checkin",
  overview: "analise",
  accreditation: "analise/credenciamento",
  evaluation: "analise/avaliacao",
  efficiency: "analise/eficiencia",
  units: "analise/unidades",
};

export type Rota = PageId | "publica";

function lerHash(): Rota {
  const atual = window.location.hash.replace(/^#\/?/, "");
  if (atual === "inscricao") return "publica";
  const achada = (Object.keys(rotas) as PageId[]).find((id) => rotas[id] === atual);
  return achada ?? "formacoes";
}

export function navegar(rota: Rota) {
  window.location.hash = `/${rota === "publica" ? "inscricao" : rotas[rota]}`;
}

export function useRota() {
  const [rota, setRota] = useState<Rota>(lerHash);
  useEffect(() => {
    const aoMudar = () => setRota(lerHash());
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);
  return rota;
}
