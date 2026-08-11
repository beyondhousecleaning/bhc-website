# Phase 2: Component Library Completion & Core Templates — Research

**Researched:** 2026-08-09
**Domain:** Next.js 16 App Router multi-route static rendering · zero-dependency multi-page lock harness · zero-client-component CSS interaction patterns · performance budget at route scale
**Confidence:** HIGH — every load-bearing claim below was verified by an actual `next build` probe in this worktree (8 routes, then 5 routes, including a nested route, an SSG `generateStaticParams` route, a deliberate client-component probe, and a CSS feature probe). The scratch files were deleted and `npm run verify` is green (14 design-system locks / 21 HTML locks / budget 168.5 KB) at the end of this session.

---

<user_constraints>
## User Constraints

There is **no `02-CONTEXT.md`**. Phase 2's constraint set is the union of two approved upstream artifacts, and neither may be re-litigated by the planner.

### Locked Decisions — inherited from `01-CONTEXT.md`, still binding

- **D-01** Next.js on Vercel.
- **D-02** The app consumes `design-system/` as a local npm **workspace** package (`@bhc/design-system`). The package is not republished, restructured, or moved.
- **D-03** Vercel URL only. The apex stays on Webflow.
- **D-04** `design-system/tokens.css` is the single source of truth. Do not fork it, do not inline its values.
- **D-05** Components are consumed as-is. Any change goes **into the package**, keeping the `.jsx`/`.html`/`.d.ts`/`.prompt.md` shape and lock tests green — never into a divergent copy inside the app.
- **D-06** The package ships untranspiled `.jsx` with no build step and must work from a clean checkout.
- **D-07** Components render server-side by default. Nothing may force server-rendered output into client-only JS.
- **D-08 / D-09 / D-10 / D-11** One `tel:`, href digits == displayed digits, canonical number `+447861936533`, no street address or UK postcode anywhere, one shared `NAPFooter`.
- **D-12 / D-13** The design-system lock suite runs on bare `node --test` with zero dependencies, and CI must fail the build when a lock fails.
- **D-14 / D-14a** Budget: <500 KB JS, <1 MB page, measured as **transfer weight (gzip)**, not uncompressed bytes. No third-party script >50 KB without sign-off.
- **D-15** The Vercel deployment must not be indexable until cutover.

### Locked Decisions — from the approved `02-UI-SPEC.md`

The UI-SPEC is `status: approved`, 0 blocking findings. Its §1–§11 are the design contract and this research does **not** re-derive them. Specifically locked and not open to the planner:

- **Tool: none.** No shadcn, no Radix, no headless library, no Tailwind, no CSS-in-JS, no icon library. Zero registry surface (§1, §6).
- **Sixteen components**, each a directory of exactly four files plus a `styles.css` block, an `index.js` export, an `@dsCard group=` on line 1 of the `.html`, agreeing `category:` frontmatter, and entries in **both** `componentSrcMap` and `docsMap` (§7).
- **Zero client components.** `<details>`/`<summary>`, CSS `scroll-snap`, and a `[open] ~ sibling` selector carry every interaction (§8).
- **Eighteen routes** — 1 home + 6 services + 10 utility + `not-found` (§5, §13-D).
- **No `FAQPage` JSON-LD, ever** (§7.9, D13).
- **No `app/global-error.jsx`** — Next requires it to be a client component (§9.5, §13-K).
- The four groups are `Navigation` / `Content` / `Trust` / `Actions`. Do not invent a fifth (§7).
- `src/phone.js` is created and the `NAPFooter.jsx:34` literal is **deleted** in the same change (§7.0, §13-M).
- Plain `<a href>` sitewide; every link-bearing component takes `as?: ElementType` defaulting to `'a'` (§13-J).

### Claude's Discretion

- Route/data-module architecture and file layout inside `web/` (this research recommends a specific one — see Architecture Patterns).
- The internal design of the multi-page lock harness, provided it stays zero-dependency.
- Whether the budget script becomes worst-page or aggregate, and whether CSS/fonts enter the measurement (WR-05 is open).
- Wave/plan decomposition.

### Deferred Ideas (OUT OF SCOPE)

- Locations index, town hub, combo templates and the towns data file — **Phase 3**.
- Real review data and real before/after photos — **Phase 4**. `ReviewRail` returns `null` and `BeforeAfterSlider` renders its placeholder in Phase 2.
- The full 11-lock suite, title/description length enforcement (Lock 8), entity-graph JSON-LD (CR-05), the ≥800-word lock (Lock 11) — **Phase 5**.
- Article/blog template, `/blog`, `/blog/*` — **Phase 6**.
- Domain cutover, analytics/tag manager, off-site citations.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

Phase 2 maps to **no requirement ID** in `REQUIREMENTS.md` — it is infrastructure. Its contract is the four ROADMAP Success Criteria. Research support per criterion:

| SC | Criterion | Research Support |
|----|-----------|------------------|
| SC-1 | All 16 components exist in `design-system/src/components/` matching the four-file package shape | The shape is mechanically checkable from the package with zero dependencies (§ *Making the lock harness multi-page* → Delta 9 placement). All 16 are verified RSC-safe by construction: every mechanism the UI-SPEC specifies was probe-built and survives Turbopack intact (§ *Zero-client-component feasibility*). |
| SC-2 | Home + 6 Service + all Utility pages render, each with exactly one `<h1>` | Route inventory resolved against the live sitemap: **10** utility routes, not "~8" (§ *The route inventory, resolved*). Multi-route build output layout and the authoritative route list are verified (§ *Route/content architecture*). The one-`<h1>` assertion at 17-route scale is Delta 4 and the `_global-error` exclusion in the UI-SPEC is **wrong** — see the Correction below. |
| SC-3 | BeforeAfterSlider renders a labelled placeholder | Purely a component/CSS concern; `role="img"` + `aria-label` on inline SVG survives the build verbatim (verified). Assertable via `data-bhc-photo-state="pending"` in built HTML (Delta 8). |
| SC-4 | FAQAccordion present without `FAQPage` schema | `<details open>`, `<summary>`, and `<h3>` inside `<summary>` all render exactly as authored under RSC (verified). Closed `<details>` still ships full answer text in the served HTML (verified). The zero-`FAQPage` grep is Delta 7. |
</phase_requirements>

---

## Summary

The UI-SPEC has already decided *what* to build, and it is a genuinely strong contract. This research answers *how to build it without turning `main` red*, and the answer turns on one uncomfortable fact: **the existing lock harness was written for a one-page site, and it does not merely need widening — four of its twenty-one assertions are semantically wrong for Phase 2's templates and will fail on the first build, and the UI-SPEC's own §12 delta list does not name any of them.** They are SC-4b (breadcrumbs asserted on every page, but the Home template deliberately has none), SC-4d (InterlinkBlock asserted present, but it `return null`s until Phase 3 supplies data), SC-4f (exactly 3 JSON-LD blocks, but Phase 2's templates emit 1 on Home and 2 elsewhere), and the D-15 robots-meta assertion (which requires at least one robots meta and `_global-error.html` has zero). Delta 1 — globbing every prerendered page — is what makes the last one fire, so landing delta 1 without landing the fix turns CI red.

The second finding is a **factual correction to the approved contract**. UI-SPEC §9.5 states that `_global-error.html` "renders `RootLayout` and therefore has a `<footer>` and a `tel:` but no page content and no `<h1>` — so it is the single documented exclusion from the one-`<h1>` lock and from nothing else." I read the file that this repo's current build actually produces. Every clause is inverted: `_global-error.html` has **exactly one `<h1>`**, **zero `<footer>`**, **zero `tel:`**, zero robots metas, zero stylesheets, zero `bhc-` classes, and its root element is `<html id="__next_error__">` with **no `lang` attribute**. It does not render `RootLayout` at all — Next's built-in global-error renders its own document. So it needs **no exclusion from the `<h1>` lock** and needs excluding from **almost everything else**. Getting this backwards would produce a lock suite that is red for a whole wave while people hunt for a bug that is in the spec, not the code.

The third finding is a proven hole rather than a prediction. `page_client-reference-manifest.js` is emitted **per route**, and `check-html-locks.mjs` reads exactly one of them — the root route's. I added a `'use client'` component to a non-root scratch route, rebuilt, and the manifest assertion **passed** while the route genuinely shipped a first-party client module. Only the companion source-scan caught it, and that scan walks `web/app` only, so a `'use client'` added inside the design-system package on a component used off the home page is invisible to both halves. SC-4g is the single most load-bearing lock in the phase (§8's entire argument rests on it) and it is currently the weakest.

Everything else is good news, and most of it is measured. **Route count is free on the JS budget:** every one of the eight probe routes shipped byte-identically the same six chunks, 168.5 KB gzip, and adding a client component moved it by 0.2 KB — so with SC-4g green, 17 routes cost exactly as much JS as one. Per-page HTML is 2.5–4.2 KB gzip. **Every CSS mechanism the UI-SPEC relies on survives Turbopack/lightningcss verbatim** — the `[open] ~ .list` sibling combinator, `::-webkit-details-marker`, `scroll-snap-type`, `scroll-padding-inline`, `env(safe-area-inset-bottom)`, `inset-inline`, `counter()`, and both scoped `:focus-visible` overrides. **`<h3>` inside `<summary>` and `<details open>` render exactly as authored.** And `.next/prerender-manifest.json` hands you the authoritative expanded route list for free — including `generateStaticParams` output — which is precisely the primitive the multi-page harness and the "every internal link resolves" lock both need, and which scales to Phase 3's ~336 pages with no further work.

