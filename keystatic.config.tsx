import { config, collection, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';
import { limparNome } from './src/lib/nomes-de-arquivo';

/**
 * Painel de escrita em /keystatic.
 *
 * Local (npm run dev): salva direto nos arquivos do seu computador.
 * Produção: login com GitHub; cada "Salvar" vira um commit no repositório
 * feito pela conta de quem está logado.
 */
const REPO = 'TomazBontempo/needorgreed.blog';

/**
 * Tudo de uma review fica na pasta dela (src/content/reviews/<slug>/):
 *   capa.jpg            a capa (o painel sempre chama de "capa")
 *   imagens/<nome>      imagens do texto
 *   videos/<nome>       clipes e o quadro de capa de cada clipe
 * O painel escreve os caminhos como ../<slug>/..., o único formato que ele reconhece ao reabrir.
 * No upload, o nome que o autor deu ao arquivo é mantido, só limpo (minúsculas, sem acento, hífens).
 */
const pastaDaReview = {
  directory: 'src/content/reviews',
  publicPath: '../',
};

const videos = {
  ...pastaDaReview,
  transformFilename: (nome: string) => `videos/${limparNome(nome)}`,
};

const imagensTexto = {
  ...pastaDaReview,
  transformFilename: (nome: string) => `imagens/${limparNome(nome)}`,
  schema: {
    alt: fields.text({
      label: 'Texto alternativo',
      description: 'Recomendado. Descreva o que a imagem mostra: é o que o leitor de tela lê e o que o Google usa.',
    }),
  },
};

/** Logo do painel: o d100 do site, dourado no escuro e num ouro mais fechado no claro. */
function MarcaD100({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  return (
    <svg viewBox="0 0 26 26" width="24" height="24" fill="none" stroke={colorScheme === 'dark' ? '#e3b45c' : '#9a7124'} strokeWidth="1.5" aria-hidden="true">
      <path d="M13 1.5 23.5 7.5v11L13 24.5 2.5 18.5v-11z" />
      <path d="M13 1.5v8M2.5 7.5 13 9.5l10.5-2M13 9.5 7 18.5h12zM2.5 18.5 7 18.5M23.5 18.5H19M13 24.5 7 18.5M13 24.5l6-6" />
    </svg>
  );
}

export default config({
  // PUBLIC_KEYSTATIC_STORAGE=github força o modo GitHub no dev (usado uma vez, no setup do GitHub App).
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: REPO }
      : { kind: 'local' },

  ui: {
    // O mesmo d100 de traço do header do site (placeholder até o logo definitivo).
    brand: { name: 'Need or Greed', mark: MarcaD100 },
    navigation: {
      Conteúdo: ['reviews'],
      Equipe: ['autores'],
    },
  },

  collections: {
    reviews: collection({
      label: 'Reviews',
      slugField: 'titulo',
      path: 'src/content/reviews/*/',
      format: { contentField: 'conteudo' },
      entryLayout: 'content',
      columns: ['titulo', 'data'],
      schema: {
        // A ordem aqui é a ordem da lateral do painel, em quatro grupos:
        // a obra, o veredito, a ficha do item e a publicação. (O Keystatic não tem título de seção.)

        // 1. A obra
        titulo: fields.slug({
          name: { label: 'Título da obra' },
          slug: {
            label: 'Slug',
            description: 'Endereço da review (/reviews/slug/). Não mude depois de publicar.',
          },
        }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Jogo', value: 'jogo' },
            { label: 'Filme', value: 'filme' },
            { label: 'Série', value: 'serie' },
            { label: 'Anime', value: 'anime' },
          ],
          defaultValue: 'jogo',
        }),
        plataforma: fields.text({ label: 'Plataforma', description: 'Onde jogou ou assistiu. Ex.: PC, Switch, Netflix.' }),
        duracao: fields.text({ label: 'Duração', description: 'Ex.: 40h, 2 temporadas, 1h52.' }),
        capa: fields.image({
          label: 'Capa',
          description: 'Obrigatória. É a imagem da ficha em todas as listagens.',
          validation: { isRequired: true },
          ...pastaDaReview,
        }),

        // 2. O veredito
        nota: fields.number({
          label: 'Nota (0 a 10)',
          description: 'Define a raridade: até 2.9 Lixo, 3 Comum, 5 Incomum, 7 Raro, 9 Épico, 10 Lendário.',
          step: 0.1,
          validation: { isRequired: true, min: 0, max: 10 },
        }),
        heranca: fields.checkbox({
          label: 'Herança',
          description: 'Obra da sua vida: fica fora da escala, sem raridade.',
          defaultValue: false,
        }),
        roll: fields.select({
          label: 'Roll',
          description: 'Need: vale agora, preço cheio. Greed: vale, com condição. Pass: não vale.',
          options: [
            { label: 'Need', value: 'need' },
            { label: 'Greed', value: 'greed' },
            { label: 'Pass', value: 'pass' },
          ],
          defaultValue: 'greed',
        }),
        motivoRoll: fields.text({
          label: 'Motivo do roll',
          description: 'Uma linha. Essencial no Greed. Ex.: Espere uma promoção.',
        }),

        // 3. A ficha do item
        frase: fields.text({
          label: 'Frase de efeito',
          description: 'Em itálico no pé da ficha, como texto de item.',
        }),
        atributos: fields.array(
          fields.object({
            nome: fields.text({ label: 'Atributo', description: 'Ex.: Nostalgia' }),
            valor: fields.text({ label: 'Valor', description: 'Ex.: +12 ou -4' }),
          }),
          {
            label: 'Atributos',
            description: 'Positivos em verde, negativos em vermelho.',
            itemLabel: (p) => `${p.fields.valor.value} ${p.fields.nome.value}`.trim() || 'Atributo',
          },
        ),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (p) => p.value || 'Tag',
        }),

        // 4. A publicação
        data: fields.date({ label: 'Data', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        idioma: fields.select({
          label: 'Idioma do texto',
          description: 'A língua em que você escreveu. As outras são traduzidas sozinhas.',
          options: [
            { label: 'Português', value: 'pt' },
            { label: 'Inglês', value: 'en' },
            { label: 'Espanhol', value: 'es' },
          ],
          defaultValue: 'pt',
        }),
        rascunho: fields.checkbox({
          label: 'Rascunho',
          description: 'Não aparece no site publicado.',
          defaultValue: false,
        }),

        conteudo: fields.mdx({
          label: 'Texto da crítica',
          options: { image: imagensTexto },
          components: {
            Figure: wrapper({
              label: 'Imagem com legenda',
              description: 'Insira a imagem dentro do bloco e escreva a legenda no campo abaixo.',
              schema: {
                legenda: fields.text({ label: 'Legenda' }),
              },
            }),
            Clipe: block({
              label: 'Clipe curto / GIF',
              description:
                'Vídeo curto em mp4 ou webm, toca sozinho e sem som, em loop. Máximo 25 MB. Vídeo longo: use o bloco do YouTube.',
              schema: {
                src: fields.file({
                  label: 'Vídeo (.mp4 ou .webm, até 25 MB)',
                  description: 'Acima de 25 MB o site não publica (limite da Cloudflare). GIF: converta para mp4 antes.',
                  validation: { isRequired: true },
                  ...videos,
                }),
                poster: fields.image({
                  label: 'Imagem de capa do clipe',
                  description: 'Aparece antes do vídeo carregar.',
                  ...videos,
                }),
                legenda: fields.text({ label: 'Legenda' }),
                descricao: fields.text({
                  label: 'Descrição para leitor de tela',
                  description: 'Recomendada. O que acontece no vídeo.',
                }),
              },
            }),
            YouTube: block({
              label: 'Vídeo do YouTube',
              schema: {
                id: fields.text({
                  label: 'ID do vídeo',
                  description: 'O código depois de v= no link. Ex.: dQw4w9WgXcQ',
                }),
                titulo: fields.text({
                  label: 'Título do vídeo',
                  description: 'Para leitor de tela. Ex.: Trailer de Outer Wilds',
                }),
              },
            }),
          },
        }),
      },
    }),

    autores: collection({
      label: 'Autores',
      slugField: 'nick',
      path: 'src/content/autores/*',
      format: 'json',
      schema: {
        nick: fields.slug({ name: { label: 'Nick no site' } }),
        github: fields.text({
          label: 'Login do GitHub',
          description: 'Exatamente como aparece no GitHub. É assim que o site sabe quem escreveu cada review.',
          validation: { isRequired: true },
        }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'src/assets/autores',
          publicPath: '../../assets/autores/',
        }),
        bio: fields.text({ label: 'Bio', multiline: true }),
      },
    }),
  },
});
