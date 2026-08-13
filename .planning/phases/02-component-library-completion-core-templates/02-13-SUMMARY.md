---
phase: 02-component-library-completion-core-templates
plan: 13
wave: 6
subsystem: web-app-shell
status: complete
tags: [root-layout, composition, landmarks, skip-link, 404-template, route-floor, structured-data, delta-5, delta-8, wave-6]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "check-html-locks.mjs — EXPECTED_APP_ROUTES, the delta 5 landmark test, NO_RATING_YET / NO_PRIMARY_CTA_YET as self-restoring inverse gates, PAGE_EXPECTATIONS, FRAMEWORK_ONLY, and the class=\"[^\"]*… counting rule"
  - phase: 02
    plan: 06
    provides: "web/content/nav.js (NAV, FOOTER_COLUMNS, LEGAL) and web/content/site.js (AREA_SERVED, HOURS, RATING)"
  - phase: 02
    plan: 07
    provides: "BeforeAfterSlider's never-null pending state — the thing delta 8 asserts"
  - phase: 02
    plan: 08
    provides: "/get-a-quote's QuoteFormEntry, which had already emptied its own NO_PRIMARY_CTA_YET entry"
  - phase: 02
    plan: 09
    provides: "the three legal routes that were waiting on a sitewide primary Button"
  - phase: 02
    plan: 10
    provides: "SkipLink, Header, Footer and StickyCallBar — the four components this plan composes"
  - phase: 02
    plan: 11
    provides: "the Home template, and the /_not-found composition analog"
  - phase: 02
    plan: 12
    provides: "the six /services/* routes — six of the eighteen the route floor now names"
provides:
  - "web/app/layout.jsx — the composed shell: SkipLink -> Header -> main#main -> Footer -> StickyCallBar, on all 18 pages"
  - "web/app/not-found.jsx — a real 404 template, closing WR-07"
  - "EXPECTED_APP_ROUTES raised 3 -> 18, asserted in both directions"
  - "delta 5 complete: one <header>, one <nav aria-label=\"Primary\">, one <main id=\"main\">, one <footer> and one skip link per app page"
  - "delta 8: PHOTO_PLACEHOLDER_ROUTES — the photo placeholder asserted on exactly the 7 slider pages and nowhere else"
  - "NO_RATING_YET and NO_PRIMARY_CTA_YET both emptied — every app page is now held to the positive lock"
  - "areaServed City nodes proven present in the JSON-LD of all 18 built pages"
