/**
 * Loot log: a atividade do site em forma de mensagens de sistema.
 *
 *   review criada     Snufupugos rolou Greed (72) para [Jogo]
 *   review atualizada Snufupugos atualizou [Jogo]          (edições do mesmo dia viram uma só)
 *   autor novo        OutroNick entrou no grupo
 *
 * Fonte, no build: histórico de commits do GitHub. Igual a src/lib/autores.ts, quem fez cada
 * commit é o LOGIN da conta (vinculado pelo email verificado), nunca o nome/email do commit.
 *
 * Fallback: se a API não responder (sem rede, repo privado sem token, limite estourado),
 * o log é montado a partir das próprias reviews: uma entrada "rolou" na data de cada uma
 * e um "entrou no grupo" na data da primeira review de cada autor.
 *
 * Este arquivo só transforma dados (sem rede, sem astro:content), para dar para testar.
 * A busca no GitHub fica em lootlog.ts.
 */
import type { ReviewCompleta } from './reviews';

export interface AutorLog {
  nick: string;
  login: string;
  slug: string;
}

interface EventoBase {
  /** Momento do evento (commit mais recente, no caso de edições agrupadas). */
  data: Date;
  autor: AutorLog;
}

export type EventoLog =
  | (EventoBase & { tipo: 'review'; review: ReviewCompleta })
  | (EventoBase & { tipo: 'atualizacao'; review: ReviewCompleta; edicoes: number })
  | (EventoBase & { tipo: 'autor' });

/** Um commit, já reduzido ao que importa para o log. */
export interface CommitLog {
  sha: string;
  /** Login da conta do GitHub. null quando o email do commit não está ligado a nenhuma conta. */
  login: string | null;
  data: Date;
  arquivos: Array<{ caminho: string; status: 'added' | 'modified' | 'removed' | 'renamed' | string }>;
}

const RE_REVIEW = /^src\/content\/reviews\/([^/]+)\/index\.mdx?$/;
const RE_AUTOR = /^src\/content\/autores\/([^/]+)\.json$/;

/** Dia (UTC) usado para agrupar edições. */
function dia(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function ehBot(login: string | null): boolean {
  return !!login && login.endsWith('[bot]');
}

export interface Resolvedores {
  review: (slug: string) => ReviewCompleta | undefined;
  autor: (login: string) => Promise<AutorLog>;
  /** Login do autor de um arquivo de autor (src/content/autores/<id>.json). */
  loginDoArquivoDeAutor: (id: string) => string | undefined;
  /** Login usado quando o commit não tem conta do GitHub ligada (SITE.autorPadrao). */
  autorPadrao: string;
}

export async function eventosDosCommits(commits: CommitLog[], r: Resolvedores): Promise<EventoLog[]> {
  const ordenados = [...commits].sort((a, b) => a.data.valueOf() - b.data.valueOf());
  const criadas = new Map<string, { login: string; dia: string }>();
  const eventos: EventoLog[] = [];
  const edicoes = new Map<string, Extract<EventoLog, { tipo: 'atualizacao' }>>();
  const autoresQueEntraram = new Set<string>();

  for (const c of ordenados) {
    // Commits da Action de tradução (github-actions[bot]) não são atividade de ninguém.
    if (ehBot(c.login)) continue;
    const login = c.login ?? r.autorPadrao;

    for (const arq of c.arquivos) {
      const mReview = arq.caminho.match(RE_REVIEW);
      if (mReview) {
        const slug = mReview[1];
        const review = r.review(slug);
        // Review apagada ou rascunho: não aparece no log.
        if (!review) continue;

        if (!criadas.has(slug)) {
          // O primeiro commit que vemos do arquivo é a criação, mesmo que o status venha "modified"
          // (acontece quando o histórico foi cortado pela paginação).
          criadas.set(slug, { login, dia: dia(c.data) });
          eventos.push({ tipo: 'review', data: c.data, autor: await r.autor(login), review });
          continue;
        }

        if (arq.status === 'removed') continue;
        const criacao = criadas.get(slug)!;
        // Ajustes do próprio autor no dia em que publicou fazem parte da publicação.
        if (criacao.login === login && criacao.dia === dia(c.data)) continue;

        const chave = `${slug}|${login}|${dia(c.data)}`;
        const existente = edicoes.get(chave);
        if (existente) {
          existente.edicoes += 1;
          existente.data = c.data;
        } else {
          const ev = { tipo: 'atualizacao' as const, data: c.data, autor: await r.autor(login), review, edicoes: 1 };
          edicoes.set(chave, ev);
          eventos.push(ev);
        }
        continue;
      }

      const mAutor = arq.caminho.match(RE_AUTOR);
      if (mAutor && arq.status === 'added') {
        const loginDoAutor = r.loginDoArquivoDeAutor(mAutor[1]);
        if (!loginDoAutor || autoresQueEntraram.has(loginDoAutor.toLowerCase())) continue;
        autoresQueEntraram.add(loginDoAutor.toLowerCase());
        eventos.push({ tipo: 'autor', data: c.data, autor: await r.autor(loginDoAutor) });
      }
    }
  }

  return eventos;
}

/**
 * Completa o log com o que o histórico não mostrou: reviews sem commit (arquivo novo ainda
 * não commitado, ou API fora do ar) e autores que publicaram sem um "entrou no grupo".
 */
export function completarComReviews(eventos: EventoLog[], reviews: ReviewCompleta[]): EventoLog[] {
  const comEvento = new Set(eventos.filter((e) => e.tipo === 'review').map((e) => e.review.slug));
  const autores = new Set(eventos.filter((e) => e.tipo === 'autor').map((e) => e.autor.login.toLowerCase()));
  const extras: EventoLog[] = [];

  // Da mais antiga para a mais nova, para o "entrou no grupo" cair na primeira review do autor.
  for (const review of [...reviews].reverse()) {
    if (!autores.has(review.autor.login.toLowerCase())) {
      autores.add(review.autor.login.toLowerCase());
      extras.push({ tipo: 'autor', data: review.entry.data.data, autor: review.autor });
    }
    if (!comEvento.has(review.slug)) {
      extras.push({ tipo: 'review', data: review.entry.data.data, autor: review.autor, review });
    }
  }

  return [...eventos, ...extras];
}

/** Mais novo primeiro. No empate, "entrou no grupo" vem depois (aparece antes na leitura cronológica). */
export function ordenarLog(eventos: EventoLog[]): EventoLog[] {
  const peso = { autor: 0, review: 1, atualizacao: 2 } as const;
  return [...eventos].sort((a, b) => b.data.valueOf() - a.data.valueOf() || peso[b.tipo] - peso[a.tipo]);
}
