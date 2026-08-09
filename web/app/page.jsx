/**
 * Home — Beyond House Cleaning
 *
 * Phase 1 Success Criterion 4: at least one REAL page renders Hero,
 * RatingBadge, Button and NAPFooter *from the package*. An import that
 * compiles is not proof; a rendered page is. (NAPFooter is rendered in
 * layout.jsx and nowhere else, D-11.)
 *
 * LOCK 1 / D-07: `heading` is ALWAYS the page's single <h1>, and every one of
 *         these components renders server-side. There is ZERO client-directive
 *         usage anywhere in web/app — a client boundary would move the JSON-LD
 *         and the rating badge into a hydration payload and silently break
 *         Locks 3 and 9, which is the entire point of the rebuild. The CI gate
 *         for this is a plain substring grep over web/app, web/content and
 *         design-system/src, so do not name the directive in prose here either.
 *
 * WHAT PHASE 2 PLAN 02-02 CHANGED, AND WHY — this page was trimmed to an
 * honest state so the rewritten lock harness is green on the wave-1 build:
 *   - `Breadcrumbs` removed. UI-SPEC §9.2: there are no breadcrumbs on `/`,
 *     and the old trail claimed `Home / Warwick` for a URL that is `/`.
 *   - `InterlinkBlock` removed. It rendered `null` without town data anyway
 *     (Phase 3 supplies it) and its three links all 404'd.
 *   - `RatingBadge`'s schema-emitting prop was dropped. DECISION: that prop is
 *     OFF on every Phase 2 template — emitting 17 orphaned AggregateRating
 *     nodes would make the deferred CR-05 seventeen times worse for Phase 5 to
 *     unwind, and the visible badge already satisfies Lock 3 in `bare` mode.
 *     Home therefore emits exactly ONE JSON-LD block, NAPFooter's.
 *     The prop is named nowhere in this file on purpose: 02-02's acceptance
 *     greps this file for it, and a comment explaining an absence that matches
 *     the grep policing that absence is a defect this phase has now hit four
 *     times (02-01-SUMMARY deviations 1, 5 and 6).
 *   - Exactly one internal link remains, `/get-a-quote`, and it resolves.
 *     Every internal href in built HTML must be a prerendered route (delta 6).
 *
 * The copy is now UI-SPEC §5's real Home deck. Plan 02-11 composes the full
 * §9.2 template (TrustBar, ServiceCards, BeforeAfterSlider, ProcessSteps,
 * ReviewRail, FAQAccordion, CTABand) on top of it.
 *
 * The canonical phone number is deliberately absent from this directory: the
 * number lives once, in the package's src/phone.js. The review signal
 * (175 reviews at 4.9) is accurate as of 2026-08-06.
 */

import { Hero, RatingBadge } from '@bhc/design-system';

export const metadata = {
  title: 'House Cleaning in Warwickshire | Beyond House Cleaning',
  description:
    'Rated 4.9 by 175 Google reviews. House cleaning across Warwickshire by DBS-checked, insured local cleaners. Free quote in two minutes.',
};

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="DBS-checked, insured, local"
        heading="Professional House Cleaning in Warwickshire & the West Midlands"
        lead="The same trusted cleaner each visit, a fixed price before we start, and an evening back to yourself."
        rating={{ rating: 4.9, count: 175, source: 'Google' }}
        actions={[{ label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' }]}
      />

      {/* RatingBadge sets --bhc-ink directly, so it is light-surface only —
          never band it on bhc-section--navy (conventions.md:50-52). */}
      <section className="bhc-section bhc-section--warm">
        <div className="bhc-container">
          <RatingBadge rating={4.9} count={175} />
        </div>
      </section>
    </>
  );
}
