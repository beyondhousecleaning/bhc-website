---
phase: 02-component-library-completion-core-templates
plan: 06
wave: 3
subsystem: app-data
status: complete
tags: [content-layer, path-alias, navigation-data, seo-metadata, structured-data, rsc]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "delta 11's three-root client-directive scan (web/app, web/content, design-system/src) and delta 6's internal-link resolution against the prerender manifest; web/content/.gitkeep"
  - phase: 02
    plan: 04
    provides: "Prose — styles its descendants through :where() and never emits an <h1>, which is why renderBlocks needs no classes and maps no h1"
provides:
  - "web/jsconfig.json — the @/* path alias, proved resolving from a route file"
  - "site.js — BRAND, RATING, AREA_SERVED, HOURS, AREA_SHORT, AREA_LONG, titleFor(), describe()"
  - "nav.js — NAV, FOOTER_COLUMNS and LEGAL; all 17 Phase 2 routes reachable, nothing else referenced"
  - "process.js — PROCESS_STEPS, the three UI-SPEC §5 steps"
  - "faqs.js — GENERAL_FAQS and serviceFaqs(slug) for the six live service slugs"
  - "blocks.jsx — renderBlocks, the one prose-block to element mapping for 02-08, 02-09 and 02-12"
  - "PROVEN: web/content is genuinely reached by the client-directive scan (SC-4g, test 24)"
