import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './proxyTests',
  reporter: process.env.CI ? 'dot' : 'list',
  workers: 1,
  projects: [
    {
      name: 'workers',
    },
  ]
});
