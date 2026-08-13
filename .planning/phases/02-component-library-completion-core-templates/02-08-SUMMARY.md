---
phase: 02-component-library-completion-core-templates
plan: 08
wave: 4
subsystem: routes
status: complete
tags: [utility-routes, success-criterion-2, h1-deck, outbound-handoff, wr-10, self-restoring-gate]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "PAGE_EXPECTATIONS (the <h1>/breadcrumb/JSON-LD table), the NO_PRIMARY_CTA_YET self-restoring gate, delta 6's internal-link resolution and the four-link tel: budget"
  - phase: 02
    plan: 04
    provides: "SectionBand, Prose, ProcessSteps and CTABand — the band rhythm every route below composes"
  - phase: 02
    plan: 05
    provides: "QuoteFormEntry, which supplies its own tel: fallback from the package's phone module"
  - phase: 02
    plan: 06
    provides: "the @/* alias, site.js (RATING, titleFor, describe, BRAND, AREA_SHORT) and blocks.jsx's renderBlocks"
provides:
  - "web/content/utility.js — UTILITY (seven records) and byPath(), carrying the h1, eyebrow, lead, title, description, prose blocks and outbound destinations for the seven core utility pages"
  - "Seven prerendered utility routes: /about-us, /contact-us, /checklist, /get-a-quote, /work-with-us, /gift-cards, /customer-login"
  - "Three of the four live-site pages with no <h1> now carry the UI-SPEC §5 heading (/contact-us, /work-with-us, /gift-cards); /customer-login is the fourth and it is here too"
  - "The /get-a-quote PAGE_EXPECTATIONS entry now reads hasBreadcrumbs: true, ldJsonBlocks: 2"
  - "NO_PRIMARY_CTA_YET is down to /_not-found — the last entry is plan 02-13's"
  - "PROVEN: the WR-10 pattern (scheme guard + target/rel pairing) applied to two data-driven outbound hrefs"
