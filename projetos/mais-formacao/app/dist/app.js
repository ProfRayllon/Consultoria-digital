/* ==========================================================================
   +Formação — Portfolio Edition
   --------------------------------------------------------------------------
   Protótipo NAVEGÁVEL, não funcional. Não há backend, autenticação real nem
   persistência: o login é uma transição roteirizada e todos os dados abaixo
   são sintéticos. Instituições, pessoas, cursos e números são fictícios e não
   correspondem a nenhuma organização real.

   Nenhuma fotografia de pessoa é usada em lugar nenhum desta demonstração:
   avatares são iniciais em círculo e as capas dos cursos são SVG gerado.
   ========================================================================== */

/* ------------------------------------------------------------------ dados */

var TRILHAS = [
  "Gestão Pedagógica",
  "Educação e Tecnologia",
  "Socioemocional",
  "Inclusão e Equidade",
  "Matemática e Ciências",
  "Linguagens",
];

var CURSOS = [
  {
    id: "c01",
    titulo: "Avaliação formativa na prática",
    trilha: "Gestão Pedagógica",
    carga: "30h",
    aberto: true,
    prazo: "Inscreva-se até 22/09, 23h59",
    desc: "Como usar a avaliação como instrumento de acompanhamento contínuo, com devolutivas que orientam o replanejamento da aula e o percurso de cada estudante.",
  },
  {
    id: "c02",
    titulo: "Dados educacionais para a gestão escolar",
    trilha: "Gestão Pedagógica",
    carga: "12 encontros",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c03",
    titulo: "Pensamento computacional na sala de aula",
    trilha: "Educação e Tecnologia",
    carga: "13 encontros",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c04",
    titulo: "Ferramentas digitais para o trabalho docente",
    trilha: "Educação e Tecnologia",
    carga: "30h",
    aberto: true,
    prazo: "Inscreva-se até 22/09, 23h59",
    desc: "Seleção, curadoria e uso pedagógico de recursos digitais no planejamento, na produção de materiais e no acompanhamento das turmas.",
  },
  {
    id: "c05",
    titulo: "Convivência e clima escolar",
    trilha: "Socioemocional",
    carga: "30h",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c06",
    titulo: "Mediação de conflitos na escola",
    trilha: "Socioemocional",
    carga: "12 encontros",
    aberto: true,
    prazo: "Inscreva-se até 22/09, 23h59",
    desc: "Estratégias de escuta, mediação e construção de acordos coletivos, com foco na rotina da sala de aula e nos espaços comuns da escola.",
  },
  {
    id: "c07",
    titulo: "Práticas inclusivas e desenho universal",
    trilha: "Inclusão e Equidade",
    carga: "12 encontros",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c08",
    titulo: "Acessibilidade e tecnologia assistiva",
    trilha: "Inclusão e Equidade",
    carga: "30h",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c09",
    titulo: "Recomposição de aprendizagens em Matemática",
    trilha: "Matemática e Ciências",
    carga: "30h",
    aberto: true,
    prazo: "Inscreva-se até 22/09, 23h59",
    desc: "Diagnóstico de defasagens, sequências de recomposição e articulação entre os objetos de conhecimento essenciais da etapa.",
  },
  {
    id: "c10",
    titulo: "Investigação científica na educação básica",
    trilha: "Matemática e Ciências",
    carga: "30h",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
  {
    id: "c11",
    titulo: "Leitura e produção textual",
    trilha: "Linguagens",
    carga: "30 encontros",
    aberto: true,
    prazo: "Inscreva-se até 22/09, 23h59",
    desc: "Práticas de leitura, escrita e reescrita ao longo de todo o percurso formativo, com critérios claros de progressão e devolutiva.",
  },
  {
    id: "c12",
    titulo: "Multiletramentos e produção multimodal",
    trilha: "Linguagens",
    carga: "30h",
    aberto: false,
    desc: "A ementa deste curso será publicada em breve.",
  },
];

/* Dados operacionais do painel administrativo (sintéticos). */
var PRODUCAO = {
  c01: { coord: "Otávio Brandão", sup: "Clarice Bittencourt", rev: "Núbia Teixeira", conteudos: 17, modulos: 4, progresso: 0, prazo: "vencido", profs: ["Vicente Aragão"] },
  c02: { coord: "Otávio Brandão", sup: "Rosana Vilela", rev: "Núbia Teixeira", conteudos: 12, modulos: 3, progresso: 44, prazo: "proximo", profs: ["Lívia Antunes", "Caio Bandeira"] },
  c03: { coord: "Ismael Fontoura", sup: "Clarice Bittencourt", rev: "Tereza Vasques", conteudos: 18, modulos: 4, progresso: 61, prazo: "ok", profs: ["Murilo Peçanha"] },
  c04: { coord: "Ismael Fontoura", sup: "Rosana Vilela", rev: "—", conteudos: 0, modulos: 0, progresso: 0, prazo: "proximo", profs: ["Sofia Rendeiro"] },
  c05: { coord: "Heloísa Quintela", sup: "Décio Aranha", rev: "Núbia Teixeira", conteudos: 15, modulos: 4, progresso: 27, prazo: "vencido", profs: ["Gustavo Meireles"] },
  c06: { coord: "Heloísa Quintela", sup: "Décio Aranha", rev: "Tereza Vasques", conteudos: 18, modulos: 3, progresso: 100, prazo: "ok", profs: ["Renan Assumpção", "Lívia Antunes"] },
  c07: { coord: "Clarice Bittencourt", sup: "Vicente Aragão", rev: "Núbia Teixeira", conteudos: 18, modulos: 3, progresso: 11, prazo: "vencido", profs: ["Sofia Rendeiro"] },
  c08: { coord: "Clarice Bittencourt", sup: "Vicente Aragão", rev: "—", conteudos: 0, modulos: 0, progresso: 0, prazo: "ok", profs: ["Caio Bandeira"] },
  c09: { coord: "Rosana Vilela", sup: "Murilo Peçanha", rev: "Tereza Vasques", conteudos: 30, modulos: 4, progresso: 100, prazo: "ok", profs: ["Gustavo Meireles", "Beatriz Lousada"] },
  c10: { coord: "Rosana Vilela", sup: "Murilo Peçanha", rev: "—", conteudos: 7, modulos: 1, progresso: 0, prazo: "vencido", profs: ["Renan Assumpção"] },
  c11: { coord: "Décio Aranha", sup: "Sofia Rendeiro", rev: "Núbia Teixeira", conteudos: 19, modulos: 4, progresso: 79, prazo: "vencido", profs: ["Beatriz Lousada", "Vicente Aragão"] },
  c12: { coord: "Décio Aranha", sup: "Sofia Rendeiro", rev: "Tereza Vasques", conteudos: 24, modulos: 3, progresso: 0, prazo: "proximo", profs: ["Lívia Antunes"] },
};

/* Percurso do cursista fictício. */
var CURSISTA = {
  nome: "Letícia Andrade",
  papel: "Professora · Núcleo Sete",
  saudacao: "Seu esforço hoje constrói novas oportunidades amanhã.",
  // Evita ecoar o nome do programa real: ver regra 2 do README.
  frase: "Quem ensina nunca para de aprender.",
  avisos: 1,
  // `situacao` é calculada em situacaoDe() a partir do progresso — assim a
  // frase nunca diverge das aulas marcadas na página do curso.
  matriculas: [
    { id: "c11", progresso: 72 },
    { id: "c09", progresso: 45 },
    { id: "c06", progresso: 100 },
    { id: "c01", progresso: 8 },
  ],
  agenda: [
    { dia: "18", mes: "set", titulo: "Encontro síncrono — Leitura e produção textual", detalhe: "19h às 21h · ambiente virtual" },
    { dia: "24", mes: "set", titulo: "Entrega — sequência didática", detalhe: "Recomposição de aprendizagens em Matemática" },
    { dia: "02", mes: "out", titulo: "Abertura do módulo 3", detalhe: "Avaliação formativa na prática" },
  ],
};

var ADMIN = { nome: "Íris Valadares", papel: "Administradora" };

/*
 * Estrutura de aulas usada na página de um curso. É a mesma para todos os
 * cursos — é um protótipo —, mas o que já está concluído é calculado a partir
 * do progresso da matrícula, então as marcas de "feito" batem com a barra.
 */
var MODULOS = [
  {
    titulo: "Módulo 1",
    subtitulo: "Fundamentos",
    nivel: "Básico",
    objetivos: [
      "Reconhecer os conceitos que sustentam a prática",
      "Relacionar a teoria ao que já acontece na sua escola",
      "Identificar o ponto de partida da sua turma",
    ],
    aulas: [
      { nome: "O que a pesquisa mostra sobre o tema", tipo: "video", dur: "12 min" },
      { nome: "Conceitos que sustentam a prática", tipo: "video", dur: "18 min" },
      { nome: "Leitura: texto-base do módulo", tipo: "texto", dur: "20 min" },
      { nome: "Atividade do módulo", tipo: "quiz", dur: "25 min" },
    ],
  },
  {
    titulo: "Módulo 2",
    subtitulo: "Da teoria à sala de aula",
    nivel: "Básico",
    objetivos: [
      "Planejar a atividade definindo objetivo e público",
      "Organizar as etapas em uma sequência clara",
      "Aplicar as estratégias na prática, com a sua turma",
    ],
    aulas: [
      { nome: "Planejamento da prática", tipo: "video", dur: "12 min" },
      { nome: "Estudo de caso comentado", tipo: "video", dur: "16 min" },
      { nome: "Roteiro de observação de aula", tipo: "texto", dur: "15 min" },
      { nome: "Atividade do módulo", tipo: "quiz", dur: "25 min" },
    ],
  },
  {
    titulo: "Módulo 3",
    subtitulo: "Práticas e aplicação",
    nivel: "Intermediário",
    objetivos: [
      "Escolher critérios de avaliação coerentes com o objetivo",
      "Construir devolutivas que orientem o replanejamento",
      "Registrar evidências do percurso da turma",
    ],
    aulas: [
      { nome: "Critérios que orientam o replanejamento", tipo: "video", dur: "19 min" },
      { nome: "Modelos de devolutiva comentados", tipo: "texto", dur: "18 min" },
      { nome: "Fórum: devolutivas que funcionaram", tipo: "forum", dur: "—" },
      { nome: "Atividade do módulo", tipo: "quiz", dur: "30 min" },
    ],
  },
  {
    titulo: "Módulo 4",
    subtitulo: "Projeto integrador",
    nivel: "Avançado",
    objetivos: [
      "Reunir o que foi produzido ao longo do curso",
      "Adequar o produto final à rubrica de avaliação",
      "Planejar a continuidade depois da formação",
    ],
    aulas: [
      { nome: "Orientações para o produto final", tipo: "video", dur: "12 min" },
      { nome: "Rubrica de avaliação", tipo: "texto", dur: "10 min" },
      { nome: "Entrega do produto final", tipo: "quiz", dur: "—" },
      { nome: "Encerramento e próximos passos", tipo: "video", dur: "8 min" },
    ],
  },
];

var TOTAL_AULAS = MODULOS.reduce(function (n, m) { return n + m.aulas.length; }, 0);

/* Acessos rápidos do rodapé da área do cursista. */
var ATALHOS = [
  { ico: "texto", titulo: "Guia do cursista", desc: "Acesse o guia e tire suas dúvidas" },
  { ico: "agenda", titulo: "Calendário", desc: "Veja os próximos encontros" },
  { ico: "pasta", titulo: "Materiais complementares", desc: "Acesse artigos, vídeos e mais" },
];

/*
 * Carrossel do hero. Cada item procura o arquivo em `imagens/hero/`; se ele
 * não existir, o <img> se remove sozinho e fica o fundo gerado por código —
 * a demo funciona com a pasta vazia. Para trocar, basta soltar os arquivos
 * com estes nomes (ou editar `arquivo` aqui).
 *
 * ATENÇÃO: não use fotos de pessoas identificáveis nem imagens vindas do
 * sistema original. Veja as regras em ../../README.md.
 */
var HERO_SLIDES = [
  { arquivo: "imagens/hero/hero-1.jpg", alt: "Professora estudando em ambiente de trabalho" },
  // A área livre desta imagem está à direita; espelhada, ela passa para a
  // esquerda e o texto do hero não cai em cima da pessoa.
  { arquivo: "imagens/hero/hero-2.jpg", alt: "Professora com tablet em sala de estudos", espelhar: true },
  { arquivo: "imagens/hero/hero-3.jpg", alt: "Equipe docente trabalhando em conjunto" },
];

/*
 * Contadores da home. `valor` é número para permitir a animação de contagem.
 *   rotulo    — legenda curta, usada no hero
 *   resultado — legenda da seção "Resultados do ciclo"
 *   detalhe   — frase que substitui a legenda quando o mouse passa pelo card
 */
var NUMEROS = [
  {
    valor: 9400, prefixo: "+", sufixo: "", rotulo: "cursistas",
    resultado: "cursistas alcançados",
    detalhe: "Profissionais da rede inscritos em pelo menos uma trilha do ciclo.",
  },
  {
    valor: 180, prefixo: "+", sufixo: "h", rotulo: "de formação",
    resultado: "de formação ofertada",
    detalhe: "Carga horária somada das trilhas abertas, entre encontros e atividades.",
  },
  {
    valor: 94, prefixo: "+", sufixo: "%", rotulo: "de satisfação",
    resultado: "de satisfação declarada",
    detalhe: "Média das avaliações preenchidas ao final de cada curso concluído.",
  },
];

/* A seção de resultados usa os mesmos três indicadores mais a certificação. */
var RESULTADOS = NUMEROS.concat([
  {
    valor: 100, prefixo: "", sufixo: "%",
    resultado: "de certificados emitidos",
    detalhe: "Emissão automática para quem conclui 100% das atividades do curso.",
  },
]);

function fmtNumero(n) {
  return n.prefixo + n.valor.toLocaleString("pt-BR") + n.sufixo;
}

/* --------------------------------------------------------------- utilidades */

var app = document.getElementById("app");

/* Escapa texto vindo de dados antes de interpolar no HTML. */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function iniciais(nome) {
  var partes = String(nome).trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/* Cor determinística por nome — nunca uma foto. */
var CORES_AVATAR = ["#14295A", "#1D3C7E", "#2B72E8", "#1A56C4", "#3B5BA8", "#2F4B7C", "#4A7FD4", "#0F2044"];
function corDe(texto) {
  var soma = 0;
  for (var i = 0; i < texto.length; i++) soma = (soma + texto.charCodeAt(i) * (i + 3)) % 9973;
  return CORES_AVATAR[soma % CORES_AVATAR.length];
}

function avatar(nome, tamanho) {
  return (
    '<div class="avatar avatar-' + (tamanho || "md") + '" style="background:' + corDe(nome) + '" ' +
    'title="' + esc(nome) + '" aria-label="' + esc(nome) + '">' + esc(iniciais(nome)) + "</div>"
  );
}

/* Ícones — traço único, herdam currentColor. */
var ICON = {
  busca: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  entrar: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  usuario: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  cadeado: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  olho: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  livro: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  medalha: '<circle cx="12" cy="9" r="6"/><path d="M8.2 14.3L7 22l5-3 5 3-1.2-7.7"/>',
  grafico: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
  grupo: '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  presenca: '<path d="M9 11l3 3 6-6"/><rect x="3" y="4" width="18" height="17" rx="2"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  chevronE: '<path d="M15 6l-6 6 6 6"/>',
  baixar: '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 21h16"/>',
  lupaPeq: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  casa: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
  pasta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/>',
  ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4"/><path d="M12 17.2h.01"/>',
  sino: '<path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  filtro: '<path d="M3 5h18M7 12h10M10 19h4"/>',
  reticencias: '<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>',
  play: '<path d="M7 4.5l12 7.5-12 7.5z"/>',
  feito: '<circle cx="12" cy="12" r="9"/><path d="M8.2 12.4l2.6 2.6 5-5.4"/>',
  texto: '<path d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M8.5 13.5h7M8.5 17h4.5"/>',
  forum: '<path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
  atividade: '<path d="M9 3h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a1 1 0 0 1 1-1z"/><path d="M9 13l2 2 4-4"/>',
  circulo: '<circle cx="12" cy="12" r="8.5"/>',
  emCurso: '<circle cx="12" cy="12" r="8.5" opacity=".3"/><path d="M12 3.5a8.5 8.5 0 0 1 6 14.5"/>',
  som: '<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M16 9.2a4 4 0 0 1 0 5.6"/><path d="M18.5 6.7a7.5 7.5 0 0 1 0 10.6"/>',
  engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.7 7.9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H8a1.6 1.6 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V8a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  expandir: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M16 21h3a2 2 0 0 0 2-2v-3M8 21H5a2 2 0 0 1-2-2v-3"/>',
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>',
  nivel: '<path d="M5 20V13M12 20V8M19 20V4"/>',
};

function ico(nome, tamanho) {
  var s = tamanho || 18;
  return (
    '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[nome] + "</svg>"
  );
}

/* --------------------------------------------- capas geradas (sem fotos) */

var PALETAS = {
  "Gestão Pedagógica": ["#14295A", "#3B5BA8"],
  "Educação e Tecnologia": ["#0E3F7A", "#3B86F7"],
  "Socioemocional": ["#1A56C4", "#6BA6FF"],
  "Inclusão e Equidade": ["#1D3C7E", "#2B72E8"],
  "Matemática e Ciências": ["#0A1428", "#2F4B7C"],
  "Linguagens": ["#123E6E", "#4A9BD8"],
};

/*
 * Capa abstrata determinística. Substitui as fotografias de pessoas do
 * sistema original: mesma função visual, nenhuma identidade envolvida.
 */
function capa(curso, opcoes) {
  var o = opcoes || {};
  var p = PALETAS[curso.trilha] || ["#16295C", "#3B5BA8"];
  var n = parseInt(curso.id.replace(/\D/g, ""), 10) || 1;
  var gid = "g-" + curso.id + (o.sufixo || "");
  var giro = (n * 37) % 360;
  var formas = "";

  if (n % 3 === 0) {
    formas =
      '<circle cx="132" cy="26" r="58" fill="#fff" opacity=".10"/>' +
      '<circle cx="132" cy="26" r="36" fill="#fff" opacity=".12"/>' +
      '<path d="M0 84 L60 46 L104 70 L160 34 V100 H0Z" fill="#fff" opacity=".08"/>';
  } else if (n % 3 === 1) {
    formas =
      '<path d="M-10 74 Q42 34 84 62 T172 44" stroke="#fff" stroke-opacity=".22" stroke-width="2.5" fill="none"/>' +
      '<path d="M-10 88 Q42 48 84 76 T172 58" stroke="#fff" stroke-opacity=".13" stroke-width="2.5" fill="none"/>' +
      '<circle cx="128" cy="30" r="20" fill="#fff" opacity=".14"/>';
  } else {
    formas =
      '<rect x="96" y="-14" width="52" height="52" rx="12" fill="#fff" opacity=".12" transform="rotate(' + giro + ' 122 12)"/>' +
      '<rect x="14" y="52" width="44" height="44" rx="10" fill="#fff" opacity=".09"/>' +
      '<path d="M60 100 L108 44 L160 100Z" fill="#fff" opacity=".07"/>';
  }

  return (
    '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img" ' +
    'aria-label="Ilustração abstrata do curso ' + esc(curso.titulo) + '">' +
    '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/>' +
    "</linearGradient></defs>" +
    '<rect width="160" height="100" fill="url(#' + gid + ')"/>' +
    formas +
    "</svg>"
  );
}

/* Fundo gerado de cada slide — o que aparece antes de entrarem as fotos. */
function capaSlide(i) {
  var duplas = [["#0A1428", "#1D3C7E"], ["#123E6E", "#3B86F7"], ["#14295A", "#2B72E8"], ["#0F2044", "#4A7FD4"]];
  var d = duplas[i % duplas.length];
  var gid = "s" + i;
  var formas = [
    '<circle cx="230" cy="70" r="96" fill="#fff" opacity=".09"/><circle cx="230" cy="70" r="58" fill="#fff" opacity=".10"/><path d="M0 220 L88 150 L162 196 L300 116 V300 H0Z" fill="#fff" opacity=".07"/>',
    '<path d="M-10 190 Q70 120 150 168 T310 120" stroke="#fff" stroke-opacity=".22" stroke-width="4" fill="none"/><path d="M-10 218 Q70 148 150 196 T310 148" stroke="#fff" stroke-opacity=".13" stroke-width="4" fill="none"/><circle cx="238" cy="76" r="40" fill="#fff" opacity=".13"/>',
    '<rect x="168" y="24" width="104" height="104" rx="26" fill="#fff" opacity=".11" transform="rotate(18 220 76)"/><rect x="28" y="150" width="86" height="86" rx="20" fill="#fff" opacity=".08"/><path d="M110 300 L200 176 L296 300Z" fill="#fff" opacity=".07"/>',
    '<path d="M0 0h300v300H0z" fill="none"/><g stroke="#fff" stroke-opacity=".16" stroke-width="2"><path d="M40 0v300M110 0v300M180 0v300M250 0v300"/></g><circle cx="215" cy="88" r="66" fill="#fff" opacity=".10"/><rect x="26" y="196" width="140" height="10" rx="5" fill="#fff" opacity=".18"/><rect x="26" y="218" width="92" height="10" rx="5" fill="#fff" opacity=".11"/>',
  ][i % 4];
  return (
    '<svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + d[0] + '"/><stop offset="1" stop-color="' + d[1] + '"/>' +
    "</linearGradient></defs>" +
    '<rect width="300" height="300" fill="url(#' + gid + ')"/>' + formas +
    "</svg>"
  );
}

/*
 * Capa de um curso: foto por cima, ilustração gerada por baixo.
 *
 * O arquivo padrão é `imagens/cursos/<id>.png`, com `.jpg` como segunda
 * tentativa — os dois funcionam. Um curso pode apontar outro caminho pelo
 * campo `imagem`, e aí só esse é tentado. Não achando nada, a ilustração
 * assume: o catálogo nunca fica com buraco.
 *
 * Usada só no catálogo e no carrossel da home. No painel e nas miniaturas a
 * capa é sempre a ilustração — ver comentário em cardAdmin().
 */
function capaCurso(c, opcoes) {
  var o = opcoes || {};
  var principal = c.imagem || "imagens/cursos/" + c.id + ".png";
  var reserva = c.imagem ? "" : "imagens/cursos/" + c.id + ".jpg";
  return (
    '<div class="cover-ph">' + capa(c, o) + "</div>" +
    '<img class="cover-img" src="' + esc(principal) + '" alt="' + esc(c.titulo) + '" loading="lazy" ' +
    'data-reserva="' + esc(reserva) + '" onerror="proximaCapa(this)" />'
  );
}

/* Tenta a segunda extensão; esgotada, some e deixa a ilustração aparecer. */
function proximaCapa(img) {
  var reserva = img.getAttribute("data-reserva");
  if (reserva) {
    img.setAttribute("data-reserva", "");
    img.src = reserva;
    return;
  }
  img.remove();
}

/* ------------------------------------------------------------------ toast */

var toastTimer = null;
function toast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(function () { t.classList.add("is-on"); });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    t.classList.remove("is-on");
    setTimeout(function () { t.hidden = true; }, 260);
  }, 2600);
}

