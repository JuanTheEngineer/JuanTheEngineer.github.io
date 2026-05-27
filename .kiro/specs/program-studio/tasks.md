# Implementation Plan: Program Studio (Path 3)

## Overview

Build the Program Studio as 12 incremental commits following the 150-150-CR rule. Each task is independently shippable and builds on the previous. Total estimated: ~1,270 lines of source code.

## Task Dependency Graph

```json
{
  "waves": [
    {"tasks": [1]},
    {"tasks": [2]},
    {"tasks": [3]},
    {"tasks": [4, 7]},
    {"tasks": [5, 6, 8]},
    {"tasks": [9, 10, 11]},
    {"tasks": [12]}
  ]
}
```

## Tasks

- [ ] 1. Studio route + chooser page: Register /#/studio route in main.js, add "Create" button to HomePage, render StudioPage with "New Program" / "New Exercise" cards, wire navigation. ~80 lines. Implements FR-1, FR-11 entry point.
- [ ] 2. Exercise search component (ExercisePicker): Build search index from exercises.json (name + aliases + id tokens), implement fuzzy scoring, render search input + results list, "No results" state with "+ Create new exercise" button. ~120 lines. Implements FR-3.
- [ ] 3. Program metadata form + timeline shell: ProgramEditor component with meta form (title, requirements, description, difficulty, duration), auto-derive id, empty timeline placeholder, wire ExercisePicker so clicking a result calls addItem(). ~130 lines. Implements FR-2, FR-4.
- [ ] 4. Per-item editing + timeline rendering: Render timeline items as cards, expandable edit form per item (reps, sets, repUnits, note, displayName, tags), remove button, move-up/move-down buttons. ~140 lines. Implements FR-5.
- [ ] 5. Drag-and-drop reordering: Add SortableJS, make timeline items draggable with touch support, update state on drop, visual drag handle + drop indicator. ~90 lines. Implements FR-6.
- [ ] 6. Grouping (superset/compound/circuit): Multi-select checkboxes, "Group" button with kind dropdown, GroupWrapper component, ungroup button, group metadata editing. ~150 lines. Implements FR-7, FR-8.
- [ ] 7. Exercise creation slide-over (ExerciseEditor): Slide-over panel from picker, name input with id preview, recommendations form, tags/equipment inputs, save adds to index + queue, cancel discards. ~130 lines. Implements FR-9.
- [ ] 8. Multi-demo management (DemoManager): "+ Add demo" button, media type dropdown with contextual fields, YouTube thumbnail preview, primary toggle, remove/reorder demos, URL validation. ~150 lines. Implements FR-10.
- [ ] 9. Standalone exercise creation page: Full-page ExerciseEditor when "New Exercise" chosen, includes DemoManager, export produces single exercise JSON. ~60 lines. Implements FR-11.
- [ ] 10. Preview panel: Build resolved program from EditorState, render with ExerciseCard + GroupCard, show in modal/overlay, back button. ~80 lines. Implements FR-12.
- [ ] 11. Export drawer: Two sections (new exercises + program), syntax-highlighted code, "Copy" + "Download" buttons, toast confirmation. ~100 lines. Implements FR-13.
- [ ] 12. Clone from existing + unsaved guard: Program picker for clone, deep-clone into state, clear id. isDirty tracking, beforeunload handler, in-app nav prompt. ~140 lines. Implements FR-14, NFR-5.

## Notes

- Tasks 1-4 form the MVP (functional program authoring with existing exercises only — Story A)
- Tasks 5-6 add the visual polish (drag + grouping)
- Tasks 7-9 complete the full loop (new exercises with demos — Story B)
- Tasks 10-12 are the output layer (preview, export, clone, guard)
- SortableJS (~8KB gzipped) is the only external dependency added
- The ExercisePicker component (Task 2) is reusable for the Exercise Library page later