affects: [02-09, 02-10, 02-11, 02-12, 02-13, 02-14, 02-15, phase-03-town-and-combo-templates, phase-05-seo-locks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A route file that owns composition only — every string it renders comes from a web/content record via byPath()"
    - "The WR-10 outbound pattern: /^https?:\\/\\//i tested at module scope, the whole band dropped when it fails, target=_blank always paired with rel=noopener noreferrer"
    - "A shorter TITLE SUBJECT, never a shorter <h1>, when Lock 8's 60-char cap and Success Criterion 2 copy disagree"
    - "SectionBand supplies the <h2> and ProcessSteps drops in as the bare list — the composed case, not a second heading"

key-files:
  created:
    - web/content/utility.js
    - web/app/about-us/page.jsx
    - web/app/contact-us/page.jsx
    - web/app/checklist/page.jsx
    - web/app/work-with-us/page.jsx
    - web/app/gift-cards/page.jsx
    - web/app/customer-login/page.jsx
  modified:
    - web/app/get-a-quote/page.jsx
    - web/scripts/check-html-locks.mjs

key-decisions:
  - "The two overrunning titles are fixed with a shorter title subject (About Beyond House Cleaning, 51; Contact Our Cleaning Team, 49) — the <h1>s are Success Criterion 2 copy and were not touched"
  - "Both outbound destinations default to the live site's own page for that route, because no portal or provider URL exists anywhere in the repo and inventing a hostname is the same failure mode as a hallucinated package name — flagged for Sam, with the post-cutover self-reference risk written above the constants"
  - "/checklist's closing band carries ONE action, not two: the plan's ghost-to-/get-a-quote would have put the same href on both buttons in one band and duplicated CTABand's React key"
  - "/work-with-us keeps the sitewide customer CTA rather than inventing an apply action — §5's CTA vocabulary is a closed set of five labels and forking it on one page is worse than a slightly generic band"
  - "The /customer-login Call fallback's heading and bullets live in utility.js, not in the route file — copy belongs in .js, and the phone number is not a field of that record at all"
  - "NO_PRIMARY_CTA_YET was emptied of /get-a-quote as part of this plan, not left for a later one: the gate is asserted in the inverse, so the route gaining a primary Button made the suite red until the entry came out"

patterns-established:
  - "Pattern: when a data value must be swapped later by a non-engineer, write the two constraints on its replacement (scheme, link-rel) above the constant, and write the failure that no lock catches — here, an absolute URL that becomes a self-reference at cutover"
  - "Pattern: an explanatory comment must never quote the string its own gate greps for. Two more instances hit in this plan (an illustrative street line, and the three banned CTA phrases), taking the project's running total to nine"

requirements-completed: []

# Metrics
duration: 45min
completed: 2026-08-09
---

# Phase 02 Plan 08: The Seven Core Utility Routes Summary

**Seven utility pages now prerender with the UI-SPEC §5 `<h1>` deck character for character — four
of them for the first time in the site's history — driven entirely by one data module, and the
self-restoring gate that was holding `/get-a-quote` open has closed behind them.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-08-09T22:10Z
- **Completed:** 2026-08-09T22:55Z
- **Tasks:** 3
- **Files:** 7 created, 2 modified

## Accomplishments

- **The `<h1>` defect is fixed on three pages here and a fourth in the same plan.** `/contact-us`,
  `/work-with-us`, `/gift-cards` and `/customer-login` have never shipped an `<h1>` on the live
  site. All four now carry the §5 heading, extracted from the built HTML and compared after tag
  stripping and entity decoding, so child markup and `&amp;` cannot fake a pass.
- **Ten routes prerender, every one `compute: "static"`** — `/`, the seven from this plan,
  `/_not-found` and `/_global-error`. Exactly the count this plan's verification block names.
- **`npm run verify` exits 0**: 20 design-system lock tests, 30 built-HTML locks, JS 129.8 KB /
  500 KB (unchanged — these are server-rendered pages that ship no new JavaScript) and page
  289.8 KB / 1024 KB, up 1.7 KB on the 288.1 KB baseline, all of it gzipped HTML.
- **The `/get-a-quote` wave-1 stub is gone** and the route carries the full §9.4 entry template:
  breadcrumbs, a centred Hero with the rating, prose on what happens after you ask,
  `QuoteFormEntry`, and the three process steps fed from `process.js`.
- **`NO_PRIMARY_CTA_YET` did exactly what plan 02-02 designed it to do.** The set is asserted in
  the inverse, so the moment `/get-a-quote` rendered `QuoteFormEntry`'s primary Button the
  assertion would have failed — the gate forced its own removal rather than relying on anyone
  remembering. One entry remains, `/_not-found`, and it belongs to plan 02-13.
- **Neither hand-off page contains a form control.** No `<form>`, `<input>`, `<select>` or
  `<textarea>` in either built page — asserted directly, and the reason (a browser boundary would
  turn SC-4g red, and a sign-in box on a site that owns no accounts is a phishing shape) is written
  into both files.
- **Both outbound links carry `target="_blank"` AND `rel="noopener noreferrer"`**, behind a
  `/^https?:\/\//i` guard evaluated at module scope that drops the entire band when it fails. WR-10
  applied to the two data values it was written for.
- **No page hardcodes the phone number, and no page emits a third JSON-LD block.**
  `grep -rc "447861936533" web/app` and `grep -rc "emitSchema" web/app` are 0 for all nine files in
  the directory; every page emits exactly 2 blocks (NAPFooter's and Breadcrumbs').
- **Every prose block on all seven pages renders through the one shared `renderBlocks`.**
  `grep -rc "case 'h2'\|type === 'h2'" web/app` is 0 for every file — no route file grew a second
  block-to-element mapping.
- **Zero packages installed.** `git diff web/package.json` is empty.

## Task Commits

1. **Task 1: `web/content/utility.js` — the seven records** — `9d7208e` (feat)
2. **Task 2: the five straightforward utility routes** — `41e2400` (feat)
3. **Task 3: `/get-a-quote`, `/customer-login` and the `PAGE_EXPECTATIONS` flip** — `56f6f31` (feat)

## Measured Numbers

**The built `<h1>` deck, extracted from disk after entity decoding:**

| Route | `<h1>` in built HTML | `tel:` | JSON-LD | words |
|---|---|---|---|---|
| `/about-us` | The Team Behind Beyond House Cleaning | 1 | 2 | ~338 |
| `/contact-us` 🔴 | Contact Our Warwickshire Cleaning Team | 1 | 2 | ~283 |
| `/checklist` | What's Included in Every Clean | 1 | 2 | ~429 |
| `/get-a-quote` | Get a Free Cleaning Quote | 2 | 2 | ~336 |
| `/work-with-us` 🔴 | Cleaning Jobs in Warwickshire & the West Midlands | 1 | 2 | ~326 |
| `/gift-cards` 🔴 | House Cleaning Gift Cards | 1 | 2 | ~269 |
| `/customer-login` 🔴 | Manage Your Cleaning Bookings | 2 | 2 | ~294 |

🔴 = no `<h1>` at all on the live site before this plan.

**The wave-4 `tel:` count, recorded because plan 02-13 changes it.** `/get-a-quote` and
`/customer-login` carry **two** today — `NAPFooter`'s and `QuoteFormEntry`'s — and exactly one of
those is inside `<footer>`. Once 02-13 composes `Header` and `StickyCallBar` into the layout both
reach **four**, which is the cap delta 2(b) sets and the reason it is four rather than three. The
other five pages carry one each today and three after 02-13.

**Titles and descriptions, measured rather than estimated** (Lock 8: ≤60 and ≤155):

| Route | Title chars | Description chars |
|---|---|---|
| `/about-us` | 51 | 136 |
| `/contact-us` | 49 | 133 |
| `/checklist` | 54 | 130 |
| `/get-a-quote` | 49 | 141 |
| `/work-with-us` | 53 | 141 |
| `/gift-cards` | 49 | 135 |
| `/customer-login` | 53 | 129 |

The two that `site.js`'s `titleFor` JSDoc predicted would overrun — `/about-us` at 61 and
`/contact-us` at 62 when the `<h1>` is reused verbatim — are fixed the way §5 permits, with a
shorter title *subject*. The `<h1>`s were not shortened.

**Budget:** JS 129.8 KB / 500 KB (worst `/`, unchanged from the 129.8 KB baseline). Page
289.8 KB / 1024 KB (worst `/checklist`), against a 288.1 KB baseline — +1.7 KB, entirely gzipped
HTML from seven pages of new copy.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `NO_PRIMARY_CTA_YET` had to lose `/get-a-quote`, which task 3's diff criterion did not anticipate**

- **Found during:** Task 3
- **Issue:** Task 3's acceptance says the diff to `check-html-locks.mjs` should touch "only the
  `/get-a-quote` expectation line and its comment". But `NO_PRIMARY_CTA_YET` is a **self-restoring
  inverse**: SC-4e asserts `present === false` for every route in that set, and the route's own
  comment names this plan as the one that must drop it. The moment `/get-a-quote` rendered
  `QuoteFormEntry`'s primary Button (measured: one `bhc-btn--primary` in the built page), leaving the
  entry in place would have turned `check:html` red.
- **Fix:** Removed `/get-a-quote` from the set and rewrote the comment above it to record that the
  gate fired as designed. `NO_RATING_YET` and `INTERLINK_LOCK_ACTIVE` were left alone — both are
  plan 02-13's and Phase 3's respectively. `EXPECTED_APP_ROUTES`, the `tel:` cap and every assertion
  body are untouched.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** `check:html` 30/30 green; `grep -c "hasBreadcrumbs: false"` returns 2 (`/` and
  `/_not-found`), as the criterion requires.
- **Committed in:** `56f6f31`

**2. [Rule 1 - Bug] `/checklist`'s closing band would have carried the same href on both buttons**

- **Found during:** Task 2
- **Issue:** The plan's per-route note says `/checklist`'s `ghost` action should point at
  `/get-a-quote` "rather than back at itself" — but the `primary` action already points there. That
  ships two buttons doing the same thing in one band, and `CTABand` keys its actions by
  `action.href`, so it also produces a duplicate React key during server render.
- **Fix:** `/checklist` closes with one action, the primary to `/get-a-quote`. The intent behind the
  note — do not link the page to itself — is preserved, SC-4e still finds a `bhc-btn--primary`, and
  the reason is written into the file so the asymmetry with the other four routes is not read as an
  omission.
- **Files modified:** `web/app/checklist/page.jsx`
- **Verification:** `check:html` green; no duplicate-key warning in the build output.
- **Committed in:** `41e2400`

**3. [Rule 3 - Blocking] Two comments matched the greps that police them (occurrences eight and nine)**

- **Found during:** Task 1
- **Issue:** The `utility.js` header explained the `STREET_LINE` heuristic by quoting an illustrative
  address, and explained the voice rules by quoting the three banned CTA phrases. Both acceptance
  greps for this file are plain substring scans, so both comments failed the gates they were written
  to explain — the same defect this repo has now hit **nine** times.
- **Fix:** Both explanations rewritten to describe the shape without instancing it, and the second
  one now says explicitly why it does not quote the phrases.
- **Files modified:** `web/content/utility.js`
- **Verification:** the street-line and postcode scan prints `ok`;
  `grep -ci "apartment\|baseboard\|click here\|learn more\|submit" web/content/utility.js` returns 0.
- **Committed in:** `9d7208e`

### Additions Beyond Plan

**4. [Rule 2 - Missing Critical] The `/customer-login` fallback panel needed its own copy**

- **Found during:** Task 3
- **Issue:** `QuoteFormEntry`'s defaults are written for a prospect asking for a price
  ("Get a free quote in under two minutes", plus three reassurance bullets about quoting). On
  `/customer-login` the panel's job is the §9.4 `Call` fallback for an **existing** customer, and the
  default copy addresses the wrong person. Writing that copy inline in the route file would have put
  prose in a `.jsx`, which this project's directory rule exists to prevent.
- **Fix:** Added a `callout: { heading, bullets }` field to the `/customer-login` record in
  `utility.js`, with a comment stating that the phone number is deliberately not a field of it.
- **Files modified:** `web/content/utility.js`, `web/app/customer-login/page.jsx`
- **Committed in:** `56f6f31`

**Total deviations:** 4 auto-fixed (2 blocking, 1 bug, 1 missing-critical)
**Impact on plan:** No scope creep. Deviation 1 is required by the gate design the critical context
names; deviation 3 is a standing property of this repo rather than a finding.

## Issues Encountered

- **No portal or provider URL exists anywhere in the repository.** Greps across `docs/`,
  `.planning/` and the two sitemaps for a booking-portal host return nothing, and the SEO audit only
  records that `/customer-login` and `/gift-cards` exist and lack an `<h1>`. Fabricating a plausible
  hostname is the same failure mode as a hallucinated package name, so both hrefs default to the
  live site's own page for that route — real, absolute `https://`, resolving today, and swappable in
  one line. See **Known Stubs** for the risk that carries.
- **`/work-with-us` closes with a customer CTA.** §5's CTA vocabulary is a closed set of five labels
  and none of them is an apply action, so the careers page ends with "Ready for a properly clean
  home?" like every other utility page. The how-to-apply copy is in the page's own prose. If an
  applicant flow is ever wanted, §5 has to gain the label first.
- **Rough word counts are 269–429 per page.** §9.4 sets no floor for utility pages (the ≥800-word
  rule in §9.3 is the service template's), and the plan asks for three to six paragraphs. Recorded
  because Phase 5's content-depth work will want a number to start from.

## User Setup Required

None. Zero packages installed.

## Known Stubs

| Stub | File | Why it is here |
|---|---|---|
| `BOOKING_PORTAL` / `GIFT_CARD_STORE` both point at the live Webflow site's own page for that route | `web/content/utility.js` | UI-SPEC §14-2 and 02-RESEARCH open question 3 both resolved to "ship the default, make the href a data value". No confirmed URL exists for either. **They must be swapped before cutover:** this site replaces those pages, at which point each link points at itself, and nothing in the lock harness catches it — delta 6 resolves internal `href="/…"` values against the prerender manifest and never inspects an absolute URL. The two constraints on whatever goes in (absolute `https://`, and it will be rendered `target="_blank" rel="noopener noreferrer"`) are written above the constants. |

Neither stub blocks this plan's goal: both pages ship a real `<h1>`, real prose and a working
outbound action today.

## Threat Flags

None. Every file in this plan is a data module or a server-rendered route; the two new trust
boundaries (`T-02-41`/`T-02-42`, the outbound hrefs) are the ones the plan's own register named, and
both are mitigated as specified — scheme-guarded at module scope, band dropped on failure, and
`rel="noopener noreferrer"` paired with `target="_blank"`. `T-02-43` (a credential form on
`/customer-login`) is asserted absent against the built HTML.

## Self-Check: PASSED

All ten claimed files exist on disk (seven created, two modified, plus this summary) and all three
task commits are in the log: `9d7208e`, `41e2400`, `56f6f31`. `npm run verify` exits 0.
