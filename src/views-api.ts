/**
 * Contador de views das reviews, servido pelo Worker (src/worker.ts) antes das páginas.
 *
 *   POST /api/views/<slug>          soma 1 e devolve { total }
 *   GET  /api/views?slugs=a,b,c     devolve { totais: { slug: número } }
 *
 * O número fica no D1 `needorgreed-views` (tabela `views`, ver migrations/), um por review, sem nada
 * sobre quem viu. As três línguas somam no mesmo slug.
 *
 * Para não contar duas vezes: o navegador só manda o +1 a cada 30 minutos por review, e o servidor
 * repete a regra guardando, no cache do Worker (Cache API: grátis e sem limite de gravação), uma marca
 * feita com um código embaralhado do IP e do slug. A marca some sozinha em 30 minutos; o IP não vai
 * para o banco. O cache é por data center, então a regra é aproximada (suficiente para um contador).
 * Se mudar o que se guarda aqui, atualize a página de privacidade (src/views/Privacidade.astro).
 */

// Só o pedaço das APIs da Cloudflare usado aqui (o projeto não instala @cloudflare/workers-types).
type Consulta = {
  bind(...valores: unknown[]): Consulta;
  first<T>(coluna: string): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
};
type Env = { VIEWS?: { prepare(sql: string): Consulta }; ASSETS: { fetch(request: Request): Promise<Response> } };
type Contexto = { waitUntil(promessa: Promise<unknown>): void };
/** O cache do data center em que o Worker está rodando. */
const cacheDoWorker = () => (caches as unknown as { default: Cache }).default;

const JANELA_SEGUNDOS = 30 * 60;
const CACHE_LEITURA_SEGUNDOS = 60;
const MAX_SLUGS = 100;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const json = (dados: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

async function sha256(texto: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Só conta review que existe: a página dela tem que estar entre os arquivos publicados. */
async function reviewExiste(env: Env, origem: string, slug: string): Promise<boolean> {
  const r = await env.ASSETS.fetch(new Request(`${origem}/reviews/${slug}/`, { method: 'HEAD' }));
  return r.ok;
}

async function somar(request: Request, env: Env, slug: string, ctx: Contexto): Promise<Response> {
  if (!env.VIEWS) return json({ erro: 'contador desligado' }, 503);
  const origem = new URL(request.url).origin;
  if (!SLUG.test(slug) || !(await reviewExiste(env, origem, slug))) return json({ erro: 'review inexistente' }, 404);

  const ip = request.headers.get('cf-connecting-ip') ?? '';
  const marca = new Request(`${origem}/__views-marca/${await sha256(`${ip}|${slug}`)}`);
  const cache = cacheDoWorker();
  if (await cache.match(marca)) {
    const atual = await env.VIEWS.prepare('SELECT total FROM views WHERE slug = ?').bind(slug).first<number>('total');
    return json({ total: atual ?? 0, contou: false });
  }

  const linha = await env.VIEWS.prepare(
    'INSERT INTO views (slug, total) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET total = total + 1 RETURNING total',
  )
    .bind(slug)
    .first<number>('total');
  ctx.waitUntil(cache.put(marca, new Response('1', { headers: { 'Cache-Control': `max-age=${JANELA_SEGUNDOS}` } })));
  return json({ total: linha ?? 0, contou: true });
}

async function ler(request: Request, env: Env, ctx: Contexto): Promise<Response> {
  if (!env.VIEWS) return json({ erro: 'contador desligado' }, 503);
  const url = new URL(request.url);
  const slugs = [...new Set((url.searchParams.get('slugs') ?? '').split(',').filter((s) => SLUG.test(s)))]
    .sort()
    .slice(0, MAX_SLUGS);
  if (!slugs.length) return json({ totais: {} });

  // Mesmo conjunto de slugs, mesma resposta por 1 minuto: economiza leituras do D1.
  const chave = new Request(`${url.origin}/__views-leitura?slugs=${slugs.join(',')}`);
  const guardada = await cacheDoWorker().match(chave);
  if (guardada) return guardada;

  const { results } = await env.VIEWS.prepare(
    `SELECT slug, total FROM views WHERE slug IN (${slugs.map(() => '?').join(',')})`,
  )
    .bind(...slugs)
    .all<{ slug: string; total: number }>();
  const resposta = json(
    { totais: Object.fromEntries(results.map((r: { slug: string; total: number }) => [r.slug, r.total])) },
    200,
    { 'Cache-Control': `public, max-age=${CACHE_LEITURA_SEGUNDOS}` },
  );
  ctx.waitUntil(cacheDoWorker().put(chave, resposta.clone()));
  return resposta;
}

/** Atende /api/views; devolve undefined para qualquer outro caminho. */
export async function views(request: Request, env: Env, ctx: Contexto): Promise<Response | undefined> {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/views' && request.method === 'GET') return ler(request, env, ctx);
  const m = pathname.match(/^\/api\/views\/([^/]+)$/);
  if (m && request.method === 'POST') return somar(request, env, m[1], ctx);
  if (pathname.startsWith('/api/views')) return json({ erro: 'não encontrado' }, 404);
  return undefined;
}
