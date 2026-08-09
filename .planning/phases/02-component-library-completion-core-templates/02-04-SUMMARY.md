---
phase: 02-component-library-completion-core-templates
plan: 04
wave: 2
subsystem: ui
status: complete
tags: [design-system, react-server-components, accessibility, css-tokens, focus-visible, css-counters]

# Dependency graph
requires:
  - phase: 02
    plan: 01
    provides: ".bhc-section__intro, --bhc-text-2xl as the settled <h2> size, the Button `as` precedent"
  - phase: 02
    plan: 03
    provides: "delta 9 — the four-file component shape and both .design-sync maps, asserted"
provides:
  - "SectionBand — the 60/30/10 band rhythm wrapper; --bhc-section-y is declared in exactly one place"
  - "Prose — the 68ch long-form container that never emits an <h1>, all descendant rules through :where()"
  - "ProcessSteps — numerals from the <ol> ordinal via a CSS counter, never from data"
  - "CTABand — the one dark band, navy by default, `secondary` coerced to `ghost` there"
  - "The two scoped :focus-visible overrides, last in styles.css under a banner that says so"
  - ".bhc-section--navy .bhc-section__intro at --bhc-paper — the intro was 1.10:1 on navy"
affects: [02-05, 02-06, 02-07, 02-08, 02-09, 02-10, 02-11, 02-12, 02-13, 02-14, 02-15, phase-03-town-and-combo-templates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern S1 four-part registration (jsx/html/d.ts/prompt.md + index.js + both .design-sync maps) exercised four times"
    - "Variant lookup maps with a fallback, extended to tone/width/headingLevel — an unknown value degrades, never emits `--undefined`"
    - "aria-labelledby ids derived from a prop or a heading slug, written with split/filter/join so no .jsx carries the string-substitution method"
    - "Composition over duplication: CTABand renders SectionBand rather than re-declaring --bhc-section-y"

key-files:
  created:
    - design-system/src/components/SectionBand/SectionBand.jsx
    - design-system/src/components/SectionBand/SectionBand.html
    - design-system/src/components/SectionBand/SectionBand.d.ts
    - design-system/src/components/SectionBand/SectionBand.prompt.md
    - design-system/src/components/Prose/Prose.jsx
    - design-system/src/components/Prose/Prose.html
    - design-system/src/components/Prose/Prose.d.ts
    - design-system/src/components/Prose/Prose.prompt.md
    - design-system/src/components/ProcessSteps/ProcessSteps.jsx
    - design-system/src/components/ProcessSteps/ProcessSteps.html
    - design-system/src/components/ProcessSteps/ProcessSteps.d.ts
    - design-system/src/components/ProcessSteps/ProcessSteps.prompt.md
    - design-system/src/components/CTABand/CTABand.jsx
    - design-system/src/components/CTABand/CTABand.html
    - design-system/src/components/CTABand/CTABand.d.ts
    - design-system/src/components/CTABand/CTABand.prompt.md
  modified:
    - design-system/styles.css
    - design-system/src/index.js
    - design-system/.design-sync/config.json

key-decisions:
  - "ProcessSteps renders a <section> wrapper when `heading` is given: an <ol>'s content model is li/script/template only, so a heading inside the list is invalid HTML that the parser hoists out, breaking the counter the numerals depend on"
  - "CTABand composes SectionBand rather than re-implementing the band, so --bhc-section-y stays declared once"
  - "A `secondary` action passed to a navy CTABand is coerced to `ghost` rather than rendered — outlined ink on navy is 2.65:1"
  - "Prose `width=\"narrow\"` maps to --bhc-container-narrow (800px), which is WIDER than the 68ch default; documented in the .d.ts, the prompt doc and the ## Don't list because the name says the opposite"
  - "Heading font sizes are tag-scoped (h2./h3. prefixed) rather than set on the class, so headingLevel 3 lands on --bhc-text-xl per UI-SPEC §3 instead of rendering an <h3> at the <h2> step"

patterns-established:
  - "Pattern: a component that takes a headingLevel steps its OWN sub-headings down with it (ProcessSteps step titles h3 -> h4), so the outline stays legal at any nesting depth"
  - "Pattern: a component whose ground can be navy checks every colour it sets DIRECTLY (not via currentColor) against --bhc-navy before shipping — that is how the .bhc-section__intro defect was found"

requirements-completed: []

# Metrics
duration: 30min
completed: 2026-08-09
---

# Phase 02 Plan 04: The Four Content Primitives Summary

**The four primitives every Phase 2 template composes from now exist — bands whose padding is
declared once, an 800–1,100-word column that cannot grow an `<h1>`, a three-step list that numbers
itself from its own ordinal, and the site's first dark band with a focus ring that is actually
visible on it (5.97:1, against 1.15:1 without the override).**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-08-09T19:40Z
- **Completed:** 2026-08-09T20:10Z
- **Tasks:** 2
- **Files:** 19 (16 created, 3 modified)

## Accomplishments

- **Four component directories in the four-file shape**, all four registered in `index.js` and in
  **both** `.design-sync` maps. Delta 9 now passes over eight component directories, up from six.
- **`SectionBand`** wraps the shipped `bhc-section` / `bhc-container` classes. `tone="paper"` maps to
  the **empty string** — there is no `.bhc-section--paper` rule and there should not be one — and an
  unknown tone degrades to it rather than emitting `bhc-section--undefined`. `--bhc-section-y` is
  never overridden.
- **`aria-labelledby` is derived, never hardcoded.** `{id}-heading` when an `id` prop is given,
  otherwise a slug of the heading text. These bands appear several times per page; a fixed id would
  have pointed every label at the first band on the page.
- **`Prose`** is a container only, renders no heading of its own, and cannot emit an `<h1>` — stated
  in the header comment, the `.d.ts` JSDoc and the `## Don't` list, because at 336-page scale that is
  Lock 1's failure mode on every page at once. Every descendant rule goes through `:where()`, so
  specificity stays at zero and a `bhc-` component dropped into the copy still wins.
- **`ProcessSteps` numerals come from the list's own ordinal** — `counter-reset` on the `<ol>`,
  `counter-increment` on the item, `content: counter()` on the disc. No step object carries a number.
  Verified in the built chunk: `counter-reset:bhc-step` and `counter-increment:bhc-step` both survive
  lightningcss.
- **`CTABand`** is the one dark band, navy by default, composing `SectionBand` rather than
  duplicating its padding logic. A `secondary` action on navy is **coerced to `ghost`**: outlined ink
  is 2.65:1 there, `ghost` is `currentColor`, which on navy is `--bhc-paper` at 5.97:1.
- **The two scoped focus overrides are the last section of `styles.css`**, under a banner instructing
  every later plan to append its component block above them. Both survive the build with specificity
  intact — confirmed by reading `.bhc-btn--primary:focus-visible{outline-color:var(--bhc-ink)}` and
  `.bhc-section--navy :focus-visible` back out of `web/.next/static/chunks/*.css`.
- **Zero packages installed.** `git diff design-system/package.json` is empty; the package still
  declares no dependencies and no build step.

## Task Commits

1. **Task 1: SectionBand and Prose** — `869c893` (feat)
2. **Task 2: ProcessSteps, CTABand and the two scoped focus overrides** — `5521803` (feat)

## Files Created/Modified

- `SectionBand/*` — **created.** The band rhythm wrapper. `TONES` maps `paper` to `''`; `WIDTHS`
  maps to the three shipped container classes; `HEADING_TAGS` selects the tag, never string
  concatenation.
- `Prose/*` — **created.** 68ch measure, `:where()` descendant rules, `.bhc-prose__pullquote` on a
  `--bhc-paper-tint` ground with a `--bhc-action` left border.
- `ProcessSteps/*` — **created.** Two forms: the bare `<ol>` when a `SectionBand` supplies the
  `<h2>`, and a `<section>` wrapper when `heading` is passed. Step titles step `h3 → h4` with
  `headingLevel`.
- `CTABand/*` — **created.** Composes `SectionBand`; throws on a missing `heading`; `variant`
  coercion on navy.
- `design-system/styles.css` — four new blocks plus the focus-override section, which is now the
  last section in the file. No literal hex in any of the four new blocks.
- `design-system/src/index.js` — four named exports, path `./components/<Name>/<Name>.jsx`.
- `design-system/.design-sync/config.json` — four entries in each of the two maps.
  `overrides.NAPFooter.cardMode` untouched.

## Decisions Made

- **`ProcessSteps` wraps the list in a `<section>` when it has a heading.** The plan specified root
  `<ol class="bhc-steps">`, and a heading cannot go inside an `<ol>`: its content model is `li`,
  `script` and `template` only, so the parser hoists a heading out of the list and takes the counter
  reset with it. The bare-`<ol>` root is preserved for the composed case (no `heading` prop), which
  is how UI-SPEC §4 and §9.2 actually place the component — inside a band that already owns the
  `<h2>`. Recorded as deviation 2 below.
- **`CTABand` composes `SectionBand`.** The plan said to compose the band "rather than duplicating
  its padding logic"; rendering `SectionBand` rather than re-declaring `bhc-section` is the strongest
  reading of that, and it means `--bhc-section-y` has exactly one declaration in the package.
- **A `secondary` on navy is coerced, not rendered.** The plan requires the second action to be
  `ghost`; a call site that passes `secondary` anyway would otherwise ship a button that is present
  in the DOM and absent on screen. `tone="tint"` leaves `secondary` alone, because it is correct
  there.
- **`Prose width="narrow"` is the wider of the two.** UI-SPEC §7.5 fixes the API as
  `'prose' | 'narrow'` but never says what `narrow` maps to. The only two locked measure tokens are
  `--bhc-container-prose` (68ch, ≈578px) and `--bhc-container-narrow` (800px), so `narrow` is
  necessarily wider than the default. Rather than invent a token or a literal measure, the mapping is
  kept and the trap is documented in three places — the `.d.ts`, the prompt doc, and the `## Don't`
  list. **Phase 5 should rename this prop**; it is the one place in these four components where the
  name says the opposite of what the value does.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] `.bhc-section__intro` is illegible on the navy band**

