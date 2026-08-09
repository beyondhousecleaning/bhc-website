/**
 * FAQ sets — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`. Consumed by `FAQAccordion`, whose `FaqItem` shape is
 * `{ question, answer }`. `answer` is typed `ReactNode` so it CAN be markup;
 * every answer here is authored as a plain string and the component wraps it.
 * Keep it that way — a `.jsx` answer would drag copy back into a file the
 * `claude-seo` hook polices.
 *
 * THESE ANSWERS SHIP IN THE HTML WHETHER THE ITEM IS OPEN OR CLOSED. That is
 * ROADMAP SC-4 and it is a property of `<details>`, not of the styling. So this
 * copy is served text on every page that carries an FAQ band: it is read by
 * crawlers and by answer engines, and it is subject to Lock 5 exactly like the
 * visible copy is.
 *
 * NO STRUCTURED DATA. `FAQAccordion` deliberately emits none, and the schema
 * type it declines to emit is named in its `.prompt.md` and nowhere in
 * executable source (D13, delta 7). Nothing in this file changes that: these are
 * strings, not a graph.
 *
 * VOICE — UI-SPEC §5. Plain UK English, contractions, concrete nouns, named
 * towns. `tenancy`, `flat`, `skirting boards`, `hoover`, `builders clean`.
 * Never the US forms. Note that the post-construction SLUG is a live-site slug
 * and stays as it is (§13-C), but the PROSE always says "builders clean".
 *
 * No address, no postcode, no phone digits — the number lives once, in
 * `design-system/src/phone.js`, and every phone-bearing component defaults from
 * it. An FAQ answer restating it would be a second place it can be wrong.
 */

/**
 * The set used on Home and on the utility pages — the questions that are true
 * of the business rather than of one service.
 */
export const GENERAL_FAQS = [
  {
    question: 'Do I get the same cleaner every time?',
    answer:
      "Wherever we can, yes — and it's the point rather than a nice-to-have. The same " +
      'DBS-checked cleaner comes back each visit, so they learn which cupboard the ' +
      "cloths live in and which rooms you'd rather they left alone. If yours is ill or " +
      "on holiday we'll tell you who's coming instead.",
  },
  {
    question: 'Which towns do you cover?',
    answer:
      'Leamington Spa, Warwick and Kenilworth are our home patch, and we cover Coventry ' +
      "and the villages between them. If you're just outside and not sure, ask — we'd " +
      "rather tell you straight away than take a booking we can't staff properly.",
  },
  {
    question: 'Are your cleaners insured and DBS-checked?',
    answer:
      "Every one of them, before their first job. We're fully insured for the work we do " +
      "in your home, and we'll show you the paperwork if you'd like to see it.",
  },
  {
    question: 'Do I need to be at home while you clean?',
    answer:
      "Not at all. Plenty of our customers are at work and leave us a key or a code, and " +
      "plenty prefer to be in. Both are fine — tell us which you'd like when you book.",
  },
  {
    question: 'How do I get a price?',
    answer:
      'Tell us the number of bedrooms and bathrooms, anything extra you want doing, and ' +
      "how often you'd like us. That takes about two minutes and you get a fixed price " +
      "before we start — no hourly meter running, and no surprise on the day.",
  },
  {
    question: "What if I'm not happy with something?",
    answer:
      "Tell us and we'll put it right. We'd much rather hear about a missed skirting " +
      "board than have you quietly book someone else next month.",
  },
];

