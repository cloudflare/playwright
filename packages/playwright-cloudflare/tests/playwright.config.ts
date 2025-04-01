import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './proxyTests',
  reporter: process.env.CI ? 'blob' : 'html',
  workers: 1,
  projects: [
    {
      name: 'proxy',
    },
  ]
});
