---
phase: 02-component-library-completion-core-templates
plan: 07
wave: 4
subsystem: ui
status: complete
tags: [design-system, trust, accessibility, zero-javascript, scroll-snap, empty-states, success-criterion-3]

# Dependency graph
requires:
  - phase: 02
    plan: 01
    provides: "the exported Star glyph on RatingBadge.jsx, and Button's variant/href API"
  - phase: 02
    plan: 05
    provides: "the four-file component contract, the focus-override banner that must stay last, the closed-accent-list reading that icons inherit --bhc-ink"
provides:
  - "TrustBar — three claims on three tones, with no navy member and no restatement of the rating"
  - "ReviewCard — the one Star glyph reused, no nested footer, no clamp, no link"
  - "ReviewRail — ROADMAP's answer to the 516 KB review widget: CSS scroll-snap, zero client bytes, null on empty data"
  - "BeforeAfterSlider — ROADMAP SC-3: two states, never null, data-bhc-photo-state=\"pending\" as the machine-readable half"
  - "The measured finding that the star glyph cannot be orange on --bhc-paper-tint (2.68:1)"
affects: [02-08, 02-11, 02-12, 02-13, 02-14, 02-15, phase-03-town-and-combo-templates, phase-04-photography-and-reviews]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern S1 four-part registration exercised four more times — delta 9 now covers eighteen component directories"
    - "The two-form component (bare element when composed, wrapper + heading when standalone) applied a third and fourth time"
    - "A focusable scroll track (tabindex=0 + role=group + aria-label) whose correctness is a property of what its children are NOT"
    - "An empty state that renders MORE rather than less, marked for machines by a data attribute"

key-files:
  created:
    - design-system/src/components/TrustBar/TrustBar.jsx
    - design-system/src/components/TrustBar/TrustBar.html
    - design-system/src/components/TrustBar/TrustBar.d.ts
    - design-system/src/components/TrustBar/TrustBar.prompt.md
    - design-system/src/components/ReviewCard/ReviewCard.jsx
    - design-system/src/components/ReviewCard/ReviewCard.html
    - design-system/src/components/ReviewCard/ReviewCard.d.ts
    - design-system/src/components/ReviewCard/ReviewCard.prompt.md
    - design-system/src/components/ReviewRail/ReviewRail.jsx
    - design-system/src/components/ReviewRail/ReviewRail.html
    - design-system/src/components/ReviewRail/ReviewRail.d.ts
    - design-system/src/components/ReviewRail/ReviewRail.prompt.md
    - design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.jsx
    - design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.html
    - design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.d.ts
    - design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.prompt.md
  modified:
    - design-system/styles.css
    - design-system/src/index.js
    - design-system/.design-sync/config.json

key-decisions:
  - "ReviewCard's stars inherit --bhc-ink rather than the orange RatingBadge uses: measured 2.68:1 for --bhc-action on --bhc-paper-tint, which fails 1.4.11's 3:1 for a graphic that carries meaning, against 13.85:1 for ink"
  - "TrustBar's tone lives on the <ul>, not on the wrapping <section> — the tone is the bar's ground, and an ink bar on a paper band is the case that makes them separate elements"
  - "role=group on ReviewRail's <ul> is accepted as specified, trading list semantics for a named scrollable region; the trade is recorded in the prompt doc rather than silently reversed"
  - "BeforeAfterSlider's track carries tabindex=0 in BOTH states and the See What's Included link sits in the figcaption outside it — the plan allowed either that or omitting tabindex, and doing both gives the keyboard-scrollable rail without the redundant tab stop"
  - "State A wraps its per-pair <figure> elements in a plain <div class=\"bhc-ba\"> rather than nesting figures inside a root figure"
  - "A pair whose before/after image has no alt text THROWS at build time rather than shipping an unlabelled photograph — the image lock scans previews only"
  - "The empty-state title is an <h3> in both forms, because this component always sits under a section <h2> supplied either by its own heading prop or by the SectionBand around it"

