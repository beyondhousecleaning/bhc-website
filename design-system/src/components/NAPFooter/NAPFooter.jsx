/**
 * NAPFooter — Beyond House Cleaning
 *
 * LOCK 4: exactly one tel: in the footer, and the href digits MUST equal the
 *         displayed digits.
 * LOCK 5: no street address or UK postcode anywhere in rendered output.
 *
 * Lock 4 exists because of a live bug: the footer on all 115 pages DISPLAYS
 * +44 7861 936533 and DIALS 07441918832. A third number (+447575709361) sits
 * on /get-a-quote. Phrasing the rule as "href digits must equal displayed
 * digits" is what would actually have caught it — "use the right number"
 * would not have.
 *
 * `formatPhone` derives the display string FROM the dial string, so the two
 * cannot diverge. There is no prop for the displayed text.
 *
 * Lock 5: the registered office is a residential address, so it is not written
 * out here — this repository is public, and a comment explaining why an address
 * must never ship is a poor place to keep the address. Companies House holds it
 * if it is ever needed.
 * The GBP is a service-area business with the address suppressed, so the
 * footer carries a service-area statement and no address. Schema uses
 * areaServed with no streetAddress — JSON-LD ships in page HTML, so putting
 * the postcode there would publish it across ~336 pages.
 */

import { formatPhone, toDial } from './formatPhone.js';
import { CANONICAL_PHONE } from '../../phone.js';
import { safeJsonLd } from '../../jsonLd.js';

const SITE = 'https://www.beyondhousecleaning.com';

export { formatPhone, toDial };

export function NAPFooter({
  businessName = 'Beyond House Cleaning',
  /** The ONE number. Everything displayed is derived from it. */
  phone = CANONICAL_PHONE,
  serviceArea = 'Serving Warwickshire, Coventry and the West Midlands',
  hours = 'Mon–Sat, 8am–7pm',
  /** The GBP place URL — not a link to the town. */
  mapsUrl,
  social = [],
  columns = [],
  legal = [],
  siteUrl = SITE,
  areaServed = [],
  className = '',
}) {
  const display = formatPhone(phone);
  const dial = toDial(phone);

  /*
    WR-10. `mapsUrl` is a literal today and a Phase-3 data-file value tomorrow,
    and it is rendered straight into an href. A value that is not http(s) —
    `javascript:`, `data:`, or a half-written relative path — has no useful
    rendering here, so the whole block is dropped rather than shipped broken.
    The same guarded value feeds schema `sameAs`: an origin Google is told the
    business also lives at is a claim, not decoration.
  */
  const safeMapsUrl = /^https?:\/\//i.test(mapsUrl ?? '') ? mapsUrl : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${siteUrl}/#business`,
    name: businessName,
    url: siteUrl,
    telephone: dial,
    /* No `address` / `streetAddress` — Lock 5. */
    ...(areaServed.length
      ? { areaServed: areaServed.map((a) => ({ '@type': 'City', name: a })) }
      : {}),
    ...(safeMapsUrl || social.length
      ? { sameAs: [safeMapsUrl, ...social.map((s) => s.href)].filter(Boolean) }
      : {}),
  };

  return (
    <footer className={['bhc-footer', className].filter(Boolean).join(' ')}>
      <div className="bhc-container">
        <div className="bhc-footer__grid">
          <div className="bhc-footer__nap">
            <p className="bhc-footer__name">{businessName}</p>
            <p className="bhc-footer__area">{serviceArea}</p>

            {/* The single tel:. href and text both derive from `phone`. */}
            <a className="bhc-footer__phone" href={`tel:${dial}`}>
              {display}
            </a>

            <p className="bhc-footer__hours">{hours}</p>

            {safeMapsUrl ? (
              <p className="bhc-footer__hours" style={{ marginTop: 'var(--bhc-space-3)' }}>
                {/*
                  `rel="noopener"` without `target="_blank"` is inert — the
                  opener it severs is the one a new browsing context would have
                  had. The two change together or neither does anything.
                */}
                <a href={safeMapsUrl} target="_blank" rel="noopener noreferrer">
                  Find us on Google
                </a>
              </p>
            ) : null}
          </div>

          {/*
            Guards only — the markup, class names, props and defaults below are
            unchanged. `col.links.map` on a column without `links` throws
            during server render, and this footer is in the root layout, so a
            single malformed entry in a Phase-3 nav data file would 500 EVERY
            route rather than break one list.
          */}
          {columns.filter(Boolean).map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="bhc-footer__col-heading">{col.heading}</p>
              <ul className="bhc-footer__links">
                {(col.links || []).map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="bhc-footer__bottom">
          <span>
            © {new Date().getFullYear()} {businessName}
          </span>
          <span style={{ display: 'flex', gap: 'var(--bhc-space-4)', flexWrap: 'wrap' }}>
            {legal.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </span>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
    </footer>
  );
}

export default NAPFooter;
