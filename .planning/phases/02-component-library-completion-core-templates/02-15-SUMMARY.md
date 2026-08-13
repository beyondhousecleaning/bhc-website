---
phase: 02-component-library-completion-core-templates
plan: 15
wave: 7
subsystem: phase-verification
status: awaiting-human-checkpoint
tags: [verification, success-criteria, ci-gate, evidence-table, checkpoint, wave-7]

# Dependency graph
requires:
  - phase: 02
    plan: 13
    provides: "the composed root layout, the real 404 template, EXPECTED_APP_ROUTES at 18 and the delta 8 photo-state lock"
  - phase: 02
    plan: 14
    provides: "the preview and component floors at 22, and the refreshed package docs"
provides:
  - "a machine-derived evidence table for all four ROADMAP Phase 2 Success Criteria"
  - "CI run 31385409769 recorded green on branch head c68f520 for both required checks"
  - "the phase-start -> phase-end measurement delta, with the two measurement-basis changes named"
  - "the recorded list of known open items handed to Sam / later phases"
affects:
  - "Phase 2 verification gate — /gsd:verify-work reads this report"
  - "Phase 3 planning — INTERLINK_LOCK_ACTIVE, EXPECTED_APP_ROUTES and PHOTO_PLACEHOLDER_ROUTES all grow there"

tech-stack:
  added: []
  patterns:
    - "evidence derived independently from build output and repo state; no SUMMARY claim accepted as evidence"

key-files:
  created:
    - .planning/phases/02-component-library-completion-core-templates/02-15-SUMMARY.md
  modified: []

decisions:
  - "the phase-start budget baseline (168.5 KB JS / 191.3 KB page) is NOT directly comparable to the phase-end figure — WR-06 removed the noModule legacy polyfill from the JS number and WR-05 added raw woff2 to the page number, both during this phase"
  - "the debt-marker scan's single hit is BeforeAfterSlider.prompt.md forbidding those very phrases — the twelfth scanner/comment self-collision this phase, reported not fixed"
  - "the dependency-change check is run against the phase-start commit fe45b8a, not against main — main predates the app entirely, so a main diff would show the whole Phase 1 scaffold and prove nothing about this phase"

metrics:
  duration: 18min
  tasks_completed: 1
  tasks_total: 2
  completed: 2026-08-10
---

# Phase 2 Plan 15: Phase Verification — Success Criteria, CI Gate, Human Checkpoint

Machine-verified all four ROADMAP Phase 2 Success Criteria against `.next` build output and repo
state, confirmed both required CI checks green on branch head `c68f520`, and paused at the
blocking human checkpoint for the visual and keyboard checks no grep can settle.

**Status: Task 1 complete. Task 2 is a blocking human checkpoint and has NOT been self-approved.**

---

## Verify chain — four stages, all green

`npm run verify` from a clean tree, exit **0**.

| Stage | Command | Result | Count |
|-------|---------|--------|-------|
| 1 | `npm run test:locks` | ✓ pass | **20** design-system lock tests, 0 fail (`MIN_TESTS = 20` in `design-system/test/run-locks.mjs:53`) |
| 2 | `npm run build` | ✓ pass | 19/19 static pages generated in 350 ms |
| 3 | `npm run check:html` | ✓ pass | **31** built-HTML lock tests, 0 fail |
| 4 | `npm run check:budget` | ✓ pass | JS 129.8 KB / 500 KB (worst `/`), page 298.4 KB / 1024 KB (worst `/services/deep-cleaning`) |

---

## Success-criteria evidence table

Every row below was derived independently by this plan from `design-system/src/`,
`web/.next/prerender-manifest.json` and `web/.next/server/app/*.html`. No `02-*-SUMMARY.md` claim
was accepted as evidence; the summaries were read afterwards and reconcile with these numbers.

### SC-1 — the sixteen components exist in the four-file shape

**Command:** node fs scan over `design-system/src/components/`, requiring
`<Name>.jsx`, `<Name>.html`, `<Name>.d.ts`, `<Name>.prompt.md` in each directory.

| Measure | Result |
|---------|--------|
| Component directories | **22** |
| Directories missing any of the four canonical files | **0** (`missing []`) |
| The sixteen named Phase 2 components present | **16 of 16**, none missing |
| Pre-existing Phase 1 six | `Breadcrumbs, Button, Hero, InterlinkBlock, NAPFooter, RatingBadge` |
| `.design-sync/config.json` → `componentSrcMap` | **22** keys |
| `.design-sync/config.json` → `docsMap` | **22** keys |

