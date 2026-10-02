# midia/

Imagens do projeto.

| Arquivo             | Uso                        | Formato sugerido        |
| ------------------- | -------------------------- | ----------------------- |
| `capa.png`          | capa do card na home       | 16:10, 1280×800, PNG    |
| `tela-*.png`        | prints citados no CASE.md  | largura ≥ 1280          |

A capa pode chegar ao card de duas formas:

1. arrastando a imagem no placeholder do card, com a home aberta no editor; ou
2. apontando no data, em `home/projects-data.js`:

```js
midia: { tipo: "imagem", src: "../projetos/<slug>/midia/capa.png", alt: "..." },
```

Também é possível usar um vídeo curto em loop como capa:

```js
midia: { tipo: "video", src: "../projetos/<slug>/midia/capa.mp4", poster: "..." },
```

Apague este arquivo ao usar a pasta.
