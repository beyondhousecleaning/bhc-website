---
category: Content
---

# FAQAccordion

ROADMAP **Success Criterion 4**: an FAQ that is present for readers *and* for crawlers and language
models, emitting no FAQ structured data.

Native `<details>` / `<summary>`. No JavaScript, no library, no client boundary.

## No `FAQPage` JSON-LD. Ever.

This is **D13**, and it is the one thing about this component that must not be re-litigated by
someone who remembers FAQ rich results being worth having.

- Google **retired FAQ rich results on 2026-05-07** for all but a small set of authoritative
  health and government sites. Beyond House Cleaning is not one of them.
- Emitting `FAQPage` now buys **no** SERP treatment and puts a structured-data claim on ~336 pages
  that nothing renders — which is the shape of markup that attracts a manual action, not traffic.
- Plan 02-02's **delta 7 greps every built page for the string `FAQPage` and asserts zero.** So does
  this plan's own acceptance criterion, over the component source.

Because of that grep, **the token `FAQPage` does not appear in `FAQAccordion.jsx` or
`FAQAccordion.html`** — not even in a comment explaining why it is absent. A comment matching the
scanner that polices it is a failure mode this repo has already hit six times. The full statement
lives here, in the prompt doc, which no scanner reads.

The component emits no JSON-LD of any kind — not `FAQPage`, not `Question`, not `Answer`.

## The three properties that make SC-4 true

| Property | Mechanism | Why it matters |
|---|---|---|
| Works with JS disabled | `<details>` / `<summary>` — the UA owns the state | Keeps this a server component, so SC-4g stays green with zero first-party client modules |
| Every answer is in the served HTML | a **closed** `<details>` still ships its full text | Verified against this build in 02-RESEARCH. This half of SC-4 holds unconditionally, regardless of anything below |
| Multiple items can be open | **no `name` attribute** on the `<details>` | `name` makes the group exclusive, which collapses the answer the reader is halfway through |

`defaultOpen` (default `0`) sets `open` on exactly one item, so there is an answer visible above the
fold. Pass `-1` for an all-closed accordion.

## Accessibility, including the caveat nobody should rediscover

`<h3>` inside `<summary>` **is valid**: `summary`'s content model is *phrasing content, optionally
intermixed with heading content*.

**But heading exposure inside `<summary>` is inconsistent across browser/AT pairs.** `summary` maps
to a button-like role, and ARIA treats a button's descendants as presentational, so some
combinations announce the heading and some announce only the button. Two consequences, both binding:

1. **Do not design anything that depends on screen-reader heading navigation through the FAQ.** No
   "jump to the questions by heading" instruction, no skip link that assumes it.
2. **The accessible name is the `<summary>`'s text content, not the `<h3>`.** If the visible question
   is ever split across elements, the name changes.

The crawler and language-model half of SC-4 does not depend on either point: the answer text is in
the document whatever the AT does with the heading.

Other a11y facts:

- The `<summary>` row is **at least 44px** tall — UI-SPEC §2's minimum touch target.
- `summary` is **already** in the shipped `:focus-visible` base rule (`styles.css:45-49`).
  **Do not add a bespoke focus style here.** Nothing in this package may change the indicator except
  the two scoped overrides at the end of `styles.css`.
- The chevron is `aria-hidden="true" focusable="false"`. `summary` supplies `aria-expanded`
  natively, so the glyph adds nothing for a screen reader.
- Rotation runs through `--bhc-dur` / `--bhc-ease`, so the token-level `prefers-reduced-motion`
  override — which zeroes all three duration tokens — applies with no second media query.

## Accepted limitations, documented rather than worked around

**Escape does not close a `<details>`, and it does not close on outside click.** Both would need
JavaScript. On a multi-page site whose FAQ is a scan surface rather than a modal, that is a fair
trade for keeping the whole render server-side.

**`::details-content` is not used.** It reached Baseline *newly available* in September 2025 and will
not be *widely available* until roughly March 2028. Do not "simplify" the styling onto it.

## Marker suppression

`list-style: none` plus `::-webkit-details-marker { display: none }`, both **scoped to
`.bhc-faq__summary`** rather than declared on the bare `summary` element. `Header`'s mobile nav uses
its own `<details>` and repeats the two lines in its own block; a package-wide `summary` rule would
silently reach into a component that does not exist yet.

## Colour

The component sets **no colour on its text at all** — the question and the answer inherit
`currentColor`. The only direct colours are the `--bhc-action-hover` hover and open states on the
`<summary>` and the chevron, which are on that token's reserved-for list in UI-SPEC §4.

## Don't

- Don't emit `FAQPage` JSON-LD, or any other structured data, from this component or from a page
  that renders it. See the top of this doc.
- Don't add `name` to the `<details>`. Exclusive accordions take away the answer being read.
- Don't add a focus style. `summary` is in the shipped base rule already.
- Don't add JavaScript to animate the open/close. `::details-content` is not ready and a scripted
  height transition needs a client boundary, which turns SC-4g red.
- Don't put this on a `navy` band. The hover and open states are `--bhc-action-hover`, which
  measures **1.15:1** there; UI-SPEC §4 places the FAQ on `paper`.
- Don't rely on the `<h3>` being announced as a heading. See the caveat above.
