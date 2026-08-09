/**
 * /contact-us — Beyond House Cleaning
 *
 * THIS PAGE SHIPS NO <h1> AT ALL ON THE LIVE SITE. It is one of the four the
 * 2026-08-06 audit measured (with /work-with-us, /gift-cards and
 * /customer-login), and giving it a real keyword-bearing heading is ROADMAP
 * Success Criterion 2 — the measured defect this file exists to fix.
 *
 * UI-SPEC §9.4: Breadcrumbs → Hero align="centered" (no image, rating
 * included) → Prose → CTABand. Every field comes from the record in
 * web/content/utility.js.
 *
 * NO PHONE NUMBER IS WRITTEN HERE, on the page whose entire job is getting
 * hold of us. That is deliberate and it is the point of the NAP contract: the
 * canonical number lives once in the package's src/phone.js, NAPFooter renders
 * it into the footer of every page from that one value, and plan 02-13's
 * Header adds the desktop `Call` link from the same source. The live site
 * DISPLAYS one number and DIALS another on all 115 pages, which is only
 * possible when the two are separate inputs — so this directory gets none.
 *
 * No block mapping of its own (renderBlocks is the only one), and no
 * schema-emitting prop on the rating: 2 JSON-LD blocks here, NAPFooter's and
 * Breadcrumbs', and a third fails SC-4f.
 */

import { Breadcrumbs, Hero, SectionBand, Prose, CTABand } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/contact-us');

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
