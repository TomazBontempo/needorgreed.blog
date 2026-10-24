# Estado do projeto

Documento de passagem para o próximo agente. Leia o `CLAUDE.md` primeiro (regras, decisões e padrões);
este arquivo diz **onde paramos**, **o que falta** e **o que já deu errado**. Atualize-o ao fim de cada sessão.

Última atualização: 2026-10-23.

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
| 8 | Auditoria e crítica da Impeccable, build, teste completo no `wrangler dev` | **falta** |

**Próximo passo: o 8.** Rodar `critique` e `audit` da Impeccable no site todo, corrigir o que aparecer,
`npm run build`, e testar com `npx wrangler dev`: redirecionamento simulando Brasil, Portugal e outro país
(header `cf-ipcountry`), e o toggle de idioma persistindo entre visitas (cookie `lang`). Depois, gerar o
`DESIGN.md` (documenter da Impeccable) a partir do site pronto. Mostrar o resultado ao Tomaz.

O **mobile** foi deixado de lado de propósito: o Tomaz disse que vai rever depois. Hoje a home mobile é um
carrossel de fichas; as outras páginas usam as fichas em linha (capa pequena à esquerda) abaixo de 640px.

---

## O que existe e funciona

- **Páginas (inglês na raiz, português em `/pt/`):** home, review, Jogos (`/games/`), Telas (`/screens/`,
  com filtro por tipo), Raridade (`/rarity/<slug>/`), Autor (`/authors/<slug>/`), Arquivo (`/archive/`,
  loot log completo por mês com filtros de evento e roll), Sobre (`/about/`), 404 por idioma, RSS por idioma
  (`/rss.xml` e `/pt/rss.xml`). Fragmentos `/fichas/<idioma>/<slug>/` para o tooltip do log (noindex).
- **Idioma:** o Worker (`src/worker.ts`) decide antes de servir: `?lang=` do toggle grava o cookie, cookie
  vence tudo, sem cookie Brasil e Portugal vão para `/pt/`, bots nunca são redirecionados. Testado no
  `wrangler dev` (passo 4). `hreflang` e `canonical` em todas as páginas.
- **Tradução:** `npm run translate` (Workers AI, modelo Gemma 4 26B), hash do original, respeita
  `revisado: true`, traduz legendas e descrições dos componentes, trata cota esgotada sem quebrar.
  Action em `.github/workflows/translate.yml`. Testado só com `--mock` (sem token ainda).
- **Loot log:** vem do histórico de commits do GitHub no build (`src/lib/lootlog.ts`), com fallback nas
  próprias reviews. Hoje roda sempre no fallback, porque o repositório ainda não existe no GitHub.
- **Mídia nas reviews:** imagens otimizadas, `<Figure>` com legenda, `<YouTube>`, `<Clipe>` (mp4/webm).
  Testado pelo painel (abrir e salvar) e pela IDE. O build barra arquivo acima de 25 MB e imagem que o
  painel estragou.
- **Checagens que passavam no fim da sessão:** `npx astro check` com 0 erros, `npm run build` sem erros,
  1.600 links internos do build sem nenhum quebrado, detector da Impeccable sem achados, nenhum travessão.

---

## Configuração externa que ainda não existe

Nada disso dá para fazer sem o Tomaz. Instruções completas no `README.md`.

- **Repositório no GitHub** `TomazBontempo/needorgreed`: ainda não existe (a API devolve 404). Sem ele, o
  loot log e a autoria usam o fallback, e a Action de tradução não roda.
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

- As traduções `index.en.mdx` dos exemplos foram escritas à mão (`modelo: exemplo`), não pelo script.
- Capas de exemplo em `src/assets/reviews/<slug>/capa.jpg`; imagens de teste em
  `src/content/reviews/outer-wilds/` (`fogueira.jpg`, `nave.jpg`); clipe em `public/videos/outer-wilds/`.
- O avatar `src/assets/autores/snufupugos.png` é um placeholder ("S").
- O YouTube dos exemplos usa um id de teste (`dQw4w9WgXcQ`).

---

## Git

**Nada do redesign foi commitado.** O único commit é o do protótipo (`e7687cb`). Todo o trabalho está
como alteração não commitada na raiz do repositório (esta pasta). O Tomaz não autorizou commits ainda:
pergunte antes do primeiro, e proponha commits por rodada a partir daí (ele pede reversões com frequência).

O projeto foi movido para esta pasta no fim da sessão; a pasta antiga do protótipo foi apagada.

---

## Como testar

```bash
npm install
npx astro check                                   # tipos: 0 erros
npm run build                                     # build de produção
python3 -m http.server 4400 -d dist/client        # build estático (sem Worker) em http://localhost:4400
npm run build && npx wrangler dev                 # com o Worker, em http://localhost:8787
curl -I -A Firefox -H 'cf-ipcountry: BR' http://localhost:8787/    # deve dar 302 para /pt/
npm run translate -- --mock                       # tradutor de mentira
npx astro dev --background                        # dev + painel em /keystatic
```

Screenshots e medidas foram feitos com Playwright (instalado fora do repositório) usando o Chromium que já
está em `~/.cache/ms-playwright/chromium-1243`. A versão nova do pacote `playwright` pede outro build do
Chromium: passe `executablePath` apontando para o instalado.

---

## Armadilhas já encontradas (não repetir)

- **`npx astro check` trava** se `@astrojs/check` não estiver instalado (fica esperando confirmação).
  Já está nas devDependencies; rode com `< /dev/null` em scripts.
- **No `wrangler dev`, `request.cf.country` vem com o país real da máquina.** Por isso o Worker lê o header
  `cf-ipcountry` primeiro (em produção a Cloudflare sobrescreve esse header).
- **`pkill -f "wrangler dev"` mata o próprio shell** quando o padrão aparece no comando. Guarde o PID.
- **Fonte:** no Google Fonts a família é "Big Shoulders" (não "Big Shoulders Display").
- **Keystatic:**
  - um atributo no `.mdx` que o bloco do painel não declara faz o painel recusar a review inteira (foi o
    `titulo` do YouTube);
  - imagem escrita `./foto.jpg` aparece como texto no painel e é escapada ao salvar;
  - arquivos de bloco (`fields.file`) só são reconhecidos em `<directory>/<slug>/`.
- **Chromium headless esconde barras de rolagem** nos screenshots: use `ignoreDefaultArgs: ['--hide-scrollbars']`.
- **Swipe em teste:** `Input.synthesizeScrollGesture` não move scroll-snap no headless; use
  `Input.dispatchTouchEvent` (touchStart, touchMove em passos, touchEnd).
- **Estilos da ficha precisam ser globais** (`src/styles/item.css`): a variante mini entra via `innerHTML`
  no tooltip, em páginas que não renderizam ficha nenhuma.
- **Classes genéricas colidem:** o loot log usa `.item` nos links; por isso a ficha usa o prefixo `it-`.

---

## Impeccable

- `PRODUCT.md` existe (público geral de cultura pop, sucesso é ler e comentar).
- `.impeccable/config.json`: `buildPath: code` (sem imagens de referência geradas).
- O contrato da direção visual está como comentário HTML no começo do `<body>` (`src/layouts/Base.astro`),
  com a seed `763e2d68`.
- **Faltam:** a revisão final (finish reviewer) e o `DESIGN.md`. Os dois fazem parte do passo 8.
- Há uma versão mais nova da Impeccable (v4.7.0; instalada v4.1.1). Atualizar só se o Tomaz pedir
  (`npx impeccable update`, vale a partir da sessão seguinte).
