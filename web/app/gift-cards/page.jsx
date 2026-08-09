/**
 * /gift-cards — Beyond House Cleaning
 *
 * THIS PAGE SHIPS NO <h1> AT ALL ON THE LIVE SITE. One of the four the
 * 2026-08-06 audit measured (with /contact-us, /work-with-us and
 * /customer-login); the real keyword-bearing heading it now carries is ROADMAP
 * Success Criterion 2.
 *
 * UI-SPEC §9.4 with the §14-2 variation: Breadcrumbs → Hero align="centered"
 * → Prose → ONE outbound action → CTABand. NO PURCHASE FORM — this page hands
 * off to the gift-card provider, exactly as /customer-login hands off to the
 * booking portal. A real form needs validation state, validation state needs a
 * browser boundary, and a first-party browser boundary turns SC-4g red.
 *
 * THE OUTBOUND HREF IS A DATA VALUE AND IT IS SCHEME-GUARDED (WR-10). It
 * arrives from web/content/utility.js, where it is a placeholder pending Sam,
 * so it is exactly the case WR-10 was written for: a URL from a data file
 * rendered straight into an href. React 19 warns on a `javascript:` URL but
 * does not block it. The guard below tests for an absolute http(s) URL and the
 * whole band is omitted when it fails, so a bad value costs the page its
 * action rather than shipping a hostile link. `target="_blank"` is paired with
 * `rel="noopener noreferrer"` — `rel="noopener"` on its own is inert, which is
 * the second half of WR-10.
 *
 * No block mapping of its own, no schema-emitting prop on the rating (2
 * JSON-LD blocks — NAPFooter's and Breadcrumbs'), and no phone number here.
 */

import { Breadcrumbs, Hero, SectionBand, Prose, Button, CTABand } from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/gift-cards');

/* WR-10. Absolute http(s) only — anything else renders nothing at all. */
const OUTBOUND = /^https?:\/\//i.test(PAGE.outbound?.href ?? '') ? PAGE.outbound : null;

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

      {OUTBOUND ? (
        <SectionBand tone="warm" width="narrow">
          <Button
            href={OUTBOUND.href}
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            {OUTBOUND.label}
          </Button>
        </SectionBand>
      ) : null}

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
