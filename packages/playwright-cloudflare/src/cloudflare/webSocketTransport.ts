import { AsyncLocalStorage } from 'async_hooks';

import { chunksToMessage, messageToChunks } from './chunking';

import type { ConnectionTransport, ProtocolRequest, ProtocolResponse } from 'playwright-core/lib/server/transport';

// stores the endpoint and options for client -> server communication
export const transportZone = new AsyncLocalStorage<WebSocketTransport>();

export class WebSocketTransport implements ConnectionTransport {
  private _ws: WebSocket;
  private _pingInterval: NodeJS.Timer;
  private _chunks: Uint8Array[] = [];
  private _disableChunking: boolean;
  onmessage?: (message: ProtocolResponse) => void;
  onclose?: () => void;
  readonly sessionId: string;

  static async connect(): Promise<WebSocketTransport> {
    // read the endpoint and options injected in cliend side
    const transport = transportZone.getStore();
    if (!transport)
      throw new Error('Transport is not available in the current zone');
    return transport;
  }

  constructor(ws: WebSocket, sessionId: string, { disableChunking = false } = {}) {
    this._pingInterval = setInterval(() => {
      return this._ws.send('ping');
    }, 1000); // TODO more investigation
    this._ws = ws;
    this.sessionId = sessionId;
    this._disableChunking = disableChunking;
    this._ws.addEventListener('message', event => {
      if (this._disableChunking) {
        if (event.data && this.onmessage)
          this.onmessage!(JSON.parse(event.data as string) as ProtocolResponse);
        return;
      }

      this._chunks.push(new Uint8Array(event.data as ArrayBuffer));
      const message = chunksToMessage(this._chunks, sessionId);
      if (message && this.onmessage)
        this.onmessage!(JSON.parse(message) as ProtocolResponse);
    });
    this._ws.addEventListener('close', () => {
      clearInterval(this._pingInterval as NodeJS.Timeout);
      if (this.onclose)
        this.onclose();
    });
    this._ws.addEventListener('error', e => {
      // eslint-disable-next-line no-console
      console.error(`Websocket error: SessionID: ${sessionId}`, e);
      clearInterval(this._pingInterval as NodeJS.Timeout);
    });
  }

  send(message: ProtocolRequest): void {
    if (this._disableChunking) {
      this._ws.send(JSON.stringify(message));
      return;
    }
    for (const chunk of messageToChunks(JSON.stringify(message)))
      this._ws.send(chunk);
  }

  close(): void {
    clearInterval(this._pingInterval as NodeJS.Timeout);
    this._ws.close();
    this.onclose?.();
  }

  async closeAndWait() {
    if (this._ws.readyState === WebSocket.CLOSED)
      return;
    this.close();
    // TODO wait for close event
  }

  toString(): string {
    return this.sessionId;
  }
}
