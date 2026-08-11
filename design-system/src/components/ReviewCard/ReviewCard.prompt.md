---
category: Trust
---

# ReviewCard

One customer review, on the card `ReviewRail` scrolls. The live site keeps its reviews inside a
516 KB third-party widget, so none of them is indexed content and none of them is in a single title
or meta description. This renders them as server HTML for no client bytes at all.

## The star glyph comes from one file

`Star` is exported by `RatingBadge.jsx`. This card imports it rather than restating the path data —
two copies of a path string is the second-source defect this phase exists to remove, and the glyph
row here and the badge row in the Hero appear on the same page.

**The stars inherit `--bhc-ink`, not the orange the badge uses.** Measured on this card's ground:

| | Ground | Ratio | Verdict |
|---|---|---|---|
| `--bhc-action` stars | `--bhc-paper-tint` | **2.68:1** | fails 1.4.11's 3:1 for a graphic that carries meaning |
| `--bhc-action` stars | `--bhc-paper` (RatingBadge) | 3.05:1 | passes, which is why the badge keeps them orange |
| `--bhc-ink` stars | `--bhc-paper-tint` | **13.85:1** | shipped |

The accent's reserved-for list in the colour contract is closed and names the badge's star fill, not
this one. Both readings — the closed list and the measurement — land in the same place.

## Three properties this card is defined by

**No nested `<footer>`.** The attribution is `<p class="bhc-review__by"><cite>…</cite> · … · …</p>`.
A `<footer>` inside an `<article>` is legal HTML and is arguably what the element is for, but the
built-HTML suite asserts **exactly one `<footer>` per page** and a rail of three cards would put
four on the home page.

**No `-webkit-line-clamp`.** With no client JavaScript there is no "read more", so a CSS clamp
hides text from sighted readers that screen readers still receive, and the loss widens at 200% zoom
(WCAG 1.4.4). **The quote is capped at 320 characters at the data layer**, truncated at a word
boundary with an ellipsis at ingest, so what ships is exactly what displays. That cap is a property
of the data contract, not of the styling, and it is written into the `quote` JSDoc in
`ReviewCard.d.ts` for that reason. `web/content/reviews.js` honours it **by selection rather than by
truncation** — every quote it carries already fits, so what ships is a whole review and never part
of one. That is the stronger form and the one to keep.

**`date` is optional, and `town` always was.** The review payload the live site carries holds a
name, a body and a star count and nothing else. Requiring a date would have made a fabricated month
on every card the only way to satisfy the type.

**No link.** That is load-bearing rather than incidental: `ReviewRail`'s scroll container carries
`tabindex="0"`, which is correct **only because this card has no focusable children**. Chrome's
automatic keyboard-focusable-scroller behaviour applies only to a scroller containing none, so the
explicit attribute is doing real work — and a link added in here turns it into a redundant tab stop
immediately before that link. The coupling is recorded in both prompt docs on purpose.

## It emits no review structured data

Self-serving review markup and widget-sourced review markup are both ineligible for review rich
results. The aggregate figure is entity-graph only and is emitted once per page by `RatingBadge`.
Neither this component nor `ReviewRail` emits a structured-data block of any kind.

## The data contract carries a privacy obligation

`quote` is the largest untrusted string in the build: it is externally sourced, and a customer who
names their street in a review must not have it published. Review text renders as React children,
so it is escaped, and neither component puts it into a script context. The built-HTML postcode and
street-line scan is the backstop, not the primary control — the data module's own screen is. All 166
extracted reviews were run against the harness's postcode and street-line matchers before any
selection was made, and a review that named a street would simply not be selected.

## Don't

- Don't restate the star path. Import `Star` from `RatingBadge.jsx`.
- Don't colour the stars orange to match the badge. On this ground that is 2.68:1.
- Don't turn the attribution into a nested `<footer>`. One `<footer>` per page is asserted.
- Don't add `-webkit-line-clamp`, an ellipsis rule, or a "read more". The cap belongs to the data.
- Don't put a link — a source link, an author profile, anything — inside this card. It is what makes
  the rail's `tabindex` correct.
- Don't emit review structured data here or anywhere downstream of here.
