import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Reviews: uma pasta por crítica, com index.mdx (ou index.md) dentro.
 *   src/content/reviews/outer-wilds/index.mdx
 * O id da review é o nome da pasta, e vira a URL /reviews/outer-wilds.
 *
 * Não existe campo "autor": ele é descoberto pela conta do GitHub
 * que criou o arquivo (veja src/lib/autores.ts).
 */
const reviews = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/reviews',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      tipo: z.enum(['jogo', 'filme', 'serie', 'anime']),
      nota: z.number().min(0).max(10),
      heranca: z.boolean().default(false),
      roll: z.enum(['need', 'greed', 'pass']),
      data: z.coerce.date(),
      plataforma: z.string().optional(),
      duracao: z.string().optional(),
      capa: image().optional(),
      /** Frase de efeito em itálico no pé do tooltip. */
      frase: z.string().optional(),
      /** Atributos do item, ex.: { nome: "Nostalgia", valor: "+12" }. */
      atributos: z
        .array(z.object({ nome: z.string(), valor: z.string() }))
        .default([]),
      tags: z.array(z.string()).default([]),
      rascunho: z.boolean().default(false),
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

export const collections = { reviews, autores };
