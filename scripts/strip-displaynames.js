#!/usr/bin/env node
/**
 * 1. Rename 4 canonical exercises to their better display names
 * 2. Strip ALL displayName fields from workouts.json (singles + groups)
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- Step 1: Rename 4 canonical exercises ---
const RENAMES = {
  'boxpistols': 'Box Pistol Jumps',        // was "Box Pistols"
  'splitsquats': 'DB Split Squat',          // was "Split Squat"
  'floorwashers': 'Floor Washers w/ Reach', // was "Floor Washers" — actually keep original, the w/ Reach is program-specific
  'chinups': 'Chin-ups'                     // was "Weighted Chin-ups"
};

// Actually, "Floor Washers w/ Reach" is only in one program where they add the reach.
// The canonical exercise IS "Floor Washers" — the reach variant is program-specific.
// So let's NOT rename floorwashers. Same logic: boxpistols IS "Box Pistols" canonically,
// "Box Pistol Jumps" is just one program's variation.
// 
// The only real rename is chinups: "Weighted Chin-ups" → "Chin-ups" (more general).
// And splitsquats: "Split Squat" → "DB Split Squat" is debatable (not all programs use DBs).
//
// Let's be conservative: only rename chinups.
const SAFE_RENAMES = {
  'chinups': 'Chin-ups'  // was "Weighted Chin-ups" — "Chin-ups" is more general
};

const exercises = JSON.parse(readFileSync(join(root, 'exercises.json'), 'utf8'));
for (const ex of exercises.exercises) {
  if (SAFE_RENAMES[ex.id]) {
    const oldName = ex.name;
    ex.name = SAFE_RENAMES[ex.id];
    // Preserve old name as alias
    if (!ex.aliases) ex.aliases = [];
    if (!ex.aliases.includes(oldName)) ex.aliases.push(oldName);
    console.log(`  exercises.json: "${oldName}" → "${ex.name}"`);
  }
}
exercises.lastUpdated = new Date().toISOString();
writeFileSync(join(root, 'exercises.json'), JSON.stringify(exercises, null, 2) + '\n');

// --- Step 2: Strip all displayName from workouts.json ---
const workouts = JSON.parse(readFileSync(join(root, 'workouts.json'), 'utf8'));
let stripped = 0;

for (const prog of workouts.programs) {
  for (const item of (prog.items || [])) {
    if (item.displayName) {
      delete item.displayName;
      stripped++;
    }
    // Group-level displayName
    if (item.kind && item.displayName) {
      delete item.displayName;
      stripped++;
    }
    // Don't touch exercises inside groups — they don't have displayName
  }
}

writeFileSync(join(root, 'workouts.json'), JSON.stringify(workouts, null, 2) + '\n');
console.log(`  workouts.json: stripped ${stripped} displayName fields`);
console.log('\nDone.');
