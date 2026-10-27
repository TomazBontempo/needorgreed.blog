/**
 * Descrição padrão das imagens do texto das reviews (decisão do Tomaz em 2026-10-27).
 * Imagem sem texto alternativo ganha "Imagem 2 de <título>" na língua da página, montado em
 * components/ImagemDoTexto.astro. O arquivo da review não muda: escrevendo uma descrição, ela vale.
 *
 * A posição vem da ordem das imagens no texto, casada pelo nome do arquivo (o Astro guarda o nome
 * original no endereço da imagem otimizada: "cabelo-anos-90-01.BZ2bfa14.png").
 */

/** Dados que a página da review (ou o destaque da home) deixa para as imagens do texto. */
export type ImagensDaPagina = { titulo: string; ordem: string[] };

/** "../slug/imagens/foto-01.png" ou "/_astro/foto-01.BZ2bfa14.png?w=1" -> "foto-01". */
export function radical(caminho: string): string {
  const arquivo = caminho.split('?')[0].split('/').pop() ?? '';
  const semExtensao = arquivo.replace(/\.[a-z0-9]+$/i, '');
  // Nome otimizado pelo Astro: "foto-01.BZ2bfa14" (o painel tira os pontos dos nomes, então o
  // único ponto que sobra é o do código do Astro).
  return semExtensao.replace(/\.[A-Za-z0-9_-]+$/, '');
}

/** Os nomes das imagens do texto, na ordem em que aparecem (sem repetir). */
export function ordemDasImagens(corpo: string): string[] {
  const nomes = [...corpo.matchAll(/!\[[^\]\n]*\]\(([^)\s]+)/g)].map((m) => radical(m[1]));
  return [...new Set(nomes)];
}
