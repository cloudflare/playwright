import type { ConnectionTransport, ProtocolRequest, ProtocolResponse } from 'playwright-core/lib/server/transport';
import type { BrowserWorker, WorkersLaunchOptions } from '../..';

import { chunksToMessage, messageToChunks } from './chunking';
import { Progress } from 'playwright-core/lib/server/progress';

interface AcquireResponse {
  sessionId: string;
}

declare global {
  interface Response {
    readonly webSocket: WebSocket | null;
  }
  interface WebSocket {
    accept(): void;
  }
}

const FAKE_HOST = 'https://fake.host';

export const kBrowserConnectParams = Symbol('kBrowserConnectParams');

export class WebSocketTransport implements ConnectionTransport {
  ws: WebSocket;
  pingInterval: NodeJS.Timer;
  chunks: Uint8Array[] = [];
  onmessage?: (message: ProtocolResponse) => void;
  onclose?: () => void;
  sessionId: string;
  
  static async connect(progress: (Progress|undefined), url: string, headers?: Record<string, string>, followRedirects?: boolean, debugLogHeader?: string): Promise<WebSocketTransport> {
    const params = (globalThis as any)[kBrowserConnectParams];
    if (!params?.endpoint)
      throw new Error('Endpoint is not available in the current zone');
    return await WebSocketTransport.create(params.endpoint, params.options);
  }

  static async create(
    endpoint: BrowserWorker,
    options?: WorkersLaunchOptions
  ): Promise<WebSocketTransport> {
    const sessionId = options?.sessionId ?? await connect(endpoint, options);
    const path = `${FAKE_HOST}/v1/connectDevtools?browser_session=${sessionId}`;
    const response = await endpoint.fetch(path, {
      headers: {
        Upgrade: 'websocket'
      },
    });
    response.webSocket!.accept();
    return new WebSocketTransport(response.webSocket! as unknown as WebSocket, sessionId);
  }

  constructor(ws: WebSocket, sessionId: string) {
    this.pingInterval = setInterval(() => {
      return this.ws.send('ping');
    }, 1000); // TODO more investigation
    this.ws = ws;
    this.sessionId = sessionId;
    this.ws.addEventListener('message', event => {
      this.chunks.push(new Uint8Array(event.data as ArrayBuffer));
      const message = chunksToMessage(this.chunks, sessionId);
      if (message && this.onmessage)
        this.onmessage!(JSON.parse(message) as ProtocolResponse);
    });
    this.ws.addEventListener('close', () => {
      clearInterval(this.pingInterval as NodeJS.Timeout);
      if (this.onclose)
        this.onclose();
    });
    this.ws.addEventListener('error', e => {
      // eslint-disable-next-line no-console
      console.error(`Websocket error: SessionID: ${sessionId}`, e);
      clearInterval(this.pingInterval as NodeJS.Timeout);
    });
  }

  send(message: ProtocolRequest): void {
    for (const chunk of messageToChunks(JSON.stringify(message)))
      this.ws.send(chunk);
  }

  close(): void {
    clearInterval(this.pingInterval as NodeJS.Timeout);
    this.ws.close();
    this.onclose?.();
  }

  async closeAndWait() {
    if (this.ws.readyState === WebSocket.CLOSED)
      return;
    const promise = new Promise((f: any) => this.ws.addEventListener('close', f));
    this.close();
    await promise; // Make sure to await the actual disconnect.
  }

  toString(): string {
    return this.sessionId;
  }
}

async function connect(endpoint: BrowserWorker, options?: WorkersLaunchOptions) {
  let acquireUrl = `${FAKE_HOST}/v1/acquire`;
  if (options?.keep_alive)
    acquireUrl = `${acquireUrl}?keep_alive=${options.keep_alive}`;

  const res = await endpoint.fetch(acquireUrl);
  const status = res.status;
  const text = await res.text();
  if (status !== 200) {
    throw new Error(
        `Unable to create new browser: code: ${status}: message: ${text}`
    );
  }
  // Got a 200, so response text is actually an AcquireResponse
  const response: AcquireResponse = JSON.parse(text);
  return response.sessionId;
}
