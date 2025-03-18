import './patch';
import fs from 'fs';

import { createInProcessPlaywright } from 'playwright-core/lib/inProcessFactory';

import type { ActiveSession, Browser, BrowserWorker, ClosedSession, HistoryResponse, LimitsResponse, SessionsResponse, WorkersLaunchOptions } from '..';
import { storageManager } from './cloudflare/webSocketTransport';
import { wrapClientApis } from './cloudflare/wrapClientApis';

export { fs };

const playwright = createInProcessPlaywright();
wrapClientApis();

const HTTP_FAKE_HOST = 'http://fake.host';
const WS_FAKE_HOST = 'ws://fake.host';

export async function connect(endpoint: BrowserWorker, sessionId: string): Promise<Browser> {
  // keeps the endpoint and options for client -> server async communication
  return await storageManager.run({ endpoint, options: { sessionId } }, 
    async () => await playwright.chromium.connectOverCDP(WS_FAKE_HOST) as Browser
  );
}

export async function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser> {
  // keeps the endpoint and options for client -> server async communication
  return await storageManager.run({ endpoint, options }, 
    // TODO this actually connects, it doesn't launch. That means that closing the browser will not close the session
    async () => await playwright.chromium.connectOverCDP(WS_FAKE_HOST) as Browser
  );
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

export default playwright;
