---
phase: 2
slug: component-library-completion-core-templates
kind: patterns
created: 2026-08-09
---

# Phase 2: Component Library Completion & Core Templates — Pattern Map

**Mapped:** 2026-08-09
**Files analyzed:** 98 (86 new · 12 rewritten/modified)
**Analogs found:** 88 / 98 with a concrete in-repo analog · 10 with none (listed in §5)

Sources read in full for this map: all four files of `NAPFooter`, `InterlinkBlock`, `RatingBadge`,
`Hero`, `Button`, `Breadcrumbs`; `src/index.js`; `src/jsonLd.js`; `src/components/*/formatPhone.js`
and `geo.js`; `styles.css`; `tokens.css`; `package.json`; `.design-sync/{config.json,conventions.md,NOTES.md}`;
`test/{locks.test.js,run-locks.mjs}`; `web/app/{layout.jsx,page.jsx}`; `web/scripts/{check-html-locks.mjs,check-budget.mjs}`;
`web/{package.json,next.config.mjs}`; `.github/workflows/ci.yml`; `design-system/README.md`.

---

## 0. Hard constraints every pattern below inherits

Carry these into every plan action. They are not stylistic preferences — each one is asserted by
a lock or a locked decision.

| Constraint | Source | What it forbids |
|---|---|---|
| **Zero dependencies, no build step** | `design-system/package.json` has no `dependencies`/`devDependencies`; D-06 | Any `import` in `src/` other than a sibling package file. Not `react` (except `import type` in `.d.ts`), not `next/link`, not an icon set |
| **React Server Components only, no client boundary anywhere** | D-07, UI-SPEC §8, `check-html-locks.mjs` SC-4g | The string `use client` under `design-system/src` or `web/app`. `useState`, `useEffect`, `onClick`, any event handler prop |
| **Styling is `bhc-` classes + `var(--bhc-*)` only** | D-04, `conventions.md`, `styles.css` | A literal hex in a new CSS block; a second CSS file; a route-level `import './x.css'` (Pitfall 7) |
| **All 61 tokens live once, in `tokens.css`** | D-04, `check-html-locks.mjs` SC-1b (`--bhc-ink` declared exactly once) | Re-declaring a token; importing `tokens.css` alongside `styles.css` |
| **Pure logic goes in a plain `.js` sibling, never `.jsx`** | `formatPhone.js`, `geo.js`, `jsonLd.js` precedent; the `claude-seo` hook rejects a `.jsx` write containing `REPLACE` (so any `.replace(`) | `.replace(`, `JSON.stringify`, string-munging inside a `.jsx` |
| **Every component is exactly four files** | UI-SPEC §7, delta 9 | A fifth file in the dir; a missing one |

---

## 1. File Classification

### 1a. The sixteen components — 64 files, one template (`design-system/src/components/<Name>/`)

Every row is four files: `<Name>.jsx`, `<Name>.html`, `<Name>.d.ts`, `<Name>.prompt.md`.
`Group` is simultaneously the `@dsCard group="…"` on line 1 of the `.html` **and** the `category:`
frontmatter on the `.prompt.md` — delta 9 asserts they agree.

| # | Component | Group | Role | Data flow | Closest analog | Match |
|---|---|---|---|---|---|---|
| 1 | Header | Navigation | landmark + nav tree | static render, nested tree data | `NAPFooter/NAPFooter.jsx` | role-match |
| 2 | Footer | Navigation | composition layer (emits no element) | data pass-through | `web/app/layout.jsx` call site + `NAPFooter` `columns`/`legal` props | partial |
| 3 | SkipLink | Navigation | single-element utility | static, no props | `Button/Button.jsx` (smallest component); `.bhc-skip-link` already at `styles.css:51` | role-match |
| 4 | SectionBand | Content | layout container | static, `children` | `InterlinkBlock/InterlinkBlock.jsx` | **exact** |
| 5 | Prose | Content | content container | static, `children` | `InterlinkBlock.jsx` wrapper + descendant-CSS idiom at `styles.css:260`, `styles.css:85` | role-match |
| 6 | ServiceCard | Content | card | static | `InterlinkBlock.jsx` `.bhc-interlink__link` + `styles.css:232-249` | **exact** (UI-SPEC §7.6 names it) |
| 7 | TownCard | Content | card | static | same as ServiceCard | **exact** |
| 8 | ProcessSteps | Content | ordered list | static | `InterlinkBlock.jsx` list map | role-match |
| 9 | FAQAccordion | Content | disclosure list | static, `return null` on empty | `InterlinkBlock.jsx` (null-guard + `aria-labelledby`/`id` pairing) | role-match |
| 10 | CTABand | Content | section | static | `InterlinkBlock.jsx` section + `Hero.jsx:59-72` actions→Button | role-match |
| 11 | QuoteFormEntry | Actions | panel | static, phone consumer | `NAPFooter.jsx:46-47,74-76` phone derivation + `Hero.jsx` actions | role-match |
| 12 | StickyCallBar | Actions | fixed action bar | static, phone consumer | `NAPFooter.jsx:46-47,74-76` + `Button.jsx` | role-match |
| 13 | ReviewCard | Trust | card | static | `RatingBadge/RatingBadge.jsx:18-30` (`Star` glyph) + `InterlinkBlock` card CSS | **exact** (star half) |
| 14 | ReviewRail | Trust | section + scroll region | static, `return null` on empty | `InterlinkBlock.jsx:37` + `:39-60` | **exact** |
| 15 | TrustBar | Trust | list | static | `InterlinkBlock.jsx` list + `RatingBadge.jsx:20` SVG a11y | role-match |
| 16 | BeforeAfterSlider | Trust | figure, two states | static, never null | `Hero.jsx:75-90` `<img>` block + `RatingBadge.jsx:20` SVG | role-match |

**Do not invent a fifth group.** The converter cards by these four values only (`NOTES.md`
"Component grouping comes from `@dsCard`").

### 1b. Package support files — 10

| File | Role | Change | Closest analog | Match |
|---|---|---|---|---|
| `design-system/src/phone.js` | pure config module, package-internal | **NEW** | `design-system/src/jsonLd.js` (same containment: not re-exported from `index.js`) | **exact** |
| `design-system/src/index.js` | barrel | MODIFY — +16 named exports | itself | exact |
| `design-system/styles.css` | stylesheet | MODIFY — +16 commented blocks, +2 focus overrides | its own `/* --- Name --- */` section idiom | exact |
| `design-system/.design-sync/config.json` | config | MODIFY — +16 `componentSrcMap`, +16 `docsMap` | itself | exact |
| `design-system/src/components/NAPFooter/NAPFooter.jsx` | component | MODIFY — delete the `:34` literal, import `CANONICAL_PHONE`; WR-10 `mapsUrl` scheme guard | itself | exact |
| `design-system/src/components/NAPFooter/formatPhone.js` | pure logic | MODIFY — `toDial` throws (delta 13) | itself | exact |
| `design-system/src/components/Breadcrumbs/Breadcrumbs.jsx` | component | MODIFY — WR-12 + §13-R `aria-current` rule | itself | exact |
| `design-system/src/components/Breadcrumbs/Breadcrumbs.html` | preview | MODIFY — see §6 finding 10 | itself | exact |
| `design-system/src/components/Hero/Hero.prompt.md` | doc | MODIFY — whole "Heading per template" table (§13-N) | itself | exact |
| `design-system/README.md` | doc | MODIFY — component table grows 6 → 22 rows | itself | exact |

### 1c. Lock harness — 4

| File | Role | Change | Closest analog | Match |
|---|---|---|---|---|
| `design-system/test/locks.test.js` | unit tests (fs + pure JS scans) | MODIFY — deltas 9/13/14; raise `previews.length >= 6` | its own `walk()` + `assert.ok(x.length >= n)` idiom | exact |
| `design-system/test/run-locks.mjs` | runner/gate | MODIFY — `MIN_TESTS` 14 → exact post-phase count | itself | exact |
| `web/scripts/check-html-locks.mjs` | integration tests over built HTML | **REWRITE** — single-page → `prerender-manifest.json`-driven multi-page; deltas 1–8, 11, 12 + 4 unlisted corrections | itself (idiom) + `02-RESEARCH.md` § *Recommended harness shape* (architecture) | partial |
| `web/scripts/check-budget.mjs` | script | **REWRITE** — single-page → worst-page | itself (idiom) + `02-RESEARCH.md` § *Recommendation for `check-budget.mjs`* | partial |

