---
phase: 02-component-library-completion-core-templates
plan: 01
subsystem: ui
tags: [design-system, react-server-components, accessibility, json-ld, seo, css-tokens]

# Dependency graph
requires:
  - phase: 01-platform-foundation-design-system-integration
    provides: the six shipped components, the 14-test lock suite, the 21-assertion built-HTML gate, tokens.css
provides:
  - "design-system/src/phone.js — CANONICAL_PHONE, the single executable occurrence of the number"
  - "toDial/formatPhone that throw a TypeError instead of degrading to tel:+44"
  - "Breadcrumbs that marks exactly one crumb current at any trail length, with list semantics intact"
  - "Star exported from RatingBadge for ReviewCard to reuse"
  - "as?: ElementType on Button, defaulting to 'a'"
  - ".bhc-section__intro — the named intro class that replaces the .bhc-hero__lead borrow"
  - "Corrected .bhc-interlink__heading at --bhc-text-2xl, the <h2> size the 16 new components inherit"
affects: [02-02, 02-03, 02-04, component-authoring, phase-03-town-and-combo-templates]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern S5 phone single-sourcing, now enforced by a package-internal constant"
    - "Pattern S6 fail loudly at build time — toDial throws rather than prerendering a dead tel:"
    - "Package-internal .js modules are not re-exported from src/index.js (jsonLd.js precedent, now phone.js)"

key-files:
  created:
    - design-system/src/phone.js
  modified:
    - design-system/src/components/NAPFooter/formatPhone.js
    - design-system/src/components/NAPFooter/NAPFooter.jsx
    - design-system/src/components/NAPFooter/NAPFooter.d.ts
    - design-system/src/components/NAPFooter/NAPFooter.prompt.md
    - design-system/src/components/Breadcrumbs/Breadcrumbs.jsx
    - design-system/src/components/Breadcrumbs/Breadcrumbs.html
    - design-system/src/components/Breadcrumbs/Breadcrumbs.d.ts
    - design-system/src/components/Breadcrumbs/Breadcrumbs.prompt.md
    - design-system/src/components/RatingBadge/RatingBadge.jsx
    - design-system/src/components/RatingBadge/RatingBadge.d.ts
    - design-system/src/components/Button/Button.jsx
    - design-system/src/components/Button/Button.d.ts
    - design-system/src/components/InterlinkBlock/InterlinkBlock.jsx
    - design-system/src/components/Hero/Hero.prompt.md
    - design-system/styles.css
    - design-system/test/locks.test.js
    - docs/design/design-system.md
    - web/app/layout.jsx

key-decisions:
  - "Explicitly-international phone values are exempt from the national-length check — their length is not this package's to police, and rejecting them would undo CR-04's no-fabricated-+44 fix"
  - "The scheme-guarded mapsUrl feeds schema sameAs as well as the rendered link; an origin Google is told the business also lives at is a claim, not decoration"
  - "The Lock 4 parity test was narrowed in place rather than split, holding the suite at 14 tests so MIN_TESTS stays untouched until plan 02-03"
  - "Finding 3 resolved in favour of styles.css being the deviation: .bhc-interlink__heading moves xl -> 2xl to match UI-SPEC §3's <h2> assignment"
  - "Finding 11 resolved yes: Button gains as?: ElementType even though it is not one of the sixteen, because §13-J scopes the rule to link-bearing components and Button is one"

patterns-established:
  - "Pattern: package-internal constants live in a plain .js module with a header stating both reasons it is not a .jsx, and are deliberately absent from src/index.js"
  - "Pattern: aria-current='page' is a last-crumb-only branch, never a fallback for a missing href"
  - "Pattern: JSON-LD URLs are resolved with new URL(href, siteUrl), never concatenated"
  - "Pattern: a source scan that greps the whole file also greps its comments — never name a banned identifier in prose inside a scanned file"

requirements-completed: []

# Metrics
duration: 32min
completed: 2026-08-09
---

# Phase 02 Plan 01: Foundation Hardening Summary

**The canonical phone number now exists once in executable code and an unrenderable value throws at build time instead of prerendering `tel:+44`; Breadcrumbs marks exactly one crumb current at any trail length with its `<ol>` semantics restored; and three token deviations are corrected before sixteen new components inherit them.**

## Performance

- **Duration:** ~32 min
- **Started:** 2026-08-09T18:28Z
- **Completed:** 2026-08-09T19:00Z
- **Tasks:** 3
- **Files modified:** 18 (1 created, 17 modified)

## Accomplishments