**Primary recommendation:** rewrite `check-html-locks.mjs` around a `PAGES` array built from `prerender-manifest.json` plus an `expectationsFor(route)` **function** (not a literal table), land the four unlisted lock corrections in the same wave as delta 1 so CI never goes red between waves, put the six service pages behind `app/services/[service]/page.jsx` + `generateStaticParams` driven by `web/content/services.js` rather than six hand-written directories, and keep every Phase 2 stylesheet rule inside `design-system/styles.css` so exactly one built CSS file continues to exist.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 16 component implementations, their CSS, their `.d.ts`/`.prompt.md`/`.html` | **Design-system package** | — | D-05. The package is the anti-drift boundary; a component authored in `web/` is a fork. |
| Phone canonicalisation (`CANONICAL_PHONE`, `toDial`, `formatPhone`) | **Design-system package (pure `.js`)** | — | §7.0. Three consumers now, not one. Must stay in `.js` so it is testable with zero deps and dodges the `claude-seo` `REPLACE` hook. |
| Page copy, `<h1>`s, titles, descriptions, FAQ items, service list | **App data modules (`web/content/`)** | — | Framework-agnostic UI components must not carry site copy. Phase 3 replaces this data at 336× scale without touching a component. |
| Route definition, `generateStaticParams`, `generateMetadata` | **Frontend Server (SSG)** | — | 17 statically prerendered routes; per-route metadata is a build-time concern. |
| Landmark structure (`SkipLink`, `Header`, `<main id="main">`, `Footer`, `StickyCallBar`) | **Frontend Server — `app/layout.jsx`** | — | §9.1. One instance each, structurally guaranteed by living in the layout, exactly as `NAPFooter` already is. |
| All interaction (nav disclosure, FAQ expand, review rail, before/after compare) | **Browser / Client — but via UA + CSS only** | — | §8. Zero JS. The UA owns `<details>` state; CSS owns everything else. **No client tier exists in this build.** |
| Route-set truth, budget measurement, per-page assertions | **CI (GitHub Actions)** | — | The built artifact on disk is the only thing that proves server-rendering. `main` is gated by ruleset 20595020 (`locks` + `build`, strict, no bypass actors). |
| Token layer, fonts, one bundled stylesheet | **CDN / Static** | — | D-04. One CSS file today; keeping it one is a Phase 2 discipline (see Pitfall 7). |
| Real review data, real photo pairs, `/locations`, combo pages | **Out of scope** | — | Phases 3 and 4. Components ship to their eventual API; data arrives later. |

---

## The Route Inventory, Resolved

The roadmap says "~8 Utility pages". **The real count is 10**, and the UI-SPEC (§5, §13-D) already reached that conclusion independently. I re-derived it from the live sitemap rather than accepting either.

`docs/research/current-site-sitemap-2026-08-06.xml` holds exactly 115 URLs, which decompose as:

| Class | Count | Detail |
|---|---|---|
| Home | 1 | `/` |
| Service | 6 | `/services/{deep-cleaning, standard-home-cleaning, move-in-cleaning, move-out-cleaning, short-term-rental-cleaning, post-construction-cleaning}` |
| Utility | **10** | `/about-us`, `/checklist`, `/contact-us`, `/customer-login`, `/customer-service-agreement`, `/get-a-quote`, `/gift-cards`, `/privacy-policy`, `/terms-of-service`, `/work-with-us` |
| Town hub | 1 | `/locations/leamington-spa` — **Phase 3** |
| Combo | 95 | `/location/<region>/<town>/<service>` — **Phase 3** |
| Blog | 2 | **Phase 6** |

[VERIFIED: `grep -o '<loc>' … | wc -l` → 115; class decomposition reproduced in-session]

**Resolution for the planner:** Phase 2 ships **17 routes** (1 + 6 + 10) plus `app/not-found.jsx`. Note the services live under a `/services/` prefix — the orchestrator's brief listed the bare slugs; the sitemap and the UI-SPEC both use `/services/<slug>`.

Two consequences that are easy to miss:

1. **Shipping 8 utility pages instead of 10 is not a smaller scope, it is a broken build.** Delta 6 asserts every internal `href^="/"` resolves to a prerendered route, and the Footer's Legal row (§7.2) links `/customer-service-agreement`. Descope a route and you must descope its footer link, which then breaks §7.2's own claim that every route is reachable from every page.
2. **Phase 2's route set makes delta 6 satisfiable for the first time.** Today the built HTML contains exactly four dead internal links — `/get-a-quote` and three `/location/warwickshire/warwick/*` — all on the scaffold `web/app/page.jsx` that Phase 2 replaces. [VERIFIED: extracted every `<a href="/…">` from all built HTML in-session.] `/locations` is deliberately absent from the Phase 2 Header nav (§7.1) and Footer columns (§7.2), and the Services submenu `<summary>` is not a link, so no `/services` index is needed. Delta 6 goes green the moment the scaffold page dies.

---

## Making the Lock Harness Multi-Page

This is the phase's highest-risk engineering, and the answer is smaller than it looks.

### The build output layout — measured, not assumed

I built 8 routes (root, a nested static route, a flat static route, and a 3-page SSG route) against Next 16.3.0 / React 19.2.8 / Node 22.23.1. The prerendered artifacts land as:

```
web/.next/server/app/
  index.html                          →  /
  zz-scratch-b.html                   →  /zz-scratch-b
  zz-scratch-a/nested.html            →  /zz-scratch-a/nested
  zz-scratch-svc/alpha.html           →  /zz-scratch-svc/alpha      (generateStaticParams)
  _not-found.html                     →  (framework)
  _global-error.html                  →  (framework)
```

The mapping is `route === '/' ? 'index.html' : route.slice(1) + '.html'`. A nested route emits **both** a directory (holding its manifest and chunks) and a sibling `.html` — so a plain `readdirSync` recursion filtered on `.endsWith('.html')` is safe and finds nothing extra. [VERIFIED: probe build]

### Use `prerender-manifest.json`, not a directory walk

`web/.next/prerender-manifest.json` is the authoritative, already-expanded route list. Its `routes` keys were, on the probe build:

```
[ '/', '/_global-error', '/_not-found',
  '/zz-scratch-svc/alpha', '/zz-scratch-svc/bravo', '/zz-scratch-svc/charlie', … ]
```

Each entry also carries `compute: 'static'`, `htmlSize`, `srcRoute` and `dataRoute`. [VERIFIED: read in-session]

This is materially better than a directory walk for three reasons, and one of them is a Phase 3 correctness issue:

- It is the **route** list, not the file list, so you never have to reverse-engineer `index.html → /` or worry about a future filename scheme change.
- `htmlSize` gives the budget script a worst-page selector without reading 336 files.
- `routes-manifest.json`'s `staticRoutes` array is the obvious-looking alternative and it is **wrong**: on the probe it listed only `/`, `/_global-error`, `/_not-found`, and the two literal static routes — the three `generateStaticParams`-expanded pages were absent. Using it would silently under-assert Phase 3's entire 336-page engine. [VERIFIED: both manifests read side by side]

Delta 6 ("every internal href resolves to a prerendered route") is then a set-membership check against `Object.keys(prerenderManifest.routes)` — no route table to hand-maintain, and free at Phase 3 scale.

### Correction to UI-SPEC §9.5: `_global-error.html` is not what the spec says

Measured on this repo's current build:

| Property | UI-SPEC §9.5 claims | **Actually measured** |
|---|---|---|
| Renders `RootLayout` | yes | **no** — own `<html id="__next_error__">`, Next's built-in error document |
| `<h1>` | none — "the single documented exclusion from the one-`<h1>` lock" | **exactly 1** ("This page couldn't load", inline-styled) |
| `<footer>` | 1 | **0** |
| `tel:` links | present | **0** |
| `<meta name="robots">` | (not discussed) | **0** |
| `<link rel="stylesheet">` | (not discussed) | **0** |
| `bhc-*` classes | (not discussed) | **0** |
| `lang` attribute | (implied `en-GB` via layout) | **absent** |
| JSON-LD blocks | (implied ≥1) | **0** |

[VERIFIED: per-page survey over all built HTML, reproduced twice in-session]

**What this changes for the planner:**

- Delta 4 (one `<h1>` per page) needs **no exclusion at all**. `_global-error.html` already passes it.
- Delta 5 (one `<header>`, one `<main id="main">`, one `<footer>`) **must** exclude `_global-error.html`, and §12 delta 4's phrase *"and from nothing else"* is exactly backwards.
- Delta 2(a) ("exactly one `tel:` between `<footer>` and `</footer>`") must exclude it.
- The existing, currently-green **D-15 robots-meta lock (`assert.ok(metas.length)`) will fail on it the instant delta 1 lands.** This is the trap: delta 1 and this exclusion must ship in the same commit.
- Any future `lang="en-GB"` assertion must exclude it.

Recommended shape: a single exported constant, e.g. `const FRAMEWORK_ONLY = new Set(['/_global-error'])`, with a comment recording *why* (it does not render `RootLayout`), and every landmark/NAP/robots assertion skipping it. `_not-found` is **not** in that set — it does render `RootLayout` (footer=1, robots=2, `lang="en-GB"`, 1 JSON-LD block) [VERIFIED], and from Phase 2 it also gets a real `<h1>` from `app/not-found.jsx`.

### Four green locks that go red on the first Phase 2 build, and are not in §12

The UI-SPEC's §12 correctly identifies deltas 1, 2 and 3. It misses these. Each was derived by reading the current assertion against the Phase 2 template contracts in §9.

