# Goals — Beyond House Cleaning website rebuild

Drafted 2026-08-06. Living doc.

## Primary goal

**Online visibility.** Organic ranking + Google Maps / map-pack ranking is the #1 objective. Every decision — markup, framework, hosting, content — is chosen for SEO first.

Not the goal (for this project): booking-flow UX, admin tooling. Those live in Project BK V3.

## Success measures

| Measure | Now | Target |
|---|---|---|
| Map-pack presence for `cleaner <town>` across target towns | unknown | top 3 in core towns |
| Organic ranking for `<service> <town>` | Warwickshire only | page 1 across tier-1 post towns |
| Indexed location×service pages | 95 (Warwickshire only) | ~336 (Warwickshire + Coventry + B/DY/TF/WS/WV) |
| Google review count | **unknown — need from Sam** | grow continuously |
| Review count shown on site | not shown anywhere | on every page |

## Build sequence (Sam's plan)

| # | Step | Tool | Status |
|---|---|---|---|
| 1 | Clean up logo, make it pop | — | not started |
| 2 | Design the website (look & feel only) | Claude Design | not started |
| 3 | Architect the build | Opus 5 | not started |
| 4 | Build it | Claude Code | not started |
| 5 | SEO-optimise | Claude Code | not started |
| 6 | Ongoing SEO system (content, rankings) | stack TBD, possibly agent-driven | not started |

Sam will add tooling as Claude skills/plugins from GitHub.

## Design direction

Model **Arbor Trail Cleaning Co** layout closely (see `research/competitor-arbor-trail.md`) — make colours, photography and copy our own. Their layout is clean and proven; their technical SEO is weak, which is our edge.

Assets we have: logo (`assets/logo/`), before/after photo library (Sam to supply).

## Service area — DECIDED 2026-08-06: keep Warwickshire + Coventry, add the five new areas

Sam's call: this is an **expansion, not a pivot**. Existing coverage stays and the new postcode areas are added on top.

| Region layer | Towns | Source |
|---|---|---|
| Existing (Warwickshire + Coventry + Solihull South) | 19 town slugs, 95 live pages | current sitemap |
| New: **B / DY / TF / WS / WV** | 39 post towns, 135 districts | `research/service-area-coverage.md` |
| Combined unique towns | **~56** (Solihull appears in both) | |

Target page maths: ~56 towns × 6 services = **~336 combo pages** + ~56 town hubs + 6 service pages + utility ≈ **410 pages**.

### Consequence 1: keep the existing URL pattern

The live site already uses `/location/<region>/<town>/<service>`. That pattern **extends cleanly to new regions** — so keeping Warwickshire means **zero redirects for the 95 indexed pages**. Do not invent a new pattern.

New region slugs needed: `west-midlands`, `staffordshire`, `shropshire`, `worcestershire` (alongside the existing `warwickshire`).

### Consequence 2: the map-pack answer changed

Keeping Warwickshire rules out moving the pin. The Leamington pin is the **strongest asset for Warwickshire/Coventry** and relocating it would forfeit the region we're keeping.

So: **keep the Leamington pin.** Map pack is winnable near it (Warwickshire/Coventry) and *not* winnable in the Black Country or Telford from one pin. To win map pack there you need a second genuinely staffed premises with its own GBP — otherwise accept organic-only in the new areas and treat map pack as a Warwickshire/Coventry win.

⚠️ The Leamington pin is **inferred**, not verified — Google served a consent wall. Confirm the real GBP pin and review count before acting.

## Defects on the current site to fix in the rebuild

Found while auditing the live sitemap. Both must be resolved since we're keeping these pages.

| Defect | Detail | Fix |
|---|---|---|
| **Duplicate Coventry** | `south-coventry` **and** `coventry-south` both exist, 5 pages each — 10 pages competing for identical intent | Pick one slug, 301 the other. Add a proper `coventry` town page |
| **Service slugs don't match between layers** | Location pages use `domestic-cleaning`, `apartment-cleaning`, `end-of-tenancy-cleaning`; service pages are `standard-home-cleaning`, `move-in-cleaning`, `short-term-rental-cleaning`, `post-construction-cleaning`. Only `deep-cleaning` + `move-out-cleaning` exist in both → **57 location pages have no parent service page; 4 service pages have no location coverage** | Define one canonical service taxonomy and generate both layers from it |
| **Geographic misfiling** (low priority) | Banbury (Oxfordshire), Daventry (Northamptonshire) and Evesham (Worcestershire) all sit under `/location/warwickshire/` | Leave for now — fixing costs redirects for little gain |

### Canonical service taxonomy — to settle before build

Merging both layers gives 8 concepts with two genuine overlaps: `domestic-cleaning` ≈ `standard-home-cleaning`, and `end-of-tenancy-cleaning` ≈ `move-out-cleaning`. Needs a decision on one slug per concept, since it multiplies across ~56 towns.

## Open decisions

### 1. Content priority

Sam's step 6 assumes blog posts matter. **The reference company has exactly one blog post** and does ~$200k/mo. Evidence says sequence should be:

1. Location×service page matrix (the engine)
2. Review volume + displaying it (their real moat: 1,100+ reviews, quoted in every meta description)
3. Technical SEO they neglect (schema, clean canonicals) — cheap wins
4. Content/blog last

## Platform recommendation

**Next.js on Vercel, not Webflow.** ~336 programmatic pages generated from a data file (towns × services) is trivial in code and painful in a page builder. Gives full control of schema, canonicals, Core Web Vitals, and redirects — the exact areas Arbor Trail fails. Sam already intends to build in Claude Code.

The expansion decision strengthens this: one `towns.ts` data file carrying region + town + postcode districts, crossed with a canonical services list, generates every combo page, every town hub, and the internal-linking mesh — and guarantees the slug consistency the current site lacks.

Current site is Webflow; so is Arbor Trail's.
