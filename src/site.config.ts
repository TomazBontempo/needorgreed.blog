/**
 * Configurações gerais do Need or Greed.
 * Tudo que é "dado do site" e não muda por review mora aqui.
 */
export const SITE = {
  nome: 'Need or Greed',
  url: 'https://needorgreed.blog',

  /** Repositório usado para descobrir o autor de cada review (owner/repo). */
  repo: 'TomazBontempo/needorgreed.blog',

  /** Autor usado quando não dá para descobrir quem criou o arquivo (ex.: dev local sem git). */
  autorPadrao: 'TomazBontempo',
};

/**
 * Comentários via Giscus (GitHub Discussions).
 * Gere os valores em https://giscus.app depois de ativar Discussions no repositório.
 * Enquanto repoId estiver vazio, a área de comentários não aparece.
 */
export const GISCUS = {
  repo: 'TomazBontempo/needorgreed.blog',
  repoId: '',
  category: 'Comentários',
  categoryId: '',
  // Mapeia pelo slug da review, não pela URL: /reviews/x/ e /pt/reviews/x/ dividem a mesma discussão.
  mapping: 'specific',
  theme: 'dark_dimmed',
};