patterns-established:
  - "Pattern: when a component's a11y correctness depends on what its children are NOT, the coupling is written into BOTH prompt docs, from each side"
  - "Pattern: SVG a11y attributes are written out per element, never spread from a shared props object — the lock reads the opening tag as source text"

requirements-completed: []

# Metrics
duration: 41min
completed: 2026-08-09
---

# Phase 02 Plan 07: The Four Trust Components Summary

**The four Trust-group components now exist, and the one that matters most is the one that refuses
to disappear: `BeforeAfterSlider` renders a finished-looking, clearly labelled two-panel figure with
`data-bhc-photo-state="pending"` whenever no photography exists, so not one page in this project is
blocked waiting on the Canva originals pull.**

## Performance

- **Duration:** ~41 min
- **Started:** 2026-08-09T21:05Z
- **Completed:** 2026-08-09T21:46Z
- **Tasks:** 3
- **Files:** 19 (16 created, 3 modified)

## Accomplishments

- **ROADMAP Success Criterion 3 is met and is machine-checkable.** `BeforeAfterSlider({})`,
  `({pairs: []})`, `({pairs: undefined})`, `({pairs: null})` and `({pairs: [null]})` all render
  non-empty markup carrying `data-bhc-photo-state="pending"` — asserted for all five shapes. It is
  the only component in the package whose empty state renders *more* rather than nothing, and the
  header comment says so in those words.
- **Both placeholder panels are `role="img"` with distinct, non-empty `aria-label`s and neither
  carries `alt`.** The two labels differ (`Before — …` / `After — …`) so a screen-reader user knows
  which half of the comparison they are on. Delta 14 passes over both.
- **`BEFORE` and `AFTER` are real text in their own elements** in *both* states —
  `<p class="bhc-ba__label">BEFORE</p>` — never baked into an image. That is one of the two
  independent reasons the 199 existing Canva exports were rejected, and it is now impossible to
  reintroduce without deleting an element.
- **The `See What's Included` link is outside the focusable track, verified structurally.** The
  probe locates the track's opening tag, the `<figcaption>` that follows it, and the single `<a>`,
  and asserts the link index is *after* the track closes, that the track slice contains no `<a>`,
  and that nothing after the track carries `tabindex`. The track keeps `tabindex="0"` +
  `role="group"` + `aria-label`, so the two panes are still keyboard-scrollable below 768px.
- **`ReviewCard` imports the one `Star`.** `grep -c "import { Star }"` → **1**;
  `grep -c "M10 1.5l2.6"` → **0**. One path string, one file, as plan 02-01 intended when it
  exported it.
- **`ReviewRail` disappears cleanly and `ReviewCard` has no link.** `ReviewRail({reviews: []})`,
  `({reviews: [null, undefined]})` and `({reviews: [], town: 'Warwick'})` all return `null`;
  `ReviewCard` output contains no `<a>`, no `<footer>`, and exactly one `role="img"`.
- **`TrustBar` cannot be put on navy.** `grep -c "'navy'"` on the `.d.ts` → **0**;
  `tone="navy"` and `tone="nonsense"` both degrade to the default and emit no `bhc-trustbar--*`
  class at all. Three claims, three `<li>`, and no `4.9` or `175` anywhere in the output.
- **Every new SVG complies with delta 14 in source and in rendered output** — three TrustBar glyphs
  and five ReviewCard stars `aria-hidden="true" focusable="false"`, two BeforeAfterSlider panels
  `role="img"` + `aria-label`, zero `alt`.
- **Zero client boundaries.** No pointer listener, no drag handle, no arrow buttons. The comparison
  and the rail are both CSS `scroll-snap`. `check:html`'s SC-4g source scan over `design-system/src`
  stays green.
- **The focus-override section is still the last section in `styles.css`**, with three new blocks
  appended above the banner (order: … QuoteFormEntry | TrustBar | ReviewCard | ReviewRail |
  BeforeAfterSlider | Focus).
- **Zero packages installed.** `git diff design-system/package.json` is empty.

## Task Commits

