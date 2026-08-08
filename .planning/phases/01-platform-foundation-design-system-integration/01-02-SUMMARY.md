---
phase: 01-platform-foundation-design-system-integration
plan: 02
subsystem: web
tags: [nextjs, npm-workspaces, rsc, app-router, turbopack, design-tokens, nap, json-ld, robots]

# Dependency graph
requires:
  - "01-01: `@bhc/design-system` exports `./fonts/*` — without it the root layout's font import does not resolve"
provides:
  - "The repo is an npm workspace `[\"web\",\"design-system\"]` with a committed root `package-lock.json`"
  - "`@bhc/web` — a Next.js 16.3.0 App Router app in plain JavaScript, four runtime deps, zero devDependencies"
  - "`web/.next/server/app/index.html` — the on-disk prerendered artifact every Phase 1 assertion reads"
  - "`web/app/layout.jsx` — the app's single CSS import site and single `<NAPFooter />` instance"
  - "`web/public/robots.txt` — the host-level half of the D-15 crawl block"
affects: [01-03-ci-locks, 01-04-vercel-connection, phase-02-components, phase-03-programmatic-pages]

# Tech tracking
tech-stack:
  added:
    - "next@16.3.0"
    - "react@19.2.8"
    - "react-dom@19.2.8"
  patterns:
    - "Exact version pins in `web/package.json` (not carets) — reproducibility is the lockfile's job, but the manifest states intent"
    - "The root layout is the ONLY file in the app that imports CSS, and the ONLY place `<NAPFooter />` is rendered"
    - "CI gates in this project are plain substring greps over source — explanatory comments must not contain the forbidden substring they describe"

key-files:
  created:
    - package.json
    - package-lock.json
    - web/package.json
    - web/next.config.mjs
    - web/app/layout.jsx
    - web/app/page.jsx
    - web/public/robots.txt
  modified: []

key-decisions:
  - "Exact version pins (`16.3.0`, not `^16.3.0`) in web/package.json — npm reported precisely the research-pinned versions, so no deviation was needed and the manifest records the tested set"
  - "Comments in web/app/** are worded to avoid the literal substrings `use client` and `tokens.css`, because both acceptance criteria (and Plan 03's CI gates) are substring greps over the directory, not AST checks"
  - "`web/public/robots.txt` as a static file rather than an `app/robots.js` metadata route — always on disk, assertable without knowing where Next.js writes a prerendered metadata route"

patterns-established:
  - "NAP single-sourcing is structural: the app passes NO `phone` prop, so the canonical number exists in exactly one place (NAPFooter.jsx:34) and href/label are both derived from it"
  - "D-15 defended twice and independently: a `noindex, nofollow` meta tag in every page's server HTML, plus a host-level `Disallow: /`"

requirements-completed: [REQ-nap-consistency]

# Metrics
duration: 6min
completed: 2026-08-08
---

# Phase 01 Plan 02: Next.js App + Design System Integration Summary

**The repo is now a two-package npm workspace whose Next.js 16.3.0 app renders all six design-system components onto one statically prerendered page — 1 `tel:` whose href digits equal its displayed digits, 1 `<footer>`, 1 `<h1>`, 3 server-rendered JSON-LD blocks, zero client boundaries, zero postcodes, and the design tokens present in the built CSS exactly once.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-08-08T21:10:35Z
- **Completed:** 2026-08-08T21:16:04Z
- **Tasks:** 3
- **Files created:** 7 (0 modified — `design-system/` was not touched)

## Accomplishments

- **The untranspiled-package question is answered in production, not in a probe.** `@bhc/design-system`
  ships raw `.jsx` from a build-step-less `"type": "module"` package behind an `exports` map, and
  `next build` compiles it through the workspace symlink with no `dist/`, no Babel step and no
  design-system `node_modules`. Verified from a genuinely clean state (`rm -rf node_modules web/.next
  && npm ci && npm run build`).
