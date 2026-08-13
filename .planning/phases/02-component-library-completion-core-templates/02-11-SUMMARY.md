---
phase: 02-component-library-completion-core-templates
plan: 11
wave: 5
subsystem: web-templates
status: complete
tags: [home-template, success-criterion-2, success-criterion-3, band-ordering, copy-deck, service-links]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "PAGE_EXPECTATIONS['/'] (h1, hasBreadcrumbs:false, ldJsonBlocks:1), the class=\"[^\"]*… counting rule, SC-4d/4f, delta 6 and delta 7"
  - phase: 02
    plan: 04
    provides: "SectionBand (tone/heading/intro/width) and ProcessSteps — the band wrapper and the numbered list this page composes"
  - phase: 02
    plan: 05
    provides: "ServiceCard, the .bhc-service-card__grid class, and FAQAccordion (no structured data, by construction)"
  - phase: 02
    plan: 06
    provides: "web/content/nav.js (NAV.Services.children — the six hrefs), site.js (RATING, titleFor, describe), process.js (PROCESS_STEPS), faqs.js (GENERAL_FAQS)"
  - phase: 02
    plan: 07
    provides: "TrustBar, BeforeAfterSlider (the never-null pending state) and ReviewRail (null on empty data)"
provides:
  - "web/content/home.js — the Home copy deck: hero, six service card records, section headings, both CTAs, intro, FAQ set and metadata"
  - "web/app/page.jsx — the composed UI-SPEC §9.2 Home template, ROADMAP SC-2's home page"
  - "ROADMAP SC-3 demonstrably satisfied: data-bhc-photo-state=\"pending\" renders on /"
  - "The six keyword-bearing /services/* links, read off nav.js rather than restated — the internal-link target plan 02-12 resolves"
  - "hrefFor(): a throw-on-missing-label lookup that makes nav/template drift a red build rather than an undefined href"
affects: [02-12, 02-13, 02-14, 02-15, phase-03-locations-layer, phase-04-content-and-photography]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A template that renders NO copy literal at all — every string, including section headings and CTA labels, comes from a .js data module, so the claude-seo hook's .jsx substring ban never binds and the components stay framework-agnostic"
    - "Deriving link targets from the navigation module by LABEL lookup with a throw on miss, so a slug rename is a one-line change in nav.js and drift is a build failure rather than a dead link"
    - "Composing a null-rendering component (ReviewRail) WITHOUT a SectionBand wrapper — the wrapper would emit a headless band and put two identical tones adjacent until the data arrives"
    - "Band tone verified by extracting the ordered bhc-section modifier list from the MARKUP HALF of the built HTML (everything before the first self.__next_f), since the flight payload repeats every class name"

key-files:
  created:
    - web/content/home.js
  modified:
    - web/app/page.jsx

decisions:
  - "Section headings and CTA labels live in home.js, not in page.jsx — task 2's 'no copy literals in the .jsx' rule is taken literally, which extends task 1's export list with HOME_HEADINGS, HOME_ACTIONS, HOME_CTA, HOME_TITLE and HOME_DESCRIPTION"
  - "ReviewRail is rendered bare rather than inside a SectionBand: a banded null would emit an empty <section class=\"bhc-section\"> and make the FAQ band's paper ground adjacent to another paper ground"
  - "HOME_FAQS re-exports GENERAL_FAQS rather than restating a subset — the general set IS the set of questions asked of a business rather than of a service"
  - "hrefFor throws at module load on a missing nav label; the module is imported only by a statically prerendered route, so the throw is a red `next build`, never a runtime 500"

metrics:
  duration: 15min
  completed: 2026-08-10
  tasks: 2
  files: 2
---

# Phase 2 Plan 11: Home Page Template Summary

The site's highest-traffic page now renders the full UI-SPEC §9.2 sequence — Hero, TrustBar, six
ServiceCards, the before-and-after placeholder, ProcessSteps, ReviewRail, FAQAccordion and the one
navy CTABand — from a single `web/content/home.js` copy deck, with one `<h1>`, one JSON-LD block
and six keyword-bearing service links.

## What Was Built

### Task 1 — `web/content/home.js` (commit `4c9c8d9`)

A plain `.js` data module in the `site.js`/`faqs.js` house style. Exports:

