# Context

Running notes from DOC-classified documents, keyed by topic. Locked/directive content already
lifted into `decisions.md` or `constraints.md` is not repeated here except where needed for
narrative continuity.

---

## Topic: Competitor model — Arbor Trail Cleaning Co

- **Source:** `docs/research/competitor-arbor-trail.md`
- Reference site Sam wants to model layout from: metro Detroit/Ann Arbor, MI, Webflow, claims
  ~$200k/mo, built by an agency (Blue Collar Builds).
- Wins on programmatic location×service scale (85 combo pages of 169 total URLs) + review
  volume (1,100+ reviews quoted in every meta description) — not on content marketing or
  technical SEO.
- What's broken there (BHC's opportunity): 4 self-cannibalising URL patterns for the same
  city×service; zero structured data; near-zero content depth (1 blog post); duplicate H2s
  repeating the exact keyword.
- Homepage section order (proven, worth copying): H1 → services (5 cards) → why-choose (4 icon
  tiles) → process (3 steps) → before/afters → CTA → FAQ → footer (with outbound Google Maps
  place link — a real local-relevance signal BHC currently lacks, see REQ-nap-consistency).
- Combo template: H1 `Trusted <Service> in <City>, <State>` + two H2s repeating the exact
  keyword + CTA + FAQ. ~57KB page.
