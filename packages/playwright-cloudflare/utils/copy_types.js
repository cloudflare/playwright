import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const basedir = path.dirname(fileURLToPath(import.meta.url));

const destDir = path.join(basedir, '../types');

fs.mkdirSync(destDir, { recursive: true });

const sourceDir = path.join(basedir, '../../playwright-core/types');
for (const file of fs.readdirSync(sourceDir)) {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(sourceFile, destFile);
}

const testFileContent = fs.readFileSync(path.join(basedir, '../../playwright/types/test.d.ts'), 'utf8');
const updatedContent = testFileContent.replace(/(import|export) (.*) from 'playwright-core'/g, '$1 $2 from \'./types\'');
fs.writeFileSync(path.join(destDir, 'test.d.ts'), updatedContent, 'utf8');

// Add explicit ESM extensions to all relative specifiers for NodeNext module resolution.
// Upstream playwright-core types use extension-less imports which fail with
// moduleResolution: NodeNext or Node16.
for (const file of fs.readdirSync(destDir)) {
  if (!file.endsWith('.d.ts')) continue;
  const filePath = path.join(destDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /((?:^\s*(?:import|export)\b[^;\n]*?\bfrom|^\s*declare module)\s+['"]|import\s*\(\s*['"])(\.\.?\/[^'"]+?)(['"])/gm,
    (_, prefix, specifier, suffix) => {
      const normalizedSpecifier = specifier.replace(/\.d\.ts$/, '.js');
      return /\.(?:js|mjs|cjs|json)$/.test(normalizedSpecifier)
        ? `${prefix}${normalizedSpecifier}${suffix}`
        : `${prefix}${normalizedSpecifier}.js${suffix}`;
    }
  );
  fs.writeFileSync(filePath, content, 'utf8');

  // Assertion: verify no extension-less relative specifiers remain
  const sourceWithoutComments = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  const remaining = sourceWithoutComments.match(
    /(?:(?:from|declare module)\s+['"]|import\s*\(\s*['"])(?:\.\.?\/[^'"]*['"]\s*\)?)/g
  );
  if (remaining?.length) {
    const unfixed = remaining.filter(s => !s.match(/\.(?:js|mjs|cjs|json)['"]/));
    if (unfixed.length) {
      throw new Error(`Unfixed specifiers in ${file}:\n${unfixed.join('\n')}`);
    }
  }
}

