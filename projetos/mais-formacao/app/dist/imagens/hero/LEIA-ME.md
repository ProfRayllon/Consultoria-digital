# imagens/hero/

Imagens do **carrossel do topo da home**. É só soltar os arquivos aqui com
estes nomes — não precisa editar código:

```
hero-1.jpg
hero-2.jpg
hero-3.jpg
hero-4.jpg
```

Enquanto um arquivo não existir, aquele slide mostra o fundo azul gerado por
código. A demo funciona com a pasta vazia; cada arquivo que você adiciona
simplesmente substitui um fundo.

## ⚠️ Antes de escolher as imagens

Esta é uma **Portfolio Edition** de um sistema privado. As imagens entram na
mesma regra de descaracterização do resto do projeto:

- **Nada de fotos de pessoas identificáveis.** Prefira imagens sem rosto,
  desfocadas, de costas, planos gerais de ambiente, ou ilustrações e texturas.
- **Nada de imagens vindas do sistema original**, nem de material da
  instituição real — logos, crachás, uniformes, placas, fachadas.
- **Nada com marca, brasão, nome de cidade ou estado** visível.
- Use banco de imagens com licença livre para uso comercial (Unsplash, Pexels)
  ou imagens geradas.

Se a imagem tiver uma pessoa reconhecível, ela precisa ter autorização de uso —
e mesmo assim continua sendo mais seguro não usar.

## Formato

- proporção **4:3** (o carrossel recorta nesse formato no desktop, 16:10 no mobile)
- 1200×900 é um bom tamanho
- JPG, até ~400 KB por arquivo — são carregadas todas de uma vez
- imagens escuras funcionam melhor: há um degradê escuro embaixo para a legenda

## Trocar os textos das legendas

Título e legenda de cada slide ficam em `HERO_SLIDES`, no topo de
`app/dist/app.js`. É lá também que se muda o nome do arquivo, se você preferir
outro, ou se quiser mais/menos de quatro slides.
