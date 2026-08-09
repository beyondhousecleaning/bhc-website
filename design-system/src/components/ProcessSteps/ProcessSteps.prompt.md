---
category: Content
---

# ProcessSteps

Three numbered steps. It is the section that turns "we clean houses" into "here is what happens
after you press the button", and it sits in the order Arbor Trail proved: after the photography,
before the reviews.

## The numbers are not data

Every numeral comes from the `<ol>`'s own ordinal — `counter-reset` on the list, `counter-increment`
on the item, `content: counter()` on the disc. **No step object carries a number and none ever
should.**

From Phase 3 these steps come from a data module edited by whoever is writing copy that week. A
hand-typed `1.` survives exactly until the first reorder, and then the page reads `1, 3, 2` with
nothing in CI able to see it. A counter cannot go out of order because there is nothing to keep in
order.

## The three steps

| # | Title | Body |
|---|---|---|
| 1 | Tell us about your home | A two-minute form or one phone call. Rooms, extras, and how often you'd like us. |
| 2 | We match you with a local cleaner | The same DBS-checked cleaner each visit wherever we can, so they learn your home rather than starting from scratch. |
| 3 | You get your evening back | We clean, you check. Not happy with something? Tell us and we'll put it right. |

### Step 3 is a commercial promise, and it is Sam's to make

The shipped wording **deliberately states no time window and no re-clean commitment**. UI-SPEC §14-1
carries it as an open item: `design-system.md` §3.1 authorises the word *guarantee* on `TrustBar`,
but only Sam can say what is actually promised. If BHC operates a specific policy — a 24-hour
re-clean, say — it goes in verbatim, because a specific promise converts better than a vague one.
Until then, do not sharpen this copy on your own initiative.

## Type and colour, measured

| Element | Value |
|---|---|
| Disc | `--bhc-action` fill, `--bhc-ink` numeral — **5.17:1** |
| Disc size | 44px, UI-SPEC §2's minimum touch target reused so the discs line up with every other affordance |
| Step title | `--bhc-text-xl` as an `<h3>` |
| Step body | `--bhc-text-base` |

White on `--bhc-action` is 3.05:1 and is not an option for the numeral.

## Two forms

| `heading` | Renders |
|---|---|
| omitted | the bare `<ol class="bhc-steps">` — use this inside a `SectionBand` that already supplies the `<h2>` |
| supplied | a `<section>` wrapping the heading and the list |

A heading cannot live inside the `<ol>`: its content model is `li`, `script` and `template` only, so
the parser would hoist the heading out and break the counter the numerals depend on.

## Layout

Single column below 768px, three columns at 768px and above. Three steps and three columns is not a
coincidence — a fourth step breaks the grid and, more to the point, nobody reads a four-step
process on a cleaning site.

## Don't

- Don't put a number in the data. That is the whole point of the component.
- Don't add a fourth step.
- Don't put this on a `navy` band. The body copy is `--bhc-ink-muted`, which measures 1.10:1 there,
  and the one navy band per page belongs to `CTABand`.
- Don't sharpen step 3's remedy wording without Sam. It is a commercial promise, not copy.
- Don't set `headingLevel={3}` to make the heading smaller — it also steps the step titles down to
  `<h4>`, which is the point of it.
