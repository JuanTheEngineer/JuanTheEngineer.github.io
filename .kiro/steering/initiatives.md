---
inclusion: auto
---

# Initiatives

This file tracks the active improvement initiatives for the Action App. It auto-loads into every session in this project, so any new session inherits the plan without re-investigating.

How to use: open a new Kiro chat in this folder and say "Start Initiative A" (or B/C/D). The session already has this context. Each initiative is scoped to be worked independently.

How to add a new initiative: copy the template at the bottom, give it the next letter, fill in Scope / Key files / Acceptance, and add a row to the table. Keep each initiative small enough to review under the 150-150-CR rule (see commit-discipline.md).

## Status table

| ID | Initiative | Status | Priority |
|----|-----------|--------|----------|
| A | Streamlined ingestion pipeline | In progress | High |
| B | Plan and workout authoring | Not started | Medium |
| C | Description standardization (one trainer voice) | Not started | Medium |
| D | Housekeeping | Not started | Low |
| E | AI demo finder accuracy + audit | Not started | Medium |

---

## Initiative A: Streamlined ingestion pipeline

**Goal:** Make adding exercises and reorganizing workouts fast and low-error. Today, adding one exercise spans 3+ scripts across Python and JS plus hand-pasting JSON into `exercises.json` and `workouts.json`; nothing writes back from the browser Studio; `validate-workouts.js` is stale.

**Scope (deliverables):**
- A1: One-command "add exercise" CLI: source URL + trim times -> Cloudinary upload -> demo object -> append to `exercises.json` -> validate. Collapses the current multi-script flow.
- A2: Write-back path so the browser Studio export saves to the root JSON files directly instead of copy-paste.
- A3: Fix `scripts/validate-workouts.js` to match the live `program.items` schema (it currently reads `program.exercises` / `cloudinaryUrl` and undercounts).

**Key files:** `scripts/reel-to-cloudinary.sh`, `scripts/upload-to-cloudinary.js`, `scripts/backfill-exercise-metadata.py`, `scripts/ai-program-builder.js`, `scripts/validate-workouts.js`, `v2/src/pages/StudioPage.js`, `v2/src/pages/ProgramEditorPage.js`, `v2/src/pages/ExerciseEditorPage.js`, `exercises.json`, `workouts.json`, `data-model.json`, `v2/scripts/smoke-test.js`.

**Acceptance:** Adding one exercise from a source video to a live program is a single guided command plus a validate step; `npm test` (smoke test) passes; no manual JSON paste required for the common path.

## Initiative B: Plan and workout authoring

**Goal:** Make it easy to create programs and group them into plans. Nothing generates `plans.json` entries today; `ai-program-builder.js` builds a program object + exercise stubs but does not file it into a plan.

**Scope (deliverables):**
- B1: A `plans.json` builder that groups programs into plans -> subPlans -> program IDs.
- B2: Extend `ai-program-builder.js` (or Studio) to create a program and file it into a plan in one flow.

**Key files:** `plans.json`, `workouts.json`, `scripts/ai-program-builder.js`, `v2/src/pages/ProgramEditorPage.js`, `v2/scripts/smoke-test.js`.

**Acceptance:** A new program can be created and placed into a plan/subPlan without hand-editing `plans.json`; smoke test passes (all plan -> program references resolve).

## Initiative C: Description standardization (one trainer voice)

**Goal:** Re-voice all 111 exercises' `description`, `purpose`, `benefits` so they read as if written by one experienced, approachable trainer. Baseline is already single-voice and guideline-clean, so this is a bounded re-voicing pass, not a rescue.

**Scope (deliverables):**
- C1: Define the trainer persona + a rewrite rubric layered on `exercise-content-guidelines.md`.
- C2: Batch re-voice all 111 exercises (data-only, ~20 exercises per commit per 150-150-CR).
- C3 (optional): Populate the `alternatives` field (empty on all 111 today).

**Key files:** `exercises.json`, `.kiro/steering/exercise-content-guidelines.md`.

**Acceptance:** All description-family fields follow the persona/rubric; no banned punctuation in authored prose; smoke test passes.

## Initiative D: Housekeeping

**Goal:** Small, do-anytime cleanups.

**Scope (deliverables):**
- D1: Update the stale `CLAUDE.md` (it describes the retired Jekyll V0, not the current Vite `v2/` app).
- D2: Clean the 5 em-dashes in authored copy / `recommendations.note` per the punctuation guideline.

**Key files:** `CLAUDE.md`, `exercises.json`.

**Acceptance:** `CLAUDE.md` accurately describes the v2 architecture and workflow; no em-dashes in authored prose fields.

## Initiative E: AI demo finder accuracy + audit

**Goal:** The last bulk AI demo-discovery run (`scripts/find-exercise-videos.py`, YouTube search + GPT-4 Vision scoring) committed inaccurate clips for existing exercises with no human gate. Fix the accuracy and audit what is already in the library.

**Scope (deliverables):**
- E1: Audit existing `demos[]` across all 114 exercises; flag likely-wrong AI-discovered clips (wrong variation, explainer instead of demo) for review.
- E2: Change the discovery flow so AI-discovered demos default to an UNREVIEWED state and require approval in `data-editor.py` before they are trusted. Trainer/verified demos stay `isPrimary` and are never auto-replaced.
- E3 (optional): Improve candidate scoring or swap the model; secondary to the human-gate fix.

**Key files:** `scripts/find-exercise-videos.py`, `scripts/data-editor.py`, `exercises.json`.

**Acceptance:** No AI-discovered demo is marked reviewed/primary without human approval; existing suspect clips are flagged; smoke test passes.

---

## Template: new initiative

Copy this block, assign the next letter, and add a row to the status table.

```
## Initiative <ID>: <name>

**Goal:** <one or two sentences on the problem and the target state>

**Scope (deliverables):**
- <ID>1: <deliverable>
- <ID>2: <deliverable>

**Key files:** <comma-separated paths>

**Acceptance:** <how we know it is done; include "smoke test passes" if it touches data>
```
