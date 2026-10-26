# Need or Greed

Blog de críticas de jogos, séries, filmes e animes. Cada obra é um loot: **Need**, **Greed** ou **Pass**.

- **Astro** gera o site estático. Reviews em Markdown/MDX, uma pasta por crítica.
- **Keystatic** é o painel de escrita em `/keystatic`, com login pelo GitHub.
- **Autor automático**: o site descobre quem escreveu cada review pela conta do GitHub que criou o arquivo.
- **Cloudflare Workers** faz o build a cada push e hospeda tudo.

> Nota: a Cloudflare migrou o deploy de Astro do *Pages* para o *Workers* (mesmo painel, mesmo plano grátis,
> mesma integração com GitHub). O adapter atual do Astro só suporta Workers, então é para lá que o site vai.

---

## Rodando local

```bash
npm install
npx astro dev --background   # sobe o dev em segundo plano
npx astro dev logs           # vê o que o dev está mostrando
npx astro dev stop           # desliga
```

- Site: http://localhost:4321 (inglês) e http://localhost:4321/pt/ (português)
- Painel: http://localhost:4321/keystatic (no dev ele salva direto nos arquivos do seu disco, sem login)
- No dev não existe o Worker, então não há redirecionamento por país. Para testar isso, veja "Idiomas".

## Postando uma review

**Pelo painel:** `/keystatic` → Reviews → Create. Preenche os campos, escreve o texto, salva.

**Pela IDE:** cria uma pasta em `src/content/reviews/` com o slug da review (minúsculas, sem acento, hífens;
não mude depois de publicar: o endereço e os comentários dependem dele):

```
src/content/reviews/hollow-knight/
  index.mdx
  capa.jpg          ← obrigatória
  imagens/          ← imagens do texto
  videos/           ← clipes e o quadro de capa de cada um
```

```mdx
---
titulo: Hollow Knight
tipo: jogo            # jogo | filme | serie | anime
nota: 9.2             # 0 a 10, define a raridade
roll: need            # need | greed | pass
motivoRoll: Uma linha explicando o roll. Essencial no Greed.
idioma: pt            # pt | en | es: a língua em que você escreveu (as outras são traduzidas sozinhas)
data: 2026-10-23
plataforma: Switch
duracao: 45h
capa: ../hollow-knight/capa.jpg   # obrigatória, sempre neste formato
frase: Frase de efeito que aparece no pé do tooltip.
atributos:
  - nome: Dificuldade
    valor: "+20"
tags: [metroidvania]
# rascunho: true      # não aparece no site publicado
---

Texto da crítica em Markdown.

<YouTube id="ID_DO_VIDEO" />
```

Os dois jeitos geram o mesmo resultado. Não existe campo "autor": ele vem do GitHub.

## Sistema de nota

| Raridade | Nota |
|---|---|
| Lixo de vendedor | 0 a 2.9 |
| Comum | 3 a 4.9 |
| Incomum | 5 a 6.9 |
| Raro | 7 a 8.9 |
| Épico | 9 a 9.9 |
| Lendário | 10 |

O número do roll é a nota vezes dez: nota 9.4 vira `Need (94)`.
Cores e faixas ficam em `src/lib/raridade.ts` e `src/styles/global.css`.

## Idiomas

Inglês na raiz (`/`, `/reviews/<slug>/`), português em `/pt/` e espanhol (América Latina) em `/es/`.
Todas as versões são estáticas.

- **Quem decide o idioma é o Worker** (`src/worker.ts` + `src/i18n/deteccao.ts`), antes de servir a página:
  - `?lang=xx` (seletor do header ou faixa de sugestão) grava o cookie `lang`;
  - com cookie, a escolha vale em qualquer página;
  - sem cookie, só a home (`/`) redireciona, pelo idioma do navegador (`Accept-Language`);
  - qualquer outro link abre na língua do link; se o navegador for de outra das nossas línguas, aparece a
    faixa de sugestão no pé da tela. O país não decide nada. Bots nunca são redirecionados.
- `wrangler.jsonc` liga `assets.run_worker_first` para as rotas HTML. Sem isso a Cloudflare serve o HTML
  direto e o Worker nem é chamado.
- Testar local: `npm run build && npx wrangler dev` e simular o navegador com o header `Accept-Language`:
  `curl -I -A Firefox -H 'Accept-Language: es-MX,es;q=0.9' http://localhost:8787/` (deve dar 302 para `/es/`).
- Textos de interface: `src/i18n/en.ts`, `pt.ts` e `es.ts`. Rotas por idioma: `src/i18n/rotas.ts`.
- SEO: `hreflang` e `canonical` em todas as páginas, e `sitemap.xml` com as três línguas.

