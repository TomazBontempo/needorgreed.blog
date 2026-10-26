/**
 * Sitemap com as três línguas. Cada página aparece uma vez por idioma, e cada entrada lista
 * todas as versões (hreflang), inclusive ela mesma, mais o x-default em inglês.
 * As listas vêm das mesmas fontes das páginas: rotas.ts, reviews, raridades e autores.
 */
import type { APIContext } from 'astro';
import { IDIOMAS, IDIOMA_PADRAO, url, type Idioma, type Secao } from '../i18n';
import { dicionario } from '../i18n';
import { getReviews } from '../lib/reviews';
import { RARIDADES } from '../lib/raridade';
import { caminhosDeAutor } from '../lib/caminhos';
import { SITE } from '../site.config';

type Pagina = { caminho: (idioma: Idioma) => string; data?: Date };

export async function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);
  const abs = (p: string) => new URL(p, site).href;

  const reviews = await getReviews();
  const autores = await caminhosDeAutor();
  const secoes: Secao[] = ['jogos', 'telas', 'arquivo', 'sobre', 'privacidade'];

  const paginas: Pagina[] = [
    { caminho: (l) => url(l), data: reviews[0]?.entry.data.data },
    ...secoes.map((s) => ({ caminho: (l: Idioma) => url(l, s) })),
    ...RARIDADES.map((r) => ({ caminho: (l: Idioma) => url(l, 'raridade', r.id) })),
    ...autores.map((a) => ({ caminho: (l: Idioma) => url(l, 'autores', a.params.slug) })),
    ...reviews.map((r) => ({ caminho: (l: Idioma) => url(l, 'reviews', r.slug), data: r.entry.data.data })),
  ];

  const entradas = paginas.flatMap((p) => {
    const alternativas = [
      ...IDIOMAS.map((l) => `    <xhtml:link rel="alternate" hreflang="${dicionario(l).hreflang}" href="${abs(p.caminho(l))}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.caminho(IDIOMA_PADRAO))}"/>`,
    ].join('\n');
    const lastmod = p.data ? `\n    <lastmod>${p.data.toISOString().slice(0, 10)}</lastmod>` : '';
    return IDIOMAS.map((l) => `  <url>\n    <loc>${abs(p.caminho(l))}</loc>${lastmod}\n${alternativas}\n  </url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
