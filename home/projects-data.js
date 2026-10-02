// ============================================================================
// FONTE ÚNICA DOS PROJETOS DO PORTFÓLIO
// ----------------------------------------------------------------------------
// Alimenta a seção "Projetos selecionados" da home.
//
// PASSO A PASSO PARA ADICIONAR UM PROJETO
//   1. Copie a pasta /projetos/_template para /projetos/<slug-do-projeto>.
//   2. Coloque o build do projeto em /projetos/<slug>/app/dist/.
//   3. Preencha /projetos/<slug>/CASE.md.
//   4. Copie o bloco MODELO no fim deste arquivo, cole na posição desejada
//      (a ordem do array é a ordem do carrossel) e preencha.
// Detalhes em /projetos/_template/README.md.
//
// CAMPOS
//   id           Slug único. Use o MESMO nome da pasta em /projetos.
//                É também o nome do arquivo de capa:
//                home/media/projetos/<id>.png
//   nome         Título do card. Curto — duas ou três palavras.
//   categoria    Etiqueta acima do título. Use uma das categorias de serviço:
//                Sistemas Personalizados | Dashboards & BI | Dados & Analytics
//                Automação & Integrações | Consultoria Digital | Soluções Educacionais
//   descricao    UMA frase curta com o objetivo do projeto. O card é estreito;
//                textos longos empurram o botão para baixo.
//   midia        Opcional. Por padrão o card procura a capa em
//                home/media/projetos/<id>.png — basta salvar o arquivo lá.
//                Só preencha para usar outro caminho ou outra extensão:
//                { tipo: "imagem", src: "media/projetos/x.jpg", alt: "..." }
//   links.demo   Build do projeto ("../projetos/<slug>/app/dist/index.html").
//                É o que o botão "Demo" abre — em uma aba nova.
//                Vazio: o card mostra "Em breve" no lugar do botão.
//   vitrine      Opcional. Transforma o projeto no destaque da seção: telas de
//                computador e celular com o sistema rodando sozinho, passo a
//                passo. Ver o projeto "credencia" abaixo como modelo.
//   destaque     true marca o card com borda de destaque.
//
// CAMPOS GUARDADOS, HOJE SEM USO NO CARD
//   status, tecnologias, links.caso, links.video, links.repo
//   Ficam aqui como referência do case; o card não os exibe mais.
// ============================================================================

