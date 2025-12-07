import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const bundles = {
  // pngjs needs to bundle browserify-zlib, it throws an error when trying to use workers runtime zlib:
  // Error: Class constructor Inflate cannot be invoked without 'new'
  // It needs to build before other bundles, because they may depend on it
  'pngjs': '../bundles/pngjs',
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
  'fs',
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
    const nodeModulesDir = path.join(root, 'node_modules');
    const nodeModulesLibs = fs.readdirSync(nodeModulesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .flatMap(dirent => dirent.name.startsWith('@')
        // expand scoped packages (the ones that start with @)
        ? fs.readdirSync(path.join(nodeModulesDir, dirent.name), { withFileTypes: true })
          .filter(subdirent => subdirent.isDirectory())
          .map(subdirent => `${dirent.name}/${subdirent.name}`)
        : [dirent.name]);
    const jestDir = path.join(basedir, '..', 'submodules', 'jest');

    // we'll use jest packages source code instead of npm packages
    const jestPackages = Object.fromEntries(fs.readdirSync(path.join(jestDir, 'packages'), { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() &&
        fs.existsSync(path.join(jestDir, 'packages', dirent.name, 'package.json')) &&
        fs.existsSync(path.join(jestDir, 'packages', dirent.name, 'src', 'index.ts')))
      .map(dirent => [
        JSON.parse(fs.readFileSync(path.join(jestDir, 'packages', dirent.name, 'package.json'), 'utf-8')).name,
        path.join(jestDir, 'packages', dirent.name, 'src', 'index.ts')
      ]));

    await build({
      root,
      resolve: {
        dedupe: nodeModulesLibs,
        alias: {
          'node:events': 'events',
          'node:child_process': 'child_process',
          'node:path': 'path',
          'node:fs': 'fs',
          'node:process': 'process',

          // jest npm package is commonjs, 
          ...jestPackages,

          'commander': path.join(basedir, '../src/mocks/commander'),
          'socks-proxy-agent': path.join(basedir, '../src/mocks/socksProxyAgent'),
          'open': path.join(basedir, '../src/mocks/open'),

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
            ...(name === 'pngjs' ? external
              : [...external, 'zlib', 'pngjs'])
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
            path.join(root, './node_modules/**/*'),
          ],
        }
      },
    });
  }
})();