| Export | Contents |
|---|---|
| `HOME_HERO` | `eyebrow`, `heading`, `lead` — UI-SPEC §5 character for character |
| `HOME_ACTIONS` | the Hero pair: `Get a Free Quote` (primary) + `See What's Included` (secondary) |
| `HOME_CTA` | the closing ask, same pair with the second as `ghost` |
| `HOME_HEADINGS` | §5's `<h2>` deck for this template, in §9.2 band order |
| `HOME_INTRO` | the lead paragraph under `What we clean` |
| `HOME_SERVICE_CARDS` | six `ServiceCardProps` records, ≤3 `includes` each |
| `HOME_FAQS` | a re-export of `GENERAL_FAQS` |
| `HOME_TITLE` / `HOME_DESCRIPTION` | composed through `titleFor` / `describe` — 54 and 132 chars |

**The six hrefs are never restated.** `hrefFor(label)` looks each one up in the `Services` nav
item's `children` and throws if the label is missing, so the home cards and the header cannot drift
apart and Phase 3's canonical-slug rename does not touch this module at all.

### Task 2 — `web/app/page.jsx` (commit `a301181`)

Plan 02-02's trimmed scaffold (a Hero plus a lone RatingBadge band) is now the full template.
No copy literal appears in the file — section headings and CTA labels come from `HOME_HEADINGS`,
`HOME_ACTIONS` and `HOME_CTA`.

**Observed band order, extracted from the markup half of the built `index.html`:**

```
paper -> warm -> paper -> tint -> paper -> navy
```

No two adjacent entries are equal, and there is exactly one navy band, last before the footer.
`Hero` is `bhc-hero` rather than a `bhc-section`, so its paper-warm ground sits above this list
rather than inside it — which is why the sequence opens on `paper` (TrustBar) rather than repeating
the hero's warm.

## Verification

`npm run build` exits 0; 13 routes, all static. Measured against built output:

