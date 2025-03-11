import path from 'path';

import { defineConfig } from 'vite';

const baseDir = __dirname.replace(/\\/g, '/');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'playwright-core/lib': path.resolve(__dirname, '../playwright-core/src'),

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
      'process': 'node:process',
      'readline': 'node:readline',
      'stream': 'node:stream',
      'tls': 'node:tls',
      'url': 'node:url',
      'util': 'node:util',
      'zlib': 'node:zlib',

      // bundles
      './utilsBundleImpl': path.resolve(__dirname, './src/generated/utilsBundleImpl'),
      './zipBundleImpl': path.resolve(__dirname, './src/generated/zipBundleImpl'),
      'fs': path.resolve(__dirname, './src/generated/fs'),

      './transport': path.resolve(__dirname, './src/cloudflare/webSocketTransport'),
      '../transport': path.resolve(__dirname, './src/cloudflare/webSocketTransport'),

      // IMPORTANT `require('../playwright')` in `recorderApp.ts` causes a circular dependency,
      // so we need to mock it (it's not needed, it's related with recorder).
      '../playwright': path.resolve(__dirname, './src/shims/empty'),
      './bidiOverCdp': path.resolve(__dirname, './src/shims/empty'),
      'electron/index.js': path.resolve(__dirname, './src/shims/empty'),
    },
  },
  define: {
    '__dirname': `'${baseDir}'`,
  },
  build: {
    outDir: path.resolve(__dirname, './lib/'),
    assetsInlineLimit: 0,
    // skip code obfuscation
    minify: false,
    lib: {
      name: '@cloudflare/playwright',
      entry: path.resolve(__dirname, './src/cloudflare/index.ts'),
      formats: ['es'],
    },
    // prevents __defProp, __defNormalProp, __publicField in compiled code
    target: 'esnext',
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
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
        'node:fs',
        'node:http',
        'node:http2',
        'node:https',
        'node:inspector',
        'node:module',
        'node:net',
        'node:os',
        'node:path',
        'node:process',
        'node:readline',
        'node:stream',
        'node:timers',
        'node:tls',
        'node:url',
        'node:util',
        'node:zlib',
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      extensions: ['.ts', '.js'],
      exclude: [
        path.resolve(__dirname, '../playwright-core/src/cli/**/*.ts'),
      ],
      include: [
        path.resolve(__dirname, '../playwright-core/src/**/*'),
        /node_modules/,
      ],
    }
  },
});
