---
name: Need or Greed
description: Reviews de jogos, filmes, séries e animes tratadas como loot de MMO. Fichário de Loot, noite de estalagem.
colors:
  fundo-estalagem: "#0f0d0b"
  fundo-cabecalho: "#0b0a08"
  painel-cartao: "#17140f"
  painel-fundo: "#120f0c"
  borda: "#2c261d"
  borda-forte: "#3d3428"
  borda-tracejada: "#2a241c"
  texto: "#e9e2d3"
  texto-forte: "#f4eee2"
  texto-2: "#a89e8a"
  texto-3: "#8b816f"
  ouro: "#e3b45c"
  ouro-forte: "#f0c878"
  frase: "#d9b866"
  positivo: "#5fd07a"
  negativo: "#e8735a"
  raridade-lixo: "#8d8a84"
  raridade-comum: "#ece8df"
  raridade-incomum: "#3fcf6b"
  raridade-raro: "#3f8ef5"
  raridade-epico: "#b360f2"
  raridade-lendario: "#f28a26"
  roll-need: "#f2c94c"
  roll-greed: "#9fd36b"
  roll-pass: "#8d8a84"
  gm-azul: "#38a0f0"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 0.95
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.15625rem"
    fontWeight: 400
    lineHeight: 1.68
  body-ui:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Fragment Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: "Fragment Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  gutter-celular: "16px"
  gutter: "24px"
  secao: "40px"
  largura-texto: "66ch"
  largura-home: "1232px"
  largura-maxima: "1600px"
components:
  ficha-bolso:
    backgroundColor: "{colors.painel-cartao}"
    textColor: "{colors.texto}"
    rounded: "{rounded.none}"
    padding: "10px"
  link:
    textColor: "{colors.ouro}"
  link-hover:
    textColor: "{colors.ouro-forte}"
  botao-d100:
    textColor: "{colors.ouro}"
    rounded: "{rounded.none}"
    size: "36px"
  seletor-idioma:
    textColor: "{colors.texto-2}"
    rounded: "{rounded.none}"
    padding: "6px 10px"
  janela-destaque:
    backgroundColor: "{colors.painel-fundo}"
    textColor: "{colors.texto}"
    rounded: "{rounded.none}"
    padding: "26px 36px 36px"
  tag-gm:
    textColor: "{colors.gm-azul}"
    rounded: "{rounded.none}"
---

# Design System: Need or Greed

## Overview

**Creative North Star: "O Fichário de Loot"**

Cada obra é um item que caiu numa raid e foi guardado numa ficha de colecionador. O site é uma noite de estalagem: fundo quase preto e quente, papel-cartão escuro, e o metal de cada item na cor da sua raridade. O MMO aparece só pelos elementos secundários do gênero (o dado de loot, a raridade, a mensagem de sistema do chat), nunca por personagens, logos ou pixel art. Quem jogou reconhece; quem não jogou só acha bonito.

O produto é o texto da review. Por isso a densidade é de revista: uma coluna de leitura de ~66 caracteres em serifa, com o resto da tela (veredito, sumário, loot log) em volta, em mono pequena, como a interface de um jogo em torno do mundo. O ouro é raro de propósito: ele só aparece onde dá para clicar ou onde há um destaque de verdade.

A estética rejeita, por decisão do Tomaz: card game (nada de foil, holográfico ou carta de TCG), gradientes roxo e azul, glassmorphism, brilho neon, pílulas arredondadas e grades de cards iguais com sombra.

**Key Characteristics:**
- Fundo escuro e quente; superfícies separadas por borda fina, não por sombra.
- Cantos retos em tudo (0px), inclusive nos comentários.
- Três fontes com papéis fixos: display condensada para nomes, serifa para ler, mono para o sistema.
- Cor de raridade e cor de roll nunca se misturam: dois eixos, duas famílias de cor.
- A ficha do item é o único card do site.

## Colors

