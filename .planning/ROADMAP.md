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

- [ ] **Phase 1: Platform Foundation & Design System Integration** - Next.js app live on Vercel, existing design-system wired in, sitewide NAP bug fixed
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
- [ ] 01-01-PLAN.md — Design-system package hardening: expose `fonts/` through the exports map, add the `safeJsonLd` escaping helper and apply it at all 3 JSON-LD call-sites (wave 1)
- [ ] 01-02-PLAN.md — npm workspace, Next.js app, root layout with the single NAPFooter, proof-of-integration page, D-15 crawl block (wave 2)
- [ ] 01-03-PLAN.md — Zero-dependency built-HTML lock suite, gzip transfer-weight budget gate, GitHub Actions CI (wave 3)
- [ ] 01-05-PLAN.md — Prove the CI gate turns red on a failing lock, then make both jobs required status checks (wave 4, has checkpoint)
- [ ] 01-04-PLAN.md — Vercel project connection and live-URL verification, canonical phone-number confirmation (wave 5, has checkpoints)
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
**Plans**: TBD
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
**Plans**: TBD
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
| 1. Platform Foundation & Design System Integration | 0/5 | Planned | - |
| 2. Component Library Completion & Core Templates | 0/TBD | Not started | - |
| 3. Programmatic Location × Service Engine | 0/TBD | Not started | - |
| 4. Reviews & Trust at Scale | 0/TBD | Not started | - |
| 5. Technical SEO & Schema Layer | 0/TBD | Not started | - |
| 6. Content & Blog | 0/TBD | Not started | - |
