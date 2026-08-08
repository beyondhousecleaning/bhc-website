---
category: Trust
---

# RatingBadge

**Lock 3: this must appear in server-rendered HTML on every template.**

## Why it exists

BHC has **175 reviews at 4.9★**. On the live site that fact is invisible to search:

- It lives inside `widget.trustmary.com/Ff1X-TnJw`, a **516 KB JavaScript bundle**
- It appears in **0 of 115** page titles or meta descriptions
- There is no `AggregateRating` markup anywhere
- The review *text* — high-intent, town-specific, naturally keyword-rich — is unavailable to
  Google and to AI answer engines

Arbor Trail opens **every** meta description with *"With over 1,100 5-star reviews."* Review
volume is their single biggest trust asset and they spend it everywhere. BHC's is locked in a
widget. This component is how that changes.

## Placement

| Template | Where |
|---|---|
| Home | Hero, above the CTA row (`bare`) |
| Service | Hero (`bare`) |
| Town hub | Hero (`bare`) |
| Combo | Directly under the `<h1>` — it's the first trust signal on the money page |
| Footer | Pill variant, near the NAP block |

## Schema

`emitSchema` outputs `AggregateRating` **for the entity graph and AI citation, not for SERP
stars.** Google ignores self-serving review markup, and Trustmary-sourced reviews are
third-party-widget reviews, equally ineligible. Don't promise stars in the SERP on the back
of it.

Use it **at most once per page** — typically the homepage.

## Accessibility

The star row carries a full text label (`Rated 4.9 out of 5 from 175 Google reviews`) via
`role="img"` and `aria-label`; the visible number is `aria-hidden` so screen readers don't hear
it twice.

## Don't

- Don't render it from client-side JavaScript. That's the bug being fixed.
- Don't hardcode 4.9/175 in page templates — pass them from one source so a review-count change
  is a single edit.
- Don't emit `AggregateRating` on all ~336 combo pages. Once per site.