| Current lock (`check-html-locks.mjs`) | Assertion | Why it fails in Phase 2 |
|---|---|---|
| **SC-4b** (line 262) | `bhc-breadcrumbs__list` **and** `"@type":"BreadcrumbList"` present | §9.2: *"No `Breadcrumbs` on `/`."* Design-system.md Lock 2 is explicitly *"every **non-home** page"*. The lock as written asserts the home page violates the contract. **Must become route-conditional.** |
| **SC-4d** (line 272) | `bhc-interlink__list` present | §9.3: the service-page InterlinkBlock *"renders `null` until"* Phase 3 populates it, and `InterlinkBlock.jsx:37` is `if (!links.length) return null` [VERIFIED in source]. The marker is absent on **every** Phase 2 page. **Must be scoped to Phase 3's templates or suspended with a written reason.** |
| **SC-4f** (line 280) | exactly **3** `application/ld+json` blocks | Phase 2 emits: `NAPFooter` (1, from the layout) + `Breadcrumbs` (1, non-home only). `Hero` renders `RatingBadge … bare` and `RatingBadge`'s `emitSchema` defaults to **`false`** [VERIFIED at `RatingBadge.jsx:37`, `Hero.jsx:51`], so no page emits an `AggregateRating` unless a template opts in. Home = **1**, every other page = **2**. Never 3. |
| **D-15 robots meta** (line 408) | `assert.ok(metas.length)` then every meta says noindex | Passes today because only `index.html` is read. Fails on `_global-error.html` (0 metas) as soon as delta 1 globs. |

There is also a **decision the planner must make that SC-4f exposes**: does `RatingBadge` opt into `emitSchema` on any Phase 2 template? `design-system.md`'s schema table says `AggregateRating` belongs on *"Home and about — entity graph only"*; Phase 4 SC-1 wants the badge *visible* on every template (which `bare` mode already achieves without schema); Phase 5 SC-1 owns the entity graph and CR-05 is open (the rating currently attaches to an orphaned node). **Recommendation: ship Phase 2 with `emitSchema` off everywhere** — the visual badge satisfies Lock 3, and emitting 17 orphaned `AggregateRating` nodes would make CR-05 seventeen times worse for Phase 5 to unwind. Record it as a decision so SC-4f's replacement can assert a flat "1 on home, 2 elsewhere".

### The proven SC-4g hole

`page_client-reference-manifest.js` is emitted **once per route entry**, not once per build:

```
web/.next/server/app/page_client-reference-manifest.js                    ← the ONLY one read today
web/.next/server/app/_not-found/page_client-reference-manifest.js
web/.next/server/app/zz-scratch-a/nested/page_client-reference-manifest.js
web/.next/server/app/zz-scratch-b/page_client-reference-manifest.js
web/.next/server/app/zz-scratch-svc/[slug]/page_client-reference-manifest.js
```

I added a `'use client'` component used **only** on `/zz-scratch-b`, rebuilt, and enumerated first-party client modules per manifest:

```
page_client-reference-manifest.js                 total=8  firstParty=0   ← the lock read THIS. Passed.
zz-scratch-b/page_client-reference-manifest.js    total=9  firstParty=1   [project]/web/app/zz-scratch-b/Probe.jsx
```

[VERIFIED: probe build + `vm.runInContext` enumeration, in-session]

Only the companion source-scan (`SC-4g: no file under web/app declares a client directive`) caught it — and that scan's walk root is `join(ROOT, 'app')` where `ROOT` is `web/`, so **`design-system/src/` is never scanned by either half**. A `'use client'` added to a package component that is not on the home page would pass both. Given Phase 2 authors sixteen new package components, this is the gap that matters most.

**Fix for delta 11 (three parts, all cheap):**
1. Glob every `**/page_client-reference-manifest.js` under `.next/server/app` and assert `firstParty === []` for each. Note the path can contain literal `[` `]` for dynamic segments — a `readdirSync` recursion handles that; a shell glob may not.
2. Extend the source scan's walk to `design-system/src` as well as `web/app`.
3. Keep the marker string assembled rather than literal (`'use ' + 'client'`) — this file has already been bitten twice by a scanner matching its own source, per its own comments.

### Recommended harness shape

Zero dependencies, and O(pages) file reads total rather than O(pages × assertions):

```js
// web/scripts/check-html-locks.mjs — structural sketch, not final code
const manifest = JSON.parse(read(join(ROOT, '.next/prerender-manifest.json')));
const FRAMEWORK_ONLY = new Set(['/_global-error']);   // does NOT render RootLayout — see §9.5 correction

// Read every page exactly once, at module load.
const PAGES = Object.keys(manifest.routes)
  .sort()
  .map((route) => ({
    route,
    file: route === '/' ? 'index.html' : `${route.slice(1)}.html`,
    html: read(join(ROOT, '.next/server/app', route === '/' ? 'index.html' : `${route.slice(1)}.html`)),
  }));

const APP_PAGES = PAGES.filter((p) => !FRAMEWORK_ONLY.has(p.route));

assert.ok(APP_PAGES.length >= 18, `expected >= 18 prerendered app pages, found ${APP_PAGES.length}`);

// Each lock is ONE test that loops, so a failure names the route.
test('Lock 1: exactly one <h1> on every prerendered page', () => {
  for (const p of PAGES) {                      // note: PAGES, not APP_PAGES — _global-error passes
    const n = (p.html.match(/<h1/g) || []).length;
    assert.equal(n, 1, `${p.route}: expected 1 <h1>, found ${n}`);
  }
});
```

**Why one looping test per lock rather than one suite per page:** with 18 routes × ~14 assertions, per-page suites give 250 test cases and a `MIN_TESTS` floor that has to be recomputed every time a route is added — actively hostile to Phase 3's 336 pages. One looping test per lock keeps the count stable at the number of *invariants*, which is the thing `MIN_TESTS` is actually meant to protect. Runtime is a non-issue: the current 21-test suite runs in 60 ms, and 18 pages is ~200 KB of I/O.

**The per-route expectation table must be a function, not a literal.** Delta 3 replaces `const TOWN = 'Warwick'` with per-route expectations. Write it as `expectationsFor(route)` returning `{ h1, title, hasBreadcrumbs, ldJsonBlocks }`, backed for Phase 2 by a hand-written 17-entry literal. Phase 3 then swaps the *implementation* to derive expectations from the same `web/content/` modules the generator uses — no call-site changes, no 336-row literal. Be honest in the comment about what that trades away: a derived table stops checking *"is the copy right"* and only checks *"did the generator drop the field"*. For Phase 2's 17 hand-authored pages the literal is the stronger form and should stay literal.

### Two encoding traps in the expectation table

- **`&` renders as `&amp;`.** Twelve of the seventeen `<h1>`s contain *"Warwickshire & the West Midlands"*. In built HTML that is `Warwickshire &amp; the West Midlands`. [VERIFIED: probe built an `<h1>` with `&` and the artifact contains `&amp;`.] Either store the expectation in encoded form, or decode the extracted text before comparing. Do not discover this at execution time on twelve pages at once.
- **The postcode matcher's `COMPACT` form is deliberately case-sensitive** to avoid matching lowercase build hashes, and both copies (`locks.test.js` and `check-html-locks.mjs`) carry a *"change both or neither"* comment. Phase 2 adds ~1,000 words of prose to each of 17 pages, which is the first time the `STREET_LINE` heuristic meets real copy at volume. Low risk (it requires a leading number, capitalised name words, **and** a thoroughfare noun) but non-zero — a Prose sentence like *"84 Sycamore Road"* used as an illustrative example would trip it. Worth a note in the plan rather than a change.

### Where each of the 14 deltas belongs

The `locks` CI job runs with **zero `node_modules`** and skips `npm ci` entirely — that is what lets it return a verdict when the app build is broken. Anything that needs the build output cannot live there.

| Deltas | Home | Why |
|---|---|---|
| 9 (component four-file shape, `@dsCard` ↔ `category:` agreement, `componentSrcMap` + `docsMap` registration), 13 (`toDial`/`formatPhone` throw), 14 (`<svg>` a11y attributes in package source) | `design-system/test/locks.test.js` | Pure filesystem + pure-JS scans of the package. No build, no deps. Delta 9 needs to read `.design-sync/config.json` and parse `category:` frontmatter with a regex — both trivially zero-dep. |
| 1, 2, 3, 4, 5, 6, 7, 8, 11, 12 | `web/scripts/check-html-locks.mjs` | All require built HTML or the client-reference manifests. |
| 10 (`MIN_TESTS`) | `design-system/test/run-locks.mjs` | Set it to the **exact** post-phase count, not a round number. The comparison is `passed < MIN_TESTS`, so it is a floor and adding tests later without bumping it is safe. Current value 14; delta 13 alone adds ~5. |

One extension worth folding into delta 9: the existing `every preview declares a @dsCard group on line 1` test asserts `previews.length >= 6`. Raise it to the real component count so a component whose `.html` silently disappears is caught.

---

## Route / Content Architecture

### Recommended structure

```
web/
├── jsconfig.json              # NEW — { "paths": { "@/*": ["./*"] } }.  VERIFIED working.
├── content/                   # NEW — site copy as plain .js data modules
│   ├── services.js            #   6 records: slug, h1, eyebrow, title, description, prose, faqs
│   ├── utility.js             #   10 records, same shape minus service-specific fields
│   ├── nav.js                 #   Header nav tree + Footer columns + legal row  (§7.1, §7.2)
│   ├── faqs.js                #   shared FAQ sets
│   └── process.js             #   the 3 ProcessSteps  (§5)
├── app/
│   ├── layout.jsx             # SkipLink · Header · <main id="main" tabIndex={-1}> · Footer · StickyCallBar
│   ├── page.jsx               # Home
│   ├── not-found.jsx          # NEW — real template, real <h1>  (§9.4, closes WR-07)
│   ├── services/[service]/page.jsx     # 6 routes via generateStaticParams
│   └── <ten utility dirs>/page.jsx     # one file each — they are 10 different pages
└── scripts/{check-html-locks.mjs, check-budget.mjs}
```

