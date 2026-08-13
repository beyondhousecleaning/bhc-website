/**
 * The customer reviews — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias resolves at any
 * route depth. Copy and string handling live in `.js`; only `blocks.jsx` in this
 * directory returns elements.
 *
 * WHAT THIS FILE IS FOR. `ReviewRail` and `ReviewCard` shipped in plan 02-07 and
 * have rendered nothing since, because every template composed them with an
 * empty array on purpose (02-11-SUMMARY, Known Stubs). This module is the data
 * they were waiting for. It is Phase 4 work pulled forward at the owner's
 * request, and it is why the withdrawn `Read Our Reviews` call to action can
 * come back: the anchor it points at now has something behind it.
 *
 * ---------------------------------------------------------------------------
 * WHERE THIS DATA CAME FROM, AND WHEN
 * ---------------------------------------------------------------------------
 *
 * Extracted on 2026-08-11 from the review-widget bundle the LIVE SITE ALREADY
 * LOADS on all 115 pages — the same 528 KB third-party payload the 2026-08-06
 * audit flags for hiding this asset from crawlers (`docs/goals.md:18`,
 * `docs/research/seo-audit-2026-08-06.md`, recommendation b5). The extract held
 * 166 unique Google reviews as `{name, text, stars}`: 163 at five stars and 3 at
 * four. Text length ran 7 / 122 / 1099 characters (min / median / max).
 *
 * EVERY ONE OF THESE IS A REAL, PUBLISHED GOOGLE REVIEW, QUOTED VERBATIM.
 * Nothing below is written, paraphrased, shortened, corrected or "tidied", and
 * nothing may become so. Two independent reasons, either of which alone would
 * settle it: a fabricated testimonial is a banned practice under the Digital
 * Markets, Competition and Consumers Act 2024, and the whole positioning of this
 * site is a genuinely local team — which is exactly why UI-SPEC §5 revision 1
 * WITHDREW the reviews call to action rather than seed placeholder quotes.
 * Quote verbatim or do not quote. The typos, the doubled spaces and the space
 * before a comma are all in the originals and are all load-bearing evidence
 * that these were written by customers rather than by a copywriter.
 *
 * ONE MECHANICAL REPAIR WAS MADE, AND IT CHANGES NO WORDS. The extract had been
 * decoded a byte at a time rather than as UTF-8, so apostrophes, ellipses and
 * emoji arrived as mojibake. Re-encoding each string to bytes and decoding it as
 * UTF-8 restores the characters the customer actually typed. The eighteen quotes
 * selected below are pure ASCII after that repair, which is checked rather than
 * assumed.
 *
 * SURNAMES ARE REDUCED TO AN INITIAL, and that is not tidying — it is the
 * shipped data contract. `ReviewCard.d.ts` states the `author` field as "first
 * name and initial, or a first name", and reducing a surname to its first letter
 * removes personal data without touching a word of what the customer said. The
 * quote text itself is untouched, including the first names of the cleaners the
 * customers name in it.
 *
 * THERE IS NO `date` AND NO `town` ON ANY RECORD, and there must not be until
 * real values exist. The widget payload carries neither. `ReviewCard` renders
 * the attribution line from whatever it is given, so both are simply absent —
 * inventing a month or a town to fill a card is the same defect as inventing the
 * review.
 *
 * THE 320-CHARACTER CAP IS HONOURED BY SELECTION, NOT BY TRUNCATION. UI-SPEC
 * §7.13 caps the quote at the data layer because there is no client JavaScript
 * to power a "read more" and a CSS clamp would hide text from sighted users that
 * screen readers still receive (WCAG 1.4.4). The contract permits truncating at
 * a word boundary at ingest; this module does not use that permission. Every
 * quote below was chosen because it already fits, so what ships is the whole
 * review and not part of one. The longest below is 271 characters and the
 * shortest 90. The 1099-character review, and the two 500-character ones, are
 * excluded for that reason alone.
 *
 * ---------------------------------------------------------------------------
 * THE AGGREGATE IS THE PUBLISHED FIGURE, NOT A RECOMPUTATION OF THIS SUBSET
 * ---------------------------------------------------------------------------
 *
 * READ THIS BEFORE CHANGING EITHER NUMBER. The 166 extracted reviews average
 * 4.98, because the widget only carries the reviews that have comment text — the
 * silent five-and-four-star ratings that have no comment are not in it, and
 * neither are they in that mean. Publishing 4.98 would therefore OVERSTATE the
 * rating against the figure Google itself shows.
 *
 * `REVIEW_AGGREGATE` is `RATING` from `site.js`, re-exported and not restated:
 * 4.9 from 175 Google reviews, verified 2026-08-06 and recorded in
 * `docs/goals.md:18`. One constant, one file, so the rail below and the badge in
 * the hero and the meta description on the same page cannot disagree. Do not
 * derive an average from `REVIEWS` and do not hand-copy the pair here.
 *
 * ---------------------------------------------------------------------------
 * SHAPE
 * ---------------------------------------------------------------------------
 *
 * The quotes are double-quoted JSON string literals rather than this project's
 * usual single quotes, and that is deliberate: it is the signal that the
 * contents are a transcript. Do not reflow one into a `+` concatenation — the
 * line breaks would have to fall somewhere, and a dropped space at the join is a
 * silent alteration of a customer's words.
 *
 * `id` is a lookup key for the selections below. It is never rendered:
 * `ReviewCard` destructures the fields it knows and ignores the rest, and no
 * template passes a review anywhere else.
 *
 * NO ADDRESS, NO POSTCODE, NO PHONE NUMBER, NO EMAIL — D-04 / Lock 5, the same
 * rule `faqs.js`, `nav.js`, `utility.js`, `legal.js`, `home.js` and
 * `services.js` follow, and the one rule that binds HARDER here than anywhere
 * else in the project, because this is the only copy in the site that was
 * written by someone other than us. All 166 extracted reviews were screened
 * against `check-html-locks.mjs`'s own postcode and street-line matchers before
 * any selection was made, and none matched; the eighteen below were screened
 * again individually. SC-2d against the built HTML is the backstop, not the
 * primary control — a customer who names their street in a review must not have
 * it republished, and a review that named one would simply not be selected.
 */

