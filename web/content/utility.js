/**
 * The seven core utility pages — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias resolves at any
 * route depth. Copy and string handling live in `.js`; only `blocks.jsx` in this
 * directory returns elements.
 *
 * WHAT THIS FILE IS FOR. `/about-us`, `/contact-us`, `/checklist`,
 * `/get-a-quote`, `/work-with-us`, `/gift-cards` and `/customer-login` are seven
 * of ROADMAP Success Criterion 2's routes, and FOUR of them — contact-us,
 * work-with-us, gift-cards and customer-login — ship NO `<h1>` at all on the
 * live site. The `h1` field on each record below is that defect's fix, and each
 * one is character-for-character the UI-SPEC §5 deck, which is also what
 * `PAGE_EXPECTATIONS` in `web/scripts/check-html-locks.mjs` asserts against the
 * built HTML. Change one and the build goes red in the right place.
 *
 * TITLES ARE NOT THE `<h1>`. UI-SPEC §5: "titles need not match the `<h1>`
 * verbatim", and for two of these routes they must not. `titleFor` appends
 * ` | Beyond House Cleaning` (24 characters), so the subject has 36 to spend
 * against Lock 8's 60-character cap — and `The Team Behind Beyond House
 * Cleaning` (61 with the suffix) and `Contact Our Warwickshire Cleaning Team`
 * (62) both overrun it. `titleFor`'s JSDoc in `site.js` records the measurement
 * and names the fix taken here: a SHORTER TITLE SUBJECT. The `<h1>`s are
 * Success Criterion 2 copy and are correct as written — do not shorten those.
 *
 * THE RATING AND THE BRAND ARE NOT RESTATED. Both descriptions and the review
 * signal are composed from `RATING` and `BRAND` in `site.js`, so a description
 * cannot disagree with the badge rendered on the same page.
 *
 * NO ADDRESS, NO POSTCODE, NO PHONE NUMBER — D-04 / Lock 5, and the same rule
 * `faqs.js` and `nav.js` follow. The canonical number lives once in
 * `design-system/src/phone.js`; `QuoteFormEntry` and `NAPFooter` are the only
 * things that render a `tel:` link, and both default from it. Note also that
 * `check-html-locks.mjs`'s `STREET_LINE` heuristic matches a leading number
 * followed by capitalised name words and a thoroughfare noun, and this file is
 * the first place in the project where prose arrives at volume — an
 * illustrative address in body copy would fail SC-2d on a page carrying no
 * address at all. There are none below, and this comment does not quote one
 * either: a comment naming the exact shape a scanner bans is itself an
 * occurrence of it, and this repo has now been bitten by that eight times.
 *
 * VOICE — UI-SPEC §5. Plain UK English, contractions, concrete nouns, named
 * towns: `tenancy`, `flat`, `skirting boards`, `hoover`, `builders clean`.
 * Never the US forms, and never the three dead CTA phrases §5 closes the door
 * on. They are listed in §5 and deliberately NOT quoted here: the acceptance
 * check for this file is a case-insensitive grep for those very phrases, so a
 * comment naming them fails the gate that the comment exists to explain.
 *
 * BLOCK SHAPE. `prose` is an array authored against `blocks.jsx`:
 *
 *   { type: 'p',  text: string }
 *   { type: 'h2', text: string }
 *   { type: 'h3', text: string }
 *   { type: 'ul', text: string[] }   // `text` carries the items
 *
 * There is no `h1` block type and there must never be one: Lock 1 allows
 * exactly one `<h1>` per page and it belongs to `Hero`'s `heading` prop.
 */

import { BRAND, RATING, AREA_SHORT, titleFor, describe } from './site.js';

/**
 * The review signal every description opens with, composed rather than typed.
 *
 * UI-SPEC §5: 0 of the 115 live meta descriptions mention the rating at all,
 * which is why the form leads with it. `describe()` in `site.js` builds the
 * same opening for service subjects; these pages are not services, so most of
 * them are hand-written from this fragment instead.
 */
const RATED = `Rated ${RATING.rating} by ${RATING.count} ${RATING.source} reviews.`;

