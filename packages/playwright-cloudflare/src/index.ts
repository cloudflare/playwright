import './patch';
import fs from 'fs';

import { createInProcessPlaywright } from 'playwright-core/lib/inProcessFactory';

import type { Browser, BrowserWorker, WorkersLaunchOptions } from '..';
import { storageManager } from './cloudflare/webSocketTransport';

const FAKE_HOST = 'ws://fake.host';

const playwright = createInProcessPlaywright();

export async function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser> {
  // keeps the endpoint and options for client -> server async communication
  return await storageManager.run({ endpoint, options }, 
    async () => await playwright.chromium.connectOverCDP(FAKE_HOST) as Browser
  );
}

export { fs };

export default playwright;
