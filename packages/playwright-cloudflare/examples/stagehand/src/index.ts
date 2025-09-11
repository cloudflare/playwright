import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { endpointURLString } from "@cloudflare/playwright";
import { createWorkersAI } from "workers-ai-provider";
import { AISdkClient } from "./aidsk";

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname !== "/")
      return new Response("Not found", { status: 404 });
    
    const workersai = createWorkersAI({ binding: env.AI });
    const modelName = url.searchParams.get("model") || "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
    // @ts-ignore
    const model = workersai(modelName);

    const stagehand = new Stagehand({
      env: "LOCAL",
      localBrowserLaunchOptions: { cdpUrl: endpointURLString("BROWSER") },
      llmClient: new AISdkClient({ model }),
      verbose: 1,
    });

    await stagehand.init();
    const page = stagehand.page;
    
    await page.goto('https://www.themoviedb.org/');
    // for multi-step actions, use observe
    const actions = await page.observe('Search for "The Iron Giant" and click the Search button');
    for (const action of actions)
      await page.act(action);
    await page.act('Click the first search result');
    let movieInfo = await page.extract({
      instruction: 'Extract movie information',
      schema: z.object({
        title: z.string(),
        year: z.number(),
        director: z.string(),
      }),
    });

    const screenshot = await page.screenshot();
    await stagehand.close();

    return new Response(`
      <html>
        <head>
          <title>Cloudflare Stagehand Example</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          <h1>Stagehand Example</h1>
          <p>This example shows how to use <a href="https://www.stagehand.dev/">stagehand</a> to extract information from a web page.</p>
          <h2>Movie Information</h2>
          <div>
            <p><b>Title:</b> ${movieInfo.title}</p>
            <p><b>Release Year:</b> ${movieInfo.year}</p>
            <p><b>Director:</b> ${movieInfo.director}</p>
          </div>
          <img src="data:image/png;base64,${screenshot.toString('base64')}" />
        </body>
      </html>
    `, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  },
};