Uma paleta de taverna à noite: neutros quentes de madeira e papel, um ouro de acento e duas famílias semânticas (raridade e roll) emprestadas da convenção dos MMOs.

### Primary
- **Ouro de Estalagem** (`ouro`): links, foco do teclado, título de seção da lateral ("Última crítica", "Loot log"), o botão d100, a seleção de texto e o botão "Publicar comentário". No hover vira o **Ouro Polido** (`ouro-forte`).
- **Ouro de Frase** (`frase`): só a frase de efeito em itálico no pé da ficha, como o texto de sabor de um item.

### Secondary
- **Raridades** (`raridade-lixo` a `raridade-lendario`): a cor do nome do item, da borda da ficha e da raridade no pé. A borda da ficha mistura 55% da cor da raridade com a borda neutra, para o metal não gritar.
- **Rolls** (`roll-need`, `roll-greed`, `roll-pass`): a palavra Need, Greed ou Pass na linha de roll, a marca do roll e o traço vertical do motivo.

### Tertiary
- **Stats** (`positivo`, `negativo`): atributos da ficha (+10 Cyberpunk em verde, -21 Trilha sonora em vermelho).
- **Azul do GM** (`gm-azul`): só a tag "GM" dos comentários da equipe, o azul dos posts oficiais da Blizzard, com o fundo dela a 16% da mesma cor.

### Neutral
- **Noite de Estalagem** (`fundo-estalagem`): o fundo de todas as páginas.
- **Viga do Teto** (`fundo-cabecalho`): o header fixo, um tom abaixo da página.
- **Papel-Cartão** (`painel-cartao`) e **Fundo de Gaveta** (`painel-fundo`): a ficha e as janelas (destaque da home, campos dos comentários).
- **Borda** (`borda`), **Borda Forte** (`borda-forte`) e **Tracejado** (`borda-tracejada`): divisões. O tracejado separa itens de uma lista (log, veredito, tabelas).
- **Texto** (`texto`), **Texto Forte** (`texto-forte`, primeiro parágrafo e negrito da review), **Texto 2** (`texto-2`, secundário) e **Texto 3** (`texto-3`, terciário, clareado para passar AA em texto pequeno).

### Named Rules
**The Gold Means Click Rule.** O ouro marca o que é clicável ou o destaque principal da tela. Texto corrido nunca é dourado.

**The Two Axes Rule.** Raridade e roll são dois eixos e nunca dividem cor: a raridade colore o item, o roll colore a decisão. Nenhum elemento soma os dois numa nota só.

## Typography

**Display Font:** Big Shoulders (com Arial Narrow)
**Body Font:** Literata (com Georgia)
**Label/Mono Font:** Fragment Mono (com ui-monospace)

**Character:** Uma condensada pesada e em caixa alta para nomes de itens e títulos, como uma etiqueta gravada; uma serifa de leitura longa para o texto, que é o produto; e uma mono de terminal para tudo que é "sistema" (log, roll, datas, contadores). As fontes são baixadas no build pela API de fontes do Astro.

### Hierarchy
- **Display** (800, clamp de 2.5rem a 3.5rem, line-height 0.92, caixa alta): título da review e do destaque da home.
- **Headline** (800, 1.75rem, line-height 1, caixa alta): títulos de seção do texto e das páginas (Sobre, Privacidade).
- **Title** (800, 1.5rem na ficha bolso e 1.875rem na ficha grande, caixa alta, na cor da raridade): nome do item.
- **Body** (400, 1.15625rem, line-height 1.68, até 66ch): o texto da review. Fora da review, a interface usa 17px com line-height 1.6.
- **Label** (400, 0.8125rem, mono): linha de roll, meta, navegação, botões de sistema.
- **Label caps** (400, 0.75rem, letter-spacing 0.08em, caixa alta, mono): rótulos de seção ("ÚLTIMA CRÍTICA", "LOOT LOG", "DISCUSSÃO").

