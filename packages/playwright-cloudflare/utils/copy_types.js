import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const basedir = path.dirname(fileURLToPath(import.meta.url));

const sourceDir = path.join(basedir, '../../playwright-core/types');
const destDir = path.join(basedir, '../types');

fs.mkdirSync(destDir, { recursive: true });

fs.readdirSync(sourceDir).forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(sourceFile, destFile);
});
