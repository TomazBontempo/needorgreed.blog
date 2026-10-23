import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getReviews } from '../lib/reviews';
import { ROLLS } from '../lib/raridade';
import { SITE } from '../site.config';

export async function GET(context: APIContext) {
  const reviews = await getReviews();
  return rss({
    title: SITE.nome,
    description: SITE.descricao,
    site: context.site ?? SITE.url,
    customData: `<language>${SITE.idioma}</language>`,
    items: reviews.map((r) => ({
      title: `${r.autor.nick} rolou ${ROLLS[r.entry.data.roll].nome} (${r.valorRoll}) para ${r.entry.data.titulo}`,
      pubDate: r.entry.data.data,
      description: r.entry.data.frase ?? `${r.raridade.nome}. ${ROLLS[r.entry.data.roll].descricao}`,
      link: r.url,
      categories: [r.raridade.nome, ...r.entry.data.tags],
    })),
  });
}
