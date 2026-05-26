#!/usr/bin/env node
/**
 * Migrate workouts.json from v1 schema to v2 schema.
 *
 * v1 (old):
 *   programs[].exercises[]: { name, gif, cloudinaryUrl, reps, sets, repUnits, note,
 *                              alternatives, subExercise, compoundExercises }
 *
 * v2 (new):
 *   programs[].items[]: { exerciseId, reps?, sets?, repUnits?, note?, tags?, displayName? }
 *                    OR { kind, exercises: [{exerciseId, reps?, ...}], note?, displayName? }
 *
 * The script:
 * 1. Backs up workouts.json → workouts.v1.json
 * 2. For each exercise, looks up its id in exercises.json by gif filename
 * 3. Converts to single item or group item depending on subExercise/compoundExercises
 * 4. Detects warmup/cooldown/stretch from name prefix and adds tags
 * 5. Preserves displayName when it differs from the canonical name
 * 6. Writes new workouts.json
 *
 * Run: node scripts/migrate-workouts-to-v2.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const workouts = JSON.parse(fs.readFileSync(path.join(projectRoot, 'workouts.json'), 'utf-8'));
const library = JSON.parse(fs.readFileSync(path.join(projectRoot, 'exercises.json'), 'utf-8'));

// Build gif filename -> exerciseId index
const gifToExerciseId = new Map();
for (const ex of library.exercises) {
  for (const demo of ex.demos || []) {
    if (demo.type === 'local' || demo.type === 'cloudinary') {
      const filename = demo.url.split('/').pop().split('?')[0];
      const base = filename.replace(/\.[^.]+$/, '').toLowerCase();
      if (!gifToExerciseId.has(base)) gifToExerciseId.set(base, ex.id);
    }
  }
}

function findExerciseId(gifPath) {
  if (!gifPath) return null;
  const base = path.basename(gifPath).replace(/\.[^.]+$/, '').toLowerCase();
  return gifToExerciseId.get(base) || null;
}

/**
 * Generate a kebab-case id from a name when there's no media file.
 */
