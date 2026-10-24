/**
 * Componentes disponíveis dentro das reviews (.mdx), no painel e na IDE.
 * Cada um tem um bloco equivalente em keystatic.config.tsx.
 */
import YouTube from './YouTube.astro';
import Figure from './Figure.astro';
import Clipe from './Clipe.astro';
import Link from './Link.astro';

/** `a` troca todo link do texto: os de fora do blog abrem em nova guia. */
export const componentesMdx = { YouTube, Figure, Clipe, a: Link };
