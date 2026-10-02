# home/media/

Arquivos de mídia usados **pela home** (não pelos projetos — esses ficam em
`/projetos/<slug>/midia/`).

Destino principal: o **MP4 exportado da peça de animação**.

Hoje a seção de vídeo da home roda a peça ao vivo dentro de um iframe
(`../Vídeo/Video Planilhas para Sistema.dc.html`). Isso funciona, mas carrega a
peça inteira e depende da pasta `/Vídeo`. Quando o MP4 estiver exportado:

1. salve aqui, por exemplo `planilhas-para-sistema.mp4`;
2. salve também um frame de capa, `planilhas-para-sistema-poster.png`;
3. preencha em `home/video-data.js`:

```js
arquivo: "media/planilhas-para-sistema.mp4",
poster:  "media/planilhas-para-sistema-poster.png",
```

O `arquivo` tem prioridade sobre o `embed`: preenchido ele, a home passa a usar
o player nativo e o iframe é ignorado — sem precisar apagar nada.
