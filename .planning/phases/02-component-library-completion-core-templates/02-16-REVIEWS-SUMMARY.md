---
phase: 02-component-library-completion-core-templates
plan: 16
wave: post-phase (Phase 4 work pulled forward)
subsystem: content-and-trust
status: complete
tags: [reviews, server-rendered-content, seo-audit-a3, seo-audit-b5, review-rail, rating-badge, closed-cta-set, lock-harness]

# Dependency graph
requires:
  - phase: 02
    plan: 07
    provides: "ReviewCard and ReviewRail as built — the 320-char data-layer cap, the null-on-empty contract, the focusable scroll track, and the `id` prop that made this a data change"
  - phase: 02
    plan: 11
    provides: "web/app/page.jsx and home.js — the Home template, its band order, and the ReviewRail call site left unbanded on purpose"
  - phase: 02
    plan: 12
    provides: "web/app/services/[service]/page.jsx and services.js — the six-page template and the slug set this module guards itself against"
  - phase: 02
    plan: 02
    provides: "check-html-locks.mjs — PAGE_EXPECTATIONS, the class=\"[^\"]*… counting rule, and the gated-inverse idiom the new locks follow"
  - phase: 02
    plan: 06
    provides: "web/content/site.js — RATING (4.9 / 175 / Google) and describe(), the single source the aggregate is re-exported from"
provides:
  - "web/content/reviews.js — eighteen real, verbatim Google reviews plus the published aggregate, HOME_REVIEWS, reviewsForService(slug), REVIEWS_ANCHOR and REVIEWS_CTA"
  - "Server-rendered review prose on seven routes: six cards on / and three on each of the six service pages"
  - "UI-SPEC §5's `Read Our Reviews → #reviews` action, restored and resolving"
  - "check-html-locks.mjs SC-4h, SC-4i and delta 15 — the first assertions in the project that the reviews and the rating are content rather than JavaScript"
  - "PAGE_EXPECTATIONS gains reviewCards, a per-route COUNT"
  - ".bhc-section__action — a plain class for one band-level action, the .bhc-service-card__grid arrangement"
