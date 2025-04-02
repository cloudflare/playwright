# Playwright for Cloudflare Workers

## Capabilities

### Playwright support on Cloudflare Workers, check [tests results](https://1d1e6337.playwright-reports-3id.pages.dev/) for an up to date list of the features that are fully supproted 


## Getting Started

Create a [Cloudflare Worker](https://developers.cloudflare.com/workers/get-started/guide/_)

```Shell
npm create cloudflare@latest -- cf-playwright-worker
```

## Installation

```Shell
npm i -s @cloudflare/playwright
```

## Configuration

📄 **Place this in `wrangler.toml`**

```toml
compatibility_flags = [ "nodejs_compat" ]
browser = { binding = "MYBROWSER" }
```

## Example

You can find a full running example here [Cloudflare Playwright running example](https://github.com/cloudflare/playwright/tree/main/packages/playwright-cloudflare/examples/todomvc)

### Screenshot 

```js
import { launch } from '@cloudflare/playwright';

const todos = searchParams.getAll('todo');

const browser = await launch(env.MYBROWSER);
const page = await browser.newPage();

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

const img = await page.screenshot();
    await browser.close();

    return new Response(img, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
```

### Trace

```js
import { launch } from '@cloudflare/playwright';
import fs from "@cloudflare/playwright/fs";

const browser = await launch(env.MYBROWSER);
const page = await browser.newPage();

await page.context().tracing.start({ screenshots: true, snapshots: true });

// ... do something, screenshot for example

await page.context().tracing.stop({ path: 'trace.zip' });
await browser.close();
const file = await fs.promises.readFile('trace.zip');

return new Response(file, {
    status: 200,
    headers: {
        'Content-Type': 'application/zip',
    },
});
```

### Assertions

```js
import { launch } from '@cloudflare/playwright';
import { expect } from '@cloudflare/playwright/test';

const browser = await launch(env.MYBROWSER);
const page = await browser.newPage();

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
```

# Contribute

## Build

To build Playwright for Cloudflare:

```sh
npm ci
cd packages/playwright-cloudflare
npm run build
```

## Run

To run the TodoMVC example:

- launch it with `wrangler`:

```sh
cd packages/playwright-cloudflare/examples/todomvc
npm ci
npx wrangler dev --remote
```

- press `b` to open the browser
