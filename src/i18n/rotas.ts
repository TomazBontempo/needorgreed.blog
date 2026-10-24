/**
 * Rotas por idioma. Inglês na raiz, português em /pt/.
 *
 *   en  /games/            /rarity/epic/        /reviews/outer-wilds/
 *   pt  /pt/jogos/         /pt/raridade/epico/  /pt/reviews/outer-wilds/
 *
 * Este arquivo não importa nada do Astro: o Worker (src/worker.ts) usa as mesmas funções
 * para mandar o leitor para a versão certa de cada página.
 */

export const IDIOMAS = ['en', 'pt'] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_PADRAO: Idioma = 'en';

export function ehIdioma(valor: unknown): valor is Idioma {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}

export const SECOES = {
  jogos: { en: 'games', pt: 'jogos' },
  telas: { en: 'screens', pt: 'telas' },
  arquivo: { en: 'archive', pt: 'arquivo' },
  sobre: { en: 'about', pt: 'sobre' },
  raridade: { en: 'rarity', pt: 'raridade' },
  autores: { en: 'authors', pt: 'autores' },
  reviews: { en: 'reviews', pt: 'reviews' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type Secao = keyof typeof SECOES;

/** Slug de cada raridade na URL. A chave é o id interno (src/lib/raridade.ts). */
export const SLUGS_RARIDADE = {
  lixo: { en: 'vendor-trash', pt: 'lixo' },
  comum: { en: 'common', pt: 'comum' },
  incomum: { en: 'uncommon', pt: 'incomum' },
  raro: { en: 'rare', pt: 'raro' },
  epico: { en: 'epic', pt: 'epico' },
  lendario: { en: 'legendary', pt: 'lendario' },
  heranca: { en: 'heirloom', pt: 'heranca' },
} as const satisfies Record<string, Record<Idioma, string>>;

const prefixo = (idioma: Idioma) => (idioma === IDIOMA_PADRAO ? '' : `/${idioma}`);

/** URL de uma página. `url('pt', 'raridade', 'epico')` -> `/pt/raridade/epico/`. */
export function url(idioma: Idioma, secao?: Secao, param?: string): string {
  if (!secao) return `${prefixo(idioma)}/`;
  let p = param;
  if (secao === 'raridade' && p && p in SLUGS_RARIDADE) p = SLUGS_RARIDADE[p as keyof typeof SLUGS_RARIDADE][idioma];
  return `${prefixo(idioma)}/${SECOES[secao][idioma]}/${p ? `${p}/` : ''}`;
}

/** Idioma de um caminho: tudo que começa com /pt é português. */
export function idiomaDoCaminho(pathname: string): Idioma {
  return pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en';
}

/** O mesmo caminho na outra língua. Caminhos desconhecidos só trocam o prefixo. */
export function caminhoEm(pathname: string, para: Idioma): string {
  const de = idiomaDoCaminho(pathname);
  const semPrefixo = de === IDIOMA_PADRAO ? pathname : pathname.slice(de.length + 1) || '/';
  const partes = semPrefixo.split('/').filter(Boolean);
  const barraFinal = semPrefixo.endsWith('/') || partes.length === 0;

  const secao = (Object.keys(SECOES) as Secao[]).find((s) => SECOES[s][de] === partes[0]);
  if (secao) {
    partes[0] = SECOES[secao][para];
    if (secao === 'raridade' && partes[1]) {
      const id = (Object.keys(SLUGS_RARIDADE) as Array<keyof typeof SLUGS_RARIDADE>).find(
        (r) => SLUGS_RARIDADE[r][de] === partes[1],
      );
      if (id) partes[1] = SLUGS_RARIDADE[id][para];
    }
  }

  const resto = partes.join('/');
  return `${prefixo(para)}/${resto}${resto && barraFinal ? '/' : ''}`;
}
