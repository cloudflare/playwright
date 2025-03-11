/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

import crypto from 'crypto';

export function createGuid(): string {
  // crypto.randomBytes fails in Cloudflare Workers:
  // Uncaught Error: Disallowed operation called within global scope. Asynchronous I/O
  // (ex: fetch() or connect()), setting a timeout, and generating random values are not allowed within
  // global scope. To fix this error, perform this operation within a handler.
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}

export function calculateSha1(buffer: Buffer | string): string {
  const hash = crypto.createHash('sha1');
  hash.update(buffer);
  return hash.digest('hex');
}
