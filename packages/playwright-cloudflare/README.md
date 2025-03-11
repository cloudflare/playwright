# Playwright Browser Rendering

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