1. **Task 1: TrustBar** — `af5b3f4` (feat)
2. **Task 2: ReviewCard and ReviewRail** — `da247b6` (feat)
3. **Task 3: BeforeAfterSlider — SC-3** — `3c8a08e` (feat)

## Files Created/Modified

- `TrustBar/*` — **created.** Two forms (`<section>` + `<h2>` + `<ul>`, or the bare `<ul>` when
  `heading={null}`). Three inline glyphs at 24px. `tone` is `paper | tint | ink`; `paper` maps to no
  modifier class, and the tone class sits on the `<ul>`. `items={[]}` renders `null`.
- `ReviewCard/*` — **created.** `<article>` → labelled star row → `<blockquote><p>` →
  `<p><cite>{author}</cite> · {town} · {date}</p>`. The meta half is assembled as one string, so a
  missing town or date leaves no orphan separator.
- `ReviewRail/*` — **created.** `null` on empty; `<section id="reviews">` → `<h2>` →
  `<ul class="bhc-reviewrail__track" tabindex="0" role="group" aria-label="…">`. `town` narrows both
  the default heading and the track's accessible name, and an explicit `heading` always wins.
- `BeforeAfterSlider/*` — **created.** Never `null`. Pending → root `<figure>` with the marker, two
  token-drawn panels, an `<h3>` empty-state title, the §5 body copy and one `Button` link. Live →
  one `<figure data-bhc-photo-state="live">` per pair with real images, real labels and a
  `<figcaption>` of `{room} · {service} · {town}`.
- `design-system/styles.css` — four new blocks above the focus-override banner. No literal hex in
  any of them.
- `design-system/src/index.js` — four named exports.
- `design-system/.design-sync/config.json` — four entries in each of the two maps.
  `overrides.NAPFooter.cardMode` untouched.

## Decisions Made

- **`ReviewCard`'s stars inherit `--bhc-ink`, not the orange the same glyph takes in `RatingBadge`.**
  Two independent arguments land in the same place. (1) The accent's reserved-for list in UI-SPEC §4
  is closed and names *RatingBadge's* star fill — the reading plan 02-05 already applied to card
  icons. (2) Measured on this card's `--bhc-paper-tint` ground, `--bhc-action` is **2.68:1**, below
  the 3:1 that WCAG 1.4.11 requires of a graphic carrying meaning; `--bhc-ink` is **13.85:1**. The
  badge keeps its orange because on white the same pairing is 3.05:1 and passes. The preview renders
  the failing version once, labelled, so the difference is recognisable rather than re-derivable.
- **`TrustBar`'s tone lives on the `<ul>`, not on the wrapping `<section>`.** An ink bar sitting on a
  paper band is precisely the case that makes the two separate elements worth having; putting the
  ground on the section would colour the heading with it and collapse the distinction. It also keeps
  the tone class a `bhc-trustbar--*` modifier of the `bhc-trustbar` block rather than of `__band`.
- **`role="group"` on `ReviewRail`'s `<ul>` is accepted as the contract specifies it.** It costs the
  list its `list`/`listitem` semantics. UI-SPEC §7.14 and 02-RESEARCH both state it explicitly and
  cite axe's `scrollable-region-focusable` rule, and a scrollable rail is a *region* before it is a
  list — the accessible name is what tells a keyboard user what they have landed on. The trade is
  written into `ReviewRail.prompt.md` rather than silently reversed.
- **`BeforeAfterSlider` does both halves of the plan's either/or.** The plan permitted putting the
  link outside the track *or* omitting `tabindex` on the track. Doing both keeps the two panes
  keyboard-scrollable below 768px (which omitting `tabindex` would have cost) while producing no
  redundant tab stop. `overflow-x` returns to `visible` at 768px so a non-scrolling container does
  not clip a focus ring.
- **State A wraps its pairs in a plain `<div class="bhc-ba">` rather than nesting figures.** The plan
  describes a root `<figure class="bhc-ba">` *and* one `<figure data-bhc-photo-state="live">` per
  pair; with more than one pair those two statements can only both hold as nested figures, and an
  outer figure with no caption of its own carries no meaning. In the pending state the root *is* the
  figure, exactly as specified. `.bhc-ba` styles both.
