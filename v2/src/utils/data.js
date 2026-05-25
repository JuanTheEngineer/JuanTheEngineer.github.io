// Data loader for workouts.json and exercises.json
// Files are served from the repo root, so we fetch with an absolute path.
// In dev (Vite), we use a proxy via the public/ folder symlink approach,
// but for simplicity we copy files at build time via a script later.

// For now: fetch from ../workouts.json (parent of v2/)
// Production: files will be copied into v2/public/ by build script

const cache = {
  workouts: null,
  exercises: null,
  plans: null
};

/**
 * Load workouts.json (programs with exercises).
 * Caches result after first load.
 */
export async function loadWorkouts() {
  if (cache.workouts) return cache.workouts;

  const url = resolveDataUrl('workouts.json');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load workouts.json: ${res.status}`);
  const data = await res.json();
  cache.workouts = data;
  return data;
}

/**
 * Load exercises.json (canonical exercise library).
 * Caches result after first load.
 */
export async function loadExercises() {
  if (cache.exercises) return cache.exercises;

  const url = resolveDataUrl('exercises.json');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load exercises.json: ${res.status}`);
  const data = await res.json();
  cache.exercises = data;
  return data;
}

/**
 * Load plans.json (program categorization).
 */
export async function loadPlans() {
  if (cache.plans) return cache.plans;

  const url = resolveDataUrl('plans.json');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load plans.json: ${res.status}`);
  const data = await res.json();
  cache.plans = data;
  return data;
}

/**
 * Find a program by id from workouts.json
 */
export async function getProgram(id) {
  const workouts = await loadWorkouts();
  return workouts.programs.find(p => p.id === id) || null;
}

/**
 * Find an exercise by id from exercises.json
 */
export async function getExercise(id) {
  const lib = await loadExercises();
  return lib.exercises.find(e => e.id === id) || null;
}

/**
 * Resolve URL for data files.
 * In dev, files live one level up. In production, they're served from /public/.
 */
function resolveDataUrl(filename) {
  // Try public path first (works in both dev and prod with Vite)
  return `./${filename}`;
}
