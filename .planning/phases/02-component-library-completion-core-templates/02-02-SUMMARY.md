---
phase: 02-component-library-completion-core-templates
plan: 02
subsystem: ci-locks
tags: [ci, locks, prerendering, performance-budget, rsc, seo, accessibility]

# Dependency graph
requires:
  - phase: 01-platform-foundation-design-system-integration
    provides: the 21-assertion single-page built-HTML gate, the budget script, the CI ruleset on main
  - phase: 02-component-library-completion-core-templates
    plan: 01
    provides: Breadcrumbs aria-current fix, phone.js single-sourcing, the .bhc-section__intro token work
provides:
  - "web/scripts/check-html-locks.mjs — a prerender-manifest-driven harness that asserts EVERY prerendered route, 30 tests"
  - "PAGE_EXPECTATIONS — the 18-route <h1> / breadcrumb / JSON-LD expectation table, complete before the routes are"
  - "FRAMEWORK_ONLY — the measured _global-error exclusion, correcting UI-SPEC §9.5"
  - "EXPECTED_APP_ROUTES and INTERLINK_LOCK_ACTIVE — the two named constants later plans raise"
  - "NO_RATING_YET / NO_PRIMARY_CTA_YET — self-restoring wave-1 template-gap exemptions"
  - "A client directive anywhere in web/app, web/content or design-system/src now turns the build red"
  - "web/scripts/check-budget.mjs — worst-page transfer weight across all routes, WR-05 and WR-06 closed"
  - "web/app/get-a-quote/page.jsx — the second real route"
  - "web/content/ — the third client-directive scan root, created ahead of plan 02-06"
