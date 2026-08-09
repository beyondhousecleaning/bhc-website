---
phase: 02-component-library-completion-core-templates
plan: 05
wave: 3
subsystem: ui
status: complete
tags: [design-system, react-server-components, accessibility, zero-javascript, details-summary, structured-data, seo]

# Dependency graph
requires:
  - phase: 02
    plan: 01
    provides: "src/phone.js CANONICAL_PHONE, formatPhone/toDial throwing on malformed input, Button's `as` precedent"
  - phase: 02
    plan: 04
    provides: "the component conventions — tag-scoped heading sizes, the focus-override banner that must stay last, the direct-colour check against navy"
provides:
  - "ServiceCard — one anchor per card, whole-card hit area from a stretched pseudo-element on that same anchor"
  - "TownCard — the dense ~56-card variant, carrying both postcode prohibitions in source, types and docs"
  - "FAQAccordion — ROADMAP SC-4: zero-JavaScript disclosure, every answer in the served HTML, no structured data of any kind"
  - "QuoteFormEntry — the conversion panel with no form control and the fourth tel: link on a composed page"
  - "The zero-JS <details>/<summary> mechanism, proven before Header reuses it"
affects: [02-06, 02-07, 02-08, 02-09, 02-10, 02-11, 02-12, 02-13, 02-14, 02-15, phase-03-town-and-combo-templates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern S1 four-part registration exercised four more times — delta 9 now covers twelve component directories"
    - "The stretched-pseudo-element card link: one anchor, card-sized target, no nested-link split"
    - "A scanner-colliding token is stated in full in the .prompt.md and never in the .jsx or .html"
    - "Marker suppression scoped to the component's own summary class, not the bare element"

key-files:
  created:
    - design-system/src/components/ServiceCard/ServiceCard.jsx
    - design-system/src/components/ServiceCard/ServiceCard.html
    - design-system/src/components/ServiceCard/ServiceCard.d.ts
    - design-system/src/components/ServiceCard/ServiceCard.prompt.md
    - design-system/src/components/TownCard/TownCard.jsx
    - design-system/src/components/TownCard/TownCard.html
    - design-system/src/components/TownCard/TownCard.d.ts
    - design-system/src/components/TownCard/TownCard.prompt.md
    - design-system/src/components/FAQAccordion/FAQAccordion.jsx
    - design-system/src/components/FAQAccordion/FAQAccordion.html
    - design-system/src/components/FAQAccordion/FAQAccordion.d.ts
    - design-system/src/components/FAQAccordion/FAQAccordion.prompt.md
    - design-system/src/components/QuoteFormEntry/QuoteFormEntry.jsx
    - design-system/src/components/QuoteFormEntry/QuoteFormEntry.html
    - design-system/src/components/QuoteFormEntry/QuoteFormEntry.d.ts
    - design-system/src/components/QuoteFormEntry/QuoteFormEntry.prompt.md
  modified:
    - design-system/styles.css
    - design-system/src/index.js
    - design-system/.design-sync/config.json

key-decisions:
  - "FAQAccordion renders the <h2> and wires aria-labelledby only when a `heading` prop is given; composed inside a SectionBand it renders the bare list, following ProcessSteps' two-form precedent"
  - "The FAQ marker suppression is scoped to .bhc-faq__summary rather than declared on the bare `summary` element, so a package-wide rule does not reach into Header's not-yet-authored <details>"
  - "QuoteFormEntry's tel: fallback is a Button variant='secondary' per UI-SPEC §5's CTA table, and its label is built as ONE string so a text-content scan sees a single text node"
  - "TownCard takes --bhc-radius-md (interlink-sized) rather than ServiceCard's --bhc-radius-lg; its density is in the grid and the content, and UI-SPEC §2 binds both cards to --bhc-space-6 padding"
  - "Card titles carry --bhc-weight-bold (the h1-h4 row) rather than the 600 the §3 weight table also lists for card link labels — the title IS the heading, and only one of the two rows can win"
  - "Neither card colours its icon with --bhc-action: the token's reserved-for list in UI-SPEC §4 is closed and does not include a glyph on a light ground, so icons inherit --bhc-ink"

patterns-established:
  - "Pattern: a whole-card link is ONE anchor plus a stretched ::after, never a wrapper link — an <a> may not contain interactive content, so a wrapper plus a title link is parsed into two sibling links"
  - "Pattern: when a CI grep polices a token, the full explanation goes in the .prompt.md (which no scanner reads) and the .jsx says only that the thing is absent and where the reason lives"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-08-09
---

# Phase 02 Plan 05: The Four Body Components Summary

**The four components the Home, Service and Utility templates build their bodies from now exist: two
card families that render exactly one link each, an FAQ that expands with zero JavaScript and ships
every answer to a crawler whether it is open or closed, and a conversion panel that offers the quote
flow without containing a single form control.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-08-09T20:15Z
- **Completed:** 2026-08-09T20:30Z
- **Tasks:** 2
- **Files:** 19 (16 created, 3 modified)

## Accomplishments

- **Four component directories in the four-file shape**, all registered in `index.js` and in **both**
  `.design-sync` maps. Delta 9 now passes over **twelve** component directories, up from eight.
- **One anchor per card, by construction.** Both `ServiceCard` and `TownCard` put the anchor on the
  title and get the card-sized hit area from a stretched `::after` on that same anchor over a
  `position: relative` card. The alternative — a wrapper `<a>` with the title link inside — is not
  merely redundant: an `<a>` may not have interactive content as a descendant, so the parser splits
  the pair into two sibling links. A six-card grid would announce twelve links; a 56-card locations
  index would announce 112.
- **`headingLevel` and `as` are both honoured and both probe-verified.** `headingLevel: 2` produces
  `<h2>` and no `<h3>`; `4` produces `<h4>`; an unknown value degrades to `3` with no `undefined` in
  the output. `TownCard({ as: 'span' })` renders `<span>` and no `<a>` at all.
- **`FAQAccordion` is SC-4, and all three of its properties are asserted.** Zero JavaScript (native
  `<details>`/`<summary>`, so the UA owns the state and no client boundary appears); every answer in
  the served HTML even when closed (all three answer strings present with one item open); no `name`
  attribute (so opening a second question never collapses the first).
- **The schema-type token appears only in `FAQAccordion.prompt.md`** — `grep -c` returns **0** in the
  `.jsx`, **0** in the `.html` and **6** in the prompt doc. The `.jsx` header comment says only that
  the component emits no structured data and that the reason lives in the prompt doc. That is the
  sixth time this phase has had to route around a scanner that would match its own explanation.
- **`QuoteFormEntry` contains no form control of any kind** — no `<form>`, `<input>`, `<select>` or
  `<textarea>` in the rendered output — and the canonical number is never restated in its source
  (`grep -c "447861936533"` → **0**). The label and the href both derive from `phone.js` through
  `formatPhone`/`toDial`, and a malformed value throws rather than prerendering `tel:+44`.
- **The `tel:` label is built as one string, not interpolated in JSX.** Plan 02-02's delta 2(d) reads
  a `tel:` link's rendered *text content* and compares its digits to the href's; `Call {display}`
  beside a literal can serialise with a separator between two text nodes, which is exactly what a
  text-content scan trips over. `` `Call ${formatPhone(phone)}` `` is one node, and the digit-equality
  check was run the way the lock runs it.
- **The focus-override section is still the last section in `styles.css`**, with four new blocks
  appended above the banner. The FAQ block adds **no** `:focus-visible` rule of its own — the only
  three `:focus-visible` selectors in the file are the shipped base rule and the two scoped overrides
  from plan 02-04.
- **Zero packages installed.** `git diff design-system/package.json` is empty.

## Task Commits

1. **Task 1: ServiceCard and TownCard** — `bc5c270` (feat)
2. **Task 2: FAQAccordion and QuoteFormEntry** — `844d460` (feat)

## Files Created/Modified

- `ServiceCard/*` — **created.** `<article>` with an `<h3><a>` title, optional decorative icon,
  summary, and up to three `includes` bullets (a fourth is dropped, nulls filtered).
  `.bhc-service-card__grid` is `repeat(auto-fill, minmax(240px, 1fr))` at `--bhc-space-6`.
- `TownCard/*` — **created.** Title plus one meta line, `{region} · {serviceCount} services`, with
  the separator appearing only when both halves do and `serviceCount: 0` rendering nothing.
  `.bhc-town-card__grid` is `minmax(200px, 1fr)` at `--bhc-space-3`.
- `FAQAccordion/*` — **created.** Returns `null` on empty or all-null `items`. `defaultOpen` (default
  `0`) opens exactly one item; `-1` opens none. Chevron is `aria-hidden="true" focusable="false"` and
  rotates through `--bhc-dur`/`--bhc-ease`.
- `QuoteFormEntry/*` — **created.** Heading, three reassurance bullets with decorative ticks, one
  `primary` Button and one `secondary` `tel:` Button.
- `design-system/styles.css` — four new blocks above the focus-override banner. No literal hex in any
  of them.
- `design-system/src/index.js` — four named exports.
- `design-system/.design-sync/config.json` — four entries in each of the two maps.
  `overrides.NAPFooter.cardMode` untouched.

## Decisions Made

- **`FAQAccordion` has two forms, like `ProcessSteps`.** With a `heading` it renders the `<h2>` and
  wires `aria-labelledby` to a derived id; without one it renders the bare list, which is the
  composed case — a `SectionBand` already owns the `<h2>` on the home and service templates. A
  hardcoded id would have pointed every `aria-labelledby` on a page at the first FAQ in the document.
- **Marker suppression is scoped to `.bhc-faq__summary`.** UI-SPEC §7.9 quotes the rules as
  `summary { list-style: none }`, but `Header`'s mobile nav is a second `<details>` consumer in a
  later wave. A package-wide `summary` rule would style a component that does not exist yet, from a
  block that has no reason to know about it. `Header` repeats the two lines in its own block; the
  `::-webkit-details-marker` grep is satisfied either way.
- **The `tel:` fallback is a `Button variant="secondary"`, not a bespoke link.** UI-SPEC §5's CTA
  table assigns exactly that variant to `Call +44 7861 936533` in `QuoteFormEntry`, and reusing
  `Button` means the `as` escape hatch, the focus treatment and the size scale all come for free.
- **`TownCard` takes `--bhc-radius-md`, `ServiceCard` `--bhc-radius-lg`.** UI-SPEC §7.6 fixes the
  latter; the former is unspecified. A town card is the size of a `.bhc-interlink__link`, not of a
  service card, and matching the radius of the thing it is the size of is what keeps the family
  reading as one. Padding stays `--bhc-space-6` for both, per §2's table.
- **Card titles are `--bhc-weight-bold`.** §3's weight table lists 700 for `h1`–`h4` *and* 600 for
  "ServiceCard/TownCard link labels". Both cannot apply to the same element; the title is a heading,
  so 700 wins. The 600 allowance belongs to `InterlinkBlock`'s non-heading `<span>` label, which is
  unchanged.
- **Icons inherit `--bhc-ink` rather than taking `--bhc-action`.** §4's reserved-for list for
  `--bhc-action` is explicitly closed and does not include an icon glyph on a light ground. The
  ServiceCard icon and the QuoteFormEntry ticks therefore set no colour at all.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The plan's `node --input-type=module -e "import … .jsx"` criteria are unrunnable**

- **Found during:** Tasks 1 and 2
- **Issue:** Four acceptance criteria are written as `node --input-type=module -e "import … .jsx"`.
  Node has no JSX loader in this repo (`ERR_UNKNOWN_FILE_EXTENSION`) — the property 02-01 recorded
  as its deviation 7, 02-04 as its deviation 4, and STATE.md carries as a decision. **This is the
  third consecutive plan to hit it.**
- **Fix:** Ran the identical assertions, and twenty-odd more, through a throwaway probe that compiles
  each `.jsx` with Next's bundled SWC binding (`loadBindings()` first — `getBindingsSync()` throws
  `bindings not loaded yet`) and renders with `react-dom/server`. Compiled output was mirrored under
  a scratch directory at the repo root, never inside `design-system/src`, so no lock walk could see
  it. The probe and every emitted file were deleted before each commit; nothing was added to the repo
  and no package was installed.
