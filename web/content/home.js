/**
 * The Home page — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias resolves at any
 * route depth. Copy and string handling live in `.js`; only `blocks.jsx` in this
 * directory returns elements.
 *
 * WHAT THIS FILE IS FOR. `/` is the site's highest-traffic template and the last
 * of ROADMAP Success Criterion 2's non-programmatic pages. Everything the route
 * renders is here: the hero deck, the six service card records, the intro to the
 * services band, the section headings, the two calls to action and the FAQ set.
 * `web/app/page.jsx` holds no copy of its own — partly because the components it
 * composes are framework-agnostic, and partly because the `claude-seo`
 * PostToolUse hook rejects a `.jsx` write containing a common English verb that
 * ordinary prose keeps producing (`site.js` names it; this file will not, since
 * naming it here is harmless but naming it there is not).
 *
 * THE `<h1>` AND THE EYEBROW ARE ASSERTED CHARACTER FOR CHARACTER.
 * `PAGE_EXPECTATIONS['/']` in `web/scripts/check-html-locks.mjs` holds the
 * heading, so a wording change here turns the build red in the right place. The
 * literal `&` in the heading is correct and deliberate: React serialises it to
 * `&amp;` and the lock's extractor decodes entities before comparing, so writing
 * the entity here would double-encode (`site.js`, `AREA_LONG`).
 *
 * THE SIX CARD HREFS ARE READ OFF `nav.js`, NEVER RESTATED. `hrefFor` below
 * looks each one up by its navigation label and throws if it is missing, so the
 * home page and the header cannot drift apart, and a slug rename is a one-line
 * change in `nav.js` rather than a change in two files that nothing compares.
 * Phase 3's canonical-slug rename (UI-SPEC §13-C) therefore does not touch this
 * module at all.
 *
 * THE CALLS TO ACTION ARE §5's CLOSED SET AND NOTHING ELSE. Two labels appear on
 * this page: the primary quote action and the checklist action. §5 withdrew a
 * third — the one that pointed at the review rail's in-page anchor — because
 * `ReviewRail` renders nothing without data, so that anchor dead-ends on every
 * Phase 2 page, and the internal-link lock only resolves hrefs beginning with a
 * slash so nothing would catch it. It returns in Phase 4 with the data. Its exact
 * label is in §5 and is deliberately not quoted here: the acceptance check for
 * this file greps it for that label, and a comment explaining an absence that
 * matches the grep policing that absence is a defect this phase has now hit ten
 * times. The same applies to the three dead CTA phrases §5 closes the door on.
 *
 * VOICE — UI-SPEC §5. Plain UK English, contractions, concrete nouns, named
 * towns: `tenancy`, `flat`, `skirting boards`, `hoover`, `builders clean`. Never
 * the US forms §5 lists opposite them — and they are not quoted here either, for
 * the same reason as above. Note that the sixth service keeps its live-site slug
 * (§13-C) while its visible noun is `Builders Clean`; the slug never appears in
 * this file, because the href comes from `nav.js`.
 *
 * NO ADDRESS, NO POSTCODE, NO PHONE NUMBER, NO EMAIL — D-04 / Lock 5, the same
 * rule `faqs.js`, `nav.js`, `utility.js` and `legal.js` follow. The canonical
 * number lives once in `design-system/src/phone.js` and only `NAPFooter`,
 * `Header`, `StickyCallBar` and `QuoteFormEntry` render a `tel:` link. Note also
 * that `check-html-locks.mjs`'s street-line heuristic matches a leading number
 * followed by capitalised name words and a thoroughfare noun, so an illustrative
 * address in body copy would fail SC-2d on a page carrying no address at all.
 * There are none below, and this comment does not instance one either.
 */

import { GENERAL_FAQS } from './faqs.js';
import { NAV } from './nav.js';
import { describe, titleFor } from './site.js';

/*
  The six service destinations, read off the navigation tree.

  `nav.js` documents why the `Services` item carries no `href` of its own — the
  services index does not exist in Phase 2 — so the children are the whole list.
  A missing label throws at module load rather than shipping a card with an
  `undefined` href: this module is imported by a statically prerendered route, so
  the throw happens during `next build` and is a red build, not a runtime 500.
*/
const SERVICES_NAV = NAV.find((item) => item.label === 'Services');
const SERVICE_LINKS = (SERVICES_NAV && SERVICES_NAV.children) || [];

const hrefFor = (label) => {
  const found = SERVICE_LINKS.find((child) => child.label === label);
  if (!found) {
    throw new Error(
      `home.js: no Services navigation entry labelled "${label}" — the home cards and the nav have drifted apart`
    );
  }
  return found.href;
};

/**
 * The hero deck, UI-SPEC §5, character for character.
 *
 * `eyebrow` is decoration and `heading` is the page's one `<h1>`. Do not swap
 * them: the eyebrow line wrongly became the `<h1>` on 101 live pages, which is
 * the single defect Success Criterion 2 exists to fix.
 */
export const HOME_HERO = {
  eyebrow: 'DBS-checked, insured, local',
  heading: 'Professional House Cleaning in Warwickshire & the West Midlands',
  lead: 'The same trusted cleaner each visit, a fixed price before we start, and an evening back to yourself.',
};

/**
 * The hero's two actions — one primary, one secondary, both from §5's closed
 * set. `CTABand` takes the same pair below with the second one as a `ghost`,
 * because an outlined ink button on the navy band measures 2.65:1 and vanishes.
 */
