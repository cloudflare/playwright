import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { writeFile } from './utils.js';

const basedir = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  await build({
    root: basedir,
    resolve: {
      alias: {
        'playwright-core/lib': path.resolve(basedir, '../../playwright-core/src'),
      },
    },
    build: {
      emptyOutDir: false,
      minify: false,
      // prevents __defProp, __defNormalProp, __publicField in compiled code
      target: 'esnext',
      lib: {
        name: 'frameSnapshotStreamer',
        entry: [
          path.join(basedir, '../../playwright-core/src/server/trace/recorder/snapshotterInjected.ts'),
          path.join(basedir, '../../playwright-core/src/utils/isomorphic/utilityScriptSerializers.ts'),
        ],
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
          dir: path.join(basedir, '../src/injected'),
          entryFileNames: `[name].js`,
        },
      },
    },
  });
})();
