import path from 'path';
import fs from 'fs';

import { test as baseTest } from '@playwright/test';

import type { AcquireResponse, SessionsResponse } from '@cloudflare/playwright';
import type { TestEndPayload } from '@cloudflare/playwright/internal';
import type { TestInfo } from '@playwright/test';

type TestPayload = Pick<TestEndPayload, 'testId' | 'status' | 'expectedStatus' | 'errors' | 'annotations'>;

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

  const url = new URL(`${testsServerUrl}/${file}`);

  return {
    beforeAll: async ({ sessionId }: WorkerFixture) => {
      if (process.env.CI)
        url.searchParams.set('timeout', '30');
      if (sessionId)
        url.searchParams.set('sessionId', sessionId);
    },

    afterAll: async () => {
    },

    runTest: async ({ testId, fullTitle }: { testId: string, fullTitle: string }, testInfo: TestInfo) => {
      const response = await fetch(url, { body: JSON.stringify({ testId, fullTitle }), method: 'POST' });
      if (!response.ok)
        throw new Error(`Failed to run test ${fullTitle} (${testId})`);

      const { status, expectedStatus, errors, annotations } = await response.json() as TestPayload;

      if (annotations)
        testInfo.annotations.push(...annotations);

      if (errors)
        // if drop stacktrace because otherwise it tries to parse the stacktrace from the worker
        // and fails
        testInfo.errors = errors.map(({ message, value }) => ({ message, value }));

      testInfo.expectedStatus = status === 'skipped' ? 'skipped' : expectedStatus;
      testInfo.status = status;
    }
  };
}
