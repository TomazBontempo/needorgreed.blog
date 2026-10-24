/**
 * Quantos comentários cada review tem, para o link "Ver discussão (N comentários)" da home.
 *
 * Os comentários são do Giscus (GitHub Discussions), com uma discussão por review cujo
 * título é o slug (mapping 'specific'). No build, pergunta à API GraphQL do GitHub.
 * A GraphQL exige token: sem GITHUB_TOKEN, ou se falhar, devolve undefined e a home
 * mostra só "Ver discussão", sem número.
 */
import { GISCUS } from '../site.config';

let cache: Promise<Map<string, number> | undefined> | undefined;

async function buscar(): Promise<Map<string, number> | undefined> {
  const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  if (!token || !GISCUS.categoryId) return undefined;
  const [owner, name] = GISCUS.repo.split('/');
  const query = `query($owner: String!, $name: String!, $cat: ID!) {
    repository(owner: $owner, name: $name) {
      discussions(first: 100, categoryId: $cat, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes { title comments { totalCount } }
      }
    }
  }`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'needorgreed-build' },
      body: JSON.stringify({ query, variables: { owner, name, cat: GISCUS.categoryId } }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return undefined;
    const json = (await res.json()) as {
      data?: { repository?: { discussions?: { nodes: Array<{ title: string; comments: { totalCount: number } }> } } };
    };
    const nodes = json.data?.repository?.discussions?.nodes;
    return nodes && new Map(nodes.map((n) => [n.title, n.comments.totalCount]));
  } catch {
    return undefined;
  }
}

/** Número de comentários da review, ou undefined quando não dá para saber. */
export async function contarComentarios(slug: string): Promise<number | undefined> {
  cache ??= buscar();
  const mapa = await cache;
  return mapa ? (mapa.get(slug) ?? 0) : undefined;
}
