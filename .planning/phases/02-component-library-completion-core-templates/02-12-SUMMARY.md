---
phase: 02-component-library-completion-core-templates
plan: 12
wave: 5
subsystem: web-templates
status: complete
tags: [service-template, dynamic-route, generateStaticParams, success-criterion-2, success-criterion-3, content-depth, wave-5-close]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "PAGE_EXPECTATIONS for all six /services/* routes (h1, hasBreadcrumbs:true, ldJsonBlocks:2), the class=\"[^\"]*… counting rule, SC-2d, SC-4d, SC-4f, SC-4g, delta 6 and delta 7"
  - phase: 02
    plan: 04
    provides: "SectionBand (tone/heading), Prose (outline starts at h2) and ProcessSteps"
  - phase: 02
    plan: 05
    provides: "FAQAccordion — no structured data, by construction"
  - phase: 02
    plan: 06
    provides: "nav.js (the six service hrefs), site.js (RATING, AREA_LONG, titleFor, describe), process.js (PROCESS_STEPS), faqs.js (serviceFaqs), blocks.jsx (renderBlocks)"
  - phase: 02
    plan: 07
    provides: "BeforeAfterSlider (the never-null pending state) and ReviewRail (null on empty data)"
  - phase: 02
    plan: 11
    provides: "the six home-page ServiceCard hrefs this plan resolves — the other half of delta 6"
provides:
  - "web/content/services.js — six records of 865 to 1,026 body words each, plus SERVICE_HEADINGS, SERVICE_ACTIONS, SERVICE_CTA and BREADCRUMB_HOME"
  - "web/app/services/[service]/page.jsx — the dynamic SSG route: Phase 3's engine rehearsed at 6x instead of 336x"
  - "ROADMAP SC-2's service set: six pages, six correct <h1>s, six two-crumb trails"
  - "ROADMAP SC-3 on six more pages: data-bhc-photo-state=\"pending\" renders on every service page"
  - "npm run verify green end to end — delta 6 resolved, wave 5 closed"
  - "A corrected SC-4g tripwire that counts route ENTRIES, so it survives Phase 3's ~336-page expansion"
affects: [02-13, 02-14, 02-15, phase-03-locations-layer, phase-04-content-and-photography]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One dynamic statically-generated route plus one data module in place of six hand-written directories — which is what makes UI-SPEC §13-C's deferral of the canonical-slug rename to Phase 3 a data change rather than a template change"
    - "await params in BOTH generateMetadata and the default export; Next 16 removed synchronous access, so a sync read is a build error not a warning"
    - "dynamicParams pinned static-only, so an unlisted slug 404s at the router and the path segment never reaches the lookup at runtime"
    - "The breadcrumb label lives on the record as `crumb` rather than being derived from the <h1> — deriving it would need a string method whose name the claude-seo hook bans from .jsx"
    - "A build-output tripwire must count what the build emits one of: Next writes one client-reference manifest per route ENTRY, not per prerendered page"

key-files:
  created:
    - web/content/services.js
    - web/app/services/[service]/page.jsx
  modified:
    - web/scripts/check-html-locks.mjs

decisions:
  - "The BeforeAfterSlider band takes `warm` rather than §9.3's summary-listed `paper`: with the prose band on paper they would have been two identical adjacent grounds, and §4 — which §9.3 cites as its authority — forbids that outright"
  - "Section headings, CTA labels and the Home crumb live in services.js, not in the .jsx, following 02-11: the route file carries no page copy at all"
  - "`crumb` is a new field on each record rather than a derivation from `h1`, and each label matches its nav.js label exactly — including `Builders Clean` against a slug that does not say so"
  - "SC-4g's count assertion was rewritten against built `page.js` route entries; the old comparison against prerendered pages fails on any generateStaticParams route and would have under-counted by ~330 in Phase 3"
  - "ReviewRail is rendered bare rather than inside a SectionBand, as on Home — a banded null emits a headless section and puts two paper grounds adjacent"

metrics:
  duration: 55min
  completed: 2026-08-10
  tasks: 3
  files: 3
---

# Phase 2 Plan 12: The Six Service Pages Summary

Six service pages now prerender from **one** dynamic route and **one** data module — 5,447 words of
differentiated UK-English copy, each page with exactly one `<h1>`, two JSON-LD blocks, a two-crumb
`Home › {Service}` trail and a visible photo placeholder. `npm run verify` exits 0, which closes
wave 5.

## What Was Built

