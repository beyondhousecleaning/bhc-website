/**
 * Proof-of-integration page — Beyond House Cleaning
 *
 * Phase 1 Success Criterion 4: at least one REAL page renders Hero,
 * Breadcrumbs, RatingBadge, InterlinkBlock, Button and NAPFooter *from the
 * package*. An import that compiles is not proof; a rendered page is.
 * (NAPFooter is the sixth — it lives in layout.jsx and nowhere else, D-11.)
 *
 * LOCK 1 / D-07: `heading` is ALWAYS the page's single <h1>, and every one of
 *         these components renders server-side. There is ZERO client-directive
 *         usage anywhere in web/app — a client boundary would move the JSON-LD
 *         and the rating badge into a hydration payload and silently break
 *         Locks 3 and 9, which is the entire point of the rebuild. The CI gate
 *         for this is a plain substring grep over web/app, so do not name the
 *         directive in prose here either.
 *
 * `emitSchema` is set on exactly ONE RatingBadge on this page. Hero's internal
 * badge is `bare` and emitSchema defaults false, so this is the page's only
 * AggregateRating emission (RatingBadge.jsx:11-13).
 *
 * The copy is SCAFFOLD, not final — real templates are Phase 2. The review
 * signal (175 reviews at 4.9) is accurate as of 2026-08-06.
 */

import {
  Hero,
  Breadcrumbs,
  RatingBadge,
  InterlinkBlock,
  Button,
} from '@bhc/design-system';

export default function Page() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Warwick' }]}
      />

      <Hero
        eyebrow="Reliable & Affordable"
        heading="Deep Cleaning in Warwick"
        lead="DBS-checked local cleaners who turn up when they say they will."
        rating={{ rating: 4.9, count: 175, source: 'Google' }}
        actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
      />

      {/* RatingBadge sets --bhc-ink directly, so it is light-surface only —
          never band it on bhc-section--navy (conventions.md:50-52). */}
      <section className="bhc-section bhc-section--warm">
        <div className="bhc-container">
          <RatingBadge rating={4.9} count={175} emitSchema />
        </div>
      </section>

      <InterlinkBlock
        variant="services"
        heading="Other cleaning services in Warwick"
        intro="Every combo page links to its sibling services and its nearest towns, computed from geography rather than hand-picked."
        links={[
          {
            href: '/location/warwickshire/warwick/domestic-cleaning',
            label: 'Domestic cleaning in Warwick',
          },
          {
            href: '/location/warwickshire/warwick/end-of-tenancy-cleaning',
            label: 'End of tenancy cleaning in Warwick',
          },
          {
            href: '/location/warwickshire/warwick/office-cleaning',
            label: 'Office cleaning in Warwick',
          },
        ]}
      />

      <section className="bhc-section">
        <div className="bhc-container bhc-container--narrow">
          <Button href="/get-a-quote">Get a Free Quote</Button>
        </div>
      </section>
    </>
  );
}