- **WR-14 / §7.0 phone single-sourcing.** `design-system/src/phone.js` exports `CANONICAL_PHONE`. The comment-stripped executable scan across `phone.js`, `NAPFooter.jsx` and `formatPhone.js` returns exactly **1** occurrence of the number, down from 3.
- **Delta 13 / degradation closed.** `toDial` throws a `TypeError` on a non-string, a digit-free value, or a UK national part that is not exactly ten digits. `formatPhone` inherits the throw. Seven inputs that previously rendered `tel:+44` — `''`, `undefined`, `null`, `'+44'`, `'call us'`, `'0786193653'`, `'078619365333'` — now fail the build. The CR-04 parity invariant still holds for all five renderable inputs.
- **WR-10 closed.** `mapsUrl` is scheme-tested against `^https?://`; a failing value drops the whole "Find us on Google" block and is excluded from schema `sameAs`. The surviving link pairs `target="_blank"` with `rel="noopener noreferrer"` — the previous `rel="noopener"` alone was inert.
- **WR-12 + §13-R closed.** `aria-current="page"` applies on `isLast` only. A three-crumb trail with an href-less middle crumb renders exactly one `aria-current` (verified by rendering the component). The `<li>` inline `display: contents` is gone, so Chrome and Safari keep the `ol`/`li` relationship that makes a trail announceable; the spacing moved to a `.bhc-breadcrumbs__list li` CSS rule.
- **Three token deviations corrected** before the sixteen new components are authored: `.bhc-interlink__heading` xl → 2xl, a real `.bhc-section__intro` replacing InterlinkBlock's `.bhc-hero__lead` borrow, and the breadcrumb list layout in CSS rather than an inline style.
- **`Star` exported** so `ReviewCard` reuses the glyph rather than copying its path data; **`as?: ElementType`** added to `Button` per §13-J with the `<button>` branch untouched.
- **Heading docs reconciled.** `Hero.prompt.md`'s four-row table now matches UI-SPEC §5's deck, and `docs/design/design-system.md`'s Service example drops the redundant word *Services*.

## Task Commits

1. **Task 1: Single-source the phone number, make toDial fail loudly, narrow Lock 4** — `de3f9f3` (fix)
2. **Task 2: Fix Breadcrumbs for 17-page scale, correct three styles.css deviations** — `2efdc4f` (fix)
3. **Task 3: Export Star, add `as` to Button, remediate the heading docs** — `aa15070` (feat)

## Files Created/Modified

- `design-system/src/phone.js` — **created.** `CANONICAL_PHONE`; package-internal, absent from `src/index.js`, header states both reasons it is a `.js`.
- `design-system/src/components/NAPFooter/formatPhone.js` — `toDial` throws; `describe`/`reject` helpers quote the offending value without the banned serialiser; header records the third (degradation) leak.
- `design-system/src/components/NAPFooter/NAPFooter.jsx` — imports `CANONICAL_PHONE`, derives `safeMapsUrl`, guards both the link and `sameAs`.
- `design-system/src/components/NAPFooter/NAPFooter.d.ts` — `phone`/`mapsUrl` contracts documented; `toDial` declared (it was re-exported but untyped).
- `design-system/src/components/NAPFooter/NAPFooter.prompt.md` — new sections on single-sourcing, the throw, and the Maps guard; three new `## Don't` entries.
- `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx` — last-crumb-only `aria-current`, no inline style, index-prefixed key, `new URL` for the JSON-LD item.
- `design-system/src/components/Breadcrumbs/Breadcrumbs.html` — two-crumb Service trail, no inline styles, caption rewritten.
- `design-system/src/components/Breadcrumbs/Breadcrumbs.d.ts` / `.prompt.md` — aria-current rule, the two-crumb Service trail and its Phase-3 reinstatement note.
- `design-system/src/components/RatingBadge/RatingBadge.jsx` / `.d.ts` — `Star` exported and declared.
- `design-system/src/components/Button/Button.jsx` / `.d.ts` — `as: As = 'a'` on the href branch; `import type { ElementType, ReactNode }`.
- `design-system/src/components/InterlinkBlock/InterlinkBlock.jsx` — intro uses `.bhc-section__intro`.
- `design-system/src/components/Hero/Hero.prompt.md` — heading deck replaced, with the reason both rows changed.
- `design-system/styles.css` — breadcrumb `li` rule + WR-12 banner, `.bhc-section__intro`, interlink heading 2xl + banner note.
- `design-system/test/locks.test.js` — Lock 4 parity test narrowed in place; test count unchanged at 14.
- `docs/design/design-system.md` — Service `H1` example wording.
- `web/app/layout.jsx` — de-line-numbered the stale `NAPFooter.jsx:33` reference (see deviation 3).

## Decisions Made

