/**
 * /get-a-quote — Beyond House Cleaning
 *
 * The full UI-SPEC §9.4 entry template: Breadcrumbs → Hero align="centered"
 * (no image, rating included) → Prose explaining what happens next →
 * QuoteFormEntry → ProcessSteps. Every field comes from the record in
 * web/content/utility.js and the three steps from web/content/process.js.
 *
 * NO FORM ON THE FORM PAGE. §7.11: this is an ENTRY POINT to the booking flow
 * that already exists, never a form of its own. There is no <form>, no
 * <input>, no <select> and no <textarea> on this route, and none may be added.
 * A real form needs validation state, validation state needs a browser
 * boundary, and a first-party browser boundary turns SC-4g red — one text
 * input would cost the phase its central architectural claim.
 *
 * THE TEL: BUDGET, because this page is the reason the cap is four rather than
 * three. QuoteFormEntry carries its own tel: fallback, derived from the one
 * number in the package's src/phone.js — this route passes it no `phone` prop
 * and writes no digits. In this wave the page carries TWO tel: links,
 * NAPFooter's and QuoteFormEntry's; once plan 02-13 composes the layout it
 * carries FOUR, adding the Header's desktop link and StickyCallBar's. That is
 * exactly what 02-02's delta 2(b) allows. The fallback is not the link to
 * remove to make a lock go green, and the cap does not come back down to three.
 *
 * CTABand is deliberately absent: §9.4 gives a utility page QuoteFormEntry OR
 * CTABand, and asking someone already on the quote page to go to the quote
 * page is a self-link, not a call to action.
 *
 * No schema-emitting prop on the rating — 2 JSON-LD blocks here, NAPFooter's
 * and Breadcrumbs', and a third fails SC-4f. That count, and the breadcrumb
 * trail, are what the PAGE_EXPECTATIONS entry for this route now says.
 */

import {
  Breadcrumbs,
  Hero,
  SectionBand,
  Prose,
  QuoteFormEntry,
  ProcessSteps,
} from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { PROCESS_STEPS } from '@/content/process.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/get-a-quote');

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

      {/* No `phone` prop. The number lives once, in the package. */}
      <SectionBand tone="tint" width="narrow">
        <QuoteFormEntry />
      </SectionBand>

      {/*
        The band supplies the <h2> and ProcessSteps is then just the list —
        the composed case its own header documents. Passing `heading` here too
        would render two headings for one section.
      */}
      <SectionBand tone="warm" heading="How it works">
        <ProcessSteps steps={PROCESS_STEPS} />
      </SectionBand>
    </>
  );
}
