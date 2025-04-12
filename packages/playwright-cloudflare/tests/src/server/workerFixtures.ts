import { _baseTest, currentTestContext, runWithExpectApiListener } from '@cloudflare/playwright/internal';
import playwright, { connect } from '@cloudflare/playwright';

import type { TestInfo, ScreenshotMode, VideoMode } from '../../../types/test';
import type { BrowserContextOptions, Browser, BrowserType, BrowserContext, Page, Frame, PageScreenshotOptions, Locator, ViewportSize, Playwright } from '@cloudflare/playwright/test';

export { expect } from '@cloudflare/playwright/test';
export { mergeTests } from '@cloudflare/playwright/internal';

export type BoundingBox = NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>;

export type WorkersWorkerFixtures = {
  env: Env;
  sessionId: string;
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
  playwright: Playwright;
  browser: Browser;
}

export type PageTestFixtures = {
  context: BrowserContext;
  page: Page;
};

class TestServer {
  private _testInfo: TestInfo;
  readonly PREFIX: string;
  readonly CROSS_PROCESS_PREFIX: string;
  readonly EMPTY_PAGE: string;

  constructor(testInfo: TestInfo, assetsUrl: string) {
    this._testInfo = testInfo;
    this.PREFIX = assetsUrl;
    this.CROSS_PROCESS_PREFIX = assetsUrl.replace(/\:\/\/([^.]+)\./, '://$1-cross-origin.');
    this.EMPTY_PAGE = `${assetsUrl}/empty.html`;
  }

  get PORT() {
    this._testInfo.skip(true, 'server.PORT not supported, skipping');
    return 443;
  }

  onceWebSocketConnection() {
    this._testInfo.skip(true, 'onceWebSocketConnection not supported, skipping');
  }

  setAuth() {
    this._testInfo.skip(true, 'setAuth not supported, skipping');
  }

  setRoute() {
    this._testInfo.skip(true, 'setRoute not supported, skipping');
  }

  waitForRequest() {
    this._testInfo.skip(true, 'waitForRequest not supported, skipping');
  }

  waitForUpgrade() {
    this._testInfo.skip(true, 'waitForUpgrade not supported, skipping');
  }

  waitForWebSocket() {
    this._testInfo.skip(true, 'waitForWebSocket not supported, skipping');
  }

  enableGzip() {
    this._testInfo.skip(true, 'enableGzip not supported, skipping');
  }

  setRedirect() {
    this._testInfo.skip(true, 'setRedirect not supported, skipping');
  }

  setCSP() {
    this._testInfo.skip(true, 'setCSP not supported, skipping');
  }

  sendOnWebSocketConnection() {
    this._testInfo.skip(true, 'sendOnWebSocketConnection not supported, skipping');
  }
}

export type ServerFixtures = {
  server: TestServer;
  httpsServer: TestServer;
  proxyServer: never;
  asset: (p: string) => string;
  loopback?: never;
};

export type PageWorkerFixtures = {
  headless: boolean;
  channel: string;
  screenshot: ScreenshotMode | { mode: ScreenshotMode } & Pick<PageScreenshotOptions, 'fullPage' | 'omitBackground'>;
  trace: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' | 'retain-on-first-failure' | 'on-all-retries' | /** deprecated */ 'retry-with-trace';
  video: VideoMode | { mode: VideoMode, size: ViewportSize };
  browserName: 'chromium';
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
  hasTouch: boolean;
  _combinedContextOptions: BrowserContextOptions,
  _setupArtifacts: void,
  contextFactory: (options?: BrowserContextOptions) => Promise<BrowserContext>;
  launchPersistent: () => never;
};

export type TestModeName = 'default' | 'driver' | 'service' | 'service2';

export type TestModeWorkerOptions = {
  mode: TestModeName;
};

export type TestModeTestFixtures = {
  toImpl: (rpcObject?: any) => any;
};

export const test = platformTest.extend<PageTestFixtures & ServerFixtures & TestModeTestFixtures & BrowserTestTestFixtures, WorkersWorkerFixtures & PlaywrightWorkerArgs & BrowserTestWorkerFixtures & PageWorkerFixtures & TestModeWorkerOptions>({
  headless: [true, { scope: 'worker' }],
  channel: ['stable', { scope: 'worker' }],
  screenshot: ['off', { scope: 'worker' }],
  trace: ['off', { scope: 'worker' }],
  video: ['off', { scope: 'worker' }],
  browserName: ['chromium', { scope: 'worker' }],

  hasTouch: [false, { option: true }],
  _combinedContextOptions: async ({ hasTouch }, run) => {
    await run({
      hasTouch,
    });
  },

  env: [async ({}, run) => {
    await run(currentTestContext().env);
  }, { scope: 'worker' }],

  sessionId: [async ({}, run) => {
    await run(currentTestContext().sessionId);
  }, { scope: 'worker' }],

  browserVersion: [async ({ browser }, run) => {
    await run(browser.version());
  }, { scope: 'worker' }],

  defaultSameSiteCookieValue: ['Lax', { scope: 'worker' }],

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

  browser: [async ({ env, sessionId }, run) => {
    const browser = await connect(env.BROWSER, sessionId);
    await run(browser);
    await browser.close();
  }, { scope: 'worker' }],

  context: async ({ contextFactory, _combinedContextOptions }, run) => {
    await run(await contextFactory(_combinedContextOptions));
  },

  page: async ({ context }, run) => {
    const page = await context.newPage();
    await run(page);
    await page.close();
  },

  server: async ({}, run, testInfo) => {
    const assetsUrl = currentTestContext().assetsUrl;
    await run(new TestServer(testInfo, assetsUrl));
  },

  httpsServer: async ({ server }, run, testInfo) => {
    await run(server);
  },

  proxyServer: async ({}, run, testInfo) => {
    testInfo.skip(true, 'proxyServer not supported, skipping');
  },

  asset: async ({}, run) => {
    await run((p: string) => `/assets/${p}`);
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

  launchPersistent: async ({}, run, testInfo) => {
    testInfo.skip(true, 'launchPersistent not supported, skipping');
  },

  _setupArtifacts: [async ({}, use) => {
    await runWithExpectApiListener(use);
  }, { auto: 'all-hooks-included', timeout: 0 } as any],
});

export async function rafraf(target: Page | Frame, count = 1) {
  for (let i = 0; i < count; i++) {
    await target.evaluate(async () => {
      // @ts-ignore
      await new Promise(f => window.builtins.requestAnimationFrame(() => window.builtins.requestAnimationFrame(f)));
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

export const devices = [];
export const playwrightTest = test;
export const browserTest = test;
export const contextTest = test;
