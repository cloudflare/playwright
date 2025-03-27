import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./proxyTests/**/*.(spec|test).ts'],
    hookTimeout: 30_000,
    testTimeout: 30_000,
    maxConcurrency: 1,
    minWorkers: 1,
    maxWorkers: 1,
    globalSetup: './src/globalSetup.ts',
  },
});