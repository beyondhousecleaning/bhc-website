---
phase: 02-component-library-completion-core-templates
plan: 10
wave: 5
subsystem: design-system
status: complete
tags: [navigation, actions, zero-javascript, sibling-combinator, structured-data, success-criterion-1]

# Dependency graph
requires:
  - phase: 02
    plan: 01
    provides: "src/phone.js (CANONICAL_PHONE), the toDial/formatPhone throw-on-malformed guard, NAPFooter's WR-10 mapsUrl scheme guard, Button's as?: ElementType"
  - phase: 02
    plan: 02
    provides: "delta 9 (four-file shape + both .design-sync maps), delta 14 (inline-SVG a11y), the tel: cap of four, the client-directive source scan over design-system/src"
  - phase: 02
    plan: 06
    provides: "web/content/nav.js (NAV, FOOTER_COLUMNS, LEGAL) and web/content/site.js (AREA_SERVED, HOURS) — the data these two composition components consume"
  - phase: 02
    plan: 07
    provides: "the eighteen-component baseline delta 9 walked, and the direct-colour discipline that flagged StickyCallBar for a ground check"
provides:
  - "SkipLink — a wrapper over the shipped .bhc-skip-link rules; adds no CSS, targets <main id=\"main\" tabIndex={-1}>"
  - "Footer — a composition layer that emits NO <footer>, renders one NAPFooter, and forwards areaServed and hours undefaulted so the sitewide JSON-LD keeps its City nodes"
  - "Header — one <header>, one <nav aria-label=\"Primary\">, one <ul>, every nav link in the DOM exactly once, zero JavaScript"
  - "StickyCallBar — a fixed mobile call/quote bar that leaves the accessibility tree at 768px"
  - "ALL SIXTEEN Phase 2 components now exist in the four-file shape — Success Criterion 1 complete at the component level"
  - "The [open] ~ .bhc-nav__list sibling combinator, present exactly once in styles.css; ::details-content absent"
  - "delta 9 now passes over TWENTY-TWO component directories"
