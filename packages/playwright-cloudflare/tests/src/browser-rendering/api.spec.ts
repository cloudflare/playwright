import { launch, connect, sessions, history, acquire, limits } from '@cloudflare/playwright';
import playwright from '@cloudflare/playwright';

import { test, expect } from '../server/workerFixtures';

import type { BrowserWorker, Browser, WorkersLaunchOptions } from '@cloudflare/playwright';

async function launchAndGetSession(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<[Browser, string]> {
  const browser = await launch(endpoint, options);
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

test(`should close session after keep_alive`, async ({ env }) => {
  const [browser, sessionId] = await launchAndGetSession(env.BROWSER, { keep_alive: 15000 });
  await new Promise(resolve => setTimeout(resolve, 11000));
  const beforeKeepAlive = await sessions(env.BROWSER);
  expect(beforeKeepAlive.map(a => a.sessionId)).toContain(sessionId);
  expect(browser.isConnected()).toBe(true);
  await new Promise(resolve => setTimeout(resolve, 5000));
  const afterKeepAlive = await sessions(env.BROWSER);
  expect(afterKeepAlive.map(a => a.sessionId)).toContain(sessionId);
  expect(browser.isConnected()).toBe(true);
});

test(`should add new session to history when launching browser`, async ({ env }) => {
  const before = await history(env.BROWSER);
  const [launchedBrowser, sessionId] = await launchAndGetSession(env.BROWSER);
  const after = await history(env.BROWSER);

  expect(before.map(a => a.sessionId)).not.toContain(sessionId);
  expect(after.map(a => a.sessionId)).toContain(sessionId);

  await launchedBrowser.close();
});

test(`should show sessionId in active sessions under limits endpoint`, async ({ env }) => {
  const [launchedBrowser, sessionId] = await launchAndGetSession(env.BROWSER);

  const response = await limits(env.BROWSER);
  expect(response.activeSessions.map(s => s.id)).toContain(sessionId);

  await launchedBrowser.close();
});

test(`should have functions in default exported object`, () => {
  expect(playwright.launch).toBe(launch);
  expect(playwright.connect).toBe(connect);
  expect(playwright.sessions).toBe(sessions);
  expect(playwright.history).toBe(history);
  expect(playwright.acquire).toBe(acquire);
  expect(playwright.limits).toBe(limits);
});
