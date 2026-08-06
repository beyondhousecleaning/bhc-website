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
| Service | `Home / Services / Deep Cleaning` |
| Locations index | `Home / Locations` |
| Town hub | `Home / Locations / Warwick` |
| Combo | `Home / Locations / Warwick / Deep Cleaning` |
| Utility | `Home / About` |

Home gets none — a single-item trail is noise.

## Schema

`BreadcrumbList` is emitted inline, **server-rendered** (Lock 9). The last crumb has no `item`
URL, per Google's guidance for the current page, and carries `aria-current="page"`.

## Design notes

Small (`--bhc-text-sm`), muted, sitting just above the hero. It should read as orientation, not
as navigation competing with the header. Separator is a light `/` in `--bhc-line`.

The `<li>` elements use `display: contents` so the flex gap applies evenly across crumbs and
separators rather than nesting inconsistently.

## Don't

- Don't render it on the homepage.
- Don't include a crumb pointing at a URL that 404s — that's the current state and it's worse
  than no trail.
- Don't inject the JSON-LD from client JS.
- Don't truncate the trail on mobile; wrap it instead.