- **Files modified:** none (probe deleted)
- **Verification:** `ok` for both probe runs — 19 assertions for task 1, 33 for task 2. Every one of
  the plan's stated criteria is among them, run verbatim in substance.
- **Committed in:** n/a — verification only

**2. [Rule 2 - Missing Critical] The `tel:` label is assembled as one string rather than interpolated**

- **Found during:** Task 2
- **Issue:** The plan specifies a label of `Call +44 7861 936533` whose text comes from
  `formatPhone(phone)`. Written the obvious way — `Call {display}` — that is a literal beside a JSX
  expression, i.e. two adjacent text nodes. Plan 02-02's delta 2(b)/(d) reads a `tel:` link's
  **rendered text content** and compares its digits to the href's, and a serialiser that separates
  adjacent text nodes (which `renderToString` does, with a comment marker) would put a separator in
  the middle of the number the lock is trying to read.
- **Fix:** `` const callLabel = `Call ${formatPhone(phone)}`; `` — one string, one text node — with
  the reason in a comment above it.
- **Files modified:** `design-system/src/components/QuoteFormEntry/QuoteFormEntry.jsx`
- **Verification:** Probe asserts `>Call +44 7861 936533<` appears as a single node, and runs the
  digit-equality comparison the way the lock runs it.
- **Committed in:** `844d460`

