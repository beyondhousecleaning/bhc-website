---
category: Navigation
---

# NAPFooter

**Lock 4: exactly one `tel:`, and the `href` digits must equal the displayed digits.**
**Lock 5: no street address or UK postcode anywhere in rendered output.**

## Lock 4 exists because of a live bug

The footer on **all 115 live pages** displays one number and dials another:

| Occurrences | `tel:` href | Displayed text | |
|---|---|---|---|
| 212 | `+447861936533` | `+44 7861 936533` | ✅ |
| **115** | `07441918832` | `+44 7861 936533` | 🔴 **mismatch** |
| 1 | `+447575709361` | `Call Us +44 7861 936533` | 🔴 **mismatch** |

Every visitor who taps the footer number on mobile dials a different number from the one they
read. Three numbers exist across the site.

Note how the lock is phrased: **"href digits must equal displayed digits"**, not "use the
correct number." Only the first version is testable, and only the first version would have
caught this — the displayed number was right all along.

**The API enforces it structurally.** `formatPhone()` derives the display string *from* the
dial string. There is no prop for the displayed text, so the two cannot diverge.

```jsx
<NAPFooter />   // the number arrives from the package default; href and label derive from it
```

## The number lives in exactly one place

`phone` is optional and defaults to `CANONICAL_PHONE` in `src/phone.js` — the single executable
occurrence of the number in the package. Four components default from it (`NAPFooter`, `Header`,
`StickyCallBar`, `QuoteFormEntry`), and the app passes no `phone` prop anywhere. A literal in a
component default would be a second place the number can be wrong, which is the defect that put
three different numbers on the live site in the first place.

## Unrenderable values fail the build

`toDial` and `formatPhone` **throw a `TypeError`**; they no longer degrade. Rejected: a non-string,
a value carrying no digits, and any UK national part that is not exactly ten digits — so `''`,
`undefined`, `null`, `'+44'`, `'call us'`, `'0786193653'` and `'078619365333'` all fail.

The old behaviour returned `+44` for an empty value and the display string agreed with it, so the
Lock 4 parity assertion passed while the page shipped `<a href="tel:+44"></a>`: an empty
interactive element and a WCAG 2.4.4 failure. Phase 2 puts four `tel:` links on each of 17 pages
and Phase 3 takes that to ~410 pages. One person seeing a red build once is cheaper than every
visitor on every page tapping a dead link.

A value that declares its own non-UK country code is exempt from the length check and passes
through untouched — its length is not this module's to police, and fabricating `+44` onto it is
the CR-04 bug.

## The Maps link is scheme-validated

`mapsUrl` renders only when it matches `^https?://`. Anything else — `javascript:`, `data:`, a
half-written relative path from a Phase-3 data file — drops the entire "Find us on Google" block,
and is excluded from schema `sameAs` too. The rendered link carries `target="_blank"` **and**
`rel="noopener noreferrer"`: `rel="noopener"` on its own is inert, because the opener it severs is
the one a new browsing context would have had.

## Lock 5: no address

The registered office — **84 Acacia Road, Leamington Spa CV32 6EQ** — is residential, and the
GBP is correctly configured as a service-area business with the address suppressed.

So the footer carries a **service-area statement**, not an address. Schema uses `areaServed`
with **no `streetAddress`**: JSON-LD ships in the HTML of every page, so putting the postcode
there publishes it across ~336 pages just as surely as printing it.

Cost: a small NAP-matching signal, since Google can't cross-reference a visible street address.
That's the accepted trade and it's standard for UK domestic-cleaning SABs.

## The Maps link

`mapsUrl` must be the **GBP place URL**. The live footer links
`google.com/maps/place/Royal+Leamington+Spa,+UK` — the *town*, not the business — which is a
completely wasted local signal on 115 pages. Arbor Trail links their actual place page.

## What belongs here

| Element | Notes |
|---|---|
| Business name | Exactly as it appears on the GBP |
| Service area | *"Serving Warwickshire, Coventry and the West Midlands"* |
| One phone | Derived display, single `tel:` |
| Hours | Businesses open at search time rank better; also stops out-of-hours calls |
| GBP place link | Real local signal |
| Nav columns | Services, Company |
| Legal | Privacy, terms, service agreement |

## Don't

- Don't add a second `tel:` anywhere in the footer.
- Don't restate the number in a component default, a call site or a data file. It lives once, in
  `src/phone.js`, and every other copy is a place it can be wrong.
- Don't catch the `toDial` throw to keep a page building. A number that cannot be rendered cannot
  be dialled either.
- Don't pass a display string — it's derived, deliberately.
- Don't put the street address or postcode in the markup or the schema.
- Don't link the Maps URL to a town, a region, or a search query.
- Don't stuff town links into the footer. That's `InterlinkBlock`'s job, and hardcoded footer
  links serving 95 pages is exactly the architecture being replaced.
