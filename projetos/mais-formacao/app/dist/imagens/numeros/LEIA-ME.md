# imagens/numeros/

Imagem que acompanha a seção **"Resultados do ciclo"**, na home — fica à
esquerda, com os quatro indicadores à direita.

```
img-numeros.png   EM USO
```

Para trocar, substitua o arquivo mantendo o nome. O caminho está no
`viewHome()`, em `app/dist/app.js`.

## Tamanho recomendado

| Item      | Valor                                             |
| --------- | ------------------------------------------------- |
| Largura   | **900–1200 px**                                    |
| Proporção | **4:3 ou 3:2** — o CSS recorta, então sobra margem |
| Formato   | PNG ou JPG, foto retangular comum                  |
| Peso      | até ~400 KB                                        |

Fundo transparente **não é necessário**: a imagem é exibida dentro de uma
moldura de cantos arredondados, com a mesma borda dos cards ao lado.

## O CSS recorta a imagem — enquadre com folga

A altura da foto **não é a dela**: é a mesma da grade de cards, para que as
bordas de cima e de baixo fiquem alinhadas com elas. A imagem é encaixada por
`object-fit: cover`, ou seja, recortada.

| Onde              | Caixa aproximada | Efeito                          |
| ----------------- | ---------------- | ------------------------------- |
| Desktop           | ~430 × 280 px (≈1,5:1) | recorta bastante a altura |
| Empilhado (mobile)| 460 × 260 px           | recorte parecido          |

Consequências práticas:

- **Deixe respiro em cima e embaixo.** Uma imagem 4:3 perde cerca de um quarto
  da altura no desktop.
- O recorte é enviesado para cima (`object-position: center 32%`), porque em
  fotos de pessoa o assunto costuma estar no terço superior. Se a sua imagem
  tiver o assunto mais baixo, ajuste esse valor em `.results-figura img`, no
  `styles.css`.
- Imagens muito largas (banner) não funcionam bem: sobra pouco no meio.

## Sem reserva

Diferente das outras pastas, **aqui não há ilustração de fallback**: se o
arquivo sumir, fica uma moldura vazia à esquerda. É a única imagem do projeto
sem plano B.

## ⚠️ Antes de escolher

Mesmas regras das outras pastas (`../hero/LEIA-ME.md`): banco de imagens com
licença livre ou imagem gerada, sem pessoa identificável, sem marca, brasão ou
qualquer coisa vinda do sistema original.
