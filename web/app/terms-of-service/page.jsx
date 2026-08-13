/**
 * /terms-of-service — Beyond House Cleaning
 *
 * UI-SPEC §9.4, the LEGAL variation: Breadcrumbs → Hero align="centered" (no
 * image, rating included) → Prose width="narrow". No CTABand, no
 * BeforeAfterSlider, no QuoteFormEntry — see the header of
 * web/app/privacy-policy/page.jsx for why, and for the NO_PRIMARY_CTA_YET
 * consequence that absence has in the lock harness until plan 02-13 composes
 * Header into the layout.
 *
 * Every string comes from the record in web/content/legal.js. The block mapping
 * is `renderBlocks` from @/content/blocks.jsx and there is no second one. No
 * schema-emitting prop on the rating (2 JSON-LD blocks is the steady state), no
 * phone number, no client directive, and no internal href beyond the first
 * breadcrumb's `/`.
 *
 * The <h1> matches PAGE_EXPECTATIONS in web/scripts/check-html-locks.mjs
 * character for character.
 */

import { Breadcrumbs, Hero, SectionBand, Prose } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { byPath } from '@/content/legal.js';
import { RATING } from '@/content/site.js';

const PAGE = byPath('/terms-of-service');

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

      <SectionBand width="narrow">
        <Prose width="narrow">{renderBlocks(PAGE.prose)}</Prose>
      </SectionBand>
    </>
  );
}
