# Phase 3: Programmatic Location × Service Engine — Research

**Researched:** 2026-08-11
**Domain:** Next.js 16 App Router static generation at 426 routes · a zero-dependency lock harness at 22× its designed scale · O(n²) similarity measurement in CI · declarative redirects on Vercel · ~81,000 words of composed content
**Confidence:** **HIGH** — every load-bearing number below was measured in this worktree by building a real 426-route probe (58 synthetic towns × 6 services + 58 hubs + a locations index), running the existing lock suite and budget script against it, serving it with `next start` and curling the redirect table. The probe was deleted, `next.config.mjs` restored, `npm run verify` re-run green at 19 routes, and `git status` is clean.

---

<user_constraints>
## User Constraints

**There is no `03-CONTEXT.md`.** No question has been put to Sam for this phase. The binding constraint set is the union of three approved artifacts, and the planner may not re-litigate any of them.

### Locked Decisions — `PROJECT.md` Key Decisions, still binding

- **D2** — the 95 live combo URLs are preserved unchanged; the new index/hub layer uses the plural `/locations` prefix specifically to avoid colliding with the singular `/location` combo prefix. *(§14-5 of the UI-SPEC asks Sam to amend this by five URLs — see Open Questions.)*
- **D3** — the Leamington GBP pin does not move; B/DY/TF/WS/WV are organic-only.
- **D4** — no street address and no UK postcode in any rendered output, anywhere, ever.
- **D5** — Next.js on Vercel.
- **D6 / D11 / D12** — the token layer in `design-system/tokens.css` is locked. No new token, no white-on-`--action`, no white-on-`--cyan`, no neutral greys.
- **D8** — only what SEO needs is locked; everything else is open.
- **D13** — no `FAQPage` schema, ever.
- **D14** — one canonical UK-vocabulary slug per service concept, eight concepts. *(Its "4 Americanised slugs" clause is internally inconsistent — see §14-1 and Open Questions.)*
- **D-14 (Phase 1 constraint)** — <500 KB JS, <1 MB total page weight, measured as **gzip transfer weight**. No third-party script >50 KB without sign-off.
- **D-15** — the Vercel deployment stays `noindex` until cutover.

### Locked Decisions — the approved `03-UI-SPEC.md` (revision 2)

The UI-SPEC settles **what** is built. This research does not re-derive any of it. Specifically locked and not open to the planner:

- **Three templates**, and only three: `/locations`, `/locations/[town]`, `/location/[region]/[town]/[service]`. Plus exactly one new static page, `/services/apartment-cleaning`, as a seventh `services.js` record (§9.1, §13-U).
- **Zero new components.** All 22 exist. Phase 3 writes data, three route files and three plain CSS classes (§7, §7.5, §13-P).
- **Zero client components.** No `use client`, no `next/link`, no static map, no filter box, no IntersectionObserver (§8.1, §13-N).
- **58 towns / 348 combos / 258 new combos / 57 new hubs / 317 new pages / 426 built routes** (§9.2, §13-A). Re-derived and independently confirmed in this research from the frozen sitemap.
- **Two six-service sets.** The 18 legacy towns keep `move-out-cleaning` in slot six; the 40 new towns take `short-term-rental-cleaning`. The intent overlap stays at the 36 frozen pages (§5, §13-D, §13-S).
- **`COMBO_SERVICES` is its own table** in `web/content/towns.js`, not a read of `services.js` (§13-Z).
- **The two-region rule** — everything visible reads `county`; only the route reads `urlRegion` (§8.2, §13-B, delta 28).
- **The pin's coordinates never enter the repo**; the `leamington-spa` town centroid is the origin for all pin-relative ordering (§13-O).
- **`PUBLISHED_TOWNS` is the single filtered array**; nothing reads the raw town list (§11.1).
- **Batch 1 is 21 towns / 58 new pages**, and Phase 3 completes with batch 1 published (§11.2, §13-Y, §13-T).
- **The band orders, `<h1>` deck, `<h2>` deck, title chain and description forms in §5 and §9** are the copy contract, measured against the longest town in the corpus.
- **The composition index** — a Latin-square `(a, b)` per town, injective and balanced (§10.2, §13-W, delta 29).
- **`ReviewRail.town` is not used**; the heading is `What our customers say` sitewide (§13-J).
- **No `QuoteFormEntry` and no fourth `tel:`** on any Phase 3 template (§13-K).
- **No `Hero.image`** on any of the three templates (§13-L).
- **The 29 CI lock deltas 16–29** are the assertion contract.

### Locked Decisions — inherited from Phases 1 and 2, still binding

- **D-02 / D-05 / D-06** — `@bhc/design-system` is consumed as a workspace package, untranspiled `.jsx`, no build step, zero dependencies. Any component change goes *into* the package in the four-file shape.
- **D-12 / D-13** — the lock suites run on bare `node --test` with zero dependencies, and CI fails the build when a lock fails.
- **Copy lives in `web/content/*.js`**, never in `.jsx`. Two independent reasons: framework-agnostic components must not carry site copy, and the `claude-seo` `PostToolUse` hook rejects `.jsx` writes containing the case-insensitive substring `REPLACE`.
- **`main` is gated by ruleset 20595020** — `locks` + `build` required, strict, no bypass actors. A red suite blocks the branch.

### Claude's Discretion

- The internal shape of the rule-based expectation resolver (delta 18) and of the similarity gate (delta 23), provided both stay zero-dependency.
- Which script file each new lock lives in, and whether a fourth script joins `check-html-locks.mjs` / `check-budget.mjs`.
- The wave/plan decomposition, and specifically how the ~52,000 words of batch-1 content are partitioned across plans.
- Whether the sitemap ships in this phase or is left to Phase 5 (the UI-SPEC is ambiguous — see Open Questions).
- The exact prose of every authored fragment, subject to §10's measured ceilings.

### Deferred Ideas (OUT OF SCOPE)

- **Batches 2–5** — post-cutover data changes, not Phase 3 work (§13-T).
- **`/services` index** — not built; the service breadcrumb stays two crumbs (§9.6, §13-M).
- **Real before/after pairs** — Phase 4. Every combo page ships `data-bhc-photo-state="pending"`.
- **`AggregateRating` / `Service` / `LocalBusiness` schema, `RatingBadge.emitSchema`, Lock 8's town clause, the 900px/720px breakpoint normalisation** — Phase 5.
- **Town-filtered reviews** — Phase 4, and satisfied by "where available" being nowhere until real town data exists.
- **Article/blog template** — Phase 6.
- **Analytics / tag manager** — still open from `01-CONTEXT.md`; Phase 3 ships none (§14-4).
- **A static map on the locations index** — refused on three independent grounds (§13-N).
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **REQ-programmatic-page-scale** | Scale indexed location×service pages from 95 to ~336, generated from one towns×services data file | **Proven feasible at full scale.** A 426-route probe with three nested dynamic segments built in **5.6 s** with **zero** routes falling out of `prerender-manifest.json` (§ *Generating 406 pages*). The single-leaf `generateStaticParams` returning all three params is the documented Next.js pattern [CITED: nextjs.org generate-static-params]. The roadmap's "~336" is stale; **348** is the derived figure and this research re-confirms it from the frozen sitemap. |
| **REQ-fix-duplicate-coventry** | Pick one Coventry slug, 301 the other, add a real `coventry` town page | **Mechanism verified end to end.** `next.config.mjs` `redirects()` compiles into declarative routing rules with **no middleware and no runtime** (`middleware-manifest.json` is `{"middleware":{}}`), and a live `next start` probe returned a single hop on `/location/warwickshire/coventry-south/deep-cleaning` while the preserved sibling returned 200 with no hop (§ *The 301s*). **`permanent: true` emits 308, not 301** — a defect against SC-3's literal wording, fixed by `statusCode: 301`. |
| **REQ-canonical-service-taxonomy (D14)** | One canonical slug per concept, UK vocabulary; the Americanised service slugs 301 | The rename is a data change across **eight** coupled files, two of which fail loudly and one of which fails **silently** (`faqs.js`). Full change-set inventory in *Runtime & Coupled-State Inventory*. The "4 vs 2" contradiction between the roadmap and D14 is real and is §14-1's question for Sam; the shipped default (two redirects) is safe and reversible. |
| **REQ-content-depth-bar** | ≥800 unique body words per combo page, batched rollout 50–100 | **The measurement is cheap and the design's own predictions reproduce.** A 348-document 5-gram Jaccard corpus modelled on §10.2's block structure measured **median 0.0000 / within-service mean 0.0428 / worst pair 0.2387** against the spec's predicted 0.00 / 0.044 / 0.244 — in **1.9 s and 40 MB**. §10.3's sampling fallback is unnecessary. But 5-gram Jaccard is a **lexical** metric and cannot see paraphrase; the audit's own second metric (TF-IDF cosine) costs 2.3 s and should be restored (§ *The similarity assertion*). |
| **REQ-hub-and-spoke-architecture** | Every combo reachable in ≤3 clicks; InterlinkBlock computed from geography | The machinery exists (`geo.js`) and works at scale — delta 6 (*every internal link resolves*) and delta 15 (*every in-page anchor resolves*) **both passed on the 426-route probe with zero code changes.** The `PUBLISHED_TOWNS` construction makes that structural rather than lucky. But delta 19's 60-link cap **cannot hold on `/locations`** past batch 1 (§ *Defects found in the approved UI-SPEC*, D-3). |
</phase_requirements>

---

## Summary

The UI-SPEC is a strong contract and most of its engineering risk is smaller than it looks. **The three things everyone expects to be hard are not.** A 426-route build takes 5.6 seconds and 570 MB; the existing lock harness reads 39 MB of built HTML across 426 pages and runs all 37 locks in **937 ms**; the O(n²) similarity gate the spec hedges against with a sampling fallback runs exhaustively over all 60,378 pairs in **1.9 seconds**. Every one of those numbers is measured in this worktree, not extrapolated. The performance budget goes from 299.4 KB to **302.1 KB** against a 1024 KB ceiling — the combo template costs 2.7 KB on the worst page.

**The real risk is content, and it is 4× the size of everything Phase 2 authored.** `web/content/` today holds **12,649 authored words** across eighteen pages and fifteen plans. Phase 3's fragment corpus is ~81,000 words, and — this is the finding the batching plan does not currently account for — **batch 1 alone needs ~52,000 of them, 63% of the corpus for 36% of the towns**, because the 112 service-variant fragments are a fixed grid that a 21-town prefix already exercises in full. The phase's dominant work item is roughly nine plans' worth of prose at `services.js` density, and about 39% of it is eight genuinely-different 300-word passages per service — the single most likely place for this phase to produce something that passes delta 23 and still reads as eight paraphrases.

