---
category: Navigation
---

# Header

The one `<header>` and the one `<nav aria-label="Primary">` on every page. It opens and closes with
JavaScript disabled, it renders every navigation link in the DOM exactly once, and it is
unconditionally visible at desktop width.

## The responsive mechanism, and the two routes that were rejected

**A `<details>` is a state carrier with no content, and the one `<ul>` is its sibling.**

```html
<nav aria-label="Primary" class="bhc-nav">
  <details class="bhc-nav__disclosure">
    <summary class="bhc-nav__toggle" aria-controls="primary-nav" aria-label="Menu">…</summary>
  </details>
  <ul class="bhc-nav__list" id="primary-nav"> <!-- rendered ONCE --> </ul>
</nav>
```

The list is hidden by default; a sibling combinator keyed on the disclosure's open state shows it;
and at 1024px and above the toggle is removed entirely and the list is unconditionally `flex`, so the
open state stops mattering. A user agent only hides a disclosure's **own** children, so a sibling is
untouched by it and an ordinary stylesheet rule can drive it.

This shape was authored, built and read back out of the emitted CSS chunk unchanged. The mechanism is
verified, not theorised.

| Rejected route | Why it fails |
|---|---|
| Put the `<ul>` **inside** the `<details>` and hide the `<summary>` at desktop width | A closed disclosure's non-summary children are hidden by the UA through the details-content slot, **not** by a `display` rule a stylesheet can override. Hiding the toggle leaves the navigation permanently invisible at desktop width — the nav is simply gone. |
| Render a **second** `<ul>` for desktop | Breaks the one `<nav aria-label="Primary">` per page invariant, and duplicates every navigation link in the DOM, which the internal-link lock then counts twice. |

**Someone will try to "tidy" the empty disclosure by moving the list inside it.** That is the first
rejected route, and it takes the desktop navigation with it. The empty element is the design.

**Never reach for `::details-content` to make route 1 work.** It reached Baseline *Newly available* in
September 2025 and will not be *Widely available* until roughly March 2028. The rejection is a dated
judgement, not a preference, and the sibling mechanism needs no revisiting.

The **Services submenu is the other case entirely**: a nested disclosure that *does* contain its own
`<ul>`. That is ordinary usage — the UA hides and shows it and no combinator is involved — and at
1024px and above it is absolutely positioned below its summary. It needs no `/services` index page,
which 404s today, and it puts six keyword-bearing links in the global navigation.

## The NavItem rendering rule

| Item shape | Renders as | Its own `href` |
|---|---|---|
| has `children` | a nested `<details>` whose `<summary>` carries the label | **never emitted**, whether or not one is present |
| no `children`, has `href` | a single `<a href>` | emitted |
| no `children`, no `href` | a `<span>` | — |

The "never emitted" clause is load-bearing and has two independent reasons, either of which alone
settles it:

1. `/services` 404s in Phase 2. A linked parent would put a dead internal link on all 18 pages and
   fail the lock that resolves every internal href against the prerender manifest.
2. Giving the parent one of its children's hrefs — the obvious workaround — would put the same href
   in the DOM twice and fail the no-duplicate-href assertion.

The shipped nav data omits the Services href for exactly these reasons. This rule means the component
stays correct even if a later data edit adds one: the href would be ignored rather than becoming a
broken link.

The third row exists because an `<a>` with no `href` is not focusable, not activatable, and still
announced as a link. Text is the honest rendering of an item with no destination.

## No `<h1>`, and no raster logo

**The brand is an `<a>` with `aria-label="Beyond House Cleaning — home"`.** Not an `<h1>` — the page's
one heading belongs to the page. Not a `<div>` or `<span>` styled at heading size either: that is the
exact live-site bug that cost 101 of 115 pages their `<h1>`. If it looks like a heading it is a
heading element, and here it is neither. It is a link.

