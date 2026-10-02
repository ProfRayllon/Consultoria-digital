# +Formação

## 1. Nome da Portfolio Edition

+Formação — Plataforma de Formação Continuada

## 2. Categoria da solução

Soluções Educacionais — plataforma de formação continuada que reúne catálogo público, jornada do cursista, ambiente de aulas e back-office de produção pedagógica.

## 3. Problema

A formação continuada de uma rede de ensino costuma acontecer espalhada por ferramentas que não conversam: a divulgação dos cursos vive num site estático, as inscrições em formulários avulsos, o controle de quem produz cada conteúdo em planilhas, a frequência em listas de presença e as aulas num ambiente virtual à parte. O resultado é que ninguém consegue responder rapidamente a perguntas básicas de gestão — quantos cursos estão prontos para publicar, quais estão atrasados, quem é o supervisor de cada trilha, quantos cursistas concluíram e podem receber certificado. Cada resposta exige juntar fontes na mão, e o dado envelhece antes de virar decisão.

## 4. Contexto

Operação de formação continuada com múltiplas trilhas formativas, dezenas de cursos por ciclo, equipes distintas de coordenação, supervisão, revisão e produção de conteúdo, e milhares de cursistas distribuídos por núcleos regionais.

**Esta é uma Portfolio Edition.** O sistema original é privado e segue em desenvolvimento. Nada do que aparece aqui reproduz a instituição real: a marca, o instituto mantenedor, os nomes de pessoas, os títulos dos cursos, os números e o recorte territorial são inteiramente fictícios, criados apenas para demonstrar o conceito.

Sobre imagens: **nenhuma imagem vem do sistema original ou da instituição real.** As únicas fotografias são as do banner da home, de banco de imagens, sem marca, identificação ou vínculo com o projeto. Dentro da aplicação não há foto de pessoa alguma — os avatares de cursistas, coordenadores e supervisores são iniciais em círculo, com cor derivada de um hash do nome, e as capas dos cursos são SVG gerado por código.

## 5. Solução proposta

Uma plataforma única que cobre o ciclo inteiro da formação: a vitrine pública que apresenta o programa e o catálogo, a área autenticada onde o cursista atualiza seus dados, se inscreve e acompanha o próprio percurso, o ambiente onde as aulas acontecem, e o painel administrativo que dá à coordenação a visão de produção, frequência e certificação. Em vez de integrar ferramentas soltas, o sistema centraliza o dado uma vez e o reaproveita nas três audiências — público, cursista e gestão.

A Portfolio Edition recorta desse conjunto um **tour navegável de seis telas**, o suficiente para mostrar a arquitetura de navegação e a linguagem visual sem expor a operação real.

## 6. Principais funcionalidades

- Site público com catálogo, apresentação do programa e fluxo de acesso passo a passo.
- Catálogo de trilhas com busca textual e filtro por eixo formativo.
- Ciclo de inscrição com controle de janela: cursos com inscrição aberta, em preparação e encerrados.
- Área do cursista com cursos matriculados, progresso por atividade, agenda de encontros e emissão de certificado.
- Painel administrativo com indicadores do ciclo e filtros cruzados por trilha, supervisor, status de produção e status de publicação.
- Acompanhamento da produção de conteúdo por curso: coordenação, supervisão, revisão, contagem de conteúdos e módulos, percentual concluído e sinalização de prazo.
- Módulos de frequência, gestão de cursistas, controle de acessos e edição do site público.
- Ambiente de aulas e trilha de certificação (em desenvolvimento no sistema original).

## 7. Minha atuação

Levantamento do fluxo com a equipe de formação, modelagem das entidades e dos estados de cada curso, definição da arquitetura de navegação para três perfis distintos, desenho da identidade visual e da interface, e implementação.

Para esta Portfolio Edition: definição do recorte publicável, criação da identidade fictícia, geração do conjunto de dados sintéticos e implementação do protótipo navegável.

## 8. Tecnologias

**Portfolio Edition:** HTML, CSS e JavaScript puros, sem dependências externas nem etapa de build — SPA com roteamento por hash, identidade em azul e branco sobre variáveis CSS, carrossel e faixa rolante feitos à mão, ilustrações em SVG gerado em tempo de execução e nenhuma requisição de rede além das imagens locais.

**Sistema original:** `[preencher com a stack real — ex.: React, TypeScript, Node.js, PostgreSQL]`

## 9. Principais desafios técnicos