affects: [02-14, 02-15, phase-03-locations-layer, phase-04-content-and-photography, phase-05-seo-locks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A composition layer in the root layout renders the wrapped component and the layout renders NEITHER directly — one footer shape, not two, so the one-<footer> assertion cannot be defeated by a well-meant belt-and-braces render"
    - "A structured-data prop threaded from a named content constant rather than an inline literal, so the value has one home and the omission has a comment naming the three-phases-later failure it causes"
    - "A route-count floor as the guard against silent dynamic opt-in: a route that leaves the prerender manifest leaves every assertion, so the suite would otherwise go green by having less to check"
    - "Both directions on a marker lock: the listed pages must carry exactly one, the unlisted ones must carry none — the negative half is what Phase 4 inverts as it backfills"
    - "Counting an attribute marker by splitting on the full attribute=\"value\" string: the bare attribute NAME is inflated by the RSC flight payload (measured: 2 vs 1), and a split-based count cannot be mistaken for a bare class-name regex by the harness's own self-check"

key-files:
  created:
    - web/app/not-found.jsx
  modified:
    - web/app/layout.jsx
    - web/scripts/check-html-locks.mjs

key-decisions:
  - "The 404's body copy lives in not-found.jsx rather than in web/content/utility.js — the route is not in UTILITY's byPath table, it carries three sentences rather than a page of prose, and gift-cards/page.jsx already precedents short CTA literals in a template. The claude-seo .jsx substring ban does not bind on this copy."
  - "UI-SPEC §5's error body offers 'the areas we cover'; that is /locations and it does not exist until Phase 3, so delta 6 would have put a link to a 404 on the 404 page. The first sentence is intact and the offer is §9.4's three named destinations instead."
  - "The 404 body is stated ONCE, in the Prose, not also as the Hero's lead — §9.4 draws the copy below the hero and two statements of it would be a duplication nothing would catch."
  - "The three recovery links are laid out with an inline flex style rather than a new bhc- class: three buttons on one page do not justify a rule in the shared stylesheet that nothing else uses, and SC-1b forbids a second one."
  - "NO_RATING_YET and NO_PRIMARY_CTA_YET are kept as empty sets rather than deleted — an empty exemption set is the honest record that every app page is now held to the positive lock, and the vacuity guards still hold."
  - "not-found.jsx exports no metadata. Next does not read a metadata export from not-found.js; the title and the D-15 robots block both arrive from RootLayout, which is where they are asserted (and _not-found.html still ships its two robots metas)."

patterns-established:
  - "Pattern: when a spec's acceptance regex is written against an idealised build output, run the assertion the spec MEANS. Next 16 emits a hidden non-focusable <div hidden> preamble as the first child of <body>, so 'the skip link is the first element in body' is false while 'the skip link is the first FOCUSABLE element' — the actual WCAG 2.4.1 requirement — is true and is what was asserted."

requirements-completed: []

# Metrics
duration: 52min
completed: 2026-08-10
tasks: 3
files: 3
---

# Phase 2 Plan 13: The Composed Layout Summary

**Every one of the 18 app pages now carries the full site chrome — a skip link that is the first
focusable element, one `<header>`, one `<nav aria-label="Primary">`, one focusable
`<main id="main">`, one `<footer>` and a mobile call bar — and all four `areaServed` City nodes are
proven present in every page's business JSON-LD. The 404 is a real template. The route floor is 18,
and removing a route, the skip link or the photo placeholder each turns CI red.**

## Performance

- **Duration:** ~52 min
- **Completed:** 2026-08-10
- **Tasks:** 3
- **Files:** 1 created, 2 modified

## Task Commits

| Task | Name | Commit |
|---|---|---|
| 1 | Compose the root layout | `7471ebd` (feat) |
| 2 | The real 404 template, and both exemption sets emptied | `5d6f83b` (feat) |
| 3 | Raise `EXPECTED_APP_ROUTES`, complete delta 5, land delta 8 | `569b425` (feat) |

## What Was Built

### Task 1 — `web/app/layout.jsx`

The `<body>` is now, in order: `<SkipLink />`, `<Header nav={NAV} cta={…} />`,
`<main id="main" tabIndex={-1}>{children}</main>`, `<Footer …/>`, `<StickyCallBar />`.

**The silent failure did not happen.** `AREA_SERVED` and `HOURS` are threaded from
`@/content/site.js` through `Footer`, which forwards them undefaulted. Asserted on the JSON-LD block
itself, not on the page text — `Warwick` is a substring of `Warwickshire`, so a page-wide
`includes()` would have passed even with the nodes gone:

```
ok — all four City nodes ({"@type":"City","name":"…"}) in the JSON-LD of all 18 app pages
```

**One footer shape.** `grep -c "NAPFooter" web/app/layout.jsx` returns **0** — the element, the
import and every prose mention are gone, and the file describes "the footer composition component"
instead. Both the element and its wrapper surviving would have put two `<footer>` landmarks on all
18 pages.

`metadataBase`, `robots: { index: false, follow: false }`, the two CSS imports and the
`tabIndex={-1}` all survived the rewrite. No `phone` prop is passed to any of the four components.

### Task 2 — `web/app/not-found.jsx`

Centred `Hero` with `<h1>` *We Couldn't Find That Page* and a `RatingBadge`, then a narrow
`SectionBand` holding the §5 error body in `Prose` and the three §9.4 recovery links
(`/services/deep-cleaning`, `/`, `/get-a-quote`). No `Breadcrumbs`, no `CTABand`, no schema prop, no
phone number, no metadata export.

`PAGE_EXPECTATIONS['/_not-found']` now reads
`{ h1: "We Couldn't Find That Page", hasBreadcrumbs: false, ldJsonBlocks: 1 }`.

### Task 3 — `web/scripts/check-html-locks.mjs`

1. **`EXPECTED_APP_ROUTES` raised 3 → 18**, with the guard written down: a route that silently opts
   into dynamic rendering leaves `prerender-manifest.json` and therefore leaves *every* assertion in
   the file, so without a floor the suite goes green by having less to check.
2. **Delta 5 completed** — one `<header>`, one `<nav aria-label="Primary">`, one `<main id="main">`,
   one `<footer>` and one `class="…bhc-skip-link"` per app page. The skip-link clause was added
   beyond the plan's two because its absence is otherwise completely silent.
3. **Delta 8 landed** — `PHOTO_PLACEHOLDER_ROUTES` (Home + the six service pages), asserted in both
   directions.

## Measured Results

### Landmarks — identical on all 18 app pages

| Assertion | Form used | Expected | Observed |
|---|---|---|---|
| `<header` | tag | 1 | 1 |
| `<nav aria-label="Primary"` | attribute | 1 | 1 |
| `<main id="main"` | attribute | 1 | 1 |
| `<footer` | tag | 1 | 1 |
| skip link | `class="[^"]*bhc-skip-link` | 1 | 1 |
| `<h1` | tag | 1 | 1 |
| `areaServed` in the JSON-LD | 4 City nodes | 4 | 4 |
| `<main …tabindex="-1"` | attribute | 1 | 1 |
| `<link rel="stylesheet"` | tag | 1 | 1 |

Built stylesheets under `.next/static`: **1**. CSS import statements under `web/app`: **2**, both in
`layout.jsx`, **0** everywhere else. `447861936533` and `phone=` under `web/app`: **0** for every
file.

### `/_not-found`, built

| Assertion | Expected | Observed |
|---|---|---|
| `<h1>` text (entity-decoded) | `We Couldn't Find That Page` | matches |
| `<header` / primary `<nav` / `<main id="main"` / `<footer` | 1 each | 1 each |
| skip link | 1 | 1 |
| `<script type="application/ld+json"` | 1 | 1 |
| `class="…bhc-breadcrumbs__list"` | 0 | 0 |
| `bhc-section--navy` | 0 | 0 |
| `class="…bhc-btn--primary"` | 3 | 3 |
| `href="tel:` | 3 | 3 |
| recovery links resolving to prerendered routes | 3 / 3 | 3 / 3 |

`_global-error.html` is untouched and still matches 02-RESEARCH's measurement, not UI-SPEC §9.5:
**1 `<h1>`, 0 `<footer>`, 0 `tel:`, 0 robots metas, 0 `bhc-` classes.** It remains in
`FRAMEWORK_ONLY` and out of `PAGE_EXPECTATIONS`, so it is excluded from every landmark, NAP, robots
and JSON-LD assertion and included in the one-`<h1>` count. No `app/global-error.jsx` was added.

### Delta 8 — measured across all 18 app pages

| Route group | `data-bhc-photo-state="pending"` | bare attribute name |
|---|---|---|
| `/` and the six `/services/*` | **1** each | 2 each (flight payload) |
| the other eleven app pages | 0 | **0** |

The bare-name inflation is why the positive half counts the full `attribute="value"` string. The
negative half tests the bare name deliberately — it is a zero assertion, so scanning the payload too
only makes it stricter.

### `tel:` budget — at the cap, with no headroom

| Route | `tel:` links |
|---|---|
| most pages | 3 (Header, StickyCallBar, footer) |
| `/get-a-quote`, `/customer-login` | **4** — `QuoteFormEntry` / the Call fallback is the fourth |

`TEL_LINKS_PER_PAGE_MAX` is still **4** and `grep -c "at most 3"` is 0. Two routes now sit exactly on
the cap. A fifth `tel:` anywhere in the layout turns those two red.

### Gate constants — verified untouched

| Constant | State |
|---|---|
| `INTERLINK_LOCK_ACTIVE = false` | 1 occurrence, still `false` with its self-restoring inverse |
| `TEL_LINKS_PER_PAGE_MAX` | 4 |
| `EXPECTED_APP_ROUTES` | 18 entries |
| `PHOTO_PLACEHOLDER_ROUTES` | 7 entries, 6 mentions in the file |
| `NO_RATING_YET`, `NO_PRIMARY_CTA_YET` | both empty sets |
| bare class-name count regexes | 0 (self-check clean) |
| previews floor / `MIN_TESTS` | not raised — 02-14's, and `run-locks.mjs` does not exist in this repo |

### Negative proofs — all three reproduced red, all three reverted

| Proof | Injected defect | `check:html` | Failing assertion |
|---|---|---|---|
| 1 | `web/app/gift-cards/` renamed so the route stops prerendering | exit **1** | `delta 1` — *expected route /gift-cards is not in prerender-manifest.json — it stopped being prerendered* (and `delta 6` on the now-dead footer link) |
| 2 | `<SkipLink />` removed from the layout | exit **1** | `delta 5` — */: expected 1 skip link, found 0* |
| 3 | a `pairs` array passed to Home's `BeforeAfterSlider` | exit **1** | `delta 8 / SC-3` — */: expected exactly 1 pending photo placeholder, found 0* |

Each was reverted and rebuilt; `git status --short` is clean and `git diff` on all three
`package.json` files is empty.

### Suite state — `npm run verify` exits 0

| Gate | Before this plan | After |
|---|---|---|
| `npm run test:locks` | 20 / 20 | **20 / 20** |
| `npm run check:html` | 30 / 30 | **31 / 31** (delta 8 is the new one) |
| JS (gzip, modern) | 129.8 KB / 500 KB | **129.8 KB / 500 KB**, worst `/` |
| Page weight | 294.2 KB / 1024 KB | **298.4 KB / 1024 KB**, worst `/services/deep-cleaning` |

**Worst route: `/services/deep-cleaning` at 298.4 KB** (JS 129.8 + HTML 13.2 + CSS 4.7 + fonts
150.7). The +4.2 KB is entirely gzip HTML (9.0 → 13.2 KB) — the header nav, the footer columns and
the call bar now render into every page. **JS is byte-identical at 129.8 KB**: all four composed
components ship zero JavaScript, which is the whole point of the `<details>`-plus-sibling-combinator
navigation. 19 prerendered routes, all `compute: "static"`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical] Task 2 had to empty `NO_RATING_YET` and `NO_PRIMARY_CTA_YET`, which the plan's task text does not mention**