affects: [02-08, 02-09, 02-10, 02-11, 02-12, 02-13, 02-14, 02-15, phase-03-town-and-combo-templates, phase-05-seo-locks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "The @/* alias — jsconfig.json paths only, no baseUrl, no tsconfig.json; Next 16.3.0 resolves it"
    - "Site copy in plain .js under web/content/, elements-only .jsx alongside it"
    - "A data module that carries a named export purely to stop a downstream rewrite silently dropping structured data"
    - "A renderer whose safety property is structural absence — no h1 entry in the map, so no h1 can be emitted"

key-files:
  created:
    - web/jsconfig.json
    - web/content/site.js
    - web/content/nav.js
    - web/content/process.js
    - web/content/faqs.js
    - web/content/blocks.jsx
  modified: []

key-decisions:
  - "AREA_SERVED and HOURS are named exports with the failure mode written above them, not values inlined at the call site — plan 02-13's layout rewrite is where areaServed would otherwise silently vanish from 18 pages of JSON-LD"
  - "The Services NavItem carries no href at all, rather than one of its children's — two independent reasons (delta 6, and 02-10's no-duplicate-href assertion) and 02-10 would not emit it anyway"
  - "LEGAL is a separate export, not a fourth FooterColumn — §7.2's fourth table row is NAPFooter's `legal` slot, and a fourth column would need hrefs outside the 17-route set"
  - "serviceFaqs returns [] for an unknown slug rather than throwing — FAQAccordion renders nothing on empty items, so the band drops instead of the route 500ing"
  - "renderBlocks keys by index: block arrays are static authored data with no runtime reorder, insert or filter for an index key to go wrong against"
  - "Per-service FAQ sets are genuinely different questions, not GENERAL_FAQS rephrased six times — near-duplicate content is a defect the 2026-08-06 audit already found on the live site"

patterns-established:
  - "Pattern: when a value must survive a later file's rewrite, export it by name and put the silent-failure mode in the comment above it — a value that is only sometimes threaded is a value someone eventually forgets to thread"
  - "Pattern: a safety property enforced by structural absence beats one enforced by a check — renderBlocks has no h1 entry, so there is no code path to get wrong"

requirements-completed: []

# Metrics
duration: 22min
completed: 2026-08-09
---

# Phase 02 Plan 06: The App Data Foundation Summary

**The `@/*` alias, four site-copy data modules and one shared prose-block renderer now exist ahead of
every route that reads them — and the third root of the client-directive scan has been proven to
actually fire rather than merely existing.**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-08-09T20:35Z
- **Completed:** 2026-08-09T20:57Z
- **Tasks:** 2
- **Files:** 6 created, 0 modified

## Accomplishments

- **`web/jsconfig.json` exists and the alias was proved, not assumed.** `{ "compilerOptions": {
  "paths": { "@/*": ["./*"] } } }` — no `baseUrl`, no `tsconfig.json`. A build with `jsconfig.json`
  merely present proves nothing, so a temporary import of `@/content/site.js` was added to
  `web/app/page.jsx`, built (compiled clean, and the probe printed the real `titleFor` and
  `AREA_SERVED` values from inside the build), then reverted. `git diff web/app/page.jsx` is empty.
- **`web/content` is now proven to be genuinely scanned.** A scratch `.js` under `web/content/`
  carrying the client directive turned `npm run check:html` **red** — `not ok 24 - SC-4g: no source
  file in web/app, web/content or design-system/src declares a client directive`, `# pass 29 / # fail
  1`, exit code 1 — with the error naming the scratch file by path. Reverted, and `check:html` is
  back to 30/30. The root has existed since wave 1 via `.gitkeep`, but nothing had ever demonstrated
  the walk reached it; that is no longer an open question for the rest of the project.
- **`AREA_SERVED` carries the four town names verbatim.** `['Leamington Spa', 'Warwick',
  'Kenilworth', 'Coventry']`, byte-identical to the literal that has been inline in
  `web/app/layout.jsx` since 01-02, asserted by a `JSON.stringify` comparison against the expected
  array. `HOURS` travels with it for the stated reason: alone it is harmless because it equals
  `NAPFooter`'s own default, but a value that only sometimes needs threading is one someone forgets.
- **All 17 routes are reachable and nothing else is referenced.** The walk over `NAV` +
  `FOOTER_COLUMNS` + `LEGAL` prints `all reachable`; every href is in the 17-route set and the 16
  non-home routes are all covered. `grep -c '"/services"'` on `nav.js` returns **0**.
- **The Services nav item is a disclosure with six children and no `href`** — asserted directly.
- **`renderBlocks` verified over 28 assertions**, including every one the plan states. It maps
  `p`/`h2`/`h3`/`ul`, emits exactly one `<li>` per list entry, drops an unknown type and an `h1`
  type, survives `null`/`undefined`/a non-array/a `ul` whose `text` is a string, emits no `class`
  attribute at all, and produces no React missing-key warning.
- **No address, postcode or phone digits in any of the five modules** — the postcode-shape and
  phone-digit scan passes over all five. `grep -ci "apartment\|baseboard\|vacuum cleaner"` on
  `faqs.js` returns **0**, and `vacuum` appears nowhere in the directory (the copy says *hoover*).
- **`npm run verify` exits 0.** 20 design-system lock tests, 30 built-HTML locks, JS 129.8 KB /
  500 KB and page 287.7 KB / 1024 KB — all three exactly at the baseline, because no route consumes
  these modules yet.
- **Zero packages installed.** `git diff web/package.json` is empty, as is `git diff
  web/app/layout.jsx`.

## Task Commits

1. **Task 1: the `@/*` alias and `web/content/site.js`** — `0d219d4` (feat)
2. **Task 2: nav, process, FAQ data and the shared block renderer** — `cb3e616` (feat)

## Files Created

- **`web/jsconfig.json`** — the alias, four lines of JSON.
- **`web/content/site.js`** — `BRAND`, `RATING`, `AREA_SERVED`, `HOURS`, `AREA_SHORT`, `AREA_LONG`,
  `titleFor()`, `describe()`. The header states both reasons copy lives here rather than in a `.jsx`
  or in the package, and records the one caveat worth carrying: Lock 5's package-level scan walks
  `design-system/src` only and never sees this directory — `SC-2d` over built HTML is what covers it.
- **`web/content/nav.js`** — `NAV`, `FOOTER_COLUMNS` (three), `LEGAL` (three). The header states the
  reach-all-17-and-nothing-else invariant and names delta 6 as its enforcement.
- **`web/content/process.js`** — `PROCESS_STEPS`, three `{ title, body }` records verbatim from §5,
  with the §14-1 note above them.
- **`web/content/faqs.js`** — `GENERAL_FAQS` (6) and `serviceFaqs(slug)` (4–5 per service, six
  services).
- **`web/content/blocks.jsx`** — `renderBlocks`, plus a default export of the same function. The only
  `.jsx` in the directory, and the header says why it is allowed to be one.

## Measured Numbers

**`titleFor` over the seven UI-SPEC §5 titles — all ≤60, cap satisfied:**

| Route | Chars | §5 says |
|---|---|---|
| `/` | 54 | 54 |
| `/services/deep-cleaning` | 53 | 53 |
| `/services/standard-home-cleaning` | 56 | 56 |
| `/services/move-in-cleaning` | 56 | 56 |
| `/services/move-out-cleaning` | 57 | 57 |
| `/services/short-term-rental-cleaning` | 55 | 55 |
| `/services/post-construction-cleaning` | 54 | 54 |

Every one matches §5's own measurement exactly.

**`describe()` — all ≤155, longest 146, so ~9 characters of headroom beyond the longest subject
shipping today:** 133 (Deep cleaning) · 134 (House cleaning) · 136 (Move-in) · 137 (Move-out) ·
141 (Regular home cleaning) · **146** (Short-term rental cleaning *and* Post-construction cleaning).
Again exactly §5's 133→146 range.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The plan's `node --input-type=module -e "import … .jsx"` criterion is unrunnable**

- **Found during:** Task 2
- **Issue:** The `renderBlocks` acceptance criterion is written as a `node --input-type=module`
  import of `./web/content/blocks.jsx`. Node has no JSX loader in this repo
  (`ERR_UNKNOWN_FILE_EXTENSION`). **This is the fourth consecutive plan to hit it** — 02-01
  deviation 7, 02-04 deviation 4, 02-05 deviation 1, and STATE.md carries it as a decision.
- **Fix:** Ran the identical assertions through a throwaway SWC probe: `await loadBindings()` from
  `next/dist/build/swc/index.js`, then `bindings.transform()` with
  `jsc.transform.react.runtime: 'automatic'`, rendering through `react-dom/server`. The probe lived
  at the worktree root and wrote to `.probe-out-02-06/` — neither is one of delta 11's three scan
  roots — and both were deleted before the commit. Nothing was added to the repo; no package
  installed.
- **New detail worth recording:** the runtime option matters. Without
  `jsc.transform.react.runtime: 'automatic'` SWC emits `React.createElement` and the module throws
  `ReferenceError: React is not defined`, because the source correctly omits a React import. 02-04
  and 02-05's summaries describe the probe without this; it is the second five minutes lost to the
  probe's setup after `getBindingsSync()`.
- **Files modified:** none (probe deleted)
- **Verification:** 28 assertions, all `ok`. Every criterion the plan states is among them.
- **Committed in:** n/a — verification only

**2. [Rule 2 - Missing Critical] The alias was proved from a route file, not merely made present**

- **Found during:** Task 1
- **Issue:** The plan's automated verify for task 1 is `npm run build`. But no file imports through
  `@/` yet, so the build passes identically whether `jsconfig.json` is correct, malformed or absent.
  The success criterion is "`@/content/...` resolves from a route file and the build succeeds" — and
  the first plan to actually rely on it is 02-08, two waves later, which would then be debugging an
  alias this plan claimed to have delivered.
- **Fix:** Temporarily imported `BRAND`, `AREA_SERVED` and `titleFor` into `web/app/page.jsx` through
  `@/content/site.js` with a `console.log`, built, and confirmed both the clean compile and the real
  values printing from inside the build. Reverted before staging.
- **Files modified:** none (`git diff web/app/page.jsx` empty; 02-08 owns that file)
- **Verification:** `ALIAS PROBE: Beyond House Cleaning | Beyond House Cleaning Leamington
  Spa|Warwick|Kenilworth|Coventry`, then a clean rebuild with the probe gone.
- **Committed in:** n/a — verification only

**3. [Rule 1 - Bug] Two utility titles overrun the 60-character cap, recorded at the point of use**

- **Found during:** Task 1
- **Issue:** UI-SPEC §5 states "Utility-page titles follow `{H1} | Beyond House Cleaning`, each
  checked ≤60." Measured through `titleFor`, two of the eleven do not:
  `The Team Behind Beyond House Cleaning | Beyond House Cleaning` = **61** (`/about-us`) and
  `Contact Our Warwickshire Cleaning Team | Beyond House Cleaning` = **62** (`/contact-us`). The
  other nine measure 38 to 54.
- **Fix:** Not fixed here — `utility.js` and both route files belong to **plan 02-11**, and Lock 8's
  enforcement is Phase 5's. What this plan did was write the measurement into `titleFor`'s own
  JSDoc, with the resolution, so 02-11 meets it at the moment it authors the strings rather than
  Phase 5 discovering it. §5 already permits the fix in the same breath — "Titles need not match the
  `<h1>` verbatim" — so the answer is a shorter title subject (`About Beyond House Cleaning` = 49,
  `Contact Our Cleaning Team` = 49), **not** a shorter `<h1>`: those are Success Criterion 2 copy and
  are correct as written.
