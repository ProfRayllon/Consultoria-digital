# Portfólio Rayllon Soares

Portfólio pessoal. A **home** é a página geral; ela é alimentada por dois
arquivos de dados e aponta para os projetos que vivem em `/projetos`.

```
PORTFOLIO-RAYLLON/
├── home/                          página principal
│   ├── Portfolio Rayllon Soares.dc.html   ← o layout (mexer pouco)
│   ├── projects-data.js           ← FONTE DOS PROJETOS  (mexer aqui)
│   ├── video-data.js              ← FONTE DO VÍDEO      (mexer aqui)
│   ├── media/                     MP4/poster do vídeo da home
│   ├── assets/  uploads/          logos e fotos
│   └── support.js  image-slot.js  runtime do editor (não editar)
│
├── projetos/                      um case por pasta
│   ├── _template/                 ← MODELO: copie para criar um projeto novo
│   ├── credencia/                eventos e credenciamento — VITRINE
│   │   ├── CASE.md                inclui como funciona o modo vitrine
│   │   └── app/                   React + Vite; build em app/dist/
│   └── mais-formacao/             Portfolio Edition (protótipo estático)
│       ├── CASE.md
│       ├── app/dist/              index.html + styles.css + app.js, sem build
│       │   └── imagens/           hero/ (banner) e marca/ (logo, favicon)
│       └── midia/capa.png
│
└── Vídeo/                         peça de animação (projeto à parte)
    └── Video Planilhas para Sistema.dc.html
```

## Regra geral

O HTML da home quase nunca precisa ser editado. **Conteúdo entra pelos dois
arquivos de dados**, e cada um traz as instruções completas no próprio cabeçalho:

| Quero mudar…                       | Edito                    |
| ---------------------------------- | ------------------------ |
| projetos do carrossel              | `home/projects-data.js`  |
| texto, arquivo e posição do vídeo  | `home/video-data.js`     |
| conteúdo de um case                | `projetos/<slug>/CASE.md`|

## Adicionar um projeto

Resumo — o passo a passo completo está em
[`projetos/_template/README.md`](projetos/_template/README.md):

1. copie `projetos/_template` → `projetos/<slug>`;
2. build em `projetos/<slug>/app/dist/`, case em `CASE.md`, capa em `midia/`;
3. cole o bloco MODELO do fim de `home/projects-data.js` e preencha.

O **slug é a chave de tudo**: nome da pasta, `id` do projeto e chave da imagem
salva no card. Mudar depois desconecta a imagem do card.

## Onde o vídeo aparece

A seção de vídeo é um bloco autocontido e a home é uma coluna com ordem fixa
por seção. Para mover o bloco **não se recorta HTML** — troca-se uma string em
`home/video-data.js`:

```js
posicao: "depois-de-projetos",   // ou depois-do-hero, depois-do-processo, ...
navRotulo: "Vídeo",              // "" para não criar item no menu
```

O item do menu acompanha a posição escolhida. Os valores aceitos estão listados
no próprio arquivo.

## Projeto em vitrine

Todo projeto de `home/projects-data.js` com o campo `vitrine` não vira card:
vira um slide do bloco grande da seção Projetos, com o sistema rodando sozinho
em uma tela de computador e uma de celular, passo a passo. Setas e botões com o
nome dos projetos trocam o slide; ao fim dos passos, a home passa sozinha para o
próximo. Hoje são o **Credencia** e o **+Formação**. Os textos dos passos e a moldura do celular (CSS ou PNG)
ficam no próprio `projects-data.js`; o roteiro de cada passo fica no app
(`projetos/credencia/app/src/vitrine/roteiros.ts` e
`projetos/mais-formacao/app/dist/vitrine.js`). Detalhes no CASE.md de cada um.

O botão "Abrir demo" abre o sistema em uma aba nova. A seção mostra só os
projetos em vitrine (não há mais o carrossel de cards).

**Passos:** ficam na lateral esquerda, com a mesma altura das telas. O perfil
mostrado no computador em cada passo (campo `perfis` em `projects-data.js`)
aparece como selo na barra do navegador desenhado.

**Versões do vídeo.** A home toca a **v2** (corte comercial, ~56 s:
gancho de abertura, legendas cinéticas, números em destaque e encerramento
com marca e chamada) — `Vídeo/embed-v2.dc.html` → `piece-v2.jsx`. A **v1**
original (68 s) continua intacta em `embed.dc.html` → `piece.jsx`; para
voltar, troque o campo `embed` em `home/video-data.js`. Há ainda uma cópia
de segurança completa da pasta em `Vídeo-versao-segura-2026-10-02/`.

Enquanto o MP4 não é exportado, a home roda a peça de animação ao vivo dentro de
um iframe. Ao exportar, veja [`home/media/LEIA-ME.md`](home/media/LEIA-ME.md) —
é só preencher `arquivo` e `poster`, sem apagar nada.

## Pontos em aberto

- Em `projetos/mais-formacao/CASE.md`, a seção 8 tem um `[colchete]` a preencher:
  a stack do sistema original. A stack da Portfolio Edition já está descrita.
- A pasta `Vídeo` tem acento no nome. Funciona local, mas é frágil em hospedagem.
  Se um dia for publicado na web, vale renomear para `video` e ajustar o campo
  `embed` de `home/video-data.js`.

## Rodar o projeto

Na raiz do projeto:
python -m http.server 8000
Home: http://localhost:8000/home/Portfolio%20Rayllon%20Soares.dc.html