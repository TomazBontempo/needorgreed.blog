# Need or Greed

Blog de críticas de jogos, séries, filmes e animes, escrito por **Snufupugos** (Tomaz) e, no futuro, por parceiros.
Cada obra é tratada como um loot de MMO: **Need**, **Greed** ou **Pass**.

Este arquivo é a fonte da verdade do projeto. Leia inteiro antes de qualquer tarefa.

---

## Regras de escrita (valem para código, UI, commits e respostas)

- O site é **bilíngue: inglês (padrão) e português do Brasil**. Ver a seção "Idiomas". Todo texto de interface
  existe nas duas línguas; nada de texto fixo no markup.
- **Nunca use travessão (—)**, em nenhuma das duas línguas. Nem no site, nem em comentários de código, nem em commits, nem nas suas respostas.
  Use vírgula, dois pontos, ponto ou parênteses.
- Tom do site: casual, direto, bem humorado, com opinião. Nada de texto de marketing ("descubra", "explore", "sua jornada").
- Respostas para o Tomaz: diretas e consolidadas, sem enrolação.

## Como trabalhar com o Tomaz (aprendido no redesign)

- **Mude só o que foi pedido.** Quando ele lista ajustes ("não mexa no que não está listado"), qualquer
  mudança fora da lista vira retrabalho. Se uma mudança pedida afeta outra parte (ex.: um componente usado
  em duas páginas), aplique só onde ele pediu e pergunte sobre o resto.
- **Dúvida de design ou produto: pergunte.** Não escolha sozinho cor, layout, copy ou comportamento novo.
- **Mostre antes de seguir.** Cada rodada visual termina com screenshots nas larguras que ele pedir
  (padrão: 1280x800, 1440x900, 1920x1080, 2560x1440 e 390x844) e espera o feedback.
- **Medidas, não impressão.** Ao afirmar que algo cabe, alinha ou funciona, meça no navegador (Playwright)
  e diga os números. Se uma afirmação anterior estava errada, corrija na hora.
- **Commits frequentes.** Ele pede reversões ("volte como estava antes"); sem commit, a única fonte é
  a memória da sessão. Faça commit ao fim de cada rodada aprovada (só quando ele autorizar commits).

---

## Identidade

- **Nome:** Need or Greed. Domínio principal `needorgreed.blog` (`needorgreed.com.br` redireciona).
- **Autor principal:** Snufupugos, nick de jogos do Tomaz, com origem no World of Warcraft.
- **Referência:** universo de MMORPG, mas sempre por um elemento **secundário** (o dado de loot, a raridade de item,
  o chat de sistema), nunca por ícones óbvios (personagens, logos, pixel art, controle de videogame).
  Quem jogou reconhece; quem não jogou só acha bonito.
- **Proibido:** copiar arte, fontes, ícones ou o visual exato da Blizzard ou de qualquer jogo.
  O tooltip de item é convenção do gênero, então pode existir, mas com desenho próprio.
- **Paleta aprovada pelo Tomaz** (ponto de partida, pode ser refinada):

  | Token | Hex | Uso |
  |---|---|---|
  | fundo | `#0f0d0b` | noite de estalagem |
  | painel | `#120f0c` / `#17140f` | superfícies |
  | borda | `#2c261d` | |
  | texto | `#e9e2d3` / `#a89e8a` / `#6f6656` | primário, secundário, terciário |
  | ouro | `#e3b45c` | acento, links |
  | frase | `#d9b866` | frase de efeito do item |
  | stat positivo | `#5fd07a` | atributos |
  | Lixo | `#8d8a84` | raridade |
  | Comum | `#ece8df` | raridade |
  | Incomum | `#3fcf6b` | raridade |
  | Raro | `#3f8ef5` | raridade |
  | Épico | `#b360f2` | raridade |
  | Lendário | `#f28a26` | raridade |
  | Need / Greed / Pass | `#f2c94c` / `#9fd36b` / `#8d8a84` | rolls |

---

## Sistema de avaliação

Dois eixos **independentes**. Eles podem e devem divergir.

### Raridade: o quão bom é

Derivada da nota (0 a 10, uma casa decimal).

