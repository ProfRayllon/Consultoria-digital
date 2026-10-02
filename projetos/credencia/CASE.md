# Credencia

## 1. Nome da Portfolio Edition

Credencia — eventos, credenciamento e análise

## 2. Categoria da solução

Sistema personalizado para gestão do ciclo completo de eventos e formações presenciais ou híbridas: cadastro, divulgação, inscrição, credenciamento e análise.

## 3. Problema

Formações com muitas unidades, polos e perfis de participantes costumam ser geridas em planilhas soltas: um formulário para inscrição, uma lista impressa no credenciamento, outra planilha para avaliação. A equipe perde tempo conciliando bases e só enxerga presença e satisfação depois que tudo acabou.

## 4. Contexto

A versão pública representa uma rede fictícia com 40 unidades em 8 polos. A formação principal, a *Jornada Formativa Territorial 2026*, carrega a base sintética de inscritos, credenciamentos e avaliações. As demais formações existem para o CRM ter uma carteira realista.

## 5. Solução proposta

Um único sistema acompanha a formação do cadastro à análise. Cada etapa alimenta a seguinte: a inscrição feita pela página pública gera o ingresso com QR code, o QR é lido no credenciamento e a presença registrada alimenta os indicadores de análise. Ações feitas em uma aba (ou no celular) aparecem nas outras na hora, via `BroadcastChannel`.

## 6. Principais funcionalidades

- **Cadastro**: carteira de formações com status, ocupação de vagas e formulário de nova formação.
- **Divulgação**: página pública de inscrição, link e QR code para material impresso, disparo de convite por canal e funil visita → inscrição → credenciamento.
- **Inscrição (página pública)**: formulário curto pensado para celular, com ingresso e QR code na confirmação.
- **Inscrições (CRM)**: base de inscritos com busca, filtros, exportação CSV e ficha com linha do tempo de cada pessoa.
- **Check-in**: credenciamento por busca de nome ou leitura do QR code no celular da recepção, com painel de chegadas ao vivo.
- **Análise**: visão geral, presença, avaliação, eficiência e unidades, com filtros por período, região e polo.

## 7. Minha atuação

Análise do produto original, definição do recorte público, modelagem de dados sintéticos, desenho da identidade visual, arquitetura frontend, componentes reutilizáveis, regras de indicadores e o modo vitrine usado na home do portfólio.

## 8. Tecnologias

React, TypeScript, Vite, Tailwind CSS (tema claro em branco e azul, com menu lateral escuro), Recharts, lucide-react, qrcode-generator, `BroadcastChannel` para sincronização entre abas e APIs nativas do navegador para exportação CSV.

## 9. Principais desafios técnicos

- Preservar o conceito da solução sem expor identidades ou dados reais.
- Manter estado vivo (publicar, inscrever, credenciar) coerente entre telas, abas e dispositivos.
- Fazer a mesma base servir à operação (inscrição, check-in) e à análise sem reconciliação manual.
- Uma página pública leve o bastante para ser usada no celular, na hora, a partir de um link de WhatsApp.

## 10. Estrutura do código

- `app/src/data/syntheticData.ts` — regiões, polos, unidades, participantes, avaliações e formações fictícias.
- `app/src/state/store.tsx` — estado vivo do CRM e sincronização entre abas.
- `app/src/lib/analytics.ts` — regras de cálculo dos indicadores.
- `app/src/pages/` — uma página por etapa do ciclo.
- `app/src/vitrine/` — modo vitrine (ver abaixo).

## 11. Telas e rotas

| Rota                         | Tela                              |
| ---------------------------- | --------------------------------- |
| `#/formacoes`                | Formações (cadastro)              |
| `#/divulgacao`               | Página e campanhas                |
| `#/inscricoes`               | Inscrições                        |
| `#/checkin`                  | Check-in                          |
| `#/analise` e `#/analise/*`  | Visão geral, presença, avaliação, eficiência, unidades |
| `#/inscricao`                | Página pública de inscrição       |

## 12. Modo vitrine (home do portfólio)

A home mostra o sistema rodando sozinho em uma tela de computador e uma de celular. São dois iframes do mesmo build:

- `index.html?vitrine=desktop&canal=<id>` — a equipe no CRM;
- `index.html?vitrine=celular&canal=<id>` — quem está na ponta (gestor, professor, recepção).

A home manda `{ tipo: "vitrine:passo", passo }`; o app volta ao ponto de partida daquele passo e executa o roteiro de `app/src/vitrine/roteiros.ts`, com um cursor que clica nos elementos marcados com `data-tour` e digita nos campos de verdade. Ao terminar, responde `{ origem: "vitrine", tipo: "fim" }` — o mesmo protocolo do +Formação. Os títulos e textos dos passos ficam em `home/projects-data.js`; se mudar a quantidade ou a ordem dos passos, mude os dois arquivos juntos.

Depois de qualquer mudança no app: `npm run build` dentro de `app/`.

## 13. Aviso de confidencialidade

Esta é uma Portfolio Edition desenvolvida para demonstração profissional. Identidades, instituições e dados foram substituídos por informações fictícias para preservar a confidencialidade do projeto original.