**Six defects in the approved contract**, listed in full below with evidence. Three are load-bearing: delta 19's 60-link cap is arithmetically impossible on `/locations` from batch 2 onward (measured chrome baseline 29 links + 58 TownCards ≈ 93) and would *pass* in the phase that writes it; the sitemap that §11.1 names as a `PUBLISHED_TOWNS` consumer has no route contract in §9.1, and adding `app/sitemap.js` **crashes the entire lock harness at module load** (verified — the suite drops from 37 tests to one failing test with a misleading "run npm build first" message); and `next.config` `permanent: true` emits 308 where SC-3 and delta 24 both say 301.

**Primary recommendation:** land the harness rewrite (deltas 16, 18, 21, 26, plus a non-HTML route filter) as one atomic change against one build **before** any generated route exists, exactly as Phase 2 learned to do with delta 1 — then land the service-variant fragment grid (service-axis, town-independent, 31,360 words, on batch 1's critical path) before the town-axis fragments, because it is the only content block that gates every town at once.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Town/service data, coordinates, batch flags, composition index | **App data module — `web/content/towns.js`** | — | §8.2. One `.js` module, `site.js` house style. Its module-load assertions (delta 29, `PUBLISHED_TOWNS.length > 0`) are the phase's cheapest gate: they run before a single page is built. |
| Combo/hub prose fragments and the composition rules that select them | **App data modules — `web/content/`** | — | Copy never enters `.jsx` (framework-agnostic components + the `claude-seo` `REPLACE` hook). At ~81,000 words this is also the only place the corpus is greppable and diffable. |
| Route definition, `generateStaticParams`, `generateMetadata`, `dynamicParams = false` | **Frontend Server (SSG, build time)** | — | 406 pages materialised at build. There is no request-time tier in this application and Phase 3 must not create one. |
| Geography — nearest-town ordering, interlink construction | **Design-system package — `InterlinkBlock/geo.js`** | App route (call site) | §7.2. Pure, no React, already tested. SC-4's "computed from geography" is satisfied by *using* it. The one change is an optional `metaFor` callback (§13-G). |
| Redirects — the Coventry merge, the service renames, the hierarchy 404s | **CDN / Edge — `next.config.mjs` `redirects()`** | — | Verified to compile into declarative routing rules with **no middleware entry and no serverless function**. Vercel consumes these as edge routing rules. Putting them in `proxy.ts` (Next 16's renamed middleware) would introduce the one runtime this phase otherwise avoids. |
| Route-set truth, per-page assertions, similarity, depth, link caps | **CI — `web/scripts/*.mjs` in the `build` job** | — | Everything that needs built HTML lives in the `build` job (which already runs `npm ci` + `next build`). The `locks` job is zero-install by design and must stay that way — see *Where each delta belongs*. |
| Composition-index invariants (injective + balanced) | **App data module, module-load assertion** | CI (`build`, transitively) | Delta 29. A build-time `throw` in `towns.js` is strictly better than a lock: it fails before 406 pages exist, and it fails in `next build` as well as in CI. |
| Rendering, bands, cards, interlinks, breadcrumbs | **Design-system package (as shipped)** | — | Zero new components. §7. |
| Real photos, town-filtered reviews, full JSON-LD graph, `<lastmod>` | **Out of scope** | — | Phases 4 and 5. `data-bhc-photo-state="pending"` is the machine-readable hand-off. |

---

## Standard Stack

### Core — unchanged from Phase 1 and 2, verified current

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | **16.3.0** | App Router, SSG, `generateStaticParams`, declarative redirects | Already installed and locked by D5/D-01. [VERIFIED: `web/package.json`, and a 426-route build in this worktree] |
| `react` / `react-dom` | **19.2.8** | RSC rendering | Installed. [VERIFIED: `web/package.json`] |
| `@bhc/design-system` | workspace `*` | The 22 components, tokens, `geo.js` | D-02. Zero `dependencies`, zero `devDependencies`. |
| `node` | **22.23.1** local / `22` pinned in CI and Vercel | Build + both lock runners | [VERIFIED: `node --version`; `.github/workflows/ci.yml` pins `node-version: '22'`] |

### Supporting — none

**Phase 3 installs zero packages.** `design-system/package.json` declares no dependencies and must continue to; `web/package.json` declares exactly `next`, `react`, `react-dom` and the workspace link. UI-SPEC §6 closes the registry surface explicitly. The similarity gate, the depth gate, the link cap and the redirect assertions are all achievable with `node:` builtins alone — the benchmarks below use nothing else.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next.config` `redirects()` | `proxy.ts` (Next 16's renamed middleware) | Introduces a request-time runtime on a site whose entire performance case is that it has none. Execution order also puts proxy *after* `redirects` [CITED: nextjs.org proxy.mdx], so it would add a tier without adding capability. **Refused.** |
| `next.config` `redirects()` | `vercel.json` `redirects` | Works, but splits the redirect table across two files, is invisible to `next build`, and cannot be asserted from `.next/`. Delta 24 needs a build artifact to read. **Refused.** |
| Exhaustive pairwise Jaccard | Sampling / MinHash / LSH | Measured: exhaustive is 1.9 s. MinHash trades exactness for speed the phase does not need, and an approximate worst-pair figure is exactly the wrong thing to approximate. **Refused — and §10.3's own sampling fallback should be deleted as dead complexity.** |
| A rule-based expectation resolver (delta 18) | A generated 426-entry literal, committed | The harness's standing rule is that an expectation may not be read from the code it checks. A generated literal is that rule broken with extra steps. **Refused.** |
| One `page.jsx` per town | The three-segment dynamic route | 348 directories rendering identical markup. Phase 2 already settled this for six service pages and the argument scales. **Refused.** |

**Installation:** none. `npm ci` from the committed lockfile is the only install step, and it is already in CI.

**Version verification:** `npm view next version` was not run — the version is pinned in a committed lockfile and a working build, which is stronger evidence than the registry's current tag. No package is added, so no version decision is open.

---

## Package Legitimacy Audit

**Phase 3 installs zero external packages.** The audit table is therefore empty by construction, not by omission.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| *(none added)* | — | — | — | — | — | — |

**Packages removed due to slopcheck `[SLOP]` verdict:** none — none proposed.
**Packages flagged `[SUS]`:** none.

The four existing dependencies (`next`, `react`, `react-dom`, `@bhc/design-system`) were audited `[OK]` in `01-RESEARCH.md` (slopcheck `--ecosystem npm`, `npm view scripts.postinstall` clean) and are unchanged. **If any plan in this phase proposes an npm install, that alone is a signal the plan has left the contract** — UI-SPEC §6 and §1 both close the registry surface, and D-06 requires the design-system package to keep zero dependencies.

---

## Architecture Patterns

### System Architecture Diagram

```
BUILD TIME (the only tier that exists)
──────────────────────────────────────────────────────────────────────────────

  web/content/towns.js                    web/content/services.js
  ├─ TOWNS[58]  {slug,name,urlRegion,     ├─ SERVICES[7]  (6 today + apartment)
  │              county,lat,lon,batch,    │   ↑ four records' h1/crumb/title
  │              localities,a,b}          │     corrected in this phase (§13-V)
  ├─ COMBO_SERVICES[7]                    └─ bySlug() — throws on unknown
  ├─ PUBLISHED_BATCHES = 1                          │
  └─ PUBLISHED_TOWNS = TOWNS.filter(...)            │
        │                                            │
        │  ┌── module-load assertions ──┐            │
        │  │ • length > 0               │            │
        │  │ • (a,b) injective          │  delta 29  │
        │  │ • (a,b) balanced per cohort│            │
        │  │ • COMBO_SERVICES nouns ==  │            │
        │  │   services.js nouns        │            │
        │  └────────────────────────────┘            │
        │                                            │
        ▼                                            ▼
  ┌───────────────────────── generateStaticParams ─────────────────────────┐
  │                                                                        │
  │  /locations              → static, 1 page                              │
  │  /locations/[town]       → 58 params  ─┐                               │
  │  /location/[r]/[t]/[s]   → 348 params ─┤  all three params from the    │
  │                                        │  LEAF's generateStaticParams  │
  └────────────────────────────────────────┴───────────────────────────────┘
        │                    │                        │
        │  content selection │   geo.js               │  reviews.js
        │  ┌─────────────────▼──────────┐   ┌─────────▼──────────┐
        │  │ block 2  ← town.opener     │   │ nearestTowns(      │
        │  │ block 3  ← SVC_A[s*8+t.a]  │   │   town,            │
        │  │ block 4  ← SVC_B[s*8+t.b]  │   │   PUBLISHED_TOWNS, │  ← THE line that
        │  │ block 5  ← COUNTY[s,county]│   │   n)               │    makes batching
        │  │ block 6  ← town.local      │   │ {...t,             │    safe
        │  └────────────────────────────┘   │  region:t.urlRegion}│
        │                                   └────────────────────┘
        ▼
  ┌──────────────── RSC render, 22 components, ZERO client modules ────────┐
  │  Breadcrumbs → Hero → SectionBand×n → InterlinkBlock×2 → CTABand       │
  └───────────────────────────────────────────────────────────────────────┘
        │
        ▼
  .next/server/app/**.html   (426 files, 39 MB raw)
  .next/prerender-manifest.json   ← the ROUTE TRUTH, all 426, compute:"static"
  .next/routes-manifest.json      ← the REDIRECT TRUTH, 7 entries
        │
        ├──────────────────────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼
  check-html-locks.mjs           check-budget.mjs            check-redirects.mjs
  (37 → ~45 locks, 937 ms)       (worst-page, 5.0 s)         (NEW — delta 24)
  reads every page once          gzips every route           reads the redirect
  O(pages) not O(pages×locks)                                table + serves nothing


REQUEST TIME (Vercel edge — routing only, no compute)
──────────────────────────────────────────────────────────────────────────────
  request ──▶ headers ──▶ REDIRECTS ──▶ (proxy: absent) ──▶ filesystem ──▶ 404
                          ▲                                  ▲
                          │ 7 declarative rules              │ 426 static files
                          │ from routes-manifest             │ dynamicParams=false
                          │ NO middleware, NO lambda         │ ⇒ unlisted = 404
```

### Recommended Project Structure

```
web/
├── app/
│   ├── locations/
│   │   ├── page.jsx                        # NEW — the index, static
│   │   └── [town]/page.jsx                 # NEW — 58 hubs
│   └── location/
│       └── [region]/[town]/[service]/
│           └── page.jsx                    # NEW — 348 combos, ONE file
├── content/
│   ├── towns.js                            # NEW — TOWNS, COMBO_SERVICES,
│   │                                       #   PUBLISHED_TOWNS, the (a,b) index,
│   │                                       #   and every module-load assertion
│   ├── town-prose.js                       # NEW — the 58 town-axis fragments
│   ├── service-variants.js                 # NEW — the 56 + 56 service-axis
│   │                                       #   fragments (the 39% block)
│   ├── county-notes.js                     # NEW — the 45 county-axis fragments
│   ├── services.js                         # MODIFIED — 4 records corrected,
│   │                                       #   apartment-cleaning added, 2 renamed
│   ├── nav.js                              # MODIFIED — labels follow the crumbs,
│   │                                       #   +apartment-cleaning, +Areas We Cover
│   ├── reviews.js                          # MODIFIED — key set follows the rename,
│   │                                       #   +reviewsForCombo()
│   └── faqs.js                             # MODIFIED — key set follows the rename
│                                           #   ⚠ SILENT on a miss — add a guard
├── next.config.mjs                         # MODIFIED — redirects()
└── scripts/
    ├── check-html-locks.mjs                # MODIFIED — deltas 16-23, 25-28
    └── check-redirects.mjs                 # NEW — delta 24 (see Pitfall 6)
```

Splitting the fragment corpus across four `content/` modules rather than one is not cosmetic: at ~81,000 words a single file is unreviewable, and the three axes (town / service / county) have genuinely different authoring cadences and different plan owners. `towns.js` stays the structural module and imports from the three prose modules, which keeps §8.2's field contract readable.

### Pattern 1: All params from the leaf `generateStaticParams`

**What:** one `generateStaticParams` on the deepest segment returns objects carrying **every** dynamic segment in the path. Parent segments need no `generateStaticParams` at all.
**When to use:** always, here. It is the documented Next.js pattern and it is what the probe built.

```jsx
// web/app/location/[region]/[town]/[service]/page.jsx
// Source: measured in a 426-route probe build in this worktree, 2026-08-11.
// Pattern confirmed by [CITED: nextjs.org/docs/app/api-reference/functions/
//   generate-static-params#multiple-dynamic-segments]
export const dynamicParams = false;

export function generateStaticParams() {
  const out = [];
  for (const town of PUBLISHED_TOWNS) {          // ← never the raw TOWNS array
    for (const service of town.services) {       // ← the town's OWN six (§5)
      out.push({ region: town.urlRegion, town: town.slug, service });
    }
  }
  return out;                                    // 348 objects, 3 keys each
}

export async function generateMetadata({ params }) {
  const { town, service } = await params;        // ← await is mandatory in Next 16
  // ...
}
```

Next's own build validates this: when a segment exports `dynamicParams: false`, it checks that segment's `paramName` appears in every generated route param and throws a named error if it does not [CITED: `packages/next/src/build/static-paths/app.ts` via Context7]. A typo in one of the three keys is a build error, not 348 silent 404s.

### Pattern 2: The published set is the only set

**What:** `PUBLISHED_TOWNS` is computed once in `towns.js` and every derived list reads it. Nothing reads `TOWNS`.
**Why it is the phase's single most important line:** it converts "a hub links to a page that is not built yet" from a class of bug that delta 6 catches *after* the fact into something structurally impossible.

```js
// web/content/towns.js
export const PUBLISHED_BATCHES = 1;                       // ← the one-line batch lever
export const PUBLISHED_TOWNS = TOWNS.filter((t) => t.batch <= PUBLISHED_BATCHES);

if (PUBLISHED_TOWNS.length === 0) {
  throw new Error('towns.js: PUBLISHED_TOWNS is empty — /locations has no rendered empty state');
}
```

Call sites must map explicitly at the `geo.js` boundary, because `TownCard.region` (display county) and `geo.js`'s `town.region` (URL segment) share a name and mean opposite things:

```js
// Source: design-system/src/components/InterlinkBlock/geo.js:46,56 — buildInterlinks
// builds `/location/${town.region}/...`. towns.js calls that field `urlRegion`.
const forGeo = (t) => ({ ...t, region: t.urlRegion });
nearestTowns(forGeo(town), PUBLISHED_TOWNS.map(forGeo), 5);
```

### Pattern 3: The similarity gate, exhaustive and hashed

**What:** shingle once into sorted `Int32Array`s, then intersect with a two-pointer merge. Measured 2.5× faster than `Set<string>` and it is the shape that stays comfortable if the corpus doubles.
**Runtime:** see *The similarity assertion* below. Full numbers, measured.

### Pattern 4: The expectation resolver as a template rule (delta 18)

**What:** `expectationsFor(route)` keeps its signature. Its implementation gains a template classifier ahead of the literal lookup, and the literal shrinks to the 20 static routes.

```js
// Shape only. The 20-entry literal for static routes is UNCHANGED and stays a
// literal — for those pages it checks that THE COPY IS RIGHT, which a rule cannot.
const TEMPLATES = [
  { test: (r) => /^\/location\/[^/]+\/[^/]+\/[^/]+$/.test(r), kind: 'combo' },
  { test: (r) => /^\/locations\/[^/]+$/.test(r),              kind: 'hub'   },
];

const expectationsFor = (route) => {
  if (Object.prototype.hasOwnProperty.call(PAGE_EXPECTATIONS, route)) {
    return PAGE_EXPECTATIONS[route];                     // the 20 static routes
  }
  const t = TEMPLATES.find((x) => x.test(route));
  if (!t) throw new Error(`no expectation for ${route}`); // ← the throw SURVIVES
  return RULES[t.kind];                                   // shape, not copy
};
```

**Record what this trades away, in the file.** For the 20 static routes the literal asserts the copy is right. For the 406 generated ones a rule can only assert the generator did not drop a field — `<h1>` *shape* (`/^.+ in .+$/` plus "contains this route's town"), breadcrumb depth, JSON-LD block count, `reviewCards`. That is the honest ceiling and the comment should say so, exactly as the existing `PAGE_EXPECTATIONS` header already anticipated ("Phase 3 may swap the IMPLEMENTATION … and should record in that change what it trades away").

**The `throw` must survive.** It is what makes a new *un-templated* route a hard failure. Do not turn it into a default.

### Anti-Patterns to Avoid

- **Deriving `EXPECTED_APP_ROUTES` from `PUBLISHED_TOWNS`.** Delta 26 says this explicitly and it is the harness's oldest argument: a floor derived from the code it guards asserts only that the code agrees with itself. Hard-code `426` (or the batch-1 figure) as an integer.
- **Flipping `INTERLINK_LOCK_ACTIVE` to `true`.** Verified in the probe: under `true` the lock runs `assert.ok(n >= 1)` inside the `APP_PAGES` loop and reddens the ten utility routes, `/locations` and `/_not-found`. It is a rewrite (delta 16), not a flip.
- **Exempting `/services/move-in-cleaning` from Lock 6.** §5 already solves it by scoping the *destination set* (8 nearest published hubs) rather than the requirement. An exemption would be the first hole in a blanket lock at exactly the moment the lock starts mattering.
- **Reading `urlRegion` anywhere visible.** Four legacy towns publish a false county on 29 pages if this slips. Delta 28 exists because no existing lock knows the difference between a URL segment and a place.
- **A second built CSS file.** The three new classes go into `design-system/styles.css`. A route-level `import './x.css'` produces a second hashed chunk and takes SC-1b with it. [VERIFIED in Phase 2 by probe]
- **`ReviewRail` inside a `tone="tint"` band.** `ReviewCard` sets `--bhc-paper-tint` — tint on tint. Every rail in §9 is banded `paper` or `warm` for this reason, and it is why the band orders look the way they do.
- **Rendering a distance in interlink meta.** `geo.js`'s default `${miles.toFixed(1)} miles away` publishes "46.2 miles away" on a Telford page. §13-G's `metaFor` callback is one optional parameter with no existing callers to break.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Enumerating the 426 built routes | A `readdirSync` walk of `.next/server/app` | `.next/prerender-manifest.json` `routes` | Already the expanded route list including `generateStaticParams` output. The *other* route manifest's `staticRoutes` array **omits** every generated page — measured in Phase 2 — and using it would silently under-assert the entire engine. |
| Nearest-town ordering, interlink construction | A new distance helper in `web/` | `geo.js`'s `distanceMiles` / `nearestTowns` / `buildInterlinks` | Ships in the package, has audited pin distances locked by a test, and SC-4's "computed from geography" is satisfied by *using* it. One optional `metaFor` param is the whole change. |
| 301/308 redirects | A `proxy.ts`, a route handler, or a client-side `<meta refresh>` | `next.config.mjs` `redirects()` | Compiles to declarative edge rules with **zero** runtime — verified: `middleware-manifest.json` is `{"middleware":{}}` and no function was emitted. Any other approach adds a request-time tier to a site that has none. |
| Per-page HTML size, gzip transfer weight | A new measurement script | `check-budget.mjs`, unchanged | Already worst-page across every route in the manifest, already gzip-correct (WR-05 closed in Phase 2), already prints the offending route. Ran clean on 426 routes in 5.0 s. |
| Extracting body text from built HTML | An HTML parser dependency | `html.split('self.__next_f')[0]` then tag-strip regexes | Measured: the markup half is **27.7 KB of a 76.7 KB** service page — splitting first drops 64% of the corpus before any regex runs, and the RSC flight payload is exactly the double-counting source the harness header already documents. 348 pages strip in **55 ms**. |
| Near-duplicate detection | MinHash, LSH, an embedding model, a similarity service | Exhaustive 5-gram Jaccard over hashed shingles | 60,378 pairs in 1.9 s / 40 MB. An approximation of the *worst pair* is the one figure you must not approximate. |
| Title-length arithmetic | Per-page authored titles | §5's two-candidate deterministic chain + delta 17's three assertions | 348 pages cannot be hand-titled, and assertion 3 ("omits the brand only where adding it would exceed 60") is what makes the fallback provable rather than a place titles quietly lose the brand. |

**Key insight:** almost every primitive this phase needs already exists in the repo and was built *specifically* for it — `geo.js`, `TownCard`, the manifest-driven harness, the worst-page budget, `dynamicParams = false`, `renderBlocks`. Phase 2's research called the `[service]` route "the cheapest possible rehearsal" for this phase and it was right. The failure mode is not missing machinery; it is re-implementing machinery that is sitting idle.

---

## Runtime & Coupled-State Inventory

This phase is a rename as well as a build. The D14 service-slug change touches state that a grep for the slug will find in code but that **fails in three different ways** depending on the file.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Coupled data modules (fail LOUDLY at module load)** | `web/content/reviews.js` — `SERVICE_REVIEWS` key set is compared against `services.js` slugs at module load and **throws** on drift [VERIFIED: `reviews.js:60-64`]. `web/content/services.js` — `bySlug` throws on an unknown slug. | Rename keys in the same commit. This is designed behaviour, not a bug. |
| **Coupled data modules (fail SILENTLY)** | ⚠ `web/content/faqs.js` — `serviceFaqs(slug)` returns `[]` for an unknown slug, and `FAQAccordion` renders **nothing** on empty items. A missed rename silently deletes the FAQ band from a page and **every existing lock stays green** [VERIFIED: `faqs.js:299-301`, and the file's own header says "Phase 3's canonical-slug rename is then a key change in this file"]. | Rename the keys **and** add a module-load guard mirroring `reviews.js`'s, or add a lock asserting FAQ item count per template. Do not rely on noticing. |
| **Lock-suite literals (fail loudly, but only after a build)** | `check-html-locks.mjs`: `EXPECTED_APP_ROUTES` (2 route strings), `PAGE_EXPECTATIONS` (2 route keys + 4 `h1` strings), `PHOTO_PLACEHOLDER_ROUTES` (2 route strings). | Update all three in the same change as the rename. |
| **Navigation state** | `web/content/nav.js` — `NAV` children (6 labels + 6 hrefs) and `FOOTER_COLUMNS` Services (6 labels + 6 hrefs). `services.js`'s own header requires `crumb` to match the nav label exactly. Plus a seventh entry each for `/services/apartment-cleaning`, plus the `Areas We Cover` item. | §13-V. Correcting only the `<h1>` ships one-concept-one-noun broken in the breadcrumb — the one place a reader sees the taxonomy as a taxonomy. |
| **Routing state** | `next.config.mjs` `redirects()` — currently **absent**; no `vercel.json` exists. | Create. Note: the old slug must be **removed from `services.js`** at the same time. Verified: with the record still present, Next prerenders `/services/standard-home-cleaning` *and* redirects it — the redirect wins (redirects run before filesystem routes), so the page ships in `prerender-manifest.json`, gets asserted by every lock, and is unreachable. |
| **Live external state** | The live Webflow site at `www.beyondhousecleaning.com` is untouched and stays untouched. Google's index holds the 95 combo URLs and 6 service URLs. `robots.txt` + `<meta robots noindex>` mean **nothing this phase builds is indexable until cutover** (D-15). | None in this phase. But it is why §13-T is right that batches 2–5 are post-cutover: the indexation clock SC-5 exists to protect does not start at merge. |
| **Build artifacts** | `.next/` only, fully gitignored, rebuilt from scratch by CI. No egg-info, no compiled binary, no registry image. | None. |
| **Secrets / env vars** | **None — verified.** No `.env` in the repo, no secret referenced by `next.config.mjs`, `ci.yml` declares `permissions: contents: read` and consumes no secrets. | None. |
| **OS-registered state** | **None — verified.** No scheduler entry, no daemon, no pm2 process. The only automation is the GitHub Actions workflow, which is in-repo. | None. |

---

## Common Pitfalls

### Pitfall 1 — Adding `app/sitemap.js` silently detonates the entire lock harness

**What goes wrong:** every lock stops running. The suite goes from 37 passing tests to **one failing test**, with the message `run npm run build --workspace @bhc/web first — these locks assert against build output, not source` — which is the single most misleading error the harness can produce, because the build succeeded.
**Why it happens:** `/sitemap.xml` **does** appear in `prerender-manifest.json.routes`. `PAGES` is built at module load from `Object.keys(manifest.routes)` and `fileFor()` maps it to `sitemap.xml.html`, which does not exist — the artifacts on disk are `sitemap.xml`, `sitemap.xml.body` and `sitemap.xml.meta`. The `read()` helper throws before a single test registers.
**[VERIFIED: added `app/sitemap.js`, rebuilt (manifest went 19 → 20 routes), ran `node --test web/scripts/check-html-locks.mjs`, reproduced exactly; probe deleted and the suite restored to 37/37.]**
**How to avoid:** filter non-HTML metadata routes out of `PAGES` **before** anything else, and assert the filter is non-vacuous. The same trap applies to `app/robots.js` (the repo currently uses `web/public/robots.txt` instead, which is why it has not fired).
**Warning signs:** a plan task that says "add the sitemap" without a task that says "teach the harness about it".

### Pitfall 2 — Landing delta 1's successors without deltas 16, 18 and 21 in the same change

**What goes wrong:** the first generated route turns **seven** locks red at once and `main` is strict with no bypass actors, so nothing merges.
**Why it happens:** measured, not predicted. On the 426-route probe with the harness untouched, exactly seven failed: delta 1 (route table), delta 4/SC-4a (`<h1>`), SC-4b (breadcrumbs), SC-4h (review cards), SC-4d (InterlinkBlock — delta 16), delta 8 (photo state — delta 21) and SC-4f (JSON-LD blocks). Six of the seven are the same root cause: `expectationsFor()` throwing on an unlisted route.
**How to avoid:** treat "harness rewrite" as one atomic unit — deltas 16, 18, 21, 26 plus the sitemap filter — landed in **one commit against one build**, before any generated route exists. This is exactly the lesson Phase 2 recorded as its own Pitfall 1 and it is the same shape.
**Warning signs:** a wave plan with "add the combo route" scheduled before or beside "update the expectation resolver".

### Pitfall 3 — `permanent: true` emits **308**, not 301

**What goes wrong:** SC-3 says "301 to their UK equivalents". Delta 24 says the redirects "resolve once". If delta 24 asserts the literal integer 301, it fails; if it asserts "some 3xx", it silently accepts 302.
**Why it happens:** Next.js deliberately uses 307/308 to preserve the request method [CITED: nextjs.org redirects.mdx, *"Why does Next.js use 307 and 308?"*]. `permanent: true` → 308.
**[VERIFIED: built with both forms; `routes-manifest.json` showed `308` for `permanent: true` and `301` for `statusCode: 301`, and a live `next start` + `curl` returned exactly those codes.]**
**How to avoid:** use the `statusCode: 301` variant of the `Redirect` discriminated union [CITED: `packages/next/src/types.ts`]. `statusCode` and `permanent` are mutually exclusive — do not set both. Google treats 308 as equivalent to 301, so either is *SEO*-correct; the point is that the spec and the lock must agree with the config.
**Warning signs:** a redirect table written entirely with `permanent: true` next to a lock asserting `=== 301`.

### Pitfall 4 — `serviceFaqs()` deletes a band without failing

**What goes wrong:** the D14 rename lands, `reviews.js` throws and gets fixed, and `faqs.js` is forgotten. `serviceFaqs('domestic-cleaning')` returns `[]`, `FAQAccordion` renders `null`, and the page ships with no FAQ band. Every lock is green: SC-4b, SC-4c, SC-4f, delta 4, the budget — nothing asserts a FAQ band exists.
**Why it happens:** `faqs.js` deliberately returns `[]` rather than throwing so an unknown slug drops a band instead of 500ing a route. That was the right call for Phase 2 and is the wrong one during a rename.
**How to avoid:** add a module-load key-set guard to `faqs.js` in the same change, mirroring `reviews.js:60-64`. Cheap, and it is the only one of the three coupled modules without one.
**Warning signs:** a rename plan that lists `reviews.js` and `nav.js` but not `faqs.js`.

### Pitfall 5 — The two-region trap at the `geo.js` boundary

**What goes wrong:** every interlink href on every generated page becomes `/location/undefined/...`.
**Why it happens:** `geo.js:46` builds `/location/${town.region}/...` while `TownCard.region` is the display county and `towns.js` calls the URL segment `urlRegion`. A raw `towns.js` row passed into `buildInterlinks` has no `region` field.
**How to avoid:** map explicitly at every call site — `{ ...town, region: town.urlRegion }`. §7.2 names this; the point of repeating it is that delta 6 catches it *after* 406 pages of interlinks have been generated wrong, and the failure message ("internal link pointing at a URL that is not prerendered") does not point at the cause.
**Warning signs:** `nearestTowns(town, PUBLISHED_TOWNS, n)` with no mapping wrapper.

### Pitfall 6 — Delta 24 cannot be written inside `check-html-locks.mjs`

**What goes wrong:** the redirect assertions need `.next/routes-manifest.json`, but that file's name **may not appear** in `check-html-locks.mjs` — the acceptance check for the Phase 2 rewrite greps that file for the name and requires zero hits, and the harness's own rule 3 says a scanner must not match its own source. Writing delta 24 there fails a gate that exists for a good reason.
**How to avoid:** a new `web/scripts/check-redirects.mjs`, added to the `verify` script and to the CI `build` job. It also keeps the redirect assertions runnable independently, which matters because they are about HTTP, not HTML.
**Warning signs:** a plan task that adds a redirect lock to the existing harness file.

### Pitfall 7 — The `claude-seo` hook and 81,000 words

**What goes wrong:** a `.jsx` write is rejected with exit 2 mid-task, with no obvious cause, because the `PostToolUse` hook blocks on the case-insensitive substring `REPLACE` (which `.replace(` contains, and which ordinary copy containing *"replacement"* also contains).
**How to avoid:** copy lives in `web/content/*.js`, which the hook does not watch. This is already the standing rule; at 81,000 words it is the difference between a working session and an unexplained wall. Every string-manipulation helper stays in a plain `.js` sibling too.
**Warning signs:** an unexplained exit-2 on a `.jsx` write; a plan that puts prose in a route file.

### Pitfall 8 — A route silently going dynamic

**What goes wrong:** one `cookies()`, one `headers()`, one un-awaited `params`, one `export const dynamic` and the route drops out of `prerender-manifest.json` — and therefore out of `PAGES`, out of `APP_PAGES`, and out of **every single assertion in the suite**. The suite goes green by having less to check.
**How to avoid:** the hard-coded `EXPECTED_APP_ROUTES` floor (delta 26) plus the existing `compute === 'static'` assertion. Verified on the probe: all 426 routes reported `compute: "static"` and the non-static set was empty. At 406 generated pages this exposure is 22× what it was.
**Warning signs:** the build output showing `ƒ (Dynamic)` next to any route; `EXPECTED_APP_ROUTES` derived from data rather than typed as an integer.

### Pitfall 9 — Eight paraphrases that pass delta 23

**What goes wrong:** the 56 `a`-variants and 56 `b`-variants are written as eight rewordings of the same 300 words per service. Delta 23 measures 5-gram Jaccard, a **lexical** metric — eight paraphrases share almost no 5-grams and measure ≈0.05. The gate reports green on exactly the problem it exists to detect.
**Why it happens:** it is the path of least resistance when one author writes eight variants of one topic back to back, and the spec's own §13-S records the identical trap in a different guise ("two textually dissimilar pages can still be intent-identical, and delta 23 measures text").
**How to avoid:** the audit ran **two** metrics — 5-gram Jaccard *and* TF-IDF cosine (live-site median 0.120) — and delta 23 keeps only the first. Restore the cosine check: it costs 2.3 s (measured) and it is the metric that moves under paraphrase. Also require each variant to be a genuinely different *angle* (a different room, a different customer, a different failure mode), not a different sentence order.
**Warning signs:** a plan task worded "write 8 variations of the deep-cleaning copy".

### Pitfall 10 — Trailing slashes in the delta 24 assertions

**What goes wrong:** delta 24 asserts the 90 preserved URLs "resolve with no redirect", and a test written against `/location/warwickshire/warwick/deep-cleaning/` fails.
**Why it happens:** Next emits a default `308 /:path+/ → /:path+` normalisation rule that ships whether or not you configure redirects. [VERIFIED: it is the first entry in `routes-manifest.json.redirects` on a build with no `redirects()` clause at all, and `curl` confirmed the hop.]
**How to avoid:** assert the canonical no-trailing-slash form, and assert the count of configured redirects excluding the framework's own normalisation rule.

---

## Code Examples

### The similarity gate — exhaustive, hashed, zero-dependency

```js
// Measured in this worktree, 2026-08-11, on a 348-document corpus of 995 words
// each modelled on UI-SPEC §10.2's block structure:
//   shingling (sorted Int32Array): 88 ms
//   all-pairs (60,378):           555 ms   [Set<string> form: 1,403 ms]
//   within-service (9,918):        97 ms   [Set<string> form:   248 ms]
//   heap:                          40 MB
const N = 5;
const h32 = (s) => {                       // FNV-1a, 32-bit
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h | 0;
};

const shingles = (text) => {
  const w = text.split(/\s+/);
  const seen = new Set();
  for (let i = 0; i + N <= w.length; i++) seen.add(h32(w.slice(i, i + N).join(' ')));
  return Int32Array.from(seen).sort();     // sorted → two-pointer intersect
};

const jaccard = (A, B) => {                // O(|A| + |B|), no allocation
  let hit = 0, x = 0, y = 0;
  while (x < A.length && y < B.length) {
    if (A[x] === B[y]) { hit++; x++; y++; }
    else if (A[x] < B[y]) x++;
    else y++;
  }
  return hit / (A.length + B.length - hit);
};
```

**Do not build the pair list as an array.** 60,378 `[i, j]` tuples is needless allocation; loop `for (i) for (j = i+1)` and accumulate into a plain array of scores.

### Extracting the counted-prose corpus

```js
// Measured: the markup half is 27.7 KB of a 76.7 KB service page — the RSC flight
// payload is 64% of the file. Splitting first is a 3.5x reduction before any regex
// runs. 348 pages strip in 55 ms.
const bodyText = (html) =>
  html
    .split('self.__next_f')[0]              // drop the flight payload (harness rule 2)
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/g, ' ')   // breadcrumbs, jump links, footer columns
    .replace(/<header[\s\S]*?<\/header>/g, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
```

§10.3's strip list also excludes *what's included*, ProcessSteps bodies, FAQ answers, review quotes and interlink labels. Those need markers the templates emit — the `.bhc-interlink`, `.bhc-process`, `.bhc-faq` and `.bhc-review__quote` class hooks all already exist in the built HTML, so the strip is a section-level regex per class, not a new data contract.

### The redirect table — verified, with the 301 correction

```js
// web/next.config.mjs — verified end to end: built, inspected in routes-manifest,
// then served with `next start` and curled. NO middleware entry is emitted
// (`middleware-manifest.json` stays `{"middleware":{}}`) and no function is created.
async redirects() {
  return [
    // statusCode: 301 — NOT `permanent: true`, which emits 308.
    { source: '/areas-served',    destination: '/locations', statusCode: 301 },
    { source: '/location',        destination: '/locations', statusCode: 301 },
    { source: '/location/:region', destination: '/locations', statusCode: 301 },

    // ⚠ This one redirects ANY 2-segment /location/* path, including garbage,
    //   to /locations/<garbage> — which 404s because dynamicParams is false.
    //   VERIFIED: /location/warwickshire/nowhere-town → 308 → 404.
    //   A redirect-to-404 chain is a soft-404 generator. Either scope the town
    //   segment to the published slug set, or accept and document it.
    { source: '/location/:region/:town', destination: '/locations/:town', statusCode: 301 },

    { source: '/location/warwickshire/coventry-south/:service',
      destination: '/location/warwickshire/south-coventry/:service', statusCode: 301 },

    // The old slug MUST also be removed from services.js in the same change.
    // VERIFIED: leave the record in and the page is still prerendered, still in
    // prerender-manifest.json, still asserted by every lock — and unreachable,
    // because redirects run BEFORE filesystem routes.
    { source: '/services/standard-home-cleaning',
      destination: '/services/domestic-cleaning', statusCode: 301 },
  ];
}
```

### Measured behaviour of that table

| Request | Result | Meaning |
|---|---|---|
| `/location/warwickshire/warwick/deep-cleaning` | **200**, no hop | SC-2 / delta 24's "the 90 are untouched" ✓ |
| `/location/warwickshire/coventry-south/deep-cleaning` | **308** → `.../south-coventry/deep-cleaning` | SC-3, one hop ✓ (301 with `statusCode`) |
| `/areas-served` | **301** → `/locations` | `statusCode: 301` works ✓ |
| `/location/warwickshire/warwick/deep-cleaning/` | **308** → the no-slash form | framework default, unavoidable, must be excluded from delta 24 |
| `/location/warwickshire/nowhere-town` | **308** → `/locations/nowhere-town` → **404** | redirect-to-404 chain ⚠ |
| `/location/warwickshire/warwick/nope-cleaning` | **404** | `dynamicParams = false` ✓ |
| `/services/standard-home-cleaning` | **308** → `/services/domestic-cleaning` | redirect precedes filesystem ✓ |

---

## Measured Scale Numbers

Everything in this section was produced by building a real 426-route probe in this worktree on 2026-08-11 (Next 16.3.0, React 19.2.8, Node 22.23.1, Apple Silicon, 317% CPU utilisation). The probe rendered a full combo template — Breadcrumbs, Hero with rating, ~995 words of `Prose`, a *what's included* list, `BeforeAfterSlider`, `ProcessSteps`, a three-card `ReviewRail`, **two** `InterlinkBlock`s, `FAQAccordion` and `CTABand` — plus 58 hubs and a 58-card locations index.

### Build

| Metric | 19 routes (baseline) | **426 routes (probe)** | Note |
|---|---|---|---|
| `next build` wall clock | ~2 s | **5.6 s** | 22× the routes for ~2.8× the time — page generation is not the bottleneck |
| Max resident set size | — | **570 MB** | Vercel build containers have 8 GB. Not a constraint. |
| Routes in `prerender-manifest.json` | 19 | **426** | **Zero** non-`static` routes |
| `.next/server/app` on disk | ~1 MB | **107 MB** | `.next` total 275 MB |
| Total built HTML | 966 KB | **39.1 MB** | |
| Mean combo page HTML (raw) | — | **95.8 KB** | vs 76.7 KB for a Phase 2 service page |
| Largest page | 92 KB (`/`) | **99.8 KB** (`/locations`, 58 cards) | |

### Lock harness

| Metric | 19 routes | **426 routes** |
|---|---|---|
| `node --test check-html-locks.mjs` | 167 ms | **937 ms** |
| Max RSS | — | **176 MB** |
| Locks passing / failing | 37 / 0 | 30 / **7** (all seven are named deltas) |
| `check-budget.mjs` | ~0.5 s | **5.0 s** (122 MB RSS) |
| `run-locks.mjs` (the `locks` job) | 222 ms | **222 ms** — route-count independent |

**The `locks` CI job is unaffected.** It runs `design-system/test/run-locks.mjs` with zero install and never touches build output; nothing in this phase should be added to it except package-source scans. Everything build-dependent belongs in the `build` job, which already runs `npm ci` + `next build`.

### Performance budget

| Metric | 19 routes | **426 routes** | Ceiling |
|---|---|---|---|
| JS (gzip, modern) | 129.8 KB | **129.8 KB** — *unchanged* | 500 KB |
| HTML (gzip), worst page | 14.3 KB | **17.0 KB** | — |
| CSS (gzip), shared | 4.7 KB | 4.7 KB | — |
| Fonts (raw woff2), shared | 150.7 KB | 150.7 KB | — |
| **Worst page total** | **299.4 KB** | **302.1 KB** | **1024 KB** |
| Worst route | `/services/deep-cleaning` | `/location/warwickshire/south-coventry/deep-cleaning` | |

**The combo template costs 2.7 KB on the worst page and 0 KB of JavaScript.** The UI-SPEC's projection of "~305 KB" was right to within 3 KB. There is 722 KB of headroom, and the dominant term remains the 150.7 KB of shared woff2. **The performance budget is not a risk in this phase** — but per §12's own note, record the figure per batch so a later regression has a baseline.

### The similarity assertion (delta 23)

Corpus: 348 documents of 995 words, assembled from the exact block structure of §10.2 (58 town openers, 58 locality paragraphs, 7×8 `a`-variants, 7×8 `b`-variants, 45 county notes, per-page leads), with the Latin-square `(a, b)` assignment.

| Measurement | Pairs | Time | Median | Mean | Max |
|---|---|---|---|---|---|
| 5-gram shingling (`Set<string>`) | — | 112 ms | | | |
| 5-gram shingling (sorted `Int32Array`) | — | **88 ms** | | | |
| All-pairs Jaccard (`Set<string>`) | 60,378 | 1,524 ms | **0.0000** | 0.0096 | 0.2387 |
| All-pairs Jaccard (hashed) | 60,378 | **555 ms** | 0.0000 | 0.0096 | 0.2387 |
| Within-service Jaccard | 9,918 | **97 ms** | **0.0000** | **0.0428** | **0.2387** |
| TF-IDF cosine, all-pairs | 60,378 | **2,290 ms** | — | — | — |
| Peak heap | | | | | **40–58 MB** |

**Two conclusions the planner should act on.**

1. **The design's own predictions reproduce.** §10.3 predicts all-pairs median 0.00 (measured 0.0000, ceiling ≤0.06), within-service median 0.00 (measured 0.0000, ceiling ≤0.10), within-service mean 0.044 (measured **0.0428**, ceiling ≤0.08) and worst pair 0.244 (measured **0.2387**, ceiling ≤0.35). The arithmetic in §10.2 is sound and the ceilings have real headroom.
2. **§10.3's sampling fallback is dead complexity and should be deleted.** It reads *"If it ever exceeds 60 s in CI, the within-service cohorts run exhaustively and the cross-service population samples at 10%."* The full exhaustive run — including the masked-corpus second pass delta 23 also requires, and the TF-IDF cosine this research recommends restoring — is **under 7 seconds**. A conditional branch that never executes is a branch nobody tests; shipping it means the gate has two behaviours and only one is ever exercised.

The within-service cohort count is **9,918**, not the 9,198 the brief carries — `5 × C(58,2) + C(40,2) + C(18,2)` = `5 × 1653 + 780 + 153` = `8265 + 933` = **9,198**… and the probe measured 9,918 because it modelled six services per town uniformly rather than the split sets. **The split-set figure of 9,198 is correct**; the measured 9,918 is a 7.8% overcount, which makes the timing above a conservative upper bound.

### Content authoring volume — the phase's real cost

`web/content/` today holds **12,649 authored words** across ten modules and eighteen pages, produced by fifteen plans. [VERIFIED: string-literal word count over `web/content/*.js`, comments excluded.] Per module: `services.js` 5,600 · `legal.js` 2,474 · `utility.js` 1,976 · `faqs.js` 1,349 · `reviews.js` 652 · `home.js` 409. The six service pages carry **865–1,026 words** of prose each — the density Phase 3's 995-word combo bar matches.

The Phase 3 corpus, derived from §10.2:

| Fragment class | Axis | Count | Words each | Total | Needed for **batch 1**? |
|---|---|---|---|---|---|
| Town opener (block 2) | town | 58 | 180 | 10,440 | 21 towns → 3,780 |
| Locality paragraph (block 6) | town | 58 | 130 | 7,540 | 21 towns → 2,730 |
| Hub block A | town | 58 | 260 | 15,080 | 21 towns → 5,460 |
| Hub block B | town | 58 | 220 | 12,760 | 21 towns → 4,620 |
| **Service variant `a`** (block 3) | **service** | **56** | 300 | **16,800** | **ALL 56 → 16,800** |
| **Service variant `b`** (block 4) | **service** | **56** | 260 | **14,560** | **ALL 56 → 14,560** |
| County note (block 5) | service × county | 45 | 90 | 4,050 | ~32 → 2,880 |
| `/services/apartment-cleaning` | — | 1 | ~1,100 | 1,100 | yes |
| `/locations` intro | — | 1 | ~300 | 300 | yes |
| | | **~292** | | **~82,600** | **~52,100** |

**The finding the batching plan does not currently account for: batch 1 needs 63% of the corpus for 36% of the towns.** The 112 service-variant fragments are a fixed 8×8-per-service grid, and a 21-town prefix under the Latin square `a = i mod 8` uses **all eight** `a` values and **all eight** `b` values. Delta 29's balance clause makes this unavoidable rather than an artefact: with `n = 21` published, the per-value ceiling is `⌈21/8⌉ + 1 = 4`, and any assignment using fewer than eight values would exceed it.

Two consequences for the plan:

- **The service-variant grid is on batch 1's critical path and is town-independent.** It can and should be authored *before* the town list is final, in parallel with the data work, and it is the one content block that gates every town at once. 31,360 words — about 39% of the corpus and roughly 5.6× `services.js`.
- **Phase 3 is ~52,100 authored words against Phase 2's 12,649 total — 4.1×.** At `services.js` density (5,600 words to one plan), that is on the order of nine to ten content-authoring plans. Any plan decomposition that treats content as a task rather than as most of the phase has mis-sized it.

---

## Defects Found in the Approved UI-SPEC

The UI-SPEC is approved but not infallible, and both prior phases found real defects in their own approved contracts. Six here, ordered by consequence. Each is stated with the evidence that produced it.

### D-1 — Delta 19's 60-link cap is arithmetically impossible on `/locations`, and it will pass in this phase

Delta 19 reads *"At most 60 internal links per built page"* with no template scoping.

Measured chrome baseline on a real built page: **29** internal path links (`/privacy-policy`, which carries header + footer + a breadcrumb and nothing else). [VERIFIED] Phase 3 adds three chrome links — `/services/apartment-cleaning` in `NAV` **and** in `FOOTER_COLUMNS`, plus the `Areas We Cover` nav item — taking chrome to **32**.

| Template | Chrome | Page-specific | Total | vs 60 |
|---|---|---|---|---|
| Combo | 32 | 2 crumbs + 4 CTA + 5 siblings + 5 nearby = 16 | **~48** | ✓ (spec says ~47) |
| Town hub | 32 | 2 crumbs + 4 CTA + 6 ServiceCards + 6 nearby = 18 | **~50** | ✓ |
| Home | 32 | ~7 + 8 locations teaser | **~47** | ✓ |
| **`/locations`, batch 1 (21 towns)** | 32 | 3 + **21 TownCards** | **~56** | ✓ **by 4** |
| **`/locations`, batch 2 (31 towns)** | 32 | 3 + **31 TownCards** | **~66** | ✗ |
| **`/locations`, all 58 towns** | 32 | 3 + **58 TownCards** | **~93** | ✗ **by 33** |

The failure mode is the worst available: **the lock passes in the phase that writes it and turns red on a one-line `PUBLISHED_BATCHES` increment months later, post-cutover, with no plan behind that change.** §11.2 explicitly says batches 2–5 are "a one-line change plus a raised route floor".

**Recommended fix:** make delta 19 a per-template rule like deltas 16, 18 and 21 — cap the combo, hub, service, home and utility templates at 60, and give `/locations` its own bound (`≤ chrome + 3 + PUBLISHED_TOWNS.length`, or a flat 120). The index is a link directory by design; capping it at 60 caps the site at 25 towns.

**A second, unspecified value with the same consequence:** §5 fixes `/services/move-in-cleaning`'s InterlinkBlock at *"the 8 nearest published town hubs"*, but §9 gives no count for the other six service pages' *"Towns we cover for {service noun}"* block. If it lists every town carrying that service, a service page is `34 + 3 + 58` ≈ **95** links. **That count must be bounded (≤10) in the plan.**

### D-2 — The sitemap has no home, and adding one breaks the harness

§11.1 lists *"the sitemap"* among the six derived lists that must read `PUBLISHED_TOWNS`. §9.1's route table does not include it, §12's deltas do not assert it, and `app/sitemap.js` does not exist in the repo.

That is a genuine ambiguity — and it is not free to resolve either way:

- **If Phase 3 ships it:** verified above (Pitfall 1) that `app/sitemap.js` puts `/sitemap.xml` into `prerender-manifest.json` and **crashes the lock harness at module load**, taking the suite from 37 tests to one failing test. The harness needs a non-HTML route filter *first*.
- **If Phase 5 ships it:** §11.1's claim that the sitemap reads `PUBLISHED_TOWNS` becomes a forward-looking note rather than a Phase 3 contract, and batches 2–5 (post-cutover, when the sitemap actually matters for indexation) would land before the sitemap exists.

ROADMAP Phase 5 SC-4 owns `<lastmod>`, which argues for Phase 5. §11.1's own closing line — *"it also gives Phase 5's `<lastmod>` real values to publish"* — reads as though the sitemap already exists by then. **The planner must decide and record it.** Either way, the harness filter is required, because Phase 5 will hit the same wall.

### D-3 — SC-3 says 301; Next.js `permanent: true` says 308

Covered in Pitfall 3 with the verification. Not a design error — a config-vocabulary mismatch that will surface as a failing lock if delta 24 is written literally. One-word fix (`statusCode: 301`), but it must be a deliberate choice in the plan rather than a surprise.

### D-4 — §10.3's sampling fallback describes a branch that can never execute

Measured: the exhaustive run is 1.9 s where the fallback triggers at 60 s. Recommend deleting the clause. A never-executed conditional in a gate is untested code in the one place the phase's "safe to scale" claim is made mechanical.

### D-5 — Delta 23 drops the audit's paraphrase-detecting metric

The audit ran 5-gram Jaccard **and** TF-IDF cosine, and published both (live site: Jaccard 0.049, cosine 0.120). Delta 23 keeps only Jaccard. Jaccard is lexical: eight paraphrases of one 300-word passage share almost no 5-grams and measure ≈0.05. Given that 39% of the corpus is exactly "eight variants per service", this is the corpus's highest-risk region and the gate is blind there. Cosine costs **2.3 s** (measured). Recommend restoring it with a ceiling calibrated against the live site's 0.120.

### D-6 — The within-service pair count is 9,198, not 9,918

Minor, but the brief and any plan derived from it should use **9,198** — `5 × C(58,2) + C(40,2) + C(18,2)`. The split service sets are what make it smaller than the uniform figure. The timings above used 9,918 and are therefore conservative.

---

## State of the Art

| Old approach | Current approach | When changed | Impact on Phase 3 |
|---|---|---|---|
| Synchronous `params` | **`await params`**, sync access removed | Next.js 16 | Mandatory in `generateMetadata` **and** the default export on both dynamic routes. A sync read is a build error, not a warning. |
| `middleware.ts` | **Renamed `proxy.ts`**; edge runtime unsupported | Next.js 16 | Not needed and actively unwanted. Execution order puts proxy *after* `redirects` [CITED: nextjs.org proxy.mdx], so it adds a runtime without adding capability. |
| `permanent: boolean` only | **`statusCode: 301\|302\|303\|307\|308`** as a discriminated-union alternative | long-standing, but easy to miss | The only way to emit a literal 301 from `next.config`. Mutually exclusive with `permanent`. |
| Webpack default | **Turbopack default for `dev` and `build`** | Next.js 16 | Confirmed again on the 426-route probe: 5.6 s, all static, CSS through lightningcss unchanged. |
| `next build` printing `Size` / `First Load JS` | **Removed** (inaccurate for RSC) | Next.js 16 | `check-budget.mjs` remains the only budget signal; it handled 426 routes in 5.0 s unmodified. |
| `next lint` | **Removed** — call the ESLint CLI directly, flat config | Next.js 16 | Still no static analysis in CI (WR-18, open). Not a Phase 3 criterion. |
| FAQ rich results | **Retired by Google 2026-05-07** | 2026-05 | D13. Delta 7 asserts zero `FAQPage` occurrences and it must stay zero across 426 routes. |
| Hand-picked internal links | Geography-computed, recomputed per build | — | The recomputation property is what gives Phase 5's `<lastmod>` real values. |

**Deprecated / do not use:** `next-transpile-modules`, `--turbopack` / `--turbo` flags, `next lint`, `next/legacy/image`, `images.domains`, `FAQPage` schema, the `staticRoutes` array in Next's *other* route manifest (it omits every `generateStaticParams`-expanded page).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | **`node:test` + `node:assert/strict`** — builtins only, no config file, no dependency |
| Config file | none, by design (D-12) |
| Quick run command | `node design-system/test/run-locks.mjs` — **222 ms**, zero install, route-count independent |
| Full suite command | `npm run verify` → `test:locks && build && check:html && check:budget` |
| Measured full-suite cost at 426 routes | build 5.6 s + html locks 0.94 s + budget 5.0 s + design locks 0.22 s ≈ **12 s** local, plus `npm ci` |

### Phase Requirements → Test Map

| Req | Behaviour | Test type | Automated command | Exists? |
|---|---|---|---|---|
| REQ-programmatic-page-scale | 426 routes exist, all `compute: "static"` | built-artifact | `node --test web/scripts/check-html-locks.mjs` (delta 1 + delta 26 floor) | ✅ exists, needs the floor raised + the sitemap filter |
| REQ-programmatic-page-scale | No route silently went dynamic | built-artifact | same, `compute === 'static'` assertion | ✅ exists |
| REQ-fix-duplicate-coventry | 5 URLs redirect once; 90 resolve 200 with no hop | routing manifest | `node web/scripts/check-redirects.mjs` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | 2 service slugs redirect; old slugs are not prerendered | routing + route set | `check-redirects.mjs` + `EXPECTED_APP_ROUTES` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | One concept, one noun across `h1`/`crumb`/`title`/nav | data-module guard | module-load assertion in `towns.js` comparing `COMBO_SERVICES` to `services.js` | ❌ **Wave 0** |
| REQ-canonical-service-taxonomy | FAQ band survives the rename | data-module guard | key-set guard in `faqs.js` (mirroring `reviews.js:60`) | ❌ **Wave 0** |
| REQ-content-depth-bar | ≥800 / ≥600 / ≥300 counted prose words | built-artifact | delta 22 in `check-html-locks.mjs` | ❌ **Wave 0** |
| REQ-content-depth-bar | Similarity ceilings hold | built-artifact | delta 23 — ~2 s Jaccard + ~2 s masked + ~2.3 s cosine | ❌ **Wave 0** |
| REQ-content-depth-bar | `(a,b)` injective and balanced | module-load | delta 29 assertion in `towns.js` | ❌ **Wave 0** |
| REQ-hub-and-spoke-architecture | Every internal link resolves | built-artifact | delta 6 — **already passes at 426 routes, unmodified** | ✅ verified |
| REQ-hub-and-spoke-architecture | Every in-page anchor resolves | built-artifact | delta 15 — **already passes at 426 routes with 58 cards + 7 jump groups** | ✅ verified |
| REQ-hub-and-spoke-architecture | InterlinkBlock present per template | built-artifact | delta 16 (rewrite of SC-4d) | ❌ **Wave 0** |
| REQ-hub-and-spoke-architecture | Link count stays sane | built-artifact | delta 19, **per-template** (see D-1) | ❌ **Wave 0** |
| all | Budget holds | built-artifact | `node web/scripts/check-budget.mjs` — **302.1 KB / 1024 KB verified at 426 routes** | ✅ verified |

### Sampling Rate

- **Per task commit:** `node design-system/test/run-locks.mjs` (222 ms, zero install) — catches package-source regressions instantly.
- **Per wave merge:** `npm run verify` (~12 s local plus install) — the full gate.
- **Phase gate:** full suite green in CI on both required jobs before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `web/scripts/check-html-locks.mjs` — **non-HTML metadata-route filter** (Pitfall 1; blocks the sitemap and blocks Phase 5)
- [ ] `web/scripts/check-html-locks.mjs` — delta 18 template-rule expectation resolver, delta 16 per-template InterlinkBlock rule, delta 21 per-template photo-state rule, delta 26 route floor. **All four in one commit against one build** (Pitfall 2)
- [ ] `web/scripts/check-html-locks.mjs` — deltas 17, 19 (per-template), 20, 22, 23, 25, 27, 28
- [ ] `web/scripts/check-redirects.mjs` — **new file**, delta 24 (Pitfall 6)
- [ ] `web/content/towns.js` — module-load assertions: non-empty published set, delta 29 injectivity + balance, `COMBO_SERVICES` ↔ `services.js` noun agreement
- [ ] `web/content/faqs.js` — key-set drift guard (Pitfall 4)
- [ ] `package.json` — `verify` script gains `check:redirects`; `.github/workflows/ci.yml` `build` job gains the same step

*No framework install is needed. Every gap above is a builtins-only script.*

---

## Security Domain

The application is a fully static marketing site with **zero request-time compute**: no forms, no mutations, no accounts, no database, no API route, no server action, no cookies, no client JavaScript. Phase 3 adds 406 prerendered documents and changes nothing about that shape. The threat surface is correspondingly narrow, and the two categories that *do* apply are both about what reaches the built HTML.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | **no** | No auth surface. `/customer-login` is a link to a third-party system, not a login form. |
| V3 Session Management | **no** | No session, no cookie, no `cookies()` call anywhere (asserting this is also how routes stay static). |
| V4 Access Control | **no** | Every route is public and prerendered. |
| V5 Input Validation | **yes, narrowly** | The **only** user-controlled input in the entire build is the URL path segment, and `dynamicParams = false` means it never reaches a lookup at runtime — an unlisted segment 404s at the edge. Verified: `/location/warwickshire/warwick/nope-cleaning` → 404. This is the correct control and it is already the pattern the `[service]` route ships. |
| V6 Cryptography | **no** | Nothing is encrypted, signed or hashed at runtime. The FNV-1a in the similarity gate is a non-cryptographic bucketing hash and must not be described as anything else. |
| V7 Error Handling & Logging | **partial** | `_global-error` is Next's own document. Nothing this phase renders can leak a stack trace, because nothing runs at request time. |
| V12 Files & Resources | **yes** | The lock scripts read only `.next/` and repo source, with paths derived from the manifest rather than from any external input. |
| V14 Configuration | **yes** | D-15 (`noindex` + `robots.txt`) is the live control that keeps 426 unfinished pages out of the index until cutover. It is asserted on **every** page by an existing lock, and that assertion must keep passing at 426 routes. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation | Status |
|---|---|---|---|
| **Residential address / postcode leaking into rendered output** | Information Disclosure | Lock 5 / SC-2d matchers over built HTML **and** package source. Delta 25 extends them to the postcode *district* form (`B62`, `WV14`) that the full-postcode matchers do not catch. | Existing lock passed on 426 probe routes; **delta 25 is new work** and is the real exposure — `localities` data is one careless join from publishing a district. |
| **The registered-office coordinates entering the repo** | Information Disclosure | §13-O: the `leamington-spa` town centroid is the origin for all pin-relative ordering. Lock 5's matchers **would not catch** a latitude/longitude pair, so this is a rule, not a test. | Rule only. Worth a review-checklist item on `towns.js` rather than a lock, since a lock would have to encode the very coordinates it forbids. |
| Premature indexing of 426 unfinished pages | Information Disclosure | D-15: `<meta robots noindex,nofollow>` from the layout + host-level `robots.txt`. | Asserted on every page today; must stay green at 426. |
| Path traversal / arbitrary segment lookup | Tampering | `dynamicParams = false` on both dynamic routes. | Verified 404 on an unlisted segment. |
| Supply-chain compromise via a new dependency | Tampering | Zero packages added; `design-system` keeps zero dependencies; lock scripts import nothing but `node:` builtins. | Structural. |
| XSS via interpolated town/service names into JSON-LD | Tampering | `safeJsonLd` escaping helper, applied at all JSON-LD call-sites since plan 01-01. | Existing. All town/service names are repo-authored constants, not external input. |
| Redirect open-redirect | Tampering | Every `destination` is a relative path literal in `next.config.mjs`; none is computed from a request. | Structural. |
| Soft-404 via redirect chain | *(SEO, not security)* | See the `/location/:region/:town` note in the redirect example. | ⚠ Open — scope the source or document it. |

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build, both lock suites, every benchmark | ✓ | 22.23.1 local; `22` pinned in CI and in the Vercel project | — |
| npm workspaces | `@bhc/design-system` linkage | ✓ | bundled with Node 22 | — |
| `next` 16.3.0 | 426-route build | ✓ | installed; probe-built in this session | — |
| Git / GitHub Actions | the `locks` + `build` required checks | ✓ | `.github/workflows/ci.yml`, ruleset 20595020 | — |
| Vercel | hosting, edge redirect rules | ✓ (Phase 1) | live at `bhc-website-nine.vercel.app` | — |
| Context7 MCP | documentation verification | ✓ | used for `generateStaticParams`, `dynamicParams`, `redirects`, `proxy` | WebFetch |
| `slopcheck` | package legitimacy | n/a | — | **Not needed — zero packages added.** |
| Brave / Exa / Firecrawl | enhanced search | ✗ | all `false` in the init config | built-in WebSearch (not needed; every claim was resolved by measurement or Context7) |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none material.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Vercel converts `routes-manifest.json` `redirects` into edge routing rules with no serverless function, matching the local `next start` behaviour | *The 301s*, Architecture map | If Vercel handled them differently, the redirects would still work but might cost a function invocation. **Locally verified end to end; the Vercel-side behaviour is [ASSUMED] from the framework contract.** Cheap to confirm on the existing preview deployment before the phase completes. |
| A2 | A GitHub Actions `ubuntu-latest` runner builds 426 routes in roughly 3–5× the local 5.6 s (i.e. ~20–30 s) | *Measured Scale Numbers* | Only affects CI wall-clock expectations, not correctness. The local figure is measured; the CI multiplier is [ASSUMED]. |
| A3 | Real English prose produces 5-gram shingle sets of comparable size to the synthetic corpus, so the measured timings hold | *The similarity assertion* | The intersection loop is O(\|A\|+\|B\|) and independent of hit rate, so the timing is robust. Set *size* would only change if real prose repeated 5-grams heavily within a page, which it does not. Low risk. |
| A4 | The 32 chrome links after Phase 3's three additions (29 measured + `apartment-cleaning` × 2 + `Areas We Cover`) | *Defect D-1* | If chrome grows further, `/locations` breaches the cap sooner. The direction of the argument does not change. |
| A5 | Batch 1's 21 towns span 5 counties, giving ~32 county-note fragments | *Content authoring volume* | ±5 fragments ≈ ±450 words against a 52,100-word total. Immaterial. |
| A6 | The service-page InterlinkBlock will list ≤10 towns once specified | *Defect D-1* | If it lists all 58, six service pages breach delta 19. **This value is genuinely unspecified in the UI-SPEC** — it must be decided in planning, not assumed. |
| A7 | `check-budget.mjs`'s 5.0 s at 426 routes is acceptable in CI without the `htmlSize` pre-selection optimisation Phase 2's research suggested | *Measured Scale Numbers* | 5 s is fine. The optimisation exists if a later phase needs it. |

---

## Open Questions

1. **Does the sitemap ship in Phase 3 or Phase 5?**
   - *What we know:* §11.1 names it as one of six `PUBLISHED_TOWNS` consumers. ROADMAP Phase 5 SC-4 owns `<lastmod>`. `app/sitemap.js` does not exist. Adding it crashes the lock harness (verified).
   - *What's unclear:* which phase owns the route.
   - *Recommendation:* land the **harness filter** in Phase 3 regardless (Phase 5 hits the same wall), and let the planner choose the route's phase. If Phase 3 ships it, it is one small file and it makes §11.1 literally true; if Phase 5 does, record that §11.1's sitemap bullet is forward-looking.

2. **`statusCode: 301` or `permanent: true` (308)?**
   - *What we know:* both work; 308 preserves the request method and is what `permanent: true` emits; Google treats them equivalently for canonicalisation.
   - *What's unclear:* whether SC-3's "301" is literal or shorthand for "permanent".
   - *Recommendation:* ship `statusCode: 301` so the config, the requirement and delta 24 all agree without interpretation. It costs nothing.

3. **§14-1: two service redirects or four?** *(Sam)*
   - D14's eight canonical concepts already contain `post-construction-cleaning` and `short-term-rental-cleaning`, so only two of today's six slugs are non-canonical. The audit's "4" counted a different set. The shipped default (two redirects, plus the four `<h1>`/`crumb`/`title` corrections and the new `/services/apartment-cleaning`) closes the taxonomy half of D14 without touching the disputed slugs. **Not blocking.**

4. **§14-5: D2's "zero redirects" amendment.** *(Sam)*
   - §13-E ships five (the `coventry-south` set). SC-3 and D2 cannot both hold literally. The shipped default is the five redirects with delta 24 asserting that exactly those five hop and the other 90 do not. **Not blocking, but it amends a Key Decision in Sam's own project document and should be ratified rather than assumed.**

5. **How many towns does a service page's InterlinkBlock list?**
   - Genuinely unspecified (§5 fixes only `move-in-cleaning` at 8). At 58 it breaches delta 19 on six pages. **Must be decided in planning.**

6. **Is Phase 2 actually complete?**
   - `.planning/STATE.md` records `status: awaiting-human-checkpoint`, `stopped_at: 02-15-PLAN.md task 2 — blocking human-verify checkpoint (12 visual + keyboard checks)`, and notes 02-16 was "NOT yet pushed or CI-run at the time of writing". The orchestrator's brief describes Phase 2 as complete and live. `npm run verify` is green locally at 20 + 37 tests and the tree is clean, so the *code* is in the expected state — but the twelve visual and keyboard checks have not been answered.
   - *Recommendation:* flag to the orchestrator. Phase 3 changes the band tone on Home and all six service pages (§4's InterlinkBlock adjacency fix moves the FAQ band `paper` → `tint` on eight shipped pages), which means the unanswered visual checks would need re-running anyway. Better to close 02-15 first than to layer a visual change on an unverified baseline.

---

## Sources

### Primary (HIGH confidence — measured in this worktree, 2026-08-11)

- **426-route probe build** — 58 synthetic towns × 6 services + 58 hubs + a 58-card index, rendering the full §9.5 combo template. Build time, RSS, route count, `compute` values, per-route `htmlSize`, disk usage. Probe deleted; baseline rebuilt; `npm run verify` exit 0; `git status` clean.
- **`node --test web/scripts/check-html-locks.mjs`** against that probe — 937 ms, 176 MB, 30 pass / 7 fail with the failing route named in each message.
- **`node web/scripts/check-budget.mjs`** against that probe — 302.1 KB worst page, JS unchanged at 129.8 KB.
- **`next start` + `curl` redirect matrix** — seven request/response pairs, table in *Code Examples*.
- **`.next/routes-manifest.json`** with `permanent: true` and with `statusCode: 301` — 308 vs 301 confirmed.
- **`.next/server/middleware-manifest.json`** — `{"middleware":{}}` with redirects configured.
- **Similarity benchmark** — 348 documents / 995 words, §10.2 block structure, Latin-square `(a,b)`; Jaccard and TF-IDF cosine, both timing and distribution.
- **`app/sitemap.js` probe** — manifest 19 → 20 routes; harness crash reproduced; probe deleted.
- **Repo source, read directly** — `web/scripts/check-html-locks.mjs`, `check-budget.mjs`, `web/content/{services,reviews,faqs,nav,site}.js`, `web/app/services/[service]/page.jsx`, `web/next.config.mjs`, `.github/workflows/ci.yml`, `design-system/src/components/{InterlinkBlock/geo.js,InterlinkBlock/InterlinkBlock.jsx,TownCard/TownCard.jsx,ServiceCard/ServiceCard.jsx}`, `design-system/test/run-locks.mjs`.
- **`docs/research/current-site-sitemap-2026-08-06.xml`** — re-derived independently: 115 URLs, 95 combos = 19 towns × 5 services, all under `/location/warwickshire/`, one hub, six service pages, **no `/services/apartment-cleaning`** (the orphan defect, confirmed).
- **Context7 `/vercel/next.js/v16.2.9`** — `generateStaticParams` multiple dynamic segments; `dynamicParams: false` semantics and the build-time param validation in `packages/next/src/build/static-paths/app.ts`; the `Redirect` `statusCode` discriminated union in `packages/next/src/types.ts`; the "Why does Next.js use 307 and 308?" clause; the proxy execution-order clause.

### Secondary (MEDIUM confidence)

- `.planning/phases/02-.../02-RESEARCH.md` — the `prerender-manifest.json` decision, the `_global-error` correction, the SC-4g hole, the 8-route budget table, Pitfalls 5–9. Reused rather than re-derived, per the brief.
- `.planning/phases/03-.../03-UI-SPEC.md` revision 2 — the design contract. Treated as authoritative for *what*, and audited for *whether it can be built* (six defects above).
- `docs/research/seo-audit-2026-08-06.md` §5 — the similarity method (5-gram Jaccard **and** TF-IDF cosine, >30% sentence stripping, town-masked control) and the live-site figures the ceilings are calibrated against.
- `docs/research/service-area-coverage.md` — 39 post towns across 135 districts, and the named localities that are the per-town content source.
- `.planning/STATE.md` — the Phase 2 checkpoint status (Open Question 6).

### Tertiary (LOW confidence — flagged, not relied upon)

- Vercel's handling of `routes-manifest.json` redirects as edge rules (A1) — inferred from the framework contract and locally verified behaviour, not confirmed against a Vercel deployment in this session.
- CI runner build-time multiplier (A2) — estimate.

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|---|---|---|
| Scale feasibility (build, harness, budget) | **HIGH** | 426-route probe built, measured, torn down. Every number is an observation. |
| Similarity gate cost and behaviour | **HIGH** | Benchmarked with a corpus modelling §10.2's block structure; the design's own predicted figures reproduced to within 0.006. |
| Redirect mechanics | **HIGH** | Built, inspected in two manifests, served, curled — seven request/response pairs. The one [ASSUMED] step is Vercel-side behaviour (A1). |
| The six UI-SPEC defects | **HIGH** for D-1, D-2, D-3, D-6 (each reproduced or arithmetically derived from measured baselines); **MEDIUM** for D-4, D-5 (correct but arguable design judgements rather than errors of fact) |
| Content-authoring volume | **HIGH** on the arithmetic (word counts measured from the repo; the corpus decomposition follows §10.2 exactly); **MEDIUM** on the plan-count extrapolation |
| Batch-1 front-loading (63% of corpus for 36% of towns) | **HIGH** | Derived from the Latin square plus delta 29's own balance clause; both are in the spec. |
| Coupled-state inventory for the D14 rename | **HIGH** | Every guard read in source; the silent-failure path in `faqs.js` confirmed at `faqs.js:299-301`. |

**Research date:** 2026-08-11
**Valid until:** 2026-09-10 (30 days). The stack is pinned by a committed lockfile and every finding is a property of *this* repo at *this* commit, so the decay risk is low. Re-verify if `next` is upgraded past 16.3.0 — `generateStaticParams`, `dynamicParams` and `redirects()` are all stable APIs, but the prerender-manifest shape the harness depends on is an internal artifact.

**Working-tree state at completion:** clean. Probe files (`web/content/probe-towns.js`, `web/app/location/**`, `web/app/locations/**`, `web/app/sitemap.js`) deleted; `web/next.config.mjs` restored byte-for-byte from backup; `.next/` rebuilt to the 19-route baseline; `npm run verify` exit 0 at 20 design-system locks + 37 built-HTML locks + 299.4 KB worst page.