- **Files modified:** `web/content/site.js` (comment only)
- **Committed in:** `0d219d4`

---

**Total deviations:** 3 auto-fixed (1 blocking, 1 missing-critical, 1 bug)
**Impact on plan:** No scope creep, no route file changed, no package installed. Deviation 3 is a
finding handed to 02-11 rather than work done here.

## Negative Proof — `web/content` Is Genuinely Scanned

The plan required this and it is the one deliberate, reverted exception to the never-write-the-
directive rule.

| | |
|---|---|
| Scratch file | `web/content/__negative-proof-scratch.js`, directive on line 1 |
| Command | `npm run check:html` |
| Exit code | **1** (was 0) |
| Failing assertion | **`not ok 24 - SC-4g: no source file in web/app, web/content or design-system/src declares a client directive`** |
| Error text | `client directive in …/web/content/__negative-proof-scratch.js — D-07 forbids client components` |
| Counts | `# pass 29` / `# fail 1` (was 30/0) |
| After revert | `# pass 30` / `# fail 0`, exit 0 |

The scratch file was written by assembling the directive from two fragments in a `node -e`, never
typed literally into a file this session keeps, and it was deleted with `rm` — not `git clean`, which
is prohibited in a worktree. Delta 11's second root is now verified rather than merely unconditional.

