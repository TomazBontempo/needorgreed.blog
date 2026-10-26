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
 * Comentários: Garrul (github.com/KingPin/Garrul), um Worker nosso na Cloudflare, separado do blog
 * (repositório TomazBontempo/needorgreed-comentarios). Login com Google e Discord.
 * Enquanto `api` estiver vazio, a área de comentários mostra só "Os comentários abrem em breve".
 */
export const COMENTARIOS = {
  /** Endereço do Worker dos comentários, sem barra no fim. */
  api: '',
};