import { SERVICES } from './services.js';
import { RATING } from './site.js';

/**
 * The published aggregate, re-exported so there is exactly one of it.
 *
 * See the header: 4.9 from 175 Google reviews is the verified figure, and it is
 * NOT the mean of `REVIEWS` below, which would read high.
 */
export const REVIEW_AGGREGATE = RATING;

/**
 * The rail's anchor id, and the call to action that points at it.
 *
 * Both are derived from one constant so the link and its target cannot drift.
 * UI-SPEC §5 revision 1 withdrew this action from the closed set for one stated
 * reason — the anchor dead-ended while `ReviewRail` rendered `null` — and §12's
 * internal-link lock only resolves hrefs beginning with a slash, so nothing
 * would have caught it. That reason has now expired. The label is §5's own, and
 * the harness gained an assertion that every in-page anchor on every built page
 * resolves to an element carrying that id, so the dead-end this action was
 * withdrawn over is now a red build rather than an unnoticed defect.
 */
export const REVIEWS_ANCHOR = 'reviews';

export const REVIEWS_CTA = {
  label: 'Read Our Reviews',
  href: `#${REVIEWS_ANCHOR}`,
  variant: 'secondary',
};

/*
  One factory rather than eighteen object literals, so no record can quietly
  acquire a field the others do not have — an invented `date` or `town` on a
  single card would be almost invisible in a diff of eighteen literals.
*/
const review = (id, author, rating, quote) => ({ id, author, rating, quote, source: 'Google' });

