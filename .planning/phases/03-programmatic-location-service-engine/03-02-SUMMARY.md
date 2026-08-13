---
phase: 03-programmatic-location-service-engine
plan: 02
subsystem: ui
tags: [design-system, package-exports, esm-subpath, css-tokens, geo, node-test]

# Dependency graph
requires:
  - phase: 02-component-library-completion-core-templates
    provides: "geo.js (distanceMiles / nearestTowns / buildInterlinks), the ReviewRail component and its four-file shape, styles.css with the focus-override banner as its last section, the 20-test design-system lock suite and its MIN_TESTS floor"
provides:
  - "buildInterlinks accepts an optional metaFor(destination, miles) formatter for the nearby block's secondary line, defaulting to today's distance string"
  - "A ./geo package subpath — the geometry is importable by a bare node process with no bundler and no JSX loader, which is what makes the phase's build-free link checks possible"
  - "An honest sitewide default review-rail heading — What our customers say — in all four ReviewRail files"
  - ".bhc-jump-links, .bhc-town-group (+ __back) and .bhc-interlink + .bhc-interlink, token-only, above the focus-override banner"
  - "A 21st design-system lock: backwards compatibility of buildInterlinks, the (destination, miles) signature, unchanged hrefs, and the ./geo exports entry"
affects: [03-16-towns-data-module, 03-17-combo-composition, 03-18-locations-index, 03-19-interlink-composition, 03-21-combo-template, phase-04-town-filtered-reviews]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "An optional formatter parameter with a working default: the caller changes one line of copy and nothing structural, and later phases inherit unchanged behaviour"
    - "Pure-logic modules get their own exports subpath rather than being reached through a barrel that touches .jsx — the barrel is for the app, the subpath is for bare node"
    - "A lock that asserts an exports-map entry's target extension, because a wrong target still resolves inside the bundler and fails only outside it"

key-files:
  created: []
  modified:
    - design-system/package.json
    - design-system/src/components/InterlinkBlock/geo.js
    - design-system/src/components/InterlinkBlock/InterlinkBlock.d.ts
    - design-system/src/components/ReviewRail/ReviewRail.jsx
    - design-system/src/components/ReviewRail/ReviewRail.d.ts
    - design-system/src/components/ReviewRail/ReviewRail.html
    - design-system/src/components/ReviewRail/ReviewRail.prompt.md
    - design-system/styles.css
    - design-system/test/locks.test.js
    - design-system/test/run-locks.mjs

key-decisions:
  - "metaFor takes (destination, miles) rather than the whole link object: the caller needs the destination town to name its county, and passing the miles keeps the geography available to a caller that wants it without the module deciding to publish it"
  - "metaFor may return undefined, which suppresses the secondary line entirely — InterlinkBlock renders the span only for a truthy meta, so this is a supported state rather than an empty span"
  - "The ./geo subpath points at the .js file and a lock asserts that target explicitly — pointing it at InterlinkBlock.jsx would still resolve through the bundler and break only in bare node, which is the quiet failure the phase's build-free checks depend on not happening"
  - "The exports-map assertion was added to the new metaFor test rather than as a 22nd test, keeping the test count tracking invariants rather than files"
  - "The ReviewRail town prop is kept, unused: no Phase 3 template passes it (§13-J), and deleting it would turn Phase 4's data question into a breaking API change"
  - ".bhc-jump-links applies its flex row both to itself and to a nested <ul>, so the template may put the class on the <nav> (as §9.3 authors it) or on the list (as §7.5 describes it) without a second class"
  - "min-height: 44px is declared on both new link rules rather than left to padding — --bhc-text-sm's mobile end computes to 42.9px with a --bhc-space-2 pad"

patterns-established:
  - "Mutation-prove a new lock in both directions before trusting it: ignoring metaFor failed exactly 1 of 21, and repointing the ./geo entry at the .jsx failed exactly the same test"
  - "A package claim about running with no node_modules is proved by copying the package to a scratch directory and running it there, not by reasoning about its imports"

requirements-completed: []

# Metrics
duration: 41min
completed: 2026-08-13
---

# Phase 3 Plan 02: Package-Level Changes for the Location Engine Summary

**`buildInterlinks` now takes an optional `metaFor(destination, miles)` formatter so a spoke page can name a county instead of advertising a distance, the geometry is published as a `./geo` subpath a bare `node` process can import, the review rail's default heading no longer claims a county the data cannot support, and three token-only classes exist for the locations index and the stacked interlink pair — 21 design-system locks and 39 built-HTML locks green, every budget figure unchanged.**

