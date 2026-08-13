---
category: Content
---

# Hero

**Lock 1: exactly one `<h1>` per page, carrying the service and/or town.**

## The bug this component exists to prevent

The live site gets this wrong on **101 of 115 pages**, and it was caused by a *design* pattern,
not a coding mistake. A two-line animated hero where line 1 is the `<h1>` and line 2 — the line
carrying the keywords — is a styled `<div>`:

```html
<h1 class="heading-style-h1">Reliable &amp; Affordable</h1>
<div style="width:0%" class="heading_animation"></div>
<div class="heading-style-h1">Deep Cleaning Services in Warwick</div>
```

Visually it reads *"Reliable & Affordable / Deep Cleaning Services in Warwick"*. Semantically
the H1 is `Reliable & Affordable`.

The measured damage:

| | |
|---|---|
| Location-page H1s containing the town | **0 of 95** |
| Location-page H1s containing the word "clean" | **2 of 95** |
| Most common H1 across the site | `"Reliable & Affordable"` — 30 pages |

Arbor Trail, with the same layout, gets it right: `Reliable Move Out Cleaning in Taylor, MI`.
A direct, unforced competitive loss.

## How the API prevents it

`eyebrow` and `heading` are separate props. `eyebrow` renders as a `<p>`. `heading` renders as
the `<h1>` and is **required** — the component throws without it. There is no prop that lets
the adjective line become the heading.

**If you design a two-line hero: the keyword line is the `<h1>`, the adjective line is
decoration.** Never the reverse.

## Heading per template

| Template | `eyebrow` | `heading` → `<h1>` |
|---|---|---|
| Home | `DBS-checked, insured, local` | `Professional House Cleaning in Warwickshire & the West Midlands` |
| Service | `Top to bottom, once` | `Deep Cleaning in Warwickshire & the West Midlands` |
| Town hub | `Local, DBS-checked cleaners` | `House Cleaning in Warwick` |
| Combo | `Local, DBS-checked cleaners` | `Deep Cleaning in Warwick` |

Two of these rows changed in Phase 2, and both were failures of the lock this component enforces.
The old Home heading closed on a reassurance clause and named no region at all, so the reference
example for the template failed Lock 1 on its own terms — an `<h1>` carrying neither a service area
nor a place. The old Service heading carried the redundant word *Services*: the page is about a service,
the noun phrase already says so, and the word costs a keyword slot in the most valuable string on
the page. The eyebrow lines move with them, because *"Reliable & Affordable"* is the exact adjective
line the live site promoted into its `<h1>` on 30 pages.

## The image is the LCP element

Rendered `loading="eager"` with `fetchPriority="high"` — never lazy. Pass a `srcSet`; the build
generates AVIF/WebP at multiple widths. `alt` is required (Lock 7 — 1,230 of 2,183 images on the
live site have none).

The homepage currently ships a **741 KB PNG** while every other image is WebP. Don't repeat it.

## Don't

- Don't put the town or service in `eyebrow` and something generic in `heading`.
- Don't render a second `<h1>` anywhere on the page.
- Don't lazy-load the hero image.
- Don't animate the heading in a way that requires splitting it across elements — that is the
  original bug. Animate the container, or use `background-clip` on the single `<h1>`.
