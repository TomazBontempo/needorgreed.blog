// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import checagemDeMidia from './src/integrations/midia.ts';

// No dev, o painel salva arquivos no seu disco (Keystatic "local"), e isso precisa de Node.
// O runtime da Cloudflare não tem acesso a disco, então no dev usamos o adapter Node
// e o da Cloudflare só entra no build.
const emDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://needorgreed.blog',

  // O site inteiro é estático. Só o painel /keystatic e a rota de login
  // rodam sob demanda no Worker da Cloudflare.
  output: 'static',

  adapter: emDev
    ? node({ mode: 'standalone' })
    : cloudflare({
        // Imagens otimizadas no build (sharp), servidas como arquivo estático.
        imageService: 'compile',
        // O build roda em Node para poder consultar a API do GitHub.
        prerenderEnvironment: 'node',
      }),

  // Não usamos sessões do Astro; evita provisionar KV na Cloudflare.
  session: false,

  // Inglês na raiz, português em /pt/, espanhol em /es/. As páginas de cada idioma são geradas no build.
  // Quem escolhe o idioma do leitor é o Worker (src/worker.ts), nunca o Astro: por isso
  // nenhum redirecionamento automático aqui.
  i18n: {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },

  // Fontes baixadas no build e servidas pelo próprio site (sem request ao Google no leitor).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Big Shoulders',
      cssVariable: '--fonte-display',
      weights: [700, 800],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Literata',
      cssVariable: '--fonte-texto',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fragment Mono',
      cssVariable: '--fonte-mono',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  // checagemDeMidia: capa obrigatória, mídia na pasta da review, texto alternativo, 25 MB (src/integrations/midia.ts).
  integrations: [react(), mdx(), keystatic(), checagemDeMidia()],
});
