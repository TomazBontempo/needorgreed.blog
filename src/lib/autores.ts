/**
 * Descobre quem escreveu cada review a partir do GitHub.
 *
 * Regra: o autor é a CONTA do GitHub que fez o primeiro commit do arquivo.
 * Usamos o login retornado pela API (que o GitHub vincula pelo email verificado),
 * e não o nome/email do commit, porque esses qualquer um configura no git.
 *
 * Ordem de tentativa, no build:
 *   1. API do GitHub (precisa de GITHUB_REPO ou SITE.repo; GITHUB_TOKEN é opcional,
 *      mas sem ele o limite é de 60 requisições por hora).
 *   2. SITE.autorPadrao, para desenvolvimento local ou se a API falhar.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export interface Autoria {
  /** Login do GitHub de quem criou o arquivo. */
  criador: string;
  /** Login de quem fez a última alteração, se for diferente do criador. */
  editor?: string;
  /** De onde veio a informação, útil para depurar. */
  fonte: 'github' | 'padrao';
}

const cache = new Map<string, Promise<Autoria>>();

function env(nome: string): string | undefined {
  // O build roda em Node (prerenderEnvironment: 'node'), então process.env existe.
  return typeof process !== 'undefined' ? process.env[nome] : undefined;
}

async function githubFetch(url: string): Promise<Response> {
  const token = env('GITHUB_TOKEN');
  return fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'needorgreed-build',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

function linkUltimaPagina(link: string | null): string | undefined {
  if (!link) return undefined;
  const m = link.split(',').find((p) => p.includes('rel="last"'));
  return m?.match(/<([^>]+)>/)?.[1];
}

async function autoriaViaGitHub(caminho: string): Promise<Autoria | undefined> {
  const repo = env('GITHUB_REPO') || SITE.repo;
  if (!repo) return undefined;

  const base = `https://api.github.com/repos/${repo}/commits?path=${encodeURIComponent(caminho)}&per_page=100`;
  const primeira = await githubFetch(base);
  if (!primeira.ok) return undefined;

  const recentes = (await primeira.json()) as Array<{ author: { login: string } | null }>;
  if (!recentes.length) return undefined;

  // A API lista do mais novo para o mais antigo. O criador está no fim da última página.
  let antigos = recentes;
  const ultima = linkUltimaPagina(primeira.headers.get('link'));
  if (ultima) {
    const r = await githubFetch(ultima);
    if (r.ok) antigos = await r.json();
  }

  const criador = antigos[antigos.length - 1]?.author?.login;
  const editor = recentes[0]?.author?.login;
  if (!criador) return undefined;

  return { criador, editor: editor && editor !== criador ? editor : undefined, fonte: 'github' };
}

/** Caminho do arquivo relativo à raiz do repositório, como o GitHub espera. */
function caminhoNoRepo(entry: CollectionEntry<'reviews'>): string | undefined {
  return entry.filePath?.replace(/^\.\//, '').replace(/\\/g, '/');
}

export function autoriaDe(entry: CollectionEntry<'reviews'>): Promise<Autoria> {
  const caminho = caminhoNoRepo(entry) ?? entry.id;
  if (!cache.has(caminho)) {
    cache.set(
      caminho,
      (async () => {
        try {
          const viaApi = await autoriaViaGitHub(caminho);
          if (viaApi) return viaApi;
        } catch {
          // Sem rede ou repo ainda privado sem token: cai no autor padrão.
        }
        return { criador: SITE.autorPadrao, fonte: 'padrao' as const };
      })(),
    );
  }
  return cache.get(caminho)!;
}

export type Autor = CollectionEntry<'autores'>;

let mapa: Promise<Map<string, Autor>> | undefined;

/** Mapa login do GitHub (minúsculo) -> autor do site. */
export function mapaDeAutores(): Promise<Map<string, Autor>> {
  mapa ??= getCollection('autores').then(
    (lista) => new Map(lista.map((a) => [a.data.github.toLowerCase(), a])),
  );
  return mapa;
}

/** Autor do site para um login. Logins sem cadastro aparecem com o próprio login como nick. */
export interface AutorResolvido {
  nick: string;
  login: string;
  /** Usado na URL /autores/<slug>/: o nome do arquivo do autor, ou o login se não houver cadastro. */
  slug: string;
  autor?: Autor;
}

export async function autorDoLogin(login: string): Promise<AutorResolvido> {
  const autor = (await mapaDeAutores()).get(login.toLowerCase());
  return { nick: autor?.data.nick ?? login, login, slug: autor?.id ?? login.toLowerCase(), autor };
}
