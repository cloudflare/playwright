import path from "path";
import { fileURLToPath } from "url";
import { deleteDir, writeFile } from "./utils.js";

const basedir = path.dirname(fileURLToPath(import.meta.url));

const testsServerUrl = process.env.TESTS_SERVER_URL ?? `http://localhost:8787`;
const proxyTestsDir = path.join(basedir, '..', 'tests', 'proxyTests');

// ensure proxyTestsDir directory is clean
deleteDir(proxyTestsDir);

function generateDescribeOrTest(entry, indent = '') {
  const title = entry.title.replace('\'', '\\\'');
  const fullTitle = entry.fullTitle.replace('\'', '\\\'');
  if (entry.type === 'describe') {
    return `${indent}describe('${title}', async () => {
${entry.entries.map(entry => generateDescribeOrTest(entry, `${indent}  `)).join('\n\n')}
${indent}});`;
  } else {
    return `${indent}test('${title}', async ({ skip }) => await proxy.runTest({
${indent}  testId: '${entry.testId}',
${indent}  fullTitle: '${fullTitle}',
${indent}  skip,
${indent}}));`;
  }
}

(async () => {
  const suites = await fetch(`${testsServerUrl}`).then(res => res.json());
  for (const suite of suites) {
    const targetProxyTestFile = path.join(proxyTestsDir, suite.file);
    const proxyTests = path.join(basedir, '../tests/src/proxyTests.ts');
    const relativePath = path.relative(path.dirname(targetProxyTestFile), proxyTests).replace(/\\/g, '/');
    writeFile(targetProxyTestFile, `import { describe, test, beforeAll, afterAll } from 'vitest';
import { proxyTests } from '${relativePath}';

const proxy = await proxyTests('${suite.file}');

beforeAll(async () => await proxy.beforeAll());

afterAll(async () => await proxy.afterAll());

${suite.entries.map(entry => generateDescribeOrTest(entry)).join('\n\n')}
`);
  }
})();