- **Found during:** Task 1
- **Issue:** The shipped `.bhc-section--navy :where(h1,h2,h3,h4)` rule flips **headings** to
  `--bhc-paper`, but `.bhc-section__intro` (added by plan 02-01) sets `color: var(--bhc-ink-muted)`
  directly. Measured from hex: `--bhc-ink-muted` on `--bhc-navy` is **1.10:1**. `CTABand` passes its
  `lead` straight into that class, and every page carries a `CTABand`, so the supporting line under
  the closing ask would have been invisible on all eighteen routes.
- **Fix:** Added `.bhc-section--navy .bhc-section__intro { color: var(--bhc-paper); }` (5.97:1) to
  the SectionBand block, with the measured ratio in the comment.
- **Files modified:** `design-system/styles.css`
- **Verification:** Rendered `CTABand` with a `lead` and confirmed it lands in
  `.bhc-section__intro` inside `.bhc-section--navy`; `npm run verify` exits 0.
- **Committed in:** `869c893`

**2. [Rule 1 - Bug] A heading inside an `<ol>` is invalid HTML and breaks the counter**

- **Found during:** Task 2
- **Issue:** The plan specifies `ProcessSteps` root as `<ol class="bhc-steps">` *and* a `heading`
  prop. `<ol>`'s content model is `li`, `script` and `template` only. A heading placed inside it is
  hoisted out by the HTML parser, which moves it out of the element carrying `counter-reset` — so the
  markup is invalid *and* the numerals the component exists to guarantee stop being guaranteed.