## Performance

- **Duration:** 41 min
- **Started:** 2026-08-13T14:23:00Z
- **Completed:** 2026-08-13T15:04:00Z
- **Tasks:** 3 (one commit each)
- **Files modified:** 10

## Accomplishments

- **`metaFor` landed as a pure addition.** No existing caller changes behaviour: the default parameter is the exact string the module has always produced, and the new lock's first assertion is that fact rather than an assumption. The `services` block's tagline meta is untouched, and every `href` is byte-identical with and without a formatter — the geography stays in the ordering, which is where Success Criterion 4 needs it.
- **The `./geo` subpath is the unlock for ~40 downstream acceptance criteria.** The barrel re-exports the three geo functions through `InterlinkBlock.jsx`, so importing them from `.` drags a JSX specifier into a process that has no loader for it — the wall five Phase 2 plans hit. One exports line, zero dependencies, no build step, and `files: ["src"]` already covered the file. Proved by resolving the bare specifier (`function function function`, exit 0) and, separately, by importing the file from `/tmp` with no `node_modules` in scope at all.
- **The default review-rail heading is now true on all 426 routes it will eventually reach.** `What our customers say`, in all four files, with the preview's derived heading id following it. No lock had asserted the old string — verified rather than assumed, both ways.
- **Three CSS classes, token-only, no new component.** A 23rd component directory would have cost four files, two `.design-sync` registrations and a raised delta-9 floor to deliver one gap and one border.
- **`npm run verify` exits 0:** 21 design-system locks + 39 built-HTML locks, JS 129.8 KB / 500 KB, CSS 4.8 KB in one shared file, worst page 299.5 KB / 1024 KB, 19 routes. Identical to the 03-01 baseline on every budget figure.
- **Both new mechanisms mutation-proved** (below). Neither reads green for the wrong reason.

## Task Commits

Each task was committed atomically:

1. **Task 1: geo.js gains an optional metaFor callback (+ the ./geo subpath)** — `3ec4bf0` (feat)
2. **Task 2: the default review-rail heading names no county** — `162a7c1` (fix)
3. **Task 3: three token-only CSS classes** — `373c1fb` (feat)

**Plan metadata:** see the docs commit following this summary.

## Files Created/Modified

| File | Change |
|---|---|
| `design-system/package.json` | one exports entry: `"./geo": "./src/components/InterlinkBlock/geo.js"` |
| `design-system/src/components/InterlinkBlock/geo.js` | `metaFor` parameter with a default, used for the nearby block's `meta`; header records why the subpath exists; JSDoc records why the distance is not published |
| `design-system/src/components/InterlinkBlock/InterlinkBlock.d.ts` | `metaFor?: (destination: Town, miles: number) => string \| undefined` on `buildInterlinks`'s input |
| `design-system/src/components/ReviewRail/ReviewRail.jsx` | `DEFAULT_HEADING` → `What our customers say`; header records the 02-16 constraint and why `town` stays |
| `design-system/src/components/ReviewRail/ReviewRail.d.ts` | documented default updated, with the reason |
| `design-system/src/components/ReviewRail/ReviewRail.html` | heading text plus the derived id in both `aria-labelledby` and `id` |
| `design-system/src/components/ReviewRail/ReviewRail.prompt.md` | new section on the county-free default; the `town` section corrected (no template passes it); two new `Don't` entries |
| `design-system/styles.css` | three declaration blocks appended immediately above the focus-override banner (68 lines incl. comments) |
| `design-system/test/locks.test.js` | one new test (76 lines) beside the two existing geo tests |
| `design-system/test/run-locks.mjs` | `MIN_TESTS` 20 → 21, with the reason recorded beside it |

### The three CSS blocks

```
.bhc-jump-links, .bhc-jump-links :where(ul)   flex, wrap, gap --bhc-space-2
.bhc-jump-links :where(ul)                    list reset
.bhc-jump-links :where(a)                     inline-flex, centred, min-height 44px,
                                              --bhc-text-sm at --bhc-weight-semibold
.bhc-town-group + .bhc-town-group             margin-top --bhc-space-12
.bhc-town-group__back                         inline-flex, centred, min-height 44px,
                                              margin-top --bhc-space-4, --bhc-text-sm,
                                              colour --bhc-action-hover
.bhc-interlink + .bhc-interlink               border-top 1px solid --bhc-line,
                                              padding-top --bhc-space-12
```

