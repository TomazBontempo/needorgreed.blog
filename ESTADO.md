# Estado do projeto

Documento de passagem para o próximo agente. Leia o `CLAUDE.md` primeiro (regras, decisões e padrões);
este arquivo diz **onde paramos**, **o que falta** e **o que já deu errado**. Atualize-o ao fim de cada sessão.

Última atualização: 2026-10-24 (fim do dia).

---

## Onde paramos

O redesign seguiu um plano de 8 passos pedido pelo Tomaz:

| Passo | O quê | Estado |
|---|---|---|
| 1 | `npm install` e build do protótipo | feito |
| 2 | Skills e contexto da Impeccable (`PRODUCT.md`) | feito |
| 3 | `motivoRoll` no schema/painel/exemplos; eventos do loot log via GitHub | feito |
| 4 | Base de idiomas: i18n, dicionários, tradução automática, Action, Worker | feito |
| 5 | Direção visual aprovada ("Fichário de Loot", sem nada de card game) | feito |
| 6 | Home e página da review, com várias rodadas de ajustes do Tomaz | feito |
| 7 | Jogos, Telas, Raridade, Autor, Arquivo, Sobre, 404, RSS | feito |
| 8 | Auditoria e crítica da Impeccable, build, teste completo no `wrangler dev` | **em andamento**: crítica feita e corrigida em parte; falta `audit`, `DESIGN.md` e o `wrangler dev` |

Depois do passo 7, a sessão de 2026-10-24 fez:
- **Espanhol** (América Latina) como terceira língua, em `/es/`, com seletor de idioma no header,
  faixa de sugestão, sitemap com as três línguas e tradução automática para N línguas.
- **Regra de idioma nova** (decisão do Tomaz, depois de pesquisa sobre Google, Wikipedia e comunidades):
  idioma do navegador em vez do país, só a home redireciona, links diretos nunca. Detalhes no CLAUDE.md.
- Hero novo ("Cada obra é um loot: / Need, Greed ou Pass." + a descrição), nome do repositório corrigido
  para `TomazBontempo/needorgreed.blog`, README atualizado.

Ainda em 2026-10-24:
- **Regras de mídia novas** (pedido do Tomaz). Tudo da review na pasta dela (`capa.<ext>`, `imagens/`,
  `videos/`) e capa obrigatória. O build para só quando a página sairia quebrada (capa, caminho ou arquivo
  errado, 25 MB); texto alternativo e descrição de clipe viraram só aviso, e o nome do arquivo é livre
  (ver "Para rever no futuro"). Resolveu o bug da capa `./capa.jpg` apagada pelo painel.
- **Links para fora do blog** abrem em nova guia, com seta e aviso para leitor de tela.
- **Tooltip do loot log** corrigido no `astro dev` (fragmentos em `/fichas/<idioma>-<slug>/`).
- **Painel:** logo d100, campos reordenados (obra, veredito, ficha, publicação), explicações curtas.
- **Tudo commitado e enviado ao GitHub** (ver "Git"). A Action de tradução teve um bug no passo de commit,
  corrigido e testado no próprio GitHub.

No fim de 2026-10-24 (commits `d81f94b` em diante):
- **Crítica da Impeccable** (só leitura, rodada num contexto só, sem sub-agentes): 29 de 32 nas heurísticas
  aplicáveis. Corrigidos os dois P2: um h1 só por página (um `#` no texto da review vira h2, ver
  `components/TituloDoTexto.astro`; fichas logo abaixo do h1 viram h2) e o motivo do roll sem repetir na
  lateral da review. O resto ficou em "Problemas abertos". Screenshots e medidas em `.impeccable/review/`
  (fora do git).
- **Hero novo:** uma frase ("Cada obra é um loot."), explicação em duas linhas e o link "Saiba mais sobre
  nossas notas" na quarta linha. Respiro de até 65px que empurra a página em vez de espremer o destaque,
  com limite no título de "Mais loot" e 32px de ficha (`--espiar-minimo` em `views/Home.astro`). Testamos
  alinhar o hero com o destaque; o Tomaz preferiu o alinhamento com o logo do header.
- **Re-roll no loot log:** edição aparece igual ao roll original (`re-rolled`, `re-rolou`, `re-tiró`), sem
  contador. O filtro do Arquivo virou "Re-rolls".