### Task 1 — `web/content/services.js`, the first three records (commit `b282242`)

`SERVICES` (ordered) and `bySlug(slug)`. Each record carries `slug`, `h1`, `eyebrow`, `title`,
`description`, `lead`, `prose` (a `blocks.jsx` block array) and `faqs` (looked up from `faqs.js`
rather than restated, so one slug rename moves both).

### Task 2 — the remaining three records (commit `1b29aef`)

Angled so the six pages do not converge: the deposit and the check-out report on move-out, the
changeover window and linen logistics on short-term rental, the two dust passes and residue removal
on the builders clean.

### Task 3 — `web/app/services/[service]/page.jsx` (commit `5ebd626`)

The verified 02-RESEARCH template: `dynamicParams` pinned static-only, `generateStaticParams()` off
`SERVICES`, and `await params` in **both** `generateMetadata` and the default export. The route
file carries no page copy — task 3 extended `services.js` with `crumb` per record plus
`SERVICE_HEADINGS`, `SERVICE_ACTIONS`, `SERVICE_CTA` and `BREADCRUMB_HOME`.

**Observed band order, extracted from the markup half of each built page** (identical on all six):

```
paper -> warm -> tint -> paper -> navy
```

No two adjacent entries are equal and there is exactly one navy band, last before the footer.
`Hero` is `bhc-hero` rather than a `bhc-section`, so its paper-warm ground sits above this list.

## Content Depth — Measured

| Slug | Body words | Unique words | Title chars | Description chars | FAQs |
|---|---|---|---|---|---|
| `deep-cleaning` | 1,026 | 402 | 53 | 133 | 4 |
| `standard-home-cleaning` | 898 | 376 | 56 | 142 | 5 |
| `move-in-cleaning` | 893 | 356 | 56 | 136 | 4 |
| `move-out-cleaning` | 870 | 363 | 57 | 137 | 5 |
| `short-term-rental-cleaning` | 895 | 400 | 55 | 146 | 5 |
| `post-construction-cleaning` | 865 | 383 | 54 | 135 | 4 |

**5,447 body words total**, every page clear of the 800-word bar, every title inside Lock 8's 60 and
every description inside its 155. All six `<h1>`s, eyebrows and titles match the plan's contract
block character for character (asserted, not eyeballed).

### Pairwise Jaccard similarity — all fifteen pairs

| | standard | move-in | move-out | short-term | builders |
|---|---|---|---|---|---|
| **deep** | 0.320 | **0.327** | 0.304 | 0.264 | 0.280 |
| **standard** | — | 0.287 | 0.276 | 0.278 | 0.259 |
| **move-in** | — | — | 0.310 | 0.204 | 0.299 |
| **move-out** | — | — | — | 0.263 | 0.247 |
| **short-term** | — | — | — | — | 0.214 |

**Worst pair: `deep-cleaning` × `move-in-cleaning` at 0.327**, against a 0.6 ceiling. Lowest is
`move-in` × `short-term` at 0.204.

## Verification

`npm run build` exits 0. 19 prerendered routes; all 19 report `compute: "static"` in
`prerender-manifest.json`, with exactly six `/services/*` keys and no seventh. The six sibling
files exist at `.next/server/app/services/<slug>.html`, so the plan's build-output assumption held.

Measured against built output, **identical on all six pages**:

| Assertion | Form used | Expected | Observed |
|---|---|---|---|
| `<h1>` | `/<h1/g` | 1 | 1 |
| `<main id="main"` | substring | 1 | 1 |
| `<footer` | substring | 1 | 1 |
| JSON-LD blocks | `<script[^>]*type="application/ld+json"` | 2 | 2 |
| Breadcrumb trail | `class="[^"]*bhc-breadcrumbs__list` | 1 | 1 |
| `aria-current="page"` | substring | 1 | 1 |
| Navy bands | `class="[^"]*bhc-section--navy` | 1 | 1 |
| Photo placeholder | `data-bhc-photo-state="pending"` | 1 | 1 |
| Interlink list | `class="[^"]*bhc-interlink__list` | 0 | 0 |
| `FAQPage` | bare substring | 0 | 0 |

**Every class count uses the `class="[^"]*…` form.** The bare form double-counts on the inlined RSC
flight payload, so a bare `/bhc-section--navy/g` would have read 2 on a correct page.

Trail shape, read out of `deep-cleaning.html`: two `<li>`, one `aria-current="page"`, and no
`href="/services"` anywhere in the `<ol>`.