/* Ações que existem no sistema real mas não nesta demonstração. */
var AVISOS = {
  whatsapp: "O atendimento por WhatsApp existe no sistema real. Aqui o botão é só demonstração.",
  aula: "A aula abre no ambiente virtual do sistema real. Nesta demonstração o player é ilustrativo.",
  material: "O download dos materiais acontece no sistema real.",
  suporte: "O canal de suporte existe no sistema real. Aqui é só demonstração.",
  menu: "Esta área existe no sistema real. A demonstração cobre Início e Meus cursos.",
  certificado: "A emissão de certificado acontece no sistema real. Aqui é só demonstração.",
};

function naDemo(acao) {
  toast(AVISOS[acao] || "Disponível no sistema completo — esta é uma demonstração de portfólio.");
}

/* --------------------------------------------------------- blocos comuns */

/*
 * A logo é o lockup completo (ícone + palavra). Se o arquivo faltar, o onerror
 * marca o link e o CSS revela a versão desenhada em código — a marca nunca some.
 */
function marca(escuro) {
  return (
    '<a class="brand' + (escuro ? " brand-on-dark" : "") + '" href="#/">' +
    '<img class="brand-logo" src="imagens/marca/logo.png" alt="+Formação" ' +
    "onerror=\"this.closest('.brand').classList.add('sem-logo'); this.remove()\" />" +
    '<span class="brand-fallback">' +
    '<span class="brand-mark"></span>' +
    '<span class="brand-text">' +
    '<span class="brand-name">Formação</span>' +
    '<span class="brand-sub">Instituto Meridiano</span>' +
    "</span></span></a>"
  );
}

