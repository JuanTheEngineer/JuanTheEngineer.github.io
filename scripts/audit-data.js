#!/usr/bin/env node
/**
 * Data Audit Script
 *
 * Scans exercises.json and workouts.json for:
 * 1. Exercises with 0 demos (no media at all)
 * 2. Demos with likely broken URLs (404 candidates)
 * 3. Duplicate YouTube URLs shared across exercises
 * 4. Programs referencing non-existent exercise ids
 * 5. Exercises never referenced by any program (orphans)
 * 6. Exercises with suspicious/generic names
 *
 * Output: structured report to stdout + audit-report.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const exercises = JSON.parse(readFileSync(join(root, 'exercises.json'), 'utf8'));
const workouts = JSON.parse(readFileSync(join(root, 'workouts.json'), 'utf8'));

const exMap = new Map(exercises.exercises.map(e => [e.id, e]));
const report = {
  noDemos: [],
  duplicateYouTube: [],
  brokenReferences: [],
  orphanExercises: [],
  suspiciousNames: [],
  stats: {}
};

// --- 1. Exercises with 0 demos ---
for (const ex of exercises.exercises) {
  if (!ex.demos || ex.demos.length === 0) {
    report.noDemos.push({ id: ex.id, name: ex.name });
  }
}

// --- 2. Duplicate YouTube URLs across exercises ---
const ytUrlToExercises = new Map();
for (const ex of exercises.exercises) {
  for (const demo of (ex.demos || [])) {
    if (demo.type === 'youtube' && demo.url) {
      const key = demo.url;
      if (!ytUrlToExercises.has(key)) ytUrlToExercises.set(key, []);
      ytUrlToExercises.get(key).push(ex.id);
    }
  }
}
for (const [url, ids] of ytUrlToExercises) {
  if (ids.length > 1) {
    report.duplicateYouTube.push({ url, exercises: ids });
  }
}

// --- 3. Programs referencing non-existent exercise ids ---
const referencedIds = new Set();
for (const prog of workouts.programs) {
  for (const item of (prog.items || [])) {
    if (item.exerciseId) {
      referencedIds.add(item.exerciseId);
      if (!exMap.has(item.exerciseId)) {
        report.brokenReferences.push({ program: prog.id, exerciseId: item.exerciseId });
      }
    }
    if (item.exercises) {
      for (const member of item.exercises) {
        referencedIds.add(member.exerciseId);
        if (!exMap.has(member.exerciseId)) {
          report.brokenReferences.push({ program: prog.id, exerciseId: member.exerciseId, inGroup: true });
        }
      }
    }
  }
}

// --- 4. Orphan exercises (never referenced by any program) ---
for (const ex of exercises.exercises) {
  if (!referencedIds.has(ex.id)) {
    report.orphanExercises.push({ id: ex.id, name: ex.name });
  }
}

// --- 5. Suspicious names (too short, generic, or still paired) ---
for (const ex of exercises.exercises) {
  const n = ex.name || '';
  if (n.length <= 2) {
    report.suspiciousNames.push({ id: ex.id, name: n, reason: 'too short' });
  } else if (/^Exercise \d+$/i.test(n)) {
    report.suspiciousNames.push({ id: ex.id, name: n, reason: 'generic placeholder' });
  } else if (/( & |, )/.test(n) && !ex.aliases?.length) {
    // Paired name that wasn't caught by the rename script
    report.suspiciousNames.push({ id: ex.id, name: n, reason: 'possibly paired (no alias)' });
  }
}

// --- Stats ---
report.stats = {
  totalExercises: exercises.exercises.length,
  totalPrograms: workouts.programs.length,
  exercisesWithDemos: exercises.exercises.filter(e => e.demos?.length > 0).length,
  exercisesWithoutDemos: report.noDemos.length,
  totalDemos: exercises.exercises.reduce((sum, e) => sum + (e.demos?.length || 0), 0),
  uniqueYouTubeUrls: ytUrlToExercises.size,
  duplicateYouTubeUrls: report.duplicateYouTube.length,
  brokenReferences: report.brokenReferences.length,
  orphanExercises: report.orphanExercises.length,
  suspiciousNames: report.suspiciousNames.length
};

// --- Output ---
console.log('\n📊 DATA AUDIT REPORT\n');
console.log('Stats:');
console.log(`  Exercises: ${report.stats.totalExercises} (${report.stats.exercisesWithDemos} with demos, ${report.stats.exercisesWithoutDemos} without)`);
console.log(`  Programs: ${report.stats.totalPrograms}`);
console.log(`  Total demos: ${report.stats.totalDemos}`);
console.log(`  Unique YouTube URLs: ${report.stats.uniqueYouTubeUrls}`);
console.log('');

if (report.noDemos.length) {
  console.log(`⚠️  ${report.noDemos.length} exercises with NO demos:`);
  report.noDemos.forEach(e => console.log(`    • ${e.id} — "${e.name}"`));
  console.log('');
}

if (report.duplicateYouTube.length) {
  console.log(`⚠️  ${report.duplicateYouTube.length} YouTube URLs shared across multiple exercises:`);
  report.duplicateYouTube.slice(0, 10).forEach(d => console.log(`    • ${d.url} → [${d.exercises.join(', ')}]`));
  if (report.duplicateYouTube.length > 10) console.log(`    ... and ${report.duplicateYouTube.length - 10} more`);
  console.log('');
}

if (report.brokenReferences.length) {
  console.log(`❌ ${report.brokenReferences.length} broken exercise references in programs:`);
  report.brokenReferences.forEach(r => console.log(`    • ${r.program} → "${r.exerciseId}"${r.inGroup ? ' (in group)' : ''}`));
  console.log('');
}

if (report.orphanExercises.length) {
  console.log(`🔍 ${report.orphanExercises.length} exercises not used by any program:`);
  report.orphanExercises.forEach(e => console.log(`    • ${e.id} — "${e.name}"`));
  console.log('');
}

if (report.suspiciousNames.length) {
  console.log(`🏷️  ${report.suspiciousNames.length} suspicious exercise names:`);
  report.suspiciousNames.forEach(e => console.log(`    • ${e.id} — "${e.name}" (${e.reason})`));
  console.log('');
}

// Write full report
writeFileSync(join(root, 'audit-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log('✓ Full report written to audit-report.json\n');
