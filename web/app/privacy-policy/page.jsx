/**
 * /privacy-policy — Beyond House Cleaning
 *
 * UI-SPEC §9.4, the LEGAL variation of the utility template: Breadcrumbs →
 * Hero align="centered" (no image, rating included) → Prose width="narrow".
 * Every string it renders comes from the record in web/content/legal.js.
 *
 * WHAT IS DELIBERATELY ABSENT, AND WHY IT IS NOT AN OVERSIGHT. The other seven
 * utility routes close with a CTABand; §9.4 says these three do not, and none
 * of them carries a BeforeAfterSlider or a QuoteFormEntry either. A legal page
 * is a page somebody reads because they need to know something, not a
 * conversion surface, and a "Get a Free Quote" button under a data-rights
 * section reads as exactly what it is.
 *
 * That absence has a consequence in the lock harness worth stating here rather
 * than leaving somebody to rediscover it: SC-4e asserts a primary Button on
 * every app page that is not exempt, and until plan 02-13 composes Header into
 * the root layout there is nothing sitewide to supply one. All three legal
 * routes are therefore listed in the harness's NO_PRIMARY_CTA_YET set, which is
 * asserted in the INVERSE — the moment Header lands they fail and force
 * themselves out. See the comment above that set.
 *
 * THREE MORE THINGS THIS FILE DOES NOT DO, each with a CI gate behind it:
 *
 *   1. No prose-block mapping of its own. `renderBlocks` from
 *      @/content/blocks.jsx is the ONLY block-to-element map in the project.
 *   2. No schema-emitting prop on the rating. The steady state is 2 JSON-LD
 *      blocks here, NAPFooter's and Breadcrumbs' — a third turns SC-4f red.
 *      (The prop is not named: 02-02's acceptance greps this directory for it,
 *      and a comment explaining an absence that matches the grep policing that
 *      absence is a defect this phase has now hit ten times.)
 *   3. No phone number and no client directive. The number lives once in the
 *      package's src/phone.js and reaches this page through NAPFooter only.
 *
 * The one internal href on this page is the first breadcrumb's `/`. There is no
 * link to /services/* — that route does not exist until wave 5, and delta 6
 * resolves every internal href against the prerender manifest.
 *
 * The <h1> is Success Criterion 2 copy and must match PAGE_EXPECTATIONS in
 * web/scripts/check-html-locks.mjs character for character.
 */

import { Breadcrumbs, Hero, SectionBand, Prose } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { byPath } from '@/content/legal.js';
import { RATING } from '@/content/site.js';

const PAGE = byPath('/privacy-policy');

export const metadata = { title: PAGE.title, description: PAGE.description };

export default function Page() {
  return (
    <>
      {/* Two crumbs. Only the last carries aria-current="page" (02-01, §13-R). */}
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: PAGE.crumb }]} />

      <Hero
        align="centered"
        eyebrow={PAGE.eyebrow}
        heading={PAGE.h1}
        lead={PAGE.lead}
        rating={RATING}
      />

      {/*
        `width="narrow"` on BOTH, and they are two different mechanisms: the band
        narrows the container, and Prose narrows the reading measure inside it.
        Note the measured caveat recorded in 02-04 — the narrow container token
        is 800px, which is WIDER than Prose's own 68ch default. Phase 5 owns the
        rename; nothing here works around it.
      */}
      <SectionBand width="narrow">
        <Prose width="narrow">{renderBlocks(PAGE.prose)}</Prose>
      </SectionBand>
    </>
  );
}
