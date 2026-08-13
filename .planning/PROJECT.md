# Beyond House Cleaning — Website Rebuild

## What This Is

A full rebuild of beyondhousecleaning.co.uk on Next.js/Vercel, replacing the current Webflow
site. The rebuild scales the location×service page matrix from 95 pages (Warwickshire only) to
~410 pages (Warwickshire + Coventry + Solihull South + five new West Midlands postcode areas),
fixes structural SEO defects the current site ships (missing schema, broken H1s, no
hub-and-spoke architecture, NAP inconsistency), and makes the 4.9★/175-review trust signal
server-rendered and visible everywhere instead of locked inside client-side JS.

## Core Value

Every technical and content decision serves organic + Google Maps visibility for
`cleaner <town>` and `<service> <town>` searches across Warwickshire, Coventry, and the five new
postcode areas (B, DY, TF, WS, WV) — nothing ships that regresses a measured SEO finding to make
something look nicer.

**Developer-facing success metric** (from `docs/goals.md` Success Measures):
- Map-pack presence reaches top 3 for `cleaner <town>` in core Warwickshire/Coventry towns.
- Organic ranking for `<service> <town>` reaches page 1 across tier-1 post towns.
- Indexed location×service pages grow from 95 to ~336 (~410 incl. hubs/services/utility).
- Review count/rating (175 at 4.9★, growing) is server-rendered and visible in HTML, titles,
  descriptions and schema on every page — not JS-only, as it is today.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate. Note: the design-system package itself — tokens.css + 6 React
components [Button, Hero, Breadcrumbs, RatingBadge, NAPFooter, InterlinkBlock] with 8 passing
lock tests — is already built and is the input to Phase 1, not something this roadmap builds
from scratch.)

### Active

<!-- Current scope. Building toward these. Full detail + acceptance criteria in REQUIREMENTS.md. -->