## Decisions Made

- **`AREA_SERVED` and `HOURS` are named exports carrying their own failure mode in a comment.** The
  interesting property is not the values — it is that plan 02-13 rewrites the layout to render
  `<Footer/>` instead of `<NAPFooter/>`, `NAPFooter` defaults `areaServed` to `[]`, and it emits
  `areaServed` City nodes only when the array is non-empty. Dropping the prop during that rewrite
  removes `areaServed` from 18 pages of `HomeAndConstructionBusiness` JSON-LD with **no failing
  test**: no assertion counts City nodes, and the JSON-LD *block* count is unchanged because the
  node is a property, not a block. ROADMAP Phase 5 SC-1 requires `LocalBusiness` + `areaServed`, so
  the loss would surface three phases later as a ranking defect with nothing pointing at its cause.
- **The Services nav item carries no `href` whatsoever.** Not `/services` (404s in Phase 2, fails
  delta 6) and not one of its children's (duplicates an href in the DOM, fails 02-10's Header
  assertion). Recorded in the file: 02-10 renders a childed `NavItem` as a `<summary>` and never
  emits its `href`, so adding one would be a silent inconsistency rather than a working link.
- **`LEGAL` is a separate export, not a fourth column.** §7.2's table has four rows but the fourth is
  the legal bottom row, which `Footer` hands to `NAPFooter` as `legal` — a different slot with its
  own position below the grid. Modelling it as a `FooterColumn` would render it as a headed nav
  landmark in the column grid, which is not what §7.2 draws.
- **`serviceFaqs(slug)` returns `[]` for an unknown slug.** `FAQAccordion` renders `null` on empty
  items (UI-SPEC §11), so an unrecognised slug drops the FAQ band rather than throwing inside the
  root layout's page tree. Phase 3's canonical-slug rename then becomes a key change in this file.
