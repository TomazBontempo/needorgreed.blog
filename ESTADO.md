# Estado do projeto

Documento de passagem para o próximo agente. Leia o `CLAUDE.md` primeiro (regras, decisões e padrões);
este arquivo diz **onde paramos**, **o que falta** e **o que já deu errado**. Atualize-o ao fim de cada sessão.

Última atualização: 2026-10-26.

---

## Onde paramos

**O site está no ar e pronto para uso** em `https://needorgreed.blog` (desde 2026-10-25), com comentários em
`https://comentarios.needorgreed.blog` (desde 2026-10-26). A primeira review real é
`cyberpunk-edgerunners-2` (anime, Incomum 6.9, Greed), publicada pelo painel online em 2026-10-25.

Linha do tempo resumida:
- **Até 2026-10-24:** redesign em 8 passos ("Fichário de Loot"), três línguas, regra de idioma pelo navegador,
  mídia na pasta da review, crítica e auditoria da Impeccable, mobile revisto.
- **2026-10-25:** reviews de exemplo apagadas, SEO (dados estruturados, imagem de compartilhamento, regra para
  IAs), domínio e deploy na Cloudflare, painel online (Keystatic com login do GitHub), tradução de verdade
  pelo Workers AI, primeira review.
- **2026-10-26:** correções do painel (imagem colada e imagem renomeada), tradução sem raciocínio do modelo,
  comentários (Garrul) com login Google e Discord, página de privacidade, e-mail de contato, `DESIGN.md`.

Pendente agora: só o que está em "Problemas abertos" (nada impede o uso).

---

## O que existe e funciona

- **Páginas (inglês na raiz, português em `/pt/`, espanhol em `/es/`):** home, review, Jogos (`/games/`),
  Telas (`/screens/`, com filtro por tipo), Raridade (`/rarity/<slug>/`), Autor (`/authors/<slug>/`),
  Arquivo (`/archive/`, loot log completo por mês com filtros), Sobre (`/about/`), Privacidade (`/privacy/`),
  404 e RSS por idioma. Fragmentos `/fichas/<idioma>-<slug>/` para o tooltip do log (noindex).
- **Rodapé:** Sobre, Privacidade, Contato (`mailto:` para `SITE.contato`) e Feed RSS.
- **Home:** o "Mais loot" nunca repete o destaque, **exceto quando ele é a única review** (senão a seção some).
- **Idioma:** o Worker (`src/worker.ts`) decide antes de servir: `?lang=` grava o cookie; com cookie, vale em
  qualquer página; sem cookie, só a home redireciona, pelo `Accept-Language`; bots nunca. Nas outras páginas,
  a faixa de sugestão (fixa no pé da tela) oferece a troca. Testado ao vivo em 2026-10-25.
- **SEO:** `hreflang` (en, pt-BR, es, x-default) e `canonical` em todas as páginas; `sitemap.xml` citado no
  `robots.txt`. JSON-LD `Review` em cada review e `WebSite` na home. Imagem de compartilhamento padrão
  `public/og.jpg` (1200x630). `robots.txt` com Content Signals (`search=yes, ai-input=yes, ai-train=no`) e os
  robôs de treino bloqueados (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended,
  meta-externalagent, Bytespider). Testado ao vivo: robôs de treino recebem 403, os de busca e resposta 200.
- **Painel online (`/keystatic`):** login com GitHub; cada "Salvar" vira commit e o site publica em 1 a 2
  minutos. Duas correções no painel:
  - imagem colada (Ctrl+V) chega sempre como `image.png` e uma sobrescrevia a outra: agora ganha um sufixo
    único (`nomeDaImagem()` em `src/lib/nomes-de-arquivo.ts`);
  - renomear a imagem na janela do painel gravava o nome cru, com espaço e fora de `imagens/`: corrigido com
    `patch-package` no Keystatic 0.6.9 (`patches/@keystatic+core+0.6.9.patch`, aplicado no `postinstall`).
    Se o Keystatic for atualizado e o patch não couber, a instalação para com erro: refazer o patch.
- **Tradução:** `npm run translate` (Workers AI, Gemma 4 26B), com o raciocínio do modelo desligado
  (`chat_template_kwargs: { enable_thinking: false }`: a review inteira em 3 línguas leva uns 3 minutos, antes
  levava 18). Cada pedido vai para o log (tempo, `finish_reason`, tokens, se raciocinou). Trecho que volta
  vazio ou sem trecho protegido é refeito até 2 vezes; campo curto que volta igual ao original vai num segundo
  pedido. Traduz corpo, frase, motivo, duração, atributos, tags, legendas e o texto alternativo das imagens.
  Respeita `revisado: true` (a versão em inglês da review do Edgerunners está revisada à mão: "must-watch").