- **Fix:** The bare `<ol class="bhc-steps">` remains the root when no `heading` is passed (the
  composed case, which is how the component is placed in UI-SPEC §4 and §9.2). When a `heading` is
  passed, the list is wrapped in a `<section class="bhc-steps__band" aria-labelledby>` carrying the
  heading. Both forms are shown in the preview and the two-form table is in the `.prompt.md`.
- **Files modified:** `design-system/src/components/ProcessSteps/ProcessSteps.jsx`
- **Verification:** Both forms rendered; the no-heading form emits exactly one `<ol>`, three `<li>`
  and three `<h3>` as the acceptance criterion requires.
- **Committed in:** `5521803`

**3. [Rule 2 - Missing Critical] Heading font sizes were tag-scoped rather than set on the class**

- **Found during:** Task 1
- **Issue:** The plan asks for `.bhc-section__heading` at `var(--bhc-text-2xl)`. Set on the class,
  that renders a `headingLevel={3}` band's `<h3>` at the `<h2>` step, silently breaking UI-SPEC §3's
  binding table for every nested band — and `headingLevel` exists precisely so nested bands keep a
  legal outline.
- **Fix:** The class carries weight, leading and margin; `h2.bhc-section__heading` takes
  `--bhc-text-2xl` and `h3.bhc-section__heading` takes `--bhc-text-xl`. Same treatment for
  `.bhc-steps__title` (`h3` → xl, `h4` → lg).