| Raridade | Nota |
|---|---|
| Lixo de vendedor | 0 a 2.9 |
| Comum | 3 a 4.9 |
| Incomum | 5 a 6.9 |
| Raro | 7 a 8.9 |
| Épico | 9 a 9.9 |
| Lendário | 10 (raríssimo) |

### Roll: vale seu tempo e dinheiro agora?

- **Need:** vale agora, pelo preço cheio, para a maioria de quem gosta do gênero. Não espere.
- **Greed:** é bom, mas com condição: espere promoção, só para fãs do gênero, ou o custo de tempo é alto.
- **Pass:** não vale, nem com desconto ou de graça.

Exemplos de divergência que o site deve comunicar bem:
- Épico mas Greed: excelente, mas é um grind de 100h para nicho.
- Incomum mas Need: curtinho, barato ou no Game Pass.
- Raro mas Pass: bem feito, mas é remaster de algo que você joga mais barato.

**Campo `motivoRoll`** (uma linha, opcional mas recomendado, essencial no Greed): explica o veredito.
Ex.: `Espere uma promoção, 60 reais é muito pelo conteúdo.` Aparece sempre colado ao roll.

### Linha de roll

Assinatura de cada review, no formato de mensagem de sistema de loot:
`Snufupugos rolou Need (94) para [Outer Wilds]`
O nick vem do autor, o item é colorido pela raridade, o roll pela cor do roll.

---

## Estrutura do site

### Home (ordem fixa)

Desktop (tudo isso cabe na primeira tela; ver "Padrões estabelecidos"):

1. **Header:** logo à esquerda; Jogos, Telas, Arquivo, Sobre e o seletor de idioma à direita. Fixo no topo.
2. **Hero:** a frase de impacto, a explicação em duas linhas, uma linha em branco e o link para o Sobre,
   sem fundo próprio nem bordas. Alinhado com o logo do header (largura do header), não com o destaque.
3. **Destaque: a review mais recente, estilo post do Reddit**, sob o título "Última crítica". O texto
   **completo**, numa janela de altura fixa com rolagem interna, sem a ficha do item. No fim, o link
   "Abrir review e comentários" leva à página dedicada, onde ficam os comentários.
4. **Loot log:** barra lateral ao lado do destaque, como a janela de chat no canto da tela de um jogo.
5. **Mais loot:** fichas sorteadas (descoberta, não cronológico), com botão d100 para sortear de novo.

Mobile: header compacto, só a descrição do hero e um carrossel de fichas em ordem cronológica.

### Loot log x cards: funções diferentes, não redundantes

- **Log = atividade.** Compacto, cronológico, texto de sistema. Registra eventos, não só reviews:
  - review criada: `Snufupugos rolou Greed (72) para [Jogo]`
  - review editada (re-roll): `Snufupugos re-rolou Greed (72) para [Jogo]`, igual ao roll original, com o
    roll atual e sem contador (edições do mesmo dia viram uma linha só). Espanhol: `re-tiró`.
  - autor novo: `OutroNick entrou no grupo`
  Fonte: histórico de commits do GitHub no build (o mesmo mecanismo de autoria, ver abaixo).
  A página **Arquivo** é o log completo, com filtros simples. Isso resolve o arquivo de forma criativa.
- **Cards = navegação.** Visuais, com capa, raridade, roll e frase. Para quem quer escolher o que ler.
  Aparecem na home ("Mais loot"), em Jogos, Telas, páginas de raridade e de autor.

### Demais páginas

- **Review** (`/reviews/<slug>/`): capa, título, linha de roll, motivo, tooltip do item, texto, tags,
  "escrito por / editado por", comentários (Giscus).
- **Jogos** e **Telas**: listagem em cards. Telas = filmes, séries e animes. "Lugares" virá depois como terceira seção.
- **Raridade** (`/raridade/<id>/`) e **Autor** (`/autores/<slug>/`).
- **Arquivo:** o loot log completo.
- **Sobre:** toda a lógica (raridade, roll, divergência, número do roll, loot log com re-roll, línguas,
  quem escreve) e, por último, um glossário só com os termos que o resto da página não explica
  (Linha de roll, Ficha, d100).
- **RSS** e **404** temática.

---

## Idiomas (inglês, português e espanhol)

O site existe em **inglês** (padrão, na raiz), **português do Brasil** (`/pt/`) e **espanhol neutro da
América Latina** (`/es/`, es-419: "tú", nunca "vosotros", sem regionalismos da Espanha). Portugal e os
outros países lusófonos recebem o português do Brasil.

