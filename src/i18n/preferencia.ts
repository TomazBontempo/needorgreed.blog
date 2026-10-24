/**
 * Qual das nossas línguas o leitor prefere, pela lista de idiomas do navegador.
 * Usado no Worker (header Accept-Language) e no navegador (navigator.languages, na faixa de sugestão).
 * Sem nada do Astro nem da Cloudflare: roda nos dois lados.
 */
import { IDIOMA_PADRAO, ehIdioma, type Idioma } from './rotas';

/**
 * "fr-FR,fr;q=0.9,es;q=0.8,en;q=0.7" -> ["fr-FR", "fr", "es", "en"], em ordem de preferência.
 * Entradas com q=0 (recusadas) ficam de fora.
 */
export function listaDoAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(',')
    .map((parte, i) => {
      const [tag, ...params] = parte.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { tag: tag.trim(), q: q ? Number(q.slice(2)) : 1, i };
    })
    .filter((x) => x.tag && x.tag !== '*' && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i)
    .map((x) => x.tag);
}

/**
 * A primeira língua da lista que o site tem. "pt-BR", "pt-AO" e "pt" contam como português;
 * "es-MX", "es-419" e "es" como espanhol. Se nenhuma servir, inglês.
 */
export function idiomaDoNavegador(lista: readonly string[]): Idioma {
  for (const tag of lista) {
    const base = tag.toLowerCase().split('-')[0];
    if (ehIdioma(base)) return base;
  }
  return IDIOMA_PADRAO;
}