- **Comentários:** Garrul, ver "Configuração externa".
- **Loot log:** histórico de commits do GitHub no build (`src/lib/lootlog.ts`).
- **Mídia nas reviews:** tudo na pasta da review (`capa.<ext>` obrigatória, `imagens/`, `videos/`), caminhos
  `../<slug>/...`. `src/integrations/midia.ts` para o build quando a página sairia quebrada e só avisa sobre
  texto alternativo, descrição de clipe e arquivos soltos ou sem uso.
- **Design:** `DESIGN.md` gerado em 2026-10-26 (tokens, tipos, componentes, regras), com o complemento
  `.impeccable/design.json`.

---

## Problemas abertos

**Pendências para 2026-10-27 (pedidas pelo Tomaz):**
1. ~~Contador de visualizações~~ **feito em 2026-10-27** (ver "Contador de views" no CLAUDE.md e em
   "Configuração externa"). Descartados: as métricas da Cloudflare (o histórico some com o tempo no plano
   grátis, conta robôs e exige mais um token) e o limitador de Workers (status incerto no plano grátis, janela
   de no máximo 60 segundos, desaconselhado por IP). Para anunciante, o painel certo seria o Web Analytics da
   Cloudflare (grátis, sem cookie), a ligar só quando houver anúncio de verdade (pede uma linha na privacidade).
