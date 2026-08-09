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

  {
    slug: 'move-out-cleaning',
    h1: `Move-Out Cleaning in ${AREA_LONG}`,
    eyebrow: 'Get the deposit back',
    title: titleFor('Move-Out Cleaning in Warwickshire'),
    description: describe('Move-out cleaning'),
    lead:
      'An empty property cleaned to the standard a check-out report is written against, so ' +
      'cleaning is not the reason any of your deposit gets held back.',
    prose: [
      {
        type: 'p',
        text:
          'Cleaning is the single most common reason money is held back at the end of a tenancy. ' +
          'Not damage, not missing keys, not the garden — cleaning. It is also the only one of ' +
          'those you can still do something about on the last weekend, which is why this job exists ' +
          'and why it is worth doing properly rather than at eleven at night with a bottle of spray ' +
          'and a roll of kitchen paper.',
      },

      { type: 'h2', text: 'What a check-out report is written against' },
      {
        type: 'p',
        text:
          'An inventory clerk is not judging your housekeeping. They are comparing the property ' +
          'against the check-in inventory that was taken the day you moved in, photograph by ' +
          'photograph, and writing down every difference. That is a much narrower and much harsher ' +
          'test than "it looks tidy", and it is why a property that feels perfectly clean to live ' +
          'in can still come back with a list.',
      },
      {
        type: 'p',
        text:
          'The differences they write down are almost always the same handful. Grease inside the ' +
          'oven and on the extractor. Limescale on the shower screen and round the taps. Mould in ' +
          'the sealant. Dust on the tops of doors and in the light fittings. Crumbs in the cutlery ' +
          'drawer and marks inside the cupboards. Skirting boards. The inside of the windows. Every ' +
          'one of those is somewhere a person living in a home has no particular reason to look, ' +
          'and every one is on the report.',
      },

      { type: 'h2', text: 'What we clean on a move-out' },
      {
        type: 'p',
        text:
          'The whole property, empty, top to bottom. There is no "we skipped the spare room" ' +
          'version of this job, because the clerk is not going to skip it either.',
      },
      {
        type: 'ul',
        text: [
          'Inside the oven, the grill, the racks and the door glass',
          'The extractor hood and its filter, degreased',
          'Inside the fridge and freezer, defrosted and left dry with the door ajar',
          'Inside and outside every cupboard, drawer, wardrobe and airing cupboard',
          'Limescale off shower screens, taps, shower heads, tiles and the toilet',
          'Sealant and grout scrubbed, and mould treated where it will lift',
          'Skirting boards, door frames, tops of doors, switches, sockets and radiators',
          'Windows cleaned on the inside, with the sills, the tracks and the handles',
          'Light fittings, extractor vents and the tops of the kitchen units',
          'Floors hoovered and mopped throughout, including the stairs and under where the furniture was',
        ],
      },

      { type: 'h2', text: 'The oven, every single time' },
      {
        type: 'p',
        text:
          'If one item accounts for more withheld deposits than any other, it is the oven. It gets ' +
          'flagged because it is easy to photograph, easy to score and impossible to argue with. It ' +
          'is also the job most people underestimate: a year of roasting tins leaves carbon that ' +
          'does not come off with a sponge, and the door glass has two or three panes with the mess ' +
          'sitting between them.',
      },
      {
        type: 'p',
        text:
          'So we treat it as its own piece of work rather than as one line on a list. Racks and ' +
          'trays come out and soak, the interior is stripped rather than wiped, and the glass gets ' +
          'done from both sides. If your oven has been sitting untouched for two years, tell us ' +
          'before we quote — it changes the hours, and finding out on the day is bad for everyone.',
      },

      { type: 'h2', text: 'How this differs from a deep clean' },
      {
        type: 'p',
        text:
          'They overlap heavily and they are not the same job. A deep clean happens in a home that ' +
          'is being lived in: furniture stays, we work around it, and the aim is a house that feels ' +
          'reset. A move-out happens in an empty property and the aim is an inventory that comes ' +
          'back clear. Everything that furniture was hiding is in scope, nothing is being worked ' +
          'around, and the finish is measured against a document rather than against how it feels.',
      },
      {
        type: 'p',
        text:
          'That is also why the two are quoted differently. Ask for whichever fits what you are ' +
          'trying to achieve, and if you describe the situation we will tell you which one you ' +
          'actually want.',
      },

      { type: 'h2', text: 'Timing, and what the property should look like when we arrive' },
      {
        type: 'p',
        text:
          'Empty, please — furniture and boxes out, and the electricity and water still on. We can ' +
          'work around a few odds and ends in one room, but anything we cannot move is somewhere we ' +
          'cannot clean, and that gap is exactly what ends up in the report. Book us after the ' +
          'removal van and before the check-out appointment, ideally with a day in hand.',
      },
      {
        type: 'p',
        text:
          'End-of-tenancy dates cluster hard at the end of the month, so the last few days book up ' +
          'first across Leamington Spa, Warwick and Coventry alike. A week or two of notice is ' +
          'comfortable. Less than that is worth asking about anyway — we would rather tell you ' +
          'honestly what we can do than have you assume we cannot.',
      },

      { type: 'h2', text: 'If the agent comes back with something' },
      {
        type: 'p',
        text:
          'Send us the check-out report. It lists exactly what was flagged and where, which is far ' +
          'more useful than a message saying the agent was not happy. If it is something we missed, ' +
          'we come back and put it right — that is the point of using a cleaner rather than doing ' +
          'it yourself at midnight. What we cannot do is speak for wear, marks on the walls or ' +
          'anything else that was never a cleaning problem, and we will not pretend otherwise.',
      },
    ],
    faqs: serviceFaqs('move-out-cleaning'),
  },

  {
    slug: 'short-term-rental-cleaning',
    h1: `Short-Term Rental Cleaning in ${AREA_LONG}`,
    eyebrow: 'Guest-ready between stays',
    title: titleFor('Rental Cleaning in Warwickshire'),
    description: describe('Short-term rental cleaning'),
    lead:
      'Changeovers worked to your booking calendar, so the next guest walks into the property the ' +
      'listing photos promised them.',
    prose: [
      {
        type: 'p',
        text:
          'A holiday let is not a home with guests in it. It is a small hospitality business where ' +
          'the product is a room that looks exactly the way it looked in the photographs, every ' +
          'single time, for a stranger who will score it publicly within a week. That is a ' +
          'different job from cleaning a house, and the difference is mostly about repeatability ' +
          'and about the clock.',
      },

      { type: 'h2', text: 'What a changeover involves' },
      {
        type: 'p',
        text:
          'The property is reset rather than tidied. Every guest leaves a slightly different mess ' +
          'in a slightly different place, and the finish has to be identical regardless.',
      },
      {
        type: 'ul',
        text: [
          'Beds stripped, mattress protectors checked, fresh linen on and made to a set standard',
          'Towels changed and folded the same way each visit',
          'Bathrooms cleaned through, including the shower screen and the toilet',
          'Kitchen reset: worktops, hob, sink, kettle, toaster, and the fridge emptied and wiped',
          'Crockery and cutlery checked, counted and put back where the guide says it lives',
          'Bins emptied, liners on, and the outside bins put out for the right collection day',
          'Floors hoovered and mopped, sofa cushions straightened, remotes back on the table',
          'Windows and mirrors checked for marks at guest eye level',
          'A final walk-through against your own checklist, room by room',
        ],
      },

      { type: 'h2', text: 'Linen, and why two sets is the answer' },
      {
        type: 'p',
        text:
          'The single biggest cause of a late changeover is a washing machine. If the beds cannot ' +
          'be made until a load has finished, the turnaround is hostage to a cycle time, and a ' +
          'same-day booking is then impossible. Most owners we work with keep two or three full ' +
          'sets of linen and towels per bed, so the dirty set leaves with us or goes into the ' +
          'machine after the property is already guest-ready.',
      },
      {
        type: 'p',
        text:
          'We work to whatever system you already have rather than insisting on ours. Hired linen ' +
          'delivered on a schedule, your own sets laundered on site, a mix of the two — all of it ' +
          'is normal. What matters is that the system is written down somewhere and that the person ' +
          'in the property knows it.',
      },

      { type: 'h2', text: 'The window between check-out and check-in' },
      {
        type: 'p',
        text:
          "Most listings run an eleven o'clock check-out and a three or four o'clock check-in. That " +
          'is a genuine four hours only if the last guest leaves on time and the cleaner is already ' +
          'nearby, and a back-to-back booking on a busy weekend in Warwick or Kenilworth is tighter ' +
          'still.',
      },
      {
        type: 'p',
        text:
          'So we plan around your calendar rather than around a fixed round. Send it over and we ' +
          'will tell you which turnarounds are comfortable, which are tight and which you should ' +
          'think twice about accepting — before you accept them, which is the only moment that ' +
          'information is worth anything. If a guest overstays and the window collapses, you get a ' +
          'message rather than a surprise.',
      },

      { type: 'h2', text: 'Consistency is what guests actually score' },
      {
        type: 'p',
        text:
          'Nobody writes a review about an excellent clean. They write one about the hair in the ' +
          'plughole, the crumbs in the toaster or the mug with lipstick on it, and they write it ' +
          'about a property that was spotless on their last three stays. One inconsistent ' +
          'changeover undoes a season of good ones, and the cost of it is a rating rather than a ' +
          'complaint.',
      },
      {
        type: 'p',
        text:
          'That is the argument for the same small team doing your property each time and for a ' +
          'written property guide rather than a shared instinct: where the spare duvet lives, which ' +
          'way the cushions face, how the welcome tray is laid out, which door sticks. We will help ' +
          'you build that guide from the first few visits if you have not got one.',
      },

      { type: 'h2', text: 'Consumables, breakages and what we report' },
      {
        type: 'p',
        text:
          'We restock whatever your welcome pack includes — tea, coffee, sugar, loo roll, hand ' +
          'soap, dishwasher tablets, bin liners. Leave a stock cupboard on site, tell us what goes ' +
          'in it, and we will tell you when it is running low rather than when it has run out.',
      },
      {
        type: 'p',
        text:
          'Anything broken, stained or missing gets reported the same day, with photographs. ' +
          'Finding a chipped glass or an absent towel yourself, three guests later, is no use to ' +
          'anybody: you cannot raise it with the guest who did it and you cannot claim for it. A ' +
          'photograph on the day is worth more than a careful note a fortnight afterwards.',
      },

      { type: 'h2', text: 'Owners, agencies and the properties we take on' },
      {
        type: 'p',
        text:
          'We work for owners who manage their own listing and for agencies running several ' +
          'properties across Leamington Spa, Warwick, Kenilworth and Coventry. What we need in ' +
          'either case is access we can rely on, a calendar we can see, and someone who answers ' +
          'when the boiler stops working an hour before a check-in.',
      },
      {
        type: 'p',
        text:
          'A key safe or a smart lock is far easier than a handover, and it means a delayed guest ' +
          'never costs you a whole changeover. If the property is in a block with a concierge or a ' +
          'shared entrance, tell us how that works before the first visit rather than on the ' +
          'morning of it.',
      },
      {
        type: 'p',
        text:
          'Deep cleans still have their place in a let. Twice a year is about right for the jobs a ' +
          'changeover never has time for: inside the oven, limescale on the shower screen, mattress ' +
          'protectors washed, skirting boards and window tracks done properly, and the linen ' +
          'cupboard sorted out. Booking those into quiet weeks is the cheapest way to keep a ' +
          'property looking like its photographs into a second season.',
      },
    ],
    faqs: serviceFaqs('short-term-rental-cleaning'),
  },

  {
    slug: 'post-construction-cleaning',
    h1: `Post-Construction Cleaning in ${AREA_LONG}`,
    eyebrow: 'After the builders leave',
    title: titleFor('Builders Clean in Warwickshire'),
    description: describe('Builders cleans'),
    lead:
      'Fine dust out of the tracks, the fittings and the sockets, then out again once it has ' +
      'settled — the two-pass builders clean that turns a finished site into a home.',
    prose: [
      {
        type: 'p',
        text:
          'A builders clean is a dust job before it is a cleaning job. Plaster dust and sawdust are ' +
          'so fine that they behave more like smoke than like dirt: they get through closed doors, ' +
          'settle into every horizontal surface in the property including the ones nobody thinks ' +
          'of as surfaces, and then lift again the moment somebody walks through the room. That is ' +
          'why the work is structured the way it is.',
      },

      { type: 'h2', text: 'Why it takes two passes' },
      {
        type: 'p',
        text:
          'Clean a room once and it looks perfect. Come back four hours later and there is a fresh ' +
          'grey film on the windowsill, because the dust that was in the air when you started has ' +
          'been coming down the whole time. One thorough pass is therefore not a finished job — it ' +
          'is the first half of one.',
      },
      {
        type: 'p',
        text:
          'We work top down so that everything we disturb falls onto something we have not done ' +
          'yet, take the bulk out first, and then go back over the whole property at the end for ' +
          'the settled layer. The second pass is quicker than the first and it is the one that ' +
          'makes the difference between a property that looks clean in the moment and one that is ' +
          'still clean when you move in.',
      },

      { type: 'h2', text: 'What we clean once the trades are off site' },
      {
        type: 'p',
        text:
          'Everywhere the dust went, which is everywhere. The list below is the part people do not ' +
          'expect rather than the obvious floors and worktops.',
      },
      {
        type: 'ul',
        text: [
          'Window tracks, frames, hinges and trickle vents, where the grit collects',
          'The tops of doors, architraves, picture rails and every internal ledge',
          'Inside light fittings, downlight bezels, extractor grilles and smoke alarms',
          'Sockets, switches, thermostats and the recesses around them',
          'Radiators, including between the fins and behind the brackets',
          'Inside every new cupboard, drawer and wardrobe before anything goes in it',
          'Stickers, protective film and labels off appliances, glass and sanitaryware',
          'Bathrooms taken back: grout haze off tiles, sealant checked, new fittings polished',
          'Staircases, spindles and handrails, where dust sits on every edge',
          'Hard floors hoovered and then washed more than once, because the first wash lifts a haze',
        ],
      },

      { type: 'h2', text: 'Paint, adhesive and the residue nobody warns you about' },
      {
        type: 'p',
        text:
          'Dust is the volume of the job; residue is the fiddly half. Paint flecks on glass and on ' +
          'chrome, silicone smears on tiles, adhesive from protective tape on skirting boards and ' +
          'door frames, grout haze that only shows when the light is at the right angle, plaster ' +
          'splashes on a new stair spindle, the ghost of a sticker on a shower screen.',
      },
      {
        type: 'p',
        text:
          'Each one wants a different approach and most of them want a blade, a solvent or a bit of ' +
          'patience rather than more elbow. Getting it wrong scratches a finish that was installed ' +
          'last week, so where something is genuinely at risk — a soft-coated worktop, a lacquered ' +
          'tap, a painted surface that has not fully cured — we will tell you what we can see and ' +
          'leave it rather than gamble with your kitchen.',
      },

      { type: 'h2', text: 'When to book it, and when not to' },
      {
        type: 'p',
        text:
          'After the last trade is off site. Not before. If the decorator is coming back on Monday ' +
          'or the flooring is going down next week, we will be cleaning up after them twice and you ' +
          'will be paying for it twice. The one exception is a long project where a room has been ' +
          'signed off and sealed away from the rest of the work — that can be done on its own.',
      },
      {
        type: 'p',
        text:
          'Snagging is the other piece of the timing. It is usually easier to book the clean first ' +
          'and walk the snagging list afterwards, because dust hides exactly the sort of small ' +
          'defect a snagging list exists to catch: a chipped edge, a mark in a painted surface, a ' +
          'hinge that has been fitted proud. If the snagging works are going to be substantial, ' +
          'wait and do both at the end.',
      },

      { type: 'h2', text: 'One room, one extension, or the whole property' },
      {
        type: 'p',
        text:
          'A new kitchen, a loft conversion or a single-room refit is an entirely normal job for ' +
          'us. What surprises people is that the rest of the house usually needs a run through as ' +
          'well, because the dust travels down a hallway and up a staircase however carefully the ' +
          'doors were taped. We will quote the works area properly and the rest of the property ' +
          'lightly, which is almost always what is actually wanted.',
      },
      {
        type: 'p',
        text:
          'We cover new builds, extensions, refurbishments and renovation projects across ' +
          'Leamington Spa, Warwick, Kenilworth, Coventry and the villages between them. Tell us the ' +
          'size of the property, what stage the works are at and whether anyone is living in it, ' +
          'and you will get a fixed price before we start.',
      },

      { type: 'h2', text: 'What we need on site' },
      {
        type: 'p',
        text:
          'Water, power, light and access — a builders clean without running water is not a ' +
          'builders clean. It helps enormously if the rubbish, the offcuts and the packaging have ' +
          'gone before we arrive: we are not a waste removal firm, and a skip run is a different ' +
          'trade with a different licence. Tell us if the property is occupied, if there are ' +
          'materials being stored anywhere, and if anything is not to be touched, and we will plan ' +
          'the two passes around it.',
      },
    ],
    faqs: serviceFaqs('post-construction-cleaning'),
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
