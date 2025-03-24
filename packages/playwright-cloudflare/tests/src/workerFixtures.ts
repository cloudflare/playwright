import type { Browser, BrowserType, BrowserContext, Page, Frame, PageScreenshotOptions, ViewportSize } from "@cloudflare/playwright/test";
import type { BrowserContextOptions, ScreenshotMode, VideoMode } from "../../types/test";
import { expect } from "@cloudflare/playwright/test";
import { _baseTest, debug } from "@cloudflare/playwright/internal";
import playwright from "@cloudflare/playwright";

export { expect } from '@cloudflare/playwright/test';

export type WorkersWorkerFixtures = {
  env: Env;
}

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
}

export type ServerFixtures = {
  server: TestServer;
  httpsServer: TestServer;
  asset: (p: string) => string;
  loopback?: string;
}

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

let env: Env | undefined = undefined;
export function setCurrentEnv(e?: Env) {
  env = e;
}

let browser: Browser | undefined = undefined;
export function setCurrentBrowser(b?: Browser) {
  browser = b;
}

let assetsUrl: string | undefined;
export function setAssetsUrl(url: string) {
  assetsUrl = url;
}

export const test = platformTest.extend<PageTestFixtures & ServerFixtures & TestModeTestFixtures & BrowserTestTestFixtures, WorkersWorkerFixtures & PlaywrightWorkerArgs & BrowserTestWorkerFixtures & PageWorkerFixtures & TestModeWorkerOptions>({
  headless: [true, { scope: 'worker' }],
  channel: ['stable', { scope: 'worker' }],
  screenshot: ['off', { scope: 'worker' }],
  trace: ['off', { scope: 'worker' }],
  video: ['off', { scope: 'worker' }],
  browserName: ['chromium', { scope: 'worker' }],

  env: [async ({}, run) => {
    if (!env)
      throw new Error('Env not initialized');
    await run(env);
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
    if (!browser)
      throw new Error('Browser not initialized');
    await run(browser);
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
    if (!assetsUrl)
      throw new Error('Assets URL not set');

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
    await use (obj => obj._toImpl());
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

export const playwrightTest = test;
export const browserTest = test;
export const contextTest = test;

export function chromiumVersionLessThan(a: string, b: string) {
  const left: number[] = a.split('.').map(e => Number(e));
  const right: number[] = b.split('.').map(e => Number(e));
  for (let i = 0; i < 4; i++) {
    if (left[i] > right[i])
      return false;
    if (left[i] < right[i])
      return true;
  }
  return false;
}

export const kTargetClosedErrorMessage = 'Target page, context or browser has been closed';

export async function attachFrame(page: Page, frameId: string, url: string): Promise<Frame> {
  const handle = await page.evaluateHandle(async ({ frameId, url }) => {
    const frame = document.createElement('iframe');
    frame.src = url;
    frame.id = frameId;
    document.body.appendChild(frame);
    await new Promise(x => frame.onload = x);
    return frame;
  }, { frameId, url });
  return handle.asElement().contentFrame() as Promise<Frame>;
}

export async function detachFrame(page: Page, frameId: string) {
  await page.evaluate(frameId => {
    document.getElementById(frameId)!.remove();
  }, frameId);
}

export async function verifyViewport(page: Page, width: number, height: number) {
  expect(page.viewportSize()!.width).toBe(width);
  expect(page.viewportSize()!.height).toBe(height);
  expect(await page.evaluate('window.innerWidth')).toBe(width);
  expect(await page.evaluate('window.innerHeight')).toBe(height);
}

const ansiRegex = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))', 'g');
export function stripAnsi(str: string): string {
  return str.replace(ansiRegex, '');
}

export function expectedSSLError(browserName: string, platform: string): RegExp {
  if (browserName === 'chromium')
    return /net::(ERR_CERT_AUTHORITY_INVALID|ERR_CERT_INVALID)/;
  if (browserName === 'webkit') {
    if (platform === 'darwin')
      return /The certificate for this server is invalid/;
    else if (platform === 'win32')
      return /SSL peer certificate or SSH remote key was not OK/;
    else
      return /Unacceptable TLS certificate/;
  }
  return /SSL_ERROR_UNKNOWN/;
}
