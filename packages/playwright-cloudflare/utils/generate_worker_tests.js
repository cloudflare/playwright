import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";
import { decodeBase64ToFiles, deleteDir, encodeFilesToBase64, listFiles, writeFile } from "./utils.js";

const basedir = path.dirname(fileURLToPath(import.meta.url));

const excludedFiles = [
  'page/interception.spec.ts',
  'page/page-leaks.spec.ts',

  'library/browsertype-connect.spec.ts',
  'library/browsertype-launch-selenium.spec.ts',
  'library/browsertype-launch-server.spec.ts',
  'library/browsertype-launch.spec.ts',
  'library/client-certificates.spec.ts',
  'library/debug-controller.spec.ts',
  'library/har.spec.ts',
  'library/headful.spec.ts',
  'library/launcher.spec.ts',
  'library/snapshotter.spec.ts',
  'library/trace-viewer.spec.ts',
  'library/video.spec.ts',
  'library/web-socket.spec.ts',
];

const sourceTestsDir = path.join(basedir, '..', '..', '..', 'tests');
const cloudflareSourceTestsDir = path.join(basedir, '..', 'tests', 'src');
const workerTestsDir = path.join(basedir, '..', 'tests', 'workerTests');

function setTestFilePlugin() {
  return {
    name: 'transform-file',
    transform(src, id) {
      let testPath = [sourceTestsDir, cloudflareSourceTestsDir].map(dir => path.relative(dir, id).replace(/\\/g, '/'))
        .find(p => !p.startsWith('..'));
      if (/\.(spec|test)\.ts$/.test(id)) {
        return {
          code: [
            `import { setCurrentTestFile } from '@cloudflare/playwright/internal';setCurrentTestFile(${JSON.stringify(testPath)});`,
            src,
            'setCurrentTestFile(undefined);',
          ].join('\n'),
          map: null, // provide source map if available
        }
      }
    },
  }
}

deleteDir(workerTestsDir);

// generate workerTests/assets.ts file
const assets = [
    ...['page', 'library'].flatMap(dir => listFiles(path.join(sourceTestsDir, dir), { recursive: true })).filter(file => /-chromium\.(png|jpg)/.test(file)),
    ...listFiles(path.join(sourceTestsDir, 'assets'), { recursive: true }),
  ]
  .map(file => path.relative(sourceTestsDir, file).replace(/\\/g, '/'));

writeFile(path.join(workerTestsDir, 'assets.ts'), `// @ts-nocheck
import path from 'path';
import zlib from 'zlib';

import fs from '@cloudflare/playwright/fs';

${decodeBase64ToFiles.toString()}

decodeBase64ToFiles('/', ${JSON.stringify(encodeFilesToBase64(sourceTestsDir, assets), undefined, 2)});
`);

// generate workerTests/index.ts file
const testFiles = ['page', 'library']
  .flatMap(dir => listFiles(path.join(sourceTestsDir, dir)))
  .filter(file => /\.(test|spec)\.ts$/.test(file))
  .filter(file => !excludedFiles.includes(path.relative(sourceTestsDir, file).replace(/\\/g, '/')))
  .map(file => `@workerTests/${path.relative(sourceTestsDir, file)}`.replace(/\\/g, '/').replace(/\.ts$/, ''));
const cloudflareTestFiles = listFiles(cloudflareSourceTestsDir, { recursive: true })
  .filter(file => /\.(test|spec)\.ts$/.test(file))
  .map(file => `@cloudflareTests/${path.relative(cloudflareSourceTestsDir, file)}`.replace(/\\/g, '/').replace(/\.ts$/, ''));

writeFile(path.join(workerTestsDir, 'index.ts'), `import "./assets";

${[...testFiles, ...cloudflareTestFiles].map(file => `import ${JSON.stringify(file)};`).join('\n')}
`);

(async () => {
  await build({
    plugins: [setTestFilePlugin()],
    root: sourceTestsDir,
    resolve: {
      alias: {
        // https://workers-nodejs-compat-matrix.pages.dev/
        'async_hooks': 'node:async_hooks',
        'assert': 'node:assert',
        'buffer': 'node:buffer',
        'child_process': 'node:child_process',
        'constants': 'node:constants',
        'crypto': 'node:crypto',
        'dns': 'node:dns',
        'domain': 'node:domain',
        'events': 'node:events',
        'http': 'node:http',
        'http2': 'node:http2',
        'https': 'node:https',
        'inspector': 'node:inspector',
        'module': 'node:module',
        'net': 'node:net',
        'os': 'node:os',
        'path': 'node:path',
        'querystring': 'node:querystring',
        'process': 'node:process',
        'readline': 'node:readline',
        'stream': 'node:stream',
        'string_decoder': 'node:string_decoder',
        'tls': 'node:tls',
        'url': 'node:url',
        'util': 'node:util',
        'vm': 'node:vm',
        'zlib': 'node:zlib',

        '@workerTests': sourceTestsDir,
        '@cloudflareTests': path.resolve(basedir, '../tests/src'),

        '../config/browserTest': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        '../page/pageTest': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        '../../page/pageTest': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        './pageTest': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        'tests/page/pageTest': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        'tests': sourceTestsDir,

        '../../zipBundle': '@cloudflare/playwright/internal',
        '../../utilsBundle': '@cloudflare/playwright/internal',
        'playwright-core/lib/utilsBundle': '@cloudflare/playwright/internal',

        '../../packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
        '../../../packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
        'packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
        'playwright-core': '@cloudflare/playwright',
        '@playwright/test': path.resolve(basedir, '../tests/src/server/workerFixtures'),
        'fs': '@cloudflare/playwright/fs',
        '@isomorphic': path.resolve(basedir, '../../playwright-core/src/utils/isomorphic'),
        '@testIsomorphic': path.resolve(basedir, '../../playwright/src/isomorphic'),
      },
    },
    build: {
      emptyOutDir: false,
      minify: false,
      // prevents __defProp, __defNormalProp, __publicField in compiled code
      target: 'esnext',
      lib: {
        name: 'tests',
        entry: path.join(basedir, '../tests/workerTests/index.ts'),
        formats: ['es'],
      },
      terserOptions: {
        format: {
          // we need to ensure no comments are preserved
          comments: false
        }
      },
      rollupOptions: {
        output: {
          preserveModules: true,
          dir: workerTestsDir,
          preserveModulesRoot: sourceTestsDir,
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
        external: [
          'node:async_hooks',
          'node:assert',
          'node:buffer',
          'node:child_process',
          'node:constants',
          'node:crypto',
          'node:dns',
          'node:domain',
          'node:events',
          'node:http',
          'node:http2',
          'node:https',
          'node:inspector',
          'node:module',
          'node:net',
          'node:os',
          'node:path',
          'node:querystring',
          'node:process',
          'node:readline',
          'node:stream',
          'node:string_decoder',
          'node:timers',
          'node:tls',
          'node:url',
          'node:util',
          'node:vm',
          'node:zlib',

          'cloudflare:workers',
          /^@cloudflare\/playwright.*/,
        ]
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        extensions: ['.ts', '.js'],
        include: [
          path.resolve(basedir, '../../../tests/**/*'),
          path.resolve(basedir, '../../playwright-core/**/*'),
          /node_modules/,
        ],
      },
    },
  });
})();

