---
category: Content
---

# ServiceCard

One service, one card, **one link**. Six of them are the Home page's route into the six service
pages, and the same card reappears on every town hub and every service page's sibling grid.

## The bug this component exists to prevent

The intuitive way to make a whole card clickable is to wrap the card in an `<a>` and leave the
title link inside it. That is not a style choice, it is invalid markup: an `<a>` may not have
interactive content as a descendant, so the HTML parser splits the pair into **two sibling links**.
A six-card grid then offers twelve links to a screen-reader user listing them, and half of them are
named by the card's entire body text.

The card here carries exactly one anchor — the title — and the card-sized hit area comes from a
stretched `::after` on that same anchor over a `position: relative` card. One element, one
accessible name, the whole card as the target.

> `::after` is written double-colon in `styles.css` and lightningcss emits it **single-colon**
> (`:after`) in the built stylesheet. No lock may ever grep built CSS for the double-colon form.

## It is deliberately the same card as InterlinkBlock

`--bhc-paper` ground, `--bhc-line` border, `--bhc-radius-lg`, hover to an `--bhc-action` border plus
`--bhc-shadow-md`, every transition through `--bhc-dur` / `--bhc-ease`. That is the shipped
`.bhc-interlink__link` treatment with card padding (`--bhc-space-6`) and the larger radius.

From Phase 3 a service page carries a `ServiceCard` grid *and* two `InterlinkBlock`s. Two card
languages on one page reads as two sites.

## The grid

`.bhc-service-card__grid` is a plain class, not a component: `repeat(auto-fill, minmax(240px, 1fr))`
with a `--bhc-space-6` gap. Wrap the cards in a `<div class="bhc-service-card__grid">`. The auto-fill
idiom is inherited from `.bhc-interlink__list`, so the column count is a consequence of the
container width and never a prop.

## `headingLevel`

| Value | Use |
|---|---|
| `3` (default) | the grid sits inside a `SectionBand` that already supplies the `<h2>` — the normal case |
| `2` | the grid *is* the section and nothing above it carries a heading |
| `4` | the grid is nested two levels down, e.g. inside a `Prose` sub-section |

Cards are the one place where a heading level is genuinely per-page, because the same grid appears
under different amounts of structure on Home, on a service page and on a town hub.

## Props with a non-obvious contract

| Prop | Contract |
|---|---|
| `title` | the link text **and** the accessible name. There is no separate label prop, by design — that is how they cannot diverge |
| `icon` | decorative; the component wraps it in `aria-hidden="true"` because the title beside it says the same thing |
| `includes` | up to **three** bullets. A fourth is dropped rather than rendered. Null entries are filtered — from Phase 3 this is a data-module field |
| `as` | UI-SPEC §13-J. Defaults to `'a'`; nothing in Phase 2 passes it |

## Don't

- Don't wrap the card in a second link. See above — it is the reason the component exists.
- Don't add a "Learn more" link under the summary. That is a second link per card, with a name that
  says nothing, and the whole card is already the target. The CTA vocabulary in UI-SPEC §5 forbids
  *Learn more* outright.
- Don't put this on a `navy` band. The summary is `--bhc-ink-muted`, which measures **1.10:1**
  there, and the one navy band per page belongs to `CTABand`.
- Don't give `includes` a fourth bullet to "fit one more feature in". Cards are a scan surface; the
  detail belongs on the page the card links to.
- Don't grep built CSS for `::after`. lightningcss emits the single-colon form.