/*
  THE TWO OUTBOUND DESTINATIONS, AND BOTH ARE PENDING SAM (UI-SPEC §14-2).

  `/customer-login` hands off to the existing booking portal and `/gift-cards`
  to a gift-card provider. Neither URL has been confirmed, so what ships is the
  live site's own page for each — those URLs resolve today, they are the pages
  currently holding the hand-off, and they are absolute `https://`, which is
  what the consuming route requires.

  SWAPPING EITHER IS A ONE-STRING EDIT HERE. No template change, no component
  change, no new prop. That is the whole reason the href is a data value.

  TWO CONSTRAINTS ON WHATEVER GOES IN.

    1. It must be an absolute `https://` URL. The consuming route applies the
       WR-10 scheme guard — `/^https?:\/\//i` — before rendering, and omits the
       action entirely when it fails, so a relative path or a `javascript:` URL
       silently removes the page's only outbound action rather than shipping a
       broken or hostile link.
    2. It leaves the site, so the route renders it `target="_blank"` with
       `rel="noopener noreferrer"`. `rel="noopener"` alone is inert (WR-10).

  AND ONE THING TO CATCH BEFORE CUTOVER. Both defaults point at the live
  Webflow site, which THIS SITE REPLACES at cutover — at which point each
  becomes a link from a page to itself. Nothing in the lock harness catches it:
  delta 6 resolves internal `href="/…"` values against the prerender manifest
  and never looks at an absolute URL. Confirm both with Sam before go-live.
*/
const BOOKING_PORTAL = 'https://www.beyondhousecleaning.com/customer-login';
const GIFT_CARD_STORE = 'https://www.beyondhousecleaning.com/gift-cards';

/**
 * The seven records, keyed by path.
 *
 * Each carries: `path`, `crumb` (the breadcrumb label, which is the reader's
 * word for the page and may differ from the `<h1>`), `h1`, `eyebrow`, `lead`,
 * `title`, `description`, `prose`, and — on the two hand-off pages —
 * `outbound: { label, href }`.
 */
