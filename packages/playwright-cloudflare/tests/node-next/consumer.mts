import { chromium } from '@cloudflare/playwright';
import { expect } from '@cloudflare/playwright/test';
import type { Browser } from '@cloudflare/playwright';

const browser: Browser = await chromium.connectOverCDP('ws://127.0.0.1:9222');
expect(browser).toBeDefined();
await browser.close();
