---
category: Trust
---

# ReviewRail

The zero-JavaScript horizontal rail that stands in for the live site's 516 KB third-party review
widget. Three columns at 1024px and above, a `scroll-snap` rail below, and not one byte of client
code either way.

## It returns `null` on empty data

The shipped `InterlinkBlock` convention: an empty rail is worse than no rail, and there is no
"no reviews yet" message, because that is a promise about the future rendered as content.

**Every Phase 2 template composes this component with `reviews={[]}`, so it renders nothing on every
page.** That is deliberate and it costs nothing: Phase 4 supplies the data and changes a data file
rather than eight templates.

## Nothing links to the `reviews` anchor in Phase 2

`Read Our Reviews → #reviews` was withdrawn from the closed call-to-action set for exactly this
reason. The anchor's target renders nothing without data, and the internal-link lock resolves only
hrefs beginning with a slash, so a dead in-page anchor would pass unnoticed on all eighteen pages.
Seeding invented testimonials to make it resolve contradicts the whole "genuinely local team"
positioning the site is built on.

The `id` prop exists so Phase 4 reinstates that link with a data change rather than an API change.

## Why there are no arrow buttons

An arrow needs a pointer handler, which needs a client component, which turns the client-boundary
gate red for a control the platform already provides. The rail is:

```
overflow-x: auto
scroll-snap-type: x mandatory
scroll-padding-inline: var(--bhc-space-6)
children: scroll-snap-align: start; min-width: min(320px, 80vw)
```

…with `tabindex="0"`, `role="group"` and an `aria-label` on the track, which is what makes it
reachable by keyboard and is exactly what axe's `scrollable-region-focusable` rule wants.

**That explicit tab stop is correct only because `ReviewCard` has no focusable children.** Chrome's
automatic keyboard-focusable-scroller behaviour applies only to a scroller that contains none;
Firefox makes scrollers focusable by default. Add a link inside a card and the attribute becomes a
redundant tab stop immediately before that link. The same rule, with the opposite outcome, applies
to `BeforeAfterSlider`'s State B — see that component's doc.

`role="group"` on the `<ul>` is the trade the contract chose: the track is announced as a named
region rather than as a list of three items. A scrollable rail is a region before it is a list, and
the name is what tells a keyboard user what they have landed on.

## `town`

Narrows the default heading to `What {town} customers say` and the track's accessible name to
`Customer reviews from {town}`. An explicit `heading` always wins — a page that has already said
what it wants said does not get it rewritten underneath it. Phase 3's town and combo templates are
where this starts being passed.

## It emits no review structured data

Neither the rail nor the card emits a structured-data block of any kind. Self-serving and
widget-sourced review markup are both ineligible for review rich results; the aggregate figure is
entity-graph only and `RatingBadge` emits it once per page.

## Don't

- Don't render an empty rail or a "no reviews yet" message. `null` is the specified behaviour.
- Don't seed example reviews to make the section appear before Phase 4. Invented testimonials on a
  site whose positioning is a genuinely local team is not a placeholder, it is a false claim.
- Don't add arrow buttons, a drag handle, or any other pointer control. Each one is a client
  boundary.
- Don't add a link inside `ReviewCard`. It makes this component's `tabindex="0"` a redundant tab
  stop, and the card's own doc says the same thing from the other side.
- Don't link anything to `#reviews` until the data exists.
- Don't emit review structured data.
