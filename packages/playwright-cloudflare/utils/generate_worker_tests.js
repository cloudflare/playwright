import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteDir, writeFile } from "./utils.js";

const basedir = path.dirname(fileURLToPath(import.meta.url));

const sourceTestsDir = path.join(basedir, '..', '..', '..', 'tests');
const workerTestsDir = path.join(basedir, '..', 'tests', 'workerTests');

const testExtendFiles = [
  'config/browserTest.ts',
  'config/utils.ts',
  'config/errors.ts',
  'page/pageTest.ts',
];

const content = fs.readFileSync(path.join(basedir, '../tests/src/tests.ts'), { encoding: 'utf-8' });
const testPaths = [...content.matchAll(/import\s+'\.\.\/workerTests\/(.+)';/g)].map(([, importFile]) => importFile) || [];

// ensure workerTests directory is clean
deleteDir(workerTestsDir);

for (const testPath of testPaths) {
  const testFile = path.join(sourceTestsDir, testPath);
  const targetTestFile = path.join(workerTestsDir, testPath);
  const pathStr = JSON.stringify(testPath);
  writeFile(targetTestFile, `import { setCurrentTestFile } from '@cloudflare/playwright/internal';

setCurrentTestFile(${pathStr});

${fs.readFileSync(testFile, 'utf-8')};

setCurrentTestFile(undefined);
`);
}

for (const testExtendFile of testExtendFiles) {
  const targetTestExtendFile = path.join(workerTestsDir, testExtendFile);
  const fixturesFile = path.join(basedir, '../tests/src/workerFixtures.ts');
  const relativePath = path.relative(path.dirname(targetTestExtendFile), fixturesFile).replace(/\\/g, '/');
  writeFile(targetTestExtendFile, `export * from '${relativePath}';`);
}


