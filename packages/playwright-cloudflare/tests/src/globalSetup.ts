import type { TestProject } from 'vitest/node';
import { AcquireResponse } from '@cloudflare/playwright';

const testsServerUrl = process.env.TESTS_SERVER_URL ?? `http://localhost:8787`;

export default async function setup(project: TestProject) {
  const response = await fetch(`${testsServerUrl}/v1/acquire`, { method: 'GET' });
  const { sessionId } = await response.json() as AcquireResponse;
  project.provide('sessionId', sessionId);
}

declare module 'vitest' {
  export interface ProvidedContext {
    sessionId: string;
  }
}
