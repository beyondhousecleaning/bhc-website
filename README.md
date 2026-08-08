# bhc-website

The new **Beyond House Cleaning** website — an SEO-first rebuild covering the existing **Warwickshire + Coventry** area *and* expanding into the **B / DY / TF / WS / WV** postcode areas (Birmingham, Dudley, Telford, Walsall, Wolverhampton).

The primary goal is **online visibility**: organic ranking and Google Maps / map-pack ranking. Every choice — markup, framework, hosting, content — is made for SEO first. Booking and admin are out of scope; they live in `project-bk-v3`.

Status: **research & design phase.** No site code yet.

## Repo layout

| Path | Contents |
|---|---|
| `docs/goals.md` | Goals, success measures, build sequence, and the open decisions awaiting Sam |
| `docs/research/` | Competitor teardown, service-area data, sitemap snapshots |
| `docs/brand/` | Logo audit and brand direction |
| `assets/logo/` | Current logo source files (raster only — needs SVG rebuild) |

## Documents

| Doc | What it tells you |
|---|---|
| [`docs/goals.md`](docs/goals.md) | Why this project exists, what success looks like, and **3 open decisions** that change the architecture |
| [`docs/research/competitor-arbor-trail.md`](docs/research/competitor-arbor-trail.md) | Teardown of arbortrailcleaningco.com — the layout we're modelling. 169 URLs, how they actually rank, and the 4 flaws we can beat them on |
| [`docs/research/service-area-coverage.md`](docs/research/service-area-coverage.md) | All 135 postcode districts and **39 post towns** across B/DY/TF/WS/WV, with covered localities |
| [`docs/brand/logo-audit.md`](docs/brand/logo-audit.md) | Measured palette, geometry problems, and the lockup family the logo needs |

## Snapshots

| File | Captured |
|---|---|
| `docs/research/current-site-sitemap-2026-08-06.xml` | Live beyondhousecleaning.com — 115 URLs, 95 of them Warwickshire location pages |
| `docs/research/arbor-trail-sitemap-2026-08-06.xml` | Arbor Trail — 169 URLs |

## Key findings so far

- **Arbor Trail's engine is 85 programmatic location×service pages plus review volume — not blogging** (they have exactly one blog post).
- They carry **zero structured data** and **four competing URL patterns** that cannibalise each other. Both are cheap wins for us.
- **Decided 2026-08-06:** keep Warwickshire + Coventry and add the five new postcode areas on top. Expansion, not pivot — so the existing `/location/<region>/<town>/<service>` pattern is preserved and **no redirects are needed** for the 95 indexed pages. Combined target ≈ **410 pages**.
- Two defects on the live site must be fixed in the rebuild: **duplicate Coventry slugs** (`south-coventry` *and* `coventry-south`) and a **service-slug mismatch** leaving 57 location pages with no parent service page.
- The GBP pin appears to be in **Leamington Spa** — great for Warwickshire/Coventry, but one pin **cannot** rank in the map pack in the Black Country or Telford. Pin location still needs verifying.

## Build sequence

| # | Step | Tool |
|---|---|---|
| 1 | Clean up the logo (SVG rebuild + lockup family) | — |
| 2 | Design the site — look & feel only | Claude Design |
| 3 | Architect the build | Opus 5 |
| 4 | Build it | Claude Code |
| 5 | SEO-optimise | Claude Code |
| 6 | Ongoing SEO/content system | stack TBD |

## Related

| Thing | Where |
|---|---|
| Booking & admin platform | `beyondhousecleaning/project-bk-v3` |
| Automation pipelines | `beyondhousecleaning/n8n-automations` |
| Live site (to be replaced) | https://www.beyondhousecleaning.com (Webflow) |
| Credentials | 1Password vault `BHC - Claude` — never in this repo |
