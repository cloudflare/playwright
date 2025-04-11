import { connect, sessions, limits, acquire } from '@cloudflare/playwright';
import { testSuites, TestRunner, setUnderTest, testContextZone } from '@cloudflare/playwright/internal';

import { skipTests } from '../skipTests';

export type TestRequestPayload = {
  file: string;
  testId: string;
  fullTitle: string;
};

// eslint-disable-next-line no-console
const log = console.log.bind(console);

// eslint-disable-next-line no-console
const error = console.error.bind(console);

function send(ws: WebSocket, message: any) {
  ws.send(JSON.stringify(message));
}

const skipTestsFullTitles = new Set(skipTests.map(t => t.join(' > ')));

// ensure we are in test mode
setUnderTest(true);

export default {

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const timeout = url.searchParams.has('timeout') ? parseInt(url.searchParams.get('timeout')!, 10) * 1000 : 10_000;
    const sessionId = url.searchParams.get('sessionId') ?? undefined;
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

    const browser = await connectBrowser(env, sessionId);
    // we need to run browser rendering in dev remote mode,
    // so URL will ne a public one which is what we need
    const assetsUrl = url.origin;

    const testRunner = new TestRunner({ timeout });

    server.addEventListener('message', event => {
      const { testId, fullTitle } = JSON.parse(event.data) as TestRequestPayload;

      if (skipTestsFullTitles.has(fullTitle)) {
        log(`🚫 Skipping ${fullTitle}`);
        send(server, { testId, status: 'skipped', errors: [] });
        return;
      }

      log(`🧪 Running ${fullTitle}`);

      testContextZone.run({ env, browser, assetsUrl }, async () => {
        try {
          const result = await testRunner.runTest(file, testId);
          send(server, result);
          if (!['passed', 'skipped'].includes(result.status))
            log(`❌ ${fullTitle} failed with status ${result.status}${result.errors.length ? `: ${result.errors[0].message}` : ''}`);
        } catch (e: any) {
          server.close(1011, e.message);
        }
      }).catch(() => {});
    });
    server.addEventListener('close', () => {
      browser.close().catch(e => error(e));
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
};

async function connectBrowser(env: Env, sessionId?: string) {
  if (!sessionId) {
    const actives = await sessions(env.BROWSER);
    sessionId = actives.filter(a => !a.connectionId).map(a => a.sessionId)[0];
  }

  if (!sessionId) {
    const sessionLimits = await limits(env.BROWSER);
    if (sessionLimits.activeSessions.length > 2)
      throw new Error('Too many active sessions');
    if (sessionLimits.timeUntilNextAllowedBrowserAcquisition > 0)
      throw new Error('Cannot acquire browser yet');
    log('🚀 Launching new browser');
    sessionId = (await acquire(env.BROWSER)).sessionId;
  }

  const browser = await connect(env.BROWSER, sessionId);
  return browser;
}