- **Non-UK numbers are exempt from the length check.** The throw fires on the UK branches only. Rejecting `+1 415 555 2671` would have re-broken CR-04's guarantee that an explicit country code is taken at its word, and the line-75 lock test asserts exactly that.
- **The guarded `mapsUrl` also feeds `sameAs`.** The plan only required guarding the rendered link. Extending it to the schema costs nothing and closes the same trust boundary on the JSON-LD side.
- **PATTERNS finding 3 resolved against `styles.css`.** UI-SPEC §3's parenthetical "(already)" was wrong; the stylesheet was the deviation, and it is corrected rather than propagated.
- **PATTERNS finding 11 resolved yes.** `Button` takes `as` despite not being one of the sixteen: §13-J is scoped by "link-bearing", not by "new".

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] The JSON-LD lock scan matched my own comment**
- **Found during:** Task 1
- **Issue:** `locks.test.js` fails any file under `src/` containing the raw JSON serialiser's name. It is a substring scan over the whole file, so a comment explaining *why the serialiser was avoided* tripped it — the test went red on code that was correct.
- **Fix:** Reworded the comment to describe the identifier without writing it, and recorded in the comment itself that an earlier draft of that very comment is what the scan caught.
- **Files modified:** `design-system/src/components/NAPFooter/formatPhone.js`
- **Verification:** `npm run test:locks` 14/14.
- **Committed in:** `de3f9f3`

**2. [Rule 2 - Missing Critical] `toDial` was re-exported but had no type declaration**
- **Found during:** Task 1
- **Issue:** `NAPFooter.jsx` re-exports `toDial`, but `NAPFooter.d.ts` declared only `formatPhone`. Consumers of a function that now throws had no documented contract for when it throws.
- **Fix:** Added `export declare function toDial(value: string): string;` with the rejection rules in its JSDoc.
- **Files modified:** `design-system/src/components/NAPFooter/NAPFooter.d.ts`
- **Verification:** Declaration matches the runtime export; `npm run verify` exits 0.
- **Committed in:** `de3f9f3`

**3. [Rule 1 - Bug] Stale line-number reference in `web/app/layout.jsx`**
- **Found during:** Task 1
- **Issue:** The layout header said the canonical number lives "as the package default at `NAPFooter.jsx:33`". It was already off by one before this plan (PATTERNS finding 2) and Task 1 moved the line again. `layout.jsx` is not in `files_modified`, but PATTERNS finding 2 explicitly requires updating it in the same change.
- **Fix:** De-line-numbered it — the comment now points at `src/phone.js`, which is where the number actually lives after this plan.
- **Files modified:** `web/app/layout.jsx`
- **Verification:** Comment-only change; `npm run build` and all 21 built-HTML locks pass.
- **Committed in:** `de3f9f3`

