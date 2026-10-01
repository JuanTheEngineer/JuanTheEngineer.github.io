// setTracker: turns the static "sets" tile into an interactive per-set tracker.
//
// The card's own completion (the round check + progress bar + celebration) is
// the source of truth for "exercise done". This tracker only logs how many
// sets within the exercise are finished, and reports when the final set lands
// so the page can mirror that onto the exercise's completion.
//
// Three parsed shapes get a tracker; everything else falls back to the plain
// read-only tile, so no exercise can break:
//
//   integer  "4"        -> fill tile, tap 0..4, full = done
//   range    "5-6"      -> solid-done tile at the floor + a separate "+1" chip
//                          for the optional extra sets (done already counts at 5)
//   decrement "15 -> 1" -> same two-tile layout as integer; the sets tile is the
//   (reps "N -> M")       control (0..N) and the REPS tile is a passive readout
//                          that counts down N, N-1 ... as sets climb
//
// Parsing is defensive: anything that does not cleanly match returns
// { kind: 'plain' } and the caller renders today's static tile untouched.

/**
 * Parse an item's sets/reps into a tracker descriptor.
 * @param {Object} item - resolved item with string `sets` and `reps`
 * @returns {{kind:'integer'|'range'|'decrement'|'plain', total?:number, min?:number, max?:number, start?:number, end?:number}}
 */
export function parseSets(item) {
  const sets = String(item?.sets ?? '').trim();
  const reps = String(item?.reps ?? '').trim();

  // Decrementing: the reps field encodes a descending ladder "N -> M" (or "N → M").
  if (/^decrement/i.test(sets)) {
    const m = reps.match(/^(\d+)\s*(?:->|→|-)\s*(\d+)$/);
    if (m) {
      const start = parseInt(m[1], 10);
      const end = parseInt(m[2], 10);
      if (start > end && start >= 1 && end >= 1 && start <= 50) {
        return { kind: 'decrement', total: start - end + 1, start, end };
      }
    }
    return { kind: 'plain' };
  }

  // Range "5-6": committed floor + optional bonus up to the ceiling.
  const range = sets.match(/^(\d+)\s*-\s*(\d+)$/);
  if (range) {
    const min = parseInt(range[1], 10);
    const max = parseInt(range[2], 10);
    if (min >= 1 && max > min && max <= 50) {
      return { kind: 'range', min, max };
    }
    return { kind: 'plain' };
  }

  // Clean positive integer.
  if (/^\d+$/.test(sets)) {
    const total = parseInt(sets, 10);
    if (total >= 1 && total <= 50) {
      return { kind: 'integer', total };
    }
  }

  return { kind: 'plain' };
}

const RESET_ICON = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0111-3m3 8a7 7 0 01-11 3"/></svg>`;

/**
 * Build the HTML for the reps + sets tiles. For the plain fallback this is the
 * exact static markup the card used before. For trackable shapes it emits the
 * interactive sets tile (and, for decrement, a reps tile that will be driven).
 *
 * @param {Object} item
 * @param {ReturnType<typeof parseSets>} spec
 * @param {number} count - sets already logged (from storage)
 * @returns {string}
 */
export function renderSetTilesHtml(item, spec, count) {
  const reps = item.reps || '—';
  const repUnits = item.repUnits || 'reps';
  const repsLong = String(reps).length > 5;

  // Plain fallback: today's two static tiles, unchanged.
  if (spec.kind === 'plain') {
    return `
      ${staticTile(reps, repUnits, repsLong)}
      ${staticTile(item.sets || '—', 'sets', String(item.sets || '').length > 5)}
    `;
  }

  if (spec.kind === 'decrement') {
    const left = spec.total - count; // reps target for the next set, N..1
    const repsVal = count >= spec.total ? '✓' : String(left);
    const repsDone = count >= spec.total;
    return `
      <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
        <p class="text-3xl font-extrabold leading-none num tracking-tight ${repsDone ? 'text-emerald-400' : 'text-brand-400'}" data-set="reps">${repsVal}</p>
        <p class="label-meta mt-1.5">reps this set</p>
      </div>
      ${setsControl(spec.total, count, 'sets')}
    `;
  }

  if (spec.kind === 'range') {
    const bonus = Math.max(0, count - spec.min);
    const metFloor = count >= spec.min;
    return `
      ${staticTile(reps, repUnits, repsLong)}
      ${rangeControl(spec, count, bonus, metFloor)}
    `;
  }

  // integer
  return `
    ${staticTile(reps, repUnits, repsLong)}
    ${setsControl(spec.total, count, 'sets')}
  `;
}

