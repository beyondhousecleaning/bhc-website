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
| Indexed location×service pages | 95 (all Warwickshire) | ~234 (B/DY/TF/WS/WV) |
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

## Service area

Five postcode areas: **B** (Birmingham), **DY** (Dudley), **TF** (Telford), **WS** (Walsall), **WV** (Wolverhampton).
135 districts, **39 post towns**. Full breakdown in `research/service-area-coverage.md`.

Target page maths: 39 post towns × 6 services = **234 combo pages** + 39 town hubs + 6 service pages ≈ **290 pages**. Tier-2 suburb pages could multiply this.

## Open decisions

These three came out of the research and need Sam's call — each changes the architecture.

### 1. The map-pack problem (most important)

Map-pack ranking is driven overwhelmingly by **proximity of the business pin to the searcher**, plus review prominence. The GBP is registered in **Leamington Spa (CV32)** — roughly 25 miles from Birmingham, 35 from Wolverhampton, 50 from Telford.

**One pin in Leamington Spa cannot rank in the map pack across B/DY/TF/WS/WV.** No amount of website work changes that.

Options:
- **a.** Move the GBP pin to a central Black Country address (Dudley/Walsall/West Brom area) — best map-pack outcome, forfeits Warwickshire map presence.
- **b.** Keep Leamington pin, treat map pack as winnable only near it, and let organic location pages carry the new areas.
- **c.** Multiple GBP listings — only legitimate with genuinely staffed distinct premises; otherwise a suspension risk.

### 2. Warwickshire — abandon or keep?

95 existing location×service pages all target Warwickshire towns (Banbury, Kenilworth, Rugby, Evesham, Daventry, Leamington Spa…). If we pivot fully to B/DY/TF/WS/WV those pages become dead weight and need a redirect map.

Options: full pivot (redirect the 95) · keep Warwickshire as a secondary region and add the new areas on top · phased.

### 3. Content priority

Sam's step 6 assumes blog posts matter. **The reference company has exactly one blog post** and does ~$200k/mo. Evidence says sequence should be:

1. Location×service page matrix (the engine)
2. Review volume + displaying it (their real moat: 1,100+ reviews, quoted in every meta description)
3. Technical SEO they neglect (schema, clean canonicals) — cheap wins
4. Content/blog last

## Platform recommendation

**Next.js on Vercel, not Webflow.** 234+ programmatic pages generated from a data file (towns × services) is trivial in code and painful in a page builder. Gives full control of schema, canonicals, Core Web Vitals, and redirects — the exact areas Arbor Trail fails. Sam already intends to build in Claude Code.

Current site is Webflow; so is Arbor Trail's.