- **Coerência entre progresso e conteúdo.** O percentual da matrícula, a contagem de aulas concluídas por módulo, a aula marcada como atual e quais módulos ainda estão trancados saem todos do mesmo número. Nada é escrito à mão, então nenhuma tela contradiz a outra.
- **Deixar claro o que é demonstração.** Numa peça de portfólio, um botão que não responde parece defeito. Aqui todo controle sem função é esmaecido e, ao ser clicado, explica que aquilo existe no sistema real — a limitação vira informação em vez de parecer bug.
- **Três audiências, um só modelo de dados.** O mesmo curso aparece como peça de marketing no site público, como item matriculável para o cursista e como unidade de produção para a coordenação. Cada visão precisa de um recorte diferente da mesma entidade, sem duplicar a fonte da verdade.
- **Estados que não são binários.** Um curso pode estar com a ementa pronta e a produção incompleta, publicado no ambiente mas com inscrição fechada, ou concluído e sem revisor vinculado. Modelar essas combinações — e traduzi-las em sinais visuais legíveis — foi mais difícil do que implementá-las.
- **Sinalização de prazo útil para a gestão.** O painel precisa dizer o que exige ação hoje sem afogar quem olha: daí a separação entre prazo vencido, prazo próximo e no prazo, aplicada sobre o progresso de produção.
- **Publicar o conceito sem publicar a operação.** O desafio específico desta versão: preservar a arquitetura, os fluxos e a densidade de informação que fazem o sistema ser o que é, substituindo integralmente identidades, marca e dados.

## 10. Estrutura dos dados

Os dados sintéticos ficam em `app/dist/app.js`, no topo do arquivo, e cobrem quatro entidades:

- **`TRILHAS`** — os seis eixos formativos que organizam o catálogo.
- **`CURSOS`** — 12 cursos com trilha, carga horária, janela de inscrição, prazo e ementa.
- **`PRODUCAO`** — a visão de back-office de cada curso: coordenação, supervisão, revisão, contagem de conteúdos e módulos, percentual de produção concluído, situação do prazo e equipe de produtores.
- **`CURSISTA`** — o percurso de uma cursista fictícia: matrículas com progresso individual e agenda de compromissos.

Os nomes de pessoas foram inventados e as cores dos avatares derivam de um hash do próprio nome — não há dado pessoal algum no repositório. As capas dos cursos são geradas por uma função que combina o eixo formativo e o identificador do curso num gradiente com formas geométricas.

As imagens ficam em `app/dist/imagens/`: o banner em `hero/`, declarado em `HERO_SLIDES`, e as capas dos cursos em `cursos/`, resolvidas pelo identificador do curso. Nos dois casos há um SVG gerado por baixo da fotografia: se o arquivo faltar, o `onerror` remove a imagem e a ilustração assume, de modo que nenhuma tela aparece quebrada.

## 11. Telas da demonstração

1. **Home pública** — banner em carrossel com controles e troca automática, indicadores do ciclo, faixa rolante das trilhas, catálogo em carrossel, apresentação da plataforma, fluxo de acesso em seis passos, materiais de apoio, alcance na rede e resultados.
2. **Catálogo de trilhas** — busca textual e filtro por eixo, com estado vazio tratado.
3. **Login do cursista** — transição roteirizada: não há autenticação, validação nem envio de dados.
4. **Área do cursista** — ambiente próprio, com barra lateral e topo: faixa de boas-vindas com progresso geral, indicadores do percurso, lista de cursos matriculados com abas (todos, em andamento, concluídos, não iniciados) e busca, e atalhos para guia, calendário e materiais.
5. **Tela da aula** — árvore do curso com módulos que destrancam em sequência, player da videoaula, navegação entre aulas e quatro abas com conteúdo próprio: sobre a aula (com objetivos de aprendizagem, duração, tipo e nível), materiais para download, atividades com situação de entrega e fórum.
6. **Painel administrativo** — navegação lateral, indicadores do ciclo, filtros e grade de acompanhamento da produção.

As demais áreas do sistema original — ambiente de aulas, frequência, gestão de cursistas, controle de acessos e edição do site — estão descritas neste case, mas **não** foram reproduzidas na demonstração.

## 12. Modo vitrine (home do portfólio)

A home do portfólio mostra o protótipo rodando sozinho em uma tela de computador
e uma de celular. São dois iframes do mesmo `index.html`, com `?vitrine=desktop`
e `?vitrine=celular`. O arquivo `app/dist/vitrine.js` só age com esse parâmetro:
recebe `{ tipo: "vitrine:passo", passo }`, zera os filtros, executa o roteiro do
passo (um cursor que clica e digita nos elementos reais) e responde
`{ origem: "vitrine", tipo: "fim" }`.

Os títulos e textos dos cinco passos ficam em `home/projects-data.js`; os
roteiros, em `ROTEIROS` dentro de `vitrine.js`. Mudou a quantidade ou a ordem
dos passos em um, mude no outro.

## 13. Aviso de confidencialidade

Esta é uma Portfolio Edition desenvolvida para demonstração profissional. Identidades, instituições e dados foram substituídos por informações fictícias para preservar a confidencialidade do projeto original.
