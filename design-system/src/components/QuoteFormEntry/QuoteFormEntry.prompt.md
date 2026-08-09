---
category: Actions
---

# QuoteFormEntry

The conversion panel on the utility pages. A heading, three reassurance bullets, the primary CTA,
and a phone number for the people who would rather talk to someone.

## It is an entry point, not a form — and that is a hard boundary

**No `<form>`, no `<input>`, no `<select>`, no `<textarea>`, no client JavaScript.** Two independent
reasons, either of which is sufficient:

1. **Booking-flow UX is out of scope for this site.** It belongs to Project BK V3 — `docs/goals.md`
   and REQUIREMENTS.md both list it under *Out of Scope*. `/get-a-quote` is a page that hands off to
   the booking flow that already exists.
2. **A real form needs validation state, validation state needs a client boundary, and a
   first-party client boundary turns `SC-4g` red** — the lock asserting that every module in the
   build's client-reference manifests resolves inside `node_modules/next`. One text input costs this
   phase its central architectural claim, and the JS budget stays flat across 18 → ~410 pages
   precisely because there is nothing to hydrate.

If someone genuinely needs a quote form on this site, that is a phase with a decision record, not a
prop added to this component.

## The `tel:` fallback is the FOURTH one on a composed page

Do not remove it to make a lock go green, and do not tighten the cap back to three.

| # | Component | Where |
|---|---|---|
| 1 | `Header` | ≥1024px, in the utility bar |
| 2 | `StickyCallBar` | <768px, fixed to the bottom |
| 3 | `NAPFooter` | the one `tel:` inside `<footer>` — the real NAP invariant |
| 4 | **`QuoteFormEntry`** | this panel, on `/get-a-quote` and `/customer-login` |

Plan 02-02's **delta 2(b) caps a page at four `tel:` links**, and it is four rather than three
*because of this link*. The original delta row said three and had overlooked it. The authoritative
list is the `<tel_link_budget>` block in plan 02-02; this table is its per-component half.

The invariant that actually matters is unchanged and stricter: **exactly one `tel:` between
`<footer>` and `</footer>`**, and every `tel:` href on a page digit-identical.

## The number is never restated here

`phone` defaults to `CANONICAL_PHONE` from `src/phone.js`. The label comes from `formatPhone(phone)`
and the href from `toDial(phone)` — both derived from that same one value, with **no prop for the
displayed text**. That is the `NAPFooter` idiom and it is why the live-site defect (displaying
`+44 7861 936533` while dialling `07441918832` on all 115 pages) is not expressible through this
API.

**The label must render exactly `Call +44 7861 936533`.** Plan 02-02's digit-equality clause
normalises a leading `44` but not a leading `0`, so `Call 07861 936533` fails against its own href.
`formatPhone` produces the passing form; nothing else does. If a shorter label is ever needed, use
one with **no digits at all** plus an `aria-label` — that is what `StickyCallBar` does.

A malformed `phone` **throws** (plan 02-01's guard, T-02-26). The alternative is
`<a href="tel:+44"></a>` — an empty interactive element and a WCAG 2.4.4 failure — prerendered onto
every page carrying this panel.

## Copy

| Slot | Default |
|---|---|
| `<h2>` | Get a free quote in under two minutes |
| bullets | No obligation · Fixed price before we start · DBS-checked, insured cleaners |
| primary | **Get a Free Quote** → `/get-a-quote` |
| secondary | **Call +44 7861 936533** → `tel:` from the canonical number |

All four are UI-SPEC §5, verbatim. The CTA labels are from the closed set: verbs, never nouns, and
never *Submit*, *Click here* or *Learn more*.

## Colour

`--bhc-paper-tint` ground with `--bhc-ink` copy — **13.84:1**. The primary button is the shipped
orange fill with an ink label (5.17:1); the second action is `secondary` (outlined ink), which is
correct on a tint ground and would be invisible on navy (2.65:1).

## Don't

- Don't add a form control of any kind. See the top of this doc.
- Don't remove the `tel:` fallback because a page has four `tel:` links. Four is the cap, and this
  is the fourth by design.
- Don't pass a `phone` prop at a call site. The default is the single source.
- Don't add a prop for the displayed phone text. Two inputs is exactly how the live-site defect
  became possible.
- Don't put this panel on a `navy` band. The second action is outlined ink at 2.65:1 there, and the
  panel's own tint ground would fight the band.
- Don't shorten the CTA to *Quote* or lengthen it past the §5 label. One `primary` per visual
  section.
