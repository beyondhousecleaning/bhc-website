/**
 * Home — Beyond House Cleaning
 *
 * UI-SPEC §9.2, the full template: Hero → TrustBar → six ServiceCards →
 * BeforeAfterSlider → ProcessSteps → ReviewRail → FAQAccordion → CTABand →
 * footer. Arbor Trail's proven sequence with orange actions and warm neutrals
 * rather than their cold blue.
 *
 * EVERY WORD ON THIS PAGE COMES FROM `@/content/home.js`. Two independent
 * reasons, either of which alone would settle it: the components are
 * framework-agnostic UI and must not carry site copy, and the `claude-seo`
 * PostToolUse hook rejects a `.jsx` write containing a common English verb that
 * ordinary prose keeps producing. Copy lives in `.js`. Keep it so.
 *
 * §4's BAND ORDER, WHICH IS WHAT PRODUCES THE 60/30/10 COLOUR SPLIT. The tones
 * alternate down the page rather than being chosen per section:
 *
 *   Hero                paper-warm   (bhc-hero's own ground)
 *   TrustBar            paper
 *   ServiceCard ×6      warm         cards on paper
 *   BeforeAfterSlider   paper
 *   ProcessSteps        tint
 *   ReviewRail          warm         see below — it was unbanded while empty
 *   FAQAccordion        paper
 *   CTABand             navy         the ONE dark band, immediately above the footer
 *
 * Never two identical tones adjacent, and never a second navy band.
 *
 * THE REVIEW RAIL IS BANDED NOW, AND IT WAS RIGHT NOT TO BE BEFORE. Plan 02-11
 * rendered it bare on purpose: it returned null on empty data, so a band around
 * it would have emitted a headless empty section into every build AND put the
 * process band's neighbour-to-be, the FAQ band's paper ground, next to another
 * paper ground. With real reviews in it the rail has content, needs the band's
 * container and vertical rhythm like every other section, and takes `warm` —
 * neither of its neighbours' tones, which is the whole adjacency rule. The band
 * carries no heading: the rail supplies its own <h2> from the package default,
 * and a band heading above it would say the same thing twice.
 *
 * SIX THINGS THIS FILE DELIBERATELY DOES NOT DO, each with a CI gate behind it,
 * so none of them is a style preference:
 *
 *   1. No `Breadcrumbs`. UI-SPEC §9.2 has none on `/` — this IS the root — and
 *      `PAGE_EXPECTATIONS['/']` in check-html-locks.mjs sets `hasBreadcrumbs:
 *      false` and `ldJsonBlocks: 1` permanently. The one JSON-LD block on this
 *      page is NAPFooter's, from the layout.
 *   2. No schema-emitting prop on the rating. That prop is OFF on every Phase 2
 *      template; a second block here turns SC-4f red. The prop is not named in
 *      this file: 02-02's acceptance greps this directory for it, and a comment
 *      explaining an absence that matches the grep policing that absence is a
 *      defect this phase has hit ten times.
 *   3. No `InterlinkBlock`. The locations teaser is Phase 3 — the component
 *      returns null without town data anyway, and SC-4d asserts the inverse
 *      until that data exists.
 *   4. No `RatingBadge` on the navy band. The badge sets --bhc-ink directly
 *      rather than inheriting currentColor, so it is light-surface only and
 *      illegible on --bhc-navy. `Hero`'s badge is the only one on the page,
 *      which is also what keeps the rating stated exactly once.
 *   5. No phone number and no client directive anywhere under web/app. The
 *      number lives once, in the package's src/phone.js; every tel: link on
 *      this page comes from NAPFooter in the layout.
 *   6. No CSS import. layout.jsx is the only file in the app that imports one —
 *      a route-level import produces a second hashed stylesheet chunk and
 *      splits the cascade (SC-1b).
 *
 * The `<h1>` is Success Criterion 2 copy and must match `PAGE_EXPECTATIONS`
 * character for character. The `<title>` does not match it, and need not — see
 * the metadata note at the foot of home.js for the measurement.
 */

import {
  BeforeAfterSlider,
  Button,
  CTABand,
  FAQAccordion,
  Hero,
  ProcessSteps,
  ReviewRail,
  SectionBand,
  ServiceCard,
  TrustBar,
} from '@bhc/design-system';

