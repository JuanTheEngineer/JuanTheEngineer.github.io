# Implementation Plan

## Overview

Simplify the workout data model around supersets and rebuild the rendering of grouped exercises. Three coordinated changes: (1) a one-shot Node migration script rewrites `workouts.json` to use a unified `superset` kind with stripped prefixes and cleaned notes; (2) the resolver and pages produce a uniform shape with synthesized titles and segmented numbering labels; (3) progress storage moves to string path keys with a one-time wipe on schema version bump. Per-member checkboxes replace the group master checkbox; group completion is derived.

Land all of this in one commit (data + code together) so the app and its data stay consistent.

## Task Dependency Graph

Tasks are grouped into waves. Each wave depends on the previous wave completing; tasks within a wave have no dependencies on each other and may be executed in parallel.

```json
{
  "waves": [
    {
      "wave": 1,
      "description": "Build and run the data migration. Code changes depend on the new data shape.",
      "tasks": ["1", "2"]
    },
    {
      "wave": 2,
      "description": "Independent module updates (resolver and storage) — parallelizable.",
      "tasks": ["3", "4"]
    },
    {
      "wave": 3,
      "description": "Page wiring consumes both the new resolver shape and the new storage API.",
      "tasks": ["5"]
    },
    {
      "wave": 4,
      "description": "Card components consume the page's new state contract — parallelizable.",
      "tasks": ["6", "7"]
    },
    {
      "wave": 5,
      "description": "Verify end-to-end and commit.",
      "tasks": ["8", "9"]
    }
  ]
}
```

## Tasks

- [ ] 1. Write the workouts.json migration script
  - Create `v2/scripts/migrate-workouts.js` (Node, no deps).
  - Read `workouts.json` from repo root (cwd-relative); write `workouts.json.bak` first.
  - Implement `migrateWorkouts(json)` per the design's algorithm:
    - For every group item: set `kind = 'superset'`, delete `displayName`, run `cleanMemberNote` on each member's `note`, delete the field if cleaned to empty.
    - For every single item: strip prefix matching `^(Warm Up|Exercise|Strength|Stretch)\s*\d+\s*:?\s*` (case-insensitive) from `displayName`.
  - Implement `--selftest` flag that runs the migrator against an inline fixture and asserts:
    - `compound` / `circuit` no longer present.
    - No single `displayName` starts with a positional prefix.
    - Member notes do not contain `"Meant to be a Super Set"`.
    - Running the migrator twice yields the same output (idempotent).
  - Log a one-line summary of changes (programs touched, prefixes stripped, notes cleaned, kinds unified).
  - _Files: v2/scripts/migrate-workouts.js (new)_

- [ ] 2. Run the migration and review the diff
  - Execute `node v2/scripts/migrate-workouts.js --selftest` and confirm green.
  - Execute `node v2/scripts/migrate-workouts.js` from repo root.
  - Inspect the diff on `workouts.json` (git diff). Spot-check 2–3 programs visually.
  - Delete `workouts.json.bak`.
  - Stage `workouts.json` and the new script; hold the commit until the rest of the work is also ready.
  - _Files: workouts.json (modified), v2/scripts/migrate-workouts.js_

- [ ] 3. Update `data.js` to produce a uniform `superset` shape
  - In `getResolvedProgram`, change `resolveGroup` to:
    - Always set `kind: 'superset'` on the resolved object (defensive against legacy values).
    - Synthesize `displayName` if missing using `synthesizeGroupTitle(members)` per design.
    - Expose members under the key `members` (rename from `exercises`) on the resolved object.
  - Add `synthesizeGroupTitle(members)` helper inside `data.js`. Handle 1, 2, and 3+ member cases.
  - Keep `tags` flowing through unchanged on both single and group items.
  - _Files: v2/src/utils/data.js_

- [ ] 4. Update `storage.js` for path-keyed progress and one-time wipe
  - Add `PROGRESS_VERSION_KEY = 'action-app:progress-version'` and `PROGRESS_VERSION = 2`.
  - Add `ensureProgressSchema()`: if stored version !== `PROGRESS_VERSION`, `removeItem('action-app:progress')` and write the new version. Idempotent. Call from the top of `readAll()`.
  - Change `getProgress(programId)` to return `Set<string>`.
  - Change `toggleProgress(programId, key)`: `key` is now `string`. Validate against `^\d+(?:\.\d+)?$`; ignore invalid.
  - Leave `resetProgress` and `recordProgramVisit` alone.
  - _Files: v2/src/utils/storage.js_