/**
 * The eighteen selected reviews, verbatim.
 *
 * Chosen for length, readability and the spread of services they mention: the
 * median-length review reads best in a card, and a rail of six near-identical
 * "great service, would recommend" lines says less than six that each name a
 * different job. Seventeen are five stars and one is four — the four-star is
 * `kiran-j` and it is in deliberately. A wall of nothing but five stars reads as
 * curated, which is precisely what it would be if the only four-star review that
 * fits were dropped for saying the process took getting used to.
 */
export const REVIEWS = [
  review(
    "cheryl-k",
    "Cheryl K.",
    5,
    "Melissa came along and did a deep clean for us today and she was fantastic. Professional , kind just everything. So happy."
  ),
  review(
    "sara-j",
    "Sara J.",
    5,
    "A very efficient service - I am very pleased with my oven clean - very friendly people - I would recommend them without hesitation."
  ),
  review(
    "shelia-s",
    "Shelia S.",
    5,
    "Booked a deep clean at short notice and was guaranteed a slot. Was definitely satisfied with the outcome, lady doing the cleaning was very thorough and worked non-stop. Nothing too much trouble. Would definitely recommend."
  ),
  review(
    "tolu-a",
    "Tolu A.",
    5,
    "Rachael has been doing our cleaning for over 6 months now and she is amazing at her job. She takes her time to ensure everywhere is very clean before leaving. I would definitely recommend her anyday."
  ),
  review(
    "kiran-j",
    "Kiran J.",
    4,
    "So far so good, took a little getting used to the process. Sam works all hours and at first I was not sure what to expect, three weeks in and I am really enjoying my new regular clean. Both the cleaner and back office are very professional and I would recommend to others"
  ),
  review(
    "manjit-m",
    "Manjit M.",
    5,
    "Happy with the clean, they took on any small feedback I had well and I am looking forward to my next clean!"
  ),
  review(
    "lucy-m",
    "Lucy M.",
    5,
    "Brilliant clean of a house I'm going to move into, done today by Mirela. She did a really thorough job, & I couldn't believe the transformation. She was also pleasant, friendly & professional, & I am extremely pleased. Thank you!"
  ),
  review(
    "tom-m",
    "Tom M.",
    5,
    "Thanks very much to Ivan who did a brilliant job cleaning the entirety of our new house. He was friendly, very courteous and extremely diligent, with excellent attention to detail and thorough. We were very impressed! Thanks a lot."
  ),
  review(
    "stephanie-w",
    "Stephanie W.",
    5,
    "Tadi was amazing. Would highly recommend. It was so lovely to come home to a sparkly clean house."
  ),
  review(
    "caitlin-n",
    "Caitlin N.",
    5,
    "Great service. We hired the team for an end of tenancy clean. Staff were lovely and accommodating, encouraged me to check the property over to make sure I was happy. Great price, would use again"
  ),
  review(
    "ira-n",
    "Ira N.",
    5,
    "Csilla did a great job with my flat, she was quick, efficient and extremely thorough. It was truly the best end of tenancy cleaning I have ever received, thank you for everything!!"
  ),
  review(
    "sarah",
    "Sarah",
    5,
    "They arrived on time, were very thorough and India was extremely polite. They really took the pressure off of us last minute at the end of our tenancy. Thank you."
  ),
  review(
    "wayne-b",
    "Wayne B.",
    5,
    "Used this company for my airbnbs, very effective and efficient. Excellent communication with myself and work independently without any need for myself or my team to be involved!"
  ),
  review(
    "paul-t",
    "Paul T.",
    5,
    "Highly recommend this cleaning company! I telephoned for a quote, which was done over the phone. The 2 ladies arrived the following morning at 9am prompt. They did a fantastic job of cleaning a dirty ex rental property. Reasonable price for a professional service."
  ),
  review(
    "jacob-p",
    "Jacob P.",
    5,
    "Unbelievably professional, from the booking process to the texts reminding me about the visit, amazing. Team in the day did a great job, very friendly and could not recommend enough."
  ),
  review(
    "jaspreet-s",
    "Jaspreet S.",
    5,
    "Really impressed with the builders clean and can tell there was a lot hard work! Thank uou"
  ),
  review(
    "zaheed",
    "Zaheed",
    5,
    "Done an excellent job of cleaning. Left the place spotless and went above and beyond what was expected of them  Would highly recommend and will definitely be using them again in the future. 10/10 Service."
  ),
  review(
    "chris-h",
    "Chris H.",
    5,
    "Thanks so much to Giselle and her crew today for putting in hours of hard work, and producing a fab result throughout the house. Attention to detail was brilliant."
  ),
];

