import * as FS from 'fs';
import { Playwright, Browser } from './types/types';

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

export async function connect(endpoint: BrowserWorker, sessionId: string): Promise<Browser>;
export async function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser>;

export async function acquire(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<AcquireResponse>;

/**
 * Returns active sessions
 *
 * @remarks
 * Sessions with a connnectionId already have a worker connection established
 *
 * @param endpoint - Cloudflare worker binding
 * @returns List of active sessions
 */
export async function sessions(endpoint: BrowserWorker): Promise<ActiveSession[]>;

/**
 * Returns recent sessions (active and closed)
 *
 * @param endpoint - Cloudflare worker binding
 * @returns List of recent sessions (active and closed)
 */
export async function history(endpoint: BrowserWorker): Promise<ClosedSession[]>;

/**
 * Returns current limits
 *
 * @param endpoint - Cloudflare worker binding
 * @returns current limits
 */
export async function limits(endpoint: BrowserWorker): Promise<LimitsResponse>;

declare const playwright: Pick<Playwright, 'chromium' | 'selectors' | 'devices' | 'errors' | 'request'> & {
  connect,
  launch,
  limits,
  sessions,
  history,
  acquire,
};

export default playwright;