function header(ativo) {
  function item(href, rot, chave) {
    var on = chave && ativo === chave;
    return '<a href="' + href + '"' + (on ? ' class="is-active"' : "") + ">" + rot + "</a>";
  }
  return (
    '<header class="site-header"><div class="wrap">' +
    marca(false) +
    '<nav class="site-nav">' +
    item("#/", "Início", "home") +
    item("#/cursos", "Cursos", "cursos") +
    item("#/#plataforma", "A plataforma", "plataforma") +
    item("#/#guias", "Guias", "guias") +
    '<a class="btn btn-ghost btn-sm" href="#/admin" style="margin-left:8px">' + ico("cadeado", 14) + "Área administrativa</a>" +
    '<a class="btn btn-navy btn-sm" href="#/entrar">' + ico("entrar", 15) + "Área do cursista</a>" +
    "</nav></div></header>"
  );
}

function footer() {
  return (
    '<footer class="site-footer"><div class="wrap">' +
    '<div class="footer-cols">' +
    "<div>" +
    "<h4>Instituto Meridiano</h4>" +
    "<p>Coordenação de Formação Continuada da Rede Meridiano de Ensino</p>" +
    '<p style="margin-top:12px">Av. das Nascentes, 1200 — Bloco C</p>' +
    "<p>Distrito Central · CEP 00000-000</p>" +
    "</div>" +
    "<div>" +
    "<h4>Fale conosco</h4>" +
    '<p class="footer-label">E-mail</p>' +
    '<p style="color:var(--ink);font-weight:600">contato@maisformacao.exemplo</p>' +
    '<p class="footer-label" style="margin-top:12px">Redes</p>' +
    '<p style="color:var(--ink);font-weight:600">@maisformacao</p>' +
    "</div>" +
    "</div>" +
    '<div class="footer-bottom">' +
    "Portfolio Edition — protótipo de demonstração. Instituições, pessoas e dados são fictícios." +
    '<br />&copy; ' + new Date().getFullYear() + ' +Formação · Instituto Meridiano (fictício)' +
    ' · <a href="#/admin" style="color:var(--faint)">' + ico("cadeado", 11) + " Acesso administrativo</a>" +
    "</div>" +
    "</div></footer>"
  );
}

/*
 * Fundo do hero: banner em largura total que troca de imagem.
 * Cada slide tem um fundo gerado por baixo do <img>; se o arquivo faltar, o
 * onerror remove a imagem e sobra o fundo — a home nunca fica quebrada.
 */
function carrossel() {
  return (
    '<div class="hero-bg" id="carousel">' +
    HERO_SLIDES.map(function (sl, i) {
      return (
        '<figure class="slide' + (i === 0 ? " is-on" : "") + (sl.espelhar ? " flip" : "") + '">' +
        '<div class="slide-ph">' + capaSlide(i) + "</div>" +
        '<img src="' + esc(sl.arquivo) + '" alt="' + esc(sl.alt || "") + '" onerror="this.remove()" />' +
        "</figure>"
      );
    }).join("") +
    "</div>" +
    '<div class="hero-scrim"></div>'
  );
}

/* Setas discretas nas laterais do banner e pontos centrados na base. */
function controlesCarrossel() {
  if (HERO_SLIDES.length < 2) return "";
  return (
    '<button class="car-btn car-prev" data-car="-1" aria-label="Imagem anterior">' + ico("chevronE", 18) + "</button>" +
    '<button class="car-btn car-next" data-car="1" aria-label="Próxima imagem">' + ico("chevron", 18) + "</button>" +
    '<div class="car-dots">' +
    HERO_SLIDES.map(function (_, i) {
      return '<button class="car-dot' + (i === 0 ? " is-on" : "") + '" data-dot="' + i + '" aria-label="Imagem ' + (i + 1) + '"></button>';
    }).join("") +
    "</div>"
  );
}

/* Faixa rolante. O conteúdo é duplicado porque a animação vai até -50%. */
function marquee() {
  var itens = TRILHAS.concat(["Certificação", "Ambiente virtual", "Acompanhamento de turmas"]);
  var bloco = itens.map(function (t) { return '<span class="marquee-item">' + esc(t) + "</span>"; }).join("");
  return '<div class="marquee" aria-hidden="true"><div class="marquee-track">' + bloco + bloco + "</div></div>";
}

