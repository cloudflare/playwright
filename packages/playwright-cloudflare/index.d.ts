import fs from 'fs';
import { Browser } from './types/types';

export * from './types/types';

export const fs: typeof fs;

export interface BrowserWorker {
  fetch: typeof fetch;
}

export interface WorkersLaunchOptions {
    keep_alive?: number; // milliseconds to keep browser alive even if it has no activity (from 10_000ms to 600_000ms, default is 60_000)
    sessionId?: string;
}

export function launch(endpoint: BrowserWorker, options?: WorkersLaunchOptions): Promise<Browser>;