### Named Rules
**The System Speaks Mono Rule.** Tudo que é mensagem do jogo (loot log, linha de roll, número da ficha, datas, nicks e ações dos comentários) é Fragment Mono. Tudo que é leitura é Literata. Nunca o contrário.

**The 13px Floor Rule.** No celular (até 720px), nenhum texto fica abaixo de 13px, inclusive dentro da caixa de comentários.

## Layout

O layout cresce até 1600px (`largura-maxima`), com header de container próprio na mesma largura em todas as páginas. A home usa 1232px. Na review, a coluna de texto para em 66ch e a largura extra vai para as laterais: à esquerda, o veredito fixo, o progresso de leitura e o sumário; à direita, o loot log. Entre 900px e 1180px fica só a lateral esquerda e o texto; abaixo de 900px, só o texto, com um veredito compacto embaixo do motivo e uma barra de progresso de 2px presa sob o header.

A primeira tela da home no desktop mostra header, hero, destaque com log e a ponta do "Mais loot" (no mínimo 32px), com altura calculada por `dvh`. No celular a home é empilhada, sem carrossel.

O header é fixo (`--cabecalho-h`: 65px no desktop, 57px no celular). No celular, só a linha da marca e do idioma fica presa; o menu fica logo abaixo e rola com a página. O ritmo vertical entre seções de página é de 40px; o gutter é 24px, e 16px até 640px. Todo link ou botão fora de uma frase tem 44px de altura de toque no celular.

**The Desktop Is Sacred Rule.** Ajuste de celular nunca muda o desktop: toda regra móvel fica atrás de um `max-width` e é conferida pixel a pixel.

## Elevation & Depth

O sistema é plano. A profundidade vem de camadas de tom (fundo, gaveta, cartão) e de bordas finas, não de sombra. A ficha usa duas bordas: a interna na cor da raridade e uma segunda, neutra, solta por fora (`outline` com 3px de afastamento), como uma ficha dentro de um plástico de fichário.

### Shadow Vocabulary
- **Ficha erguida** (`box-shadow: 0 10px 24px -8px rgb(0 0 0 / 0.6)`): só no hover e no foco da ficha bolso, junto com `translateY(-4px) scale(1.02)` em 180ms.
- **Tooltip do loot log** (`box-shadow: 0 14px 32px -10px rgb(0 0 0 / 0.75)`): a ficha mini flutuando sobre a página.
- **Menu do seletor de idioma** (`box-shadow: 0 12px 28px -10px rgb(0 0 0 / 0.7)`): o único popover do header.

### Named Rules
**The Flat-By-Default Rule.** Nada tem sombra em repouso. Sombra só aparece como resposta a estado (hover, foco) ou para o que flutua (tooltip, popover).

## Shapes

Cantos retos em tudo (0px): fichas, janelas, botões, campos, selos e os botões de voto dos comentários. As bordas são de 1px. As únicas formas que não são retângulos são os desenhos de traço do site: o d100 (hexágono com triângulo interno, no header, no botão de sortear e no favicon) e a marca de cada roll. Os avatares dos comentários são redondos porque vêm do Google e do Discord.

## Components

### Ficha do item (assinatura)
O único card do site. `Item.astro`, com as variantes **bolso** (listagens) e **mini** (tooltip do log), que mostram os mesmos dados e só mudam de tamanho.
- **Estrutura:** capa 4:3 com borda própria; nome do item na cor da raridade; tipo e plataforma; exatamente 2 atributos (positivo em verde, negativo em vermelho); frase de efeito em itálico dourado; linha de roll com o número; pé com o número de coleção ("Nº 001 · Telas") e "raridade · nota".
- **Moldura:** fundo papel-cartão, borda de 1px com 55% da cor da raridade e a segunda borda neutra solta por fora.
- **Hover e foco:** sobe 4px, escala 1.02, a borda assume a cor da raridade e a sombra de ficha erguida aparece, em 180ms. Só em aparelhos com hover; com movimento reduzido, só a cor da borda muda.
- **Já lida:** capa apagada e um carimbo "lido" no canto da capa, nunca no pé.

