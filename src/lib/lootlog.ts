/**
 * Busca o histórico de commits no GitHub e monta o loot log (veja lootlog-eventos.ts).
 */
import { getCollection } from 'astro:content';
import { SITE } from '../site.config';
import { autorDoLogin } from './autores';
import { getReviews } from './reviews';
import {
  completarComReviews,
  ehBot,
  eventosDosCommits,
  ordenarLog,
  type CommitLog,
  type EventoLog,
} from './lootlog-eventos';

export type { EventoLog, AutorLog } from './lootlog-eventos';

function env(nome: string): string | undefined {
  return typeof process !== 'undefined' ? process.env[nome] : undefined;
}

async function githubJson<T>(url: string): Promise<{ dados: T; link: string | null }> {
  const token = env('GITHUB_TOKEN');
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'needorgreed-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} em ${url}`);
  return { dados: (await res.json()) as T, link: res.headers.get('link') };
}

function proximaPagina(link: string | null): string | undefined {
  return link
    ?.split(',')
    .find((p) => p.includes('rel="next"'))
    ?.match(/<([^>]+)>/)?.[1];
}

/** Limite de commits olhados por build. Sem token, a API só deixa 60 requisições por hora. */
const MAX_COMMITS = 300;

async function commitsDoGitHub(): Promise<CommitLog[]> {
  const repo = env('GITHUB_REPO') || SITE.repo;
  type Resumo = { sha: string; author: { login: string } | null; commit: { author: { date: string } } };
  type Detalhe = { files?: Array<{ filename: string; status: string }> };

  // 1. Lista os commits que mexeram em src/content (um request a cada 100).
  const resumos: Resumo[] = [];
  let url: string | undefined = `https://api.github.com/repos/${repo}/commits?path=src/content&per_page=100`;
  while (url && resumos.length < MAX_COMMITS) {
    const { dados, link } = await githubJson<Resumo[]>(url);
    resumos.push(...dados);
    url = proximaPagina(link);
  }

  // 2. A lista não diz quais arquivos cada commit mexeu: busca o detalhe, poucos de cada vez.
  const commits: CommitLog[] = [];
  const fila = resumos.slice(0, MAX_COMMITS).filter((r) => !ehBot(r.author?.login ?? null));
  for (let i = 0; i < fila.length; i += 8) {
    const lote = fila.slice(i, i + 8);
    const detalhes = await Promise.all(
      lote.map((r) => githubJson<Detalhe>(`https://api.github.com/repos/${repo}/commits/${r.sha}`)),
    );
    lote.forEach((r, j) =>
      commits.push({
        sha: r.sha,
        login: r.author?.login ?? null,
        data: new Date(r.commit.author.date),
        arquivos: (detalhes[j].dados.files ?? []).map((f) => ({ caminho: f.filename, status: f.status })),
      }),
    );
  }
  return commits;
}

export interface LootLog {
  eventos: EventoLog[];
  /** 'github' quando veio do histórico; 'reviews' quando a API falhou e o log foi montado das reviews. */
  fonte: 'github' | 'reviews';
}

let cache: Promise<LootLog> | undefined;

export function getLootLog(): Promise<LootLog> {
  cache ??= (async () => {
    const reviews = await getReviews();
    const porSlug = new Map(reviews.map((r) => [r.slug, r]));
    const autores = await getCollection('autores');

    let eventos: EventoLog[] = [];
    let fonte: LootLog['fonte'] = 'github';
    try {
      eventos = await eventosDosCommits(await commitsDoGitHub(), {
        review: (slug) => porSlug.get(slug),
        autor: async (login) => {
          const a = await autorDoLogin(login);
          return { nick: a.nick, login: a.login, slug: a.slug };
        },
        loginDoArquivoDeAutor: (id) => autores.find((a) => a.id === id)?.data.github,
        autorPadrao: SITE.autorPadrao,
      });
    } catch (erro) {
      fonte = 'reviews';
      console.warn(`[lootlog] Histórico do GitHub indisponível, usando as reviews. ${(erro as Error).message}`);
    }

    return { eventos: ordenarLog(completarComReviews(eventos, reviews)), fonte };
  })();
  return cache;
}
