#!/usr/bin/env node
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
// @ts-check

const fs = require('fs')
const path = require('path')

const { commands } = require('../packages/playwright/lib/mcp/terminal/commands.js');

/**
 * 
 * @param {import('../packages/playwright/src/mcp/terminal/command').AnyCommandSchema} command
 */
function generateCommandHelp(command: AnyCommandSchema) {
  const args: { name: string, description: string }[] = [];

  const shape = command.args ? (command.args as zodType.ZodObject<any>).shape : {};
  for (const [name, schema] of Object.entries(shape)) {
    const zodSchema = schema as zodType.ZodTypeAny;
    const description = zodSchema.description ?? '';
    args.push({ name, description})
  }

  const lines: string[] = [
    `playwright-cli ${command.name} ${Object.keys(shape).map(k => `<${k}>`).join(' ')}`,
    '',
    command.description,
    '',
  ];

  if (args.length) {
    lines.push('Arguments:');
    for (const arg of args)
      lines.push(...args.map(({ name, description }) => `  <${name}>\t${description}`));
  }

  if (command.options) {
    lines.push('Options:');
    const optionsShape = (command.options as zodType.ZodObject<any>).shape;
    for (const [name, schema] of Object.entries(optionsShape)) {
      const zodSchema = schema as zodType.ZodTypeAny;
      const description = (zodSchema.description ?? '').toLowerCase();
      lines.push(`  --${name}\t${description}`);
    }
  }

  console.log(lines.join('\n'));
}

export function printHelp(commands: AnyCommandSchema[]) {
  console.log('Usage: playwright-cli <command> [options]');
  console.log('Commands:');
  for (const command of commands)
    console.log('  ' + commandHelpEntry(command));
}

function commandHelpEntry(command: AnyCommandSchema): string {
  const args: { name: string, description: string }[] = [];

  const shape = (command.args as zodType.ZodObject<any>).shape;
  for (const [name, schema] of Object.entries(shape)) {
    const zodSchema = schema as zodType.ZodTypeAny;
    const description = zodSchema.description ?? '';
    args.push({ name, description})
  }

  const lines: string[] = [
    `${command.name} ${Object.keys(shape).map(k => `<${k}>`).join(' ')}`,
    command.description.toLowerCase(),
  ];
  return lines.join('\t');
}
