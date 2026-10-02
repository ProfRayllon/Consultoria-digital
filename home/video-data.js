// ============================================================================
// VÍDEO EM DESTAQUE DA HOME
// ----------------------------------------------------------------------------
// Alimenta a seção <section id="video"> da home.
// Nada aqui exige mexer no HTML: posição, conteúdo e modo de exibição
// são todos resolvidos por este arquivo.
//
// TRÊS MODOS DE EXIBIÇÃO (resolvidos nesta ordem de prioridade):
//   1. arquivo preenchido -> <video> nativo com controles (RECOMENDADO)
//   2. embed preenchido   -> <iframe> com a peça de animação .dc.html
//   3. nenhum dos dois    -> moldura de placeholder com instruções
// ============================================================================

export default {
  ativo: true,

  // --------------------------------------------------------------------------
  // ONDE A SEÇÃO APARECE NA PÁGINA
  // A home é uma coluna e cada seção tem uma ordem fixa. Troque a string
  // abaixo e o bloco inteiro muda de lugar (o item do menu vai junto).
  //
  // Valores aceitos:
  //   "depois-do-hero"          entre Início e Soluções
  //   "depois-de-solucoes"      entre Soluções e Processo
  //   "depois-do-processo"      entre Processo e Projetos
  //   "depois-de-projetos"      entre Projetos e Ferramentas   (padrão)
  //   "depois-de-ferramentas"   entre Ferramentas e Sobre
  //   "depois-de-sobre"         entre Sobre e Atuação
  //   "depois-de-atuacao"       entre Atuação e Contato
  // --------------------------------------------------------------------------
  posicao: "depois-do-processo",

  // Rótulo no menu do topo. Deixe "" para não criar item de menu.
  navRotulo: "Vídeo",

  // Etiqueta acima do título (mesmo padrão de "Serviços" e "Metodologia").
  etiqueta: "Negócio",

  // O título sai em duas linhas. A segunda vem precedida de um "+" em azul
  // claro, que é fixo no HTML — aqui você escreve só as palavras.
  //   linha 1:  Menos planilhas.
  //   linha 2:  + gestão.
  tituloLinha1: "Menos planilhas.",
  tituloLinha2: "gestão.",

  descricao:
    "Centralize dados, processos e indicadores em uma única solução para reduzir retrabalho e tomar decisões com mais agilidade.",

  // ---- Modo 1: arquivo exportado (preencha quando exportar o MP4) ----------
  // Coloque o arquivo em home/media/ e aponte o caminho relativo aqui.
  arquivo: "", // ex.: "media/planilhas-para-sistema.mp4"
  poster: "", // ex.: "media/planilhas-para-sistema-poster.png"

  // ---- Modo 2: incorporar a peça de animação (fallback atual) --------------
  // Aponta para /Vídeo/embed.dc.html — cópia do invólucro da peça SEM a barra
  // de play/pause/scrub/download, só a tela do vídeo.
  // A animação em si (piece.jsx, animations-v3.jsx) é COMPARTILHADA: editou lá,
  // o embed já reflete. Só precisa sincronizar se você mexer no próprio
  // "Video Planilhas para Sistema.dc.html" (lista de cenas OM_SCENES ou
  // TWEAK_DEFAULTS) — aí copie a mudança para embed.dc.html também.
  //
  // VERSÕES DO VÍDEO
  //   v2 (atual, corte comercial ~56s):  embed-v2.dc.html  → piece-v2.jsx
  //   v1 (original, 68s):                embed.dc.html     → piece.jsx
  // Para voltar à v1, troque a linha abaixo por "../V%C3%ADdeo/embed.dc.html".
  // Cópia de segurança completa da pasta, intocada: /Vídeo-versao-segura-2026-10-02
  embed: "../V%C3%ADdeo/embed-v2.dc.html",

  proporcao: "16 / 9",
};
