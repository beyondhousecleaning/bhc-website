/**
 * /work-with-us — Beyond House Cleaning
 *
 * THIS PAGE SHIPS NO <h1> AT ALL ON THE LIVE SITE. One of the four the
 * 2026-08-06 audit measured (with /contact-us, /gift-cards and
 * /customer-login); the real keyword-bearing heading it now carries is ROADMAP
 * Success Criterion 2.
 *
 * UI-SPEC §9.4: Breadcrumbs → Hero align="centered" (no image, rating
 * included) → Prose → CTABand. Every field comes from the record in
 * web/content/utility.js.
 *
 * THE CLOSING BAND IS THE CUSTOMER CTA, not a careers one. §5's CTA vocabulary
 * is a closed set of five labels and none of them is an apply action, so the
 * band stays the sitewide one and the record's own copy carries the how-to-
 * apply paragraph instead. Inventing a sixth CTA here would fork the set on
 * one page. If a real applicant flow ever lands, it belongs in §5 first.
 *
 * No block mapping of its own, no schema-emitting prop on the rating (2
 * JSON-LD blocks — NAPFooter's and Breadcrumbs'), and no phone number in this
 * directory.
 */

import { Breadcrumbs, Hero, SectionBand, Prose, CTABand } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/work-with-us');

export const metadata = { title: PAGE.title, description: PAGE.description };

export default function Page() {
  return (
    <>
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
