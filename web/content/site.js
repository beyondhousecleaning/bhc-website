/**
 * Site-wide copy constants — pure data, no React.
 *
 * WHY THIS IS A `.js` UNDER `web/content/` AND NOT A `.jsx`, AND NOT IN THE
 * PACKAGE. Two independent reasons, either of which alone would be enough:
 *
 *   (a) `@bhc/design-system` is framework-agnostic UI. Site copy inside it
 *       breaks that property and would push ~17 pages of prose into the
 *       artifact `.design-sync` round-trips to Claude Design (02-RESEARCH.md
 *       § "Why `web/content/` and not `web/app/_content/` or the package").
 *   (b) The `claude-seo` PostToolUse hook rejects any `.jsx`/`.tsx` write
 *       containing the case-insensitive substring `REPLACE` — which ordinary
 *       British prose ("we'll put it right", "we'll swap it out", any sentence
 *       using that verb) contains, and which every `.replace(` call contains
 *       too. Copy and string handling live in `.js`. Keep it so. This is the
 *       same containment rule `design-system/src/jsonLd.js` and
 *       `components/InterlinkBlock/geo.js` already follow.
 *
 * A sibling `web/content/` plus the `@/*` alias in `web/jsconfig.json` is also
 * stable at any route depth. Phase 3 authors
 * `app/location/[region]/[town]/[service]/page.jsx`; a private `app/_content/`
 * would be `../../../../_content/site.js` from there.
 *
 * SCOPE. Only values that are NOT tied to a single route belong here. Per-route
 * copy lives in `home.js`, `services.js`, `utility.js` and `legal.js`, owned by
 * plans 02-08, 02-09, 02-11 and 02-12. The nav tree and the footer columns live
 * in `nav.js`; the three process steps in `process.js`; the FAQ sets in
 * `faqs.js`.
 *
 * ONE CAVEAT WORTH RECORDING. `design-system/test/locks.test.js`'s Lock 5
 * (no street address, no UK postcode) walks `design-system/src` ONLY, so it
 * never sees this directory. The assertion that actually covers this file is
 * `check-html-locks.mjs`'s `SC-2d`, which scans the BUILT HTML and is therefore
 * downstream of everything. Do not assume the package-level scan covers app
 * data — it does not. No address, no postcode, no phone digits in this file or
 * any of its siblings.
 */

/** The business name, as it is written everywhere. Never abbreviated to "BHC". */
export const BRAND = 'Beyond House Cleaning';

/*
  The review figure, read from the Trustmary payload on 2026-08-06 and matching
  `RatingBadge`'s own shipped defaults. Every Phase 2 template passes this object
  straight to `Hero`'s `rating` prop.

  Phase 4 makes this a live figure sourced from the reviews pipeline rather than
  a hand-maintained literal; until then it is one constant in one file, which is
  the whole reason it is here.

  THE SCHEMA FLAG STAYS OFF ON EVERY PHASE 2 TEMPLATE. `RatingBadge` takes a
  boolean prop that emits AggregateRating JSON-LD; this object deliberately does
  not carry it, so no template can turn it on by spreading `RATING`. Plan 02-02's
  replacement for SC-4f asserts a flat 1 JSON-LD block on Home and 2 elsewhere,
  so adding the flag here would put 17 orphaned AggregateRating nodes into the
  build and turn CI red. That is the enforcement; this comment is the reason.
  (The prop name appears in this file in comment form only — never as code.)
*/
export const RATING = { rating: 4.9, count: 175, source: 'Google' };

/*
  THE SERVED TOWNS. Lifted verbatim from the literal that has been inline in
  `web/app/layout.jsx` since plan 01-02. This export exists as a named constant
  for one specific failure mode:

    `NAPFooter` emits `areaServed` City nodes into the sitewide
    HomeAndConstructionBusiness JSON-LD ONLY when the array it is given is
    non-empty (NAPFooter.jsx:43 defaults it to `[]`), and plan 02-13 rewrites
    the layout to render `<Footer/>` — a composition layer — instead of
    `<NAPFooter/>` directly.

  If the value is not threaded through `Footer` during that rewrite, all 18
  pages silently lose `areaServed` from their structured data. Nothing in the
  lock harness catches it: no assertion counts City nodes, and the JSON-LD block
  count is unchanged because the node is a property, not a block. ROADMAP Phase 5
  SC-1 explicitly requires LocalBusiness + `areaServed`, so the loss would
  surface three phases later as a ranking defect with no failing test pointing at
  its cause.

  Phase 3 grows this list to the ~56 towns of the locations layer. It stays a
  plain array of city names — no street lines, no postcodes (D-04 / Lock 5).
*/
export const AREA_SERVED = ['Leamington Spa', 'Warwick', 'Kenilworth', 'Coventry'];

