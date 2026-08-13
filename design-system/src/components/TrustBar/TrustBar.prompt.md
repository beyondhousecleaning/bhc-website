---
category: Trust
---

# TrustBar

Three claims, in one row, under `Why people book us again`. It is the band directly below the Hero
on the home page and on every service page.

## The claims are a closed set

`DBS-checked cleaners` · `Fully insured` · `Satisfaction guarantee`

Sourced from `design-system.md` §3.1 and quoted in the copywriting contract. **Do not invent a
fourth.** Every additional badge on a trades site costs the other three a share of the same glance,
and the three above are the ones the business can actually evidence.

**The rating is not one of them.** `RatingBadge` owns the rating and states it exactly once per
page, in the Hero. A second statement of the same number in the band immediately below is not twice
the trust — it is one claim in two voices, and it doubles the surface that has to be corrected when
the review count moves.

## Tones, and the one that does not exist

| `tone` | Ground | Labels | Glyphs | Measured |
|---|---|---|---|---|
| `paper` (default) | the page's own | inherited `--bhc-ink` | inherited `currentColor` | 15.81:1 on white |
| `tint` | `--bhc-paper-tint` | inherited `--bhc-ink` | inherited `currentColor` | 13.84:1 |
| `ink` | `--bhc-ink` | `--bhc-paper` | `--bhc-sponge` | 15.81:1 labels, **6.59:1** glyphs |
| — | `--bhc-navy` | — | `--bhc-sponge` | **2.49:1 — fails** |

The last row is not a value of `tone`. `--bhc-sponge` on `--bhc-navy` was authorised in an early
revision of the colour contract, measured at 2.49:1, and withdrawn before anyone acted on it. The
prop's union has no member for it, an unknown `tone` degrades to `paper` rather than emitting a
modifier class no rule matches, and the preview renders the failing pairing once, inline and
labelled, so the failure is recognisable rather than re-derivable.

## Placement

| Template | Where | `tone` | `heading` |
|---|---|---|---|
| Home | directly under the Hero, on a `paper` band | `paper` | default |
| Service | directly under the Hero | `paper` | default |
| Composed inside a `SectionBand` that already carries the `<h2>` | anywhere the band allows | any | `null` |

Two forms, the `ProcessSteps` precedent: with a `heading` the component renders a `<section>`, an
`<h2>` and the list; with `heading={null}` it renders the bare `<ul>`, because a `<ul>`'s content
model is `li`, `script` and `template` only and a heading inside the list would be hoisted out of it
by the parser.

The tone lives on the `<ul>`, not on the `<section>`. That is deliberate: the tone is the *bar's*
ground, and an ink bar sitting on a paper band is the case that makes the two separate elements
worth having.

## Accessibility

The glyphs are decorative by construction — the label sits beside each one and already names it — so
every one carries `aria-hidden="true" focusable="false"`, which is row 1 of the inline-SVG rule and
what delta 14 asserts. The attributes are written out on each `<svg>` rather than spread from a
shared object: delta 14 reads the opening tag as **source text**, so `<svg {...ICON_PROPS}>` is an
unlabelled graphic to the only lock that can see this class of defect, however correct the rendered
output would be.

That sentence lives here and not in `TrustBar.jsx` for the same reason. The scanner walks
`.jsx` and `.html` under `src/` and this file is neither — writing the defective form into the
component as an explanatory comment turns the lock red on the file it is explaining. This is the
**sixth** time this phase has had to route an explanation around the scan that polices it, and the
first time inside a component's own header comment.

`items={[]}` renders nothing at all rather than a heading above an empty bar — the `InterlinkBlock`
convention.

## Don't

- Don't add a fourth claim. The set is closed and it is closed on purpose.
- Don't restate the rating here. `RatingBadge` says it once per page; two voices saying it is worth
  less than one, and it doubles the maintenance surface.
- Don't add a dark-blue `tone`. `--bhc-sponge` on `--bhc-navy` is **2.49:1**. It was authorised once
  and withdrawn; this line exists so it is not re-added by someone who only reads the code.
- Don't put the bar on the one navy band. On `tone="ink"` it sets `--bhc-paper` and `--bhc-sponge`
  directly, and both are measured against `--bhc-ink` and against nothing else.
- Don't spread the SVG attributes from a shared props object, however much repetition it saves.
