# imagens/marca/

Logo e favicon da marca fictícia **+Formação**.

```
logo.png            EM USO — lockup no cabeçalho, no login e na barra do painel
favicon.svg         EM USO — ícone da aba do navegador
logo-original.png   backup do arquivo enviado, antes do corte das margens
```

Para trocar, **substitua o arquivo mantendo o mesmo nome** — nada mais precisa
mudar no código.

## logo.png

É o lockup horizontal completo (ícone **+** e a palavra *Formação*), com fundo
transparente. Exibido com 32 px de altura e largura automática.

O arquivo enviado tinha 1920×1080 com o desenho ocupando só o miolo — quase
tudo era margem transparente. Ele foi **aparado pelo canal alfa** e reduzido
para 621×136 (~50 KB); o original está guardado em `logo-original.png`. Se
enviar uma logo nova com muita margem, apare antes, senão ela aparece pequena
no meio de um espaço vazio.

- fundo **transparente** (PNG-24 com alfa) — não use fundo branco chapado
- proporção larga, algo entre 3:1 e 5:1
- altura de pelo menos 128 px, para não serrilhar em telas retina

### Sobre superfícies escuras

Na barra lateral do painel administrativo a palavra *Formação* é azul-marinho e
sumiria no fundo escuro. O CSS resolve com
`.brand-on-dark .brand-logo { filter: brightness(0) invert(1) }` — a logo inteira
vira branca. Se um dia a logo passar a ter cor clara própria, é essa regra que
deve sair, em `app/dist/styles.css`.

### Se o arquivo faltar

O `onerror` marca o link com a classe `sem-logo` e o CSS revela a versão
desenhada em código (quadrado azul com "+" e o nome ao lado). A marca nunca
some da tela.

## favicon.svg

- quadrado, legível em 16×16 px: pouca coisa, muito contraste
- declarado em `app/dist/index.html`
- para máxima compatibilidade dá para adicionar um `favicon.png` de 32×32 e uma
  segunda linha `<link rel="icon" ...>` no HTML

## ⚠️ Lembrete

A marca é **fictícia**. Não coloque aqui o logo da instituição real, nem nada
derivado dele — é justamente o que a Portfolio Edition existe para evitar.