export const UTILITY = {
  '/about-us': {
    path: '/about-us',
    crumb: 'About Us',
    h1: `The Team Behind ${BRAND}`,
    eyebrow: 'A local team, not a platform',
    lead:
      "We're a small Warwickshire cleaning team. The same faces each week, a fixed price " +
      'before we start, and someone who picks up the phone.',
    /* 27 + 24 = 51. The `<h1>` would be 61 — see the header. */
    title: titleFor(`About ${BRAND}`),
    description: `${RATED} Meet the ${AREA_SHORT} team behind ${BRAND} — DBS-checked, insured, and local to your town.`,
    prose: [
      {
        type: 'p',
        text:
          `${BRAND} is run out of Leamington Spa and cleans homes across Warwick, ` +
          "Kenilworth, Coventry and the villages in between. We're not a national booking " +
          "platform taking a cut of somebody else's work — the cleaners are ours, we train " +
          "them, and we're the people you speak to when something needs sorting.",
      },
      { type: 'h2', text: 'Who actually turns up' },
      {
        type: 'p',
        text:
          'Wherever we can, the same cleaner comes back to your home each visit. That sounds ' +
          "like a small thing until you've had six different people through the door in six " +
          'weeks, none of whom knew which cupboard the cloths live in or that the spare room ' +
          'is out of bounds. Everyone who works for us is DBS-checked before their first job, ' +
          "and we're fully insured for the work we do in your home.",
      },
      { type: 'h2', text: 'How we hire' },
      {
        type: 'p',
        text:
          'We hire for care and reliability and train for the rest. New cleaners work ' +
          'alongside someone experienced before they take a home of their own, and we would ' +
          "rather turn a booking down than staff it with somebody we don't know yet. It is " +
          "also why we're careful about how far we spread: a team you can drive between is a " +
          'team you can actually manage.',
      },
      { type: 'h2', text: "What we won't do" },
      {
        type: 'p',
        text:
          "We won't quote a price we can't hold, and we won't send someone you've never met " +
          "without telling you first. If a clean hasn't gone the way it should have, we'd far " +
          'rather hear it from you on the day than read it in a review three weeks later.',
      },
    ],
  },

  '/contact-us': {
    path: '/contact-us',
    crumb: 'Contact Us',
    h1: `Contact Our ${AREA_SHORT} Cleaning Team`,
    eyebrow: 'A real person, same working day',
    lead:
      "Give us a ring, or ask for a price online and we'll come back to you the same " +
      'working day.',
    /* 25 + 24 = 49. The `<h1>` would be 62 — see the header. */
    title: titleFor('Contact Our Cleaning Team'),
    description: `${RATED} Ring our ${AREA_SHORT} cleaning team or ask for a fixed price online. We answer the same working day.`,
    prose: [
      {
        type: 'p',
        text:
          'The quickest way to reach us is the phone. The number sits at the foot of every ' +
          'page on this site, and it rings a person in Warwickshire rather than a call centre ' +
          'somewhere else.',
      },
      { type: 'h2', text: 'Booking a clean' },
      {
        type: 'p',
        text:
          "If you'd rather have a price than a chat, the quote page takes about two minutes — " +
          "rooms, extras, and how often you'd like us. You get a fixed price before anyone " +
          'sets foot in your home, and no obligation to take it.',
      },
      { type: 'h2', text: 'Already a customer' },
      {
        type: 'p',
        text:
          'Moving a visit, adding the oven, or telling us your cleaner did something ' +
          "brilliant — same number, same team. Have the date of the booking to hand and we'll " +
          'sort it while you are on the phone.',
      },
      { type: 'h2', text: 'When we answer' },
      {
        type: 'p',
        text:
          'We answer through the week and on Saturdays; the hours are in the footer of every ' +
          "page. Ring outside them and you'll get a message rather than silence, and we pick " +
          'those up first thing.',
      },
      { type: 'h2', text: 'Where we clean' },
      {
        type: 'p',
        text:
          'Leamington Spa, Warwick, Kenilworth and Coventry are our home patch, and we cover ' +
          "the villages between them. If you're just outside and not sure, ask — we'd rather " +
          "tell you straight away than take a booking we can't staff properly.",
      },
    ],
  },

  '/checklist': {
    path: '/checklist',
    crumb: "What's Included",
    h1: "What's Included in Every Clean",
    eyebrow: 'No small print',
    lead:
      'Every clean covers the same list, whichever cleaner comes. Here it is in full, plus ' +
      'what a deep clean adds on top.',
    /* 29 + 24 = 53. */
    title: titleFor("What's Included in Every Clean"),
    description: `${RATED} Exactly what's included in every clean, and what a deep clean adds. No small print, no surprises.`,
    prose: [
      {
        type: 'p',
        text:
          'Cleaning quotes usually go wrong in the gap between what you assumed was included ' +
          'and what was. So here is the whole list. If something you want is missing from it, ' +
          "tell us before we start and we'll price it in rather than skip it and hope.",
      },
      { type: 'h2', text: 'In every clean, every visit' },
      {
        type: 'ul',
        text: [
          'Kitchen: worktops, sink and taps, hob, and the outsides of the appliances',
          'Bathrooms: bath, shower, basin, loo, mirrors and tiles',
          'Dusting throughout, including skirting boards, light switches and door handles',
          'Floors hoovered throughout, hard floors mopped',
          'Beds made and cushions straightened',
          'Bins emptied and the rubbish taken out',
        ],
      },
      { type: 'h2', text: 'What a deep clean adds' },
      {
        type: 'p',
        text:
          'A deep clean is the once-a-year one: the same list, plus everything a weekly visit ' +
          'never has time for. It takes longer and it costs more, and it is what most people ' +
          'want before a party, after builders, or at the end of a tenancy.',
      },
      {
        type: 'ul',
        text: [
          'Inside the oven, the fridge and the freezer',
          'Inside cupboards and wardrobes, where they are empty enough to reach',
          'Limescale off shower screens, taps and tiles',
          'Skirting boards, door frames and radiators washed rather than dusted',
          'Window sills and the inside of the glass',
          'Behind and underneath whatever two people can safely move',
        ],
      },
      { type: 'h2', text: "What we don't do" },
      {
        type: 'ul',
        text: [
          'Outside windows above the ground floor',
          'Anything needing more than a step stool to reach',
          'Clearing hoarded rooms, or anything biohazardous',
          "Ironing, unless you've asked for it as an extra",
          'Shifting heavy furniture single-handed',
        ],
      },
      { type: 'h2', text: 'Products and equipment' },
      {
        type: 'p',
        text:
          "We bring our own kit and our own products, so there's nothing for you to buy or " +
          "leave out. If you'd rather we used yours — a stone worktop that hates anything " +
          "acidic, an allergy in the house, a cat that reacts to something — leave them out " +
          "with a note and that's what we'll use.",
      },
      { type: 'h2', text: 'How long it takes' },
      {
        type: 'p',
        text:
          'A regular clean of a three-bedroom house is usually two to three hours; a deep ' +
          'clean of the same house is closer to a full day. We give you the hours with the ' +
          'price rather than after the visit, so you know what you are paying for.',
      },
    ],
  },

  '/get-a-quote': {
    path: '/get-a-quote',
    crumb: 'Get a Quote',
    h1: 'Get a Free Cleaning Quote',
    eyebrow: 'Two minutes, no obligation',
    lead:
      "Tell us about your home and we'll come back with a fixed price before anyone sets " +
      'foot in it.',
    /* 25 + 24 = 49. */
    title: titleFor('Get a Free Cleaning Quote'),
    description: describe('House cleaning quotes'),
    prose: [
      {
        type: 'p',
        text:
          'A quote takes about two minutes and costs nothing. You tell us the rooms, the ' +
          "extras you'd like and how often you want us; we come back with a fixed price for " +
          'that work. No survey, no visit, and nobody ringing you every week afterwards.',
      },
      { type: 'h2', text: 'What happens after you ask' },
      {
        type: 'p',
        text:
          'We read it the same working day and reply with a price and the hours behind it. ' +
          "If anything is unclear — a fourth bedroom that's really a study, or a kitchen " +
          "that's had builders in it — we'll ask rather than guess high.",
      },
      {
        type: 'p',
        text:
          "The price we send is the price you pay for the work described. If we've " +
          "misjudged how long something takes, that's ours to carry, not yours to " +
          'find out about afterwards.',
      },
      { type: 'h2', text: "If you'd rather talk to someone" },
      {
        type: 'p',
        text:
          'Ring us instead. One call does the same job, and for anything unusual — an end of ' +
          'tenancy with a deadline, a builders clean, a home nobody has been able to get on ' +
          'top of for a while — it is usually quicker.',
      },
    ],
  },

  '/work-with-us': {
    path: '/work-with-us',
    crumb: 'Work With Us',
    h1: 'Cleaning Jobs in Warwickshire & the West Midlands',
    eyebrow: "We're hiring cleaners",
    lead:
      'Steady hours in homes near you, the same customers week to week, and a team that ' +
      'answers the phone when you ring.',
    /* 29 + 24 = 53. The `<h1>` would be 72. */
    title: titleFor(`Cleaning Jobs in ${AREA_SHORT}`),
    description: `${RATED} Cleaning jobs across Warwickshire and the West Midlands — steady hours, homes near you, a team that answers.`,
    prose: [
      {
        type: 'p',
        text:
          "We're taking on cleaners around Leamington Spa, Warwick, Kenilworth and Coventry, " +
          'and further out across the West Midlands as the round grows. If you clean well and ' +
          "you turn up when you said you would, we'd like to hear from you.",
      },
      { type: 'h2', text: 'What the work looks like' },
      {
        type: 'p',
        text:
          "Domestic cleaning in people's homes, mostly weekday daytimes, with the same " +
          'customers week after week rather than a different address every morning. Most of ' +
          'our cleaners work a set round they know inside out, which is easier on everyone — ' +
          'you learn the house, and the house learns you.',
      },
      { type: 'h2', text: "What we're after" },
      {
        type: 'ul',
        text: [
          'A car or van, or a reliable way of getting between homes',
          "The right to work in the UK, and a DBS check — we'll arrange that",
          'Turning up on the day you said, at the time you said',
          "Noticing the thing nobody thought to ask for",
        ],
      },
      { type: 'h2', text: 'What you get from us' },
      {
        type: 'ul',
        text: [
          'Hours agreed up front, not a rota that moves every week',
          'The same homes week to week wherever we can manage it',
          'Products and equipment provided, so nothing comes out of your pocket',
          'Someone on the end of the phone when a job throws up something odd',
        ],
      },
      { type: 'h2', text: 'How to apply' },
      {
        type: 'p',
        text:
          "Ring us and say you're after work, or send a message through the contact page and " +
          "we'll come back to you. Tell us which towns you can get to and which days you have " +
          'free — that is most of the conversation.',
      },
    ],
  },

  '/gift-cards': {
    path: '/gift-cards',
    crumb: 'Gift Cards',
    h1: 'House Cleaning Gift Cards',
    eyebrow: 'For the person with no time',
    lead:
      'Give someone an afternoon back instead of another candle. They choose the date; our ' +
      'cleaners do the rest.',
    /* 25 + 24 = 49. */
    title: titleFor('House Cleaning Gift Cards'),
    description: `${RATED} Give a ${AREA_SHORT} house clean as a gift. They choose the date, our DBS-checked cleaners do the rest.`,
    outbound: {
      label: 'Buy a Gift Card',
      href: GIFT_CARD_STORE,
    },
    prose: [
      {
        type: 'p',
        text:
          'A gift card covers a clean of whatever size you want to pay for — a regular visit ' +
          'for someone who has just had a baby, or a full deep clean for parents who have ' +
          'stopped being able to face the oven. It works best for the people who would never ' +
          'book it for themselves.',
      },
      { type: 'h2', text: 'How it works' },
      {
        type: 'ul',
        text: [
          'Choose the amount and buy the card',
          'They get it by email, with instructions and nothing to print',
          'They ring us or ask for a quote, and the card comes off the price',
        ],
      },
      { type: 'h2', text: 'Where it can be used' },
      {
        type: 'p',
        text:
          'Anywhere we clean: Leamington Spa, Warwick, Kenilworth, Coventry and the villages ' +
          "between them. If the person you're buying for lives a bit further out, ask us " +
          'first — we would rather tell you now than have them find out when they try to book.',
      },
      { type: 'h2', text: 'Buying for a whole household' },
      {
        type: 'p',
        text:
          'Plenty of these are bought between siblings for a parent, or by a whole office for ' +
          'someone going through it. Ring us if you want to put several together into one ' +
          'clean and we will sort the arithmetic out at our end.',
      },
    ],
  },

  '/customer-login': {
    path: '/customer-login',
    crumb: 'Customer Login',
    h1: 'Manage Your Cleaning Bookings',
    eyebrow: 'Your bookings, in one place',
    lead:
      "Change a date, add an extra, or check what's coming up — it is all in the booking " +
      'portal, and you can always ring us instead.',
    /* 29 + 24 = 53. */
    title: titleFor('Manage Your Cleaning Bookings'),
    description: `${RATED} Move a visit, add an extra or check your next clean in the ${BRAND} booking portal.`,
    outbound: {
      label: 'Open the Booking Portal',
      href: BOOKING_PORTAL,
    },
    /*
      The `Call` fallback UI-SPEC §9.4 requires on this page, rendered by
      `QuoteFormEntry` — the panel's own defaults are written for a prospect
      asking for a price, and the person on this page already books with us.

      The COPY is here rather than in the route file for the reason at the top
      of `site.js`: copy lives in `.js`. The phone number is NOT here. It is
      not a field of this record and it never will be — `QuoteFormEntry`
      derives both the displayed digits and the `tel:` href from the one value
      in `design-system/src/phone.js`, which is the whole of the NAP fix.
    */
    callout: {
      heading: 'Would rather talk to a person?',
      bullets: [
        'No queue and no call centre',
        'The same team that cleans your home',
        'Changes sorted while you are on the phone',
      ],
    },
    prose: [
      {
        type: 'p',
        text:
          'Your bookings live in our booking system rather than on this site, so the button ' +
          'below opens it in a new tab. Sign in with the email address the booking was made ' +
          'under.',
      },
      { type: 'h2', text: 'What you can do there' },
      {
        type: 'ul',
        text: [
          'See when your next clean is, and who is coming',
          'Move a visit or skip a week',
          'Add an extra, like the oven or the inside of the windows',
          'Update your card details and look back at past invoices',
        ],
      },
      { type: 'h2', text: 'If you cannot get in' },
      {
        type: 'p',
        text:
          'Try the email address the first booking was made under — for a household that is ' +
          "often not the person who answers the door. If that still doesn't work, ring us and " +
          'we will look it up while you are on the phone rather than sending you round the ' +
          'houses.',
      },
      { type: 'h2', text: "Rather not use a portal at all" },
      {
        type: 'p',
        text:
          'Then do not. Ring the number on this page and we will move the visit, add the ' +
          'extra or cancel the week for you. The portal is there because it is quicker at ' +
          'eleven at night, not because we have stopped answering the phone.',
      },
    ],
  },
};

/**
 * Look a record up by route path.
 *
 * Returns `undefined` for an unknown path rather than throwing: this is read at
 * module scope by a route file inside the root layout's page tree, and a throw
 * there takes the whole route down at build time. A missing record fails loudly
 * enough one line later, when the route reads `record.h1` and `Hero` throws its
 * own "`heading` is required" error naming the component.
 */
export function byPath(path) {
  return UTILITY[path];
}

export default UTILITY;