Route-file greps: `dynamicParams = false` → 1, `renderBlocks` → 4, `case 'h2'` / `type === 'h2'` → 0.
`emitSchema` and `447861936533` → 0 for every file under `web/app`.

Source-safety scan of `services.js` (both postcode forms, the street-line heuristic, email and
mobile-number patterns): no match. `apartment|baseboard|vacuum|click here|learn more` → 0.
`post-construction` never appears in the sixth record's prose; `builders clean` does.

### Suite state — `npm run verify` exits 0

| Gate | Before this plan | After |
|---|---|---|
| `npm run test:locks` | 20/20 | 20/20 |
| `npm run check:html` | **29/30 — delta 6 red** | **30/30** |
| `npm run check:budget` | JS 129.8 KB, page 293.7 KB | JS 129.8 KB / 500 KB, page **294.2 KB** / 1024 KB |

Worst budget route is now `/services/deep-cleaning` at 294.2 KB total (9.0 KB gzip HTML — the
longest page on the site). JS is byte-identical at 129.8 KB and the worst JS route is still `/`:
route count remains free on the JS budget, exactly as 02-RESEARCH measured.

**Delta 6 is green.** The six home-page `ServiceCard` hrefs plan 02-11 shipped now resolve against
the real prerender manifest, and no harness change was needed for it — `PAGE_EXPECTATIONS` already
carried all six entries, as 02-11's summary predicted.

## Deviations from Plan

### Auto-fixed

**1. [Rule 1 - Bug] SC-4g's count tripwire compared the wrong two quantities**

- **Found during:** Task 3
- **Issue:** `check:html` went 29/30 with `found 14 client-reference manifest(s) for 18 app page(s)`.
  The assertion was `manifests.length >= APP_PAGES.length`. Next emits **one manifest per route
  ENTRY**, which is what the lock's own comment says — so `app/services/[service]` contributes a
  single manifest while contributing six prerendered pages. The comparison was written in wave 1
  against a build with 13 routes and 13 pages, where the two numbers coincided by accident. It
  fails on a *correct* build the moment a `generateStaticParams` route exists, and would have
  under-counted by roughly 330 in Phase 3.
- **Fix:** The tripwire now counts built `page.js` route entries under `.next/server/app` (14) and
  asserts one manifest each. The per-manifest first-party-client-module assertion — the part of the
  lock that actually enforces D-07 — is untouched, and it still reads every manifest including the
  dynamic route's.
- **Files modified:** `web/scripts/check-html-locks.mjs` (added `sep` to the `node:path` import)
- **Commit:** `5ebd626`

**2. [Rule 2 - Missing critical functionality] `crumb`, `SERVICE_HEADINGS`, `SERVICE_ACTIONS`, `SERVICE_CTA` and `BREADCRUMB_HOME` added to `services.js`**

- **Found during:** Task 3
- **Issue:** The plan's record shape named no breadcrumb label, and the route needs the service's
  *short* name for the second crumb. Deriving it from the `<h1>` inside the `.jsx` is not available:
  it would need the one string method whose name the `claude-seo` hook bans from a `.jsx` write.
  The three `<h2>`s and the four CTA labels had the same problem in reverse — leaving them as
  literals in the route file would have put page copy back into a `.jsx`, against 02-11's
  established rule.
- **Fix:** `crumb` is now a field on each record, matching its `nav.js` label exactly (so the sixth
  is `Builders Clean` while its slug is not), and the shared page furniture is exported alongside
  it. `page.jsx` contains no page copy at all.
- **Files modified:** `web/content/services.js`
- **Commit:** `5ebd626`

**3. [Rule 1 - Bug avoided] The BeforeAfterSlider band is `warm`, not `paper`**

- **Found during:** Task 3
- **Issue:** The plan's contract block lists the slider at tone `paper`, and the prose band above it
  defaults to `paper` too. Composed literally that is two identical adjacent grounds, which UI-SPEC
  §4 — the section the contract block cites as its authority for band ordering — forbids outright.
  §9.3's own summary lists tones for a template that also carried an `InterlinkBlock`, which Phase 2
  does not render.
- **Fix:** The slider band takes `tone="warm"`. Observed sequence is
  `paper → warm → tint → paper → navy` on all six pages, with no adjacent duplicate and one navy
  band. `ProcessSteps` (tint), `FAQAccordion` (paper) and `CTABand` (navy) are all exactly as the
  contract block lists them.
