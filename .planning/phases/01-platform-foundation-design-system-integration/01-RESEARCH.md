# Phase 1: Platform Foundation & Design System Integration — Research

**Researched:** 2026-08-08
**Domain:** Next.js 16 App Router · consuming an untranspiled local design-system package · Vercel monorepo deploy · zero-dependency CI gating
**Confidence:** HIGH (the six highest-risk questions were verified by an actual scratch build, not reasoned about)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Platform & hosting**

- **D-01** — Next.js on Vercel. Not Webflow, not any other host. (Restates PROJECT.md D5.)
  The design-system package was built assuming this stack.
- **D-02** — The app is a new Next.js application inside this existing repo, consuming
  `design-system/` as a local workspace package (`@bhc/design-system`, already named and
  `private: true`). The design-system package is **not** republished, restructured, or moved.
- **D-03** — Phase 1 deploys to a Vercel-assigned preview/production URL only. The apex domain
  `www.beyondhousecleaning.com` stays pointed at the live Webflow site until a later cutover
  phase. Nothing in Phase 1 may take the live site down.

**Design system integration**

- **D-04** — `design-system/tokens.css` is the single source of truth for colour, type and
  spacing and is imported unmodified. Do not fork it, do not inline its values, do not
  substitute neutral greys for the warm off-whites. (Restates D6, D11, D12.)
- **D-05** — The 6 existing components are consumed as-is from
  `design-system/src/components/`. If a component genuinely cannot render under Next.js
  without a change, the change goes **into the package** (keeping `.jsx`/`.html`/`.d.ts`/
  `.prompt.md` shape intact and lock tests green), never into a divergent copy inside the app.
  This is the anti-drift rule from D9.
- **D-06** — The package ships untranspiled `.jsx` from a plain `"type": "module"` Node
  package with no build step. The Next.js app must be configured to compile it (the standard
  lever is `transpilePackages`); resolving this is a Phase 1 task, not an assumption.
- **D-07** — Components render server-side by default. Anything that would force the
  design-system's server-rendered output into client-only JS is a regression of the whole
  point of the rebuild (CI Locks 3 and 9) and is not acceptable.

**NAP — the phase's one hard requirement (REQ-nap-consistency)**

- **D-08** — Exactly one `tel:` sitewide, and the `href` digits must equal the displayed
  digits. The mechanism is already built: `formatPhone.js` derives the display string *from*
  the dial string, so there is no prop for displayed text and the two cannot diverge. Phase 1
  uses that mechanism; it does not reimplement phone formatting in the app.
  (Restates REQ-nap-consistency + CI Lock 4.)
- **D-09** — The canonical number is `+447861936533` — the `NAPFooter` package default, and
  the number the live site *displays* on all 115 pages. The two wrong numbers being retired
  are `07441918832` (what the live footer actually dials) and `+447575709361` (a third number
  on `/get-a-quote`). Neither may appear anywhere in the new app. See **Open — needs Sam**.
- **D-10** — No street address and no UK postcode in any rendered output, anywhere, ever —
  including inside JSON-LD, since JSON-LD ships in page HTML. The registered office
  (CV32 6EQ) is residential. (Restates D4 / CI Lock 5.)
- **D-11** — Every page uses one shared NAPFooter instance. There is no second footer, no
  page-local phone number, and no hardcoded `tel:` outside the component.

**CI / testing**

- **D-12** — `design-system/test/locks.test.js` runs in this project's build/CI pipeline. It
  currently has 8 passing tests covering Lock 4 (3 tests), Lock 5, Lock 7, the `@dsCard`
  preview convention, and 2 `nearestTowns` geo tests. It runs on bare `node --test` with zero
  dependencies — do not add a test framework to make it run.
- **D-13** — CI must fail the build when a lock test fails. A lock suite that runs but does not
  gate is not a lock. The remaining 8 page-level locks (1, 2, 3, 6, 8, 9, 10, 11) are Phase 5
  work; Phase 1 only has to make the harness exist and gate.

**Performance**

- **D-14** — The performance budget is live from the first commit: <500 KB JS, <1 MB total page
  weight, no third-party script >50 KB without explicit sign-off. The current site ships 1.9 MB
  of JS. Phase 1 must not import Trustmary, GTM, or any analytics/tag manager by default.

**Canonical facts (corrections, not decisions)**

- **The live domain is `https://www.beyondhousecleaning.com`** — `.com`, not `.co.uk`.
- Review signal as of 2026-08-06: **175 reviews at 4.9★**.

### Claude's Discretion

Not specified by any locked decision — the planner and executor choose:
- Next.js version and router specifics, TypeScript vs JavaScript for the app, and the exact
  `next.config` shape.
- Package manager and whether the repo becomes a formal workspace/monorepo or the app consumes
  the design system by relative path.
- Directory name and location of the Next.js app within the repo.
- Which single page serves as the proof-of-integration page, and its content (it is a
  scaffold, not final copy — real templates are Phase 2).
- CI runner (GitHub Actions vs Vercel build step vs both) and how lint/typecheck are wired.
- Font loading strategy, given `design-system/fonts/` exists and D8 leaves the final typeface
  open.

### Deferred Ideas (OUT OF SCOPE)

- **Domain cutover** — pointing `www.beyondhousecleaning.com` at Vercel and retiring Webflow.
  Deliberately not Phase 1; Phase 1 ships to a Vercel URL. No phase currently owns cutover —
  worth adding to the roadmap before Phase 5 completes.
- **The other 8 CI locks** (1, 2, 3, 6, 8, 9, 10, 11) — Phase 5.
- **The ~15 remaining components** — Phase 2.
- **Before/after photography** — blocked on Sam pulling originals from
  canva.com → Projects → Uploads. Not a Phase 1 concern at all; BeforeAfterSlider ships with a
  placeholder in Phase 2 and backfills in Phase 4.
- **Off-site citations, review generation, second GBP** — v2, see REQUIREMENTS.md.

