import { connect, acquire, BrowserWorker } from '@cloudflare/playwright/client';
import { debug } from '@cloudflare/playwright/internal';

// eslint-disable-next-line no-console
const log = console.log;

export function localBrowserSim(baseUrl: string) {
  // hack to allow for local only dev, which calls a local chrome
  return {
    async fetch(request: string, requestInit?: RequestInit | Request): Promise<Response> {
      // The puppeteer fork calls the binding with a fake host
      const u = request.replace('http://fake.host', '');
      log(`LOCAL ${baseUrl}${u}`);
      return fetch(`${baseUrl}${u}`, requestInit).catch(err => {
        log(err);
        throw new Error('Unable to create new browser: code: 429: message: Too Many Requests. Local sim');
      });
    },
  };
}

function getBrowserConnection(isLocalEnv = true): BrowserWorker {
  return localBrowserSim('http://localhost:3000') as BrowserWorker;
}

export default {
  async fetch(request: Request, env: Env) {
    debug.enable('pw:*');
    const binding = getBrowserConnection();
    const { sessionId } = await acquire(binding);
    log(`Acquired session ID: ${sessionId}`);
    const browser = await connect(binding, { sessionId });

    log(`Connected to browser with session ID: ${sessionId}`);

    const page = await browser.newPage();

    await page.goto('https://demo.playwright.dev/todomvc');

    const TODO_ITEMS = [
      'buy some cheese',
      'feed the cat',
      'book a doctors appointment'
    ];

    const newTodo = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    const img = await page.screenshot();
    await browser.close();

    return new Response(img, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  },
};
