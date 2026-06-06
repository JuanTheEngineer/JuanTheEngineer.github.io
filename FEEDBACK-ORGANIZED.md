# App Feedback — Organized

## ✅ Already Fixed This Session

| Item | Status |
|------|--------|
| Loading spinners for demos (pixel-art lifter) | ✅ Done |
| Demo disappearing bug (dots going away) | ✅ Done (progressive reveal) |
| "Original" label on demos | ✅ Changed to "Video"/"Demo" |
| GIF tap to pause/resume | ✅ Done |
| Celebration text "Strengthened and Conditioned!" | ✅ Added |
| Feedback link (Google Form placeholder) | ✅ Added |
| Sets/reps overflow (long strings like "Decrementing") | ✅ Auto-shrinks |

---

## 🔲 Remaining — Organized by Priority

### Must-Have for Launch

| # | Item | Effort | Notes |
|---|------|--------|-------|
| F1 | **Quality check all data** (typos, exercises, programs) | Medium | Use the Tkinter editor, "Skip to Issues" |
| F2 | **Standardize requirements** on all programs | Small | Consistent format (e.g., "Dumbbells, Bench, Band") |
| F3 | **Standardize demo captions** — all demos should have appropriate notes | Small | Use editor, review each |
| F4 | **Change superset wording** — "Do each exercise with no rest in between to complete one rep." or clearer | Tiny | Update `KIND_DESCRIPTIONS` in GroupCard.js |
| F5 | **Google Form — get actual form ID** and replace placeholder URL | Tiny | Create form, paste ID |

### Important (Next Session)

| # | Item | Effort | Notes |
|---|------|--------|-------|
| F6 | **Demo loading investigation** — full spec/audit of carousel loading logic | Medium | "completely investigate the code that loads the demos" |
| F7 | **Abbreviation handling** — 1A, 1L, RFESS, RDL etc. Glossary tooltips when terms appear | Medium | Leverage glossary.json, scan exercise names/notes for terms |
| F8 | **Notes quality overhaul** — CSV export → manual review → re-import + guards | Large | Full process: export, you fill, import, add validation |
| F9 | **Demo creator credit** — show channel/creator name, link to original URL | Small | Add `creator` field to demo schema, display in carousel caption |
| F10 | **Body part filter (U3)** — filter programs by Upper/Lower/Full Body/Rehab | Small | Add filter chips to programs page |
| F11 | **Custom domain** — actionapp.com or similar | Small | Buy domain, configure DNS + CNAME |
| F12 | **AI auto-fill enhancements** — fetch YouTube metadata (title, channel) for captions + creator credit | Medium | YouTube Data API or oEmbed endpoint |
| F13 | **AI demo caption fill** — for YouTube/TikTok demos with empty captions, auto-fetch video title as caption | Small | Part of F12, uses oEmbed (no API key needed) |

### Nice-to-Have / Future

| # | Item | Effort | Notes |
|---|------|--------|-------|
| F13 | **Max exercises per program** — enforce limit of 20 | Tiny | Add smoke test assertion or Studio validation |
| F14 | **Max programs per plan** — enforce limit of 40 | Tiny | Smoke test assertion |
| F15 | **Sets/reps: single vs ranges** — keep both, no change needed for launch | — | Already works ("12" and "8-12" both display fine) |
| F16 | **Feedback form in more places** — next to share button, in program detail | Small | Add link in program detail footer |

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Single numbers or ranges for sets/reps? | Keep both — users understand "8-12" intuitively. No change needed. |
| Section headers (warmup/main/stretch)? | Reverted — didn't look good. May revisit with a subtler approach later. |
| Demo loading behavior? | Progressive reveal — only show loaded demos, no empty slots. Needs further investigation (F6). |

---

## What to Do Right Now

1. **Run the editor** → `python3 scripts/data-editor.py`
2. **Skip to Issues** → fix missing notes, bad captions, typos (F1, F2, F3)
3. **Update superset wording** → I'll do this in code (F4)
4. **Create Google Form** → paste link (F5)
5. **Commit + push** → live for basketball crew

Everything else goes to next session.
