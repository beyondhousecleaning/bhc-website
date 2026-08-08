# Kickoff prompt — SEO audit of the current site

Paste into a **fresh** Claude Code session so the `claude-seo` and `marketing-skills` plugins are loaded (a session started before those installs cannot invoke them).

**Prerequisite:** merge PR #1 first, or `git checkout worktree-bhc-website-readme` — `main` alone is missing the README, expansion decision, photo spec, and skills log.

---

Audit the current Beyond House Cleaning website for SEO. Use the `claude-seo` plugin (`seo-audit`, `seo-technical`, `seo-local`, `seo-maps`, `seo-schema`, `seo-programmatic`) and `marketing-skills` where useful.

**Read these first — full context is in the repo at `~/projects/bhc-website`. Do not redo this research:**

- `docs/goals.md` — goals, the expansion decision, known defects, open questions
- `docs/research/competitor-arbor-trail.md` — teardown of the site we're modelling
- `docs/research/service-area-coverage.md` — 39 post towns across B/DY/TF/WS/WV
- `docs/seo/skills.md` — what's installed and the known gaps

**Established facts — don't re-derive:**

- Primary goal is **visibility**: organic ranking + Google Maps / map-pack ranking. Not booking UX (that's `project-bk-v3`).
- Live site: https://www.beyondhousecleaning.com — Webflow, 115 URLs, of which **95 are `/location/<region>/<town>/<service>` combos, all Warwickshire**.
- **Decided:** keep Warwickshire + Coventry, **add** B/DY/TF/WS/WV on top. ~56 unique towns × 6 services ≈ 336 combo pages. The existing URL pattern is preserved, so the 95 need no redirects.
- GBP: **175 reviews at 4.9 stars**. Pin believed to be Leamington Spa CV32 but **unverified** — Google served a consent wall.
- Reference competitor: https://www.arbortrailcleaningco.com (169 URLs, 85 combo pages, 1 blog post, zero schema, four cannibalising URL patterns).

**Audit scope — cover at minimum:**

1. **Technical** — robots.txt, XML sitemap accuracy, host/protocol canonicalisation (www vs non-www, http vs https), indexability, canonical tags, redirect chains, 404s, page weight / Core Web Vitals.
2. **On-page** — titles, meta descriptions, H1 structure across every page type. Find duplicates and missing values.
3. **Structured data** — what JSON-LD exists. Arbor Trail has none; check ours.
4. **Internal linking** — are the 95 location pages linked from anywhere or orphaned? Is there a locations hub? Note the sitemap contains `locations/leamington-spa` (singular vs plural pattern).
5. **Thin / duplicate content across the 95 location pages** — *measure actual text similarity between towns*. This is the single biggest risk: it decides whether we can safely scale to 336 pages. Report a real similarity metric, not an impression.
6. **Confirm two known defects:**
   - `south-coventry` **and** `coventry-south` both exist — 5 pages each, 10 competing for identical intent.
   - Service-slug mismatch: location pages use `domestic-cleaning`, `apartment-cleaning`, `end-of-tenancy-cleaning`; service pages are `standard-home-cleaning`, `move-in-cleaning`, `short-term-rental-cleaning`, `post-construction-cleaning`. Only `deep-cleaning` and `move-out-cleaning` appear in both → 57 location pages with no parent service page.
7. **Local / maps** — GBP completeness against the 50-point rubric, NAP consistency across the site, and whether the 4.9/175 rating is displayed anywhere (it currently is not).

Use **Tier 0 / free sources only** — no DataForSEO or paid API keys are configured.

**Output:** write findings to `docs/research/seo-audit-2026-08-06.md`. Severity-ranked, with **evidence** (URLs, measurements, counts) rather than assertions. End with a prioritised fix list split into:

- **(a)** fix on the current site now
- **(b)** fix as part of the rebuild
- **(c)** ignore, with the reason

**Repo rules:** follow the `github` skill's house rules — kebab-case, README stays true, `<area>: <imperative>` commit subjects with a *why* body and the Co-Authored-By trailer. Commit on a branch and open a PR. **Do not push to main and do not merge.**

---

## Why a fresh session is required

Claude Code builds its skill list at session start. Installing a plugin mid-session registers it in `settings.json` but the running session cannot invoke it. Verified 2026-08-06: `Skill(claude-seo:seo-plan)` returned "Unknown skill" in the installing session, while `claude -p` in a fresh process resolved `claude-seo:seo-programmatic` correctly.
