#!/usr/bin/env node
/**
 * Smoke test: validates data integrity and build output.
 * Run after every commit to catch regressions.
 *
 * Usage: node scripts/smoke-test.js
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const projectRoot = join(root, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

console.log('\n🧪 Smoke Test\n');

// --- 1. Data files exist and parse ---
console.log('Data files:');
const exercisesPath = join(projectRoot, 'exercises.json');
const workoutsPath = join(projectRoot, 'workouts.json');
const plansPath = join(projectRoot, 'plans.json');

assert(existsSync(exercisesPath), 'exercises.json exists');
assert(existsSync(workoutsPath), 'workouts.json exists');
assert(existsSync(plansPath), 'plans.json exists');

const exercises = JSON.parse(readFileSync(exercisesPath, 'utf8'));
const workouts = JSON.parse(readFileSync(workoutsPath, 'utf8'));
const plans = JSON.parse(readFileSync(plansPath, 'utf8'));

assert(exercises.exercises.length > 0, `exercises.json has ${exercises.exercises.length} exercises`);
assert(workouts.programs.length > 0, `workouts.json has ${workouts.programs.length} programs`);
assert(plans.plans.length > 0, `plans.json has ${plans.plans.length} plans`);

// --- 2. No duplicate exercise IDs ---
console.log('\nData integrity:');
const exIds = exercises.exercises.map(e => e.id);
const dupes = exIds.filter((id, i) => exIds.indexOf(id) !== i);
assert(dupes.length === 0, `No duplicate exercise IDs${dupes.length ? ': ' + dupes.join(', ') : ''}`);

// --- 3. All program exercise references resolve ---
const exMap = new Set(exIds);
let orphans = 0;
for (const prog of workouts.programs) {
  for (const item of (prog.items || [])) {
    if (item.exerciseId && !exMap.has(item.exerciseId)) orphans++;
    if (item.exercises) {
      for (const m of item.exercises) {
        if (m.exerciseId && !exMap.has(m.exerciseId)) orphans++;
      }
    }
  }
}
assert(orphans === 0, `All exercise references resolve (${orphans} orphans)`);

// --- 4. All plan program references resolve ---
const progIds = new Set(workouts.programs.map(p => p.id));
let missingProgs = 0;
for (const plan of plans.plans) {
  for (const sub of (plan.subPlans || [])) {
    for (const pid of (sub.programs || [])) {
      if (!progIds.has(pid)) missingProgs++;
    }
  }
}
assert(missingProgs === 0, `All plan program references resolve (${missingProgs} missing)`);

// --- 5. No exercises with displayName (removed) ---
let hasDisplayName = 0;
for (const prog of workouts.programs) {
  for (const item of (prog.items || [])) {
    if (item.displayName) hasDisplayName++;
  }
}
assert(hasDisplayName === 0, `No displayName fields in workouts.json (${hasDisplayName} found)`);

// --- 6. Build output exists ---
console.log('\nBuild output:');
const distIndex = join(projectRoot, 'docs', 'index.html');
assert(existsSync(distIndex), 'docs/index.html exists (run npm run build first)');

// --- Summary ---
console.log(`\n${'═'.repeat(40)}`);
console.log(`  ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
