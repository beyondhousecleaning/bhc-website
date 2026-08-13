# Roadmap: Beyond House Cleaning — Website Rebuild

## Overview

The site moves from a 115-page Webflow build (SEO Health 51/100, schema 0/100) to a ~410-page
Next.js/Vercel build engineered for organic and map-pack visibility. Phase 1 stands up the
Next.js shell and wires in the design-system package that already exists (tokens.css + 6
components). Phase 2 finishes the component library the templates need. Phases 3–6 follow the
locked build sequence from `REQ-content-priority-sequencing`: the location×service page engine
first (the biggest lever, 95→336 pages, hub-and-spoke IA), then review visibility, then the full
schema/technical-SEO layer, then content/blog last. Before/after photography is a known blocker
(Sam must pull originals from Canva) but is explicitly not a phase gate — the BeforeAfterSlider
ships with a placeholder state in Phase 2 and gets backfilled with real photos in Phase 4.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Platform Foundation & Design System Integration** - Next.js app live on Vercel, existing design-system wired in, sitewide NAP bug fixed (completed 2026-08-09)
- [ ] **Phase 2: Component Library Completion & Core Templates** - Remaining ~15 components built; Home/Service/Utility templates render correctly
- [ ] **Phase 3: Programmatic Location × Service Engine** - ~336 combo pages + ~56 town hubs live, hub-and-spoke navigable, taxonomy unified
- [ ] **Phase 4: Reviews & Trust at Scale** - 4.9★/175-review badge and review content server-rendered everywhere; real before/afters backfilled where available
- [ ] **Phase 5: Technical SEO & Schema Layer** - Full JSON-LD, all 11 CI locks passing, performance budget met
- [ ] **Phase 6: Content & Blog** - Article template + first post live, without displacing engine priority

## Phase Details

### Phase 1: Platform Foundation & Design System Integration

**Goal**: The Next.js site is live on Vercel with the existing design system wired in, and the sitewide NAP bug is permanently fixed from day one.
**Depends on**: Nothing (first phase)
**Requirements**: REQ-nap-consistency
**Success Criteria** (what must be TRUE):

  1. A Next.js app is deployed to Vercel and reachable at a live URL, built from `design-system/tokens.css`.
  2. Every rendered page uses a single shared NAPFooter showing exactly one phone number, and the `tel:` link's digits match the displayed digits exactly — no street address or postcode anywhere.
  3. The design-system's existing lock tests (`design-system/test/locks.test.js`) run as part of this project's build/CI pipeline.
  4. Hero, Breadcrumbs, RatingBadge, InterlinkBlock and Button render correctly from the design-system package on at least one real page (proof of integration, not just import).