function staticTile(value, label, isLong) {
  return `
    <div class="bg-slate-800/50 rounded-xl p-3 text-center overflow-hidden">
      <p class="${isLong ? 'text-lg' : 'text-3xl'} font-extrabold text-brand-400 leading-none num tracking-tight">${escapeHtml(String(value))}</p>
      <p class="label-meta mt-1.5">${escapeHtml(label)}</p>
    </div>
  `;
}

function setsControl(total, count, label) {
  const full = count >= total;
  const pct = Math.min(count, total) / total;
  return `
    <div class="relative">
      <div class="set-tile p-3 text-center h-full" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${pct})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${count}</span><span class="text-lg font-bold text-slate-300">/${total}</span></p>
          <p class="label-meta mt-1.5" data-set="cap">${full ? 'complete' : escapeHtml(label)}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${count === 0 ? 'set-hide' : ''} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="reset" class="set-nub ${full ? '' : 'set-hide'} absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 text-slate-400 flex items-center justify-center shadow-lg active:bg-slate-700" aria-label="Reset sets">${RESET_ICON}</button>
    </div>
  `;
}

function rangeControl(spec, count, bonus, metFloor) {
  const pct = Math.min(count, spec.min) / spec.min; // committed fill tops out solid at the floor
  const canBonus = metFloor && bonus < spec.max - spec.min;
  const cap = metFloor ? (bonus ? `${count} done · nice` : 'complete') : 'sets';
  return `
    <div class="relative">
      <div class="set-tile p-3 text-center h-full ${metFloor ? 'set-done' : ''}" data-set="tile" role="button" tabindex="0" aria-label="Log a set">
        <div class="set-fill" data-set="fill" style="transform:scaleX(${pct})"></div>
        <div class="set-content">
          <p class="leading-none num"><span class="text-3xl font-extrabold" data-set="done">${count}</span>${metFloor ? '' : `<span class="text-lg font-bold text-slate-300">/${spec.min}</span>`}</p>
          <p class="label-meta mt-1.5 ${metFloor ? 'text-emerald-200' : ''}" data-set="cap">${cap}</p>
        </div>
      </div>
      <button data-set="undo" class="set-nub ${count === 0 ? 'set-hide' : ''} absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 text-slate-200 text-lg font-bold flex items-center justify-center shadow-lg active:bg-slate-600" aria-label="Remove last set">−</button>
      <button data-set="bonus" class="set-nub ${canBonus ? '' : 'set-hide'} absolute -bottom-2 -right-2 h-7 px-2.5 rounded-full bg-emerald-600 border border-emerald-400/40 text-white text-xs font-bold flex items-center justify-center shadow-lg" aria-label="Log a bonus set">+${spec.max - spec.min - bonus} bonus</button>
    </div>
  `;
}

/**
 * Wire the interactive sets tile inside an already-rendered card.
 * Persists via the provided callbacks and reports completion transitions.
 *
 * @param {HTMLElement} card
 * @param {ReturnType<typeof parseSets>} spec
 * @param {Object} opts
 * @param {number} opts.count - current logged count
 * @param {(next:number)=>void} opts.onCount - persist a new count
 * @param {boolean} opts.isCompleted - exercise's current completion flag
 * @param {()=>void} opts.onComplete - toggle the exercise's completion (the card's own)
 */
export function wireSetTracker(card, spec, opts) {
  if (spec.kind === 'plain') return;
  const tile = card.querySelector('[data-set="tile"]');
  if (!tile) return;
  const undo = card.querySelector('[data-set="undo"]');
  const reset = card.querySelector('[data-set="reset"]');
  const bonus = card.querySelector('[data-set="bonus"]');

  // The "capacity" that marks the exercise done:
  //   integer / decrement -> total; range -> the floor (min).
  const doneAt = spec.kind === 'range' ? spec.min : spec.total;
  const ceiling = spec.kind === 'range' ? spec.max : spec.total;

  const apply = (next) => {
    const clamped = Math.max(0, Math.min(ceiling, next));
    const wasDone = opts.count >= doneAt;
    const nowDone = clamped >= doneAt;
    opts.onCount(clamped);
    // Mirror onto the exercise's own completion only on a true transition,
    // and only when that disagrees with the current flag, so we never double-toggle.
    if (nowDone && !wasDone && !opts.isCompleted) opts.onComplete();
    else if (!nowDone && wasDone && opts.isCompleted) opts.onComplete();
  };

  tile.addEventListener('click', () => {
    if (opts.count < ceiling) apply(opts.count + 1);
  });
  tile.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (opts.count < ceiling) apply(opts.count + 1);
    }
  });
  undo?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (opts.count > 0) apply(opts.count - 1);
  });
  reset?.addEventListener('click', (e) => {
    e.stopPropagation();
    apply(0);
  });
  bonus?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (opts.count < ceiling) apply(opts.count + 1);
  });
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