### Regra de idioma para o leitor (decisão do Tomaz, baseada no que o Google e a Wikipedia fazem)

1. **Escolha salva vence tudo.** Se o leitor escolheu um idioma (seletor ou faixa de sugestão), essa escolha
   vale em qualquer página, em todas as visitas.
2. **Sem escolha salva, só a home (`/`) redireciona**, pelo **idioma do navegador** (`Accept-Language`):
   navegador em português vai para `/pt/`, em espanhol para `/es/`, qualquer outro fica no inglês.
3. **Qualquer outro link abre na língua do próprio link.** Uma review compartilhada em `/pt/` abre em
   português para qualquer pessoa. Se o navegador do leitor for de outra das nossas línguas, aparece a
   **faixa de sugestão** ("Esta página também está em português. Ler em português · Continuar em inglês"),
   escrita na língua sugerida. Nunca redirecionar uma página com conteúdo por palpite.
4. **O país não decide nada.** IP diz onde a pessoa está, não o que ela lê. Não volte a usar `cf.country`.
5. **Seletor de idioma** sempre visível no header, com as línguas escritas nelas mesmas (English, Português,
   Español) e sem bandeiras (bandeira é país, não língua).

### Como implementar

- **URLs por idioma:** inglês na raiz, `/pt/` e `/es/`, com os nomes das seções traduzidos (tabela em
  `src/i18n/rotas.ts`). Todas as versões são páginas estáticas geradas no build, com o i18n nativo do Astro.
- **Decisão no edge:** `src/worker.ts` chama `decidir()` (`src/i18n/deteccao.ts`) antes de servir a página.
  A leitura do idioma do navegador fica em `src/i18n/preferencia.ts`, usada também pela faixa no navegador
  (`navigator.languages`). Escolha salva num **cookie** `lang` (o servidor precisa ler), espelhada em `localStorage`.
  - Na Cloudflare Workers, arquivos estáticos são servidos **sem passar pelo Worker** por padrão. O
    `assets.run_worker_first` (no `wrangler.jsonc`) cobre as rotas HTML, deixando `/_astro/*`, imagens, vídeos
    e `/fichas/` fora. Confirme com `npx wrangler dev`.
  - A home responde com `Vary: Accept-Language, Cookie`. Redirecionamentos são 302 com `Cache-Control: private, no-store`.
  - Não redirecione bots de busca (o Googlebot nem manda `Accept-Language` e rastreia de IPs dos EUA).
- **SEO:** `hreflang` (en, pt-BR, es, x-default em inglês) e `canonical` em todas as páginas, e o mesmo
  conjunto no `sitemap.xml` (`src/pages/sitemap.xml.ts`), citado no `robots.txt`.
- **Textos de interface:** dicionários `src/i18n/en.ts`, `pt.ts` e `es.ts` (nav, rótulos, nomes de raridade,
  datas, 404, Sobre, seletor, faixa). Nomes de raridade em inglês: Vendor Trash, Common, Uncommon, Rare, Epic,
  Legendary; em espanhol: Basura de vendedor, Común, Poco común, Raro, Épico, Legendario.
  Need, Greed e Pass ficam iguais nas três línguas. Datas formatadas com o locale do idioma.
- **Nova língua no futuro:** `IDIOMAS` em `rotas.ts` (e no `scripts/translate.mjs`), um dicionário novo,
  as seções e os slugs de raridade em `rotas.ts`, as rotas em `src/pages/<código>/`, o locale no
  `astro.config.mjs` e a opção no campo "Idioma do texto" do `keystatic.config.tsx`.

### Tradução automática das reviews

O Tomaz escreve em português; parceiros podem escrever em inglês ou espanhol. As outras versões são **geradas automaticamente**.

- Cada review tem o campo `idioma` (`pt`, `en` ou `es`, padrão `pt`) indicando a língua original.
- Um script (`npm run translate`) gera as versões nas outras línguas como arquivos ao lado do original:
  `src/content/reviews/<slug>/index.mdx` (original) e `index.en.mdx`, `index.pt.mdx`, `index.es.mdx` (traduções).
  Traduz: corpo, `frase`, `motivoRoll`, nomes dos `atributos` e `tags`. Mantém: título da obra, números,
  datas, imagens, componentes MDX (`<YouTube />`) e formatação Markdown intactos.
