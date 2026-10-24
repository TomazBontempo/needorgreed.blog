/**
 * Nomes de arquivo de mídia das reviews: o painel limpa o nome no upload.
 * Não há regra de nome (decisão do Tomaz em 2026-10-24, ver ESTADO.md, "Para rever no futuro").
 * Sem nada do Astro: o keystatic.config.tsx importa daqui.
 */

/**
 * O nome que o autor deu, limpo para virar endereço web, como o WordPress faz:
 * minúsculas, sem acentos, hífen no lugar de espaços e símbolos.
 *   "Chefe Final (versão 2).PNG" -> "chefe-final-versao-2.png"
 */
export function limparNome(original: string): string {
  const ponto = original.lastIndexOf('.');
  const base = ponto > 0 ? original.slice(0, ponto) : original;
  const extensao = ponto > 0 ? original.slice(ponto + 1).toLowerCase() : '';
  const limpo =
    base
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'arquivo';
  return extensao ? `${limpo}.${extensao}` : limpo;
}
