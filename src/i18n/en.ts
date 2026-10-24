/**
 * Textos de interface em inglês. É o idioma padrão e define o formato do dicionário:
 * src/i18n/pt.ts e src/i18n/es.ts precisam ter exatamente as mesmas chaves.
 */
const en = {
  idioma: 'en',
  /** Locale usado em datas e números. */
  locale: 'en-US',
  /** Valor do atributo hreflang. */
  hreflang: 'en',

  site: {
    descricao: 'Reviews of games, films, series and anime. Every work is a loot drop: Need, Greed or Pass.',
  },

  hero: {
    titulo: 'Every work is a loot drop.',
    descricao1: 'Reviews of games, films, series and anime.',
    descricao2: 'Rarity says how good the work is, and the roll says if it is worth your time.',
    saibaMais: 'More about our ratings',
  },

  nav: {
    jogos: 'Games',
    telas: 'Screens',
    arquivo: 'Archive',
    sobre: 'About',
    principal: 'Main navigation',
    pularParaConteudo: 'Skip to content',
  },

  seletor: {
    rotulo: 'Language',
    aria: 'Choose the site language',
  },

  /** Nome de cada língua, escrito nesta língua (usado na faixa de sugestão). */
  nomesIdiomas: { en: 'English', pt: 'Portuguese', es: 'Spanish' },

  /** Faixa de sugestão: escrita na língua sugerida, para quem lê essa língua. */
  sugestao: {
    rotulo: 'Language suggestion',
    texto: 'This page is also available in English.',
    ir: 'Read in English',
    ficar: (nome: string) => `Stay in ${nome}`,
  },

  raridades: {
    lixo: { nome: 'Vendor Trash', faixa: '0 to 2.9' },
    comum: { nome: 'Common', faixa: '3 to 4.9' },
    incomum: { nome: 'Uncommon', faixa: '5 to 6.9' },
    raro: { nome: 'Rare', faixa: '7 to 8.9' },
    epico: { nome: 'Epic', faixa: '9 to 9.9' },
    lendario: { nome: 'Legendary', faixa: '10' },
  },

  rolls: {
    need: { nome: 'Need', descricao: 'Worth it now, at full price. Do not wait.' },
    greed: { nome: 'Greed', descricao: 'Good, with a catch: wait for a sale, genre fans only, or a big time cost.' },
    pass: { nome: 'Pass', descricao: 'Not worth it, not even discounted or free.' },
  },

  tipos: {
    jogo: 'Game',
    filme: 'Film',
    serie: 'Series',
    anime: 'Anime',
  },

  log: {
    titulo: 'Loot log',
    // "Snufupugos rolled Need (94) for [Outer Wilds]". A ordem é a mesma nas três línguas.
    rolou: 'rolled',
    para: 'for',
    rerolou: 're-rolled',
    entrou: 'joined the party',
    vazio: 'Nothing dropped yet.',
    verTudo: 'Full log',
    lido: 'read',
  },

  /** Lido pelo leitor de tela em todo link que sai do blog (abre em nova guia). */
  links: {
    novaGuia: '(opens in a new tab)',
  },

  item: {
    numero: 'No.',
    rotulo: 'Item card',
  },

  review: {
    escritoPor: 'Written by',
    editadoPor: 'edited by',
    verDiscussao: (n: number) => (n === 1 ? 'See discussion (1 comment)' : `See discussion (${n} comments)`),
    verDiscussaoSemNumero: 'See discussion',
    discussaoEmBreve: 'Comments open soon.',
    leitura: (min: number) => `${min} min read`,
    destaque: 'Latest review',
    abrir: 'Open review and comments',
    abrirComContagem: (n: number) => `Open review and comments (${n})`,
    janela: (titulo: string) => `Latest review: ${titulo}. Scrollable text.`,
    lerCompleta: 'Read full review',
    sumario: 'In this review',
    progresso: 'Reading progress',
    lido: (pct: number) => `${pct}% read`,
    veredito: 'Verdict',
    raridade: 'Rarity',
    roll: 'Roll',
    discussao: 'Discussion',
    tags: 'Tags',
    plataforma: 'Platform',
    duracao: 'Length',
    traduzidoDe: {
      pt: 'Machine translated from Portuguese.',
      en: 'Machine translated from English.',
      es: 'Machine translated from Spanish.',
    },
    verOriginal: 'Read the original',
    semTraducao: {
      pt: 'Not translated yet, showing the Portuguese original.',
      en: 'Not translated yet, showing the English original.',
      es: 'Not translated yet, showing the Spanish original.',
    },
  },

  paginas: {
    jogos: 'Games',
    telas: 'Screens',
    jogosDescricao: 'Every game that dropped, newest first.',
    telasDescricao: 'Films, series and anime. Newest first.',
    filtroTipo: 'Show',
    filtroTodos: 'All',
    vazio: 'Nothing dropped here yet.',
    contagem: (n: number) => (n === 1 ? '1 review' : `${n} reviews`),
    raridades: 'Rarities',
    faixaNota: (faixa: string) => `Score ${faixa}.`,
    arquivo: 'Archive',
    sobre: 'About',
    raridade: 'Rarity',
    autor: 'Author',
    maisLoot: 'More loot',
    verTodos: 'All reviews',
    rerolar: 'Reroll: shuffle the cards',
    carrossel: 'Latest reviews',
    posicao: (i: number, n: number) => `${i} of ${n}`,
    rerolado: 'New cards drawn.',
  },

  rodape: {
    assinatura: 'Rolled by hand. No sponsored drops.',
    rss: 'RSS feed',
  },

  erro404: {
    titulo: 'Nothing dropped here',
    texto: 'This page despawned, or never existed.',
    linhaSistema: 'The system rolled Pass (0) for [this page]',
    voltar: 'Back to the loot',
    arquivo: 'Search the archive',
  },

  autor: {
    reviews: 'Reviews',
    atividade: 'Activity',
    github: 'GitHub',
    desde: (data: string) => `In the party since ${data}`,
  },

  arquivo: {
    descricao: 'Everything that happened on the site, newest first: reviews rolled, reviews re-rolled, new authors.',
    filtros: 'Filter the log',
    evento: 'Event',
    todos: 'All',
    reviews: 'Reviews',
    atualizacoes: 'Re-rolls',
    autores: 'New authors',
    roll: 'Roll',
    nenhum: 'No event matches these filters.',
    total: (n: number) => (n === 1 ? '1 event' : `${n} events`),
  },

  sobre: {
    titulo: 'How the loot works',
    intro:
      'Every work reviewed here is treated like an item that dropped in an MMO raid. It gets two verdicts, and they are not the same thing: how good it is, and whether it is worth your time right now.',
    glossarioTitulo: 'Glossary',
    /** Só os termos que o resto da página não explica, na ordem em que aparecem. */
    glossario: {
      linha: { termo: 'Roll line', definicao: 'The signature of every review: Snufupugos rolled Need (94) for [Outer Wilds].' },
      ficha: { termo: 'Item card', definicao: 'The card for each work: cover, collection number, rarity, roll and a one-liner.' },
      d100: { termo: 'd100', definicao: 'The die next to More loot. Click it to roll a new set of cards.' },
    },
    raridadeTitulo: 'Rarity: how good it is',
    raridadeTexto:
      'Comes straight from the score, 0 to 10 with one decimal. The colour of the item name tells you the rarity at a glance, anywhere on the site.',
    rollTitulo: 'Roll: is it worth it now?',
    rollTexto:
      'The roll is the practical verdict. It weighs price, length and who the work is for. Every roll comes with a one-line reason right next to it.',
    divergenciaTitulo: 'The two can disagree, and that is the point',
    divergencias: {
      epicoGreed: 'Epic, but Greed: excellent, but a 100-hour grind for a niche audience.',
      incomumNeed: 'Uncommon, but Need: short, cheap or already on a service you pay for.',
      raroPass: 'Rare, but Pass: well made, but a remaster of something you can play for less.',
    },
    numeroTitulo: 'The number in the roll',
    numeroTexto:
      'In "Snufupugos rolled Need (94)", the number is the score times ten. It always falls inside the rarity band: 70 to 89 is Rare, 90 to 99 is Epic, 100 is Legendary.',
    logTitulo: 'The loot log',
    logTexto:
      'The column of system messages records what happens on the site: a review rolled, a review re-rolled (edited), someone new joining the party. The archive keeps the full log.',
    traducaoTitulo: 'Three languages',
    traducaoTexto:
      'Reviews are written in English, Portuguese or Spanish, and the other versions are machine translated, with a note at the top and a link to the original. Comments are shared between all versions.',
    quemTitulo: 'Who rolls the dice',
    quemTexto: 'Each review is signed by the GitHub account that created it. Nobody gets to pick their own byline.',
    verRaridade: (nome: string) => `All ${nome} reviews`,
    nota: 'Score',
    numero: 'Roll number',
    faixa: (de: number, ate: number) => `${de} to ${ate}`,
  },
} as const;

/** Formato de um dicionário: as mesmas chaves, qualquer texto. */
type Generalizar<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : { -readonly [K in keyof T]: Generalizar<T[K]> };

export type Dicionario = Generalizar<typeof en>;

export default en satisfies Dicionario;