- O script roda numa **GitHub Action** a cada push que mexe em reviews e **commita a tradução** no repositório.
  Assim ela é revisável, editável, versionada e não é refeita a cada build.
- Guarde no arquivo traduzido o hash do original. Só retraduza quando o original mudar.
- Se alguém editar a tradução à mão, marque `revisado: true` no arquivo traduzido e **nunca sobrescreva**.
  Se o original mudar depois disso, avise (comentário no commit ou log da Action) em vez de retraduzir.
- A página traduzida mostra um aviso discreto: "Traduzido automaticamente do português" (ou do inglês),
  com link para o original.
- Se a tradução não existir ainda, a página do outro idioma mostra o original com esse aviso, em vez de 404.
- **Serviço: Cloudflare Workers AI, no plano Workers Free.** Decisão do Tomaz, com uma condição inegociável:
  **custo zero e sem cartão de crédito.** Nada nesta parte pode exigir plano pago, cartão ou serviço cobrado.
  - Use um **LLM open source** do catálogo do Workers AI (ex.: Gemma ou Llama), não um tradutor clássico:
    lida melhor com gíria gamer e tom opinativo. Confirme no catálogo atual qual modelo está disponível no
    plano Free e escolha pelo melhor custo/qualidade dentro da cota.
  - A cota grátis é diária (10.000 neurons, zera à meia-noite UTC). No plano Free, passar dela gera erro, não
    cobrança. O script deve tratar esse erro: deixar a review sem tradução (a página mostra o original com aviso)
    e tentar de novo no próximo run, sem quebrar a Action.
  - O prompt de tradução deve: manter frontmatter, Markdown e componentes MDX intactos; preservar nomes de jogos,
    personagens e termos de MMO (Need, Greed, Pass, loot, raid); manter o tom e o humor do autor; nunca usar travessão.
  - A Action chama a API REST do Workers AI com um token da Cloudflare com permissão só de Workers AI,
    guardado em secret da GitHub Action, nunca no repositório nem no front.
  - Nunca sugira subir para o Workers Paid nem trocar para serviço pago. Se a cota não der conta, avise o Tomaz.
- Os comentários (Giscus) são compartilhados entre todas as versões da mesma review (mapear pelo slug, não pela URL).

---

## Arquitetura (já validada no protótipo, manter)

- **Astro** (v7), `output: 'static'`. Reviews em MDX, uma pasta por review:
  `src/content/reviews/<slug>/index.mdx` (+ imagens). Campos: ver `src/content.config.ts`.
- **Keystatic** em `/keystatic` para quem não é dev. No dev salva no disco (modo `local`);
  em produção, login com GitHub e cada "Salvar" vira commit da conta logada. Ver `keystatic.config.tsx`.
  O Tomaz também posta direto pela IDE; os dois caminhos geram o mesmo arquivo.
- **Autor automático:** não existe campo autor. No build, `src/lib/autores.ts` pergunta à API do GitHub qual
  **conta** criou cada arquivo e cruza com `src/content/autores/*.json`. Usar sempre o login da conta,
  nunca nome/email do commit (falsificável). Sem API, cai em `SITE.autorPadrao`.
- **Comentários:** Giscus (GitHub Discussions), configurado em `src/site.config.ts`.
- **Deploy: Cloudflare Workers** (não Pages: o adapter atual do Astro só suporta Workers).

### Armadilhas já resolvidas (não desfazer)

- `astro.config.mjs` usa o adapter **Node no dev** e o **Cloudflare só no build**. O Keystatic em modo local
  precisa de disco, e o runtime da Cloudflare (workerd) não tem.
- `prerenderEnvironment: 'node'` no adapter Cloudflare, para o build poder chamar a API do GitHub.
- `session: false` para não provisionar KV. `imageService: 'compile'` para otimizar imagens no build.
- O dev server do Astro 7 roda em background: `npx astro dev --background`, `npx astro dev stop`, `npx astro dev logs`.
  Para testar o build de produção de verdade: `npm run build && npx wrangler dev`.

### Estrutura (o protótipo já foi substituído; não existe mais pasta de protótipo)

