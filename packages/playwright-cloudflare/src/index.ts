import './patch';

import { createInProcessPlaywright } from 'playwright-core/lib/inProcessFactory';
import { kBrowserCloseMessageId } from 'playwright-core/lib/server/chromium/crConnection';
import { env } from 'cloudflare:workers';
import { setTimeOrigin, timeOrigin } from 'playwright-core/lib/utils/isomorphic/time';

import { transportZone, WebSocketTransport } from './cloudflare/webSocketTransport';
import { wrapClientApis } from './cloudflare/wrapClientApis';
import { unsupportedOperations } from './cloudflare/unsupportedOperations';
import * as packageJson from '../package.json';
import { acquire, extractOptions, getBrowserBinding, limits, sessions, history, HTTP_FAKE_HOST, WS_FAKE_HOST } from './session-management';

import type { ProtocolRequest } from 'playwright-core/lib/server/transport';
import type { CRBrowser } from 'playwright-core/lib/server/chromium/crBrowser';
import type { Browser, BrowserBindingKey, BrowserEndpoint, BrowserWorker, ConnectOverCDPOptions, WorkersLaunchOptions } from '..';

export { sessions, history, acquire, limits } from './session-management';

function resetMonotonicTime() {
  // performance.timeOrigin is always 0 in Cloudflare Workers. Besides, Date.now() is 0 in global scope,
  // so we need to set it to the current time inside a event handler, where Date.now() is not 0.
  // https://stackoverflow.com/a/58491358
  if (timeOrigin() === 0 && Date.now() !== 0)
    setTimeOrigin(Date.now());
}

const playwright = createInProcessPlaywright();
unsupportedOperations(playwright);
wrapClientApis();

const originalConnectOverCDP = playwright.chromium.connectOverCDP;
// playwright-mcp uses playwright.chromium.connectOverCDP if a CDP endpoint is passed,
// so we need to override it to use our own connectOverCDP implementation
(playwright.chromium as any).connectOverCDP = (endpointURLOrOptions: (ConnectOverCDPOptions & { wsEndpoint?: string }) | string) => {
  const wsEndpoint = typeof endpointURLOrOptions === 'string' ? endpointURLOrOptions : endpointURLOrOptions.wsEndpoint ?? endpointURLOrOptions.endpointURL;
  if (!wsEndpoint)
    throw new Error('No wsEndpoint provided');
  const wsUrl = new URL(wsEndpoint);
  // by default, playwright.chromium.connectOverCDP enforces persistent to true (the default behavior upstream)
  if (!wsUrl.searchParams.has('persistent'))
    wsUrl.searchParams.set('persistent', 'true');
  return wsUrl.searchParams.has('browser_session')
    ? connect(wsUrl.toString())
    : launch(wsUrl.toString());
};

async function connectDevtools(endpoint: BrowserEndpoint, options: { sessionId: string, persistent?: boolean }): Promise<WebSocket> {
  resetMonotonicTime();
  const url = new URL(`${HTTP_FAKE_HOST}/v1/connectDevtools`);
  url.searchParams.set('browser_session', options.sessionId);
  if (options.persistent)
    url.searchParams.set('persistent', 'true');
  const response = await getBrowserBinding(endpoint).fetch(url, {
    headers: {
      'Upgrade': 'websocket',
      'cf-brapi-client': `@cloudflare/playwright@${packageJson.version}`,
    },
  });
  const webSocket = response.webSocket!;
  webSocket.accept();
  return webSocket;
}

export function endpointURLString(binding: BrowserWorker | BrowserBindingKey, options?: { sessionId?: string, persistent?: boolean, keepAlive?: number }): string {
  const bindingKey = typeof binding === 'string' ? binding : Object.keys(env).find(key => (env as any)[key] === binding);
  if (!bindingKey || !(bindingKey in env))
    throw new Error(`No binding found for ${binding}`);

  const url = new URL(`${HTTP_FAKE_HOST}/v1/connectDevtools`);
  url.searchParams.set('browser_binding', bindingKey);
  if (options?.sessionId)
    url.searchParams.set('browser_session', options.sessionId);
  if (options?.persistent)
    url.searchParams.set('persistent', 'true');
  if (options?.keepAlive)
    url.searchParams.set('keep_alive', options.keepAlive.toString());
  return url.toString();
}

async function createBrowser(transport: WebSocketTransport, options?: { persistent?: boolean }): Promise<Browser> {
  return await transportZone.run(transport, async () => {
    const url = new URL(WS_FAKE_HOST);
    if (options?.persistent)
      url.searchParams.set('persistent', 'true');
    const browser = await originalConnectOverCDP.call(playwright.chromium, url.toString(), {}) as Browser;
    browser.sessionId = () => transport.sessionId;
    return browser;
  });
}

export async function connect(endpoint: string | URL): Promise<Browser>;
export async function connect(endpoint: BrowserWorker, sessionIdOrOptions: string | { sessionId: string, persistent?: boolean }): Promise<Browser>;
export async function connect(endpoint: BrowserEndpoint, sessionIdOrOptions?: string | { sessionId: string, persistent?: boolean }): Promise<Browser> {
  const extraOptions = typeof sessionIdOrOptions === 'string' ? { sessionId: sessionIdOrOptions } : sessionIdOrOptions ?? {};
  const options = { ...extractOptions(endpoint), ...extraOptions };
  if (!options.sessionId)
    throw new Error(`Session ID is required for connect()`);

  const webSocket = await connectDevtools(getBrowserBinding(endpoint), options as { sessionId: string });
  const transport = new WebSocketTransport(webSocket, options.sessionId);
  // keeps the endpoint and options for client -> server async communication
  return await createBrowser(transport, options);
}

export async function launch(endpoint: BrowserEndpoint, launchOptions?: WorkersLaunchOptions & { persistent?: boolean }): Promise<Browser> {
  const { sessionId } = await acquire(endpoint, launchOptions);
  const options = { ...extractOptions(endpoint), ...launchOptions, sessionId };
  const webSocket = await connectDevtools(getBrowserBinding(endpoint), options);
  const transport = new WebSocketTransport(webSocket, sessionId);
  // keeps the endpoint and options for client -> server async communication
  const browser = await createBrowser(transport, options) as Browser;

  const browserImpl = (browser as any)._toImpl() as CRBrowser;
  // ensure we actually close the browser
  const doClose = async () => {
    const message: ProtocolRequest = { method: 'Browser.close', id: kBrowserCloseMessageId, params: {} };
    transport.send(message);
  };
  browserImpl.options.browserProcess = { close: doClose, kill: doClose };
  return browser;
}

export const chromium = playwright.chromium;
export const selectors = playwright.selectors;
export const devices = playwright.devices;
export const errors = playwright.errors;
export const request = playwright.request;
export const _instrumentation = playwright._instrumentation;

export default {
  chromium,
  selectors,
  devices,
  errors,
  request,
  _instrumentation,
  endpointURLString,
  launch,
  connect,
  sessions,
  history,
  acquire,
  limits,
};
