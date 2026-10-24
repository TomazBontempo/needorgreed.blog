/**
 * getStaticPaths das páginas dinâmicas, iguais nas duas línguas (só o slug muda).
 */
import { getCollection } from 'astro:content';
import { SLUGS_RARIDADE, type Idioma } from '../i18n/rotas';
import { RARIDADES } from './raridade';
import { getReviews } from './reviews';

/** /rarity/epic/ e /pt/raridade/epico/ */
export function caminhosDeRaridade(idioma: Idioma) {
  return RARIDADES.map((r) => ({ params: { slug: SLUGS_RARIDADE[r.id][idioma] }, props: { raridade: r.id } }));
}

/** Uma página para cada autor cadastrado e para cada login sem cadastro que já publicou. */
export async function caminhosDeAutor() {
  const reviews = await getReviews();
  const autores = await getCollection('autores');
  const slugs = new Set<string>([...autores.map((a) => a.id), ...reviews.map((r) => r.autor.slug)]);
  return [...slugs].map((slug) => {
    const autor = autores.find((a) => a.id === slug);
    const login = autor?.data.github ?? reviews.find((r) => r.autor.slug === slug)?.autor.login ?? slug;
    return { params: { slug }, props: { slug, login, autor } };
  });
}
