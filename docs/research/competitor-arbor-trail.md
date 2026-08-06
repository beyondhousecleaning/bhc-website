# Competitor teardown — Arbor Trail Cleaning Co

Reference site Sam wants to model. Analysed 2026-08-06.
URL: https://www.arbortrailcleaningco.com · Metro Detroit / Ann Arbor, MI · claims ~$200k/mo revenue.

## Verdict in one line

They win on **programmatic location×service pages at scale + review volume**, not on content marketing or technical SEO — their technical hygiene is genuinely poor, which is our opening.

## Platform & stack

| Item | Finding |
|---|---|
| Builder | Webflow (`cdn.prod.website-files.com`) |
| Built by | [Blue Collar Builds](https://www.bluecollarbuilds.tech/) — agency specialising in trades/home-service sites |
| Font | Poppins (Google Fonts), single family throughout |
| Booking | External `/book-online` (all CTAs converge here) |

## Page inventory (sitemap.xml — 169 URLs)

| Pattern | Count | Purpose |
|---|---|---|
| `/service-areas/<city>-mi/<service>` | 85 | **The engine** — location×service combo pages |
| `/service-area/<city>-mi` | 17 | City hub pages |
| `/service/<slug>` | 9 | Service pages |
| `/<city>-mi/<service>` | ~31 | **Legacy duplicate** of the combo pattern |
| `/<service>-services-plymouth-mi` | 5 | **Legacy duplicate** (flat slug) |
| `/original-services/<service>` | 5 | **Legacy duplicate** |
| `/get-a-quote/<service>` | 5 | **Legacy duplicate** |
| `/blog-posts/*` | **1** | One single blog post |
| Utility | ~10 | faq, checklist, careers, contact, login, legal |

## What's broken (our opportunity)

| Flaw | Evidence | Why it matters |
|---|---|---|
| **Self-cannibalising URLs** | 4 competing patterns for the same city×service; each self-canonicalises (verified on `livonia-mi`) | ~40 URLs compete against each other for identical intent |
| **Zero structured data** | `application/ld+json` count = 0 on homepage, city hub, and combo page | No LocalBusiness, Service, FAQPage, or AggregateRating markup at all |
| **Near-zero content depth** | 1 blog post total | No topical authority layer |
| **Duplicate H2s on-page** | Combo page has "Why Choose…" and "Why … Matters?" repeating the exact keyword | Thin, templated copy |

They rank *despite* this. Fix these four and we out-execute them on the same layout.

## Layout — homepage section order

Clean, one H1, flat H2s, no nesting deeper than H3.

1. **H1** `METRO DETROIT & ANN ARBOR'S TOP-RATED HOME CLEANING SERVICE`
2. H2 subhead naming 5 specific towns ("Ann Arbor, Plymouth, Livonia, Northville, and nearby communities")
3. `Our Services` — 5 cards (House Cleaning, Deep Clean, Post-Construction, Move-In/Out, AirBnB & Rental)
4. `Why choose …?` — 4 icon tiles (Online Booking · Trusted Professionals · Cash-Free Payments · Satisfaction Guaranteed)
5. `Our Process` — 3 steps (Schedule Online → We Handle It → Enjoy The View)
6. `Some of our before & afters` — image pairs
7. `Ready for a clean house?` — CTA + H3 `Serving Metro Detroit's Homeowners`
8. `FAQ`
9. Footer — nav, socials, **outbound link to a Google Maps place URL** (local relevance signal)

## Combo-page template (`/service-areas/<city>-mi/<service>`)

```
H1  Trusted <Service> in <City>, <State>
H2  Why Choose <Brand> for <Service> in <City>, <State>?
H2  Why <Service> in <City>, <State> Matters?
H2  Ready for a clean house?   (CTA)
H2  FAQ
```

~57KB page. Exact-match keyword in H1 + both H2s + title + description.

## Meta pattern (copy this)

| Field | Their pattern |
|---|---|
| Title (home) | `Metro Detroit House Cleaning Services \| Arbor Trail Cleaning Co` — geo + service + brand |
| Title (combo) | `Trusted Recurring Cleaning in Livonia, MI \| Arbor Cleaning` |
| Description | Leads with **"With over 1,100 5-star reviews"**, ends with a CTA ("Call now!") |

Review count is their headline trust asset and it's in the meta description of every page.

## Design tokens observed

| Token | Value |
|---|---|
| Font | Poppins |
| Navy | `#112d4e`, `#0d3b66` |
| Bright cyan | `#00bcf4` |
| Light blue | `#6ebaff`, `#66b6ff` |
| Pale tint | `#eef7ff` |
| Neutrals | `#fff`, `#fafafa`, `#222`, `#2d2d2d`, `#5d6c7b` |

Their blue range already overlaps BHC's logo (cyan→navy). BHC's orange sponge accent is a differentiator they have no equivalent for.

## CTA language

One destination (`/book-online`), four labels: `Book Now` · `Get A Free Quote` · `Get Your Free Quote` · `Get A Quote`. Phone in header as `tel:` link.