- **Files modified:** `web/app/services/[service]/page.jsx`
- **Commit:** `5ebd626`

### Scanner self-collision, avoided rather than hit

The plan warns that an explanatory comment can match the grep that polices it — ten occurrences this
phase. Five greps applied here: `emitSchema` and the phone digits over `web/app`, the US-vocabulary
and dead-CTA set over `services.js`, and `dynamicParams = false` over the route file requiring
**exactly one** hit.

The last one caught the header comment on the first pass — `grep -c` read 2, because the comment
restated the export while explaining why it exists. Reworded to describe the export rather than
instance it, and it now reads 1. Every other comment in both new files names the spec section that
holds the banned shape rather than quoting it, and all five greps are clean.

## Known Stubs

| Stub | File | Reason |
|---|---|---|
| `BeforeAfterSlider` with no `pairs` | `web/app/services/[service]/page.jsx` | **Deliberate — this is ROADMAP SC-3**, now on six more pages. The component renders a labelled `data-bhc-photo-state="pending"` figure rather than disappearing, so no page is blocked on photography that does not exist. Phase 4 supplies real pairs filtered to the service and asserts the pending marker reaches zero. |
| `ReviewRail reviews={[]}` | `web/app/services/[service]/page.jsx` | **Deliberate.** Renders `null`; composed anyway so Phase 4 changes a data file rather than this template. Seeding invented testimonials is not an option on a site positioned as a genuinely local team. |
| No `InterlinkBlock` | `web/app/services/[service]/page.jsx` | **Deliberate and gated.** §9.3 puts "towns we cover for this service" here; Phase 3 supplies the town data, and plan 02-02's SC-4d asserts the block's absence until it does. |

None of the three prevents this plan's goal: six service pages render their full section sequence,
their correct `<h1>` and 865 to 1,026 words of copy today.

## Threat Flags

None. This plan adds no network endpoint, no auth path, no file access and no schema at a trust
boundary. All seven register mitigations are in place and asserted:

| Threat | State |
|---|---|
| T-02-70 unlisted slug | `dynamicParams` pinned static-only; the six manifest keys are the only `/services/*` routes |
| T-02-71 route silently going dynamic | all 19 manifest routes report `compute: "static"` |
| T-02-72 address or postcode in ~5,400 words | source scan clean on both postcode forms, the street-line heuristic, email and phone; SC-2d green over every built page |
| T-02-73 a third JSON-LD block | exactly 2 on all six pages; no schema-emitting prop anywhere under `web/app` |
| T-02-74 a crumb linking to `/services` | two-`<li>` trail with no such href, asserted in built HTML; delta 6 green independently |
| T-02-75 malformed prose block | all block types validated at authoring time; `renderBlocks` drops unknown types rather than throwing |
| T-02-76 package installs | not applicable — zero packages this phase |

## Notes for Later Plans

- **02-13** composes `Header`, `Footer`, `SkipLink` and `StickyCallBar` into `layout.jsx`. That adds
  no `bhc-section`, so these pages' band sequence is unaffected. Note that `EXPECTED_APP_ROUTES` was
  **not** raised here — it stays 02-13's to move.
- **Phase 3** renames the four Americanised slugs and adds their 301s. That is a change to `slug` in
  `services.js`, the matching `nav.js`/`FOOTER_COLUMNS` hrefs and the `faqs.js` keys — and to
  nothing under `web/app`, which is the property UI-SPEC §13-C's deferral depends on. It also
  reinstates the middle `Services` crumb once an index route exists, and populates the
  `InterlinkBlock`.
- **Phase 3's route engine** is now proven under CI: `generateStaticParams`, async `params` in both
  exports, static-only `dynamicParams`, and the corrected SC-4g tripwire that will not misfire at
  336 pages.
- **Phase 4** changes two data values and no template: `pairs` on the slider band and `reviews` on
  the rail. Both call sites already exist here, on all six pages.
- Worst-page HTML is now `/services/deep-cleaning` at 9.0 KB gzip. Phase 3's combo pages will be
  comparable, and the page budget has 730 KB of headroom.

## Self-Check: PASSED

- `web/content/services.js` — FOUND
- `web/app/services/[service]/page.jsx` — FOUND
- `.planning/phases/02-component-library-completion-core-templates/02-12-SUMMARY.md` — FOUND
- commit `b282242` — FOUND
- commit `1b29aef` — FOUND
- commit `5ebd626` — FOUND
