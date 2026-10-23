/**
 * Configurações gerais do Need or Greed.
 * Tudo que é "dado do site" e não muda por review mora aqui.
 */
export const SITE = {
  nome: 'Need or Greed',
  descricao: 'Críticas de jogos, séries, filmes e animes. Cada obra é um loot: Need, Greed ou Pass.',
  url: 'https://needorgreed.blog',
  idioma: 'pt-BR',

  /** Repositório usado para descobrir o autor de cada review (owner/repo). */
  repo: 'TomazBontempo/needorgreed',

  /** Autor usado quando não dá para descobrir quem criou o arquivo (ex.: dev local sem git). */
  autorPadrao: 'TomazBontempo',
};

/**
 * Comentários via Giscus (GitHub Discussions).
 * Gere os valores em https://giscus.app depois de ativar Discussions no repositório.
 * Enquanto repoId estiver vazio, a área de comentários não aparece.
 */
export const GISCUS = {
  repo: 'TomazBontempo/needorgreed',
  repoId: '',
  category: 'Comentários',
  categoryId: '',
  mapping: 'pathname',
  lang: 'pt',
  theme: 'dark_dimmed',
};