/* Card de curso do catálogo e da home. */
function cardCurso(c) {
  var aberto = c.aberto;
  return (
    '<article class="course-card">' +
    '<div class="course-cover' + (aberto ? "" : " is-muted") + '">' +
    capaCurso(c) +
    '<span class="badge ' + (aberto ? "badge-open" : "badge-soon") + '">' +
    (aberto ? "Inscrições abertas" : "Em breve") +
    "</span>" +
    "</div>" +
    '<div class="course-body">' +
    '<div class="course-meta">' +
    '<span class="tag">' + esc(c.trilha) + "</span>" +
    '<span class="course-hours">' + ico("relogio", 12) + " " + esc(c.carga) + "</span>" +
    "</div>" +
    '<h3 class="course-title">' + esc(c.titulo) + "</h3>" +
    (c.prazo ? '<p class="course-deadline" style="margin:0">' + esc(c.prazo) + "</p>" : "") +
    '<p class="course-desc" style="margin:0">' + esc(c.desc) + "</p>" +
    '<div class="course-actions">' +
    '<button class="btn btn-ghost btn-sm" data-acao="ementa">Saber mais</button>' +
    (aberto
      ? '<a class="btn btn-primary btn-sm" href="#/entrar">' + ico("entrar", 14) + "Inscrever-se</a>"
      : '<button class="btn btn-ghost btn-sm" disabled>Em breve</button>') +
    "</div>" +
    "</div></article>"
  );
}

/* ---------------------------------------------------------------- página 1
   Home pública
   ------------------------------------------------------------------------ */

function viewHome() {
  var destaque = CURSOS.slice(0, 8);

  var fluxo = [
    ["Faça login", "Entre com as credenciais enviadas pela coordenação do seu núcleo."],
    ["Atualize seus dados", "Confira seus dados cadastrais — eles alimentam a emissão dos certificados."],
    ["Explore o catálogo", "Veja os cursos abertos e as ementas de cada trilha formativa."],
    ["Inscreva-se", "Escolha quantos cursos quiser, entre os que estiverem com inscrição aberta."],
    ["Acesse o ambiente", "Entre no curso pelo ambiente virtual, na data definida para o início."],
    ["Conclua e certifique", "Finalize as atividades e emita o certificado direto na plataforma."],
  ];

  var celulas = "";
  var intensidades = [1, 2, 1, 3, 2, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1];
  for (var i = 0; i < intensidades.length; i++) {
    celulas += '<div class="net-cell lvl-' + intensidades[i] + '" data-cell="' + i + '"></div>';
  }

  return (
    header("home") +

    /* Hero */
    '<section class="hero">' +
    carrossel() +
    '<div class="wrap"><div class="hero-inner">' +
    "<h1>Trilhas formativas para <em>fortalecer a prática</em> de quem ensina</h1>" +
    '<p class="lead lead-light">A plataforma reúne o catálogo de cursos, a inscrição do cursista, o ambiente de aulas e o acompanhamento da produção pedagógica em um único lugar.</p>' +
    '<div class="hero-actions">' +
    '<a class="btn btn-light" href="#/cursos">Ver catálogo' + ico("seta", 15) + "</a>" +
    '<a class="btn btn-outline-light" href="#/entrar">Área do cursista</a>' +
    "</div>" +
    '<div class="hero-stats">' +
    NUMEROS.map(function (n) {
      return (
        '<div class="hero-stat">' +
        '<b data-conta="' + n.valor + '" data-prefixo="' + n.prefixo + '" data-sufixo="' + n.sufixo + '">' +
        n.prefixo + "0" + n.sufixo + "</b>" +
        "<span>" + esc(n.rotulo) + "</span></div>"
      );
    }).join("") +
    "</div>" +
    "</div></div>" +
    controlesCarrossel() +
    "</section>" +

    marquee() +

    /* Catálogo em carrossel */
    '<section class="section" id="cursos">' +
    '<div class="wrap">' +
    '<div class="rail-head">' +
    "<div>" +
    '<p class="eyebrow">Catálogo 2026</p>' +
    "<h2>Trilhas formativas</h2>" +
    '<p class="lead">Percursos desenhados para fortalecer a prática pedagógica e a gestão da aprendizagem na rede.</p>' +
    "</div>" +
    '<a class="link-more" href="#/cursos">Ver catálogo completo →</a>' +
    "</div>" +
    '<div class="rail-viewport">' +
    '<button class="rail-btn prev" data-rail="-1" aria-label="Anterior">' + ico("chevronE", 16) + "</button>" +
    '<div class="rail" id="rail">' + destaque.map(cardCurso).join("") + "</div>" +
    '<button class="rail-btn next" data-rail="1" aria-label="Próximo">' + ico("chevron", 16) + "</button>" +
    "</div>" +
    "</div></section>" +

    /* A plataforma */
    '<section class="section band-dark" id="plataforma"><div class="wrap wrap-narrow center">' +
    '<p class="eyebrow eyebrow-light">A plataforma</p>' +
    "<h2>Um único ambiente, do catálogo ao certificado</h2>" +
    '<p class="lead lead-light" style="margin:14px auto 0">A +Formação organiza o ciclo inteiro da formação continuada: a vitrine pública dos cursos, a inscrição e o percurso de cada cursista, o ambiente de aulas e o back-office que acompanha a produção de conteúdo, a frequência e a emissão de certificados.</p>' +
    "</div></section>" +

    /* Fluxo */
    '<section class="section"><div class="wrap">' +
    '<p class="eyebrow">Passo a passo</p>' +
    "<h2>Fluxo de acesso aos cursos</h2>" +
    '<div class="flow">' +
    fluxo
      .map(function (p, idx) {
        return (
          '<div class="flow-step">' +
          '<div class="flow-num">' + (idx + 1) + "</div>" +
          "<h4>" + p[0] + "</h4><p>" + p[1] + "</p>" +
          "</div>"
        );
      })
      .join("") +
    "</div>" +
    "</div></section>" +

    /* Guias */
    '<section class="section-tight band-dark" id="guias"><div class="wrap" style="display:flex;align-items:center;gap:36px;flex-wrap:wrap;padding-top:34px;padding-bottom:34px">' +
    '<div style="flex:1;min-width:260px">' +
    '<p class="eyebrow eyebrow-light">Material de apoio</p>' +
    "<h2>Guias da plataforma</h2>" +
    '<p class="lead lead-light">Materiais para navegar no ambiente virtual, acompanhar as trilhas e emitir o certificado.</p>' +
    "</div>" +
    '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
    '<button class="btn btn-light" data-acao="guia">' + ico("baixar", 15) + "Guia do cursista</button>" +
    '<button class="btn btn-outline-light" data-acao="guia">' + ico("baixar", 15) + "Tutorial do ambiente</button>" +
    "</div>" +
    "</div></section>" +

    /* Alcance — grade abstrata, nunca um mapa real */
    '<section class="section"><div class="wrap">' +
    '<p class="eyebrow">Alcance da rede</p>' +
    "<h2>Formação em toda a rede</h2>" +
    '<div class="reach mt-32">' +
    '<div class="net-grid" id="net">' + celulas + "</div>" +
    '<div class="reach-figure">' +
    '<span>Núcleo em destaque</span>' +
    "<h3 id=\"net-nome\">Núcleo Sete</h3>" +
    '<b id="net-num">+420</b>' +
    '<span style="color:var(--faint);font-weight:600">inscrições no ciclo</span>' +
    '<p class="lead" style="font-size:13px;margin-top:14px">Passe o mouse pelos núcleos para comparar a adesão. Representação esquemática — sem recorte geográfico real.</p>' +
    "</div>" +
    "</div>" +
    "</div></section>" +

    /* Ambiente virtual */
    '<section class="section band-sky"><div class="wrap center">' +
    '<p class="eyebrow">Ambiente virtual</p>' +
    '<h2>Acesse o <span style="color:var(--blue-700)">Ambiente +Formação</span></h2>' +
    '<p class="lead" style="margin:14px auto 0">Aulas, materiais, atividades e acompanhamento do percurso. O acesso é liberado após a confirmação da inscrição no curso.</p>' +
    '<div class="stack-cta"><a class="btn btn-primary" href="#/entrar">Entrar no ambiente' + ico("seta", 15) + "</a></div>" +
    "</div></section>" +

    /* Resultados */
    '<section class="section band-soft"><div class="wrap">' +
    '<p class="eyebrow">Números</p>' +
    "<h2>Resultados do ciclo</h2>" +
    '<div class="results-bloco mt-32">' +
    '<figure class="results-figura">' +
    '<img src="imagens/numeros/img-numeros.png" alt="Cursista acompanhando uma aula do ambiente virtual" loading="lazy" />' +
    "</figure>" +
    '<div class="results">' +
    RESULTADOS.map(function (n) {
      return (
        '<article class="result-card">' +
        "<b>" + fmtNumero(n) + "</b>" +
        '<div class="result-texto">' +
        '<span class="result-rotulo">' + esc(n.resultado) + "</span>" +
        '<span class="result-detalhe">' + esc(n.detalhe) + "</span>" +
        "</div></article>"
      );
    }).join("") +
    "</div>" +
    "</div>" +
    "</div></section>" +

    footer()
  );
}

/* ---------------------------------------------------------------- página 2
   Catálogo de cursos
   ------------------------------------------------------------------------ */

var filtroTrilha = "Todos";
var filtroBusca = "";

function cursosFiltrados() {
  var termo = filtroBusca.trim().toLowerCase();
  return CURSOS.filter(function (c) {
    var okTrilha = filtroTrilha === "Todos" || c.trilha === filtroTrilha;
    var okBusca = !termo || (c.titulo + " " + c.trilha + " " + c.desc).toLowerCase().indexOf(termo) >= 0;
    return okTrilha && okBusca;
  });
}

function pintarGrade() {
  var grade = document.getElementById("grade");
  if (!grade) return;
  var lista = cursosFiltrados();
  grade.className = lista.length ? "course-grid" : "";
  grade.innerHTML = lista.length
    ? lista.map(cardCurso).join("")
    : '<p class="empty-state">Nenhum curso encontrado para esse filtro.</p>';
  var contador = document.getElementById("contador");
  if (contador) contador.textContent = lista.length + (lista.length === 1 ? " curso" : " cursos");
}

