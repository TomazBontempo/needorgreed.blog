/**
 * Nomes de arquivo de mídia das reviews.
 * Usado pelo painel (renomeia no upload) e pelo build (avisa sobre nomes genéricos).
 * Sem nada do Astro: o keystatic.config.tsx também importa daqui.
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

/**
 * Nome que parece de câmera, print ou "imagem1": funciona, mas não diz o que a imagem mostra
 * (o Google recomenda nomes descritivos). O build só avisa, não bloqueia.
 */
export function nomeGenerico(arquivo: string): boolean {
  const base = arquivo.replace(/\.[^.]+$/, '').toLowerCase();
  return (
    /^(img|image|imagem|photo|foto|pic|dsc|dscn|dscf|pxl|mvimg|vid|video|clip|clipe|screenshot|screen-shot|captura-de-tela|captura|print|whatsapp-image|whatsapp-video|untitled|sem-titulo|arquivo|download)([-_ ]?\d.*)?$/.test(base) ||
    /^[\d_-]+$/.test(base)
  );
}