**Verified end to end in this session:** a `jsconfig.json` `@/*` alias, a `web/content/*.js` data module, `app/zzsvc/[service]/page.jsx` with `generateStaticParams` + `dynamicParams = false` + async `generateMetadata` reading `await params`. Build succeeded; `zzsvc/deep-cleaning.html` carried the correct `<title>`, the correct `<meta name="description">` and the correct `<h1>`; `prerender-manifest.json` listed both expanded routes.

### Why the six service pages should be one dynamic route, not six directories

1. **It is Phase 3's engine at 6× instead of 336×.** `/location/[region]/[town]/[service]` is the same pattern with three segments. Getting `generateStaticParams` + `await params` + `generateMetadata` + `dynamicParams = false` right on six pages, under CI, is the cheapest possible rehearsal.
2. **It forces the copy into a data module now.** UI-SPEC §13-C explicitly defers the D14 canonical-slug rename to Phase 3 on the grounds that *"the template is data-driven, so Phase 3's rename is a data change, not a template change."* Six hand-written directories make that sentence false.
3. **The build artifact is identical.** `services/deep-cleaning.html` either way [VERIFIED]. Nothing downstream — locks, budget, sitemap, Vercel — can tell the difference.
4. **`dynamicParams = false` makes an unlisted slug a 404 rather than an on-demand render**, which keeps the site fully static and keeps `prerender-manifest.json` complete. [CITED: nextjs.org `generateStaticParams` / `dynamicParams`]

The ten utility pages should stay as ten `page.jsx` files. They share no shape (`/get-a-quote` gets ProcessSteps, the three legal pages get `Prose width="narrow"` and no CTABand, `/customer-login` is an outbound hand-off), so a dynamic route would just be a `switch` with extra indirection.

### Why `web/content/` and not `web/app/_content/` or the package

- **Not the design-system package.** The package is framework-agnostic UI. Site copy in it breaks that and would put ~17 pages of prose inside the artifact `/design-sync` round-trips to Claude Design.
- **Not inside `app/`.** Underscore-prefixed private folders do work — Next explicitly skips `_`-prefixed directories in routing [CITED: nextjs.org project-structure, "Private folders"] — but relative imports from `app/location/[region]/[town]/[service]/page.jsx` in Phase 3 become `../../../../_content/…`. A sibling `web/content/` plus the `@/*` alias is stable at any depth.
- One caveat to record: `design-system/test/locks.test.js`'s Lock 5 source scan walks `design-system/src` only, so a postcode in `web/content/` is never seen by it (this is WR-14's shape, one directory over). That is acceptable — `check-html-locks.mjs`'s `SC-2d` scans the **built HTML**, which is downstream of everything, and is the assertion that actually matters. Worth a comment so nobody assumes the package-level scan covers app data.

### Metadata for 17 distinct title/description pairs

Static routes export `export const metadata = { title, description }`; the service route uses `generateMetadata` reading `await params`. Both verified. Two notes:

- **`export const metadata` is fine — do not reach for `generateMetadata` on the static routes.** It is the simpler primitive and needs no async.
- **Lock 8 (title ≤60 chars containing the town, description ≤155) is Phase 5's**, but §5 has already written and measured all seven service/home titles and the description template. Store those strings in `web/content/` so Phase 5's lock has a single place to assert against, and so a `<title>` and its data source cannot drift. The UI-SPEC's own warning applies: Lock 8's *"contains the town"* clause must be scoped to town-bearing templates or it fails on thirteen correct pages.

---

## Zero-Client-Component Feasibility — Verified, Not Reasoned

I built every mechanism the UI-SPEC's §8 depends on and read the artifacts. **All of it works. Nothing in §7 or §8 is technically infeasible.**

### HTML: what RSC actually emits

| Authored | Emitted in `.html` on disk | Verdict |
|---|---|---|
| `<details open>` | `<details class="…" open="">` | ✅ |
| `<summary>` with `aria-controls` + `aria-label` | preserved verbatim | ✅ |
| `<h3>` inside `<summary>` | `<summary class="bhc-faq__summary"><h3 class="bhc-faq__q">…` — no React DOM-nesting warning, no build error | ✅ |
| `<details>` with **only** a `<summary>` child (the nav state carrier) | rendered as authored | ✅ (content model is `summary` followed by flow content; zero flow content is valid) |
| `<svg role="img" aria-label="…" viewBox="0 0 800 600">` | preserved, `viewBox` camelCase intact | ✅ |
| `tabIndex={0}` / `tabIndex={-1}` | `tabindex="0"` / `tabindex="-1"` | ✅ |
| Closed `<details>` answer text | **present in the served HTML** — nothing hidden from a crawler or a model | ✅ SC-4's AI-readability half holds unconditionally |

[VERIFIED: probe build, artifact grepped in-session]

### CSS: what survives Turbopack + lightningcss

Every rule below was authored, built, and read back out of `.next/static/chunks/*.css`:

| Feature | Emitted | Note |
|---|---|---|
| `.zz-nav__disclosure[open] ~ .zz-nav__list { display: block }` | `.zz-nav__disclosure[open]~.zz-nav__list{display:block}` | ✅ **The Header mechanism works.** |
| `@media (min-width: 1024px)` / `(max-width: 767px)` | preserved | ✅ |
| `summary::-webkit-details-marker { display: none }` | preserved | ✅ |
| `scroll-snap-type: x mandatory`, `scroll-snap-align`, `scroll-padding-inline`, `overscroll-behavior-x` | preserved | ✅ ReviewRail + BeforeAfterSlider track |
| `height: calc(64px + env(safe-area-inset-bottom))`, `inset-inline: 0` | preserved | ✅ StickyCallBar |
| `counter-reset` / `counter-increment` / `content: counter(x)` | preserved | ✅ ProcessSteps numbering |
| `.zz-section--navy :focus-visible { outline-color: var(--bhc-paper) }` and `.zz-btn--primary:focus-visible { … }` | preserved, specificity intact | ✅ §10's two scoped overrides |
| `::before` / `::after` | **rewritten to `:before` / `:after`** | ⚠️ Harmless, but do not write a lock that greps built CSS for `::before`. |
| `@supports (color: color-mix(…))` wrapper | **flattened and the value constant-folded** (`color-mix(in srgb, red 50%, blue)` → `purple`) | ⚠️ `@supports` is not a reliable runtime feature gate after minification. Don't rely on it. |

[VERIFIED: `web/app/zz-scratch-a/scratch.css` probe, output read from the built chunk]

### Accessibility caveats the planner should carry into the plans

Three genuine ones. None blocks the contract; all three should appear in a `.prompt.md` so they are not rediscovered.