function viewCursos() {
  return (
    header("cursos") +
    '<section class="page-band"><div class="wrap">' +
    '<span class="pill">Catálogo 2026</span>' +
    "<h1>Trilhas formativas</h1>" +
    '<p class="lead lead-light">Consulte os cursos da plataforma, veja as ementas e inscreva-se nos que estiverem com inscrição aberta.</p>' +
    "</div></section>" +
    '<section class="section"><div class="wrap">' +
    '<div class="search-box">' +
    '<span class="ico">' + ico("busca", 17) + "</span>" +
    '<input id="busca" type="search" placeholder="Buscar curso, trilha ou tema..." autocomplete="off" />' +
    "</div>" +
    '<div class="chips" id="chips">' +
    ["Todos"]
      .concat(TRILHAS)
      .map(function (t) {
        return '<button class="chip' + (t === filtroTrilha ? " is-active" : "") + '" data-trilha="' + esc(t) + '">' + esc(t) + "</button>";
      })
      .join("") +
    "</div>" +
    '<p class="lead" style="font-size:13px;margin:18px 0 0" id="contador"></p>' +
    '<div id="grade" class="course-grid mt-16"></div>' +
    "</div></section>" +
    footer()
  );
}

/* ---------------------------------------------------------------- página 3
   Login do cursista — transição roteirizada, sem autenticação real
   ------------------------------------------------------------------------ */

function viewEntrar() {
  return (
    '<div class="auth-shell">' +
    '<div class="auth-top"><div class="wrap">' +
    marca(false) +
    '<a class="auth-back" href="#/">← Voltar ao site</a>' +
    "</div></div>" +
    '<section class="page-band"><div class="wrap">' +
    '<span class="pill">Área do cursista</span>' +
    "<h1>Entre na sua conta</h1>" +
    '<p class="lead lead-light">Acesse para atualizar seus dados, inscrever-se nos cursos e acompanhar o seu percurso.</p>' +
    "</div></section>" +
    '<div class="auth-main"><div class="wrap" style="display:flex;justify-content:center">' +
    '<form class="auth-card" id="form-login">' +
    "<h3>Acesso do cursista</h3>" +
    '<div class="field">' +
    "<label for=\"doc\">Matrícula</label>" +
    '<div class="ctrl"><span class="ico">' + ico("usuario", 16) + "</span>" +
    '<input id="doc" type="text" placeholder="0000000" autocomplete="off" /></div>' +
    "</div>" +
    '<div class="field">' +
    "<label for=\"senha\">Senha</label>" +
    '<div class="ctrl"><span class="ico">' + ico("cadeado", 16) + "</span>" +
    '<input id="senha" type="password" placeholder="Sua senha" autocomplete="off" />' +
    '<button type="button" class="eye" id="ver-senha" aria-label="Mostrar senha">' + ico("olho", 16) + "</button></div>" +
    "</div>" +
    '<button class="btn btn-primary btn-block" type="submit">' + ico("entrar", 15) + "Entrar</button>" +
    '<p class="auth-hint">Primeiro acesso ou esqueceu a senha? Procure a coordenação do seu núcleo.</p>' +
    '<div class="auth-note"><b>Demonstração:</b> não há autenticação real nem envio de dados. Clique em <b>Entrar</b> com os campos vazios para ver a área do cursista.</div>' +
    "</form>" +
    "</div></div>" +
    footer() +
    "</div>"
  );
}

/* ---------------------------------------------------------------- página 4
   Área do cursista — casca própria (barra lateral + topo), fora do site público
   ------------------------------------------------------------------------ */

var MENU_ALUNO = [
  ["inicio", "casa", "Início", "#/aluno"],
  ["cursos", "livro", "Meus cursos", "#/aluno"],
  ["certificados", "medalha", "Certificados", ""],
  ["calendario", "agenda", "Calendário", ""],
  ["materiais", "pasta", "Materiais", ""],
  ["mensagens", "email", "Mensagens", ""],
  ["suporte", "ajuda", "Suporte", ""],
];

function ladoAluno(ativo) {
  return (
    '<aside class="al-side">' +
    '<div class="al-side-marca">' + marca(false) + "</div>" +
    '<nav class="al-nav">' +
    MENU_ALUNO.map(function (m) {
      var on = m[0] === ativo ? ' class="is-on"' : "";
      // Só Início e Meus cursos navegam; o resto avisa que é demonstração.
      return m[3]
        ? '<a href="' + m[3] + '"' + on + ">" + ico(m[1], 17) + m[2] + "</a>"
        : '<button data-acao="menu"' + on + ">" + ico(m[1], 17) + m[2] + "</button>";
    }).join("") +
    "</nav>" +
    '<div class="al-ajuda">' +
    '<div class="al-ajuda-ico">' + ico("ajuda", 18) + "</div>" +
    "<b>Precisa de ajuda?</b>" +
    "<p>Nossa equipe está pronta para te atender.</p>" +
    '<button class="btn btn-primary btn-sm btn-block" data-acao="suporte">Abrir suporte</button>' +
    "</div>" +
    "</aside>"
  );
}

function topoAluno() {
  return (
    '<header class="al-top">' +
    '<div class="al-busca">' +
    '<span class="ico">' + ico("busca", 16) + "</span>" +
    '<input type="search" placeholder="Buscar cursos, conteúdos ou avisos..." data-acao="busca-geral" readonly />' +
    "</div>" +
    '<button class="al-sino" data-acao="avisos" aria-label="Avisos">' +
    ico("sino", 19) +
    (CURSISTA.avisos ? '<i class="al-badge">' + CURSISTA.avisos + "</i>" : "") +
    "</button>" +
    '<button class="al-usuario" data-acao="conta">' +
    avatar(CURSISTA.nome, "md") +
    "<span>Olá, " + esc(CURSISTA.nome.split(" ")[0]) + "</span>" +
    ico("chevron", 14) +
    "</button>" +
    "</header>"
  );
}

function rodapeAluno() {
  return (
    '<footer class="al-rodape">' +
    "<div><b>Instituto Meridiano</b><span>Coordenação de Formação Continuada da Rede Meridiano de Ensino</span></div>" +
    "<div><span>Av. das Nascentes, 1200 — Bloco C</span><span>Distrito Central · CEP 00000-000</span></div>" +
    "<div><span>&copy; " + new Date().getFullYear() + " +Formação</span>" +
    '<span class="al-aviso">Portfolio Edition — protótipo de demonstração. Instituições, pessoas e dados são fictícios.</span></div>' +
    "</footer>"
  );
}

/* ---- listagem "Meus cursos": abas e busca ---- */

var ABAS_ALUNO = [
  ["todos", "Todos"],
  ["andamento", "Em andamento"],
  ["concluidos", "Concluídos"],
  ["nao", "Não iniciados"],
];

var alunoAba = "todos";
var alunoBusca = "";

function cursoPorId(id) {
  return CURSOS.filter(function (c) { return c.id === id; })[0];
}

function matriculasDe(aba) {
  return CURSISTA.matriculas.filter(function (m) {
    if (aba === "andamento") return m.progresso > 0 && m.progresso < 100;
    if (aba === "concluidos") return m.progresso >= 100;
    if (aba === "nao") return m.progresso === 0;
    return true;
  });
}

function matriculasVisiveis() {
  var termo = alunoBusca.trim().toLowerCase();
  return matriculasDe(alunoAba).filter(function (m) {
    if (!termo) return true;
    var c = cursoPorId(m.id);
    return (c.titulo + " " + c.trilha).toLowerCase().indexOf(termo) >= 0;
  });
}

function linhaMatricula(m) {
  var c = cursoPorId(m.id);
  var pronto = m.progresso >= 100;
  return (
    '<article class="al-curso">' +
    '<div class="al-curso-capa">' + capa(c, { sufixo: "-al" }) + "</div>" +
    '<div class="al-curso-info">' +
    "<h4>" + esc(c.titulo) + "</h4>" +
    "<p>" + esc(c.trilha) + " · " + esc(situacaoDe(m)) + "</p>" +
    '<div class="bar-row"><div class="bar' + (pronto ? " bar-ok" : "") + '"><i style="width:' + m.progresso + '%"></i></div>' +
    "<b>" + m.progresso + "%</b></div>" +
    "</div>" +
    '<div class="al-curso-acao">' +
    (pronto
      ? '<button class="btn btn-ghost btn-sm" data-acao="certificado">Ver certificado</button>'
      : '<a class="btn btn-primary btn-sm" href="#/curso/' + c.id + '">Continuar</a>') +
    '<button class="al-mais" data-acao="opcoes" aria-label="Mais opções">' + ico("reticencias", 18) + "</button>" +
    "</div>" +
    "</article>"
  );
}

function pintarMeusCursos() {
  var lista = document.getElementById("al-lista");
  if (!lista) return;
  var itens = matriculasVisiveis();
  lista.innerHTML = itens.length
    ? itens.map(linhaMatricula).join("")
    : '<p class="empty-state">Nenhum curso encontrado nesta aba.</p>';
}