The sixteen, all present: `Header, Footer, SkipLink, SectionBand, Prose, ServiceCard, TownCard,
ProcessSteps, FAQAccordion, CTABand, QuoteFormEntry, StickyCallBar, ReviewCard, ReviewRail,
TrustBar, BeforeAfterSlider`.

Delta 9 coverage confirmed at `design-system/test/locks.test.js:504-539` — it enumerates the
directories itself (not a literal list), floors at `>= 22`, requires a flat directory, requires all
four canonical files, and requires registration in **both** `.design-sync` maps. So the 22 above are
the same 22 the lock walks.

**SC-1: SATISFIED.**

### SC-2 — every page renders with exactly one `<h1>`

**Command:** read `web/.next/prerender-manifest.json`, then for each route read its `.html` from
`web/.next/server/app` and count with the tag-form / `class="[^"]*…` forms that survive the RSC
flight payload.

| Measure | Result |
|---------|--------|
| Route keys in the prerender manifest | **19** — 18 app routes + `/_global-error` |
| Routes with `compute` ≠ `"static"` | **0** |
| Pages with `<h1>` count ≠ 1 | **none** (all 19, including `/_global-error`) |
| `<header>` per app page | 1 on all 18 |
| `<nav aria-label="Primary">` per app page | 1 on all 18 |
| `<main id="main">` per app page | 1 on all 18 |
| `<footer>` per app page | 1 on all 18 |
| `class="…bhc-skip-link"` per app page | 1 on all 18 |
| `aria-current="page"` per app page | ≤ 1 (0 on `/` and `/_not-found`, 1 elsewhere) |
| JSON-LD blocks (tag form) | 1 on `/` and `/_not-found`, 2 on the other 16 |
| Max `tel:` links on any page | **4**, on `/get-a-quote` and `/customer-login` — exactly the cap |

`/_global-error` carries 1 `<h1>` and 0 of every landmark, exactly as `FRAMEWORK_ONLY` documents.

**The 18 app routes, `<h1>` verbatim from built HTML:**

| Route | `<h1>` |
|-------|--------|
| `/` | Professional House Cleaning in Warwickshire & the West Midlands |
| `/services/deep-cleaning` | Deep Cleaning in Warwickshire & the West Midlands |
| `/services/standard-home-cleaning` | Regular House Cleaning in Warwickshire & the West Midlands |
| `/services/move-in-cleaning` | Move-In Cleaning in Warwickshire & the West Midlands |
| `/services/move-out-cleaning` | Move-Out Cleaning in Warwickshire & the West Midlands |
| `/services/short-term-rental-cleaning` | Short-Term Rental Cleaning in Warwickshire & the West Midlands |
| `/services/post-construction-cleaning` | Post-Construction Cleaning in Warwickshire & the West Midlands |
| `/about-us` | The Team Behind Beyond House Cleaning |
| `/checklist` | What's Included in Every Clean |
| `/customer-service-agreement` | Customer Service Agreement |
| `/get-a-quote` | Get a Free Cleaning Quote |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |
| `/_not-found` | We Couldn't Find That Page |

**The four pages that had NO `<h1>` on the live Webflow site — now fixed, verbatim, and each
matches its UI-SPEC §5 row (lines 351–356) character for character:**

| Route | `<h1>` in built HTML | UI-SPEC §5 | Match |
|-------|----------------------|------------|-------|
| `/contact-us` | `Contact Our Warwickshire Cleaning Team` | `Contact Our Warwickshire Cleaning Team` | ✓ |
| `/customer-login` | `Manage Your Cleaning Bookings` | `Manage Your Cleaning Bookings` | ✓ |
| `/gift-cards` | `House Cleaning Gift Cards` | `House Cleaning Gift Cards` | ✓ |
| `/work-with-us` | `Cleaning Jobs in Warwickshire & the West Midlands` | `Cleaning Jobs in Warwickshire & the West Midlands` | ✓ |

All four are keyword-bearing, not generic. Home + 6 Service + 10 Utility = **17**, plus the real
`/_not-found` template = **18** app routes.

**SC-2: SATISFIED.**

### SC-3 — BeforeAfterSlider renders a clearly-labelled placeholder

**Command:** count `data-bhc-photo-state="pending"` by splitting on the full attribute=value string
(the bare attribute name reads 2 on a correct page, inflated by the flight payload), then extract
the `<svg>` tags inside the figure and inspect `role`, `aria-label` and `alt`.