- **The empty-state title is an `<h3>` in both forms.** This component always sits under a section
  `<h2>` — its own when `heading` is passed, the `SectionBand`'s when it is not, which is how all
  seven Phase 2 pages compose it. One code path rather than a level-shifting branch.
- **`intro` produces the wrapping `<section>` on its own**, without a heading, and
  `aria-labelledby` is only wired when there is an `<h2>` to point at. An intro passed without a
  heading would otherwise have been silently dropped.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The plan's `node --input-type=module -e "import … .jsx"` criteria are unrunnable**

- **Found during:** Tasks 1, 2 and 3
- **Issue:** Four acceptance criteria are written as `node --input-type=module -e "import … .jsx"`.
  Node has no JSX loader in this repo (`ERR_UNKNOWN_FILE_EXTENSION`). **This is the fourth
  consecutive plan to hit it**, after 02-01, 02-04 and 02-05.
- **Fix:** Ran the identical assertions, and 150 more, through a throwaway probe that compiles
  `design-system/src` with Next's bundled SWC binding (`await loadBindings()` first —
  `getBindingsSync()` throws `bindings not loaded yet` — and `jsc.transform.react.runtime:
  'automatic'`, without which every module throws `React is not defined`) and renders with
  `react-dom/server`. `.jsx` import specifiers are rewritten to `.js` in the emitted output so the
  extension-always-written convention still resolves. The probe lived at the repo root, outside
  `design-system/src`, `web/app` and `web/content`, so no lock walk could see it, and it was deleted
  before the final commit.
- **Files modified:** none (probe deleted)
- **Verification:** `ok` on all three runs — 36 assertions for task 1, 53 for task 2, 80 for task 3.
  Every criterion the plan states is among them, run verbatim in substance.
- **Committed in:** n/a — verification only

**2. [Rule 2 - Missing Critical] A pair with no `alt` text throws rather than rendering**

- **Found during:** Task 3
- **Issue:** The plan states "Each `<img>` requires a non-empty `alt` (Lock 7)". Lock 7 walks
  **previews only** (`.html` under `src`), so it cannot see a Phase 4 data module that omits `alt`.
  Nothing else in the suite scans built HTML for `<img>` alt text either. An unlabelled photograph
  would have shipped on up to seven templates with every gate green.
- **Fix:** `Pair` throws with a named message when `before.alt` or `after.alt` is missing or empty —
  the `Hero.jsx:33-35` "fail loudly at build time" precedent, and the same philosophy delta 13
  applies to `toDial`. The requirement is stated in the `.d.ts` JSDoc on `ResponsiveImage.alt`.
  Nothing in Phase 2 passes `pairs`, so the blast radius today is zero and the guard is in place
  before the data exists.
- **Files modified:** `design-system/src/components/BeforeAfterSlider/BeforeAfterSlider.jsx`
- **Verification:** Probe asserts a pair with `before: { src }` and no `alt` fails the render.
- **Committed in:** `3c8a08e`

**3. [Rule 2 - Missing Critical] `TrustBar` and `ReviewCard` return `null` on empty or malformed data**

- **Found during:** Tasks 1 and 2
- **Issue:** Neither is listed in UI-SPEC §11's empty-state table, but `items` and `review` are both
  props: `TrustBar({items: []})` would have rendered a heading above an empty bar, and
  `ReviewCard({review: null})` would have thrown on destructuring — inside a `.map` in the root
  layout's page tree, which takes the whole route rather than one card.
- **Fix:** `TrustBar` filters nulls and returns `null` when nothing survives; `ReviewCard` returns
  `null` for a missing review. Both `.d.ts` return types are `JSX.Element | null` accordingly.
- **Files modified:** `TrustBar.jsx`, `TrustBar.d.ts`, `ReviewCard.jsx`, `ReviewCard.d.ts`
- **Verification:** Probe asserts all four shapes.
- **Committed in:** `af5b3f4`, `da247b6`

