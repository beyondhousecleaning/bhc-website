# Phase 1: Platform Foundation & Design System Integration - Pattern Map

**Mapped:** 2026-08-08
**Files analyzed:** 15 new/modified
**Analogs found:** 7 / 15 (5 exact, 2 role-match, 8 genuinely greenfield)

> **Read this first — repo reality.** This repo contains **only** `design-system/`, `docs/`,
> `assets/`, `README.md` and `.planning/`. There is **no app, no root `package.json`, no CI, no
> `node_modules`, no build step, no lockfile.** For 8 of the 15 files below there is honestly no
> in-repo analog and inventing one would be worse than useless — those rows say
> "**no analog — greenfield**" and point the planner at `01-RESEARCH.md § Code Examples`, which
> contains *verified* (probe-built) snippets for exactly those files.
>
> Where analogs *do* exist they are load-bearing. The design-system package has a strong,
> deliberate house style — zero dependencies, pure logic in `.js` split away from `.jsx`, and
> doc-comments that name the lock and the live bug. New enforcement code must match it, and
> `01-VALIDATION.md` explicitly requires `check-html-locks.mjs` to "mirror the existing
> `locks.test.js` style."

---

## File Classification

| New/Modified File | New/Mod | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|---------|------|-----------|----------------|---------------|
| `web/scripts/check-html-locks.mjs` | NEW | test / enforcement script | file-I/O (read built HTML → assert) | `design-system/test/locks.test.js` | **exact** |
| `web/scripts/check-budget.mjs` | NEW | test / enforcement script | file-I/O (read + gzip → assert) | `design-system/test/locks.test.js` | **exact** (style) |
| `design-system/src/jsonLd.js` | NEW | utility (pure helper) | transform | `design-system/src/components/NAPFooter/formatPhone.js` | **exact** |
| `design-system/package.json` | **MOD** | config (package manifest) | n/a | *itself* — see §Package Conventions | **exact** (self) |
| `design-system/src/components/NAPFooter/NAPFooter.jsx` | **MOD** (1 line) | component | request-response (SSR) | *itself* — line 118 | **exact** (self) |
| `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx` | **MOD** (1 line) | component | request-response (SSR) | *itself* — line 61 | **exact** (self) |
| `design-system/src/components/RatingBadge/RatingBadge.jsx` | **MOD** (1 line) | component | request-response (SSR) | *itself* — lines 59-72 | **exact** (self) |
| `design-system/test/locks.test.js` | **MOD** (optional, +1 test) | test | file-I/O | *itself* | **exact** (self) |
| `web/app/page.jsx` | NEW | page component | request-response (SSG) | `design-system/.design-sync/previews/*.tsx` + `.design-sync/conventions.md` §"An idiomatic composition" | role-match (composition only) |
| `web/app/layout.jsx` | NEW | layout / provider | request-response (SSG) | *none* — see RESEARCH § Pattern 1 | **no analog** |
| `package.json` (repo root) | NEW | config (workspace root) | n/a | `design-system/package.json` (formatting only) | partial |
| `web/package.json` | NEW | config | n/a | `design-system/package.json` (formatting only) | partial |
| `web/next.config.mjs` | NEW | config | n/a | *none* | **no analog** |
| `.github/workflows/ci.yml` | NEW | CI config | batch | *none — repo has no CI at all* | **no analog** |
| `web/app/robots.js` (or `web/public/robots.txt`) | NEW | route handler / static | request-response | *none* | **no analog** |

