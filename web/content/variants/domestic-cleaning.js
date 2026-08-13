/**
 * Domestic cleaning — the two eight-entry copy decks. Pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js`: the design-system package is framework-agnostic UI and must not
 * carry site copy, and a sibling directory reached through the same path alias
 * every other content module uses resolves at any route depth. Copy and string
 * handling live in `.js`; only `blocks.jsx` in the parent directory returns
 * elements.
 *
 * WHAT THIS FILE IS FOR. It is the town-INDEPENDENT half of every domestic
 * cleaning combo page. `A_VARIANTS` supplies the service-detail block and
 * `B_VARIANTS` supplies the how-the-job-runs block; the town's own character,
 * its locality paragraph, its heading and its lead come from elsewhere and never
 * from here. Sixteen passages compose across 58 towns, which is the whole
 * mechanism: the prose is SELECTED, never filled in.
 *
 * THE INDEX IS DATA, NOT PRESENTATION. Each town carries a pair of small
 * integers, and position 0 through 7 in each array below is what that pair
 * addresses. Reordering either array silently re-assigns the copy of every
 * published town at once — it is not a cosmetic edit and there is no gate that
 * will catch it, because every assertion downstream is about the passages rather
 * than about which town got which one. Add to the end, edit in place, never
 * shuffle.
 *
 * EIGHT SUBJECTS, NOT EIGHT REWORDINGS — THIS IS THE POINT OF THE FILE.
 * `services.js` already records the rule for its own six records; at 58 towns it
 * stops being a matter of taste. The similarity gate measures 5-gram overlap,
 * which is a LEXICAL test: eight paraphrases of one passage share almost no
 * 5-grams, so the gate reports green on precisely the failure it exists to
 * detect. Research measured this — a paraphrase deck sits near 0.05 on the
 * lexical metric and near 0.74 on TF-IDF cosine, against 0.07 to 0.12 for a deck
 * of genuinely different passages. Each entry below is therefore about a
 * DIFFERENT THING: a different room, a different stage of the job, a different
 * household, a different honest limit. If a future service needs a ninth angle,
 * find a new subject rather than re-angle an old one.
 *
 * THE TWO DECKS ARE ORTHOGONAL AND MUST STAY SO. `A_VARIANTS` is eight subjects
 * inside the house; `B_VARIANTS` is eight stages of how a visit is run. That is
 * what makes the grid a grid — the two axes are selected independently, so a
 * passage that drifts from one deck's territory into the other's collapses 64
 * combinations towards 8.
 *
 * DO NOT RESTATE THE SHARED PROCESS COPY. `process.js` renders on hundreds of
 * pages and is stripped from the counted corpus for exactly that reason. A
 * passage here that paraphrases it is words that do not count towards the depth
 * bar and content that does not differentiate one page from another.
 *
 * NO TOWN NAME AND NO COUNTY NAME ANYWHERE IN THIS FILE, INCLUDING THE COMMENTS.
 * The place names belong to the page's own heading, its lead, its locality
 * paragraph and its interlinks, which are the places a proper noun earns its
 * keep. The first prohibition on the composition layer is that no sentence may
 * be produced by dropping a town name into an otherwise fixed sentence, and the
 * cheapest way to make that structurally impossible is for the reusable half of
 * the corpus to contain no place names at all.
 *
 * NO ADDRESS, NO POSTCODE, NO POSTCODE DISTRICT, NO PHONE NUMBER, NO EMAIL AND
 * NO PRICES — D-04 / Lock 5, the same rule every sibling content module follows.
 * The canonical phone number lives once in `design-system/src/phone.js` and the
 * site quotes rather than price-lists, so no figure below is a price. This
 * comment does not instance any of those shapes either: a comment naming the
 * exact string a scanner greps for is itself an occurrence of it, and this repo
 * has now been bitten by that thirteen times.
 *
 * BLOCK SHAPE is the one fixed by `blocks.jsx` and restated at `services.js`
 * lines 51 to 59 — a paragraph, a section heading, a sub-heading, or a list
 * whose `text` field carries the ITEMS as an array of strings. There is no
 * top-level heading block type and there must never be one: Lock 1 allows
 * exactly one of those per page and it belongs to the Hero's `heading` prop. An
 * unrecognised `type` renders as NOTHING rather than throwing, so a typo drops a
 * paragraph in silence and the word-count lock is what catches it.
 *
 * EVERY ENTRY IN `A_VARIANTS` CARRIES A SECTION HEADING AND EVERY ENTRY IN
 * `B_VARIANTS` CARRIES A SUB-HEADING. That is the page outline, not a style
 * choice: one top-level heading from the Hero, a flat run of section headings,
 * and the deeper level only inside prose. The how-the-job-runs block renders
 * beneath the service-detail block's heading, so it sits one level down. None of
 * the section headings below is the display noun followed by the word "in",
 * because that phrase appears in exactly one heading per page and that heading
 * is the page's first.
 *
 * VOICE — plain UK English, contractions, concrete nouns. The US vocabulary and
 * the three dead call-to-action phrases are not quoted here, because the check
 * for this file is a case-insensitive grep for those very words and a comment
 * naming them would fail the gate the comment exists to explain. A literal
 * ampersand is correct where one is wanted: React serialises it and the lock's
 * extractor decodes entities before comparing, so writing the entity would
 * double-encode.
 */

