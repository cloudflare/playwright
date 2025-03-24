import { launch, connect, sessions, limits, acquire } from '@cloudflare/playwright';

import { testSuites, TestRunner } from '@cloudflare/playwright/internal';
import { setAssetsUrl, setCurrentBrowser, setCurrentEnv } from './workerFixtures';

import { skipTests } from './tests';

export type TestRequestPayload = {
  file: string;
  testId: string;
  fullTitle: string;
}

function send(ws: WebSocket, message: any) {
  ws.send(JSON.stringify(message));
}

const skipTestsFullTitles = new Set(skipTests.map(t => t.join(' > ')));

export default {
  
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const timeout = url.searchParams.has('timeout') ? parseInt(url.searchParams.get('timeout')!, 10) * 1000 : 10_000;
    const file = url.pathname.substring(1);

    const upgradeHeader = request.headers.get('Upgrade');
    
    if (upgradeHeader !== 'websocket') {
      const suites = await testSuites();
      const response = file ? suites.find(s => s.file === file) : suites;
      return response ? Response.json(response) : new Response('Not found', { status: 404 });
    }
    
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    server.accept();
    
    setCurrentEnv(env);

    const browser = await connectBrowser(env);
    setCurrentBrowser(browser);
    // we need to run browser rendering in dev remote mode,
    // so URL will ne a public one which is what we need
    setAssetsUrl(url.origin);

    const testRunner = new TestRunner({ timeout });

    server.addEventListener('message', event => {
      const { testId, fullTitle } = JSON.parse(event.data) as TestRequestPayload;

      if (skipTestsFullTitles.has(fullTitle)) {
        console.log(`🚫 Skipping ${fullTitle}`);
        send(server, { testId, status: 'skipped', errors: [] });
        return;
      }

      console.log(`🧪 Running ${fullTitle}`);
      
      testRunner.runTest(file, testId)
        .then(result => send(server, result))
        .catch(e => server.close(1011, e.message));
    });
    server.addEventListener('close', () => {
      browser.close().catch(e => console.error(e));
      setCurrentBrowser(undefined);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
};

async function connectBrowser(env: Env) {
  const actives = await sessions(env.BROWSER);
  let [sessionId] = actives.filter(a => !a.connectionId).map(a => a.sessionId);

  if (!sessionId) {
    const sessionLimits = await limits(env.BROWSER);
    if (sessionLimits.activeSessions.length > 2)
      throw new Error('Too many active sessions');
    if (sessionLimits.timeUntilNextAllowedBrowserAcquisition > 0)
      throw new Error('Cannot acquire browser yet');
    console.log('🚀 Launching new browser');
    sessionId = (await acquire(env.BROWSER)).sessionId;
  }

  const browser = await connect(env.BROWSER, sessionId);
  return browser;
}
