#!/usr/bin/env node
/**
 * npm run translate
 *
 * Gera a versão de cada review nas outras línguas do site, ao lado do original:
 *   src/content/reviews/<slug>/index.mdx      original (idioma: pt, en ou es; padrão pt)
 *   src/content/reviews/<slug>/index.en.mdx   tradução gerada aqui
 *   src/content/reviews/<slug>/index.es.mdx   tradução gerada aqui
 *
 * Regras:
 *  - A tradução guarda o hash do original (origemHash). Só retraduz quando o original muda.
 *  - Tradução com `revisado: true` nunca é sobrescrita. Se o original mudou depois, só avisa.
 *  - Rascunhos ficam de fora (não gastam cota).
 *  - Cota diária do Workers AI estourada: para de traduzir, não quebra nada. A página mostra
 *    o original com aviso, e o próximo run tenta de novo.
 *
 * Tradutor: Cloudflare Workers AI (plano Free, sem cartão), com um LLM open source.
 *   CLOUDFLARE_ACCOUNT_ID  id da conta
 *   CLOUDFLARE_AI_TOKEN    token com permissão só de Workers AI
 *   TRANSLATE_MODEL        opcional, troca o modelo
 *
 * Opções:
 *   --mock          tradutor de mentira, para testar sem token (marca `modelo: mock`)
 *   --force         retraduz mesmo com hash igual (nunca passa por cima de `revisado: true`)
 *   <slug> ...      só essas reviews
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import YAML from 'yaml';

const RAIZ = new URL('..', import.meta.url).pathname;
const PASTA = join(RAIZ, 'src/content/reviews');
const MODELO_PADRAO = '@cf/google/gemma-4-26b-a4b-it';
/** Línguas do site (mesma lista de src/i18n/rotas.ts) e como o modelo deve chamar cada uma. */
const IDIOMAS = ['en', 'pt', 'es'];
const NOMES = {
  pt: 'Brazilian Portuguese',
  en: 'English',
  es: 'neutral Latin American Spanish (es-419: use "tú", never "vosotros", no Spain-only slang)',
};
/** Tamanho máximo de cada pedaço do texto mandado de uma vez para o modelo. */
const MAX_CHUNK = 6000;

const args = process.argv.slice(2);
const MOCK = args.includes('--mock') || process.env.TRANSLATE_PROVIDER === 'mock';
const FORCE = args.includes('--force');
const SO = args.filter((a) => !a.startsWith('--'));
const NA_ACTION = !!process.env.GITHUB_ACTIONS;

class CotaEsgotada extends Error {}

// ---------------------------------------------------------------------------------------------
// Log: vira anotação na GitHub Action e entra no relatório do commit
// ---------------------------------------------------------------------------------------------

const relatorio = [];

function info(msg) {
  console.log(msg);
}
function aviso(msg) {
  console.log(NA_ACTION ? `::warning::${msg}` : `aviso: ${msg}`);
  relatorio.push(msg);
}

// ---------------------------------------------------------------------------------------------
// Arquivos
// ---------------------------------------------------------------------------------------------

function separar(texto) {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('arquivo sem frontmatter');
  return { dados: YAML.parse(m[1]) ?? {}, corpo: m[2] };
}

function hash(texto) {
  return createHash('sha256').update(texto).digest('hex');
}

async function original(slug) {
  for (const nome of ['index.mdx', 'index.md']) {
    const caminho = join(PASTA, slug, nome);
    if (existsSync(caminho)) return { caminho, texto: await readFile(caminho, 'utf8') };
  }
}

// ---------------------------------------------------------------------------------------------
// Proteção: o que o modelo não pode tocar vira ⟦n⟧ e volta depois
// ---------------------------------------------------------------------------------------------