affects: [phase-03-locations-layer, phase-04-content-and-photography, phase-05-schema-and-performance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Honouring a data-layer character cap by SELECTION rather than truncation — every shipped quote already fits, so a whole review reaches the card and no ellipsis is ever authored"
    - "Re-exporting a shared constant as the module's own aggregate (REVIEW_AGGREGATE = RATING) rather than restating the pair, so the rail, the badge and the meta description on one page cannot disagree"
    - "A module-load drift guard comparing one module's key set against another's (SERVICE_REVIEWS vs services.js slugs), so a Phase 3 slug rename is a red build rather than a silently railless page"
    - "Asserting content is server-rendered by extracting it from the MARKUP HALF of the built HTML and requiring real prose length — a class-name count proves a component mounted, not that a crawler can read it"
    - "Assembling a multi-value phrase in JS before rendering it, because React separates adjacent JSX children with comment markers and the phrase then exists nowhere contiguously in the served bytes"
    - "Closing a lock's known gap instead of deleting the feature that fell into it — delta 15 resolves in-page anchors, which is what the withdrawn CTA had been sacrificed to"

key-files:
  created:
    - web/content/reviews.js
    - .planning/phases/02-component-library-completion-core-templates/02-16-REVIEWS-SUMMARY.md
  modified:
    - web/app/page.jsx
    - web/app/services/[service]/page.jsx
    - web/content/home.js
    - web/scripts/check-html-locks.mjs
    - design-system/src/components/RatingBadge/RatingBadge.jsx
    - design-system/src/components/ReviewCard/ReviewCard.d.ts
    - design-system/src/components/ReviewCard/ReviewCard.prompt.md
    - design-system/src/components/ReviewRail/ReviewRail.jsx
    - design-system/src/components/ReviewRail/ReviewRail.d.ts
    - design-system/src/components/ReviewRail/ReviewRail.prompt.md
    - design-system/src/components/SectionBand/SectionBand.prompt.md
    - design-system/styles.css
    - .planning/phases/02-component-library-completion-core-templates/02-UI-SPEC.md
  deleted:
    - reviews_raw.json

decisions:
  - "The aggregate stays 4.9 / 175 — the published figure — and is NOT recomputed from the eighteen or the 166. The extract averages 4.98 because the widget only carries reviews that have comment text; publishing that would overstate the rating against what Google itself shows"
  - "Eighteen reviews, not 166: the rail is three columns at 1024px, the page budget is real, and the 320-character cap is met by selecting quotes that already fit rather than by truncating longer ones"
  - "Surnames reduced to an initial, per the shipped ReviewCard.d.ts contract. Quote text is untouched — typos, doubled spaces and a space before a comma all ship as written"
  - "No `date` and no `town` on any record. The payload carries neither, so ReviewCard.d.ts's `date` became optional rather than a fabricated month appearing on eighteen cards"
  - "ReviewRail is now wrapped in a `warm` SectionBand on all seven routes. Unbanded was right while it rendered null; banded is right now that it has content, and `warm` is the only tone that is neither neighbour's"
  - "The restored CTA lives in the home trust band, and its label and href are authored in reviews.js beside the anchor constant — not in home.js, whose acceptance check greps it for that label"
  - "PAGE_EXPECTATIONS gains reviewCards as a COUNT rather than a boolean, so a page cannot silently lose five of its six cards"
  - "RatingBadge.emitSchema stays OFF and the JSON-LD block counts are unchanged — CR-05 is Phase 5 SC-1's, and self-serving review markup is ineligible for rich results anyway"

metrics:
  duration: 95min
  completed: 2026-08-11
  tasks: 5
  files: 14
---

# Phase 2 Plan 16: Real Google Reviews, Server-Rendered

**This is Phase 4 work pulled forward at Sam's explicit request, executed as a standalone task —
there was no PLAN.md for it.** It closes two of the 2026-08-06 audit's recommendations at once:
**a3** (the rating in HTML and in meta descriptions) and the content half of **b5** (server-render
the reviews instead of shipping a 528 KB widget).

Eighteen real, verbatim Google reviews now render as server HTML on seven routes — six cards on
`/`, three on each of the six service pages — from one data module. The withdrawn
`Read Our Reviews` call to action is back and resolves. Three new locks make all of it permanent.

## The Problem This Fixes

`ReviewRail` and `ReviewCard` shipped in plan 02-07 and had rendered nothing since. Every template
composed them with an empty array on purpose (02-11-SUMMARY, Known Stubs) because the component
returns `null` without data and seeding invented testimonials was never an option. The live
Webflow site holds 175 reviews at 4.9 inside a third-party bundle, so **not one of them is indexed
content on any of its 115 pages**, and the rating appears in 0 of its 115 meta descriptions.
Arbor Trail opens *every* description with their review count.

## What Was Built

### Task 1 — `web/content/reviews.js` (commit `23358d3`)

The data module, in the `site.js` / `services.js` house style.

| Export | Contents |
|---|---|
| `REVIEWS` | eighteen verbatim reviews — `{ id, author, rating, quote, source }` |
| `REVIEW_AGGREGATE` | `RATING` from `site.js`, re-exported — 4.9 from 175 Google reviews |
| `HOME_REVIEWS` | six, one per service |
| `reviewsForService(slug)` | three per service page, a different three each |
| `REVIEWS_ANCHOR` / `REVIEWS_CTA` | `reviews`, and the action built from it |

**Provenance, stated in the file header.** Extracted 2026-08-11 from the review-widget bundle the
live site already loads. 166 unique reviews as `{name, text, stars}` — 163 at five stars, 3 at
four; text length 7 / 122 / 1099 (min / median / max).

**The arithmetic, which is the part that is easy to get wrong.** The 166 average **4.98**, because
the widget only carries reviews that have comment text — the silent ratings are not in it and are
not in that mean. Publishing 4.98 would overstate the rating against what Google shows. The
aggregate is therefore the **published** figure, 4.9 from 175, re-exported from `site.js` rather
than restated, so the rail, the hero badge and the meta description on one page cannot disagree.
The header says this at length, above the numbers, so the next reader cannot "helpfully" recompute
it.

**Verbatim, and nothing else.** No review text is written, paraphrased, shortened or corrected.
The typos (`Thank uou`, `anyday`, `highley`), the doubled spaces and the space before a comma are
all in the originals and are the evidence these were written by customers. One mechanical repair
was made and it changes no words: the extract had been decoded a byte at a time rather than as
UTF-8, so apostrophes arrived as mojibake; re-encoding and decoding as UTF-8 restores what the
customer typed. All eighteen selected quotes are pure ASCII after that repair, checked rather than
assumed.

**Four selection rules, all of them recorded in the file:**

1. **≤ 320 characters, met by selection not truncation.** UI-SPEC §7.13 permits truncating at a
   word boundary at ingest; this module does not use that permission. Longest shipped quote is 271
   characters, shortest 90. The 1099-character review and the two ~500-character ones are excluded
   for that reason alone — including the only review that names a town.
2. **Surnames reduced to an initial**, per `ReviewCard.d.ts`'s stated `author` contract. See the
   deviation below.
3. **No `date`, no `town`.** The payload has neither. Inventing a month to fill a card is the same
   defect as inventing the review.
4. **Spread of service mentioned.** Each service page's trio leads with the review that names that
   job; `HOME_REVIEWS` takes one per service so the home rail reads as varied rather than as six
   ways of saying "great service, would recommend".

**One four-star review is in deliberately** (`kiran-j`, "took a little getting used to the
process"). A wall of nothing but five stars reads as curated, which is exactly what it would be if
the only four-star review that fits were dropped.

**Privacy screen.** All 166 extracted reviews were run against `check-html-locks.mjs`'s own
`POSTCODE_SPACED`, `POSTCODE_COMPACT` and `STREET_LINE` matchers *before* any selection was made —
zero matched — and the eighteen were screened again individually, plus for 7+ digit runs and `@`.
SC-2d against built HTML is the backstop, not the primary control.

`reviews_raw.json` was consumed and **deleted**. This module is the committed source of truth.

### Task 2 — design-system corrections (commit `176bf3f`)

**`RatingBadge` now assembles its summary in JavaScript.** It built `from {count} {source} reviews`
from adjacent JSX children, and React serialises those as separate text nodes with `<!-- -->`
markers between them. Measured on the shipped build:

```
<span class="bhc-rating__count">from <!-- -->175<!-- --> <!-- -->Google<!-- --> reviews</span>
```

It rendered correctly and read correctly, and the phrase **did not exist as a contiguous run of
text in the served file** — which is the form anything reading the bytes looks for, and audit a3 is
a claim about the bytes. Now:

```
<span class="bhc-rating__count">from 175 Google reviews</span>
```

Visible output unchanged. `emitSchema` untouched and still off everywhere.

**`ReviewCard.d.ts`: `date` is optional.** The payload has no per-review date, so a required field
made a fabricated month on eighteen cards the only way to satisfy the type.

**Four doc files corrected.** `ReviewRail.jsx`, `.d.ts` and `.prompt.md` and
`ReviewCard.prompt.md` each asserted "nothing links to the reviews anchor in Phase 2" and "Phase 4
supplies the data". Both were true when written and are false now. Rewritten to record what
actually happened — and to keep the half that has *not* changed: fabricated testimonials remain
banned under the DMCC Act 2024 and contradict the whole positioning.

### Task 3 — Home (commit `970361b`)

`ReviewRail` takes `HOME_REVIEWS` and is wrapped in a `warm` `SectionBand`.

**Re-examined, as the brief asked.** Plan 02-11 rendered it bare on purpose and was right to: a
band around a `null` emitted a headless empty `<section>` into every build *and* put the FAQ band's
paper ground next to another paper ground. With content, the rail needs the band's container and
vertical rhythm like every other section, and `warm` is the only tone that is neither neighbour's.
The band carries no heading — the rail supplies its own `<h2>` from the package default.

**Observed band order, extracted from the markup half of the built `index.html`:**

```
paper -> warm -> paper -> tint -> warm -> paper -> navy
```

No two adjacent equal. One navy band, last before the footer. UI-SPEC §4's adjacency rule intact.

**The CTA is back, in the trust band** — the three closed-set trust claims, then the way to the
evidence for them. Label and href both come from `reviews.js`, whose href is built from the same
constant the rail's `id` is set from, so the link and its target cannot drift.

`.bhc-section__action` is a **plain class** in SectionBand's CSS block, supplying one thing: the
`--bhc-space-6` gap above. This is the `.bhc-service-card__grid` arrangement, deliberately.
`SectionBand` gains no `actions` prop — a band that can carry its own CTA is a second, weaker CTA
surface on all eighteen call sites, competing with `CTABand` above the footer.

`home.js`'s header no longer claims the third action is withdrawn, and **still does not quote its
label**: the acceptance check for that file greps it for exactly that string. Twelfth avoided
scanner self-collision this phase.

### Task 4 — the six service pages (commit `cee847e`)

`reviewsForService(service)` gives each page a different trio, in the same `warm` band.

**Observed on all six built pages:**

```
paper -> warm -> tint -> warm -> paper -> navy
```

`warm` twice is fine — §4's rule is about adjacency, not frequency, and `tint` sits between the
slider and the rail.

Three rather than six: these pages already carry ~1,000 words of prose and a photo band above the
rail, and six pages sharing one eighteen-review pool is what keeps them distinct without eighteen
more reviews of near-identical praise. No CTA was added here — the rail is already on the page and
these templates have no trust band to hang it under.

### Task 5 — the lock harness (commit `61c67ad`)

**31 → 37 built-HTML locks.** Three new assertions plus a regression guard for each, per the
file's own rule that a lock which passes today must be shown to fail on the shape it rejects.

| Lock | What it asserts |
|---|---|
| **SC-4h** | Review **prose** is in the MARKUP HALF of the built file — each `<blockquote>` extracted from everything before the first flight-payload chunk, tags stripped, ≥40 characters of real text required. A client-rendered rail puts its text in the payload and nothing in the markup half, and fails here. Card count per route comes from `PAGE_EXPECTATIONS`. |
| **SC-4i** (two tests) | The figure is a **contiguous** phrase in the served markup, and every meta description that exists carries `4.9`, `175` and `Google`. |
| **delta 15** | Every in-page anchor on every built page resolves to an element carrying the matching id. |

**`reviewCards` joins `PAGE_EXPECTATIONS` as a COUNT, not a boolean** — 6 on `/`, 3 on each service
page, **0 on the other eleven**. The negative half is what stops a rail appearing where nobody
composed one; the count is what stops a page silently losing five of its six cards. `delta 1` now
requires the field, so a new route without one is a hard failure.

**delta 15 closes the hole the CTA was deleted over.** `delta 6` resolves only hrefs beginning with
a slash and skips everything else. UI-SPEC §5 revision 1 withdrew `Read Our Reviews` *because* of
that gap. The gap was always the defect; removing links from the site was working around it.

`NO_META_DESCRIPTION` holds `/_not-found` (measured: it emits no description meta at all) and is
asserted in the **inverse**, so the exemption is self-restoring — the established idiom of
`INTERLINK_LOCK_ACTIVE`, `NO_RATING_YET` and `NO_PRIMARY_CTA_YET`.

The rating figures are **restated** in the harness rather than imported. `PAGE_EXPECTATIONS` is a
literal for the same reason: a lock that reads its expectation from the code it checks can only
assert "the value was threaded", never "the value is right".

`NO_RATING_YET` needed no change — it was already empty. **Nothing in the harness asserted the
reviews area was absent**, which was itself the gap: `bhc-reviewrail` appeared nowhere in the file
before this plan.

## Verification

`npm run verify` **exits 0.**

| Gate | Before | After |
|---|---|---|
| `npm run test:locks` | 20 pass | **20 pass** (unchanged) |
| `npm run check:html` | 31 pass | **37 pass** |
| JS (gzip, modern) | 129.8 KB / 500 KB | **129.8 KB / 500 KB** (unchanged) |
| Page (worst) | 298.4 KB / 1024 KB | **299.4 KB / 1024 KB** (`/services/deep-cleaning`) |
| App routes | 18 | 18 |
| Components | 22 | 22 |

**+1.0 KB on the worst page** for eighteen reviews across seven routes, three of them on that page.
The RSC flight payload carries a second copy of the rendered text, and that is included in the
figure.

Measured against build output:

| Assertion | Form used | Expected | Observed |
|---|---|---|---|
| Review cards on `/` | `class="[^"]*bhc-review__quote` | 6 | 6 |
| Review cards per service page | same | 3 | 3 on all six |
| Review cards elsewhere | same | 0 | 0 on all eleven |
| Quotes in the markup half | `<blockquote>` before `self.__next_f` | 6 / 3 | 6 / 3, all ≥90 chars |
| `id="reviews"` | plain-string split | 1 per rail page, 0 otherwise | as expected |
| In-page anchors | `<a href="#…"` vs `id="…"` | all resolve | `#main` on 18, `#reviews` on 1 — all resolve |
| Rating phrase, contiguous | `from 175 Google reviews` in markup half | present | present on all 18 |
| Rating in description | `4.9` + `175` + `Google` | present | present on 17; `/_not-found` emits none |
| Home band order | markup-half modifier list | no two adjacent equal | `paper warm paper tint warm paper navy` |
| Service band order | same | no two adjacent equal | `paper warm tint warm paper navy` ×6 |
| Navy bands | `class="[^"]*bhc-section--navy` | 1 | 1 |
| JSON-LD blocks | `<script[^>]*type="application/ld+json"` | 1 on `/`, 2 elsewhere | unchanged |
| Postcode / street line | SC-2d matchers | 0 | 0 |
| First-party client modules | every `page_client-reference-manifest.js` | 0 | 0 |
| Client directive | `web/app`, `web/content`, `design-system/src` | 0 | 0 |

**Mutation-checked, not just run.** `RATING_COUNT` 175 → 176 turns **both** SC-4i tests red;
`reviewCards` 6 → 5 on `/` turns SC-4h red. Both reverted.

**Zero `tel:` links added.** The cap is 4 and `/get-a-quote` and `/customer-login` sit exactly on
it. `emitSchema` untouched. JSON-LD counts unchanged.

## Deviations

There was no PLAN.md, so these are departures from the brief rather than from a plan.

**1. [Rule 2 — data contract] Surnames reduced to an initial**

- **Found during:** Task 1.
- **Tension:** The brief says do not "tidy" a reviewer name. `ReviewCard.d.ts`'s shipped `author`
  contract says "First name and initial, or a first name. **Never** a full name with a street."
- **Resolution:** The contract wins, and the two are not really in conflict. The brief's concern is
  fabrication — "quote verbatim or do not quote" — and an initial fabricates nothing; it removes
  personal data. `Cheryl Kumar` → `Cheryl K.`. Quote text is untouched, including the first names
  of the cleaners customers name in it. `Wayne BnB` → `Wayne B.` follows the same mechanical rule.
- **Files:** `web/content/reviews.js`. **Commit:** `23358d3`.

**2. [Rule 1 — bug] The rating phrase was fragmented in the served HTML**

- **Found during:** Task 2, while writing the lock for audit item a3.
- **Issue:** `RatingBadge` built the phrase from adjacent JSX children, so React emitted it as five
  text nodes separated by `<!-- -->`. The claim "the rating is in the HTML" was true of the render
  and false of the bytes.
- **Fix:** assembled in JS. **Files:** `RatingBadge.jsx`. **Commit:** `176bf3f`.

**3. [Rule 2 — missing critical functionality] `ReviewCard.d.ts` required a `date` nothing supplies**

- **Found during:** Task 1. Made optional rather than filled. **Commit:** `176bf3f`.

**4. [Rule 2] `delta 15` — a lock the brief did not ask for**

- **Found during:** Task 5. The brief asked that the restored CTA not dead-end. Asserting it for
  one href on one page would have left the gap that caused the original withdrawal. The generic
  lock is the fix; the specific one is a symptom check.
- **Commit:** `61c67ad`.

**5. [Rule 2] `.bhc-section__action` — a new CSS class**

- **Found during:** Task 3. The restored action needed a gap above it and no existing class supplies
  one outside `Hero`, `CTABand` and `QuoteFormEntry`, all of which are component-owned. One
  declaration, documented in `SectionBand.prompt.md`, explicitly not a component prop.
- **Commit:** `970361b`.

**6. [Documentation] UI-SPEC §5, §7.14 and §13-P corrected**

- The spec still said the CTA was withdrawn and that Phase 4 would supply the data. Left uncorrected
  it would misinform Phase 3 planning. §5 gained a **Revision 2** note, §7.14 was rewritten, and
  §13-P is struck through and marked reversed — with the reasoning preserved, because the original
  argument was sound and only its premises expired. §13-Q gained the by-selection-not-truncation
  clause.

### Scanner self-collision — avoided, on the twelfth occurrence

Three greps bear on the files touched here: the `Read Our Reviews` label against `home.js`, the
`emitSchema` prop name against `web/app`, and the phone digits against `web/app`. Every comment
written in this plan **describes** the banned shape and names the spec section holding it. The CTA
label is authored in `reviews.js` — which no grep polices — precisely so `home.js` can explain the
restoration without instancing the string. All three greps return 0.

## Known Stubs

| Stub | File | Reason |
|---|---|---|
| `BeforeAfterSlider` with no `pairs` | `page.jsx`, `[service]/page.jsx` | **Unchanged and deliberate — ROADMAP SC-3.** Still Phase 4's, still blocked on Sam pulling the Canva originals. `data-bhc-photo-state="pending"` still renders on exactly seven pages. |

The `ReviewRail reviews={[]}` stub recorded in 02-11-SUMMARY is **closed**.

No stub in this plan. Nothing renders placeholder review content anywhere.

## Threat Flags

None. This plan adds no network endpoint, no auth path, no file access and no schema at a trust
boundary.

It does add **the first copy in the site written by someone other than us**, which is an
information-disclosure surface rather than a threat-model one. Controls, in order: the 166-review
pre-selection screen against the harness's own postcode and street-line matchers; a per-quote
re-screen of the eighteen; the surname reduction; the absence of any town or date field; React's
escaping of children (no review string reaches a script context — `RatingBadge` is the only
JSON-LD emitter in the package and does not take review text); and SC-2d over built HTML as the
backstop. T-02-64 (one JSON-LD block on Home) and T-02-66 (no `RatingBadge` on navy) both re-checked
and still hold.

## Notes for Later Plans

- **Phase 3** — `reviewsForService` throws at module load if its key set drifts from `services.js`,
  so §13-C's canonical-slug rename must update `reviews.js` too. It will be a red build, not a
  silent gap. Town-level rails: `ReviewRail` already takes `town` and narrows its own heading, but
  **there is no town data on any review** and none may be invented to fill it.
- **Phase 4** — the review half of this phase's backlog is done. `BeforeAfterSlider` is still
  waiting on photography, and its `pending` marker is still the hand-off. If a live review pull is
  ever built, it must honour the 320-character cap and must not recompute the aggregate from the
  reviews it can see.
- **Phase 5 SC-1** — `emitSchema` is still off everywhere and CR-05 is still open. When
  `AggregateRating` is attached to the `#business` entity, `SC-4f`'s block counts change and
  `SC-4i` should be extended to assert the schema figure matches the rendered one.
- **The extract is gone.** Refreshing the reviews means re-extracting from the widget payload. The
  aggregate is a separate, manually verified figure and does not come from that extract.

## Self-Check: PASSED

- `web/content/reviews.js` — FOUND
- `reviews_raw.json` — CONFIRMED ABSENT from the worktree
- `.planning/phases/02-component-library-completion-core-templates/02-16-REVIEWS-SUMMARY.md` — FOUND
- commit `23358d3` — FOUND
- commit `176bf3f` — FOUND
- commit `970361b` — FOUND
- commit `cee847e` — FOUND
- commit `61c67ad` — FOUND
- `npm run verify` — exit 0 (20 + 37 tests, budget green)