import {
  HOME_ACTIONS,
  HOME_CTA,
  HOME_DESCRIPTION,
  HOME_FAQS,
  HOME_HEADINGS,
  HOME_HERO,
  HOME_INTRO,
  HOME_SERVICE_CARDS,
  HOME_TITLE,
} from '@/content/home.js';
import { PROCESS_STEPS } from '@/content/process.js';
import { HOME_REVIEWS, REVIEWS_ANCHOR, REVIEWS_CTA } from '@/content/reviews.js';
import { RATING } from '@/content/site.js';

export const metadata = { title: HOME_TITLE, description: HOME_DESCRIPTION };

export default function Page() {
  return (
    <>
      <Hero
        eyebrow={HOME_HERO.eyebrow}
        heading={HOME_HERO.heading}
        lead={HOME_HERO.lead}
        rating={RATING}
        actions={HOME_ACTIONS}
      />

      {/* The band carries the <h2>, so TrustBar renders the bare <ul>.

          The action under it is §5's reinstated reviews link, and this band is
          where it belongs: the three closed-set trust claims, then the way to
          the evidence for them. Its label and its href both come from
          reviews.js, which builds the href from the same constant the rail's id
          is set from below, so the two cannot drift. `bhc-section__action` is a
          plain class, the `bhc-service-card__grid` arrangement — SectionBand has
          no actions prop and must not gain one. */}
      <SectionBand heading={HOME_HEADINGS.trust}>
        <TrustBar heading={null} />
        <div className="bhc-section__action">
          <Button href={REVIEWS_CTA.href} variant={REVIEWS_CTA.variant}>
            {REVIEWS_CTA.label}
          </Button>
        </div>
      </SectionBand>

      {/* `bhc-service-card__grid` is a plain class, not a component
          (ServiceCard.prompt.md). headingLevel 3 keeps the outline legal under
          this band's <h2>. */}
      <SectionBand tone="warm" heading={HOME_HEADINGS.services} intro={HOME_INTRO}>
        <div className="bhc-service-card__grid">
          {HOME_SERVICE_CARDS.map((card) => (
            <ServiceCard
              key={card.href}
              title={card.title}
              href={card.href}
              summary={card.summary}
              includes={card.includes}
              headingLevel={3}
            />
          ))}
        </div>
      </SectionBand>

      {/* NO `pairs` PROP, AND THAT IS ROADMAP SUCCESS CRITERION 3. This is the
          one component in the package that renders MORE without data rather
          than nothing: it emits data-bhc-photo-state="pending" with a labelled,
          finished-looking placeholder, so no page is blocked on photography
          that does not exist yet. Plan 04 of Phase 4 supplies the real pairs and
          asserts the pending marker reaches zero on the pages it has backfilled.
          Do not "fix" this by removing the section. */}
      <SectionBand heading={HOME_HEADINGS.photos}>
        <BeforeAfterSlider />
      </SectionBand>

      <SectionBand tone="tint" heading={HOME_HEADINGS.process}>
        <ProcessSteps steps={PROCESS_STEPS} />
      </SectionBand>

      {/* Six real, verbatim Google reviews, server-rendered — one per service,
          so the rail reads as varied rather than as six ways of saying the same
          thing. The prediction plan 02-11 made held: a data file arrived and the
          call site did not move. `id` is set from the same constant the trust
          band's action builds its href from, so the anchor cannot dead-end. */}
      <SectionBand tone="warm">
        <ReviewRail reviews={HOME_REVIEWS} id={REVIEWS_ANCHOR} />
      </SectionBand>

      {/* FAQAccordion emits no structured data — ever. Delta 7 greps every built
          page for the schema type it declines to emit, and that type is named in
          its .prompt.md and nowhere in executable source. */}
      <SectionBand heading={HOME_HEADINGS.faqs}>
        <FAQAccordion items={HOME_FAQS} />
      </SectionBand>

      {/* The one navy band, last before the footer. Its second action is `ghost`
          rather than `secondary`: an outlined ink button on navy measures 2.65:1
          and reads as nothing. CTABand coerces it either way; home.js states it
          correctly so the coercion never has to fire. */}
      <CTABand heading={HOME_CTA.heading} actions={HOME_CTA.actions} />
    </>
  );
}
