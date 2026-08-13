---
phase: 02-component-library-completion-core-templates
plan: 09
wave: 4
subsystem: routes
status: complete
tags: [legal-routes, success-criterion-2, prose-narrow, no-conversion-furniture, self-restoring-gate, d-04]

# Dependency graph
requires:
  - phase: 02
    plan: 02
    provides: "PAGE_EXPECTATIONS (all three legal entries already carried hasBreadcrumbs: true, ldJsonBlocks: 2), the NO_PRIMARY_CTA_YET self-restoring gate, delta 6's internal-link resolution, SC-2d's postcode and street-line scans over built HTML"
  - phase: 02
    plan: 04
    provides: "SectionBand (width=narrow) and Prose (width=narrow) — the two halves of the legal measure"
  - phase: 02
    plan: 06
    provides: "the @/* alias, site.js (BRAND, RATING, titleFor) and blocks.jsx's renderBlocks"
provides:
  - "web/content/legal.js — LEGAL_PAGES (three records) and byPath(), carrying the h1, crumb, eyebrow, lead, title, description and prose blocks for the three legal documents"
  - "Three prerendered legal routes: /privacy-policy, /terms-of-service, /customer-service-agreement"
  - "ALL TEN utility routes from UI-SPEC §5 now exist — no footer legal-row link can point at a 404 when plan 02-13 renders the Footer"
  - "NO_PRIMARY_CTA_YET now holds four entries (/_not-found plus the three legal routes); plan 02-13 empties it completely"
  - "PROVEN: a route composed with NO conversion furniture at all is expressible in this harness, via the layout-sense arm of the self-restoring gate"
affects: [02-10, 02-11, 02-12, 02-13, 02-14, 02-15, phase-05-seo-locks]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "The legal route shape: Breadcrumbs → centred Hero with rating → SectionBand width=narrow wrapping Prose width=narrow, and nothing else"
    - "Two independent narrowings on one band — the container narrows, then the reading measure narrows inside it — both spelled with the same prop name on different components"
    - "A shared commercial promise duplicated as two literals plus a comment naming the other site, rather than imported — the honest coupling when the two strings must be able to diverge later"

key-files:
  created:
    - web/content/legal.js
    - web/app/privacy-policy/page.jsx
    - web/app/terms-of-service/page.jsx
    - web/app/customer-service-agreement/page.jsx
  modified:
    - web/scripts/check-html-locks.mjs

key-decisions:
  - "The three legal routes were ADDED to NO_PRIMARY_CTA_YET rather than given a CTA — §9.4 forbids the CTABand and SC-4e demands a primary Button, and the gate's layout-sense arm is the only resolution that does not breach the spec"
  - "The satisfaction sentence is a literal in legal.js, not an import from process.js — an import would make the two strings inseparable on the day the agreement needs a clause the process step must not carry"
  - "Retention periods (one year for a dead enquiry, six years for booking and payment records), the notice window (a day) and the late-cancellation charge are the CONSERVATIVE DEFAULTS, written as data so each is a one-string edit; nobody has signed these documents off"
  - "Every contact route in the copy is the contact page in words, never a link — renderBlocks emits no anchors, so the T-02-49 mitigation is structural rather than a convention"
  - "All three titles reuse the <h1> verbatim (38/40/50 chars) — none needed the shorter-subject treatment two utility.js titles needed"

patterns-established:
  - "Pattern: when a template legitimately lacks an element a lock demands sitewide, the fix is the gate's own exemption set with the REASON recorded in both places — never a token instance of the element added to satisfy the grep"
  - "Pattern: a header comment that must warn about a banned shape names the shape and states explicitly that it is not instancing it. The eleventh scanner self-collision was avoided rather than hit this time, by writing the warning that way from the first draft"

requirements-completed: []

# Metrics
duration: 6min
completed: 2026-08-09
---

# Phase 02 Plan 09: The Three Legal Routes Summary

**All ten of UI-SPEC §5's utility routes now prerender: the three legal pages ship at a narrow
measure with one `<h1>` each, no conversion furniture at all, and not one address, postcode, phone
number or email address anywhere in ~2,300 words of the copy most likely in the whole site to carry
one.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-08-09T23:02Z
- **Completed:** 2026-08-09T23:08Z
- **Tasks:** 2
- **Files:** 4 created, 1 modified

## Accomplishments

- **Thirteen routes prerender, every one `compute: "static"`** — `/`, all ten utility routes,
  `/_not-found` and `/_global-error`. Exactly the count this plan's verification block names.
- **`npm run verify` exits 0**: 20 design-system lock tests + 30 built-HTML locks = 50 passing
  assertions, JS 129.8 KB / 500 KB (unchanged — these pages ship no new JavaScript) and page
  290.8 KB / 1024 KB, up 1.0 KB on the 289.8 KB baseline, all of it gzipped HTML.
- **The footer's Legal row can no longer point at a 404.** `nav.js`'s `LEGAL` array names all three
  slugs; all three are in the prerender manifest, so delta 6 stays green when plan 02-13 renders the
  Footer that emits those hrefs.
