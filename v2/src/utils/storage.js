// Local storage helpers for workout progress
// Keyed by program id so progress survives page reloads

const PROGRESS_KEY = 'action-app:progress';
const SETS_KEY = 'action-app:sets';
const RECENT_KEY = 'action-app:recent-programs';
const RECENT_LIMIT = 5;

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be disabled (e.g., private browsing) — fail silently
  }
}

/**
 * Get completion state for a program (Set of completed exercise indices)
 */
export function getProgress(programId) {
  const all = readAll();
  return new Set(all[programId] || []);
}

/**
 * Toggle completion for an exercise within a program
 */
export function toggleProgress(programId, exerciseIndex) {
  const all = readAll();
  const arr = new Set(all[programId] || []);
  if (arr.has(exerciseIndex)) {
    arr.delete(exerciseIndex);
  } else {
    arr.add(exerciseIndex);
  }
  all[programId] = Array.from(arr);
  writeAll(all);
  return arr;
}

/**
 * Reset progress for a program
 */
export function resetProgress(programId) {
  const all = readAll();
  delete all[programId];
  writeAll(all);
  // also clear any per-set counts for this program
  const sets = readSets();
  let changed = false;
  for (const key of Object.keys(sets)) {
    if (key.startsWith(`${programId}:`)) {
      delete sets[key];
      changed = true;
    }
  }
  if (changed) writeSets(sets);
}

// --- Per-set tracking: how many sets of an exercise are logged ---
// Keyed by `${programId}:${exerciseIndex}` so it survives reloads and is
// independent of the exercise's overall complete/incomplete flag.

function readSets() {
  try {
    return JSON.parse(localStorage.getItem(SETS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeSets(data) {
  try {
    localStorage.setItem(SETS_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be disabled — fail silently
  }
}

/**
 * Get the number of sets logged for one exercise (0 if none).
 */
export function getSetCount(programId, exerciseIndex) {
  const sets = readSets();
  const n = sets[`${programId}:${exerciseIndex}`];
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

/**
 * Set the number of sets logged for one exercise. A count of 0 removes the key.
 */
export function setSetCount(programId, exerciseIndex, count) {
  const sets = readSets();
  const key = `${programId}:${exerciseIndex}`;
  if (count > 0) {
    sets[key] = count;
  } else {
    delete sets[key];
  }
  writeSets(sets);
  return count > 0 ? count : 0;
}

/**
 * Recently visited programs (most-recent first).
 * Stored as [{ id, visitedAt }, ...] capped at RECENT_LIMIT.
 */
export function getRecentPrograms() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

/**
 * Record a program visit. De-dupes by id and bumps it to the front.
 */
export function recordProgramVisit(programId) {
  if (!programId) return;
  try {
    const list = getRecentPrograms().filter((r) => r.id !== programId);
    list.unshift({ id: programId, visitedAt: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_LIMIT)));
  } catch {
    // ignore storage failures
  }
}
