# home/media/projetos/

Imagens de capa dos cards da seção "Projetos selecionados".

## Como usar

Salve o arquivo aqui com **exatamente o `id` do projeto** e extensão `.png`:

```
media/projetos/mais-formacao.png
media/projetos/sistema-gestao-sob-medida.png
media/projetos/modelo-analise-dados.png
```

O `id` é o mesmo que está em `home/projects-data.js`. Não precisa editar nada
no código: o card procura o arquivo por esse nome. Enquanto ele não existir, o
card mostra a moldura vazia com "Imagem do projeto".

## Formato

- proporção **16:10** (o card recorta nesse formato)
- 1280×800 é um bom tamanho
- PNG ou JPG — se usar `.jpg`, aponte o caminho no campo `midia` do projeto:
  `midia: { tipo: "imagem", src: "media/projetos/meu-projeto.jpg" }`
