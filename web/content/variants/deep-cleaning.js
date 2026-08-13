/**
 * Deep cleaning — the two eight-entry copy decks. Pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons stated at the top of
 * `site.js` and repeated by every sibling here: the design-system package is
 * framework-agnostic UI and must not carry site copy, and a content directory
 * reached through the usual path alias resolves at any route depth. Copy and
 * string handling live in `.js`; only `blocks.jsx` in the parent directory
 * returns elements.
 *
 * WHAT THIS FILE IS FOR. It is the town-INDEPENDENT half of every deep-cleaning
 * combo page. `A_VARIANTS` supplies the service-detail block and `B_VARIANTS`
 * supplies the how-the-job-runs block. The town's heading, its lead, its own
 * character and its locality paragraph come from elsewhere and never from here.
 * Sixteen passages compose across the whole published set, which is the entire
 * mechanism: the prose is SELECTED, never filled in.
 *
 * THE INDEX IS DATA, NOT PRESENTATION. Each town carries a pair of small
 * integers and position 0 through 7 in each array below is what that pair
 * addresses. Reordering either array silently re-assigns the copy of every
 * published town at once. It is not a cosmetic edit and no gate downstream will
 * catch it, because every assertion is about the passages rather than about
 * which town received which one. Add to the end, edit in place, never shuffle.
 *
 * EIGHT SUBJECTS, NOT EIGHT REWORDINGS — THIS IS THE POINT OF THE FILE. The
 * similarity gate measures 5-gram overlap, which is a LEXICAL test: eight
 * paraphrases of one passage share almost no 5-grams, so the gate reports green
 * on precisely the failure it exists to detect. Research measured it — a
 * paraphrase deck sits near 0.05 on the lexical metric and near 0.74 on TF-IDF
 * cosine, against roughly 0.07 to 0.12 for a deck of genuinely different
 * passages. Every entry below is therefore about a DIFFERENT THING: a different
 * surface, a different chemistry, a different stage of a working day, a
 * different honest limit. A ninth angle means finding a new subject, not
 * re-angling an old one.
 *
 * THE PARENT SERVICE PAGE IS NOT TO BE RESTATED. `services.js` already ships a
 * long deep-cleaning record and it is the region-wide parent of these pages.
 * These sixteen passages are the angles a combo page can take that the parent
 * does not — so where the parent names a job in one line, this file explains the
 * material, the method and the point at which the method stops working. Its
 * examples are deliberately not reused: the sibling deck for the routine service
 * had two passages drafted with the parent's own examples in them, which would
 * have shipped as an invisible near-duplicate between a service page and dozens
 * of combo pages, and nothing in either file's gates looks in that direction.
 * Measure against the parent as well as against the siblings.
 *
 * THE TWO DECKS ARE ORTHOGONAL AND MUST STAY SO. `A_VARIANTS` is eight things a
 * deep clean is done TO; `B_VARIANTS` is eight stages of HOW the day is run.
 * That is what makes the grid a grid — the two axes are selected independently,
 * so a passage that wanders from one deck's territory into the other's collapses
 * sixty-four combinations back towards eight.
 *
 * DO NOT RESTATE THE SHARED PROCESS COPY. `process.js` renders on hundreds of
 * pages and is stripped out of the counted corpus for exactly that reason. A
 * passage here that paraphrases it is words that do not count towards the depth
 * bar and content that differentiates nothing.
 *
 * NO TOWN NAME AND NO COUNTY NAME ANYWHERE IN THIS FILE, INCLUDING THE COMMENTS.
 * Place names belong to the page's heading, its lead, its locality paragraph and
 * its interlinks, which are the places a proper noun earns its keep. The first
 * prohibition on the composition layer is that no sentence may be produced by
 * dropping a town name into an otherwise fixed sentence, and the cheapest way to
 * make that structurally impossible is for the reusable half of the corpus to
 * contain no place names at all. Hard water is described as hard water here, and
 * the page's own blocks are where it becomes local.
 *
 * NO ADDRESS, NO POSTCODE, NO POSTCODE DISTRICT, NO PHONE NUMBER, NO EMAIL AND
 * NO PRICES — D-04 / Lock 5, the rule every sibling content module follows. The
 * canonical number lives once in the design system and the site quotes rather
 * than price-lists, so no figure below is a price. This comment does not
 * instance any of those shapes either: a comment naming the exact string a
 * scanner greps for is itself an occurrence of it, and this repo has now been
 * bitten by that fourteen times.
 *
 * BLOCK SHAPE is the one fixed by `blocks.jsx` and restated at `services.js`
 * lines 51 to 59 — a paragraph, a section heading, a sub-heading, or a list
 * whose `text` field carries the ITEMS as an array of strings. There is no
 * top-level heading block type and there must never be one: Lock 1 allows
 * exactly one of those per page and it belongs to the Hero's `heading` prop. An
 * unrecognised `type` renders as NOTHING rather than throwing, so a typo drops a
 * paragraph in silence and the word-count lock is what catches it. The literals
 * are in `blocks.jsx`; they are deliberately not written out here, because the
 * greps that police this file count the heading blocks in it and a comment
 * quoting one is another occurrence.
 *
 * EVERY ENTRY IN `A_VARIANTS` CARRIES A SECTION HEADING AND EVERY ENTRY IN
 * `B_VARIANTS` CARRIES A SUB-HEADING, one level down. That is the page outline
 * rather than a style choice: one top-level heading from the Hero, a flat run of
 * section headings, and the deeper level only inside prose. The how-the-job-runs
 * block renders beneath the service-detail block's heading. No section heading
 * below opens with the display noun followed by the word "in", because that
 * phrase belongs to exactly one heading per page and that heading is the first.
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
 * The subjects, in order: the oven and the cooking end of the kitchen;
 * limescale; the cupboards and the high flat surfaces; washed paintwork;
 * windows on the inside; the bathroom past its limescale; hard floors; and what
 * a deep clean will not fix.
 *
 * The last of those is deliberately the one that says no. A deck of eight
 * enthusiasms reads as marketing, and the passage that names its own limits is
 * the one a reader believes — which matters more on this service than on any
 * other, because a deep clean is the job people most often expect to undo years
 * of wear.
 */
