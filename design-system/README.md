# @bhc/design-system

Tokens and React components for the **Beyond House Cleaning** website rebuild.

This package is the source that [Claude Design](https://claude.ai/design) reads. It is also
what Claude Code builds the site from, so a colour or spacing value exists **once**, here.

Specification: [`../docs/design/design-system.md`](../docs/design/design-system.md)
Visual direction and logo brief: [`../docs/brand/brand-brief.md`](../docs/brand/brand-brief.md)
Evidence behind the locks: [`../docs/research/seo-audit-2026-08-06.md`](../docs/research/seo-audit-2026-08-06.md)

## Syncing to Claude Design

`/design-sync` reads this package's tokens and React components directly and pushes them into a
Claude Design project. **It is user-invoked only** — it must be typed at the prompt and cannot
be run on your behalf:

```bash
cd ~/projects/bhc-website/design-system
claude
```
```
› /design-sync
```

It can create a new design system or update an existing one. There is an empty
`Design System` project (`f655f4ff-…`) already set up, though a specific name matches the
convention used elsewhere (*Olivia Terry — Portfolio Design System*).

## Layout

```
tokens.css              colour, type, spacing, radii, motion — the single source of truth
styles.css              reset, base type, and every component class
src/
  index.js              public exports
  components/<Name>/
    <Name>.jsx          the component
    <Name>.html         preview, with a `@dsCard group="…"` marker on line 1
    <Name>.d.ts         prop types
    <Name>.prompt.md    when to use it, and why it is shaped this way
test/locks.test.js      the locks, as executable assertions
```

Pure logic lives in plain `.js` beside the component it serves — `formatPhone.js`, `geo.js` —
so it can be tested without a JSX toolchain and reused at build time.

## Components

| Component | Group | Lock |
|---|---|---|
| `Breadcrumbs` | Navigation | **2** — trail + `BreadcrumbList` |
| `NAPFooter` | Navigation | **4, 5** — one `tel:`, no address |
| `InterlinkBlock` | Navigation | **6** — geography-derived links |
| `Header` | Navigation | — |
| `Footer` | Navigation | — |
| `SkipLink` | Navigation | — |
| `Hero` | Content | **1** — the `<h1>` |
| `Prose` | Content | **11** — 800–1,100 words, readably |
| `FAQAccordion` | Content | **SC-4** — answers in the served HTML, no rich-result schema |
| `SectionBand` | Content | — |
| `ServiceCard` | Content | — |
| `TownCard` | Content | — |
| `ProcessSteps` | Content | — |
| `CTABand` | Content | — |
| `RatingBadge` | Trust | **3** — server-rendered rating |
| `BeforeAfterSlider` | Trust | **SC-3** — placeholder-capable |
| `TrustBar` | Trust | — |
| `ReviewCard` | Trust | — |
| `ReviewRail` | Trust | — |
| `Button` | Actions | — |
| `QuoteFormEntry` | Actions | — |
| `StickyCallBar` | Actions | — |

**22 components, in four groups: Navigation 6, Content 8, Trust 5, Actions 3.** Six shipped in
Phase 1; the other sixteen were authored across Phase 2. A dash in the Lock column means the
component answers no numbered lock — it exists for a landmark, for composition or for the band
rhythm, not for a finding in the audit.

The four group names are a closed set. A fifth would leave the component silently uncategorised,
which is the same failure shape as not registering it at all, so `test/locks.test.js` fails any
`@dsCard` group outside those four.

The package still ships **no `src/index.d.ts` barrel and no `types` field** in `package.json`. That
is a deliberate deferral, and it is exactly why every one of the 22 has to be registered by hand in
both `.design-sync` maps: discovery has no entry point to read, so an unregistered component is
skipped by `/design-sync` **with no error at all**. The delta 9 lock makes that a hard failure in
both directions — a component missing from either map, and a map entry pointing at a directory that
has gone.

## Two rules you will want to break, and shouldn't

**Orange buttons take dark-navy labels, not white.** White on `#F06C24` measures **3.05:1**
against a 4.5:1 requirement. Ink on orange is **5.17:1**.

**Cyan never carries white text.** White on `#0DA6E8` is **2.75:1** — it fails even large text.
Cyan *is* fine as a surface with ink on top (5.75:1).

Both were measured, not eyeballed. Every ratio in
[`design-system.md`](../docs/design/design-system.md) §1 is reproducible from the hex values.

## Tests

```bash
npm test
```

Twenty assertions covering Locks 4, 5 and 7, the `@dsCard` markers, the four-file component shape
and its `.design-sync` registration, inline-`<svg>` labelling, JSON-LD escaping, and the interlink
geometry — including a check that the pin distances from the SEO audit reproduce (Birmingham 18.8
miles, Telford 46.2). They exist because the live site regressed silently on nearly every lock;
guidance caught none of them.

`npm test` runs `test/run-locks.mjs`, not `node --test` directly, because the latter fails **open**:
a glob matching nothing exits 0 having asserted nothing. The runner refuses to report green on zero
matched files or on fewer passing tests than its floor. Several assertions carry their own
anti-vacuity floors for the same reason — the preview and component floors are both **22**, the
exact number that exists, so a component or a preview that silently disappears turns the suite red
instead of quietly shrinking what is checked. Adding a component raises both.

The most useful one is Lock 4. The live footer displays `+44 7861 936533` and dials
`07441918832` on all 115 pages. `NAPFooter` takes a single `phone` prop and **derives** the
displayed string from it — there is no prop for display text, so the two cannot diverge.

## Not done yet

| | |
|---|---|
| Typefaces | Placeholder stacks (Public Sans / Figtree). Claude Design picks the real pair |
| Photography | 🔴 Blocked — all 199 Canva exports have the old logo burned in. Pull originals from canva.com → Projects → Uploads |
| Logo | SVG rebuild + four lockups. Brief in [`brand-brief.md`](../docs/brand/brand-brief.md) |
| Authored sync previews | `.design-sync/previews/*.tsx` covers the original six only. The other sixteen get auto-generated cards — cosmetic and reversible, see [`.design-sync/NOTES.md`](.design-sync/NOTES.md) |
| Types barrel | No `src/index.d.ts` and no `types` field, so both `.design-sync` maps stay pinned by hand |

The component set itself is **not** on this list any more: all 22 are shipped.