const PROTEGER = [
  /^```[\s\S]*?^```/gm, // blocos de código
  /^(?:import|export)\s.*$/gm, // linhas de import/export do MDX
  /<\/?[A-Za-z][^>]*>/g, // componentes MDX e HTML: <YouTube id="..." />
  /\{[^{}\n]*\}/g, // expressões MDX
  /`[^`\n]+`/g, // código inline
  /\]\([^)\s]+(?:\s+"[^"]*")?\)/g, // destino de links e imagens: ](url "título")
  /https?:\/\/[^\s)>\]]+/g, // URLs soltas
];

function proteger(texto) {
  const guardados = [];
  let saida = texto;
  for (const re of PROTEGER) {
    saida = saida.replace(re, (m) => {
      guardados.push(m);
      return `⟦${guardados.length - 1}⟧`;
    });
  }
  return { saida, guardados };
}

function restaurar(texto, guardados) {
  // Restaura de trás para frente: um guardado pode conter outro (link dentro de componente).
  let saida = texto;
  for (let i = guardados.length - 1; i >= 0; i--) {
    const marca = `⟦${i}⟧`;
    if (!saida.includes(marca)) throw new Error(`o modelo perdeu o trecho protegido ${marca}: ${guardados[i].slice(0, 60)}`);
    saida = saida.split(marca).join(guardados[i]);
  }
  return saida;
}

function pedacos(texto) {
  const blocos = texto.split(/(\n{2,})/);
  const saida = [];
  let atual = '';
  for (const b of blocos) {
    if (atual.length + b.length > MAX_CHUNK && atual.trim()) {
      saida.push(atual);
      atual = '';
    }
    atual += b;
  }
  if (atual) saida.push(atual);
  return saida;
}

/** Garantia final: travessão nunca, em nenhuma língua. */
function semTravessao(texto) {
  return texto.replace(/\s*\u2014\s*/g, ', ').replace(/,\s*,/g, ',');
}

// ---------------------------------------------------------------------------------------------
// Tradutores
// ---------------------------------------------------------------------------------------------

function promptSistema(de, para) {
  return [
    `You translate reviews for "Need or Greed", a casual, opinionated and funny blog that reviews games, films, series and anime as if they were MMO loot drops.`,
    `Translate from ${NOMES[de]} to ${NOMES[para]}.`,
    `Rules:`,
    `- Keep the author's voice: casual, direct, funny, with opinions. Adapt jokes, slang and idioms so they land naturally; do not translate them word for word.`,
    `- Keep every Markdown mark exactly: headings, bold, italics, lists, quotes, line breaks and blank lines.`,
    `- Tokens like ⟦3⟧ are protected code. Copy each one exactly, once, in the matching place. Never translate, remove or add them.`,
    `- Do not translate names of games, films, series, anime, characters, studios, platforms or places.`,
    `- Keep MMO and gamer terms as they are: Need, Greed, Pass, loot, raid, drop, grind, farm, build, boss, tier, nerf, buff, spawn, despawn.`,
    `- Never use the em dash character. Use commas, colons, periods or parentheses instead.`,
    `- Output only the translation. No preface, no notes, no quotes around it.`,
  ].join('\n');
}

function textoDaResposta(json) {
  const r = json?.result;
  const texto = typeof r?.response === 'string' ? r.response : r?.choices?.[0]?.message?.content;
  if (typeof texto !== 'string') throw new Error(`resposta sem texto: ${JSON.stringify(json).slice(0, 200)}`);
  // Alguns modelos devolvem o raciocínio junto: fica só a resposta.
  return texto.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function workersAi() {
  const conta = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  const modelo = process.env.TRANSLATE_MODEL || MODELO_PADRAO;
  if (!conta || !token) return undefined;

  return {
    modelo,
    async traduzir(texto, de, para) {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${conta}/ai/run/${modelo}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: promptSistema(de, para) },
            { role: 'user', content: texto },
          ],
          max_tokens: 8192,
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(180_000),
      });
      const json = await res.json().catch(() => ({}));
      const erros = JSON.stringify(json?.errors ?? '');
      // Plano Free: passar dos 10.000 neurons do dia gera erro (nunca cobrança).
      if (res.status === 429 || /4006|neuron|daily free allocation|quota/i.test(erros)) {
        throw new CotaEsgotada(erros || `HTTP ${res.status}`);
      }
      if (!res.ok || json?.success === false) throw new Error(`Workers AI ${res.status}: ${erros.slice(0, 300)}`);
      return textoDaResposta(json);
    },
  };
}

