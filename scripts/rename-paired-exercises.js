#!/usr/bin/env node
/**
 * One-shot canonical rename pass.
 *
 * Many exercises in exercises.json carry legacy paired display names like
 * "Cable Lateral Pullovers & Zottman Curls" because they came from the
 * old GIF-pair era. Each id's primary demo is actually solo and correct;
 * only the `name` field is wrong.
 *
 * This script:
 *   1. Renames each affected exercise to its true solo name
 *   2. Records the old paired name in `aliases` (preserved for search)
 *   3. Updates lastUpdated
 *
 * Demos are not touched. YouTube alternatives may still be duplicated
 * across pair-partners; that is a separate cleanup.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '..', 'exercises.json');

// Map of id -> new canonical name.
// Generic placeholder included alongside the paired-name renames.
const RENAMES = {
  // Paired display names — split into solo movements
  'barbellsquat': 'Barbell Squat',
  'cablelateralpullovers': 'Cable Lateral Pullover',
  'zottmancurls': 'Zottman Curl',
  'chestflies': 'Chest Fly',
  'frontraises': 'Front Raise',
  'pullovers': 'Pull-over',
  'closegrippulldowns': 'Close Grip Pulldown',
  'cablerows': 'Cable Row',
  'dbrdls': 'DB Romanian Deadlift',
  'splitsquats': 'Split Squat',
  'dips': 'Dip',
  'elevatedheelgobletsquat': 'Elevated Heel Goblet Squat',
  'legcurls': 'Leg Curl',
  'flatbenchpress': 'Flat Bench Press',
  'frontsquatisoholds': 'Front Squat Iso-Hold',
  'boxjumps': 'Box Jump',
  'hipabductions': 'Hip Abduction',
  'calfraises': 'Calf Raise',
  'hipext': 'Hip Extension w/ Unilateral Eccentric',
  'sldbrdl': 'Single-Leg DB Romanian Deadlift',
  'kbswings': 'KB Swing',
  'boxdepthdrop': 'Box Depth Drop',
  'broadjumps': 'Broad Jump',
  'krocrows2': 'Kroc Row',
  'scarecrows': 'Scarecrow',
  'ngdbinclinebench': 'Neutral-Grip DB Incline Bench Press',
  'feetelevatedpushups': 'Feet-Elevated Push-up',
  'shrugs': 'Shrug',
  'crushgripcurls': 'Crush Grip Curl',
  'skullcrushers': 'Skullcrusher',
  'dbsidelateralraises': 'DB Side Lateral Raise',
  'splitsquatisohold': 'Split Squat Iso-Hold',
  'widegrippulldowns': 'Wide Grip Pulldown',
  'bentoverrows': 'Bent-over Row',

  // Generic placeholder
  'posture-ex1': 'Posture Drill'
};

const data = JSON.parse(readFileSync(filePath, 'utf-8'));

let renamed = 0;
const missing = [];

for (const exercise of data.exercises) {
  if (!(exercise.id in RENAMES)) continue;

  const newName = RENAMES[exercise.id];
  const oldName = exercise.name;

  if (oldName === newName) continue; // already renamed

  // Preserve old name as alias (for search), avoid duplicates
  const aliases = exercise.aliases || [];
  if (oldName && !aliases.includes(oldName)) {
    aliases.push(oldName);
  }

  exercise.name = newName;
  exercise.aliases = aliases;
  renamed++;

  console.log(`  ${exercise.id.padEnd(30)} ${oldName} -> ${newName}`);
}

// Sanity check: warn about ids in RENAMES that didn't exist
const ids = new Set(data.exercises.map(e => e.id));
for (const id of Object.keys(RENAMES)) {
  if (!ids.has(id)) missing.push(id);
}
if (missing.length) {
  console.warn(`\n⚠ Missing ids (not in exercises.json):`, missing);
}

data.lastUpdated = new Date().toISOString();

writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`\n✓ Renamed ${renamed} exercises in ${filePath}`);