Descendant rules go through `:where()` so specificity stays at zero and a `bhc-` component dropped inside still wins — the `.bhc-prose` convention. Every colour, spacing and size value is a `var(--bhc-*)` reference; the only bare literals are `44px` (twice) and `1px`, plus the `margin: 0; padding: 0` of the list reset, which matches `.bhc-breadcrumbs__list` and `.bhc-footer__links`.

## Verification

### Acceptance criteria

| Check | Required | Actual |
|---|---|---|
| `node design-system/test/run-locks.mjs` | 21+ passing, exit 0 | **`lock suite: 21 passing across 1 file(s) (minimum 21)`** |
| pre-existing geo tests, by name in runner output | both pass, unmodified | `ok 16 - nearestTowns is ordered by real distance and excludes self`, `ok 17 - the audited pin distances reproduce` |
| `grep -c 'metaFor' geo.js` | ≥ 3 | 3 (JSDoc, parameter+default, call site) |
| `grep -c 'metaFor' InterlinkBlock.d.ts` | ≥ 1 | 1 |
| backwards compatibility proved, not assumed | new test's first assertion | `assert.match(before.nearby.links[0].meta, /^\d+\.\d+ miles away$/)` |
| bare-node subpath import | `function function function`, exit 0 | **exactly that, exit 0** |
| `grep -c '"dependencies"' package.json` | unchanged, none declared | 0 (and `devDependencies` 0, no `build` script, no `dist/`) |
| `grep -rc 'Warwickshire customers say' ReviewRail/` | 0 for every file | 0, 0, 0, 0 |
| `grep -rl 'What our customers say' ReviewRail/` | all four files | `.jsx`, `.prompt.md`, `.d.ts`, `.html` |
| `node --test check-html-locks.mjs` | exit 0, zero failures | **39 pass, 0 fail** |
| `grep -c 'What our customers say'` in built `/` and a service page | ≥ 1 each | 1 and 1 (`services/deep-cleaning.html`) |
| `grep -c 'id="reviews"'` in built `/` | 1 | 1 — delta 15's `#reviews` anchor still resolves |
| `grep -c 'bhc-jump-links' \| 'bhc-town-group' \| adjacent interlink selector | ≥ 1 each | 5, 2, 1 |
| focus overrides still last | last `focus-visible` line > every new-class line | 1399 > 1351 |
| `grep -c '!important' styles.css` | 0 | **0** |
| `npm run verify` | exit 0 | **exit 0** |
| `git diff --stat` | only the declared files | exactly the 10 files in `files_modified` |

Extra confirmations beyond the criteria: the classes survive into the single built stylesheet (`bhc-jump-links` and `bhc-town-group` each once, `bhc-interlink+.bhc-interlink` present after minification, `min-height:44px` eight times across the file), and CSS is still one shared 4.8 KB gzip chunk — SC-1b.

### Mutation proof 1 — `metaFor` is actually used

Reverting the call site to the hard-coded distance string, leaving the parameter in place:

```
not ok 18 - buildInterlinks takes an optional per-link meta formatter and is unchanged without one
# pass 20
# fail 1
```

Exactly one test failed, and it is the new one. Restored: 21 pass, 0 fail.

### Mutation proof 2 — the exports entry's target

Repointing `"./geo"` at `InterlinkBlock.jsx` — the change that would still work in the bundler and break every build-free check in the phase:

```
not ok 18 - buildInterlinks takes an optional per-link meta formatter and is unchanged without one
# pass 20
# fail 1
```

Restored: 21 pass, 0 fail. This is why the assertion checks the target string and its extension rather than merely that the key exists.

### D-06 / D-12 re-proved from a clean copy

`design-system/` copied to a scratch directory with no `node_modules` anywhere above it, and the suite run there: `lock suite: 21 passing`. Zero `dependencies`, zero `devDependencies`, no `build` script, no `dist/`. Scratch copy deleted.

## Decisions Made

- **`metaFor(destination, miles)`, not `metaFor(link)`.** The caller needs the destination town to name its county; passing the miles as well keeps the geography available to a caller who genuinely wants a distance, without the module deciding to publish one.
- **Returning `undefined` is supported and documented.** `InterlinkBlock.jsx:54` renders the span only for a truthy `meta`, so this suppresses the second line rather than emitting an empty element. Asserted in the new test.
- **The exports-map assertion checks the target, not just the key.** A `.jsx` target resolves fine inside Next and fails only in bare `node` — a failure that would surface in plans 03-16 and 03-17 as a confusing loader error rather than as a red lock here.
- **The assertion went into the new test, not a 22nd test.** `locks.test.js`'s own rule is that the test count tracks invariants; the subpath and the formatter are one invariant — "this module is usable, unchanged, from outside a bundler".
- **`ReviewRail.town` stays, unused.** §13-J says no Phase 3 template passes it and Phase 4 owns town-filtered reviews. Deleting the prop now would make that a breaking API change instead of a data change, and the `.prompt.md` now says so from both sides.
- **`.bhc-jump-links` covers the class on either element.** §7.5 describes it as a wrapped `<ul>` and §9.3 authors it on the `<nav>` wrapping one. The block applies the flex row to itself and to a nested list, so the template cannot get this wrong and no fourth class is needed.
- **`min-height: 44px` declared twice, deliberately.** `--bhc-text-sm` is a clamp whose mobile end is 14px; with a `--bhc-space-2` pad that computes to 42.9px, which looks like it clears the 44 × 44 target and does not.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] The `./geo` exports entry had nothing asserting it**

- **Found during:** Task 1
- **Issue:** The plan adds the subpath as one package line with no lock over it. Removing the key fails loudly (a bundler resolution error), but **changing its target to a `.jsx` does not** — Next resolves and transpiles it happily, so the app stays green while every build-free `node` check in plans 03-16, 03-17 and their acceptance criteria breaks with an `ERR_UNKNOWN_FILE_EXTENSION` that names neither this file nor this decision. The whole stated purpose of the entry is bare-`node` importability, and nothing in the repo held it to that.
- **Fix:** Four assertions appended to the new test: the entry equals the exact `.js` path, its extension is `.js` and not `.jsx`, and the target exists on disk. Added to the existing test rather than as a new one, per `locks.test.js`'s rule that the count tracks invariants — so `MIN_TESTS` is still 21.
- **Files modified:** `design-system/test/locks.test.js`
- **Verification:** Mutation proof 2 above — repointing the entry at the `.jsx` fails exactly this test; restoring it returns 21 pass, 0 fail.
- **Committed in:** `3ec4bf0` (Task 1 commit)

**2. [Rule 1 - Bug] `ReviewRail.prompt.md` documented behaviour this plan makes false**

- **Found during:** Task 2
- **Issue:** The `town` section ended *"Phase 3's town and combo templates are where this starts being passed."* §13-J settles the opposite — no Phase 3 template passes `town`, because there is no town on any review to filter by and the rail would then attribute reviews to a place the data does not record. Left as written, the one document a future component author reads would instruct them to do the thing this plan exists to prevent.
- **Fix:** Rewrote that paragraph to state that no template passes the prop, why (§13-J), and why the prop is nevertheless kept rather than deleted. Added two `Don't` entries: no county or town in the default heading, and no passing `town` to make a rail look local.
- **Files modified:** `design-system/src/components/ReviewRail/ReviewRail.prompt.md`
- **Verification:** 21 design-system locks and 39 built-HTML locks green; the file is one of the four the acceptance grep requires to name the new heading.
- **Committed in:** `162a7c1` (Task 2 commit)

