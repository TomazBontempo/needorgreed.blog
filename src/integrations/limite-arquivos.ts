/**
 * Checagens de mídia antes de publicar.
 *
 * 1. Tamanho: a Cloudflare Workers aceita no máximo 25 MiB por arquivo estático (plano Free e pago).
 * Um vídeo maior que isso faz o deploy falhar com um erro difícil de entender, então
 * checamos antes:
 *  - no dev, avisa no terminal;
 *  - no build, para com uma mensagem clara (vale para o build da Cloudflare depois do Salvar no painel).
 * Olha public/ (onde ficam os vídeos) e, no fim do build, tudo que vai ser publicado.
 *
 * 2. Imagem estragada: o painel só entende imagens escritas como ../<slug>/foto.jpg. Se uma review
 *    com ./foto.jpg (escrita na IDE) for salva pelo painel, a linha vira texto escapado
 *    (!\[...]\(./foto.jpg)) e a imagem some do site sem erro nenhum. Aqui isso vira erro claro.
 */
import type { AstroIntegration } from 'astro';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LIMITE_BYTES = 25 * 1024 * 1024;

function grandes(pasta: string): Array<{ caminho: string; bytes: number }> {
  const achados: Array<{ caminho: string; bytes: number }> = [];
  const andar = (dir: string) => {
    let itens: string[];
    try {
      itens = readdirSync(dir);
    } catch {
      return;
    }
    for (const nome of itens) {
      const caminho = join(dir, nome);
      const info = statSync(caminho);
      if (info.isDirectory()) andar(caminho);
      else if (info.size > LIMITE_BYTES) achados.push({ caminho, bytes: info.size });
    }
  };
  andar(pasta);
  return achados;
}

function mensagem(raiz: string, lista: Array<{ caminho: string; bytes: number }>): string {
  const linhas = lista.map(
    (a) => `  - ${relative(raiz, a.caminho)}: ${(a.bytes / 1024 / 1024).toFixed(1)} MB`,
  );
  return [
    'Arquivo grande demais para publicar na Cloudflare Workers (limite: 25 MB por arquivo):',
    ...linhas,
    'Comprima o clipe (ex.: ffmpeg -i entrada.mp4 -vf scale=1280:-2 -crf 28 -an saida.mp4)',
    'ou, se for um vídeo longo, suba no YouTube e use <YouTube id="..." />.',
  ].join('\n');
}

/** Linhas de review com imagem que o painel escapou. */
function imagensEscapadas(pasta: string): string[] {
  const achados: string[] = [];
  let slugs: string[] = [];
  try {
    slugs = readdirSync(pasta);
  } catch {
    return achados;
  }
  for (const slug of slugs) {
    let arquivos: string[] = [];
    try {
      arquivos = readdirSync(join(pasta, slug)).filter((a) => /\.mdx?$/.test(a));
    } catch {
      continue;
    }
    for (const arquivo of arquivos) {
      readFileSync(join(pasta, slug, arquivo), 'utf8')
        .split('\n')
        .forEach((linha, i) => {
          if (/!\\\[/.test(linha)) achados.push(`  - ${slug}/${arquivo}, linha ${i + 1}: ${linha.trim().slice(0, 90)}`);
        });
    }
  }
  return achados;
}

export default function limiteDeArquivos(): AstroIntegration {
  let raiz = '';
  return {
    name: 'needorgreed:limite-arquivos',
    hooks: {
      'astro:config:setup': ({ config, command, logger }) => {
        raiz = fileURLToPath(config.root);
        const problemas: string[] = [];

        const lista = grandes(fileURLToPath(config.publicDir));
        if (lista.length) problemas.push(mensagem(raiz, lista));

        const escapadas = imagensEscapadas(join(raiz, 'src/content/reviews'));
        if (escapadas.length) {
          problemas.push(
            [
              'Imagem estragada numa review (provavelmente salva pelo painel com um caminho ./foto.jpg):',
              ...escapadas,
              'Troque por ![descrição](../<slug>/foto.jpg), sem as barras invertidas. Esse é o formato que o painel entende.',
            ].join('\n'),
          );
        }

        if (!problemas.length) return;
        if (command === 'build') throw new Error(problemas.join('\n\n'));
        problemas.forEach((p) => logger.error(p));
      },
      'astro:build:done': ({ dir }) => {
        const lista = grandes(fileURLToPath(dir));
        if (lista.length) throw new Error(mensagem(raiz, lista));
      },
    },
  };
}
