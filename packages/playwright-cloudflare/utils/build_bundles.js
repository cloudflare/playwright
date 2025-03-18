import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const bundles = {
  'utilsBundleImpl': '../../playwright-core/bundles/utils',
  'zipBundleImpl': '../../playwright-core/bundles/zip',
  'expectBundleImpl': '../../playwright/bundles/expect',
  'fs': '../bundles/fs',
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
  'zlib',
];

const basedir = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  for (const [name, bundleDir] of Object.entries(bundles)) {
    const root = path.join(basedir, bundleDir);
    await build({
      root,
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
          external: name === 'fs' ? external : [...external, 'fs'],
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