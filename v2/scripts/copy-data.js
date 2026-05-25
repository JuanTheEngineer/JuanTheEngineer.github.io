// Copy data files from project root into v2/public/ before dev/build
// This lets Vite serve them at /workouts.json etc.
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const v2Root = join(__dirname, '..');
const projectRoot = join(v2Root, '..');
const publicDir = join(v2Root, 'public');

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const files = ['workouts.json', 'exercises.json'];
for (const file of files) {
  const src = join(projectRoot, file);
  const dest = join(publicDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ Source not found: ${src}`);
  }
}
