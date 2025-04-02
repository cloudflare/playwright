import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";

const basedir = path.dirname(fileURLToPath(import.meta.url));

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

        '../config/browserTest': path.resolve(basedir, '../tests/src/workerFixtures'),
        './pageTest': path.resolve(basedir, '../tests/src/workerFixtures'),
        '../../zipBundle': '@cloudflare/playwright/lib/zipBundle',
        '../../packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
        'playwright-core': '@cloudflare/playwright',
        '@playwright/test': '@cloudflare/playwright/test',
        '@playwright/test': path.resolve(basedir, '../tests/src/workerFixtures'),
        'fs': '@cloudflare/playwright/fs',
        '@isomorphic': path.resolve(basedir, '../../playwright-core/src/utils/isomorphic'),
        '@testIsomorphic': path.resolve(basedir, '../../playwright/src/isomorphic'),
      },
    },
    build: {
      emptyOutDir: true,
      minify: false,
      // prevents __defProp, __defNormalProp, __publicField in compiled code
      target: 'esnext',
      lib: {
        name: 'tests',
        entry: path.join(basedir, '../tests/src/tests.ts'),
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
          'node:browser',
          'node:buffer',
          'node:child_process',
          'node:constants',
          'node:crypto',
          'node:dns',
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

          /^@cloudflare\/playwright.*/,
        ]
      },
      commonjsOptions: {
        transformMixedEsModules: true,
        extensions: ['.ts', '.js'],
        include: [
          path.resolve(basedir, '../../../tests/**/*'),
          /node_modules/,
        ],
      },
    },
  });
})();