**Plans**: 5 plans across 5 waves
Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Design-system package hardening: expose `fonts/` through the exports map, add the `safeJsonLd` escaping helper and apply it at all 3 JSON-LD call-sites (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — npm workspace, Next.js app, root layout with the single NAPFooter, proof-of-integration page, D-15 crawl block (wave 2)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — Zero-dependency built-HTML lock suite, gzip transfer-weight budget gate, GitHub Actions CI (wave 3)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-05-PLAN.md — Prove the CI gate turns red on a failing lock, then make both jobs required status checks (wave 4, has checkpoint)

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 01-04-PLAN.md — Vercel project connection and live-URL verification, canonical phone-number confirmation (wave 5, has checkpoints)

**UI hint**: yes

### Phase 2: Component Library Completion & Core Templates

**Goal**: Every component the site's templates need exists, and the non-programmatic pages (Home, Service, Utility) render correctly.
**Depends on**: Phase 1
**Requirements**: None directly (infrastructure phase; unblocks REQ-hub-and-spoke-architecture and REQ-review-count-visible in later phases)
**Success Criteria** (what must be TRUE):

  1. Header, Footer, SkipLink, SectionBand, Prose, ServiceCard, TownCard, ProcessSteps, FAQAccordion, CTABand, QuoteFormEntry, StickyCallBar, ReviewCard, ReviewRail, TrustBar and a placeholder-capable BeforeAfterSlider all exist in `design-system/src/components/`, matching the existing `.jsx`/`.html`/`.d.ts`/`.prompt.md` package shape.
  2. Home, all 6 Service pages, and all ~8 Utility pages render on the new site, each with exactly one `<h1>` (fixing the 4 utility pages — `/contact-us`, `/customer-login`, `/gift-cards`, `/work-with-us` — that currently have none).
  3. BeforeAfterSlider renders a clearly-labelled placeholder state when no real photo pairs exist yet, so no page is blocked waiting on the Canva-originals pull.
  4. FAQAccordion is present for users/AI-readability without emitting `FAQPage` schema (D13).

> **Scope note (from planning, 2026-08-09):** the real utility-page count is **10**, not "~8" — the
> live sitemap carries ten non-service, non-location, non-blog URLs and the footer's Legal row links
> three of them, so shipping eight would leave dead internal links. Phase 2 therefore ships
> **17 routes** (1 home + 6 service + 10 utility) plus a real `not-found` template.

**Plans**: 15 plans across 7 waves
Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Package hardening: `src/phone.js`, `toDial` throws (with the existing Lock 4 parity loop narrowed in the same change), NAPFooter literal deleted + WR-10 guard, Breadcrumbs WR-12 + §13-R, `Star` exported, `Button` gains `as`, three `styles.css` corrections, heading-doc remediation (wave 1)
- [x] 02-02-PLAN.md — Multi-page lock harness rewrite around `prerender-manifest.json` (deltas 1–7, 11, 12 + the four unlisted corrections), worst-page budget with WR-05 closed, honest two-route scaffold (wave 1)

**Wave 2** *(blocked on Wave 1)*

- [x] 02-03-PLAN.md — Design-system source locks: delta 9 (four-file shape + `.design-sync` registration), delta 13 (phone throw), delta 14 (inline SVG a11y), `MIN_TESTS` raised (wave 2)
- [x] 02-04-PLAN.md — Content primitives: SectionBand, Prose, ProcessSteps, CTABand + the two scoped focus overrides (wave 2)

**Wave 3** *(blocked on Wave 2)*

- [x] 02-05-PLAN.md — Cards & disclosure: ServiceCard, TownCard, FAQAccordion, QuoteFormEntry (wave 3)
- [x] 02-06-PLAN.md — App data foundation: `jsconfig.json` `@/*` alias, `site.js` (incl. `AREA_SERVED`), `nav.js`, `process.js`, `faqs.js`, and the shared `renderBlocks` (wave 3)

**Wave 4** *(blocked on Wave 3)*

- [x] 02-07-PLAN.md — Trust components: TrustBar, ReviewCard, ReviewRail, BeforeAfterSlider (SC-3) (wave 4)
- [x] 02-08-PLAN.md — Seven core utility routes + `utility.js`; fixes three of the four `<h1>`-less pages (wave 4)
- [x] 02-09-PLAN.md — Three legal routes + `legal.js` (wave 4)

**Wave 5** *(blocked on Wave 4)*

- [x] 02-10-PLAN.md — Navigation shell: SkipLink, Footer, Header (zero-JS disclosure), StickyCallBar (wave 5)
- [x] 02-11-PLAN.md — Home page + `home.js` (wave 5)
- [x] 02-12-PLAN.md — Service dynamic route + `services.js`, six pages at ≥800 words each (wave 5)

**Wave 6** *(blocked on Wave 5)*

- [x] 02-13-PLAN.md — Root layout composition (Footer replaces the direct NAPFooter call, `areaServed` threaded through), real 404 template, landmark locks, `EXPECTED_APP_ROUTES` raised to 18, delta 8 photo-state lock (wave 6)
- [x] 02-14-PLAN.md — Preview floor raised to 22, README and `.design-sync/NOTES.md` refresh (wave 6)

**Wave 7** *(blocked on Wave 6)*

- [ ] 02-15-PLAN.md — Phase verification: success-criteria evidence table, CI run confirmation, human visual + keyboard checkpoint (wave 7, has checkpoint)

**UI hint**: yes

### Phase 3: Programmatic Location × Service Engine

**Goal**: The location×service page matrix — the single biggest lever per `REQ-content-priority-sequencing` — is live at full scale and properly interlinked.
**Depends on**: Phase 2
**Requirements**: REQ-programmatic-page-scale, REQ-fix-duplicate-coventry, REQ-canonical-service-taxonomy (D14), REQ-content-depth-bar, REQ-hub-and-spoke-architecture
**Success Criteria** (what must be TRUE):

  1. A single towns-data file drives generation of all combo pages, targeting post towns/named suburbs (never bare postcode districts) across ~56 towns spanning Warwickshire, Coventry, Solihull South, and the B/DY/TF/WS/WV postcode areas.
  2. `/locations`, `/locations/<town>`, and `/location/<region>/<town>/<service>` all resolve — no 404s — and the 95 existing Warwickshire combo URLs are unchanged (zero redirects, per D2).
  3. The 4 Americanised service slugs 301 to their UK equivalents; `south-coventry`/`coventry-south` is resolved to one slug plus a working `coventry` town page.
  4. Every combo page has a real keyword-bearing `<h1>`, ≥800 unique body words, and reaches its parent town hub and the locations index via InterlinkBlock links computed from geography (never hand-picked).
  5. New pages are rolled out in batches of 50–100, not all ~241 new pages at once.

> **Inherited from Phase 2 planning:** `INTERLINK_LOCK_ACTIVE` in `web/scripts/check-html-locks.mjs`
> is `false` with a self-restoring inverse assertion — the first page that renders an InterlinkBlock
> fails the suite and forces the constant to be flipped. Phase 3 does not flip it; `03-RESEARCH.md`
> verified that setting it `true` reddens twelve correct pages, so plan 03-01 replaces it with a
> per-template rule (delta 16) and plan 03-20 empties the staged pending set.

> **Scope note (from planning, 2026-08-11):** the derived scale is **58 towns · 348 combos · 258 new
> combos · 57 new hubs · 317 new pages · 426 built routes**, re-derived by crossing
> `docs/research/service-area-coverage.md`'s 39 post towns with the frozen sitemap's 19 town slugs.
> The "~56 / ~336 / ~241" figures above predate that cross and are stale. **Phase 3 completes with
> batch 1 published** — 21 towns, 58 new pages, **167 app routes** — because the site is `noindex`
> until cutover (D-15), so the indexation interval SC-5 exists to protect only starts then.
>
> **Batches 2-5 are NOT a one-line increment, and no phase currently owns them.** Plans 03-11, 03-12
> and 03-13 author town and hub prose for the 21 batch-1 towns only — about 16,700 words. The other
> **37 towns need roughly 30,500 more authored words** (opener, locality paragraph and two hub blocks
> each). That figure is `03-VALIDATION.md`'s own arithmetic — it states ~82,600 for the whole corpus
> and ~52,100 for batch 1, and the remainder is 30,500; counting the four per-town fragments directly
> gives ~29,200. Both are about 800 words per town. Plan 03-16's prose-coverage guard makes a bare
> `PUBLISHED_BATCHES` increment a **red build at module load**, deliberately — a batch cannot publish
> towns whose prose does not exist. Each batch is therefore ~800 words per town plus the
> increment plus a raised route floor. Tracked as a post-v1 backlog item in STATE.md's Deferred Items
> table; Phases 4, 5 and 6 do not carry it.
>
> Two items ship as working defaults and are ratified by Sam in plan 03-24, not assumed:
> **five** of the 95 frozen URLs 301 (the `coventry-south` set — D2 says zero, SC-3 says resolve the
> duplicate, and 90 are untouched), and **two** service slugs 301 rather than D14's "4" (D14's own
> eight canonical concepts already contain the other two). The sitemap is settled as **Phase 5's**;
> Phase 3 ships only the harness filter that stops a sitemap route detonating the lock suite.

