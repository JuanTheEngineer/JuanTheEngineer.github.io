#!/usr/bin/env node
/**
 * AI Program Builder
 *
 * Interactive script that takes a workout description (from ChatGPT, a coach, etc.)
 * and produces ready-to-paste JSON for workouts.json and exercises.json.
 *
 * Usage:
 *   node scripts/ai-program-builder.js
 *   node scripts/ai-program-builder.js --input workout.txt
 *
 * It will:
 *   1. Read your workout text (stdin or file)
 *   2. Match exercises to existing IDs in exercises.json
 *   3. Prompt you to confirm matches or create new exercises
 *   4. Output the program JSON + any new exercise entries
 */

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load existing exercises
const exercisesData = JSON.parse(readFileSync(join(projectRoot, 'exercises.json'), 'utf8'));
const exercises = exercisesData.exercises;

// Build search index
const index = exercises.map((ex) => ({
  id: ex.id,
  name: ex.name,
  aliases: ex.aliases || [],
  tokens: tokenize(ex.name)
    .concat((ex.aliases || []).flatMap((a) => tokenize(a)))
    .concat(tokenize(ex.id.replace(/[-_]/g, ' ')))
}));

// --- Readline setup ---
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// --- Main ---
async function main() {
  console.log('\n🏋️  AI Program Builder\n');
  console.log('Paste your workout below (empty line to finish):\n');

  const lines = [];
  const inputFile = process.argv.find((a) => a.startsWith('--input='));

  if (inputFile) {
    const content = readFileSync(inputFile.split('=')[1], 'utf8');
    lines.push(...content.split('\n'));
    console.log(`Read ${lines.length} lines from file.\n`);
  } else {
    // Read from stdin until empty line
    let line;
    while ((line = await ask('')) !== '') {
      lines.push(line);
    }
  }

  if (lines.length === 0) {
    console.log('No input. Exiting.');
    rl.close();
    return;
  }

  // Parse exercises from text
  const parsed = parseWorkoutText(lines.join('\n'));
  console.log(`\nParsed ${parsed.length} exercises from input.\n`);

  // Get program metadata
  const title = await ask('Program title: ');
  const id = await ask(`Program ID [${slugify(title)}]: `) || slugify(title);
  const requirements = await ask('Requirements (equipment): ');

  // Match each exercise
  const items = [];
  const newExercises = [];

  for (const entry of parsed) {
    console.log(`\n─── ${entry.name} ───`);
    const matches = searchIndex(entry.name, 5);

    if (matches.length > 0) {
      console.log('  Matches found:');
      matches.forEach((m, i) => console.log(`    ${i + 1}. ${m.name} (${m.id}) [score: ${m.score}]`));
      console.log(`    0. Create new exercise`);

      const choice = await ask(`  Pick [1]: `) || '1';
      const idx = parseInt(choice, 10);

      if (idx > 0 && idx <= matches.length) {
        const match = matches[idx - 1];
        items.push(buildItem(match.id, entry));
        console.log(`  ✓ Mapped to: ${match.id}`);
        continue;
      }
    } else {
      console.log('  No matches found.');
    }

    // Create new exercise
    const newId = await ask(`  New exercise ID [${slugify(entry.name)}]: `) || slugify(entry.name);
    const newEx = {
      id: newId,
      name: entry.name,
      demos: [],
      recommendations: {}
    };
    if (entry.reps) newEx.recommendations.reps = entry.reps;
    if (entry.sets) newEx.recommendations.sets = entry.sets;
    if (entry.repUnits && entry.repUnits !== 'reps') newEx.recommendations.repUnits = entry.repUnits;
    if (entry.note) newEx.recommendations.note = entry.note;

    newExercises.push(newEx);
    items.push(buildItem(newId, entry));
    console.log(`  ✓ Created new: ${newId}`);
  }

  // Build program
  const program = { id, title };
  if (requirements) program.requirements = requirements;
  program.items = items;

  // Output
  console.log('\n\n════════════════════════════════════════');
  console.log('  OUTPUT');
  console.log('════════════════════════════════════════\n');

  if (newExercises.length > 0) {
    console.log('── New Exercises (append to exercises.json → exercises[]) ──\n');
    console.log(JSON.stringify(newExercises, null, 2));
    console.log('\n');
  }

  console.log('── Program (append to workouts.json → programs[]) ──\n');
  console.log(JSON.stringify(program, null, 2));

  // Save to file
  const save = await ask('\n\nSave to file? (y/N): ');
  if (save.toLowerCase() === 'y') {
    const outPath = join(projectRoot, `program-${id}.json`);
    const output = { newExercises, program };
    writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Saved to ${outPath}`);
  }

  rl.close();
}

// --- Parsing ---
function parseWorkoutText(text) {
  const results = [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Try to match patterns like:
    // "1. Exercise Name - 3x10 reps"
    // "Exercise Name: 3 sets x 12 reps"
    // "- Exercise Name (30 secs, 3 sets)"
    // "Exercise Name | 10 reps | 3 sets | note"

    // Strip leading numbers, bullets, dashes
    let cleaned = line.replace(/^[\d.)\-•*]+\s*/, '');

    // Try to extract sets/reps from common patterns
    const entry = { name: '', reps: '', sets: '', repUnits: 'reps', note: '', tags: [] };

    // Pattern: "Name - 3x10" or "Name: 3x10"
    const setsRepsMatch = cleaned.match(/^(.+?)[\s\-:–|]+(\d+)\s*[xX×]\s*(\d+)\s*(.*)/);
    if (setsRepsMatch) {
      entry.name = setsRepsMatch[1].trim();
      entry.sets = setsRepsMatch[2];
      entry.reps = setsRepsMatch[3];
      entry.note = setsRepsMatch[4]?.trim() || '';
      results.push(entry);
      continue;
    }

    // Pattern: "Name - 10 reps, 3 sets"
    const repsFirst = cleaned.match(/^(.+?)[\s\-:–|]+(\d+)\s*(reps?|secs?|min|yd)[\s,]+(\d+)\s*sets?\s*(.*)/i);
    if (repsFirst) {
      entry.name = repsFirst[1].trim();
      entry.reps = repsFirst[2];
      entry.repUnits = normalizeUnits(repsFirst[3]);
      entry.sets = repsFirst[4];
      entry.note = repsFirst[5]?.trim() || '';
      results.push(entry);
      continue;
    }

    // Pattern: "Name - 3 sets x 10 reps"
    const setsFirst = cleaned.match(/^(.+?)[\s\-:–|]+(\d+)\s*sets?\s*[xX×]?\s*(\d+)\s*(reps?|secs?|min|yd)?\s*(.*)/i);
    if (setsFirst) {
      entry.name = setsFirst[1].trim();
      entry.sets = setsFirst[2];
      entry.reps = setsFirst[3];
      entry.repUnits = normalizeUnits(setsFirst[4] || 'reps');
      entry.note = setsFirst[5]?.trim() || '';
      results.push(entry);
      continue;
    }

    // Pattern: "Name (30 secs)" or "Name (3x10)"
    const parenMatch = cleaned.match(/^(.+?)\s*\((.+?)\)\s*(.*)/);
    if (parenMatch) {
      entry.name = parenMatch[1].trim();
      const inner = parenMatch[2];
      const innerSR = inner.match(/(\d+)\s*[xX×]\s*(\d+)/);
      if (innerSR) {
        entry.sets = innerSR[1];
        entry.reps = innerSR[2];
      } else {
        const innerReps = inner.match(/(\d+)\s*(reps?|secs?|min|yd)/i);
        if (innerReps) {
          entry.reps = innerReps[1];
          entry.repUnits = normalizeUnits(innerReps[2]);
        }
      }
      entry.note = parenMatch[3]?.trim() || '';
      results.push(entry);
      continue;
    }

    // Fallback: just use the line as the exercise name
    if (cleaned.length > 2) {
      entry.name = cleaned;
      results.push(entry);
    }
  }

  return results;
}

function normalizeUnits(u) {
  if (!u) return 'reps';
  const lower = u.toLowerCase().replace(/s$/, '');
  if (lower === 'rep') return 'reps';
  if (lower === 'sec') return 'secs';
  return lower + (lower === 'min' || lower === 'yd' ? '' : 's');
}

// --- Search ---
function searchIndex(query, limit = 5) {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  return index
    .map((entry) => ({ ...entry, score: scoreMatch(entry.tokens, qTokens) }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function tokenize(str) {
  if (!str) return [];
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

function scoreMatch(entryTokens, queryTokens) {
  let total = 0;
  for (const qt of queryTokens) {
    let best = 0;
    for (const et of entryTokens) {
      if (et === qt) best = Math.max(best, 10);
      else if (et.startsWith(qt)) best = Math.max(best, 7);
      else if (et.includes(qt)) best = Math.max(best, 4);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
}

// --- Helpers ---
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+$/, '')
    .replace(/^-+/, '');
}

function buildItem(exerciseId, entry) {
  const item = { exerciseId };
  if (entry.reps) item.reps = entry.reps;
  if (entry.sets) item.sets = entry.sets;
  if (entry.repUnits && entry.repUnits !== 'reps') item.repUnits = entry.repUnits;
  if (entry.note) item.note = entry.note;
  if (entry.tags?.length) item.tags = entry.tags;
  return item;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