### Linha de roll
A assinatura de cada review, em mono: `Snufupugos rolou ○ Greed (69) para [Cyberpunk: Edgerunners 2]`. O nick no texto, o roll na cor do roll com a sua marca, o número em cinza e o nome do item entre colchetes na cor da raridade. O motivo do roll vem logo embaixo, com um traço vertical de 1px na cor do roll.

### Loot log
A janela de chat no canto da tela: lista cronológica em mono pequena, com data acima de cada evento e linhas tracejadas entre eles. Os nomes de item abrem a ficha mini num tooltip (150ms de atraso, à esquerda do link, Esc fecha, foco do teclado abre, inexistente no toque).

### Janela de destaque (home)
A review mais recente inteira, numa janela de altura fixa com rolagem interna: fundo de gaveta, borda de 1px, degradê no pé, focável e com contorno ouro de 2px no foco.

### Links e botões
- **Links:** ouro com sublinhado de 1px afastado 0.2em; hover em ouro polido. Links para fora do blog abrem em nova guia e ganham uma seta pequena desenhada.
- **Botão d100:** 36px, quadrado, borda forte, d100 de traço em ouro; no hover a borda vira ouro, e ao clicar o dado gira (420ms) antes de sortear de novo as fichas.
- **Seletor de idioma:** caixa mono de 0.75rem, texto secundário e borda forte no header ("PT Português"), com menu em popover; no hover a borda e o texto mudam em 200ms.
- **Foco do teclado:** contorno ouro de 2px, afastado 3px, em todo o site.

### Comentários (Garrul)
A caixa vive num Shadow DOM, num Worker separado. O visual vem das variáveis `--garrul-*` definidas em `src/components/Comentarios.astro` e do bloco "Need or Greed" no fim do CSS da cópia do Garrul.
- **Tipos:** comentário em Literata; nick, data, ações, votos e ordenação em Fragment Mono.
- **Campos:** fundo de gaveta, borda forte, cantos retos. Botão "Publicar comentário" em ouro com texto escuro.
- **Votos:** só os triângulos ▲▼, sem caixa; o voto dado fica em ouro.
- **Tag GM:** texto "GM" no azul do GM, fundo com 16% da mesma cor, sem contorno. Sem o selo do provedor de login.

## Do's and Don'ts

### Do:
- **Do** usar a cor da raridade só no item (nome, borda, raridade no pé) e a cor do roll só na decisão (palavra, marca, traço do motivo).
- **Do** manter o texto da review em Literata, até 66ch, line-height 1.68.
- **Do** separar superfícies por borda de 1px e camada de tom, com cantos retos (0px).
- **Do** usar Fragment Mono para tudo que é sistema: log, roll, datas, contadores, rótulos em caixa alta.
- **Do** dar 44px de toque e no mínimo 13px de texto a tudo no celular, sem mudar o desktop.
- **Do** respeitar `prefers-reduced-motion`: movimento só onde informa, e desligado quando o leitor pede.

### Don't:
- **Don't** usar nada de card game: foil, holográfico ou carta de TCG.
- **Don't** copiar arte, fontes, ícones ou o visual exato da Blizzard ou de qualquer jogo. O tooltip de item é convenção do gênero e tem desenho próprio.
- **Don't** usar personagens, logos de jogo, pixel art ou controle de videogame como ícone.
- **Don't** usar gradiente roxo ou azul, glassmorphism, brilho neon, pílulas arredondadas ou emoji como ícone.
- **Don't** criar outro desenho de card: toda listagem usa a ficha.
- **Don't** pôr sombra em repouso.
- **Don't** usar travessão em nenhum texto, em nenhuma das três línguas.
