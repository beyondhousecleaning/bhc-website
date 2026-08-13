---
category: Content
---

# TownCard

The dense card. A `/locations` index shows about **56** of them and every town hub shows six more,
so this card is a title and one meta line — `Warwickshire · 6 services` — and nothing else.

`ServiceCard` gets a summary and up to three bullets because there are six of them on a page.
Fifty-six summaries would be fifty-six paragraphs of near-identical copy, which is thin content by
any definition and reads as generated even when it is not.

## Two prohibitions on `town`, and they are the point of this doc

From Phase 3 this component is fed by a data file, not by hand, so the constraint has to live where
the next author will read it — the header comment, the `.d.ts` JSDoc and this list.

1. **Never a bare postcode district as a town name.** `CV32` is not a place anyone lives in or
   searches for. Post towns and named suburbs only. This is a PROJECT.md constraint, not a
   preference.
2. **Never a full postcode**, anywhere in the rendered output. D4. The registered office is
   residential and the GBP is a service-area business with the address suppressed. One bad data row
   publishes it across every locations page at once.

Both are CI-asserted, in two places on purpose: **Lock 5** scans `.jsx` / `.html` / `.css` under
`design-system/src` after stripping comments, and **SC-2d** scans every built page. Source alone
would miss a value that only exists at build time; built HTML alone would miss a component that is
not on a page yet.

## One anchor per card

Same rule as `ServiceCard`, and it matters more here: an `<a>` may not contain interactive content,
so a wrapper link plus a title link is parsed into **two sibling links**. At 56 cards that is 112
links in the accessibility tree. The card-sized hit area comes from a stretched `::after` on the
title anchor over a `position: relative` card.

> lightningcss emits `::after` as `:after` in the built stylesheet. Never grep built CSS for the
> double-colon form.

## The meta line

`{region} · {serviceCount} services`, at `--bhc-text-sm` in `--bhc-ink-muted`.

| Data | Renders |
|---|---|
| both halves | `Warwickshire · 6 services` |
| `region` only | `Warwickshire` |
| `serviceCount` only | `6 services` |
| neither, or `serviceCount: 0` | no meta line at all |

`0` renders nothing rather than `0 services`: a town with no pages yet is a data state, not a claim
to make on a page.

## The grid

`.bhc-town-card__grid` — `repeat(auto-fill, minmax(200px, 1fr))`, gap `--bhc-space-3`. Tighter than
`ServiceCard`'s `minmax(240px, 1fr)` / `--bhc-space-6` because the cards are shorter and there are
an order of magnitude more of them.

## Don't

- Don't put a postcode district in `town`. See above.
- Don't add a summary line "so the cards look less empty". Fifty-six of them is the reason they are
  this size.
- Don't wrap the card in a second link.
- Don't put this on a `navy` band. The meta line is `--bhc-ink-muted`, which measures **1.10:1**
  there.
- Don't sort the grid by anything but the order the data module supplies. Phase 3 owns the ordering
  rule, and a component that re-sorts silently makes that rule untestable.
