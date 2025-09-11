import { launch, connect, sessions, history, acquire, limits, endpointURLString } from '@cloudflare/playwright';
import playwright from '@cloudflare/playwright';

import { test, expect } from '../server/workerFixtures';

import type { BrowserWorker, Browser, WorkersLaunchOptions } from '@cloudflare/playwright';

async function launchAndGetSession(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<[Browser, string]> {
  const browser = await launch(endpoint, options);
  const sessionId = browser.sessionId();
  expect(sessionId).toBeDefined();
  return [browser, sessionId];
}

test(`should list sessions @smoke`, async ({ binding }) => {
  const before = await sessions(binding);
  const [browser, sessionId] = await launchAndGetSession(binding);
  const after = await sessions(binding);

  expect(before.map(a => a.sessionId)).not.toContain(sessionId);
  expect(after.map(a => a.sessionId)).toContain(sessionId);

  browser.close();
});

test(`should keep session open when closing browser created with connect`, async ({ binding }) => {
  const { sessionId } = await acquire(binding);
  const before = await sessions(binding);

  const connectedBrowser = await connect(binding, sessionId);
  const after = await sessions(binding);

  // no new session created
  expect(after.map(a => a.sessionId)).toEqual(before.map(b => b.sessionId));
  await connectedBrowser.close();

  const afterClose = await sessions(binding);
  expect(afterClose.map(b => b.sessionId)).toEqual(after.map(a => a.sessionId));
});

test(`should close session when launched browser is closed`, async ({ binding }) => {
  const [browser, sessionId] = await launchAndGetSession(binding);
  await browser.close();
  const afterClose = await sessions(binding);
  expect(afterClose.map(a => a.sessionId)).not.toContain(sessionId);
});

test(`should close session after keep_alive`, async ({ binding }) => {
  const [browser, sessionId] = await launchAndGetSession(binding, { keep_alive: 15000 });
  await new Promise(resolve => setTimeout(resolve, 11000));
  const beforeKeepAlive = await sessions(binding);
  expect(beforeKeepAlive.map(a => a.sessionId)).toContain(sessionId);
  expect(browser.isConnected()).toBe(true);
  await new Promise(resolve => setTimeout(resolve, 5000));
  const afterKeepAlive = await sessions(binding);
  expect(afterKeepAlive.map(a => a.sessionId)).toContain(sessionId);
  expect(browser.isConnected()).toBe(true);
});

test(`should add new session to history when launching browser`, async ({ binding }) => {
  const before = await history(binding);
  const [launchedBrowser, sessionId] = await launchAndGetSession(binding);
  const after = await history(binding);

  expect(before.map(a => a.sessionId)).not.toContain(sessionId);
  expect(after.map(a => a.sessionId)).toContain(sessionId);

  await launchedBrowser.close();
});

test(`should show sessionId in active sessions under limits endpoint`, async ({ binding }) => {
  const [launchedBrowser, sessionId] = await launchAndGetSession(binding);

  const response = await limits(binding);
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

test(`should create endpoint url`, async ({ binding }) => {
  const url1 = endpointURLString(binding);
  expect(url1).toContain('http://fake.host/v1/connectDevtools?browser_binding=BROWSER');

  const url2 = endpointURLString('BROWSER');
  expect(url2).toContain('http://fake.host/v1/connectDevtools?browser_binding=BROWSER');

  // @ts-expect-error
  expect(() => endpointURLString('UNEXISTENT_BROWSER')).toThrow();
});

test(`should create browser with persistent context on playwright.chromium.connectOverCDP`, async ({ binding, playwright }) => {
  const url = endpointURLString(binding);
  const browser = await playwright.chromium.connectOverCDP(url);
  expect(browser.contexts()).toHaveLength(1);
  const [context] = browser.contexts();
  expect(context.pages()).toHaveLength(1);
  const [page] = context.pages();
  expect(page.viewportSize()).toEqual({ width: 1280, height: 720 });
  await browser.close();
});

test(`should launch browser with no persistent context by default`, async ({ binding }) => {
  const url = endpointURLString(binding);
  const browser = await launch(url);
  expect(browser.contexts()).toHaveLength(0);
  await browser.close();
});

test(`should launch browser with persistent context is persistent=true`, async ({ binding }) => {
  const url = endpointURLString(binding, { persistent: true });
  const browser = await launch(url);
  expect(browser.contexts()).toHaveLength(1);
  await browser.close();
});
