/**
 * Checagens de mídia das reviews, antes de publicar. Regra do projeto: nenhum erro silencioso.
 *
 * Estrutura de cada review (é o que o painel gera e o único formato que ele reconhece ao reabrir):
 *   src/content/reviews/<slug>/
 *     index.mdx (+ index.en.mdx, index.es.mdx)
 *     capa.jpg                capa: ../<slug>/capa.jpg            (obrigatória)
 *     imagens/<nome>          ![descrição](../<slug>/imagens/<nome>)
 *     videos/<nome>           <Clipe src="../<slug>/videos/<nome>" descricao="..." />
 *
 * Param o build (no dev, aparecem como erro no terminal):
 *   - review sem capa, capa fora do formato, ou arquivo da capa que não existe;
 *   - imagem do texto fora de imagens/, arquivo que não existe, ou sem texto alternativo;
 *   - clipe fora de videos/, arquivo que não existe, ou sem descrição;
 *   - imagem escapada pelo painel (!\[...]\(...), que some do site sem erro;
 *   - arquivo acima de 25 MB (limite da Cloudflare Workers para arquivo estático).
 * Só avisam:
 *   - nome de arquivo genérico (img-2034.jpg, captura-de-tela-...): funciona, mas não descreve a imagem;
 *   - arquivo solto na pasta da review, fora de imagens/ e videos/;
 *   - arquivo que nenhuma versão da review usa.
 */
import type { AstroIntegration } from 'astro';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomeGenerico } from '../lib/nomes-de-arquivo';

export const LIMITE_BYTES = 25 * 1024 * 1024;

const EXT_IMAGEM = /\.(jpe?g|png|webp|avif|gif)$/i;
const EXT_VIDEO = /\.(mp4|webm)$/i;

