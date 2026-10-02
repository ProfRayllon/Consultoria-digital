// ============================================================================
// MOTOR DA VITRINE
// ----------------------------------------------------------------------------
// Simula um usuário real: move um cursor até elementos marcados com
// data-tour="...", clica neles (element.click() de verdade, que dispara o
// onClick do React) e digita em inputs controlados. Nada é encenado à parte:
// o roteiro opera o próprio app.
//
// Todo passo é cancelável: quando a home pede outro passo, o token muda e a
// próxima espera do roteiro antigo lança CANCELADO.
// ============================================================================

export interface CursorEstado {
  x: number;
  y: number;
  visivel: boolean;
  clique: number; // incrementa a cada clique, para reiniciar a animação
}

type Ouvinte = (c: CursorEstado) => void;

let cursor: CursorEstado = { x: -60, y: -60, visivel: false, clique: 0 };
const ouvintes = new Set<Ouvinte>();

function setCursor(parcial: Partial<CursorEstado>) {
  cursor = { ...cursor, ...parcial };
  ouvintes.forEach((fn) => fn(cursor));
}

export function ouvirCursor(fn: Ouvinte) {
  ouvintes.add(fn);
  fn(cursor);
  return () => {
    ouvintes.delete(fn);
  };
}

export const CANCELADO = new Error("roteiro-cancelado");

let tokenAtual = 0;

export function novoToken() {
  tokenAtual += 1;
  return tokenAtual;
}

export function esconderCursor() {
  setCursor({ visivel: false });
}

// Rola só o contêiner do próprio app. scrollIntoView não serve: dentro de um
// iframe ele também rola a página que hospeda a vitrine.
function rolarAte(el: HTMLElement, bloco: "center" | "start") {
  let alvo: HTMLElement | null = el.parentElement;
  while (alvo && alvo !== document.body) {
    const estilo = getComputedStyle(alvo);
    if (/(auto|scroll)/.test(estilo.overflowY) && alvo.scrollHeight > alvo.clientHeight + 2) break;
    alvo = alvo.parentElement;
  }
  const r = el.getBoundingClientRect();
  if (alvo && alvo !== document.body) {
    const caixa = alvo.getBoundingClientRect();
    const desloc = bloco === "center" ? r.top - caixa.top - (caixa.height - r.height) / 2 : r.top - caixa.top - 12;
    alvo.scrollTo({ top: alvo.scrollTop + desloc, behavior: "smooth" });
    return;
  }
  const desloc = bloco === "center" ? r.top - (window.innerHeight - r.height) / 2 : r.top - 80;
  window.scrollTo({ top: window.scrollY + desloc, behavior: "smooth" });
}

export class Roteiro {
  private token: number;

  constructor(token: number) {
    this.token = token;
  }

  private checar() {
    if (this.token !== tokenAtual) throw CANCELADO;
  }

  async esperar(ms: number) {
    this.checar();
    await new Promise((r) => window.setTimeout(r, ms));
    this.checar();
  }

  // Espera o elemento existir no DOM (telas trocam de forma assíncrona).
  async alvo(id: string, limite = 4000): Promise<HTMLElement> {
    const inicio = performance.now();
    for (;;) {
      this.checar();
      const el = document.querySelector<HTMLElement>(`[data-tour="${id}"]`);
      if (el && el.offsetParent !== null) return el;
      if (performance.now() - inicio > limite) throw new Error(`alvo não encontrado: ${id}`);
      await new Promise((r) => window.setTimeout(r, 60));
    }
  }

  async apontar(id: string) {
    const el = await this.alvo(id);
    const r0 = el.getBoundingClientRect();
    const fora = r0.top < 70 || r0.bottom > window.innerHeight - 20;
    if (fora) {
      rolarAte(el, "center");
      await this.esperar(650);
    }
    const r = el.getBoundingClientRect();
    setCursor({ visivel: true, x: r.left + Math.min(r.width / 2, 120), y: r.top + r.height / 2 });
    await this.esperar(720);
    return el;
  }

  async clicar(id: string) {
    const el = await this.apontar(id);
    setCursor({ clique: cursor.clique + 1 });
    await this.esperar(180);
    el.click();
    await this.esperar(420);
  }

  async digitar(id: string, texto: string, intervalo = 48) {
    const el = (await this.apontar(id)) as HTMLInputElement | HTMLTextAreaElement;
    setCursor({ clique: cursor.clique + 1 });
    el.focus({ preventScroll: true });
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    for (let i = 1; i <= texto.length; i++) {
      setter?.call(el, texto.slice(0, i));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      await this.esperar(intervalo);
    }
    await this.esperar(250);
  }

  async escolher(id: string, valor: string) {
    const el = (await this.apontar(id)) as HTMLSelectElement;
    setCursor({ clique: cursor.clique + 1 });
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
    setter?.call(el, valor);
    el.dispatchEvent(new Event("change", { bubbles: true }));
    await this.esperar(450);
  }

  async rolarPara(id: string) {
    const el = await this.alvo(id);
    rolarAte(el, "start");
    await this.esperar(900);
  }

  async topo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelectorAll("[data-rolagem]").forEach((el) => el.scrollTo({ top: 0, behavior: "smooth" }));
    await this.esperar(500);
  }

  // Espera algo acontecer (ex.: a inscrição feita no celular chegar ao CRM).
  async aguardar(condicao: () => boolean, limite = 20000) {
    const inicio = performance.now();
    while (!condicao()) {
      if (performance.now() - inicio > limite) return false;
      await this.esperar(80);
    }
    return true;
  }
}

// Conversa com a página que hospeda a vitrine (a home do portfólio).
export function avisarHost(mensagem: Record<string, unknown>) {
  if (window.parent !== window) window.parent.postMessage({ origem: "vitrine", ...mensagem }, "*");
}