export const A_VARIANTS = [
  // 0 — the oven, the hob and the hood: chemistry and time rather than effort.
  [
    { type: 'h2', text: 'The oven, the hob and the hood above it' },
    {
      type: 'p',
      text:
        'Most people who ring about a deep clean are really ringing about the oven. What is in ' +
        'there is not dirt in any ordinary sense: it is fat and sugar cooked over and over until it ' +
        'has set into a hard brown lacquer, and no amount of effort with a cloth will shift it. What ' +
        'shifts it is an alkaline degreaser and time, and the time is not optional. So the oven ' +
        'comes apart before anything else in the house is touched — shelves, runners, trays, the fan ' +
        'cover and the base plate where it lifts, all into a tray of hot degreaser to soak while the ' +
        'cavity itself is worked by hand.',
    },
    {
      type: 'ul',
      text: [
        'Shelves, runners and trays out and soaked rather than wiped in place',
        'The cavity done in stages, with the product left to work between them',
        'Inner door glass brought back with a paste and a plastic blade',
        'The element wiped around and kept dry, never soaked or scrubbed',
        'Gas burner caps, crowns, pan supports and the spill trays under them',
        'A ceramic top scraped at a shallow angle and then creamed, never with a green pad',
        'The metal mesh filter out of the hood and soaked until it is silver again',
      ],
    },
    {
      type: 'p',
      text:
        'The hood is two jobs and usually only the filter has ever been done. The other is the ' +
        'canopy, where a film of warm fat settles on the underside, on the light lens and on the ' +
        'doors of the cupboards either side of the hob, which are reliably the greasiest joinery in ' +
        'the room. Three limits, said now rather than at five in the afternoon. A carbon filter is a ' +
        'part to be replaced rather than a thing to be cleaned, so we tell you it is due. A ' +
        'self-cleaning liner at the back of a cavity must never have a chemical put on it, so it is ' +
        'left alone and we say which panel it is. And we will not lift a hob out of a worktop or ' +
        'unbolt a hood off the wall to reach behind it.',
    },
  ],

  // 1 — limescale: what it is, what moves it, and where it has stopped being dirt.
  [
    { type: 'h2', text: 'Limescale, and the difference between scale and a stain' },
    {
      type: 'p',
      text:
        'Scale is what hard water leaves behind when it dries, so it forms wherever water stands or ' +
        'runs and is then allowed to go. It is chalk rather than grime, which explains why the two ' +
        'things in most cupboards do nothing to it: bleach is not an acid, and a general spray gets ' +
        'wiped off long before it has done anything at all. Scale wants a citric paste or an acid ' +
        'gel, kept wet, given real time, re-wetted rather than left to dry on the surface, and then ' +
        'worked with nylon and never with wire. Then it wants rinsing off properly, because an acid ' +
        'left sitting on chrome or on grout does harm of its own.',
    },
    {
      type: 'ul',
      text: [
        'The underside of a tap spout, and the collar where it meets the basin',
        'The aerator unscrewed out of the spout and soaked on its own',
        'A shower head done nozzle by nozzle, with the rubber ones rubbed clear',
        'The rim jets under the lip of the pan, which is where the flush has gone',
        'The bottom seal and the runner of a shower door, then the hinge',
        'The riser rail, its bracket, and the wall plate behind it',
        'Plug flanges, overflow slots and the waste ring in a shower tray',
      ],
    },
    {
      type: 'p',
      text:
        'There is a point past which scale stops being something on a surface and becomes the ' +
        'surface, and this is the one place on the job where that happens routinely. Water left on ' +
        'glass for years etches it, so a screen can come out perfectly clean and still look cloudy ' +
        'from an angle: what is left is texture rather than deposit, and no product reaches it. ' +
        'Chrome goes the same way once the plating has started to pit. A kettle, a shower head and a ' +
        'set of taps will nearly always come back; a screen that has never once been dried may not. ' +
        'We will say which one yours is when we look at it, and we will tell you the only thing that ' +
        'holds the result afterwards, which is a squeegee and thirty seconds a day rather than ' +
        'anything in a bottle.',
    },
  ],

  // 2 — the joinery and the high flat surfaces: inside, on top of, and behind.
  [
    { type: 'h2', text: 'Inside the cupboards, on top of them, and behind' },
    {
      type: 'p',
      text:
        'The flat top of a run of wall units is the most reliably filthy surface in a house, and it ' +
        'is not dust. Warm air off a hob carries fat upwards, it meets the dust already up there, ' +
        'and the two set into something closer to varnish than to grime. A duster slides straight ' +
        'over it. What moves it is a degreaser given a minute to work, two passes, and the cloth ' +
        'rinsed out between them rather than pushed on round. The same film is on the cornice, on ' +
        'the top edge of every door and in the hinge cups. Inside, the work goes a shelf at a time, ' +
        'and everything goes back in the order it came out.',
    },
    {
      type: 'ul',
      text: [
        'The flat tops of the wall units, the cornice, and the pelmet over the hob',
        'Shelves, corners and door backs, done a cupboard at a time',
        'Drawers out where they lift, with the runners and the cutlery tray washed',
        'Under the sink, where the bottle rings and the old leaks are',
        'The plinth off where it clips, and the strip of floor behind it',
        'The gap at the side of the fridge, and the top of it',
        'Wardrobe tops, the shelf over the boiler and the top of a tall bookcase',
      ],
    },
    {
      type: 'p',
      text:
        'Two honest things about the insides. A cupboard packed to the front stays as it is unless ' +
        'somebody empties it, so if the insides matter to you it is worth clearing what you can ' +
        'before the day — we would much rather say that when we quote than discover it with a team ' +
        'standing in the kitchen. And we do not make decisions about your things. Nothing is thrown ' +
        'away, nothing is rehomed to a cupboard we think suits it better, and anything long out of ' +
        'date gets left on the worktop for you to look at rather than binned on our judgement. The ' +
        'fridge is the one exception worth planning for: if the inside is on the list, it needs to ' +
        'be down to what fits on a single shelf when we arrive.',
    },
  ],

  // 3 — paintwork: washing rather than dusting, and where the finish gives first.
  [
    { type: 'h2', text: 'Washing the paintwork, which is not dusting it' },
    {
      type: 'p',
      text:
        'Gloss and satin woodwork collects a film that is not dust and does not behave like dust. ' +
        'It is hand oil, cooking fat that travelled on the air, and soot off candles and a dozen ' +
        'winters of a warm room, and a dry cloth simply slides across it. Washing means warm water ' +
        'and a weak degreaser, a cloth wrung out until it is barely damp, a soft brush into the ' +
        'corner bead and the mouldings of a panelled door, and then drying, because paintwork left ' +
        'to dry itself dries cloudy. It is slow work with no equipment in it at all, which is why a ' +
        'routine visit never has the hours for more than the front of the skirting boards.',
    },
    {
      type: 'ul',
      text: [
        'The top edge of the skirting boards as well as the face of them',
        'Architraves, the stop bead, and the long thin edge of the door itself',
        'The top of each door, and the hinge side people only see when it is open',
        'Handle backplates, and the smear on the wall around a light switch',
        'The newel post, the spindles, and the underside of the handrail',
        'Stair strings and risers, which take the most kicking in the house',
        'The back of the front door, the letter plate and the frame behind it',
      ],
    },
    {
      type: 'p',
      text:
        'One test has to happen before any of it, and it is better said here than sprung on you. ' +
        'Matt emulsion cannot be washed. Put a wet cloth on it and it either burnishes to a shine ' +
        'in a patch or lifts and takes colour off onto the cloth, and both are worse than the mark ' +
        'was. So we try somewhere out of sight — low behind a door, or the piece of wall a radiator ' +
        'hides — and if it moves at all we stop, leave it, and tell you which walls those were. On ' +
        'woodwork the limit sits further out: there is a point where more pressure starts taking the ' +
        'finish instead of the mark, and stopping just short of it is the whole skill. A mark that ' +
        'has gone into the paint is part of the paint now.',
    },
  ],

  // 4 — windows on the inside: the frame is the job, the glass is the quick part.
  [
    { type: 'h2', text: 'Windows on the inside, and the parts of a frame that hold water' },
    {
      type: 'p',
      text:
        'The glass is the quick part. Cut the edges in, one wet pass, a squeegee pulled in ' +
        'overlapping strokes, then the border dried with a scrim so there is no line where the ' +
        'blade finished, and then the corners, which is where anybody looking will judge it. The ' +
        'frame is the real work and the half a routine visit never reaches. A window is a box ' +
        'designed to shed water, so it is full of ledges, rebates and channels that collect grit, ' +
        'and once they are blocked the water they were meant to carry away sits in the bottom of the ' +
        'frame instead. Clearing them out is a brush, a narrow tool and somebody prepared to kneel ' +
        'down and look.',
    },
    {
      type: 'ul',
      text: [
        'Glass inside, plus outside on anything we can reach standing on the ground',
        'The rebate the glass sits in, and the frame face below it',
        'Sills, the internal board, and the reveal including the top of it',
        'The drainage slots along the bottom of the frame, cleared rather than wiped',
        'Trickle vents, hinges, friction stays, handles and the keep they shut into',
        'The track and the wheels of a sliding door, brushed out and then run',
        'Blinds slat by slat, the pole, and the bracket at each end of it',
      ],
    },
    {
      type: 'p',
      text:
        "The black in the corners of the rubber is what we get asked about most in this room, so " +
        "here is the honest answer: it is growing inside the gasket rather than sitting on it. It " +
        "will lighten, sometimes a lot, and it will not go, because nothing that shifts it reaches " +
        "under the surface of the rubber. A gasket is a part that can be replaced and cannot be " +
        "cleaned back to white. Two more things no clean touches. A unit that has misted between " +
        "its panes has failed, and the marks are on a face nobody can get at. And a scratch left by " +
        "somebody else's blade is permanent, which is why no blade of ours goes near coated glass, " +
        "and why we ask rather than guess whether yours is coated.",
    },
  ],

  // 5 — the bathroom past its limescale: porous materials, the fan, wear against dirt.
  [
    { type: 'h2', text: 'Grout, sealant and the fan: a bathroom past its limescale' },
    {
      type: 'p',
      text:
        'Take the scale off a bathroom and what is left is three problems in three different ' +
        'materials. Grout is porous cement, so it takes dirt in rather than holding it on the ' +
        'surface, and cleaning the face of a tile does nothing at all for the joint beside it. What ' +
        'that wants is an oxygen or alkaline product, a narrow brush worked along every line, and ' +
        'the dirty water lifted off with a cloth rather than pushed on into the next one. Silicone ' +
        'is the opposite ' +
        'problem. The black in a sealant bead is growing inside the rubber, so nothing reaches it, ' +
        'and a bead that has gone that far is a replacement rather than a clean.',
    },
    {
      type: 'ul',
      text: [
        'The fan cover off, washed, and the blades behind it wiped clear',
        'Fixing caps, hinge blocks and the underside of the seat',
        'The gap behind the pedestal, and the floor the pan is bolted to',
        'The cistern inlet, the lid, and the overflow that runs into the pan',
        'Bath panel edges, and the sealed line where a panel meets the floor',
        'Towel rail brackets, and the wall a radiator hides',
        'The back of the door, and the top of the frame in the room that steams',
      ],
    },
    {
      type: 'p',
      text:
        'The third problem is the fan, and it decides how long the other two stay fixed. A fan that ' +
        'no longer clears the room is why the room never dries, and a room that never dries grows ' +
        'the same things back within a season whatever we did to it. So the cover comes off and is ' +
        'washed, the blades behind it are cleared, and if it is plainly not pulling any more we say ' +
        'so. Then there is telling stained from dirty, which in here is mostly a question of what ' +
        'has worn through: enamel gone thin at the bottom of a bath where people stand, a resin ' +
        'tray gone matte in the same place, a plastic seat turned yellow by daylight, a crazed ' +
        'glaze holding colour in every hairline crack. We point at each of those before we start ' +
        'wherever we can already see it.',
    },
  ],

  // 6 — hard floors: the reset a routine visit maintains but cannot perform.
  [
    { type: 'h2', text: 'The floors a routine clean holds but never resets' },
    {
      type: 'p',
      text:
        'A regular visit keeps a floor at whatever level it was left at. What it cannot do is take ' +
        'one back down to the material, and on a tiled floor the reason is grout. The joint sits ' +
        'below the face of the tile, so a mop rides straight over it and every mopful of dirty ' +
        'water drains into it on the way past. Do that weekly for a decade and the lines end up ' +
        'several shades darker than the tile they run between, which reads as an old floor when it ' +
        'is a clean floor with dirty joints. Resetting it is a brush, an alkaline product, dwell ' +
        'time, and then lifting the slurry off rather than spreading it about.',
    },
    {
      type: 'ul',
      text: [
        'Grout brushed line by line, and the dirty water lifted rather than spread',
        'The perimeter, the quadrant beading and the plinth strip in a kitchen',
        'Behind and underneath the washing machine and the fridge where they draw out',
        'Behind the one door in every house that always stands open',
        'Thresholds, metal trims, and the floor under a mat rather than around it',
        'Stair nosings, the back lip of each tread, and the base of the spindles',
      ],
    },
    {
      type: 'p',
      text:
        'The other half is every bit of floor with something standing on it. A washing machine and ' +
        'a fridge will both draw out on the slack in their hoses, and what is behind them is not ' +
        'dust by then: it is a compacted mat of the stuff held down by whatever has dripped into ' +
        'it, and it is the most reliable surprise of the day. The gap beside a dishwasher is the ' +
        'same, and none of it is ever reached by a visit working to a clock. Two boundaries, ' +
        'though. A floor whose finish has worn ' +
        'through is not dirty, it is bare, and putting a finish back on is a flooring trade with ' +
        'its own machine and its own drying time. And carpet is a smaller part of this job than ' +
        'people expect: what a deep clean adds there is the border and the ground under the ' +
        'furniture, not anything new in the middle of the room.',
    },
  ],

  // 7 — the boundary: what has stopped being dirt, and which trade owns it instead.
  [
    { type: 'h2', text: 'What a deep clean will not fix, and who to ask instead' },
    {
      type: 'p',
      text:
        'The one distinction worth learning is between something sitting on a surface and something ' +
        'that has become the surface, because everything a clean can do is on one side of it. Wear ' +
        'is the commonest: a laminate worktop with the top layer gone through along the sink edge, ' +
        'the printed markings rubbed off a hob, a handle worn back to the metal. Then absorption, ' +
        'where a mark has gone into a porous material and is now inside it — a black water ring in ' +
        'an oiled wooden top, grout that is dyed rather than dirty. Then anything structural: damp, ' +
        'a cold wall, a room with no working ventilation. None of it is a question of pressure. ' +
        'Pressure is mostly how a cleanable thing turns into one of these.',
    },
    {
      type: 'ul',
      text: [
        'Emulsion that has been washed patchy, and scrubbed woodwork — a decorator',
        'A dead sealant bead, or grout that has failed rather than darkened — a tiler',
        'An oiled worktop with a mark down in the timber — sanded back and re-oiled',
        'A double-glazed unit misted between the panes — a replacement unit',
        'Mould that returns to the same corner every winter — a damp survey first',
        'A carbon filter, a cracked shelf runner or a perished seal — a part, not a clean',
        'Carpet or upholstery that needs washing — a specialist with a machine',
      ],
    },
    {
      type: 'p',
      text:
        'What we do about it is the only part that matters to you. Anything visible when we quote ' +
        'gets named then, before you have committed to anything, and anything we find on the day ' +
        'gets named at the end with the reason attached. We would rather lose a job than take it on ' +
        'the strength of something coming off that will not. And nothing gets covered up. A worn ' +
        'surface can be made to look solved with the right polish for a fortnight, and then it is ' +
        'exactly as it was — except that you have paid for a deep clean, you still have the ' +
        'problem, and you no longer trust the person who told you it was gone.',
    },
  ],
];

