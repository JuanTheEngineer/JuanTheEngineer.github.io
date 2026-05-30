#!/usr/bin/env node
/**
 * Data Audit Script
 *
 * Scans exercises.json and workouts.json for:
 * 1. Exercises with 0 demos
 * 2. Demos with likely broken URLs (404 candidates)
 * 3. Duplicate YouTube URLs shared across exercises
 * 4. Programs referencing non-existent exercise ids
 * 5. Exercises never referenced by any program
 * 6. Exercises with empty/generic names
 * 7. Demos missing required fields (type, url)
 *
 * Output: structured report to stdout + summary counts.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const exercises = JSON.parse(readFileSync(join(root, 'exercises.json'), 'utf-8'));
const workouts = JSON.parse(readFileSync(join(root, 'workouts.json'), 'utf-8'));

const exMap = new Map(exercises.exercises.map(e => [e.id, e]));
const report = { noDemos: [], brokenDemos: [], duplicateYouTube: [], orphanRefs: [], neverUsed: [], badNames: [], malformedDemos: [] };

// --- 1. Exercises with 0 demos ---
for (const ex of exercises.exercises) {
  if (!ex.demos || ex.demos.length === 0) {
    report.noDemos.push({ id: ex.id, name: ex.name });
  }
}

// --- 2 & 7. Demo URL issues ---
for (const ex of exercises.exercises) {
  for (const demo of (ex.demos || [])) {
    if (!demo.type || !demo.url) {
      report.malformedDemos.push({ exerciseId: ex.id, demo });
      continue;
    }
    // Flag likely broken: empty url, localhost, or placeholder
    if (!demo.url.trim() || demo.url.includes('localhost') || demo.url.includes('example.com')) {
      report.brokenDemos.push({ exerciseId: ex.id, url: demo.url, reason: 'placeholder/empty' });
    }
    // Flag cloudinary URLs that might 404 (we can't HTTP check here, but flag suspicious patterns)
    if (demo.type === 'cloudinary' && !demo.url.includes('res.cloudinary.com')) {
      report.brokenDemos.push({ exerciseId: ex.id, url: demo.url, reason: 'cloudinary URL missing domain' });
    }
  }
}

// --- 3. Duplicate YouTube URLs across exercises ---
const ytUrlToExercises = new Map();
for (const ex of exercises.exercises) {
  for (const demo of (ex.demos || [])) {
    if (demo.type === 'youtube' && demo.url) {
      const key = demo.url.replace(/https?:\/\/(www\.)?/, '');
      if (!ytUrlToExercises.has(key)) ytUrlToExercises.set(key, []);
      ytUrlToExercises.get(key).push(ex.id);
    }
  }
}
for (const [url, ids] of ytUrlToExercises) {
  if (ids.length > 1) {
    report.duplicateYouTube.push({ url, sharedBy: ids });
  }
}

// --- 4. Programs referencing non-existent exercise ids ---
function collectExerciseIds(items) {
  const ids = [];
  for (const item of (items || [])) {
    if (item.exerciseId) ids.push(item.exerciseId);
    if (item.exercises) {
      for (const m of item.exercises) {
        if (m.exerciseId) ids.push(m.exerciseId);
      }
    }
  }
  return ids;
}

for (const prog of workouts.programs) {
  const refs = collectExerciseIds(prog.items);
  for (const ref of refs) {
    if (!exMap.has(ref)) {
      report.orphanRefs.push({ programId: prog.id, programTitle: prog.title, missingExerciseId: ref });
    }
  }
}

// --- 5. Exercises never referenced by any program ---
const allRefs = new Set();
for (const prog of workouts.programs) {
  for (const ref of collectExerciseIds(prog.items)) {
    allRefs.add(ref);
  }
}
for (const ex of exercises.exercises) {
  if (!allRefs.has(ex.id)) {
    report.neverUsed.push({ id: ex.id, name: ex.name });
  }
}

// --- 6. Bad/generic names ---
for (const ex of exercises.exercises) {
  if (!ex.name || ex.name.length < 3) {
    report.badNames.push({ id: ex.id, name: ex.name, reason: 'too short' });
  }
  if (/^Exercise \d+$/i.test(ex.name)) {
    report.badNames.push({ id: ex.id, name: ex.name, reason: 'generic placeholder' });
  }
}

// --- Output ---
console.log('\n═══════════════════════════════════════════');
console.log('  DATA AUDIT REPORT');
console.log('═══════════════════════════════════════════\n');

const sections = [
  { key: 'noDemos', label: '❌ Exercises with 0 demos', desc: 'These exercises have no media — users see "No demos available"' },
  { key: 'brokenDemos', label: '🔗 Likely broken demo URLs', desc: 'Placeholder, empty, or malformed URLs' },
  { key: 'malformedDemos', label: '⚠️  Malformed demo entries', desc: 'Missing required type or url field' },
  { key: 'duplicateYouTube', label: '🔁 Duplicate YouTube URLs', desc: 'Same YouTube video shared across multiple exercises (legacy pair issue)' },
  { key: 'orphanRefs', label: '👻 Orphan exercise references', desc: 'Programs reference exercise ids that don\'t exist in exercises.json' },
  { key: 'neverUsed', label: '🗂️  Exercises never used in any program', desc: 'Canonical exercises not referenced by any program' },
  { key: 'badNames', label: '📛 Bad/generic exercise names', desc: 'Names that are too short or generic placeholders' }
];

let totalIssues = 0;
for (const { key, label, desc } of sections) {
  const items = report[key];
  totalIssues += items.length;
  console.log(`${label} (${items.length})`);
  console.log(`  ${desc}`);
  if (items.length === 0) { console.log('  ✓ None found\n'); continue; }
  for (const item of items.slice(0, 20)) {
    console.log(`  • ${JSON.stringify(item)}`);
  }
  if (items.length > 20) console.log(`  ... and ${items.length - 20} more`);
  console.log('');
}

console.log('═══════════════════════════════════════════');
console.log(`  TOTAL ISSUES: ${totalIssues}`);
console.log(`  Exercises: ${exercises.exercises.length}`);
console.log(`  Programs: ${workouts.programs.length}`);
console.log('═══════════════════════════════════════════\n');
