import { launch } from '@cloudflare/playwright';
import { expect } from '@cloudflare/playwright/test';
import fs from '@cloudflare/playwright/fs';

export default {
  async fetch(request: Request, env: Env) {
    const { searchParams } = new URL(request.url);
    const todos = searchParams.getAll('todo');
    const trace = searchParams.has('trace');

    const browser = await launch(env.MYBROWSER);
    const page = await browser.newPage();

    if (trace)
      await page.context().tracing.start({ screenshots: true, snapshots: true });

    await page.goto('https://demo.playwright.dev/todomvc');

    const TODO_ITEMS = todos.length > 0 ? todos : [
      'buy some cheese',
      'feed the cat',
      'book a doctors appointment'
    ];

    const newTodo = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    await expect(page.getByTestId('todo-title')).toHaveCount(TODO_ITEMS.length);

    await Promise.all(TODO_ITEMS.map(
        (value, index) => expect(page.getByTestId('todo-title').nth(index)).toHaveText(value)
    ));

    if (trace) {
      await page.context().tracing.stop({ path: 'trace.zip' });
      await browser.close();
      const file = await fs.promises.readFile('trace.zip');

      return new Response(file, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
        },
      });
    } else {
      const img = await page.screenshot();
      await browser.close();

      return new Response(img, {
        headers: {
          'Content-Type': 'image/png',
        },
      });
    }
  },
};
