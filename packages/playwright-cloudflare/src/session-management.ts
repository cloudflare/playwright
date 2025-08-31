import { env } from 'cloudflare:workers';

import type { AcquireResponse, ActiveSession, BrowserBindingKey, BrowserEndpoint, BrowserWorker, ClosedSession, HistoryResponse, LimitsResponse, SessionsResponse, WorkersLaunchOptions } from '..';


export const HTTP_FAKE_HOST = 'http://fake.host';
export const WS_FAKE_HOST = 'ws://fake.host';

export function getBrowserBinding(endpoint: BrowserEndpoint): BrowserWorker {
  if (typeof endpoint === 'string' || endpoint instanceof URL) {
    const url = endpoint instanceof URL ? endpoint : new URL(endpoint);
    const binding = url.searchParams.get('browser_binding') as BrowserBindingKey;
    if (!binding || !(binding in env))
      throw new Error(`No binding found for ${binding}`);
    return env[binding];
  }
  return endpoint;
}

export function extractOptions(endpoint: BrowserEndpoint): { sessionId?: string, keep_alive?: number, persistent?: boolean } {
  if (typeof endpoint === 'string' || endpoint instanceof URL) {
    const url = endpoint instanceof URL ? endpoint : new URL(endpoint);
    const sessionId = url.searchParams.get('browser_session') ?? undefined;
    const keepAlive = url.searchParams.has('keep_alive') ? parseInt(url.searchParams.get('keep_alive')!, 10) : undefined;
    const persistent = url.searchParams.has('persistent');
    return { sessionId, keep_alive: keepAlive, persistent };
  }
  return {};
}

export async function acquire(endpoint: BrowserEndpoint, options?: WorkersLaunchOptions): Promise<AcquireResponse> {
  options = { ...extractOptions(endpoint), ...options };
  let acquireUrl = `${HTTP_FAKE_HOST}/v1/acquire`;
  if (options?.keep_alive)
    acquireUrl = `${acquireUrl}?keep_alive=${options.keep_alive}`;

  const res = await getBrowserBinding(endpoint).fetch(acquireUrl);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to create new browser: code: ${status}: message: ${text}`
    );
  }
  // Got a 200, so response text is actually an AcquireResponse
  const response: AcquireResponse = JSON.parse(text);
  return response;
}

export async function sessions(endpoint: BrowserEndpoint): Promise<ActiveSession[]> {
  const res = await getBrowserBinding(endpoint).fetch(`${HTTP_FAKE_HOST}/v1/sessions`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch new sessions: code: ${status}: message: ${text}`
    );
  }
  const data: SessionsResponse = JSON.parse(text);
  return data.sessions;
}

export async function history(endpoint: BrowserEndpoint): Promise<ClosedSession[]> {
  const res = await getBrowserBinding(endpoint).fetch(`${HTTP_FAKE_HOST}/v1/history`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch account history: code: ${status}: message: ${text}`
    );
  }
  const data: HistoryResponse = JSON.parse(text);
  return data.history;
}

export async function limits(endpoint: BrowserEndpoint): Promise<LimitsResponse> {
  const res = await getBrowserBinding(endpoint).fetch(`${HTTP_FAKE_HOST}/v1/limits`);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to fetch account limits: code: ${status}: message: ${text}`
    );
  }
  const data: LimitsResponse = JSON.parse(text);
  return data;
}
