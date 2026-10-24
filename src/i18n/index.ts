/**
 * Ponto de entrada do i18n para as páginas.
 *
 *   const lang = idiomaDe(Astro);      // 'en' | 'pt' | 'es', pela URL
 *   const t = dicionario(lang);        // textos de interface
 *   url(lang, 'jogos')                 // '/games/', '/pt/jogos/' ou '/es/juegos/'
 */
import en, { type Dicionario } from './en';
import pt from './pt';
import es from './es';
import { IDIOMAS, IDIOMA_PADRAO, caminhoEm as caminhoEmInterno, idiomaDoCaminho, type Idioma } from './rotas';

export { url, caminhoEm, IDIOMAS, IDIOMA_PADRAO, SECOES, SLUGS_RARIDADE, type Idioma, type Secao } from './rotas';
export type { Dicionario } from './en';

const DICIONARIOS: Record<Idioma, Dicionario> = { en, pt, es };

/** Nome de cada língua escrito nela mesma, como aparece no seletor (sem bandeira: bandeira é país). */
export const AUTONIMOS: Record<Idioma, string> = { en: 'English', pt: 'Português', es: 'Español' };

/**
 * Para onde o seletor (e a faixa de sugestão) leva: a mesma página na outra língua.
 * Na 404 não existe "a mesma página", então leva para a home da língua escolhida.
 */
export function destinoDaTroca(pathname: string, idioma: Idioma): string {
  return /\/404(\.html)?\/?$/.test(pathname) ? `${caminhoEmInterno('/', idioma)}` : caminhoEmInterno(pathname, idioma);
}

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
 * canonical e hreflang de uma página. Toda página existe em todas as línguas
 * (review sem tradução mostra o original com aviso), então sempre há o conjunto completo.
 * x-default aponta para o inglês, que é o que a home serve para quem não tem preferência.
 */
export function alternativas(pathname: string, site: URL | string) {
  const atual = idiomaDoCaminho(pathname);
  const abs = (p: string) => new URL(p, site).href;
  const caminho = (idioma: Idioma) => (idioma === atual ? pathname : caminhoEmInterno(pathname, idioma));
  return {
    canonical: abs(pathname),
    links: [
      ...IDIOMAS.map((idioma) => ({ hreflang: DICIONARIOS[idioma].hreflang, href: abs(caminho(idioma)) })),
      { hreflang: 'x-default', href: abs(caminho(IDIOMA_PADRAO)) },
    ],
  };
}
