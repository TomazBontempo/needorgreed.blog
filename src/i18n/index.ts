/**
 * Ponto de entrada do i18n para as páginas.
 *
 *   const lang = idiomaDe(Astro);      // 'en' | 'pt', pela URL
 *   const t = dicionario(lang);        // textos de interface
 *   url(lang, 'jogos')                 // '/games/' ou '/pt/jogos/'
 */
import en, { type Dicionario } from './en';
import pt from './pt';
import { caminhoEm as caminhoEmInterno, idiomaDoCaminho, type Idioma } from './rotas';

export { url, caminhoEm, IDIOMAS, IDIOMA_PADRAO, SECOES, SLUGS_RARIDADE, type Idioma, type Secao } from './rotas';
export type { Dicionario } from './en';

const DICIONARIOS: Record<Idioma, Dicionario> = { en, pt };

export function dicionario(idioma: Idioma): Dicionario {
  return DICIONARIOS[idioma];
}

export function idiomaDe(astro: { url: URL }): Idioma {
  return idiomaDoCaminho(astro.url.pathname);
}

export function formatarData(idioma: Idioma, d: Date, opcoes?: Intl.DateTimeFormatOptions): string {
  return d.toLocaleDateString(DICIONARIOS[idioma].locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...opcoes,
  });
}

/**
 * canonical e hreflang de uma página. Toda página existe nas duas línguas
 * (review sem tradução mostra o original com aviso), então sempre há par.
 */
export function alternativas(pathname: string, site: URL | string) {
  const idioma = idiomaDoCaminho(pathname);
  const abs = (p: string) => new URL(p, site).href;
  const enPath = idioma === 'en' ? pathname : caminhoEmInterno(pathname, 'en');
  const ptPath = idioma === 'pt' ? pathname : caminhoEmInterno(pathname, 'pt');
  return {
    canonical: abs(pathname),
    links: [
      { hreflang: en.hreflang, href: abs(enPath) },
      { hreflang: pt.hreflang, href: abs(ptPath) },
      { hreflang: 'x-default', href: abs(enPath) },
    ],
  };
}
