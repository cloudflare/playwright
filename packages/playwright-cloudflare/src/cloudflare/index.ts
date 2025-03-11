import fs from 'fs';

import { createInProcessPlaywright } from 'playwright-core/lib/inProcessFactory';

import type { Browser, BrowserWorker, WorkersLaunchOptions } from '../..';
import { kBrowserConnectParams } from './workersWebSocketTransport';

const FAKE_HOST = 'ws://fake.host';

const playwright = createInProcessPlaywright();

export async function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser> {
  if ((globalThis as any)[kBrowserConnectParams])
    throw new Error('It seems like you are trying to launch while another launch is in progress');
  // TODO huge hack to pass the cloudflare params to webSocketTransport
  (globalThis as any)[kBrowserConnectParams] = { endpoint, options };
  try {
    return await playwright.chromium.connectOverCDP(FAKE_HOST) as Browser;
  } finally {
    delete (globalThis as any)[kBrowserConnectParams];
  }
}

export { fs };

export default playwright;