- Design tokens observed: Poppins font; navy `#112d4e`/`#0d3b66`; cyan `#00bcf4`; pale tint
  `#eef7ff` (cold blue — this is why BHC's palette decision (D12) goes warm instead). BHC's
  orange sponge accent has no Arbor Trail equivalent.
- CTA pattern: one destination (`/book-online`), four label variants (`Book Now`, `Get A Free
  Quote`, `Get Your Free Quote`, `Get A Quote`).

## Topic: Live-site SEO audit — general findings not already promoted to constraints/requirements

- **Source:** `docs/research/seo-audit-2026-08-06.md`
- Method: Tier 0/free sources only (no DataForSEO, no paid keys); all 115 sitemap URLs crawled,
  22 Arbor Trail combo pages as calibration control.
- Overall SEO Health score: 51/100 (Technical 72, On-page 48, Content quality 82, Schema 0,
  Internal linking 35, Local/Maps 38, Performance 45, AI search readiness 30). Shape matters
  more than the number — content is genuinely strong (82), scaffolding (schema) is absent (0).
- Headline reversal: the goals doc originally named thin/duplicate content as the single
  biggest scaling risk. Measured, it is refuted — the content model is safe to scale (see
  REQ-content-depth-bar, and the (c) "ignore" list in constraints.md).
- Page weight: 1.9 MB of JS on every page (Webflow runtime 720 KB, Trustmary widget 516 KB, GTM
  514 KB, jQuery 87 KB). Two third-party scripts alone are 1,030 KB (54% of all JS).
- What could not be measured at Tier 0 (flagged for a human/Tier-1 follow-up): Core Web Vitals
  field data (PSI quota exceeded without a key; needs Search Console or a PageSpeed API key);
  actual indexation rate; organic traffic/query data (needs GSC+GA4); GBP categories, photos,
  posts, hours, Q&A (Google consent wall — pin location itself is resolved, but dashboard
  contents are not); map-pack position/geo-grid/Share of Local Voice (needs DataForSEO); backlink
  profile; competitor density around CV32 (Overpass found only launderettes — service-area
  businesses without a public premises don't appear in OSM).
- Reproducibility: all figures come from a crawl of
  `docs/research/current-site-sitemap-2026-08-06.xml` (115 URLs) plus 22 Arbor Trail combo pages
  as a control, dated 2026-08-06. Full method in source §12.

## Topic: SEO tooling installed for this project

- **Source:** `docs/seo/skills.md`
- Two Claude Code plugins installed and vetted 2026-08-06:
  - `marketing-skills` (Corey Haines, v2.10.0, MIT, 49 skills/199 md files, ~13,004 always-on
    tokens/session). No executable code. Installed as a plugin (not vendored) so it tracks
    upstream; only ~9 of 49 skills are relevant here.
  - `claude-seo` (AgriciDaniel, v2.2.4, MIT, 25 skills/18 agents/~90 Python scripts, ~4,871
    always-on tokens/session). Closes the local-SEO/map-pack gap (`seo-maps`, `seo-local`).
    Ships a 1×`PostToolUse` hook on `Edit|Write` for `.html/.htm/.jsx/.tsx/.vue/.svelte/.php/.ejs`
    files, in every project — validates JSON-LD, can **block writes** (exit code 2) if it finds
    the case-insensitive substring `REPLACE` (false-positive risk: a legit schema description
    containing "replacement" would block). Disable via `claude plugin disable claude-seo` if it
    becomes a problem during heavy JSON-LD work.
  - Combined always-on cost: ~17,875 tokens/session.
- Remaining gaps, not covered by either plugin: UK-specific local citation building (Yell,
  Checkatrade, Bark, Thomson Local, Trustpilot, Bing Places); a review-generation *system* (the
  installed tooling measures review health but doesn't help ask for reviews — at 175 vs Arbor
  Trail's 1,100 this is called out as BHC's biggest lever); BHC-specific context (39 post towns,
  5 postcode areas, service taxonomy, single-pin constraint) — worth writing as a dedicated
  project skill.
- Operational gotchas: plugin-provided skills don't show in `/skills` (that command only manages
  `~/.claude/skills/` and project `.claude/skills/`) — this can look like a failed install but
  isn't; verify via `claude plugin details <plugin>` or a fresh `claude -p` process. A session
  already running when a plugin installs cannot invoke it — restart required.

## Topic: Logo audit — measured findings behind the rebuild decisions

- **Source:** `docs/brand/logo-audit.md` (see `decisions.md` D10 for the one point where
  brand-brief.md explicitly overrides this doc's recommendation order)
- Current mark: horizontal arced "swipe" banner, blue gradient, white condensed uppercase
  wordmark, orange sponge with white highlight, raster-only (no vector source).
- Measured palette (sampled from pixels): cyan `#0DA6E8` → navy `#2064B1` gradient; orange
  `#F78C34`/`#F06C24`. This is the source of the exact hex values locked into
  `design-system.md` tokens (D6).
- Geometry problems: 29% dead margin top/bottom (renders ~20px tall in a 48px header); 2.72:1
  aspect ratio doesn't fit square slots at all; raster-only so it can't scale/recolour/render
  crisp small.
- Design problems: arced wordmark fights nav baseline; two-tier type at one scale (`HOUSE
  CLEANING` becomes an unreadable smear below ~120px); contrast falls off at the light
  (cyan) end of the gradient — the exact white-on-cyan failure later measured precisely in
  `design-system.md` (D11); no variant family; sponge reads as a generic blob when small.
- Its own recommended lockup order (horizontal primary, stacked, square badge, one-colour) is
  the default the brand brief explicitly reverses — see D10.

## Topic: Service-area postcode data

- **Source:** `docs/research/service-area-coverage.md`
- Reference data pulled from Wikipedia postcode-area articles, 2026-08-06. Excludes PO Box /
  Jobcentre-only districts. 5 postcode areas (B, DY, TF, WS, WV), 135 postcode districts, 39
  distinct post towns. Full district → post-town → covered-localities tables live in the source
  doc — not reproduced here; treat the source file as the data reference for the
  `towns.ts`-equivalent data file called for in D5/D1.
- The directive derived from this data ("target post towns and named suburbs, never postcode
  districts") is promoted to `constraints.md`.

## Topic: Kickoff process note (superseded by the fact it's already been run)

- **Source:** `docs/seo/audit-kickoff-prompt.md`
- This is the prompt used to produce `docs/research/seo-audit-2026-08-06.md` — instructional,
  not new information. Notes a prerequisite ("merge PR #1 first... `main` alone is missing the
  README, expansion decision, photo spec, and skills log") which may be stale/resolved by now
  since the audit it kicked off already exists in this ingest set.
- Documents a Claude Code operational fact worth retaining: plugins installed mid-session cannot
  be invoked until a fresh session starts (skill list is built at session start) — corroborates
  the same finding in `docs/seo/skills.md`.

## Topic: Photography — positioning rationale beyond the technical spec

- **Source:** `docs/brand/brand-brief.md`
- Direction: real homes, real light, matched framing. No stock photography of models in
  tabards — "it reads instantly as a national platform, which is the exact opposite of the
  positioning." This is the qualitative rationale behind the technical spec in
  `constraints.md`'s photo-spec section.

## Topic: Positioning statement

- **Source:** `docs/brand/brand-brief.md`
- "A genuinely local Warwickshire cleaning team — not a national booking platform, and not a
  faceless cleaning corporation." Competitive set in search: Fantastic Services and Care.com
  (national platforms, no local identity) — "a real team that lives here" is the position they
  structurally cannot claim. Feeds directly into D7 (visual direction B).