| Measure | Result |
|---------|--------|
| Routes carrying `data-bhc-photo-state="pending"` | **exactly 7** — `/` and all six `/services/*` |
| Occurrences per slider page | **1** each (bare attribute name reads 2 each, as documented) |
| Routes carrying the attribute at all outside those seven | **0** of the other 11 app pages |
| `<svg role="img">` panels inside each figure | **2** on every one of the seven |
| Panels with an empty or whitespace `aria-label` | **0** |
| `<svg>` tags carrying `alt=` anywhere on a slider page | **0** |

**`aria-label` text, identical on all seven pages:**

- `Before — our own before-and-after photography is in production`
- `After — our own before-and-after photography is in production`

Two labelled panels, no `alt` on any SVG, one `pending` marker per page. The marker is Phase 4's
machine-readable hand-off: a backfilled page emits a state that is not `pending`, delta 8 goes red
for that route, and the route must leave `PHOTO_PLACEHOLDER_ROUTES`.

**SC-3: SATISFIED.**

### SC-4 — FAQAccordion present, `FAQPage` schema absent

**Command:** bare-substring grep for `FAQPage` across every built page (a zero assertion, so the
bare form is the stricter one), plus a scoped `class="[^"]*bhc-faq__item` count and an extraction of
each `<details>` answer body.

| Measure | Result |
|---------|--------|
| `FAQPage` occurrences across all **19** built pages | **0** |
| `"@type":"FAQPage"` / `"Question"` / `"Answer"` tokens | **0** on every page |
| Pages rendering an FAQAccordion | 7 — `/` (6 items) and the six service pages (4–5 items each) |
| Open-on-arrival items per accordion | **1** (the first) |

**The AI-readability half holds unconditionally.** On `/services/deep-cleaning`, three of the four
FAQ items are CLOSED and their full answer text is nonetheless present in the served HTML:

| Item | `open` | Answer chars in HTML |
|------|--------|----------------------|
| 1 | true | 271 |
| 2 | false | **246** |
| 3 | false | **214** |
| 4 | false | **174** |

A closed `<details>` still ships its answer text to the document, so a crawler or an LLM reads the
whole FAQ with no JavaScript and no schema block. That is precisely the D13 trade: markup, not
`FAQPage`.

**SC-4: SATISFIED.**

---

## Before / after against the phase-start baseline

| Measure | Phase start | Phase end | Δ |
|---------|-------------|-----------|---|
| Design-system lock tests | 14 | **20** | +6 |
| Built-HTML lock tests | 21 | **31** | +10 |
| App routes prerendered | 1 | **18** | +17 |
| Manifest route keys (incl. `/_global-error`) | 2 | **19** | +17 |
| Component directories | 6 | **22** | +16 |
| Worst-page JS (gzip, modern) | 168.5 KB | **129.8 KB** — worst `/` | see note |
| Worst-page total | 191.3 KB | **298.4 KB** — worst `/services/deep-cleaning` | see note |
| Budget headroom | — | JS 26% of 500 KB · page 29% of 1024 KB | — |

**The two budget figures are NOT directly comparable across the phase, and saying so is the point.**
Both measurement bases changed inside Phase 2:

- **JS (WR-06, closed in 02-02).** The baseline 168.5 KB counted the `noModule` legacy polyfill.
  No modern browser fetches it, and counting it masked a real 38 KB regression. It is now reported
  separately at 38.7 KB and excluded from the gated number. 168.5 − 38.7 = 129.8 — the app's modern
  JS is unchanged from the one-page scaffold, which is the real finding: **the whole site chrome
  and seventeen new routes added zero client JavaScript.**
- **Page (WR-05, closed in 02-02).** The baseline excluded fonts. The page figure is now
  gzip JS + gzip HTML + gzip CSS + **raw woff2**. 129.8 + 13.2 + 4.7 + 150.7 = 298.4. The
  150.7 KB of woff2 is shared and cached across all 18 routes; it is not per-page growth.

---

## CI — the gate that actually decides

| Item | Value |
|------|-------|
| Branch | `worktree-phase-1-platform-foundation` |
| Branch head | `c68f520479167d4a7980c55be293b55510ca71b5` |
| `origin/…` head | identical — already pushed, nothing to push |
| Working tree | clean (`git status --short` empty) |
| **Run id** | **`31385409769`** |
| Run conclusion | `completed / success` |
| `locks` job | **✓ success** (job `93444605499`, 6 s) |
| `build` job | **✓ success** (job `93444605486`, 20 s) |

**Re-confirmed on the head this plan itself pushed.** The commit above was the head when the
criteria evidence was gathered; committing this report moved the branch, so CI was re-read on the
new head rather than left stale:

| Item | Value |
|------|-------|
| New branch head | `37ee4b8` — `docs(02-15): phase verification evidence…` |
| **Run id** | **`31394966695`** |
| Run conclusion | `completed / success` |
| `locks` job | **✓ success** (job `93475506450`, 7 s) |
| `build` job | **✓ success** (job `93475506565`, 25 s) |

Both required checks are green on both `c68f520` (the code head) and `37ee4b8` (the pushed head).

Ruleset `20595020`, re-read live rather than assumed: `enforcement: active`, required contexts
exactly `["locks", "build"]`, `strict_required_status_checks_policy: true`, `bypass_actors: []`
(**zero**). Both required checks are green on the exact commit that is the branch head.

**No merge, no push to `main`, no ruleset modification, no `git stash`.** (T-02-82, T-02-83.)

---

## Threat register — dispositions

| Threat ID | Disposition | Evidence |
|-----------|-------------|----------|
| T-02-82 | mitigated | No merge, no `main` push, no ruleset edit performed. Ruleset read-only via `gh api`. |
| T-02-83 | mitigated | Run id and both job conclusions read from `gh run view 31385409769`, not inferred from the local verify. |
| T-02-84 | mitigated | D-15 robots assertions are 2 of the 31 green `check:html` tests, covering all 18 app pages plus host-level `robots.txt`. |
| T-02-85 | mitigated | Debt-marker scan run and reported below — one hit, reported not fixed. |
| T-02-86 | mitigated | `git diff fe45b8a HEAD` over the three `package.json` files and `package-lock.json`: the **only** change in the whole phase is `design-system/package.json`'s `test` script (`node --test test/*.test.js` → `node test/run-locks.mjs`). Zero dependency lines added, `package-lock.json` untouched. |

Note on the comparison base: the plan's `<verification>` block says `git diff main`. `main` predates
the Next app entirely — a `main` diff shows the whole Phase 1 scaffold arriving and proves nothing
about Phase 2. The phase-start commit `fe45b8a` (`docs(01-05): update state and roadmap…`) is the
honest base, and it is what is reported above. 75 commits separate it from HEAD.

---

## Debt-marker scan

Scanned `design-system/src`, `web/app` and `web/content` for `coming soon`, `TBD`,
`not yet implemented`, `FIXME`, `XXX`, and `placeholder`-as-shipped-copy.

**One hit, reported rather than fixed:**

```
design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.prompt.md:92
  - Don't write "coming soon", "TBD" or "not yet implemented" into the copy. …
```

This is an instruction **forbidding** those phrases, and it is the twelfth scanner/comment
self-collision this phase — a comment matching the grep that polices it. It is in a `.prompt.md`
authoring doc, reaches no route, and no CI lock greps for these markers, so it is a report-only
finding. Phase 1's "zero occurrences" record holds for shipped copy.

**`placeholder` occurrences (4), all legitimate, none shipped copy:**

| File | Nature |
|------|--------|
| `design-system/src/components/Hero/Hero.html:42` | preview-file `alt` text, not rendered by any route |
| `web/app/page.jsx:125`, `web/app/services/[service]/page.jsx:159` | explanatory comments about SC-3 |
| `web/app/gift-cards/page.jsx:16`, `web/app/customer-login/page.jsx:19` | JSDoc naming the two Sam-gated URLs |

**Built-HTML confirmation:** grep for `coming soon`, `not yet implemented`, `FIXME`, `TBD`,
`Placeholder` across every `.html` under `web/.next/server/app` → **zero files matched.** No debt
marker reaches a served page.

---

## Known open items — RECORDED, deliberately not fixed here

Each of these is a real, named gap. None is a Phase 2 success-criterion failure, and none was
touched by this plan.

| # | Item | Owner / resolves in |
|---|------|---------------------|
| 1 | `BOOKING_PORTAL` and `GIFT_CARD_STORE` (`web/content/utility.js:102-103`) both point at the **live Webflow page for that same route**. No booking-portal or gift-card-provider URL exists anywhere in the repo. At cutover each becomes a link from a page to itself, and delta 6 only resolves internal `href="/…"` — it never inspects an absolute URL, so CI will stay green while both are wrong. | **Sam — before cutover** |
| 2 | `web/content/legal.js` carries commercial terms — data-retention periods, cancellation notice, late cancellations chargeable — that are conservative stubs. No solicitor has reviewed them. | **Sam + solicitor — before cutover** |
| 3 | `INTERLINK_LOCK_ACTIVE = false` (`check-html-locks.mjs:257`). Asserts the inverse and is self-restoring: the first page to render an InterlinkBlock turns the suite red and forces the flip. | Phase 3 |
| 4 | CR-05 — `AggregateRating` attaches to an orphaned entity rather than to `#business`. `RatingBadge.emitSchema` is OFF on all 18 templates precisely so this does not get 18× worse. | Phase 5 SC-1 |
| 5 | The `tel:` cap of **4** is exactly met on `/get-a-quote` and `/customer-login` (verified: max 4, those two routes). **No headroom for a fifth `tel:` anywhere on those pages.** | Phase 3+ must not add one |
| 6 | Phase 1's `01-HUMAN-UAT.md` still shows `pending: 2` — the visual check and the real-handset dial check. | Sam |
| 7 | Before/after photography still unavailable (all 199 Canva exports unusable). SC-3's placeholder is why this is not a phase gate. | Phase 4 |

