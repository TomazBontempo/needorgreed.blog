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
npm run dev
```

- Site: http://localhost:4321
- Painel: http://localhost:4321/keystatic (no dev ele salva direto nos arquivos do seu disco, sem login)

## Postando uma review

**Pelo painel:** `/keystatic` → Reviews → Create. Preenche os campos, escreve o texto, salva.

**Pela IDE:** cria uma pasta em `src/content/reviews/` com um `index.mdx`:

```
src/content/reviews/hollow-knight/
  index.mdx
  capa.jpg
```

```mdx
---
titulo: Hollow Knight
tipo: jogo            # jogo | filme | serie | anime
nota: 9.2             # 0 a 10, define a raridade
roll: need            # need | greed | pass
data: 2026-10-23
plataforma: Switch
duracao: 45h
capa: ./capa.jpg
frase: Frase de efeito que aparece no pé do tooltip.
atributos:
  - nome: Dificuldade
    valor: "+20"
tags: [metroidvania]
# heranca: true       # obra da vida, fora da escala
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
| Herança | fora da escala (`heranca: true`) |

O número do roll é a nota vezes dez: nota 9.4 vira `Need (94)`.
Cores e faixas ficam em `src/lib/raridade.ts` e `src/styles/global.css`.

---

## Deploy (uma vez)

### 1. Repositório no GitHub

Crie `TomazBontempo/needorgreed` (pode ser privado) e suba o projeto.
Se usar outro nome, troque em `src/site.config.ts` (`SITE.repo`, `GISCUS.repo`) e `keystatic.config.tsx` (`REPO`).

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
| `GITHUB_REPO` | `TomazBontempo/needorgreed` |
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

### 4. Comentários (Giscus)

1. No repo: Settings → General → Features → ative **Discussions** e crie a categoria "Comentários".
2. Instale o app Giscus: https://github.com/apps/giscus
3. Em https://giscus.app, gere `repoId` e `categoryId` e cole em `GISCUS` no `src/site.config.ts`.

O repo precisa ser **público** para o Giscus funcionar. Se quiser manter o código privado,
crie um repo público só para os comentários e aponte `GISCUS.repo` para ele.

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
keystatic.config.tsx      painel: campos das reviews e autores
src/site.config.ts        nome, repo, autor padrão, Giscus
src/content.config.ts     schema das coleções
src/content/reviews/      uma pasta por review
src/content/autores/      um JSON por autor
src/assets/               imagens enviadas pelo painel
src/lib/raridade.ts       faixas de raridade, rolls, tipos
src/lib/autores.ts        descoberta do autor via GitHub
src/lib/reviews.ts        junta tudo para as páginas
src/components/           tooltip de item, linha de roll, YouTube, comentários
src/pages/                home, review, jogos, telas, raridade, autores, arquivo, sobre, RSS
```

As três reviews em `src/content/reviews/` são exemplos. Apague quando publicar as suas.