```
src/worker.ts              Worker: idioma (?lang=, cookie, Accept-Language só na home) e depois o handler do Astro
src/i18n/                  en.ts, pt.ts, es.ts (dicionários), rotas.ts (URLs por idioma), deteccao.ts (regra),
                           preferencia.ts (idioma do navegador, usado no Worker e na faixa)
src/views/                 páginas de verdade: Home, Review, Secao (Jogos/Telas), Raridade, Autor, Arquivo, Sobre, NaoEncontrado
src/pages/                 rotas finas por idioma: games.astro chama views/Secao; pt/jogos.astro idem
src/components/            Item (a ficha), LootLog, DestaqueHome, ReviewCompleta, LateralReview, CabecalhoReview,
                           LinhaRoll, MarcaRoll, Fichario, Prosa, Figure, Clipe, YouTube, mdx.ts (mapa do MDX),
                           SeletorIdioma (header), SugestaoIdioma (faixa fixa no pé da tela)
src/lib/                   reviews (versaoEm por idioma), lootlog + lootlog-eventos (puro, testável), autores,
                           comentarios (contagem Giscus), caminhos (getStaticPaths), rss, raridade
src/integrations/          midia.ts: capa obrigatória, mídia na pasta certa, texto alternativo, 25 MB, sem erro silencioso
src/styles/                global.css (tokens) e item.css (a ficha, global com prefixo it-)
scripts/translate.mjs      npm run translate (Workers AI, --mock para testar)
.github/workflows/         translate.yml: traduz e commita a cada push em reviews e uma vez por dia
PRODUCT.md, .impeccable/   contexto da Impeccable (config.json; review/ e mocks/ ficam fora do git)
ESTADO.md                  o que está pronto, o que falta, como testar. Leia depois deste arquivo.
```

### Padrões estabelecidos (seguir)

- **Uma ficha só.** `Item.astro` com variantes `grande`, `bolso` (listagens e carrossel) e `mini` (tooltip
  do log). Nunca crie outro desenho de card. Estilos em `src/styles/item.css`, globais, prefixo `it-`.
  Hover do bolso: sobe 4px, escala 1.02, borda na cor da raridade, sombra suave, 180ms, só em `(hover: hover)`;
  com movimento reduzido, só a cor da borda.
- **Header fixo** (sticky, z-index 20) com container próprio: `--largura-cabecalho` (1600px), igual em todas
  as páginas. A altura fica em `--cabecalho-h` (65px desktop, 81px celular) e é usada na primeira tela da
  home, nas laterais fixas, em `scroll-padding-top` e `scroll-margin-top`. Popovers ficam acima (z-index 50).
- **Larguras:** layout padrão até 1600px (`--largura`). A home usa 1232px (`<Base largura="1232px">`).
  Na review, a coluna de texto para em 720px (~70 caracteres) e a largura extra vai para as laterais.
- **Home desktop:** a primeira tela mostra header, hero, destaque com log e o título de "Mais loot" com
  uma ponta das fichas (no mínimo 32px), altura calculada com dvh. O respiro do hero (até 65px em cima e
  embaixo) empurra a página em vez de espremer o destaque; se passar do limite, o respiro diminui
  conforme a tela (e, em tela muito baixa, o destaque também). Ver `--espiar-minimo` em `views/Home.astro`.
  O destaque é uma janela de altura fixa com rolagem interna, focável, com rótulo,
  degradê no pé e sem prender a rolagem da página. Título "Última crítica" / "Latest review" fora da janela.
- **"Mais loot":** sorteado no navegador por um script inline antes da primeira pintura (sem layout shift),
  nunca inclui o destaque, prefere reviews fora do log, botão d100 para rolar de novo. Sem JS: ordem do build.
- **Home mobile (<900px):** sem título visível no hero, sem destaque e sem log; carrossel de fichas com
  scroll-snap nativo, 85vw por ficha, indicador "1 / N", ordem cronológica, última ficha "Todas as reviews".
- **Tooltip do loot log:** um elemento só por página, preenchido pelo fragmento `/fichas/<idioma>-<slug>/`
  (gerado no build, fora do Worker e dos buscadores; a língua vai colada no slug porque o roteador do Astro
  devolve 404 para qualquer caminho com `en` como trecho isolado, já que o inglês não tem prefixo). Abre à esquerda do link, nunca cobre o nome, 150ms de
  atraso, Esc fecha, foco do teclado abre, não existe em toque.