**The logo is a typographic wordmark.** `assets/logo/` holds only `beyond-hc-01.png` (189 KB) and
`beyond-hc-01.jpg` (679 KB) — the mark `brand-brief.md` is replacing, at a resolution that renders
about 20px tall in a 48px header. Shipping it would put a superseded logo on roughly 410 pages. The
wordmark is `--bhc-font-display` at `--bhc-text-xl` / 700, `--bhc-ink` on `--bhc-paper`, 15.81:1.

The `logo` prop takes a `ReactNode`, so the SVG lockup drops in later with **no API change and no page
edits**.

## The phone link

`phone` defaults to `CANONICAL_PHONE` from `src/phone.js`. `formatPhone()` supplies the label and
`toDial()` the href, both derived from that one value, so they cannot diverge — there is deliberately
no prop for the displayed text. The live site DISPLAYS one number and DIALS another on all 115 pages,
which is only expressible when the two are separate inputs.

This is one of the **four** `tel:` links a fully composed page carries: Header, StickyCallBar,
`NAPFooter` (the one inside `<footer>`), and `QuoteFormEntry`'s fallback on the pages that render it.

## Breakpoints, and the gap that is deliberately closed

| Width | Toggle | Nav list | Header phone + CTA | StickyCallBar |
|---|---|---|---|---|
| below 768px | shown | hidden until opened | hidden | shown |
| 768–1023px | shown | hidden until opened | **shown** | hidden |
| 1024px and above | removed | `flex`, unconditional | shown | hidden |

UI-SPEC §7.1 specifies the header phone and CTA at 1024px and above. They are shown from **768px**
instead, which is a superset of that and closes a real gap: `StickyCallBar` leaves at 768px, so
between 768px and 1023px the header actions are the only one-tap call action on the page. The two are
exactly complementary — no viewport shows both, and none shows neither.

Both are CSS-gated rather than conditionally rendered. That is what keeps the whole header a server
render, and it is why both `tel:` links are in the DOM at every width.

## Accessibility

- `<summary>` supplies `aria-expanded` natively and it reflects the disclosure's own state, so the
  announcement is correct even though the element it governs is a sibling rather than a child.
  `aria-controls` names the list; support is patchy but it is inert where unsupported.
- A disclosure that controls a sibling it does not contain is unusual. It is sound, and it is written
  down here so it is not rediscovered as a bug.
- Every nav link, the toggle row and each submenu summary are at least 44px tall.
- The menu glyph and the chevron are decorative — the toggle's `aria-label` and the summary's own
  text already name each control — so both carry `aria-hidden="true" focusable="false"`, written out
  on the tag rather than spread from a shared object. The lock that enforces this reads the opening
  tag as source text.
- **No bespoke `:focus-visible` rule.** `<a>` and `<summary>` are both already covered by the base
  rule at the top of `styles.css`, and the focus-override section is the last section of that file
  and the only place the indicator is ever scoped.

## Grounds

The header is always `--bhc-paper`. The wordmark, the nav links and the phone link all set
`--bhc-ink` directly — 15.81:1 against that ground. This component is never a band and must never sit
on `--bhc-navy`, where `--bhc-ink` measures 2.65:1.

## Guards

`nav.filter(Boolean)` and `(item.children || [])`, copied from `NAPFooter.jsx:105-123`. This component
sits in the root layout, so a single malformed entry in a Phase-3 nav data file would 500 **every**
route rather than break one list.

## Don't

- **Don't move the `<ul>` inside the `<details>`.** It removes the desktop navigation. This is the
  single most likely future edit to this file.
- Don't render a second `<ul>` for desktop. Two primary navs, and every link in the DOM twice.
- Don't reach for `::details-content`. Not widely available until roughly 2028.
- Don't give a childed `NavItem` a working link. Its `href` is ignored by design.
- Don't make the brand an `<h1>`, and don't make it a `<span>` at heading size either.
- Don't ship the raster logo. It is superseded and it is 189 KB for 20px of height.
- Don't restate the phone number here or add a prop for the displayed text.
- Don't add a `:focus-visible` rule. The base rule already covers both element types.
- Don't add a client boundary for the toggle. The whole mechanism exists so there is none.
