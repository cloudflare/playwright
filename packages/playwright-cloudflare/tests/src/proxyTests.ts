import { MessageEvent, WebSocket } from 'ws';
import { test as baseTest } from '@playwright/test';

import { ManualPromise } from './manualPromise';

import type { TestInfo } from '@playwright/test';
import type { AcquireResponse } from '@cloudflare/playwright';
import type { TestEndPayload } from '@cloudflare/playwright/internal';

type TestPayload = Pick<TestEndPayload, 'testId' | 'status' | 'errors'>;

export type WorkerFixture = {
  sessionId: string;
};

export const test = baseTest.extend<{}, WorkerFixture>({
  sessionId: [async ({}, use) => {
    const response = await fetch(`${testsServerUrl}/v1/acquire`, { method: 'GET' });
    const { sessionId } = await response.json() as AcquireResponse;
    await use(sessionId);
  }, { scope: 'worker' }],
});

const testsServerUrl = process.env.TESTS_SERVER_URL ?? `http://localhost:8787`;

export async function proxyTests(file: string) {
  const testResults = new Map<string, ManualPromise<TestPayload>>();
  let websocket!: WebSocket;

  return {
    beforeAll: async ({ sessionId }: WorkerFixture) => {
      const wsUrl = new URL(`${testsServerUrl}/${file}`.replace(/^http/, 'ws'));
      if (process.env.CI)
        wsUrl.searchParams.set('timeout', '30');
      if (sessionId)
        wsUrl.searchParams.set('sessionId', sessionId);
      websocket = new WebSocket(wsUrl);
      websocket.addEventListener('message',  (ev: MessageEvent) => {
        const payload = JSON.parse(ev.data as string) as TestPayload;
        const promise = testResults.get(payload.testId);
        testResults.delete(payload.testId);
        promise?.resolve(payload);
      });
      await new Promise<any>((resolve, reject) => {
        websocket.addEventListener('open', resolve);
        websocket.addEventListener('error', reject);
      });
      websocket.addEventListener('close', () => {
        for (const [testId, promise] of testResults.entries()) {
          testResults.delete(testId);
          promise.resolve({ testId, status: 'interrupted', errors: [] });
        }
      });
    },

    afterAll: async () => {
      websocket.close();
    },

    runTest: async ({ testId, fullTitle }: { testId: string, fullTitle: string }, testInfo: TestInfo) => {
      const testPromise = new ManualPromise<TestPayload>();
      testResults.set(testId, testPromise);
      websocket.send(JSON.stringify({ testId, fullTitle }));
      const payload: TestPayload = await testPromise;
      const { status, errors } = payload;
      const error = errors[0]?.message;

      switch (status) {
        case 'passed':
          return;
        case 'failed':
          throw new Error(error ?? 'Test failed');
        case 'skipped':
          testInfo.skip();
        case 'interrupted':
          testInfo.skip();
        case 'timedOut':
          throw new Error(error ?? 'Test timed out');
      }
    }
  }
}