/**
 * Block 3 — service detail. Eight subjects, indexed by a town's first variant
 * value, each a section heading, prose and one list.
 *
 * The subjects, in order: the kitchen; bathrooms and hard water; floors; dust;
 * bedrooms and laundry; households with pets and small children; the choice of
 * interval; and the work a routine visit deliberately leaves to a different job.
 * The last of those is deliberately the one that says no — a deck of eight
 * enthusiasms reads as marketing, and the passage that names its own limits is
 * the one a reader believes.
 */
export const A_VARIANTS = [
  // 0 — the kitchen: the every-visit core, and the rotation behind it.
  [
    { type: 'h2', text: 'The kitchen, every visit and by rotation' },
    {
      type: 'p',
      text:
        'The kitchen is where a regular visit earns its keep, and it is the one room we never let ' +
        'slip. Every time: the worktops come clear and are wiped properly rather than around ' +
        'whatever happens to be standing on them, the hob and the splashback are degreased, the ' +
        'sink and the taps are cleaned and then dried so they do not spot, the fronts of the units ' +
        'and every handle are washed, the outsides of the oven, the microwave and the fridge are ' +
        'done, and the bin is emptied, wiped and relined. The floor is deliberately left until ' +
        'last, because everything we bring down off a worktop lands on it.',
    },
    {
      type: 'p',
      text:
        'The rest of a kitchen goes on a rotation, and the rotation is written on your file rather ' +
        'than trusted to somebody remembering. That is the difference between a job that comes ' +
        'round and a job that gets meant. On a fortnightly round a couple of these land each ' +
        'visit, so nothing waits a year for attention, and if you would rather one of them came ' +
        'sooner then say so and it moves up the order. It also means the list survives your ' +
        'cleaner taking a fortnight off, which a rotation held in one head does not.',
    },
    {
      type: 'ul',
      text: [
        'Inside the microwave, including the roof of it and the turntable ring',
        'The kettle descaled, and the toaster emptied of its crumb tray',
        'A run of cupboard fronts taken back with a degreaser rather than a wipe',
        'The fridge door seal, where the black comes back if it is left alone',
        'The tops of the wall units, which go sticky rather than dusty',
        'Behind the bin, and inside the cupboard the bin lives in',
        'The grease filter out of the extractor and washed, not wiped over',
      ],
    },
  ],

  // 1 — bathrooms: limescale, the four things that go wrong, and product knowledge.
  [
    { type: 'h2', text: 'Bathrooms, and what a fortnight of hard water does' },
    {
      type: 'p',
      text:
        'Bathrooms lose ground faster than any other room, and in a hard water area what they lose ' +
        'it to is limescale rather than dirt. A fortnight of showers leaves a grey bloom on the ' +
        'glass, a line inside the pan at the water mark and a crust round the base of the taps, ' +
        'and none of that shifts with a spray and a wipe. It wants the right product, long enough ' +
        'on the surface to do something, and then agitating. So the descaler goes on early and ' +
        'sits while the rest of the room is worked, which is why a bathroom done properly is ' +
        'usually the last room finished rather than the first. The things that go wrong between ' +
        'visits are always the same four: the sealant where the bath meets the tiles darkens in a ' +
        'room that never dries out, the extractor grille furs over, the shower waste collects ' +
        'hair, and the mirror clouds from spray rather than from steam. Each is two minutes if ' +
        'somebody looks regularly and an afternoon if nobody has for a year.',
    },
    {
      type: 'ul',
      text: [
        'Limescale off the screen, the tiles, the taps and the shower head',
        'The pan done inside, behind, underneath and around its fixings',
        'Bath, basin and overflow finished dry rather than left to spot',
        'Sealant and grout checked, and mould treated where it will still lift',
        'The extractor grille, the light pull and the back of the door',
        'Mirrors and glass taken to the point where an angle shows nothing',
      ],
    },
    {
      type: 'p',
      text:
        'Having your own cleaner is worth more in this room than in any other, and not for ' +
        'sentimental reasons. They know the shower tray is resin and will not take a cream ' +
        'cleaner. They know the second bathroom gets used at weekends only and does not need the ' +
        'same half of an hour. They know which of the bottles under your sink is the one you asked ' +
        'us to use, and which surface in the house has already been damaged once by the wrong ' +
        'thing. None of that survives a different face every fortnight.',
    },
  ],

  // 2 — floors: technique, edges, and the hard boundary of what a machine can do.
  [
    { type: 'h2', text: 'Floors, and the part of the job that is not hoovering' },
    {
      type: 'p',
      text:
        'Most people picture hoovering when they picture cleaning, and it is perhaps a fifth of a ' +
        'visit. It is also the part most often done badly, because a machine pushed quickly over ' +
        'carpet achieves very little — pile needs time to release what is down in it, which means ' +
        'slow passes, and two of them, worked across the lay as well as along it. On a hard floor ' +
        'the machine goes over first and the mop follows, never the other way round: a mop pushed ' +
        'over grit is sandpaper, and it takes the finish off a floor a little at a time. Edges are ' +
        'where the work is actually judged. The line along the skirting boards, the back edge of ' +
        'each stair tread, the corners of a landing and the strip under a kitchen plinth all want ' +
        'the narrow tool rather than the wide head, and every one of them is the first thing to go ' +
        'when a visit runs late. They are on the list for exactly that reason.',
    },
    {
      type: 'ul',
      text: [
        'Carpet worked slowly, in two directions, with the edges cut in by hand',
        'Hard floors gone over dry first, then mopped, water changed when it turns',
        'Laminate and engineered boards damp-mopped, never wetted at the joins',
        'Stairs tread by tread, including the back lip and round the spindles',
        'Under and behind whatever two hands can shift without risking it',
        'Thresholds, doorways and the strip of hall inside the back door',
      ],
    },
    {
      type: 'p',
      text:
        'What a machine cannot do is worth saying plainly. It will not lift a stain. It will not ' +
        'bring back pile that has been flattened under a table leg for six years. It will not ' +
        'clean the grout between floor tiles, which is a brush and somebody on their knees, and on ' +
        'a routine visit that comes round by rotation rather than every time. Washing a carpet is ' +
        'a different trade again, with equipment and drying time that a routine visit does not ' +
        'bring with it.',
    },
  ],

  // 3 — dust: where it actually lives, the direction rule, and the rotation.
  [
    { type: 'h2', text: 'Dust does not settle evenly, so the dusting cannot either' },
    {
      type: 'p',
      text:
        'Dust collects on horizontal ledges, and the ledges that matter are mostly above the ' +
        'height at which people look. The top edge of a door and the frame above it. The picture ' +
        'rail and the curtain pole. The upper face of the skirting boards. The fins of a radiator. ' +
        'The back of a television and the cable dropping behind it. The top edge of a row of ' +
        'books. Something flicked over any of those merely moves the dust onto the floor and then, ' +
        'a day later, back up again — so we lift and wipe with something slightly damp instead, ' +
        'and the dust leaves the room in the cloth. The other rule is direction. High before low, ' +
        'and all of the dusting before any of the floor: dust a room after hoovering it and you ' +
        'have made the same job again for next time.',
    },
    {
      type: 'ul',
      text: [
        'Door tops, frames, architraves and the pull cord on a blind',
        'Skirting boards wiped rather than flicked, and washed by rotation',
        'Radiators between the fins and behind, before the heating goes on',
        'Blinds slat by slat, a room at a time, so the house comes round',
        'Switches, sockets, thermostats and the handle on both faces of a door',
        'Shades, shelf tops, frames and the top edge of a hanging picture',
        'Sills, the track beneath them, and the inner face of the frame',
      ],
    },
    {
      type: 'p',
      text:
        'The high ledges sit on the rotation rather than on the every-visit list, because on a ' +
        'fortnightly round they genuinely do not need it more often and those minutes are worth ' +
        'more spent elsewhere. What matters is that the rotation is recorded. The tops of the ' +
        'doors get done because they came round, not because somebody happened to look up on the ' +
        'right afternoon, and that is the only version of the arrangement that survives a cleaner ' +
        'being off for a week.',
    },
  ],

  // 4 — bedrooms: the beds, and the boundaries around somebody's private room.
  [
    { type: 'h2', text: "Beds, laundry, and the edges of somebody else's room" },
    {
      type: 'p',
      text:
        'A bedroom is where being helpful and being intrusive sit closest together, so the ' +
        'boundaries get set at the start and then kept. Beds are made every visit. Leave clean ' +
        'linen out on the bed and we will strip it and remake it, with the used set going wherever ' +
        'you have told us it goes. We work around what is on the surfaces rather than clearing ' +
        'them, so a bedside table is wiped in two halves and the book, the glass and the charger ' +
        'go back exactly where they were. We do not open drawers or wardrobes. We do not move ' +
        'post, papers or anything that looks like a document. We do not put clothes away, because ' +
        'guessing where a jumper lives is how a household loses a jumper. If a room is better left ' +
        'shut, tell us once and it stays shut, with no note on the day and no reason needed.',
    },
    {
      type: 'ul',
      text: [
        'Beds made, or stripped and remade wherever the linen is left out',
        'Bedside tables, headboards, lamp bases and the mirror',
        'Under the bed with the narrow tool wherever the frame lets us in',
        'Sills, skirtings and the top of the wardrobe, by rotation',
        'Bins emptied and relined, and glasses carried down to the kitchen',
        'Doors, handles and switches, which get touched more than anything else',
      ],
    },
    {
      type: 'p',
      text:
        'Laundry is not what we are, and pretending otherwise ends badly for everybody. We will ' +
        'start or hang out a load that has been left ready if you ask us to, and that is where it ' +
        'stops — no sorting, no ironing, no folding a whole household of washing into piles ' +
        'nobody can then find anything in. It is a real limit rather than a reluctance. An hour ' +
        'built around a tumble dryer is an hour that did not clean a bathroom, and the bathroom is ' +
        'what you are paying for.',
    },
  ],

  // 5 — houses in genuine use: animals, small children, and where cleaning stops.
  [
    { type: 'h2', text: 'Houses with a dog in them, and houses with a toddler' },
    {
      type: 'p',
      text:
        'A house in genuine use does not want a different clean so much as a differently weighted ' +
        'one. Hair is the clearest case. It is not dust and it does not behave like dust, because ' +
        'it twists into pile and round a brush bar and comes out only under a slow pass or a ' +
        'rubber-edged tool, and it gathers where dirt does not: along the bottom rail of a sofa, ' +
        'on the arm at shoulder height, in the folds of a throw, in a drift behind whichever door ' +
        'stands open. With small children the whole map moves down the wall. Sticky is at knee ' +
        'height rather than hand height, so the marks are on the lower half of a door, on the ' +
        'gloss of a unit and on the frame of a stair gate. Crumbs go down the side of a cushion ' +
        'rather than onto a plate. And a floor inside the back door after a wet week does more to ' +
        'make a house feel unclean than anything upstairs.',
    },
    {
      type: 'ul',
      text: [
        'Hair lifted out of pile and upholstery rather than passed over',
        'The ground round a bowl, a basket or a tray, done last with its own cloth',
        'Prints off hard floors, with the mat lifted rather than swept around',
        'Low paintwork, gates, door edges and switches at child height',
        'Sofas taken apart as far as the cushions come, and the frame done',
        'Everything we bring kept off the floor, out of reach, and packed away',
      ],
    },
    {
      type: 'p',
      text:
        'The honest limits matter more in these houses than anywhere else, so here they are. We ' +
        'will not scrub paintwork hard enough to take the emulsion with it. A soft toy is a wash ' +
        'rather than a wipe. A smell in a carpet after an accident wants extraction and not a ' +
        'spray, and a dark mark on a pale carpet may simply be part of the carpet now. Where ' +
        'something has gone past cleaning we will say what it would actually take to put right, ' +
        'including the times when the honest answer is a decorator rather than us.',
    },
  ],

  // 6 — the interval: what changes at each, and how to work out which you need.
  [
    { type: 'h2', text: 'Weekly, fortnightly or monthly: one list, three loads' },
    {
      type: 'p',
      text:
        'The list barely changes with the interval. What changes is how much is sitting on it when ' +
        'we arrive, and that decides how much of the visit is left for anything beyond the core. ' +
        'Weekly, almost nothing has accumulated, the kitchen and the bathrooms take less out of ' +
        'the visit than they would after a fortnight, and the spare capacity goes onto the ' +
        'rotation, so the blinds and the insides of things come round quickly. Fortnightly is ' +
        'where most households settle, and two weeks is roughly the point at which a bathroom in a ' +
        'hard water area stops holding its ground. Monthly works if you keep on top of the ' +
        'day-to-day yourself, but the visit is a bigger job than a fortnightly one and the ' +
        'rotation stretches out behind it, so the occasional extras are worth booking on purpose ' +
        'rather than waiting for them to arrive.',
    },
    {
      type: 'p',
      text:
        'Working out which one a house needs turns out to have less to do with its size than with ' +
        'what happens inside it. A tidy four-bedroom house with two adults in it out at work all ' +
        'week can be perfectly served monthly; a two-bedroom terrace with a dog, a toddler and a ' +
        'tiled hallway cannot. These are the questions we ask, and they are worth asking yourself ' +
        'before you get in touch, because the answers set the length of the visit as well as how ' +
        'often it comes.',
    },
    {
      type: 'ul',
      text: [
        'How many people live here, and how many are at home in the daytime',
        'Animals, and whether they come back in through the kitchen',
        'How much hard floor there is, and how much of it meets an outside door',
        'How many bathrooms, and whether a shower runs in each of them daily',
        'Whether anybody here has an allergy or reacts to a fragrance',
        'Whether you want the occasional jobs built in or booked separately',
      ],
    },
  ],

  // 7 — the boundary: what a routine visit deliberately leaves to another job.
  [
    { type: 'h2', text: 'The work a routine visit deliberately leaves alone' },
    {
      type: 'p',
      text:
        'A routine clean has a fixed number of hours in it and every one of them is already ' +
        'spoken for. That is precisely why it works — the same rooms get the same attention on ' +
        'the same day and nothing is given the chance to build. It is also why quietly folding a ' +
        'large one-off job into a routine visit damages both of them. Put an oven strip into a ' +
        'visit and the hours have to come from somewhere, and where they come from is the ' +
        'bathrooms and the floors, which is exactly the ground the arrangement exists to hold. So ' +
        'there is a short list of work that belongs to a different job, and we would rather name ' +
        'it than let you find it out. None of it is a refusal: each one is either its own booking ' +
        'or a line of extra time agreed beforehand.',
    },
    {
      type: 'ul',
      text: [
        'Stripping an oven that has been left, which is hours entirely of its own',
        'Taking a furred screen and grey grout back to something like new',
        'Emptying and washing out every cupboard and drawer in a kitchen',
        'Washing carpet or upholstery, which needs equipment and drying time',
        'The outsides of upstairs windows, and anything that wants a ladder',
        'Clearing out rubbish, or running a load of anything away',
        'The repeated passes a property wants once the trades have just left',
      ],
    },
    {
      type: 'p',
      text:
        'Two more things sit outside the arrangement for a different reason. Mould that is a damp ' +
        'fault is not a cleaning problem, and scrubbing it only conceals the thing you want ' +
        'somebody qualified to look at, so we will point it out and then leave it where it is. And ' +
        'we will not move a wardrobe, a piano or a loaded bookcase between two people, because the ' +
        'risk there is to your floor and to a pair of backs rather than to the standard of the ' +
        'clean.',
    },
  ],
];

