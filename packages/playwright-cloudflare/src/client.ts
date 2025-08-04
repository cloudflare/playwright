/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Connection } from 'playwright-core/lib/client/connection';
import { nodePlatform } from 'playwright-core/lib/utils';

import type { Browser, BrowserWorker } from '..';

export { acquire, sessions, limits, history } from './session-management';

export type Options = {
  headless?: boolean;
};

export async function connect(endpoint: BrowserWorker, options: { sessionId: string }): Promise<Browser> {
  const response = await endpoint.fetch(`http://fake.host/v1/playwright?browser_session=${options.sessionId}`, {
    headers: {
      'Upgrade': 'websocket',
    },
  });
  const ws = response.webSocket;

  if (!ws)
    throw new Error('WebSocket connection not established');

  ws.accept();

  const connection = new Connection({
    ...nodePlatform,
    log(name: 'api' | 'channel', message: string | Error | object) {
      // eslint-disable-next-line no-console
      console.debug(name, message);
    },
  });
  connection.onmessage = message => ws.send(JSON.stringify(message));
  ws.addEventListener('message', message => {
    const data = message.data instanceof ArrayBuffer ? Buffer.from(message.data).toString() : message.data;
    connection.dispatch(JSON.parse(data));
  });
  ws.addEventListener('close', () => connection.close());

  const playwright = await connection.initializePlaywright();
  const browser = playwright._preLaunchedBrowser() as unknown as Browser;
  // TODO Hack to ensure the browser is closed (I still think websockets are not being closed properly)
  (browser as any)._closedPromise = Promise.resolve();
  browser.sessionId = () => options.sessionId;

  return browser;
}