**4. [Rule 1 - Bug] The shield glyph's path data matched the "does not restate the rating" check**

- **Found during:** Task 1
- **Issue:** The plan's criterion is `if (/4\.9|175/.test(h))`. The first shield path was
  `…-4.1-1.1-7-4.9-7-9.2V6l7-2.8z`, whose coordinates contain the literal substring `4.9`. The
  assertion failed on a coincidence in vector data rather than on any restatement of the rating.
- **Fix:** The coordinate was redrawn to `-7-5-7-9.2` in both the `.jsx` and the preview. The glyph
  is visually unchanged; the check now tests what it means to test.
- **Files modified:** `TrustBar.jsx`, `TrustBar.html`
- **Verification:** `grep -c "4.9"` → 0 in both files; the criterion passes.
- **Committed in:** `af5b3f4`

**5. [Rule 3 - Blocking] An explanatory comment in `TrustBar.jsx` matched delta 14**

- **Found during:** Task 1
- **Issue:** The header comment explaining *why* the SVG attributes are written out per element
  contained the sequence `<svg>` and an example of the defective spread form. Delta 14's extractor
  is `/<svg\b[^>]*>/g` over raw source, so it matched the comment and failed the file it was
  explaining. `npm run test:locks` went 19/20 with the error naming `TrustBar.jsx`.
- **Fix:** The `.jsx` comment now states only that the attributes are written out and that the full
  explanation is in the prompt doc; `TrustBar.prompt.md` carries the defective form, since no
  scanner reads `.prompt.md`. This is the **sixth** time this phase has had to route an explanation
  around the scan that polices it, and the first time inside a component's own header comment.
- **Files modified:** `TrustBar.jsx`, `TrustBar.prompt.md`
- **Verification:** `npm run test:locks` 20/20.
- **Committed in:** `af5b3f4`

**6. [Rule 2 - Missing Critical] `intro` alone no longer disappears, and `aria-labelledby` never dangles**

- **Found during:** Task 3
- **Issue:** The first cut rendered `intro` only inside the heading branch, so
  `BeforeAfterSlider({intro})` with no heading silently dropped it, and the wrapper's
  `aria-labelledby` would have pointed at an id that did not exist if it had been rendered.
- **Fix:** The wrapper is produced by `heading || intro`; the `<h2>` and `aria-labelledby` are
  produced by `heading` alone.
- **Files modified:** `BeforeAfterSlider.jsx`
- **Verification:** Probe asserts the intro-only form renders the band, renders no `<h2>`, and
  carries no `aria-labelledby`.
- **Committed in:** `3c8a08e`

---

**Total deviations:** 6 auto-fixed (4 missing-critical, 1 bug, 2 blocking — deviation 1 and 5 both blocking)
**Impact on plan:** No scope creep. Deviations 1 and 5 are both standing properties of this repo
rather than findings; deviation 4 is a caution for any future criterion that regexes rendered markup
for bare digits.

## Issues Encountered

- **The plan's task 3 acceptance criterion says delta 9 should pass "over twelve component
  directories" at this point.** It is **eighteen**. Fourteen shipped before this plan (plan 02-05's
  summary records twelve, and 02-06's wave added none — the count in this plan's criterion appears
  to have been carried forward from 02-05 without adding this plan's four). Nothing is wrong: delta 9
  has no hardcoded count, only a floor of 6, and it passes over all eighteen. Recorded so 02-14 raises
  the preview floor against a real number.
- **`Star` is exported but `RatingBadge.jsx` is imported for it**, which pulls `jsonLd.js` into
  `ReviewCard`'s module graph even though `ReviewCard` emits nothing. Harmless (both are tiny, both
  are server-only, and the built JS figure is unchanged at 129.8 KB), and the alternative — a
  `Star.jsx` sibling — would move a shipped file. Noted rather than acted on.
- **The apostrophe in `See What's Included` serialises as `&#x27;`** in the rendered output, because
  React escapes it. That is true of every CTA label on the site once 02-11 passes them as props, so
  it is consistent — but a future lock that greps built HTML for that label must account for it.