affects: [02-06, 02-08, 02-11, 02-13, 02-14, phase-03-town-and-combo-templates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One looping test per lock, failure message names the route — test count tracks invariants, not routes, so it survives Phase 3's ~336 pages"
    - "Every class-name COUNT uses the class=\"[^\"]*… form; the inlined RSC flight payload double-counts bare substrings"
    - "Self-restoring gates: a dormant lock asserts the INVERSE, so the condition that should re-enable it fails the build"
    - "Scanner markers assembled from fragments — a lock that names the string it bans matches its own source"

key-files:
  created:
    - web/app/get-a-quote/page.jsx
    - web/content/.gitkeep
  modified:
    - web/scripts/check-html-locks.mjs
    - web/scripts/check-budget.mjs
    - web/app/page.jsx
    - web/app/layout.jsx

key-decisions:
  - "RatingBadge.emitSchema is OFF on every Phase 2 template — 17 orphaned AggregateRating nodes would make the deferred CR-05 seventeen times worse for Phase 5, and the bare badge already satisfies Lock 3"
  - "SC-4d is gated, not deleted: INTERLINK_LOCK_ACTIVE = false asserts the INVERSE, so the first page that renders an InterlinkBlock fails the build and forces the flip"
  - "SC-4c and SC-4e could not be looped over APP_PAGES verbatim — /_not-found has no Hero and /get-a-quote's wave-1 stub has no CTA. Two self-restoring exemption sets rather than deleting the locks"
  - "The budget gates on the modern (noModule-excluded) JS figure and reports the legacy polyfill separately — WR-06 says the headline number is the early-warning signal and it was 23% wrong"
  - "CSS and font totals are counted in FULL for every route: a real visitor fetches only the subsets their text needs, so the reported figure errs high on purpose"

patterns-established:
  - "Pattern: the per-route expectation table is a LITERAL for hand-authored pages (it also checks the copy) and may be complete before the routes exist; expectationsFor() throws on an unknown route so a new route without an entry is a hard failure"
  - "Pattern: a directory that is a scan root gets a .gitkeep whose contents explain why deleting it weakens a lock"

requirements-completed: []

# Metrics
duration: 25min
completed: 2026-08-09
---

# Phase 02 Plan 02: Multi-Page Lock Harness Summary

**`check-html-locks.mjs` is now driven by `.next/prerender-manifest.json` and asserts every prerendered route rather than `index.html` alone — with the four green-today-red-tomorrow assertions corrected in the same change, the proven SC-4g client-boundary hole closed on both halves, and a budget that names its worst page and measures genuine transfer weight.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-08-09T19:00Z
- **Completed:** 2026-08-09T19:20Z
- **Tasks:** 3
- **Files modified:** 6 (2 created, 4 modified)
- **Lock count:** 21 single-page assertions → **30 looping assertions over 4 routes**

## Accomplishments

- **Delta 1 — the harness globs.** Routes come from `.next/prerender-manifest.json`, which is the already-expanded ROUTE list, so Phase 3's `generateStaticParams` pages are covered for free. Each route is asserted `compute === 'static'`, so a route that silently opts into dynamic rendering — and thereby vanishes from the manifest and from every assertion — fails loudly instead of disappearing.
- **The `_global-error` correction shipped WITH the globbing**, which is the trap that would otherwise have held `main` red. `FRAMEWORK_ONLY` excludes it from every landmark, NAP, robots, JSON-LD and stylesheet assertion, and from nothing else: it carries exactly one `<h1>` of its own, so delta 4 covers it with no exclusion at all. UI-SPEC §9.5 asserts the opposite on every clause; the file records the measured table and says so.
- **Deltas 2, 3, 4, 5, 6, 7, 11 and 12 landed.** The `tel:` lock is now "exactly one between `<footer>` and `</footer>`" plus a page cap of **4** (Header, StickyCallBar, NAPFooter, QuoteFormEntry — the full budget is quoted above the assertion so nobody re-tightens it to 3), digit-identity across every `tel:` on a page, and a text-content digit match that parses rendered text rather than the raw tag, so `aria-label="Call Beyond House Cleaning"` is not read as visible copy.
- **The proven SC-4g hole is closed on both halves.** Every `page_client-reference-manifest.js` under `.next/server/app` is walked (a `readdirSync` recursion, not a glob — dynamic-segment directories contain literal `[` and `]`), with a floor of `>= APP_PAGES.length` so a shape change fails rather than passing vacuously. The source scan grew from one root to **three** — `web/app`, `web/content`, `design-system/src` — all unconditional. `design-system/src` receives all sixteen new components this phase and was covered by neither half before.
- **All four unlisted breakages corrected in the same commit:** SC-4b is route-conditional with a negative half (so it is non-vacuous while breadcrumbs are rare), SC-4d is gated and self-restoring, SC-4f is expectation-driven and counted with the tag-form regex, and the D-15 robots-meta assertion is scoped to `APP_PAGES`.
- **SC-1b gained the Pitfall-7 guard:** exactly one `.css` under `.next/static` and exactly one `<link rel="stylesheet">` per page, which catches the well-meant route-level CSS import before sixteen components' rules split across two chunks.
- **The budget measures every route and names the worst.** Page weight is now gzip JS + gzip HTML + gzip CSS + raw woff2 (WR-05), the `noModule` polyfill is excluded from the headline and reported on its own line (WR-06), and the refuse-to-report instinct survives — verified by moving a chunk aside, which produced a refusal and exit 1 rather than a cheerful 0.0 KB.
- **The app is a two-route, contract-compliant site** so every new assertion is green on landing rather than red for five waves, and the multi-page machinery is exercised by more than one page.

## Task Commits

1. **Task 1: two contract-compliant routes, `<main>` landmark, `web/content` scan root** — `f631476` (feat)
2. **Task 2: rewrite `check-html-locks.mjs` as a manifest-driven multi-page harness** — `8ba6271` (feat)
3. **Task 3: worst-page budget, WR-05 and WR-06 closed** — `30942ee` (feat)

## Files Created/Modified

- `web/scripts/check-html-locks.mjs` — rewritten. 30 looping tests. Kept verbatim: the no-third-party-imports header, `ROOT`/`digits`/`read`/`walk`, both postcode matchers with their "change both or neither" comment, `STREET_LINE`, `externalScriptTags`, the assembled retired-number list, and both regression guards. The header now carries three structural rules for future editors: one looping test per lock, the flight-payload counting trap, and "a scanner must not match its own source".
- `web/scripts/check-budget.mjs` — rewritten as a per-route loop reporting maxima with route names. `unresolved` now also refuses on "no `<script src>` tags on this route".
- `web/app/page.jsx` — trimmed to UI-SPEC §5's real Home deck. `Breadcrumbs` and `InterlinkBlock` removed, the schema-emitting `RatingBadge` prop dropped, one resolving CTA, real title and description (54 / 134 chars, both inside Lock 8's caps).
- `web/app/get-a-quote/page.jsx` — **created.** Wave-1 stub: `Hero align="centered"` with the §5 `<h1>`, the rating prop and no actions. Its header names plan 02-08 as its replacement and names the two `PAGE_EXPECTATIONS` fields 02-08 must flip.
- `web/app/layout.jsx` — `<main id="main" tabIndex={-1}>` wraps `{children}`. `SkipLink`/`Header`/`Footer`/`StickyCallBar` deliberately absent with a comment saying plan 02-13 composes them. CSS imports, `areaServed`/`hours` and `robots` untouched.
- `web/content/.gitkeep` — **created, load-bearing.** Its contents explain that the directory is an unconditional scan root from wave 1 and must not be deleted even if emptied.

