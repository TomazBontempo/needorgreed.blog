/**
 * Worker da Cloudflare: escolhe o idioma antes de servir a página e depois entrega ao Astro.
 *
 * As páginas são estáticas, e a Cloudflare serve arquivo estático SEM chamar o Worker.
 * Por isso o wrangler.jsonc liga `assets.run_worker_first` para as rotas HTML
 * (e deixa /_astro/*, imagens e feeds de fora, para não gastar invocação à toa).
 */
import { handle } from '@astrojs/cloudflare/handler';
import { cookieDeIdioma, decidir } from './i18n/deteccao';

type Handle = typeof handle;

export default {
  async fetch(request: Request, env: Parameters<Handle>[1], ctx: Parameters<Handle>[2]) {
    const url = new URL(request.url);
    const cf = (request as Request & { cf?: { country?: string } }).cf;

    const decisao = decidir({
      method: request.method,
      url,
      cookie: request.headers.get('cookie'),
      userAgent: request.headers.get('user-agent'),
      // A Cloudflare sobrescreve cf-ipcountry em produção; no wrangler dev, dá para simular o país com ele.
      pais: request.headers.get('cf-ipcountry') ?? cf?.country ?? null,
    });

    if (decisao.tipo === 'redirecionar') {
      const headers = new Headers({
        Location: decisao.para,
        'Cache-Control': 'private, no-store',
        Vary: 'Cookie',
      });
      if (decisao.gravarCookie) headers.append('Set-Cookie', cookieDeIdioma(decisao.gravarCookie));
      return new Response(null, { status: 302, headers });
    }

    return handle(request, env, ctx);
  },
};
