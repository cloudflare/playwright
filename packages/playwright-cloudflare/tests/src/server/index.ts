import testsServer from './testsServer';
import '@workerTests/index';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/v1'))
      return await env.BROWSER.fetch(`http://fake.host${url.pathname}`);

    if (url.pathname === '/' || /\.(spec|test)\.ts$/.test(url.pathname))
      return await testsServer.fetch(request, env);

    if (url.pathname.endsWith('.html'))
      request = new Request(request.url.substring(0, request.url.length - '.html'.length));

    return await env.ASSETS?.fetch(request) ?? new Response('Not found', { status: 404 });
  }
};
