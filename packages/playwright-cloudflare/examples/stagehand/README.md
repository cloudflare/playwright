# Cloudflare Stagehand Example

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/playwright/tree/main/packages/playwright-cloudflare/examples/stagehand)

This example demonstrates how to run integrate Stagehand in a Cloudflare Worker to extract information from a movie from The Movie Database.

It uses Workers AI [@cf/meta/llama-3.3-70b-instruct-fp8-fast](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/) as the model by default.

## Setup

1. Install dependencies:
```bash
npm ci
```

2. Build the project:
```bash
npm run build
```

3. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Usage

Once deployed, you can interact with the Worker using these URL patterns:

```
https://<your-worker>.workers.dev
```

This will search for a movie and return a page with the movie information and a screenshot.

## Use another model

You can use another model, like OpenAI.
For that, you need a OpenAI API key (it's strongly recommended to keep it as a [https://developers.cloudflare.com/workers/configuration/secrets/](https://developers.cloudflare.com/workers/configuration/secrets/)).

You can then configure Stagehand to use OpenAI:

```typescript
const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: { cdpUrl: endpointURLString("BROWSER") },
  modelName: "openai/gpt-4.1",
  modelClientOptions: {
    apiKey: env.OPENAI_API_KEY,
  },
});
```

## Use Cloudflare AI Gateway

You can configure Stagehand to use [Cloudflare AI Gateway](https://www.cloudflare.com/developer-platform/products/ai-gateway/) too.
For instance, if you use OpenAI, after creating a gateway (its name corresponds to the `AI_GATEWAY_ID`), you can configure it like this:

```typescript
const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: { cdpUrl: endpointURLString("BROWSER") },
  modelName: "openai/gpt-4.1",
  modelClientOptions: {
    apiKey: env.OPENAI_API_KEY,
    baseURL: `https://gateway.ai.cloudflare.com/v1/${env.CLOUDFLARE_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/openai`,
  },
});
```