export default [
  {
    // PROJETOS EM VITRINE: quem tem o campo "vitrine" não vira card — vira um
    // slide do bloco grande no topo da seção, com o sistema rodando sozinho em
    // uma tela de computador e uma de celular. A ordem desta lista é a ordem
    // dos slides; ao fim dos passos de um, a home passa para o próximo.
    id: "credencia",
    nome: "Credencia",
    categoria: "Sistemas Personalizados",
    subtitulo: "Eventos, credenciamento e análise",
    status: "Demo pública",
    descricao:
      "O ciclo inteiro de um evento ou formação em um sistema só: cadastro, página de inscrição, divulgação por canal, credenciamento por QR code e análise de presença e avaliação.",
    tecnologias: ["React", "TypeScript", "Vite", "Tailwind", "Recharts", "QR code"],
    links: {
      demo: "../projetos/credencia/app/dist/index.html",
      publica: "../projetos/credencia/app/dist/index.html#/inscricao",
      publicaRotulo: "Página de inscrição",
      caso: "../projetos/credencia/CASE.md",
      video: "",
      repo: "",
    },
    vitrine: {
      // Build que roda dentro das telas. O app entende ?vitrine=desktop|celular.
      app: "../projetos/credencia/app/dist/index.html",
      // Endereço fictício mostrado na barra do navegador desenhado.
      dominio: "credencia.exemplo",

      // Moldura do celular. Vazio = moldura desenhada em CSS.
      // Para usar um PNG (fundo transparente, tela vazada):
      //   moldura:    "media/projetos/celular.png",
      //   proporcao:  "430 / 880",          largura / altura do PNG
      //   tela: { top: "2.3%", left: "5.1%", width: "89.8%", height: "95.4%", raio: "11% / 5.2%" }
      //   (posição da área da tela dentro do PNG, em % do próprio PNG)
      //   barraStatus: true  → a home desenha a barra "9:41" acima do app
      celular: {
        moldura: "",
        proporcao: "",
        tela: null,
      },

      // Os passos precisam bater com os roteiros do app
      // (projetos/credencia/app/src/vitrine/roteiros.ts).
      // "endereco" completa a barra do navegador desenhado (dominio/#/endereco).
      // "segundos" é só a estimativa da barra de progresso; o passo termina
      // quando as duas telas avisam que acabaram.
      // "perfis" diz quem aparece em cada tela naquele passo: tipo "admin"
      // (gestão) ou "usuario" (participante, cursista, visitante) e o nome.
      // O nome do perfil do computador vira o selo na barra do navegador.
      passos: [
        {
          titulo: "Cadastro",
          descricao: "A equipe cria a formação: período, vagas, local e público. Ao publicar, o celular do gestor já recebe o aviso.",
          endereco: "formacoes",
          segundos: 17,
          perfis: {
            desktop: { tipo: "admin", nome: "Administrador", acao: "Cria a formação: período, vagas, local e público, e publica as inscrições." },
            celular: { tipo: "admin", nome: "Gestor no celular", acao: "Recebe o aviso de que a formação foi publicada." },
          },
        },
        {
          titulo: "Divulgação",
          descricao: "Link rastreável e QR code saem prontos. Um clique dispara o convite, e a mensagem chega no celular do professor.",
          endereco: "divulgacao",
          segundos: 13,
          perfis: {
            desktop: { tipo: "admin", nome: "Administrador", acao: "Copia o link e dispara o convite pelo WhatsApp." },
            celular: { tipo: "usuario", nome: "Participante", acao: "Recebe o convite e abre a página de inscrição." },
          },
        },
        {
          titulo: "Inscrição",
          descricao: "Formulário curto, ingresso com QR code na hora. No CRM, a inscrição aparece no topo da lista com a ficha completa.",
          endereco: "inscricoes",
          segundos: 15,
          perfis: {
            desktop: { tipo: "admin", nome: "Administrador", acao: "Vê a inscrição chegar e abre a ficha do participante." },
            celular: { tipo: "usuario", nome: "Participante", acao: "Preenche o formulário e recebe o ingresso com QR code." },
          },
        },
        {
          titulo: "Credenciamento",
          descricao: "Na recepção, a equipe lê o QR do ingresso pelo celular ou busca pelo nome. O painel de chegadas atualiza ao vivo.",
          endereco: "checkin",
          segundos: 15,
          perfis: {
            desktop: { tipo: "admin", nome: "Administrador", acao: "Credencia pela busca e acompanha as chegadas ao vivo." },
            celular: { tipo: "admin", nome: "Recepção", acao: "Lê o QR code do ingresso e confirma o credenciamento." },
          },
        },
        {
          titulo: "Análise",
          descricao: "Presença, avaliação e eficiência por território, calculadas a partir do que entrou nas etapas anteriores.",
          endereco: "analise",
          segundos: 13,
          perfis: {
            desktop: { tipo: "admin", nome: "Administrador", acao: "Analisa presença, avaliação e eficiência por território." },
            celular: { tipo: "admin", nome: "Gestor no celular", acao: "Acompanha o resumo do evento pelo celular." },
          },
        },
      ],
    },
    destaque: true,
  },
  {
    // Portfolio Edition do sistema de formação continuada. O sistema original é
    // privado: marca, instituição, pessoas, cursos e números aqui são fictícios,
    // e a demo é um protótipo navegável de 5 telas, sem backend.
    id: "mais-formacao",
    nome: "+Formação",
    categoria: "Soluções Educacionais",
    status: "Demo pública",
    descricao:
      "Plataforma de formação continuada: site público com catálogo, área do cursista, sala de aula e painel de produção da coordenação.",
    tecnologias: ["HTML", "CSS", "JavaScript", "SVG"],
    // Screenshot real da home da demo, em 1280x800 (16:10). Ao mudar o visual
    // da demo, recapture para a capa não ficar desatualizada.
    subtitulo: "Formação continuada",
    midia: { tipo: "imagem", src: "../projetos/mais-formacao/midia/capa.png", alt: "Home da plataforma +Formação" },
    links: {
      demo: "../projetos/mais-formacao/app/dist/index.html",
      publica: "../projetos/mais-formacao/app/dist/index.html#/cursos",
      publicaRotulo: "Catálogo de cursos",
      caso: "../projetos/mais-formacao/CASE.md",
      video: "",
      repo: "",
    },
    vitrine: {
      app: "../projetos/mais-formacao/app/dist/index.html",
      dominio: "maisformacao.exemplo",
      // barraStatus: a home desenha o "9:41" do celular, porque o protótipo
      // não tem barra própria (o Credencia desenha a dele dentro do app).
      celular: { moldura: "", proporcao: "", tela: null, barraStatus: true },
      // Roteiros em projetos/mais-formacao/app/dist/vitrine.js.
      passos: [
        {
          titulo: "Catálogo",
          descricao: "O site público apresenta o programa e o catálogo de trilhas, com busca e filtro por eixo formativo.",
          endereco: "cursos",
          segundos: 15,
          perfis: {
            desktop: { tipo: "usuario", nome: "Visitante", acao: "Busca no catálogo e filtra as trilhas por eixo formativo." },
            celular: { tipo: "usuario", nome: "Visitante", acao: "Conhece o programa pelo site, no celular." },
          },
        },
        {
          titulo: "Acesso",
          descricao: "O cursista entra com a matrícula, no computador ou no celular, e cai direto na sua área.",
          endereco: "entrar",
          segundos: 10,
          perfis: {
            desktop: { tipo: "usuario", nome: "Cursista", acao: "Entra com a matrícula pelo computador." },
            celular: { tipo: "usuario", nome: "Cursista", acao: "Entra com a mesma conta pelo celular." },
          },
        },
        {
          titulo: "Percurso",
          descricao: "Cursos matriculados, progresso por curso e abas por situação: em andamento, concluídos e não iniciados.",
          endereco: "aluno",
          segundos: 11,
          perfis: {
            desktop: { tipo: "usuario", nome: "Cursista", acao: "Filtra os cursos por situação e busca um curso." },
            celular: { tipo: "usuario", nome: "Cursista", acao: "Confere os cursos em andamento." },
          },
        },
        {
          titulo: "Sala de aula",
          descricao: "Módulos que destravam em sequência, videoaula, materiais para baixar e atividades com situação de entrega.",
          endereco: "curso/c11",
          segundos: 9,
          perfis: {
            desktop: { tipo: "usuario", nome: "Cursista", acao: "Abre a aula, os materiais e as atividades." },
            celular: { tipo: "usuario", nome: "Cursista", acao: "Acompanha os módulos do curso." },
          },
        },
        {
          titulo: "Produção",
          descricao: "A coordenação acompanha a produção de cada curso: supervisão, revisão, progresso e prazo, com filtros cruzados.",
          endereco: "admin",
          segundos: 11,
          perfis: {
            desktop: { tipo: "admin", nome: "Coordenação", acao: "Filtra a produção de conteúdo por trilha e busca cursos." },
            celular: { tipo: "admin", nome: "Coordenação", acao: "Consulta o andamento dos cursos pelo celular." },
          },
        },
      ],
    },
    destaque: false,
  },
];

// ============================================================================
// MODELO — copie daqui para baixo
// ============================================================================
// Antes de colar: crie /projetos/<slug-do-projeto> a partir de _template.
// {
//   id: "slug-do-projeto",              // igual ao nome da pasta em /projetos
//   nome: "Nome do projeto",
//   categoria: "Sistemas Personalizados",
//   status: "Em produção",
//   descricao: "Uma frase curta com o objetivo do projeto.",
//   tecnologias: ["React", "TypeScript"],   // guardado, não aparece no card
//   links: {
//     demo: "../projetos/slug-do-projeto/app/dist/index.html",
//     caso: "../projetos/slug-do-projeto/CASE.md",
//   },
//   destaque: false,
// },
// Capa: salve home/media/projetos/slug-do-projeto.png — nada a declarar aqui.
