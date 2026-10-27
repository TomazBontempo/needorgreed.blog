/**
 * Textos de interface em português do Brasil (servido também para Portugal).
 * Mesmas chaves de src/i18n/en.ts; o TypeScript reclama se faltar alguma.
 */
import type { Dicionario } from './en';

const pt: Dicionario = {
  idioma: 'pt',
  locale: 'pt-BR',
  hreflang: 'pt-BR',

  site: {
    descricao: 'Críticas de jogos, séries, filmes e animes. Cada obra é um loot: Need, Greed ou Pass.',
  },

  hero: {
    titulo: 'Cada obra é um loot.',
    descricao1: 'Críticas de jogos, filmes, séries e animes.',
    descricao2: 'A raridade diz o quão boa é a obra, e o roll diz se vale seu tempo.',
    saibaMais: 'Saiba mais sobre nossas notas',
  },

  nav: {
    jogos: 'Jogos',
    telas: 'Telas',
    arquivo: 'Arquivo',
    sobre: 'Sobre',
    principal: 'Navegação principal',
    pularParaConteudo: 'Pular para o conteúdo',
  },

  seletor: {
    rotulo: 'Idioma',
    aria: 'Escolher o idioma do site',
  },

  nomesIdiomas: { en: 'inglês', pt: 'português', es: 'espanhol' },

  sugestao: {
    rotulo: 'Sugestão de idioma',
    texto: 'Esta página também está em português.',
    ir: 'Ler em português',
    ficar: (nome: string) => `Continuar em ${nome}`,
  },

  raridades: {
    lixo: { nome: 'Lixo', faixa: '0 a 2.9' },
    comum: { nome: 'Comum', faixa: '3 a 4.9' },
    incomum: { nome: 'Incomum', faixa: '5 a 6.9' },
    raro: { nome: 'Raro', faixa: '7 a 8.9' },
    epico: { nome: 'Épico', faixa: '9 a 9.9' },
    lendario: { nome: 'Lendário', faixa: '10' },
  },

  rolls: {
    need: { nome: 'Need', descricao: 'Vale agora, pelo preço cheio. Não espere.' },
    greed: { nome: 'Greed', descricao: 'É bom, com condição: espere promoção, só para fãs do gênero, ou custa muito tempo.' },
    pass: { nome: 'Pass', descricao: 'Não vale, nem com desconto ou de graça.' },
  },

  tipos: {
    jogo: 'Jogo',
    filme: 'Filme',
    serie: 'Série',
    anime: 'Anime',
  },

  log: {
    titulo: 'Loot log',
    rolou: 'rolou',
    para: 'para',
    rerolou: 're-rolou',
    entrou: 'entrou no grupo',
    vazio: 'Nada caiu ainda.',
    verTudo: 'Log completo',
    lido: 'lido',
  },

  /** Lido pelo leitor de tela em todo link que sai do blog (abre em nova guia). */
  links: {
    novaGuia: '(abre em nova guia)',
  },

  item: {
    numero: 'Nº',
    rotulo: 'Ficha do item',
  },

  review: {
    /** Contador de views: "view(s)" nas três línguas (decisão do Tomaz); o número abrevia com K. */
    views: { singular: 'view', plural: 'views', decimal: ',' },
    escritoPor: 'Escrito por',
    editadoPor: 'editado por',
    verDiscussao: (n: number) => (n === 1 ? 'Ver discussão (1 comentário)' : `Ver discussão (${n} comentários)`),
    verDiscussaoSemNumero: 'Ver discussão',
    discussaoEmBreve: 'Os comentários abrem em breve.',
    leitura: (min: number) => `${min} min de leitura`,
    destaque: 'Última crítica',
    abrir: 'Abrir review e comentários',
    abrirComContagem: (n: number) => `Abrir review e comentários (${n})`,
    janela: (titulo: string) => `Review mais recente: ${titulo}. Texto com rolagem.`,
    lerCompleta: 'Ler review completa',
    sumario: 'Nesta review',
    progresso: 'Progresso de leitura',
    lido: (pct: number) => `${pct}% lido`,
    veredito: 'Veredito',
    raridade: 'Raridade',
    roll: 'Roll',
    discussao: 'Discussão',
    tags: 'Tags',
    plataforma: 'Plataforma',
    duracao: 'Duração',
    traduzidoDe: {
      pt: 'Traduzido automaticamente do português.',
      en: 'Traduzido automaticamente do inglês.',
      es: 'Traduzido automaticamente do espanhol.',
    },
    verOriginal: 'Ler o original',
    semTraducao: {
      pt: 'Ainda sem tradução, mostrando o original em português.',
      en: 'Ainda sem tradução, mostrando o original em inglês.',
      es: 'Ainda sem tradução, mostrando o original em espanhol.',
    },
  },

  paginas: {
    jogos: 'Jogos',
    telas: 'Telas',
    jogosDescricao: 'Todos os jogos que caíram, do mais novo para o mais antigo.',
    telasDescricao: 'Filmes, séries e animes. Do mais novo para o mais antigo.',
    filtroTipo: 'Mostrar',
    filtroTodos: 'Todos',
    vazio: 'Nada caiu aqui ainda.',
    contagem: (n: number) => (n === 1 ? '1 review' : `${n} reviews`),
    raridades: 'Raridades',
    faixaNota: (faixa: string) => `Nota ${faixa}.`,
    arquivo: 'Arquivo',
    sobre: 'Sobre',
    raridade: 'Raridade',
    autor: 'Autor',
    maisLoot: 'Mais loot',
    verTodos: 'Todas as reviews',
    rerolar: 'Rolar de novo: embaralhar as fichas',
    rerolado: 'Novas fichas sorteadas.',
  },

  rodape: {
    assinatura: 'Rolado à mão. Nenhum loot patrocinado.',
    rss: 'Feed RSS',
    privacidade: 'Privacidade',
    contato: 'Contato',
  },

  erro404: {
    titulo: 'Nada caiu aqui',
    texto: 'Esta página deu despawn, ou nunca existiu.',
    linhaSistema: 'O sistema rolou Pass (0) para [esta página]',
    voltar: 'Voltar para o loot',
    arquivo: 'Procurar no arquivo',
  },

  autor: {
    reviews: 'Reviews',
    atividade: 'Atividade',
    github: 'GitHub',
    desde: (data: string) => `No grupo desde ${data}`,
  },

  arquivo: {
    descricao: 'Tudo que aconteceu no site, do mais novo para o mais antigo: reviews roladas, reviews re-roladas, autores novos.',
    filtros: 'Filtrar o log',
    evento: 'Evento',
    todos: 'Todos',
    reviews: 'Reviews',
    atualizacoes: 'Re-rolls',
    autores: 'Autores novos',
    roll: 'Roll',
    nenhum: 'Nenhum evento com esses filtros.',
    total: (n: number) => (n === 1 ? '1 evento' : `${n} eventos`),
  },

  sobre: {
    titulo: 'Como funciona o loot',
    intro:
      'Toda obra criticada aqui é tratada como um item que caiu numa raid de MMO. Ela recebe dois vereditos, e eles não são a mesma coisa: o quão boa ela é, e se vale o seu tempo agora.',
    raridadeTitulo: 'Raridade: o quão bom é',
    raridadeTexto:
      'Sai direto da nota, de 0 a 10 com uma casa decimal. A cor do nome do item mostra a raridade de longe, em qualquer lugar do site.',
    rollTitulo: 'Roll: vale agora?',
    rollTexto:
      'O roll é o veredito prático. Ele pesa preço, duração e para quem a obra é. Todo roll vem com o motivo numa linha, colado nele.',
    divergenciaTitulo: 'Os dois podem discordar, e a graça é essa',
    divergencias: {
      epicoGreed: 'Épico, mas Greed: excelente, mas é um grind de 100 horas para um nicho.',
      incomumNeed: 'Incomum, mas Need: curtinho, barato ou já está no serviço que você paga.',
      raroPass: 'Raro, mas Pass: bem feito, mas é remaster de algo que você joga mais barato.',
    },
    numeroTitulo: 'O número do roll',
    numeroTexto:
      'Em "Snufupugos rolou Need (94)", o número é a nota vezes dez. Ele sempre cai na faixa da raridade: 70 a 89 é Raro, 90 a 99 é Épico, 100 é Lendário.',
    logTitulo: 'O loot log',
    logTexto:
      'A coluna de mensagens de sistema registra o que acontece no site: uma review rolada, uma review re-rolada (editada), alguém novo entrando no grupo. O arquivo guarda o log inteiro.',
    traducaoTitulo: 'Três línguas',
    traducaoTexto:
      'As reviews são escritas em português, inglês ou espanhol, e as outras versões são traduzidas automaticamente, com um aviso no topo e o link para o original. Os comentários são os mesmos em todas as versões.',
    quemTitulo: 'Quem rola o dado',
    quemTexto: 'Cada review é assinada pela conta do GitHub que criou o arquivo. Ninguém escolhe a própria assinatura.',
    verRaridade: (nome: string) => `Todas as reviews de raridade ${nome}`,
    nota: 'Nota',
    numero: 'Número do roll',
    faixa: (de: number, ate: number) => `${de} a ${ate}`,
  },
  privacidade: {
    titulo: 'Privacidade',
    intro: 'O que o Need or Greed guarda sobre você, e por quê. É curto, porque guardamos pouco.',
    atualizado: 'Atualizado em 27 de outubro de 2026.',
    leitorTitulo: 'Quem só lê',
    leitorTexto: [
      'Ler o blog não pede nada. Não há anúncios, rastreadores nem cookies de análise.',
      'O site usa um cookie só, o lang, que lembra a língua que você escolheu. O seu navegador também anota, só no seu aparelho, quais reviews você já leu, para apagar a capa delas nas listas.',
      'O site roda na Cloudflare, que registra dados técnicos de cada acesso, como o endereço IP, para manter o site no ar e protegido contra ataques.',
      'Contamos quantas vezes cada review foi aberta, e só o número. Para não contar a mesma pessoa duas vezes seguidas, o servidor guarda por 30 minutos um código embaralhado do seu IP com o nome da review, que se apaga sozinho.',
    ],
    comentarioTitulo: 'Quem comenta',
    comentarioTexto: [
      'Para comentar, responder ou votar, você entra com uma conta do Google ou do Discord. Eles nos passam o seu nome, a sua foto e o seu e-mail. A sua senha nunca passa por aqui.',
      'Guardamos o nome e a foto, que aparecem ao lado dos seus comentários; o e-mail e o código da sua conta, para reconhecer você quando voltar; e o texto dos seus comentários e os seus votos. O e-mail não aparece para outros leitores, e não mandamos e-mail para você.',
      'Contra spam, guardamos também uma versão embaralhada do seu IP (um código que não volta a ser o IP) e o tipo de navegador. Os dois se apagam sozinhos em 7 dias.',
      'Ao entrar, o seu navegador guarda um cookie de sessão do servidor de comentários, que dura 30 dias.',
      'Os comentários são traduzidos automaticamente para as outras línguas do site pelo tradutor da Cloudflare (Workers AI), que recebe só o texto do comentário. Cada tradução aparece marcada, com o link para o original.',
    ],
    ondeTitulo: 'Onde ficam',
    ondeTexto: [
      'Os comentários ficam num banco de dados da Cloudflare, nos Estados Unidos. Não vendemos, não alugamos e não compartilhamos esses dados com ninguém, e não usamos para anúncios nem para treinar inteligência artificial.',
    ],
    apagarTitulo: 'Apagar os seus dados',
    apagarTexto: [
      'Você apaga os seus próprios comentários quando quiser, pelo link Apagar embaixo de cada um.',
      'Para apagar tudo (nome, foto, e-mail e conta), escreva para {email}. Respondemos em até 15 dias. Os seus comentários continuam no site sem o seu nome, para as conversas não perderem o sentido. Se algum deles identificar você, ou se preferir que sumam todos, apagamos o texto também.',
      'Pelo mesmo e-mail você pode pedir uma cópia dos seus dados ou corrigir alguma coisa.',
    ],
    quemTitulo: 'Quem responde por isso',
    quemTexto: [
      'O Need or Greed é um blog pessoal, sem empresa por trás, escrito por Snufupugos, que responde pelos dados descritos aqui. Contato: {email}.',
      'Se algo disso mudar, esta página muda junto, com a data lá em cima.',
    ],
  },
};

export default pt;
