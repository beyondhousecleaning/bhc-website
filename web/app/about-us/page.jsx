/**
 * /about-us — Beyond House Cleaning
 *
 * UI-SPEC §9.4, the utility template: Breadcrumbs → Hero align="centered" (no
 * image, rating included) → Prose → CTABand. Every field it renders comes from
 * the record in web/content/utility.js; nothing is typed twice.
 *
 * THREE THINGS THIS FILE DELIBERATELY DOES NOT DO, each with a CI gate behind
 * it, so none of them is a style preference:
 *
 *   1. It renders no prose-block mapping of its own. `renderBlocks` from
 *      @/content/blocks.jsx is the ONLY block-to-element map in the project —
 *      a second one drifts from the first the first time a block type is added.
 *   2. It passes no schema-emitting prop to the rating. The steady state is 2
 *      JSON-LD blocks on this page, NAPFooter's and Breadcrumbs' — a third
 *      turns SC-4f red. (The prop is not named here: 02-02's acceptance greps
 *      this directory for it, and a comment explaining an absence that matches
 *      the grep policing that absence is a defect this phase has hit nine
 *      times now.)
 *   3. It writes no phone number and no client directive. The number lives once
 *      in the package's src/phone.js; every tel: link on this page comes from
 *      NAPFooter in the layout.
 *
 * The <h1> is Success Criterion 2 copy and must match PAGE_EXPECTATIONS in
 * web/scripts/check-html-locks.mjs character for character. The <title> does
 * NOT match it — see the header of utility.js for the measurement.
 */

import { Breadcrumbs, Hero, SectionBand, Prose, CTABand } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/about-us');

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

      <SectionBand>
        <Prose>{renderBlocks(PAGE.prose)}</Prose>
      </SectionBand>

      <CTABand
        heading="Ready for a properly clean home?"
        actions={[
          { label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' },
          { label: "See What's Included", href: '/checklist', variant: 'ghost' },
        ]}
      />
    </>
  );
}
