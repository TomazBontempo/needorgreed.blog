/**
 * Textos de interface em espanhol neutro da América Latina (es-419).
 * Mesmas chaves de src/i18n/en.ts; o TypeScript reclama se faltar alguma.
 * Sem vosotros nem regionalismos da Espanha.
 */
import type { Dicionario } from './en';

const es: Dicionario = {
  idioma: 'es',
  locale: 'es-419',
  // hreflang só aceita país de duas letras como região; "es" atende todos os hispanofalantes.
  hreflang: 'es',

  site: {
    descricao: 'Reseñas de juegos, películas, series y anime. Cada obra es un loot: Need, Greed o Pass.',
  },

  hero: {
    titulo: 'Cada obra es un loot.',
    descricao1: 'Reseñas de juegos, películas, series y anime.',
    descricao2: 'La rareza dice qué tan buena es la obra, y el roll dice si vale tu tiempo.',
    saibaMais: 'Más sobre nuestras notas',
  },

  nav: {
    jogos: 'Juegos',
    telas: 'Pantallas',
    arquivo: 'Archivo',
    sobre: 'Acerca',
    principal: 'Navegación principal',
    pularParaConteudo: 'Saltar al contenido',
  },

  seletor: {
    rotulo: 'Idioma',
    aria: 'Elegir el idioma del sitio',
  },

  nomesIdiomas: { en: 'inglés', pt: 'portugués', es: 'español' },

  sugestao: {
    rotulo: 'Sugerencia de idioma',
    texto: 'Esta página también está en español.',
    ir: 'Leer en español',
    ficar: (nome: string) => `Seguir en ${nome}`,
  },

  raridades: {
    lixo: { nome: 'Basura de vendedor', faixa: '0 a 2.9' },
    comum: { nome: 'Común', faixa: '3 a 4.9' },
    incomum: { nome: 'Poco común', faixa: '5 a 6.9' },
    raro: { nome: 'Raro', faixa: '7 a 8.9' },
    epico: { nome: 'Épico', faixa: '9 a 9.9' },
    lendario: { nome: 'Legendario', faixa: '10' },
  },

  rolls: {
    need: { nome: 'Need', descricao: 'Vale ahora, a precio completo. No esperes.' },
    greed: { nome: 'Greed', descricao: 'Es bueno, con condiciones: espera una oferta, solo para fans del género, o pide mucho tiempo.' },
    pass: { nome: 'Pass', descricao: 'No vale la pena, ni con descuento ni gratis.' },
  },

  tipos: {
    jogo: 'Juego',
    filme: 'Película',
    serie: 'Serie',
    anime: 'Anime',
  },

  log: {
    titulo: 'Loot log',
    rolou: 'tiró',
    para: 'por',
    rerolou: 're-tiró',
    entrou: 'se unió al grupo',
    vazio: 'Todavía no cayó nada.',
    verTudo: 'Log completo',
    lido: 'leído',
  },

  /** Lido pelo leitor de tela em todo link que sai do blog (abre em nova guia). */
  links: {
    novaGuia: '(se abre en una pestaña nueva)',
  },

  item: {
    numero: 'N.º',
    rotulo: 'Ficha del objeto',
  },

  review: {
    escritoPor: 'Escrito por',
    editadoPor: 'editado por',
    verDiscussao: (n: number) => (n === 1 ? 'Ver discusión (1 comentario)' : `Ver discusión (${n} comentarios)`),
    verDiscussaoSemNumero: 'Ver discusión',
    discussaoEmBreve: 'Los comentarios abren pronto.',
    leitura: (min: number) => `${min} min de lectura`,
    destaque: 'Última reseña',
    abrir: 'Abrir reseña y comentarios',
    abrirComContagem: (n: number) => `Abrir reseña y comentarios (${n})`,
    janela: (titulo: string) => `Última reseña: ${titulo}. Texto con desplazamiento.`,
    lerCompleta: 'Leer la reseña completa',
    sumario: 'En esta reseña',
    progresso: 'Progreso de lectura',
    lido: (pct: number) => `${pct}% leído`,
    veredito: 'Veredicto',
    raridade: 'Rareza',
    roll: 'Roll',
    discussao: 'Discusión',
    tags: 'Etiquetas',
    plataforma: 'Plataforma',
    duracao: 'Duración',
    traduzidoDe: {
      pt: 'Traducido automáticamente del portugués.',
      en: 'Traducido automáticamente del inglés.',
      es: 'Traducido automáticamente del español.',
    },
    verOriginal: 'Leer el original',
    semTraducao: {
      pt: 'Todavía sin traducción, mostrando el original en portugués.',
      en: 'Todavía sin traducción, mostrando el original en inglés.',
      es: 'Todavía sin traducción, mostrando el original en español.',
    },
  },

  paginas: {
    jogos: 'Juegos',
    telas: 'Pantallas',
    jogosDescricao: 'Todos los juegos que cayeron, del más nuevo al más viejo.',
    telasDescricao: 'Películas, series y anime. Del más nuevo al más viejo.',
    filtroTipo: 'Mostrar',
    filtroTodos: 'Todos',
    vazio: 'Todavía no cayó nada aquí.',
    contagem: (n: number) => (n === 1 ? '1 reseña' : `${n} reseñas`),
    raridades: 'Rarezas',
    faixaNota: (faixa: string) => `Nota ${faixa}.`,
    arquivo: 'Archivo',
    sobre: 'Acerca',
    raridade: 'Rareza',
    autor: 'Autor',
    maisLoot: 'Más loot',
    verTodos: 'Todas las reseñas',
    rerolar: 'Tirar de nuevo: mezclar las fichas',
    rerolado: 'Nuevas fichas sorteadas.',
  },

  rodape: {
    assinatura: 'Tirado a mano. Ningún loot patrocinado.',
    rss: 'Feed RSS',
  },

  erro404: {
    titulo: 'Aquí no cayó nada',
    texto: 'Esta página hizo despawn, o nunca existió.',
    linhaSistema: 'El sistema tiró Pass (0) por [esta página]',
    voltar: 'Volver al loot',
    arquivo: 'Buscar en el archivo',
  },

  autor: {
    reviews: 'Reseñas',
    atividade: 'Actividad',
    github: 'GitHub',
    desde: (data: string) => `En el grupo desde ${data}`,
  },

  arquivo: {
    descricao: 'Todo lo que pasó en el sitio, del más nuevo al más viejo: reseñas tiradas, reseñas re-tiradas, autores nuevos.',
    filtros: 'Filtrar el log',
    evento: 'Evento',
    todos: 'Todos',
    reviews: 'Reseñas',
    atualizacoes: 'Re-rolls',
    autores: 'Autores nuevos',
    roll: 'Roll',
    nenhum: 'Ningún evento coincide con estos filtros.',
    total: (n: number) => (n === 1 ? '1 evento' : `${n} eventos`),
  },

  sobre: {
    titulo: 'Cómo funciona el loot',
    intro:
      'Cada obra reseñada aquí se trata como un objeto que cayó en una raid de MMO. Recibe dos veredictos, y no son lo mismo: qué tan buena es, y si vale tu tiempo ahora.',
    raridadeTitulo: 'Rareza: qué tan bueno es',
    raridadeTexto:
      'Sale directo de la nota, de 0 a 10 con un decimal. El color del nombre del objeto te dice la rareza de un vistazo, en cualquier parte del sitio.',
    rollTitulo: 'Roll: ¿vale la pena ahora?',
    rollTexto:
      'El roll es el veredicto práctico. Pesa el precio, la duración y para quién es la obra. Cada roll viene con el motivo en una línea, pegado a él.',
    divergenciaTitulo: 'Los dos pueden no estar de acuerdo, y esa es la gracia',
    divergencias: {
      epicoGreed: 'Épico, pero Greed: excelente, pero es un grind de 100 horas para un nicho.',
      incomumNeed: 'Poco común, pero Need: cortito, barato o ya está en un servicio que pagas.',
      raroPass: 'Raro, pero Pass: bien hecho, pero es un remaster de algo que puedes jugar más barato.',
    },
    numeroTitulo: 'El número del roll',
    numeroTexto:
      'En "Snufupugos tiró Need (94)", el número es la nota por diez. Siempre cae dentro del rango de la rareza: de 70 a 89 es Raro, de 90 a 99 es Épico, 100 es Legendario.',
    logTitulo: 'El loot log',
    logTexto:
      'La columna de mensajes del sistema registra lo que pasa en el sitio: una reseña tirada, una reseña re-tirada (editada), alguien nuevo que se une al grupo. El archivo guarda el log completo.',
    traducaoTitulo: 'Tres idiomas',
    traducaoTexto:
      'Las reseñas se escriben en inglés, portugués o español, y las otras versiones se traducen automáticamente, con un aviso arriba y un enlace al original. Los comentarios son los mismos en todas las versiones.',
    quemTitulo: 'Quién tira los dados',
    quemTexto: 'Cada reseña la firma la cuenta de GitHub que la creó. Nadie elige su propia firma.',
    verRaridade: (nome: string) => `Todas las reseñas de rareza ${nome}`,
    nota: 'Nota',
    numero: 'Número del roll',
    faixa: (de: number, ate: number) => `${de} a ${ate}`,
  },
};

export default es;
