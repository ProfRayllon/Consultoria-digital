# imagens/aluno/

Foto da **faixa de boas-vindas** da área do cursista — a barra escura com
"Continue aprendendo, Letícia!".

```
banner.png       EM USO — faixa de boas-vindas
capa_video.png   ainda não usado, guardado para uma tela futura
```

Não precisa editar código: o caminho já está no `viewAluno()`, em
`app/dist/app.js`.

## Tamanho recomendado

| Item      | Valor                                              |
| --------- | -------------------------------------------------- |
| Dimensões | **1200 × 500 px**                                   |
| Proporção | larga, entre **2:1 e 3:1**                          |
| Formato   | JPG ou PNG (fundo transparente não é necessário)    |
| Peso      | até ~300 KB                                         |

## Como a imagem é usada

Ela ocupa a **metade direita** da faixa e recebe por cima um degradê escuro que
vai do azul-marinho (esquerda) ao transparente (direita). É esse véu que garante
a leitura do texto "Continue aprendendo…" independente da foto.

Duas consequências:

- **O lado esquerdo da imagem some** sob o degradê. Coloque o assunto do lado
  **direito** da foto.
- A faixa tem só 168 px de altura, então o recorte vertical é forte
  (`object-position: center 30%`, enviesado para cima). Enquadre com folga.
- **O assunto sempre encosta na borda direita da faixa.** Como a largura da
  imagem preenche o contêiner e o corte é só na vertical, não há como deslocar
  o assunto na horizontal. Por isso a frase em itálico foi centralizada na
  folga entre o texto e a foto, e não encostada à direita — ali cairia em cima
  do rosto. Ela também tem fundo de vidro fosco, para ler sobre qualquer foto.

No mobile a faixa vira coluna única e o véu passa a cobrir quase toda a imagem —
ali ela funciona mais como textura de fundo do que como foto.

## Não vejo a mudança depois de trocar a imagem

É cache do navegador. O arquivo é servido com o mesmo nome, então o navegador
reaproveita o que já baixou. Recarregue com **Ctrl + Shift + R** (ou abra em
uma janela anônima). Vale o mesmo depois de qualquer edição em `app.js` ou
`styles.css`.

## Se o arquivo faltar

O `onerror` remove a imagem, o CSS esconde o contêiner vazio (`:empty`) e a
faixa fica só com o degradê azul. Não quebra nada.

## ⚠️ Antes de escolher

Mesmas regras das outras pastas (`../hero/LEIA-ME.md`): banco de imagens com
licença livre ou imagem gerada, sem pessoa identificável, sem marca, brasão ou
qualquer coisa vinda do sistema original.
