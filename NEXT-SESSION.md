# Context Transfer for Next Session

## Current State (as of May 31, 2026)

### What's Built & Working
- **v2 webapp** at `http://localhost:5173/` (Vite + Tailwind 4 + TypeScript)
- **Program Studio** (`/#/studio`) — create/edit programs and exercises (dev-only, hidden on production)
- **Exercise Library** (`/#/exercises`) — browse all 93 exercises with demos
- **Program Detail** (`/#/program/:id`) — expanding rows, progress tracking, celebration
- **Home page** — recent programs, browse, exercise library
- **Data**: 93 canonical exercises, 15 programs, clean (audited, no dupes, no displayName)

### Stack
- Vanilla JS (no framework), Vite 5.4, Tailwind CSS 4.3, TypeScript (strict, incremental)
- ESLint + Prettier, smoke test (`npm test`)
- Static JSON data (exercises.json, workouts.json, plans.json, glossary.json)
- Cloudinary CDN for media, YouTube embeds
- GitHub Pages hosting (not yet pushed — 80+ commits ahead of origin)

### Key Files
- `v2/src/` — all webapp source
- `v2/src/components/StudioTimeline.js` — timeline with ⋮ menu, grouping
- `v2/src/pages/ProgramEditorPage.js` — program creation/edit
- `v2/src/pages/ExerciseEditorPage.js` — exercise creation/edit
- `v2/src/pages/ExerciseLibraryPage.js` — browse exercises
- `v2/src/types.ts` — full TypeScript type definitions
- `exercises.json`, `workouts.json`, `plans.json` — source of truth
- `.kiro/specs/program-studio/design.md` — Studio design doc (5 paths)
- `.kiro/steering/hci-research-learnings.md` — HCI principles & research

---

## 🎯 PRIMARY GOAL: Ship MVP to Production

The site has NOT been pushed yet. Before pushing to GitHub Pages:

### MVP Checklist (must-have for first push)
- [ ] Program detail page works correctly with dynamic numbering
- [ ] Exercise library is browsable and demos play
- [ ] Programs list shows all programs cleanly
- [ ] No broken UI on mobile (390px iPhone viewport)
- [ ] Studio is hidden on production (already done)
- [ ] Share button works
- [ ] No console errors on any page

### Nice-to-have before push
- [ ] Single exercise page (`/#/exercise/:id`)
- [ ] Program search on the browse page
- [ ] Fix ⋮ menu finger-tap issue in Studio (dev-only, not blocking MVP)

---

## Planned Tasks (Priority Order)

### 1. Add Lower Body Rebuild A (dogfood test)
Use the Studio to add the program. Exercises needed:
- **Existing**: `dbboxsquats`, `calfraises`, `sldbrdl`, `posture-ex1`, `dbrdls`
- **New** (create in Studio): Backward Treadmill Walk, Hamstring Heel Dig Isometric, Glute Bridge

After creating in Studio, copy the exported JSON into:
- New exercises → append to `exercises.json` exercises array
- Program → append to `workouts.json` programs array
- Optionally add to `plans.json` under a new "Rebuild" plan

### 2. Program Search Page
- New route: `/#/search` (or add search to the programs list page)
- Fuzzy search over program titles (reuse the same search engine from ExercisePicker)
- This becomes the foundation for AI chat later (Path 4)
- Add a "Search" card on the home page between Browse and Exercise Library

### 3. Single Exercise Page (`/#/exercise/:id`)
- Full detail view: name, all demos (carousel), recommendations, aliases
- Linked from Exercise Library (tap an exercise → navigate to detail)
- Shows which programs use this exercise

### 4. Fix ⋮ Menu Finger Tap (Studio)
- The button works via keyboard/Playwright but not finger tap on some devices
- Likely a touch-action or event propagation issue
- Consider adopting Alpine.js for reliable click handling (discussed in session)

### 5. AI Script for Program Creation
- A script that takes a ChatGPT workout text dump and:
  - Parses exercises from the text
  - Maps to existing exercise IDs where possible
  - Creates new exercise entries for unknowns
  - Outputs the program JSON ready to paste
- Could be a Node script or integrated into the Studio as Path 4

### 6. Replace Main Domain
- Promote v2 to be the main site at juantheengineer.github.io
- Retire old pages (v0, onsen_demo, etc.)
- Update any links

### 7. AI Chat Panel (Path 4 from design doc)
- Paste a workout → AI maps exercises → builds program
- YouTube search viewport for finding demos
- Needs API key (user-provided, stored in localStorage)
- Full design in `.kiro/specs/program-studio/design.md`

---

## Known Issues
- ⋮ menu in Studio doesn't respond to finger taps (works with keyboard/Playwright)
- 13 exercises have 0 demos (all from Reload PT programs)
- YouTube alternatives on some exercises are duplicated across pair-partners (cosmetic)
- `beforeunload` dialogs accumulate in Playwright testing (stale state)

---

## How to Add Lower Body Rebuild A (Copy-Paste Ready)

### Step 1: Create new exercises in Studio
Go to `http://localhost:5173/#/studio/exercise` and create each:

**Exercise 1: Backward Treadmill Walk**
- Name: Backward Treadmill Walk
- Reps: 5, Sets: 1, Units: min
- Note: Incline 3, slow pace; warms up quads + ankles.
- Demo: YouTube URL (find one)

**Exercise 2: Hamstring Heel Dig Isometric**
- Name: Hamstring Heel Dig Isometric
- Reps: 30, Sets: 3, Units: secs
- Note: Push heel into floor, squeeze hamstrings.
- Demo: YouTube URL (find one)

**Exercise 3: Glute Bridge**
- Name: Glute Bridge
- Reps: 12, Sets: 3, Units: reps
- Note: Pause 2s at top, drive through heels.
- Demo: YouTube URL (find one)

Export each and paste into exercises.json.

### Step 2: Create the program in Studio
Go to `http://localhost:5173/#/studio/program` → Create new program

- Title: Lower Body Rebuild A
- Requirements: Dumbbells, Treadmill, Bench

Add exercises in order:
1. Backward Treadmill Walk (tag: warmup)
2. Hamstring Heel Dig Isometric
3. Glute Bridge
4. DB Romanian Deadlift (existing: search "DB Romanian")
5. DB Box Squat (existing: search "box squat")
6. Calf Raise (existing: search "calf")
7. Single-Leg DB Romanian Deadlift (existing: search "single leg")
8. Posture Drill (existing: search "posture", tag: stretch)

Export and paste into workouts.json.

### Step 3: Add to plans.json (optional)
```json
{
  "name": "Rebuild",
  "description": "Rebuild and rehab programs.",
  "subPlans": [
    {
      "name": "Lower Body",
      "description": "Knee-friendly lower body rebuild sessions.",
      "programs": ["lower_rebuild_a"]
    }
  ]
}
```

---

## Architecture Notes for Next Dev
- No backend. All data is static JSON committed to repo.
- Studio exports JSON to clipboard — user pastes into files manually.
- Production gate: `isLocalDev()` checks hostname for localhost/127.0.0.1
- Smoke test: `npm test` runs build + 11 data integrity assertions
- Commit discipline: 150-150-CR rule (see `.kiro/steering/commit-discipline.md`)
- HCI principles: see `.kiro/steering/hci-research-learnings.md`