- **Página da review:** título, linha de roll, motivo. Lateral esquerda fixa (veredito, progresso de leitura,
  sumário com a seção atual), texto no centro, loot log à direita. No celular, só a coluna do centro.
- **Mídia nas reviews (regras do Tomaz):** 1) tudo na pasta da review: `capa.<ext>` na raiz, imagens em
  `imagens/`, clipes e seus quadros em `videos/`; 2) **capa obrigatória** (schema, painel e build; não existe
  ficha sem imagem); 3) **nenhum erro silencioso**. Caminhos sempre `../<slug>/...` (o único formato que o
  painel reconhece: `./foto.jpg` é apagado ou escapado ao salvar pelo painel). O painel limpa o nome do arquivo
  no upload (`src/lib/nomes-de-arquivo.ts`); o nome é livre (sem regra nem aviso, decisão do Tomaz). Texto
  alternativo e `descricao` do `<Clipe>` são recomendados: sem eles o build só avisa (decisão do Tomaz;
  o painel também não consegue obrigar, testado). `src/integrations/midia.ts` faz o build parar quando a
  página sairia quebrada (capa, caminho ou arquivo errado, 25 MB) e avisa sobre o resto. Limite de 25 MB por arquivo (Cloudflare Workers). Detalhes no README.
- **Links para fora do blog abrem em nova guia** (regra do Tomaz: o leitor não sai do Need or Greed), com
  `rel="noopener noreferrer"` e o aviso "(abre em nova guia)" para leitor de tela (`aria-describedby`).
  No texto das reviews isso é automático: o MDX troca todo `a` pelo componente `Link`
  (`src/components/Link.astro`, critério em `src/lib/links-externos.ts`). Em componente, use
  `ATRIBUTOS_LINK_EXTERNO` e `relCom()`. Plugins rehype não servem: o processador padrão de Markdown do
  Astro 7 (Sätteri) os ignora.
- **Texto de interface só nos dicionários**, inclusive o Sobre. O TypeScript obriga en.ts e pt.ts a terem
  as mesmas chaves. Plural sempre por função do dicionário, nunca por troca de número no texto.
- **Testes visuais:** Playwright com o Chromium já instalado em `~/.cache/ms-playwright`, rodando fora do
  repositório. Para servir o build estático: `python3 -m http.server 4400 -d dist/client`. Para o Worker:
  `npm run build && npx wrangler dev`, simulando o navegador com o header `Accept-Language`. No Playwright,
  `locale: 'es-MX'` no contexto muda o `navigator.languages` (para testar a faixa de sugestão).
- **Não use `pkill -f` com padrões que aparecem no próprio comando** (mata o shell). Guarde o PID.

---

## Design: processo obrigatório

O site **não pode parecer feito por IA**. Antes de qualquer trabalho visual:

1. **Liste as skills instaladas** e use-as. A principal é a **Impeccable** (o `init` já rodou: existe
   `PRODUCT.md` e `.impeccable/config.json` com `buildPath: code`). Siga o fluxo dela do começo,
   incluindo a etapa de contexto de design do projeto (se a versão instalada tiver o comando de setup/teach,
   rode primeiro e use este CLAUDE.md como base). Verifique como a versão instalada expõe os comandos
   antes de usá-los. Use também `frontend-design` ou outras skills de UI se estiverem instaladas.
2. **Proponha a direção visual antes de codar:** tipografia, grid, como o tooltip, o log e o destaque vão ficar,
   e o que torna o site memorável. Espere o OK do Tomaz.
3. **Construa** página por página, começando pela home e pela página de review.
4. **Revise com as ferramentas de auditoria/crítica da Impeccable** e corrija antes de considerar pronto.
5. **Verifique no navegador** (screenshot em 1280px e 390px) e mostre ao Tomaz.

### Anti-cara-de-IA (evitar)

- Gradientes roxo/azul genéricos, glassmorphism, brilho neon gratuito.
- Inter (ou fonte de sistema) em tudo; hierarquia só por tamanho; tudo centralizado.
- Grades de cards idênticas com sombra e `rounded-2xl`, badges em pílula por toda parte.
- Emojis como ícones, ícones genéricos de biblioteca sem propósito.
- Hero com título gigante + subtítulo + dois botões. Seções empilhadas iguais.
- Copy de marketing. Lorem ipsum. Placeholders cinza sem intenção.

