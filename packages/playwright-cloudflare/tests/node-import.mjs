const { chromium } = await import('../lib/index.js');

if (typeof chromium.connectOverCDP !== 'function')
  throw new Error('Expected chromium.connectOverCDP to be available');

console.log('Cloudflare Playwright imports successfully outside Workers');
