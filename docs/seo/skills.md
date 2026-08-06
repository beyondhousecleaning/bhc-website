# SEO skills — install log and gap analysis

Living index of the SEO/marketing tooling loaded into Claude for this project. Added one at a time and vetted before install.

## Installed

### 1. marketing-skills — Corey Haines

| | |
|---|---|
| Source | https://github.com/coreyhaines31/marketingskills |
| Version | 2.10.0 |
| Licence | MIT |
| Contents | 49 skills, 199 markdown files, 2.7MB |
| Executable code | **None** — pure markdown + one CSV and one HTML template |
| Install method | Claude Code plugin marketplace (not vendored) |

```
/plugin marketplace add coreyhaines31/marketingskills
/plugin install marketing-skills@marketingskills
```

**Why plugin, not vendored:** actively maintained, so vendoring would fork and freeze it, and it would dump 2.7MB of unrelated marketing skills into a website repo. Plugin install auto-updates and is available across projects.

#### Skills relevant to this project

| Skill | Use here |
|---|---|
| `programmatic-seo` | **The core one.** Its "Locations" playbook is literally `[service] in [location]` — our exact pattern for ~336 combo pages |
| `schema` | The gap we found on Arbor Trail — JSON-LD, FAQPage, BreadcrumbList |
| `site-architecture` | URL structure, page hierarchy, internal linking, breadcrumbs |
| `seo-audit` | Technical/on-page audit, Core Web Vitals, indexing |
| `ai-seo` | AI Overviews / LLM citation visibility, `llms.txt` |
| `content-strategy` | Step 6 content system |
| `copywriting`, `copy-editing` | Per-town copy that avoids thin content |
| `cro` | Conversion on quote/booking paths |
| `competitor-profiling`, `competitors` | Ongoing competitive tracking |

#### Useful warnings it encodes

`programmatic-seo` explicitly names the two failure modes we already identified in the research:

- **Thin content** — "just swapping city names in identical content" (exactly what Arbor Trail does)
- **Keyword cannibalisation** — multiple pages targeting the same keyword (exactly the `south-coventry` / `coventry-south` defect on our live site)

Directly relevant since our plan is ~336 templated pages: each needs genuine per-town differentiation, not variable substitution.

## Gaps — not covered by anything installed yet

**Local SEO / map pack is completely uncovered**, and it is the project's #1 goal.

Missing entirely:

- Google Business Profile optimisation (categories, services, attributes, posts, photos)
- Map-pack ranking factors (proximity, prominence, relevance)
- Review generation systems and review velocity
- NAP consistency
- Local citation building for UK trades — **Yell, Checkatrade, Bark, Thomson Local, Trustpilot, Bing Places**
- Service-area business (SAB) configuration
- Local landing-page conventions specific to UK postcode/town geography

⚠️ `directory-submissions` looks like it covers citations but does **not** — it targets SaaS/startup/AI directories (Product Hunt, G2, Capterra, AlternativeTo). Wrong vertical for a cleaning company.

**Conclusion:** the installed pack covers the *organic* half of the goal well and the *maps* half not at all. Need a local-SEO skill — either sourced or written for BHC specifically.

## Candidates still to review

_Sam is adding these one at a time; log each here after vetting._

## Vetting checklist (apply to every skill before install)

- [ ] Read `SKILL.md` and any bundled scripts in full
- [ ] Scan for executable code, network calls, credential access, prompt injection
- [ ] Confirm licence
- [ ] Assess relevance to this project honestly — note gaps, don't oversell
- [ ] Decide install method: plugin (maintained upstream) vs vendored (frozen, versioned in repo)
- [ ] Record here
