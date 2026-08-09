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
      /*
        Resolved against the origin rather than concatenated onto it. From
        Phase 3 these hrefs come from a data file, and `siteUrl + href` turns a
        missing leading slash into `https://www.example.comwarwick` and a
        trailing slash on siteUrl into a double slash — both of which serialise
        into BreadcrumbList as a URL Google will fetch. `new URL` normalises
        instead, and throws on something genuinely unresolvable.
      */
      ...(item.href ? { item: new URL(item.href, siteUrl).toString() } : {}),
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
              /*
                WR-12. The <li> carried an inline display-contents style so the
                list's flex gap applied evenly across crumbs and separators.
                Chrome and Safari drop a display-contents element from the
                accessibility tree, which removes the <li> and with it the
                ol/li relationship that makes a trail announceable as "list,
                3 items" — the entire reason an <ol> was used. The layout it
                bought is now a `.bhc-breadcrumbs__list li` rule in CSS.

                The key is index-prefixed because two crumbs can legitimately
                share a label with no href (a repeated town name in a deep
                Phase-3 trail), and `item.href || item.label` collides then.
              */
              <li key={`${i}-${item.href ?? item.label}`}>
                {i > 0 ? (
                  <span className="bhc-breadcrumbs__sep" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {/*
                  §13-R. aria-current="page" means "this crumb IS the page you
                  are on", so exactly one crumb may carry it — the last —
                  whatever the trail's length. The old condition was
                  `isLast || !item.href`, which marked EVERY href-less crumb,
                  so a trail with an intermediate crumb whose parent URL does
                  not exist yet announced two current pages. Phase 2 has 17
                  trails and Phase 3 has ~336; this branch is the rule they
                  both inherit.
                */}
                {isLast ? (
                  <span className="bhc-breadcrumbs__current" aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span className="bhc-breadcrumbs__current">{item.label}</span>
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