**4. [Rule 2 - Missing Critical] Guarded `mapsUrl` extended to schema `sameAs`**
- **Found during:** Task 1
- **Issue:** The plan guarded the rendered href only. The same unvalidated value was still serialised into `sameAs`, i.e. published as an assertion that the business also exists at that origin.
- **Fix:** `sameAs` now derives from `safeMapsUrl`.
- **Files modified:** `design-system/src/components/NAPFooter/NAPFooter.jsx`
- **Verification:** With no `mapsUrl` passed (the app's case) the emitted schema is byte-identical; 21/21 built-HTML locks pass.
- **Committed in:** `de3f9f3`

**5. [Rule 1 - Bug] `Breadcrumbs.jsx` comment tripped its own acceptance grep**
- **Found during:** Task 2
- **Issue:** The acceptance criterion is `grep -c "display: 'contents'" Breadcrumbs.jsx` → 0. My WR-12 explanatory comment quoted the JS object form verbatim and returned 1.
- **Fix:** Reworded to "an inline display-contents style". Same information, no literal match.
- **Files modified:** `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx`
- **Verification:** Grep returns 0.
- **Committed in:** `2efdc4f`

**6. [Rule 1 - Bug] `Hero.prompt.md` rationale tripped its own acceptance grep**
- **Found during:** Task 3
- **Issue:** The criterion is `grep -c "You Can Actually Rely On" Hero.prompt.md` → 0. My paragraph explaining *why the Home row changed* quoted the retired heading and returned 1.
- **Fix:** Described the old heading's defect without reproducing it.
- **Files modified:** `design-system/src/components/Hero/Hero.prompt.md`
- **Verification:** Grep returns 0.
- **Committed in:** `aa15070`

**7. [Rule 3 - Blocking] The plan's Breadcrumbs and Button behaviour checks are unrunnable as written**
- **Found during:** Task 2
- **Issue:** Three acceptance criteria are `node --input-type=module -e "import … .jsx"`. Node has no JSX loader — `ERR_UNKNOWN_FILE_EXTENSION` — which is the same property the package documents about `node --test`. The criteria could not be executed verbatim.
- **Fix:** Ran the identical assertions through a throwaway probe that compiles the `.jsx` with Next's bundled SWC binding and renders with `react-dom/server`. The probe and its outputs were deleted before commit; nothing was added to the repo, and no package was installed.
- **Files modified:** none (probe deleted)
- **Verification:** `breadcrumbs ok` (exactly 1 `aria-current`, plain `<li>`, `"item":"https://www.beyondhousecleaning.com/"`), `button ok` (default `<a>`, `as="span"` honoured, `<button>` branch unchanged), `Star export: function`.
- **Committed in:** n/a — verification only

**8. [Rule 3 - Blocking] `.bhc-breadcrumbs__list` already existed**
- **Found during:** Task 2
- **Issue:** The plan says to add the `.bhc-breadcrumbs__list` flex block; it was already present at `styles.css:188` (and carries `font-size`/`color` the plan's version omitted). Adding it would have duplicated the rule and dropped two declarations.
- **Fix:** Kept the shipped rule, added only the missing `.bhc-breadcrumbs__list li` rule and the WR-12 banner comment.
- **Files modified:** `design-system/styles.css`
- **Verification:** `npm run verify` exits 0; the built page still renders one `bhc-interlink__list`.
- **Committed in:** `2efdc4f`

---

**Total deviations:** 8 auto-fixed (3 bugs, 3 missing-critical, 2 blocking)
**Impact on plan:** No scope creep. Three of the eight are the same class of defect — an explanatory comment matching the grep that polices it — which is worth carrying into later waves, since deltas 9, 13 and 14 all add scanners of exactly this shape.

## Issues Encountered

- **Node cannot import `.jsx`.** Three of the plan's acceptance commands assume a JSX loader that this repo deliberately does not have. Resolved by compiling through Next's bundled SWC binding in a throwaway probe (deviation 7). Later plans writing behaviour checks against components should either assert over built HTML or use the same SWC route; a plain `node -e "import …jsx"` will always fail here.
- **`@next/swc-darwin-arm64`'s `transformSync` is a three-argument napi function** — `(source, isModule, Buffer.from(optionsJson))`, not `(source, options)`. The one-argument form fails with `BooleanExpected`.

## User Setup Required

None — no external service configuration required. This plan installed zero packages, consistent with T-02-07.

## Threat Flags

None. The three `mitigate` dispositions in this plan's register that land in package code (T-02-01, T-02-02, T-02-03) are implemented; T-02-04 and T-02-05 are implemented in Breadcrumbs and the lock suite respectively; T-02-06 is `accept` and Lock 5 still passes over the new CSS. No new network endpoint, auth path, file access pattern or schema surface was introduced.

## Verification

- `npm run verify` — **exit 0.**
- `npm run test:locks` — 14 tests, 14 pass (unchanged count, as required before 02-03 sets `MIN_TESTS`).
- `npm run check:html` — 21 tests, 21 pass.
- `npm run check:budget` — JS 168.5 KB / 500 KB gzip; page 191.2 KB / 1024 KB (was 191.3 KB).
- Executable phone scan — prints `1`.
- `grep -c "MIN_TESTS = 14" design-system/test/run-locks.mjs` — still 1; `run-locks.mjs` untouched.
- The line-75 `toDial does not fabricate +44` test — no `+`/`-` diff line touches it.

## Next Phase Readiness

Ready for wave 2. Downstream plans can now rely on:

- `import { CANONICAL_PHONE } from '../../phone.js'` for `Header`, `StickyCallBar` and `QuoteFormEntry` defaults — sibling-relative, never through the barrel.
- `import { Star } from '../RatingBadge/RatingBadge.jsx'` in `ReviewCard`.
- `as?: ElementType` as an existing precedent rather than a new invention.
- `.bhc-section__intro` for `SectionBand`, `CTABand` and `ReviewRail` intros.
- `--bhc-text-2xl` as the settled `<h2>` size for all sixteen new blocks.

One thing wave 2 must not forget: `toDial` now throws, so any new component that renders a `tel:` will fail the build if handed a bad value. That is the intent, but it means a Phase-3 data file with a missing phone field breaks the whole build rather than one page.

## Self-Check: PASSED

All 10 claimed files exist on disk (`design-system/src/phone.js` created; the other nine modified in place). All three claimed commits — `de3f9f3`, `2efdc4f`, `aa15070` — are present in `git log`. `npm run verify` re-run at the end of execution exits 0.

---
*Phase: 02-component-library-completion-core-templates*
*Completed: 2026-08-09*
