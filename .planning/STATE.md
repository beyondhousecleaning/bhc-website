---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 02-02-PLAN.md
last_updated: "2026-08-09T19:23:59.296Z"
last_activity: 2026-08-09
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 20
  completed_plans: 7
  percent: 17
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-08)

**Core value:** Every technical and content decision serves organic + Google Maps visibility for `cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and five new postcode areas (B, DY, TF, WS, WV).
**Current focus:** Phase 02 — component-library-completion-core-templates

## Current Position

Phase: 02 (component-library-completion-core-templates) — EXECUTING
Plan: 3 of 15
Status: Ready to execute
        `www.beyondhousecleaning.com` still on Webflow, untouched. Ready for Phase 02.
Last activity: 2026-08-09

Progress: [████░░░░░░] 35%

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
| Phase 01 P04 | 20min | 3 tasks | 1 files |
| Phase 02 P01 | 32min | 3 tasks | 18 files |
| Phase 02 P02 | 25min | 3 tasks | 6 files |

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
- [Phase 01]: 01-04: Vercel project bhc-website (prj_JOjTPePirfNMQUshAioLkqXXBxXY) is LIVE at https://bhc-website-nine.vercel.app — Root Directory web, Node 22.x, framework-default build, NO custom domain; D-03 intact, apex still Webflow 198.202.211.1
- [Phase 01]: 01-04: D-09 CLOSED — Sam confirmed 2026-08-09 that +447861936533 IS the number that reaches BHC; no code change taken, and 07441918832 / +447575709361 stay retired and asserted-against at check-html-locks.mjs:86
- [Phase 01]: 01-04: Vercel Deployment Protection is ON (Standard, ssoProtection=all_except_custom_domains) — only the production alias bhc-website-nine.vercel.app is public (200); every generated/team/branch URL 302s to Vercel SSO, so no bypass token exists or is needed
- [Phase 01]: 01-04: Vercel POST /v11/projects REJECTS nodeVersion and defaults new projects to Node 24.x — the follow-up PATCH /v9/projects/{id} to 22.x is mandatory, not cosmetic; link.productionBranch stays main deliberately (main has no web/, so an accidental build from it fails and cannot take the alias)
- [Phase ?]: 02-01: explicitly-international phone values are exempt from toDial's national-length check — CR-04's no-fabricated-+44 guarantee depends on it
- [Phase 02]: 02-01: styles.css was the deviation, not UI-SPEC — .bhc-interlink__heading moves to --bhc-text-2xl, the settled <h2> size for all 16 new components
- [Phase 02]: 02-01: Button gains as?: ElementType despite not being one of the sixteen — UI-SPEC 13-J is scoped by 'link-bearing', not by 'new'
- [Phase 02]: 02-01: node cannot import .jsx in this repo — component behaviour checks must assert over built HTML or compile through Next's bundled SWC binding (transformSync takes source, isModule, Buffer)
- [Phase ?]: 02-02: RatingBadge.emitSchema is OFF on every Phase 2 template — the bare badge satisfies Lock 3 and 17 orphaned AggregateRating nodes would worsen the deferred CR-05
- [Phase ?]: 02-02: Dormant locks are gated and assert the INVERSE (INTERLINK_LOCK_ACTIVE, NO_RATING_YET, NO_PRIMARY_CTA_YET) so the plan that should re-enable them finds the build red
- [Phase ?]: 02-02: The tel: cap is 4 per page, not 3 — QuoteFormEntry's fallback is the fourth link; exactly one tel: inside <footer> remains the real NAP invariant
- [Phase ?]: 02-02: The budget gates on the modern noModule-excluded JS figure and reports the legacy polyfill separately (WR-06); page weight is gzip JS + gzip HTML + gzip CSS + raw woff2 (WR-05)

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

Last session: 2026-08-09T19:23:59.284Z
Stopped at: Completed 02-02-PLAN.md
Resume file: None
