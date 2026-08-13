/**
 * /checklist — Beyond House Cleaning
 *
 * The content page of the five straightforward utility routes: its record in
 * web/content/utility.js carries h2 sections and ul blocks listing what a
 * standard clean includes, what a deep clean adds, and what we do not do. All
 * of it renders through the one shared `renderBlocks`, so the lists here and
 * the lists on the six service pages cannot drift into two different mappings.
 *
 * UI-SPEC §9.4: Breadcrumbs → Hero align="centered" (no image, rating
 * included) → Prose → CTABand.
 *
 * THE CLOSING BAND CARRIES ONE ACTION, NOT TWO. Every other page in this plan
 * closes with a primary to /get-a-quote and a ghost `See What's Included`
 * pointing here — and this is here. A ghost aimed at /get-a-quote instead
 * would put the same href on both buttons in one band: two buttons that do the
 * same thing, and a duplicate React key, since CTABand keys its actions by
 * href. One primary is the honest form and it still satisfies SC-4e.
 *
 * No schema-emitting prop on the rating (2 JSON-LD blocks here — NAPFooter's
 * and Breadcrumbs' — and a third fails SC-4f), and no phone number in this
 * directory: every tel: link comes from the package's src/phone.js.
 */

import { Breadcrumbs, Hero, SectionBand, Prose, CTABand } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/checklist');

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
        actions={[{ label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' }]}
      />
    </>
  );
}
