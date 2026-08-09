/**
 * /services/[service] — the six service pages, from one template.
 *
 * UI-SPEC §9.3, with §4's band ordering: Breadcrumbs → Hero (rating) → Prose
 * "what's included" → BeforeAfterSlider → ProcessSteps → ReviewRail →
 * FAQAccordion → CTABand → footer.
 *
 * ONE ROUTE, SIX PAGES, AND THAT IS THE WHOLE POINT. Six hand-written
 * directories would render the same HTML and cost the same to build, so the
 * argument for this shape is entirely about what comes next. Phase 3's
 * `/location/[region]/[town]/[service]` is this pattern with three segments and
 * roughly 336 pages behind it — getting `generateStaticParams`, `await params`,
 * `generateMetadata` and the static-only `dynamicParams` export right on six
 * pages, under CI, is the cheapest possible rehearsal for it. (That export is
 * written out ONCE below, in code: the acceptance check for this file greps it
 * for exactly that assignment and requires a single hit, so a comment restating
 * it would fail the gate the comment exists to explain — this phase's tenth
 * scanner self-collision.) It is also what makes UI-SPEC
 * §13-C true: the canonical-slug rename is deferred to Phase 3 on the grounds
 * that "the template is data-driven, so the rename is a data change, not a
 * template change", and six directories would make that sentence false.
 *
 * EVERY WORD ON THESE PAGES COMES FROM `@/content/services.js`. Two independent
 * reasons, either of which alone would settle it: the components are
 * framework-agnostic UI and must not carry site copy, and the `claude-seo`
 * PostToolUse hook rejects a `.jsx` write containing a common English verb that
 * ordinary prose keeps producing. Copy lives in `.js`. Keep it so.
 *
 * `generateMetadata` IS CORRECT HERE, AND ONLY HERE. This is a dynamic route,
 * so per-slug metadata has to be computed. The static routes in plans 02-08 and
 * 02-09 keep `export const metadata` and must not be changed to match this file.
 *
 * `params` IS ASYNC AND MUST BE AWAITED, in `generateMetadata` and in the
 * default export alike. Next 16 removed synchronous access outright — a sync
 * read is a build error rather than a warning (02-RESEARCH § State of the Art).
 *
 * §4's BAND ORDER. The tones alternate down the page rather than being chosen
 * per section, and the hero's own paper-warm ground sits above the sequence
 * because `bhc-hero` is not a `bhc-section`:
 *
 *   Hero                paper-warm   (bhc-hero's own ground)
 *   Prose               paper
 *   BeforeAfterSlider   warm
 *   ProcessSteps        tint
 *   ReviewRail          —            renders nothing until Phase 4
 *   FAQAccordion        paper
 *   CTABand             navy         the ONE dark band, immediately above the footer
 *
 * Never two identical tones adjacent, and never a second navy band. §9.3's own
 * summary lists the slider on paper, which would have put two paper grounds
 * side by side under a paper prose band; §4 is the authority it cites and its
 * adjacency rule is the one that has to hold.
 *
 * SIX THINGS THIS FILE DELIBERATELY DOES NOT DO, each with a CI gate behind it,
 * so none of them is a style preference:
 *
 *   1. The trail has TWO crumbs, not three. `/services` 404s in Phase 2 and a
 *      link to it would fail delta 6 on all six pages, while an href-less
 *      middle crumb is exactly the two-`aria-current` defect plan 02-01 fixed.
 *      Phase 3 reinstates it when an index exists.
 *   2. No schema-emitting prop on the rating. `PAGE_EXPECTATIONS` fixes these
 *      pages at 2 JSON-LD blocks — NAPFooter's and Breadcrumbs' — and a third
 *      turns SC-4f red. The prop is not named in this file: 02-02's acceptance
 *      greps this directory for it, and a comment explaining an absence that
 *      matches the grep policing that absence is a defect this phase has hit
 *      ten times.
 *   3. No `InterlinkBlock`. §9.3 puts the "towns we cover for this service"
 *      block here and Phase 3 is what populates it; SC-4d asserts the inverse
 *      until that data exists.
 *   4. No `RatingBadge` on the navy band. The badge sets --bhc-ink directly
 *      rather than inheriting currentColor, so it is light-surface only and
 *      illegible on --bhc-navy. `Hero`'s badge is the only one on the page,
 *      which is also what keeps the rating stated exactly once.
 *   5. No block-to-element mapping of its own. `renderBlocks` from
 *      @/content/blocks.jsx is the ONLY one in the project — a second copy
 *      drifts from the first the moment a block type is added.
 *   6. No phone number, no CSS import and no client directive anywhere under
 *      web/app. The number lives once in the package's src/phone.js; every
 *      tel: link on these pages comes from NAPFooter in the layout.
 *
 * The `<h1>` is Success Criterion 2 copy and each of the six must match
 * `PAGE_EXPECTATIONS` in web/scripts/check-html-locks.mjs character for
 * character. The `<title>` does not match it, and need not — see the header of
 * services.js for the measurement.
 */