- **Found during:** Task 2
- **Issue:** The plan's task 2 names only the `PAGE_EXPECTATIONS` edit, and task 3 names three other
  edits. Neither names the two exemption sets. But both are **self-restoring inverse gates**: after
  task 1 every page carries the Header's primary Button, and after task 2 `/_not-found` carries a
  `RatingBadge`. Left alone, SC-4c and SC-4e would have failed on four routes with
  *"now renders a primary Button — remove it from NO_PRIMARY_CTA_YET"*. The harness's own comment
  assigns the work to this plan explicitly (*"PLAN 02-13 EMPTIES THIS SET COMPLETELY"*), as does
  02-10's summary, so this is a gap in the plan text rather than a scope change.
- **Fix:** Both sets are now `new Set([])`. They are **kept rather than deleted** — an empty
  exemption set is the honest record that every app page is held to the positive lock, and the
  vacuity guards (`APP_PAGES.some(p => !SET.has(p.route))`) still hold. The comment above them now
  records how each entry left, in order, because that sequence is the argument for writing gaps down
  as gated sets rather than as prose.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Commit:** `5d6f83b`

**2. [Rule 3 - Blocking] The plan's "skip link is the first element inside `<body>`" command cannot pass on a Next 16 build**

- **Found during:** Task 1
- **Issue:** The acceptance command asserts `/^\s*<a[^>]*class="bhc-skip-link"/` against the first
  400 characters after `<body…>`. Measured on this build, Next 16 emits
  `<div hidden=""><!--$--><!--/$--></div>` as the first child of `<body>` on every page — a Suspense
  boundary marker. The regex fails on a **correct** build.