- **REQ-nap-consistency is now structural rather than typed-in.** The layout passes no `phone` prop,
  so there is no app-side place the number can diverge; `NAPFooter` derives the `tel:` href and the
  visible label from one value. The built HTML carries exactly one `tel:+447861936533` against a
  displayed `+44 7861 936533`, and none of the three retired numbers appear anywhere.
- **The proof-of-integration bar is met.** Hero, Breadcrumbs, RatingBadge, InterlinkBlock and Button
  render on `/`; NAPFooter renders from the layout. All six come from the package, all six render
  server-side, and the emitted HTML contains no client boundary at all.
- **The tokens provably reach the wire.** `--bhc-ink` is declared exactly once across all built CSS —
  which simultaneously proves the app is built from the design system's token layer (Success
  Criterion 1) and that the token stylesheet was not imported twice alongside `styles.css`.
- **The deployment cannot be indexed before cutover.** Two independent controls, both assertable.

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert the repo to an npm workspace and scaffold the web package** — `4c57c5f` (chore)
2. **Task 2: Root layout and the proof-of-integration page** — `e971943` (feat)
3. **Task 3: Ship the D-15 crawl block and confirm the token pipeline** — `eeaae13` (feat)

## Files Created

| File | Lines | What it is |
|------|-------|------------|
| `package.json` | 9 | Workspace root — `private`, `["web","design-system"]`, two scripts |
| `package-lock.json` | 966 | Committed lockfile — `npm ci` reproducibility + Vercel npm auto-detect |
| `web/package.json` | 18 | `@bhc/web` — 4 dependencies, **zero** devDependencies |
| `web/next.config.mjs` | 25 | `transpilePackages: ['@bhc/design-system']` and nothing else |
| `web/app/layout.jsx` | 68 | The single CSS import site + the single `<NAPFooter />` + D-15 metadata |
| `web/app/page.jsx` | 84 | The proof-of-integration page (5 components; NAPFooter is the 6th, in the layout) |
| `web/public/robots.txt` | 27 | Host-level `Disallow: /` (D-15) |

`design-system/` is byte-identical to its post-Plan-01 state — `git status --porcelain` is empty and
no design-system file appears in any of the three commits.

## Installed Versions

`npm view` was run at execution time as the plan required. **No deviation from the research pin** —
every version came back exactly as 01-RESEARCH.md recorded on 2026-08-08:

| Package | Research pin | `npm view <pkg> version` | Installed |
|---------|--------------|--------------------------|-----------|
| `next` | 16.3.0 | **16.3.0** | 16.3.0 |
| `react` | 19.2.8 | **19.2.8** | 19.2.8 |
| `react-dom` | 19.2.8 | **19.2.8** | 19.2.8 |
| `@bhc/design-system` | workspace | — | `0.1.0` via symlink `-> ../../design-system` |

Node 22.23.1, npm 10.9.8. Pins are exact (`"16.3.0"`, not `"^16.3.0"`).

`npm ls --workspaces --depth=0` exits 0 and reports two extraneous entries — `@emnapi/runtime` and
`@img/sharp-wasm32`. Both are optional wasm fallbacks that `sharp` (a transitive `next` dependency)
declares for platforms lacking a native binary; they are installed but unreferenced on darwin-arm64.
They do not affect the exit code and are not an error.

## Build Output

```
▲ Next.js 16.3.0 (Turbopack)
✓ Running next.config.mjs took 10ms
  Creating an optimized production build ...
✓ Compiled successfully in 1838ms
  Running TypeScript ...
  Finished TypeScript in 1ms ...
  Collecting page data using 4 workers ...
✓ Generating static pages using 4 workers (3/3) in 272ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```

Compile 1.84 s; static generation 272 ms; **both routes `○ (Static)` prerendered**. Note Next.js 16
prints no `Size` / `First Load JS` column — it was removed as inaccurate for RSC architectures,
which is exactly why Plan 03 has to measure the budget explicitly.

## Measured Counts (the numbers the phase's assertions read)

`web/.next/server/app/index.html` — **23,370 bytes** (22.8 KB).