### 1d. App — 24

| File | Role | Change | Closest analog | Match |
|---|---|---|---|---|
| `web/jsconfig.json` | config | **NEW** | none in repo | **no analog** |
| `web/content/site.js` | data module | **NEW** | `geo.js` for module shape | partial |
| `web/content/blocks.jsx` | prose-block renderer (the only `.jsx` in `web/content/`) | **NEW** | none — returns elements, carries no copy and no string manipulation | **no analog** |
| `web/content/legal.js` | data module | **NEW** | as `utility.js` | partial |
| `web/content/home.js` | data module | **NEW** | as `utility.js` | partial |
| `web/content/services.js` | data module | **NEW** | none — `geo.js` is logic, not copy | **no analog** |
| `web/content/utility.js` | data module | **NEW** | as above | **no analog** |
| `web/content/nav.js` | data module | **NEW** | `NAPFooter` `columns`/`legal` prop shape (`NAPFooter.d.ts:1-2`) is the target schema | partial |
| `web/content/faqs.js` | data module | **NEW** | none | **no analog** |
| `web/content/process.js` | data module | **NEW** | none | **no analog** |
| `web/app/layout.jsx` | route layout | REWRITE — add SkipLink/Header/`<main id="main">`/Footer/StickyCallBar | itself | exact |
| `web/app/page.jsx` | route (Home) | REWRITE | itself + `conventions.md` § *An idiomatic composition* | exact |
| `web/app/not-found.jsx` | route | **NEW** | `web/app/page.jsx` shape | role-match |
| `web/app/services/[service]/page.jsx` | dynamic route ×6 | **NEW** | none in repo — `02-RESEARCH.md` § *The service route* is the verified template | **no analog** |
| `web/app/{privacy-policy,terms-of-service,checklist,about-us,contact-us,customer-login,get-a-quote,gift-cards,work-with-us,customer-service-agreement}/page.jsx` | routes ×10 | **NEW** | `web/app/page.jsx` | role-match |

### 1e. Docs outside the package — 1

| File | Change | Note |
|---|---|---|
| `docs/design/design-system.md:334` | MODIFY — drop the word *Services* from the §3.2 Service `H1` example | **Verified in place.** Line 334 currently reads `H1 Deep Cleaning Services in Warwickshire & the West Midlands` |

---

## 2. Pattern Assignments — the component four-file template

This is the highest-value section: 64 of the ~86 new files are four repetitions of one shape,
sixteen times. Copy these excerpts verbatim in structure.

### 2.1 `<Name>.jsx` — the component

**Analogs:** `InterlinkBlock/InterlinkBlock.jsx` (the closest single template), `NAPFooter/NAPFooter.jsx`,
`RatingBadge/RatingBadge.jsx`, `Hero/Hero.jsx`, `Button/Button.jsx`.

#### (a) File header comment — mandatory, and it states *evidence*, not intent

Every shipped `.jsx` opens with a block comment naming the lock it serves and the measured
live-site defect it prevents. `InterlinkBlock.jsx:1-26`:

```jsx
/**
 * InterlinkBlock — Beyond House Cleaning
 *
 * LOCK 6: present on the service, town-hub and combo templates.
 *
 * This is the component that decides whether ~336 pages works.
 *
 * On the live site, four arbitrary combo pages sit in the global footer with
 * 114 inbound links each; the other 91 get a MEDIAN OF 4, all from ad-hoc
 * prose. There is no hub-and-spoke at all. Four hardcoded footer links cannot
 * distribute authority across 336 destinations.
 *
 * The fix: links are COMPUTED FROM GEOGRAPHY, never hand-picked, so they
 * cannot rot as towns are added.
 * ...
 */
```

`RatingBadge.jsx:1-14` and `NAPFooter.jsx:1-22` follow the same shape. `Button.jsx:1-10` shows the
minimal form for a component with no numbered lock:

```jsx
/**
 * Button — Beyond House Cleaning
 *
 * Renders an <a> when `href` is given, otherwise a <button>. Every CTA on the
 * site converges on the quote flow, so the anchor form is the common case.
 *
 * ACCESSIBILITY LOCK: the primary variant is orange with an INK label.
 * White on #F06C24 measures 3.05:1 against a 4.5:1 requirement. Ink on orange
 * is 5.17:1. Do not "fix" the label to white.
 */
```

For the sixteen, the "why" is in UI-SPEC §7.1–§7.16 and §4's measured ratios. Quote the ratio,
not the adjective.

#### (b) Imports — sibling relative paths only, `.jsx`/`.js` extension always written

```jsx
// InterlinkBlock.jsx:28 — a re-export of the pure sibling
export { distanceMiles, nearestTowns, buildInterlinks } from './geo.js';

// NAPFooter.jsx:24-25
import { formatPhone, toDial } from './formatPhone.js';
import { safeJsonLd } from '../../jsonLd.js';

// Hero.jsx:20-21 — cross-component import
import { RatingBadge } from '../RatingBadge/RatingBadge.jsx';
import { Button } from '../Button/Button.jsx';
```

No `import React`. No bare specifiers. Extensions are mandatory (the package is `"type": "module"`
and untranspiled).

#### (c) Named function export with destructured defaults, plus a default export

```jsx
// InterlinkBlock.jsx:30-37
export function InterlinkBlock({
  variant = 'services',
  heading,
  intro,
  links = [],
  className = '',
}) {
  if (!links.length) return null;
```

```jsx
// InterlinkBlock.jsx:64
export default InterlinkBlock;
```

Every one of the six ends with `export default <Name>;`. Array props default to `[]`,
`className` defaults to `''`.

#### (d) The className merge idiom — identical in all four components that take `className`

```jsx
// InterlinkBlock.jsx:41
className={['bhc-interlink', className].filter(Boolean).join(' ')}

// NAPFooter.jsx:66
className={['bhc-footer', className].filter(Boolean).join(' ')}

// Breadcrumbs.jsx:35
className={['bhc-breadcrumbs', className].filter(Boolean).join(' ')}

// RatingBadge.jsx:45 — with a conditional modifier in the middle
className={['bhc-rating', bare ? 'bhc-rating--bare' : '', className].filter(Boolean).join(' ')}
```

Use the four-element form for **SectionBand** (`tone`), **TrustBar** (`tone`), **CTABand**
(`tone`), **Prose** (`width`), **BeforeAfterSlider** (state).

#### (e) Variant → class lookup maps with a fallback — copy for `tone` / `width` / `variant`

`Button.jsx:12-37` is the only shipped example and it is the right shape for
`SectionBand.tone`, `TrustBar.tone`, `CTABand.tone`, `Prose.width`, `SectionBand.width`:

```jsx
const SIZES = { sm: 'bhc-btn--sm', md: 'bhc-btn--md', lg: 'bhc-btn--lg' };
const VARIANTS = {
  primary: 'bhc-btn--primary',
  secondary: 'bhc-btn--secondary',
  ghost: 'bhc-btn--ghost',
};

export function Button({ children, href, variant = 'primary', size = 'md', ... }) {
  const classes = [
    'bhc-btn',
    VARIANTS[variant] || VARIANTS.primary,   // unknown value degrades to the default,
    SIZES[size] || SIZES.md,                 // it never emits `bhc-btn--undefined`
    className,
  ]
    .filter(Boolean)
    .join(' ');
```

Note `SectionBand tone="paper"` must map to **no modifier class** (`bhc-section` alone) — the
shipped CSS has `.bhc-section--warm/--tint/--navy` but no `--paper` (`styles.css:81-85`). Use
`{ paper: '', warm: 'bhc-section--warm', ... }` and let `.filter(Boolean)` drop it.

#### (f) Empty-data behaviour — three distinct precedents, pick per UI-SPEC §11

```jsx
// return null — InterlinkBlock.jsx:37, Breadcrumbs.jsx:20
if (!links.length) return null;
```
→ **ReviewRail** and **FAQAccordion** (UI-SPEC §11).