- **Fix:** Asserted what the criterion means and what WCAG 2.4.1 actually requires — that the skip
  link is the first **focusable** element. Run over all 18 pages: nothing matching
  `<(a|button|input|select|textarea|details|summary)` precedes it, and the only markup that does is
  Next's hidden preamble div, matched exactly and shown to be the whole of it.
- **Files modified:** none (verification only)
- **Verification:** `ok — skip link is the first focusable element on all 18 app pages; only Next's hidden preamble div precedes it`

**3. [Rule 3 - Blocking] The plan's `/_not-found` `<h1>` command does not decode HTML entities**

- **Found during:** Task 2
- **Issue:** The heading contains an apostrophe, which React serialises as `&#x27;`. The plan's
  command compares the raw inner HTML and reports
  `got "We Couldn&#x27;t Find That Page"` on a correct build. The harness's own `h1TextOf` decodes
  entities before comparing — the same trap 02-02 documented for `&amp;` on twelve other headings.
- **Fix:** Ran the comparison through the harness's decoder. `check:html`'s `delta 4 / SC-4a` is the
  authoritative form and it is green.
- **Files modified:** none (verification only)
- **Verification:** `h1 (entity-decoded): ok — "We Couldn't Find That Page"`

**4. [Rule 2 - Missing critical] Delta 5 gained a third clause the plan lists as optional**