| Assertion | Required | Measured |
|-----------|----------|----------|
| `href="tel:` occurrences | exactly 1 | **1** — `tel:+447861936533` |
| href digits vs `bhc-footer__phone` label digits | equal (leading `44` stripped) | **equal** — `7861936533` both sides, label reads `+44 7861 936533` |
| `<footer` occurrences | exactly 1 | **1** |
| `<h1` occurrences | exactly 1 | **1** (`bhc-hero__heading`) |
| `<script type="application/ld+json"` blocks | exactly 3 | **3** — BreadcrumbList, LocalBusiness/AggregateRating, HomeAndConstructionBusiness |
| Retired numbers `07441918832` / `447441918832` / `447575709361` | none | **none** |
| `name="robots"` | `noindex` present | **`content="noindex, nofollow"`** |
| UK postcode regex `/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/` | no match | **no match** |
| `streetAddress` / `"address":` | absent | **both absent** |
| `use client` in built HTML | absent | **absent** |
| `<script src="http` (external origin) | 0 | **0** |
| Required strings (`bhc-hero__heading`, `bhc-breadcrumbs__list`, `"@type":"BreadcrumbList"`, `bhc-rating__value">4.9`, `bhc-interlink__list`, `bhc-btn--primary`) | all present | **all 6 present** |
| `--bhc-ink:` declarations across all built CSS | exactly 1 | **1** (across 1 CSS file) |