/** Tradutor de mentira: marca o texto e devolve. Mantém os ⟦n⟧, como o modelo de verdade deve fazer. */
function mock() {
  return {
    modelo: 'mock',
    async traduzir(texto, _de, para) {
      return texto.replace(/^(?!\s*$)(?!\s*⟦\d+⟧\s*$)(\s*(?:#+\s|>\s|[-*]\s|\d+\.\s)?)/gm, `$1[${para}] `);
    },
  };
}

// ---------------------------------------------------------------------------------------------
// Tradução de uma review
// ---------------------------------------------------------------------------------------------

/** Atributos de componente que são texto para o leitor: legenda, descrição, título. */
const RE_ATRIBUTO = /\b(legenda|descricao|titulo|alt)="([^"]*)"/g;

/** Traduz, num pedido só, os textos dentro de atributos dos componentes MDX. */
async function traduzirAtributos(tradutor, corpo, de, para) {
  const valores = [...new Set([...corpo.matchAll(RE_ATRIBUTO)].map((m) => m[2]).filter((v) => v.trim()))];
  if (!valores.length) return corpo;
  const traduzidos = await traduzirLista(tradutor, valores, de, para, 'captions and accessibility descriptions of images and videos');
  return corpo.replace(RE_ATRIBUTO, (tudo, nome, valor) => {
    const i = valores.indexOf(valor);
    return i < 0 ? tudo : `${nome}="${traduzidos[i].replace(/"/g, '&quot;')}"`;
  });
}

async function traduzirCorpo(tradutor, corpo, de, para) {
  corpo = await traduzirAtributos(tradutor, corpo, de, para);
  const { saida, guardados } = proteger(corpo);
  const partes = [];
  for (const p of pedacos(saida)) {
    // Pedaços que são só espaço ou só trechos protegidos não precisam de modelo.
    if (!p.replace(/⟦\d+⟧/g, '').trim()) partes.push(p);
    else {
      const inicio = p.match(/^\s*/)[0];
      const fim = p.match(/\s*$/)[0];
      partes.push(inicio + (await tradutor.traduzir(p.trim(), de, para)) + fim);
    }
  }
  return semTravessao(restaurar(partes.join(''), guardados));
}

/** Campos curtos (frase, motivo, atributos, tags) vão juntos, um por linha numerada. */
async function traduzirCampos(tradutor, dados, de, para) {
  const linhas = [];
  const destino = [];
  const add = (valor, aplicar) => {
    if (typeof valor === 'string' && valor.trim()) {
      linhas.push(valor);
      destino.push(aplicar);
    }
  };
  const novo = structuredClone(dados);
  add(dados.frase, (v) => (novo.frase = v));
  add(dados.motivoRoll, (v) => (novo.motivoRoll = v));
  (dados.atributos ?? []).forEach((a, i) => add(a?.nome, (v) => (novo.atributos[i].nome = v)));
  (dados.tags ?? []).forEach((t, i) => add(t, (v) => (novo.tags[i] = v)));
  if (!linhas.length) return novo;

  const traduzidas = await traduzirLista(tradutor, linhas, de, para, 'short fields of one review: a tagline, a one-line verdict, item stat names and tags');
  traduzidas.forEach((v, i) => destino[i](v));
  return novo;
}

/** Traduz uma lista de textos curtos num pedido só, uma linha numerada por texto. */
async function traduzirLista(tradutor, linhas, de, para, oQueSao) {
  const pedido =
    `Translate each numbered line. These are ${oQueSao}. ` +
    'Answer with the same numbers, one per line, in the format "N. translation", and nothing else.\n\n' +
    linhas.map((l, i) => `${i + 1}. ${l.replace(/\n/g, ' ')}`).join('\n');
  const resposta = await tradutor.traduzir(pedido, de, para);

  const porNumero = new Map();
  for (const l of resposta.split('\n')) {
    const m = l.match(/^\s*(\d+)[.)]\s*(.+)$/);
    if (m) porNumero.set(Number(m[1]), m[2].trim());
  }
  return linhas.map((original, i) => semTravessao(porNumero.get(i + 1) ?? original));
}

