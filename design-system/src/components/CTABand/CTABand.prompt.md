---
category: Content
---

# CTABand

The closing ask. **One per page, always immediately above the footer**, and it is the only dark
band on the page.

It composes `SectionBand` rather than re-implementing the band, so `--bhc-section-y` stays declared
in exactly one place. Its heading is UI-SPEC §5's *Ready for a properly clean home?*

## Tone per template

| Template | `tone` |
|---|---|
| Home, service, town hub, combo | `navy` |
| Utility pages that end in `QuoteFormEntry` instead | *no CTABand* |
| Legal pages | *no CTABand* |
| A page that already carries a dark note | `tint` |

Never two `navy` bands on one page. Never a `CTABand` that is not the last thing before the footer —
it is the closing ask, and a closing ask in the middle of a page is just a button.

## `secondary` disappears on navy

| Pairing | Ratio |
|---|---|
| `--bhc-ink` on `--bhc-navy` — an outlined `secondary` | **2.65:1** |
| `--bhc-paper` on `--bhc-navy` — `ghost`, which is `currentColor` | **5.97:1** |
| `--bhc-ink` on `--bhc-action` — the `primary` label | 5.17:1 |

The second action is `ghost`. A `secondary` passed in anyway is coerced to `ghost` on a navy band,
because the alternative is shipping a button that is technically present and visually absent.

## The focus indicator, and why this band owns it

`--bhc-focus-ring` is `3px solid var(--bhc-action-hover)` at a 2px offset, so the ring lands on the
surface *behind* the element.

| Ring on | Ratio | WCAG 1.4.11 |
|---|---|---|
| `--bhc-action-hover` on `--bhc-paper` | 5.18:1 | ✅ the shipped default |
| `--bhc-action-hover` on `--bhc-navy` | **1.15:1** | ❌ effectively invisible |
| `--bhc-paper` on `--bhc-navy` | 5.97:1 | ✅ |
| `--bhc-paper` on an `--bhc-action` fill | 3.05:1 | ✅ for a non-text indicator |
| `--bhc-ink` on `--bhc-paper` | 15.81:1 | ✅ |

Every page carries one of these bands, so this is not an edge case — without the override a
keyboard user loses their position on every page of the site. The two scoped rules live at the
**end of `design-system/styles.css`**, under a banner saying so, and every later plan appends its
component block above them.

## Never put `RatingBadge` in a `CTABand`

`.bhc-rating__value` and `.bhc-rating__count` set `--bhc-ink` and `--bhc-ink-muted` directly rather
than inheriting `currentColor`. The badge is light-surface only, and on navy it is illegible. The
same applies to the ink footer. No Phase 2 template places it on either.

## Don't

- Don't put more than one on a page, and don't put it anywhere but above the footer.
- Don't use `variant="secondary"` on navy. It is outlined ink at 2.65:1.
- Don't put `RatingBadge` inside it — it is light-surface only.
- Don't put `Prose` inside it either: inline links are `--bhc-action-hover`, 1.15:1 on navy.
- Don't restyle the focus ring here. The two scoped overrides in `styles.css` are the whole of it,
  and no rule anywhere may remove the indicator.