## Decisions Made

- **`RatingBadge.emitSchema` is off on every Phase 2 template.** Recorded at the SC-4f assertion site, where it bites, not only in this summary. Steady state is 1 JSON-LD block on Home and 2 elsewhere — never 3, which is what the lock demanded before.
- **SC-4d is gated rather than deleted, and the gate is self-restoring.** A deleted lock is never restored; a dormant one is invisible debt; one that asserts the inverse while dormant is neither.
- **The same self-restoring shape was applied to the two SC-4c / SC-4e exemptions** rather than deleting those locks — see deviation 1.
- **The budget gates on the modern JS figure.** The gate is 38.7 KB looser than before in exchange for a headline number that is actually the thing it claims to measure. WR-06's argument is that the printed number is the early-warning signal; a gate that is stricter than reality by masking a real regression is the wrong trade.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `SC-4c` and `SC-4e` cannot loop over `APP_PAGES` verbatim in wave 1**
- **Found during:** Task 2
- **Issue:** The plan says to "carry forward unchanged but looping over `APP_PAGES`" a list that includes `SC-4c` (RatingBadge renders server-side) and `SC-4e` (`bhc-btn--primary` present). Measured: `_not-found.html` is still Next's built-in 404 document inside our RootLayout — no Hero, therefore no RatingBadge and no CTA — and task 1's `/get-a-quote` stub is specified with "no actions", so it has a rating but no primary button. Both assertions fail on landing as written. This is a plan defect, not a code one: the plan's own task 1 spec and its task 2 spec contradict each other.
- **Fix:** Two named exemption sets, `NO_RATING_YET = {'/_not-found'}` and `NO_PRIMARY_CTA_YET = {'/_not-found', '/get-a-quote'}`, each asserted in the **inverse** exactly like `INTERLINK_LOCK_ACTIVE` — the exempt route must NOT have the element, so the moment plan 02-08 gives `/get-a-quote` a CTA or plan 02-13 lands `app/not-found.jsx`, the build fails and forces the set to be emptied. Each test also asserts at least one non-exempt page exists, so neither lock can become vacuous by growing its exemption set.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** Both tests green; `npm run check:html` 30/30.
- **Committed in:** `8ba6271`

**2. [Rule 1 - Bug] Three comments matched the acceptance greps that police them**
- **Found during:** Tasks 1, 2 and 3 — the same class of defect plan 02-01 hit three times, now hit three more.
- **Issue:** (a) `web/app/page.jsx`'s explanation of *why the schema prop was removed* named the prop, so `grep -c "emitSchema" web/app/page.jsx` returned 1 against a required 0. (b) `check-html-locks.mjs`'s comment explaining why the *other* route manifest must not be used named that manifest twice, against a required 0; a third comment quoted the retired town constant's declaration. (c) `check-budget.mjs`'s WR-05 comment quoted the old page-figure expression verbatim, against a required 0.
- **Fix:** Each comment now describes the banned string without reproducing it, and — in the two lock scripts — says so explicitly, so the next editor does not "helpfully" restore the literal. `check-html-locks.mjs`'s header now carries this as structural rule 3.
- **Files modified:** `web/app/page.jsx`, `web/scripts/check-html-locks.mjs`, `web/scripts/check-budget.mjs`
- **Verification:** All four greps return 0.
- **Committed in:** `f631476`, `8ba6271`, `30942ee`

**3. [Rule 1 - Bug] A literal U+00A0 was introduced into two lines that must not carry one**
- **Found during:** Task 2
- **Issue:** While transcribing the postcode regression guard, the source's deliberate `\u00a0` ESCAPE became a raw non-breaking space character, and a second one landed in `decodeEntities`. The guard's own comment says "written as an escape on purpose"; an invisible U+00A0 in source is precisely what that note exists to prevent, and it would have survived every test silently.
- **Fix:** Both restored to `\u00a0` escapes, and the file was scanned to prove no raw U+00A0 remains anywhere.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** Codepoint scan returns zero occurrences of 160; the guard still matches all eight postcode forms.
- **Committed in:** `8ba6271`