import {
  BeforeAfterSlider,
  Breadcrumbs,
  CTABand,
  FAQAccordion,
  Hero,
  ProcessSteps,
  Prose,
  ReviewRail,
  SectionBand,
} from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { PROCESS_STEPS } from '@/content/process.js';
import {
  BREADCRUMB_HOME,
  SERVICES,
  SERVICE_ACTIONS,
  SERVICE_CTA,
  SERVICE_HEADINGS,
  bySlug,
} from '@/content/services.js';
import { RATING } from '@/content/site.js';

/*
  An unlisted slug 404s rather than rendering on demand. That keeps the site
  fully static and keeps `prerender-manifest.json` complete, which matters twice
  over: plan 02-02's harness builds its whole page list from that manifest and
  asserts `compute === 'static'` for every route in it, so a route that quietly
  went dynamic would drop out of every assertion at once rather than failing one.
  It is also the mitigation for the only user-controlled input in the build — the
  path segment itself never reaches `bySlug` at runtime.
*/
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const record = bySlug(service);
  return { title: record.title, description: record.description };
}

export default async function Page({ params }) {
  const { service } = await params;
  const record = bySlug(service);

  return (
    <>
      {/* Two crumbs. Only the last carries aria-current="page" (02-01, §13-R). */}
      <Breadcrumbs items={[BREADCRUMB_HOME, { label: record.crumb }]} />

      <Hero
        eyebrow={record.eyebrow}
        heading={record.h1}
        lead={record.lead}
        rating={RATING}
        actions={SERVICE_ACTIONS}
      />

      {/* No band heading: the record's own <h2>s are this page's outline, and
          `Prose` never emits an <h1> — `renderBlocks` maps no such type at all. */}
      <SectionBand>
        <Prose>{renderBlocks(record.prose)}</Prose>
      </SectionBand>

      {/* NO `pairs` PROP, AND THAT IS ROADMAP SUCCESS CRITERION 3, on six more
          pages. This is the one component in the package that renders MORE
          without data rather than nothing: it emits
          data-bhc-photo-state="pending" with a labelled, finished-looking
          placeholder, so no page is blocked on photography that does not exist
          yet. Phase 4 supplies the real pairs, filtered to the service, and
          asserts the pending marker reaches zero on the pages it has backfilled.
          Do not "fix" this by removing the section. */}
      <SectionBand tone="warm" heading={SERVICE_HEADINGS.photos}>
        <BeforeAfterSlider />
      </SectionBand>

      <SectionBand tone="tint" heading={SERVICE_HEADINGS.process}>
        <ProcessSteps steps={PROCESS_STEPS} />
      </SectionBand>

      {/* An empty array renders null — expected, and composed anyway on purpose.
          Phase 4 supplies the review data, and when it does this template does
          not change: a data file does. It is deliberately NOT wrapped in a
          SectionBand, because an empty band would put two paper grounds
          adjacent and emit a headless section into every build until Phase 4. */}
      <ReviewRail reviews={[]} />

      {/* FAQAccordion emits no structured data — ever. Delta 7 greps every built
          page for the schema type it declines to emit, and that type is named in
          its .prompt.md and nowhere in executable source. */}
      <SectionBand heading={SERVICE_HEADINGS.faqs}>
        <FAQAccordion items={record.faqs} />
      </SectionBand>

      {/* The one navy band, last before the footer. Its second action is `ghost`
          rather than `secondary`: an outlined ink button on navy measures 2.65:1
          and reads as nothing. */}
      <CTABand heading={SERVICE_CTA.heading} actions={SERVICE_CTA.actions} />
    </>
  );
}