/*
  The `hrefFor` idiom from `home.js`: look a record up by key and THROW on a
  miss, so a typo is a red `next build` rather than a card that renders with an
  undefined author. Both call sites are statically prerendered routes, so the
  throw happens during the build and never at runtime.
*/
const byId = new Map(REVIEWS.map((entry) => [entry.id, entry]));

const pick = (...ids) =>
  ids.map((id) => {
    const found = byId.get(id);
    if (!found) {
      throw new Error(`reviews.js: no review with id "${id}" — a selection and REVIEWS have drifted apart`);
    }
    return found;
  });

/**
 * The six on the home page — one per service, in the §9.2 card order.
 *
 * Six rather than eighteen, and the reason is the rail's own CSS: three columns
 * at 1024px and above, so six is two clean rows and eighteen is six rows of
 * testimonial between the process band and the FAQs. The point of the home rail
 * is that the reviews EXIST in the HTML and read as varied; the point of the
 * service rails below is that they are about the job that page sells.
 */
export const HOME_REVIEWS = pick(
  'cheryl-k',
  'caitlin-n',
  'tolu-a',
  'lucy-m',
  'wayne-b',
  'jaspreet-s'
);

/*
  Three per service page, keyed by TODAY'S LIVE SLUGS — the same set `nav.js`,
  `services.js` and `faqs.js` use, and the same set UI-SPEC §13-C renames in
  Phase 3 as a data change. The guard below is what makes that rename safe:
  add a service, rename a slug or delete one, and this module throws at build
  time rather than silently serving a page with no rail.

  Each trio leads with the review that names that job — the oven and the deep
  clean, the months of regular visits, the move into a new house, the end of a
  tenancy, the short-let changeovers, the builders clean — and fills out with two
  that are about the team rather than the task. Three, not six, because a service
  page already carries ~1,000 words of prose and a photo band above the rail, and
  because SIX pages sharing one pool is what keeps the pages distinct without
  eighteen more reviews of near-identical praise.
*/
const SERVICE_REVIEWS = {
  'deep-cleaning': pick('cheryl-k', 'sara-j', 'shelia-s'),
  'standard-home-cleaning': pick('tolu-a', 'kiran-j', 'manjit-m'),
  'move-in-cleaning': pick('lucy-m', 'tom-m', 'stephanie-w'),
  'move-out-cleaning': pick('caitlin-n', 'ira-n', 'sarah'),
  'short-term-rental-cleaning': pick('wayne-b', 'paul-t', 'jacob-p'),
  'post-construction-cleaning': pick('jaspreet-s', 'zaheed', 'chris-h'),
};

/*
  Drift guard, evaluated at module load. `services.js` owns the slug set; this
  module must cover it exactly — no service without reviews, and no key here for
  a service that no longer exists.
*/
const declaredSlugs = Object.keys(SERVICE_REVIEWS).sort().join(', ');
const actualSlugs = SERVICES.map((service) => service.slug)
  .sort()
  .join(', ');

if (declaredSlugs !== actualSlugs) {
  throw new Error(
    `reviews.js: SERVICE_REVIEWS covers [${declaredSlugs}] but services.js ships [${actualSlugs}] — they have drifted apart`
  );
}

/**
 * The three reviews for one service page. Throws on an unknown slug, for the
 * same reason `bySlug` in `services.js` does.
 */
export function reviewsForService(slug) {
  const found = SERVICE_REVIEWS[slug];
  if (!found) {
    throw new Error(`reviews.js: no reviews declared for service slug "${slug}"`);
  }
  return found;
}