- [ ] 5. Update `ProgramDetailPage.js` to use path keys and segmented numbering
  - Add `computeNumberingLabels(items)` and `classifyItem(item)` helpers per the design (top of the page module; do not add a new file unless reused).
  - State refactor:
    - Keep `expandedIndex` for group/single expansion (one open at a time, current behavior).
    - Add `memberExpanded: Map<itemIndex, Set<memberIndex>>` for per-member demo expansion within an open group. Default collapsed.
    - Replace `completed: Set<number>` with `completed: Set<string>`.
  - Compute `total` as Σ leaf toggleables: `items.reduce((n, it) => n + (it.kind === 'superset' ? it.members.length : 1), 0)`. Update progress bar denominator.
  - Per-item state:
    - Singles: `isCompleted = completed.has(String(i))`, `onComplete(idx) -> toggleProgress(programId, String(idx))`.
    - Groups: derive `memberCompleted: Set<number>`; pass `memberExpanded` for the group; provide `onToggle` (group expand), `onMemberToggle(itemIndex, memberIndex)` (member demo), `onMemberComplete(itemIndex, memberIndex) -> toggleProgress(programId, \`${itemIndex}.${memberIndex}\`)`.
  - Pass `numberingLabel` to every card via `state`.
  - Keep "rebuild list on change" rendering — no new optimization needed.
  - _Files: v2/src/pages/ProgramDetailPage.js_

- [ ] 6. Rebuild `GroupCard.js` for per-member checkboxes
  - Remove the master `data-action="complete"` button.
  - Header:
    - Render `state.numberingLabel` as a small uppercase eyebrow above the title.
    - Render synthesized title from `item.displayName` (resolver guarantees it).
    - Replace `${memberCount} exercises` with `${memberCompleted.size} / ${members.length} complete`; add a check icon when full.
    - Render divergence stripe iff member `sets` values differ: `members.map(m => m.sets).join(' · ') + ' sets'`.
    - Apply `opacity-60` + `line-through` to the title only when all members complete.
  - Member stack:
    - Add `border-l-2 border-slate-700 pl-3 ml-1.5` (or similar) for the bracket/connector.
    - Replace numeric badge with `String.fromCharCode(65 + idx)` (A, B, C...).
    - Add member-level chevron `data-action="member-toggle"` toggling that member's expansion.
    - Add member-level checkbox `data-action="member-complete"` matching single-card style.
    - Render demo carousel and member `note` only when that member is expanded.
  - Wire `onMemberToggle(state.index, memberIndex)` and `onMemberComplete(state.index, memberIndex)` listeners.
  - Keep the `SUPERSET` pill and item-level `tags`.
  - _Files: v2/src/components/GroupCard.js_

- [ ] 7. Minor update to `ExerciseCard.js`
  - Render `state.numberingLabel` as a small uppercase eyebrow above the title (visual parity with GroupCard).
  - Confirm no positional-prefix logic exists; remove any if found.
  - Touch nothing else.
  - _Files: v2/src/components/ExerciseCard.js_

- [ ] 8. Visual smoke test (Playwright MCP)
  - User starts the v2 dev server manually (do not background-run from agent).
  - Open the app, navigate to a superset-containing program (e.g., `agility_lower_1-2`).
  - Verify:
    - Numbering eyebrows present and segmented correctly.
    - Synthesized superset title (e.g., `"DB RDL & Split Squats"`) renders.
    - SUPERSET pill present. No master checkbox on the group.
    - Per-member checkboxes work; progress chip updates; full check appears when all done.
    - Bracket/connector line visible to the left of the member stack.
    - Members A, B (… C) labeled with letters.
    - Member demos expand/collapse independently.
    - Divergence stripe appears only on a group with mismatched member set counts.
  - Open a singles-only program. Verify segmented numbering across `Warm Up` and `Exercise` items.
  - In DevTools Application panel:
    - `action-app:progress-version` is `"2"`.
    - Any v1 progress is gone after first load.
    - Toggled keys look like `"3"` and `"5.1"`.
  - Capture one screenshot per case into `.playwright-mcp/`.

- [ ] 9. Final review and single commit
  - Re-run `--selftest`.
  - `git diff` review: workouts.json, v2/src/utils/{data,storage}.js, v2/src/pages/ProgramDetailPage.js, v2/src/components/{GroupCard,ExerciseCard}.js, v2/scripts/migrate-workouts.js.
  - Commit titled `superset simplification: unified kind, per-member checkboxes, path-key progress`.

## Notes

- No new dependencies. No TypeScript. Vanilla JS modules + Tailwind, matching existing conventions.
- The migration script lives under `v2/scripts/` alongside `copy-data.js`, but operates on the repo-root `workouts.json` because that's the source of truth for the app's fetched data.
- `workouts.json.bak` is a safety net; delete it before committing so it doesn't enter git history. The script logs a reminder.
- The schema-version wipe is intentionally unforgiving — the user explicitly approved dropping any in-progress completion state on first load of the new version.
- Equal-set-count validation between superset members is OUT OF SCOPE. The divergence stripe surfaces the difference in the UI but does not enforce uniformity.
- Round counters, per-set tap dots, and unit-type counters/timers are deferred to a separate effort.