**4. [Rule 2 - Missing Critical] `expectationsFor` needed a `hasOwnProperty` guard, and the table needed a shape check**
- **Found during:** Task 2
- **Issue:** `route in PAGE_EXPECTATIONS` is truthy for `constructor`, `toString` and every other `Object.prototype` key, so a pathological route name would silently receive a function as its expectation instead of throwing.
- **Fix:** `Object.prototype.hasOwnProperty.call`, plus a test that every app route's expectation has the three fields at the right types AND that `expectationsFor` throws for an unknown route — the guard that makes "a new route without an entry is a hard failure" true rather than asserted.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** Test 2 green; proof A below shows the throw firing on a real scratch route.
- **Committed in:** `8ba6271`

**5. [Rule 2 - Missing Critical] The font and CSS totals are read from build output, not from the package**
- **Found during:** Task 3
- **Issue:** The plan says to sum "the `.woff2` files the package ships". Those are re-emitted by the build into `.next/static/media/` with content hashes, and it is the emitted copies that are served. Reading the package directory would measure files that are not necessarily what ships.
- **Fix:** Both CSS and font totals walk `.next/static`. Same eight faces, same 150.7 KB, but now downstream of the build like every other figure in the script.
- **Files modified:** `web/scripts/check-budget.mjs`
- **Verification:** 8 woff2 files, 150.7 KB; 1 CSS file, 2.9 KB — matching 02-RESEARCH's measured figures.
- **Committed in:** `30942ee`

---

**Total deviations:** 5 auto-fixed (2 bugs, 2 missing-critical, 1 blocking)
**Impact on plan:** No scope creep and no architectural change. Deviation 1 is the only one that changes what is asserted, and it changes it in the direction the plan itself argues for (self-restoring rather than deleted). Deviation 2 is now the *sixth* occurrence of one defect class across two plans — worth treating as a standing rule for every remaining wave, since deltas 9, 13 and 14 all add scanners of the same shape.

## Negative Proofs

All four were run against a real build, produced a red run, and were reverted with a clean rebuild afterwards. `git status` is clean of every probe.

| Proof | Injection | Result | Failing assertion(s) |
|---|---|---|---|
| **A** | scratch route `web/app/zz-probe/page.jsx` carrying the client directive | exit 1, 9 of 30 failed | `SC-4g: no client-reference manifest declares a first-party client module` **and** `SC-4g: no source file in web/app, web/content or design-system/src declares a client directive`, plus `delta 1: every app route declares an expectation` (the new route had no `PAGE_EXPECTATIONS` entry — the designed hard failure) and the five per-page expectation locks |
| **A2** | the directive in `design-system/src/zz-probe.js` (the root that was covered by NEITHER half before this plan) | exit 1, **exactly 1** of 30 failed | `SC-4g: no source file in web/app, web/content or design-system/src declares a client directive` — `client directive in …/design-system/src/zz-probe.js` |
| **B** | `<a href="/nope">x</a>` added to `web/app/page.jsx` | exit 1, 1 of 30 failed | `delta 6: every internal link resolves to a prerendered route` — `internal link(s) pointing at a URL that is not prerendered: / -> /nope` |
| **C** | the schema-emitting prop restored on `/`'s `RatingBadge` | exit 1, 1 of 30 failed | `SC-4f: each app page emits exactly the JSON-LD blocks its expectation names` — `/: expected 1 JSON-LD block(s) on disk, found 2` |

Proof C is the one that matters most for SC-4f's replacement not being vacuous, and it doubles as proof of the tag-form counting: the bare marker would have reported 4 rather than 2.

A fifth, unplanned probe covered the budget: moving one JS chunk out of `.next/static` produced `BUDGET MEASUREMENT INCOMPLETE — refusing to report a verdict` and exit 1 on all four routes, then a clean 0 once restored.

## Issues Encountered

- **The plan's own tasks 1 and 2 disagreed** about whether `/get-a-quote` has a CTA — see deviation 1. Later plans that "carry forward" an assertion across a scope change should state the wave-1 value of that assertion, not just its steady state.
- **Nothing else.** No package installed, no architectural decision needed, no authentication gate.

## User Setup Required

None. This plan installed zero packages, consistent with T-02-15 and with 02-RESEARCH's Package Legitimacy Audit. `git diff` shows no change to any `package.json` dependency list or to `package-lock.json`.

## Hand-offs to Later Plans

Named in code, not only here:

