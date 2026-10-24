import { getCollection, type CollectionEntry } from 'astro:content';
import { autoriaDe, autorDoLogin } from './autores';
import { raridadeDaNota, valorDoRoll, TIPOS, type Raridade } from './raridade';
import type { Idioma } from '../i18n/rotas';

export interface AutorRef {
  nick: string;
  login: string;
  slug: string;
}

export interface ReviewCompleta {
  entry: CollectionEntry<'reviews'>;
  slug: string;
  raridade: Raridade;
  valorRoll: number;
  secao: 'jogos' | 'telas';
  /** Número de coleção: ordem de publicação, a primeira review é a Nº 001. */
  numero: number;
  autor: AutorRef;
  editor?: AutorRef;
}

let todas: Promise<ReviewCompleta[]> | undefined;

/** Todas as reviews publicadas, com autor, raridade e roll resolvidos, da mais nova para a mais antiga. */
export function getReviews(): Promise<ReviewCompleta[]> {
  todas ??= (async () => {
    const entries = await getCollection('reviews', ({ data }) => (import.meta.env.PROD ? !data.rascunho : true));

    // Da mais antiga para a mais nova, para numerar.
    entries.sort((a, b) => a.data.data.valueOf() - b.data.data.valueOf() || a.id.localeCompare(b.id));

    const completas = await Promise.all(
      entries.map(async (entry, i) => {
        const autoria = await autoriaDe(entry);
        const autor = await autorDoLogin(autoria.criador);
        const editor = autoria.editor ? await autorDoLogin(autoria.editor) : undefined;
        return {
          entry,
          slug: entry.id,
          raridade: raridadeDaNota(entry.data.nota, entry.data.heranca),
          valorRoll: valorDoRoll(entry.data.nota),
          secao: TIPOS[entry.data.tipo].secao,
          numero: i + 1,
          autor: { nick: autor.nick, login: autor.login, slug: autor.slug },
          editor: editor && { nick: editor.nick, login: editor.login, slug: editor.slug },
        } satisfies ReviewCompleta;
      }),
    );

    return completas.reverse();
  })();
  return todas;
}

/** "014". */
export function numeroDeColecao(n: number): string {
  return String(n).padStart(3, '0');
}

/**
 * A review na língua pedida.
 *  - Mesma língua do original: o original.
 *  - Outra língua com tradução: a tradução, com aviso "traduzido automaticamente".
 *  - Outra língua sem tradução ainda: o original, com aviso, em vez de 404.
 */
export interface VersaoReview {
  entry: CollectionEntry<'reviews'> | CollectionEntry<'traducoes'>;
  data: CollectionEntry<'reviews'>['data'];
  /** Língua em que o texto exibido está. */
  idiomaTexto: Idioma;
  /** Língua em que a review foi escrita. */
  idiomaOriginal: Idioma;
  aviso?: 'traduzida' | 'sem-traducao';
}

let traducoes: Promise<Map<string, CollectionEntry<'traducoes'>>> | undefined;

function getTraducoes() {
  traducoes ??= getCollection('traducoes').then((lista) => new Map(lista.map((t) => [t.id, t])));
  return traducoes;
}

export async function versaoEm(review: ReviewCompleta, idioma: Idioma): Promise<VersaoReview> {
  const original = review.entry;
  const idiomaOriginal = original.data.idioma;
  if (idioma === idiomaOriginal) {
    return { entry: original, data: original.data, idiomaTexto: idioma, idiomaOriginal };
  }
  const traducao = (await getTraducoes()).get(`${review.slug}/${idioma}`);
  if (traducao) {
    return { entry: traducao, data: traducao.data, idiomaTexto: idioma, idiomaOriginal, aviso: 'traduzida' };
  }
  return { entry: original, data: original.data, idiomaTexto: idiomaOriginal, idiomaOriginal, aviso: 'sem-traducao' };
}

/** Tempo de leitura em minutos, a 230 palavras por minuto. */
export function minutosDeLeitura(corpo: string | undefined): number {
  const palavras = (corpo ?? '').replace(/<[^>]+>|[#>*_`[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 230));
}
