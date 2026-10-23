import { getCollection, type CollectionEntry } from 'astro:content';
import { autoriaDe, autorDoLogin } from './autores';
import { raridadeDaNota, valorDoRoll, TIPOS, type Raridade } from './raridade';

export interface ReviewCompleta {
  entry: CollectionEntry<'reviews'>;
  slug: string;
  url: string;
  raridade: Raridade;
  valorRoll: number;
  secao: 'jogos' | 'telas';
  autor: { nick: string; login: string; slug: string };
  editor?: { nick: string; login: string; slug: string };
}

let todas: Promise<ReviewCompleta[]> | undefined;

/** Todas as reviews publicadas, com autor, raridade e roll resolvidos, da mais nova para a mais antiga. */
export function getReviews(): Promise<ReviewCompleta[]> {
  todas ??= (async () => {
    const entries = await getCollection('reviews', ({ data }) =>
      import.meta.env.PROD ? !data.rascunho : true,
    );

    const completas = await Promise.all(
      entries.map(async (entry) => {
        const autoria = await autoriaDe(entry);
        const autor = await autorDoLogin(autoria.criador);
        const editor = autoria.editor ? await autorDoLogin(autoria.editor) : undefined;
        return {
          entry,
          slug: entry.id,
          url: `/reviews/${entry.id}/`,
          raridade: raridadeDaNota(entry.data.nota, entry.data.heranca),
          valorRoll: valorDoRoll(entry.data.nota),
          secao: TIPOS[entry.data.tipo].secao,
          autor: { nick: autor.nick, login: autor.login, slug: autor.slug },
          editor: editor && { nick: editor.nick, login: editor.login, slug: editor.slug },
        } satisfies ReviewCompleta;
      }),
    );

    return completas.sort((a, b) => b.entry.data.data.valueOf() - a.entry.data.data.valueOf());
  })();
  return todas;
}

export function formatarData(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
