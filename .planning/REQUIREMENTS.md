# Requirements: Beyond House Cleaning — Website Rebuild

**Defined:** 2026-08-08
**Core Value:** Every technical and content decision serves organic + Google Maps visibility for
`cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and the five new
postcode areas (B, DY, TF, WS, WV).

## v1 Requirements

Requirements for the rebuild. Each maps to exactly one roadmap phase (see Traceability). IDs are
carried over unchanged from `.planning/intel/requirements.md` and `decisions.md` D14 rather than
renumbered, to preserve traceability back to source docs during a fresh-session handoff.

### SEO & Visibility

- [ ] **REQ-organic-visibility**: Organic ranking + Google Maps/map-pack ranking is the #1
  objective of the rebuild; every technical decision (markup, framework, hosting, content) is
  chosen for SEO first.
  - Map-pack presence for `cleaner <town>` reaches top 3 in core Warwickshire/Coventry towns.
  - Organic ranking for `<service> <town>` reaches page 1 across tier-1 post towns (currently
    Warwickshire only).
  - Explicitly out of scope: booking-flow UX, admin tooling (Project BK V3's territory).

### Location Engine

- [ ] **REQ-programmatic-page-scale**: Scale indexed location×service pages from 95
  (Warwickshire only) to ~336 (Warwickshire + Coventry + B/DY/TF/WS/WV), generated from one
  towns×services data file.
  - ~56 unique towns × 6 services ≈ 336 combo pages + ~56 town hubs + 6 service pages + ~8
    utility pages ≈ 410 pages total.
  - New pages hold the same content-depth bar as the existing site (REQ-content-depth-bar).
  - Depends on `docs/research/service-area-coverage.md` postcode-district data.
- [ ] **REQ-fix-duplicate-coventry**: `south-coventry` and `coventry-south` both exist (5 pages
  each) competing for identical intent — keyword cannibalisation.
  - Pick one slug, 301 the other.
  - Add a proper `coventry` town page.
- [ ] **REQ-canonical-service-taxonomy**: ✅ Decided — see `PROJECT.md` D14. One canonical slug
  per concept, UK vocabulary throughout (8 concepts: `domestic-cleaning`,
  `end-of-tenancy-cleaning`, `deep-cleaning`, `apartment-cleaning`, `move-in-cleaning`,
  `move-out-cleaning`, `short-term-rental-cleaning`, `post-construction-cleaning`).
  - The 4 Americanised service-page slugs (e.g. `standard-home-cleaning` → `domestic-cleaning`)
    301 to their UK equivalents.
- [ ] **REQ-content-depth-bar**: The current site's content depth (821 unique words/page median)
  is the measured reason 95 pages don't collide on similarity; this margin must be preserved when
  scaling to 336 pages.
  - New town pages hold ≥800 unique body words (CI Lock #11).
  - Roll out in batches of 50–100 with 2–4 weeks of indexation monitoring between batches.
- [ ] **REQ-hub-and-spoke-architecture**: The live site has no locations index, no town hubs, and
  only 4 arbitrary footer links distributing authority across 95 pages — this does not scale to
  336. Per the audit, this is the "#1 rebuild requirement."
  - Every combo page reachable in ≤3 clicks from a real parent (locations index → town hub → combo).
  - InterlinkBlock present on service, town-hub and combo templates, links computed from
    geography, never hand-picked (CI Lock #6).

### Trust

- [ ] **REQ-review-count-visible**: Google review count/rating (175 at 4.9★ as of 2026-08-06)
  must be server-rendered on every page, not JS-only.
  - Rating badge present in server-rendered HTML on every template (CI Lock #3).
  - Review count grows continuously (ongoing measure, not a one-time target).

### Site Integrity

- [ ] **REQ-nap-consistency**: Site-wide footer displays `+44 7861 936533` but the `tel:` link
  dials `07441918832`; `/get-a-quote` dials a third number.
  - Exactly one `tel:` in the footer, `href` digits equal displayed digits (CI Lock #4).
  - Publish a consistent NAP block (name, service-area statement, one phone, hours) — no street
    address, per D4.

### Process

- [ ] **REQ-content-priority-sequencing**: Sam's original build sequence assumed blog content
  matters early; evidence (Arbor Trail: one blog post, ~$200k/mo) suggests otherwise. Adopted
  2026-08-08 as the roadmap's phase ordering.
  - Order: 1. Location×service page matrix (the engine) → 2. Review volume + displaying it →
    3. Technical SEO (schema, clean canonicals) → 4. Content/blog last.
  - This requirement is satisfied by the *shape* of the roadmap itself (see Traceability) rather
    than by a single phase's deliverable — flag to Sam only if a phase genuinely needs to deviate
    from this order.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Local SEO Operations (off-site, non-code)

- **OPS-01**: Claim/verify Bing Places, Apple Maps, Yell, Checkatrade, Bark, Thomson Local,
  Trustpilot listings (audit item a10) — off-site ops task, not a website build task.
- **OPS-02**: A review-*generation* system (asking customers for reviews) to grow past 175 —
  called out in `docs/seo/skills.md` as BHC's single biggest lever, but it's a process/ops
  workstream, not something this repo's code delivers.
- **OPS-03**: A dedicated BHC-local-SEO Claude Code project skill capturing the 39 post towns, 5
  postcode areas, service taxonomy and single-pin constraint — noted as a gap in
  `docs/seo/skills.md`.

### Map-Pack Expansion

- **EXPAND-01**: A second staffed premises with its own GBP listing, to make B/DY/TF/WS/WV
  map-pack-eligible (currently organic-only per D3, all ≥18.8 miles from the Leamington pin).

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Booking-flow UX / admin tooling | Belongs to Project BK V3 — explicitly excluded in `docs/goals.md` |
| Webflow quick-fixes (audit items a1–a11) on the *current live site* | Site is being replaced wholesale; the underlying defects are fixed properly inside this rebuild's phases instead |
| `FAQPage` rich-result schema | Retired by Google 2026-05-07 (D13); accordion stays for users/AI-readability only |
| `AggregateRating` expecting SERP stars | Self-serving/third-party-widget review markup is ineligible for rich results; entity-graph value only |
| GBP pin relocation | Leamington pin stays; new areas are organic-only unless a second premises opens (D3) |
| Blog as a near-term SEO priority beyond one template + one post | Evidence (Arbor Trail, audit §10c) says it's not where the leverage is; sequenced last (REQ-content-priority-sequencing) |
| Thin/duplicate content remediation across the 95 pages | Measured and refuted — 0.049 median Jaccard similarity vs Arbor Trail's 0.100; not a real problem |
| EXIF geotagging on before/after photos | Not a ranking signal per `docs/brand/photo-spec.md`; skip it |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REQ-nap-consistency | Phase 1 | Pending |
| REQ-programmatic-page-scale | Phase 3 | Pending |
| REQ-fix-duplicate-coventry | Phase 3 | Pending |
| REQ-canonical-service-taxonomy (D14) | Phase 3 | Pending |
| REQ-content-depth-bar | Phase 3 | Pending |
| REQ-hub-and-spoke-architecture | Phase 3 | Pending |
| REQ-review-count-visible | Phase 4 | Pending |
| REQ-organic-visibility | Phase 5 | Pending |
| REQ-content-priority-sequencing | All phases (governs ordering: 1→3 engine, 4 reviews, 5 technical SEO, 6 content) | Applied |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-08*
*Last updated: 2026-08-08 after initial roadmap creation*
