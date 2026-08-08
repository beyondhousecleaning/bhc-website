# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-08)

**Core value:** Every technical and content decision serves organic + Google Maps visibility for `cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and five new postcode areas (B, DY, TF, WS, WV).
**Current focus:** Phase 1 — Platform Foundation & Design System Integration

## Current Position

Phase: 1 of 6 (Platform Foundation & Design System Integration)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-08-08 — ROADMAP.md, PROJECT.md, REQUIREMENTS.md created from doc ingest (`.planning/intel/`); handed off for `/gsd:plan-phase 1` in a fresh session

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: - min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: none yet
- Trend: n/a

*Updated after each plan completion*

## Accumulated Context

### Decisions

Full decision log (D1–D14, all locked) lives in `.planning/PROJECT.md` Key Decisions table.
Highlights a fresh session needs immediately:

- D5: Next.js on Vercel. D2: URL pattern `/location/<region>/<town>/<service>` preserved, zero
  redirects for the 95 existing pages; new `/locations`/`/locations/<town>` index/hub layer uses
  a different (plural) prefix to avoid collision.
- D4: no street address/postcode anywhere, ever (CI Lock #5).
- D14: canonical UK-vocabulary service taxonomy locked — 8 concepts, 4 slugs need 301s.
- The design-system package (`design-system/`) already exists: `tokens.css` + 6 built components
  (Button, Hero, Breadcrumbs, RatingBadge, NAPFooter, InterlinkBlock), 8 passing lock tests.
  Phase 1 integrates this, it does not design it.

### Pending Todos

None yet.

### Blockers/Concerns

- **Before/after photography (not a phase gate):** all 199 existing Canva exports are unusable
  (old logo burned in, ~530×690px recoverable, BEFORE/AFTER labels baked into the image). Sam
  needs to pull originals from canva.com → Projects → Uploads. Phase 2 ships BeforeAfterSlider
  with a placeholder state so this never blocks the critical path; Phase 4 backfills real photos
  once available. Re-check with Sam before Phase 4 starts.
- **Fresh-session handoff:** this roadmap was produced for a new Opus 5 session to execute.
  PROJECT.md's Context section is the condensed version of 5 source docs
  (`docs/goals.md`, `docs/design/design-system.md`, `docs/brand/brand-brief.md`,
  `docs/brand/photo-spec.md`, `docs/research/seo-audit-2026-08-06.md`) — read PROJECT.md +
  ROADMAP.md + REQUIREMENTS.md first; only fall back to `.planning/intel/` source files if a
  specific detail is missing.
- **claude-seo plugin hook:** `PostToolUse` on `.jsx/.tsx/.html/...` writes blocks (exit 2) on the
  case-insensitive substring `REPLACE`. Watch for false positives during schema/copy work
  (e.g. legitimate text containing "replacement"); `claude plugin disable claude-seo` if it
  becomes a problem.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Ops (off-site) | OPS-01/02/03 — GBP citation building, review-generation system, dedicated local-SEO project skill | v2, tracked in REQUIREMENTS.md | Initial roadmap, 2026-08-08 |
| Map-pack expansion | EXPAND-01 — second staffed premises/GBP for B/DY/TF/WS/WV | v2, tracked in REQUIREMENTS.md | Initial roadmap, 2026-08-08 |

## Session Continuity

Last session: 2026-08-08 (roadmap creation from doc ingest)
Stopped at: ROADMAP.md, PROJECT.md, REQUIREMENTS.md written and ready for user approval; no plans created yet
Resume file: None — next step is `/gsd:plan-phase 1` once approved
