---
category: Content
---

# SectionBand

The band rhythm wrapper. It is how a page gets its 60/30/10 colour split without any page
choosing a tone for itself, and it is the only place the site's vertical section padding is set.

## Tone per section — the reference order

Alternate surfaces down the page rather than picking per section. Home is the reference; every
other template is a subset of it.

| Section | `tone` |
|---|---|
| Header | paper |
| Hero | warm *(shipped default)* |
| TrustBar | paper |
| ServiceCard grid | warm — cards sit on paper |
| BeforeAfterSlider | paper |
| ProcessSteps | tint |
| ReviewRail | paper — cards sit on tint |
| InterlinkBlock | warm |
| FAQAccordion | paper |
| CTABand | **navy** — the one dark band, immediately above the footer |
| NAPFooter | ink *(shipped)* |

Never two identical tones adjacent. Never two `navy` bands on one page.

## `tone="paper"` is deliberately not a class

There is no `.bhc-section--paper` rule and there should not be one. `paper` maps to the empty
string in the `TONES` lookup and `.filter(Boolean)` drops it, so the default band is
`class="bhc-section"` and nothing more. An unknown tone falls back to the same thing rather than
emitting `bhc-section--undefined`.

## Contrast, measured

| Pairing | Ratio | Where |
|---|---|---|
| `--bhc-paper` on `--bhc-navy` | **5.97:1** | Headings and the intro on the dark band |
| `--bhc-ink-muted` on `--bhc-navy` | **1.10:1** | What the intro would be without this component's override |
| `--bhc-ink` on `--bhc-paper-warm` | 14.94:1 | Body copy on the alternating band |
| `--bhc-ink` on `--bhc-paper-tint` | 13.84:1 | Body copy on the quiet band |

Headings on navy were already handled by the shipped
`.bhc-section--navy :where(h1, h2, h3, h4)` rule. The **intro was not** — it sets
`--bhc-ink-muted` directly, which is 1.10:1 on navy, so `.bhc-section--navy .bhc-section__intro`
flips it to `--bhc-paper` in this component's CSS block.

## Headings and ids

`headingLevel` is `2` or `3` only. `2` renders an `<h2>` at `--bhc-text-2xl`; `3` renders an
`<h3>` at `--bhc-text-xl`. Both come from UI-SPEC §3's binding table, and the CSS is tag-scoped
so a nested band cannot render an `<h3>` at the `<h2>` step.

The `aria-labelledby` target is **derived**, never hardcoded — `{id}-heading` when an `id` prop is
given, otherwise a slug of the heading text. A page carries several bands, and a fixed id would
point every one of their labels at the first band on the page.

## Don't

- Don't override the vertical padding. It is `--bhc-section-y` and it is the rhythm.
- Don't add a `.bhc-section--paper` rule to make the map look symmetrical.
- Don't put a second `navy` band on a page — the one is `CTABand`, above the footer.
- Don't put `RatingBadge` on a `navy` band. It sets `--bhc-ink` and `--bhc-ink-muted` directly
  rather than inheriting `currentColor`, so it is light-surface only.
- Don't use `headingLevel={3}` on a top-level band. It exists for bands nested under another
  section's `<h2>`, not to make a heading smaller.
