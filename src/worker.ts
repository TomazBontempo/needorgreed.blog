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

    const decisao = decidir({
      method: request.method,
      url,
      cookie: request.headers.get('cookie'),
      userAgent: request.headers.get('user-agent'),
      acceptLanguage: request.headers.get('accept-language'),
    });

    if (decisao.tipo === 'redirecionar') {
      const headers = new Headers({
        Location: decisao.para,
        'Cache-Control': 'private, no-store',
        Vary: 'Accept-Language, Cookie',
      });
      if (decisao.gravarCookie) headers.append('Set-Cookie', cookieDeIdioma(decisao.gravarCookie));
      return new Response(null, { status: 302, headers });
    }

    const resposta = await handle(request, env, ctx);
    // A home pode redirecionar conforme o idioma do navegador: nenhum cache pode guardar uma versão só.
    if (url.pathname === '/') {
      const r = new Response(resposta.body, resposta);
      r.headers.set('Vary', 'Accept-Language, Cookie');
      return r;
    }
    return resposta;
  },
};
