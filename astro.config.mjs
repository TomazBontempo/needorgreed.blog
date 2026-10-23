// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';

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

  integrations: [react(), mdx(), keystatic()],
});