**3. [Rule 2 - Missing Critical] `serviceCount: 0` renders no count rather than "0 services"**

- **Found during:** Task 1
- **Issue:** The plan specifies the meta line as `{region} · {serviceCount} services`. From Phase 3
  this is a data-module field, and a town that has been added but has no pages yet arrives as `0`.
  Rendering `Warwickshire · 0 services` publishes a claim about the business on an index of ~56
  towns; it is a data state, not copy.
- **Fix:** The count half renders only for a number greater than zero, and the ` · ` separator
  renders only when both halves are present, so a missing `region` gives `6 services` rather than
  ` · 6 services`.
- **Files modified:** `design-system/src/components/TownCard/TownCard.jsx`
- **Verification:** Probe asserts all four data shapes plus the zero case.
- **Committed in:** `bc5c270`

---

**Total deviations:** 3 auto-fixed (2 missing-critical, 1 blocking)
**Impact on plan:** No scope creep. Deviation 1 is now a standing property of this repo rather than a
finding — every remaining plan should assume the SWC-probe route or an assertion over built HTML.

## Issues Encountered

- **`getBindingsSync()` from `next/dist/build/swc` throws `bindings not loaded yet`.** The probe must
  `await loadBindings()` first and then use the exported `transform(src, options)`. Recorded here
  because plan 02-04's summary describes the same probe without this step and the next author will
  otherwise lose the same five minutes.