## Tradução automática das reviews

`npm run translate` gera as versões nas outras línguas (`index.en.mdx`, `index.pt.mdx`, `index.es.mdx`) ao lado
de cada original, com o hash do original.
Só retraduz quando o original muda. Arquivo com `revisado: true` nunca é sobrescrito (o script só avisa).
A Action `.github/workflows/translate.yml` roda a cada push em reviews e uma vez por dia, e commita o resultado.

Sem token ainda? `npm run translate -- --mock` usa um tradutor de mentira (marca `modelo: mock`, e o primeiro
run de verdade substitui).

**Token da Cloudflare (grátis, sem cartão):** painel da Cloudflare → Workers AI → *Use REST API* →
*Create a Workers AI API Token*. Permissões: só **Workers AI: Read** e **Workers AI: Edit**, na sua conta.
Copie também o *Account ID* da mesma página. No GitHub: Settings → Secrets and variables → Actions:

| Secret | Valor |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Account ID |
| `CLOUDFLARE_AI_TOKEN` | o token |

Modelo: `@cf/google/gemma-4-26b-a4b-it` (troque com `TRANSLATE_MODEL`). Uma review de ~2.000 palavras gasta
perto de 150 neurons; a cota grátis é de 10.000 por dia. Passou da cota, a API devolve erro (no Free não existe
cobrança), a review fica sem tradução e o próximo run tenta de novo.

## Imagens e vídeos nas reviews