/*
  Opening hours, the second half of the same layout literal.

  In isolation this one is harmless: it is character-for-character `NAPFooter`'s
  own default, so dropping the prop changes nothing in the output today. It is
  exported anyway so it travels WITH `AREA_SERVED` and the pair cannot drift —
  the moment the hours change, there must be exactly one place to change them,
  and a value that only sometimes needs threading is a value someone eventually
  forgets to thread.

  The en-dashes are intentional and match the shipped layout exactly.
*/
export const HOURS = 'Mon–Sat, 8am–7pm';

/*
  The two forms of the service area.

  `AREA_SHORT` is the title form: UI-SPEC §5 measured all seven titles against
  the 60-character cap using the SHORT area, and the long form does not fit.
  `AREA_LONG` is the `<h1>` form: Lock 1 wants a service and a region in the
  heading, and the region is the full trading area.

  NOTE ON THE AMPERSAND. `AREA_LONG` contains a literal `&`, which React
  serialises to `&amp;` in the built HTML. Plan 02-02's `<h1>` extractor decodes
  entities before comparing, so an expectation written with the bare `&` matches.
  Do not "fix" this by writing the entity here — that would double-encode to
  `&amp;amp;` and fail the same lock from the other direction.
*/
export const AREA_SHORT = 'Warwickshire';
export const AREA_LONG = 'Warwickshire & the West Midlands';

/**
 * The one `<title>` form: `{pageTitle} | Beyond House Cleaning`.
 *
 * UI-SPEC §5 writes and measures the seven service/home titles individually
 * rather than generating them from a pattern, because the previous pattern
 * measured 78 characters against the 60 cap. What is patterned is only the
 * brand suffix, which is this function. Pass the SHORT subject — the measured
 * §5 subjects all use `AREA_SHORT` — and the result is 53 to 57 characters.
 *
 * Utility pages follow `{H1} | Beyond House Cleaning` through this same
 * function. MEASURED at execution time, and §5's claim that "each [was] checked
 * ≤60" does not hold for two of the eleven when the `<h1>` is reused verbatim:
 *
 *   `The Team Behind Beyond House Cleaning`   (/about-us)   → 61
 *   `Contact Our Warwickshire Cleaning Team`  (/contact-us) → 62
 *
 * The other nine measure 38 to 54. This is NOT a defect in this function and
 * NOT fixed here — `utility.js` and the two route files belong to plan 02-11,
 * and Lock 8's enforcement is Phase 5's. The fix when 02-11 authors them is to
 * pass a shorter title subject, which §5 already permits in the same breath:
 * "Titles need not match the `<h1>` verbatim." `About Beyond House Cleaning`
 * (49) and `Contact Our Cleaning Team` (49) both fit. Do not shorten the `<h1>`s
 * — those are Success Criterion 2 copy and are correct as written.
 *
 * Lock 8 (title ≤60, description ≤155) is Phase 5's to enforce. §5's own
 * warning applies when it lands: Lock 8's "contains the town" clause must be
 * scoped to the town-bearing templates, or it fails on the thirteen home,
 * service and utility pages that are correct without a town.
 */
export function titleFor(pageTitle) {
  return `${pageTitle} | ${BRAND}`;
}

/**
 * The one `<meta name="description">` form, from UI-SPEC §5.
 *
 * It leads with the review signal deliberately: the 2026-08-06 audit found
 * 0 of 115 live descriptions mentioning the rating at all.
 *
 * MEASURED, not estimated. §5 measured this form at 133 characters for the
 * shortest subject ("Deep cleaning") and 146 for the two longest ("Short-term
 * rental cleaning" and "Builders clean"), against a 155 cap — so the subject has
 * about 9 characters of headroom beyond the longest one shipping today. A
 * subject longer than that overruns the cap, and Phase 5's Lock 8 is what will
 * say so; this comment is the number to check against before adding one.
 *
 * The rating figures are interpolated from `RATING` rather than restated, so the
 * description cannot disagree with the badge on the same page.
 */
export function describe(serviceOrSubject) {
  return (
    `Rated ${RATING.rating} by ${RATING.count} ${RATING.source} reviews. ` +
    `${serviceOrSubject} across ${AREA_SHORT} by DBS-checked, insured local cleaners. ` +
    `Free quote in two minutes.`
  );
}
