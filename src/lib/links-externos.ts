/**
 * Links para fora do blog abrem em nova guia (regra do Tomaz: o leitor não sai do Need or Greed).
 * Usado pelo componente Link (todo link do texto das reviews) e por links externos escritos à mão.
 *
 *   target="_blank"              o leitor não sai do Need or Greed
 *   rel="noopener noreferrer"    a página aberta não consegue controlar a nossa (segurança)
 *   aria-describedby             leitor de tela ouve "(abre em nova guia)" (texto em src/layouts/Base.astro)
 *
 * "Fora do blog" é qualquer http(s) que não seja needorgreed.blog nem needorgreed.com.br.
 * Links internos (/reviews/..., #ancoras) não mudam.
 */

const NOSSOS_DOMINIOS = ['needorgreed.blog', 'needorgreed.com.br'];

/** Atributos de um link externo. O rel vem à parte, de relCom(), para somar com outros valores (ex.: "me"). */
export const ATRIBUTOS_LINK_EXTERNO = {
  target: '_blank',
  'aria-describedby': 'aviso-nova-guia',
} as const;

/** Junta valores de rel sem repetir: relCom('me') -> "me noopener noreferrer". */
export function relCom(...extras: string[]): string {
  return [...new Set([...extras, 'noopener', 'noreferrer'])].join(' ');
}

export function ehExterno(href: unknown): boolean {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false;
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return !NOSSOS_DOMINIOS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}
