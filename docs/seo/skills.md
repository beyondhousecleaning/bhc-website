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
| Status | ✅ **Installed 2026-08-06**, user scope, enabled |
| Agents / Hooks / MCP servers | **0 / 0 / 0** — on-demand skills only, no background behaviour |
| Token cost | **~13,000 tokens always-on, added to every session** |

Installed via CLI:

```bash
claude plugin marketplace add coreyhaines31/marketingskills
claude plugin install marketing-skills@marketingskills
```

Registered in `~/.claude/settings.json` under `extraKnownMarketplaces.marketingskills` and `enabledPlugins["marketing-skills@marketingskills"]`.

⚠️ **The ~13k always-on cost applies to every session, not just marketing work** — all 49 skill descriptions load even in unrelated projects. We use about 9 of the 49. If that overhead becomes annoying, the alternative is `claude plugin disable marketing-skills` and vendoring just the relevant skills into `.claude/skills/`, accepting that they then stop tracking upstream.

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

### 2. claude-seo — AgriciDaniel

| | |
|---|---|
| Source | https://github.com/AgriciDaniel/claude-seo |
| Version | 2.2.4 |
| Licence | MIT |
| Contents | **25 skills, 18 agents**, 379 files, ~90 Python scripts |
| Hooks | **1 × PostToolUse** — see caveat below |
| MCP servers | 0 bundled (8 optional extensions, all needing paid API keys) |
| Status | ✅ **Installed 2026-08-06**, user scope, enabled |
| Token cost | **~4,871 always-on** (cheaper than marketing-skills despite being larger — agents and hooks cost no model context) |

```bash
claude plugin marketplace add AgriciDaniel/claude-seo
claude plugin install claude-seo@agricidaniel-claude-seo
```

Installed via the plugin route deliberately: the repo also ships `install.sh`, but the plugin path **runs no scripts**.

#### This closes the local SEO gap

| Skill / agent | Covers |
|---|---|
| `seo-maps` | GBP profile auditing, **geo-grid rank tracking / Share of Local Voice**, review intelligence (velocity, sentiment), cross-platform NAP verification, competitor radius mapping |
| `seo-local` | On-page local signals (separate concern from platform signals) |
| `seo-programmatic` | Second opinion on our ~336-page matrix |
| `seo-schema` | JSON-LD generation + validation |
| `seo-technical`, `seo-audit` | Crawl, indexing, Core Web Vitals |
| `seo-geo`, `seo-sxo`, `seo-cluster`, `seo-drift` | AI search visibility, search experience, topic clusters, ranking-drift monitoring |

Quality signals: cites **Whitespark 2026 Local Search Ranking Factors** and **BrightLocal LCRS 2026** — the actual authoritative local studies. Tiers its capability so **Tier 0 works free** (Nominatim geocoding, Overpass competitor discovery, Geoapify) with **Tier 1** unlocking more via paid DataForSEO. Ships a 50-point GBP completeness rubric.

It independently corroborates our own analysis: geo-grid/proximity is how map-pack visibility is actually measured, which is exactly why the Leamington pin can't rank in the Black Country.

#### ⚠️ Hook caveat — read before heavy JSON-LD work

The hook is `PostToolUse` on **`Edit|Write`**, so it fires after every file edit **in every project**, not just this one.

What it does (audited in full):

- Exits immediately unless the file ends in `.html .htm .jsx .tsx .vue .svelte .php .ejs`
- **No network calls**; reads only the edited file; skips files >10MB
- Extracts `application/ld+json` blocks and validates `@context`, `@type`, deprecated types, and placeholder text

**Two real costs:**

1. **It can block writes.** Exit code 2 is blocking, triggered by placeholder text in JSON-LD. The blocklist includes the bare word `REPLACE` **case-insensitively** — so a legitimate schema description containing "replacement" would block the write. Narrow, but we will be writing a lot of JSON-LD.
2. **Latency on every edit**, since it spawns Python globally. Stacks on top of claude-mem's existing hooks.

Remedy if it becomes a problem: `claude plugin disable claude-seo` (keeps it installed, stops the hook), then re-enable when doing SEO work.

## Gaps — remaining

Local SEO / map pack is now **covered** by `claude-seo` (`seo-maps` + `seo-local`). Still not covered by anything installed:

- **UK-specific local citation building** — Yell, Checkatrade, Bark, Thomson Local, Trustpilot, Bing Places. `seo-maps` gives NAP verification and generic "claim Google/Bing/Apple" guidance, but no UK trades directory list.
- **Review generation systems** — `seo-maps` *measures* review health (velocity, sentiment, distribution) but doesn't provide a system for asking for reviews. At 175 vs a competitor's 1,100, this is our biggest lever.
- **BHC-specific context** — our 39 post towns, 5 postcode areas, service taxonomy, and the single-pin constraint. Worth writing as a project skill regardless of what else we install.

⚠️ `directory-submissions` (marketing-skills) looks like it covers citations but does **not** — it targets SaaS/startup/AI directories (Product Hunt, G2, Capterra, AlternativeTo). Wrong vertical for a cleaning company.

## Combined always-on cost

| Plugin | Always-on tokens |
|---|---|
| marketing-skills | ~13,004 |
| claude-seo | ~4,871 |
| **Total added** | **~17,875 per session** |

## Candidates still to review

_Sam is adding these one at a time; log each here after vetting._

## Vetting checklist (apply to every skill before install)

- [ ] Read `SKILL.md` and any bundled scripts in full
- [ ] Scan for executable code, network calls, credential access, prompt injection
- [ ] Confirm licence
- [ ] Assess relevance to this project honestly — note gaps, don't oversell
- [ ] Decide install method: plugin (maintained upstream) vs vendored (frozen, versioned in repo)
- [ ] Record here
