import * as FS from 'fs';
import type { Browser } from './types/types';
import { chromium, request, selectors, devices } from './types/types';
import { env } from 'cloudflare:workers';

export * from './types/types';

declare module './types/types' {
  interface Browser {
    /**
     * Get the BISO session ID associated with this browser
     *
     * @public
     */
    sessionId(): string;
  }
}

/**
 * @public
 */
export interface BrowserWorker {
  fetch: typeof fetch;
}

export type BrowserEndpoint = BrowserWorker | string | URL;

/**
 * @public
 */
export interface AcquireResponse {
  sessionId: string;
}

/**
 * @public
 */
export interface ActiveSession {
  sessionId: string;
  startTime: number; // timestamp
  // connection info, if present means there's a connection established
  // from a worker to that session
  connectionId?: string;
  connectionStartTime?: string;
}

/**
 * @public
 */
export interface ClosedSession extends ActiveSession {
  endTime: number; // timestamp
  closeReason: number; // close reason code
  closeReasonText: string; // close reason description
}

export interface AcquireResponse {
  sessionId: string;
}

/**
 * @public
 */
export interface SessionsResponse {
  sessions: ActiveSession[];
}

/**
 * @public
 */
export interface HistoryResponse {
  history: ClosedSession[];
}

/**
 * @public
 */
export interface LimitsResponse {
  activeSessions: Array<{id: string}>;
  maxConcurrentSessions: number;
  allowedBrowserAcquisitions: number; // 1 if allowed, 0 otherwise
  timeUntilNextAllowedBrowserAcquisition: number;
}

/**
 * @public
 */
export interface WorkersLaunchOptions {
  keep_alive?: number; // milliseconds to keep browser alive even if it has no activity (from 10_000ms to 600_000ms, default is 60_000)
}

// Extracts the keys whose values match a specified type `ValueType`
type KeysByValue<T, ValueType> = {
  [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];

export type BrowserBindingKey = KeysByValue<typeof env, BrowserWorker>;

export function endpointURLString(binding: BrowserWorker | BrowserBindingKey, options?: { sessionId?: string, persistent?: boolean }): string;

export function connect(endpoint: string | URL): Promise<Browser>;
export function connect(endpoint: BrowserWorker, sessionIdOrOptions: string | { sessionId: string, persistent?: boolean }): Promise<Browser>;

export function launch(endpoint: BrowserEndpoint, options?: WorkersLaunchOptions): Promise<Browser>;

export function acquire(endpoint: BrowserEndpoint, options?: WorkersLaunchOptions): Promise<AcquireResponse>;

/**
 * Returns active sessions
 *
 * @remarks
 * Sessions with a connnectionId already have a worker connection established
 *
 * @param endpoint - Cloudflare worker binding
 * @returns List of active sessions
 */
export function sessions(endpoint: BrowserEndpoint): Promise<ActiveSession[]>;

/**
 * Returns recent sessions (active and closed)
 *
 * @param endpoint - Cloudflare worker binding
 * @returns List of recent sessions (active and closed)
 */
export function history(endpoint: BrowserEndpoint): Promise<ClosedSession[]>;

/**
 * Returns current limits
 *
 * @param endpoint - Cloudflare worker binding
 * @returns current limits
 */
export function limits(endpoint: BrowserEndpoint): Promise<LimitsResponse>;

const playwright = {
  chromium,
  selectors,
  request,
  devices,
  endpointURLString,
  connect,
  launch,
  limits,
  sessions,
  history,
  acquire,
};

export type Playwright = typeof playwright;

export default playwright;
