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
| `Button` | Actions | — |
| `Hero` | Content | **1** — the `<h1>` |
| `Breadcrumbs` | Navigation | **2** — trail + `BreadcrumbList` |
| `RatingBadge` | Trust | **3** — server-rendered rating |
| `NAPFooter` | Navigation | **4, 5** — one `tel:`, no address |
| `InterlinkBlock` | Navigation | **6** — geography-derived links |

First sync is foundations plus the five locked components. The remaining ~15 follow once the
direction has been reacted to in Claude Design — the sync guidance is explicitly incremental,
"one component at a time, never as a wholesale replace."

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

Eight assertions covering Locks 4, 5 and 7, the `@dsCard` markers, and the interlink geometry —
including a check that the pin distances from the SEO audit reproduce (Birmingham 18.8 miles,
Telford 46.2). They exist because the live site regressed silently on nearly every lock;
guidance caught none of them.

The most useful one is Lock 4. The live footer displays `+44 7861 936533` and dials
`07441918832` on all 115 pages. `NAPFooter` takes a single `phone` prop and **derives** the
displayed string from it — there is no prop for display text, so the two cannot diverge.

## Not done yet

| | |
|---|---|
| Typefaces | Placeholder stacks (Public Sans / Figtree). Claude Design picks the real pair |
| Photography | 🔴 Blocked — all 199 Canva exports have the old logo burned in. Pull originals from canva.com → Projects → Uploads |
| Logo | SVG rebuild + four lockups. Brief in [`brand-brief.md`](../docs/brand/brand-brief.md) |
| ~15 more components | ReviewRail, BeforeAfterSlider, ServiceCard, TownCard, ProcessSteps, FAQAccordion, Header, … |
