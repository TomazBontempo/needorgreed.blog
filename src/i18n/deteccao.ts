/**
 * Qual idioma servir para cada visita. Roda no Worker, antes da página.
 *
 *   1. ?lang=pt ou ?lang=en (o toggle): grava o cookie e manda para a página nessa língua.
 *   2. Bots de busca: nunca redireciona. Cada idioma tem a própria URL, hreflang e canonical.
 *   3. Cookie `lang`: a escolha do leitor vence tudo, em todas as visitas.
 *   4. Sem cookie: Brasil e Portugal veem português; o resto do mundo, inglês.
 *      País desconhecido: serve o que a URL pediu.
 *
 * Função pura (sem APIs da Cloudflare) para dar para testar.
 */
import { caminhoEm, ehIdioma, idiomaDoCaminho, type Idioma } from './rotas';

export const COOKIE = 'lang';
const UM_ANO = 60 * 60 * 24 * 365;

const PAISES_PORTUGUES = new Set(['BR', 'PT']);

const BOTS =
  /bot|crawl|spider|slurp|bingpreview|mediapartners|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord|slack|vkshare|pinterest|lighthouse|headless|preview/i;

export interface Visita {
  method: string;
  url: URL;
  cookie: string | null;
  userAgent: string | null;
  /** Header cf-ipcountry ou request.cf.country. */
  pais: string | null;
}

export type Decisao = { tipo: 'seguir' } | { tipo: 'redirecionar'; para: string; gravarCookie?: Idioma };

export function lerCookie(header: string | null, nome = COOKIE): string | undefined {
  return header
    ?.split(';')
    .map((p) => p.trim().split('='))
    .find(([k]) => k === nome)?.[1];
}

export function cookieDeIdioma(idioma: Idioma): string {
  return `${COOKIE}=${idioma}; Path=/; Max-Age=${UM_ANO}; SameSite=Lax; Secure`;
}

/** Rotas que são página HTML. Arquivos (rss.xml, imagens) e o painel ficam de fora. */
function ehPagina(pathname: string): boolean {
  if (/^\/(_astro|keystatic|api|_image|fichas|videos)(\/|$)/.test(pathname)) return false;
  const ultimo = pathname.split('/').pop() ?? '';
  return !ultimo.includes('.') || ultimo.endsWith('.html');
}

export function idiomaDoPais(pais: string | null): Idioma | undefined {
  if (!pais || pais === 'XX' || pais === 'T1') return undefined;
  return PAISES_PORTUGUES.has(pais.toUpperCase()) ? 'pt' : 'en';
}

export function decidir(v: Visita): Decisao {
  if (v.method !== 'GET' && v.method !== 'HEAD') return { tipo: 'seguir' };
  if (!ehPagina(v.url.pathname)) return { tipo: 'seguir' };

  const atual = idiomaDoCaminho(v.url.pathname);

  // 1. O toggle pediu um idioma.
  const pedido = v.url.searchParams.get('lang');
  if (ehIdioma(pedido)) {
    const destino = new URL(v.url);
    destino.searchParams.delete('lang');
    destino.pathname = caminhoEm(v.url.pathname, pedido);
    return { tipo: 'redirecionar', para: destino.pathname + destino.search + destino.hash, gravarCookie: pedido };
  }

  // 2. Bots e visitas sem user agent.
  if (!v.userAgent || BOTS.test(v.userAgent)) return { tipo: 'seguir' };

  // 3 e 4. Preferência salva, ou o país.
  const salvo = lerCookie(v.cookie);
  const desejado = ehIdioma(salvo) ? salvo : idiomaDoPais(v.pais);
  if (!desejado || desejado === atual) return { tipo: 'seguir' };

  return { tipo: 'redirecionar', para: caminhoEm(v.url.pathname, desejado) + v.url.search };
}