- **Files modified:** `design-system/styles.css`
- **Verification:** Rendered `headingLevel: 3` and confirmed the `<h3 class="bhc-section__heading">`
  form; `npm run verify` exits 0.
- **Committed in:** `869c893` and `5521803`

**4. [Rule 3 - Blocking] The plan's `node --input-type=module -e "import … .jsx"` criteria are unrunnable**

- **Found during:** Tasks 1 and 2
- **Issue:** Four acceptance criteria are written as `node --input-type=module -e "import … .jsx"`.
  Node has no JSX loader in this repo — `ERR_UNKNOWN_FILE_EXTENSION` — which is the same property
  02-01 recorded as deviation 7 and STATE.md carries as a decision. The criteria could not be run
  verbatim.
- **Fix:** Ran the identical assertions (and a dozen more) through a throwaway probe that compiles
  each `.jsx` with Next's bundled SWC binding and renders with `react-dom/server`. Compiled output
  was mirrored under a scratch directory at the repo root, never inside `design-system/src`, so no
  lock walk could see it. The probe and every emitted file were deleted before each commit; nothing
  was added to the repo and no package was installed.
- **Files modified:** none (probe deleted)
- **Verification:** `ok` for both probe runs. Task 1: `tone="paper"` emits no modifier, `<h2>`
  present, the derived `aria-labelledby`/`id` pair matches, `tone="chartreuse"` produces no
  `undefined` and no modifier, `Prose` emits zero `<h1>`, `width="narrow"` and an unknown width both
  behave. Task 2: exactly one `<ol>`, three `<li>`, three `<h3>`, no digit in the rendered text,
  `headingLevel: 3` steps titles to `<h4>`, null step and action entries are filtered without
  throwing, `CTABand` is navy with no `bhc-btn--secondary`, a passed `secondary` is coerced to
  `ghost` on navy but survives on `tint`, an unknown tone degrades to navy, and a missing `heading`
  throws.
- **Committed in:** n/a — verification only

**5. [Rule 2 - Missing Critical] `CTABand` throws on a missing `heading`**

- **Found during:** Task 2
- **Issue:** UI-SPEC §7.10 marks `heading` required but nothing enforced it. A `CTABand` with no
  heading renders a full-height dark band containing two buttons and no ask, on every route,
  silently.
- **Fix:** Throws, following `Hero.jsx:33-35`'s precedent and Pattern S6 — fail at build time where
  one person sees it once, rather than on ~410 prerendered pages.
- **Files modified:** `design-system/src/components/CTABand/CTABand.jsx`
- **Verification:** Probe asserts the throw.
- **Committed in:** `5521803`

---

**Total deviations:** 5 auto-fixed (1 bug, 3 missing-critical, 1 blocking)
**Impact on plan:** No scope creep. Deviation 1 is the one worth carrying forward: it was found by
checking every colour these components set *directly* against `--bhc-navy`, and the same check should
run over `TrustBar`, `ReviewCard` and `StickyCallBar` in waves 3 and 4 — `RatingBadge` is already
known to fail it and is in three `## Don't` lists as a result.

## Issues Encountered

