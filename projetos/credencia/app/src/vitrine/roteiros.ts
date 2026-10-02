import { MAIN_FORMACAO_ID } from "../data/syntheticData";
import { navegar } from "../lib/router";
import type { StoreState } from "../state/store";
import { VITRINE_INSCRITA } from "../state/store";
import type { Tela } from "./celular/Celular";
import type { Roteiro } from "./motor";

// ============================================================================
// ROTEIROS DA VITRINE
// ----------------------------------------------------------------------------
// Os passos são os mesmos da home (home/projects-data.js → vitrine.passos):
//   0 Cadastro · 1 Divulgação · 2 Inscrição · 3 Credenciamento · 4 Análise
// O desktop é a equipe no CRM; o celular é quem está na ponta. Os dois
// rodam ao mesmo tempo e se encontram pelas ações sincronizadas.
// ============================================================================

interface Ctx {
  estado: () => StoreState;
  setTela: (tela: Tela) => void;
}

export async function roteiroDesktop(passo: number, r: Roteiro, ctx: Ctx) {
  switch (passo) {
    case 0: {
      navegar("formacoes");
      await r.topo();
      await r.esperar(900);
      await r.clicar("nova-formacao");
      await r.esperar(300);
      await r.digitar("f-titulo", "Jornada Formativa Territorial 2026", 38);
      await r.escolher("f-modalidade", "Presencial");
      await r.digitar("f-carga", "40");
      await r.digitar("f-periodo", "02 a 17 de abril", 40);
      await r.digitar("f-vagas", "180");
      await r.digitar("f-local", "8 polos regionais", 40);
      await r.digitar("f-publico", "Gestores, coordenadores e professores", 26);
      await r.clicar("f-capa-0");
      await r.clicar("f-publicar");
      await r.esperar(500);
      await r.apontar(`formacao-${MAIN_FORMACAO_ID}`);
      await r.esperar(2400);
      return;
    }
    case 1: {
      navegar("formacoes");
      await r.esperar(500);
      await r.clicar("nav-divulgacao");
      await r.esperar(1000);
      await r.clicar("copiar-link");
      await r.esperar(1000);
      await r.clicar("enviar-whatsapp");
      await r.esperar(1600);
      await r.apontar("funil");
      await r.esperar(3200);
      return;
    }
    case 2: {
      navegar("divulgacao");
      await r.esperar(400);
      await r.clicar("nav-inscricoes");
      await r.esperar(500);
      await r.apontar("busca-inscricoes");
      await r.aguardar(() => ctx.estado().participants.some((p) => p.id === VITRINE_INSCRITA.id), 30000);
      await r.esperar(1500);
      await r.clicar("linha-primeira");
      await r.esperar(3400);
      return;
    }
    case 3: {
      navegar("inscricoes");
      await r.esperar(400);
      await r.clicar("nav-checkin");
      await r.esperar(700);
      const alvo = ctx.estado().participants.find((p) => p.registered && !p.checkedIn && p.id !== VITRINE_INSCRITA.id);
      if (alvo) {
        const [nome, sobrenome] = alvo.name.split(" ");
        await r.digitar("busca-checkin", `${nome} ${sobrenome.slice(0, 3)}`, 70);
        await r.clicar("credenciar-primeiro");
      }
      await r.apontar("ao-vivo");
      await r.aguardar(() => ctx.estado().participants.some((p) => p.id === VITRINE_INSCRITA.id && p.checkedIn), 30000);
      await r.esperar(3000);
      return;
    }
    case 4: {
      navegar("checkin");
      await r.esperar(400);
      await r.clicar("nav-overview");
      await r.esperar(3000);
      await r.clicar("nav-evaluation");
      await r.esperar(3200);
      await r.clicar("nav-efficiency");
      await r.esperar(3000);
      return;
    }
    default:
  }
}

export async function roteiroCelular(passo: number, r: Roteiro, ctx: Ctx) {
  switch (passo) {
    case 0: {
      ctx.setTela("gestor");
      await r.aguardar(() => ctx.estado().formacoes.some((f) => f.id === MAIN_FORMACAO_ID), 40000);
      await r.esperar(3000);
      return;
    }
    case 1: {
      ctx.setTela("mensagens");
      await r.aguardar(() => ctx.estado().campanhas > 0, 30000);
      await r.esperar(1500);
      await r.clicar("link-inscricao");
      await r.esperar(1600);
      await r.rolarPara("quero-inscrever");
      await r.esperar(1200);
      return;
    }
    case 2: {
      ctx.setTela("publica");
      await r.esperar(1400);
      await r.clicar("quero-inscrever");
      await r.esperar(500);
      await r.digitar("p-nome", "Marina Duarte", 70);
      await r.digitar("p-email", "marina.duarte@rede.exemplo", 38);
      await r.escolher("p-funcao", "Coordenador(a)");
      await r.escolher("p-unidade", VITRINE_INSCRITA.unitId);
      await r.clicar("p-aceite");
      await r.clicar("p-confirmar");
      await r.esperar(3600);
      return;
    }
    case 3: {
      ctx.setTela("scanner");
      // A recepção do desktop credencia alguém pela busca antes.
      await r.esperar(5200);
      await r.clicar("ler-qr");
      await r.esperar(2500);
      await r.clicar("confirmar-credenciamento");
      await r.esperar(3000);
      return;
    }
    case 4: {
      ctx.setTela("painel");
      await r.esperar(3200);
      await r.rolarPara("painel-polos");
      await r.esperar(4000);
      return;
    }
    default:
  }
}
