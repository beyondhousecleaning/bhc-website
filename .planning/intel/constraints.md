# Constraints

Extracted from SPEC-classified content (`docs/design/design-system.md`,
`docs/brand/photo-spec.md`). Per the ingest note, several DOC-classified documents contain
directive/constraint-shaped statements the classifiers flagged as candidates for promotion —
those are included below, clearly marked with their original DOC classification and source, not
silently re-labeled as SPEC-precedence.

---

## Design tokens (type: schema)

- **Source:** `docs/design/design-system.md`
- Full colour token set (`--ink`, `--navy`, `--blue`, `--cyan`, `--action`, `--action-hover`,
  `--sponge`, `--paper`/`--paper-warm`/`--paper-tint`, `--line`, feedback colours) — see
  `decisions.md` D6/D11/D12 for the decisions driving these values; exact hex values and
  measured contrast ratios live in the source doc §1.
- Type scale: 1.25 ratio, fluid mobile→desktop, `--text-xs` (12→13) through `--text-3xl`
  (34→44). Body set at 17px desktop (not 16) to support 800–1,100-word pages.
- Type faces: humanist sans, not geometric (rules out Poppins); not Poppins, not Inter; two
  families max; self-hosted `woff2`, Latin subset. Starting candidates: Public Sans / Source
  Sans 3 (body), Figtree / Bricolage Grotesque (display). No serif display.
- Spacing (4px base), radii (6/10/16/24/full — "rounded is part of warm"), shadows, containers
  (`--container-prose: 68ch`), motion (120/200/320ms, respects `prefers-reduced-motion`).
  Breakpoints: 480/768/1024/1280.

## Component contracts (type: schema)

- **Source:** `docs/design/design-system.md`
- **Locked components** (SEO layer depends on these): Hero, Breadcrumbs, RatingBadge,
  NAPFooter, InterlinkBlock — see full requirement/live-state table in source §2.
- **Hero H1 rule:** if a two-line hero is used, the keyword line is always the `<h1>`; the
  adjective line is decoration, never the reverse. `HeroProps` splits `eyebrow` (decoration) from
  `heading` (always `<h1>`) so the markup cannot be got wrong. This directly fixes the bug found
  on 101/115 live pages (see `docs/research/seo-audit-2026-08-06.md` §2).
- **InterlinkBlock:** links computed from geography, never hand-picked. `/locations` → all ~56
  towns; `/locations/<town>` → 6 services + 6 nearest towns; combo pages → breadcrumb up +
  5 sibling services + same service in 5 nearest towns (~11 inbound links/combo page).
  "Nearest towns" derives from `docs/research/service-area-coverage.md` postcode-district data.
- **Standard components:** Header, Footer, Breadcrumbs, SkipLink (Global); RatingBadge,
  ReviewCard, ReviewRail, TrustBar, BeforeAfterSlider (Trust); Hero, SectionBand, Prose,
  ServiceCard, TownCard, ProcessSteps, FAQAccordion, CTABand (Content); Button, QuoteFormEntry,
  StickyCallBar (Convert).
- **Deliberately excluded:** `FAQPage` rich-result schema (retired 2026-05-07 — see D13); blog
  templates beyond one article layout; Trustmary widget (replaced by server-rendered reviews);
  `AggregateRating` expecting SERP stars (entity-graph value only, self-serving markup is
  ineligible for rich results).
- **Package shape:** `design-system/tokens.css`, `styles.css`, `src/components/<Name>/` each
  with `.jsx`/`.html`/`.d.ts`/`.prompt.md` — matches Project BK V3's 46-component precedent.
  First sync ships foundations + the five locked components + Button; remaining ~15 follow
  incrementally, never as a wholesale replace.

## Page templates (type: schema)

- **Source:** `docs/design/design-system.md`
- 6 templates cover ~410 pages: Home (1), Service `/services/<service>` (6), Locations index
  `/locations` (1, currently 404), Town hub `/locations/<town>` (~56, 1 of 56 exists), Combo
  `/location/<region>/<town>/<service>` (~336, exists but H1 broken), Utility (~8).
- Combo template section order: Breadcrumb → Hero(H1) → RatingBadge → Prose (800–1,100 words) →
  Included checklist → BeforeAfterSlider → ProcessSteps → ReviewRail → InterlinkBlock(services)
  → InterlinkBlock(nearby) → FAQAccordion → CTABand → NAPFooter.
- Utility template must always render an `<h1>` — 4 current utility pages
  (`/contact-us`, `/customer-login`, `/gift-cards`, `/work-with-us`) have none.
- **URL prefix resolution (auto-resolved — see `INGEST-CONFLICTS.md` INFO):** locations
  index/hub use the plural `/locations` prefix; combo pages keep the existing singular
  `/location/<region>/<town>/<service>` prefix — this satisfies both "zero redirects for the 95
  existing pages" (`goals.md` D2) and the audit's conditional caveat about prefix collision
  (`seo-audit-2026-08-06.md` §10 b2).

## SEO CI locks — 11 build-time assertions (type: nfr)

- **Source:** `docs/design/design-system.md` §4 ("The locks")
- Written as assertions because each becomes a CI check at build time:
  1. Exactly one `<h1>` per page, containing the service and/or town for its template.
  2. Breadcrumbs + `BreadcrumbList` on every non-home page.
  3. Rating badge present in server-rendered HTML on every template.
  4. Exactly one `tel:` in the footer; `href` digits must equal displayed digits.
  5. No street address or UK postcode in any rendered output.
  6. InterlinkBlock present on service, town-hub and combo templates.
  7. Every `<img>` has non-empty `alt`.
  8. Title ≤60 chars and contains the town; description ≤155 chars.
  9. All JSON-LD server-rendered; none injected by client JS.
  10. No third-party script >50 KB without explicit sign-off.
  11. Combo pages carry ≥800 unique body words.