- **Found during:** Task 3
- **Issue:** The plan says *"Add a third clause while there"* for the skip link. It is not optional
  in effect: the skip link is invisible until focused, nothing else in the suite counts it, and
  negative proof 2 shows removal is otherwise silent.
- **Fix:** Included, in the `class="[^"]*…` form, and proven red by removal.
- **Commit:** `569b425`

### Additions Beyond Plan

None.

## Issues Encountered

- **Two routes now sit exactly on the `tel:` cap of four** (`/get-a-quote` and `/customer-login`).
  Header and StickyCallBar are both always in the DOM — they are CSS-gated, not conditionally
  rendered, which is what keeps the render server-side — so three is the floor on every page. There
  is no headroom for a fifth `tel:` anywhere in the layout or in any template.
- **`_not-found.html` carries three `tel:` links and two robots metas**, both of which are new
  consequences of this plan and both of which are asserted. WR-07's finding — that nothing had ever
  inspected this file — is now closed from both ends: the harness globs it and it has a real
  template to inspect.
- **Page weight grew 4.2 KB on every route** because the chrome renders into every page. That is
  gzip HTML, not JavaScript, and the budget has 726 KB of headroom.
- **`web/scripts/run-locks.mjs` does not exist in this repo.** The plan's instruction not to raise
  `MIN_TESTS` in it is satisfied vacuously; the design-system suite is run through
  `npm run test --workspace @bhc/design-system` and is untouched at 20 tests.

## Known Stubs