| Constant / value | File | Plan that changes it |
|---|---|---|
| `EXPECTED_APP_ROUTES` (3 → 18) | `check-html-locks.mjs` | 02-13 |
| `'/get-a-quote'` expectation `hasBreadcrumbs`/`ldJsonBlocks` (`false`/`1` → `true`/`2`) | `check-html-locks.mjs` | 02-08 task 3 |
| `'/_not-found'` expectation `h1` (`'404'` → `We Couldn't Find That Page`) | `check-html-locks.mjs` | 02-13 task 2 |
| `NO_RATING_YET` (empty it) | `check-html-locks.mjs` | 02-13 |
| `NO_PRIMARY_CTA_YET` (drop `/get-a-quote`, then `/_not-found`) | `check-html-locks.mjs` | 02-08, then 02-13 |
| `INTERLINK_LOCK_ACTIVE` (`false` → `true`) | `check-html-locks.mjs` | Phase 3 |
| delta 5's `<header>` and `<nav aria-label="Primary">` clauses | `check-html-locks.mjs` | 02-13, with the layout composition |
| `web/content/.gitkeep` may be joined by real files, never removed | `web/content/` | 02-06, wave 3 |

Every one of the first six is **self-restoring**: the plan that should change it will find the build red until it does.

## Threat Flags

None. All eight `mitigate` dispositions in this plan's register are implemented — T-02-08 (walk every client-reference manifest), T-02-09 (three source-scan roots), T-02-10 (postcode and street matchers loop every app page, both regression guards retained), T-02-11 (robots re-scoped to `APP_PAGES`), T-02-12 (external-script detector per page), T-02-13 (`compute === 'static'` plus the `EXPECTED_APP_ROUTES` floor), T-02-14 (every class-name count uses the `class="` form, with an acceptance check rejecting a bare `bhc-` count regex anywhere in the file) and T-02-15 (zero packages, `node:` built-ins only in both scripts). No new network endpoint, auth path, file access pattern or schema surface was introduced; the new route emits no JSON-LD of its own.

## Verification

- **`npm run verify` — exit 0.**
- `npm run test:locks` — 14 tests, 14 pass (unchanged; `MIN_TESTS` untouched until plan 02-03).
- `npm run build` — exit 0, 4 prerendered routes: `/`, `/get-a-quote`, `/_not-found`, `/_global-error`.
- `npm run check:html` — **30 tests, 30 pass** (was 21).
- `npm run check:budget` — JS 129.8 KB / 500 KB gzip (worst: `/`), page 286.8 KB / 1024 KB (worst: `/`), CSS 2.9 KB, fonts 150.7 KB, `noModule` 38.7 KB excluded and reported.
- Every acceptance grep in tasks 2 and 3: `prerender-manifest.json` ≥ 1 in both scripts; the other route manifest 0; the retired town constant 0; `FRAMEWORK_ONLY` present with `'/_global-error'`; `EXPECTED_APP_ROUTES` and `INTERLINK_LOCK_ACTIVE` present; `at most 3` 0; `PAGE_EXPECTATIONS` **18** route keys with `_global-error` absent; no bare `bhc-` count regex; both files `zero-dep`; `Buffer.byteLength(html)` 0; `gzipSync` 4; `unresolved` 7.
- `grep -c "emitSchema" web/app/page.jsx` 0; `grep -rc "447861936533" web/app` 0 files; `grep -c "NAPFooter.jsx:33" web/app/layout.jsx` 0; `grep -c "areaServed" web/app/layout.jsx` 1.
- `git diff` over this plan's three commits touches no `package.json` and no lockfile.

## Next Phase Readiness

Waves 2 through 7 start from a green gate, and from a harness that will tell them precisely which route broke rather than that "the page" broke. Three things later plans must internalise:

1. **Add a route, add a `PAGE_EXPECTATIONS` entry.** `expectationsFor` throws otherwise — proven by proof A, where the scratch route failed the expectation test before it failed anything else.
2. **Never write a class-name count as a bare substring.** The RSC flight payload is inlined; use the `class="[^"]*…` form. An acceptance check in this plan rejects the bare form anywhere in the file, and it should be re-run whenever the harness is edited.
3. **`design-system/src` is now scanned for the client directive.** The sixteen components arriving in waves 2-4 land inside a scan root that did not exist before this plan, so `FAQAccordion` and `BeforeAfterSlider` must reach their interactivity through `<details>` and CSS as §8 specifies — a directive there is now a red build, not a silent client bundle.

## Self-Check: PASSED

All six claimed files exist on disk (`web/app/get-a-quote/page.jsx` and `web/content/.gitkeep` created; the other four modified in place). All three claimed commits — `f631476`, `8ba6271`, `30942ee` — are present in `git log`. `npm run verify` re-run at the end of execution exits 0. No probe file from any of the five negative proofs survives: `web/app/zz-probe/` and `design-system/src/zz-probe.js` are absent and `git status` is clean.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