**Optional / discretionary files** (not in the Wave 0 list, planner's call): `web/app/not-found.jsx`,
`web/jsconfig.json`, `web/public/` assets. All **no analog**.

---

## Pattern Assignments

### `web/scripts/check-html-locks.mjs` (test/enforcement, file-I/O) — **EXACT ANALOG**

**Analog:** `design-system/test/locks.test.js` (160 lines, read in full)

This is the single most important pattern transfer in the phase. `01-VALIDATION.md` line 86-87
says the script must "mirror the existing `locks.test.js` style", and D-12 forbids adding a test
framework. Copy the following five conventions verbatim.

**1. Doc-comment header — name the lock, name the live bug it caught** (`locks.test.js:1-9`):

```js
/**
 * Lock assertions.
 *
 * The design system's locks are written as assertions precisely so they can be
 * tested rather than hoped for. The live site regressed silently on nearly all
 * of them; guidance caught none.
 *
 *   node --test test/
 */
```

Note the last line: **the invocation command is part of the header.** Reproduce that
(`node --test web/scripts/check-html-locks.mjs` or however the planner wires it).

**2. Imports — `node:` prefixed built-ins only, zero third-party** (`locks.test.js:11-20`):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the PURE modules — node --test cannot parse JSX, and the locks are
// deliberately implemented in plain JS so they are testable without a build.
import { formatPhone, toDial } from '../src/components/NAPFooter/formatPhone.js';
import { distanceMiles, nearestTowns, buildInterlinks } from '../src/components/InterlinkBlock/geo.js';
```

There is **no** `package.json` dependency backing any of this. Keep it that way.

**3. Root resolution + shared helper, defined once at module top** (`locks.test.js:22-23`):

```js
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const digits = (s) => String(s).replace(/\D/g, '');
```

`digits` is **directly reusable** for SC-2b (href digits === displayed digits). Copy it, do not
reinvent it. Note it lives in a `.mjs`/`.js` file — `.replace(` in a `.jsx` file trips the
`claude-seo` hook (RESEARCH Pitfall 5).

**4. Section banners as comment rules, each naming its lock** (`locks.test.js:25, 60, 86, 106, 125`):

```js
/* --- Lock 4 — href digits must equal displayed digits -------------------- */

/* --- Lock 5 — no street address or postcode ------------------------------ */

/* --- Lock 7 — every <img> has non-empty alt ------------------------------ */
```

Format is exactly: `/* --- ` + title + ` ` + dashes padded to column 76 + `*/`.
The new script covers SC-2a…2e (Locks 4, 5, D-11), SC-4a…4g (Locks 1, 2, 3, 6, 9, D-07),
D-14b and D-15 — give each its own banner.

**5. Test titles lead with the lock ID; assertions carry a failure message with the actual value**
(`locks.test.js:46-58` — this is the closest structural twin to what the new script does, because
it also reads an HTML file off disk and regex-asserts against it):

```js
test('Lock 4: NAPFooter markup contains exactly one tel: link', () => {
  const html = readFileSync(
    join(ROOT, 'src/components/NAPFooter/NAPFooter.html'),
    'utf8'
  );
  const tels = html.match(/href="tel:[^"]+"/g) || [];
  assert.equal(tels.length, 1, `expected 1 tel: link, found ${tels.length}`);

  // …and its digits match the visible label.
  const href = tels[0].match(/tel:([^"]+)/)[1];
  const label = html.match(/class="bhc-footer__phone"[^>]*>([^<]+)</)[1];
  assert.equal(digits(href).replace(/^44/, ''), digits(label).replace(/^44/, ''));
});
```

**Take this whole block as the template for SC-2a + SC-2b.** The only change is the input file:
`web/.next/server/app/index.html` instead of `NAPFooter.html`. The `|| []` guard on `.match()`,
the third-argument failure message interpolating the actual count, and the trailing comment
explaining the second assertion are all part of the convention.

**6. The Lock 5 postcode regex — reuse it verbatim, do not re-derive it** (`locks.test.js:63`):

```js
const POSTCODE = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;
```

SC-2d asserts this does **not** match the built HTML. Note the analog *strips comments before
testing* (`locks.test.js:77-82`) because docs legitimately name `CV32 6EQ` as the thing not to
ship — the built-HTML check does **not** need that strip step (there are no source comments in
prerendered HTML), and adding it would create a hole.

**Decision the planner must make:** `locks.test.js` uses `node:test` (`test(...)` blocks, run via
`node --test`). `01-VALIDATION.md` line 29 invokes the new script as plain
`node web/scripts/check-html-locks.mjs`. Both give exit 1 on failure. **Recommend using
`node:test` + `assert/strict` anyway** — it is the house convention, it produces per-lock TAP
output naming which lock failed, and `node --test` is not required to run a file that imports
`node:test` (a bare `node file.mjs` also executes and exits non-zero on failure). Whichever is
chosen, state it in the plan so CI and the doc-comment header agree.

---

### `web/scripts/check-budget.mjs` (test/enforcement, file-I/O) — **EXACT ANALOG (style)**

**Analog:** `design-system/test/locks.test.js` for style; `01-RESEARCH.md § Code Examples`
lines 713-743 for the *logic* (that exact script was run against a real `next build` and produced
the measured 168.5 KB figure — it is verified, not proposed).

Apply the same five conventions as above. Three specifics:

- **`node:zlib` is a built-in** — `import { gzipSync } from 'node:zlib'` keeps the zero-dependency
  rule intact. Do **not** reach for `size-limit` (RESEARCH Pitfall 6 rejects it explicitly).
- **State the measurement basis in a comment**, matching the analog's habit of explaining *why* a
  rule is phrased the way it is. D-14a is the single most misreadable decision in the phase:

  ```js
  const JS_BUDGET_KB = 500;    // D-14, transfer weight (see Pitfall 3)
  const PAGE_BUDGET_KB = 1024; // D-14
  ```

  Expand that comment to name the evidence — `docs/research/seo-audit-2026-08-06.md:75`,
  "Measured transfer weight, mobile UA, gzip/br enabled". A future reader who measures
  uncompressed gets 550.9 KB on a blank page and wrongly declares Phase 1 failed.
- **Failure message names the decision**, matching how every lock test names its lock:
  `console.error('PERFORMANCE BUDGET EXCEEDED (D-14)'); process.exit(1);`

---

### `design-system/src/jsonLd.js` (utility, pure transform) — **EXACT ANALOG**

**Analog:** `design-system/src/components/NAPFooter/formatPhone.js` (33 lines, read in full).
Secondary confirmation: `design-system/src/components/InterlinkBlock/geo.js:1-11`.

**The separation is load-bearing, not incidental.** Both existing pure helpers open by stating
*why* they are not in the `.jsx`:

```js
/**
 * Phone formatting — pure, no React.
 *
 * Lives apart from NAPFooter.jsx so Lock 4 can be tested without a JSX
 * toolchain. It is also the whole mechanism behind the lock: the displayed
 * string is DERIVED from the dial string, so the two cannot diverge.
 *
 * The live site displays +44 7861 936533 and dials 07441918832 on all 115
 * pages. That is only possible when display and href are separate inputs.
 */
```
— `formatPhone.js:1-10`

```js
/**
 * Interlink geography — pure, no React.
 *
 * Lives apart from InterlinkBlock.jsx so the linking rule can be tested
 * without a JSX toolchain, and so page code can compute links at build time.
 * ...
 */
```
— `geo.js:1-11`

The `.js`/`.jsx` split exists so `node --test` (which cannot parse JSX) can import the logic with
zero build step. `jsonLd.js` inherits that reason **plus** a second one: RESEARCH Pitfall 5 — the
`claude-seo` PostToolUse hook rejects any `.jsx` write containing the case-insensitive substring
`REPLACE`, and the escape idiom is literally `.replace(/</g, '\\u003c')`. Write the header
naming both reasons.

**Body pattern — named `export const` / `export function`, one-line JSDoc per export, arrow for
trivial functions** (`formatPhone.js:12-13, 25-33`):

```js
/** Digits only. */
export const digitsOf = (value) => String(value).replace(/\D/g, '');

/**
 * Human-readable form, derived from the same value as the href.
 * `+447861936533` -> `+44 7861 936533`
 */
export function formatPhone(value) { /* ... */ }
```

Applied (RESEARCH § Code Examples line 708-711 — this is the sanctioned Next.js escape):

```js
/** Serialise JSON-LD safely for inline <script> embedding. */
export const safeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
```

**No default export** in either pure-helper analog — named exports only. `formatPhone.js` and
`geo.js` both end without a `export default`. Match that. (The `.jsx` components *do* have default
exports; the `.js` helpers do not.)

**Re-export convention:** `formatPhone.js` is re-exported from the component that uses it
(`NAPFooter.jsx:28` — `export { formatPhone, toDial };`) and then from the barrel
(`src/index.js:5`). `safeJsonLd` is package-internal plumbing, not public API — **do not** add it
to `src/index.js`. Adding it would widen the package's public surface for no consumer benefit and
invite an app-side reimplementation, which is exactly the second-source-of-truth failure mode
RESEARCH § Don't Hand-Roll warns about.

**Optional but recommended — extend the analog with a test.** `locks.test.js` has a section per
lock; add one for the escape, matching the existing title style:

```js
/* --- JSON-LD escaping — no </script> breakout --------------------------- */

test('safeJsonLd escapes < so a </script> in a value cannot break out', () => {
  assert.ok(!safeJsonLd({ name: 'a</script><script>x' }).includes('</script>'));
});
```

This costs nothing (still zero deps, still `node --test`) and makes the Pitfall-7 fix a *lock*
rather than a hope — which is the stated philosophy in `locks.test.js:3-6`.

---

### `design-system/src/components/{NAPFooter,Breadcrumbs,RatingBadge}.jsx` (component, SSR) — **MODIFY, 1 line each**

**Analog:** the files themselves. These are the only three JSON-LD emitters
(RESEARCH Pitfall 7 confirms: `NAPFooter.jsx:118`, `Breadcrumbs.jsx:61`, `RatingBadge.jsx:59`).
All three use the identical bare-`JSON.stringify` shape today.

**Current shape** (identical in `NAPFooter.jsx:116-119` and `Breadcrumbs.jsx:59-62`):

```jsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
```

**Target shape** — the *only* change is the serialiser call:

```jsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
```

plus one import line matching each file's existing import style
(`NAPFooter.jsx:24` — `import { formatPhone, toDial } from './formatPhone.js';` — note the
**explicit `.js` extension**, required by `"type": "module"`; from a component directory the path
is `'../../jsonLd.js'`).

**`RatingBadge.jsx` differs — it inlines the object literal** (lines 56-72) rather than building a
`schema` const first:

```jsx
      {emitSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              // ...
            }),
          }}
        />
      ) : null}
