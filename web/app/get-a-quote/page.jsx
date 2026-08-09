/**
 * /get-a-quote — WAVE-1 STUB, not the finished template.
 *
 * Plan 02-08 replaces this with the full UI-SPEC §9.4 utility template:
 * `Breadcrumbs` → `Hero align="centered"` → `Prose` → `QuoteFormEntry` →
 * `ProcessSteps`. Until then this file exists for one structural reason: the
 * built-HTML lock harness became multi-page in plan 02-02, and a multi-page
 * harness asserted against a one-page site is vacuous. This is the second real
 * route, so every new assertion is exercised by more than one page from wave 1.
 *
 * It also makes Home's single CTA resolve. Delta 6 requires every internal
 * href in built HTML to be a key of `.next/prerender-manifest.json`.
 *
 * Because this is a stub, `PAGE_EXPECTATIONS` in web/scripts/check-html-locks.mjs
 * seeds this route with `hasBreadcrumbs: false` and `ldJsonBlocks: 1`. Plan
 * 02-08 task 3 flips both to `true` / `2` when `Breadcrumbs` lands here.
 *
 * No form. §7.11 — this page is an ENTRY POINT to BK V3's booking flow, never
 * a form of its own. As everywhere under web/app: no client directive, and the
 * canonical phone number is not written here (it lives in the package's
 * src/phone.js).
 */

import { Hero } from '@bhc/design-system';

export const metadata = {
  title: 'Get a Free Cleaning Quote | Beyond House Cleaning',
  description:
    'Rated 4.9 by 175 Google reviews. House cleaning quotes across Warwickshire by DBS-checked, insured local cleaners. Free quote in two minutes.',
};

export default function Page() {
  return (
    <Hero
      align="centered"
      eyebrow="Two minutes, no obligation"
      heading="Get a Free Cleaning Quote"
      lead="Tell us about your home and we'll come back with a fixed price before anyone sets foot in it."
      rating={{ rating: 4.9, count: 175, source: 'Google' }}
    />
  );
}
