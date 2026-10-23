import { config, collection, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

/**
 * Painel de escrita em /keystatic.
 *
 * Local (npm run dev): salva direto nos arquivos do seu computador.
 * Produção: login com GitHub; cada "Salvar" vira um commit no repositório
 * feito pela conta de quem está logado.
 */
const REPO = 'TomazBontempo/needorgreed';

const imagensReviews = {
  directory: 'src/assets/reviews',
  // Caminho relativo a partir de src/content/reviews/<slug>/index.mdx
  publicPath: '../../../assets/reviews/',
};

export default config({
  // PUBLIC_KEYSTATIC_STORAGE=github força o modo GitHub no dev (usado uma vez, no setup do GitHub App).
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: REPO }
      : { kind: 'local' },

  ui: {
    brand: { name: 'Need or Greed' },
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
        titulo: fields.slug({ name: { label: 'Título da obra' } }),
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
        nota: fields.number({
          label: 'Nota (0 a 10)',
          description: 'Define a raridade: 0-2.9 Lixo, 3 Comum, 5 Incomum, 7 Raro, 9 Épico, 10 Lendário.',
          step: 0.1,
          validation: { isRequired: true, min: 0, max: 10 },
        }),
        heranca: fields.checkbox({
          label: 'Herança',
          description: 'Obra da sua vida. Fica fora da escala de raridade.',
          defaultValue: false,
        }),
        roll: fields.select({
          label: 'Roll',
          options: [
            { label: 'Need: jogue/assista agora', value: 'need' },
            { label: 'Greed: vale, mas sem pressa', value: 'greed' },
            { label: 'Pass: deixa passar', value: 'pass' },
          ],
          defaultValue: 'greed',
        }),
        data: fields.date({ label: 'Data', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        plataforma: fields.text({ label: 'Plataforma / onde assistiu', description: 'Ex.: PC, Switch, Netflix, Crunchyroll' }),
        duracao: fields.text({ label: 'Duração', description: 'Ex.: 40h, 2 temporadas, 1h52' }),
        capa: fields.image({ label: 'Capa', ...imagensReviews }),
        frase: fields.text({
          label: 'Frase de efeito',
          description: 'Aparece em itálico no pé do tooltip, como texto de item.',
        }),
        atributos: fields.array(
          fields.object({
            nome: fields.text({ label: 'Atributo', description: 'Ex.: Nostalgia' }),
            valor: fields.text({ label: 'Valor', description: 'Ex.: +12' }),
          }),
          {
            label: 'Atributos do item',
            itemLabel: (p) => `${p.fields.valor.value} ${p.fields.nome.value}`.trim() || 'Atributo',
          },
        ),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (p) => p.value || 'Tag',
        }),
        rascunho: fields.checkbox({
          label: 'Rascunho',
          description: 'Rascunhos não aparecem no site publicado.',
          defaultValue: false,
        }),
        conteudo: fields.mdx({
          label: 'Texto da crítica',
          options: { image: imagensReviews },
          components: {
            YouTube: block({
              label: 'Vídeo do YouTube',
              schema: {
                id: fields.text({
                  label: 'ID do vídeo',
                  description: 'O código depois de v= no link. Ex.: dQw4w9WgXcQ',
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
