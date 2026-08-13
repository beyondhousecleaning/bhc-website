---
category: Navigation
---

# Footer

**A composition layer, not a landmark.** `Footer` emits no `<footer>` element. It renders exactly one
`NAPFooter`, which owns the landmark, the single `tel:` link and the `HomeAndConstructionBusiness`
JSON-LD.

## Why it emits no landmark

`check-html-locks.mjs` asserts **exactly one `<footer>` per page**, and that assertion is the
structural half of REQ-nap-consistency: the NAP block exists once, in one component, rendered from
one place in the root layout. A wrapper `<footer>` around `NAPFooter`'s `<footer>` would be two
landmarks, two contentinfo roles announced by a screen reader, and a red lock.

So this component's whole job is data: it takes the sitewide columns, legal row, social profiles,
Google place URL, served towns and opening hours, guards them, and hands them to the one component
that renders them.

## The failure mode this component exists to prevent

`web/app/layout.jsx` today passes `areaServed` and `hours` **directly** to `NAPFooter`. Plan 02-13
replaces that call with `<Footer …/>`. Anything `Footer` does not forward is lost from the structured
data on all 18 pages **with a fully green CI**:

| Link in the chain | What it does |
|---|---|
| `NAPFooter.jsx:44` | `areaServed = []` by default |
| `NAPFooter.jsx:68-70` | emits `areaServed` City nodes **only when the array is non-empty** |
| the lock harness | no assertion counts City nodes |
| the JSON-LD block count | **unchanged** — `areaServed` is a property, not a block |
| ROADMAP Phase 5 SC-1 | explicitly requires `LocalBusiness` + `areaServed` |

Every one of those is individually reasonable, and together they mean a dropped prop shows up three
phases later as a ranking defect with no failing test pointing at its cause. `web/content/site.js`
exports `AREA_SERVED` and `HOURS` as named constants for exactly this hand-off, and its comment says
so from the other end.

**Both are forwarded undefaulted.** `NAPFooter`'s own defaults are the fallback. A default in this
file would paper over an omission and make it unfindable — an absent `areaServed` should produce
JSON-LD with no `areaServed` key, which is visible, rather than a plausible-looking list this
component invented.

## Guards, and which of them are load-bearing

This component sits in the root layout, so a single malformed entry in a Phase-3 nav data file would
500 **every** route rather than break one list. `NAPFooter.jsx:105-123` establishes the idiom;
`Footer` applies it one level up.

| Input | Guarded by `NAPFooter`? | Guarded here? | Why |
|---|---|---|---|
| `columns` | yes (`.filter(Boolean)`) | yes | belt and braces |
| `col.links` | yes (`(col.links \|\| [])`) | yes | belt and braces |
| `legal` | **no** — `NAPFooter.jsx:131` maps it unfiltered | **yes** | this filter is the only thing between a null entry and a 500 on 18 pages |
| `social` | **no** — `s.href` is read unguarded for schema `sameAs` | **yes** | same |
| `mapsUrl` | yes (`/^https?:\/\//i`) | **deliberately not** | see below |

## `mapsUrl` is passed through untouched

`NAPFooter` applies the WR-10 scheme guard and drops the whole "Find us on Google" block, and the
schema `sameAs` entry, when the value is not `http(s)`. `Footer` is the one place upstream of that
guard, so normalising, trimming or defaulting the value here would defeat it. The same guarded value
feeds `sameAs`: an origin Google is told the business also lives at is a claim, not decoration.

## Two props this component does not have

**No `phone`.** The number lives once, in `design-system/src/phone.js`, and `NAPFooter` defaults from
it. The live site DISPLAYS one number and DIALS another on all 115 pages; that is only expressible
when the two are separate inputs, and restating the number here would be the second source the
design removed.

**No `as`, despite UI-SPEC §7.2 listing one.** §13-J's escape hatch belongs on the component that
renders the anchor, and this one renders none — every `<a>` in the output is `NAPFooter`'s, and
`NAPFooter` takes no `as`. A declared-but-unforwarded `as` would be dropped silently at a call site
that believed it had substituted its router link component, which is a worse failure than not having
the prop. Omitting it means a typed caller passing `as` gets a compile error instead of a no-op. If a
router link is ever genuinely needed in the footer, add `as` to `NAPFooter` and forward it here in
the same change.

## The columns

| Column | Links |
|---|---|
| Services | the six service pages |
| Company | About Us · Work With Us · Contact Us · Gift Cards |
| Customers | What's Included · Get a Quote · Customer Login |
| Legal (bottom row, **not** a column) | Privacy Policy · Terms of Service · Customer Service Agreement |

Three columns and a legal row, not four columns. The legal row is a separate slot below the grid
with its own styling; modelling it as a fourth `FooterColumn` would render it as a headed `<nav>`
landmark inside the column grid, which is not what §7.2 draws.

Between these and the header nav, all sixteen non-home routes are linked from every page. Home is
reachable from the header brand link.

## Don't

- Don't wrap the output in a `<footer>`, a `<div class="footer">` or any other landmark. One
  `<footer>` per page, and it is `NAPFooter`'s.
- Don't default `areaServed` or `hours` here. An omission must be visible in the output.
- Don't normalise or default `mapsUrl`. The scheme guard is downstream and this is upstream of it.
- Don't add a `phone` prop. One number, one file.
- Don't add an `as` prop that is not forwarded. Add it to `NAPFooter` instead.
- Don't drop the `legal` and `social` filters as redundant. They are not — `NAPFooter` maps both
  unguarded.