- **Nothing renders these components yet**, so `check:html` exercises none of them. They are asserted
  by delta 9 (shape and registration), delta 14 (the chevron and tick SVGs), by the built-CSS
  read-back, and by the probe. Wave 4 is where they first appear in prerendered HTML — and that is
  also the first point at which delta 7's `FAQPage` grep has a page carrying an FAQ to scan.

## User Setup Required

None. Zero packages installed, consistent with T-02-29.

## Known Stubs

None. All four components are complete against their UI-SPEC contracts; none renders a placeholder,
a mock value or an empty data source. `FAQAccordion` returning `null` on empty `items` is the
specified behaviour (UI-SPEC §11), not a stub.

## Threat Flags

None. Every `mitigate` disposition in this plan's register is implemented:

- **T-02-24** (`TownCard.town` information disclosure) — both prohibitions are recorded in the header
  comment, the `.d.ts` JSDoc and the `## Don't` list, and in the preview's bug caption. Lock 5 passes
  over the new sources and previews.
- **T-02-25** (`FAQAccordion` structured data) — the component emits no JSON-LD at all and does not
  name the schema type in its own source; verified by grep in both directions and by the probe.
- **T-02-26** (`toDial` inside `QuoteFormEntry`) — inherits plan 02-01's throw; probe asserts a
  malformed `phone` fails the render rather than degrading.
- **T-02-27** (a client boundary sneaking in) — both interactions are UA-driven or CSS-driven; SC-4g
  is green on both halves, including the source scan over `design-system/src`.
- **T-02-29** — zero packages; `git diff design-system/package.json` empty.

T-02-28 is `accept` and unchanged.

## Verification

