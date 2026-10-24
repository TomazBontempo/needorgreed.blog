/** Feed RSS de cada língua: /rss.xml (inglês) e /pt/rss.xml (português). */
import rss from '@astrojs/rss';
import { getReviews, versaoEm } from './reviews';
import { dicionario, url, type Idioma } from '../i18n';
import { SITE } from '../site.config';

export async function feed(idioma: Idioma, site: URL | undefined) {
  const t = dicionario(idioma);
  const reviews = await getReviews();
  const items = await Promise.all(
    reviews.map(async (r) => {
      const { data } = await versaoEm(r, idioma);
      return {
        title: `${r.autor.nick} ${t.log.rolou} ${t.rolls[data.roll].nome} (${r.valorRoll}) ${t.log.para} [${data.titulo}]`,
        pubDate: data.data,
        description: data.motivoRoll ?? data.frase ?? t.rolls[data.roll].descricao,
        link: url(idioma, 'reviews', r.slug),
        categories: [t.raridades[r.raridade.id].nome, ...data.tags],
      };
    }),
  );
  return rss({
    title: 'Need or Greed',
    description: t.site.descricao,
    site: site ?? SITE.url,
    customData: `<language>${t.hreflang}</language>`,
    items,
  });
}