```jsx
// throw on a required prop — Hero.jsx:33-35
if (!heading) {
  throw new Error('Hero: `heading` is required — it renders the page <h1>.');
}
```
→ any component whose absent prop would silently ship a broken page. Note delta 13 applies the
same philosophy to `toDial`: fail at build time across 17 (later ~410) prerendered pages rather
than ship a dead `tel:`.

```jsx
// render a visible, labelled state — BeforeAfterSlider only (SC-3). NO analog exists;
// the nearest thing in-repo is Hero.html's honest data-URI placeholder + its real alt text.
```

#### (g) Conditional sub-blocks — ternary to `null`, never `&&`

```jsx
// Hero.jsx:45-57
{rating ? (
  <div className="bhc-hero__rating">
    <RatingBadge {...rating} bare />
  </div>
) : null}

{eyebrow ? <p className="bhc-hero__eyebrow">{eyebrow}</p> : null}

<h1 className="bhc-hero__heading">{heading}</h1>

{lead ? <p className="bhc-hero__lead">{lead}</p> : null}
```

```jsx
// InterlinkBlock.jsx:54
{link.meta ? <span className="bhc-interlink__meta">{link.meta}</span> : null}
```

Zero uses of `&&` in JSX across all six components. Keep it that way — `0 && …` renders `0`.

#### (h) List rendering, keys, and defensive guards on data-fed arrays

```jsx
// InterlinkBlock.jsx:50-57 — key is the href
{links.map((link) => (
  <li key={link.href}>
    <a className="bhc-interlink__link" href={link.href}>
      <span className="bhc-interlink__label">{link.label}</span>
      {link.meta ? <span className="bhc-interlink__meta">{link.meta}</span> : null}
    </a>
  </li>
))}
```

```jsx
// Breadcrumbs.jsx:43 — key falls back when href is absent
<li key={item.href || item.label} …>

// Hero.jsx:63 — key falls back to the index
<Button key={action.href || i} …>
```

**The guard idiom — copy this into `Header` and `Footer` verbatim.** `NAPFooter.jsx:89-107`:

```jsx
{/*
  Guards only — the markup, class names, props and defaults below are
  unchanged. `col.links.map` on a column without `links` throws
  during server render, and this footer is in the root layout, so a
  single malformed entry in a Phase-3 nav data file would 500 EVERY
  route rather than break one list.
*/}
{columns.filter(Boolean).map((col) => (
  <nav key={col.heading} aria-label={col.heading}>
    <p className="bhc-footer__col-heading">{col.heading}</p>
    <ul className="bhc-footer__links">
      {(col.links || []).map((l) => (
        <li key={l.href}>
          <a href={l.href}>{l.label}</a>
        </li>
      ))}
    </ul>
  </nav>
))}
```

`Header` renders a `NavItem[]` with optional `children[]` from `web/content/nav.js` inside the
root layout — the same 500-every-route blast radius. `.filter(Boolean)` + `(x.children || [])`
is not optional.

#### (i) Inline SVG — the shipped a11y precedent, and delta 14 makes it assertable

`RatingBadge.jsx:18-30` is the reference for **both** halves of UI-SPEC §1's SVG rule:

```jsx
function Star({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

…and the *meaningful* wrapper, `RatingBadge.jsx:46-56`:

```jsx
const label = `Rated ${rating} out of 5 from ${count} ${source} reviews`;
…
<span className="bhc-rating__stars" role="img" aria-label={label}>
  {[1, 2, 3, 4, 5].map((i) => <Star key={i} filled={i <= rounded} />)}
</span>
<span aria-hidden="true">
  <span className="bhc-rating__value">{rating}</span>{' '}
  <span className="bhc-rating__count">from {count} {source} reviews</span>
</span>
```

Note the pattern: the label is built once into a `const`, the glyphs are `aria-hidden`, the
wrapper carries `role="img"` + `aria-label`, **and the visible duplicate text is `aria-hidden`
so it is not announced twice.**

- **ReviewCard** reuses `Star` exactly (UI-SPEC §7.13 says "same `Star` glyph"). Extract it or
  import it from `../RatingBadge/RatingBadge.jsx` — but note it is currently a module-local
  function, **not exported**. Exporting it is the cleaner move and costs one line.
- **TrustBar**, **FAQAccordion** chevron, **Header** menu glyph → `aria-hidden="true" focusable="false"`.
- **BeforeAfterSlider** State-B panels → `role="img"` + `aria-label`, **never `alt`** (invalid on
  `<svg>`, silently dropped, and Lock 7 greps `<img>` only).
- Delta 14 will fail any `<svg>` in package source carrying `alt`, or carrying neither
  `aria-hidden="true"` nor `role="img"` + a non-empty `aria-label`. All existing SVGs already
  comply, so the lock passes on landing.

#### (j) `<img>` — `Hero.jsx:75-90` is the only shipped example

```jsx
{image && align !== 'centered' ? (
  <div className="bhc-hero__media">
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes || '(min-width: 900px) 50vw, 100vw'}
      alt={image.alt}
      width={image.width}
      height={image.height}
      /* LCP element — never lazy, always high priority */
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  </div>
) : null}
```

**BeforeAfterSlider State A inverts the last three:** `loading="lazy" decoding="async"`, no
`fetchPriority` — the LCP element is Hero's image, never this one (UI-SPEC §7.16). `alt` stays
required (Lock 7).

#### (k) `aria-labelledby` ↔ `id` pairing for a labelled section

```jsx
// InterlinkBlock.jsx:40-46
<section
  className={…}
  aria-labelledby={`interlink-${variant}`}
>
  <div className="bhc-container">
    <h2 className="bhc-interlink__heading" id={`interlink-${variant}`}>
      {heading}
    </h2>
```

Copy for **SectionBand**, **FAQAccordion** (UI-SPEC §7.9 shows `aria-labelledby="faq-heading"` /
`<h2 id="faq-heading">`), **ReviewRail**, **CTABand**. Note the id is **derived from a prop**, not
hardcoded — mandatory, because these components appear more than once per page.

#### (l) JSON-LD — none of the sixteen emits any, but the lock still binds

`locks.test.js:282-335` fails **any** file under `design-system/src` that contains
`JSON.stringify`, and fails any file containing the `application/ld+json` marker that does not
also call `safeJsonLd(`. The three shipped emitters route through it identically:

```jsx
// NAPFooter.jsx:25 / Breadcrumbs.jsx:15 / RatingBadge.jsx:16
import { safeJsonLd } from '../../jsonLd.js';

// NAPFooter.jsx:124-127 — the emitter shape, identical in all three
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
/>
```

`safeJsonLd` is **deliberately not re-exported from `src/index.js`** (`jsonLd.js:22`) — it is
package-internal plumbing. The same containment applies to the new `phone.js`.

**Phase 2 emits no new JSON-LD.** `FAQAccordion` must not emit `FAQPage` — ever (D13, delta 7).
`ReviewCard` emits no review schema (UI-SPEC §7.13). Keep the emitter count at 3 so SC-4f's
replacement can assert a flat 1-on-home / 2-elsewhere. The lock's `emitters.length >= 3` floor
stays satisfied unchanged.

### 2.2 `<Name>.html` — the preview

Six shipped previews; **three distinct shapes.** Every one opens with the same two lines.

#### The mandatory first two lines — lock-asserted

```html
<!-- @dsCard group="Navigation" -->
<link rel="stylesheet" href="../../../styles.css" />
```

`locks.test.js:209-224` asserts line 1 matches `/^<!--\s*@dsCard group="[^"]+"\s*-->$/` **exactly**
— no leading whitespace, no trailing content, straight quotes. The `../../../styles.css` path is
relative to `src/components/<Name>/` and resolves to `design-system/styles.css`; it is identical
in all six.

Delta 9 additionally asserts the `group="…"` value equals the sibling `.prompt.md`'s `category:`.

#### Shape A — full-bleed component, then a "the live-site bug this prevents" caption

`NAPFooter.html` (61 lines) and `Hero.html` (56 lines). The caption block is verbatim-copyable:

```html
<div style="padding:32px 48px;background:var(--bhc-paper)">
  <p style="font:600 12px/1 var(--bhc-font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--bhc-danger);margin:0 0 12px">The live-site bug this prevents</p>
  <p style="font:400 15px/1.6 var(--bhc-font-body);color:var(--bhc-ink-muted);margin:0;max-width:70ch">
    …one paragraph, with the measured numbers…
  </p>
</div>
```