- **Raridade Herança removida** de tudo (lógica, painel, rotas, cores, textos). As reviews de exemplo ainda
  têm a linha `heranca:` no frontmatter; ela é ignorada e some quando os exemplos forem apagados.
- **Sobre:** glossário no fim, só com os termos que a página não explica (Linha de roll, Ficha, d100).
- **Espanhol:** "botín" trocado por "loot" em todo lugar.

**Decisão do Tomaz: o site só sobe com o domínio.** Ele vai comprar o `needorgreed.blog` antes. A Cloudflare
cobra domínio só em dólar (há IOF em cartão comum); o Tomaz vai usar um cartão sem IOF. Alternativas que
ficaram registradas: subir antes no endereço gratuito `*.workers.dev` e ligar o domínio depois, sem refazer
nada; ou registrar o domínio num registrador que cobre em reais e só apontar o DNS para a Cloudflare.
Nada quebra para o leitor fora do domínio final; o que aponta para `needorgreed.blog` é o `site` do
`astro.config.mjs` (canonical, hreflang, sitemap, RSS, imagem de compartilhamento) e o login do painel online.

**Próximo passo: o 8, com o checklist de estreia abaixo.**

### Checklist para subir o site

1. **Testar o site vazio** (o mais importante): apagar as reviews de exemplo numa cópia e garantir que
   home, destaque, loot log, "Mais loot", carrossel, listagens, sitemap e RSS funcionam e que o build passa.
2. **Passo 8 da Impeccable:** a `critique` já rodou; falta o `audit` no site todo (três línguas, desktop e
   celular), corrigir, rodar o finish reviewer e gerar o `DESIGN.md` com o documenter.
3. **Teste no `npx wrangler dev`:** redirecionamento da home com `Accept-Language` em português, espanhol e
   outra língua; links diretos sem redirecionamento; seletor persistindo entre visitas (cookie `lang`).
4. **Comprar o domínio** e criar o projeto na Cloudflare Workers ligado ao repositório (README, "Deploy").
5. **Configurar segredos e serviços** (ver "Configuração externa"): `GITHUB_TOKEN` no build, token do
   Workers AI na Action, Giscus, GitHub App do Keystatic.
6. **Apagar as reviews de exemplo** (inclusive `teste-do-snufu`) e publicar.

O **mobile** foi deixado de lado de propósito: o Tomaz disse que vai rever depois. Hoje a home mobile é um
carrossel de fichas; as outras páginas usam as fichas em linha (capa pequena à esquerda) abaixo de 640px.

---

## O que existe e funciona

- **Páginas (inglês na raiz, português em `/pt/`, espanhol em `/es/`):** home, review, Jogos (`/games/`),
  Telas (`/screens/`, com filtro por tipo), Raridade (`/rarity/<slug>/`), Autor (`/authors/<slug>/`),
  Arquivo (`/archive/`, loot log completo por mês com filtros de evento e roll), Sobre (`/about/`), 404 e
  RSS por idioma. Fragmentos `/fichas/<idioma>-<slug>/` para o tooltip do log (noindex). 96 páginas no build.
- **Idioma:** o Worker (`src/worker.ts`) decide antes de servir: `?lang=` (seletor ou faixa) grava o cookie;
  com cookie, vale em qualquer página; sem cookie, só a home redireciona, pelo `Accept-Language`; bots nunca.
  Nas outras páginas, a faixa de sugestão (fixa no pé da tela) oferece a troca. Testado no `wrangler dev` e
  no Playwright (com `locale` no contexto) em 2026-10-24.
- **SEO:** `hreflang` (en, pt-BR, es, x-default) e `canonical` em todas as páginas; `sitemap.xml` com 66 URLs
  (22 páginas x 3 línguas) citado no `robots.txt`.
- **Tradução:** `npm run translate` (Workers AI, modelo Gemma 4 26B), hash do original, respeita
  `revisado: true`, traduz legendas e descrições dos componentes, trata cota esgotada sem quebrar.
  Traduz o original para todas as outras línguas (en, pt, es; espanhol neutro da América Latina).
  Action em `.github/workflows/translate.yml`. Testado só com `--mock` (sem token ainda).