## Schema to emit (type: schema)

- **Source:** `docs/design/design-system.md` §4
- All server-rendered: `LocalBusiness` + `areaServed` (no `streetAddress`, every page);
  `Organization` + `sameAs` (home); `WebSite` (home); `Service` + `areaServed` (service + combo
  pages); `BreadcrumbList` (every non-home page); `AggregateRating` (home + about, entity-graph
  value only, not for SERP stars).

## Before/after photo spec (type: protocol)

- **Source:** `docs/brand/photo-spec.md`
- Format: JPEG/HEIC exactly as captured, no pre-conversion. Resolution ≥2400px long edge,
  3000–4000px ideal. Landscape 3:2/4:3 preferred; matched framing (same angle/distance/height)
  between before and after. Transfer via AirDrop/Drive/Dropbox at original quality — never
  WhatsApp (recompresses to ~1MP). 10–15 excellent matched pairs beats 60 mediocre ones.
- Naming: `<room-or-area>-<service>-<sequence>-before.jpg` / `...-after.jpg` (e.g.
  `kitchen-deep-clean-01-before.jpg`), or keep before→after order on consecutive pages and
  script the rename.
- Image-SEO priority order: descriptive filenames > alt text > file weight/Core Web Vitals >
  image sitemap + `ImageObject` markup. EXIF geotagging is **not** a ranking signal — skip it.
  Photos convert; they do not win local rankings.
- **Blocked:** all 199 files in the existing Canva export are unusable as source material —
  1080×1080 composited social posts with the old logo burned in and BEFORE/AFTER labels over the
  photo, leaving ~530×690px recoverable per half. Two independent disqualifiers: thumbnail
  resolution and a superseded logo baked in. Action required: pull originals from
  canva.com → Projects → Uploads (bulk multi-select supported). Owner: Sam.

## Location-page targeting rule (type: nfr — promoted from DOC)

- **Source:** `docs/research/service-area-coverage.md` (classified DOC; classifier flagged this
  as a directive-shaped statement worth promoting)
- **Constraint:** "Location pages must therefore target post towns and named suburbs, never
  postcode districts." The five new postcode areas (B/DY/TF/WS/WV: 135 districts, 39 post towns)
  reach far beyond their namesake cities — e.g. Solihull, Sutton Coldfield, Halesowen,
  Kidderminster all sit inside B/DY codes but residents would never call themselves
  "Birmingham" or "Dudley."
- **Scope:** location-page naming/targeting for the ~336-page combo build.

## Promoted technical constraints from the SEO audit fix list (type: nfr — promoted from DOC)

- **Source:** `docs/research/seo-audit-2026-08-06.md` §10 (classified DOC; classifier flagged
  the (a)/(b) fix lists as backlog-shaped constraint candidates). Full detail and effort
  estimates remain in the source doc; only the substantive constraints are lifted here.
- **(a) Fix on current Webflow site now** (independent of rebuild, cheap, compounding starts
  immediately): a1 fix footer `tel:` mismatch; a2 make the H1 the keyword line; a3 put the
  4.9★/175-review rating in server-rendered HTML + meta descriptions; a4 fix two wrong-town meta
  descriptions + 4 missing H1s; a5 fix 3 broken internal links; a6 add `LocalBusiness` +
  `Organization` + `AggregateRating` JSON-LD to the global head; a7 point the footer Maps link at
  the real GBP place URL, not the town; a8 resolve Coventry cannibalisation (see
  REQ-fix-duplicate-coventry); a9 convert the 741 KB homepage PNG to WebP + add missing `alt`;
  a10 claim Bing Places/Apple Maps/Yell/Checkatrade/Trustpilot; a11 add `User-agent: *` to
  `robots.txt`.
- **(b) Fix as part of the rebuild** (architectural, not worth retrofitting into Webflow): b1
  build hub-and-spoke (see REQ-hub-and-spoke-architecture); b2 settle `location` vs `locations`
  prefix (auto-resolved, see above); b3 reconcile service taxonomy (open decision, see
  REQ-canonical-service-taxonomy); b4 full server-rendered schema layer; b5 server-render
  reviews, drop the 516 KB Trustmary widget; b6 visible breadcrumbs + `BreadcrumbList`
  everywhere; b7 consistent NAP block, no street address (see REQ-nap-consistency, D4); b8
  performance budget <500 KB JS / <1 MB total; b9 maps embed on every location page,
  lazy-loaded; b10 `<lastmod>` in the sitemap; b11 hold the ~800-unique-word bar, roll out in
  batches of 50–100 (see REQ-content-depth-bar); b12 add FAQ + testimonials block to all
  location pages (70 of 95 currently missing them); b13 append brand to titles, lead
  descriptions with review count.
- **(c) Explicitly ignore, with reason** (do not re-litigate): thin/duplicate content across the
  95 pages — measured and refuted (0.049 median Jaccard vs Arbor Trail's 0.100, 0 of 4,465 pairs
  above 0.21); `x-robots-tag: noindex` on `/robots.txt` itself — Webflow default, cosmetic;
  missing `<changefreq>`/`<priority>` — Google ignores both; `llms.txt` — 404, no evidence any
  engine uses it; `FAQPage` schema for rich results — retired 2026-05-07; `AggregateRating`
  expecting SERP stars — self-serving/third-party-widget reviews are ineligible; the 2-hop
  `http://non-www` redirect chain — within tolerance; trailing-slash inconsistency — nothing to
  fix; chasing map-pack rankings in B/DY/TF/WS/WV via on-site work — proximity dominates, this is
  a GBP decision (D3), not an SEO-work item; blogging as a near-term priority (see
  REQ-content-priority-sequencing).
