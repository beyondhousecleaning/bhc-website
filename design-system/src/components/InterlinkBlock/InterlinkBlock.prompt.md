# InterlinkBlock

**Lock 6: present on the service, town-hub and combo templates.**

This is the component that decides whether ~336 pages works. It is the single most important
thing in the rebuild.

## The problem it solves

The SEO audit found **no hub-and-spoke architecture at all**:

| | |
|---|---|
| Combo pages with 0 inbound internal links | 0 — technically no orphans |
| Inbound links per combo page | **min 2, median 4, max 114** |
| Combo pages in the global footer | **exactly 4**, with 114 links each |

Those four are `daventry/apartment-cleaning`, `kenilworth/deep-cleaning`,
`leamington-spa/deep-cleaning` and `southam/apartment-cleaning` — no logic to the selection. The
other **91 get a median of 4**, all from prose links inside sibling pages.

At 95 pages this limps along. At **336 it fails outright**: four hardcoded footer links cannot
distribute authority across 336 destinations, and prose cross-links form a flat mesh with no
hierarchy for Google to read.

## The fix: compute links from geography

Never hand-pick. Hand-picked links rot the moment a town is added.

```
/locations                              → all ~56 towns
/locations/<town>                       → that town's 6 services + 6 nearest towns
/location/<region>/<town>/<service>     → breadcrumb up to the town hub
                                        → 5 sibling services, same town      (variant="services")
                                        → same service, 5 nearest towns      (variant="nearby")
```

**~11 semantically meaningful inbound links per combo page**, up from a median of 4 arbitrary
ones — and they cannot rot, because they're derived.

`buildInterlinks()` ships in this component rather than in page code so the rule has one home.
Feed it the town list built from
[`service-area-coverage.md`](../../../../docs/research/service-area-coverage.md); each town
needs `slug`, `name`, `region`, `lat`, `lon`.

## The design problem

Both variants must **look deliberate, not like an SEO footer dump.** That's the hard part and
it is a design problem, not a technical one. A grid of bare blue links at the bottom of the
page reads as spam to a human even when it's correct for a crawler.

What helps:

- Cards, not a link list. Border, generous padding, hover state.
- The `meta` line earns its place — `"3.2 miles away"` on the nearby variant is genuinely
  useful to a customer deciding whether you cover them.
- A real `<h2>`, phrased for a person: *"Other cleaning services in Warwick"*, not
  *"Related pages"*.
- Sit them **above** the FAQ and CTA, not below the footer. They're content.

## Anchor text

Full, natural phrases — `Deep Cleaning in Kenilworth`, not `Kenilworth` or `click here`.
Descriptive and varied, never exact-match keyword stuffing.

## Don't

- Don't hardcode the link list. That's the current bug.
- Don't render more than ~6 links per block; beyond that it stops looking curated.
- Don't link to a page that doesn't exist yet — check the town × service combination is real.
- Don't put these in the footer. The footer is for site-wide navigation; these are per-page.