- **Loot log:** vem do histórico de commits do GitHub no build (`src/lib/lootlog.ts`), com fallback nas
  próprias reviews. Com o nome do repositório corrigido, o build já consulta o GitHub de verdade: as reviews
  que estão em algum commit enviado aparecem com a data do commit; as outras, com a data da própria review.
- **Mídia nas reviews:** tudo na pasta da review (`capa.<ext>` obrigatória, `imagens/`, `videos/`), caminhos
  `../<slug>/...`. Imagens otimizadas, `<Figure>` com legenda, `<YouTube>`, `<Clipe>` (mp4/webm publicado em
  `/_astro/`). O painel limpa o nome no upload. `src/integrations/midia.ts` para o build em capa ausente ou
  fora do formato, mídia fora da pasta, arquivo inexistente, imagem escapada pelo painel e arquivo acima de
  25 MB; só avisa sobre texto alternativo ou descrição de clipe faltando e arquivos soltos ou sem uso.
- **Checagens que passavam no fim da sessão de 2026-10-24:** `npx astro check` com 0 erros, `npm run build`
  sem erros, 2.678 links internos do build sem nenhum quebrado, detector da Impeccable sem achados,
  nenhum travessão.

---

## Problemas abertos

- **Vocabulário em espanhol a revisar** por alguém que fale espanhol: "Pantallas", "Acerca", nomes das
  raridades e a linha de roll ("Snufupugos tiró Need (94) por [Outer Wilds]").
- **Progresso de leitura** mostra "100% lido" logo de cara numa review curta que cabe na tela, e "1% lido"
  no topo de uma review longa (P3 da crítica).
- **Review no celular sem raridade nem nota** (P1 da crítica, medido): a lateral do veredito some abaixo de
  900px e só sobra a cor do nome na linha de roll. O Tomaz disse "veremos depois".
- **Ficha com rodapé desigual** quando aparece a marca "read" de review já lida (P3 da crítica).
- **Filtros do Arquivo** com 21px de altura de toque (mínimo do WCAG 2.2 é 24px; P3 da crítica).
- **Site vazio:** o Tomaz vai apagar todas as reviews de exemplo e publicar o site vazio para postar a primeira.
  Ninguém testou o site sem nenhuma review (home, destaque, loot log, "Mais loot", carrossel, sitemap, RSS):
  fazer antes de apagar os exemplos (item 1 do checklist).
- **Action de tradução usa versões antigas** de `actions/checkout@v4` e `actions/setup-node@v4` (Node 20,
  descontinuado no GitHub; hoje roda forçado no Node 24). Atualizar para a v5.

---

## Para rever no futuro

- **Nome dos arquivos de imagem (decisão de 2026-10-24).** O Tomaz abandonou qualquer regra de nome: o build
  não avisa mais sobre nomes genéricos (`IMG_2034.jpg`, `image.png`), e o painel só limpa o nome no upload
  (minúsculas, sem acento, hífens). Motivo: hoje só ele escreve e organiza os próprios arquivos. **Rever
  quando entrar um autor novo.** O que já se sabe:
  - O Google trata o nome do arquivo como pista leve; o texto alternativo e o texto ao redor pesam mais.
  - O painel (Keystatic) não consegue obrigar nome nem texto alternativo na inserção da imagem: um bloco com
    campos obrigatórios é salvo vazio sem aviso (testado em 2026-10-24). Desligar o botão de imagem nativo
    impede colar (Ctrl+V) e arrastar imagens, mas não força o preenchimento.
  - Opções levantadas e não escolhidas: (1) voltar com o aviso no build; (2) GitHub Action que renomeia
    imagens de nome genérico a partir do texto alternativo e atualiza os caminhos; (3) a mesma Action gerar
    um rascunho de texto alternativo com um modelo de visão do Workers AI (grátis), marcado para revisão;
    (4) no `astro dev`, uma faixa na própria página da review listando os problemas de mídia.
- **Texto alternativo e descrição de clipe viraram só aviso (decisão de 2026-10-24).** O Tomaz não quer
  descrição esquecida segurando publicação. Sem eles a página funciona, mas fica pior para leitor de tela e
  para o Google. Rever junto com o nome dos arquivos; as opções (3) e (4) acima ajudariam a não esquecer.