## User Setup Required

None. Zero packages installed, consistent with T-02-40.

## Known Stubs

None that block this plan's goal.

`BeforeAfterSlider`'s pending state is **not** a stub — it is the specified, shipped behaviour of
ROADMAP SC-3, it is complete against UI-SPEC §7.16, and it renders finished copy rather than a
promise. Phase 4 supplies `pairs` and the marker flips to `live`; that hand-off is written into the
component's prompt doc and its `.d.ts`.

`ReviewRail` returning `null` without data is likewise the specified behaviour (UI-SPEC §11), not a
stub — no template will show an empty rail, and no invented testimonials were seeded to make the
`#reviews` anchor resolve.

## Threat Flags

None. Every `mitigate` disposition in this plan's register is implemented:

- **T-02-35** (externally-sourced review text) — the quote renders as React children, so it is
  escaped; neither component emits JSON-LD, so no review string reaches a script context.
  `grep -c "ld+json\|safeJsonLd\|JSON.stringify"` → **0** on both `ReviewCard.jsx` and
  `ReviewRail.jsx`.
- **T-02-36** (a review containing an address) — the 320-character data-layer cap and the privacy
  obligation are both written into `ReviewCard.d.ts`'s `quote` JSDoc as Phase 4 data-contract
  obligations; Lock 5 passes over all four new components and the built-HTML postcode scan is green.
- **T-02-37** (unlabelled placeholder SVG) — both panels carry `role="img"` and a distinct non-empty
  `aria-label`, and neither carries `alt`. Delta 14 passes over all ten new SVGs.
- **T-02-38** (a drag handle introducing a client boundary) — no pointer listener anywhere; the
  comparison is CSS `scroll-snap` only. `check:html`'s SC-4g source scan over `design-system/src` is
  green.
- **T-02-40** — zero packages; `git diff design-system/package.json` empty.

T-02-39 is `accept` and unchanged: no external image host is a Phase 2 input.

## Verification

- `npm run verify` — **exit 0.**
- `npm run test:locks` — **20/20**, delta 9 now covering **eighteen** component directories, delta 14
  over ten new SVGs (3 TrustBar glyphs, 5 ReviewCard stars, 2 BeforeAfterSlider panels) plus the
  preview copies.
- `npm run check:html` — **30/30**.
- `npm run check:budget` — JS 129.8 KB / 500 KB (**unchanged**); CSS 3.8 → **4.2 KB** gzip;
  page 287.7 → **288.1 KB** / 1024 KB.
- Probe, task 1 — **36 assertions**: three `<li>`, all three claims, no `4.9`/`175`, derived heading
  id wired to `aria-labelledby`, all three tones, `navy` and an unknown value both degrading with no
  modifier class emitted, both forms, `className` placement in each, empty and all-null `items`, an
  item with no icon, all three glyphs hidden and `alt`-free, no link, no structured data.
- Probe, task 2 — **53 assertions**: no `<footer>`, exactly one `role="img"`, `<blockquote>` and
  `<cite>` present, **no `<a>`**, the attribution shape with and without a town, the label with and
  without a source, `review: null`, rounding at 4.6, five hidden stars; `null` on empty/all-null/
  town-with-empty, `tabindex="0"` + `role="group"` + a non-empty `aria-label` all on the track,
  `id="reviews"` by default and overridable, `aria-labelledby` resolving to an id that exists, three
  items and three cards, `town` narrowing both strings, an explicit heading winning, a null entry
  filtered, no link and no structured data.
- Probe, task 3 — **80 assertions**: the pending marker for all five empty shapes and never `null`;
  exactly two panels, both `role="img"` with distinct non-empty labels and no `alt`; `BEFORE` and
  `AFTER` as real text in their own elements in both states; the `<h3>` title and the §5 body copy
  verbatim; **the link's index is after the track closes, the track slice contains no `<a>`, and
  nothing after the track carries `tabindex`**; exactly one link, to `/checklist`; no debt marker in
  the rendered copy; `data-bhc-photo-state="live"` with two lazy `decoding="async"` images carrying
  no `fetchPriority` and non-empty `alt`; the caption with and without a town; two pairs producing
  two live figures; a pair with no `alt` throwing; the banded, intro-only and bare forms with
  `className` in the right place each time.
