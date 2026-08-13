---
category: Actions
---

# StickyCallBar

A fixed two-action bar at the bottom of the viewport below 768px: **Call** and **Get a Quote**, 50/50,
both at least 44px tall. Nothing at all at 768px and above.

## Why it exists

Cleaning enquiries are mobile and phone-first, and the reference competitor (`design-system.md` §2)
has no equivalent. This is a **deliberate competitive addition**, not a convention copied from a
template: on the pages where someone has decided, the fastest path to a booking is a thumb-reachable
call button that never scrolls away.

## The `tel:` budget — the cap is four

A fully composed Phase 2 page carries up to **four** `tel:` links:

| # | Where | When it is visible |
|---|---|---|
| 1 | `Header`, in the header actions | 768px and above |
| 2 | **this bar** | below 768px |
| 3 | `NAPFooter` — the one inside `<footer>` | every width |
| 4 | `QuoteFormEntry`'s fallback | on the pages that render it |

The page-wide assertion is **"exactly one inside `<footer>`, at most four per page"**. The
`<footer>` clause is the real NAP invariant; the cap of four is what makes the sitewide count
assertable at all.

Links 1 and 2 are mutually exclusive at any viewport and both are in the DOM, because both are
CSS-gated rather than conditionally rendered — that is what keeps the whole render server-side. They
are complementary by construction: the header actions appear at exactly the width this bar leaves, so
no viewport shows both and none shows neither.

**This link is not the one to remove to make a lock go green.** The cap is stated identically in the
harness, in `QuoteFormEntry`'s source and here; if a count comes out wrong, something rendered twice.

## The call label carries no digits, and that is a decision

The visible label is the single word `Call`. The anchor carries
`aria-label="Call Beyond House Cleaning"`.

Two reasons, and both matter:

1. **Ambiguity.** A one-word link read out of context — a screen-reader user listing a page's links —
   says nothing about who is being called. The `aria-label` is what makes the link self-describing.
2. **The lock.** The digit-equality clause reads an anchor's rendered **text content** and compares
   its digits to the href's. A digit-free label is out of that clause's scope entirely. A label
   reading `Call 07861 936533` would **fail** it, because the normalisation strips a leading `44` and
   not a leading `0` — the label and its own href would disagree.

If a digit-bearing label is ever wanted here, it must render exactly `+44 7861 936533`, which is what
`formatPhone()` produces and nothing else does. The preview shows the failing form once, inline and
labelled, so it is recognisable rather than re-derivable.

**`Get a Quote`, not `Get a Free Quote`.** The bar is 375px wide and splits 50/50. The long form is
the label everywhere else on the site, and UI-SPEC §5's CTA vocabulary allows the short form here.

## The number is single-sourced

`phone` defaults to `CANONICAL_PHONE` from `src/phone.js`, and `toDial()` derives the href from it.
There is no prop for displayed text because there is no displayed number. A malformed value **throws**
rather than degrading to `tel:+44`: this bar renders on every page, and the alternative to a build
failure is an empty interactive element fixed to the bottom of all of them (WCAG 2.4.4).

## Two CSS rules that are easy to miss

**`display: none` is the default state.** The bar is hidden outside its media query and shown inside
it, rather than shown by default and hidden above the breakpoint. Above 768px it is therefore
**removed from the accessibility tree**, not merely painted out of view — a desktop keyboard user must
not be able to tab into an invisible bar. Writing it this way also keeps the narrow query to a single
occurrence in `styles.css`, which is what the harness counts.

**`body { padding-bottom: 64px }` lives inside the same query.** A global rule declared by a component
block is unusual and it is deliberate: the bar is `position: fixed`, so nothing in normal flow can
reserve the space for it, and without the padding it covers the footer's last row on every mobile
page. The component is rendered once, from the root layout, on every page — so the rule and the bar
always arrive together.

This is the **one documented narrow-viewport media query** in `styles.css`. Every other block in that
file is `min-width` only. UI-SPEC §7.12 authorises the exception because this component is defined by
its absence above a breakpoint rather than its presence below one.

## Dimensions and ground

| Property | Value |
|---|---|
| position | `fixed`, `inset-inline: 0`, `bottom: 0` |
| height | `calc(64px + env(safe-area-inset-bottom))` |
| ground | `--bhc-paper` with a `--bhc-line` top border |
| elevation | `--bhc-shadow-lg` |
| actions | 50/50, `min-height: 44px` |

Both the safe-area inset and `inset-inline` were authored, built and read back out of the emitted CSS
chunk unchanged.

The bar sets **no text colour of its own**. Both actions are `Button`s carrying their own measured
pairings — the primary is an orange fill with an ink label at 5.17:1, never white at 3.05:1 — so the
direct-colour question that caught `.bhc-section__intro` at 1.10:1 on navy and `ReviewCard`'s stars at
2.68:1 on tint does not arise here. The bar is fixed to the viewport rather than placed in a band, so
it never sits on `--bhc-navy` at all.

No `:focus-visible` rule of its own: both actions are anchors, already covered by the base rule at the
top of `styles.css`.

## Don't

- Don't put digits in the visible label. If you must, it reads exactly `+44 7861 936533` and nothing
  else.
- Don't drop the `aria-label`. `Call` on its own says nothing about who.
- Don't remove this bar's `tel:` link to make a page-wide count go green. The cap is four and three
  plans state it identically.
- Don't hide it above the breakpoint with `visibility`, `opacity` or an off-screen transform. It must
  leave the accessibility tree.
- Don't move the `body` padding rule out of this component's block. The bar and the space it needs
  are one thing.
- Don't restate the phone number here or add a prop for displayed text.
- Don't add a second narrow-viewport media query to `styles.css`. This is the documented exception.