```

Swap `JSON.stringify(` → `safeJsonLd(` in place. Do **not** refactor it to hoist a `schema` const
to match the other two — that is unrequested churn on a D-05-locked component.

**Hard constraints on these three edits (D-05, and RESEARCH § Anti-Patterns):**
- Do **not** add `"use client"`. All six components are verified RSC-safe as written.
- Do **not** change any rendered markup, class name, prop, or default.
- Do **not** touch the `.html` / `.d.ts` / `.prompt.md` siblings — the 4-file shape must stay intact
  and `locks.test.js` reads the `.html` previews directly (`locks.test.js:47-50, 97-103, 117-122`).
- `.jsx` files must not contain `.replace(` — the `claude-seo` hook blocks the write. The whole
  point of putting the escape in `jsonLd.js` is that these three files never see the substring.
- After the edits, `node --test design-system/test/*.test.js` must still be **8/8**.

---

### `design-system/package.json` (config) — **MODIFY, 2 lines**

**Analog:** itself. Current file (23 lines, read in full) — note the conventions to preserve:

```json
{
  "name": "@bhc/design-system",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./tokens.css": "./tokens.css",
    "./styles.css": "./styles.css"
  },
  "files": ["src", "tokens.css", "styles.css"],
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "keywords": ["design-system", "beyond-house-cleaning"],
  "license": "UNLICENSED"
}
```

**Package conventions to carry into the new `package.json` files:**
- 2-space indent, arrays on **one line** when short (`"files"`, `"keywords"`), no trailing newline
  drama — match byte-for-byte formatting.
- `"private": true` on every package in this repo. Nothing is published.
- `"type": "module"` — the repo is ESM-only. New scripts use `.mjs` or `import` in `.js`.
- **`scripts` has exactly one entry and zero `dependencies`/`devDependencies`.** `§Specifics` in
  CONTEXT.md: *"it needs no `node_modules` at all. Keep it that way."* Do not add a `build`,
  `lint`, or `prepare` script to this package.
- `peerDependencies` only — React is never a direct dependency here (this is why npm workspaces,
  not pnpm, is the right choice — RESEARCH Pitfall 8).

**The two sanctioned edits (the only package changes Phase 1 may make — RESEARCH Pitfall 1,
verified: build succeeds, 8 `.woff2` emit, lock tests stay 8/8):**

```jsonc
  "exports": {
    ".": "./src/index.js",
    "./tokens.css": "./tokens.css",
    "./styles.css": "./styles.css",
    "./fonts/*": "./fonts/*"                              // ← add
  },
  "files": ["src", "tokens.css", "styles.css", "fonts"]   // ← add "fonts"
```

Do **not** add a `types` condition, a `sideEffects` field, a `version` bump, or `devDependencies`.

---

### `web/app/page.jsx` (page component, SSG) — role-match analog (composition only)

**Analog:** `design-system/.design-sync/conventions.md` §"An idiomatic composition" (lines 66-88)
and `design-system/.design-sync/previews/*.tsx`. These are *how the package's own author composes
these components* — the closest thing to a page in this repo. They are previews, not pages, so
treat them as a composition reference, not a file template.

**Composition pattern** (`conventions.md:68-88`):

```jsx
<>
  <Hero
    eyebrow="Reliable & Affordable"
    heading="Deep Cleaning in Warwick"
    lead="DBS-checked local cleaners who turn up when they say they will."
    rating={{ rating: 4.9, count: 175, source: 'Google' }}
    actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
  />

  <section className="bhc-section bhc-section--warm">
    <div className="bhc-container">
      <h2 style={{ marginBottom: 'var(--bhc-space-6)' }}>What we clean</h2>
      <Button href="/checklist" variant="secondary">See Our Checklist</Button>
    </div>
  </section>
</>
```

**Rules extracted from `conventions.md` that constrain this file** (all quoted, not inferred):
- **No provider, no wrapper.** `conventions.md:3-8`: *"Components are plain function components
  reading no React context. Do not wrap anything in a theme or provider — none is exported and
  none is needed."*
- **Own markup uses only real `bhc-` classes and `var(--bhc-*)` tokens.** `conventions.md:16-18`:
  *"never invent a `bhc-` name and never hardcode a hex value that a token already holds."*
  The complete available set is the table at `conventions.md:21-25` — `bhc-container`,
  `bhc-container--narrow/--wide`, `bhc-section`, `bhc-section--warm/--tint/--navy`,
  `bhc-visually-hidden`, `bhc-skip-link`. Nothing else exists.
- **`Hero`'s `heading` is always the page's single `<h1>`; `eyebrow` renders as a `<p>`**
  (`conventions.md:54-56`). This is what satisfies SC-4a / Lock 1 structurally.
  `Hero.jsx:33-35` throws if `heading` is missing, so Lock 1 is enforced at build time.
- **`RatingBadge` is light-surface only** (`conventions.md:50-52`) — it sets `--bhc-ink` directly
  rather than inheriting `currentColor`, so it renders illegibly on a `bhc-section--navy` band.
- **`emitSchema` at most once per page** (`RatingBadge.jsx:11-13`).

The concrete page body is `01-RESEARCH.md § Pattern 3` (lines 401-428) — that exact JSX was
probe-built and produced every string SC-4a…SC-4g assert against.

---

### `web/app/layout.jsx` (layout, SSG) — **NO ANALOG — greenfield**

There is no layout, no page, and no React application anywhere in this repo. Follow
`01-RESEARCH.md § Pattern 1` (lines 342-380) — verified by scratch build.

Two rules that are *not* discretionary and that the planner must carry into the plan text:

1. **Import `styles.css` only, never `tokens.css` alongside it.** Verified against source:
   `design-system/styles.css:6` is `@import './tokens.css';` and that is its **only** `@import`.
   Importing both duplicates every token declaration.
2. **`fonts.css` must be imported separately.** ⚠️ **Correction to the package's own docs:**
   `.design-sync/conventions.md:6-8` claims `styles.css` *"`@import`s the tokens, the self-hosted
   brand faces, and the component CSS."* **It does not** — `grep -n "@import" design-system/styles.css`
   returns exactly one line (`tokens.css`). `fonts.css` is *not* in the import closure, which is
   precisely why the `exports`-map fix above is required. Do not trust `conventions.md` on this
   point; trust the file.
3. **Do not pass a `phone` prop to `<NAPFooter />`.** The canonical `+447861936533` is the package
   default (`NAPFooter.jsx:33`). Passing it from the app creates a second place the number can be
   wrong — the exact defect REQ-nap-consistency exists to eliminate. (Note: the preview file
   `.design-sync/previews/NAPFooter.tsx:38` *does* pass it — that is a prop demo, not app guidance.
   Do not copy it.)
4. **`<NAPFooter />` lives in the layout and nowhere else.** That is what makes D-11 structural
   rather than a convention someone has to remember, and it is what SC-2e (`exactly one <footer>`)
   asserts.

---

### `package.json` (repo root), `web/package.json` — partial analog (formatting only)

**Analog:** `design-system/package.json` for JSON formatting, `"private": true`, `"type": "module"`,
and the minimal-scripts ethos. The *content* is greenfield — see `01-RESEARCH.md § Code Examples`
lines 672-682 for the verified root manifest.

Carry over: 2-space indent, short arrays inline, `"private": true`, and **resist adding scripts**.
The root needs `test:locks` and `build`; `web/` needs `dev`/`build`/`start`. Nothing else in
Phase 1 (no `lint` unless the planner deliberately adds ESLint — note `next lint` was **removed**
in Next.js 16, so lint would need a separate ESLint CLI invocation).

---

### `web/next.config.mjs` — **NO ANALOG — greenfield**

`01-RESEARCH.md § Pattern 2` (lines 381-394). The verified finding: `transpilePackages` is
*optional* under Turbopack (the probe built without it) but should be set anyway as documented
insurance. Note Next.js 16 makes Turbopack the default — **do not add a `--turbopack` flag**, and
**do not add a `webpack` key** (it makes `next build` fail unless `--webpack` is passed).

---

### `.github/workflows/ci.yml` — **NO ANALOG — the repo has no CI whatsoever**

There is no `.github/` directory. `01-RESEARCH.md § Code Examples` lines 745-781 has the verified
two-job workflow. Three things the planner must not lose:

- The `locks` job runs `node --test design-system/test/*.test.js` with **no `npm ci` step** — it
  genuinely needs zero `node_modules`, which is the whole reason it is a fast separate job.
- D-13 is only satisfied when the jobs are **required status checks** on `main`. That is a GitHub
  repo-admin action — `01-VALIDATION.md` correctly lists it as manual. A workflow that runs but
  does not block a merge is not a gate.
- `actions/checkout@v4` / `actions/setup-node@v4` majors are `[ASSUMED]` (RESEARCH A2) — verify at
  execution time.

---

### `web/app/robots.js` / `web/public/robots.txt` — **NO ANALOG — greenfield**

D-15: `Disallow: /` until domain cutover. No precedent in this repo. Flag in the plan that this
**deliberately contradicts** ROADMAP Phase 5's "robots.txt allows crawling" criterion — the two
apply to different hosts (Vercel preview vs. production apex) and the cutover phase flips it.

---

## Shared Patterns

Cross-cutting conventions that apply to *every* new file in this phase.

### 1. Zero dependencies for anything that enforces a rule

**Source:** `design-system/package.json:14-16` + `design-system/test/locks.test.js:11-15`
**Apply to:** `check-html-locks.mjs`, `check-budget.mjs`, `ci.yml`, `design-system/src/jsonLd.js`

```json
  "scripts": {
    "test": "node --test test/*.test.js"
  },
```

No `dependencies`, no `devDependencies`, no config file, no test framework. D-12 states this as a
rule; CONTEXT.md §Specifics restates it (*"wiring it into CI should be a one-line invocation, not a
toolchain"*). RESEARCH Pitfall 6 rejects `size-limit` on exactly these grounds. Every built-in
import is `node:`-prefixed.

### 2. The doc-comment contract: name the lock, name the live bug, name the mechanism

**Source:** `NAPFooter.jsx:1-22`, `formatPhone.js:1-10`, `Breadcrumbs.jsx:1-13`,
`RatingBadge.jsx:1-14`, `geo.js:1-11`, `locks.test.js:1-9`
**Apply to:** every new `.js`/`.mjs`/`.jsx` file, and every modified one

The house style is a block comment that answers three questions in order: **which lock**, **what
live-site defect proves the lock is necessary**, and **what structural mechanism makes the defect
unexpressible**. The canonical example (`NAPFooter.jsx:1-22`):

```js
/**
 * NAPFooter — Beyond House Cleaning
 *
 * LOCK 4: exactly one tel: in the footer, and the href digits MUST equal the
 *         displayed digits.
 * LOCK 5: no street address or UK postcode anywhere in rendered output.
 *
 * Lock 4 exists because of a live bug: the footer on all 115 pages DISPLAYS
 * +44 7861 936533 and DIALS 07441918832. A third number (+447575709361) sits
 * on /get-a-quote. Phrasing the rule as "href digits must equal displayed
 * digits" is what would actually have caught it — "use the right number"
 * would not have.
 *
 * `formatPhone` derives the display string FROM the dial string, so the two
 * cannot diverge. There is no prop for the displayed text.
 * ...
 */
```

Mechanics to copy: `LOCK n:` in caps with the rule stated as an assertion; `DISPLAYS`/`DIALS`-style
caps for the contrasting facts; en-dashes and em-dashes (`—`) not hyphens; ~78-column wrap;
concrete numbers (`115 pages`, `516 KB`, `0 of 115`) rather than adjectives.

New enforcement files should say which SC / lock IDs they cover and, where applicable, which
measured number motivates the threshold (e.g. `check-budget.mjs` → the 1,901 KB live-site figure).

### 3. Pure logic in `.js`, JSX in `.jsx` — and say why in the header

**Source:** `formatPhone.js:1-10`, `geo.js:1-11`, `locks.test.js:17-18`
**Apply to:** `design-system/src/jsonLd.js`, `check-html-locks.mjs`, `check-budget.mjs`

```js
// Import the PURE modules — node --test cannot parse JSX, and the locks are
// deliberately implemented in plain JS so they are testable without a build.
```
— `locks.test.js:17-18`

Two independent reasons make this non-negotiable here:
1. `node --test` has no JSX transform — logic in a `.jsx` file is untestable without a toolchain,
   and D-12 forbids adding one.
2. The `claude-seo` PostToolUse hook rejects `.jsx`/`.tsx` writes containing the case-insensitive
   substring `REPLACE`, which every `.replace(` call contains (RESEARCH Pitfall 5). The JSON-LD
   escape is literally `.replace(/</g, '\\u003c')`.

**Every `.replace(` in this repo today is in a `.js` file** — `formatPhone.js:13, 22`,
`locks.test.js:23, 40, 57, 79-81`. Zero are in `.jsx`. Keep that invariant.

### 4. Assertions read files off disk; never assert against a live browser DOM

**Source:** `locks.test.js:47-50, 73, 98, 117-120`
**Apply to:** `check-html-locks.mjs`, `check-budget.mjs`

The existing locks all do `readFileSync(...)` + regex against source or preview HTML. The new
scripts do the same against `web/.next/server/app/index.html` — the file `next build` writes to
disk. `01-VALIDATION.md` line 15-19 states why: reading the on-disk file *proves the output is
server-rendered*, which is exactly what Locks 3 and 9 exist to guarantee. A browser-based check
would pass even if the content were client-injected, defeating the point.

Path-resolution idiom to copy (`locks.test.js:22`):

```js
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
```

### 5. ESM with explicit file extensions

**Source:** `NAPFooter.jsx:24`, `src/index.js:1-11`, `locks.test.js:19-20`
**Apply to:** every new JS file

```js
import { formatPhone, toDial } from './formatPhone.js';
export { Button } from './components/Button/Button.jsx';
```

`"type": "module"` everywhere; relative imports always carry the extension, including `.jsx`. No
CommonJS, no extensionless relative imports, no path aliases inside the package (`web/` may add
`@/` aliases via `jsconfig.json` — that is Claude's Discretion).

### 6. Named exports + a default only on components

**Source:** `NAPFooter.jsx:30, 124`; `Breadcrumbs.jsx:17, 67`; vs. `formatPhone.js`, `geo.js`
**Apply to:** `jsonLd.js` (named only), any new component (both)

Components export both (`export function NAPFooter(...)` … `export default NAPFooter;`). Pure `.js`
helpers export **named only** — neither `formatPhone.js` nor `geo.js` has a default export.

---

## No Analog Found

Files with no close match in the codebase. The planner should use `01-RESEARCH.md § Code Examples`
and `§ Architecture Patterns`, all of which were verified by an actual scratch build rather than
reasoned about.

| File | Role | Data Flow | Reason | Use instead |
|------|------|-----------|--------|-------------|
| `web/app/layout.jsx` | layout | request-response (SSG) | No React app exists in this repo at all — no layout, no page, no route | RESEARCH § Pattern 1 (lines 342-380) |
| `web/next.config.mjs` | config | n/a | No Next.js config has ever existed here | RESEARCH § Pattern 2 (lines 381-394) |
| `.github/workflows/ci.yml` | CI config | batch | **The repo has no `.github/` directory and no CI of any kind** | RESEARCH § Code Examples (lines 745-781) |
| `package.json` (root) | config | n/a | No root manifest exists; repo is not currently a workspace | RESEARCH § Code Examples (lines 672-682); borrow *formatting* from `design-system/package.json` |
| `web/package.json` | config | n/a | Only one package.json exists in the repo | Same as above |
| `web/app/robots.js` | route handler | request-response | No robots/SEO route precedent | Next.js docs; D-15 requires `Disallow: /` |
| `web/app/not-found.jsx` (optional) | page | request-response (SSG) | No pages exist | Compose from package components per `conventions.md` |
| `web/jsconfig.json` (optional) | config | n/a | No JS/TS config in repo | Discretionary |

---

## Notes for the Planner

1. **`check-html-locks.mjs` is the file most at risk of style drift.** It is the largest new file
   with a strong existing analog, and the temptation to reach for a DOM parser (`cheerio`,
   `jsdom`, `linkedom`) or a test framework will be strong. The analog proves regex-against-string
   is the house answer and it is sufficient for all 13 assertions in `01-VALIDATION.md`. Zero
   dependencies is D-12.

2. **The `jsonLd.js` work touches four files, three of which are D-05-locked components.** Scope it
   as one task with an explicit "1 import line + 1 identifier swap per component, no other change"
   instruction, and gate it on `node --test design-system/test/*.test.js` still returning 8/8 (or
   9/9 if the optional escape test is added).

3. **`conventions.md` is wrong about `styles.css` importing fonts.** Verified above. If the plan
   quotes `conventions.md` anywhere, do not carry that claim. The `exports`-map fix exists
   *because* fonts are not in the import closure.

4. **Nothing in this phase should produce a `design-system/dist/`, a build script, or a
   `devDependencies` block in the design-system package.** CONTEXT.md §Specifics: everything must
   work from a clean checkout with no design-system build. That constraint is what makes the
   whole zero-dependency lock harness viable.

---

## Metadata

**Analog search scope:** entire repo (`design-system/`, `docs/`, `assets/`, `.planning/`) —
the tree is small enough that a full `find` was exhaustive rather than sampled.
**Files scanned:** 82 tracked files; 11 read in full or targeted
(`test/locks.test.js`, `src/index.js`, `package.json`, `NAPFooter.jsx`, `formatPhone.js`,
`Breadcrumbs.jsx`, `RatingBadge.jsx`, `geo.js:1-40`, `.design-sync/conventions.md`,
`.design-sync/previews/NAPFooter.tsx`, `styles.css:1-20`, `fonts/fonts.css:1-14`, `.gitignore`)
**Project instructions:** no `CLAUDE.md`, no `.claude/skills/`, no `.agents/skills/` in this repo
**Pattern extraction date:** 2026-08-08
