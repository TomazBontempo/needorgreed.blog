import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Campos de uma review. Valem para o original e para a tradução.
 *
 * Não existe campo "autor": ele é descoberto pela conta do GitHub
 * que criou o arquivo (veja src/lib/autores.ts).
 */
const camposReview = ({ image }: SchemaContext) =>
  z.object({
    titulo: z.string(),
    tipo: z.enum(['jogo', 'filme', 'serie', 'anime']),
    nota: z.number().min(0).max(10),
    roll: z.enum(['need', 'greed', 'pass']),
    /** Uma linha explicando o roll. Opcional, mas essencial no Greed. */
    motivoRoll: z.string().optional(),
    data: z.coerce.date(),
    plataforma: z.string().optional(),
    duracao: z.string().optional(),
    /** Obrigatória: é a imagem da ficha em todas as listagens. Fica na pasta da review. */
    capa: image(),
    /** Frase de efeito em itálico no pé do tooltip. */
    frase: z.string().optional(),
    /** Atributos do item, ex.: { nome: "Nostalgia", valor: "+12" }. */
    atributos: z.array(z.object({ nome: z.string(), valor: z.string() })).default([]),
    tags: z.array(z.string()).default([]),
    rascunho: z.boolean().default(false),
    /** Língua em que o arquivo está escrito. No original, é a língua da review. */
    idioma: z.enum(['pt', 'en', 'es']).default('pt'),
  });

/**
 * Reviews: uma pasta por crítica, com index.mdx (ou index.md) dentro.
 *   src/content/reviews/outer-wilds/index.mdx
 * O id da review é o nome da pasta, e vira a URL /reviews/outer-wilds/.
 */
const reviews = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/reviews',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ''),
  }),
  schema: camposReview,
});

/**
 * Traduções geradas por `npm run translate`, ao lado do original:
 *   src/content/reviews/outer-wilds/index.en.mdx
 * O id é "<slug>/<idioma>", e `idioma` é a língua da tradução.
 */
const traducoes = defineCollection({
  loader: glob({
    pattern: '*/index.{pt,en,es}.mdx',
    base: './src/content/reviews',
    generateId: ({ entry }) => entry.replace(/\/index\.(pt|en|es)\.mdx$/, '/$1'),
  }),
  schema: (ctx) =>
    camposReview(ctx).extend({
      /** Hash do original quando foi traduzido. Se o original mudar, a tradução fica velha. */
      origemHash: z.string(),
      /** Revisada à mão: o script nunca sobrescreve. */
      revisado: z.boolean().default(false),
      /** Modelo que traduziu, só para referência. */
      modelo: z.string().optional(),
    }),
});

/**
 * Autores: um JSON por pessoa, ligando a conta do GitHub ao nick do site.
 *   src/content/autores/snufupugos.json
 */
const autores = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/autores' }),
  schema: ({ image }) =>
    z.object({
      nick: z.string(),
      github: z.string(),
      avatar: image().optional(),
      bio: z.string().optional(),
    }),
});

export const collections = { reviews, traducoes, autores };