**Transfer weight, measured the way D-14a defines it** (informational — the budget gate itself is
Plan 03's job):

| Asset | Uncompressed | gzip |
|-------|-------------|------|
| JS (6 script tags) | 550.9 KB | **168.5 KB** |
| CSS (1 hashed file, tokens + styles) | 11.8 KB | 2.9 KB |
| HTML | 22.8 KB | 4.2 KB |
| **Page total** | — | **175.5 KB** |

168.5 KB gzip = **34% of the 500 KB JS budget**; 175.5 KB = 17% of the 1 MB page budget. These
reproduce 01-RESEARCH.md's probe figures to the decimal. Read *uncompressed*, the same page is
550.9 KB and would "fail" a budget it comfortably meets — which is precisely the D-14a trap.
8 `.woff2` faces emitted to `.next/static/media/` with content hashes.

## Verification Results

Run from the repo root, from a deliberately clean state:

| Check | Result |
|-------|--------|
| `rm -rf node_modules web/.next && npm ci && npm run build --workspace @bhc/web` | **exit 0** — proves the clean-checkout requirement (D-06/SC-1a); no design-system build step exists or is needed |
| `test -L node_modules/@bhc/design-system` | **symlink** `-> ../../design-system` (D-02) |
| `npm ls --workspaces --depth=0` | exit 0; lists `@bhc/design-system@0.1.0 -> ./design-system` and `@bhc/web@0.1.0 -> ./web` |
| `node --test design-system/test/*.test.js` | `# tests 10`, `# pass 10`, `# fail 0` |
| `test -f web/.next/server/app/index.html` | present, 23,370 bytes |
| Built-HTML assertion script (12 checks above) | **all pass** |
| `grep -rn "use client" web/app` | **no matches** |
| `grep -rn "tokens.css" web/app` | **no matches** |
| `grep -rl -- "--bhc-ink" web/.next/static/` | 1 CSS file; exactly 1 declaration |
| `robots.txt` assertion (comments stripped) | `User-agent: *` ✓, `Disallow: /` ✓, no `Allow: /` ✓ |
| `git status --porcelain` | **empty** — `node_modules/` and `web/.next/` gitignored; `package-lock.json` tracked |
| `git diff design-system/` across all 3 commits | no design-system file touched |

## Decisions Made

- **Exact version pins, not carets.** `npm view` returned precisely the three research-pinned
  versions, so there was nothing to reconcile. The manifest records the tested set; the lockfile
  enforces it.
- **Comments in `web/app/**` avoid the substrings they describe.** Both `grep -rn "use client"
  web/app` and `grep -rn "tokens.css" web/app` are acceptance criteria — and will be Plan 03 CI
  gates. A comment saying *"there is no `use client` here"* fails them. The comments now name the
  rule without quoting the token, and say so explicitly, so a future editor does not reintroduce it.
- **`web/public/robots.txt`, not `web/app/robots.js`.** A static file is served verbatim, always
  exists on disk, and is assertable by a zero-dependency check that does not have to know where
  Next.js writes a prerendered metadata route.
- **Copy is scaffold and says so in the file header.** Warwick / deep cleaning / 175 reviews at 4.9
  is real signal, but the templates are Phase 2 work.
- **`transpilePackages` kept despite being a verified no-op under Turbopack.** It is the documented
  lever and the only thing that saves the build if the workspace linkage is ever downgraded.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Doc comments tripped two of the plan's own substring-grep acceptance criteria**

- **Found during:** Task 2, at the acceptance-criteria run
- **Issue:** `web/app/page.jsx` explained *why* there is no client directive by naming it, and
  `web/app/layout.jsx` explained *why* the token stylesheet is not imported by naming it. Both
  acceptance criteria are literal substring greps over `web/app` — `grep -rn "use client" web/app`
  and `grep -rn "tokens.css" web/app` — so both returned matches and both criteria failed. Neither
  was a code defect: the built HTML was already clean of `use client`, and the token block was
  already emitted exactly once. This is a *documentation-versus-gate* collision, and it matters
  beyond this plan because Plan 03 turns these same greps into permanent CI gates.
- **Fix:** Reworded both comments to state the rule without quoting the forbidden substring, and
  added an explicit line in each saying the gate is a substring grep so the substring must not
  appear in prose either. No behaviour, markup, import or metadata changed; the build output is
  byte-identical apart from the comments, which are stripped anyway.
- **Files modified:** `web/app/page.jsx`, `web/app/layout.jsx`
- **Commit:** `e971943` (fixed before the task was committed)

### Clarifications (no code impact)

**2. `Hero`'s image prop is `image`, not `media`**
- **Found during:** Task 2
- **Detail:** The plan's `<interfaces>` block lists `Hero({ ..., media, ... })`; the source
  (`Hero.jsx:29`) names it `image`. Immaterial here — the proof page passes no image — but Phase 2
  will pass one, so the correct name is recorded here rather than left to be rediscovered.

**3. `npm ls --workspaces` reports two extraneous packages**
- **Found during:** Task 1
- **Detail:** `@emnapi/runtime` and `@img/sharp-wasm32`, both optional wasm fallbacks of `sharp`
  (transitive via `next`). Exit code is still 0 and the acceptance criterion is met. Not an error,
  not fixable without pruning `next`'s own optional deps, and worth knowing before someone reads
  "extraneous" as a broken install.

---

**Total deviations:** 1 auto-fixed (0 bugs, 0 missing-critical, 1 blocking, 0 architectural)
**Impact on plan:** None on scope or output. One finding propagates forward: Plan 03's CI gates are
substring greps, so its own script must not contain the strings it forbids elsewhere.

## Issues Encountered

- **`git` one-liners combining `&&`/`||` with `$( )` are refused by the worktree isolation guard.**
  Compound commands mixing shell substitution with git are rejected as unverifiable; the branch
  assertion and log inspection had to be run as separate plain commands. Worth knowing for Plan 03,
  which will want to script git checks.
- **No `.gitignore` change was needed.** `node_modules/`, `.next/` and `.vercel/` were already
  ignored, and `package-lock.json` was already not ignored — confirmed with `git check-ignore`.

## Known Stubs

**1. Page copy on `/` is scaffold, not final** — `web/app/page.jsx`
- The eyebrow, heading, lead, interlink headings and the three interlink targets are placeholder
  copy for a Warwick deep-cleaning combo page. The linked URLs use the locked
  `/location/<region>/<town>/<service>` shape but **the destinations do not exist yet** — routes
  arrive in Phase 3.
- **Intentional and sanctioned:** 01-CONTEXT.md §Claude's Discretion — *"it is a scaffold, not final
  copy — real templates are Phase 2"*. The plan's `<action>` repeats it verbatim.
- **Resolved by:** Phase 2 (templates) and Phase 3 (the routes these links point at).
- No hardcoded empty data, no `TODO`/`FIXME`, no component rendering from a stubbed data source —
  every value on the page is real and flows through the real component props.

## Threat Flags

None. No new network endpoint, no auth path, no file-access pattern, and no schema change at a trust
boundary beyond what the plan's register already covers.

Threat-register dispositions delivered by this plan:

| Threat ID | Disposition | Evidence |
|-----------|-------------|----------|
| T-01-SC | **mitigated** | 4 runtime deps, all `[OK]` in the legitimacy audit with no `postinstall`; `package-lock.json` committed; `npm ci` reproduces the tree exactly; zero devDependencies in `web/` |
| T-01-05 | **mitigated** | Postcode regex, `streetAddress` and `"address":` all asserted absent from the built HTML including its 3 JSON-LD payloads |
| T-01-06 | **mitigated** | `noindex, nofollow` meta in the served HTML **and** host-level `Disallow: /` |
| T-01-07 | **mitigated** | 0 external-origin `<script src="http`; no analytics, tag manager or third-party script imported |
| T-01-08 | **mitigated** | No `phone` prop passed anywhere; exactly one `tel:`; href digits equal label digits |
| T-01-09 / T-01-10 / T-01-11 | transfer / accept (unchanged) | Static prerender on a CDN; no auth surface; CSP deferred to Phase 5 with a stated reason |

## User Setup Required

None for this plan. The one outstanding Sam-gated item for the phase is unchanged: **no Vercel
project exists for this repo yet** (01-CONTEXT.md Open Question 3). Success Criterion 1 needs Sam to
connect the repo and set **Root Directory = `web`**. Everything else in this plan is verified
locally against the built HTML with no browser and no deployment.

## Next Phase Readiness

- **Plan 03 is unblocked and has its target.** `web/.next/server/app/index.html` exists on disk after
  `npm run build --workspace @bhc/web`, and every string its lock script needs is measured above. The
  `digits()` helper and the `POSTCODE` regex are already in `design-system/test/locks.test.js` — copy
  them, do not re-derive.
- **Two carry-forward warnings for Plan 03's script:** (1) the lock suite is **10** tests, not the 8
  several planning docs still say; (2) the CI gates are substring greps, so
  `check-html-locks.mjs` must not itself contain `use client` or the token-stylesheet subpath in a
  string or comment that the grep would scan — scope the greps to `web/app` only, as the acceptance
  criteria do.
- **Plan 04 (Vercel) has what it needs:** `package-lock.json` at the root makes Vercel auto-detect
  npm; Root Directory must be `web`; the build command stays the default `next build`. Do not point
  the Vercel build at the sibling design-system tests — Root Directory sandboxing forbids `..`
  (01-RESEARCH.md Pitfall 4), which is why GitHub Actions is the gate.
- **Phase 2 note:** `Hero`'s image prop is `image` (not `media`), and `RatingBadge` is light-surface
  only — it sets `--bhc-ink` directly and renders illegibly on `bhc-section--navy`.
- **Phase 3 note:** Next.js 16 made `params`/`searchParams` async-only. The
  `/location/[region]/[town]/[service]` route **must** `await params`. The three interlink URLs on
  `/` are the first live references to that route shape.
- **Known accepted behaviour:** `© {new Date().getFullYear()}` in `NAPFooter` is baked at build time
  on a static page, so a deployment left un-rebuilt across New Year shows the previous year. Accepted
  for Phase 1 (any deploy fixes it); flagged for Phase 5. It is **not** a reason to add a client
  directive.
- No blockers.

## Self-Check: PASSED

All 8 claimed files verified present on disk (`package.json`, `package-lock.json`,
`web/package.json`, `web/next.config.mjs`, `web/app/layout.jsx`, `web/app/page.jsx`,
`web/public/robots.txt`, this SUMMARY).
All 3 claimed task commits verified in `git log` (`4c57c5f`, `e971943`, `eeaae13`).

---
*Phase: 01-platform-foundation-design-system-integration*
*Completed: 2026-08-08*