/**
 * Block 4 — how the job runs. Eight stages, indexed by a town's second variant
 * value, each a sub-heading and three paragraphs, and no list.
 *
 * The stages, in order: the look round that produces the quote; who arrives and
 * how many; the order of the day; kit and products; access and clearing; time;
 * the check at the end; and afterwards. They are chosen to be ORTHOGONAL to the
 * deck above — that one is eight things a deep clean is done to, this one is
 * eight stages of the day it is done in — which is what lets the two axes be
 * selected independently without any pair of pages ever sharing both.
 *
 * THIS IS A ONE-OFF JOB AND EVERY STAGE BELOW TURNS ON THAT. The routine
 * service's deck describes a standing arrangement: a round, cover, continuity, a
 * slot that repeats. Nothing here does, and it is not a stylistic difference —
 * it is why the same eight stage headings produce different arguments. The
 * quote is per job rather than per hour, so the look round has to see the state
 * of things. It takes a team rather than a cleaner, so the brief carries the job
 * where continuity would. There is no next visit, so anything not caught before
 * the door shuts is what the customer is left with. The seven decks in this
 * directory are structurally parallel by instruction, which makes this the one
 * region where two of them could quietly converge; the way out is that the
 * argument, not the wording, has to be the service's own.
 *
 * NOTHING HERE RESTATES THE SHARED PROCESS STEPS, which render on every page
 * carrying that band and are stripped out of the counted corpus for that reason.
 * Note also that the third of those steps records its remedy wording as a
 * commercial promise still awaiting sign-off — so no passage below states a time
 * window, a return visit or a re-clean commitment. It says what is useful to
 * tell us and stops there.
 *
 * No list block in this deck. The service-detail block above already carries
 * one, both land inside the same prose container, and two bulleted runs back to
 * back is where a page starts reading like a specification.
 */
