# bhc-website

The new **Beyond House Cleaning** website — an SEO-first rebuild covering the existing **Warwickshire + Coventry** area *and* expanding into the **B / DY / TF / WS / WV** postcode areas (Birmingham, Dudley, Telford, Walsall, Wolverhampton).

The primary goal is **online visibility**: organic ranking and Google Maps / map-pack ranking. Every choice — markup, framework, hosting, content — is made for SEO first. Booking and admin are out of scope; they live in `project-bk-v3`.

Status: **research & design phase.** No site code yet.

## Repo layout

| Path | Contents |
|---|---|
| `docs/goals.md` | Goals, success measures, build sequence, and the open decisions awaiting Sam |
| `docs/research/` | Competitor teardown, service-area data, sitemap snapshots, the live-site SEO audit |
| `docs/seo/` | SEO tooling install log and the audit kickoff prompt |
| `docs/brand/` | Logo audit and brand direction |
| `assets/logo/` | Current logo source files (raster only — needs SVG rebuild) |

## Documents

| Doc | What it tells you |
|---|---|
| [`docs/goals.md`](docs/goals.md) | Why this project exists, what success looks like, and **3 open decisions** that change the architecture |
| [`docs/research/competitor-arbor-trail.md`](docs/research/competitor-arbor-trail.md) | Teardown of arbortrailcleaningco.com — the layout we're modelling. 169 URLs, how they actually rank, and the 4 flaws we can beat them on |
| [`docs/research/service-area-coverage.md`](docs/research/service-area-coverage.md) | All 135 postcode districts and **39 post towns** across B/DY/TF/WS/WV, with covered localities |
| [`docs/research/seo-audit-2026-08-06.md`](docs/research/seo-audit-2026-08-06.md) | **Full SEO audit of the live site.** All 115 URLs crawled, measured against Arbor Trail as a control. Severity-ranked findings, then a fix list split into *do now* / *do in the rebuild* / *ignore* |
| [`docs/seo/skills.md`](docs/seo/skills.md) | Which SEO plugins are installed, what they cost per session, and the remaining gaps |
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
- Two defects on the live site must be fixed in the rebuild: **duplicate Coventry slugs** (`south-coventry` *and* `coventry-south`) and a **service-slug mismatch** leaving 57 location pages with no parent service page. Both **confirmed by measurement** in the SEO audit.
- The GBP pin appears to be in **Leamington Spa** — great for Warwickshire/Coventry, but one pin **cannot** rank in the map pack in the Black Country or Telford. Pin location still needs verifying.

### From the SEO audit (2026-08-06)

- **Thin content is NOT the risk we assumed.** Measured, the 95 location pages are ~2× *less* similar to each other than Arbor Trail's (median 5-gram Jaccard 0.049 vs 0.100) with 2.3× more unique prose. **The content model is safe to scale to 336.**
- **The real blocker is architecture.** There is no hub-and-spoke: the same arbitrary **4** of 95 location pages sit in the global footer; the other 91 get a median of 4 inbound links. `/services`, `/locations` and every town hub **404**.
- **The `<h1>` on 101 of 115 pages is an adjective fragment** — `"Reliable & Affordable"` — because the keyword line is a `<div>`. 0 of 95 location-page H1s contain the town.
- **Zero structured data**, same as Arbor Trail — the opening is real and still unexploited.
- **4.9★ from 175 reviews** exists only inside a 516 KB JavaScript bundle, absent from HTML, titles, descriptions and schema.
- **The site-wide footer dials the wrong phone number** — shows `+44 7861 936533`, links `tel:07441918832`.

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
