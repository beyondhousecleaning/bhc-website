---
category: Content
---

# Prose

The long-form content container. It carries 800 to 1,100 words on roughly 336 pages, and it is a
container only — it renders no heading of its own.

## Why the measure matters here more than anywhere else

| | |
|---|---|
| Median words on a live service page | **1,183** |
| Pages that will carry this component | ~336 by Phase 3 |
| Measure | `--bhc-container-prose` — **68ch**, about 578px at the base step |
| Body | `--bhc-text-base` at **1.65** |

Content depth is the one thing the live site already does better than its competitors. Setting
that depth at full container width throws the advantage away: a 1,200-word page at 1,200px wide is
a wall of grey, and 68ch is the measure that keeps it readable.

## Prose must never emit an `<h1>`

Its outline starts at `<h2>`. Lock 1 allows **exactly one `<h1>` per page** and it comes from
`Hero`. This component appears on every service, town-hub and combo page, so an `<h1>` inside it
does not break one page — it breaks all of them at once. There is no prop that renders a heading,
and there should never be one.

## Descendant rules, all through `:where()`

| Element | Treatment |
|---|---|
| `p` | `margin-block-end: --bhc-space-4` |
| `h2` | `margin-block-start: --bhc-space-12`, `--bhc-text-2xl` |
| `h3` | `margin-block-start: --bhc-space-8`, `--bhc-text-xl` |
| `ul` / `ol` | body leading, `--bhc-space-2` between items |
| `a` | `--bhc-action-hover`, `text-underline-offset: 0.15em` |

`:where()` keeps specificity at zero, so a `bhc-`-classed component dropped into the copy still
wins over the prose defaults. That is the whole reason it is `:where()` and not a bare descendant
selector.

## `.bhc-prose__pullquote`

`--bhc-text-lg` on a `--bhc-paper-tint` ground with a `--bhc-action` left border. It is the one
piece of visual relief in a component whose job is otherwise a solid column of text, and it is why
336 pages of depth do not read as grey.

## `width`

`'prose'` is the 68ch measure and is the default for body copy. `'narrow'` is
`--bhc-container-narrow` — **800px, which is wider**, named after the token it uses. It is for
reference copy that needs horizontal room: legal clauses, checklist tables, long link runs.

## Don't

- Don't put an `<h1>` inside it, or add a prop that renders one.
- Don't use `width="narrow"` for body copy. It is wider than the default measure, not narrower.
- Don't set a `max-width` on the page around it as well — the measure lives here, once.
- Don't put `Prose` on a `navy` band. Its inline links are `--bhc-action-hover`, which measures
  1.15:1 there.
- Don't tighten the leading below 1.65. These are 800 to 1,100 word pages, not marketing blurbs.