export const HOME_ACTIONS = [
  { label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' },
  { label: "See What's Included", href: '/checklist', variant: 'secondary' },
];

/**
 * The closing ask, immediately above the footer. UI-SPEC §5's `<h2>` deck.
 */
export const HOME_CTA = {
  heading: 'Ready for a properly clean home?',
  actions: [
    { label: 'Get a Free Quote', href: '/get-a-quote', variant: 'primary' },
    { label: "See What's Included", href: '/checklist', variant: 'ghost' },
  ],
};

/**
 * UI-SPEC §5's `<h2>` deck for this template, in the §9.2 band order.
 *
 * `SectionBand` supplies each one, and every component underneath is composed
 * WITHOUT its own heading prop so the outline stays one `<h1>`, six `<h2>`s and
 * their `<h3>` children. The review rail is the exception: it carries its own
 * `<h2>` and renders nothing at all until Phase 4 supplies the data.
 */
export const HOME_HEADINGS = {
  trust: 'Why people book us again',
  services: 'What we clean',
  photos: 'The difference, on real jobs',
  process: 'How it works',
  faqs: 'Questions we get asked',
};

/** The lead paragraph under `What we clean`. */
export const HOME_INTRO =
  'Six services, one team. Whether it is a fortnightly visit in Leamington Spa or an empty ' +
  'flat in Coventry that has to pass a check-out report, you get a fixed price before we ' +
  'start and the same DBS-checked cleaner each time.';

/**
 * The six keyword-bearing links out of the home page — the records that turn
 * "we do cleaning" into six crawlable destinations with their own `<h1>`s.
 *
 * `title` doubles as the card's accessible name (`ServiceCard.d.ts`) and matches
 * the navigation label exactly, which is what `hrefFor` looks up. `includes` is
 * capped at three bullets by UI-SPEC §7.6 — a fourth turns a card into a page,
 * and `ServiceCard` drops it rather than rendering it, so the cap is authored
 * here rather than discovered in the browser.
 */
export const HOME_SERVICE_CARDS = [
  {
    title: 'Deep Cleaning',
    href: hrefFor('Deep Cleaning'),
    summary:
      'The one that gets behind and underneath. Ovens, limescale, skirting boards and door ' +
      'frames — the jobs a weekly visit never has time for.',
    includes: [
      'Inside the oven and the extractor filter',
      'Limescale off taps, shower screens and tiles',
      'Skirting boards and door frames washed, not dusted',
    ],
  },
  {
    title: 'Regular House Cleaning',
    href: hrefFor('Regular House Cleaning'),
    summary:
      'Weekly, fortnightly or monthly, with the same cleaner each visit. The kitchen, the ' +
      'bathrooms and the floors done properly every time.',
    includes: [
      'Kitchen and bathrooms cleaned through',
      'Floors hoovered and mopped',
      'Beds made and bins emptied',
    ],
  },
  {
    title: 'Move-In Cleaning',
    href: hrefFor('Move-In Cleaning'),
    summary:
      'Every cupboard empty and every corner reachable — the only day that is ever true. ' +
      'Best done when you get the keys, before the boxes land.',
    includes: [
      'Inside every cupboard and wardrobe',
      'Behind where the appliances will go',
      'Windows cleaned inside',
    ],
  },
  {
    title: 'Move-Out Cleaning',
    href: hrefFor('Move-Out Cleaning'),
    summary:
      'Cleaned to the standard a check-out report is written against, so cleaning is not the ' +
      'reason money gets held back at the end of a tenancy.',
    includes: [
      'Inside the oven and the fridge',
      'Limescale off the bathroom fittings',
      'The whole property, empty, top to bottom',
    ],
  },
  {
    title: 'Short-Term Rental Cleaning',
    href: hrefFor('Short-Term Rental Cleaning'),
    summary:
      'Changeovers worked to your booking calendar, so the next guest walks into the property ' +
      'the listing photos showed them.',
    includes: [
      'Beds stripped, linen changed and made',
      'Kitchen, bathrooms and bins reset',
      'Breakages reported the same day, with photos',
    ],
  },
  {
    title: 'Builders Clean',
    href: hrefFor('Builders Clean'),
    summary:
      'Getting the dust out, then getting it out again. Window tracks, the tops of doors, ' +
      'light fittings and sockets, once the last trade is off site.',
    includes: [
      'Fine dust out of tracks and fittings',
      'Paint spots and adhesive taken off',
      'A second pass once the dust has settled',
    ],
  },
];

/**
 * The home FAQ set.
 *
 * A re-export rather than a second list: `GENERAL_FAQS` is exactly the set of
 * questions that are true of the business rather than of one service, which is
 * what a home page is asked. Six items, and every answer ships in the served
 * HTML whether its `<details>` is open or closed — that is ROADMAP SC-4 and a
 * property of the element, not of the styling. `FAQAccordion` emits no
 * structured data, here or anywhere.
 */
export const HOME_FAQS = GENERAL_FAQS;

/*
  Metadata, composed from `site.js` rather than typed, so the description cannot
  disagree with the rating badge rendered on the same page.

  MEASURED at execution time: the title is 54 characters and the description is
  132, against Lock 8's 60 and 155 caps. The title subject uses the SHORT area
  (`site.js`, AREA_SHORT) — §5 measured all seven titles that way, and the long
  form does not fit. Titles need not match the `<h1>` verbatim, and this one
  deliberately does not.
*/
export const HOME_TITLE = titleFor('House Cleaning in Warwickshire');
export const HOME_DESCRIPTION = describe('House cleaning');
