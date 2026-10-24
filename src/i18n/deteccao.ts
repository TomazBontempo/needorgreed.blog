/**
 * Qual idioma servir para cada visita. Roda no Worker, antes da página.
 *
 *   1. ?lang=xx (o seletor ou a faixa de sugestão): grava o cookie e manda para a página nessa língua.
 *   2. Bots de busca: nunca redireciona. Cada idioma tem a própria URL, hreflang e canonical.
 *   3. Cookie `lang`: a escolha do leitor vence tudo, em qualquer página, em todas as visitas.
 *   4. Sem cookie, só a home (/) redireciona, pelo idioma do navegador (Accept-Language).
 *      Qualquer outro link abre na língua do próprio link; lá, a faixa de sugestão oferece a troca.
 *
 * O país não decide nada: o idioma do navegador diz o que a pessoa lê, o IP só diz onde ela está.
 * Função pura (sem APIs da Cloudflare) para dar para testar.
 */
import { caminhoEm, ehIdioma, idiomaDoCaminho, type Idioma } from './rotas';
import { idiomaDoNavegador, listaDoAcceptLanguage } from './preferencia';

export { idiomaDoNavegador, listaDoAcceptLanguage } from './preferencia';

export const COOKIE = 'lang';
const UM_ANO = 60 * 60 * 24 * 365;

const BOTS =
  /bot|crawl|spider|slurp|bingpreview|mediapartners|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord|slack|vkshare|pinterest|lighthouse|headless|preview/i;

export interface Visita {
  method: string;
  url: URL;
  cookie: string | null;
  userAgent: string | null;
  /** Header Accept-Language do navegador. */
  acceptLanguage: string | null;
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

export function decidir(v: Visita): Decisao {
  if (v.method !== 'GET' && v.method !== 'HEAD') return { tipo: 'seguir' };
  if (!ehPagina(v.url.pathname)) return { tipo: 'seguir' };

  const atual = idiomaDoCaminho(v.url.pathname);

  // 1. O leitor escolheu um idioma.
  const pedido = v.url.searchParams.get('lang');
  if (ehIdioma(pedido)) {
    const destino = new URL(v.url);
    destino.searchParams.delete('lang');
    destino.pathname = caminhoEm(v.url.pathname, pedido);
    return { tipo: 'redirecionar', para: destino.pathname + destino.search + destino.hash, gravarCookie: pedido };
  }

  // 2. Bots e visitas sem user agent.
  if (!v.userAgent || BOTS.test(v.userAgent)) return { tipo: 'seguir' };

  // 3. Escolha salva: vale para qualquer página.
  const salvo = lerCookie(v.cookie);
  if (ehIdioma(salvo)) {
    return salvo === atual ? { tipo: 'seguir' } : { tipo: 'redirecionar', para: caminhoEm(v.url.pathname, salvo) + v.url.search };
  }

  // 4. Sem escolha: só a home, pelo idioma do navegador.
  if (v.url.pathname !== '/') return { tipo: 'seguir' };
  const desejado = idiomaDoNavegador(listaDoAcceptLanguage(v.acceptLanguage));
  return desejado === atual ? { tipo: 'seguir' } : { tipo: 'redirecionar', para: caminhoEm('/', desejado) + v.url.search };
}
