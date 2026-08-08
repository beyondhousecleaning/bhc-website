/**
 * RatingBadge — Beyond House Cleaning
 *
 * LOCK 3: renders in server HTML on every template.
 *
 * The live site holds 4.9 from 175 reviews inside a 516 KB Trustmary bundle,
 * so the rating contributes nothing to indexed content and appears in 0 of 115
 * titles or meta descriptions. Arbor Trail opens every meta description with
 * "With over 1,100 5-star reviews". This component is how that gap closes.
 *
 * `emitSchema` outputs AggregateRating for the entity graph — NOT for SERP
 * stars. Self-serving review markup is ineligible for review rich results, and
 * so is third-party-widget review data. Use it once per page at most.
 */

import { safeJsonLd } from '../../jsonLd.js';

function Star({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RatingBadge({
  rating = 4.9,
  count = 175,
  source = 'Google',
  bare = false,
  emitSchema = false,
  businessName = 'Beyond House Cleaning',
  className = '',
}) {
  const rounded = Math.round(rating);
  const label = `Rated ${rating} out of 5 from ${count} ${source} reviews`;

  return (
    <div className={['bhc-rating', bare ? 'bhc-rating--bare' : '', className].filter(Boolean).join(' ')}>
      <span className="bhc-rating__stars" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= rounded} />
        ))}
      </span>
      <span aria-hidden="true">
        <span className="bhc-rating__value">{rating}</span>{' '}
        <span className="bhc-rating__count">
          from {count} {source} reviews
        </span>
      </span>

      {emitSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: businessName,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: String(rating),
                reviewCount: String(count),
                bestRating: '5',
                worstRating: '1',
              },
            }),
          }}
        />
      ) : null}
    </div>
  );
}

export default RatingBadge;