- **The plan's four `node -e "import … .jsx"` criteria cannot be run as written** (deviation 4).
  This is now the second plan in this phase to hit it. Every later plan writing a component
  behaviour check should assume the SWC-probe route or assert over built HTML.
- **Nothing renders these components yet**, so `check:html` exercises none of them. The four
  primitives are asserted by delta 9 (shape and registration), by the built-CSS read-back, and by the
  probe. Waves 4 and 5 are where they first appear in prerendered HTML.

## User Setup Required

None. Zero packages installed, consistent with T-02-23.

## Threat Flags

None. All four `mitigate` dispositions in this plan's register are implemented: T-02-19 (array props
default to `[]` and are `.filter(Boolean)`-guarded in both `ProcessSteps` and `CTABand`, probe-tested
with null entries), T-02-20 (the scoped `outline-color: var(--bhc-paper)` override, measured at
5.97:1 on navy), T-02-21 (every rule went into `design-system/styles.css`; SC-1b still reports one
built stylesheet), T-02-23 (zero packages; `git diff design-system/package.json` empty). T-02-22 is
`accept` and Lock 5 stays green over the new previews and CSS.

## Verification

- `npm run verify` — **exit 0.**
- `npm run test:locks` — **20/20**, delta 9 now covering eight component directories.
- `npm run check:html` — **30/30**.
- `npm run check:budget` — JS 129.8 KB / 500 KB (unchanged); CSS 3.1 → **3.3 KB** gzip;
  page 286.8 → **287.2 KB** / 1024 KB.
- Both directories per task hold exactly the four canonical files, `@dsCard group="Content"` on line
  1 of each `.html`, `category: Content` in each `.prompt.md`.
- `grep -c` on `.design-sync/config.json` → **2** for each of SectionBand, Prose, ProcessSteps,
  CTABand. `grep -c "export { X }" src/index.js` → **1** for each.
- No literal hex in any of the four new CSS blocks. `grep -c "bhc-section--paper"` → **0**.
- `grep -c "counter-increment\|counter-reset"` → **4** (≥2 required).
  `grep -c "outline-color: var(--bhc-paper)"` → **1**.
  `grep -c "outline-color: var(--bhc-ink)"` → **1**. Suppressing the outline appears **0** times.
- The focus-override banner is the last `/* --- ` section in `styles.css`.
- Read back out of `web/.next/static/chunks/*.css`: `counter-reset:bhc-step`,
  `counter-increment:bhc-step`, `.bhc-section--navy :focus-visible` and
  `.bhc-btn--primary:focus-visible{outline-color:var(--bhc-ink)}`.
- `git diff design-system/package.json` — empty.

## Next Phase Readiness

Waves 3 to 5 can compose from:

- `SectionBand` for every band, with `tone` taken from the table in `SectionBand.prompt.md` — that
  table is UI-SPEC §4's band ordering and is the reference for all seventeen routes.
- `Prose` for every run of body copy. It starts at `<h2>`; the page `<h1>` stays `Hero`'s.
- `ProcessSteps` with **no `heading` prop** when it sits inside a `SectionBand`, which is the
  composed case for home, service and `/get-a-quote`.
- `CTABand` as the last thing before the footer, once per page.

Two things later waves must not undo:

1. **The focus-override section stays last in `styles.css`.** Append component blocks above the
   banner. A block appended below it would sit after the overrides and could re-specify
   `outline-color` at equal specificity.
2. **Nothing that sets `--bhc-ink` or `--bhc-ink-muted` directly may go on a navy band.**
   `RatingBadge` is the known case (1.10:1 for its count line); `ProcessSteps`'s body copy is the
   second. Both are in `## Don't` lists.

One open item for Phase 5: `Prose`'s `width="narrow"` is wider than its default. The name is
UI-SPEC's; the mapping is the only one the locked token set allows. It is documented in three
places rather than silently renamed here.

## Self-Check: PASSED

All 16 created files exist on disk and all 3 modified files carry the changes claimed. Both commits
— `869c893` and `5521803` — are present in `git log`. `npm run verify` re-run at the end of
execution exits 0. No file deletions in either commit; working tree clean.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