- **`renderBlocks` keys by index.** Blocks are static authored data; there is no runtime reorder,
  insert or filter for an index key to be wrong against, and they have no natural id. Verified that
  React emits no missing-key warning for either the blocks or the list items.
- **The six per-service FAQ sets ask genuinely different questions.** A move-out visitor is worried
  about a deposit; a builders-clean visitor is worried about dust in the light fittings. Six
  rephrasings of the same four questions is the near-duplicate-content shape the 2026-08-06 audit
  already found once on this site. Templates compose `GENERAL_FAQS` and the service set when they
  want both.
- **`describe()` interpolates from `RATING` rather than restating 4.9 and 175.** The description and
  the `RatingBadge` on the same page cannot disagree.

## Issues Encountered

- **The SWC probe needs `jsc.transform.react.runtime: 'automatic'`.** Recorded above as part of
  deviation 1. Without it the compiled module throws `ReferenceError: React is not defined`.
- **Nothing renders these modules yet**, so `check:html` exercises none of the data and the built
  output is byte-for-byte the previous wave's — the budget figures are identical to the baseline in
  all three categories. Wave 4 is where this data first reaches prerendered HTML, and that is the
  first point at which delta 6 has nav hrefs to resolve against the manifest.

## User Setup Required

None. Zero packages installed.

## Known Stubs

None. All six files are complete against their stated contracts. Two things that look like gaps but
are specified behaviour, not stubs:

- `serviceFaqs('unknown-slug')` returning `[]` is UI-SPEC §11's empty-state contract.
- `PROCESS_STEPS[2].body` stating no time window and no re-clean commitment is UI-SPEC §14-1's
  deliberate conservative default, awaiting Sam. It is a working default, not a placeholder, and the
  comment above it says so and says a specific policy drops in as a one-line data change.

Per-route copy (`home.js`, `services.js`, `utility.js`, `legal.js`) is **not** a stub of this plan —
those files belong to 02-08, 02-09, 02-11 and 02-12 by design, and this plan's objective explicitly
excludes them.

## Threat Flags

None. Every `mitigate` disposition in this plan's register is implemented:

- **T-02-30** (`nav.js` malformed entry, 17-route blast radius) — data authored to the exact
  `FooterColumn`/`NavItem` shapes and asserted: three columns each with a non-empty `heading` and an
  array `links`, every link carrying both `label` and `href`. `NAPFooter`'s shipped
  `.filter(Boolean)` / `(col.links || [])` guards remain the backstop; the file says explicitly not
  to rely on them.
- **T-02-31** (unknown block `type`) — `renderBlocks` returns `null` and filters it out. Verified
  against an unknown type, a null entry, an undefined entry, `undefined`/`null`/a string in place of
  the array, and a `ul` with no items.
- **T-02-32** (address or postcode in copy) — prohibition in every module header; the
  postcode-shape and phone-digit scan passes over all five modules; `SC-2d` covers the built output.
- **T-02-33** (nav href to a nonexistent route) — the 17-route enumeration passes with `all
  reachable` and no unknown href; delta 6 takes over once the layout renders the nav.
- **T-02-34** (`areaServed` silently dropping out of sitewide JSON-LD) — named export, verbatim
  values asserted, failure mode written above it, 02-13 named as the plan that must thread it.
- **T-02-35** (a second `<h1>` from a prose block) — structural: there is no `h1` entry in the
  renderer map. Asserted against `h1`, `H1`, `Heading1` and `title` block types, none of which can
  produce one.
- **T-02-36** (package installs) — zero packages; `git diff web/package.json` empty.

## Verification

- `npm run verify` — **exit 0.**
- `npm run test:locks` — **20/20** (baseline, unchanged).
- `npm run check:html` — **30/30** (baseline, unchanged).
- `npm run check:budget` — JS **129.8 KB** / 500 KB, page **287.7 KB** / 1024 KB, CSS 3.8 KB,
  HTML 3.4 KB — all identical to the wave-3 baseline.
- `jsconfig.json` parses as JSON and `compilerOptions.paths['@/*']` is `["./*"]`.
- Alias resolution proved from `web/app/page.jsx` and reverted; `git diff web/app/page.jsx` empty.
- `site.js` probe — `ok`: rating 4.9/175/Google, `titleFor` exact, `describe` ≤155, `AREA_LONG`
  carries the ampersand, `AREA_SERVED` length 4, `HOURS` a non-empty string.
