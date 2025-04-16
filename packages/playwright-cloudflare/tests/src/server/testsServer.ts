import { TestRunner, setUnderTest, TestEndPayload } from '@cloudflare/playwright/internal';
import { DurableObject } from 'cloudflare:workers';
import '@workerTests/index';

import { skipTests } from '../skipTests';

export type TestRequestPayload = {
  testId: string;
  fullTitle: string;
  timeout: number;
  retry: number;
};

// eslint-disable-next-line no-console
const log = console.log.bind(console);

const skipTestsFullTitles = new Set(skipTests.map(t => t.join(' > ')));

// ensure we are in test mode
setUnderTest(true);

export class TestsServer extends DurableObject<Env> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const file = url.pathname.substring(1);
    const sessionId = url.searchParams.get('sessionId');
    if (!sessionId)
      return new Response('sessionId is required', { status: 400 });
    const timeout = parseInt(url.searchParams.get('timeout') ?? '10', 10) * 1000;
    const { testId, fullTitle, retry } = await request.json() as TestRequestPayload;
    const assetsUrl = url.origin;
    const { env } = this;
    const context = { env, sessionId, assetsUrl, retry };
    const testRunner = new TestRunner(context, { timeout });
    if (skipTestsFullTitles.has(fullTitle)) {
      log(`🚫 Skipping ${fullTitle}`);
      return Response.json({
        testId,
        status: 'skipped',
        errors: [],
        annotations: [],
        duration: 0,
        hasNonRetriableError: false,
        timeout,
        expectedStatus: 'skipped'
      } satisfies TestEndPayload);
    }

    log(`🧪 Running ${fullTitle}${retry ? ` (retry #${retry})` : ''}`);

    const result = await testRunner.runTest(file, testId);
    if (!['passed', 'skipped'].includes(result.status))
      log(`❌ ${fullTitle} failed with status ${result.status}${result.errors.length ? `: ${result.errors[0].message}` : ''}`);
    return Response.json(result);
  }
}
