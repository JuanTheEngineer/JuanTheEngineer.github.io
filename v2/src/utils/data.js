// Data loader for workouts.json, exercises.json, plans.json
// Resolves exerciseId references in programs to full exercise data.

const cache = {
  workouts: null,
  exercises: null,
  plans: null,
  exerciseMap: null
};

export async function loadWorkouts() {
  if (cache.workouts) return cache.workouts;
  const res = await fetch('./workouts.json');
  if (!res.ok) throw new Error(`Failed to load workouts.json: ${res.status}`);
  cache.workouts = await res.json();
  return cache.workouts;
}

export async function loadExercises() {
  if (cache.exercises) return cache.exercises;
  const res = await fetch('./exercises.json');
  if (!res.ok) throw new Error(`Failed to load exercises.json: ${res.status}`);
  cache.exercises = await res.json();
  // Build id -> exercise map for fast lookup
  cache.exerciseMap = new Map(cache.exercises.exercises.map((e) => [e.id, e]));
  return cache.exercises;
}

export async function loadPlans() {
  if (cache.plans) return cache.plans;
  const res = await fetch('./plans.json');
  if (!res.ok) throw new Error(`Failed to load plans.json: ${res.status}`);
  cache.plans = await res.json();
  return cache.plans;
}

export async function getProgram(id) {
  const workouts = await loadWorkouts();
  return workouts.programs.find((p) => p.id === id) || null;
}

export async function getExercise(id) {
  await loadExercises();
  return cache.exerciseMap?.get(id) || null;
}

/**
 * Resolve a program's items: merge each exerciseId reference with the
 * canonical exercise from exercises.json, applying program-level overrides.
 *
 * @returns {Array} Resolved items (single or group), each ready for rendering.
 */
export async function getResolvedProgram(id) {
  const [program] = await Promise.all([getProgram(id), loadExercises()]);
  if (!program) return null;

  const resolveSingle = (item) => {
    const exercise = cache.exerciseMap.get(item.exerciseId) || null;
    return {
      kind: 'single',
      exerciseId: item.exerciseId,
      exercise,
      name: exercise?.name || item.exerciseId,
      reps: item.reps ?? exercise?.recommendations?.reps,
      sets: item.sets ?? exercise?.recommendations?.sets,
      repUnits: item.repUnits ?? exercise?.recommendations?.repUnits,
      note: item.note ?? exercise?.recommendations?.note,
      tags: item.tags || []
    };
  };

  const resolveGroup = (item) => ({
    kind: item.kind,
    note: item.note,
    tags: item.tags || [],
    exercises: item.exercises.map((member) => {
      const exercise = cache.exerciseMap.get(member.exerciseId) || null;
      return {
        exerciseId: member.exerciseId,
        exercise,
        name: exercise?.name || member.exerciseId,
        reps: member.reps ?? exercise?.recommendations?.reps,
        sets: member.sets ?? exercise?.recommendations?.sets,
        repUnits: member.repUnits ?? exercise?.recommendations?.repUnits,
        note: member.note ?? exercise?.recommendations?.note
      };
    })
  });

  const resolvedItems = (program.items || []).map((item) => {
    if (item.kind) return resolveGroup(item); // group: superset/compound/circuit
    return resolveSingle(item); // single
  });

  return { ...program, resolvedItems };
}