function arquivos(pasta: string): string[] {
  if (!existsSync(pasta)) return [];
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

function grandes(pastas: string[], raiz: string): string[] {
  return pastas
    .flatMap((p) => arquivos(p))
    .filter((c) => statSync(c).size > LIMITE_BYTES)
    .map((c) => `${relative(raiz, c)}: ${(statSync(c).size / 1024 / 1024).toFixed(1)} MB (máximo: 25 MB)`);
}

interface Resultado {
  erros: string[];
  avisos: string[];
}

/** Confere uma review (todas as versões) e devolve erros e avisos, já com a correção sugerida. */
function conferirReview(pastaReviews: string, slug: string): Resultado {
  const pasta = join(pastaReviews, slug);
  const erros: string[] = [];
  const avisos: string[] = [];
  const usados = new Set<string>();
  const versoes = readdirSync(pasta).filter((a) => /^index(\.\w+)?\.mdx?$/.test(a));

  const existe = (caminho: string) => existsSync(join(pastaReviews, caminho.replace(/^\.\.\//, '')));

  for (const versao of versoes) {
    const onde = `${slug}/${versao}`;
    const texto = readFileSync(join(pasta, versao), 'utf8');
    const frontmatter = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    // Corpo sem blocos de código, para não confundir exemplo de sintaxe com mídia de verdade.
    const corpo = texto.slice(frontmatter.length).replace(/^```[\s\S]*?^```/gm, '');

    // Capa
    const capa = frontmatter.match(/^capa:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];
    if (!capa) {
      erros.push(`${onde}: review sem capa. Envie uma no campo "Capa" do painel ou escreva capa: ../${slug}/capa.jpg (com o arquivo na pasta da review).`);
    } else if (!new RegExp(`^\\.\\./${slug}/capa\\.(jpe?g|png|webp|avif)$`, 'i').test(capa)) {
      erros.push(`${onde}: capa "${capa}" num formato que o painel não reconhece (ele apagaria a capa ao salvar). Use: capa: ../${slug}/capa.jpg`);
    } else if (!existe(capa)) {
      erros.push(`${onde}: o arquivo da capa não existe: ${capa}`);
    } else usados.add(capa);

    // Imagem escapada pelo painel
    corpo.split('\n').forEach((linha, i) => {
      if (/!\\\[/.test(linha)) {
        erros.push(`${onde}, linha ~${i + 1}: imagem estragada pelo painel (${linha.trim().slice(0, 70)}). Troque por ![descrição](../${slug}/imagens/nome.jpg), sem as barras invertidas.`);
      }
    });

    // Imagens do texto
    for (const m of corpo.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const [, alt, caminho] = m;
      if (!new RegExp(`^\\.\\./${slug}/imagens/[^/]+$`).test(caminho)) {
        erros.push(`${onde}: imagem "${caminho}" fora da pasta imagens/ da review. Use: ![descrição](../${slug}/imagens/${basename(caminho)})`);
        continue;
      }
      if (!existe(caminho)) erros.push(`${onde}: a imagem não existe: ${caminho}`);
      else usados.add(caminho);
      if (!alt.trim()) {
        erros.push(`${onde}: a imagem ${caminho} está sem texto alternativo. Descreva o que ela mostra: ![o que aparece na imagem](${caminho})`);
      }
    }

    // Clipes
    for (const m of corpo.matchAll(/<Clipe\b([^>]*?)\/?>/g)) {
      const attrs = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
      const src = attrs.src ?? '';
      if (!new RegExp(`^\\.\\./${slug}/videos/[^/]+\\.(mp4|webm)$`, 'i').test(src)) {
        erros.push(`${onde}: clipe "${src}" fora da pasta videos/ da review, ou não é .mp4/.webm. Use: src="../${slug}/videos/nome.mp4"`);
      } else if (!existe(src)) erros.push(`${onde}: o vídeo não existe: ${src}`);
      else usados.add(src);
      if (attrs.poster !== undefined) {
        if (!new RegExp(`^\\.\\./${slug}/videos/[^/]+$`).test(attrs.poster)) {
          erros.push(`${onde}: o quadro de capa do clipe "${attrs.poster}" deve estar em videos/: poster="../${slug}/videos/nome-capa.jpg"`);
        } else if (!existe(attrs.poster)) erros.push(`${onde}: o quadro de capa do clipe não existe: ${attrs.poster}`);
        else usados.add(attrs.poster);
      }
      if (!attrs.descricao?.trim()) {
        erros.push(`${onde}: o clipe ${src} está sem descrição (descricao="..."), que é o que o leitor de tela lê.`);
      }
    }
  }

  // Avisos: arquivos soltos, genéricos ou sem uso
  for (const caminho of arquivos(pasta)) {
    const rel = relative(pasta, caminho).split('\\').join('/');
    const nome = basename(caminho);
    if (/^index(\.\w+)?\.mdx?$/.test(rel) || /^capa\.\w+$/.test(rel)) continue;
    const pastaDoArquivo = rel.split('/')[0];
    if (rel.split('/').length === 1) {
      avisos.push(`${slug}/${rel}: arquivo solto na pasta da review. Imagens vão em imagens/, vídeos em videos/.`);
      continue;
    }
    if (pastaDoArquivo === 'imagens' && !EXT_IMAGEM.test(nome)) avisos.push(`${slug}/${rel}: arquivo que não é imagem dentro de imagens/.`);
    if (pastaDoArquivo === 'videos' && !EXT_VIDEO.test(nome) && !EXT_IMAGEM.test(nome)) avisos.push(`${slug}/${rel}: arquivo que não é vídeo nem quadro de capa dentro de videos/.`);
    if (!usados.has(`../${slug}/${rel}`)) avisos.push(`${slug}/${rel}: nenhuma versão da review usa este arquivo.`);
    if (nomeGenerico(nome)) avisos.push(`${slug}/${rel}: nome genérico. Funciona, mas um nome que diga o que o arquivo mostra ajuda quem procura (e o Google), ex.: chefe-final.jpg.`);
  }

  return { erros, avisos };
}

export default function checagemDeMidia(): AstroIntegration {
  let raiz = '';
  return {
    name: 'needorgreed:midia',
    hooks: {
      'astro:config:setup': ({ config, command, logger }) => {
        raiz = fileURLToPath(config.root);
        const pastaReviews = join(raiz, 'src/content/reviews');
        const erros: string[] = [];
        const avisos: string[] = [];

        const muitoGrandes = grandes([fileURLToPath(config.publicDir), pastaReviews], raiz);
        erros.push(...muitoGrandes.map((g) => `${g}. Comprima (ex.: ffmpeg -i entrada.mp4 -vf scale=1280:-2 -crf 28 -an saida.mp4) ou, se for vídeo longo, use <YouTube id="..." />.`));

        if (existsSync(pastaReviews)) {
          for (const slug of readdirSync(pastaReviews)) {
            if (!statSync(join(pastaReviews, slug)).isDirectory()) continue;
            const r = conferirReview(pastaReviews, slug);
            erros.push(...r.erros);
            avisos.push(...r.avisos);
          }
        }

        if (avisos.length) logger.warn(['Avisos de mídia (não impedem a publicação):', ...avisos.map((a) => `  - ${a}`)].join('\n'));
        if (!erros.length) return;
        const mensagem = ['Problemas de mídia nas reviews (corrija antes de publicar):', ...erros.map((e) => `  - ${e}`)].join('\n');
        if (command === 'build') throw new Error(mensagem);
        logger.error(mensagem);
      },
      'astro:build:done': ({ dir }) => {
        const muitoGrandes = grandes([fileURLToPath(dir)], raiz);
        if (muitoGrandes.length) {
          throw new Error(['Arquivo grande demais para a Cloudflare Workers (máximo: 25 MB por arquivo):', ...muitoGrandes.map((g) => `  - ${g}`)].join('\n'));
        }
      },
    },
  };
}