**Plans**: 24 plans across 9 waves
Plans:
**Wave 1**

- [x] 03-01-PLAN.md — Wave 0 harness rewrite: metadata-route filter, delta 18 template resolver, delta 16 and 21 per-template rules, delta 26 floor mechanism, one commit (wave 1)
- [x] 03-02-PLAN.md — Package: `geo.js` `metaFor`, the `./geo` subpath export, three CSS classes, the honest rail heading (wave 1)
- [x] 03-03-PLAN.md — Service-variant grid: domestic cleaning, 8 subjects x 8 stages (wave 1)
- [ ] 03-04-PLAN.md — Service-variant grid: deep cleaning (wave 1)
- [ ] 03-05-PLAN.md — Service-variant grid: end of tenancy cleaning (wave 1)
- [ ] 03-06-PLAN.md — Service-variant grid: flat cleaning (wave 1)
- [ ] 03-07-PLAN.md — Service-variant grid: builders clean (wave 1)
- [ ] 03-08-PLAN.md — Service-variant grid: holiday let cleaning (wave 1)
- [ ] 03-10-PLAN.md — The 45 county notes, service x county (wave 1)
- [ ] 03-11-PLAN.md — Town prose: 21 openers and 21 locality paragraphs (wave 1)
- [ ] 03-12-PLAN.md — Hub prose A: the town, and us in it, x21 (wave 1)
- [ ] 03-13-PLAN.md — Hub prose B: which clean do you need, x21 (wave 1)

