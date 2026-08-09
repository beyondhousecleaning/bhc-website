---
category: Navigation
---

# Breadcrumbs

**Lock 2: visible trail + `BreadcrumbList` JSON-LD on every non-home page.**

## Why

The live site has **neither, on 0 of 115 pages** — no visible trail, no markup.

The deeper problem is that a trail would currently point at nothing. Every intermediate level
of the URL hierarchy 404s:

| URL | Status |
|---|---|
| `/services` | **404** |
| `/locations` | **404** |
| `/location` | **404** |
| `/location/warwickshire` | **404** |
| `/location/warwickshire/warwick` | **404** |
| `/locations/leamington-spa` | 200 — the only town hub that exists |

So `/location/warwickshire/warwick/deep-cleaning` is a four-level URL with three non-existent
parents. Breadcrumbs only become meaningful once the locations index and town hubs are built —
which is why those two templates are part of the same piece of work.

## Trails per template

| Template | Trail |
|---|---|
| Service | `Home / Deep Cleaning` |
| Locations index | `Home / Locations` |
| Town hub | `Home / Locations / Warwick` |
| Combo | `Home / Locations / Warwick / Deep Cleaning` |
| Utility | `Home / About` |

Home gets none — a single-item trail is noise.

The Service trail is **two crumbs, not three.** `/services` does not exist in Phase 2, and a crumb
pointing at a 404 is the current live state — the thing this component exists to replace. Phase 3
reinstates the middle `Services` crumb at the same time as it builds the `/services` index; until
then the trail is shorter and correct rather than longer and broken.

## Exactly one current crumb

`aria-current="page"` is applied to the **last** crumb and only the last crumb, whatever the
trail's length. It asserts "this crumb is the page you are on", so a second one is a contradiction
— screen readers announce two current locations and the trail stops being orientation.

An intermediate crumb with no `href` is legitimate (a level in the hierarchy with no page yet). It
renders as plain text, **without** `aria-current`. This matters at scale: Phase 2 renders 17
trails, Phase 3 renders ~336.

## Schema

`BreadcrumbList` is emitted inline, **server-rendered** (Lock 9). The last crumb has no `item`
URL, per Google's guidance for the current page, and carries `aria-current="page"`.

Each `item` URL is built with `new URL(href, siteUrl)` rather than string concatenation. From
Phase 3 the hrefs come from a data file, where a missing leading slash concatenates into
`https://www.example.comwarwick` — a URL that serialises happily into the schema and that Google
will then try to fetch.

## Design notes

Small (`--bhc-text-sm`), muted, sitting just above the hero. It should read as orientation, not
as navigation competing with the header. Separator is a light `/` in `--bhc-line`.

The `<li>` elements carry **no inline style.** They used `display: contents` so the list's flex gap
applied evenly across crumbs and separators; Chrome and Safari drop such an element from the
accessibility tree, which removes the `ol`/`li` relationship that makes a trail announceable as
"list, 3 items" — the whole reason an `<ol>` is used. The spacing now comes from a
`.bhc-breadcrumbs__list li` rule in `styles.css`.

## Don't

- Don't render it on the homepage.
- Don't put `aria-current` on any crumb but the last one, and don't reintroduce a condition that
  marks every href-less crumb.
- Don't include a crumb pointing at a URL that 404s — that's the current state and it's worse
  than no trail.
- Don't put `display: contents` back on the `<li>`. It costs the list semantics the `<ol>` is
  there for.
- Don't inject the JSON-LD from client JS.
- Don't truncate the trail on mobile; wrap it instead.