function viewAluno() {
  var mats = CURSISTA.matriculas;
  var concluidos = matriculasDe("concluidos").length;
  var andamento = matriculasDe("andamento").length;
  var geral = Math.round(mats.reduce(function (n, m) { return n + m.progresso; }, 0) / mats.length);

  var kpis = [
    ["livro", mats.length, "cursos inscritos", "Ver todos", "azul"],
    ["grafico", andamento, "em andamento", "Ver detalhes", "verde"],
    ["medalha", concluidos, "concluído" + (concluidos === 1 ? "" : "s"), "Ver certificado", "marinho"],
    ["relogio", "96h", "carga acumulada", "Histórico", "ceu"],
  ];

  return (
    '<div class="al-shell">' +
    ladoAluno("inicio") +
    '<div class="al-main">' +
    topoAluno() +
    '<div class="al-conteudo">' +

    '<section class="al-banner">' +
    '<div class="al-banner-foto">' +
    '<img src="imagens/aluno/banner.png" alt="" onerror="this.remove()" />' +
    "</div>" +
    '<div class="al-banner-txt">' +
    "<h1>Continue aprendendo, " + esc(CURSISTA.nome.split(" ")[0]) + "!</h1>" +
    "<p>" + esc(CURSISTA.saudacao) + "</p>" +
    '<div class="al-banner-barra"><span>Progresso geral</span>' +
    '<div class="bar"><i style="width:' + geral + '%"></i></div><b>' + geral + "%</b></div>" +
    "</div>" +
    '<blockquote class="al-banner-frase">&ldquo;' + esc(CURSISTA.frase) + "&rdquo;</blockquote>" +
    "</section>" +

    '<div class="al-kpis">' +
    kpis.map(function (k) {
      return (
        '<div class="al-kpi">' +
        '<div class="al-kpi-ico ' + k[4] + '">' + ico(k[0], 18) + "</div>" +
        "<b>" + esc(k[1]) + "</b><span>" + esc(k[2]) + "</span>" +
        '<button class="al-kpi-link" data-acao="kpi">' + esc(k[3]) + " " + ico("seta", 12) + "</button>" +
        "</div>"
      );
    }).join("") +
    "</div>" +

    '<section class="al-bloco">' +
    '<div class="al-bloco-topo">' +
    "<h2>Meus cursos</h2>" +
    '<div class="al-bloco-acoes">' +
    '<div class="al-busca al-busca-pq">' +
    '<span class="ico">' + ico("busca", 15) + "</span>" +
    '<input id="al-busca" type="search" placeholder="Buscar nos meus cursos..." autocomplete="off" />' +
    "</div>" +
    '<button class="al-filtro" data-acao="filtro" aria-label="Filtrar">' + ico("filtro", 17) + "</button>" +
    "</div>" +
    "</div>" +
    '<div class="al-abas" id="al-abas">' +
    ABAS_ALUNO.map(function (a) {
      return (
        '<button class="al-aba' + (a[0] === alunoAba ? " is-on" : "") + '" data-aba="' + a[0] + '">' +
        esc(a[1]) + " (" + matriculasDe(a[0]).length + ")</button>"
      );
    }).join("") +
    "</div>" +
    '<div class="al-lista" id="al-lista"></div>' +
    "</section>" +

    '<div class="al-atalhos">' +
    ATALHOS.map(function (a) {
      return (
        '<button class="al-atalho" data-acao="atalho">' +
        '<span class="al-atalho-ico">' + ico(a.ico, 18) + "</span>" +
        "<span><b>" + esc(a.titulo) + "</b><span>" + esc(a.desc) + "</span></span>" +
        "</button>"
      );
    }).join("") +
    "</div>" +

    rodapeAluno() +
    "</div></div></div>"
  );
}

/* ---------------------------------------------------------------- página 6
   Dentro de um curso — a tela da aula
   ------------------------------------------------------------------------ */

/* Marca como concluídas as primeiras aulas, na proporção do progresso — assim
   as marcas de "feito" batem com a barra da matrícula. */
function aulasConcluidas(progresso) {
  return Math.round((TOTAL_AULAS * progresso) / 100);
}

function situacaoDe(m) {
  if (m.progresso >= 100) return "Concluído · certificado disponível";
  return aulasConcluidas(m.progresso) + " de " + TOTAL_AULAS + " aulas concluídas";
}

/*
 * Estado de cada módulo a partir do progresso: quantas aulas já foram feitas e
 * se o módulo ainda está trancado. A regra é sequencial — um módulo abre
 * quando o anterior termina —, então o cadeado aparece sozinho nos cursos
 * pouco avançados, sem precisar marcar nada à mão.
 */
function estadoModulos(progresso) {
  var feitas = aulasConcluidas(progresso);
  var n = 0;
  return MODULOS.map(function (mod, i) {
    var inicio = n + 1;
    n += mod.aulas.length;
    return {
      mod: mod,
      indice: i,
      inicio: inicio,
      feitasMod: Math.max(0, Math.min(mod.aulas.length, feitas - inicio + 1)),
      trancado: i > 0 && feitas < inicio - 1,
    };
  });
}

var ICO_AULA = { video: "play", texto: "texto", quiz: "atividade", forum: "forum" };
var ROTULO_TIPO = { video: "Vídeo aula", texto: "Leitura", quiz: "Atividade", forum: "Fórum" };

function viewCurso(id) {
  var mat = CURSISTA.matriculas.filter(function (m) { return m.id === id; })[0] ||
            matriculasDe("andamento")[0];
  var c = cursoPorId(mat.id);
  var feitas = aulasConcluidas(mat.progresso);
  var estados = estadoModulos(mat.progresso);

  /* Aula atual: a primeira ainda não concluída (ou a última, se acabou). */
  var atualNum = Math.min(feitas + 1, TOTAL_AULAS);
  var atual = null;
  estados.forEach(function (e) {
    e.mod.aulas.forEach(function (a, i) {
      if (e.inicio + i === atualNum) {
        atual = { aula: a, mod: e.mod, posicao: i + 1, estado: e };
      }
    });
  });

  var lateral =
    '<aside class="au-side">' +
    '<div class="au-capa">' + capa(c, { sufixo: "-au" }) + "</div>" +
    "<h3>" + esc(c.titulo) + "</h3>" +
    '<p class="au-side-trilha">' + esc(c.trilha) + "</p>" +
    '<div class="bar-row"><div class="bar"><i style="width:' + mat.progresso + '%"></i></div>' +
    "<b>" + mat.progresso + "%</b></div>" +
    '<div class="au-modulos">' +
    estados.map(function (e) {
      if (e.trancado) {
        return (
          '<div class="au-modulo trancado">' +
          '<div class="au-modulo-topo">' + ico("cadeado", 15) +
          "<div><b>" + esc(e.mod.titulo) + "</b><span>" + esc(e.mod.subtitulo) + "</span></div></div>" +
          "</div>"
        );
      }
      return (
        '<div class="au-modulo">' +
        '<div class="au-modulo-topo">' + ico("circulo", 15) +
        "<div><b>" + esc(e.mod.titulo) + "</b><span>" + esc(e.mod.subtitulo) + "</span></div></div>" +
        e.mod.aulas.map(function (a, i) {
          var num = e.inicio + i;
          var st = num <= feitas ? "feita" : num === atualNum ? "atual" : "aberta";
          return (
            '<button class="au-aula ' + st + '" data-acao="aula">' +
            '<span class="au-aula-ico">' +
            ico(st === "feita" ? "feito" : st === "atual" ? "emCurso" : "circulo", 16) +
            "</span>" +
            "<span>" + (i + 1) + ". " + esc(a.nome) + "</span>" +
            "</button>"
          );
        }).join("") +
        "</div>"
      );
    }).join("") +
    "</div></aside>";

  var objetivos =
    '<div class="au-objetivos">' +
    '<p class="au-obj-topo">' + ico("alvo", 16) + "<b>Ao final desta aula, você será capaz de:</b></p>" +
    atual.mod.objetivos.map(function (o) {
      return '<p class="au-obj-item">' + ico("feito", 15) + esc(o) + "</p>";
    }).join("") +
    "</div>";

  var fichas =
    '<div class="au-fichas">' +
    '<div class="au-ficha">' + ico("relogio", 17) + "<div><span>Duração</span><b>" + esc(atual.aula.dur) + "</b></div></div>" +
    '<div class="au-ficha">' + ico(ICO_AULA[atual.aula.tipo], 17) + "<div><span>Tipo de conteúdo</span><b>" +
    esc(ROTULO_TIPO[atual.aula.tipo]) + "</b></div></div>" +
    '<div class="au-ficha">' + ico("nivel", 17) + "<div><span>Nível</span><b>" + esc(atual.mod.nivel) + "</b></div></div>" +
    "</div>";

  var materiais = [
    ["Slides do encontro", "PDF · 2,4 MB"],
    ["Texto-base comentado", "PDF · 860 KB"],
    ["Roteiro da atividade", "DOCX · 210 KB"],
  ];

  var abas =
    '<div class="au-abas">' +
    [["sobre", "livro", "Sobre a aula"], ["materiais", "texto", "Materiais"],
     ["atividades", "atividade", "Atividades"], ["forum", "forum", "Fórum"]]
      .map(function (t, i) {
        return (
          '<button class="au-aba' + (i === 0 ? " is-on" : "") + '" data-painel="' + t[0] + '">' +
          ico(t[1], 15) + t[2] + "</button>"
        );
      }).join("") +
    "</div>";

  var painelSobre =
    '<div class="au-painel is-on" data-p="sobre">' +
    "<h3>Sobre esta aula</h3>" +
    "<p>" + esc(c.desc) + "</p>" +
    objetivos + fichas +
    '<div class="au-nota">' + ico("feito", 18) +
    "<div><b>Você está indo bem!</b><span>Após concluir esta aula, avance para a próxima e continue sua jornada.</span></div>" +
    "</div>" +
    "</div>";

  var painelMateriais =
    '<div class="au-painel" data-p="materiais">' +
    "<h3>Materiais desta aula</h3>" +
    materiais.map(function (a) {
      return (
        '<button class="cu-material" data-acao="material">' +
        '<span class="cu-material-ico">' + ico("texto", 16) + "</span>" +
        "<span><b>" + a[0] + "</b><span>" + a[1] + "</span></span>" +
        ico("baixar", 16) + "</button>"
      );
    }).join("") +
    "</div>";

  var painelAtividades =
    '<div class="au-painel" data-p="atividades">' +
    "<h3>Atividades do módulo</h3>" +
    [["Autoavaliação do módulo", "Prazo até 24/09", "Pendente"],
     ["Registro da prática em sala", "Entregue em 09/09", "Corrigida"]]
      .map(function (a, i) {
        return (
          '<button class="au-atividade" data-acao="atividade">' +
          '<span class="cu-material-ico">' + ico("atividade", 16) + "</span>" +
          "<span><b>" + a[0] + "</b><span>" + a[1] + "</span></span>" +
          '<span class="au-selo ' + (i ? "ok" : "pendente") + '">' + a[2] + "</span></button>"
        );
      }).join("") +
    "</div>";

  var painelForum =
    '<div class="au-painel" data-p="forum">' +
    "<h3>Fórum da aula</h3>" +
    [["Heloísa Quintela", "Usei o roteiro com o 8º ano e funcionou melhor do que eu esperava."],
     ["Caio Bandeira", "Alguém adaptou a proposta para turmas maiores? Estou com 38 estudantes."]]
      .map(function (a) {
        return (
          '<div class="au-post">' + avatar(a[0], "md") +
          "<div><b>" + esc(a[0]) + "</b><p>" + esc(a[1]) + "</p></div></div>"
        );
      }).join("") +
    '<button class="btn btn-ghost btn-sm mt-16" data-acao="forum">Responder no fórum</button>' +
    "</div>";

  return (
    '<div class="au-shell">' +

    '<header class="au-top">' +
    marca(false) +
    '<div class="al-busca">' +
    '<span class="ico">' + ico("busca", 16) + "</span>" +
    '<input type="search" placeholder="Buscar no curso..." data-acao="busca-curso" readonly />' +
    "</div>" +
    '<button class="al-sino" data-acao="avisos" aria-label="Avisos">' + ico("sino", 19) +
    '<i class="al-badge">3</i></button>' +
    '<button class="al-usuario" data-acao="conta">' + avatar(CURSISTA.nome, "md") +
    "<span>" + esc(CURSISTA.nome.split(" ")[0]) + "</span>" + ico("chevron", 14) + "</button>" +
    "</header>" +

    '<nav class="au-mig">' +
    ico("chevronE", 13) +
    '<a href="#/aluno">Meus cursos</a>' + ico("chevron", 12) +
    '<a href="#/curso/' + c.id + '">' + esc(c.titulo) + "</a>" + ico("chevron", 12) +
    "<span>" + esc(atual.mod.titulo) + "</span>" + ico("chevron", 12) +
    '<span class="atual">Aula ' + atual.posicao + "</span>" +
    "</nav>" +

    '<div class="au-grade">' +
    lateral +
    "<main>" +

    '<div class="au-cab">' +
    "<div>" +
    '<p class="au-cab-mod">' + esc(atual.mod.titulo) + " — " + esc(atual.mod.subtitulo) + "</p>" +
    "<h1>" + atual.posicao + ". " + esc(atual.aula.nome) + "</h1>" +
    "</div>" +
    '<div class="au-cab-nav">' +
    '<button class="btn btn-ghost btn-sm" data-acao="aula">' + ico("chevronE", 14) + "Aula anterior</button>" +
    '<button class="btn btn-primary btn-sm" data-acao="aula">Próxima aula' + ico("chevron", 14) + "</button>" +
    "</div>" +
    "</div>" +

    /* Player ilustrativo: a capa é uma imagem, a barra de controles é estática. */
    '<div class="au-player">' +
    '<div class="au-player-capa">' +
    '<img src="imagens/aluno/capa_video.png" alt="" onerror="this.remove()" />' +
    "</div>" +
    '<div class="au-player-txt">' + esc(atual.aula.nome) + "</div>" +
    '<div class="au-controles" data-acao="player">' +
    ico("play", 15) +
    '<span class="au-tempo">0:00 / ' + esc(atual.aula.dur === "—" ? "12:34" : atual.aula.dur.replace(" min", ":00")) + "</span>" +
    '<span class="au-linha"><i></i></span>' +
    ico("som", 15) + ico("engrenagem", 15) + ico("expandir", 15) +
    "</div>" +
    "</div>" +

    '<div class="panel mt-24">' + abas +
    '<div class="au-paineis">' + painelSobre + painelMateriais + painelAtividades + painelForum + "</div>" +
    "</div>" +

    "</main></div>" +
    '<div class="au-rodape">' + rodapeAluno() + "</div>" +
    "</div>"
  );
}