- **Every legal page has exactly one `<h1>`, extracted from disk after tag stripping and compared
  character for character** against `PAGE_EXPECTATIONS` — `Privacy Policy`, `Terms of Service`,
  `Customer Service Agreement`. `PAGE_EXPECTATIONS` itself was **not touched**: plan 02-02 had
  already carried all three entries with `hasBreadcrumbs: true` and `ldJsonBlocks: 2`, and all three
  measured correct on the first build.
- **No conversion furniture on any of the three.** `bhc-section--navy` is 0 on all three pages
  (the bare form, safe on a zero-assertion), and there is no `BeforeAfterSlider` and no
  `QuoteFormEntry`. §9.4 says a legal page is not a conversion surface and this is what that looks
  like in the built HTML.
- **Both narrowings render.** Each page carries exactly one `class="…bhc-container--narrow"` (the
  band) and one `class="…bhc-prose--narrow"` (the measure), counted with the `class="` form.
- **No address, postcode, phone number or email address anywhere.** The source-level scan over
  `legal.js` prints `ok` for all four shapes, and SC-2d's postcode and `STREET_LINE` sweeps over
  every built page are green. `grep -rc "447861936533" web/app` is 0 for all twelve files.
- **Every prose block goes through the one shared `renderBlocks`.**
  `grep -rc "case 'h2'\|type === 'h2'" web/app` is 0 for every file in the directory, and all three
  route files import `renderBlocks`.
- **No third JSON-LD block.** `grep -rc "emitSchema" web/app` is 0 for every file; all three pages
  emit exactly 2 (NAPFooter's and Breadcrumbs').
- **Zero packages installed.** `web/package.json` untouched.

## Task Commits

1. **Task 1: `web/content/legal.js` — the three documents** — `85602e3` (feat)
2. **Task 2: the three legal routes** — `d9022b0` (feat)

## Measured Numbers

**The three documents, measured rather than estimated:**

| Route | `<h1>` in built HTML | `h2` sections | prose blocks | words | title | description |
|---|---|---|---|---|---|---|
| `/privacy-policy` | Privacy Policy | 10 | 27 | ~917 | 38 | 145 |
| `/terms-of-service` | Terms of Service | 9 | 20 | ~549 | 40 | 153 |
| `/customer-service-agreement` | Customer Service Agreement | 11 | 30 | ~837 | 50 | 152 |

Lock 8's caps are 60 and 155. All three titles reuse the `<h1>` verbatim through `titleFor`; unlike
`/about-us` and `/contact-us` in plan 02-08, none of these needed a shorter title subject.

**Per-page structure, counted over the built HTML with the `class="` form:**

| Route | `<h1>` | `<main id="main">` | `<footer>` | JSON-LD | crumb trails | `aria-current` | `tel:` | navy bands |
|---|---|---|---|---|---|---|---|---|
| `/privacy-policy` | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 0 |
| `/terms-of-service` | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 0 |
| `/customer-service-agreement` | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 0 |

**The `tel:` count is one per page today** — `NAPFooter`'s, inside `<footer>`. After plan 02-13
composes `Header` and `StickyCallBar` it becomes three, still under delta 2(b)'s cap of four.
These three pages never reach four: `QuoteFormEntry` is the fourth link and §9.4 keeps it off a
legal page.

**Budget:** JS 129.8 KB / 500 KB (worst `/`, unchanged from baseline — no new JavaScript ships).
Page 290.8 KB / 1024 KB, against a 289.8 KB baseline. **+1.0 KB, entirely gzipped HTML**, and the
worst page moved from `/checklist` to `/privacy-policy`, which is now the longest document on the
site at ~917 words.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] SC-4e demands a primary Button on every page; §9.4 forbids one on all three of these**

- **Found during:** Task 2
- **Issue:** `check:html` went red immediately after the three routes built — `SC-4e:
  /customer-service-agreement: no bhc-btn--primary in built HTML`. The two rules are in direct
  conflict as the harness stands: SC-4e asserts a `class="…bhc-btn--primary"` on every app page not
  in `NO_PRIMARY_CTA_YET`, and UI-SPEC §9.4's legal variation gives these routes Breadcrumbs, a
  centred Hero and `Prose width="narrow"` and explicitly **no** CTABand, BeforeAfterSlider or
  QuoteFormEntry. Nothing sitewide supplies a Button either: the root layout renders only `<main>`
  and `<NAPFooter/>` until plan 02-13 composes `Header` into it. The plan's own acceptance criteria
  assert `bhc-section--navy` is 0 on these pages, so adding a CTABand to satisfy SC-4e would have
  broken this plan's own criterion as well as the spec.
