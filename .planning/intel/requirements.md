# Requirements

Extracted from PRD-classified content. Only `docs/goals.md` was classified `PRD` in this ingest
set — it yields the requirements below. Locked decisions embedded in the same document are
filed separately in `decisions.md` (D1–D5); this file covers goal-shaped and open-decision
requirements.

---

## REQ-organic-visibility

- **Source:** `docs/goals.md`
- **Description:** Organic ranking + Google Maps/map-pack ranking is the #1 objective of the
  rebuild. Every technical decision (markup, framework, hosting, content) is chosen for SEO
  first.
- **Acceptance criteria:**
  - Map-pack presence for `cleaner <town>` reaches top 3 in core towns (currently unknown).
  - Organic ranking for `<service> <town>` reaches page 1 across tier-1 post towns (currently
    Warwickshire only).
- **Scope:** SEO strategy, whole-site priority ordering.
- **Explicitly out of scope:** booking-flow UX, admin tooling — those belong to Project BK V3.

## REQ-programmatic-page-scale

- **Source:** `docs/goals.md`
- **Description:** Scale indexed location×service pages from 95 (Warwickshire only) to ~336
  (Warwickshire + Coventry + B/DY/TF/WS/WV), generated from one towns × services data file.
- **Acceptance criteria:**
  - ~56 unique towns × 6 services ≈ 336 combo pages + ~56 town hubs + 6 service pages + ~8
    utility pages ≈ 410 pages total.
  - New pages hold the same content-depth bar as the existing site (see REQ-content-depth-bar).
- **Scope:** page generation, service-area expansion.
- **Depends on:** `docs/research/service-area-coverage.md` postcode-district data.

## REQ-review-count-visible

- **Source:** `docs/goals.md`
- **Description:** Google review count/rating (175 at 4.9★ as of 2026-08-06) must be
  server-rendered on every page, not JS-only.
- **Acceptance criteria:**
  - Rating badge present in server-rendered HTML on every template (also codified as
    design-system.md CI Lock #3).
  - Review count grows continuously (ongoing measure, not a one-time target).
- **Scope:** trust signals, review display.

## REQ-fix-duplicate-coventry

- **Source:** `docs/goals.md`, confirmed in `docs/research/seo-audit-2026-08-06.md` §6
- **Description:** `south-coventry` and `coventry-south` both exist (5 pages each, 10 pages
  total) competing for identical intent — keyword cannibalisation, not duplicate content per
  the measured similarity data.
- **Acceptance criteria:**
  - Pick one slug, 301 the other.
  - Add a proper `coventry` town page.
- **Scope:** URL/redirect cleanup.

## REQ-canonical-service-taxonomy — ✅ DECIDED, see `decisions.md` D14

- **Source:** `docs/goals.md` ("Canonical service taxonomy — to settle before build"),
  `docs/research/seo-audit-2026-08-06.md` §10 (b3); decided by Sam 2026-08-08.
- **Description:** Location-page slugs (`domestic-cleaning`, `apartment-cleaning`,
  `end-of-tenancy-cleaning`) and service-page slugs (`standard-home-cleaning`,
  `move-in-cleaning`, `short-term-rental-cleaning`, `post-construction-cleaning`,
  `deep-cleaning`, `move-out-cleaning`) don't fully align — 57 of 95 location pages have no
  parent service page; 4 service pages have no location coverage.
- **Acceptance criteria (locked — D14):**
  - One canonical slug per concept, UK vocabulary throughout (8 concepts total after merging
    overlaps).
  - The 4 Americanised service-page slugs 301 to their UK equivalents.
- **Scope:** URL/service taxonomy. No longer open — carried forward to `ROADMAP.md` as a locked
  input, not a phase-1 discussion item.

## REQ-content-priority-sequencing — adopted as the working phase order

- **Source:** `docs/goals.md` ("Open decisions → 1. Content priority")
- **Description:** Sam's original step-6 build sequence assumed blog content matters early;
  evidence (Arbor Trail: one blog post, ~$200k/mo) suggests otherwise.
- **Acceptance criteria (adopted 2026-08-08 as the roadmap's phase ordering — reversible, not a
  locked decision on the D1–D14 level; this is sequencing, not a product commitment):**
  1. Location×service page matrix (the engine)
  2. Review volume + displaying it
  3. Technical SEO (schema, clean canonicals)
  4. Content/blog last
- **Scope:** build sequencing / roadmap ordering. Corroborated by `docs/seo/skills.md` and
  `docs/research/seo-audit-2026-08-06.md` §10(c) (both agree blogging is not a near-term
  priority) — no competing view found anywhere in the doc set. `gsd-roadmapper` should use this
  order directly rather than re-litigating it; flag to Sam only if a phase genuinely needs to
  deviate from it.

## REQ-content-depth-bar

- **Source:** `docs/research/seo-audit-2026-08-06.md` §5, §10 (b11); also referenced as
  design-system.md CI Lock #11
- **Description:** The current site's content depth (821 unique words/page median) is the
  measured reason 95 pages don't collide on similarity (0.049 median Jaccard vs Arbor Trail's
  0.100). This margin must be preserved when scaling to 336 pages.
- **Acceptance criteria:**
  - New town pages hold ≥800 unique body words (design-system.md CI Lock #11).
  - Roll out new pages in batches of 50–100 with 2–4 weeks of indexation monitoring between
    batches — never publish all ~241 new pages at once.
- **Scope:** content generation, rollout process.

## REQ-hub-and-spoke-architecture

- **Source:** `docs/research/seo-audit-2026-08-06.md` §4, §10 (b1); realized in
  `docs/design/design-system.md` page templates and InterlinkBlock component
- **Description:** The live site has no locations index, no town hubs, and only 4 arbitrary
  footer links distributing authority across 95 pages. This does not scale to 336.
- **Acceptance criteria:**
  - Every combo page reachable in ≤3 clicks from a real parent (locations index → town hub →
    combo).
  - InterlinkBlock present on service, town-hub and combo templates, computed from geography
    (never hand-picked) — see design-system.md CI Lock #6.
- **Scope:** information architecture, internal linking. This is the "#1 rebuild requirement"
  per the audit.

## REQ-nap-consistency

- **Source:** `docs/research/seo-audit-2026-08-06.md` §7 (a1, b7)
- **Description:** Site-wide footer displays `+44 7861 936533` but the `tel:` link dials
  `07441918832`; `/get-a-quote` dials a third number.
- **Acceptance criteria:**
  - Exactly one `tel:` in the footer, with `href` digits equal to displayed digits
    (design-system.md CI Lock #4).
  - Publish a consistent NAP block (name, service-area statement, one phone, hours) — no street
    address, per D4.
- **Scope:** footer component, NAP data.