**Wave 2** *(blocked on Wave 1)*

- [ ] 03-09-PLAN.md — Service-variant grid: move-out cleaning, with the cross-deck separation proof against end of tenancy (wave 2)
- [ ] 03-14-PLAN.md — The D14 rename: two slugs, four noun corrections, nav/home/faqs/reviews follow, and the `faqs.js` guard that closes the silent-failure path (wave 2)

**Wave 3** *(blocked on Wave 2)*

- [ ] 03-15-PLAN.md — `/services/apartment-cleaning`: the seventh record, its FAQs, its rail and its two chrome links (wave 3)

**Wave 4** *(blocked on Wave 3)*

- [ ] 03-16-PLAN.md — `towns.js`: 58 rows, COMBO_SERVICES, the Latin square, PUBLISHED_TOWNS and eleven module-load guards (wave 4)

**Wave 5** *(blocked on Wave 4)*

- [ ] 03-17-PLAN.md — Combo composition: the variant aggregator, the checklists, `combo.js`, `reviewsForCombo`, and the similarity arithmetic measured before any page is built (wave 5)
- [ ] 03-18-PLAN.md — Hub and index composition, plus the four bounded interlink builders (wave 5)

**Wave 6** *(blocked on Wave 5)*

- [ ] 03-19-PLAN.md — The three route files in one commit, the nav item, the 404 recovery link and the route floor at 167 (wave 6)

**Wave 7** *(blocked on Wave 6)*

- [ ] 03-20-PLAN.md — Home and the seven service pages gain their InterlinkBlock and a tint FAQ band; the staged set is emptied (wave 7)
- [ ] 03-21-PLAN.md — The redirect table at `statusCode: 301` and `check-redirects.mjs` — the 90/5 contract, derived from the frozen sitemap (wave 7)

**Wave 8** *(blocked on Wave 7)*

- [ ] 03-22-PLAN.md — Harness deltas 17, 19 (per-template), 20, 25, 27 (new from scratch) and 28 (wave 8)
- [ ] 03-23-PLAN.md — `check-content.mjs`: delta 22 depth floors and delta 23 similarity, Jaccard plus the restored cosine metric (wave 8)

**Wave 9** *(blocked on Wave 8)*

- [ ] 03-24-PLAN.md — Phase verification: success-criteria evidence, the two ratification decisions, visual and keyboard sign-off (wave 9, has checkpoints)

**UI hint**: yes

### Phase 4: Reviews & Trust at Scale