Use `--bhc-danger` for the eyebrow when it is a bug caption, `--bhc-ink-muted` when it is a
"why this component exists" caption (`InterlinkBlock.html:32`, `Breadcrumbs.html:39`).

#### Shape B — a variant grid, one labelled cell per variant

`RatingBadge.html` and `Button.html`. The cell label idiom:

```html
<div style="padding:48px;display:grid;gap:40px;background:var(--bhc-paper)">
  <div>
    <p style="font:600 12px/1 var(--bhc-font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--bhc-ink-muted);margin:0 0 16px">Primary — orange fill, ink label (5.17:1)</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
      <a class="bhc-btn bhc-btn--primary bhc-btn--sm" href="#">Get a Quote</a>
      …
    </div>
  </div>
  …
</div>
```

`Button.html:32-36` also shows the **negative cell** — rendering the failing pairing once, clearly
labelled, so the failure is recognisable:

```html
<div style="border-top:1px solid var(--bhc-line);padding-top:24px">
  <p style="…color:var(--bhc-danger);…">Never — white on orange is 3.05:1</p>
  <span class="bhc-btn bhc-btn--md" style="background:var(--bhc-action);color:#fff">Get a Quote</span>
  <p style="…">Shown only so the failure is recognisable. Ink labels pass at 5.17:1.</p>
</div>
```

→ Use Shape B for **SectionBand** (4 tones), **TrustBar** (3 tones), **Button-adjacent**
components, **BeforeAfterSlider** (State A + State B side by side), **ServiceCard**/**TownCard**
(default + hover annotation).

#### Shape C — repeated real instances on differently-toned grounds

`InterlinkBlock.html:3-29` and `Breadcrumbs.html:3-37`: two or three full instances with a
one-line uppercase label above each, wrapped in a `<div style="background:var(--bhc-paper)">`.
→ Use for **Header** (mobile vs desktop is CSS-driven, so show one), **FAQAccordion** (one
`<details open>` + two closed), **ReviewRail**, **ProcessSteps**.

#### Two things the `.html` is NOT decorative for

1. `locks.test.js:189-205` (Lock 7) scans **every `.html` under `src`** for `<img>` without
   non-empty `alt`. Delta 14 will add the `<svg>` scan to the same walk.
2. `locks.test.js:133-154` (Lock 5) scans `.jsx`/`.html`/`.css` under `src` for a UK postcode
   — **after** stripping `/* */`, `//` and `<!-- -->` comments. Preview copy is real rendered
   output as far as that lock is concerned. Note `.d.ts` and `.prompt.md` are **not** scanned.

Inline `style="…"` is used freely in the previews (they are static demo documents, not shipped
markup) but **never in the `.jsx`** except for the four shipped cases at `NAPFooter.jsx:81,114`,
`Breadcrumbs.jsx:43` and `Hero.jsx:42` — and `Breadcrumbs.jsx:43`'s is the one WR-12 wants removed.
Do not introduce new inline styles in a `.jsx`.

### 2.3 `<Name>.d.ts` — prop types

**Analogs:** `Button.d.ts` (17 lines, minimal), `Hero.d.ts` (40 lines, nested + cross-import),
`InterlinkBlock.d.ts` (50 lines, multiple interfaces + function declarations).

#### The exact idiom

```ts
// Button.d.ts — the whole file
import type { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  /** Renders an `<a>` instead of a `<button>`. Most CTAs are links to the quote flow. */
  href?: string;
  /** `primary` is orange with an ink label — 5.17:1. Never white-on-orange (3.05:1). */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export declare function Button(props: ButtonProps): JSX.Element;
export default Button;
```

Rules extracted from all six:

| Rule | Evidence |
|---|---|
| `import type { … } from 'react'` — **type-only**, so the zero-runtime-dependency property holds | `Button.d.ts:1` |
| Cross-component prop reuse via `import type` from the sibling path **without** an extension | `Hero.d.ts:1` — `from '../RatingBadge/RatingBadge'` |
| Optional props are `name?: T`. Required props have no `?` and are documented as required | `Hero.d.ts:29` `heading: string;` vs `:24` `eyebrow?: string;` |
| Unions are inline string-literal unions, never a separate `type` alias | `Button.d.ts:8`, `Hero.d.ts:35` |
| JSDoc `/** … */` on any prop with a non-obvious contract — and it carries the **reason**, often a measured number | `Button.d.ts:7`, `NAPFooter.d.ts:6-10`, `RatingBadge.d.ts:9-13` |
| Supporting interfaces are exported and declared **above** the props interface | `InterlinkBlock.d.ts:1-6`, `Hero.d.ts:3-17` |
| Return type is `JSX.Element`, or **`JSX.Element \| null` when the component can return null** | `InterlinkBlock.d.ts:32`, `Breadcrumbs.d.ts:14` |
| Pure sibling helpers are re-declared here with `export declare function` | `InterlinkBlock.d.ts:34-48`, `NAPFooter.d.ts:30` |
| Every file ends `export default <Name>;` | all six |

`JSX.Element | null` is required for **ReviewRail** and **FAQAccordion**.

**The `as?: ElementType` prop (UI-SPEC §13-J) has no analog** — see §5. The type must come from
`import type { ElementType } from 'react'`, extending the `Button.d.ts:1` type-only-import
precedent. Nine of the sixteen take it: Header, Footer, ServiceCard, TownCard, QuoteFormEntry,
StickyCallBar (+ any other link-bearing component the planner identifies).

There is **no `src/index.d.ts` barrel and no `types` field in `package.json`** — deliberate
(`NOTES.md` risk 7, RESEARCH A6). That is exactly why all 32 `.design-sync` map entries are needed.

### 2.4 `<Name>.prompt.md` — the reasoning doc

**Analogs:** `Hero.prompt.md` (67 lines), `NAPFooter.prompt.md` (71), `InterlinkBlock.prompt.md` (75),
`RatingBadge.prompt.md` (53), `Breadcrumbs.prompt.md` (60), `Button.prompt.md` (46).

#### The skeleton, identical in all six

```md
---
category: Navigation
---

# NAPFooter

**Lock 4: exactly one `tel:`, and the `href` digits must equal the displayed digits.**
**Lock 5: no street address or UK postcode anywhere in rendered output.**

## <Why it exists / The bug this component exists to prevent>

…measured evidence, usually a table…

## <Domain sections — Placement / Variants / Schema / Accessibility / Trails per template>

## Don't

- Don't …
- Don't …
```

Concrete rules:

1. **Frontmatter is exactly three lines**, `category:` only, and its value must equal the sibling
   `.html`'s `@dsCard group=`. Delta 9 asserts it. `NOTES.md` says these are *generated from* the
   `@dsCard` marker so the two cannot diverge.
2. **Line 5 is `# <Name>`**, matching the directory and file name.
3. **A bold lock line immediately after the H1** where a lock applies. `Button.prompt.md` has none
   (no numbered lock) and goes straight to a one-paragraph purpose statement — that is the model
   for the components that serve no numbered lock (SectionBand, Prose, ProcessSteps, CTABand,
   QuoteFormEntry, StickyCallBar, ReviewCard, ReviewRail, TrustBar, TownCard).
4. **Evidence is a table, and the numbers are real.** `Hero.prompt.md:26-31`:

```md
| | |
|---|---|
| Location-page H1s containing the town | **0 of 95** |
| Location-page H1s containing the word "clean" | **2 of 95** |
| Most common H1 across the site | `"Reliable & Affordable"` — 30 pages |
```

5. **A closing `## Don't` list of 3–5 imperatives**, present in all six.
6. Cross-links are relative repo paths: `InterlinkBlock.prompt.md:47-48` →
   `[service-area-coverage.md](../../../../docs/research/service-area-coverage.md)`.

#### The heading tables — the shape §13-N requires rewriting

Two shipped precedents. `Hero.prompt.md:44-51` (the one the UI-SPEC commits to replacing in this
phase):