/**
 * Block 4 — how the job runs. Eight stages, indexed by a town's second variant
 * value, each a sub-heading and two or three paragraphs and no list.
 *
 * The stages, in order: the first visit; who arrives; the order the house is
 * worked in; products and kit; access; time; the check at the end; and what
 * happens afterwards. They are chosen to be ORTHOGONAL to the deck above — that
 * one is about the house, this one is about the visit — which is what lets the
 * two be selected independently without a pair of pages ever sharing both.
 *
 * These read as one continuous account of a working arrangement rather than as
 * eight sales paragraphs, and that is intentional: the passage a reader trusts
 * is the one that describes a procedure they can check us against. Nothing here
 * restates the three shared process steps, which render on every page carrying
 * that band and are stripped out of the counted corpus for exactly that reason.
 *
 * No list block in this deck. The service-detail block above already carries
 * one, both blocks land inside the same prose container, and two bulleted runs
 * in a row is where a page starts reading like a specification.
 */
export const B_VARIANTS = [
  // 0 — the first visit and the walk round.
  [
    { type: 'h3', text: 'The first visit, and the walk round that sets up the rest' },
    {
      type: 'p',
      text:
        'The first visit does not begin with a bucket. It begins with a walk round the house with ' +
        'you, room by room, and it is worth the quarter of an hour it takes, because nearly every ' +
        'complaint anybody ever has about a cleaner comes from something that was never actually ' +
        'said out loud. What we are trying to establish is what you would notice — which is not ' +
        'the same thing as what is dirtiest, and not the same thing as what we would have started ' +
        'with either.',
    },
    {
      type: 'p',
      text:
        'So we ask. Which rooms carry the most weight and which can have less spent on them. ' +
        'Whether there is a room to be left alone entirely. Whether anyone here reacts to a ' +
        'perfume. Which surfaces are delicate, which have already been damaged once, and which ' +
        'have a product of yours we should be using. Where the rubbish goes and on which morning. ' +
        'Whether somebody works at home, and on which days a door has to stay shut. Where an ' +
        'animal will be, and how it behaves when a machine starts up. How we get in, and who else ' +
        'holds a key.',
    },
    {
      type: 'p',
      text:
        "All of it goes onto your file rather than staying in one cleaner's memory, and that is " +
        'the part that does the work. A written note is what makes cover possible, what keeps the ' +
        'rotation in the right order, and what stops you having the same conversation over again in ' +
        'six months with a new face. Anything we agreed that turns out to be wrong takes one ' +
        'message to change, and then it stays changed.',
    },
  ],

  // 1 — who arrives, how many, and what continuity actually buys.
  [
    { type: 'h3', text: 'Who comes through the door, and how many of them' },
    {
      type: 'p',
      text:
        'On a routine round it is usually one cleaner, and two only where a house is large enough ' +
        'or a window short enough that one person could not finish it properly. Everyone who works ' +
        'for us is checked before their first job and we carry insurance for the work we do inside ' +
        'your home. You are told the name of whoever is coming before they arrive rather than on ' +
        'the doorstep.',
    },
    {
      type: 'p',
      text:
        'We hold a cleaner to a round rather than to a day of the week, and that is the part of the ' +
        'arrangement actually worth paying for. Somebody who has been to your house eight times ' +
        'does not need telling again that the side gate sticks, that the alarm panel is behind the ' +
        'coats, that the baby goes down after lunch, or that the glasses on the second shelf are ' +
        'not to be moved. Most households have never had to say any of that out loud, and a ' +
        'stranger begins from zero every single time.',
    },
    {
      type: 'p',
      text:
        'When yours is ill or on holiday somebody covers, and you hear who beforehand — an ' +
        "unfamiliar person letting themselves in with your key is nobody's idea of a pleasant " +
        'surprise. Whoever covers works from your file rather than from a general instinct about ' +
        'how houses go. And if it is simply not working with the person we have sent, say so: they ' +
        'will be moved, and you will not be asked to justify why.',
    },
  ],

  // 2 — the sequence, and why a house looks worse halfway through.
  [
    { type: 'h3', text: 'The order a house gets worked in, which is not the obvious one' },
    {
      type: 'p',
      text:
        'Left to instinct, most people clean a house the way they walk through it: front door, ' +
        'hall, kitchen, and upstairs last if there is anything left. We do close to the opposite, ' +
        'and it is worth knowing why, because if you happen to be in the house it will look for a ' +
        'good while as though nothing whatsoever is being achieved.',
    },
    {
      type: 'p',
      text:
        'The first thing that happens upstairs is that the bathrooms get their products put on and ' +
        'then get left. Chemistry needs time on a surface, and time spent standing over a shower ' +
        'screen waiting for it is time paid for twice, so while it works the bedrooms get done. ' +
        'Then it is back to the bathrooms, which is the point at which they are actually scrubbed. ' +
        'The kitchen runs on the same trick from the other end of the visit: the hob and the oven ' +
        'front are wetted early and finished once the rest of that room is behind us.',
    },
    {
      type: 'p',
      text:
        'After that the whole thing runs downhill and towards the exit. A room is worked from its ' +
        'far corner back to its threshold so that nobody has to walk over what has just been done. ' +
        'Upstairs comes before down. The stairs happen on the way down them, not on the way up. ' +
        'Mopping is always the last thing in a room and the hall floor is the last thing in the ' +
        'house, immediately before the door closes. Which is why the midpoint of a visit is the ' +
        'worst the place will look all day.',
    },
  ],

  // 3 — the kit, the cloth discipline, and the two-way list of what is not used.
  [
    { type: 'h3', text: 'What we bring, what of yours we will use, and what we will not' },
    {
      type: 'p',
      text:
        'Everything arrives with the cleaner, the machine included, and that is not a favour. A ' +
        'household machine is usually the wrong tool for the job, frequently half full, and asking ' +
        'to borrow one is a small resentment waiting to happen. The kit is a machine with its ' +
        'narrow and brush heads, a flat mop with spares, a bucket, a graded set of cloths, and a ' +
        'short enough list of products that a cleaner can carry all of it in one trip.',
    },
    {
      type: 'p',
      text:
        'Cloths are the thing nobody thinks about and the thing that decides whether cleaning is ' +
        'happening at all. They are separated by where they are permitted to go, so that nothing ' +
        'which has been near a lavatory can find its way onto a worktop, and they go away with the ' +
        'cleaner to be laundered rather than being rinsed through in your sink and left over your ' +
        'tap. Mop heads work the same way. A cloth that has been used all morning has stopped ' +
        'cleaning and started distributing.',
    },
    {
      type: 'p',
      text:
        'If you would rather we used something of yours, leave it out with a note and that is what ' +
        'gets used: an unscented range because somebody here reacts to perfume, a particular ' +
        'finish for a stone worktop or an oiled board, or nothing at all on something that has ' +
        'suffered once already. There is a short refusal list on our side as well. No bleach on ' +
        'coloured grout. Nothing abrasive on an acrylic bath or a painted door. No descaler on ' +
        'plating that has begun to lift. Never two products mixed in one bucket. Say what is ' +
        'delicate before a visit rather than after one.',
    },
  ],

  // 4 — access, the changes that cost a visit, and what we will not take on.
  [
    { type: 'h3', text: 'Getting in, getting out, and who is holding a key' },
    {
      type: 'p',
      text:
        'Most of our customers are somewhere else when we come, so most of the time we let ' +
        'ourselves in. A key is held on a numbered tag carrying nothing that says where it fits, ' +
        'we know at any point who has it, and it comes back to you the day an arrangement ends. A ' +
        'key safe or a door code does the same job and saves everybody a handover.',
    },
    {
      type: 'p',
      text:
        'The one thing that reliably costs a whole visit is a change nobody mentioned. A lock done ' +
        'at the weekend. An alarm code updated. A side gate bolted from the inside. A key safe ' +
        'whose battery has gone. Any of those and a cleaner is standing outside with a car full of ' +
        'kit and nowhere to be. A message the evening before is enough to prevent all of it. If we ' +
        'genuinely cannot get in we will ring you and wait a while, but there is another household ' +
        'expecting us after yours, and at some point we have to go to them.',
    },
    {
      type: 'p',
      text:
        'If you are in, that is entirely fine, and it helps to know which room you will be sitting ' +
        'in so the noisy part happens elsewhere first. What we will not do is take charge of the ' +
        'house while we are in it. We do not sign for parcels. We do not let anybody else through ' +
        'the door — not a meter reader, not a courier, not a tradesman — unless you have told us ' +
        'beforehand to expect them and told us who they are. It is your house, and we are in no ' +
        'position to judge who ought to be inside it.',
    },
  ],

  // 5 — the length of the slot, what gives when it is not enough, and how that is said.
  [
    { type: 'h3', text: 'How long a visit runs, and what gives when a house needs more' },
    {
      type: 'p',
      text:
        'The length of a visit is set when we quote for it, out of the room count, the bathrooms, ' +
        'how much hard floor there is and whichever extras you want built in. It is a figure we ' +
        'would rather get right than get agreed to. Something that overruns on every single ' +
        'occasion is not a slow cleaner; it is a slot that was measured wrongly at the beginning, ' +
        'and the person carrying that mistake is whoever is still in your kitchen at half past ' +
        'four.',
    },
    {
      type: 'p',
      text:
        'When there is more in a house on a given day than the slot holds, what gives has already ' +
        'been decided rather than being worked out on the spot. The core comes first, so a kitchen ' +
        'and a bathroom are never what slips. Then the rotation jobs come off from the bottom of ' +
        'the order and go to the front of the next visit. So an overrunning day costs you the tops ' +
        'of the doors rather than a properly cleaned sink, and nobody is making that call under ' +
        'pressure with a coat half on.',
    },
    {
      type: 'p',
      text:
        'If the slot turns out to be wrong three visits in a row, your cleaner tells us and we ' +
        'tell you, with the reason and with what it would take in extra time to put right. Then ' +
        'you decide. Nobody adds a half hour on the day and puts it on the bill afterwards, and ' +
        'nobody quietly does two thirds of a job for a year in the hope that the shortfall goes ' +
        'unnoticed. Both are easier than the conversation, and both finish in the same place.',
    },
  ],

  // 6 — the end-of-visit check, and the definition of done.
  [
    { type: 'h3', text: 'The check at the end, and what "done" means without a checklist' },
    {
      type: 'p',
      text:
        'Before the door shuts, the cleaner walks the house a second time, in the order it was ' +
        'cleaned, and looks at each room from its doorway rather than from wherever they were ' +
        'working. That sounds like a fine distinction and it is very nearly the whole trick: ' +
        'almost every patch that gets missed is plainly visible from where you would stand and ' +
        'invisible from where somebody was kneeling. Glass and metal get looked at from an angle, ' +
        'because an angle is the only way to tell whether they were dried or merely wiped.',
    },
    {
      type: 'p',
      text:
        'The rest of it is undramatic. Nothing of ours left behind anywhere. Liners in the bins. ' +
        'Seats down, curtains where they were, windows as they were found. No machine tracks ' +
        'across a rug. Lights off, internal doors as they started the day, the front door locked ' +
        'and the alarm set where that is the arrangement. It costs a few minutes and it is the ' +
        'difference between a visit that ended and a visit that merely stopped.',
    },
    {
      type: 'p',
      text:
        'As for what counts as finished: there is no card hanging on the back of a door to be ' +
        'ticked, and that is deliberate, because a ticked list is something that can be entirely ' +
        'true while a house is still wrong. Finished means the rooms we agreed on, at the standard ' +
        'the first visit set, and anything that could not be reached or could not be completed is ' +
        'written down and told to you instead of being left for you to come across by yourself.',
    },
  ],

  // 7 — afterwards: remedy, breakage, and changing a standing arrangement.
  [
    { type: 'h3', text: 'Afterwards: putting things right, breakages, and changes' },
    {
      type: 'p',
      text:
        'If something is not right, tell us, and a photograph of the spot is worth more than a ' +
        'paragraph describing it. We would far rather hear within a day or two of the visit, while ' +
        'it is still obvious which visit it belongs to and while the cleaner can still picture the ' +
        'room. You will not be asked to build a case for it, and you will not be asked to ' +
        'demonstrate that anything was ever dirty in the first place.',
    },
    {
      type: 'p',
      text:
        'Things do get knocked over in houses that people live in, and we carry insurance for the ' +
        'work we do in yours. The rule on our side has less to do with liability than with ' +
        'telling: you hear about it from us before you find it for yourself. A note, a message, a ' +
        'call that afternoon. The breakages that turn into arguments are hardly ever the expensive ' +
        'ones — they are the ones nobody mentioned. So if there is something in the house that ' +
        'could not be replaced at any price, point at it and it will simply not be touched.',
    },
    {
      type: 'p',
      text:
        'Changing a standing arrangement takes a message. Skip a visit while you are away and it ' +
        'is not charged. Move a day, run weekly through a wet winter and go back in the summer, ' +
        'add a room, drop a room, or stop the whole thing. The single thing we ask for is as much ' +
        "notice as you can manage, because a gap in a cleaner's week is somebody's wages rather " +
        'than an inconvenience. There is nothing to unpick at the end of it.',
    },
  ],
];
