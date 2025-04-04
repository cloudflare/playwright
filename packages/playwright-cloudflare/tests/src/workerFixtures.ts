/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { _baseTest } from '@cloudflare/playwright/internal';
import playwright from '@cloudflare/playwright';

import type { Browser, BrowserType, BrowserContext, Page, Frame, PageScreenshotOptions, Locator, ViewportSize } from '@cloudflare/playwright/test';
import type { BrowserContextOptions, ScreenshotMode, VideoMode } from '../../types/test';

export { expect } from '@cloudflare/playwright/test';

export type BoundingBox = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>;

export type WorkersWorkerFixtures = {
  env: Env;
};

export type PlatformWorkerFixtures = {
  platform: 'win32' | 'darwin' | 'linux';
  isWindows: boolean;
  isMac: boolean;
  isLinux: boolean;
};

export const platformTest = _baseTest.extend<{}, PlatformWorkerFixtures>({
  platform: ['linux', { scope: 'worker' }],
  isWindows: [({ platform }, run) => run(platform === 'win32'), { scope: 'worker' }],
  isMac: [({ platform }, run) => run(platform === 'darwin'), { scope: 'worker' }],
  isLinux: [({ platform }, run) => run(platform === 'linux'), { scope: 'worker' }],
});

export interface PlaywrightWorkerArgs {
  playwright: typeof import('@cloudflare/playwright');
  browser: Browser;
}

export type PageTestFixtures = {
  context: BrowserContext;
  page: Page;
};

type TestServer = {
  PREFIX: string;
  EMPTY_PAGE: string;
  setRoute(): Promise<void>;
  waitForRequest(): Promise<void>;
};

export type ServerFixtures = {
  server: TestServer;
  httpsServer: TestServer;
  asset: (p: string) => string;
  loopback?: string;
};

export type PageWorkerFixtures = {
  headless: boolean;
  channel: string;
  screenshot: ScreenshotMode | { mode: ScreenshotMode } & Pick<PageScreenshotOptions, 'fullPage' | 'omitBackground'>;
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' | 'retain-on-first-failure' | 'on-all-retries' | /** deprecated */ 'retry-with-trace';
  video: VideoMode | { mode: VideoMode, size: ViewportSize };
  browserName: 'chromium' | 'firefox' | 'webkit';
  browserVersion: string;
  browserMajorVersion: number;
  isAndroid: boolean;
  isElectron: boolean;
  isWebView2: boolean;
};

export type BrowserTestWorkerFixtures = PageWorkerFixtures & {
  browserVersion: string;
  defaultSameSiteCookieValue: string;
  allowsThirdParty: boolean;
  browserMajorVersion: number;
  browserType: BrowserType;
  isAndroid: boolean;
  isElectron: boolean;
};

type BrowserTestTestFixtures = {
  contextFactory: (options?: BrowserContextOptions) => Promise<BrowserContext>;
};

export type TestModeName = 'default' | 'driver' | 'service' | 'service2';

export type TestModeWorkerOptions = {
  mode: TestModeName;
};

export type TestModeTestFixtures = {
  toImpl: (rpcObject?: any) => any;
};

export type Context = {
  env: Env;
  browser: Browser;
  assetsUrl: string;
};

export function setCurrentContext(context?: Context) {
  (global as any)['__TEST_GLOBALS'] = context;
}

export function currentContext() {
  const context = (global as any)['__TEST_GLOBALS'];
  if (!context)
    throw new Error('Context not initialized');
  return context;
}

export const test = platformTest.extend<PageTestFixtures & ServerFixtures & TestModeTestFixtures & BrowserTestTestFixtures, WorkersWorkerFixtures & PlaywrightWorkerArgs & BrowserTestWorkerFixtures & PageWorkerFixtures & TestModeWorkerOptions>({
  headless: [true, { scope: 'worker' }],
  channel: ['stable', { scope: 'worker' }],
  screenshot: ['off', { scope: 'worker' }],
  trace: ['off', { scope: 'worker' }],
  video: ['off', { scope: 'worker' }],
  browserName: ['chromium', { scope: 'worker' }],

  env: [async ({}, run) => {
    await run(currentContext().env);
  }, { scope: 'worker' }],

  browserVersion: [async ({ browser }, run) => {
    await run(browser.version());
  }, { scope: 'worker' }],

  browserMajorVersion: [async ({ browserVersion }, run) => {
    await run(Number(browserVersion.split('.')[0]));
  }, { scope: 'worker' }],

  isAndroid: [false, { scope: 'worker' }],
  isElectron: [false, { scope: 'worker' }],
  isWebView2: [false, { scope: 'worker' }],


  browserType: [async ({ playwright, browserName, }, run) => {
    await run(playwright[browserName]);
  }, { scope: 'worker' }],

  playwright: [async ({}, run) => run(playwright), { scope: 'worker' }],

  browser: [async ({}, run) => {
    await run(currentContext().browser);
  }, { scope: 'worker' }],

  context: async ({ contextFactory }, run) => {
    await run(await contextFactory());
  },

  page: async ({ context }, run) => {
    const page = await context.newPage();
    await run(page);
    await page.close();
  },

  server: async ({}, run, testInfo) => {
    const assetsUrl = currentContext().assetsUrl;

    await run({
      PREFIX: assetsUrl,
      EMPTY_PAGE: `${assetsUrl}/empty.html`,
      setRoute: async () => testInfo.skip(true, 'setRoute not supported, skipping'),
      waitForRequest: async () => testInfo.skip(true, 'waitForRequest not supported, skipping'),
    });
  },

  httpsServer: async ({}, run, testInfo) => {
    testInfo.skip(true, 'httpsServer not supported, skipping');
  },


  asset: async ({}, run, testInfo) => {
    testInfo.skip(true, 'assets not supported, skipping');
  },

  mode: ['service', { scope: 'worker', option: true }],

  toImpl: async ({}, use) => {
    await use(obj => obj._toImpl());
  },

  loopback: async ({}, run, testInfo) => {
    testInfo.skip(true, 'assets not supported, skipping');
  },

  contextFactory: async ({ browser }: any, run) => {
    const contexts: BrowserContext[] = [];
    await run(async options => {
      const context = await browser.newContext(options);
      contexts.push(context);
      return context;
    });
    for (const context of contexts)
      await context.close();
  },
});

export async function rafraf(target: Page | Frame, count = 1) {
  for (let i = 0; i < count; i++) {
    await target.evaluate(async () => {
      await new Promise(f => window.builtinRequestAnimationFrame(() => window.builtinRequestAnimationFrame(f)));
    });
  }
}

export function roundBox(box: BoundingBox): BoundingBox {
  return {
    x: Math.round(box.x),
    y: Math.round(box.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };
}

export const playwrightTest = test;
export const browserTest = test;
export const contextTest = test;
