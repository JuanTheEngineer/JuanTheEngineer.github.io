#!/usr/bin/env node
/**
 * Fix Duplicate YouTube URLs
 *
 * Many exercises share the same YouTube alternative URLs because they
 * were sourced for the old paired-display name and copied to both
 * partner exercises. This script:
 *
 * 1. Finds all YouTube URLs that appear in 2+ exercises
 * 2. For each duplicate, checks the video notes/title against each
 *    exercise name to determine the best match
 * 3. Removes the URL from the exercise it doesn't belong to
 *
 * Heuristic: if the YouTube notes/title contains words from exercise A's
 * name but not exercise B's name, it belongs to A. If ambiguous (both
 * match or neither match), keep it on the exercise whose Cloudinary
 * primary demo filename is more related, or just keep on the first one.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const filePath = join(root, 'exercises.json');

const data = JSON.parse(readFileSync(filePath, 'utf8'));
const exMap = new Map(data.exercises.map(e => [e.id, e]));

// Build duplicate map: ytUrl -> [exerciseId, ...]
const ytUrlToExercises = new Map();
for (const ex of data.exercises) {
  for (const demo of (ex.demos || [])) {
    if (demo.type === 'youtube' && demo.url) {
      if (!ytUrlToExercises.has(demo.url)) ytUrlToExercises.set(demo.url, []);
      ytUrlToExercises.get(demo.url).push(ex.id);
    }
  }
}

let removed = 0;
let kept = 0;

for (const [url, ids] of ytUrlToExercises) {
  if (ids.length <= 1) continue;

  // Get the demo object from each exercise to check notes
  const entries = ids.map(id => {
    const ex = exMap.get(id);
    const demo = ex.demos.find(d => d.type === 'youtube' && d.url === url);
    return { id, ex, demo };
  });

  // Score each exercise: how well does the YouTube notes/title match the exercise name?
  const scored = entries.map(entry => {
    const notes = (entry.demo?.notes || entry.demo?.metadata?.title || '').toLowerCase();
    const name = entry.ex.name.toLowerCase();
    const nameWords = name.split(/[^a-z]+/).filter(w => w.length > 2);
    const matchCount = nameWords.filter(w => notes.includes(w)).length;
    return { ...entry, score: matchCount, nameWords: nameWords.length };
  });

  // Find the best match
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Remove from all others
  for (let i = 1; i < scored.length; i++) {
    const ex = scored[i].ex;
    const before = ex.demos.length;
    ex.demos = ex.demos.filter(d => !(d.type === 'youtube' && d.url === url));
    if (ex.demos.length < before) removed++;
  }
  kept++;
}

data.lastUpdated = new Date().toISOString();
writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');

console.log(`\n✓ Processed ${ytUrlToExercises.size} unique YouTube URLs`);
console.log(`  Duplicates resolved: ${kept} URLs kept on best-match exercise`);
console.log(`  Demos removed: ${removed} (from wrong partner exercises)`);
console.log(`  File updated: exercises.json\n`);
