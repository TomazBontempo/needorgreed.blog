/**
 * Quantos comentários cada review tem, para o link "Abrir review e comentários (N)" da home.
 *
 * Os comentários são do Garrul (ver COMENTARIOS em site.config). No build, uma chamada só a
 * /api/v1/counts com os slugs de todas as reviews. O número fica fixo até o próximo build
 * (cada review nova ou tradução publica de novo). Sem `api` configurada, ou se falhar,
 * devolve undefined e a home mostra o link sem número.
 */
import { COMENTARIOS, SITE } from '../site.config';
import { getReviews } from './reviews';

let cache: Promise<Map<string, number> | undefined> | undefined;

async function buscar(): Promise<Map<string, number> | undefined> {
  if (!COMENTARIOS.api) return undefined;
  // O Garrul aceita até 100 slugs por chamada.
  const slugs = (await getReviews()).map((r) => r.slug).slice(0, 100);
  if (!slugs.length) return new Map();
  try {
    const res = await fetch(`${COMENTARIOS.api}/api/v1/counts?slugs=${slugs.map(encodeURIComponent).join(',')}`, {
      // O Garrul só responde a origens da lista dele (ALLOWED_ORIGINS), mesmo em GET.
      headers: { Origin: SITE.url },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return undefined;
    const json = (await res.json()) as { counts?: Record<string, number> };
    // Review sem comentário não vem na resposta: vira 0 em contarComentarios.
    return new Map(Object.entries(json.counts ?? {}));
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
