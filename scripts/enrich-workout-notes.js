#!/usr/bin/env node
/**
 * Workout Notes Enrichment
 *
 * Goes through each program's exercises. If an item has no note (or only a
 * generic "Meant to be a Super Set" note), replaces it with guru-level
 * form advice in under 100 words.
 *
 * Only fills items where it's confident the exercise name is clear enough
 * to give good advice. Skips items with existing meaningful notes.
 *
 * Usage:
 *   node scripts/enrich-workout-notes.js                # live run
 *   node scripts/enrich-workout-notes.js --dry-run      # preview only
 *
 * Requires in .env:
 *   OPENAI_API_KEY=sk-...
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WORKOUTS_PATH = join(ROOT, 'workouts.json');
const EXERCISES_PATH = join(ROOT, 'exercises.json');

const OPENAI_API_KEY = getEnv('OPENAI_API_KEY');
const DRY_RUN = process.argv.includes('--dry-run');

// Load data
const workoutsData = JSON.parse(readFileSync(WORKOUTS_PATH, 'utf8'));
const exercisesData = JSON.parse(readFileSync(EXERCISES_PATH, 'utf8'));
const exerciseMap = new Map(exercisesData.exercises.map(e => [e.id, e]));

// Notes that are generic / not useful — treat as "no note"
const GENERIC_NOTES = new Set([
  'Meant to be a Super Set.',
  'Note: Meant to be a Super Set.',
  'Note: .',
  '.',
  ''
]);

function isGenericNote(note) {
  if (!note) return true;
  const trimmed = note.trim();
  if (GENERIC_NOTES.has(trimmed)) return true;
  if (trimmed.toLowerCase().startsWith('meant to be a super set')) return true;
  if (trimmed.toLowerCase().startsWith('note: meant to be')) return true;
  return false;
}

console.log(`\n🏋️  Workout Notes Enrichment`);
console.log(`   ${workoutsData.programs.length} programs | ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

async function main() {
  let filled = 0;
  let skipped = 0;
  let errors = 0;

  for (const program of workoutsData.programs) {
    console.log(`\n── ${program.title} ──`);

    for (const item of program.items || []) {
      // Handle groups (supersets/circuits)
      if (item.kind || item.exercises) {
        const members = item.exercises || [];
        for (const member of members) {
          const result = await processItem(member, program.title);
          if (result === 'filled') filled++;
          else if (result === 'skipped') skipped++;
          else errors++;
        }
      } else {
        // Single exercise
        const result = await processItem(item, program.title);
        if (result === 'filled') filled++;
        else if (result === 'skipped') skipped++;
        else errors++;
      }
    }
  }

  // Save
  if (!DRY_RUN) {
    writeFileSync(WORKOUTS_PATH, JSON.stringify(workoutsData, null, 2) + '\n');
    console.log(`\n✅ Saved to workouts.json`);
  } else {
    console.log(`\n🔍 Dry run — no changes written`);
  }

  console.log(`\n   Filled: ${filled} | Skipped: ${skipped} | Errors: ${errors}\n`);
}

async function processItem(item, programTitle) {
  const exerciseId = item.exerciseId;
  if (!exerciseId) return 'skipped';

  const exercise = exerciseMap.get(exerciseId);
  const name = exercise?.name || exerciseId;

  // Skip if already has a meaningful note
  if (!isGenericNote(item.note)) {
    return 'skipped';
  }

  // Generate note
  try {
    const note = await generateWorkoutNote(name, item.reps, item.sets, item.repUnits);
    if (note) {
      console.log(`   ✓ ${name}: "${note.substring(0, 50)}..."`);
      item.note = note;
      await sleep(200);
      return 'filled';
    }
    return 'skipped';
  } catch (err) {
    console.log(`   ✗ ${name}: ${err.message}`);
    return 'error';
  }
}

async function generateWorkoutNote(exerciseName, reps, sets, repUnits) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an elite personal trainer giving quick form advice. Write a note for someone about to do this exercise in their workout. Maximum 100 words. Be direct, practical — as if you're coaching them in person.

Include:
- The most important form cue
- What to feel / where the tension should be
- A common mistake to avoid

Do NOT start with the exercise name. Do NOT say "Note:" at the start. Just give the advice directly.`
        },
        {
          role: 'user',
          content: `Exercise: ${exerciseName}${reps ? `, ${reps} ${repUnits || 'reps'}` : ''}${sets ? `, ${sets} sets` : ''}`
        }
      ],
      temperature: 0.4,
      max_tokens: 150
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.substring(0, 80)}`);
  }

  const json = await res.json();
  return json.choices[0]?.message?.content?.trim() || '';
}

function getEnv(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envFile = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of envFile.split('\n')) {
      const [k, ...vParts] = line.split('=');
      if (k.trim() === key) return vParts.join('=').trim();
    }
  } catch {}
  console.error(`❌ Missing env var: ${key}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error(`\n❌ Fatal: ${err.message}`);
  process.exit(1);
});