function nameToId(name) {
  if (!name) return null;
  return name
    .replace(/^(Exercise|Warm Up|Strength|Stretch|Cool Down|Finisher)\s*\d*\s*:\s*/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Detect tags from the name prefix.
 * "Warm Up 1: Foo" -> ['warmup'], "Cool Down: Bar" -> ['cooldown'], etc.
 */
function detectTags(name) {
  if (!name) return [];
  const lower = name.toLowerCase();
  const tags = [];
  if (/^warm[\s-]?up/.test(lower)) tags.push('warmup');
  if (/^cool[\s-]?down/.test(lower)) tags.push('cooldown');
  if (/^stretch/.test(lower)) tags.push('stretch');
  if (/^finisher/.test(lower)) tags.push('finisher');
  return tags;
}

/**
 * Strip prefix from name to get the exercise core name.
 * "Exercise 1: DB Squat Jumps" -> "DB Squat Jumps"
 */
function cleanName(name) {
  if (!name) return name;
  return name.replace(/^(Exercise|Warm Up|Strength|Stretch|Cool Down|Finisher)\s*\d*\s*:\s*/i, '').trim();
}

let unresolvedCount = 0;
const newLibraryEntries = new Map(); // id -> exercise to add to library

function ensureLibraryEntry(name, gifPath, recommendations) {
  const id = nameToId(name);
  if (!id) return null;
  if (gifToExerciseId.has(id) || library.exercises.some(e => e.id === id)) return id;

  if (!newLibraryEntries.has(id)) {
    const entry = {
      id,
      name: cleanName(name) || name,
      demos: [] // Empty: no media yet
    };
    if (recommendations && Object.keys(recommendations).length > 0) {
      entry.recommendations = recommendations;
    }
    newLibraryEntries.set(id, entry);
  }
  return id;
}

function buildOverrides(ex) {
  const overrides = {};
  if (ex.reps !== undefined) overrides.reps = ex.reps;
  if (ex.sets !== undefined) overrides.sets = ex.sets;
  if (ex.repUnits !== undefined) overrides.repUnits = ex.repUnits;
  if (ex.note) overrides.note = ex.note;
  return overrides;
}

function convertExercise(ex) {
  // Compound exercises (an array of inline exercises with no parent gif)
  if (ex.compoundExercises) {
    const members = ex.compoundExercises.map((member, idx) => {
      let id = findExerciseId(member.gif);
      if (!id) {
        id = ensureLibraryEntry(member.name || `${ex.name || 'Exercise'} ${idx + 1}`, member.gif);
      }
      if (!id) unresolvedCount++;
      return {
        exerciseId: id || '_UNRESOLVED_',
        ...buildOverrides(member)
      };
    });

    const item = {
      kind: 'compound',
      exercises: members
    };
    if (ex.name) item.displayName = ex.name;
    const tags = detectTags(ex.name);
    if (tags.length) item.tags = tags;
    return item;
  }

  // Sub-exercise pattern (parent + sub) — convert to superset (both equal)
  if (ex.subExercise) {
    let parentId = findExerciseId(ex.gif);
    if (!parentId) parentId = ensureLibraryEntry(ex.name, ex.gif, buildOverrides(ex));
    let subId = findExerciseId(ex.subExercise.gif);
    if (!subId) subId = ensureLibraryEntry(ex.subExercise.name || `${ex.name} (Part 2)`, ex.subExercise.gif);
    if (!parentId) unresolvedCount++;
    if (!subId) unresolvedCount++;

    const item = {
      kind: 'superset',
      exercises: [
        { exerciseId: parentId || '_UNRESOLVED_', ...buildOverrides(ex) },
        { exerciseId: subId || '_UNRESOLVED_', ...buildOverrides(ex.subExercise) }
      ]
    };
    if (ex.name) item.displayName = ex.name;
    const tags = detectTags(ex.name);
    if (tags.length) item.tags = tags;
    return item;
  }

  // Standard single exercise
  let id = findExerciseId(ex.gif);
  if (!id) id = ensureLibraryEntry(ex.name, ex.gif, buildOverrides(ex));
  if (!id) unresolvedCount++;

  const item = {
    exerciseId: id || '_UNRESOLVED_',
    ...buildOverrides(ex)
  };

  if (ex.name) {
    const cleaned = cleanName(ex.name);
    if (cleaned !== ex.name) item.displayName = ex.name;
  }

  const tags = detectTags(ex.name);
  if (tags.length) item.tags = tags;

  return item;
}

// Run migration
const v2 = {
  programs: workouts.programs.map(program => {
    const out = {
      id: program.id,
      title: program.title
    };
    if (program.requirements) out.requirements = program.requirements;
    if (program.description) out.description = program.description;
    if (program.category) out.category = program.category;
    if (program.difficulty) out.difficulty = program.difficulty;
    if (program.duration) out.duration = program.duration;
    if (program.tags) out.tags = program.tags;
    out.items = (program.exercises || []).map(convertExercise);
    return out;
  })
};

// Backup old file
const backupPath = path.join(projectRoot, 'workouts.v1.json');
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, JSON.stringify(workouts, null, 2));
  console.log('✓ Backed up old workouts.json → workouts.v1.json');
}

// Write new file
fs.writeFileSync(path.join(projectRoot, 'workouts.json'), JSON.stringify(v2, null, 2));
console.log(`✓ Migrated ${v2.programs.length} programs to v2 schema`);

// Append new exercises to library if any were generated
if (newLibraryEntries.size > 0) {
  // Backup old library
  const libBackupPath = path.join(projectRoot, 'exercises.v1.json');
  if (!fs.existsSync(libBackupPath)) {
    fs.writeFileSync(libBackupPath, JSON.stringify(library, null, 2));
    console.log('✓ Backed up old exercises.json → exercises.v1.json');
  }

  const updatedLibrary = {
    ...library,
    lastUpdated: new Date().toISOString(),
    exercises: [...library.exercises, ...Array.from(newLibraryEntries.values())]
      .sort((a, b) => a.name.localeCompare(b.name))
  };
  fs.writeFileSync(path.join(projectRoot, 'exercises.json'), JSON.stringify(updatedLibrary, null, 2));
  console.log(`✓ Added ${newLibraryEntries.size} placeholder exercises to library (no media yet)`);
}

const totalItems = v2.programs.reduce((sum, p) => sum + p.items.length, 0);
const groupItems = v2.programs.reduce((sum, p) => sum + p.items.filter(i => i.kind).length, 0);
console.log(`✓ Total items: ${totalItems} (${groupItems} groups, ${totalItems - groupItems} singles)`);
if (unresolvedCount > 0) {
  console.warn(`⚠ ${unresolvedCount} exercise references couldn't be resolved (look for _UNRESOLVED_ in workouts.json)`);
}
console.log('\n✨ Migration complete. Old file preserved at workouts.v1.json');