Tudo de uma review fica na pasta dela, e o caminho sempre começa com `../<slug>/`. É estranho ("sai da pasta
e entra de novo"), mas é o único formato que o painel gera e reconhece. Exemplo completo:
`src/content/reviews/outer-wilds/`.

| O quê | Onde fica | Como escreve |
|---|---|---|
| Capa (obrigatória) | `capa.jpg` na raiz da pasta | `capa: ../outer-wilds/capa.jpg` |
| Imagem do texto | `imagens/` | `![o que a imagem mostra](../outer-wilds/imagens/chefe-final.jpg)` |
| Clipe | `videos/` | `<Clipe src="../outer-wilds/videos/pouso-ruim.mp4" descricao="..." />` |

**Pelo painel:** a capa vai no campo "Capa"; imagens pelo botão de imagem do editor (em uma linha vazia: a
imagem entra onde está o cursor); clipes pelo bloco "Clipe curto / GIF". O painel salva cada arquivo na pasta
certa e escreve o caminho sozinho.

**Nome dos arquivos:** livre. O painel só limpa o nome no upload: `Chefe Final (versão 2).PNG` vira
`chefe-final-versao-2.png`. A capa sempre vira `capa.<extensão>`. Um nome que diga o que a imagem mostra
ajuda quem procura o arquivo depois, mas não é regra.

**Imagem com legenda.** Bloco "Imagem com legenda" no painel (insira a imagem dentro dele). Na IDE:

```mdx
<Figure legenda="O registro da nave liga cada pista.">

![O registro da nave](../outer-wilds/imagens/registro.jpg)

</Figure>
```

**YouTube.** Bloco "Vídeo do YouTube" no painel, ou:

```mdx
<YouTube id="dQw4w9WgXcQ" titulo="Trailer de Outer Wilds" />
```

**Clipe curto ou GIF:**

```mdx
<Clipe src="../outer-wilds/videos/pouso-ruim.mp4" poster="../outer-wilds/videos/pouso-ruim-capa.jpg" legenda="Legenda opcional" descricao="O que acontece no vídeo" />
```

- Só `.mp4` ou `.webm`. GIF precisa virar mp4 antes: `ffmpeg -i anim.gif -movflags +faststart -pix_fmt yuv420p -an anim.mp4`.
- Toca sozinho, sem som, em loop, com controles. Quem pede movimento reduzido no sistema não vê autoplay.
- O quadro de capa (`poster`) é opcional; sugestão de nome: o nome do vídeo com `-capa`.
- **Limite: 25 MB por arquivo**, o máximo da Cloudflare Workers. Vídeo longo vai para o YouTube.

**O build confere tudo** (`src/integrations/midia.ts`) e para com uma mensagem dizendo o arquivo e como
corrigir quando: falta a capa; a capa, uma imagem ou um clipe está fora do formato ou da pasta certa; o arquivo
não existe; um arquivo passa de 25 MB; o painel estragou uma imagem. Ele só **avisa**, sem impedir a
publicação, quando uma imagem está sem texto alternativo ou um clipe sem descrição, quando há arquivo solto
fora de `imagens/` e `videos/`, ou quando um arquivo não é usado por nenhuma versão.

Build parado não tira o site do ar: a Cloudflare mantém a última versão publicada e só não publica a nova.

As legendas, descrições, textos alternativos e títulos também são traduzidos pelo `npm run translate`.

---

## Deploy (uma vez)

### 1. Repositório no GitHub

Crie `TomazBontempo/needorgreed.blog` (pode ser privado) e suba o projeto.
Se usar outro nome, troque em `src/site.config.ts` (`SITE.repo`) e `keystatic.config.tsx` (`REPO`).

### 2. GitHub App do Keystatic (login do painel)

O Keystatic cria o App para você:

```bash
PUBLIC_KEYSTATIC_STORAGE=github npm run dev
```

Abra http://127.0.0.1:4321/keystatic, siga o assistente "Create GitHub App" e instale o App no repositório.
Ele grava um `.env` com quatro valores. **Não commite esse arquivo.**

Depois, nas configurações do App no GitHub, adicione a URL de callback de produção:

```
https://needorgreed.blog/api/keystatic/github/oauth/callback
```

### 3. Cloudflare Workers

No painel da Cloudflare: **Workers & Pages → Create → Import a repository** e escolha o repo.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

**Variáveis de build** (Settings → Build → Variables):

| Nome | Valor |
|---|---|
| `GITHUB_REPO` | `TomazBontempo/needorgreed.blog` |
| `GITHUB_TOKEN` | token fine-grained, só leitura de *Contents* e *Metadata* do repo |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | do `.env` do passo 2 |

**Secrets do Worker** (Settings → Variables and Secrets, tipo *Secret*):

| Nome | Valor |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | do `.env` |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | do `.env` |
| `KEYSTATIC_SECRET` | do `.env` |

Por fim, **Settings → Domains & Routes → Add custom domain** → `needorgreed.blog`.
O `needorgreed.com.br`, quando registrado, entra como redirecionamento para o `.blog`.

### 4. Comentários (Garrul)

Os comentários rodam num Worker separado, com o Garrul (github.com/KingPin/Garrul), no repositório
`TomazBontempo/needorgreed-comentarios`. A instalação, os apps de login (Google e Discord), o Turnstile e a
moderação estão no README de lá. No blog, basta pôr o endereço do Worker em `COMENTARIOS.api`, no
`src/site.config.ts`. Enquanto ele estiver vazio, a review mostra "Os comentários abrem em breve".

---

## Adicionando um parceiro

1. Adicione a pessoa como colaborador do repositório (permissão *Write*).
2. Crie o perfil em `/keystatic` → Autores, com o **login do GitHub** exato.
3. Pronto. Ela entra em `needorgreed.blog/keystatic` com a própria conta do GitHub.

Para tirar o acesso, basta remover a pessoa dos colaboradores.

## Como o autor é descoberto

No build, `src/lib/autores.ts` pergunta à API do GitHub qual **conta** fez o primeiro commit de cada review
e cruza com `src/content/autores/*.json`. Se outra pessoa editar depois, aparece "editado por".

- Usa o login da conta (vinculado pelo email verificado), nunca o nome/email do commit, que qualquer um configura.
- O email que cada pessoa usa no git precisa estar **verificado** na conta dela no GitHub, senão o commit fica
  sem conta e a review cai no `SITE.autorPadrao`.
- Para blindar mais: ative commits assinados. Se for exigir PR na `main` (branch protection), configure
  `branchPrefix` no `keystatic.config.tsx` para o painel trabalhar com branches.

## Estrutura

```
keystatic.config.tsx      painel: campos das reviews e autores, blocos de mídia
src/site.config.ts        repo, autor padrão, comentários
src/content.config.ts     schema das coleções (reviews, traduções, autores)
src/content/reviews/      uma pasta por review (index.mdx + tradução + imagens)
src/content/autores/      um JSON por autor
src/worker.ts             Worker: escolhe o idioma antes de servir a página
src/i18n/                 dicionários en/pt, rotas por idioma, regra de idioma
src/views/                as páginas (home, review, listagens, arquivo, sobre, 404)
src/pages/                rotas finas por idioma, que chamam as views
src/components/           ficha do item, loot log, destaque, mídia (Figure, Clipe, YouTube)
src/lib/                  reviews, loot log, autores, comentários, RSS, raridade
src/integrations/         checagem de tamanho de arquivo e de imagem estragada
scripts/translate.mjs     tradução automática (npm run translate)
```

Detalhes e padrões no `CLAUDE.md`; estado atual e pendências no `ESTADO.md`.

As reviews em `src/content/reviews/` são exemplos. Apague quando publicar as suas (lista no `ESTADO.md`).