2. ~~Tradução dos comentários~~ **feita em 2026-10-27** (opção A, ver "Comentários: Garrul" em "Configuração
   externa"). Descartados: botão "traduzir" sob demanda (abuso e um clique a mais) e o tradutor do navegador.
3. ~~Nome e descrição padrão para imagens~~ **feito em 2026-10-27**: imagem colada sem nome vira
   `imagem-01`, `imagem-02`... (o painel escolhe o próximo número livre entre as imagens do texto, no patch do
   Keystatic); imagem enviada com o nome do arquivo mantém o nome (decisão do Tomaz). Sem texto alternativo, a
   página mostra "Imagem 2 de <título>" na língua dela (`ImagemDoTexto.astro`, ordem pelo texto, título e ordem
   passados por `Astro.locals.nogImagensDoTexto`), e o build não avisa mais.

- **Comentários de teste** na review do Edgerunners ("teste02" e outros): o Tomaz vai apagar pelo `/admin`.

**Decididos (não reabrir sem o Tomaz pedir):**
- **Logo:** o d100 de traço fica como logo definitivo (header e favicon).
- **Raridade mais baixa:** "Lixo", "Trash" e "Basura" (2026-10-26), para o pé da ficha caber numa linha.
  O endereço em inglês mudou de `/rarity/vendor-trash/` para `/rarity/trash/`.
- **Espanhol:** vocabulário aprovado por um falante nativo amigo do Tomaz (2026-10-26).
- **Auditoria da Impeccable (2026-10-24, 16/20):** o resto foi descartado pelo Tomaz (links do log só por cor,
  contraste dos eventos "lidos", texto em 200%, 11px no desktop, pré-carregamento das fontes).
- **Progresso de leitura:** "1% lido" no topo de review longa e "100% lido" de cara em review curta ficam.
- **Alerta de vencimento de token:** não haverá (o GitHub avisa por e-mail). Ver a nota da Cloudflare em
  "Tokens com validade".

---

## Para rever no futuro

- **Descrição de verdade para as imagens.** Hoje a imagem sem texto alternativo ganha só "Imagem 2 de <título>"
  (2026-10-27), o que informa pouco para leitor de tela. Opção levantada e não escolhida: uma Action que gera um
  rascunho de descrição com um modelo de visão do Workers AI, marcado para revisão. O nome do arquivo
  continua livre quando a imagem vem com nome (decisão do Tomaz).
- **Marco Civil:** se o blog virar negócio (anúncio, patrocínio ou operado pela agência, que é pessoa
  jurídica), passa a ser preciso guardar o IP de acesso por 6 meses; o Garrul só guarda hash, por 7 dias.

---

## Configuração externa (Cloudflare, GitHub, Google e Discord)

Fica só nos painéis, não no código. Os valores dos tokens e segredos nunca entram no repositório nem no chat.

**Cloudflare, Worker `needorgreed`** (Workers Builds ligado ao repositório: cada push no `main` publica):
- Build `npm run build`, deploy `npx wrangler deploy`, preview builds desligados.
- Build variables: `GITHUB_TOKEN` (secret), `NODE_VERSION=24` e `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=needorgreed-keystatic`.
- Secrets: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (valores também
  no `.env` local do Tomaz, fora do git).
- Custom domain `needorgreed.blog`. O endereço `*.workers.dev` está desligado.

**Cloudflare, zona `needorgreed.blog`** (conta pessoal do Tomaz, a mesma dos sites da agência; Account ID
`2dd64c7fa18094c6d65cae2025264e4c`):
- **AI Crawl Control → Bot Preference Sync: desligado.** Ligado, a Cloudflare cola o robots.txt dela em cima
  do nosso. Os robôs de treino continuam barrados com 403.
- **Always Use HTTPS: ligado.** Redirect Rule `https://www.*` para `https://${1}` (301), com registro DNS
  `A www 192.0.2.1` com proxy. Bot Fight Mode desligado.
- **Email Routing:** `contato@needorgreed.blog` encaminha para o Gmail do Tomaz (grátis, só recebe). Catch-all
  desligado (descarta o resto). Registros MX e SPF criados pela própria Cloudflare.
- Domínio registrado na Hostinger; DNS na Cloudflare (`clarissa` e `vasilii.ns.cloudflare.com`), DNSSEC desligado.

**Contador de views:** D1 `needorgreed-views` (id `b582303a-df19-4147-9468-9e631f83a63f`, binding `VIEWS` no
`wrangler.jsonc`), tabela `views(slug, total)` criada pela migração `migrations/0001_views.sql`. Para mexer na
tabela: nova migração em `migrations/` e `npx wrangler d1 migrations apply VIEWS --remote`. Testar localmente com
`npx wrangler d1 migrations apply VIEWS --local`, `npm run build` e `npx wrangler dev` (no Playwright, abra o
Chromium com `--disable-blink-features=AutomationControlled`, senão o filtro de robôs não conta nem mostra nada).

**Comentários: Garrul** (github.com/KingPin/Garrul, Apache 2.0):
- **Worker `needorgreed-comentarios`** em `https://comentarios.needorgreed.blog`. Código no repositório privado
  `TomazBontempo/needorgreed-comentarios`, pasta ao lado do blog, com `upstream` = KingPin/Garrul. Actions e
  Dependabot desligados (gastariam minutos do plano grátis; o CodeQL nem roda em repositório privado).
- D1 `garrul-db` e 4 KV. Turnstile `needorgreed-comentarios` (hostname `needorgreed.blog`, que cobre os
  subdomínios). `ALLOWED_ORIGINS = https://needorgreed.blog`. `IP_HASH_RETENTION_DAYS = 7`.
  `REACTIONS_ENABLED = false`. `ADMIN_EMAILS` = Gmail do Tomaz (toda conta Google ou Discord com esse e-mail
  verificado vira administradora). A configuração fica no `wrangler.toml` (fora do git, só na máquina do Tomaz).
- **Mudanças na nossa cópia**, todas marcadas "Need or Greed":
  - **sem anônimo:** o servidor recusa comentário, voto e reação sem login (`src/routes/api.comments.ts`,
    `src/lib/active-user.ts`) e nunca cria usuário anônimo; a caixa sem login só mostra "Entre para comentar";
  - **visual** (fim de `src/widget/styles.css`): texto de sistema em mono (`--nog-mono`), cantos retos, 44px
    de toque e 13px de texto no celular, tag GM em azul (`--nog-gm`), sem o selo do provedor de login, votos só
    com o triângulo;
  - **textos:** sem travessão; espanhol completado (14 frases faltavam).
  - **tradução automática dos comentários** (2026-10-27): `src/lib/nog-translate.ts`, rota
    `/api/v1/nog/translations` (`src/routes/nog-translations.ts`), caixa em `src/widget/nog-translate.ts`, tabelas
    `nog_comment_lang` e `nog_comment_translations` (migração `0900_nog_comment_translations.sql`, numeração alta
    para não colidir com as do Garrul, sem FOREIGN KEY de propósito) e o Workers AI ligado no `wrangler.toml`
    (`[ai] binding = "AI"`). Traduz ao publicar e ao editar para as outras duas línguas (a de origem é a da
    página, enviada como `nog_lang`; comentários antigos contam como português); a leitura completa até 3
    faltantes por visita. Teto de 500 traduções por dia (UTC). Mesmo modelo das reviews, sem raciocínio.
- **No blog:** `COMENTARIOS.api` em `src/site.config.ts`, a caixa e o tema em `src/components/Comentarios.astro`
  (carrega só quando o leitor chega perto), a contagem da home em `src/lib/comentarios.ts`.
- **Logins:** Discord (app "needorgreed.blog" no Developer Portal) e Google (projeto `needorgreed`
  no Google Cloud, Google Auth Platform, External, **em produção**, sem logo para não exigir verificação,
  política de privacidade `https://needorgreed.blog/privacy/`). Retorno: `/api/v1/auth/<serviço>/callback`.
  Segredos só na Cloudflare (`wrangler secret put` na pasta dos comentários).
- **Selo de equipe:** o texto "GM" está em `/admin` → Settings → staff badge label (vale para as três línguas).
- **Moderação:** `https://comentarios.needorgreed.blog/admin`, entrando com o Google. Emergência:
  `npm run owner-link` na pasta dos comentários (link de uso único, 10 minutos; nunca colar em chat).
- **LGPD:** pedido de exclusão por e-mail, apagado à mão no `/admin` (anonimiza o nome e mantém o texto, a não
  ser que o texto identifique a pessoa). Se mudar o que os comentários guardam, atualizar
  `src/views/Privacidade.astro` e os dicionários.
- **Atualizar o Garrul:** `git fetch upstream && git merge upstream/main` na pasta dos comentários, conferir os
  trechos "Need or Greed", testar com `npx wrangler dev -c wrangler.toml.new.dev.toml` (cópia local sem a rota
  de produção, fora do git) e `npm run deploy`.

**Tokens com validade (renovar antes de vencer):**
| Token | Onde fica | Permissão | Vence | Se vencer |
|---|---|---|---|---|
| GitHub fine-grained `needorgreed-build` | Cloudflare, build variable `GITHUB_TOKEN` | Contents e Metadata, leitura, só este repositório | por volta de 2027-10-25 | loot log e autoria caem no limite de 60 requisições por hora e no autor padrão |
| Cloudflare `needorgreed-traducao` | GitHub, secret `CLOUDFLARE_AI_TOKEN` (+ `CLOUDFLARE_ACCOUNT_ID`) | Workers AI Read e Edit | por volta de 2027-10-25 | reviews novas ficam sem tradução (a página mostra o original com aviso) |

O GitHub manda e-mail alguns dias antes de um token fine-grained vencer (decisão do Tomaz: sem alerta próprio).
**O token da Cloudflare não tem esse aviso garantido: olhar à mão** em dash.cloudflare.com → My Profile → API
Tokens no começo de outubro de 2027, junto com o token de API do Workers Builds. O login do Wrangler na máquina
do Tomaz (`npx wrangler login`) também expira de tempos em tempos; é só rodar de novo.

- A cota grátis do Workers AI (10.000 neurons por dia) e a dos Workers (100 mil pedidos por dia) são por
  conta: divididas com os sites da agência.

---

## Git

Repositórios:
- `TomazBontempo/needorgreed.blog` (público): o blog.
- `TomazBontempo/needorgreed-comentarios` (privado): a cópia do Garrul.

O Tomaz autoriza commits e pushes pedindo; proponha um commit ao fim de cada rodada aprovada (ele pede
reversões com frequência). Desfazer teste: guarde uma cópia antes; nunca `git checkout` em arquivo com
mudança não commitada. A Action de tradução faz commits sozinha ("Tradução automática das reviews e bios"):
dê `git pull` antes de mexer em reviews.

---

## Como testar

```bash
npm install
npx astro check                                   # tipos: 0 erros
npm run build                                     # build de produção
python3 -m http.server 4400 -d dist/client        # build estático (sem Worker) em http://localhost:4400
npm run build && npx wrangler dev                 # com o Worker, em http://localhost:8787
curl -I -A Firefox -H 'Accept-Language: es-MX,es;q=0.9' http://localhost:8787/   # 302 para /es/
npm run translate -- --mock                       # tradutor de mentira
npx astro dev --background                        # dev + painel em /keystatic
```

**Comentários localmente** (pasta `needorgreed-comentarios`): `npm run migrate` (banco local),
`npm run build:assets` e `npx wrangler dev -c wrangler.toml.new.dev.toml` (em `localhost:8787`). No blog,
troque `COMENTARIOS.api` por `http://localhost:8787` só para o build de teste e desfaça depois. Para entrar como
dono no servidor local: `npx tsx scripts/owner-link.ts --local --base-url http://localhost:8787`.

Screenshots e medidas com Playwright (instalado fora do repositório, no scratchpad) usando o Chromium de
`~/.cache/ms-playwright/chromium-1243` (passe `executablePath`). Para a faixa de sugestão, crie o contexto com
`locale: 'es-MX'` (ou `pt-BR`); sem isso, a faixa cobre o rodapé nos screenshots.

---

## Armadilhas já encontradas (não repetir)

- **`npx astro check` trava** se `@astrojs/check` não estiver instalado. Rode com `< /dev/null` em scripts.
- **O país não é usado** para escolher o idioma. Não reintroduzir `request.cf.country`.
- **`pkill -f "wrangler dev"` mata o próprio shell** quando o padrão aparece no comando. Guarde o PID.
- **Fonte:** no Google Fonts a família é "Big Shoulders" (não "Big Shoulders Display").
- **Keystatic:**
  - um atributo no `.mdx` que o bloco do painel não declara faz o painel recusar a review inteira;
  - imagem escrita `./foto.jpg` aparece como texto no painel e é escapada ao salvar; tudo usa `../<slug>/...`;
  - arquivos de bloco (`fields.file`) só são reconhecidos em `<directory>/<slug>/`;
  - o painel não exige o texto alternativo, mesmo marcado como obrigatório;
  - a imagem entra onde está o cursor: com uma imagem selecionada, o upload a substitui;
  - renomear imagem e colar várias imagens: resolvidos (ver "O que existe e funciona").
- **`git checkout -- <arquivo>` para desfazer um teste** apaga mudanças não commitadas.
- **Chromium headless esconde barras de rolagem:** use `ignoreDefaultArgs: ['--hide-scrollbars']`.
- **Estilos da ficha precisam ser globais** (`src/styles/item.css`, prefixo `it-`).
- **`hreflang` não aceita `es-419`:** o espanhol usa `es`.
- **Fragmentos com `/en/` no caminho davam 404 no `astro dev`:** o endereço é `/fichas/<idioma>-<slug>/`.
- **Plugins rehype/remark são ignorados** pelo Markdown do Astro 7 (Sätteri): use o mapa de componentes do MDX.
- **O scratchpad do Playwright é apagado entre sessões:** reinstale `playwright` numa pasta fora do repositório.
- **CSS de componente Astro sai num arquivo `/_astro/*.css`,** não no HTML: para conferir uma regra no ar,
  baixe o CSS da página.
- **Resolvedor de DNS local com resposta negativa em cache** depois de criar um domínio ou subdomínio novo: teste
  com `curl --resolve <host>:443:172.67.178.163` (ou `--host-resolver-rules` no Chromium).
- **Gemma 4 com raciocínio ligado** gastava o limite de tokens pensando e devolvia resposta vazia ou perdia os
  marcadores `⟦n⟧`. O script desliga o raciocínio; não remover.
- **Garrul:**
  - o `wrangler dev` com a rota de produção no `wrangler.toml` responde com o host de produção, e o Garrul em
    `ENV=dev` se recusa a servir: use a cópia `wrangler.toml.new.dev.toml`;
  - o servidor só aceita pedidos de `ALLOWED_ORIGINS`, até os da própria página dele;
  - o `embed.js` fica em cache por 1 hora: depois de um deploy, Ctrl+Shift+R;
  - o link de dono é de uso único: gere outro a cada teste.
- **`npm` 11** não roda scripts de instalação de dependências sem aprovação (`allow-scripts`); o `postinstall`
  do próprio projeto roda normalmente.

---

## Impeccable

- `PRODUCT.md` existe. Está um pouco desatualizado (cita reviews de exemplo, só duas línguas e o logo em
  aberto): atualizar quando o Tomaz pedir.
- `DESIGN.md` e `.impeccable/design.json` gerados em 2026-10-26 a partir do site pronto.
- `.impeccable/config.json`: `buildPath: code`. O contrato da direção visual está como comentário HTML no
  começo do `<body>` (`src/layouts/Base.astro`), com a seed `763e2d68`.
- Há uma versão mais nova da Impeccable (instalada v4.1.1). Atualizar só se o Tomaz pedir.
