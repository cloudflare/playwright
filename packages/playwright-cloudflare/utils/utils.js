import fs from 'fs';
import path from 'path';

export function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
}

export function deleteDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}