| Assertion | Form used | Expected | Observed |
|---|---|---|---|
| `<h1>` | `/<h1/g` | 1 | 1, text `Professional House Cleaning in Warwickshire & the West Midlands` |
| JSON-LD blocks | `<script[^>]*type="application/ld+json"` | 1 | 1 (NAPFooter's) |
| Breadcrumb trail | `class="[^"]*bhc-breadcrumbs__list` | 0 | 0 |
| Interlink list | `class="[^"]*bhc-interlink__list` | 0 | 0 |
| Navy bands | `class="[^"]*bhc-section--navy` | 1 | 1 |
| Photo placeholder | `data-bhc-photo-state="pending"` | 1 | 1 |
| `FAQPage` | bare substring | 0 | 0 |
| Distinct `/services/*` links | `href="(/services/[a-z-]+)"` | 6 | 6 |
| `RatingBadge` inside the navy band | `bhc-rating`, markup half only | absent | absent |
| `447861936533` under `web/app` | `grep -rc` | 0 per file | 0 per file |
| `emitSchema` under `web/app` | `grep -rc` | 0 per file | 0 per file |

Every class count uses the `class="[^"]*…` form. The bare form double-counts on the inlined RSC
flight payload, so a bare `/bhc-section--navy/g` would have read 2 on a correct page.

Suite state after this plan:

| Gate | Result |
|---|---|
| `npm run test:locks` | 20/20 pass (baseline unchanged) |
| `npm run check:html` | **29/30 pass — delta 6 is the single failure**, see below |
| `npm run check:budget` | JS 129.8 KB / 500 KB (unchanged); page 293.7 KB / 1024 KB (was 291.3 KB) |

## Known Wave Dependency — `npm run verify` Is Not Green Until 02-12 Lands

This is anticipated by the plan's objective block, not a defect.

The six `ServiceCard` hrefs point at `/services/<slug>` routes that **plan 02-12 creates in this
same wave**. Plan 02-02's delta 6 resolves every internal href against the real
`prerender-manifest.json`, so it fails today with exactly this message and nothing else:

```
internal link(s) pointing at a URL that is not prerendered:
  / -> /services/deep-cleaning, / -> /services/standard-home-cleaning,
  / -> /services/move-in-cleaning, / -> /services/move-out-cleaning,
  / -> /services/short-term-rental-cleaning, / -> /services/post-construction-cleaning
```

**State observed: the permitted one.** All 29 other built-HTML locks pass, the design-system lock
suite is 20/20, and the budget gate is green. The failure disappears the moment plan 02-12
prerenders the six routes — `PAGE_EXPECTATIONS` already carries all six entries, so no harness
change is needed. **Run `npm run verify` at the end of wave 5, not after this plan alone.**

## Deviations from Plan

### Auto-fixed / auto-extended

**1. [Rule 2 - Missing critical functionality] Section headings, CTA labels and metadata moved into `home.js`**

- **Found during:** Task 2
- **Issue:** Task 1's export list named only `HOME_HERO`, `HOME_SERVICE_CARDS`, `HOME_INTRO` and
  `HOME_FAQS`, but task 2's action requires that no copy literal live in the `.jsx` — which the
  five `<h2>`s, the four CTA labels and the two metadata strings would have been.
- **Fix:** Added `HOME_HEADINGS`, `HOME_ACTIONS`, `HOME_CTA`, `HOME_TITLE` and `HOME_DESCRIPTION`
  to `home.js`. `page.jsx` now contains no page copy at all.
- **Files modified:** `web/content/home.js`, `web/app/page.jsx`
- **Commits:** `4c9c8d9`, `a301181`

**2. [Rule 1 - Bug avoided] `ReviewRail` rendered outside a `SectionBand`**

- **Found during:** Task 2
- **Issue:** The contract block lists ReviewRail at tone `paper`. Wrapping it in a `SectionBand`
  would have emitted a headless empty `<section class="bhc-section">` on every build until Phase 4,
  and would have put a `paper` band immediately before the FAQ `paper` band — failing the plan's
  own adjacent-tone criterion.
- **Fix:** `<ReviewRail reviews={[]} />` is rendered bare, so it returns `null` and contributes
  nothing to the band sequence. `ReviewRail` supplies its own `<section>` and `<h2>` when Phase 4
  gives it data, so the template still does not change then.
- **Files modified:** `web/app/page.jsx`
- **Commit:** `a301181`

### Scanner self-collision, avoided rather than hit

The plan warns that an explanatory comment can match the grep that polices it — ten occurrences
this phase. Three greps applied to `home.js` (`#reviews`, the banned CTA phrases, the US
vocabulary) and two applied to `web/app` (`emitSchema`, the phone digits). Every header comment in
both files therefore **describes** the banned shape and names the spec section that holds it,
rather than instancing it. All five greps returned 0 first time.

## Known Stubs

| Stub | File | Reason |
|---|---|---|
| `BeforeAfterSlider` with no `pairs` | `web/app/page.jsx` | **Deliberate — this is ROADMAP SC-3.** The component renders a labelled `data-bhc-photo-state="pending"` figure rather than disappearing, so the page is not blocked on photography that does not exist. Phase 4 supplies real pairs and asserts the marker reaches zero. |
| `ReviewRail reviews={[]}` | `web/app/page.jsx` | **Deliberate.** Renders `null`; composed anyway so Phase 4 changes a data file rather than this template. Seeding invented testimonials is not an option on a site positioned as a genuinely local team. |

Neither stub prevents this plan's goal: the home page renders its full section sequence, its one
`<h1>` and its six service links today.

## Threat Flags

None. This plan adds no network endpoint, no auth path, no file access and no schema at a trust
boundary. The threat register's five mitigations are all in place and asserted: no address or
postcode in the copy (T-02-63, source check plus SC-2d), one JSON-LD block (T-02-64), hrefs read
off `nav.js` (T-02-65), no `RatingBadge` on navy (T-02-66, checked against the markup half),
no FAQ schema (T-02-67), and every class count in the `class="` form (T-02-68).

## Notes for Later Plans

- **02-12** makes the six `/services/*` hrefs resolve. Nothing in the harness needs changing —
  `PAGE_EXPECTATIONS` already holds all six. Run `npm run verify` after it lands.
- **02-13** composes `Header`, `Footer`, `SkipLink` and `StickyCallBar` into `layout.jsx`. That adds
  no `bhc-section`, so this page's band sequence is unaffected; it does add the sixth and seventh
  `/checklist` and `/get-a-quote` links to the page, which is fine — no lock counts them.
- **Phase 4** changes two data values and no template: `pairs` on the BeforeAfterSlider band and
  `reviews` on the rail. Both call sites already exist here.
- `HOME_TITLE` is 54 chars and `HOME_DESCRIPTION` 132, so both clear Lock 8's caps with headroom
  when Phase 5 turns that lock on.

## Self-Check: PASSED

- `web/content/home.js` — FOUND
- `web/app/page.jsx` — FOUND
- commit `4c9c8d9` — FOUND
- commit `a301181` — FOUND
