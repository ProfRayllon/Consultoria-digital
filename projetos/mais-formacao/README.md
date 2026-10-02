# +Formação — Portfolio Edition

Protótipo navegável de uma plataforma de formação continuada. **O sistema
original é privado.** Esta pasta não contém nenhum arquivo, texto, imagem ou
dado vindo dele — tudo aqui foi escrito do zero para o portfólio.

## O que é e o que não é

| É                                            | Não é                                      |
| -------------------------------------------- | ------------------------------------------ |
| 6 telas navegáveis, com transições reais      | Um sistema funcional                        |
| Filtros e busca que funcionam de verdade      | Um backend, banco ou autenticação           |
| Dados sintéticos escritos à mão               | Dados reais, anonimizados ou amostrados     |

O login **não valida nada**: clicar em "Entrar" com os campos vazios leva à área
do cursista. É uma transição roteirizada.

## Regras de descaracterização

Se for editar qualquer coisa aqui, mantenha estas sete regras:

1. **Nenhuma foto de pessoa dentro da aplicação.** Avatares são iniciais em
   círculo, com cor derivada de um hash do nome (`corDe()` em `app/dist/app.js`),
   e as capas dos cursos são SVG gerado por `capa()`.
   A **única** exceção é o banner da home, em `app/dist/imagens/hero/` — e ali
   valem as regras do `LEIA-ME.md` daquela pasta: banco de imagens ou imagem
   gerada, sem vínculo com a instituição real.
2. **Nenhuma marca ou instituição real.** A marca é `+Formação`; o mantenedor
   fictício é `Instituto Meridiano`, na `Rede Meridiano de Ensino`.
3. **Nenhum nome de pessoa real** — nem de colegas, nem o seu. Os nomes em
   `PRODUCAO`, `CURSISTA` e `ADMIN` são inventados.
4. **Nenhum recorte territorial real.** A seção "alcance da rede" é uma grade
   abstrata de núcleos numerados, não um mapa.
5. **Nenhum sistema externo identificável.** O ambiente virtual é chamado só de
   "Ambiente +Formação"; o login usa matrícula, não documento pessoal.

6. **Controles sem função ficam esmaecidos.** Tudo que tem `data-acao` recebe
   `opacity: .5` e volta ao normal no hover — é o sinal de que ali não há
   interação real. As exceções estão comentadas no CSS: linhas de lista (árvore
   de aulas, materiais, atividades, fórum) continuam legíveis, porque são
   conteúdo e não botão, e o botão flutuante de contato fica opaco porque a
   função dele é ser notado.
7. **Nenhum canal de contato que funcione.** O botão flutuante de WhatsApp é
   só visual: não tem link `wa.me`, não tem número, e clicar apenas mostra um
   aviso de demonstração. Ele existe para indicar que o canal existe no sistema
   real — nunca coloque um número verdadeiro aí. O ícone é o glifo do WhatsApp
   em azul, deliberadamente fora do verde da marca, para não se passar por um
   botão de WhatsApp de verdade.

Dois avisos sinalizam que isto não é um sistema em operação, e **não devem ser
removidos**:

- a última linha do **rodapé**, presente em todas as telas públicas:
  *"Portfolio Edition — protótipo de demonstração. Instituições, pessoas e
  dados são fictícios."* (função `footer()` em `app/dist/app.js`);
- o **aviso dentro do card de login**, dizendo que não há autenticação nem
  envio de dados.

Havia também um selo fixo no canto da tela com os mesmos dizeres; ele foi
retirado a pedido, por poluir a interface. Se o rodapé algum dia sair, esse
selo precisa voltar.

## Estrutura

```
mais-formacao/
├── CASE.md                       documentação do case (12 seções)
├── app/dist/
│   ├── index.html                o que o botão "Demo" abre
│   ├── styles.css                design system (azul + branco)
│   ├── app.js                    dados sintéticos, views e roteador
│   └── imagens/
│       ├── hero/                 fotos do banner da home  ← soltar arquivos aqui
│       ├── cursos/               capas dos cursos         ← soltar arquivos aqui
│       ├── aluno/                banner da área do cursista ← soltar arquivo aqui
│       ├── numeros/              imagem da seção de resultados
│       └── marca/                logo.png e favicon.svg   ← substituir arquivos aqui
└── midia/capa.png                capa do card na home do portfólio
```

Sem build, sem `node_modules`, sem dependências: `index.html`, `styles.css` e
`app.js` são o projeto inteiro. Abrir por HTTP (o servidor da raiz do portfólio
já serve) — o roteamento é por hash.

## Imagens

Cada pasta em `app/dist/imagens/` tem seu próprio `LEIA-ME.md` com nomes de
arquivo, proporções e regras. Em resumo:

| Pasta     | Arquivos                      | Tamanho      | Some se faltar? |
| --------- | ----------------------------- | ------------ | --------------- |
| `hero/`   | `hero-1.jpg`, `hero-2.jpg`, … | 4:3 ou mais largo | Não — entra um fundo azul gerado por código |
| `cursos/` | `c01.png` … `c12.png` (ou `.jpg`) | **800 × 500 px (16:10)** | Não — entra a ilustração azul do curso |
| `aluno/`  | `banner.png`                  | 1200 × 500 px, 2:1 a 3:1 | Não — sobra o degradê azul |
| `aluno/`  | `capa_video.png`              | 16:9, ~1600 px de largura | Não — sobra o fundo azul do player |
| `numeros/`| `img-numeros.png`             | 900–1200 px, 4:3 ou 3:2 | **Sim** — a única sem reserva |
| `marca/`  | `logo.png`, `favicon.svg`     | logo ~4:1, transparente | Não — o "+" desenhado em CSS reaparece |