- [ ] REQ-organic-visibility — organic + map-pack ranking is the #1 objective; every decision is SEO-first
- [ ] REQ-programmatic-page-scale — scale indexed pages 95 → ~336 combo (~410 total) from one data file
- [ ] REQ-review-count-visible — 4.9★/175-review badge server-rendered on every template
- [ ] REQ-fix-duplicate-coventry — resolve `south-coventry`/`coventry-south` cannibalisation, add real `coventry` page
- [ ] REQ-canonical-service-taxonomy — one UK-vocabulary slug per service concept (✅ decided, D14)
- [ ] REQ-content-depth-bar — hold ≥800 unique body words/page at 336-page scale, batched rollout
- [ ] REQ-hub-and-spoke-architecture — every combo page reachable in ≤3 clicks via locations index → town hub → combo
- [ ] REQ-nap-consistency — exactly one `tel:` sitewide, href digits = displayed digits, no street address
- [ ] REQ-content-priority-sequencing — sequencing input (engine → reviews → technical SEO → content), not a standalone deliverable

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Booking-flow UX / admin tooling — belongs to Project BK V3, explicitly excluded in `docs/goals.md`
- Webflow quick-fixes (audit items a1–a11: footer tel:, H1 fix, rating in HTML, meta fixes, broken
  links, JSON-LD, Maps link, WebP, citations, robots.txt) applied to the *current live site* —
  superseded by this rebuild; patching a site being replaced wholesale is wasted effort. (The
  underlying defects are fixed properly inside the rebuild's own phases instead.)
- `FAQPage` rich-result schema — Google retired FAQ rich results 2026-05-07 (D13); FAQAccordion
  stays for users/AI-readability only, never for rich-result markup
- `AggregateRating` for SERP stars — self-serving/third-party-widget review markup is ineligible
  for rich results; emitted for the entity graph only, never expected to produce stars in search
- GBP pin relocation — Leamington pin (CV32 6EQ) stays; the five new postcode areas are
  organic-only unless a second staffed premises with its own GBP is opened later (D3)
- Off-site local citation building (Yell, Checkatrade, Bark, Thomson Local, Trustpilot, Bing
  Places, Apple Maps) — an ops/marketing task, not a website build task; tracked as a v2 item in
  REQUIREMENTS.md so it isn't lost, but no code in this repo delivers it
- A review-*generation* system (asking customers for reviews) — this rebuild displays reviews
  server-rendered; growing the underlying review count is a separate ops workstream

## Context

- **Current site:** Webflow, 115 sitemap URLs, SEO Health 51/100 (Schema 0/100, Internal linking
  35/100, Local/Maps 38/100). Content quality is actually strong (82/100, 821 unique words/page
  median) — the rebuild's job is scaffolding (schema, IA, NAP, performance), not content rescue.
- **Reference competitor:** Arbor Trail Cleaning Co (Detroit/Ann Arbor, Webflow, ~$200k/mo) —
  copy their proven section order and programmatic scale; do not copy their broken URL patterns,
  zero structured data, or cold-blue palette.
- **Design system already exists:** `design-system/` in this repo — `tokens.css`, 6 built React
  components (Button, Hero, Breadcrumbs, RatingBadge, NAPFooter, InterlinkBlock), 8 passing lock
  tests (`design-system/test/locks.test.js`). Phase 1 of this roadmap is Next.js scaffolding +
  wiring this package in, not designing components from scratch. ~15 components remain to be
  built (ReviewRail, BeforeAfterSlider, ServiceCard, TownCard, ProcessSteps, FAQAccordion,
  Header, Footer, SkipLink, SectionBand, Prose, CTABand, ReviewCard, TrustBar, QuoteFormEntry,
  StickyCallBar) — phased early (Phase 2) since later phases assemble templates from them.
- **Hard blocker, not a phase gate — before/after photography:** all 199 existing Canva exports
  are unusable (1080×1080 composited social posts, old logo burned in, BEFORE/AFTER labels over
  the photo, ~530×690px recoverable per half). Real photos require Sam to pull originals from
  canva.com → Projects → Uploads (bulk multi-select supported). BeforeAfterSlider and any
  photo-dependent sections are phased to ship with a placeholder state first (Phase 2) and
  backfill real photos later (Phase 4) — this dependency must never block the critical path.
- **Two-plugin SEO tooling already installed:** `marketing-skills` and `claude-seo` (see
  `docs/seo/skills.md`). `claude-seo` runs a `PostToolUse` hook on `.jsx/.tsx/...` writes that
  can block (exit 2) on the case-insensitive substring `REPLACE` — watch for false positives
  during schema/copy work; disable via `claude plugin disable claude-seo` if it becomes a problem.
- **Fresh-session handoff:** this project is handed to a new Opus 5 session for execution. That
  session should read PROJECT.md, REQUIREMENTS.md, ROADMAP.md and STATE.md first — this context
  block plus the Key Decisions table below is the condensed version of five ingested source docs
  (`docs/goals.md`, `docs/design/design-system.md`, `docs/brand/brand-brief.md`,
  `docs/brand/photo-spec.md`, `docs/research/seo-audit-2026-08-06.md`) and should not require
  re-reading them to start Phase 1.

## Constraints

- **Platform**: Next.js on Vercel, not Webflow — D5. ~336 programmatic pages from one data file
  crossed with a canonical services list; full control of schema/canonicals/CWV/redirects.
- **URL architecture**: `/location/<region>/<town>/<service>` preserved unchanged for all combo
  pages, zero redirects for the 95 existing Warwickshire pages — D2. New index/hub layer uses the
  plural `/locations` / `/locations/<town>` prefix specifically to avoid colliding with the
  singular combo prefix.
- **Location targeting**: location pages target post towns and named suburbs, never bare
  postcode districts — the five new areas (B/DY/TF/WS/WV) span 135 districts but only 39 real
  post towns; residents of e.g. Halesowen or Kidderminster wouldn't call themselves "Dudley."
- **Privacy**: CV32 6EQ is residential — no street address or UK postcode in any rendered output,
  anywhere, ever — D4 / CI Lock #5. GBP is already correctly configured as service-area-business
  with address suppressed; nothing to change there.
- **Local SEO / GBP**: the Leamington Spa pin does not move — D3. Map-pack is a
  Warwickshire/Coventry-only win; the five new postcode areas are organic-only via on-site work.
- **Design tokens**: full colour/type/spacing token set in `design-system/tokens.css` is locked
  (D6, D11, D12) — do not substitute neutral greys for the warm off-whites, do not put white text
  on `--action` or `--cyan`.
- **Design governance**: only what SEO needs is locked (11 CI assertions in
  `docs/design/design-system.md` §4); everything else (final typeface, exact photographic
  treatment, layout polish) is open — D8.
- **Performance budget**: <500 KB JS, <1 MB total page weight; no third-party script >50 KB
  without explicit sign-off (current site: 1.9 MB JS, Trustmary 516 KB + GTM 514 KB alone).
- **Content depth**: ≥800 unique body words per combo page; roll new pages out in batches of
  50–100 with 2–4 weeks of indexation monitoring between batches, never all ~241 new pages at once.
- **Photography**: before/after photos blocked on Sam pulling Canva originals (see Context) —
  format/naming/transfer spec fully defined in `docs/brand/photo-spec.md`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| D1 — Expand service area (add B/DY/TF/WS/WV to existing Warwickshire/Coventry/Solihull South) | ~56 unique towns, ~336 combo pages, straightforward in code | — Pending (build not started) |
| D2 — Keep existing URL pattern, zero redirects for 95 live pages | Preserves indexed equity; new index/hub layer uses a different prefix to avoid collision | — Pending |
| D3 — Keep Leamington GBP pin; new areas organic-only | Map-pack is proximity-driven; relocating or faking a second premises isn't viable | — Pending |
| D4 — Hide the address everywhere | CV32 6EQ is residential; GBP already configured correctly | ✓ Good (GBP side already confirmed correct by Sam; site-side enforcement pending) |
| D5 — Next.js on Vercel, not Webflow | Full control of schema/canonicals/CWV/redirects; trivial data-file-driven page generation | ✓ Good (design-system package already built assuming this stack) |
| D6 — Blue structures the site, orange owns actions, marks go orange-forward | Arbor Trail's palette is near-identical; orange is the only differentiator, matters most in SERP/map-pack/GBP contexts | ✓ Good (tokens.css implements this, shipped) |
| D7 — Visual direction B, "warm local craft" | Before/afters + real people read as a genuine local team vs. Fantastic Services/Care.com's national-platform feel | ✓ Good (design-system built to this direction) |
| D8 — Lock only what SEO needs, leave the rest open | Prevents over-specifying while still preventing regression of measured findings | ✓ Good (design-system.md scoped this way) |
| D9 — Ship tokens as code + React components, not a markdown handoff | Prevents design→build drift | ✓ Good (design-system/ package exists in this shape) |
| D10 — Build the square badge/icon lockup first | Where BHC currently looks identical to competitors (favicon, GBP photo, social avatar) | — Pending (logo rebuild not started) |
| D11 — Orange fills take ink labels not white; cyan never carries white text | Measured contrast failures (white-on-orange 3.05:1, white-on-cyan 2.75:1) both fail AA | ✓ Good (tokens.css + components built to these rules) |
| D12 — Warm off-whites, not cold blue tints or neutral greys | Cheapest, highest-leverage differentiator from Arbor Trail's cold `#eef7ff` | ✓ Good (tokens.css implements `--paper-warm`/`--paper-tint`) |
| D13 — Exclude `FAQPage` schema; keep the accordion for users only | Google retired FAQ rich results 2026-05-07 | ✓ Good (documented exclusion, nothing to build) |
| D14 — Canonical UK-vocabulary service taxonomy, 4 slugs 301 | One slug per concept; matches what location pages and the audit both already recommend | — Pending (redirects not yet built; scheduled Phase 3) |

---
*Last updated: 2026-08-08 after initial roadmap creation*