**Goal**: The 4.9★/175-review trust signal is visible, server-rendered, and growing, everywhere it matters — and real before/after photos replace placeholders wherever Sam has supplied them.
**Depends on**: Phase 3
**Requirements**: REQ-review-count-visible
**Success Criteria** (what must be TRUE):

  1. The rating badge (stars + review count) appears in server-rendered HTML — verifiable via view-source, not just a rendered DOM — on every template type (home, service, town hub, combo, utility).
  2. Review count/rating also appears in page titles and meta descriptions per the audit's recommendation (brand + review count lead).
  3. ReviewRail/ReviewCard show town-filtered reviews on town hub and combo pages where available, and the 516 KB Trustmary widget is fully removed.
  4. BeforeAfterSlider shows real matched photo pairs wherever photos have been supplied from the Canva-originals pull, and the Phase 2 placeholder everywhere else — no page is blocked on photography.

> **Inherited from Phase 2 planning:** review quotes are capped at 320 characters **at the data
> layer**, truncated at a word boundary — a property of the data contract, not the CSS, because with
> no client JS a CSS clamp would hide text from sighted users that screen readers still receive.
> `RatingBadge.emitSchema` is deliberately OFF everywhere in Phase 2; turning it on changes the
> JSON-LD block counts the lock suite asserts.

**Plans**: TBD
**UI hint**: yes

### Phase 5: Technical SEO & Schema Layer

**Goal**: Every page emits complete, server-rendered structured data, the full SEO CI lock suite passes, and every on-site lever for organic + map-pack visibility is in place.
**Depends on**: Phase 4
**Requirements**: REQ-organic-visibility
**Success Criteria** (what must be TRUE):

  1. `LocalBusiness`+`areaServed` (no `streetAddress`), `Organization`+`sameAs`, `WebSite`, `Service`+`areaServed`, `BreadcrumbList`, and `AggregateRating` (entity-graph only) are all present in server-rendered HTML on the correct pages, verifiable without running JS.
  2. All 11 `docs/design/design-system.md` CI locks pass in the build pipeline (one `<h1>`; breadcrumbs everywhere; rating badge everywhere; single correct `tel:`; no address/postcode; InterlinkBlock present; alt text on every image; title ≤60 chars containing the town / description ≤155 chars; JSON-LD server-rendered; no third-party script >50 KB unsigned-off; ≥800 words).
  3. Total JS is under 500 KB and total page weight under 1 MB on a representative combo page (down from 1.9 MB today).
  4. The sitemap includes `<lastmod>` for every URL, and `robots.txt` allows crawling (`User-agent: *` present).

> **Inherited from Phase 2 planning:** Lock 8's "title contains the town" clause must be scoped to
> the town-bearing templates (combo, town hub) or it fails on thirteen correct pages. The 900px and
> 720px breakpoints on `.bhc-hero__grid` and `.bhc-footer__grid` were deliberately left alone in
> Phase 2 and are normalised here.

**Plans**: TBD
**UI hint**: yes

### Phase 6: Content & Blog

**Goal**: The content/blog layer exists without having displaced or slowed the location engine, reviews, or technical SEO work that precede it.
**Depends on**: Phase 5
**Requirements**: REQ-content-priority-sequencing (this phase is where the deferred content-scope item becomes active work; the requirement itself is satisfied by the roadmap's ordering, see REQUIREMENTS.md)
**Success Criteria** (what must be TRUE):

  1. One article/blog template exists, built from the same design-system components and passing the same CI lock suite as every other template.
  2. At least one real blog post is published live using the template — server-rendered, correct schema, breadcrumbs, and NAP footer, same as any other page.
  3. The blog listing is reachable from the site without competing for primary navigation placement with Services or Locations.

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Platform Foundation & Design System Integration | 5/5 | Complete   | 2026-08-09 |
| 2. Component Library Completion & Core Templates | 14/15 | In Progress|  |
| 3. Programmatic Location × Service Engine | 3/24 | In Progress|  |
| 4. Reviews & Trust at Scale | 0/TBD | Not started | - |
| 5. Technical SEO & Schema Layer | 0/TBD | Not started | - |
| 6. Content & Blog | 0/TBD | Not started | - |