| Stub | File | Why it is here |
|---|---|---|
| `BeforeAfterSlider` with no `pairs` on 7 pages | `web/app/page.jsx`, `web/app/services/[service]/page.jsx` | **Deliberate — this is ROADMAP SC-3**, and as of this plan it is *asserted* rather than merely present. Phase 4 supplies real pairs and moves each backfilled route out of `PHOTO_PLACEHOLDER_ROUTES`; the positive half of delta 8 goes red until it does. |
| No `InterlinkBlock` anywhere | all templates | **Deliberate and gated.** `INTERLINK_LOCK_ACTIVE = false` asserts the inverse until Phase 3 supplies town data. |
| The header brand is a typographic wordmark | `Header.jsx` (from 02-10) | The available logo raster is a superseded mark at unusable resolution. A one-prop swap when the SVG lockup lands. |

None of these prevents this plan's goal. No stub was introduced by this plan.

## Threat Flags

None. This plan adds no network endpoint, no auth path, no file access and no schema at a trust
boundary. All eight register entries are mitigated and asserted:

| Threat | State |
|---|---|
| T-02-77 a route silently dropping out of prerendering | `EXPECTED_APP_ROUTES` at 18, both directions, negative proof 1 red |
| T-02-78 a second `<header>` or `<footer>` landmark | `grep -c "NAPFooter" web/app/layout.jsx` = 0; delta 5 counts one of each on all 18 pages |
| T-02-79 `areaServed` silently dropping out of the JSON-LD | all four City nodes asserted inside the JSON-LD block on all 18 pages |
| T-02-80 a malformed `nav.js` entry 500-ing every route | `Header` and `Footer` carry the guard idiom from 02-10; the layout passes 02-06's authored data |
| T-02-81 the 404 leaking build or path detail | `not-found.jsx` renders authored copy only — no request path, no stack, no error object |
| T-02-82 pre-cutover indexing | `metadataBase` and the `robots` block survived; D-15 runs over all 18 app pages, `_not-found.html` still ships two noindex metas |
| T-02-83 a second built stylesheet | 1 `.css` under `.next/static`, 1 `<link rel="stylesheet">` per page, 2 CSS import statements in the app and both in `layout.jsx` |
| T-02-84 package installs | not applicable — zero packages this phase; all three `package.json` diffs empty |

## Notes for Later Plans

- **02-14** owns the `previews.length` floor. Delta 9 walks 22 component directories (02-10); this
  plan did not touch it and the floor is still at its old value.
- **02-15** inherits a green suite: 20 lock tests + 31 built-HTML locks, `npm run verify` exit 0.
- **Phase 3** flips `INTERLINK_LOCK_ACTIVE` to `true`, adds `/locations` (at which point
  `not-found.jsx`'s `RECOVERY_LINKS` can regain §5's "areas we cover" offer — the file says so at the
  point of the adaptation), inserts *Areas We Cover* into `NAV`, and grows `EXPECTED_APP_ROUTES` with
  every route it adds. The floor is the mechanism that makes a dropped combo page visible at 336-page
  scale.
- **Phase 4** inverts delta 8: each backfilled route emits `data-bhc-photo-state="live"` instead of
  `"pending"`, the positive half goes red for that route, and the route moves out of
  `PHOTO_PLACEHOLDER_ROUTES`. The negative half stays as it is.
- **Phase 5** gets `LocalBusiness` + `areaServed` on every page already satisfied (SC-1), and should
  note that the D-15 robots block is deliberately the opposite of its "robots.txt allows crawling"
  criterion — different hosts, and the switch is a cutover step.
- **Do not add a fifth `tel:` anywhere.** Two routes are on the cap.

## Self-Check: PASSED

- `web/app/layout.jsx` — FOUND
- `web/app/not-found.jsx` — FOUND
- `web/scripts/check-html-locks.mjs` — FOUND
- `.planning/phases/02-component-library-completion-core-templates/02-13-SUMMARY.md` — FOUND
- commit `7471ebd` — FOUND
- commit `5d6f83b` — FOUND
- commit `569b425` — FOUND
- `npm run verify` — exit 0