async function traduzirReview(tradutor, slug) {
  const orig = await original(slug);
  if (!orig) return 'sem-original';
  const { dados, corpo } = separar(orig.texto);
  if (dados.rascunho) return 'rascunho';

  const de = IDIOMAS.includes(dados.idioma) ? dados.idioma : 'pt';
  const origemHash = hash(orig.texto);
  const resultados = [];

  // Uma tradução para cada língua que não é a do original. Uma cota esgotada no meio
  // interrompe tudo (CotaEsgotada sobe para o main); o que já foi gravado fica.
  for (const para of IDIOMAS.filter((l) => l !== de)) {
    resultados.push(`${para} ${await traduzirPara(tradutor, slug, orig, dados, corpo, de, para, origemHash)}`);
  }
  return resultados.join(', ');
}

async function traduzirPara(tradutor, slug, orig, dados, corpo, de, para, origemHash) {
  const alvo = join(PASTA, slug, `index.${para}.mdx`);

  if (existsSync(alvo)) {
    const atual = separar(await readFile(alvo, 'utf8')).dados;
    if (atual.revisado) {
      if (atual.origemHash !== origemHash) {
        aviso(`${slug}: o original mudou, mas a tradução (${para}) foi revisada à mão e não será sobrescrita. Revise index.${para}.mdx.`);
      }
      return 'revisada';
    }
    const ehMock = atual.modelo === 'mock' && !MOCK;
    if (atual.origemHash === origemHash && !FORCE && !ehMock) return 'em-dia';
  }

  const campos = await traduzirCampos(tradutor, dados, de, para);
  const novoCorpo = await traduzirCorpo(tradutor, corpo, de, para);

  const frontmatter = { ...campos, idioma: para, origemHash, revisado: false, modelo: tradutor.modelo };
  const cabecalho =
    `# Tradução automática de ${orig.caminho.split('/').pop()} (${de} -> ${para}).\n` +
    `# Editou à mão? Mude "revisado" para true e o script nunca mais sobrescreve.\n`;
  await writeFile(alvo, `---\n${cabecalho}${YAML.stringify(frontmatter, { lineWidth: 0 })}---\n${novoCorpo}`);
  return 'traduzida';
}

// ---------------------------------------------------------------------------------------------

async function main() {
  const tradutor = MOCK ? mock() : workersAi();
  if (!tradutor) {
    aviso('Sem CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_AI_TOKEN: nada traduzido. Use --mock para testar.');
    return;
  }
  info(`Tradutor: ${tradutor.modelo}`);

  const slugs = SO.length
    ? SO
    : (await readdir(PASTA, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();

  const contagem = {};
  for (const slug of slugs) {
    let resultado;
    try {
      resultado = await traduzirReview(tradutor, slug);
    } catch (erro) {
      if (erro instanceof CotaEsgotada) {
        aviso(`Cota diária do Workers AI esgotada em "${slug}". O resto fica para o próximo run. (${erro.message})`);
        break;
      }
      resultado = 'erro';
      aviso(`${slug}: tradução falhou, a página vai mostrar o original. ${erro.message}`);
    }
    for (const r of resultado.split(', ')) contagem[r] = (contagem[r] ?? 0) + 1;
    info(`  ${slug}: ${resultado}`);
  }

  info(`Resumo: ${Object.entries(contagem).map(([k, v]) => `${v} ${k}`).join(', ') || 'nada a fazer'}`);

  if (relatorio.length && process.env.TRANSLATE_REPORT) {
    await writeFile(process.env.TRANSLATE_REPORT, relatorio.map((l) => `- ${l}`).join('\n') + '\n');
  }
  if (relatorio.length && process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Tradução\n\n${relatorio.map((l) => `- ${l}`).join('\n')}\n`);
  }
}

main().catch((erro) => {
  // Erro inesperado: avisa, mas não quebra a Action (o site continua com os originais).
  aviso(`Erro inesperado na tradução: ${erro.stack ?? erro}`);
});
