// ExerciseCard: expandable row showing one exercise within a program
// Collapsed: name, reps/sets summary
// Expanded: media, full details, completion checkbox
import { renderMedia } from './MediaPlayer.js';

/**
 * Build an exercise card element.
 * @param {Object} exercise - Exercise object from workouts.json
 * @param {Object} state - { isCompleted, isExpanded, onToggle, onComplete }
 */
export function createExerciseCard(exercise, state, index) {
  const card = document.createElement('article');
  card.className = `card overflow-hidden transition-all ${state.isCompleted ? 'opacity-60' : ''}`;
  card.dataset.exerciseIndex = String(index);

  // Pick the source to display (new schema 'source', or legacy cloudinaryUrl, or gif)
  const primarySource = pickPrimarySource(exercise);

  card.innerHTML = `
    <button
      data-action="toggle"
      class="w-full p-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors touch-manipulation"
    >
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold ${state.isCompleted ? 'line-through text-slate-500' : ''}">
          ${exercise.name || 'Exercise'}
        </h3>
        <p class="text-sm text-slate-400 mt-0.5">
          ${formatReps(exercise)} · ${exercise.sets || '—'} sets
        </p>
      </div>
      <button
        data-action="complete"
        aria-label="Mark complete"
        class="flex-shrink-0 w-8 h-8 rounded-full border-2 ${state.isCompleted ? 'bg-brand-500 border-brand-500' : 'border-slate-600'} flex items-center justify-center transition-colors touch-manipulation"
      >
        ${state.isCompleted ? `
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        ` : ''}
      </button>
      <svg class="w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${state.isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    <div data-region="content" class="${state.isExpanded ? '' : 'hidden'}">
      <div class="px-4 pb-4 space-y-4">
        <div data-media-slot></div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-brand-400">${exercise.reps || '—'}</p>
            <p class="text-xs text-slate-400 mt-0.5">${exercise.repUnits || 'reps'}</p>
          </div>
          <div class="bg-slate-800/50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-brand-400">${exercise.sets || '—'}</p>
            <p class="text-xs text-slate-400 mt-0.5">sets</p>
          </div>
        </div>
        ${exercise.note ? `
          <div class="bg-brand-500/10 border-l-2 border-brand-500 px-3 py-2 rounded-r-lg">
            <p class="text-sm text-slate-300 leading-relaxed">${exercise.note}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Render media into slot only when expanded (defer for perf)
  if (state.isExpanded && primarySource) {
    const slot = card.querySelector('[data-media-slot]');
    if (slot) renderMedia(slot, primarySource);
  }

  // Wire up handlers
  card.querySelector('[data-action="toggle"]')?.addEventListener('click', (e) => {
    // Don't toggle when complete button is clicked (it bubbles up)
    if (e.target.closest('[data-action="complete"]')) return;
    state.onToggle?.(index);
  });

  card.querySelector('[data-action="complete"]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.onComplete?.(index);
  });

  return card;
}

function formatReps(exercise) {
  const reps = exercise.reps || '—';
  return reps;
}

function pickPrimarySource(exercise) {
  // Prefer the new 'source' field
  if (exercise.source) return exercise.source;

  // Fall back to legacy cloudinaryUrl
  if (exercise.cloudinaryUrl) {
    return {
      type: 'cloudinary',
      mediaType: exercise.cloudinaryUrl.includes('/video/') ? 'video' : 'image',
      format: exercise.cloudinaryUrl.split('.').pop()?.split('?')[0] || 'gif',
      url: exercise.cloudinaryUrl
    };
  }

  // Fall back to local gif
  if (exercise.gif) {
    return {
      type: 'local',
      mediaType: 'video',
      format: 'gif',
      url: exercise.gif
    };
  }

  return null;
}
