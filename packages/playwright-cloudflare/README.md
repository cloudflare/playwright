# Playwright for Cloudflare Workers

## Capabilities

### Resilient • No flaky tests

**Auto-wait**. Playwright waits for elements to be actionable prior to performing actions. It also has a rich set of introspection events. The combination of the two eliminates the need for artificial timeouts - a primary cause of flaky tests.

**Web-first assertions**. Playwright assertions are created specifically for the dynamic web. Checks are automatically retried until the necessary conditions are met.

**Tracing**. Configure test retry strategy, capture execution trace, videos and screenshots to eliminate flakes.

### No trade-offs • No limits

Browsers run web content belonging to different origins in different processes. Playwright is aligned with the architecture of the modern browsers and runs tests out-of-process. This makes Playwright free of the typical in-process test runner limitations.

**Multiple everything**. Test scenarios that span multiple tabs, multiple origins and multiple users. Create scenarios with different contexts for different users and run them against your server, all in one test.

**Trusted events**. Hover elements, interact with dynamic controls and produce trusted events. Playwright uses real browser input pipeline indistinguishable from the real user.

Test frames, pierce Shadow DOM. Playwright selectors pierce shadow DOM and allow entering frames seamlessly.

### Full isolation • Fast execution

**Browser contexts**. Playwright creates a browser context for each test. Browser context is equivalent to a brand new browser profile. This delivers full test isolation with zero overhead. Creating a new browser context only takes a handful of milliseconds.

**Log in once**. Save the authentication state of the context and reuse it in all the tests. This bypasses repetitive log-in operations in each test, yet delivers full isolation of independent tests.

### Powerful Tooling

**[Codegen](https://playwright.dev/docs/codegen)**. Generate tests by recording your actions. Save them into any language.

**[Playwright inspector](https://playwright.dev/docs/inspector)**. Inspect page, generate selectors, step through the test execution, see click points and explore execution logs.

**[Trace Viewer](https://playwright.dev/docs/trace-viewer)**. Capture all the information to investigate the test failure. Playwright trace contains test execution screencast, live DOM snapshots, action explorer, test source and many more.


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
import { launch, fs } from '@cloudflare/playwright';

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
