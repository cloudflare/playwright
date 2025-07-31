import { connect, acquire } from '@cloudflare/playwright/client';

// eslint-disable-next-line no-console
const log = console.log;

export default {
  async fetch(request: Request, env: Env) {
    const { sessionId } = await acquire(env.MYBROWSER);
    const browser = await connect(env.MYBROWSER, { sessionId });

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
