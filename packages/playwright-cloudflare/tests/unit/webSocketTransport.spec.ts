import { test as base, expect } from '@playwright/test';

import { WebSocketTransport } from '../../src/cloudflare/webSocketTransport';

const test = base.extend<{ errors: unknown[][] }>({
  errors: async ({}, use) => {
    const errors: unknown[][] = [];
    // eslint-disable-next-line no-console
    const original = console.error;
    // eslint-disable-next-line no-console
    console.error = (...args: unknown[]) => errors.push(args);
    try {
      await use(errors);
    } finally {
      // eslint-disable-next-line no-console
      console.error = original;
    }
  },
});

class MockWebSocket extends EventTarget {
  sent: string[] = [];

  send(message: string) {
    this.sent.push(message);
    this.dispatchEvent(new Event('error'));
  }

  close() {
    this.dispatchEvent(new Event('error'));
  }
}

test('reports errors while the browser session is active', async ({ errors }) => {
  const ws = new MockWebSocket();
  new WebSocketTransport(ws as unknown as WebSocket, 'session-id');
  const error = new Event('error');

  ws.dispatchEvent(error);

  expect(errors).toEqual([['Websocket error: SessionID: session-id', error]]);
});

test('does not report errors raised while closing the transport', async ({ errors }) => {
  const ws = new MockWebSocket();
  const transport = new WebSocketTransport(ws as unknown as WebSocket, undefined);
  let closed = false;
  transport.onclose = () => closed = true;

  transport.close();

  expect(errors.length).toBe(0);
  expect(closed).toBe(true);
});

test('does not report errors after sending Browser.close', async ({ errors }) => {
  const ws = new MockWebSocket();
  const transport = new WebSocketTransport(ws as unknown as WebSocket, 'session-id');
  const message = { id: -9999, method: 'Browser.close', params: {} };

  transport.send(message);
  ws.dispatchEvent(new Event('error'));

  expect(errors.length).toBe(0);
  expect(ws.sent).toEqual([JSON.stringify(message)]);
});

test('reports errors when sending other protocol commands', async ({ errors }) => {
  const ws = new MockWebSocket();
  const transport = new WebSocketTransport(ws as unknown as WebSocket, undefined);

  transport.send({ id: 1, method: 'Browser.getVersion', params: {} });

  expect(errors).toHaveLength(1);
  expect(errors[0][0]).toBe('Websocket error');
});

test('does not report errors after the websocket closes', async ({ errors }) => {
  const ws = new MockWebSocket();
  const transport = new WebSocketTransport(ws as unknown as WebSocket, 'session-id');
  let closed = false;
  transport.onclose = () => closed = true;

  ws.dispatchEvent(new Event('close'));
  ws.dispatchEvent(new Event('error'));

  expect(errors.length).toBe(0);
  expect(closed).toBe(true);
});
