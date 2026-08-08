/**
 * Breadcrumbs — Beyond House Cleaning
 *
 * LOCK 2: visible trail + BreadcrumbList JSON-LD on every non-home page.
 *
 * The live site has neither, on 0 of 115 pages — and the URL hierarchy is
 * worse than missing: /services, /locations, /location and
 * /location/warwickshire all return 404, so a combo URL is four levels deep
 * with three non-existent parents. The trail only means something once the
 * town hub and locations index exist.
 *
 * Schema is emitted inline and server-rendered (Lock 9) — never JS-injected.
 */

import { safeJsonLd } from '../../jsonLd.js';

const SITE = 'https://www.beyondhousecleaning.com';

export function Breadcrumbs({ items = [], siteUrl = SITE, className = '' }) {
  if (!items.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  };

  return (
    <nav
      className={['bhc-breadcrumbs', className].filter(Boolean).join(' ')}
      aria-label="Breadcrumb"
    >
      <div className="bhc-container">
        <ol className="bhc-breadcrumbs__list">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href || item.label} style={{ display: 'contents' }}>
                {i > 0 ? (
                  <span className="bhc-breadcrumbs__sep" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {isLast || !item.href ? (
                  <span className="bhc-breadcrumbs__current" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
    </nav>
  );
}

export default Breadcrumbs;