```md
## Heading per template

| Template | `eyebrow` | `heading` → `<h1>` |
|---|---|---|
| Home | `Warwickshire & the West Midlands` | `Professional House Cleaning You Can Actually Rely On` |
| Service | `Reliable & Affordable` | `Deep Cleaning Services in Warwickshire` |
| Town hub | `Local, DBS-checked cleaners` | `House Cleaning in Warwick` |
| Combo | `Reliable & Affordable` | `Deep Cleaning in Warwick` |
```

Replace **all four rows** from UI-SPEC §5's `<h1>` deck. The Home row currently carries neither a
service nor a region (so it fails Lock 1 for its own template); the Service row carries the
redundant word *Services*. Update Town-hub and Combo to the same pattern while there.

`Breadcrumbs.prompt.md:29-39` is the second precedent (`## Trails per template`), and it also
needs the §13-R correction — `Home / Services / Deep Cleaning` becomes `Home / Deep Cleaning`
because `/services` 404s in Phase 2 and delta 6 would fail it.

`RatingBadge.prompt.md:24-32` is a third (`## Placement` — Template → Where).

**Use a `## <X> per template` table in:** `Header.prompt.md` (nav data per phase),
`SectionBand.prompt.md` (tone per section, from UI-SPEC §4's band-ordering block),
`CTABand.prompt.md`, `FAQAccordion.prompt.md`, `BeforeAfterSlider.prompt.md` (State A vs B).

#### Three caveats RESEARCH says must land in a `.prompt.md` so they are not rediscovered

1. `Header.prompt.md` — **why `<details>` is an empty state carrier with the `<ul>` as its
   sibling.** "Someone will later 'tidy' the empty `<details>` by moving the `<ul>` inside it and
   silently break desktop nav." Include the rejected-routes table from UI-SPEC §7.1.
2. `FAQAccordion.prompt.md` — `<h3>` inside `<summary>` has **inconsistent heading exposure**
   across browser/AT pairs; the accessible name is the `<summary>`'s text content, not the `<h3>`.
3. `ReviewRail.prompt.md` / `BeforeAfterSlider.prompt.md` — `tabindex="0"` on a scroll container
   is correct **only because `ReviewCard` has no focusable children**. BeforeAfterSlider State B
   contains a `See What's Included` link, so that link goes **outside** the track, or the track
   omits `tabindex`.

---

## 3. Pattern Assignments — non-component files

### 3.1 `design-system/src/phone.js` — analog `design-system/src/jsonLd.js`

`jsonLd.js` is the exact template: a pure `.js` module, package-internal, **not re-exported from
`src/index.js`**, with a header comment stating both reasons it is not a `.jsx`.

```js
/**
 * JSON-LD serialisation — pure, no React.
 *
 * Lives apart from the three .jsx emitters for two independent reasons:
 * (a) `node --test` has no JSX transform, so logic in a .jsx file is
 *     untestable without a toolchain this package deliberately does not have;
 * (b) the `claude-seo` PostToolUse hook rejects any .jsx/.tsx write containing
 *     the case-insensitive substring REPLACE — which every `.replace(` call
 *     contains. Every `.replace(` in this package is in a .js file. Keep it so.
 * …
 * Package-internal plumbing — deliberately NOT re-exported from src/index.js.
 */

export const safeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
```

`phone.js` exports `CANONICAL_PHONE = '+447861936533'` under the same containment rule.
`NAPFooter`, `Header`, `StickyCallBar` and `QuoteFormEntry` all default from it:

```jsx
// today — NAPFooter.jsx:33-34, the literal being deleted
  /** The ONE number. Everything displayed is derived from it. */
  phone = '+447861936533',

// after
import { CANONICAL_PHONE } from '../../phone.js';
…
  phone = CANONICAL_PHONE,
```

**`toDial` / `formatPhone` stay where they are** (`components/NAPFooter/formatPhone.js`) and are
re-exported from `NAPFooter.jsx:29`:

```jsx
import { formatPhone, toDial } from './formatPhone.js';
…
export { formatPhone, toDial };
```

…which `src/index.js:5` then surfaces as `export { NAPFooter, formatPhone } from './components/NAPFooter/NAPFooter.jsx';`.
Note `toDial` is re-exported from `NAPFooter.jsx` but **not** from `index.js` today. `Header`,
`StickyCallBar` and `QuoteFormEntry` should import `formatPhone`/`toDial` from
`'../NAPFooter/formatPhone.js'` directly (sibling-relative, like `Hero.jsx:20-21`) rather than
through the barrel — importing from `index.js` inside a component would be circular.

The derivation idiom to copy — `NAPFooter.jsx:46-47` and `:73-76`:

```jsx
const display = formatPhone(phone);
const dial = toDial(phone);
…
{/* The single tel:. href and text both derive from `phone`. */}
<a className="bhc-footer__phone" href={`tel:${dial}`}>
  {display}
</a>
```

**There is deliberately no prop for the displayed text.** `StickyCallBar`'s `Call` label is
digit-free by design and carries `aria-label="Call Beyond House Cleaning"` — which is exactly why
delta 2(d) must read *text content*, not the raw tag string.

### 3.2 `design-system/styles.css` — 16 appended blocks

The section idiom, with the rationale in the banner (`styles.css:87-89`, `:142-144`, `:200-201`,
`:219-220`, `:251-253`):

```css
/* --- Button --------------------------------------------------------------
   Orange fills take INK labels, never white. White on --bhc-action is
   3.05:1 against a 4.5:1 requirement.                                     */
```

```css
/* --- InterlinkBlock -------------------------------------------------------
   The critical path. Must look deliberate, not like an SEO footer dump.   */
```

The card treatment **ServiceCard and TownCard must match** — `styles.css:232-249`:

```css
.bhc-interlink__link {
  display: flex; flex-direction: column; gap: 2px;
  padding: var(--bhc-space-4);
  background: var(--bhc-paper);
  border: 1px solid var(--bhc-line);
  border-radius: var(--bhc-radius-md);
  text-decoration: none;
  color: var(--bhc-ink);
  transition: border-color var(--bhc-dur) var(--bhc-ease),
              box-shadow var(--bhc-dur) var(--bhc-ease);
}
.bhc-interlink__link:hover {
  border-color: var(--bhc-action);
  box-shadow: var(--bhc-shadow-md);
  color: var(--bhc-ink);
}
.bhc-interlink__label { font-weight: var(--bhc-weight-semibold); }
.bhc-interlink__meta  { font-size: var(--bhc-text-sm); color: var(--bhc-ink-muted); }
```

The auto-fill grid idiom (`styles.css:227-231`) — TownCard's `minmax(200px, 1fr)` and
ServiceCard's grid both derive from it:

```css
.bhc-interlink__list {
  display: grid; gap: var(--bhc-space-3);
  list-style: none; margin: 0; padding: 0;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
```

The descendant-styling idiom that **Prose** needs (`styles.css:85`, `:260-261`):

```css
.bhc-section--navy :where(h1, h2, h3, h4) { color: var(--bhc-paper); }
.bhc-footer a { color: var(--bhc-paper-warm); text-decoration: none; }
.bhc-footer a:hover { color: var(--bhc-sponge); text-decoration: underline; }
```

`:where()` keeps specificity at zero so a component class still wins — the right tool for
`.bhc-prose :where(p, h2, h3, ul, ol, a)`.

Media-query idiom — `min-width` only, mobile-first (`styles.css:153`, `:267`):

```css
@media (min-width: 900px) { .bhc-hero__grid { grid-template-columns: 1fr 1fr; gap: var(--bhc-space-16); } }
@media (min-width: 720px) { .bhc-footer__grid { grid-template-columns: 1.4fr 1fr 1fr; } }
```

⚠️ Those two breakpoints (900/720) are **not** in the documented set. UI-SPEC §2 says leave them
alone and use `480 / 768 / 1024 / 1280` for all sixteen new blocks. `StickyCallBar` is the one
`max-width` exception (`max-width: 767px`), by UI-SPEC §7.12.

The two mandatory focus overrides (UI-SPEC §10) go at the end of the file, after the shipped base
rule at `styles.css:45-49`. Do **not** touch that base rule.

### 3.3 `design-system/src/index.js` — analog: itself

```js
export { Button } from './components/Button/Button.jsx';
export { Hero } from './components/Hero/Hero.jsx';
export { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs.jsx';
export { RatingBadge } from './components/RatingBadge/RatingBadge.jsx';
export { NAPFooter, formatPhone } from './components/NAPFooter/NAPFooter.jsx';
export {
  InterlinkBlock,
  buildInterlinks,
  nearestTowns,
  distanceMiles,
} from './components/InterlinkBlock/InterlinkBlock.jsx';
```

One named export per component, path always `./components/<Name>/<Name>.jsx`. Pure helpers ride
along on their component's line. `CANONICAL_PHONE` and `safeJsonLd` stay **out**.

### 3.4 `design-system/.design-sync/config.json` — analog: itself

Two full enumerations, both required (`NOTES.md`: an unregistered component "will not sync", with
no error). 6 → 22 entries in each:

```json
"componentSrcMap": {
  "Button": "src/components/Button/Button.jsx",
  …
},
"docsMap": {
  "Button": "src/components/Button/Button.prompt.md",
  …
}
```

`overrides.NAPFooter.cardMode: "column"` must survive untouched (`NOTES.md` § *Known render warns*).
Consider `cardMode: "column"` for `Header`, `Footer`, `StickyCallBar` and `CTABand` — all
full-width by nature, i.e. the same `[GRID_OVERFLOW]` shape that produced the NAPFooter override.

### 3.5 `design-system/test/locks.test.js` — analog: itself

The three idioms every new delta reuses:

```js
// the walk — locks.test.js:135-141 / :190-197 / :298-305
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
};
```

```js
// the anti-vacuity floor — locks.test.js:219, :331-334
assert.ok(previews.length >= 6, 'expected a preview per component');
assert.ok(
  emitters.length >= 3,
  `expected at least 3 JSON-LD emitters, found ${emitters.length}: ${emitters.join(', ')}`
);
```

```js
// the self-collision guard — locks.test.js:295, check-html-locks.mjs:144-153
// A source scan that matches its own scanner has bitten this repo twice.
const LD_MARKER = ['application', '/', 'ld+json'].join('');
const RETIRED_NATIONAL = ['0744' + '1918832', '0757' + '5709361'];
```

**Delta 14's `<svg>` scan and delta 9's four-file scan both reuse the `walk` above.** Delta 14
must assemble its marker (`'aria-' + 'hidden'` etc. is unnecessary — but `alt=` in a `<svg>` scan
is safe) and must scan `.jsx` **and** `.html`.

Raise `assert.ok(previews.length >= 6, …)` to `>= 22` (6 shipped + 16 new). Note the walk counts
**every** `.html` under `src`, so the number is the component count, not an approximation.

Every new lock also needs a **regression guard test** — the file's own strongest convention.
`locks.test.js:156-185` and `:165-196` exist because "Lock 5 passes today because no component
carries a postcode at all, so a matcher that quietly stopped matching would still read green."
Any new matcher (`@dsCard` shape, `<svg>` a11y, `toDial` throw) needs its own must-match /
must-not-match pair.

### 3.6 `design-system/test/run-locks.mjs` — analog: itself

```js
/*
  RAISE this when locks are added. Do not lower it without writing down why —
  a shrinking lock suite is precisely the regression this file exists to catch,
  and lowering the floor to make a red run green defeats the whole mechanism.
*/
const MIN_TESTS = 14;
```

Set it to the **exact** post-phase count, not a round number. Nothing else in this file changes.

### 3.7 `web/scripts/check-html-locks.mjs` — REWRITE

Keep, verbatim: the "no third-party imports, ever" header (`:28-30`), `ROOT`/`digits`/`read`/`walk`
helpers (`:31-102`), `POSTCODE_SPACED`/`POSTCODE_COMPACT`/`findPostcode` **and their
"change both or neither" comment** (`:34-69`), `STREET_LINE` (`:71-80`), `externalScriptTags`
(`:352-372`), the retired-number assembly (`:144-153`), and the every-lock-has-a-regression-guard
convention (`:165`, `:217`, `:379`).

Replace: the single `HTML_PATH` read (`:104-108`) with the `PAGES` / `APP_PAGES` /
`FRAMEWORK_ONLY` construction from `02-RESEARCH.md` § *Recommended harness shape*; `const TOWN = 'Warwick'`
(`:84`) with `expectationsFor(route)`; the single-manifest SC-4g read (`:303`) with a walk of
every `**/page_client-reference-manifest.js`; and the `web/app`-only source scan (`:327`) with
`web/app` **plus** `design-system/src`.

Structure every lock as **one looping test**, so the test count tracks invariants rather than
routes and `MIN_TESTS`-style floors stay stable at Phase 3's 336 pages.

**Four currently-green assertions must be corrected in the same commit as delta 1**, or `main`
blocks (`main` is ruleset-protected with `bypass_actors: []`): `SC-4b` (`:262`, breadcrumbs on
Home — there are none), `SC-4d` (`:272`, InterlinkBlock — `return null`s until Phase 3),
`SC-4f` (`:280`, exactly 3 JSON-LD blocks — Phase 2 emits 1 on Home, 2 elsewhere), and the D-15
robots meta (`:408`, `assert.ok(metas.length)` — `_global-error.html` has zero).

### 3.8 `web/scripts/check-budget.mjs` — REWRITE

Keep, verbatim: the D-14a transfer-weight header (`:28-50`), `LOCAL_PREFIX` + the attribute-order-
independent `<script>` extraction (`:63-72`), and **the `unresolved` refuse-to-report behaviour**
(`:74-110`) — "A measurement that cannot be completed is not a pass. It is a refusal." That
instinct must survive the rewrite.

Replace: the single `HTML_PATH` (`:54`) with a per-route loop reporting the **max**, printing the
route that produced each max. Fix WR-05 or rename the label — `page = js + Buffer.byteLength(html)`
(`:112`) adds **raw** HTML to **gzipped** JS while printing `Page (gzip JS + HTML)`.

### 3.9 `web/app/layout.jsx` — analog: itself

The three things that must survive the rewrite unchanged:

```jsx
import '@bhc/design-system/fonts/fonts.css';
import '@bhc/design-system/styles.css';
```
→ **the only file in the app that imports CSS** (`layout.jsx:28`). A route-level CSS import
produces a second built stylesheet and destabilises SC-1b (Pitfall 7).

```jsx
export const metadata = {
  metadataBase: new URL('https://www.beyondhousecleaning.com'),
  title: '…',
  robots: { index: false, follow: false },   // D-15
};
```

```jsx
{/* No `phone` prop. See the header. */}
<NAPFooter areaServed={[…]} hours="Mon–Sat, 8am–7pm" />
```
→ **the app passes no `phone` prop, ever.** After Phase 2 the same rule applies to `Header`,
`StickyCallBar` and `QuoteFormEntry`: the number lives once, in `phone.js`.

New body shape (UI-SPEC §9.1) — `<SkipLink />` first, `<main id="main" tabIndex={-1}>`:

```jsx
<html lang="en-GB">
  <body>
    <SkipLink />
    <Header nav={NAV} cta={{ label: 'Get a Free Quote', href: '/get-a-quote' }} />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer columns={FOOTER_COLUMNS} legal={LEGAL} />
    <StickyCallBar />
  </body>
</html>
```

`tabIndex={-1}` renders as `tabindex="-1"` [VERIFIED in RESEARCH probe] and is what actually moves
focus in Safari and Chrome.

### 3.10 `web/app/**/page.jsx` — analog: `web/app/page.jsx` + `conventions.md`

```jsx
import {
  Hero,
  Breadcrumbs,
  RatingBadge,
  InterlinkBlock,
  Button,
} from '@bhc/design-system';

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Warwick' }]} />
      <Hero
        eyebrow="Reliable & Affordable"
        heading="Deep Cleaning in Warwick"
        lead="…"
        rating={{ rating: 4.9, count: 175, source: 'Google' }}
        actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
      />
      …
    </>
  );
}
```

Rules held by the analog:
- **Single barrel import from `@bhc/design-system`.** Never a deep path into the package from the app.
- **No `use client`, anywhere** — `page.jsx:11-15` says so and deliberately does not name the
  directive in prose because the CI gate is a substring grep over `web/app`. Follow that: do not
  write the directive in a comment in any new route file either.
- A fragment `<>…</>` at the top level. Landmarks live in the layout.
- Static routes: `export const metadata = { title, description }` — **do not reach for
  `generateMetadata`** on a static route (RESEARCH § *Metadata for 17 distinct pairs*).
- The scaffold's `<RatingBadge … emitSchema />` at `page.jsx:52` should **not** be carried over —
  RESEARCH recommendation A5 is `emitSchema` off on every Phase 2 template, and SC-4f's replacement
  encodes that answer.
- `page.jsx:48-49` records the rule to keep: *`RatingBadge` sets `--bhc-ink` directly, so it is
  light-surface only — never band it on `bhc-section--navy`.* Verify when authoring `CTABand` and
  `Footer`.

The dynamic service route has **no in-repo analog**; use the verified template in
`02-RESEARCH.md` § *The service route — verified working end to end* (`dynamicParams = false`,
`generateStaticParams`, `await params` in both `generateMetadata` and the default export).

### 3.11 `web/content/*.js` — data modules

No analog for the *content*; `geo.js` is the analog for the *module shape* — a plain `.js` export
of pure data/functions with a header comment stating why it lives apart. The consumer schemas are
already fixed by the `.d.ts` files:

- `nav.js` footer columns → `NAPFooter.d.ts:1-2`: `FooterLink { label, href }`, `FooterColumn { heading, links }`
- `nav.js` header tree → UI-SPEC §7.1: `NavItem { label, href, children? }`
- `services.js` → `slug, h1, eyebrow, title, description, prose, faqs`

Put page copy here rather than in a `.jsx`: the `claude-seo` hook rejects a `.jsx` write containing
`REPLACE`, and prose containing *"we'll replace"* or *"replacement"* will trip it. The hook does
not watch `web/content/`.

---

## 4. Shared Patterns

### Pattern S1 — Component registration is a four-part atomic act

**Sources:** `.design-sync/config.json`, `.design-sync/NOTES.md` § *Re-sync risks* item 3,
`src/index.js`, every `<Name>.html:1` / `<Name>.prompt.md:1-3`.
**Apply to:** all 16 new components. Delta 9 asserts all four.

A component is only real when **all four** of these exist:

1. `<!-- @dsCard group="Navigation" -->` on **line 1** of the `.html` — exact regex
   `/^<!--\s*@dsCard group="[^"]+"\s*-->$/`, no leading whitespace.
2. `category: Navigation` frontmatter on the `.prompt.md`, **equal to** the `@dsCard` group.
3. An entry in `componentSrcMap` in `.design-sync/config.json`.
4. An entry in `docsMap` in `.design-sync/config.json`.

Plus a named export in `src/index.js`. `NOTES.md`: "New components are invisible by default…
None of the three is auto-discovered in this repo."

### Pattern S2 — The `className` merge

**Source:** `InterlinkBlock.jsx:41`, `NAPFooter.jsx:66`, `Breadcrumbs.jsx:35`, `RatingBadge.jsx:45`, `Button.jsx:30-37`.
**Apply to:** every component taking `className`.

```jsx
className={['bhc-<block>', <modifier or ''>, className].filter(Boolean).join(' ')}
```

### Pattern S3 — BEM-ish class naming, `bhc-<block>__<element>--<modifier>`

**Source:** `styles.css` throughout; `conventions.md` § *The styling idiom*.
**Apply to:** every new CSS block and every `className` in a new `.jsx`.

| Level | Form | Live examples |
|---|---|---|
| Block | `bhc-<block>` | `.bhc-hero`, `.bhc-footer`, `.bhc-interlink`, `.bhc-rating`, `.bhc-breadcrumbs`, `.bhc-btn` |
| Element | `bhc-<block>__<element>` | `.bhc-hero__heading`, `.bhc-footer__col-heading`, `.bhc-interlink__label`, `.bhc-breadcrumbs__sep` |
| Modifier | `bhc-<block>--<modifier>` | `.bhc-btn--primary`, `.bhc-rating--bare`, `.bhc-section--navy`, `.bhc-container--narrow` |

`conventions.md` line 16: **"never invent a `bhc-` name"** applies to consumers. Component authors
*do* create new block names — but only one per component, matching the UI-SPEC §7 root element
(`bhc-header`/`bhc-nav`, `bhc-skip-link` (already exists), `bhc-section`(exists), `bhc-prose`,
`bhc-service-card`, `bhc-town-card`, `bhc-steps`, `bhc-faq`, `bhc-quote-entry`, `bhc-callbar`,
`bhc-review`, `bhc-ba`, …).

Classes already shipped and **not to be re-declared**: `bhc-container`, `bhc-container--narrow`,
`bhc-container--wide`, `bhc-section`, `bhc-section--warm`, `bhc-section--tint`, `bhc-section--navy`,
`bhc-visually-hidden`, `bhc-skip-link` (`styles.css:51-85`). `SectionBand` and `SkipLink` are
**wrappers over existing CSS**, not new stylesheets.

### Pattern S4 — Values are `var(--bhc-*)`, never literals

**Source:** `styles.css` component blocks; D-04; UI-SPEC §7.
**Apply to:** every new CSS block.

⚠️ The shipped footer block violates this — `styles.css:276` `color: #C9D4E4`, `:284` same, `:299`
`rgba(255, 255, 255, 0.14)`, `:303` same, and `.bhc-btn--ghost:hover` `rgba(255,255,255,0.12)` at
`:140`. **Do not replicate the literal-hex habit.** UI-SPEC §7 requires the sixteen new blocks to
use only `var(--bhc-*)`, no literal hex.

### Pattern S5 — Phone number single-sourcing

**Source:** `NAPFooter.jsx:46-47,73-76`, `formatPhone.js`, `layout.jsx:14-22`.
**Apply to:** `Header`, `StickyCallBar`, `QuoteFormEntry`, `NAPFooter`.

- One default, in `phone.js`. No component restates the literal.
- `href` and label both derive from the same `phone` value: `toDial()` → href, `formatPhone()` → text.
- **No prop for the displayed text**, ever.
- Any label containing digits renders exactly `+44 7861 936533` — the output of
  `formatPhone(CANONICAL_PHONE)`. `Call 07861 936533` fails SC-2b (it normalises a leading `44`
  but not a leading `0`).
- A shorter label carries **no digits at all** plus an `aria-label`.

### Pattern S6 — Fail loudly at build time, never degrade

**Source:** `Hero.jsx:33-35` (throw on missing `heading`), `run-locks.mjs:51-55` (zero test files
is a hard failure), `check-budget.mjs:106-110` (an incomplete measurement is a refusal, not a pass).
**Apply to:** delta 13 (`toDial` throws), required props on new components, every rewritten script.

> "A measurement that cannot be completed is not a pass. It is a refusal." — `check-budget.mjs:84`

### Pattern S7 — Every assertion carries a regression guard

**Source:** `locks.test.js:156` ("Lock 5 passes today because no component carries a postcode at
all, so a matcher that quietly stopped matching would still read green"), `:165`, `check-html-locks.mjs:165`,
`:217`, `:379`.
**Apply to:** every new lock in deltas 9, 13, 14 and the `check-html-locks.mjs` rewrite.

Each guard is a paired `mustMatch` / `mustNotMatch` array with a comment naming what would
otherwise go silently green.

### Pattern S8 — Comments state measured evidence, not intent

**Source:** every `.jsx` header, every `.prompt.md`, `styles.css` section banners, `tokens.css:4`
("Every contrast ratio below was computed from hex, not eyeballed").
**Apply to:** all new files.

Quote the number: *"White on `#F06C24` measures 3.05:1 against a 4.5:1 requirement"*, not *"orange
buttons need dark labels for accessibility"*. UI-SPEC §4's measured table and §10's focus table
are the source for the sixteen new components.

### Pattern S9 — Cross-file coupling is declared in a comment

**Source:** `locks.test.js:127` and `check-html-locks.mjs:34-35` — *"Verbatim from
design-system/test/locks.test.js — do not re-derive it, and change both or neither."*
**Apply to:** the postcode matchers (still duplicated after the rewrite), the town coordinates
duplicated between `locks.test.js:229-235` and `.design-sync/previews/InterlinkBlock.tsx`
(`NOTES.md` risk 4), and any new duplication the sixteen components introduce.

---

## 5. No Analog Found

The planner should use `02-RESEARCH.md` / `02-UI-SPEC.md` for these rather than hunting the
codebase.

| Item | Role | Data flow | Why no analog | Use instead |
|---|---|---|---|---|
| `as?: ElementType` prop | component API | — | No shipped component has it. `Button.jsx:28` spreads `...rest` but the element is hardcoded | UI-SPEC §13-J. Type via `import type { ElementType } from 'react'` in the `.d.ts`, extending `Button.d.ts:1`'s type-only-import precedent |
| `<details>` / `<summary>` disclosure | interaction | UA-driven state | Zero occurrences in the repo | UI-SPEC §7.1 (nav: empty `<details>` + sibling `<ul>` + `[open] ~` combinator) and §7.9 (FAQ). Both mechanisms probe-verified in `02-RESEARCH.md` § *CSS: what survives Turbopack* |
| CSS `scroll-snap` rail | interaction | CSS-driven | Zero occurrences | UI-SPEC §7.14, §7.16. `scroll-snap-type`, `scroll-snap-align`, `scroll-padding-inline`, `overscroll-behavior-x` all verified to survive lightningcss |
| CSS `counter()` numbering | presentation | — | Zero occurrences | UI-SPEC §7.8. `counter-reset`/`counter-increment`/`content: counter(x)` verified |
| `position: fixed` + `env(safe-area-inset-bottom)` | layout | — | Zero occurrences | UI-SPEC §7.12. Verified |
| A component that never returns `null` and has two visible states | component | placeholder-capable | `InterlinkBlock`/`Breadcrumbs` return `null`; nothing has a placeholder state | UI-SPEC §7.16 + `Hero.html:41-43`'s honest data-URI placeholder as the *tone* precedent (real `alt`, finished-sounding copy, no "coming soon") |
| `web/jsconfig.json` | config | — | File does not exist | `02-RESEARCH.md` § *Recommended structure* — `{ "paths": { "@/*": ["./*"] } }`, verified working on 16.3.0 |
| `web/content/*.js` copy modules | data | — | No site-copy module exists anywhere | Consumer schemas are fixed by `NAPFooter.d.ts:1-2` and UI-SPEC §7.1; module *shape* copies `geo.js` |
| `app/services/[service]/page.jsx` dynamic route | route | SSG expansion | Only one static route exists today | `02-RESEARCH.md` § *The service route — verified working end to end* |
| `app/not-found.jsx` | route | — | Never authored; WR-07 found nothing has ever inspected `_not-found.html` | UI-SPEC §9.4 + `web/app/page.jsx` for shape |

---

## 6. Findings the planner needs before writing tasks

Concrete discrepancies found while reading the analogs. Each one would otherwise be discovered
mid-execution.

1. **The `phone.js` acceptance check fails as written.** UI-SPEC §7.0 and RESEARCH § *Don't
   hand-roll* both state `grep -r '447861936533' design-system/src` must return **exactly one
   hit** after the change. It currently returns **eight**, only one of which is the literal being
   deleted:
   `NAPFooter.jsx:34` (the code default), `NAPFooter.html:12` (preview markup — legitimately renders
   the number), `NAPFooter.d.ts:29` (JSDoc), `NAPFooter.prompt.md:16,31` (docs),
   `formatPhone.js:28,43,57` (comments). Rewrite the check to be executable-only (e.g. scoped to
   `.jsx`/`.js` with comments stripped, as `locks.test.js:147-151` already does for Lock 5) — or it
   is a red gate on correct code. `web/app` returning zero is unchanged and correct.

2. **`NAPFooter.jsx`'s literal is on line 34, not 33.** `layout.jsx:19` says "the package default
   at NAPFooter.jsx:33". UI-SPEC §7.0 says 34. **Line 34 is correct** (`phone = '+447861936533',`;
   line 33 is its JSDoc). When `NAPFooter.jsx` is edited, update or de-line-number `layout.jsx`'s
   comment in the same change.

3. **UI-SPEC §3 says InterlinkBlock's `<h2>` is already `--bhc-text-2xl`. It is not.**
   `styles.css:224` sets `.bhc-interlink__heading { font-size: var(--bhc-text-xl); }`. Either the
   contract's parenthetical "(already)" is wrong, or `styles.css:224` is a deviation to correct.
   Decide explicitly; do not copy `--bhc-text-xl` into the sixteen new `<h2>` blocks.

4. **`InterlinkBlock.jsx:48` borrows `.bhc-hero__lead` for its intro paragraph.** That is a
   cross-block class reuse. `SectionBand`, `CTABand` and `ReviewRail` all take an `intro`/`lead` —
   give them a proper `.bhc-section__intro` rather than propagating the borrow into four more
   components.

5. **`previews.length >= 6` floor becomes 22.** `locks.test.js:218-219` walks **all** `.html` under
   `src`; there are exactly 6 today, one per component. After Phase 2, 22.

6. **`emitters.length >= 3` stays 3.** None of the sixteen emits JSON-LD. The assertion is `>=`,
   so it is safe unchanged — but do not "helpfully" bump it.

7. **Lock 5's source scan covers `.jsx`/`.html`/`.css` under `src` only** (`locks.test.js:139`).
   `.d.ts` and `.prompt.md` are unscanned, and `web/content/` is out of reach entirely. The
   backstop is `check-html-locks.mjs`'s `SC-2d` over built HTML. Worth a comment so nobody assumes
   the package scan covers app data. Assumption A1 (Prose copy tripping `STREET_LINE`) lands here.

8. **`design-system/README.md` quotes no heading** — §5's remediation item 3 is **verified: no
   action needed** on that count. But its `## Components` table is a 6-row enumeration with
   `Component | Group | Lock` columns and needs 16 more rows, and its closing line still reads
   *"First sync is foundations plus the five locked components. The remaining ~15 follow…"* — stale
   after this phase.

9. **`.design-sync/NOTES.md:65` hardcodes the group enumeration**
   ("Current: Button→Actions, Hero→Content, Breadcrumbs/NAPFooter/InterlinkBlock→Navigation,
   RatingBadge→Trust"). Stale after Phase 2. `NOTES.md:107` ("All 6 components have authored
   previews") likewise, if RESEARCH A7's "previews optional" recommendation is taken.

10. **`Breadcrumbs.html` needs the same two corrections as `Breadcrumbs.jsx`.** Line 33 renders
    `<a href="/services">Services</a>` — a crumb the §13-R rule removes — and every `<li>` carries
    `style="display:contents"`, which WR-12 wants gone. A remediated `.jsx` with an unremediated
    preview is exactly the design→build drift the four-file shape exists to prevent.

11. **`Button` is link-bearing and shipped, but is not one of the sixteen.** UI-SPEC §13-J says
    "every link-bearing component takes `as?: ElementType`" while §7 scopes the phase to sixteen
    components. Decide explicitly whether `Button.jsx` gains `as` — it already spreads `...rest`
    at `:28`, so the change is one line, but it touches a shipped component and its `.d.ts`.

12. **`toDial` is re-exported from `NAPFooter.jsx:29` but not from `src/index.js:5`.** New
    components must import it sibling-relative (`'../NAPFooter/formatPhone.js'`), following
    `Hero.jsx:20-21`. Importing from the barrel inside a component would be circular.

13. **`Star` in `RatingBadge.jsx:18` is module-local, not exported.** `ReviewCard` needs the same
    glyph (UI-SPEC §7.13). Export it, or the glyph path string exists in two places — the exact
    second-source defect this phase is otherwise eliminating.

---

## Metadata

**Analog search scope:** `design-system/src/**`, `design-system/{styles.css,tokens.css,package.json,README.md}`,
`design-system/.design-sync/**`, `design-system/test/**`, `web/app/**`, `web/scripts/**`,
`web/{package.json,next.config.mjs}`, `.github/workflows/`, `package.json`, `docs/design/design-system.md`.
**Files scanned:** 61 (all non-`node_modules`, non-`.next` files under `design-system/` and `web/`).
**Files read in full:** 34.
**Analogs used:** 6 shipped components (24 files) + 8 infrastructure files.
**Pattern extraction date:** 2026-08-09
