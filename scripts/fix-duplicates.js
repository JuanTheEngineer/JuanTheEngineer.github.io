#!/usr/bin/env node
/**
 * Fix 3 duplicate exercise pairs by:
 * 1. Remapping references in workouts.json to the canonical id
 * 2. Removing the duplicate entries from exercises.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Remap: duplicate → canonical
const REMAPS = {
  'dumbbell-chest-press': 'db-chest-press',
  'split-squat-hold-with-hands-overhead': 'split-squat-hold-hands-overhead',
  'trapbar-deadlift': 'trapbardeadlift'
};

// Fix workouts.json
let workoutsRaw = readFileSync(join(root, 'workouts.json'), 'utf8');
for (const [from, to] of Object.entries(REMAPS)) {
  const regex = new RegExp(`"${from}"`, 'g');
  const count = (workoutsRaw.match(regex) || []).length;
  workoutsRaw = workoutsRaw.replace(regex, `"${to}"`);
  if (count > 0) console.log(`  workouts.json: "${from}" → "${to}" (${count} refs)`);
}
writeFileSync(join(root, 'workouts.json'), workoutsRaw);

// Fix exercises.json — remove duplicates
const exercises = JSON.parse(readFileSync(join(root, 'exercises.json'), 'utf8'));
const removeIds = new Set(Object.keys(REMAPS));
const before = exercises.exercises.length;
exercises.exercises = exercises.exercises.filter(e => !removeIds.has(e.id));
exercises.lastUpdated = new Date().toISOString();
writeFileSync(join(root, 'exercises.json'), JSON.stringify(exercises, null, 2) + '\n');
console.log(`  exercises.json: removed ${before - exercises.exercises.length} duplicates (${exercises.exercises.length} remaining)`);
console.log('\nDone.');
