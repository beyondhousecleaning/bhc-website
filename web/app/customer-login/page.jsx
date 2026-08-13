/**
 * /customer-login — Beyond House Cleaning
 *
 * THIS PAGE SHIPS NO <h1> AT ALL ON THE LIVE SITE. The last of the four the
 * 2026-08-06 audit measured (with /contact-us, /work-with-us and
 * /gift-cards); the real keyword-bearing heading it now carries is ROADMAP
 * Success Criterion 2.
 *
 * NO LOGIN FORM — §9.4 and §14-2. This route is a labelled hand-off to the
 * booking portal that already exists, plus a `Call` fallback for anyone who
 * would rather not use one. There is no <form>, no <input> and no credentials
 * field of any kind, and none may be added: a sign-in box on a site that owns
 * no accounts is a credential-harvesting shape for anything that manages to
 * mimic this page, and any real field would need a browser boundary, which
 * turns SC-4g red.
 *
 * THE OUTBOUND HREF IS A DATA VALUE AND IT IS SCHEME-GUARDED (WR-10), exactly
 * as on /gift-cards. It arrives from web/content/utility.js, where it is a
 * placeholder pending Sam — a URL from a data file rendered straight into an
 * href, which is the case WR-10 was written for. React 19 warns on a
 * `javascript:` URL but does not block it. The guard tests for an absolute
 * http(s) URL and drops the whole band when it fails, so a bad value costs the
 * page its action rather than shipping a hostile link. `target="_blank"` is
 * paired with `rel="noopener noreferrer"`; `rel="noopener"` alone is inert.
 *
 * THE TEL: LINK COMES FROM QuoteFormEntry, which derives both the displayed
 * digits and the href from the one number in the package's src/phone.js. This
 * route passes no `phone` prop and writes no digits. Two tel: links on this
 * page in wave 4 (NAPFooter's and this one); four once plan 02-13 composes the
 * Header and StickyCallBar into the layout — the budget delta 2(b) allows.
 *
 * No schema-emitting prop on the rating: 2 JSON-LD blocks, NAPFooter's and
 * Breadcrumbs'.
 */

import {
  Breadcrumbs,
  Hero,
  SectionBand,
  Prose,
  Button,
  QuoteFormEntry,
} from '@bhc/design-system';

import { renderBlocks } from '@/content/blocks.jsx';
import { RATING } from '@/content/site.js';
import { byPath } from '@/content/utility.js';

const PAGE = byPath('/customer-login');

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

      {/* The §9.4 `Call` fallback. No `phone` prop — see the header. */}
      <SectionBand tone="tint" width="narrow">
        <QuoteFormEntry heading={PAGE.callout.heading} bullets={PAGE.callout.bullets} />
      </SectionBand>
    </>
  );
}
