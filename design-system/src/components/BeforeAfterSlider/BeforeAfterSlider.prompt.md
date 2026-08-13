---
category: Trust
---

# BeforeAfterSlider

**ROADMAP Success Criterion 3: a page with no photography still shows a clearly labelled,
finished-looking section, and it says so in a way a machine can read.**

Before-and-after imagery is the highest-converting element on a cleaning site. It is also the one
asset this project does not yet have. This component is how those two facts stop being in conflict.

## Two states, and it never returns `null`

| State | Trigger | Root | Marker |
|---|---|---|---|
| pending | `pairs` absent, `null` or `[]` | `<figure class="bhc-ba bhc-ba--pending">` | `data-bhc-photo-state="pending"` |
| live | `pairs` supplied | one `<figure class="bhc-ba__pair">` per pair | `data-bhc-photo-state="live"` |

Every other empty-data component in this package renders nothing — `ReviewRail`, `InterlinkBlock`,
`FAQAccordion` all return `null`. **This one is the exception and it is the exception on purpose.**
A missing photograph must not silently remove a section from a page, and no page may block waiting
on photography that does not exist yet.

The built-HTML suite asserts the pending marker renders on exactly the pages that use this
component without pairs. **Phase 4 asserts it reaches zero on the pages it has backfilled** — that
attribute is the hand-off between the two phases, and it is the only machine-readable half of it.

## Placement per template

| Template | `heading` | `pairs` | State |
|---|---|---|---|
| Home | supplied by the surrounding `SectionBand` | none | pending |
| Service (×6) | supplied by the surrounding `SectionBand` | none | pending |
| Utility | not rendered — a legal page is not a conversion surface | — | — |
| Phase 4, once originals land | unchanged | per-page data | live |

`heading` and `intro` are both optional and both render a wrapping `<section>` when present. The
empty-state title is an `<h3>` either way, because it sits one level under whichever `<h2>`
introduced the section.

## BEFORE and AFTER are real text

Never baked into the image. That is one of the two independent reasons the 199 existing exports were
rejected as source:

| Finding | Detail |
|---|---|
| Dimensions | all 199 are **1080 × 1080**, median 135 KB — a 1× social export |
| Content | composited posts, before and after side by side in one square |
| Baked in | the **superseded logo**, and the words BEFORE and AFTER painted over the photograph |
| Recoverable | about **530 × 690px** per half — a 265 × 345 slot at retina density |

Pixels cannot be read by a screen reader, cannot be translated, and cannot be resized. Here the
labels are `--bhc-text-xs` uppercase text and the images carry their own `alt`.

## The panels are `role="img"`, and never `alt`

`alt` is not a valid attribute on an inline vector graphic. The parser drops it in silence, and the
image lock greps `<img>` tags only — so an unlabelled panel would ship on every page with nothing in
the suite able to see it. Delta 14 exists for exactly this class of defect and it fails any `<svg>`
carrying `alt`, or carrying neither `aria-hidden="true"` nor `role="img"` with a non-empty
`aria-label`.

Each panel is the only content of its half of the figure, so it is a **meaningful** graphic. That
supersedes the decorative default for these two elements specifically, and the two labels differ so
that a screen-reader user knows which half they are on.

## The link goes outside the track

The two-pane track carries `tabindex="0"`, `role="group"` and an `aria-label` so it can be scrolled
by keyboard below 768px. That is correct **only while it contains nothing focusable** — a link
inside a focusable scroller is a redundant tab stop immediately before itself. The pending state's
`See What's Included` link therefore lives in the `<figcaption>`, outside the track.

`ReviewRail` records the same rule from the other side: its `tabindex="0"` is correct precisely
because `ReviewCard` has no link in it.

## No drag handle in Phase 2

A pointer-driven divider needs a pointer listener, which needs a client component, which turns the
client-boundary gate red — for content that does not exist yet. Side by side at 768px and above,
with a two-pane `scroll-snap` track below, gives the comparison for zero JavaScript, and that is
what earns the name without a handle.

If a later phase wants a handle once real photographs land, it has to be argued against the
zero-first-party-client-modules decision on its own merits, with the content in hand.

## Don't

- Don't make this return `null` when there are no pairs. That is the one thing it exists not to do.
- Don't write "coming soon", "TBD" or "not yet implemented" into the copy. The state is signalled to
  machines by the data attribute and to people by copy that reads finished. The debt-marker scan
  found zero occurrences in this repo and that record holds.
- Don't put `alt` on either panel. It is invalid, it is dropped in silence, and the image lock
  cannot see it.
- Don't bake BEFORE or AFTER into an image, ever. That is half of why 199 existing files are unusable.
- Don't add a drag handle, a pointer listener, or any other client control.
- Don't move the link inside the track, and don't add a second link in there.
- Don't give these images `fetchPriority` or `loading="eager"`. The largest paint on every template
  is the Hero image; this one is below the fold on all seven pages that carry it.
- Don't put this on the one navy band — the caption and the pane labels are `--bhc-ink-muted`, which
  measures 1.10:1 there.
