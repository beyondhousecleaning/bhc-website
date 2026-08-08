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
 * Lock 5: the registered office (84 Acacia Road, CV32 6EQ) is residential.
 * The GBP is a service-area business with the address suppressed, so the
 * footer carries a service-area statement and no address. Schema uses
 * areaServed with no streetAddress — JSON-LD ships in page HTML, so putting
 * the postcode there would publish it across ~336 pages.
 */

import { formatPhone, toDial } from './formatPhone.js';
import { safeJsonLd } from '../../jsonLd.js';

const SITE = 'https://www.beyondhousecleaning.com';

export { formatPhone, toDial };

export function NAPFooter({
  businessName = 'Beyond House Cleaning',
  /** The ONE number. Everything displayed is derived from it. */
  phone = '+447861936533',
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
    ...(mapsUrl || social.length
      ? { sameAs: [mapsUrl, ...social.map((s) => s.href)].filter(Boolean) }
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

            {mapsUrl ? (
              <p className="bhc-footer__hours" style={{ marginTop: 'var(--bhc-space-3)' }}>
                <a href={mapsUrl} rel="noopener">
                  Find us on Google
                </a>
              </p>
            ) : null}
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="bhc-footer__col-heading">{col.heading}</p>
              <ul className="bhc-footer__links">
                {col.links.map((l) => (
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