> **⚠️ Contradiction the planner must resolve.** D-02 locks "consuming `design-system/` as a
> local workspace package", but *Claude's Discretion* re-opens "whether the repo becomes a formal
> workspace/monorepo or the app consumes the design system by relative path." **D-02 wins** —
> it is a locked decision and discretion cannot override it. Research below independently confirms
> workspace is also the technically correct choice.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **REQ-nap-consistency** | Site-wide footer displays `+44 7861 936533` but the `tel:` link dials `07441918832`; `/get-a-quote` dials a third number. Acceptance: exactly one `tel:` in the footer, `href` digits equal displayed digits (CI Lock #4); publish a consistent NAP block (name, service-area statement, one phone, hours) — no street address, per D4. | **Fully satisfied by architecture, verified end-to-end.** `NAPFooter` takes a single `phone` prop and derives *both* `href={tel:${toDial(phone)}}` and the visible label `{formatPhone(phone)}` from it — there is no prop for displayed text (`design-system/src/components/NAPFooter/NAPFooter.jsx:45-46, 73-75`). Probe build confirmed the prerendered HTML contains exactly one `href="tel:+447861936533"`, zero UK postcodes, and a `HomeAndConstructionBusiness` JSON-LD with `telephone` and `areaServed` but no `address`. See **Validation Architecture → SC-2** for the three mechanical assertions. |
</phase_requirements>

---

## Summary

This is a wiring phase with one genuinely uncertain technical question — *can Next.js compile a
build-step-less package that ships raw `.jsx` behind an `exports` map?* — and the answer, verified
by an actual scratch build rather than reasoned about, is **yes, with one specific fix required**.

I built a throwaway two-package npm workspace (`web/` + a copy of `design-system/`) against
**Next.js 16.3.0 / React 19.2.8 / Node 22.23.1**, rendered all six components on one App Router
page, and ran `next build`. It compiled in 2.1s and prerendered as static content. All six
components are **RSC-safe exactly as written** — zero hooks, zero event handlers, zero browser
APIs, and the emitted HTML contained no `use client` boundary at all. The prerendered HTML carried
exactly one `href="tel:+447861936533"`, all three JSON-LD blocks server-rendered, a real `<h1>`,
the rating value as text, and zero UK postcodes. `transpilePackages` turned out to be *optional*
under Turbopack (which auto-transpiles workspace packages) but should still be set as documented
insurance.

Two findings materially change the plan. **First:** `import '@bhc/design-system/fonts/fonts.css'`
**fails** — the package's `exports` map has no `./fonts/*` entry, so Node and Turbopack both refuse
it (`ERR_PACKAGE_PATH_NOT_EXPORTED` → `Module not found`). The fix (adding `"./fonts/*"` to
`exports` and `"fonts"` to `files`) is a two-line package change, is permitted by D-05, leaves the
8 lock tests green, and was verified to make all eight `.woff2` files emit correctly. **Second:**
a *blank* Next.js 16 App Router page already ships **550.9 KB of uncompressed JS**. D-14's
"<500 KB JS" budget is therefore only satisfiable if read as **transfer weight** — which is exactly
how the SEO audit measured the 1.9 MB figure it is benchmarked against ("Measured transfer weight,
mobile UA, gzip/br enabled", `docs/research/seo-audit-2026-08-06.md:75`). Measured that way the
probe page is **168.5 KB gzip** — 34% of budget, with headroom. This must be written down before
anyone measures it the other way and declares Phase 1 a failure.

**Primary recommendation:** npm workspaces at the repo root (`["web", "design-system"]`), Next.js
16.3.0 App Router in plain JavaScript, root layout importing only `@bhc/design-system/styles.css`
(which `@import`s tokens.css — importing both duplicates the tokens), `transpilePackages:
['@bhc/design-system']` set explicitly, Vercel Root Directory = `web`, and **GitHub Actions as the
gating CI** running `npm run test -w @bhc/design-system` (verified: exits 0 on pass, 1 on failure)
plus a zero-dependency transfer-weight budget check.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page HTML, `<h1>`, breadcrumb trail, NAP block, rating badge | **Frontend Server (SSR/SSG)** | — | Locks 1/2/3/4 are assertions about *server-rendered HTML*. Anything that renders these client-side fails the lock by definition. Verified: all six components render with no client boundary. |
| JSON-LD emission (`BreadcrumbList`, `HomeAndConstructionBusiness`, `AggregateRating`) | **Frontend Server (SSG)** | — | Lock 9: "All JSON-LD server-rendered; none injected by client JS." Components emit inline `<script type="application/ld+json">` during SSR. |
| Phone number normalisation (`toDial` / `formatPhone`) | **Design-system package (pure JS)** | — | Deliberately isolated in `formatPhone.js` so Lock 4 is testable without a JSX toolchain. Must never be reimplemented in the app (D-08). |
| Design tokens + base/component CSS | **CDN / Static** | Frontend Server | `styles.css` `@import`s `tokens.css`; Turbopack bundles both into one hashed static CSS asset served from the CDN edge. |
| Web fonts (Public Sans, Figtree woff2) | **CDN / Static** | — | Self-hosted, vendored in `design-system/fonts/`, emitted to `.next/static/media/` with content hashes. No webfont CDN at runtime (per `fonts.css` header comment). |
| Lock-test enforcement | **CI (GitHub Actions)** | Vercel build (advisory) | D-13 requires the build to *fail*. A required GitHub status check blocks a merge; a red Vercel preview does not. |
| Bundle/page-weight budget enforcement | **CI (GitHub Actions)** | — | Next.js 16 removed `First Load JS` from build output, so the measurement must be done explicitly post-build. |
| Client interactivity | **None in Phase 1** | — | Zero client components. This is the deliberate state; Phase 2's StickyCallBar/FAQAccordion will introduce the first `"use client"` boundaries. |
| Domain / DNS | **Out of scope (D-03)** | — | Apex stays on Webflow until a later cutover phase. |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | **16.3.0** | App framework, App Router, SSG, Turbopack bundler | D-01/D5 locks Next.js on Vercel. 16.3.0 is `latest` on npm. [VERIFIED: npm registry] [CITED: nextjs.org/docs/app/guides/upgrading/version-16] |
| `react` | **19.2.8** | Rendering | Next.js 16 App Router requires React 19.2. The design-system declares `react: ">=18"` as a peer, which 19.2.8 satisfies. [VERIFIED: npm registry + probe build] |
| `react-dom` | **19.2.8** | DOM renderer | Version-locked to `react`. [VERIFIED: npm registry + probe build] |
| `@bhc/design-system` | `0.1.0` (workspace `*`) | Tokens + 6 components | Already in-repo. Consumed via npm workspace symlink, not published. [VERIFIED: probe build] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| *(none required)* | — | — | **The probe built successfully with exactly four dependencies.** Resist adding more. |
| `eslint` | 9.x | Linting | Only if the planner wants lint in CI. `next lint` was **removed** in Next.js 16 — you must invoke the ESLint CLI directly. [CITED: nextjs.org version-16 upgrade guide, "Removals → `next lint` Command"] |
| `eslint-config-next` | 16.3.0 | Next.js lint rules | Now defaults to ESLint **flat config** format in v16. [CITED: same page, "ESLint Flat Config"] |
| `typescript` + `@types/react` + `@types/react-dom` | 5.x / 19.x | Type checking | **Recommend against for Phase 1.** The design-system ships hand-written `.d.ts` per component but the package has no `types` field in `exports`, so TS would not resolve them without a package change. Plain JavaScript keeps the app aligned with the package's own `.jsx` idiom and removes a whole class of Phase-1 friction. Revisit in Phase 3 when the towns data file makes typing valuable. |
| `size-limit` + `@size-limit/file` | 13.0.3 | Bundle budget gate | Viable, but **see recommendation in Pitfall 6** — a 30-line zero-dependency script does this job better here and matches the package's existing no-toolchain ethos. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| npm workspaces | pnpm workspaces | pnpm 11.20.0 is installed locally and is faster. **But** `@bhc/design-system` declares `react` only as a `peerDependency` with no devDependency, so under pnpm's isolated `node_modules` layout the JSX transform's `react/jsx-runtime` import resolves from `design-system/`, not the app — which only works because `auto-install-peers` defaults true. npm's hoisted layout removes the question entirely. **If pnpm is chosen anyway, add `react`/`react-dom` to the design-system's `devDependencies`.** |
| npm workspaces | Relative-path import (`../../design-system/src/index.js`) | Verified to compile fine under Turbopack. **But** `transpilePackages` accepts package names only — "Paths and glob patterns are not supported" [CITED: nextjs.org transpilePackages] — so there is no escape lever if it ever breaks; and Vercel's "skip unaffected projects" requires packages be declared in a workspace definition [CITED: vercel.com/docs/monorepos]. Also contradicts D-02. |
| Turbopack (default) | `next build --webpack` | Turbopack is the Next.js 16 default for both `dev` and `build`. Webpack also transpiles workspace packages under the App Router, so both work — but Turbopack is the supported path and built the probe in 2.1s. Only opt out if a webpack-only plugin is needed (none is). |
| `next/font/local` | `import '@bhc/design-system/fonts/fonts.css'` | `next/font/local` adds automatic `<link rel=preload>` and a `size-adjust` fallback, but its `src` is a path relative to the calling file, which means reaching *out of* the app directory into the sibling package — fragile. Importing the package's own `fonts.css` (after the `exports` fix) was **verified working** and keeps font ownership inside the design system where `.design-sync` regenerates it. Take the CSS import. |
| App Router | Pages Router | App Router is required for the RSC-by-default posture D-07 demands, and is where all current Next.js docs point. |

**Installation (from repo root, after creating the root `package.json` with `workspaces`):**

```bash
npm install --workspace @bhc/web next@16.3.0 react@19.2.8 react-dom@19.2.8
```

**Version verification performed 2026-08-08:**

```
npm view next version        -> 16.3.0
npm view react version       -> 19.2.8
npm view react-dom version   -> 19.2.8
npm view eslint-config-next  -> 16.3.0
npm view size-limit version  -> 13.0.3
```

---

## Package Legitimacy Audit

`slopcheck` v-current installed and run with `--ecosystem npm` (the auto-detected ecosystem was
wrong — it defaulted to PyPI and reported five false `[SLOP]` verdicts for npm-only packages;
forcing the ecosystem is mandatory here).

| Package | Registry | Age (first publish) | Source Repo | slopcheck | postinstall | Disposition |
|---------|----------|---------------------|-------------|-----------|-------------|-------------|
| `next` | npm | 2011-07-11 | github.com/vercel/next.js | **[OK]** | none | Approved |
| `react` | npm | 2011-10-26 | github.com/react/react | **[OK]** | none | Approved |
| `react-dom` | npm | 2014 | github.com/facebook/react | **[OK]** | none | Approved |
| `typescript` | npm | 2012 | github.com/microsoft/TypeScript | **[OK]** | none | Approved (optional) |
| `@types/react` | npm | DefinitelyTyped | github.com/DefinitelyTyped/DefinitelyTyped | **[OK]** | none | Approved (optional) |
| `@types/react-dom` | npm | DefinitelyTyped | github.com/DefinitelyTyped/DefinitelyTyped | **[OK]** | none | Approved (optional) |
| `eslint` | npm | 2013 | github.com/eslint/eslint | **[OK]** | none | Approved (optional) |
| `eslint-config-next` | npm | 2020 | github.com/vercel/next.js | **[OK]** | none | Approved (optional) |
| `@next/eslint-plugin-next` | npm | 2021 | github.com/vercel/next.js | **[OK]** | none | Approved (optional) |
| `size-limit` | npm | 2017-06-26 | github.com/ai/size-limit | **[OK]** | none | Approved (not recommended — see Pitfall 6) |
| `@size-limit/file` | npm | 2019 | github.com/ai/size-limit | **[OK]** | none | Approved (not recommended) |

**Packages removed due to slopcheck `[SLOP]` verdict:** none
**Packages flagged as suspicious `[SUS]`:** none

All packages were discovered from official Next.js/Vercel documentation or Context7, **and**
independently passed `slopcheck --ecosystem npm` **and** an `npm view <pkg> scripts.postinstall`
check. Tagged `[VERIFIED: npm registry]`.

---

## Architecture Patterns

### System Architecture Diagram

```
                      git push  →  github.com/beyondhousecleaning/bhc-website
                                              │
              ┌───────────────────────────────┴────────────────────────────────┐
              │                                                                │
      ┌───────▼─────────────────────────┐                        ┌─────────────▼──────────────┐
      │   GITHUB ACTIONS  (the GATE)    │                        │   VERCEL BUILD (deploy)    │
      │                                 │                        │   Root Directory = web/    │
      │  1. npm ci  (workspace root)    │                        │                            │
      │  2. npm run test                │                        │   npm install (ws root)    │
      │       -w @bhc/design-system     │                        │            │               │
      │       → node --test, 0 deps     │                        │      next build            │
      │       → exit 1 on any lock fail │                        │      (Turbopack)           │
      │  3. npm run build -w @bhc/web   │                        │            │               │
      │  4. node scripts/check-budget   │                        │            ▼               │
      │       → transfer weight assert  │                        │   ○ Static prerender       │
      │                                 │                        │            │               │
      │  required status check ─────────┼── blocks merge         └────────────┼───────────────┘
      └─────────────────────────────────┘                                     │
                                                                              ▼
                                                            <project>.vercel.app  (D-03: NOT the apex)

  ─────────────────────────  BUILD-TIME MODULE GRAPH  ─────────────────────────

   web/app/layout.jsx                                web/app/page.jsx
        │                                                  │
        ├─ import '@bhc/design-system/fonts/fonts.css'      ├─ import { Hero, Breadcrumbs,
        │        │   (needs exports-map fix — see P1)       │      RatingBadge, InterlinkBlock,
        │        └─→ 8 × .woff2 → .next/static/media/       │      Button, NAPFooter }
        │                                                   │        from '@bhc/design-system'
        └─ import '@bhc/design-system/styles.css'           │
                 │                                          ▼
                 └─ @import './tokens.css'      node_modules/@bhc/design-system  (npm ws symlink)
                        │                                   │
                        ▼                                   └─→ src/index.js
             one hashed .css → CDN                                │  re-exports raw .jsx
                                                                  ▼
                                             Turbopack auto-transpiles workspace pkg
                                             (belt-and-braces: transpilePackages)
                                                                  │
                                                                  ▼
                                          RSC render — NO "use client" anywhere
                                                                  │
                        ┌─────────────────────────────────────────┼───────────────────────┐
                        ▼                        ▼                ▼                       ▼
              <h1> keyword line     one href="tel:+447861936533"   3 × JSON-LD      rating text
                  (Lock 1)                (Lock 4, Lock 5)          (Lock 9)          (Lock 3)
                        └─────────────────────── static HTML ──────────────────────────────┘
```

### Recommended Project Structure

```
bhc-website/
├── package.json                 # NEW — root, private, "workspaces": ["web","design-system"]
├── package-lock.json            # NEW — Vercel auto-detects npm from this
├── .github/workflows/ci.yml     # NEW — the gate (repo has NO CI today)
├── design-system/               # UNCHANGED except a 2-line exports-map addition
│   ├── package.json
│   ├── tokens.css
│   ├── styles.css               # @imports tokens.css
│   ├── fonts/                   # needs an exports entry to be importable
│   ├── src/components/*/        # 6 components, raw .jsx
│   └── test/locks.test.js       # 8 tests, zero deps
├── web/                         # NEW — the Next.js app (Vercel Root Directory)
│   ├── package.json             # name "@bhc/web"
│   ├── next.config.mjs          # transpilePackages: ['@bhc/design-system']
│   ├── jsconfig.json            # optional, for "@/..." aliases
│   ├── scripts/check-budget.mjs # zero-dep transfer-weight assertion
│   ├── public/
│   └── app/
│       ├── layout.jsx           # imports fonts.css + styles.css; renders <NAPFooter/>
│       ├── page.jsx             # THE proof-of-integration page
│       └── not-found.jsx
├── assets/logo/                 # already exists
└── docs/                        # already exists
```

**Why `web/` and not `apps/web/`:** with exactly two packages there is no monorepo tooling to
justify the extra nesting level, and a shallower Vercel Root Directory is easier to reason about.
Directory name is explicitly Claude's Discretion.

### Pattern 1: Root layout owns the global CSS *and* the single footer

**What:** `app/layout.jsx` is the only place that imports CSS and the only place `<NAPFooter />`
is rendered.
**When to use:** always. This is what makes D-11 ("every page uses one shared NAPFooter") a
structural property rather than a convention someone has to remember.

```jsx
// web/app/layout.jsx
// Source: verified by scratch build against Next.js 16.3.0
// Pattern: nextjs.org/docs/app/getting-started/css — "stylesheets published by external
// packages can be imported anywhere in the app directory"
import '@bhc/design-system/fonts/fonts.css';
import '@bhc/design-system/styles.css';   // @imports tokens.css — do NOT import tokens.css too
import { NAPFooter } from '@bhc/design-system';

export const metadata = {
  metadataBase: new URL('https://www.beyondhousecleaning.com'),
  title: 'Beyond House Cleaning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <NAPFooter
          areaServed={['Leamington Spa', 'Warwick', 'Kenilworth', 'Coventry']}
          hours="Mon–Sat, 8am–7pm"
        />
      </body>
    </html>
  );
}
```

Note: **no `phone` prop is passed.** The canonical `+447861936533` lives as the package default
(`NAPFooter.jsx:33`). Passing it from the app would create a second place the number can be wrong.

### Pattern 2: `next.config.mjs` — explicit `transpilePackages`

```js
// web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack already auto-transpiles npm/pnpm/Yarn workspace packages under both routers
  // (verified: the probe built without this line). Set it anyway — it is the documented lever,
  // it is a no-op when auto-detection works, and it is the only thing that saves the build if
  // the workspace linkage is ever replaced with a plain `file:` dependency.
  transpilePackages: ['@bhc/design-system'],
};

export default nextConfig;
```

### Pattern 3: The proof-of-integration page (Success Criterion 4)

All six components on one static route, zero client components:

```jsx
// web/app/page.jsx
import {
  Hero, Breadcrumbs, RatingBadge, InterlinkBlock, Button,
} from '@bhc/design-system';

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Warwick' }]} />
      <Hero
        eyebrow="Reliable & Affordable"          // decoration — renders as <p>
        heading="Deep Cleaning in Warwick"       // ALWAYS the <h1> (Lock 1)
        lead="Scaffold copy — real templates are Phase 2."
        rating={{ rating: 4.9, count: 175 }}
        actions={[{ label: 'Get a quote', href: '/get-a-quote' }]}
      />
      <RatingBadge rating={4.9} count={175} emitSchema />
      <InterlinkBlock
        variant="services"
        heading="Other cleaning services in Warwick"
        links={[{ href: '/location/warwickshire/warwick/domestic-cleaning',
                  label: 'Domestic cleaning in Warwick' }]}
      />
      <Button href="/get-a-quote">Get a quote</Button>
    </>
  );
}
```

`Hero` throws if `heading` is missing (`Hero.jsx:33-35`), so a build-time failure is the
enforcement mechanism for Lock 1 — no runtime check needed.

### Anti-Patterns to Avoid

- **Adding `"use client"` to any design-system component.** All six are RSC-safe as written
  (verified — see Pitfall 2). A `"use client"` directive would move the JSON-LD and the rating
  badge into a hydration payload and silently break Locks 3 and 9, which D-07 names explicitly.
- **Importing both `tokens.css` and `styles.css` in the layout.** `styles.css` line 6 already
  does `@import './tokens.css'`. Importing both emits the entire token block twice.
- **Writing a `tel:` link, a phone number, or a `<footer>` anywhere outside `NAPFooter`.**
  D-11. Assert against it in CI (see Validation Architecture).
- **Copying a component into `web/` to "fix" it for Next.js.** D-05: the change goes into the
  package. The probe proved no component needs changing to render.
- **Adding a test framework to run the lock tests.** D-12. `node --test` needs zero
  `node_modules`; verified it exits 1 on failure.
- **Passing `phone="+447861936533"` from the app.** Creates a second source of truth for the one
  thing this phase exists to make single-sourced.
- **Adding GA4 / GTM / Trustmary / any tag manager.** D-14 and Open Question 2.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UK phone display formatting | A formatter in the app | `formatPhone` / `toDial` from the package | D-08. Deriving display from dial is the *entire* mechanism that makes the live bug unexpressible. A second implementation reintroduces the divergence. |
| Compiling raw `.jsx` from a sibling package | A Babel/esbuild prebuild step, a `dist/` folder, `next-transpile-modules` | npm workspaces + Turbopack (+ `transpilePackages`) | Verified working with zero build step. `next-transpile-modules` was superseded by `transpilePackages` in Next 13. D-06/§Specifics require it to work from a clean checkout with no design-system build. |
| Bundling `tokens.css` | Copying token values into an app stylesheet, or a PostCSS token pipeline | `import '@bhc/design-system/styles.css'` | D-04. Turbopack resolves the internal `@import` and emits one hashed CSS asset. Verified: `--bhc-ink` and `bhc-hero__heading` both present in the output. |
| Self-hosting fonts | A font pipeline, Google Fonts CDN, `next/font/google` | `import '@bhc/design-system/fonts/fonts.css'` (after the exports fix) | Already vendored, subset, variable, `font-display: swap`, with correct `unicode-range`. Verified: 8 `.woff2` emitted to `.next/static/media/` with content hashes. |
| BreadcrumbList / LocalBusiness / AggregateRating JSON-LD | A schema library, `next-seo`, a JSON-LD helper in the app | The components' own inline `<script type="application/ld+json">` | Next.js's own guidance: "A native `<script>` tag is the appropriate choice for JSON-LD because it is structured data, not executable JavaScript code, unlike the `next/script` component." [CITED: nextjs.org/docs/app/guides/json-ld] |
| Great-circle distance / nearest-town selection | Anything | `distanceMiles` / `nearestTowns` / `buildInterlinks` from `geo.js` | Already written, already tested (2 of the 8 lock tests), already pure. Phase 3 consumes it. |
| Test runner for the locks | Jest / Vitest / node-tap | `node --test` (the package's existing `test` script) | D-12 explicitly. Verified: `npm run test -w @bhc/design-system` → exit 0 on pass, exit 1 on failure, no `node_modules` needed. |

**Key insight:** every "hand-rolled" temptation in this phase is a temptation to create a *second*
source of truth for something the design-system package already single-sources. Every one of them
reintroduces exactly the class of bug (display ≠ href, docs ≠ code, design ≠ build) the whole
design-system-as-code decision (D9) exists to eliminate.

---

## Common Pitfalls

### Pitfall 1: The `exports` map blocks `fonts/fonts.css` — build fails hard

**What goes wrong:** `import '@bhc/design-system/fonts/fonts.css'` fails the build.
**Why it happens:** `design-system/package.json` declares an `exports` map with exactly three
entries (`.`, `./tokens.css`, `./styles.css`). An `exports` map is an *allowlist* — every subpath
not listed is unreachable, even though the file is physically present. `files` also omits `fonts`.
**Verified failure modes:**

```
Node:      ERR_PACKAGE_PATH_NOT_EXPORTED
           Package subpath './fonts/fonts.css' is not defined by "exports"

Turbopack: Module not found: Can't resolve '@bhc/design-system/fonts/fonts.css'
           ./web/app/layout.jsx:1:1
```

**How to avoid — verified fix (a package change, permitted by D-05):**

```jsonc
// design-system/package.json
"exports": {
  ".": "./src/index.js",
  "./tokens.css": "./tokens.css",
  "./styles.css": "./styles.css",
  "./fonts/*": "./fonts/*"          // ← add
},
"files": ["src", "tokens.css", "styles.css", "fonts"]   // ← add "fonts"
```

After this change the probe build succeeded and emitted all eight `.woff2` files to
`.next/static/media/` with content hashes, with the `@font-face` block preserved in the bundled
CSS. Re-running `node --test test/*.test.js` afterwards: **8/8 still pass** (the lock tests do not
read `package.json`).
**Warning signs:** any subpath import of the package other than the three listed entries.
**Corollary for later phases:** if TypeScript is ever adopted, `.d.ts` resolution will hit the
same wall — the package has no `types` condition in `exports`.

---

### Pitfall 2: Assuming components need `"use client"` — they do not

**What goes wrong:** someone sees `dangerouslySetInnerHTML` or `new Date()` and adds
`"use client"` defensively. Locks 3 and 9 silently break; the rebuild loses its reason to exist.
**Why it happens:** both look like client-side constructs. Neither is.

**Verified RSC-safety audit of all six components:**

| Component | Hooks | Event handlers | Browser APIs | `dangerouslySetInnerHTML` | **RSC-safe as written?** |
|-----------|-------|----------------|--------------|---------------------------|--------------------------|
| `Button` | none | none | none | no | **YES** |
| `Hero` | none | none | none | no | **YES** |
| `Breadcrumbs` | none | none | none | yes (JSON-LD) | **YES** |
| `RatingBadge` | none | none | none | yes (JSON-LD, opt-in) | **YES** |
| `InterlinkBlock` | none | none | none | no | **YES** |
| `NAPFooter` | none | none | none | yes (JSON-LD) | **YES** |

`grep -rn "useState|useEffect|useRef|onClick|onChange|window\.|document\.|localStorage|'use client'" design-system/src/`
returns **nothing**. The probe build emitted HTML containing no `use client` boundary and no
component-owned client chunk.

**On `dangerouslySetInnerHTML`:** it is a *server* rendering primitive here and is precisely what
the Next.js docs prescribe for JSON-LD. See the CITED snippet under Code Examples.

**On `new Date().getFullYear()` (`NAPFooter.jsx:104`):** legal in an RSC — no hydration mismatch is
possible because there is no client render to mismatch against. There *is* a real but minor
consequence: on a statically prerendered page the year is **baked at build time**, so a site
deployed in December 2026 and not redeployed will show `© 2026` throughout January 2027. Options,
in ascending cost: (a) accept it and note it — any deploy fixes it; (b) add `export const revalidate`
to the layout; (c) add a `year` prop to `NAPFooter` computed by the page. **Recommend (a) for
Phase 1**, and flag it as a Phase 5 item. Do not use it as a reason to add `"use client"`.

**On `fetchPriority` (`Hero.jsx:86`):** camelCase `fetchPriority` is natively supported by
React 19. The probe build with `Hero` mounted produced no casing warning.

---

### Pitfall 3: Reading D-14's "<500 KB JS" as uncompressed — Phase 1 fails on a blank page

**What goes wrong:** the budget check is written against raw file bytes, the build fails at
551 KB, and someone concludes Next.js cannot meet the budget.
**Why it happens:** Next.js 16 **removed `size` and `First Load JS` from `next build` output**
("We found these to be inaccurate in server-driven architectures using React Server Components"
[CITED: nextjs.org version-16 upgrade guide]), so there is no framework-provided number to
anchor on and people reach for `du`.

**Measured on the probe page (all six components, zero client components):**

| Metric | Value |
|--------|-------|
| Page-referenced JS, **uncompressed** | **550.9 KB** ← over budget |
| Page-referenced JS, **gzip** | **168.5 KB** ← 34% of budget |
| Prerendered HTML | 20.5 KB |
| Bundled CSS (tokens + styles) | 12 KB |
| Total transfer (est., gzip) | ~200 KB against a 1 MB page-weight budget |

**How to avoid:** write the budget as **transfer weight**, which is exactly how the number it is
benchmarked against was measured — `docs/research/seo-audit-2026-08-06.md:75`: *"Measured transfer
weight, mobile UA, gzip/br enabled"*, giving 1,901 KB JS on the live site. Gzip is the conservative
proxy (Vercel serves brotli, which will be ~10-15% smaller still).
**Warning signs:** any budget script using `du`, `stat`, or `Buffer.length` without a compression
step. **The planner must state the measurement basis in the plan**, because it is the difference
between "34% of budget" and "10% over budget" on identical output.

---

### Pitfall 4: Vercel Root Directory sandboxing vs. running the sibling package's tests

**What goes wrong:** the Vercel Build Command is set to something like
`node --test ../design-system/test/*.test.js && next build` and either fails to find the files or
works inconsistently.
**Why it happens:** Vercel's Root Directory doc states plainly: *"Your app will not be able to
access files outside of that directory. You also cannot use `..` to move up a level"*
[CITED: vercel.com/docs/builds/configure-a-build#root-directory]. Sibling access in the build
container is governed by the separate *"Include files outside the Root Directory in the Build
Step"* behaviour, which is applied automatically for detected workspaces — but the current Vercel
docs no longer document that toggle explicitly, so its exact default cannot be confirmed from
docs alone. npm's workspace layout also hoists to the **workspace root** `node_modules`, not
`web/node_modules`, so there is no `..`-free path to the test files either.

**How to avoid:** **make GitHub Actions the gate, not Vercel.** This satisfies D-13 better anyway:
a required GitHub status check blocks a merge, whereas a red Vercel preview is only a signal.
Leave the Vercel Build Command at its default `next build`.
**Warning signs:** `Module not found` or `no matches found` referencing `../design-system` only in
the Vercel build log and never locally.

---

### Pitfall 5: The `claude-seo` PostToolUse hook blocks `.replace(` in `.jsx` files

**What goes wrong:** the executor writes a `.jsx` file containing `.replace(` and the write is
rejected with exit 2, mid-task, for no visible reason.
**Why it happens:** the hook fires on `.jsx/.tsx/.html` writes and blocks on the **case-insensitive
substring `REPLACE`** (PROJECT.md Context; STATE.md Blockers). `.replace(` contains it. This is a
guaranteed collision, not a hypothetical — the recommended JSON-LD XSS escape (Pitfall 7) is
literally `.replace(/</g, '\\u003c')`.
**How to avoid:** keep any string-manipulation logic in plain `.js` files, which the hook does not
watch. This is *already the package's own convention* — `formatPhone.js` and `geo.js` exist
precisely so pure logic lives outside `.jsx`. Follow it. If a `.jsx` file genuinely needs it, run
`claude plugin disable claude-seo` for that task.
**Warning signs:** an unexplained exit-2 on a `.jsx` write.

---

### Pitfall 6: Reaching for `size-limit` when a 30-line script is the better answer

**What goes wrong:** `size-limit` + `@size-limit/file` + a config file + a GitHub Action are added
to measure one number, in a repo whose stated ethos (D-12, §Specifics) is *"it needs no
`node_modules` at all — keep it that way."*
**Why it happens:** `size-limit` is the ecosystem-standard answer to "bundle budget in CI" and it
is a genuinely good tool. It is just heavier than this problem.
**Recommendation — take the zero-dependency route in Phase 1:** a ~30-line `check-budget.mjs` that
reads the prerendered HTML, resolves each `<script src>` to its file, gzips it, and asserts the
total. This measures the *actual* transfer weight of the *actual* page (which is what D-14 and Lock
10 are about), needs no dependencies, and matches the audit's method exactly. I ran this script
against the probe — the numbers in Pitfall 3 came from it. See Code Examples.
**Defer to Phase 5:** third-party-script auditing (Lock 10), image/total-page-weight measurement
including media, and Lighthouse CI / Core Web Vitals — those need real pages and real photos, and
Phase 5 already owns "Total JS under 500 KB and page weight under 1 MB on a representative combo
page."

---

### Pitfall 7: `JSON.stringify` into `dangerouslySetInnerHTML` is an XSS sink

**What goes wrong:** a town name or business name containing `</script>` breaks out of the JSON-LD
block. Harmless in Phase 1 (all values are hardcoded or trusted props) — **not** harmless in Phase 3,
when ~56 town names arrive from a data file.
**Why it happens:** Next.js documents this exactly: *"When using `JSON.stringify` for JSON-LD, be
aware it does not sanitize malicious strings, posing an XSS injection risk. To prevent this, scrub
HTML tags from the payload, such as replacing `<` with `<`"*
[CITED: nextjs.org/docs/app/guides/json-ld]. All three emitting components (`NAPFooter.jsx:118`,
`Breadcrumbs.jsx:61`, `RatingBadge.jsx:59`) use bare `JSON.stringify`.
**How to avoid:** add a `design-system/src/jsonLd.js` (plain `.js` — also dodges Pitfall 5) with a
single `safeJsonLd(obj)` helper, and have the three components call it. Two-line change per
component, package-internal (D-05), lock tests unaffected.
**Recommend doing it in Phase 1** — it is cheapest now and Phase 3 is where it becomes exploitable.
**Warning signs:** none at runtime; this fails silently until it doesn't.

---

### Pitfall 8: `pnpm` + a peer-only React

**What goes wrong:** `Module not found: Can't resolve 'react/jsx-runtime'` originating from inside
`design-system/`, only under pnpm.
**Why it happens:** the JSX transform injects a `react/jsx-runtime` import resolved relative to
each `.jsx` file — i.e. from `design-system/`, not `web/`. `@bhc/design-system` declares `react`
only as a `peerDependency` and has no `devDependencies`, so `design-system/node_modules/react`
does not exist unless pnpm's `auto-install-peers` places it there.
**How to avoid:** use **npm workspaces** (hoisted flat `node_modules` at the repo root — verified
working). If pnpm is chosen anyway, add `react`/`react-dom` to the design-system's
`devDependencies` first.

---

## Code Examples

### Root `package.json` (new file at repo root)

```json
{
  "name": "bhc-website",
  "private": true,
  "workspaces": ["web", "design-system"],
  "scripts": {
    "test:locks": "npm run test --workspace @bhc/design-system",
    "build": "npm run build --workspace @bhc/web"
  }
}
```

Verified: `npm run test --workspace @bhc/design-system` → **exit 0** when all 8 pass, **exit 1**
when a test fails (proven by injecting a deliberately failing test). That exit code is what
satisfies D-13.

### JSON-LD in a Server Component — the sanctioned pattern

```jsx
// Source: https://nextjs.org/docs/app/guides/json-ld  (Next.js 16.2.9 docs, via Context7)
// This is what NAPFooter/Breadcrumbs/RatingBadge already do — plus the escape they are missing.
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  }}
/>
```

> Docs note: *"A native `<script>` tag is the appropriate choice for JSON-LD because it is
> structured data, not executable JavaScript code, unlike the `next/script` component which is
> optimized for loading and executing JavaScript."*

Recommended package-internal helper (put it in `.js`, not `.jsx` — Pitfall 5):

```js
// design-system/src/jsonLd.js
/** Serialise JSON-LD safely for inline <script> embedding. */
export const safeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
```

### `web/scripts/check-budget.mjs` — zero-dependency transfer-weight gate

```js
// Verified: this exact logic produced the Pitfall 3 numbers against a real `next build` output.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const JS_BUDGET_KB = 500;    // D-14, transfer weight (see Pitfall 3)
const PAGE_BUDGET_KB = 1024; // D-14

const html = readFileSync('.next/server/app/index.html', 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);

let js = 0;
for (const s of srcs) {
  const f = join('.next', s.replace('/_next/', ''));
  if (!existsSync(f)) continue;
  js += gzipSync(readFileSync(f)).length;
}
const page = js + Buffer.byteLength(html);

const kb = (n) => (n / 1024).toFixed(1);
console.log(`JS (gzip): ${kb(js)} KB / ${JS_BUDGET_KB} KB`);
console.log(`Page (gzip JS + HTML): ${kb(page)} KB / ${PAGE_BUDGET_KB} KB`);

if (js / 1024 > JS_BUDGET_KB || page / 1024 > PAGE_BUDGET_KB) {
  console.error('PERFORMANCE BUDGET EXCEEDED (D-14)');
  process.exit(1);
}
```

### `.github/workflows/ci.yml` — the gate (repo currently has no CI at all)

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  locks:
    # Fast, zero-install: proves D-13 gating even if the app build is broken.
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - name: Design-system lock tests
        run: node --test design-system/test/*.test.js

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run build --workspace @bhc/web
      - name: Performance budget (D-14)
        working-directory: web
        run: node scripts/check-budget.mjs
```

Pin action versions and confirm the `actions/checkout` / `actions/setup-node` majors at execution
time — those are `[ASSUMED]` from training data, not verified this session.
**Both jobs must be added as required status checks on `main`** — a workflow that runs but does not
block a merge is not a gate, which is exactly what D-13 forbids.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact on this phase |
|--------------|------------------|--------------|----------------------|
| `next-transpile-modules` | `transpilePackages` in `next.config` | Next.js 13.0.0 | Do not install the old package. [CITED: nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages, Version History] |
| Webpack default; `--turbopack` opt-in | **Turbopack is the default for both `next dev` and `next build`** | **Next.js 16** | Drop `--turbopack` from scripts. A custom `webpack` config now makes `next build` **fail** unless you pass `--webpack`. [CITED: version-16 upgrade guide] |
| `next lint`; `eslint` key in `next.config` | `next lint` **removed**; call the ESLint CLI directly; `eslint` config key removed | **Next.js 16** | `next build` no longer runs linting. If lint is wanted in CI it must be a separate step. |
| `.eslintrc` legacy config | `@next/eslint-plugin-next` defaults to **flat config** | Next.js 16 | Use `eslint.config.mjs`. |
| `next build` printed `Size` / `First Load JS` per route | **Removed** — deemed inaccurate for RSC architectures | **Next.js 16** | There is no free bundle-size signal. Budget enforcement must be explicit (Pitfall 6). |
| Synchronous `params` / `searchParams` / `cookies()` | **Async only** — sync access fully removed | **Next.js 16** | Phase 1 has no dynamic routes, so no impact — but Phase 3's `/location/[region]/[town]/[service]` **must** `await params`. Flag forward. |
| `middleware.ts` | Renamed to `proxy.ts`; `edge` runtime unsupported in `proxy` | Next.js 16 | No middleware in Phase 1. Relevant if Phase 3 adds the 4 service-slug 301s — prefer `next.config` `redirects()` over proxy. |
| Node.js 18 | **Node.js ≥ 20.9.0 required**; TypeScript ≥ 5.1 | Next.js 16 | Local Node is 22.23.1 ✓. Pin CI and Vercel to Node 22. |
| `images.domains` | `images.remotePatterns` | Next.js 16 (deprecated) | No remote images in Phase 1. |

**Deprecated / outdated — do not use:**
- `next-transpile-modules` — superseded by `transpilePackages`.
- `--turbopack` / `--turbo` flags — now the default, redundant.
- `next lint` — removed.
- `serverRuntimeConfig` / `publicRuntimeConfig` — removed.
- `next/legacy/image` — deprecated.
- `FAQPage` schema — Google retired FAQ rich results 2026-05-07 (D13). Not Phase 1, but never add it.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vercel's "Include files outside the Root Directory in the Build Step" behaviour is applied automatically for detected npm workspaces, making sibling `design-system/` files present in the build container. | Pitfall 4 | LOW — the recommendation (GitHub Actions is the gate; Vercel build command stays default `next build`) does not depend on this being true. Only matters if someone *also* wants locks chained into the Vercel build. Current Vercel docs do not document the toggle; the claim comes from community sources. |
| A2 | `actions/checkout@v4` and `actions/setup-node@v4` are the current major versions. | Code Examples | LOW — a wrong major produces an immediate, obvious CI failure with a clear message. Verify at execution time. |
| A3 | D-14's "<500 KB JS / <1 MB page weight" means **transfer** weight, not uncompressed. | Pitfall 3, Validation Architecture | **MEDIUM-HIGH impact, low probability of being wrong.** Grounded in the audit's own stated method (`seo-audit-2026-08-06.md:75`, "Measured transfer weight, mobile UA, gzip/br enabled") for the 1,901 KB figure the budget is benchmarked against. If read as uncompressed, **Phase 1 fails on a blank page** (550.9 KB before any app code). Worth one line of confirmation from Sam. |
| A4 | Vercel will auto-detect npm as the package manager from a root `package-lock.json` and run install from the workspace root. | Architecture Patterns | LOW — standard, documented behaviour; failure is loud and immediate at first deploy. |
| A5 | The canonical number `+447861936533` is the one that actually reaches BHC. | User Constraints (D-09) | **Carried forward from CONTEXT.md Open Question 1 — not a research assumption.** The architecture is number-agnostic; changing it is a one-line edit to the package default. Confirm before domain cutover, not before Phase 1 execution. |
| A6 | Brotli (Vercel's default) will be ~10-15% smaller than the gzip figures measured here. | Pitfall 3 | LOW — gzip is the conservative proxy, so a gzip-based gate can only be stricter than reality. |

---

## Open Questions (RESOLVED)

*All five questions below were settled during planning on 2026-08-08. Resolutions are recorded
inline so no later phase re-litigates them.*

1. **Is D-14's budget transfer weight or uncompressed?** (See A3.)
   - What we know: the 1.9 MB figure the budget is benchmarked against was explicitly measured as
     transfer weight with gzip/br enabled.
   - What's unclear: nothing in PROJECT.md or CONTEXT.md restates the basis for the *budget*.
   - Recommendation: **plan for transfer weight**, state it explicitly in the plan and in
     `check-budget.mjs` comments, and surface it to Sam as a one-line confirmation. Do not block
     on it.
   - **RESOLVED: transfer weight.** Promoted to a locked decision as CONTEXT.md **D-14a** and
     implemented in `01-03-PLAN.md` Task 2, which mandates `gzipSync` measurement, bans
     `statSync().size` and `du`, and requires the `seo-audit-2026-08-06.md:75` evidence to be cited
     in a comment at the point of measurement. Still worth one line of confirmation from Sam, but it
     no longer blocks anything.

2. **JavaScript or TypeScript for the app?** (Claude's Discretion.)
   - What we know: the design-system ships hand-written `.d.ts` per component, but its
     `package.json` has no `types` condition in `exports`, so TS would not resolve them without a
     further package change.
   - Recommendation: **plain JavaScript for Phase 1.** It matches the package's `.jsx` idiom,
     removes a class of resolution friction, and TS can be adopted in Phase 3 where the towns data
     file makes it genuinely valuable. If TS is preferred anyway, budget a task for adding a
     `types` condition to the package `exports`.
   - **RESOLVED: plain JavaScript.** Adopted in `01-02-PLAN.md` Task 1, whose acceptance criteria
     forbid a `devDependencies` block in `web/` and forbid adding a `types` condition to the
     design-system `exports` map. Revisit in Phase 3, where the towns data file makes typing
     genuinely valuable.

3. **Does the `fonts/` exports-map addition need Sam's sign-off?**
   - What we know: D-05 explicitly permits package changes when a component "genuinely cannot
     render under Next.js without a change", provided the `.jsx`/`.html`/`.d.ts`/`.prompt.md`
     shape is intact and lock tests stay green. Both conditions hold — verified.
   - What's unclear: whether "the package is not restructured" (D-02) is read strictly enough to
     cover a `package.json` metadata addition.
   - Recommendation: proceed; it is additive, reversible, and the alternative (copying fonts into
     `web/public/`) forks a design-system asset, which D-04's spirit forbids.
   - **RESOLVED: proceed, no sign-off needed.** Implemented as `01-01-PLAN.md` Task 1 — the single
     sanctioned manifest change under D-05. Its acceptance criteria pin the change to exactly two
     lines and assert that no `types` condition, `dependencies` or `devDependencies` block, or extra
     npm script rides along with it, and that the 8 existing lock tests still pass.

4. **Analytics.** Carried forward from CONTEXT.md Open Question 2 — Phase 1 ships with none (D-14).
   Non-blocking.
   - **RESOLVED: none in Phase 1.** `01-02-PLAN.md` Task 2 forbids any analytics, tag manager, GA4,
     GTM or Trustmary import, and `01-03-PLAN.md` Task 1 turns that into a permanent CI gate (D-14b)
     asserting no external-origin `<script src="http` in the built HTML. Adding one in a later phase
     therefore requires a deliberate, visible change plus the 50 KB third-party sign-off.

5. **Who owns domain cutover?** CONTEXT.md flags that no phase currently owns it. Out of scope for
   Phase 1, but it should be added to ROADMAP.md before Phase 5 completes.
   - **RESOLVED for Phase 1 scope only: explicitly out of scope.** D-03 keeps the apex on Webflow and
     `01-04-PLAN.md` asserts `www.beyondhousecleaning.com` still does not resolve to Vercel after
     deployment. **The underlying roadmap gap is still open**: no phase owns cutover, and the planner
     has deliberately NOT added it to Phase 1 or edited ROADMAP.md. It is surfaced to Sam as a
     roadmap decision. Note the interaction with D-15: the cutover phase is what flips
     `robots.txt` from `Disallow: /` to the crawl-allowing form ROADMAP Phase 5 requires.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js ≥ 20.9 | Next.js 16, `node --test` | ✓ | 22.23.1 | — |
| npm | Workspaces, install | ✓ | 10.9.8 | — |
| pnpm | Alt. package manager | ✓ | 11.20.0 | Not recommended (Pitfall 8) |
| git | Version control | ✓ | 2.43.2 | — |
| `gh` CLI | PR creation, CI inspection | ✓ | 2.87.3 | — |
| GitHub remote | CI + Vercel git integration | ✓ | `github.com/beyondhousecleaning/bhc-website` | — |
| Vercel CLI | Local deploy / linking | ✗ | — | Vercel Git integration via dashboard (preferred anyway — no CLI needed for D-03) |
| Vercel account/project | SC-1 (live URL) | **unknown** | — | **None. This is the one hard external dependency.** |
| `.github/` directory | CI | ✗ (does not exist) | — | Created in Phase 1 |
| Root `package.json` | Workspaces | ✗ (does not exist) | — | Created in Phase 1 |

**Missing dependencies with no fallback:**
- **A Vercel account with access to `beyondhousecleaning/bhc-website`.** Success Criterion 1
  ("reachable at a live URL") cannot be verified without it. The plan must include a
  `checkpoint:human-verify` for Sam to create/connect the Vercel project and set
  Root Directory = `web`, Node = 22. Every other criterion is verifiable locally.

**Missing dependencies with fallback:**
- Vercel CLI — use the dashboard Git integration.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | `node:test` (Node 22.23.1 built-in) + `node:assert/strict` — **zero dependencies**, per D-12 |
| Config file | none (deliberate) |
| Quick run command | `node --test design-system/test/*.test.js` |
| Full suite command | `npm run test:locks && npm run build --workspace @bhc/web && (cd web && node scripts/check-budget.mjs && node scripts/check-html-locks.mjs)` |
| Exit-code gating | **Verified** — exit 0 on 8/8 pass, exit 1 when any test fails |

### Phase Requirements / Success Criteria → Test Map

| ID | Behaviour | Test Type | Automated Command | File Exists? |
|----|-----------|-----------|-------------------|--------------|
| **SC-1a** | `next build` succeeds from a clean checkout with no design-system build step | build | `npm ci && npm run build --workspace @bhc/web` | ❌ Wave 0 |
| **SC-1b** | Built CSS contains design tokens (proves it is "built from `tokens.css`") | integration | assert `--bhc-ink` present in `web/.next/static/chunks/*.css` | ❌ Wave 0 |
| **SC-1c** | Deployed and reachable at a live Vercel URL | **manual** | `curl -sf <deployment-url> \| grep -q bhc-hero__heading` — **requires Sam to connect the Vercel project first** | ❌ human checkpoint |
| **SC-2a** | Exactly one `tel:` in the rendered HTML (**Lock 4**) | integration | assert `(html.match(/href="tel:/g) \|\| []).length === 1` | ❌ Wave 0 |
| **SC-2b** | `tel:` href digits equal displayed digits (**Lock 4**, REQ-nap-consistency) | integration | extract `href="tel:X"` and the `bhc-footer__phone` label; assert `digits(X).replace(/^44/,'') === digits(label).replace(/^44/,'')` | ❌ Wave 0 |
| **SC-2c** | Neither retired number appears anywhere (D-09) | integration | assert HTML contains neither `07441918832`/`447441918832` nor `447575709361` | ❌ Wave 0 |
| **SC-2d** | No UK postcode / street address in rendered output (**Lock 5**, D-10) | integration | assert `/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/` does **not** match the HTML | ❌ Wave 0 |
| **SC-2e** | Exactly one `<footer>` per page (D-11) | integration | assert `(html.match(/<footer/g) \|\| []).length === 1` | ❌ Wave 0 |
| **SC-2f** | `formatPhone`/`toDial` derivation holds (**Lock 4** unit level) | unit | `node --test design-system/test/locks.test.js` — **already passing 8/8** | ✅ exists |
| **SC-3a** | Lock tests execute in CI | ci | `node --test design-system/test/*.test.js` as a GitHub Actions job | ❌ Wave 0 |
| **SC-3b** | A lock failure **fails the build** (D-13) | ci | **Verified locally**: injecting a failing test made `npm run test -w @bhc/design-system` exit 1. In CI, confirm via a throwaway commit with a deliberately failing assertion, then revert. Also requires the job be a **required status check**. | ❌ Wave 0 + human checkpoint (branch protection) |
| **SC-4a** | Hero renders → exactly one `<h1>` carrying the keyword line (**Lock 1**) | integration | assert one `<h1` and it contains the town name | ❌ Wave 0 |
| **SC-4b** | Breadcrumbs render → visible trail + `BreadcrumbList` JSON-LD (**Lock 2**) | integration | assert `bhc-breadcrumbs__list` and `"@type":"BreadcrumbList"` in HTML | ❌ Wave 0 |
| **SC-4c** | RatingBadge renders server-side (**Lock 3**) | integration | assert `bhc-rating__value">4.9` present in static HTML | ❌ Wave 0 |
| **SC-4d** | InterlinkBlock renders (**Lock 6** precursor) | integration | assert `bhc-interlink__list` present | ❌ Wave 0 |
| **SC-4e** | Button renders from the package | integration | assert `bhc-btn--primary` present | ❌ Wave 0 |
| **SC-4f** | All JSON-LD is server-rendered, none client-injected (**Lock 9**) | integration | assert 3 × `<script type="application/ld+json">` in the **static file on disk** (not a browser DOM) | ❌ Wave 0 |
| **SC-4g** | Zero client components (D-07) | integration | assert `!html.includes('use client')` and no `"use client"` string in `web/app/**` | ❌ Wave 0 |
| **D-14** | Performance budget holds | integration | `node web/scripts/check-budget.mjs` — gzip transfer weight, `<500 KB` JS, `<1 MB` page | ❌ Wave 0 |
| **D-14b** | No third-party script imported | integration | assert no `<script src="http` (external origin) in the HTML | ❌ Wave 0 |

> **Every SC-2 / SC-4 / D-14 assertion above reads `web/.next/server/app/index.html` — the file
> `next build` writes to disk.** That is the whole point: it proves the output is server-rendered
> without running a browser. **Verified**: this file exists after `next build` and contained every
> asserted string in the probe.

### Sampling Rate

- **Per task commit:** `node --test design-system/test/*.test.js` (~80 ms, zero install)
- **Per wave merge:** `npm ci && npm run build -w @bhc/web && node web/scripts/check-html-locks.mjs && node web/scripts/check-budget.mjs`
- **Phase gate:** full suite green in GitHub Actions as a **required status check**, plus the
  Vercel deployment URL confirmed reachable by Sam, before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `package.json` (repo root) — `workspaces: ["web","design-system"]` + `test:locks` script
- [ ] `web/package.json`, `web/next.config.mjs`, `web/app/layout.jsx`, `web/app/page.jsx` — the app itself
- [ ] `web/scripts/check-html-locks.mjs` — SC-2a…2e, SC-4a…4g, D-14b (zero-dep, mirrors `locks.test.js` style)
- [ ] `web/scripts/check-budget.mjs` — D-14 transfer-weight gate
- [ ] `.github/workflows/ci.yml` — the gate (repo has **no** CI today)
- [ ] `design-system/package.json` — add `"./fonts/*"` to `exports`, `"fonts"` to `files` (Pitfall 1)
- [ ] `design-system/src/jsonLd.js` + 3 component call-sites — JSON-LD escaping (Pitfall 7)
- [ ] Framework install: none needed — `node --test` is built in (D-12)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | **no** | Public marketing site, no accounts in Phase 1 |
| V3 Session Management | **no** | No sessions, no cookies. Ships zero cookies by default |
| V4 Access Control | **partial** | Vercel Deployment Protection can gate preview URLs; consider enabling so an unfinished Phase-1 build is not indexable alongside the live Webflow site (also a duplicate-content / SEO concern) |
| V5 Input Validation | **yes (output encoding)** | No user input in Phase 1. The relevant control is **output encoding into JSON-LD** — see Pitfall 7 |
| V6 Cryptography | **no** | No secrets, no crypto. `.gitignore` already covers `.env`, `.env.local`, `.vercel/` |
| V14 Configuration | **yes** | Dependency supply chain (Package Legitimacy Audit above); optional security headers via `next.config` `headers()` |

### Known Threat Patterns for Next.js 16 / static marketing site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via `dangerouslySetInnerHTML` + `JSON.stringify` in JSON-LD | Tampering | Escape `<` as `<` before embedding — Next.js's own documented guidance. Low risk in Phase 1 (trusted values), **material from Phase 3** (~56 town names from a data file). Fix now: Pitfall 7 |
| Supply-chain / slopsquatted dependency | Tampering | Four runtime dependencies, all `[OK]` under `slopcheck --ecosystem npm`, all with `postinstall: none`. `npm ci` against a committed lockfile in CI |
| PII disclosure — residential postcode in rendered output or JSON-LD | Information Disclosure | D-10 / Lock 5. Enforced at two levels: `locks.test.js` scans package source; SC-2d scans the built HTML. **Verified: the probe HTML matched zero UK postcodes** |
| Accidental indexing of the Vercel preview while Webflow serves production (duplicate content / brand confusion) | Information Disclosure | Ship `robots.txt` with `Disallow: /` or enable Vercel Deployment Protection until cutover. **Phase 5 requires `robots.txt` to allow crawling — these must not be confused.** Flag as an explicit Phase 1 decision |
| Third-party script injecting tracking without sign-off | Repudiation | D-14. Assert no external `<script src="http` in the built HTML (SC-D-14b) |
| Missing security headers (CSP, X-Content-Type-Options, Referrer-Policy) | Multiple | Optional in Phase 1 via `next.config` `headers()`. Note a strict CSP would need a nonce or hash for the inline JSON-LD `<script>` blocks — do not add CSP casually or Locks 3/9 output gets blocked in the browser. **Recommend deferring CSP to Phase 5** |

---

## Sources

### Primary (HIGH confidence)

- **Direct empirical verification** — scratch npm workspace built with Next.js 16.3.0 / React 19.2.8 /
  Node 22.23.1 on 2026-08-08, containing a verbatim copy of `design-system/` and a page rendering all
  six components. `next build` run 5 times across configuration variants. All quantitative claims
  (bundle sizes, HTML contents, resolution failures, exit codes) are measured, not estimated.
  Probe deleted after measurement.
- Context7 `/vercel/next.js/v16.2.9` — `transpilePackages`, App Router global CSS, JSON-LD guidance
- https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages (v16.3.0, updated 2026-05-27)
- https://nextjs.org/docs/app/guides/upgrading/version-16 (v16.3.0, updated 2026-08-03)
- https://nextjs.org/docs/app/guides/json-ld
- https://vercel.com/docs/builds/configure-a-build (updated 2026-07-15) — Root Directory, Build/Install Command
- https://vercel.com/docs/monorepos (updated 2026-07-21) — workspace requirements, skip-unaffected
- https://vercel.com/docs/project-configuration/project-settings (updated 2026-07-15)
- `npm view` on 11 packages, 2026-08-08 — versions, repos, `scripts.postinstall`
- `slopcheck install --ecosystem npm` on 11 packages — all `[OK]`
- Repo source read directly: `design-system/package.json`, `src/index.js`, all 6 `.jsx`,
  `formatPhone.js`, `geo.js`, `test/locks.test.js`, `tokens.css`, `styles.css`, `fonts/fonts.css`,
  `docs/design/design-system.md` §2/§4/§5, `docs/research/seo-audit-2026-08-06.md` §"page weight"
- `.planning/PROJECT.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `STATE.md`, `01-CONTEXT.md`

### Secondary (MEDIUM confidence)

- Community reporting on Vercel's "Include files outside the Root Directory in the Build Step"
  toggle (github.com/vercel/vercel discussions #5289; dev.to; educative.io) — behaviour described
  consistently across sources but **not** documented on vercel.com's current pages. Basis for A1.
- catchmetrics.io, "Next.js Developers Just Lost Critical Bundle Size Visibility" — corroborates the
  Next.js 16 `First Load JS` removal, which is independently confirmed by the official upgrade guide.
- github.com/ai/size-limit — tool capability for the deferred alternative.

### Tertiary (LOW confidence — flagged for validation)

- `actions/checkout@v4` / `actions/setup-node@v4` majors (A2) — training data, not verified this
  session. Verify at execution time.

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Standard stack | **HIGH** | Every version verified via `npm view`; every package passed `slopcheck --ecosystem npm`; the exact four-dependency set was built successfully |
| Consuming the untranspiled JSX package (Q1) | **HIGH** | Built and rendered end-to-end. `transpilePackages` optional-under-Turbopack, workspace-vs-relative-path, and the exports-map failure were each tested individually rather than reasoned about |
| RSC safety of all six components (Q2) | **HIGH** | Exhaustive source audit + a build that produced no client boundary and no `use client` string in the emitted HTML |
| Global CSS import (Q3) | **HIGH** | Verified: `styles.css` alone pulls in `tokens.css` via `@import`; both `--bhc-ink` and `bhc-hero__heading` present in one 12 KB output file |
| Running locks in CI (Q4) | **HIGH** for the mechanism (exit codes proven both ways); **MEDIUM** for the Vercel-side option (A1 undocumented) |
| Vercel monorepo deploy (Q5) | **MEDIUM** | Root Directory / workspace requirements are officially documented, but no deployment was performed — no Vercel project exists yet |
| Performance budget (Q6) | **HIGH** for the measurements and the recommended mechanism; **MEDIUM** for the budget's intended basis (A3 — needs one line from Sam) |
| Pitfalls | **HIGH** | Pitfalls 1, 2, 3, 6, 8 were reproduced or measured. Pitfalls 5 and 7 are grounded in project docs and official Next.js guidance. Pitfall 4 is the one reasoned rather than reproduced |

**Research date:** 2026-08-08
**Valid until:** 2026-09-07 (30 days). Next.js is fast-moving — re-verify the `next` version and
the Turbopack workspace-transpilation behaviour if planning slips past a minor release. The
design-system findings (exports map, RSC safety, lock-test wiring) do not expire.