export const B_VARIANTS = [
  // 0 — the look round: why the quote needs eyes on the state of things.
  [
    { type: 'h3', text: 'The look round before we quote, and why a photo will not settle it' },
    {
      type: 'p',
      text:
        'A deep clean is priced as a job rather than by the hour, so the figure depends entirely on ' +
        'the state of things, and the state of things has to be seen. What we want to look at is a ' +
        'short list, and the number of bedrooms is not on it: the oven with its door open, every ' +
        'bathroom, the tops of the kitchen units, whether the windows open, and what is standing in ' +
        'front of what. Those five move a quote much further than the size of the house does.',
    },
    {
      type: 'p',
      text:
        'Photographs help and they do not settle it. A picture of a cavity is taken in the dark ' +
        'with a flash, which flattens the one thing being judged — whether the carbon is a film or ' +
        'a crust, and that is the difference between a soak and most of a day. Where a visit is ' +
        'genuinely impractical we will quote off photographs and say plainly which parts of the ' +
        'figure are provisional and what would move them.',
    },
    {
      type: 'p',
      text:
        'It takes about a quarter of an hour and nothing needs tidying for it. What is worth doing ' +
        'beforehand is deciding what you actually want out of the day, because the whole house and ' +
        'the kitchen and both bathrooms properly are two different jobs at two different figures — ' +
        'and deciding what is not to be touched at all, which is a question we would much rather ' +
        'ask than guess at. What you get back is a figure and a length of time, and both are ' +
        'settled before the day is booked.',
    },
  ],

  // 1 — the team: the arithmetic of the waits, and what carries the job instead of continuity.
  [
    { type: 'h3', text: 'How many people come, and why one is rarely enough' },
    {
      type: 'p',
      text:
        'A routine clean is usually one person. A deep clean usually is not, and the reason is ' +
        'arithmetic rather than ambition. The work has long waits built into it — degreaser sitting ' +
        'on a cavity, an acid gel on a screen, a product soaking down into a grout line — and one ' +
        'cleaner either stands and watches those or loses the afternoon to them. Two or three ' +
        'people start three of those waits at once and then work round them in turn, which is why ' +
        'the same house takes a team a day and one person the better part of three.',
    },
    {
      type: 'p',
      text:
        'They divide up the house rather than the room list. One of them owns the kitchen from the ' +
        'first ten minutes, because the oven soak sets the clock everybody else works to. Somebody ' +
        'starts at the top, so whatever comes down off the high surfaces lands in rooms nobody has ' +
        'finished. And one of them runs the day and is the person to point things out to, which ' +
        'matters more than ' +
        'it sounds: with three people in a house, telling one of them something is not the same as ' +
        'telling us.',
    },
    {
      type: 'p',
      text:
        'Two things follow from a team rather than a cleaner. You are told how many to expect and ' +
        'roughly when. And continuity cannot carry this job the way it carries a round, ' +
        'since you may well never see these particular people again — so the brief carries it ' +
        'instead. Everything said at the look round is written into the quote, and whoever is ' +
        'running the day goes through it before anybody opens a bottle.',
    },
  ],

  // 2 — the sequence: two soaks, top down, and the kitchen as the workroom.
  [
    { type: 'h3', text: 'Why the kitchen is not the first room we do' },
    {
      type: 'p',
      text:
        'The day is built around its two longest waits, and both are started before anything in ' +
        'the house is actually cleaned. Within the first ten minutes the oven is in pieces with its ' +
        'parts in a soak, and the descaler is on the screens and the taps upstairs. Neither can be ' +
        'hurried and both improve for being left, so they begin while everybody is fresh and get ' +
        'returned to twice.',
    },
    {
      type: 'p',
      text:
        'After that the house goes from the top down: a deep clean brings a lot of material down off ' +
        'high surfaces, and none of it should land on a floor somebody has finished. A room is ' +
        'taken as far as it goes and then its door is shut, which is less about tidiness than about ' +
        'traffic. A day like this moves a surprising amount through a house — oven parts, buckets, ' +
        'water going out and coming back — and the sequence exists to keep all of it off ground ' +
        'that is already done.',
    },
    {
      type: 'p',
      text:
        'The kitchen is last for the same reason it was first. It is the workroom: the sink, a ' +
        'length of worktop and a patch of floor are in use all day for soaking, filling and ' +
        'standing things on, so it cannot be finished until nothing else needs it. Its floor goes ' +
        'at the very end, with the hall. If something about your day makes that order wrong — one ' +
        'bathroom that has to be usable by four, a room somebody is working in, a school run — say ' +
        'so at the look round and the day gets built the other way round instead.',
    },
  ],

  // 3 — kit, dwell time, and the two-way refusal list.
  [
    { type: 'h3', text: 'The kit a deep clean arrives with, and what will not go on a surface' },
    {
      type: 'p',
      text:
        'The difference between this and a routine visit sits in the van rather than in the effort. ' +
        'A soak tray and an alkaline degreaser for the oven parts. An acid gel and a citric paste ' +
        'for scale. An oxygen product for grout, plastic blades, a ceramic scraper, nylon brushes ' +
        'narrow tools for the machine, a squeegee and a scrim for glass, and poles long enough that ' +
        'nothing indoors needs a ladder. Nearly all of it puts chemistry and time where pressure ' +
        'would otherwise go, because pressure is what damages surfaces.',
    },
    {
      type: 'p',
      text:
        'Dwell time is the part that looks like nothing happening and is in fact the job. A product ' +
        'left as long as it needs will do what twenty minutes of scrubbing will not, and without ' +
        'taking the finish off along with the dirt. So there will be points in the day when a ' +
        'bathroom has been sprayed and abandoned and a cavity sits open looking exactly as it did. ' +
        'That is not somebody having a break.',
    },
    {
      type: 'p',
      text:
        'There is a refusal list and it runs both ways. Nothing caustic near an aluminium fan blade ' +
        'or an anodised trim. No acid on natural stone. No blade on coated glass. No abrasive cream ' +
        'on a resin tray or a brushed metal finish. And nothing acidic anywhere near a bleach ' +
        'product, which is a ventilation matter rather than a finish one. And say before the day if ' +
        'something is delicate — an oiled worktop rather than a sealed one, a ' +
        'mirror that is only glued to the wall, a light fitting nobody has ever taken down.',
    },
  ],

  // 4 — access, and the clearing the price assumes.
  [
    { type: 'h3', text: 'Access, and what needs to be clear before we start' },
    {
      type: 'p',
      text:
        'Access is simpler on a one-off than on a round because it is one day: somebody is in, or ' +
        'there is a key or a code. Either way it helps to have somebody reachable for the questions ' +
        'that only come up once we are inside. A team also wants somewhere to park within carrying ' +
        'distance of the door, a tap and a socket. In a flat, say whether the lift is working and ' +
        'whether there is a back way in.',
    },
    {
      type: 'p',
      text:
        'The clearing matters more, because a deep clean is priced on getting at things and what is ' +
        'standing on a surface decides how much of that surface gets cleaned. What we ask for is ' +
        'short. Worktops clear of what lives on them. Floors clear of what stands on them. The tops ' +
        'of the wall units clear. The fridge down to one shelf if the inside is on the list. That ' +
        'is all. The house does not need cleaning first and we would rather you did not.',
    },
    {
      type: 'p',
      text:
        'What we will not do is shift anything that wants three people or a trolley, or disconnect ' +
        'anything. A sofa, a table and a bed get moved; a unit bolted to the plaster does not, and ' +
        'nothing is drawn out further than the slack in its own hose. Whatever is left standing on ' +
        'a surface gets moved aside, cleaned round and put back, which is a worse result than a ' +
        'clear surface gets — the honest reason for asking. Anything irreplaceable is better off in ' +
        'a room we are not working in: three people in a house for a day are near far more of it ' +
        'than one cleaner on a round.',
    },
  ],

  // 5 — time: what the hours actually go on, and the decision made before the day.
  [
    { type: 'h3', text: 'How long a deep clean really takes, and what happens if a day is short' },
    {
      type: 'p',
      text:
        'The honest answer is that it is measured in ovens and bathrooms rather than in bedrooms. A ' +
        'cavity left for years is a large slice of a whole day for one person, on its own. A ' +
        'screen that has never been descaled is most of a morning. Bedrooms, even with the ' +
        'paintwork on the list, are steady and predictable. Which is why the quote asks pointed ' +
        'questions about the first two and barely mentions the third.',
    },
    {
      type: 'p',
      text:
        'What happens when a day is not enough gets decided before we start rather than at four in ' +
        'the afternoon. Either it is quoted as two days from the beginning, which on a house that ' +
        'has never had one is far more common than people expect, or we agree an order of priority ' +
        'at the look round and work down it. Then whatever runs out of time is the thing you cared ' +
        'least about, and it is never a bathroom left halfway. A part-finished room is worse than ' +
        'an untouched one, because you cannot see what you paid for.',
    },
    {
      type: 'p',
      text:
        'It goes the other way sometimes. A house in better order than it looked from the doorstep ' +
        'finishes early; the figure was settled before we started and it stays settled, and the ' +
        'spare hours go into whatever was at the bottom of the priority list rather than into ' +
        'leaving at two. We would far rather do that than build a reputation for quoting long, and ' +
        'it is a better use of a team that is already standing in the house with the kit out.',
    },
  ],

  // 6 — the check at the end, on dry surfaces, and the definition of finished.
  [
    { type: 'h3', text: 'The last walk round, and what counts as finished' },
    {
      type: 'p',
      text:
        'What changes the check at the end of a deep clean is that there is no next time. On a ' +
        'fortnightly round anything missed comes back around in a fortnight and costs nobody very ' +
        'much. Here, whatever is not caught before the door closes is what you are left with, so ' +
        'the last part of the day runs longer than it would on a routine visit, and it is done with ' +
        'you if you are in the house.',
    },
    {
      type: 'p',
      text:
        'It happens on dry surfaces and in daylight wherever there is any left. A wet surface ' +
        'always looks clean: grease and scale only declare themselves once things have dried, which ' +
        'is why the kitchen and the bathrooms get looked at again at the end of the day instead of ' +
        'being signed off the moment they were finished. A cavity gets the same treatment once it ' +
        'has gone cold, because a warm oven flatters itself. And it goes room by room in the order ' +
        'they were worked, because a day that touched this much of a house is not something anybody ' +
        'should be checking from memory.',
    },
    {
      type: 'p',
      text:
        'As for what finished means: the rooms on the quote, taken as far as their surfaces will ' +
        'go, with a spoken list of everything that would not come further and the reason attached ' +
        'to each one. Nothing gets hung on the back of a door with boxes down the side of it. A ' +
        'one-off has no history to be measured against — no last fortnight, no standard already ' +
        'set — so what stands in place of a checklist is the quote on one side and that list of ' +
        'exceptions on the other. Both are things you can hold us to.',
    },
  ],

  // 7 — afterwards: uneven decay, the habits that hold it, and the one-off asymmetry.
  [
    { type: 'h3', text: 'Keeping it, when the next one is due, and what to tell us' },
    {
      type: 'p',
      text:
        'A deep clean does not decay evenly, and knowing which parts go first is worth more than ' +
        'anything in a bottle. Some of it holds for a long time: an oven cavity, the tops of the ' +
        'units, the insides of the cupboards, washed paintwork. Some of it starts going the same ' +
        'week — scale is back on a shower screen inside a month where the water is hard, and a fan ' +
        'cover greys over again quietly. That gap is usually why somebody books the whole house ' +
        'when what they actually wanted was the kitchen.',
    },
    {
      type: 'p',
      text:
        'Holding the rest is a handful of habits and not one of them is something to buy. Dry the ' +
        'glass and the taps when the shower goes off. Run the fan after rather than during. Wipe ' +
        'the hob while it is still warm. Do the oven door glass in the week it needs it. Those ' +
        'four are most of the difference between one deep clean a year and one ' +
        'every other year. For a good many houses the next step is a regular visit: a deep clean ' +
        'sets a standard and a routine clean is what holds one.',
    },
    {
      type: 'p',
      text:
        'If something was missed, timing matters more here than on a round. On a standing ' +
        'arrangement a missed shelf goes onto the list for the next visit; on a one-off there is ' +
        'nothing to add it to, so it wants saying in the days afterwards rather than in six ' +
        'weeks, by which point nobody can honestly tell whether a surface was left or has simply ' +
        'been used since. What helps is which room and which surface. What is not needed is a ' +
        'justification: nobody here requires persuading that a thing you paid to have cleaned ' +
        'should have been cleaned.',
    },
  ],
];