- `npm run verify` — **exit 0.**
- `npm run test:locks` — **20/20**, delta 9 now covering twelve component directories, delta 14 over
  the new chevron and tick SVGs.
- `npm run check:html` — **30/30**.
- `npm run check:budget` — JS 129.8 KB / 500 KB (unchanged); CSS 3.3 → **3.8 KB** gzip;
  page 287.2 → **287.7 KB** / 1024 KB.
- Probe, task 1 — 19 assertions, all `ok`: one anchor and one `<h3>` per card; `headingLevel` 2/4 and
  an unknown value; `includes` capped at three with nulls filtered; `as="span"` renders `<span>` and
  no `<a>`; all five meta-line shapes; no `undefined` in a minimal render.
- Probe, task 2 — 33 assertions, all `ok`: `null` on empty/all-null items; exactly one open
  `<details>`; all three closed answers present; no `name=`; no `FAQPage`; no `ld+json`; `defaultOpen`
  index selection and `-1`; the no-heading form; no form control of any kind; canonical `tel:` href
  and displayed digits; the label as one text node; digit-equality run as the lock runs it; the throw
  on a malformed `phone`; `as` honoured on both actions; empty and null-bearing `bullets`.
- `grep -c "FAQPage"` → **0** in `FAQAccordion.jsx`, **0** in `FAQAccordion.html`, **6** in
  `FAQAccordion.prompt.md`.
- `grep -c "447861936533" QuoteFormEntry.jsx` → **0**.
- `grep -c "::-webkit-details-marker" styles.css` → **1**. `:focus-visible` selectors in the file
  after comments: only the shipped base rule and the two scoped overrides — the FAQ block adds none.
- No literal hex in any of the four new CSS blocks. The focus-override banner is the last
  `/* --- ` section in the file (order: … CTABand | ServiceCard | TownCard | FAQAccordion |
  QuoteFormEntry | Focus).
- Read back out of `web/.next/static/chunks/*.css`: `bhc-service-card__link:after` (lightningcss
  emits the **single-colon** form — measured, and recorded in the CSS comment and both card prompt
  docs), `webkit-details-marker`, and
  `bhc-faq__item[open] .bhc-faq__chevron{color:var(--bhc-action-hover);transform:rotate(180deg)}`.
- `git diff design-system/package.json` — empty.

## Next Phase Readiness

Wave 4 can compose from:

- `ServiceCard` inside a `SectionBand tone="warm"` with `.bhc-service-card__grid` as the wrapper —
  six cards, `headingLevel` left at its default.
- `TownCard` the same way, with `.bhc-town-card__grid`. Phase 3 supplies the ~56 towns as data; the
  component is already written against that.
- `FAQAccordion` with **no `heading` prop** when it sits inside a `SectionBand`, which is how UI-SPEC
  §4 places it on home and service pages.
- `QuoteFormEntry` on `/get-a-quote` and `/customer-login`, with **no `phone` prop**.

Three things later waves must not undo:

1. **The focus-override section stays last in `styles.css`.** Six blocks now sit above the banner.
2. **`FAQAccordion` emits no structured data, and its `.jsx` and `.html` never name the schema type.**
   Delta 7 greps every built page for that token; wave 4 is the first build where a page actually
   carries an FAQ, so that is when the grep starts asserting something.
3. **`QuoteFormEntry`'s `tel:` fallback is the fourth link on a composed page and the cap is four.**
   If a page trips the cap, the wrong link is being added somewhere else — this is not the one to
   remove.

One carried-forward check, from plan 02-04: `TrustBar`, `ReviewCard` and `StickyCallBar` still need
the direct-colour check against `--bhc-navy`. All four components here were checked; `ServiceCard`
and `TownCard` set `--bhc-ink-muted` directly and are in `## Don't` lists as navy-forbidden,
`FAQAccordion` sets no text colour at all (it inherits `currentColor`, with only the authorised
`--bhc-action-hover` hover and open states), and `QuoteFormEntry` carries its own tint ground.

## Self-Check: PASSED

All 16 created files exist on disk and all 3 modified files carry the changes claimed. Both commits —
`bc5c270` and `844d460` — are present in `git log`. `npm run verify` re-run at the end of execution
exits 0. No file deletions in either commit; working tree clean apart from this summary.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