---

## Deviations from Plan

None. Task 1 executed exactly as written; no Rule 1–4 deviation was triggered and no file was
modified by it.

Two clarifications recorded rather than treated as deviations:

1. The plan's `<verification>` block names `git diff main` for the dependency check. Reported
   against the phase-start commit `fe45b8a` instead, for the reason given above. The stricter
   Phase-2-scoped result is reported, not a weaker one.
2. The plan text says `gh run list --branch …`. Used `gh run list --commit c68f520…` instead, which
   binds the run to the exact head SHA rather than to whatever the branch last pushed — the
   stronger form of the same check, and the one T-02-83 actually wants.

---

## Task 2 — BLOCKING HUMAN CHECKPOINT (not self-approved)

Task 2 is `type="checkpoint:human-verify"` with `gate="blocking"`. This plan is
`autonomous: false`. The twelve numbered checks cover visual correctness at two widths and the
keyboard behaviour of the three zero-JavaScript interaction patterns — neither is settleable by
grep, which is exactly why `02-VALIDATION.md § Manual-Only Verifications` lists them.

**Status: awaiting the developer. No answer has been received. The phase is NOT verified.**

| Check | Group | Answer |
|-------|-------|--------|
| 1 — band order on `/` matches UI-SPEC §4, no two adjacent bands share a tone | A. Visual | ⬜ pending |
| 2 — nothing overlaps or is unstyled; no horizontal scrollbar at 375px | A. Visual | ⬜ pending |
| 3 — before/after shows two labelled BEFORE/AFTER panels, finished-looking | A. Visual | ⬜ pending |
| 4 — sticky call bar: bottom on mobile, two equal actions, doesn't cover the footer; absent at desktop | A. Visual | ⬜ pending |
| 5 — rating badge legible everywhere, never on the navy band | A. Visual | ⬜ pending |
| 6 — first Tab focuses "Skip to content"; Enter then Tab lands inside main | B. Keyboard | ⬜ pending |
| 7 — header nav: toggle works at 375px with Enter/Space; Services submenu opens from the keyboard at desktop | B. Keyboard | ⬜ pending |
| 8 — FAQ rows reachable, open/close with Enter or Space, first answer already open | B. Keyboard | ⬜ pending |
| 9 — reviews area is ABSENT on `/` (Phase 4 data); nothing empty or broken rendered | B. Keyboard | ⬜ pending |
| 10 — focus ring clearly visible on EVERY control, incl. navy CTA band and orange fills | B. Keyboard | ⬜ pending |
| 11 — JS disabled: mobile nav toggle still opens and closes | C. No-JS | ⬜ pending |
| 12 — JS disabled: FAQ still opens and closes | C. No-JS | ⬜ pending |

**Serve URL used:** _to be recorded when the developer confirms which they used._

Failures do NOT get fixed inside this plan — they become a numbered defect list for
`/gsd:plan-phase 2 --gaps`, which is what keeps the defect record auditable.

---

## Self-Check: PASSED

- `.planning/phases/02-component-library-completion-core-templates/02-15-SUMMARY.md` — FOUND
- `web/.next/prerender-manifest.json` — FOUND (19 route keys, all `compute: "static"`)
- CI run `31385409769` — FOUND via `gh run view`, `locks` + `build` both `success`
- Branch head `c68f520479167d4a7980c55be293b55510ca71b5` — FOUND, identical to `origin/`
- `npm run verify` — exit **0**, 20 + 31 tests, both budgets under threshold

Every figure in this report was re-derived from `design-system/src/`, `web/.next/` or the GitHub
API during this plan. No `02-*-SUMMARY.md` claim was used as evidence; the fourteen prior summaries
were read afterwards and reconcile with these numbers (20 design-system locks, 31 built-HTML locks,
22 components, `TEL_LINKS_PER_PAGE_MAX = 4`).
