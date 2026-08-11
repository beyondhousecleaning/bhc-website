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

Every Phase 2 template composed this component with `reviews={[]}` and it rendered nothing on every
page. That prediction held exactly: when the real reviews landed, **one data file was added and no
template's structure changed** — the seven review-bearing routes pass `HOME_REVIEWS` or
`reviewsForService(slug)` from `web/content/reviews.js` into the same call site that was already
there. The `null` return is still the contract for a caller with nothing to show.

## The `reviews` anchor now resolves

`Read Our Reviews → #reviews` had been withdrawn from the closed call-to-action set for one stated
reason: the anchor's target rendered nothing without data, and the internal-link lock resolves only
hrefs beginning with a slash, so a dead in-page anchor would have passed unnoticed on all eighteen
pages. That reason expired with the data, and the action is live again on the home page. The
harness now asserts that every in-page anchor on every built page resolves to an element carrying
the matching id, so the dead-end cannot return quietly.

The `id` prop is what made that reinstatement a data change rather than an API change.

Seeding invented testimonials to make the anchor resolve was never an option and still is not: it
contradicts the whole "genuinely local team" positioning the site is built on, and a fabricated
testimonial is a banned practice under the Digital Markets, Competition and Consumers Act 2024.
Every quote this renders is a real, published Google review quoted verbatim.

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
