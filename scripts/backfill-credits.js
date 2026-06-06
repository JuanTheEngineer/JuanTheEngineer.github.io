#!/usr/bin/env node
/**
 * Backfill creator credits on YouTube demos using oEmbed (no API key needed).
 * Fetches title + author_name for every YouTube demo missing metadata.channel.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const EXERCISES_PATH = join(ROOT, 'exercises.json');

const data = JSON.parse(readFileSync(EXERCISES_PATH, 'utf8'));
let filled = 0, failed = 0, skipped = 0;

console.log('\n🎬 Backfilling YouTube creator credits via oEmbed...\n');

async function main() {
  for (const ex of data.exercises) {
    for (const demo of ex.demos || []) {
      if (demo.type !== 'youtube') { skipped++; continue; }
      if (demo.metadata?.channel) { skipped++; continue; }

      try {
        const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(demo.url)}&format=json`;
        const res = await fetch(url);
        if (!res.ok) { failed++; continue; }
        const info = await res.json();

        if (!demo.metadata) demo.metadata = {};
        demo.metadata.channel = info.author_name || '';
        demo.metadata.title = info.title || '';
        if (!demo.notes && info.title) demo.notes = info.title;
        filled++;

        if (filled % 20 === 0) console.log(`   ... ${filled} filled so far`);
        await new Promise(r => setTimeout(r, 100)); // rate limit
      } catch {
        failed++;
      }
    }
  }

  data.lastUpdated = new Date().toISOString();
  writeFileSync(EXERCISES_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✅ Done. Filled: ${filled} | Failed: ${failed} | Skipped: ${skipped}\n`);
}

main();