/* Cartão de indicador do painel administrativo. */
function kpi(icone, valor, rotulo) {
  return (
    '<div class="kpi"><div class="kpi-ico">' + ico(icone, 18) + "</div>" +
    "<div><b>" + esc(valor) + "</b><span>" + esc(rotulo) + "</span></div></div>"
  );
}

/* ---------------------------------------------------------------- página 5
   Painel administrativo
   ------------------------------------------------------------------------ */

var admFiltroTrilha = "Todas";
var admBusca = "";

function admFiltrados() {
  var termo = admBusca.trim().toLowerCase();
  return CURSOS.filter(function (c) {
    var p = PRODUCAO[c.id];
    var okTrilha = admFiltroTrilha === "Todas" || c.trilha === admFiltroTrilha;
    var alvo = (c.titulo + " " + c.trilha + " " + p.coord + " " + p.sup).toLowerCase();
    return okTrilha && (!termo || alvo.indexOf(termo) >= 0);
  });
}

function pintarAdmin() {
  var grade = document.getElementById("adm-grade");
  if (!grade) return;
  var lista = admFiltrados();
  grade.className = lista.length ? "admin-grid" : "";
  grade.innerHTML = lista.length
    ? lista.map(cardAdmin).join("")
    : '<p class="empty-state">Nenhum curso corresponde aos filtros.</p>';
}

function cardAdmin(c) {
  var p = PRODUCAO[c.id];
  var rotuloPrazo = { vencido: "Prazo vencido", proximo: "Prazo próximo", ok: "No prazo" }[p.prazo];
  var classePrazo = { vencido: "flag-late", proximo: "flag-near", ok: "flag-ok" }[p.prazo];

  return (
    '<article class="adm-card">' +
    // A capa do painel mostra só a faixa central (42% da altura da imagem), o
    // que cortaria ao meio o título desenhado nas fotos dos cursos. Aqui a
    // ilustração gerada é sempre usada. Com fotos sem texto, dá para trocar
    // por capaCurso(c, { sufixo: "-ad" }).
    '<div class="adm-cover">' + capa(c, { sufixo: "-ad" }) +
    '<span class="adm-flag ' + classePrazo + '">' + rotuloPrazo + "</span>" +
    '<span class="adm-trilha">' + esc(c.trilha) + "</span>" +
    "</div>" +
    '<div class="adm-body">' +
    "<h4>" + esc(c.titulo) + "</h4>" +
    '<p class="sub">' + esc(c.carga) + " · " + (c.aberto ? "inscrições abertas" : "em preparação") + "</p>" +
    '<div class="slot-split">' +
    '<div class="slot"><p class="slot-label">Coordenação</p><div class="person">' + avatar(p.coord, "sm") + "<span>" + esc(primeiroUltimo(p.coord)) + "</span></div></div>" +
    '<div class="slot"><p class="slot-label">Supervisão</p><div class="person">' + avatar(p.sup, "sm") + "<span>" + esc(primeiroUltimo(p.sup)) + "</span></div></div>" +
    "</div>" +
    '<div class="slot"><p class="slot-label">Revisão</p>' +
    (p.rev === "—"
      ? '<span class="slot-num" style="color:var(--faint);font-weight:500">Nenhum revisor vinculado</span>'
      : '<div class="person">' + avatar(p.rev, "sm") + "<span>" + esc(primeiroUltimo(p.rev)) + "</span></div>") +
    "</div>" +
    '<div class="slot-split">' +
    '<div class="slot"><p class="slot-label">Conteúdos</p><span class="slot-num">' + p.conteudos + "</span></div>" +
    '<div class="slot"><p class="slot-label">Módulos</p><span class="slot-num">' + p.modulos + "</span></div>" +
    "</div>" +
    '<div class="progress-line"><span>Progresso de produção</span><b style="color:' + corProgresso(p.progresso) + '">' + p.progresso + "%</b></div>" +
    '<div class="bar bar-navy"><i style="width:' + p.progresso + '%"></i></div>' +
    '<div class="slot" style="margin-top:12px"><p class="slot-label">Professores / produtores</p>' +
    p.profs.map(function (n) { return '<div class="person">' + avatar(n, "sm") + "<span>" + esc(primeiroUltimo(n)) + "</span></div>"; }).join("") +
    "</div>" +
    '<div class="adm-foot">' +
    '<button class="btn btn-navy" data-acao="producao">Produção' + ico("chevron", 13) + "</button>" +
    '<button class="btn btn-ghost" data-acao="ementa">Ementa</button>' +
    "</div>" +
    "</div></article>"
  );
}

function primeiroUltimo(nome) {
  var p = String(nome).trim().split(/\s+/);
  if (p.length < 2) return nome;
  return p[0] + " " + p[p.length - 1];
}

function corProgresso(v) {
  if (v >= 100) return "var(--ok-500)";
  if (v >= 50) return "var(--blue-600)";
  if (v > 0) return "var(--warn-500)";
  return "var(--faint)";
}

function viewAdmin() {
  var totalProgresso = Math.round(
    CURSOS.reduce(function (s, c) { return s + PRODUCAO[c.id].progresso; }, 0) / CURSOS.length
  );
  var conteudos = CURSOS.reduce(function (s, c) { return s + PRODUCAO[c.id].conteudos; }, 0);
  var supervisores = {};
  CURSOS.forEach(function (c) { supervisores[PRODUCAO[c.id].sup] = 1; });

  var menu = [
    ["painel", "grafico", "Painel"],
    ["cursos", "livro", "Cursos"],
    ["frequencia", "presenca", "Frequência"],
    ["cursistas", "grupo", "Cursistas"],
    ["acessos", "cadeado", "Acessos"],
    ["site", "globo", "Site"],
  ];

  return (
    '<div class="admin">' +
    '<aside class="side">' +
    '<div class="side-brand">' + marca(true) + "</div>" +
    '<nav class="side-nav">' +
    menu
      .map(function (m) {
        return (
          '<button data-menu="' + m[0] + '"' + (m[0] === "cursos" ? ' class="is-active"' : "") + ">" +
          ico(m[1], 17) + m[2] + "</button>"
        );
      })
      .join("") +
    "</nav>" +
    '<div class="side-foot">' +
    '<div class="side-user">' + avatar(ADMIN.nome, "md") +
    "<div><b>" + esc(ADMIN.nome) + "</b><span>" + esc(ADMIN.papel) + "</span></div></div>" +
    '<a class="side-exit" href="#/">← Sair do painel</a>' +
    "</div>" +
    "</aside>" +

    '<main class="admin-main">' +
    '<div class="admin-top">' +
    "<div><h2>Cursos</h2><p>Acompanhe a produção de conteúdo de cada curso do ciclo.</p></div>" +
    '<button class="btn btn-primary" data-acao="novo">' + ico("mais", 15) + "Novo curso</button>" +
    "</div>" +

    '<div class="admin-content">' +
    '<div class="kpi-row">' +
    kpi("livro", CURSOS.length, "cursos ativos") +
    kpi("grafico", totalProgresso + "%", "progresso geral") +
    kpi("presenca", conteudos, "conteúdos cadastrados") +
    kpi("grupo", Object.keys(supervisores).length, "supervisores mapeados") +
    "</div>" +

    '<div class="filters">' +
    '<p class="filters-title">Filtros</p>' +
    '<div class="filters-row">' +
    selectFiltro("adm-trilha", "Trilha", ["Todas"].concat(TRILHAS)) +
    selectFiltro("adm-sup", "Supervisor", ["Todos"].concat(Object.keys(supervisores))) +
    selectFiltro("adm-status", "Status da produção", ["Todos", "No prazo", "Prazo próximo", "Prazo vencido"]) +
    selectFiltro("adm-ava", "Status no ambiente", ["Todos", "Publicado", "Não publicado"]) +
    "</div>" +
    '<div class="search-box" style="margin:14px 0 0">' +
    '<span class="ico">' + ico("busca", 17) + "</span>" +
    '<input id="adm-busca" type="search" placeholder="Buscar curso, trilha, supervisor ou coordenador..." autocomplete="off" />' +
    "</div>" +
    "</div>" +

    '<div id="adm-grade" class="admin-grid"></div>' +
    "</div></main></div>"
  );
}

