# imagens/cursos/

Capas dos cursos — aparecem no **catálogo** e no carrossel "Trilhas formativas"
da home.

É só soltar o arquivo com o nome do curso. Não precisa editar código.

Nas **miniaturas da área do cursista** (96 px) e nas **capas do painel
administrativo** a imagem não é usada: nesses dois lugares o espaço é pequeno
demais ou o recorte é uma faixa estreita, e entra sempre a ilustração azul
gerada por código. Se um dia as capas forem imagens sem texto, dá para ligá-las
lá também — os dois pontos estão comentados em `app/dist/app.js`.

## Tamanho recomendado

| Item        | Valor                                                    |
| ----------- | -------------------------------------------------------- |
| Dimensões   | **800 × 500 px**                                          |
| Proporção   | **16:10** — é o formato do card, e o recorte é pelo centro |
| Formato     | **PNG ou JPG** — os dois funcionam                         |
| Peso        | até **150 KB** por arquivo (JPG comprime bem melhor)      |

Por que 800 × 500: o card mais largo do catálogo tem 353 px, e o dobro disso
cobre telas retina com folga. Maior que isso só deixa a demo lenta — são até 12
imagens carregando na mesma página.

### Se a arte tiver texto

As capas atuais trazem o nome do curso desenhado na própria imagem, no **topo à
esquerda**. Duas consequências a manter em mente:

- O selo de status (*Inscrições abertas* / *Em breve*) fica no **canto inferior
  direito** justamente para não cobrir esse texto. Se mudar a arte e o texto for
  para baixo, o selo passa a atrapalhar — a regra está em `.badge`, no
  `styles.css`.
- Em 353 px o texto da arte já aparece reduzido a ~44% do tamanho original.
  Texto pequeno demais na arte fica ilegível no card.

Arte **sem texto** é mais flexível: além de evitar esses cuidados, permite
reaproveitar a imagem no painel e nas miniaturas.

## Nomes dos arquivos

| Arquivo | Curso | Trilha |
| ------- | ----- | ------ |
| `c01.png` ✅ | Avaliação formativa na prática | Gestão Pedagógica |
| `c02.png` ✅ | Dados educacionais para a gestão escolar | Gestão Pedagógica |
| `c03.png` ✅ | Pensamento computacional na sala de aula | Educação e Tecnologia |
| `c04.png` ✅ | Ferramentas digitais para o trabalho docente | Educação e Tecnologia |
| `c05.png` ✅ | Convivência e clima escolar | Socioemocional |
| `c06.png` ✅ | Mediação de conflitos na escola | Socioemocional |
| `c07.png` ✅ | Práticas inclusivas e desenho universal | Inclusão e Equidade |
| `c08.png` ✅ | Acessibilidade e tecnologia assistiva | Inclusão e Equidade |
| `c09.png` — ilustração | Recomposição de aprendizagens em Matemática | Matemática e Ciências |
| `c10.png` — ilustração | Investigação científica na educação básica | Matemática e Ciências |
| `c11.png` — ilustração | Leitura e produção textual | Linguagens |
| `c12.png` — ilustração | Multiletramentos e produção multimodal | Linguagens |

✅ = já tem imagem. Situação de 5 de setembro de 2026.

**Não precisa colocar as doze.** Cada curso sem imagem continua com a
ilustração azul gerada por código. Vale saber que, com parte dos cards em foto
e parte em ilustração, a grade fica visivelmente misturada — ou completa as
doze, ou aceita a mistura de propósito.

### Outro nome de arquivo ou outra extensão

`.png` e `.jpg` funcionam sem configuração — o código tenta `.png` e, não
achando, `.jpg`. Para um nome de arquivo diferente, declare no próprio curso,
em `CURSOS` (topo de `app/dist/app.js`):

```js
{
  id: "c01",
  titulo: "Avaliação formativa na prática",
  imagem: "imagens/cursos/avaliacao.webp",  // ← sobrepõe o padrão
  ...
}
```

## Cursos "Em breve"

Os cursos sem inscrição aberta aparecem **dessaturados** no catálogo — é o
sinal visual de que ainda não abriram. Isso vale para a foto também: não
adianta procurar uma imagem mais colorida, o CSS vai lavar a cor de propósito.

## ⚠️ Antes de escolher as imagens

Valem as mesmas regras do banner (`../hero/LEIA-ME.md`):

- **Nada de fotos de pessoas identificáveis.** Prefira planos gerais, mãos,
  materiais, ambientes, imagens sem rosto ou desfocadas.
- **Nada vindo do sistema original** nem de material da instituição real —
  logos, crachás, uniformes, placas, fachadas.
- **Nada com marca, brasão, nome de cidade ou estado** visível.
- Banco de imagens com licença livre para uso comercial (Unsplash, Pexels) ou
  imagens geradas.