- `AREA_SERVED` verbatim comparison against `['Leamington Spa','Warwick','Kenilworth','Coventry']` —
  `ok`.
- Seven §5 titles measured 53–57, all ≤60; eleven utility titles measured 38–62 (two over — see
  deviation 3); seven descriptions measured 133–146, all ≤155.
- `grep -c "emitSchema" web/content/site.js` → **0**.
- Nav walk → `all reachable`; Services item → 6 children, `href === undefined`;
  `grep -c '"/services"' web/content/nav.js` → **0**; `FOOTER_COLUMNS.length === 3`,
  `LEGAL.length === 3`, every link well-formed.
- `PROCESS_STEPS` → 3 entries, each with non-empty string `title` and `body`, none carrying its own
  number.
- FAQ sets → `GENERAL_FAQS` 6; per-service 4/5/4/5/5/4; every entry a `{ question, answer }` string
  pair; unknown slug → `[]`.
- Postcode / phone-digit scan across all five modules → `ok`.
  `grep -ci "apartment\|baseboard\|vacuum cleaner" web/content/faqs.js` → **0**; `vacuum` absent
  from the whole directory.
- `renderBlocks` SWC probe — **28 assertions, all `ok`**, listed under Accomplishments.
- Negative proof — see the table above; SC-4g test 24, exit 1, reverted to 30/30.
- `git diff web/app/layout.jsx web/package.json` — empty.
- No file deletions in either commit.

## Next Phase Readiness

Wave 4 and wave 5 can now import through the alias:

- `@/content/site.js` — `RATING` straight into `Hero`'s `rating` prop on every template;
  `titleFor(...)` and `describe(...)` into every `export const metadata`; `AREA_SHORT` for titles and
  `AREA_LONG` for `<h1>`s.
- `@/content/nav.js` — `NAV` into `Header`, `FOOTER_COLUMNS` and `LEGAL` into `Footer` (02-10, 02-13).
- `@/content/process.js` — `PROCESS_STEPS` into `ProcessSteps` with **no `heading` prop** when it
  sits inside a `SectionBand`.
- `@/content/faqs.js` — `GENERAL_FAQS` on home and utility, `serviceFaqs(slug)` on the service route.
- `@/content/blocks.jsx` — `renderBlocks(blocks)` inside `Prose`, in 02-08, 02-09 and 02-12.

Five things later plans must not undo:

1. **Plan 02-13 must pass `AREA_SERVED` and `HOURS` through `Footer` to `NAPFooter`.** This is the
   one change in this phase that can degrade structured data on every page with a fully green CI.
2. **The Services nav item stays href-less.** Adding one breaks delta 6 or 02-10's Header assertion
   depending on which href is chosen, and 02-10 would not emit it anyway.
3. **`LEGAL` goes to `NAPFooter`'s `legal` prop, not into `columns`.**
4. **`renderBlocks` gets no `h1` entry, ever**, and no `bhc-` classes — `Prose` owns the typography
   through `:where()`.
5. **Nothing in `web/content/` may name the client directive**, in code or in prose. That is now
   demonstrated rather than assumed, and the demonstration cost one red CI run.

One item handed forward: **plan 02-11 owns the two over-cap utility titles** (deviation 3). The
resolution is written into `titleFor`'s JSDoc at the point of use.

## Self-Check: PASSED

All six created files exist on disk:

- `web/jsconfig.json` — FOUND
- `web/content/site.js` — FOUND
- `web/content/nav.js` — FOUND
- `web/content/process.js` — FOUND
- `web/content/faqs.js` — FOUND
- `web/content/blocks.jsx` — FOUND

Both commits present in `git log`: `0d219d4` — FOUND, `cb3e616` — FOUND. `npm run verify` re-run at
the end of execution exits **0**. No file deletions in either commit. Working tree clean apart from
this summary. The probe, its output directory and the negative-proof scratch file were all removed
before their respective commits and appear in neither.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
