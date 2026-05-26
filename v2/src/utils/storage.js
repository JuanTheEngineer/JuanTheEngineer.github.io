// Local storage helpers for workout progress
// Keyed by program id so progress survives page reloads

const PROGRESS_KEY = 'action-app:progress';
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
    const list = getRecentPrograms().filter(r => r.id !== programId);
    list.unshift({ id: programId, visitedAt: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_LIMIT)));
  } catch {
    // ignore storage failures
  }
}
