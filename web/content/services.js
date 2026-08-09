/**
 * The six service pages — pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory plus the `@/*` alias resolves at any
 * route depth. Copy and string handling live in `.js`; only `blocks.jsx` in this
 * directory returns elements.
 *
 * WHAT THIS FILE IS FOR. It is the whole of `/services/*`. One route file —
 * `web/app/services/[service]/page.jsx` — reads `SERVICES` for
 * `generateStaticParams` and `bySlug` for the page itself, so the six pages are
 * six records here rather than six hand-written directories.
 *
 * THE SLUGS ARE TODAY'S LIVE SLUGS (UI-SPEC §13-C), NOT THE D14 CANONICAL
 * TAXONOMY. Four of them are Americanised and all four get a 301 to their UK
 * equivalent in Phase 3. That rename is a DATA CHANGE — the `slug` field below,
 * the matching `nav.js` hrefs and the `faqs.js` keys — and not a template
 * change, precisely because this module is the only source of truth the route
 * has. §13-C's justification for deferring the rename is only true while that
 * stays the case; do not hand-write a directory for a seventh service.
 *
 * THE SLUGS MUST MATCH `nav.js` EXACTLY. The header, the footer and the home
 * page all link to `/services/{slug}`, and plan 02-02's delta 6 resolves every
 * internal href against the real `prerender-manifest.json`. A slug that drifts
 * here does not 404 quietly — it turns CI red on all eighteen pages at once,
 * which is the intended behaviour.
 *
 * `<h1>`, EYEBROW AND TITLE ARE ASSERTED CHARACTER FOR CHARACTER.
 * `PAGE_EXPECTATIONS` in `web/scripts/check-html-locks.mjs` holds all six
 * headings, so a wording change here goes red in the right place. The literal
 * `&` in `AREA_LONG` is correct and deliberate: React serialises it to `&amp;`
 * and the lock's extractor decodes entities before comparing, so writing the
 * entity here would double-encode (`site.js`, `AREA_LONG`).
 *
 * TITLES ARE MEASURED, NOT PATTERNED. UI-SPEC §5 writes the seven service and
 * home titles out individually and measures each one, because the previous
 * pattern measured 78 characters against Lock 8's 60-character cap. The six
 * subjects below are §5's, verbatim, and land at 53 to 57 characters through
 * `titleFor`. Do not regenerate them from `h1`. Titles need not match the `<h1>`
 * and these deliberately do not.
 *
 * CONTENT DEPTH IS THE POINT, NOT A NICE-TO-HAVE. REQ-content-depth-bar: the
 * live site medians 821 unique words per page and 1,183 on service pages, and
 * that margin is the measured reason 95 pages do not collide on similarity.
 * Every record below carries at least 800 body words, and each page is angled
 * differently — the deposit on move-out, the turnaround window on short-term
 * rental, the two dust passes on the builders clean. Six rephrasings of one page
 * would be the exact near-duplicate shape the depth bar exists to prevent.
 *
 * BLOCK SHAPE. `prose` is an array authored against `blocks.jsx`:
 *
 *   { type: 'p',  text: string }
 *   { type: 'h2', text: string }
 *   { type: 'h3', text: string }
 *   { type: 'ul', text: string[] }   // `text` carries the items
 *
 * There is no `h1` block type and there must never be one: Lock 1 allows exactly
 * one `<h1>` per page and it belongs to `Hero`'s `heading` prop.
 *
 * NO ADDRESS, NO POSTCODE, NO PHONE NUMBER, NO EMAIL, AND NO PRICES — D-04 /
 * Lock 5, the same rule `faqs.js`, `nav.js`, `utility.js`, `legal.js` and
 * `home.js` follow. The canonical number lives once in
 * `design-system/src/phone.js` and only the phone-bearing components render a
 * `tel:` link. Note also that `check-html-locks.mjs`'s street-line heuristic
 * matches a leading number followed by capitalised name words and a
 * thoroughfare noun, and 02-RESEARCH's Assumptions Log A1 flags this file as
 * the largest block of authored prose in the phase — the first time that
 * heuristic meets real copy at volume. An illustrative address in body copy
 * would fail SC-2d on a page carrying no address at all. There are none below,
 * and this comment does not instance one either: a comment naming the exact
 * shape a scanner bans is itself an occurrence of it, and this repo has now been
 * bitten by that ten times. The site quotes rather than price-lists, so no
 * figure in this file is a price.
 *
 * VOICE — UI-SPEC §5. Plain UK English, contractions, concrete nouns, named
 * towns: `tenancy`, `flat`, `skirting boards`, `hoover`, `builders clean`.
 * Never the US forms §5 lists opposite them, and never the three dead CTA
 * phrases it closes the door on. Neither set is quoted here: the acceptance
 * check for this file is a case-insensitive grep for those very words, so a
 * comment naming them fails the gate the comment exists to explain. Note in
 * particular that the sixth record keeps its live-site slug while its visible
 * noun, everywhere in the prose, is `builders clean`.
 */

