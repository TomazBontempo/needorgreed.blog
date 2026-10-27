/**
 * Componentes disponíveis dentro das reviews (.mdx), no painel e na IDE.
 * Cada um tem um bloco equivalente em keystatic.config.tsx.
 */
import YouTube from './YouTube.astro';
import Figure from './Figure.astro';
import Clipe from './Clipe.astro';
import Link from './Link.astro';
import TituloDoTexto from './TituloDoTexto.astro';
import ImagemDoTexto from './ImagemDoTexto.astro';

/**
 * `a` troca todo link do texto: os de fora do blog abrem em nova guia.
 * `h1` vira h2: o único h1 da página é o título da obra (o painel deixa escrever "#" no texto).
 * `img` ganha a descrição padrão quando o autor não escreveu texto alternativo (ImagemDoTexto).
 */
export const componentesMdx = { YouTube, Figure, Clipe, a: Link, h1: TituloDoTexto, img: ImagemDoTexto };
