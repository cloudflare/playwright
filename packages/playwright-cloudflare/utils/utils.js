import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
}

export function deleteDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

export function listFiles(dir, options) {
  const files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && options?.recursive) {
      files.push(...listFiles(fullPath));
    } else if (stat.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

export function encodeFilesToBase64(rootPath, relativePaths) {
  const result = {};

  for (const relPath of relativePaths) {
    const fullPath = path.join(rootPath, relPath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory())
      continue;

    const content = fs.readFileSync(fullPath); // buffer
    const compressed = zlib.gzipSync(content);
    result[relPath] = compressed.toString('base64');
  }

  return result;
}

export function decodeBase64ToFiles(outputFolder, filesObject) {
  for (const [relPath, base64Data] of Object.entries(filesObject)) {
    const compressed = Buffer.from(base64Data, 'base64');
    const decompressed = zlib.gunzipSync(compressed);
    const fullPath = path.join(outputFolder, relPath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, decompressed);
  }
}
