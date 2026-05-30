#!/usr/bin/env node
/**
 * Audit displayName values in workouts.json
 * Check if they're just "Warm Up 1: <exercise name>" patterns
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const w = JSON.parse(readFileSync(join(root, 'workouts.json'), 'utf8'));
const e = JSON.parse(readFileSync(join(root, 'exercises.json'), 'utf8'));
const exMap = new Map(e.exercises.map(ex => [ex.id, ex.name]));

let total = 0, prefixed = 0, redundant = 0, different = 0;
const redundantExamples = [];
const differentExamples = [];

for (const prog of w.programs) {
  for (const item of (prog.items || [])) {
    // Single items
    if (item.displayName) {
      total++;
      const match = item.displayName.match(/^(Warm\s*Up|Exercise|Stretch|Strength|Cooldown)\s*\d*\s*:\s*(.+)$/i);
      if (match) {
        prefixed++;
        const suffix = match[2].trim();
        const canonical = exMap.get(item.exerciseId);
        if (!canonical) continue;
        if (suffix.toLowerCase() === canonical.toLowerCase()) {
          redundant++;
          if (redundantExamples.length < 10) {
            redundantExamples.push({ displayName: item.displayName, canonical });
          }
        } else {
          different++;
          if (differentExamples.length < 10) {
            differentExamples.push({ displayName: item.displayName, canonical, suffix });
          }
        }
      }
    }
    // Group displayNames
    if (item.kind && item.displayName) {
      total++;
      const match = item.displayName.match(/^(Exercise)\s*\d*\s*:\s*(.+)$/i);
      if (match) prefixed++;
    }
  }
}

console.log('=== displayName Audit ===\n');
console.log('Total displayNames:', total);
console.log('With prefix pattern (Warm Up N: / Exercise N: / etc):', prefixed);
console.log('  Redundant (suffix === canonical exercise name):', redundant);
console.log('  Different (suffix differs — custom label):', different);
console.log('Without prefix:', total - prefixed);
console.log('');

if (redundantExamples.length) {
  console.log('REDUNDANT examples (could be removed — canonical name is the same):');
  redundantExamples.forEach(e => {
    console.log(`  "${e.displayName}" → canonical: "${e.canonical}"`);
  });
  console.log('');
}

if (differentExamples.length) {
  console.log('DIFFERENT examples (suffix differs from canonical — custom label):');
  differentExamples.forEach(e => {
    console.log(`  "${e.displayName}" → canonical: "${e.canonical}" | suffix: "${e.suffix}"`);
  });
}
