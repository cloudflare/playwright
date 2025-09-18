import path from 'path';

import { defineConfig, Plugin } from 'vite';

const basedir = __dirname.replace(/\\/g, '/');
const cloudflareSourceTestsDir = path.join(basedir, 'src');
const sourceTestsDir = path.join(basedir, '..', '..', '..', 'tests');

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
  } satisfies Plugin;
}

// https://vitejs.dev/config/
export default defineConfig({
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
      'fs': 'node:fs',
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
      '@cloudflareTests': path.resolve(basedir, './src'),

      '../config/browserTest': path.resolve(basedir, './src/server/workerFixtures'),
      '../page/pageTest': path.resolve(basedir, './src/server/workerFixtures'),
      '../../page/pageTest': path.resolve(basedir, './src/server/workerFixtures'),
      './pageTest': path.resolve(basedir, './src/server/workerFixtures'),
      'tests/page/pageTest': path.resolve(basedir, './src/server/workerFixtures'),
      'tests': sourceTestsDir,

      '../../zipBundle': '@cloudflare/playwright/internal',
      '../../utilsBundle': '@cloudflare/playwright/internal',
      'playwright-core/lib/utilsBundle': '@cloudflare/playwright/internal',
      'playwright-core/lib/utils': '@cloudflare/playwright/internal',

      '../../packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
      '../../../packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
      'packages/playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
      'playwright-core': '@cloudflare/playwright',
      '@playwright/test': path.resolve(basedir, './src/server/workerFixtures'),
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
      entry: path.join(basedir, './workerTests/index.ts'),
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
        dir: path.join(basedir, 'workerTests'),
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
        'node:fs',
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
        path.resolve(basedir, '../.././**/*'),
        path.resolve(basedir, '../../playwright-core/**/*'),
        /node_modules/,
      ],
    },
  },
});