function selectFiltro(id, rotulo, opcoes) {
  return (
    '<div class="select-wrap"><label for="' + id + '">' + esc(rotulo) + "</label>" +
    '<select id="' + id + '">' +
    opcoes.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") +
    "</select>" +
    '<span class="caret">' + ico("chevron", 13) + "</span></div>"
  );
}

/* ------------------------------------------------ contagem dos indicadores */

function contar(el, instantaneo) {
  var alvo = Number(el.getAttribute("data-conta"));
  var pre = el.getAttribute("data-prefixo") || "";
  var suf = el.getAttribute("data-sufixo") || "";
  function pinta(v) { el.textContent = pre + Math.round(v).toLocaleString("pt-BR") + suf; }
  if (instantaneo) { pinta(alvo); return; }
  var dur = 1500, ini = null;
  function passo(t) {
    if (ini === null) ini = t;
    var p = Math.min((t - ini) / dur, 1);
    pinta(alvo * (1 - Math.pow(1 - p, 3)));   // easeOutCubic
    if (p < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

function animarContagem() {
  var els = document.querySelectorAll("[data-conta]");
  if (!els.length) return;
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (var i = 0; i < els.length; i++) contar(els[i], reduz);
}

/* --------------------------------------------------- controle do carrossel */

var carTimer = null;
var carAtual = 0;

function irParaSlide(i) {
  var slides = document.querySelectorAll("#carousel .slide");
  // Os pontos ficam fora de #carousel (irmãos dele) — daí a busca separada.
  var dots = document.querySelectorAll(".car-dots .car-dot");
  if (!slides.length) return;
  carAtual = (i + slides.length) % slides.length;
  for (var k = 0; k < slides.length; k++) slides[k].classList.toggle("is-on", k === carAtual);
  for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("is-on", d === carAtual);
}

function pararCarrossel() {
  clearInterval(carTimer);
  carTimer = null;
}

function iniciarCarrossel() {
  pararCarrossel();
  if (!document.getElementById("carousel")) return;
  carAtual = 0;
  if (HERO_SLIDES.length < 2) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function avancar() { carTimer = setInterval(function () { irParaSlide(carAtual + 1); }, 5200); }
  avancar();

  // Pausa com o ponteiro em qualquer lugar do hero, não só sobre a imagem.
  var hero = document.querySelector(".hero");
  if (!hero) return;
  hero.addEventListener("mouseenter", pararCarrossel);
  hero.addEventListener("mouseleave", function () { if (!carTimer) avancar(); });
}

/* ----------------------------------------------------------------- router */

var ROTAS = {
  "": viewHome,
  "/": viewHome,
  "/cursos": viewCursos,
  "/entrar": viewEntrar,
  "/aluno": viewAluno,
  "/curso": viewCurso,
  "/admin": viewAdmin,
};

function rotaAtual() {
  var bruto = location.hash.replace(/^#/, "");
  var partes = bruto.split("#");
  var caminho = partes[0] || "/";
  var param = "";

  // Única rota com parâmetro: #/curso/<id do curso>.
  var m = caminho.match(/^(\/curso)\/(.+)$/);
  if (m) {
    caminho = m[1];
    param = m[2];
  }

  return { caminho: caminho, ancora: partes[1] || "", param: param };
}

function render() {
  var r = rotaAtual();
  var view = ROTAS[r.caminho] || viewHome;

  app.innerHTML = view(r.param);
  app.firstElementChild && app.classList.remove("fade-in");
  void app.offsetWidth;
  app.classList.add("fade-in");

  pararCarrossel();
  if (r.caminho === "/" || r.caminho === "") {
    iniciarCarrossel();
    animarContagem();
  }

  if (r.caminho === "/aluno") pintarMeusCursos();

  if (r.caminho === "/cursos") {
    pintarGrade();
    var busca = document.getElementById("busca");
    busca.value = filtroBusca;
  }
  if (r.caminho === "/admin") pintarAdmin();

  if (r.ancora) {
    var alvo = document.getElementById(r.ancora);
    if (alvo) { alvo.scrollIntoView({ behavior: "smooth" }); return; }
  }
  window.scrollTo(0, 0);
}

/* --------------------------------------------------------------- eventos */

document.addEventListener("click", function (e) {
  var alvo;

  /* Ações sem efeito nesta demonstração */
  alvo = e.target.closest("[data-acao]");
  if (alvo) {
    e.preventDefault();
    naDemo(alvo.getAttribute("data-acao"));
    return;
  }

  /* Abas da tela de aula (Sobre / Materiais / Atividades / Fórum) */
  alvo = e.target.closest("[data-painel]");
  if (alvo) {
    var nome = alvo.getAttribute("data-painel");
    var bts = document.querySelectorAll("[data-painel]");
    for (var b = 0; b < bts.length; b++) bts[b].classList.toggle("is-on", bts[b] === alvo);
    var pns = document.querySelectorAll("[data-p]");
    for (var q = 0; q < pns.length; q++) {
      pns[q].classList.toggle("is-on", pns[q].getAttribute("data-p") === nome);
    }
    return;
  }

  /* Abas de "Meus cursos" */
  alvo = e.target.closest("[data-aba]");
  if (alvo) {
    alunoAba = alvo.getAttribute("data-aba");
    var abas = document.querySelectorAll("#al-abas .al-aba");
    for (var a = 0; a < abas.length; a++) abas[a].classList.toggle("is-on", abas[a] === alvo);
    pintarMeusCursos();
    return;
  }

  /* Chips de trilha no catálogo */
  alvo = e.target.closest("[data-trilha]");
  if (alvo) {
    filtroTrilha = alvo.getAttribute("data-trilha");
    var chips = document.querySelectorAll("#chips .chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("is-active", chips[i] === alvo);
    }
    pintarGrade();
    return;
  }

  /* Setas do carrossel do hero */
  alvo = e.target.closest("[data-car]");
  if (alvo) {
    irParaSlide(carAtual + Number(alvo.getAttribute("data-car")));
    return;
  }

  /* Pontos do carrossel do hero */
  alvo = e.target.closest("[data-dot]");
  if (alvo) {
    irParaSlide(Number(alvo.getAttribute("data-dot")));
    return;
  }

  /* Setas do carrossel de cursos */
  alvo = e.target.closest("[data-rail]");
  if (alvo) {
    var rail = document.getElementById("rail");
    if (rail) rail.scrollBy({ left: Number(alvo.getAttribute("data-rail")) * 312, behavior: "smooth" });
    return;
  }

  /* Menu lateral do painel */
  alvo = e.target.closest("[data-menu]");
  if (alvo) {
    if (alvo.getAttribute("data-menu") !== "cursos") {
      naDemo();
      return;
    }
    var itens = document.querySelectorAll(".side-nav button");
    for (var j = 0; j < itens.length; j++) itens[j].classList.toggle("is-active", itens[j] === alvo);
    return;
  }

  /* Mostrar/ocultar senha */
  if (e.target.closest("#ver-senha")) {
    var campo = document.getElementById("senha");
    campo.type = campo.type === "password" ? "text" : "password";
    return;
  }
});

/* Login: transição roteirizada — nada é validado nem enviado. */
document.addEventListener("submit", function (e) {
  if (e.target.id !== "form-login") return;
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Entrando...";
  setTimeout(function () { location.hash = "#/aluno"; }, 520);
});

/* Buscas */
document.addEventListener("input", function (e) {
  if (e.target.id === "busca") {
    filtroBusca = e.target.value;
    pintarGrade();
  }
  if (e.target.id === "adm-busca") {
    admBusca = e.target.value;
    pintarAdmin();
  }
  if (e.target.id === "al-busca") {
    alunoBusca = e.target.value;
    pintarMeusCursos();
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "adm-trilha") {
    admFiltroTrilha = e.target.value;
    pintarAdmin();
  } else if (e.target.id && e.target.id.indexOf("adm-") === 0) {
    naDemo();
  }
});

/* Destaque dos núcleos na grade da home */
document.addEventListener("mouseover", function (e) {
  var cel = e.target.closest("[data-cell]");
  if (!cel) return;
  var idx = Number(cel.getAttribute("data-cell"));
  var todas = document.querySelectorAll("#net .net-cell");
  for (var i = 0; i < todas.length; i++) todas[i].classList.toggle("is-on", i === idx);
  var nome = document.getElementById("net-nome");
  var num = document.getElementById("net-num");
  if (nome) nome.textContent = "Núcleo " + (idx + 1);
  if (num) num.textContent = "+" + (120 + ((idx * 73) % 460));
});

window.addEventListener("hashchange", render);
render();