As capas de curso valem para o catálogo e o carrossel da home. No painel
administrativo e nas miniaturas do cursista entra sempre a ilustração gerada —
o recorte lá é estreito demais para uma foto com texto. A tabela de qual
arquivo é qual curso está em `app/dist/imagens/cursos/LEIA-ME.md`.

Nada quebra com a pasta vazia: a aplicação foi feita para degradar para os
fundos gerados.

**Peso.** As imagens do banner carregam todas de uma vez, na primeira tela.
Mantenha cada arquivo abaixo de ~400 KB (1600 px de largura já basta) — acima
disso a demo demora visivelmente para abrir dentro do popup do portfólio.

## Onde mexer

| Quero mudar…                         | Edito                                       |
| ------------------------------------ | ------------------------------------------- |
| imagens do banner e a ordem delas     | `HERO_SLIDES` em `app/dist/app.js`          |
| foto de um curso fora do padrão       | campo `imagem` do curso, em `CURSOS`        |
| texto da faixa rolante                | `marquee()` em `app/dist/app.js`            |
| cursos do catálogo                    | `CURSOS`                                    |
| eixos formativos                      | `TRILHAS`                                   |
| dados do painel administrativo        | `PRODUCAO`                                  |
| percurso do cursista                  | `CURSISTA`                                  |
| números da home (com contagem)        | `NUMEROS` — `valor` é número, não texto     |
| paleta                                | `:root` em `app/dist/styles.css`            |
| logo e ícone da aba                   | arquivos em `app/dist/imagens/marca/`       |
| textos dos avisos de demonstração     | `AVISOS` em `app/dist/app.js`               |
| menu da área do cursista              | `MENU_ALUNO` em `app/dist/app.js`           |
| aulas e módulos da página de curso    | `MODULOS`                                   |
| saudação e frase do banner do aluno   | `CURSISTA.saudacao` e `CURSISTA.frase`      |

### Sobre a paleta

O tema é **azul e branco**. As variáveis `--navy-*` dão profundidade, as
`--blue-*` são a cor de ação (botões, links, badges, barras de progresso).

As cores de **status** ficam de fora do azul de propósito: `--danger-*` para
prazo vencido, `--warn-*` para prazo próximo e `--ok-*` para no prazo. São uma
camada funcional — se virassem azul, o painel administrativo perderia a
capacidade de mostrar o que exige ação. Não as unifique com a marca.

### Capa do card no portfólio

`midia/capa.png` é um **screenshot real** da home da demo, em 1280×800 (16:10),
apontado em `home/projects-data.js`. Ao mudar o visual da demo, recapture:

```
chrome --headless --window-size=1280,800 --screenshot=capa.png "http://localhost:8000/projetos/mais-formacao/app/dist/index.html#/"
```

### Área do cursista e tela da aula

Cada audiência tem sua casca. O site público usa cabeçalho horizontal; o painel
administrativo, barra lateral escura; a área do cursista (`viewAluno()`), barra
lateral clara; e a tela da aula (`viewCurso()`), só topo — a lateral ali é
ocupada pela árvore do curso.

A rota da aula é a única com parâmetro: `#/curso/<id>`. Sem id válido, cai no
primeiro curso em andamento.

**Os módulos trancam sozinhos.** `estadoModulos()` aplica uma regra sequencial:
um módulo abre quando o anterior termina. Como o progresso vem da matrícula, o
cadeado aparece onde deve, sem marcação manual — hoje são 0 módulos trancados
no curso de 72%, 2 no de 45% e 3 no de 8%. Para ver o estado trancado, abra o
curso "Avaliação formativa na prática".

As quatro abas da aula (Sobre / Materiais / Atividades / Fórum) **funcionam** e
têm conteúdo próprio.

**Os números se derivam uns dos outros, de propósito.** `MODULOS` define 16
aulas; o quanto está concluído sai do `progresso` da matrícula
(`aulasConcluidas()`), e a frase "12 de 16 aulas concluídas" vem de
`situacaoDe()`. Por isso não existe campo `situacao` escrito à mão: se
existisse, a frase divergiria das aulas marcadas assim que alguém mexesse no
progresso. Mudou o progresso, muda tudo junto.

As abas (Todos / Em andamento / Concluídos / Não iniciados) e a busca de "Meus
cursos" **funcionam**. O resto do menu lateral, o sino, o avatar, o player e os
downloads apenas mostram o aviso de demonstração.

### Contadores do hero

`NUMEROS` é uma lista de objetos com `valor` numérico, `prefixo`, `sufixo` e
`rotulo`. O valor numérico é o que permite a animação de contagem — se virar
texto (`"+9.400"`), a contagem para de funcionar. A mesma lista alimenta a
seção "Resultados do ciclo", via `RESULTADOS` — que é `NUMEROS` mais a
certificação. Em `prefers-reduced-motion: reduce` o número aparece direto no
valor final.

Cada indicador tem três textos: `rotulo` (legenda curta do hero), `resultado`
(legenda do card de resultados) e `detalhe` — a frase que **substitui** a
legenda quando o mouse passa pelo card. A troca usa duas legendas empilhadas na
mesma célula de grade, então a altura do card não muda no hover.

### Slide com o espaço livre do lado errado

O texto do hero fica à esquerda. Se uma imagem tiver o espaço vazio à direita
(sujeito à esquerda), marque `espelhar: true` naquele slide em `HERO_SLIDES` —
o CSS inverte a imagem por `transform`, sem reprocessar o arquivo. É o caso do
`hero-2.jpg` hoje.