1. **`<h3>` inside `<summary>` may not be exposed as a heading.** The HTML content model explicitly permits heading content inside `summary`, but `summary` maps to a button-like role and ARIA treats a button's descendants as presentational, so exposure is inconsistent across browser/AT pairs — NVDA in particular announces "heading" and only announces "button" at the element's edges. The UI-SPEC already states this caveat correctly (§7.9); the research confirms it. **Do not design anything that depends on screen-reader heading navigation through the FAQ**, and the accessible name is the `<summary>`'s text content, not the `<h3>`.
2. **`tabindex="0"` on the ReviewRail is correct — and it is correct *because* `ReviewCard` has no focusable children.** Chrome's keyboard-focusable-scrollers behaviour only applies when the scroller contains no keyboard-focusable descendants; Firefox makes scrollers focusable by default. Since §7.13's `ReviewCard` is `<article>` + stars + `<blockquote>` + attribution with **no links**, the explicit `tabindex="0"` + `role="group"` + `aria-label` is both necessary and the standard pattern (it is exactly what axe's `scrollable-region-focusable` rule wants). ⚠️ **But `BeforeAfterSlider`'s State B contains a `See What's Included` link (§7.16).** If that link sits *inside* the scroll-snap track, `tabindex="0"` on the track produces a redundant tab stop before a focusable child. Put the link outside the track, or omit `tabindex` on that particular container.
3. **A `<details>` that controls a sibling it does not contain is slightly unusual.** `<summary>` supplies `aria-expanded` natively and it correctly reflects the `<details>`'s own state, so the announcement is right; `aria-controls` names the list and is inert where unsupported. This is sound, but it should be written down in `Header.prompt.md` — someone will later "tidy" the empty `<details>` by moving the `<ul>` inside it and silently break desktop nav, which is exactly the failure §7.1 rejected.

### `::details-content` — the UI-SPEC's rejection stands

`::details-content` reached **Baseline "Newly available" in September 2025** (Chrome 131 / Edge 131 Nov 2024, Safari 18.4 Mar 2025, Firefox 143 Sep 2025). Baseline *Widely available* requires 30 months of universal support, which this feature will not reach until roughly March 2028. The UI-SPEC's *"too new to depend on"* (§7.1, §8 rule 4) is therefore correct as written, and the sibling-combinator mechanism it chose instead needs no revisiting. Do not let a future reviewer "simplify" the nav to `::details-content`.

---

## Performance Budget at Route Scale

### Measured across 8 routes on one build

| Route | script tags | JS gzip | HTML gzip | HTML raw |
|---|---|---|---|---|
| `index.html` | 6 | **168.5 KB** | 4.2 KB | 22.8 KB |
| `_not-found.html` | 6 | **168.5 KB** | 2.7 KB | 10.2 KB |
| `zz-scratch-a/nested.html` | 6 | **168.5 KB** | 3.2 KB | 11.7 KB |
| `zz-scratch-svc/{alpha,bravo,charlie}.html` | 6 | **168.5 KB** | 2.5 KB | 9.0 KB |
| `_global-error.html` | 6 | **168.5 KB** | 2.5 KB | 8.6 KB |
| `zz-scratch-b.html` *(with a `'use client'` component)* | 7 | **168.7 KB** | 2.5 KB | 8.9 KB |

Union of all unique script chunks across all pages: **7 chunks, 168.7 KB gzip.** Built CSS: **1 file, 2.9 KB gzip.** Self-hosted fonts: **8 woff2, 150.7 KB** (already compressed; not re-compressible). [VERIFIED: measured in-session]

### What this means

- **17 routes cost the same JS as 1.** Every route ships the identical framework baseline. Per-route JS is exactly zero while SC-4g is green. The 500 KB JS budget is not the constraint this phase thinks it is — **SC-4g is the real budget lock**, and note how little help the budget number is: a whole client component moved the figure by **0.2 KB**. Do not treat a green budget as evidence of a green client boundary.
- **CSS grows once, shared everywhere.** Sixteen components' worth of rules appended to `styles.css` might take it from 2.9 KB to ~10–15 KB gzip. Against 500 KB that is noise. It is served on every route from one hashed file.
- **HTML is the only per-page variable.** A fully-composed Home page with all ten sections plus ~1,000 words of Prose plausibly reaches 50–70 KB raw / ~10–14 KB gzip. Still an order of magnitude under any threshold.

### Recommendation for `check-budget.mjs`

**Make it worst-page, not aggregate, and not single-page.** Aggregate is meaningless — a visitor loads one page. Single-page is what it does today and it silently stops representing the site the moment route 2 exists.

```
for each route in prerenderManifest.routes:
    jsGz   = sum(gzip(chunk)) over that page's <script src>
    htmlGz = gzip(that page's HTML)
report the MAX over routes; fail if max jsGz > 500 KB or max pageGz > 1024 KB
also print the route name that produced each max
```

`htmlSize` from `prerender-manifest.json` can pre-select candidates at Phase 3 scale so you gzip 10 files, not 336.

**Also close WR-05 while you are in the file — Phase 2 is when it starts to matter.** The current `page` figure is `jsGz + rawHtmlBytes`, which overstates HTML by ~5× *and* omits the CSS and the 150.7 KB of fonts entirely. Two errors pointing in opposite directions makes the number useless as the trend signal its own header says is its primary value. Either compute `jsGz + gzip(html) + cssGz + fontBytes`, or rename the metric to `HTML+JS` and state plainly that CSS/fonts/images are Phase 5's. Do not leave the label saying "gzip JS + HTML" while adding raw HTML.

**Keep `unresolved`-refuses-to-report behaviour** (`check-budget.mjs:106`) — it is the right instinct and it must survive the rewrite.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Enumerating the site's routes for locks, budget, or link checking | A directory walk, a hand-maintained route array, or `routes-manifest.json` `staticRoutes` | `Object.keys(prerenderManifest.routes)` | Authoritative, already-expanded, includes `generateStaticParams` output. `staticRoutes` **omits SSG-expanded pages** — verified. |
| A DOM parser to assert against built HTML | `jsdom`, `cheerio`, `linkedom` | Regex over the string, exactly as today | The whole harness is zero-dependency on purpose (D-12, `check-html-locks.mjs` header). 21 assertions already prove regex is sufficient. Adding a parser makes the enforcement layer depend on the supply chain it exists to survive. |
| A test framework for the new locks | Jest, Vitest, node-tap | `node --test` via `run-locks.mjs` | D-12. The `locks` CI job runs with **no `npm ci` at all**; a framework kills that property. |
| UK phone formatting / the canonical number | A constant in `web/app`, or a per-component default | `design-system/src/phone.js` (§7.0), and **delete `NAPFooter.jsx:34`'s literal in the same change** | Three consumers now. Three defaults = three places it can be wrong, which is worse than the single literal it replaces. The `grep -r '447861936533' design-system/src` → exactly 1 hit test is the acceptance check. |
| A mobile-nav toggle, an accordion, a carousel, a before/after slider | Any JS, any client component, any library | `<details>`/`<summary>` + the sibling combinator + `scroll-snap` | All four verified working with zero JS. Any one of them as a client component turns SC-4g red, which §8's entire argument and D-07 both forbid. |
| A "read more" for long review quotes | `-webkit-line-clamp` + a JS reveal | A **320-char cap at the data layer** (§7.13, §13-Q) | No client JS means no reveal path; a CSS clamp hides text from sighted users that screen readers still receive, and the loss widens at 200% zoom (WCAG 1.4.4). Phase 4's review pull must honour the cap. |
| Prefetching / client routing | `next/link` in the package, or an app-side wrapper | Plain `<a href>` + the `as?: ElementType` escape hatch | D-02/D-05 (zero dependencies, framework-agnostic). Keeps the JS budget flat as pages go 1 → 18 → ~410, and resets the nav's `<details>` state for free on navigation. |
| Great-circle distance, nearest-town selection, interlink construction | Anything | `geo.js`'s `distanceMiles` / `nearestTowns` / `buildInterlinks` | Already written, already lock-tested, already pure. Phase 3 consumes it; Phase 2 must not duplicate it. |
| JSON-LD serialisation in any new component | `JSON.stringify` into `dangerouslySetInnerHTML` | `safeJsonLd` from `src/jsonLd.js` | A lock already fails any `src/**` file that calls `JSON.stringify` directly (`locks.test.js:316`). Phase 2 adds sixteen components; this is when someone reaches for it. |

**Key insight:** every hand-rolling temptation in this phase is a temptation to add a *second* source of truth — a second phone constant, a second token layer, a second route list, a second client boundary. Phase 1's whole value was making those single-sourced; Phase 2 multiplies the surface by 16 components and 17 routes, which is exactly the point at which a second source stops being noticed.

---

## Common Pitfalls

### Pitfall 1 — Landing delta 1 without the four unlisted lock corrections

**What goes wrong:** the first wave globs every prerendered page, and CI goes red on `_global-error.html`'s missing robots meta, on the Home page's absent breadcrumbs, on every page's absent InterlinkBlock, and on a JSON-LD block count that is never 3. `main` is a strict required-check branch with no bypass actors, so nothing merges.
**Why it happens:** §12 lists 14 deltas and none of these four is among them, so a planner working from §12 alone will not see them coming.
**How to avoid:** treat "rewrite `check-html-locks.mjs`" as one atomic unit of work covering deltas 1–8 + 11 + 12 **and** the four corrections, landed in a single commit against a single build. Do not split it across waves.
**Warning signs:** a plan with a task named "add multi-page globbing" separate from a task named "update the NAP locks".

### Pitfall 2 — Trusting UI-SPEC §9.5's description of `_global-error.html`

**What goes wrong:** the planner writes an exclusion list that exempts `_global-error.html` from the `<h1>` lock (which it does not need) and exempts it from nothing else (which is where it actually breaks four assertions).
**Why it happens:** the claim is confidently written inside an approved document.
**How to avoid:** use the measured table in *Making the lock harness multi-page* above. The one-line summary: it is Next's own error document, it renders none of the app's layout, and it should be excluded from every landmark, NAP, robots, JSON-LD and `lang` assertion — but not from the `<h1>` one.
**Warning signs:** any comment in the harness asserting `_global-error.html` "renders RootLayout".

### Pitfall 3 — Assuming SC-4g still protects the client boundary

**What goes wrong:** a component ships with `'use client'` on a service page, the phase's central claim ("zero first-party client modules") quietly becomes false, and the budget moves by 0.2 KB so nothing else notices.
**Why it happens:** the manifest lock reads one of six manifests, and the source scan covers `web/app` but not `design-system/src` — the very directory this phase adds sixteen files to.
**How to avoid:** the three-part fix under *The proven SC-4g hole*. Land it early, not late — it is the lock every other §8 claim rests on.
**Warning signs:** a green build with a `use client` string anywhere under `design-system/src`.

### Pitfall 4 — `formatPhone` still degrades silently, and now three components consume it

**What goes wrong:** an empty or malformed `phone` renders `<a href="tel:+44">` wrapping empty link text — an empty interactive element (WCAG 2.4.4) — on 17 pages ×4 links (Header, StickyCallBar, NAPFooter, and QuoteFormEntry on the pages that render it — see plan 02-02's `<tel_link_budget>`).
**Why it happens:** `formatPhone.js` has **no `throw` on any branch**; `formatPhone('')` and `formatPhone(undefined)` both return `"+44"`. CR-04 closed the *divergence* hole (display is now derived from the dial string, lock-tested at `locks.test.js:47`); it did not close the *degradation* hole. UI-SPEC §10 already flags this correctly and it is delta 13.
**How to avoid:** make `toDial` throw on an invalid national length; `formatPhone` inherits it; add lock tests for `''`, `undefined`, `'+44'`, `'call us'`, and the one-over/one-under cases; raise `MIN_TESTS`. Failing at build time across ~410 prerendered pages is strictly better than shipping a dead `tel:`.
**Warning signs:** none at runtime — this is silent until a data file feeds it in Phase 3.

### Pitfall 5 — The `claude-seo` hook blocks `.jsx` writes containing `REPLACE`

**What goes wrong:** a `.jsx` write is rejected with exit 2, mid-task, with no obvious cause.
**Why it happens:** the PostToolUse hook blocks on the case-insensitive substring `REPLACE`, which `.replace(` contains. Sixteen new components is a lot of writes.
**How to avoid:** keep every string-manipulation helper in a plain `.js` sibling — already the package's own convention (`formatPhone.js`, `geo.js`, `jsonLd.js`, and now `phone.js`). Also watch ordinary copy: a Prose sentence containing *"replacement"* or *"we'll replace"* in a `.jsx` will trip it. Prefer putting page copy in `web/content/*.js`, which the hook does not watch — a second, independent reason for the data-module architecture.
**Warning signs:** an unexplained exit-2 on a `.jsx` write.

### Pitfall 6 — Breadcrumbs' `aria-current` bug at 17× instead of 1×

**What goes wrong:** a service page carries **two** `aria-current="page"` elements, or a crumb links to `/services` which 404s and fails delta 6.
**Why it happens:** `Breadcrumbs.jsx:43` applies `aria-current="page"` when `isLast || !item.href` [VERIFIED in source] — so any intermediate href-less crumb also claims to be the current page. §9.3 and §13-R resolve this by shipping two crumbs (`Home › {Service}`) plus a component rule: a non-last crumb without an `href` renders as a plain `<span>` and never receives `aria-current`.
**How to avoid:** fix `Breadcrumbs` (WR-12 also wants `display: contents` off the `<li>`, a stable `key`, and `new URL(href, siteUrl)` normalisation) and add delta 12 as the permanent catch. Phase 3 generates ~336 trails with intermediate crumbs and inherits whatever is decided here.
**Warning signs:** delta 12 passing on Phase 2 because every trail is two crumbs long — it is a Phase 3 guard, and it should be written to stay meaningful there.

### Pitfall 7 — A second built CSS file

**What goes wrong:** `SC-1b` (`--bhc-ink` declared exactly once across all built CSS) starts behaving unexpectedly, pages ship two `<link rel="stylesheet">`, and the budget's CSS figure — if WR-05 gets fixed — becomes per-route.
**Why it happens:** a single route-level `import './something.css'` produces a second hashed CSS chunk. I reproduced this: adding one route-scoped stylesheet took the build from 1 CSS file to 2, and that route's HTML from 1 stylesheet link to 2. [VERIFIED]
**How to avoid:** **every** Phase 2 rule goes into `design-system/styles.css`, appended in the existing commented-section style, imported once in `app/layout.jsx`. §7 already mandates this; the pitfall is a well-meant "just this one page's layout" import. Consider a cheap lock: exactly one `.css` under `.next/static` and exactly one stylesheet link per app page.
**Warning signs:** more than one `.css` in `.next/static/chunks/`.

### Pitfall 8 — `RatingBadge` on a dark band, and the two focus overrides

**What goes wrong:** the rating badge is illegible in the CTABand or the footer; or the focus ring vanishes on navy.
**Why it happens:** `.bhc-rating__value` / `.bhc-rating__count` set `--bhc-ink` / `--bhc-ink-muted` **directly** rather than inheriting `currentColor` [documented in `NOTES.md` and `conventions.md`, confirmed in source], so `RatingBadge` is light-surface only. Separately, `--bhc-focus-ring` is `--bhc-action-hover`, which measures **1.15:1 on navy**.
**How to avoid:** no Phase 2 template places `RatingBadge` on navy or ink (§4 — verify this when authoring `CTABand` and `Footer`), and §10's two scoped `:focus-visible` overrides are mandatory, verified to survive the build with specificity intact. Phase 2 introduces the first dark band on **every** page, so this is not an edge case.
**Warning signs:** a `RatingBadge` inside a `SectionBand tone="navy"`.

### Pitfall 9 — `useSearchParams`-style forced dynamic rendering

**What goes wrong:** a route silently stops being statically prerendered, disappears from `prerender-manifest.json`, and the harness stops asserting it — reporting green.
**Why it happens:** any dynamic API (`cookies()`, `headers()`, `searchParams`) opts a route into dynamic rendering.
**How to avoid:** Phase 2 uses none of these, and shouldn't. **Assert it:** `assert.ok(APP_PAGES.length >= 18)` in the harness is exactly this guard, and it is why §12 delta 1's "assert the page count ≥ 18" clause is load-bearing rather than decorative. Also assert every `prerenderManifest.routes[r].compute === 'static'`.
**Warning signs:** the build output showing `ƒ (Dynamic)` next to a route.

---

## Code Examples

### Enumerating routes and pages, zero dependencies

```js
// Source: verified against a real `next build` output in this worktree, Next 16.3.0
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const manifest = JSON.parse(readFileSync(join(ROOT, '.next/prerender-manifest.json'), 'utf8'));

// `_global-error` renders Next's OWN error document, not RootLayout: no <footer>,
// no tel:, no robots meta, no stylesheet, no lang attribute — and exactly one <h1>.
// It is excluded from every landmark/NAP/robots assertion and from NONE of the <h1> one.
const FRAMEWORK_ONLY = new Set(['/_global-error']);

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

const PAGES = Object.keys(manifest.routes).sort().map((route) => ({
  route,
  html: readFileSync(join(ROOT, '.next/server/app', fileFor(route)), 'utf8'),
  static: manifest.routes[route].compute === 'static',
}));

const APP_PAGES = PAGES.filter((p) => !FRAMEWORK_ONLY.has(p.route));
```

### Delta 6 — every internal link resolves

```js
// Scope the extraction to <a> so /_next/ stylesheet and script hrefs never enter the set.
// Verified: today's build yields exactly / , /get-a-quote and three /location/... hrefs,
// with zero /_next/ noise, under this form.
const ROUTES = new Set(Object.keys(manifest.routes));
const PUBLIC_FILES = new Set(['/robots.txt']);        // web/public/ contents

test('Lock 6: every internal <a href> resolves to a prerendered route', () => {
  for (const p of APP_PAGES) {
    for (const m of p.html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)/g)) {
      const href = m[1].length > 1 ? m[1].replace(/\/$/, '') : m[1];
      if (href.startsWith('/_next/') || PUBLIC_FILES.has(href)) continue;
      assert.ok(ROUTES.has(href), `${p.route} links to ${href}, which is not a prerendered route`);
    }
  }
});
```

### Delta 11 — the client-boundary lock, closed

```js
import { createContext, runInContext } from 'node:vm';

// Emitted PER ROUTE. Reading only .next/server/app/page_client-reference-manifest.js
// misses a client component on any non-root route — proven by probe in 02-RESEARCH.
const manifests = walk(join(ROOT, '.next/server/app'))
  .filter((f) => f.endsWith('page_client-reference-manifest.js'));

test('SC-4g: no route ships a first-party client module', () => {
  assert.ok(manifests.length >= 18, `expected a manifest per route, found ${manifests.length}`);
  for (const file of manifests) {
    const ctx = createContext({});
    runInContext(readFileSync(file, 'utf8'), ctx);
    const rsc = runInContext('globalThis.__RSC_MANIFEST', ctx);
    assert.ok(rsc, `no __RSC_MANIFEST in ${file} — its shape changed`);
    const ids = Object.values(rsc).flatMap((m) => Object.keys(m.clientModules || {}));
    assert.ok(ids.length, `${file} declares no client modules at all — its shape changed`);
    const firstParty = ids.filter((id) => !id.includes('/node_modules/next/'));
    assert.deepEqual(firstParty, [], `first-party client module(s) in ${file}: ${firstParty.join(', ')}`);
  }
});
```

### The service route — verified working end to end

```jsx
// web/app/services/[service]/page.jsx
// Verified in-session: builds, prerenders one .html per slug, correct <title>/<meta>/<h1>,
// and both routes appear in prerender-manifest.json.
import { SERVICES, bySlug } from '@/content/services.js';

export const dynamicParams = false;                       // an unlisted slug 404s; the site stays fully static

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;                       // Next 16: params is async — sync access was removed
  const s = bySlug(service);
  return { title: s.title, description: s.description };
}

export default async function Page({ params }) {
  const { service } = await params;
  const s = bySlug(service);
  return ( /* Breadcrumbs → Hero → Prose → BeforeAfterSlider → ProcessSteps → ReviewRail → InterlinkBlock → FAQAccordion → CTABand */ );
}
```

### The nav mechanism — exactly as authored, exactly as emitted

```html
<!-- authored -->
<nav aria-label="Primary" class="bhc-nav">
  <details class="bhc-nav__disclosure">
    <summary class="bhc-nav__toggle" aria-controls="primary-nav" aria-label="Menu">…</summary>
  </details>
  <ul class="bhc-nav__list" id="primary-nav">…</ul>
</nav>
```

```css
/* built output, read back from .next/static/chunks/*.css — unchanged by lightningcss */
.bhc-nav__list{display:none}
.bhc-nav__disclosure[open]~.bhc-nav__list{display:block}
@media (min-width:1024px){.bhc-nav__disclosure{display:none}.bhc-nav__list{display:flex}}
```

---

## State of the Art

| Old approach | Current approach | When changed | Impact on Phase 2 |
|---|---|---|---|
| Synchronous `params` | **`await params`** — sync access fully removed | Next.js 16 | The service route and every Phase 3 route must `await`. Verified working. |
| `next build` printing `Size` / `First Load JS` | **Removed** (inaccurate for RSC) | Next.js 16 | There is still no free budget signal. `check-budget.mjs` remains the only measurement. |
| Webpack default | **Turbopack default for `dev` and `build`** | Next.js 16 | CSS goes through lightningcss. Verified: nothing the UI-SPEC needs is dropped; `::before` → `:before` and `@supports` constant-folding are the only rewrites. |
| `next lint` | **Removed** — call the ESLint CLI directly, flat config | Next.js 16 | Still no static analysis in CI (WR-18, open). Sixteen new components is a reasonable moment to reconsider, but it is not a Phase 2 criterion. |
| `middleware.ts` | Renamed to `proxy.ts`; edge runtime unsupported | Next.js 16 | Not needed. Phase 3's four service-slug 301s should use `next.config` `redirects()`, which surfaces in `routes-manifest.json`. |
| FAQ rich results | **Retired by Google 2026-05-07** | 2026-05 | D13. `FAQPage` must never appear; delta 7 asserts zero occurrences. |
| `::details-content` unavailable | **Baseline Newly available (Sep 2025)** | 2025-09 | Not Widely available until ~2028. The UI-SPEC's rejection is correct and should not be revisited. |
| Chrome scrollers not tab-focusable | Focusable by default **only when they contain no focusable children** | Chrome, ongoing | `tabindex="0"` on the ReviewRail is still required and correct. It is *wrong* on a container that holds a link. |

**Deprecated / do not use:** `next-transpile-modules`, `--turbopack`/`--turbo` flags, `next lint`, `next/legacy/image`, `images.domains`, `FAQPage` schema, `-webkit-line-clamp` for the review quotes.

---

## Package Legitimacy Audit

**Phase 2 installs zero packages.** This is a hard constraint, not an outcome:

- `design-system/package.json` declares no `dependencies` and no `devDependencies`, and must continue to (D-06, §Specifics, UI-SPEC §6).
- `web/package.json` declares exactly `next`, `react`, `react-dom`, `@bhc/design-system` — all four already audited `[OK]` in `01-RESEARCH.md` (slopcheck `--ecosystem npm`, `npm view scripts.postinstall` clean).
- UI-SPEC §1 and §6 close the registry surface explicitly: no shadcn, no Radix, no headless library, no Tailwind, no CSS-in-JS, no icon library, no third-party snippet or block.
- `check-html-locks.mjs`'s own header forbids third-party imports in the enforcement layer, and the `locks` CI job runs with no `npm ci` at all.

| Package | Registry | Disposition |
|---|---|---|
| *(none)* | — | **No installation task belongs in any Phase 2 plan.** |

`slopcheck` is installed and available in this environment (verified) but has nothing to audit. **If any plan proposes an `npm install`, that alone is a signal it has misread the phase.** The only sanctioned package-level edit remains the `exports` map, and Phase 1 already made the one change it needed.

---

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|---|---|---|---|---|
| Node.js | build, both lock suites, budget | ✓ | 22.23.1 (Next 16 needs ≥20.9) | — |
| npm | workspaces, `npm ci` in CI | ✓ | 10.9.8 | — |
| `next` | build | ✓ | 16.3.0 (workspace) | — |
| `react` / `react-dom` | render | ✓ | 19.2.8 | — |
| `gh` CLI | verifying the `main` ruleset and CI run status | ✓ | 2.87.3 | GitHub web UI |
| `slopcheck` | package audit | ✓ | present | not needed — zero packages |
| Vercel project | live-URL verification | ✓ | `bhc-website-nine.vercel.app`, Root Directory `web`, Node 22 | verification is possible entirely against on-disk build output |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none.

Note two operational facts carried from Phase 1 that constrain how Phase 2 lands: `main` is protected by ruleset `20595020` (`locks` + `build` required, `strict_required_status_checks_policy: true`, `bypass_actors: []`) — nothing merges through a red lock; and Vercel Deployment Protection is on, so only the production alias is publicly reachable.

---

## Validation Architecture

`.planning/config.json` does not exist, so `workflow.nyquist_validation` is absent → treated as enabled.

### Test Framework

| Property | Value |
|---|---|
| Framework | `node:test` (built in, Node 22.23.1) — **no third-party test framework, by decision D-12** |
| Config file | none — `design-system/test/run-locks.mjs` is the runner and the fail-closed gate |
| Quick run (design-system only, zero install) | `npm run test:locks` |
| Built-HTML locks (needs a build) | `npm run check:html` |
| Budget | `npm run check:budget` |
| Full suite | `npm run verify` → `test:locks && build && check:html && check:budget` |

Current baseline, re-run at the end of this session: **14 design-system locks pass**, **21 built-HTML locks pass**, budget 168.5 KB JS / 191.3 KB page. Green.

### Phase Requirements → Test Map

| SC | Behaviour | Test type | Automated command | Exists? |
|---|---|---|---|---|
| SC-1 | All 16 components exist with the four-file shape, `@dsCard` on line 1, agreeing `category:`, and registration in both `.design-sync` maps | unit (fs scan) | `npm run test:locks` | ❌ **Wave 0 / delta 9** |
| SC-2 | 17 app routes + `not-found` prerender; exactly one `<h1>` each | integration (built HTML) | `npm run check:html` | ⚠️ exists but single-page — **deltas 1, 3, 4** |
| SC-2 | Landmarks: one `<header>`, one `<main id="main">`, one `<footer>` per app page | integration | `npm run check:html` | ❌ **delta 5** |
| SC-2 | Every internal `<a href="/…">` resolves to a prerendered route | integration | `npm run check:html` | ❌ **delta 6** |
| SC-3 | `data-bhc-photo-state="pending"` renders on pages using BeforeAfterSlider without pairs | integration | `npm run check:html` | ❌ **delta 8** |
| SC-4 | `FAQPage` appears zero times in any built HTML | integration | `npm run check:html` | ❌ **delta 7** |
| NAP (D-08/D-11) | Exactly one `tel:` inside `<footer>`; ≤3 per page; all hrefs digit-identical; any `tel:` **text content** with ≥7 digits equals its own href | integration | `npm run check:html` | ⚠️ **must be re-scoped — delta 2, or CI goes red on build 1** |
| D-07/§8 | **Every** route's client-reference manifest declares zero first-party client modules; no `use client` under `web/app` **or** `design-system/src` | integration | `npm run check:html` | ⚠️ **proven hole — delta 11** |
| §9.3/§10 | At most one `aria-current="page"` per page | integration | `npm run check:html` | ❌ **delta 12** |
| §10 | `toDial`/`formatPhone` throw on malformed input | unit | `npm run test:locks` | ❌ **delta 13** |
| §1/§7.16 | No `<svg>` in package source carries `alt`; every `<svg>` has `aria-hidden="true"` or `role="img"` + non-empty `aria-label` | unit (source scan) | `npm run test:locks` | ❌ **delta 14** — note all existing SVGs already comply, so it passes on landing [VERIFIED] |
| D-14 | Worst-page transfer weight under budget | script | `npm run check:budget` | ⚠️ single-page — rewrite to worst-page |
| SC-1/SC-2/SC-4 | Composed pages look right at 375 px and desktop | **manual** | — | Human. ROADMAP marks the phase `UI hint: yes`; no grep settles visual correctness. |

### Sampling Rate

- **Per task commit:** `npm run test:locks` (zero install, ~60 ms).
- **Per wave merge:** `npm run verify` (full chain, including a real build).
- **Phase gate:** `npm run verify` green **and** CI run green on the branch before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `web/scripts/check-html-locks.mjs` — rewrite around `prerender-manifest.json`; deltas 1–8, 11, 12 **plus** the four unlisted corrections (SC-4b, SC-4d, SC-4f, D-15 robots on `_global-error`). One atomic change.
- [ ] `web/scripts/check-budget.mjs` — worst-page measurement; optionally close WR-05.
- [ ] `design-system/test/locks.test.js` — deltas 9, 13, 14; raise the `previews.length >= 6` floor.
- [ ] `design-system/test/run-locks.mjs` — `MIN_TESTS` raised to the exact post-phase count.
- [ ] `web/content/*.js` — the data modules the templates and the expectation table both read.
- [ ] `web/jsconfig.json` — `@/*` alias (verified working).

No framework install is needed. Nothing here adds a dependency.

---

## Security Domain

`security_enforcement` is not set to `false` anywhere, so it is treated as enabled. Phase 2 is a static marketing build with no forms, no mutations, no auth and no user input — the surface is genuinely small, and the UI-SPEC has already removed the two things that would have grown it (`QuoteFormEntry` has no `<form>`, §7.11/§13-G; no client boundary anywhere, §8).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard control |
|---|---|---|
| V2 Authentication | **no** | No accounts. `/customer-login` is a labelled outbound hand-off to the existing booking portal (§9.4); explicitly **no login form**. |
| V3 Session Management | **no** | No sessions, no cookies, no `cookies()`/`headers()` calls. |
| V4 Access Control | **no** | Every route is public static HTML. |
| V5 Input Validation | **partially** — build-time only | No runtime input exists. The build-time equivalents that do apply: `dynamicParams = false` so an unlisted slug 404s rather than rendering; `safeJsonLd` for every JSON-LD value; scheme validation on any URL that reaches an `href` (WR-10, `mapsUrl`); `toDial` throwing on malformed phone input (delta 13). |
| V6 Cryptography | **no** | Nothing cryptographic. Never hand-roll if that changes. |
| V7 Error Handling / Logging | **minimal** | No `app/global-error.jsx` (§9.5) — the framework default is kept deliberately. `app/not-found.jsx` must leak nothing. |
| V14 Configuration | **yes** | D-15 crawl block must survive (`robots: { index: false }` in the layout + `Disallow: /`); D-14b's no-external-script lock must stay green across all 17 routes, not just one. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard mitigation | Status |
|---|---|---|---|
| `</script>` breakout from a JSON-LD value | Tampering / XSS | `safeJsonLd` (`<` → `<`), enforced by a source-scanning lock that fails any `src/**` file calling `JSON.stringify` | ✅ shipped; the lock must keep covering the 16 new components |
| `javascript:` URL in an `href` from data | Tampering / XSS | `/^https?:\/\//i` scheme check before rendering | ⚠️ **WR-10 open.** `Footer` passes `mapsUrl` through (§7.2 already says "only when it is an absolute `https://` URL"). React 19 warns but does not block. Close it while touching `NAPFooter`. |
| Dead / hijackable outbound link | Tampering | `rel="noopener noreferrer"` **with** `target="_blank"`; `rel="noopener"` alone is inert | ⚠️ WR-10's second half. Relevant to `/customer-login` and `/gift-cards`, both of which ship an outbound action. |
| Residential address or postcode reaching rendered HTML | Information disclosure | `SC-2d` postcode + street-line matchers over built HTML | ✅ green; now runs over 17 pages of new prose instead of one scaffold |
| Unsigned third-party script (GTM/GA/Trustmary) | Tampering / weight | `D-14b` external-script detector, attribute-order independent | ✅ green; must run per page under delta 1 |
| Premature indexing of the pre-cutover deployment | Information disclosure | D-15 (`noindex` meta + `Disallow: /` + Vercel Deployment Protection) | ✅ green. WR-01 remains open and correct: the two layers are not independent — a `Disallow`ed URL is never fetched, so the `noindex` is never read. Matters at cutover sequencing, not now. |
| Empty interactive element (`<a href="tel:+44"></a>`) | — (WCAG 2.4.4) | `toDial` throwing at build time | ❌ **delta 13**, and the blast radius is now 4 links × 17 pages |

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | Prose copy across 17 pages will not trip the `STREET_LINE` heuristic | Making the lock harness multi-page | A red lock on correct copy. Cheap to detect (the failure message prints the matched line) and cheap to fix. Low risk — a match needs a number, capitalised name words **and** a thoroughfare noun. |
| A2 | 16 components' CSS takes `styles.css` from 2.9 KB to ~10–15 KB gzip | Performance budget | Under-estimate by 3× is still noise against 500 KB. No decision depends on it. |
| A3 | A fully-composed Home page reaches ~50–70 KB raw HTML | Performance budget | Even a 3× miss stays far under the 1 MB page budget. |
| A4 | `jsconfig.json` `@/*` remains the right alias mechanism | Route/content architecture | Verified working this session on 16.3.0; risk is only that a future minor changes it, which the build would surface immediately. |
| A5 | `emitSchema` should stay `false` on every Phase 2 template | The four unlisted lock breakages | If Phase 4/5 wants `AggregateRating` earlier, SC-4f's replacement count changes. This is a **recommendation the planner should confirm**, not a settled fact — `design-system.md` says "Home and about", Phase 4 SC-1 says every template, and CR-05 is open. |
| A6 | 16 new components do not warrant adding `types` / `src/index.d.ts` to the package now | Don't hand-roll | `NOTES.md` risk 7 says a barrel would make `componentSrcMap` unnecessary. Deferring means 32 map entries to maintain — mitigated by delta 9, which makes an unregistered component a hard failure. If the planner disagrees, note it touches the `exports` map mid-phase. |
| A7 | `.design-sync/previews/*.tsx` are optional for the 16 new components | Don't hand-roll | UI-SPEC §7 requires four files + CSS + export + two map entries, and does not list a preview. Skipping them means Claude Design gets auto-generated previews rather than authored ones. Cosmetic, reversible. |

---

## Open Questions (RESOLVED)

All five were settled during Phase 2 planning on 2026-08-09. Each answer is recorded below with the
plan that encodes it, so nothing here is still open to an executor.

1. **Does any Phase 2 template opt `RatingBadge` into `emitSchema`?**
   **RESOLVED: no, nowhere.** The recommendation was taken. Emitting 17 orphaned `AggregateRating`
   nodes would make the deferred CR-05 seventeen times worse for Phase 5 to unwind, and the visible
   badge already satisfies Lock 3 in `bare` mode.
   *Encoded in:* plan 02-02 task 2 — SC-4f's replacement is driven by `PAGE_EXPECTATIONS.ldJsonBlocks`
   and asserts 1 block on `/`, 2 on every other app route, counted with the TAG-form regex. Plans
   02-08, 02-09, 02-11 and 02-12 each carry a `grep -rc "emitSchema" web/app` returns 0 criterion.

2. **Does `SC-4d` (InterlinkBlock present) get scoped or suspended?**
   **RESOLVED: gated, with a self-restoring inverse.** Neither deleted nor left dormant. A named
   constant `INTERLINK_LOCK_ACTIVE = false` flips the assertion to its inverse — that NO page renders
   `class="…bhc-interlink__list"`. The first page that renders one fails the suite and forces the
   constant to be flipped, so the lock restores itself rather than relying on someone remembering.
   *Encoded in:* plan 02-02 task 2; plan 02-13 task 3 asserts the constant is still `false` at the
   close of the phase. Phase 3 flips it.

3. **Do `/customer-login` and `/gift-cards` have real outbound destinations?**
   **RESOLVED: ship the default, make the href a data value.** Both are real pages with a real `<h1>`,
   short `Prose`, and one outbound action whose href lives in `web/content/utility.js` so Sam swaps a
   string. Both are scheme-guarded (`/^https?:\/\//i`) and rendered with
   `target="_blank" rel="noopener noreferrer"` per WR-10.
   *Encoded in:* plan 02-08 tasks 1, 2 and 3.

4. **The satisfaction-guarantee wording** (UI-SPEC §14-1).
   **RESOLVED: ships with the working default**, deliberately stating no time window and no re-clean
   commitment. It is declared once in `web/content/process.js` and mirrored in the Customer Service
   Agreement, with a comment in each naming the other so they change together when Sam answers.
   *Encoded in:* plan 02-06 task 2 and plan 02-09 task 1.

5. **Is WR-05 (the budget's CSS/font omission) closed in this phase or deferred to Phase 5?**
   **RESOLVED: closed now.** The recommendation was taken — the file is being rewritten for
   worst-page measurement anyway. The page figure becomes `jsGz + gzip(html) + cssGz + fontBytes`
   with a label that names all four, and WR-06 (the `noModule` polyfill, 23% of the reported figure)
   is closed in the same change.
   *Encoded in:* plan 02-02 task 3.

---

## Sources

### Primary (HIGH confidence)

- **Direct probe builds in this worktree** — Next.js 16.3.0 / React 19.2.8 / Node 22.23.1 / npm 10.9.8. Three builds: an 8-route multi-page build (nested + flat + SSG routes), the same build with a deliberate `'use client'` component on a non-root route, and a `jsconfig` + data-module + `generateStaticParams` service-route build. All scratch files removed; `npm run verify` green at session end. Source of every "[VERIFIED]" claim about build layout, manifests, per-page invariants, client-reference manifests, CSS output and transfer weight.
- `/vercel/next.js/v16.2.9` via Context7 — `generateStaticParams`, `dynamicParams = false`, project structure / private folders / colocation.
- Repository source read directly: `web/scripts/check-html-locks.mjs` (all 21 assertions), `web/scripts/check-budget.mjs`, `design-system/test/locks.test.js` (all 14), `design-system/test/run-locks.mjs`, `design-system/src/components/{NAPFooter,RatingBadge,Breadcrumbs,Hero,InterlinkBlock}/*`, `design-system/.design-sync/{config.json,NOTES.md,conventions.md}`, `design-system/{tokens.css,styles.css,package.json}`, `web/app/layout.jsx`.
- `docs/research/current-site-sitemap-2026-08-06.xml` — 115 URLs, decomposed in-session.
- `.planning/phases/02-.../02-UI-SPEC.md` (approved), `.planning/phases/01-.../{01-CONTEXT,01-RESEARCH,01-VERIFICATION,01-REVIEW}.md`, `.planning/{ROADMAP,STATE,REQUIREMENTS}.md`, `docs/design/design-system.md`.

### Secondary (MEDIUM confidence)

- [::details-content — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) and [More options for styling `<details>` — Chrome for Developers](https://developer.chrome.com/blog/styling-details) — Baseline Newly available Sept 2025; Chrome 131 / Safari 18.4 / Firefox 143.
- [The details and summary elements — scottohara.me](https://www.scottohara.me/blog/2022/09/12/details-summary.html) and [summary_element — a11ysupport.io](https://a11ysupport.io/tech/html/summary_element) — heading-inside-summary content model and inconsistent AT exposure.
- [Keyboard focusable scrollers — Chrome for Developers](https://developer.chrome.com/blog/keyboard-focusable-scrollers), [Intent to Ship — blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev/c/jzMA5vUqNDs), [scrollable-region-focusable — Accessibility Insights](https://accessibilityinsights.io/info-examples/web/scrollable-region-focusable/) — auto-focusable scrollers apply only when there are no focusable children; `tabindex="0"` + role + label is the standard pattern.

### Tertiary (LOW confidence)

- None. Every claim in this document is either from a probe run in this session, from repository source read directly, or from an official documentation source cited above.

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|---|---|---|
| Build output layout, route manifests, per-page invariants | **HIGH** | Probe-built and read from disk twice, including a nested route and an SSG route. |
| The `_global-error.html` correction | **HIGH** | Measured on this repo's own current build; nine independent properties checked. |
| The SC-4g client-manifest hole | **HIGH** | Reproduced with a deliberate client component; the lock demonstrably passed while the build shipped a first-party client module. |
| The four unlisted lock breakages | **HIGH** | Each derived by reading the current assertion source against the UI-SPEC's own template contracts; `emitSchema=false` and `InterlinkBlock`'s `return null` confirmed in source. |
| CSS feature survival through Turbopack | **HIGH** | Every rule authored, built, and read back out of the emitted chunk. |
| Budget behaviour at route scale | **HIGH** | Measured across 8 routes; unique-chunk union computed. |
| Route/content architecture recommendation | **HIGH** (mechanics) / **MEDIUM** (judgement) | The mechanics were verified end to end. Whether six directories or one dynamic route is *better* is a defensible engineering judgement, argued on Phase 3 non-foreclosure. |
| Accessibility caveats | **MEDIUM** | Sourced from official/authoritative material, not from AT testing in this session. AT behaviour varies by browser/AT pair by definition. |
| Prose-vs-`STREET_LINE` false-positive risk | **LOW** | The copy does not exist yet. Flagged as A1 rather than asserted. |

**Research date:** 2026-08-09
**Valid until:** 2026-09-08 for the ecosystem claims (Next.js 16 is current and moving); the probe-derived findings about *this* build remain valid until `next` is upgraded — re-run the probes if the version changes.