/*
  The per-service sets. Keyed by the LIVE slug, matching `nav.js` and the six
  `/services/*` routes.

  Four to six questions each, and deliberately not the same four rephrased: a
  visitor on the move-out page is worried about a deposit, a visitor on the
  builders-clean page is worried about dust in the light fittings. Duplicating
  GENERAL_FAQS across six pages would be six near-identical blocks of text, which
  is the near-duplicate-content shape the 2026-08-06 audit already found once on
  the live site. Templates compose the two sets when they want both.
*/
const SERVICE_FAQS = {
  'deep-cleaning': [
    {
      question: "What's the difference between a deep clean and a regular clean?",
      answer:
        "A regular clean keeps on top of a home that's already in good order. A deep " +
        'clean is the one that gets behind and underneath — inside the oven, the ' +
        'extractor filter, limescale off the taps and shower screen, skirting boards ' +
        'and door frames washed rather than dusted.',
    },
    {
      question: 'How long does a deep clean take?',
      answer:
        "Longer than you'd think, and that's the honest answer. A three-bedroom house " +
        "that hasn't had one before usually takes a team most of a day. We'd rather " +
        'quote you the real time than book half of it and leave the job unfinished.',
    },
    {
      question: 'Do I need a deep clean before starting a regular clean?',
      answer:
        "Often, yes — it's the sensible way round. One deep clean brings the house up " +
        'to a standard a fortnightly visit can then hold. If your home is already ' +
        "there, say so and we'll go straight to regular visits.",
    },
    {
      question: 'Do you bring your own equipment and products?',
      answer:
        "Everything, including the hoover. If you'd prefer we used your own products — " +
        'a fragrance-free range, or something for a particular worktop — leave them out ' +
        'and tell us.',
    },
  ],

  'standard-home-cleaning': [
    {
      question: 'How often should I book?',
      answer:
        'Weekly suits a busy family home, fortnightly suits most people, and monthly ' +
        "works if you're keeping on top of things yourself and want the heavy jobs " +
        'taken off you. You can change it later without any fuss.',
    },
    {
      question: "What's included in a regular clean?",
      answer:
        'Kitchen and bathrooms cleaned properly, floors hoovered and mopped, surfaces ' +
        'and skirting boards dusted, beds made, bins emptied. The full list is on our ' +
        "checklist page, and if something on it doesn't apply to your home we'll spend " +
        'the time elsewhere.',
    },
    {
      question: 'Can I skip a visit if we go away?',
      answer:
        "Yes. Let us know in good time and we'll move it or skip it. We won't charge " +
        'you for a clean that did not happen.',
    },
    {
      question: 'Can I add jobs like the oven or the windows?',
      answer:
        "You can, and it's better to ask than to hope. Extras take extra time, so we " +
        'price them in rather than squeezing them into the same visit.',
    },
    {
      question: 'Do you work around pets and children?',
      answer:
        'All the time. Tell us about the dog who objects to the hoover and the room the ' +
        "baby sleeps in at eleven, and we'll plan the visit around them.",
    },
  ],

  'move-in-cleaning': [
    {
      question: 'Why clean a house before I move in?',
      answer:
        "Because it's the only time you'll ever have every room empty. Inside the " +
        'kitchen cupboards, behind where the fridge will go, the insides of the ' +
        'windows — all of it is reachable now and none of it is once the boxes land.',
    },
    {
      question: 'When should you come?',
      answer:
        "The day you get the keys, ideally, and before the removal van. Give us the " +
        "date as soon as you have it — completion days move, and we'd rather hold the " +
        'slot than lose it.',
    },
    {
      question: "The place looks clean already. Do I still need it?",
      answer:
        'Have a look inside the oven and behind the toilet before you decide. A house ' +
        'that has been staged for viewings and a house that has been cleaned are two ' +
        "different things, and it's your family living in it.",
    },
    {
      question: 'Can you do a new build?',
      answer:
        "Yes, and new builds need it more than people expect — there's fine dust in the " +
        'window tracks, on top of every door and in the light fittings. If the builders ' +
        'have only just left, ask about a builders clean instead.',
    },
  ],

  'move-out-cleaning': [
    {
      question: 'Will this get my deposit back?',
      answer:
        'It gives you the best shot at it. Cleaning is the single most common reason ' +
        'money is held back at the end of a tenancy, and we clean to the standard a ' +
        "check-out report is written against. We can't speak for what your landlord " +
        'finds elsewhere, and we would not pretend otherwise.',
    },
    {
      question: "What's included?",
      answer:
        'The whole property, empty: inside the oven and the fridge, inside every ' +
        'cupboard and wardrobe, limescale off the bathroom fittings, skirting boards ' +
        'and door frames washed, windows cleaned inside, floors hoovered and mopped.',
    },
    {
      question: 'Should the flat be empty first?',
      answer:
        "Yes, please — furniture and boxes out, and the electricity still on. We can " +
        "work around a few bits, but anything we can't move is somewhere we can't clean.",
    },
    {
      question: 'How much notice do you need?',
      answer:
        'End-of-tenancy dates cluster at month end, so the last few days of the month ' +
        "book up first. A week or two is comfortable; if you're tighter than that, ask " +
        'anyway and we will tell you honestly what we can do.',
    },
    {
      question: 'What if the letting agent is not satisfied?',
      answer:
        "Tell us within a few days and we'll come back and put right anything we " +
        'missed. Send the check-out report over — it tells us exactly what they flagged.',
    },
  ],

  'short-term-rental-cleaning': [
    {
      question: 'Can you turn the property around between guests?',
      answer:
        "That's what this is. Beds stripped and made, bathrooms and kitchen cleaned, " +
        'bins out, everything reset the way the listing photos show it — so the next ' +
        'guest walks into the property they booked.',
    },
    {
      question: 'Do you handle the laundry?',
      answer:
        'We can. Most owners keep two or three sets of linen so a changeover never waits ' +
        "on a washing machine, and we'll work to whatever system you already have.",
    },
    {
      question: 'What happens on a same-day changeover?',
      answer:
        "We work to your check-out and check-in times rather than to a routine. Send us " +
        'the booking calendar and we will tell you which turnarounds are comfortable and ' +
        'which are tight before you accept them.',
    },
    {
      question: 'Will you tell me if something is damaged or missing?',
      answer:
        'Straight away, with photos. Finding a broken glass or a missing towel yourself ' +
        'three guests later is no use to anybody.',
    },
    {
      question: 'Can you restock the essentials?',
      answer:
        'Yes — tea, coffee, loo roll, soap, whatever your welcome pack includes. Leave ' +
        'a stock cupboard on site and tell us what goes in it.',
    },
  ],

  'post-construction-cleaning': [
    {
      question: 'What does a builders clean involve?',
      answer:
        'Getting the dust out, then getting the dust out again. Fine plaster and ' +
        'sawdust settles into window tracks, on top of doors, inside light fittings and ' +
        'into every corner of a socket, and it keeps dropping for days. We work top ' +
        'down and go back over the whole job at the end.',
    },
    {
      question: 'Do I need this if the builders tidied up?',
      answer:
        'Almost certainly. Builders clear their rubbish, which is a different job from ' +
        'cleaning a home to live in. Paint spots on glass, adhesive on skirting boards ' +
        'and dust in the extractor are all still there after a tidy-up.',
    },
    {
      question: 'When should you come?',
      answer:
        "After the last trade is off site — not before. If the decorator is coming back " +
        "on Monday, we'll be cleaning up after him twice and you'll be paying for it.",
    },
    {
      question: 'Can you do one room rather than the whole house?',
      answer:
        "Yes. A new kitchen or a loft conversion on its own is a normal job for us, and " +
        'the rest of the house usually needs a hoover through as well because the dust ' +
        'travels.',
    },
  ],
};

/**
 * The FAQ set for a service slug. Returns `[]` for an unknown slug rather than
 * throwing — `FAQAccordion` renders nothing at all on empty items (UI-SPEC §11),
 * so an unrecognised slug drops the band instead of 500ing the route. Phase 3's
 * canonical-slug rename is then a key change in this file.
 */
export function serviceFaqs(slug) {
  return SERVICE_FAQS[slug] || [];
}