- **Fix:** Added the three routes to `NO_PRIMARY_CTA_YET`. This is the gate's **layout-sense** arm
  rather than its template-sense arm, and the distinction is written above the set: the other
  entries were unfinished templates, these three are complete templates on a layout that does not
  yet carry a Button. It stays self-restoring — §5's CTA table puts `Get a Free Quote` in `Header`
  as a `primary` Button on every page, so 02-13's layout composition will fail the inverse
  assertion and force all four entries out together. The comment also records that nothing in the
  set may be removed by giving a legal page a CTA.
- **What was NOT touched:** `PAGE_EXPECTATIONS` (unchanged, as the plan requires),
  `EXPECTED_APP_ROUTES` (02-13's), `INTERLINK_LOCK_ACTIVE` (Phase 3's), `NO_RATING_YET` (02-13's),
  the `tel:` cap, and every assertion body.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** `check:html` 30/30 green; the three pages each render one `bhc-rating__value`
  so SC-4c still covers them positively.
- **Committed in:** `d9022b0`

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep and no descope. The plan's stated output — "No lock-harness
changes: plan 02-02's `PAGE_EXPECTATIONS` already carries all three entries" — was correct about
`PAGE_EXPECTATIONS` and did not anticipate SC-4e, which is a different table in the same file.

### Additions Beyond Plan

None.

## Issues Encountered

- **Plan 02-13 now owns four `NO_PRIMARY_CTA_YET` entries, not one.** 02-08's summary recorded
  "down to `/_not-found` — the last entry is plan 02-13's". It is four again, and all four come out
  in the same edit when `Header` lands. If 02-13 removes only `/_not-found`, `check:html` goes red
  on three legal pages with a message naming the set, which is the gate doing its job.
- **`Prose width="narrow"` is wider than the default measure, and that is still true here.** 02-04
  measured `--bhc-container-narrow` at 800px against Prose's 68ch default. These are the longest
  single documents on the site, so they are where it will read worst. Nothing was worked around;
  Phase 5 owns the rename.
- **Nobody has signed these documents off.** They are honest, readable, UK-appropriate copy written
  to how the business actually operates, but they are not a solicitor's work. The retention periods,
  the notice window and the late-cancellation charge are conservative defaults chosen because a
  document has to say something. See **Known Stubs**.
- **The satisfaction promise now lives in three places, not two.** `process.js` step 3,
  `legal.js`'s `SATISFACTION` constant, and `TrustBar`'s "Satisfaction guarantee" claim. All three
  must move together when Sam answers UI-SPEC §14-1; the first two carry a comment saying so.

## User Setup Required

None. Zero packages installed.

## Known Stubs

| Stub | File | Why it is here |
|---|---|---|
| The satisfaction promise: `SATISFACTION` is `process.js` step 3 verbatim — no time window, no re-clean commitment | `web/content/legal.js` | UI-SPEC §14-1, awaiting Sam. A promise the business has not agreed to is worse than a vague one, and this sentence now renders on a page headed "Customer Service Agreement" where it is a contractual term rather than marketing copy. A specific policy is a one-string edit in **both** `legal.js` and `process.js`, and `TrustBar`'s third claim should be revisited in the same breath. |
| The commercial numbers: one year / six years retention, a day's cancellation notice, late cancellations chargeable | `web/content/legal.js` | Chosen as defensible UK defaults (six years is the HMRC record-keeping period; a day's notice is the common domestic-cleaning norm) because a legal page cannot be published blank. Each is a single string in a data module. **Confirm with Sam before cutover** — these are the terms customers will be held to. |
| No solicitor review | all three documents | Recorded in the `legal.js` header. Worth a professional read before the site replaces the live one, particularly the liability section of the Terms of Service. |

None of these blocks the plan's goal: all three routes ship real, complete, readable documents
today, and every stub is a string in a data module rather than a structural gap.

## Threat Flags

None. All four files are a data module or server-rendered routes, and the plan's own register is
fully mitigated:

- **T-02-48** (registered-address or postcode block) — the source-level scan over `legal.js` prints
  `ok` for postcode, street-line, phone-digit and email shapes, and SC-2d's sweeps over all thirteen
  built pages are green. The `legal.js` header states the prohibition and deliberately does not
  instance any of the banned shapes.
- **T-02-49** (an email address or second phone number as a contact route) — every "get in touch"
  route in the copy is the contact page named in words. `renderBlocks` emits no anchors at all, so
  this is structural rather than a convention.
- **T-02-50** (the satisfaction promise drifting) — one literal, matching `process.js` verbatim,
  with a comment in each naming §14-1 and the other site.
- **T-02-51** (a third JSON-LD block) — `grep -rc "emitSchema" web/app` is 0 for every file;
  measured 2 blocks on each page.
- **T-02-52** (a malformed prose block) — every authored block validated against the four permitted
  types, and `ul` blocks confirmed to carry arrays.
- **T-02-53** (package installs) — zero.

## Self-Check: PASSED

All five claimed files exist on disk (`web/content/legal.js`, the three `page.jsx` files, and
`web/scripts/check-html-locks.mjs`), and both task commits are in the log: `85602e3`, `d9022b0`.
`npm run verify` exits 0.
