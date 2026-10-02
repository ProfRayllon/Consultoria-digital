# Fotos dos usuarios

Coloque nesta pasta as fotos reais que devem aparecer nos avatares do painel, ranking e lista de usuarios.

## Tamanho recomendado

- Use imagens quadradas em JPG.
- Tamanho ideal: 512 x 512 px.
- Tamanho minimo: 256 x 256 px.
- Peso recomendado: ate 300 KB por foto.
- Corte o rosto centralizado, com margem pequena acima da cabeca e dos ombros.
- Use apenas fotos com autorizacao das pessoas retratadas.

O sistema mostra as fotos em circulos pequenos. Se a imagem for retangular, ela sera cortada pelo centro para caber no avatar.

## Nomes dos arquivos

Salve os arquivos exatamente com estes nomes:

```text
marina-rocha.jpg
joao-silva.jpg
ana-lopes.jpg
diego-costa.jpg
camila-duarte.jpg
rafael-lima.jpg
bruna-alves.jpg
diego-matos.jpg
paula-reis.jpg
igor-sampaio.jpg
```

## Como trocar uma foto

1. Apague ou substitua o arquivo antigo nesta pasta.
2. Mantenha o mesmo nome do arquivo.
3. Reabra o HTML ou atualize a pre-visualizacao do projeto.

Se uma foto nao existir ou estiver com nome diferente, o video continua funcionando e mostra o avatar padrao.

## Formatos

O projeto esta configurado para JPG. Se quiser usar PNG ou WEBP, altere tambem o nome do arquivo no mapa `USER_PHOTO_FILES`, dentro de `piece.jsx`.
