import { test, expect } from '../workerFixtures';
import { launch, connect, sessions, BrowserWorker, Browser, history, acquire } from '@cloudflare/playwright';

async function launchAndGetSession(endpoint: BrowserWorker): Promise<[Browser, string]> {
  const browser = await launch(endpoint);
  const sessionId = browser.sessionId();
  expect(sessionId).toBeDefined();
  return [browser, sessionId];
}

test(`should list sessions @smoke`, async ({ env }) => {
  const before = await sessions(env.BROWSER);
  const [browser, sessionId] = await launchAndGetSession(env.BROWSER);
  const after = await sessions(env.BROWSER);

  expect(before.map(a => a.sessionId)).not.toContain(sessionId);
  expect(after.map(a => a.sessionId)).toContain(sessionId);

  browser.close();
});

test(`should keep session open when closing browser created with connect`, async ({ env }) => {
  const { sessionId } = await acquire(env.BROWSER);
  const before = await sessions(env.BROWSER);

  const connectedBrowser = await connect(env.BROWSER, sessionId);
  const after = await sessions(env.BROWSER);

  // no new session created
  expect(after.map(a => a.sessionId)).toEqual(before.map(b => b.sessionId));
  await connectedBrowser.close();

  const afterClose = await sessions(env.BROWSER);
  expect(afterClose.map(b => b.sessionId)).toEqual(after.map(a => a.sessionId));
});

test(`should close session when launched browser is closed`, async ({ env }) => {
  const [browser, sessionId] = await launchAndGetSession(env.BROWSER);
  await browser.close();
  const afterClose = await sessions(env.BROWSER);
  expect(afterClose.map(a => a.sessionId)).not.toContain(sessionId);
});


test(`should add new session to history when launching browser`, async ({ env }) => {
  const before = await history(env.BROWSER);
  const [launchedBrowse, sessionId] = await launchAndGetSession(env.BROWSER);
  const after = await history(env.BROWSER);

  expect(before.map(a => a.sessionId)).not.toContain(sessionId);
  expect(after.map(a => a.sessionId)).toContain(sessionId);

  await launchedBrowse.close();
});
