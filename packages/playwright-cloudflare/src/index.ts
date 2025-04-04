import './patch';

import { createInProcessPlaywright } from 'playwright-core/lib/inProcessFactory';
import { kBrowserCloseMessageId } from 'playwright-core/lib/server/chromium/crConnection';

import { transportZone, WebSocketTransport } from './cloudflare/webSocketTransport';
import { wrapClientApis } from './cloudflare/wrapClientApis';

import type { ProtocolRequest } from 'playwright-core/lib/server/transport';
import type { CRBrowser } from 'playwright-core/lib/server/chromium/crBrowser';
import type { AcquireResponse, ActiveSession, Browser, BrowserWorker, ClosedSession, HistoryResponse, LimitsResponse, SessionsResponse, WorkersLaunchOptions } from '..';

const playwright = createInProcessPlaywright();
wrapClientApis();

const HTTP_FAKE_HOST = 'http://fake.host';
const WS_FAKE_HOST = 'ws://fake.host';

async function createBrowser(transport: WebSocketTransport): Promise<Browser> {
  return await transportZone.run(transport, async () => {
    const browser = await playwright.chromium.connectOverCDP(WS_FAKE_HOST) as Browser;
    browser.sessionId = () => transport.sessionId;
    return browser;
  });
}

export async function connect(endpoint: BrowserWorker, sessionId: string): Promise<Browser> {
  const webSocket = await connectDevtools(endpoint, sessionId);
  const transport = new WebSocketTransport(webSocket, sessionId);
  // keeps the endpoint and options for client -> server async communication
  return await createBrowser(transport);
}

export async function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser> {
  const { sessionId } = await acquire(endpoint, options);
  const webSocket = await connectDevtools(endpoint, sessionId);
  const transport = new WebSocketTransport(webSocket, sessionId);
  // keeps the endpoint and options for client -> server async communication
  const browser = await createBrowser(transport) as Browser;

  const browserImpl = (browser as any)._toImpl() as CRBrowser;
  // ensure we actually close the browser
  const doClose = async () => {
    const message: ProtocolRequest = { method: 'Browser.close', id: kBrowserCloseMessageId, params: {} };
    transport.send(message);
  };
  browserImpl.options.browserProcess = { close: doClose, kill: doClose };
  return browser;
}

async function connectDevtools(endpoint: BrowserWorker, sessionId: string): Promise<WebSocket> {
  const path = `${HTTP_FAKE_HOST}/v1/connectDevtools?browser_session=${sessionId}`;
  const response = await endpoint.fetch(path, {
    headers: {
      Upgrade: 'websocket'
    },
  });
  const webSocket = response.webSocket!;
  webSocket.accept();
  return webSocket;
}

export async function acquire(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<AcquireResponse> {
  let acquireUrl = `${HTTP_FAKE_HOST}/v1/acquire`;
  if (options?.keep_alive)
    acquireUrl = `${acquireUrl}?keep_alive=${options.keep_alive}`;

  const res = await endpoint.fetch(acquireUrl);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to create new browser: code: ${status}: message: ${text}`
    );
  }
  // Got a 200, so response text is actually an AcquireResponse
  const response: AcquireResponse = JSON.parse(text);
  return response;
}

export async function sessions(endpoint: BrowserWorker): Promise<ActiveSession[]> {
  const res = await endpoint.fetch(`${HTTP_FAKE_HOST}/v1/sessions`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch new sessions: code: ${status}: message: ${text}`
    );
  }
  const data: SessionsResponse = JSON.parse(text);
  return data.sessions;
}

export async function history(endpoint: BrowserWorker): Promise<ClosedSession[]> {
  const res = await endpoint.fetch(`${HTTP_FAKE_HOST}/v1/history`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch account history: code: ${status}: message: ${text}`
    );
  }
  const data: HistoryResponse = JSON.parse(text);
  return data.history;
}

export async function limits(endpoint: BrowserWorker): Promise<LimitsResponse> {
  const res = await endpoint.fetch(`${HTTP_FAKE_HOST}/v1/limits`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch account limits: code: ${status}: message: ${text}`
    );
  }
  const data: LimitsResponse = JSON.parse(text);
  return data;
}

export const chromium = playwright.chromium;
export const selectors = playwright.selectors;
export const devices = playwright.devices;
export const errors = playwright.errors;
export const request = playwright.request;

export default {
  chromium,
  selectors,
  devices,
  errors,
  request,
  launch,
  connect,
  sessions,
  history,
  acquire,
  limits,
};