### Buscar

- Tipografia com personalidade e pares bem escolhidos; uma fonte mono para o texto de sistema (log, roll).
- Detalhes de "interface de jogo" sutis e originais: bordas de tooltip, cantos, texto de sistema, o d100.
- Densidade e ritmo de revista para o texto da review: ele é o produto, legibilidade em primeiro lugar.
- Estados de hover e foco caprichados, movimento discreto, respeitando `prefers-reduced-motion`.
- Acessibilidade: contraste AA (atenção às cores de raridade sobre fundo escuro), foco visível, HTML semântico.
- Performance: site estático, pouco JS, fontes com `display=swap`, imagens otimizadas pelo Astro.

---

## Decisões tomadas e em aberto

Tomadas (não reabrir sem o Tomaz pedir):
- **Direção visual: "Fichário de Loot"**, sem nada de card game (nada de foil, holográfico ou carta de TCG:
  o Tomaz vetou). Cada review é uma ficha de item com número de coleção (Nº 009), borda na cor da raridade
  e uma segunda borda solta por fora.
- **Copy do hero:** "Every work is a loot drop." / "Cada obra é um loot." / "Cada obra es un loot.";
  depois "Reviews of games, films, series and anime." e "Rarity says how good the work is, and the roll
  says if it is worth your time." em duas linhas; uma linha em branco; o link "More about our ratings" /
  "Saiba mais sobre nossas notas" / "Más sobre nuestras notas".
- **Sem raridade Herança** (removida pelo Tomaz em 2026-10-24: não fazia sentido fora da escala).
  Obra de valor afetivo se avisa no texto da review.
- **"Loot" também em espanhol** (nada de "botín"): "Más loot", "Cómo funciona el loot".
- **Número do roll:** nota vezes 10 (0 a 100), sempre dentro da faixa da raridade. `valorDoRoll()`.
- **Tipografia:** Big Shoulders (display), Literata (texto), Fragment Mono (sistema), via API de fontes
  do Astro (`fonts` no astro.config, baixadas no build).
- **URLs traduzidas:** `/games/` e `/pt/jogos/`, `/rarity/epic/` e `/pt/raridade/epico/`, `/archive/`,
  `/about/`, `/authors/`. Só `/reviews/<slug>/` é igual nas duas. Tabela em `src/i18n/rotas.ts`.
- **Modelo de tradução:** `@cf/google/gemma-4-26b-a4b-it` (Workers AI Free, ~150 neurons por review e por língua).
- **Três línguas:** inglês, português do Brasil e espanhol neutro da América Latina. Idioma pelo navegador,
  não pelo país; só a home redireciona; faixa de sugestão fixa no pé da tela (no topo ela empurraria a
  página depois de carregar). Ver "Idiomas".

Em aberto:
- **Logo.** O d100 de traço é placeholder.
- **Home mobile:** hoje é um carrossel de fichas (ver "Padrões"). O Tomaz disse que vai rever o mobile depois.
- **Destaque da home:** na página da review o título vem antes da linha de roll; no destaque da home ainda
  vem depois. Perguntar se deve seguir a página da review.
- **Bio de autor em inglês:** só existe `bio` (em português). Um campo `bio_en` resolveria.
- **Fechamento da Impeccable:** a crítica rodou em 2026-10-24 (ver ESTADO.md); falta a auditoria (`audit`)
  e o `DESIGN.md` gerado do site pronto.

## Comandos

```bash
npm install
npx astro dev --background      # dev em http://localhost:4321, painel em /keystatic
npx astro dev stop
npm run build                   # build de produção (Cloudflare)
npx wrangler dev                # serve o build como na Cloudflare
npx astro check                 # tipos (precisa passar com 0 erros)
npm run translate               # traduz as reviews (precisa do token; --mock para testar)
```

Antes de dizer que algo está pronto: `npm run build` sem erros, páginas checadas no navegador
nas duas larguras e nas três línguas, redirecionamento da home e seletor testados com `npx wrangler dev`
(simule o navegador com o header `Accept-Language`), nenhum travessão em texto novo
(`grep -rn "—" src`).