**3. [Rule 1 - Bug] The state SDK falsely marked the project and a phase complete, again**

- **Found during:** the state-update step
- **Issue:** `state.record-metric` — the one write verb chosen precisely because it should only append a table row — also set `status: completed`, `completed_phases: 2` and `percent: 33` in STATE.md's frontmatter. All three are false: the milestone is mid-Phase-3, Phase 2 is 14/15 with 02-15's blocking checkpoint unanswered (ROADMAP.md's own row still reads *In Progress*), and 23 of 44 plans is 52%, not 33%. It also wrote the row as `3 tasks tasks | 10 files files`, doubling the words in its own template. 03-01 recorded the same class of damage from `requirements.mark-complete`, `state.update-progress`, `state.advance-plan` and `state.record-session`; this is the fifth verb to do it.
- **Fix:** Repaired all four frontmatter fields by hand (`status: executing`, `completed_phases: 1`, `completed_plans: 23`, `percent: 52`) and rewrote the metric row. Every other STATE.md field — Current Position, the progress bar, the decisions, Session Continuity — was then edited by hand rather than through the SDK, so no multi-line field was orphaned this time (03-01's `advance-plan` / `record-session` failure). `roadmap.update-plan-progress 03` was run and its output verified truthful: 2/24, *In Progress*, `complete: false`.
- **Files modified:** `.planning/STATE.md` (`.planning/ROADMAP.md` written by the SDK and verified correct)
- **Verification:** `git diff .planning/STATE.md` read line by line; frontmatter agrees with the progress bar and with ROADMAP.md's Phase 2 and Phase 3 rows; `.planning/REQUIREMENTS.md` has no diff at all, since no requirement is deliverable by this plan.
- **Committed in:** the docs commit for this plan

**Note for the phase verifier:** this plan's frontmatter claims `REQ-hub-and-spoke-architecture` and `REQ-programmatic-page-scale`. Both are aspirational for the phase and **not** deliverable by a package change that adds no route — `requirements-completed` in this summary is deliberately empty and REQUIREMENTS.md was not touched. The plan that lands batch 1's routes owns them.

---

**Total deviations:** 3 auto-fixed (1 missing critical, 2 bugs)
**Impact on plan:** Deviations 1 and 2 are inside this plan's own files and its own stated purpose — 1 closes a silent-failure hole in the single mechanism ~40 downstream criteria rest on; 2 removes an instruction that contradicts the change being made three files away. Deviation 3 is planning bookkeeping and touched no code. No route, page, template or content module was touched, and no package was installed.

## Issues Encountered

- **The plan's `<verification>` says "the nine declared files"; its own `files_modified` list holds ten.** The diff touches exactly those ten and nothing else. Recorded because a verifier reading the prose count would flag a correct diff.
- **No lock had asserted the old rail heading** — the plan asked for that claim to be verified rather than trusted, and it was: `check:html` is 39/39 both before and after, and the built pages carry the new string with the `#reviews` anchor intact.
- **No package installs.** This phase installs zero packages by contract (D-06), and nothing here needed one.

## Known Stubs

None. Every change is live: the formatter has a working default and is exercised by a lock, the subpath resolves, the heading renders on all seven review-bearing routes, and the three classes ship in the built stylesheet. The classes have no call site yet by design — plans 03-18 and 03-21 author the markup that uses them, which is exactly the split §7.5 specifies.

## Threat Flags

None. T-03-03 is mitigated as written (`metaFor` exists, defaults safely, and is proved to be the value used); T-03-04 is accepted by the plan and remains a visual-regression risk covered by the phase's human-verify checkpoint; T-03-SC is empty by construction — no install occurred and the package still declares zero dependencies and zero devDependencies.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Plans 03-16 / 03-17** can import `@bhc/design-system/geo` from a module a bare `node` process checks. Both `distanceMiles`/`nearestTowns` and `buildInterlinks` are reachable that way now.
- **The two-region trap is unchanged and still live.** `buildInterlinks` builds hrefs from `town.region`, the URL segment, which `towns.js` calls `urlRegion`; a raw `towns.js` row has no `region` field. The new test's fixture carries both `region` and a display `county` so the distinction is exercised, and the county is what `metaFor` returns.
- **Call sites should pass `metaFor`.** The default is kept for the component's own preview and for a caller that genuinely wants a distance; at page scale the destination's county is the line to render.
- **Plan 03-18** authors `.bhc-jump-links` and `.bhc-town-group` markup; **03-21** gets the `.bhc-interlink + .bhc-interlink` hairline for free by stacking two blocks as siblings.
- **`MIN_TESTS` is 21.** Any plan adding a design-system lock raises it in the same change.
- **Carried forward, untouched by this plan:** 02-15's `checkpoint:human-verify` is still unanswered and remains the Phase 2 gate. One of its twelve checks now differs again — the review rail's `<h2>` reads `What our customers say` on the home page and on all six service pages.

## Self-Check: PASSED

- `design-system/src/components/InterlinkBlock/geo.js` — FOUND, `metaFor` at the parameter, the call site and the JSDoc
- `design-system/package.json` — FOUND, `"./geo"` at line 10
- `design-system/styles.css` — FOUND, the new section opens at 1302 and its last rule closes at 1368; the focus-override banner starts at 1370 and its last rule is at 1399
- `design-system/test/locks.test.js` — FOUND, the new test is `ok 18` in the runner output
- commits `3ec4bf0`, `162a7c1`, `373c1fb` — all FOUND in `git log`
- `.planning/phases/03-programmatic-location-service-engine/03-02-SUMMARY.md` — FOUND
- `npm run verify` exit 0, re-confirmed after the final edit: 21 + 39 tests, 0 failures
- no file deletions in any of the three commits, no untracked files left behind, working tree clean after both mutation proofs

---
*Phase: 03-programmatic-location-service-engine*
*Completed: 2026-08-13*
