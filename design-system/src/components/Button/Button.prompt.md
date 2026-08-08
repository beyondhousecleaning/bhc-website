# Button

The single action primitive. Every CTA on the site converges on the quote flow, so `href` is
the common case and the component renders an `<a>` when it's given.

## Variants

| Variant | Use | Colour |
|---|---|---|
| `primary` | The one real action on a page — Get a Quote, Book Now | Orange fill, **ink label** |
| `secondary` | The alternative — Call Us, See Prices | Outlined ink |
| `ghost` | Only on navy surfaces, where ink would disappear | Outlined `currentColor` |

One `primary` per view. If two things look equally important, neither reads as the action.

## The label colour is not a preference

`primary` is orange with a **dark navy label**, not white.

| Pairing | Ratio | WCAG AA normal text |
|---|---|---|
| White on `--bhc-action` `#F06C24` | **3.05:1** | ❌ fails |
| `--bhc-ink` on `--bhc-action` | **5.17:1** | ✅ passes |

White-on-orange is the accessibility bug most cleaning sites ship. It also looks worse — ink on
orange reads warmer and more considered than the generic trades button.

On hover the fill darkens to `--bhc-action-hover` `#C2410C`, at which point the label *does*
flip to white (5.18:1). That's the only place white-on-orange is allowed.

## Shape

Fully rounded (`--bhc-radius-full`). That's part of direction B — "warm local craft" — and it's
also the clearest departure from Arbor Trail's hard-edged blue buttons.

## Don't

- Don't set a white label on `primary`.
- Don't use `ghost` on a light background; it relies on `currentColor` and will vanish.
- Don't put more than one `primary` in a section.
- Don't use `--bhc-cyan` as a button fill — it fails with white (2.75:1), and with ink it's
  5.75:1 but reads as a link, not an action.
