/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Título e ordem das imagens do texto da review renderizada, para a descrição padrão (ImagemDoTexto.astro). */
    nogImagensDoTexto?: import('./lib/imagens-do-texto').ImagensDaPagina;
  }
}