import { serviceFaqs } from './faqs.js';
import { AREA_LONG, describe, titleFor } from './site.js';

/**
 * The six records, in the order UI-SPEC §5 lists them and the order the nav
 * carries them.
 *
 * Each one: `slug`, `h1`, `eyebrow`, `title`, `description`, `lead` (the Hero's
 * supporting line), `prose` (the block array) and `faqs` (looked up from
 * `faqs.js` rather than restated, so one slug rename moves both).
 */
export const SERVICES = [
  {
    slug: 'deep-cleaning',
    h1: `Deep Cleaning in ${AREA_LONG}`,
    eyebrow: 'Top to bottom, once',
    title: titleFor('Deep Cleaning in Warwickshire'),
    description: describe('Deep cleaning'),
    lead:
      'One long, thorough clean that gets behind, underneath and inside everything a weekly ' +
      'visit has to skip — on a fixed price agreed before we start.',
    prose: [
      {
        type: 'p',
        text:
          "A deep clean isn't a longer version of your usual clean. It's a different job. We work " +
          'top to bottom through the whole house, one room at a time, and we go after the things ' +
          'that build up so slowly you stop seeing them: the film on the extractor, the limescale ' +
          'round the shower head, the grease down the side of the hob, the dust on top of the door ' +
          'frames. Most homes want one about once a year. Some want one before anything else can ' +
          'sensibly be kept on top of.',
      },

      { type: 'h2', text: 'What a deep clean covers' },
      {
        type: 'p',
        text:
          'Everything a regular clean covers, plus all the jobs a regular clean never has the hours ' +
          'for. We bring our own kit, including the hoover, and we work the whole property unless ' +
          'you tell us to leave a room alone.',
      },
      {
        type: 'ul',
        text: [
          'Inside the oven — racks, trays, glass and the grill',
          'The extractor filter degreased rather than wiped over',
          'Limescale off taps, shower screens, shower heads and tiles',
          'Skirting boards, door frames and the tops of doors washed by hand',
          'Inside the kitchen cupboards and the fridge, if you would like them done',
          'Windows cleaned on the inside, with the sills and the tracks',
          'Switches, sockets, handles, radiators and the tops of picture rails',
          'Floors hoovered and mopped, including under whatever two of us can safely move',
        ],
      },

      { type: 'h2', text: 'Where the hours actually go' },
      { type: 'h3', text: 'The kitchen' },
      {
        type: 'p',
        text:
          "The kitchen takes the longest, every time. The oven on its own can run to an hour or " +
          "more when it hasn't been touched in a year, and it isn't a job you can hurry without " +
          'either leaving a film behind or taking the finish off. We degrease the extractor, clean ' +
          'the hob and the splashback, wipe every cupboard front and handle, clean inside and behind ' +
          'the bin, and leave the floor until last so that everything we bring down off the worktops ' +
          'goes with it.',
      },
      { type: 'h3', text: 'The bathrooms' },
      {
        type: 'p',
        text:
          'Hard water is why so many Warwickshire bathrooms look tired long before they are old. ' +
          "Limescale on a shower screen doesn't come off with a spray and a wipe — it needs the " +
          'right product and time to sit. We do the screen, the tiles, the grout, the shower head, ' +
          'the taps, the toilet including behind and underneath it, and the extractor vent, which ' +
          'hardly anybody thinks about and which is usually grey by the time we get to it.',
      },
      { type: 'h3', text: 'Bedrooms and living rooms' },
      {
        type: 'p',
        text:
          'Less dramatic, more fiddly. Skirting boards and door frames are washed rather than ' +
          'dusted, the tops of wardrobes and picture rails are cleared, blinds are done slat by ' +
          'slat, sockets and switches are wiped, and we move what two people can safely move so the ' +
          'hoover gets behind it. Under a bed is where a year of dust actually lives, and it takes ' +
          'about four minutes to sort once someone has bothered to shift the frame.',
      },

      { type: 'h2', text: "What we don't do on a deep clean" },
      {
        type: 'p',
        text:
          'Worth saying plainly, because a job list that quietly grows on the day is how people end ' +
          "up disappointed. We don't clean the outsides of upstairs windows, we don't clear rubbish " +
          "or run loads to the tip, and we won't shift a wardrobe or a piano between two of us. We " +
          "also won't scrub at mould that is a damp problem rather than a cleaning one — we will " +
          'tell you where we can see it and leave the cause to somebody qualified. Carpet and ' +
          "upholstery washing is a specialist job with its own machine: we'll hoover thoroughly, " +
          'but a wet extraction is not part of this.',
      },

      { type: 'h2', text: 'How long it takes, and what happens on the day' },
      {
        type: 'p',
        text:
          'A two-bedroom flat kept in reasonable order is usually most of a day for one cleaner. A ' +
          'four-bedroom house that has never had a deep clean is a team, and often a full one. We ' +
          'would rather quote you the real hours than book half of them and walk out at four with ' +
          'the job unfinished, which is why we ask a few pointed questions about the oven and the ' +
          'bathrooms before we price it.',
      },
      {
        type: 'p',
        text:
          "You don't need to be in. Plenty of customers leave a key or a code and come home to it " +
          "done. If you are in, point us at the things that bother you most — it genuinely helps, " +
          'because the corner you look at every morning is not always the corner we would have ' +
          'started with. And if we find something a clean cannot fix, a stained worktop or a ' +
          'scratched shower tray, we will tell you rather than leave you to spot it a week later.',
      },

      { type: 'h2', text: 'Products, kit and the things people ask us to use' },
      {
        type: 'p',
        text:
          'We arrive with everything, and that includes the machine — nobody should have to lend a ' +
          'cleaner a hoover. Cloths are colour-coded by room so the one that did the toilet never ' +
          'gets near a worktop, and they go home to be washed rather than rinsed out in your sink.',
      },
      {
        type: 'p',
        text:
          'Plenty of households would rather we used something else: a fragrance-free range because ' +
          'somebody reacts to scent, a specific product for a stone worktop or a waxed wooden floor, ' +
          'or nothing at all on a surface that has already been damaged once. Leave yours out with a ' +
          'note and that is what gets used. Tell us about anything delicate before the day rather ' +
          'than after — an antique, a hand-painted tile, a bath panel that is only clipped on.',
      },

      { type: 'h2', text: 'Who books one' },
      {
        type: 'p',
        text:
          'Three sorts of people, mostly. Someone about to start regular visits who wants the house ' +
          'brought up to a standard a fortnightly clean can then hold. Someone who has had a busy ' +
          'year — a new baby, a move, a long stretch of work — and has quietly lost ground on it. ' +
          'And someone getting a property ready to show, sell or let, where the gap between clean ' +
          'and properly clean is money.',
      },
      {
        type: 'p',
        text:
          'We work across Leamington Spa, Warwick, Kenilworth, Coventry and the villages in between. ' +
          'Tell us the number of bedrooms and bathrooms, be honest about the oven, and say when you ' +
          'would like us; you get a fixed price back before anybody sets foot in the house.',
      },
    ],
    faqs: serviceFaqs('deep-cleaning'),
  },

  {
    slug: 'standard-home-cleaning',
    h1: `Regular House Cleaning in ${AREA_LONG}`,
    eyebrow: 'Weekly or fortnightly',
    title: titleFor('Regular Cleaning in Warwickshire'),
    description: describe('Regular house cleaning'),
    lead:
      'The same DBS-checked cleaner every visit, a fixed price agreed up front, and a house that ' +
      'never gets far enough behind to need rescuing.',
    prose: [
      {
        type: 'p',
        text:
          'Regular cleaning is maintenance, and maintenance is dull in the best way. Somebody comes ' +
          'on the same day, does the kitchen, the bathrooms and the floors properly, and leaves. ' +
          'Nothing gets a chance to build up, so no single visit ever has to be heroic. That is the ' +
          'whole idea, and it only works if the person coming is the same person as last time.',
      },

      { type: 'h2', text: "What's in a regular visit" },
      {
        type: 'p',
        text:
          'A settled routine rather than a fixed script. We agree what matters most in your home ' +
          'when we start, and the visit is built around it. The core of it looks like this, and the ' +
          'full room-by-room list is on our checklist page.',
      },
      {
        type: 'ul',
        text: [
          'Kitchen: worktops, hob, splashback, sink, cupboard fronts, the outside of the appliances',
          'Bathrooms: bath, shower, screen, basin, toilet, mirrors and tiles',
          'Floors hoovered throughout and hard floors mopped',
          'Surfaces, sills and skirting boards dusted',
          'Beds made, or stripped and remade if you leave the linen out',
          'Bins emptied and rubbish taken out to your own bin',
          'Mirrors, glass doors and finger-marked switches wiped',
        ],
      },
      {
        type: 'p',
        text:
          "If part of that list doesn't apply to your home — no bath, no hard floors, a room you'd " +
          'rather we left shut — we spend the time somewhere else rather than pretending the hours ' +
          'went on it.',
      },

      { type: 'h2', text: 'Why the same cleaner matters more than it sounds' },
      {
        type: 'p',
        text:
          'It sounds like a small promise until you have had six different people through the door ' +
          'in six weeks. Someone who has been before knows which cupboard the cloths live in, knows ' +
          'the tap in the family bathroom drips if you turn it hard, knows the office door stays ' +
          'shut on a Tuesday because that is when you are on calls. None of that is written down ' +
          'anywhere useful, and every new face starts from nothing.',
      },
      {
        type: 'p',
        text:
          'So we hold the same cleaner to the same round wherever we possibly can. When yours is ' +
          'ill or on holiday we tell you who is coming instead, before they arrive rather than ' +
          'after — a stranger on the doorstep with a key is not a surprise anybody enjoys.',
      },

      { type: 'h2', text: 'How often people book' },
      { type: 'h3', text: 'Weekly' },
      {
        type: 'p',
        text:
          'A busy family house, a household where somebody works from home, or anywhere with a dog ' +
          'and a hall floor. Weekly means the kitchen and bathrooms never leave the state they were ' +
          'left in, and each visit is short.',
      },
      { type: 'h3', text: 'Fortnightly' },
      {
        type: 'p',
        text:
          'What most of our customers choose. Two weeks is about as long as a bathroom stays ahead ' +
          'in a hard water area, and it leaves you doing the day-to-day tidying while we do the ' +
          'parts that need doing properly.',
      },
      { type: 'h3', text: 'Monthly' },
      {
        type: 'p',
        text:
          'Right if you keep on top of things yourself and want the heavy jobs taken off you. Be ' +
          'aware that a monthly visit is a bigger job than a fortnightly one, so it takes longer — ' +
          'that is arithmetic rather than a sales line.',
      },

      { type: 'h2', text: 'Extras, and being honest about time' },
      {
        type: 'p',
        text:
          'Ovens, insides of windows, inside the fridge, the insides of kitchen cupboards, the ' +
          'inside of the freezer once it is defrosted: all of these are things we happily do, and ' +
          'all of them take real time. We would rather add the time and say so than squeeze an oven ' +
          'into a two-hour visit and leave the bathrooms half done. Ask when you book, or tell your ' +
          'cleaner the week before and we will build it into the next one.',
      },

      { type: 'h2', text: "What a regular visit can't fix on its own" },
      {
        type: 'p',
        text:
          'If a house has got a long way behind, the first visit will not catch it up, and anybody ' +
          'who tells you otherwise is selling you a disappointment. Baked-on oven grease, a shower ' +
          'screen that has furred over, grout that has gone grey and cupboards that have never been ' +
          'emptied are all hours of work each, and a routine visit does not contain those hours.',
      },
      {
        type: 'p',
        text:
          'The sensible way round is one deep clean to set the level, then regular visits to hold ' +
          'it. That is not an upsell so much as arithmetic: a fortnightly clean is designed to keep ' +
          'a house where it already is. If your home is already there, say so and we will go ' +
          'straight to the regular round.',
      },

      { type: 'h2', text: 'Keys, pets and the practical bits' },
      {
        type: 'p',
        text:
          'Most of our customers are at work when we come, so we hold a key or a code and let ' +
          'ourselves in. Some prefer to be home, and that is fine too — tell us which when you book ' +
          'and it is on your file from then on. Everyone who works for us is DBS-checked before ' +
          'their first job and we are fully insured for the work we do in your home.',
      },
      {
        type: 'p',
        text:
          'Pets are normal here. Tell us about the dog who objects to the hoover, the cat who bolts ' +
          'out of an open front door, and the room the baby sleeps in at eleven, and the visit gets ' +
          'planned around them rather than through them.',
      },

      { type: 'h2', text: 'Changing, skipping or stopping' },
      {
        type: 'p',
        text:
          'Going away? Let us know in good time and we will move the visit or skip it, and you are ' +
          'not charged for a clean that did not happen. Want to go from fortnightly to weekly for ' +
          'the winter, or the other way for the summer? Say so. We serve Leamington Spa, Warwick, ' +
          'Kenilworth, Coventry and the villages around them, and there is no long contract to ' +
          'unpick — this only works if you want us there next month.',
      },
    ],
    faqs: serviceFaqs('standard-home-cleaning'),
  },

  {
    slug: 'move-in-cleaning',
    h1: `Move-In Cleaning in ${AREA_LONG}`,
    eyebrow: 'Before the boxes arrive',
    title: titleFor('Move-In Cleaning in Warwickshire'),
    description: describe('Move-in cleaning'),
    lead:
      'The one day every cupboard is empty and every corner reachable. Booked for the day the ' +
      'keys are yours, before the van turns up.',
    prose: [
      {
        type: 'p',
        text:
          'An empty house is a gift to a cleaner, and it lasts about four hours. Every kitchen ' +
          'cupboard is bare, the space behind where the fridge is going is open, the wardrobes have ' +
          'nothing in them and the floors have nothing on them. Once the boxes are in, none of that ' +
          'is true again for years. A move-in clean is simply the job done while it still can be.',
      },

      { type: 'h2', text: "Why the previous owner's clean is not your clean" },
      {
        type: 'p',
        text:
          'Nobody cleans a house they are leaving the way they cleaned it while they lived there. ' +
          'The last week of a move is boxes, vans and stress, and the clean that happens at the end ' +
          'of it is a sweep through with a hoover. A property that has been staged for viewings and ' +
          'a property that has been cleaned are two different things — one is about what a camera ' +
          'sees from the doorway, and the other is about what is inside the oven.',
      },
      {
        type: 'p',
        text:
          'Have a look inside the oven and behind the toilet before you decide you can skip it. It ' +
          'is also, quietly, the reason people book this one: you are about to unpack a family into ' +
          'this house, and you would rather not do it on top of somebody else.',
      },

      { type: 'h2', text: 'What we clean before you move in' },
      {
        type: 'p',
        text:
          'The whole property, empty, working top to bottom so nothing we bring down lands on ' +
          'something already done.',
      },
      {
        type: 'ul',
        text: [
          'Inside and outside every kitchen cupboard, drawer and unit',
          'Inside the oven, the grill and the extractor filter',
          'Behind and beside where the fridge, the washing machine and the cooker will stand',
          'Inside every wardrobe, airing cupboard and built-in store',
          'Bathrooms taken back: limescale off the screen, the taps, the shower head and the tiles',
          'The toilet, including behind the pan and around the fixings',
          'Windows cleaned on the inside, with the sills, the tracks and the handles',
          'Skirting boards, door frames, switches, sockets, radiators and the tops of doors',
          'Floors hoovered and mopped throughout, staircase included',
        ],
      },

      { type: 'h2', text: 'Getting the timing right around completion' },
      {
        type: 'p',
        text:
          'The ideal is the morning you collect the keys, with the removal van booked for the ' +
          'afternoon or the following day. That gives us a clear, empty house and gives you a ' +
          'property that is ready to be lived in the moment the first box lands.',
      },
      {
        type: 'p',
        text:
          'Completion dates move, which is the whole difficulty. Give us your date as soon as you ' +
          'have one, even if you expect it to shift — we would rather hold a slot and move it than ' +
          "try to find you one at two days' notice at the end of the month, when everybody in " +
          'Warwick and Leamington Spa seems to complete at once. Tell us the moment it changes and ' +
          'we will do our best to follow it.',
      },

      { type: 'h2', text: 'The bits people forget until they are living there' },
      {
        type: 'p',
        text:
          'There is a short list of things nobody checks on a viewing and everybody notices in week ' +
          'one. The inside of the washing machine drawer and its rubber seal, which is where a ' +
          'smell in a utility room almost always comes from. The extractor fan in the bathroom. The ' +
          'underside of the toilet seat fixings. The top of the kitchen wall units, above eye level ' +
          'and sticky rather than dusty. The bin cupboard. The letterbox brushes.',
      },
      {
        type: 'p',
        text:
          'They are all quick while the house is empty and all awkward once it is not, so they are ' +
          'part of this job rather than an extra on it. If a previous owner has left something ' +
          'behind — half a tin of paint in a cupboard, a shelf of jars in the garage — we will ' +
          "leave it where it is and tell you, because throwing away somebody else's property is not " +
          'a decision a cleaner gets to make.',
      },

      { type: 'h2', text: 'New builds and recently renovated homes' },
      {
        type: 'p',
        text:
          'New builds need this more than people expect. There is fine dust in the window tracks, ' +
          'on top of every door, inside the light fittings and in the sockets, along with plaster ' +
          'splashes on skirting boards, stickers on the appliances and film on the glass. It looks ' +
          'immaculate because everything in it is new, and that is not the same as being clean.',
      },
      {
        type: 'p',
        text:
          'If the trades only left in the last week or two, the job you actually want is a builders ' +
          'clean rather than this one — the dust keeps falling for days and needs a second pass. ' +
          'Say what stage the property is at when you get in touch and we will tell you which of ' +
          'the two it is, including if that is the cheaper answer.',
      },

      { type: 'h2', text: 'What to leave us, and what to expect back' },
      {
        type: 'p',
        text:
          'We need access, water and electricity, and ideally the property genuinely empty — a few ' +
          'boxes in one room are workable, a hallway stacked to the ceiling is not. We bring ' +
          'everything else, including the hoover and the products. If you would rather we used a ' +
          'fragrance-free range because somebody in the house reacts to scent, leave yours out and ' +
          'tell us.',
      },
      {
        type: 'p',
        text:
          'You get a fixed price before we start, from the number of bedrooms and bathrooms and ' +
          'what state the kitchen is in, and the same DBS-checked team that cleans our regular ' +
          'homes across Kenilworth, Coventry and the villages between. If you want us back every ' +
          'fortnight once you are settled, that is a separate conversation and a much smaller job.',
      },
    ],
    faqs: serviceFaqs('move-in-cleaning'),
  },
];

/**
 * The record for a slug, or `undefined` for one that does not exist.
 *
 * The route sets `dynamicParams = false`, so an unlisted slug 404s at the edge
 * of the router and never reaches this function — the lookup only ever runs on
 * the six values `generateStaticParams` produced from `SERVICES` itself.
 */
export function bySlug(slug) {
  return SERVICES.find((service) => service.slug === slug);
}
