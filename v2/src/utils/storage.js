// Local storage helpers for workout progress
// Keyed by program id so progress survives page reloads

const PROGRESS_KEY = 'action-app:progress';

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
}