- `grep -c "import { Star }" ReviewCard.jsx` → **1**; `grep -c "M10 1.5l2.6"` → **0**.
- `grep -c "line-clamp" styles.css` → **0**. `grep -c "scroll-snap-type"` → **1**
  (`.bhc-reviewrail__track`), plus `.bhc-ba__track`'s — **2** occurrences of the declaration in the
  built stylesheet. `grep -c "scroll-padding-inline"` → **2**.
- `grep -c "'navy'" TrustBar.d.ts` → **0**.
- `grep -ci "coming soon\|TBD\|placeholder text\|not yet implemented"` → **0** on
  `BeforeAfterSlider.jsx` and `.html`. `grep -ci "placeholder"` → **0** on both as well; the word
  appears only in the prompt doc, as the plan permits.
- No literal hex in any of the four new CSS blocks. The focus-override banner is the last
  `/* --- ` section in the file.
- Read back out of `web/.next/static/chunks/*.css`:
  `bhc-trustbar--ink{background:var(--bhc-ink);color:var(--bhc-paper)}`,
  `bhc-trustbar--ink .bhc-trustbar__icon{color:var(--bhc-sponge)}`,
  `scroll-snap-type:x mandatory` twice, and
  `bhc-ba__label{font-size:var(--bhc-text-xs);…text-transform:uppercase;letter-spacing:.08em;color:var(--bhc-ink-muted);margin:0}`.
- `git diff design-system/package.json` — empty. No file deletions in any of the three commits.

## Next Phase Readiness

Wave 4 and 5 can compose from:

- `TrustBar` inside a `SectionBand tone="paper"` with **no `heading` prop** — the band supplies the
  `<h2>` `Why people book us again`, exactly as `FAQAccordion` is placed.
- `ReviewRail` with `reviews={[]}` on every template. It renders nothing, and Phase 4 changes a data
  file rather than eight templates.
- `BeforeAfterSlider` with **no `pairs` prop** inside a `SectionBand tone="paper"` carrying
  `The difference, on real jobs`. That is SC-3, and plan 02-13's delta 8 asserts it on `/` and the
  six service pages.
- `ReviewCard` is not composed directly by any template — `ReviewRail` owns it.

Five things later waves must not undo:

1. **The focus-override section stays last in `styles.css`.** Ten blocks now sit above the banner.
2. **Nothing links to `#reviews` until Phase 4.** The rail renders `null`, delta 6 checks only
   `href^="/"`, and nothing would catch the dead anchor.
3. **No link may be added inside `ReviewCard`.** It is what makes the rail's `tabindex="0"` correct
   rather than a redundant tab stop, and the same rule governs `BeforeAfterSlider`'s track.
4. **`BeforeAfterSlider` must never be made to return `null`.** That is the whole of SC-3.
5. **`TrustBar` gains no navy tone and no fourth claim**, and does not restate the rating.

The carried-forward direct-colour check from plan 02-04 is now closed for two of its three names:
**TrustBar** sets `--bhc-paper` and `--bhc-sponge` only on its own `--bhc-ink` ground and is in its
`## Don't` list as navy-forbidden; **ReviewCard** sets `--bhc-ink` and `--bhc-ink-muted` directly and
is likewise. `ReviewRail` sets no colour of its own. **StickyCallBar** is the one name still
outstanding.

## Self-Check: PASSED

All 16 created files exist on disk and all 3 modified files carry the changes claimed. All three
commits — `af5b3f4`, `da247b6` and `3c8a08e` — are present in `git log`. `npm run verify` re-run at
the end of execution exits 0 (20 lock tests, 30 built-HTML locks, budget green). No file deletions in
any commit. The probe harness was deleted; `git status` shows only this summary and the state files.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
