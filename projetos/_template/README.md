# Modelo de projeto

Ponto de partida para cada novo case do portfólio. **Não edite esta pasta** —
copie e trabalhe na cópia.

## Como criar um projeto novo

1. **Copie a pasta.** Duplique `_template` dentro de `/projetos` e renomeie
   para o slug do projeto (minúsculas, sem acento, com hífen):
   `projetos/meu-projeto-novo`.
   O nome da pasta é o `id` do projeto no portfólio inteiro — pasta, card e
   imagem salva no card usam essa mesma string. Escolha com calma: mudar o
   slug depois desconecta a imagem já colocada no card.

2. **Coloque o build em `app/`.** O que o botão "Abrir demo" abre é
   `app/dist/index.html`. Se o projeto usa Vite, é o resultado de `npm run build`.
   Se for uma página estática única, pode ser só um `index.html` dentro de `dist/`.

3. **Preencha o `CASE.md`.** As 12 seções já estão no arquivo.

4. **Guarde as imagens em `midia/`.** Capa e prints das telas.

5. **Registre o card** em `home/projects-data.js`: copie o bloco MODELO do fim
   do arquivo, cole na posição desejada do array (a ordem do array é a ordem do
   carrossel na home) e preencha. Os links ficam assim:

   ```js
   links: {
     demo: "../projetos/meu-projeto-novo/app/dist/index.html",
     caso: "../projetos/meu-projeto-novo/CASE.md",
     video: "",   // "#video" leva à seção de vídeo da home
     repo: "",
   },
   ```

6. **Coloque a capa no card.** Abra a home no editor e arraste a imagem para o
   placeholder do card (o `image-slot`), ou aponte direto no data:

   ```js
   midia: { tipo: "imagem", src: "../projetos/meu-projeto-novo/midia/capa.png", alt: "..." },
   ```

## Checklist antes de publicar o card

- [ ] `app/dist/index.html` abre e navega sem erro
- [ ] `CASE.md` sem nenhum `[colchete]` sobrando
- [ ] capa em `midia/` na proporção 16:10
- [ ] bloco preenchido em `home/projects-data.js`
- [ ] `status` correto: `Demo pública`, `Em produção` ou `Em construção`
- [ ] card aberto na home, links testados

## Estrutura da pasta

```
meu-projeto-novo/
├── CASE.md          documentação do case (12 seções)
├── app/
│   └── dist/        build publicado — é o que o botão "Abrir demo" abre
└── midia/           capa do card e prints das telas
```
