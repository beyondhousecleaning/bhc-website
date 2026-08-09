---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 01-05-PLAN.md
last_updated: "2026-08-09T13:46:00.602Z"
last_activity: 2026-08-08
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 5
  completed_plans: 4
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-08)

**Core value:** Every technical and content decision serves organic + Google Maps visibility for `cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and five new postcode areas (B, DY, TF, WS, WV).
**Current focus:** Phase 01 — platform-foundation-design-system-integration

## Current Position

Phase: 01 (platform-foundation-design-system-integration) — EXECUTING
Plan: 4 of 5 complete — 01-01, 01-02, 01-03, 01-05 done; **01-04 (Vercel) is the only one left**
Status: Ready to execute 01-04 (wave 5)
Last activity: 2026-08-08

Progress: [████████░░] 80%

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
| Phase 01 P01 | 4 | 3 tasks | 6 files |
| Phase 01 P02 | 6min | 3 tasks | 7 files |
| Phase 01 P03 | 8min | 3 tasks | 4 files |
| Phase 01 P05 | 65min | 2 tasks | 1 files |

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

- [Phase ?]: 01-01: safeJsonLd escapes < in all JSON-LD payloads; package-internal, deliberately NOT exported from design-system/src/index.js
- [Phase ?]: 01-01: design-system exports map now exposes wildcard ./fonts/* (not a single fonts.css entry) so the 8 sibling .woff2 files resolve through the package boundary
- [Phase ?]: 01-01: design-system lock suite is now 10 tests, not 8 — update any doc or CI job that hardcodes 8
- [Phase 01]: 01-02: repo is an npm workspace [web, design-system] with a committed root package-lock.json; @bhc/design-system resolves via symlink and needs no build step
- [Phase 01]: 01-02: the app passes NO phone prop to NAPFooter — the canonical +447861936533 stays single-sourced as the package default; that is what makes REQ-nap-consistency structural
- [Phase 01]: 01-02: CI gates in this project are plain substring greps over web/app, so explanatory comments must NOT contain the substring they describe (use client, tokens.css) — carry this into Plan 03's check script
- [Phase ?]: 01-03: CI gate lives in GitHub Actions, not the Vercel build — Root Directory sandboxing forbids .. traversal and a red preview does not block a merge (D-13)
- [Phase ?]: 01-03: actions/checkout and actions/setup-node pinned to v7 — majors confirmed at execution time; research assumption A2 said v4
- [Phase ?]: 01-03: enforcement code stays zero-dependency — node: built-ins only, no DOM parser, no size tool, no test framework beyond node:test
- [Phase ?]: 01-05: repo made PUBLIC (Sam, Route B) — GitHub Free gives a private personal repo neither branch protection nor rulesets, so this was the only zero-cost route to D-13; .planning/ and docs/research/ are now world-readable
- [Phase ?]: 01-05: main is gated by repository ruleset 20595020 (active, refs/heads/main, locks + build required, strict on, bypass_actors empty) — verify via rules/branches/main; branches/main/protection 404s and that is expected, not a failure
- [Phase ?]: 01-05: required status checks now gate direct pushes to main too, not just merges — a push whose head commit has not passed locks and build is rejected

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

Last session: 2026-08-09T13:46:00.593Z
Stopped at: Completed 01-05-PLAN.md
Resume file: None
