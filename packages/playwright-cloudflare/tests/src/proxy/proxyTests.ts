import path from 'path';
import fs from 'fs';

import { test as baseTest } from '@playwright/test';
import { MessageEvent, WebSocket } from 'ws';

import type { AcquireResponse, SessionsResponse } from '@cloudflare/playwright';
import type { TestEndPayload } from '@cloudflare/playwright/internal';
import type { TestInfo } from '@playwright/test';

type TestPayload = Pick<TestEndPayload, 'testId' | 'status' | 'errors'>;

export type WorkerFixture = {
  sessionId: string;
};

export const test = baseTest.extend<{}, WorkerFixture>({
  sessionId: [async ({}, use, workerInfo) => {
    const sessionFile = path.join(workerInfo.project.outputDir, `session-${workerInfo.parallelIndex}.json`);
    let sessionId: string | undefined;
    if (fs.existsSync(sessionFile)) {
      const session = JSON.parse(fs.readFileSync(sessionFile, 'utf-8')) as AcquireResponse;
      for (let i = 0; i < 5; i++) {
        const response = await fetch(`${testsServerUrl}/v1/sessions`);
        const { sessions } = await response.json() as SessionsResponse;
        const activeSession = sessions.find(s => s.sessionId === session.sessionId);

        if (!activeSession)
          break;

        if (!activeSession.connectionId) {
          sessionId = session.sessionId;
          break;
        }

        // wait for the session to be released and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!sessionId) {
      const response = await fetch(`${testsServerUrl}/v1/acquire`);
      const session = await response.json() as AcquireResponse;
      fs.writeFileSync(sessionFile, JSON.stringify(session));
      sessionId = session.sessionId!;
    }

    await use(sessionId);
  }, { scope: 'worker' }],
});

const testsServerUrl = process.env.TESTS_SERVER_URL ?? `http://localhost:8787`;

export async function proxyTests(file: string) {
  const testResults = new Map<string, (payload: TestPayload) => void>();
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
        const resolve = testResults.get(payload.testId);
        testResults.delete(payload.testId);
        resolve?.(payload);
      });
      await new Promise<any>((resolve, reject) => {
        websocket.addEventListener('open', resolve);
        websocket.addEventListener('error', reject);
      });
      websocket.addEventListener('close', () => {
        for (const [testId, resolve] of testResults.entries()) {
          testResults.delete(testId);
          resolve({ testId, status: 'interrupted', errors: [] });
        }
      });
    },

    afterAll: async () => {
      websocket.close();
    },

    runTest: async ({ testId, fullTitle }: { testId: string, fullTitle: string }, testInfo: TestInfo) => {
      const testPromise = new Promise<TestPayload>(resolve => {
        testResults.set(testId, resolve);
      });
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
  };
}