---

## Configuração externa que ainda não existe

Nada disso dá para fazer sem o Tomaz. Instruções completas no `README.md`.

- **Domínio `needorgreed.blog`:** ainda não comprado (ver "Onde paramos").
- **Projeto na Cloudflare Workers:** ainda não criado. O repositório já existe e está em dia.
- **Token da Cloudflare para tradução:** Workers AI Read + Workers AI Edit. Secrets da Action:
  `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_AI_TOKEN`. Plano Free, sem cartão (regra inegociável do CLAUDE.md).
- **Giscus:** `repoId` e `categoryId` vazios em `src/site.config.ts`. Enquanto isso, a página da review
  mostra "Os comentários abrem em breve" e a home mostra o link sem a contagem.
- **`GITHUB_TOKEN` no build** (Cloudflare): necessário para a contagem de comentários (GraphQL) e
  recomendado para o loot log (limite de 60 requisições por hora sem token).
- **GitHub App do Keystatic** para o painel em produção.

---

## Conteúdo de exemplo (apagar antes de publicar)

Todas as reviews em `src/content/reviews/` são exemplos, marcadas com um aviso no topo do texto. Seis têm
títulos fictícios (Abyssal Tax Office, Os Últimos Dias de Verão, Starfall Remastered, Detetive Kumo,
Lighthouse Keeper '98, Cidade de Concreto); Outer Wilds, Frieren e Survival Genérico 3 vieram do protótipo.

- As traduções `index.en.mdx` e `index.es.mdx` dos exemplos foram escritas à mão (`modelo: exemplo`), não
  pelo script; o script as reconhece como em dia.
- Capas de exemplo em `src/content/reviews/<slug>/capa.jpg`; imagens de teste em
  `src/content/reviews/outer-wilds/imagens/`; clipe em `src/content/reviews/outer-wilds/videos/`.
- O avatar `src/assets/autores/snufupugos.png` é um placeholder ("S").
- O YouTube dos exemplos usa um id de teste (`dQw4w9WgXcQ`).

---

## Git

Repositório: `TomazBontempo/needorgreed.blog` (público). Tudo enviado; `main` local igual ao GitHub em
2026-10-24:

- `e7687cb` protótipo
- `6bac050` redesign completo
- `eb07ea4` espanhol, idioma pelo navegador e seletor de idioma
- `c9f9c05` mídia na pasta da review, capa obrigatória e checagem no build
- `500b536` tooltip no dev, links externos, painel reorganizado e mídia sem travas
- `35155b5` correção do passo de commit da Action de tradução
- `9bc7efe` ESTADO atualizado (domínio e checklist de estreia)
- `d81f94b` hero novo, títulos, re-roll no log, glossário e fim da Herança
- o commit seguinte: re-roll no Arquivo, glossário enxuto no fim do Sobre, "loot" no espanhol e estes documentos

O Tomaz autoriza commits e pushes pedindo; proponha um commit ao fim de cada rodada aprovada (ele pede
reversões com frequência). Desfazer teste: guarde uma cópia antes; nunca `git checkout` em arquivo com
mudança não commitada.

---

## Como testar

```bash
npm install
npx astro check                                   # tipos: 0 erros
npm run build                                     # build de produção
python3 -m http.server 4400 -d dist/client        # build estático (sem Worker) em http://localhost:4400
npm run build && npx wrangler dev                 # com o Worker, em http://localhost:8787
curl -I -A Firefox -H 'Accept-Language: es-MX,es;q=0.9' http://localhost:8787/   # 302 para /es/
curl -I -A Firefox -H 'Accept-Language: es-MX' http://localhost:8787/reviews/frieren/   # 200, sem redirecionar
npm run translate -- --mock                       # tradutor de mentira
npx astro dev --background                        # dev + painel em /keystatic
```

Screenshots e medidas foram feitos com Playwright (instalado fora do repositório) usando o Chromium que já
está em `~/.cache/ms-playwright/chromium-1243`. A versão nova do pacote `playwright` pede outro build do
Chromium: passe `executablePath` apontando para o instalado. Para testar a faixa de sugestão, crie o contexto
com `locale: 'es-MX'` (ou `pt-BR`): isso muda o `navigator.languages`.

---

## Armadilhas já encontradas (não repetir)

- **`npx astro check` trava** se `@astrojs/check` não estiver instalado (fica esperando confirmação).
  Já está nas devDependencies; rode com `< /dev/null` em scripts.
- **O país não é mais usado** para escolher o idioma (era `request.cf.country`). Não reintroduzir: a regra
  é o idioma do navegador. Ver CLAUDE.md, "Idiomas".
- **`pkill -f "wrangler dev"` mata o próprio shell** quando o padrão aparece no comando. Guarde o PID.
- **Fonte:** no Google Fonts a família é "Big Shoulders" (não "Big Shoulders Display").
- **Keystatic:**
  - um atributo no `.mdx` que o bloco do painel não declara faz o painel recusar a review inteira (foi o
    `titulo` do YouTube);
  - imagem escrita `./foto.jpg` aparece como texto no painel e é escapada ao salvar;
  - arquivos de bloco (`fields.file`) só são reconhecidos em `<directory>/<slug>/`;
  - a capa (`fields.image` no frontmatter) também: `./capa.jpg` aparece vazia e é apagada ao salvar
    (resolvido: tudo usa `../<slug>/...` e o build barra o formato errado);
  - o painel não exige o texto alternativo da imagem do texto, mesmo marcado como obrigatório (o Tomaz
    salvou imagens sem ele em 2026-10-24); depois disso o texto alternativo virou só aviso no build;
  - a imagem entra onde está o cursor: com uma imagem selecionada, o upload a substitui (e o painel apaga
    o arquivo antigo, que ficou sem uso).
- **`git checkout -- <arquivo>` para desfazer um teste** volta ao último commit e apaga mudanças não
  commitadas. Para desfazer teste, guarde uma cópia antes e restaure dela.
- **Chromium headless esconde barras de rolagem** nos screenshots: use `ignoreDefaultArgs: ['--hide-scrollbars']`.
- **Swipe em teste:** `Input.synthesizeScrollGesture` não move scroll-snap no headless; use
  `Input.dispatchTouchEvent` (touchStart, touchMove em passos, touchEnd).
- **Estilos da ficha precisam ser globais** (`src/styles/item.css`): a variante mini entra via `innerHTML`
  no tooltip, em páginas que não renderizam ficha nenhuma.
- **Classes genéricas colidem:** o loot log usa `.item` nos links; por isso a ficha usa o prefixo `it-`.
- **`hreflang` não aceita `es-419`** (o Google só aceita país de duas letras como região): o espanhol usa
  `es`. O espanhol latino-americano fica garantido no texto e no prompt de tradução.
- **Fragmentos do tooltip com `/en/` no caminho davam 404 no `astro dev`** (o roteador do i18n do Astro
  recusa qualquer trecho igual à língua padrão). Em produção funcionava porque os arquivos são estáticos.
  Agora o endereço é `/fichas/<idioma>-<slug>/`. Teste sempre também no `astro dev`, não só no build.
- **Plugins rehype/remark são ignorados** pelo processador padrão de Markdown do Astro 7 (Sätteri). Para
  mudar como um elemento do texto sai, use o mapa de componentes do MDX (`src/components/mdx.ts`).
- **O scratchpad do Playwright é apagado entre sessões:** reinstale com `npm i playwright` numa pasta fora
  do repositório antes de tirar screenshots.

---

## Impeccable

- `PRODUCT.md` existe (público geral de cultura pop, sucesso é ler e comentar).
- `.impeccable/config.json`: `buildPath: code` (sem imagens de referência geradas).
- O contrato da direção visual está como comentário HTML no começo do `<body>` (`src/layouts/Base.astro`),
  com a seed `763e2d68`.
- **Faltam:** a revisão final (finish reviewer) e o `DESIGN.md`. Os dois fazem parte do passo 8.
- O seletor de idioma e a faixa de sugestão foram construídos sem mockup (o Tomaz dispensou); a crítica do
  passo 8 deve olhar os dois.
- Há uma versão mais nova da Impeccable (v4.7.0; instalada v4.1.1). Atualizar só se o Tomaz pedir
  (`npx impeccable update`, vale a partir da sessão seguinte).