affects: [02-11, 02-12, 02-13, 02-14, 02-15, phase-03-locations-layer, phase-05-seo-locks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A contentless <details> as a pure state carrier whose controlled element is its SIBLING, driven by [open] ~ .selector — the UA only hides a <details>'s own children, so a sibling is reachable by an ordinary stylesheet rule"
    - "A composition component that emits no root element at all: Footer renders exactly one NAPFooter and adds no landmark, so the one-<footer>-per-page assertion survives the layout rewrite"
    - "Forwarding a structured-data prop UNDEFAULTED, so an omission is visible in the output rather than papered over by a plausible-looking invented value"
    - "display:none as the DEFAULT state for a viewport-scoped component, with the visible state inside the media query — keeps the one narrow query to a single occurrence and removes the element from the accessibility tree above the breakpoint"
    - "Declining a prop the spec lists, and documenting why: an unforwardable `as` on a component that renders no anchors is a silent no-op, and omitting it turns a typed caller's mistake into a compile error"

key-files:
  created:
    - design-system/src/components/SkipLink/SkipLink.jsx
    - design-system/src/components/SkipLink/SkipLink.html
    - design-system/src/components/SkipLink/SkipLink.d.ts
    - design-system/src/components/SkipLink/SkipLink.prompt.md
    - design-system/src/components/Footer/Footer.jsx
    - design-system/src/components/Footer/Footer.html
    - design-system/src/components/Footer/Footer.d.ts
    - design-system/src/components/Footer/Footer.prompt.md
    - design-system/src/components/Header/Header.jsx
    - design-system/src/components/Header/Header.html
    - design-system/src/components/Header/Header.d.ts
    - design-system/src/components/Header/Header.prompt.md
    - design-system/src/components/StickyCallBar/StickyCallBar.jsx
    - design-system/src/components/StickyCallBar/StickyCallBar.html
    - design-system/src/components/StickyCallBar/StickyCallBar.d.ts
    - design-system/src/components/StickyCallBar/StickyCallBar.prompt.md
  modified:
    - design-system/styles.css
    - design-system/src/index.js
    - design-system/.design-sync/config.json

key-decisions:
  - "Footer forwards areaServed and hours UNDEFAULTED — NAPFooter's own defaults are the fallback, so an omission produces JSON-LD with no areaServed key (visible) rather than a list this component invented (unfindable)"
  - "Footer does NOT take the `as` prop UI-SPEC §7.2 lists. It renders no anchors — every <a> is NAPFooter's, and NAPFooter takes no `as` — so a declared-but-unforwarded prop would be a silent no-op at a call site that believed it had substituted its link component. Omitting it makes a typed caller's mistake a compile error. The substitution point is NAPFooter."
  - "Footer filters `legal` and `social` even though NAPFooter guards `columns`. NAPFooter maps both of those unfiltered (NAPFooter.jsx:131 and the sameAs map), so these two filters are the only thing between a null entry and a 500 on all 18 pages"
  - "Header's phone + CTA appear from 768px, not the 1024px UI-SPEC §7.1 specifies — a superset that closes a real gap, because StickyCallBar leaves at exactly 768px and between 768 and 1023 the header actions are the only one-tap call action on the page"
  - "A NavItem with neither children nor an href renders as a <span>, not an <a> with no href — an hrefless anchor is not focusable, not activatable, and still announced as a link"
  - "SkipLink takes no `as` prop either: §13-J's escape hatch is for links to ROUTES, and a router link would intercept a same-document fragment and skip the native focus behaviour that is the entire mechanism"
  - "StickyCallBar is display:none by DEFAULT and visible inside the narrow query, not the reverse — it removes the bar from the accessibility tree above the breakpoint and keeps the one documented max-width query to a single occurrence"

patterns-established:
  - "Pattern: when a spec lists a prop that cannot be honoured, decline it and write down why in the .jsx header, the .d.ts and the prompt doc's `## Don't`. A silently-ignored prop is worse than an absent one because the call site cannot tell."
  - "Pattern: a component whose correctness depends on an unusual DOM shape carries the REJECTED alternatives, with the failure mode of each, in its prompt doc — the shape that looks like a mistake needs the argument attached to it or it gets 'tidied'"

requirements-completed: []

# Metrics
duration: 38min
completed: 2026-08-10
---

# Phase 02 Plan 10: The Last Four Components Summary

**All sixteen Phase 2 components now exist. The global navigation opens and closes with JavaScript
disabled and is unconditionally visible at desktop width, every navigation link is in the DOM exactly
once, and the footer composition layer forwards `areaServed` so the sitewide JSON-LD cannot silently
lose its City nodes when plan 02-13 rewrites the layout.**

## Performance

- **Duration:** ~38 min
- **Started:** 2026-08-10T00:14Z
- **Completed:** 2026-08-10T00:52Z
- **Tasks:** 3
- **Files:** 16 created, 3 modified

## Accomplishments

- **Success Criterion 1's sixteen are complete.** `delta 9` now walks **twenty-two** component
  directories — the six Phase 1 components plus this phase's sixteen — and every one of them has its
  four canonical files, a matching `@dsCard group` and `category:`, and an entry in **both**
  `.design-sync` maps. `componentSrcMap` and `docsMap` each hold 22 keys.
- **`npm run verify` exits 0**: 20 design-system lock tests + 30 built-HTML locks = 50 passing
  assertions. JS **129.8 KB / 500 KB** (unchanged — these components ship no JavaScript and no app
  file renders them yet). Page **291.3 KB / 1024 KB**, up 0.5 KB on the 290.8 KB baseline, all of it
  the shared CSS file growing from 4.2 KB to 4.7 KB gzip. Thirteen routes, unchanged.
- **`Footer` keeps the City nodes.** Rendering it with the four served towns produces JSON-LD
  containing `"@type":"City"` and all four town names, and rendering it **without** `areaServed`
  produces JSON-LD with **no `areaServed` key at all** — proving the value is forwarded rather than
  defaulted. This is the failure `site.js`'s `AREA_SERVED` comment predicted from the other end, and
  it is now closed at both.
- **`Footer` emits exactly one `<footer>`** — NAPFooter's own — in every shape tested, including
  the empty-props case.
- **No duplicated internal href in the Header's DOM.** With the shipped `NAV` the header emits
  **11 internal hrefs** (the brand's `/`, six service pages, About, Checklist, Contact, and the CTA)
  and every one appears exactly once. One `<nav aria-label="Primary">`, one
  `<ul class="bhc-nav__list">`, zero `<h1>`.
- **The state carrier holds only a `<summary>`** — asserted by slicing the rendered markup from
  `<details class="bhc-nav__disclosure">` to its closing tag and confirming it contains no `<ul>`,
  no `<li>`, and exactly one `<summary>` carrying both `aria-controls="primary-nav"` and
  `aria-label="Menu"`. The `<ul>` starts **after** the carrier closes, i.e. it is genuinely a
  sibling. The nested Services submenu is the opposite case and **does** contain its own
  `<ul class="bhc-nav__sublist">`, which is ordinary disclosure usage.
- **A childed `NavItem` never emits its own href**, verified with data that deliberately carries
  one: `Header({nav:[{label:'Services', href:'/services/deep-cleaning', children:[…same href…]}]})`
  renders `/services/deep-cleaning` **exactly once**.
- **`grep -c "bhc-nav__disclosure\[open\] ~ .bhc-nav__list"` is 1** and
  **`grep -c "details-content"` is 0**. The explanation of the mechanism lives in
  `Header.prompt.md`; `styles.css`'s comment describes the shape without writing either string, so
  neither grep is self-collided. That trap has now bitten this repo ten times and did not bite here.
- **Zero client boundaries.** No component under `design-system/src` contains the directive, and
  `check:html`'s SC-4g is green.
- **StickyCallBar's call action is digit-free.** The anchor's rendered text content is exactly
  `Call`, its href is `tel:+447861936533`, and it carries
  `aria-label="Call Beyond House Cleaning"`. `formatPhone` is deliberately **not imported** — there
  is no displayed number to format.
- **The phone number is still single-sourced.** `grep -c "447861936533"` returns **0** for
  `Footer.jsx`, `Header.jsx` and `StickyCallBar.jsx`, while the canonical `tel:+447861936533` reaches
  all three rendered outputs.
- **Delta 14 is green over four new SVGs** — the hamburger's three paths in one `<svg>`, the
  submenu chevron, and both again in `Header.html`. All carry `aria-hidden="true" focusable="false"`
  written out on the tag, and none carries `alt`.
- **The focus-override section is still the last section of `styles.css`**, and neither new block
  declares a `:focus-visible` rule.
- **Zero packages installed.** `git diff` on all three `package.json` files is empty.

## Task Commits

1. **Task 1: SkipLink and Footer** — `451a01f` (feat)
2. **Task 2: Header — the zero-JavaScript navigation** — `0f26e6e` (feat)
3. **Task 3: StickyCallBar** — `6f3548c` (feat)

## Measured Numbers

**Verification counts, all from a throwaway render probe run against the compiled components:**

| Task | Assertions | Result |
|---|---|---|
| 1 — SkipLink + Footer | 35 | all pass |
| 2 — Header | 54 | all pass |
| 3 — StickyCallBar | 44 | all pass |

**The plan's grep criteria, run verbatim:**

| Criterion | Expected | Measured |
|---|---|---|
| `\/\* --- SkipLink` blocks in `styles.css` | 0 | **0** |
| `447861936533` in `Footer.jsx` | 0 | **0** |
| `447861936533` in `Header.jsx` | 0 | **0** |
| `447861936533` in `StickyCallBar.jsx` | 0 | **0** |
| `beyond-hc-01` in `Header.jsx` | 0 | **0** |
| `bhc-nav__disclosure[open] ~ .bhc-nav__list` | 1 | **1** |
| `details-content` in `styles.css` | 0 | **0** |
| `max-width: 767px` in `styles.css` | 1 | **1** |
| `env(safe-area-inset-bottom)` | ≥1 | **2** |
| `inset-inline: 0` | ≥1 | **2** |
| `one of the three` in `StickyCallBar.prompt.md` | 0 | **0** |
| `four` in `StickyCallBar.prompt.md` | ≥1 | **5** |

**Header breakpoint map, as shipped:**

| Width | Toggle | Nav list | Header phone + CTA | StickyCallBar |
|---|---|---|---|---|
| below 768px | shown | hidden until opened | hidden | **shown** |
| 768–1023px | shown | hidden until opened | **shown** | hidden |
| 1024px and above | removed | `flex`, unconditional | shown | hidden |

The two call actions are exactly complementary: no viewport shows both, and none shows neither.

**Budget:** JS 129.8 KB / 500 KB (worst `/`, **unchanged** — no new JavaScript ships). Page
291.3 KB / 1024 KB against a 290.8 KB baseline: **+0.5 KB, all of it the one shared CSS file**
(4.2 → 4.7 KB gzip) carrying two new component blocks. Worst page is still `/privacy-policy`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The plan's `node --input-type=module -e "import … .jsx"` criteria are unrunnable**

- **Found during:** Tasks 1, 2 and 3
- **Issue:** Three acceptance criteria are written as `node --input-type=module -e "import … .jsx"`.
  Node has no JSX loader in this repo (`ERR_UNKNOWN_FILE_EXTENSION`). **This is the fifth
  consecutive plan to hit it**, after 02-01, 02-04, 02-05 and 02-07.
- **Fix:** Ran the identical assertions, and 130 more, through a throwaway probe that compiles
  `design-system/src` **and** `web/content` with Next's bundled SWC binding (`await loadBindings()`
  first, and `jsc.transform.react.runtime: 'automatic'`) and renders with `react-dom/server`. `.jsx`
  import specifiers are rewritten to `.js` in the emitted output so the extension-always-written
  convention still resolves. The probe lived at the repo root, outside `design-system/src`,
  `web/app` and `web/content`, so no lock walk could see it, and it was deleted before this summary
  was written.
- **Files modified:** none (probe deleted)
- **Verification:** `ok` on all three runs — 35, 54 and 44 assertions. Every criterion the plan
  states is among them, run verbatim in substance.
- **Committed in:** n/a — verification only

**2. [Rule 2 - Missing Critical] `Footer` must filter `legal` and `social`, not only `columns`**

- **Found during:** Task 1
- **Issue:** The plan says to copy `NAPFooter`'s guard idiom for `columns` and `col.links`. Reading
  `NAPFooter.jsx` in full showed that those two **are already guarded there** — so a Footer-level
  filter on them is belt and braces. What is **not** guarded anywhere is `legal`
  (`NAPFooter.jsx:131` maps it unfiltered, reading `l.href` and `l.label`) and `social` (mapped for
  schema `sameAs` via `s.href`). A single null entry in either would throw during server render, in
  the root layout, taking all 18 routes.
- **Fix:** `Footer` filters all four inputs. The `.d.ts` and the prompt doc both carry a table
  saying which filters are redundant and which are the only guard that exists, so nobody removes the
  load-bearing two as duplication.
- **Files modified:** `Footer.jsx`, `Footer.d.ts`, `Footer.prompt.md`
- **Verification:** Probe renders `Footer({columns:[null,{heading:'Company'}], legal:[null],
  social:[null]})` without throwing and with the surviving column present.
- **Committed in:** `451a01f`

**3. [Rule 4-adjacent, resolved without a checkpoint] `Footer` does not take the `as` prop UI-SPEC §7.2 lists**

- **Found during:** Task 1
- **Issue:** The plan's props list and UI-SPEC §7.2 both give `Footer` an `as?: ElementType`.
  `Footer` renders **no anchors** — every `<a>` in the output is `NAPFooter`'s — and `NAPFooter`
  takes no `as` and does not spread unknown props. So an accepted `as` could only be dropped
  silently, at a call site that believed it had substituted its router link component.
- **Fix:** Declined the prop, in the signature and in the `.d.ts`, with the reasoning written into
  the `.jsx` header, the `.d.ts` JSDoc and the prompt doc's `## Don't`. A typed caller passing `as`
  now gets a compile error instead of a no-op. The genuine substitution point is `NAPFooter`, which
  is outside this plan's file list; the docs say so and say to forward it here in the same change.
- **Why this was not a checkpoint:** it removes an API surface rather than adding architecture,
  nothing in the plan's acceptance criteria or `must_haves` tests it, and the alternative was
  shipping a prop documented as inert. It is recorded here rather than decided silently.
- **Files modified:** `Footer.jsx`, `Footer.d.ts`, `Footer.prompt.md`
- **Verification:** Probe asserts `Footer` still renders correctly in every shape; delta 9 green.
- **Committed in:** `451a01f`

**4. [Rule 2 - Missing Critical] The 768–1023px viewport had no one-tap call action**

- **Found during:** Task 2
- **Issue:** UI-SPEC §7.1 puts the header's `tel:` link and CTA at **1024px and above**; §7.12 takes
  `StickyCallBar` away at **768px**. Implemented literally, that leaves 768–1023px — small tablets
  and large phones in landscape, which is real traffic for a mobile-first cleaning enquiry — with no
  call action anywhere above the fold, and no CTA in the header either. Nothing in the harness
  measures this, so it would have shipped green.
- **Fix:** `.bhc-header__actions` is `display: none` and becomes `flex` at `min-width: 768px` — the
  exact width `StickyCallBar` leaves. This is a **superset** of §7.1's requirement (1024px and above
  still shows both), and it makes the two call actions exactly complementary: no viewport shows both,
  and none shows neither. Recorded in `Header.prompt.md` as a breakpoint table with the reason.
- **Files modified:** `Header.jsx`, `design-system/styles.css`, `Header.prompt.md`
- **Verification:** the breakpoint table above; `tel:` counts unchanged (the link is CSS-gated, not
  conditionally rendered, so it is in the DOM at every width and the cap of four still holds).
- **Committed in:** `0f26e6e`

**5. [Rule 2 - Missing Critical] A `NavItem` with neither children nor an href would have rendered an hrefless `<a>`**

- **Found during:** Task 2
- **Issue:** The plan's malformed-data criterion is `nav: [null, { label: 'Services' }]` — an item
  with no children and no href. A naive implementation renders `<a>Services</a>`, which does not
  throw (so the criterion passes) but is not focusable, not activatable, and still announced as a
  link by a screen reader. React also emits no `href` attribute for `undefined`, so it is invisible
  to any grep looking for `href="undefined"`.
- **Fix:** an item with no children and no href renders a `<span className="bhc-nav__link">`. The
  three-row rendering table is in the `.d.ts` and the prompt doc.
- **Files modified:** `Header.jsx`, `Header.d.ts`, `Header.prompt.md`
- **Verification:** Probe asserts the malformed render contains `Services` and no `href="undefined"`.
- **Committed in:** `0f26e6e`

**Total deviations:** 5 auto-fixed (1 blocking, 3 missing-critical, 1 API-surface decision)
**Impact on plan:** No scope creep and no descope. All sixteen files the plan names were created,
all three shared files were modified as specified, and every acceptance criterion was run. The one
prop the plan listed and this execution declined is documented in three places.

### Additions Beyond Plan

None.

## Issues Encountered

- **Two `tel:` links now sit in every page's DOM at every width once 02-13 composes these.** Header's
  and StickyCallBar's are mutually exclusive *visually* but both are always in the markup, because
  both are CSS-gated rather than conditionally rendered — that is what keeps the render server-side.
  With `NAPFooter`'s that makes **three** on most pages and **four** where `QuoteFormEntry` renders.
  Delta 2(b)'s cap of four is exact, not generous: there is no headroom for a fifth.
- **`body { padding-bottom: 64px }` is a global rule declared inside a component's CSS block.** It
  applies on every page below 768px whether or not `StickyCallBar` rendered. That is correct today
  because 02-13 puts the bar in the root layout on every page, and it would become 64px of dead space
  the moment a page opts out. Recorded in the prompt doc.
- **The Header's desktop submenu opens on click, not hover.** A `<details>` has no hover state to
  drive, and adding one would need either JavaScript or a `:hover` rule that fights the element's own
  open state. Click-to-open is also the accessible behaviour; it is simply not what a hover-menu
  competitor does.
- **`Header.html`'s preview cannot show the mobile and desktop states side by side**, because the two
  are the same DOM and differ only by viewport width. Shape C with one real instance plus a caption
  is what the plan specifies, and it is the only honest option — a second instance would misrepresent
  the component as having two markup forms.
- **`StickyCallBar.html` overrides `position` and `display` inline** so the bar is visible in a static
  preview document. Every other value is the shipped rule, and the override is commented as such in
  the file.
- **Plan 02-13 still owns four `NO_PRIMARY_CTA_YET` entries.** `Header` now supplies the sitewide
  primary Button that empties them, but nothing renders `Header` yet. All four come out in 02-13's
  layout edit, and if it removes only `/_not-found` the gate goes red on the three legal pages.

## User Setup Required

None. Zero packages installed.

## Known Stubs

| Stub | File | Why it is here |
|---|---|---|
| The brand is a typographic wordmark, not a logo | `Header.jsx` (`DEFAULT_WORDMARK`) | `assets/logo/` holds only a 189 KB PNG and a 679 KB JPG of the mark `brand-brief.md` is **replacing**, at a resolution that renders ~20px tall in a 48px header. Shipping it would put a superseded logo on ~410 pages. The `logo` prop takes a `ReactNode`, so the SVG lockup drops in with **no API change and no page edits** — this is a one-prop swap at one call site, not a component rewrite. |

Neither blocks the plan's goal. The wordmark is a complete, on-brand, accessible rendering of the
brand today; it is listed because the intent is that it is superseded.

## Threat Flags

None. All sixteen files are server-rendered presentation components with no network surface, no file
access and no schema at a trust boundary. The plan's own register is fully mitigated:

- **T-02-54** (malformed `nav` or `columns` entry) — `nav.filter(Boolean)` + `(item.children || [])`
  in `Header`; `columns.filter(Boolean)` + `(col.links || [])` + `legal.filter(Boolean)` +
  `social.filter(Boolean)` in `Footer`. Render-with-null probes pass for both, including a null
  *child* inside a surviving parent.
- **T-02-55** (`areaServed` silently dropping) — forwarded undefaulted; probe asserts all four City
  nodes and `"@type":"City"` reach the emitted JSON-LD, and that omitting the prop produces JSON-LD
  with no `areaServed` key.
- **T-02-56** (`mapsUrl` scheme) — passed through unmodified; probe asserts a `javascript:` value
  produces markup containing no `javascript:` **and** no "Find us on Google" block, while an `https:`
  value renders both.
- **T-02-57** (a second `<footer>` landmark) — `Footer` emits none; probe counts exactly 1 `<footer>`
  in the full case and the empty case, and 0 in `Header`'s output.
- **T-02-58** (a client boundary for the nav toggle) — UA-driven `<details>` plus a sibling
  combinator; the directive appears nowhere in package source and SC-4g is green.
- **T-02-59** (a duplicated nav href from a childed NavItem) — asserted with data that deliberately
  carries one; the href appears exactly once. Also asserted across the whole shipped `NAV`: 11
  internal hrefs, zero duplicates.
- **T-02-60** (a wrong or unreachable phone number) — `Header` and `StickyCallBar` both default from
  `CANONICAL_PHONE`, neither restates the digits, and `StickyCallBar({phone: ''})` throws rather than
  rendering `tel:+44`.
- **T-02-61** (a hidden but focusable call bar on desktop) — `display: none` is the **default** state,
  so above the breakpoint the bar is out of the accessibility tree entirely rather than painted out
  of view.
- **T-02-62** (package installs) — zero.

## Self-Check: PASSED

All sixteen created files exist on disk, all three modified files carry the changes, and all three
task commits are in the log: `451a01f`, `0f26e6e`, `6f3548c`. The probe harness and its output
directory were deleted before this summary was written; `git status` showed a clean tree.
`npm run verify` exits 0 — 20 lock tests, 30 built-HTML locks, JS 129.8 KB / 500 KB, page
291.3 KB / 1024 KB.
