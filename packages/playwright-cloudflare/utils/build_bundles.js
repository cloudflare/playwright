import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const bundles = {
  // pngjs needs to bundle browserify-zlib, it throws an error when trying to use workers runtime zlib:
  // Error: Class constructor Inflate cannot be invoked without 'new'
  // It needs to build before other bundles, because they may depend on it
  'pngjs': '../bundles/pngjs',
  'fs': '../bundles/fs',
  'utilsBundleImpl': '../../playwright-core/bundles/utils',
  'zipBundleImpl': '../../playwright-core/bundles/zip',
  'expectBundleImpl': '../../playwright/bundles/expect',
};

const external = [
  'assert',
  'buffer',
  'child_process',
  'constants',
  'crypto',
  'dns',
  'events',
  'http',
  'https',
  'module',
  'net',
  'os',
  'path',
  'process',
  'stream',
  'tls',
  'url',
  'util',
];

const basedir = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  for (const [name, bundleDir] of Object.entries(bundles)) {
    const root = path.join(basedir, bundleDir);
    await build({
      root,
      resolve: {
        alias: {
          'node:events': 'events',
          'node:child_process': 'child_process',
          'node:path': 'path',
          'node:fs': 'fs',
          'node:process': 'process',

          ...(name === 'pngjs' ? { 'zlib': 'browserify-zlib' } :
          { 'pngjs': path.join(basedir, `../src/bundles/pngjs.js` ) }),
        },
      },
      build: {
        emptyOutDir: false,
        minify: false,
        // prevents __defProp, __defNormalProp, __publicField in compiled code
        target: 'esnext',
        lib: {
          name,
          entry: path.join(root, `./src/${name}.ts`),
          formats: ['es'],
        },
        rollupOptions: {
          external: [
            'formidable',
            'ansi-styles',

            ...(name === 'fs' ? [...external, 'zlib']
              : name === 'pngjs' ? [...external, 'fs']
              : [...external, 'fs', 'zlib', 'pngjs'])
          ],
          output: {
            dir: path.join(basedir, '../src/bundles'),
            entryFileNames: `${name}.js`,
          },
        },
        commonjsOptions: {
          transformMixedEsModules: true,
          extensions: ['.ts', '.js'],
          include: [
            path.join(root, './src/**/*'),
            /node_modules/,
          ],
        }
      },
    });
  }
})();
