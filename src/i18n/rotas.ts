/**
 * Rotas por idioma. Inglês na raiz; as outras línguas com prefixo (/pt/, /es/).
 *
 *   en  /games/            /rarity/epic/        /reviews/outer-wilds/
 *   pt  /pt/jogos/         /pt/raridade/epico/  /pt/reviews/outer-wilds/
 *   es  /es/juegos/        /es/rareza/epico/    /es/reviews/outer-wilds/
 *
 * Este arquivo não importa nada do Astro: o Worker (src/worker.ts) usa as mesmas funções
 * para mandar o leitor para a versão certa de cada página.
 */

export const IDIOMAS = ['en', 'pt', 'es'] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_PADRAO: Idioma = 'en';

export function ehIdioma(valor: unknown): valor is Idioma {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}

export const SECOES = {
  jogos: { en: 'games', pt: 'jogos', es: 'juegos' },
  telas: { en: 'screens', pt: 'telas', es: 'pantallas' },
  arquivo: { en: 'archive', pt: 'arquivo', es: 'archivo' },
  sobre: { en: 'about', pt: 'sobre', es: 'acerca' },
  raridade: { en: 'rarity', pt: 'raridade', es: 'rareza' },
  autores: { en: 'authors', pt: 'autores', es: 'autores' },
  reviews: { en: 'reviews', pt: 'reviews', es: 'reviews' },
  privacidade: { en: 'privacy', pt: 'privacidade', es: 'privacidad' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type Secao = keyof typeof SECOES;

/** Slug de cada raridade na URL. A chave é o id interno (src/lib/raridade.ts). */
export const SLUGS_RARIDADE = {
  lixo: { en: 'vendor-trash', pt: 'lixo', es: 'basura' },
  comum: { en: 'common', pt: 'comum', es: 'comun' },
  incomum: { en: 'uncommon', pt: 'incomum', es: 'poco-comun' },
  raro: { en: 'rare', pt: 'raro', es: 'raro' },
  epico: { en: 'epic', pt: 'epico', es: 'epico' },
  lendario: { en: 'legendary', pt: 'lendario', es: 'legendario' },
} as const satisfies Record<string, Record<Idioma, string>>;

const prefixo = (idioma: Idioma) => (idioma === IDIOMA_PADRAO ? '' : `/${idioma}`);

/** URL de uma página. `url('pt', 'raridade', 'epico')` -> `/pt/raridade/epico/`. */
export function url(idioma: Idioma, secao?: Secao, param?: string): string {
  if (!secao) return `${prefixo(idioma)}/`;
  let p = param;
  if (secao === 'raridade' && p && p in SLUGS_RARIDADE) p = SLUGS_RARIDADE[p as keyof typeof SLUGS_RARIDADE][idioma];
  return `${prefixo(idioma)}/${SECOES[secao][idioma]}/${p ? `${p}/` : ''}`;
}

/** Idioma de um caminho pelo prefixo: /pt/... é português, /es/... é espanhol, o resto é inglês. */
export function idiomaDoCaminho(pathname: string): Idioma {
  const primeiro = pathname.split('/')[1];
  return ehIdioma(primeiro) && primeiro !== IDIOMA_PADRAO ? primeiro : IDIOMA_PADRAO;
}

/** O mesmo caminho em outra língua. Caminhos desconhecidos só trocam o prefixo. */
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
