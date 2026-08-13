/**
 * End of tenancy cleaning — the two eight-entry copy decks. Pure data, no React.
 *
 * A `.js` module under `web/content/` for the reasons set out at the top of
 * `site.js` and followed by both siblings in this directory: the design-system
 * package is framework-agnostic UI and carries no site copy, and a content
 * directory reached through the usual path alias resolves at any route depth.
 * Copy and string handling live in `.js`; only `blocks.jsx` one level up returns
 * elements.
 *
 * WHAT THIS FILE IS FOR. It is the town-INDEPENDENT half of every end of tenancy
 * combo page. `A_VARIANTS` supplies the service-detail block, `B_VARIANTS`
 * supplies the how-the-job-runs block, and everything that makes a page local —
 * its heading, its lead, the paragraph about the town itself and the coverage
 * list — arrives from somewhere else. Sixteen passages compose across the whole
 * published set. The prose is SELECTED, never filled in.
 *
 * WHO IT IS WRITTEN FOR, WHICH IS THE POINT OF THIS PARTICULAR FILE. This deck
 * is written for a tenant with a deposit at stake, and the sibling deck for the
 * move-out concept is written for somebody handing over a house they own. Those
 * are one search intent and two entirely different readers, and 36 frozen legacy
 * pages already compete for the intent between them — see the spec's own note on
 * duplicated intent. The structural half of that fix belongs to the data layer.
 * The editorial half is here, and it is a hard rule rather than a preference:
 * nothing below is about buying or selling a house, about a chain, about the day
 * such a transaction closes, or about the professionals and the lorries involved
 * in one. Those words are not spelled out here either — the check on this file
 * greps case-insensitively for the three most distinctive of them, so a comment
 * listing them would fail the gate it exists to explain, which is the same trap
 * the block literals set further down. The vocabulary of this file is tenancy,
 * check-out, inventory, agent, landlord and deposit.
 * Two textually similar decks would recreate the cannibalisation the
 * taxonomy work exists to remove, and the gates in the plan that produced this
 * file cannot see intent — only text — so the discipline has to be in the
 * writing.
 *
 * THE INDEX IS DATA, NOT PRESENTATION. Every town carries a pair of small
 * integers, and position 0 through 7 in each array below is what that pair
 * addresses. Reordering either array silently reassigns the copy of every
 * published page at once. It is not a cosmetic edit, and nothing downstream will
 * catch it, because every assertion made about this file is about the passages
 * rather than about which town received which one. Add at the end, edit in
 * place, never shuffle.
 *
 * EIGHT SUBJECTS RATHER THAN EIGHT REWORDINGS. The similarity gate measures
 * 5-gram overlap, which is a LEXICAL test: eight paraphrases of one passage
 * share almost no 5-grams, so the gate reports green on exactly the failure it
 * was built to detect. That was measured — a paraphrase deck sits near 0.05 on
 * the lexical metric and near 0.74 on TF-IDF cosine, against roughly 0.07 to
 * 0.12 for a deck of genuinely different passages. So each entry here is about a
 * different thing: a different fixture, a different document, a different stage
 * of one fixed day, a different honest limit. A ninth angle means finding a
 * subject nobody has taken, not re-angling one that is already here.
 *
 * DO NOT RESTATE THE PARENT SERVICE PAGE. `services.js` ships a long record for
 * this concept today under its live slug, with the deposit eyebrow that migrates
 * with it when the taxonomy plan renames it. That page is the region-wide parent
 * of these combo pages, and it already covers the report, the oven, the
 * difference from a deep clean, the timing and what happens if the agent comes
 * back with something. This file takes the angles it does not: the document
 * rather than the finding, the fittings nobody lists, the property as evidence,
 * and the parts of a handover that were never cleaning at all. Its examples are
 * deliberately not reused. Measure against the parent as well as against the
 * siblings — one of them found two passages carrying the parent's own examples,
 * and no gate in either plan faces that direction.
 *
 * THE TWO DECKS ARE ORTHOGONAL AND MUST STAY SO. `A_VARIANTS` is eight things
 * the job is done TO; `B_VARIANTS` is eight stages of HOW one fixed day runs.
 * That is what makes the grid a grid — the axes are selected independently, so a
 * passage wandering from one deck's territory into the other's collapses
 * sixty-four combinations back towards eight.
 *
 * DO NOT RESTATE THE SHARED PROCESS COPY either. `process.js` renders on
 * hundreds of pages and is stripped out of the counted corpus for that reason. A
 * passage that paraphrases it is words that do not count towards the depth bar
 * and content that differentiates nothing. Note also that its third step records
 * its remedy wording as a commercial promise still awaiting sign-off, so nothing
 * below states a time window, a return visit or a re-clean commitment.
 *
 * NO CLAIM ABOUT WHAT ANYBODY WILL DECIDE. This is the one service where the
 * temptation is strongest and the register of threats for it names it: describe
 * what is cleaned and what is handed over, and make no claim about what an agent
 * or a landlord will accept, what will be held back, or what a report will say.
 * Every passage below stays on our side of that line.
 *
 * NO TOWN NAME AND NO COUNTY NAME ANYWHERE IN THIS FILE, INCLUDING THE COMMENTS.
 * Place names belong to a page's heading, its lead, its locality paragraph and
 * its interlinks, which are the four places a proper noun earns its keep. The
 * first prohibition on the composition layer is that no sentence may be produced
 * by dropping a town name into an otherwise fixed sentence, and the cheapest way
 * to make that impossible is for the reusable half of the corpus to hold no
 * place names at all. Hard water is hard water here, and a page's own blocks are
 * where it becomes local.
 *
 * NO ADDRESS, NO POSTCODE, NO POSTCODE DISTRICT, NO PHONE NUMBER, NO EMAIL AND
 * NO PRICES — the rule every sibling content module follows. The canonical
 * number lives once in the design system, the site quotes rather than
 * price-lists, and no figure below is a price. This comment does not instance
 * any of those shapes either: a comment naming the exact string a scanner greps
 * for is itself an occurrence of it, and this repo has been bitten by that
 * fifteen times now.
 *
 * BLOCK SHAPE is the one fixed by `blocks.jsx` and restated in `services.js`
 * just below its slug rules — a paragraph, a section heading, a sub-heading, or
 * a list whose `text` field carries the ITEMS as an array of strings. There is
 * no top-level heading block type and there must never be one: exactly one of
 * those is allowed per page and it belongs to the Hero. An unrecognised `type`
 * renders as nothing rather than throwing, so a typo drops a paragraph in
 * silence and a word count is what catches it. The literals live in
 * `blocks.jsx` and are deliberately not written out here, because the checks
 * that police this file count the heading blocks in it and a comment quoting one
 * is another occurrence.
 *
 * EVERY ENTRY IN `A_VARIANTS` CARRIES A SECTION HEADING AND EVERY ENTRY IN
 * `B_VARIANTS` CARRIES A SUB-HEADING, one level down. That is the page outline
 * rather than a style choice: one top-level heading from the Hero, a flat run of
 * section headings, and the deeper level only inside prose. No section heading
 * below opens with the display noun followed by the word "in", because that
 * phrase belongs to one heading per page and it is the first one.
 *
 * VOICE — plain UK English, contractions, concrete nouns. The US vocabulary and
 * the three dead call-to-action phrases are not quoted here, because the check
 * for this file is a case-insensitive grep for those very words and a comment
 * naming them would fail the gate it exists to explain. A literal ampersand is
 * correct where one is wanted: React serialises it and the extractor decodes
 * entities before comparing, so writing the entity would double-encode.
 */

/**
 * Block 3 — service detail. Eight subjects, indexed by a town's first variant
 * value, each a section heading, prose and one list.
 *
 * The subjects, in order: the document the clean is marked against; the oven;
 * the kitchen an empty room lets you get behind; the bathroom; floors with the
 * furniture gone; windows and the places a last day forgets; furnished against
 * unfurnished; and the findings a clean cannot answer for.
 *
 * The last of those is deliberately the one that says no, and on this service it
 * is doing more work than a disclaimer. A reader here is about to spend money on
 * a clean in the hope that it settles a list of things, and some of the list was
 * never cleaning. Saying which parts a fortnight early is worth more to them
 * than any promise about the parts that are.
 */
export const A_VARIANTS = [
  // 0 — the document: how an inspection is carried out, and who reads the result.
  [
    { type: 'h2', text: 'What an inspection is, and the words that end up on the report' },
    {
      type: 'p',
      text:
        'The clean that closes a tenancy is the only one anybody writes down. Somebody walks the ' +
        'property with a camera and a printed template, room by room, and produces a document that ' +
        'is then read by people who never stood in it — you, the agent, a landlord who may live ' +
        'nowhere near, possibly somebody settling a disagreement months afterwards. That changes ' +
        'what the job is. A home people are living in gets judged by how it feels. An empty property ' +
        'being handed back gets judged by a close photograph lit by a phone flash, taken by ' +
        'somebody kneeling at an open cupboard door. Very little of that is ' +
        'about effort, and most of it is about whether anybody thought to look where the camera is ' +
        'going to look.',
    },
    {
      type: 'ul',
      text: [
        'A line for every room, and a line for the items inside it',
        'A grade written in words rather than a mark, using the same few phrases throughout',
        'Photographs, timed and dated, which become the whole of the evidence',
        'Meter readings and a count of the keys, on the same handful of pages',
        'Anything out of reach recorded as not inspected rather than as passed',
        'A summary at the front, which is the part most people actually read',
        'A comparison with how the place was recorded the week you took it on',
      ],
    },
    {
      type: 'p',
      text:
        'Knowing the shape of that document is what makes the work sensible rather than anxious. The ' +
        'recurring phrases are graded: a room called clean is finished with, a room needing attention ' +
        'is a line somebody has to answer, and a note about a domestic rather than a professional ' +
        'standard is a remark on thoroughness rather than on mess. None of it is ours to decide, and ' +
        'we do not claim to know what any particular agent accepts. What we can do is work to the ' +
        'tightest reading of it: everything opened that opens, everything lifted that lifts, and ' +
        'every surface a camera could be pointed at treated as though one will be.',
    },
  ],

  // 1 — the oven as an inspected object, and the three reasons it is finished last.
  [
    { type: 'h2', text: 'The oven, and why it is the last thing we finish' },
    {
      type: 'p',
      text:
        'Of everything in a rented property the oven is the item we are asked about most, and the ' +
        'one an inspection photographs whether or not there is anything wrong with it. It opens onto ' +
        'its own evidence, and it is the fitting a tenancy visibly alters through nothing but ' +
        'ordinary use. So it is not a line on a list of rooms; it is a piece of the day with its own ' +
        'hours in the quote. What people underestimate is the hours rather than the difficulty. On ' +
        'many models a door comes apart and the middle face of the glass can be reached; on others ' +
        'the space between the panes is sealed for good, and knowing which yours is takes a look ' +
        'rather than a guess. The shelves, the trays and the runners are the obvious half. The list ' +
        'below is the half a report tends to find.',
    },
    {
      type: 'ul',
      text: [
        'The door taken apart where the design allows it, and the middle face of the glass',
        'The rubber seal round the opening, and the frame lip the door shuts onto',
        'The drip channel beneath the door, where fat pools out of sight',
        'A separate grill compartment and its pan, usually untouched for years',
        'The roof of the cavity, and the boss the fan cover screws onto',
        'The gap either side of the housing, and the trim across the front of it',
      ],
    },
    {
      type: 'p',
      text:
        'It is also the last thing we finish, which surprises people. Three reasons, all of them ' +
        'about a property nobody lives in. ' +
        'Stripping an oven is wet, greasy work and everything that comes out of it crosses a kitchen ' +
        'floor, so doing it early means doing that floor twice. An oven put back together in the ' +
        'morning becomes a shelf by lunchtime for whoever is still carrying bags out of the hall. And ' +
        'the door glass shows a fingerprint from the other side of the room, so it belongs with the ' +
        'rest of the glass once the day is nearly over rather than when it begins.',
    },
  ],

  // 2 — the kitchen: what an empty room makes reachable, and how it goes back.
  [
    { type: 'h2', text: 'The kitchen an empty property finally lets you get behind' },
    {
      type: 'p',
      text:
        'A kitchen with nothing in it is a different room from the one you have been cooking in, and ' +
        'the difference is all at the back and the bottom. A freestanding cooker has stood in the same ' +
        'gap since the day it was delivered, and the two cabinet sides either side of it are the only ' +
        'upright surfaces in the room nobody has had a reason to touch. A washing machine has a flap ' +
        'in its plinth with a filter housing behind it that most households never learn about. The ' +
        'seam of silicone where the worktop meets the tiles holds a dark line that is only visible ' +
        'once the kettle and the bread bin have gone. That is simply the part of a kitchen a full ' +
        'room hides and an empty one puts at eye level.',
    },
    {
      type: 'ul',
      text: [
        'The cooker drawn forward, and the two cabinet sides it has stood between',
        'The plinth flap on a washing machine, and the filter housing behind it',
        'The seam of silicone behind the worktop, and the tiles above the taps',
        'Drawer boxes with the cutlery insert lifted out, and the runners either side',
        'Empty carcasses, the shelf pegs and the holes they push into',
        'The extractor filter out, held up to the light, and the canopy over it',
      ],
    },
    {
      type: 'p',
      text:
        'Two things follow. Everything goes back in the same place and the same way round, because a ' +
        'shelf sitting a peg high is precisely the small wrongness that gets written up as damage by ' +
        'somebody who was not there when it happened. And an appliance is moved once: drawn forward ' +
        'far enough to work behind, then back against the wall, level, with its hose where it was and ' +
        'nothing pinched. Nothing gets disconnected, ever. A gas cooker stays connected ' +
        'and comes out as far as the pipe allows, which reaches the floor behind it and never the ' +
        'wall. Anything already broken in there — a door that has never shut ' +
        'square, a drawer front that has always been loose — is photographed and told to you rather ' +
        'than quietly straightened, since a repair nobody asked for is a change to somebody ' +
        "else's property.",
    },
  ],

  // 3 — the bathroom: it will not change again, and the fittings that come off the wall.
  [
    { type: 'h2', text: 'The bathroom is where an inspection slows right down' },
    {
      type: 'p',
      text:
        'A bathroom is the room an inspection spends longest in, and in an empty property it is also ' +
        'the room where what we leave is exactly what gets found. Nobody showers in it after us, ' +
        'nothing steams, and no scale comes back between the clean and the appointment. That is the ' +
        'one real advantage of doing this work in a property that has been handed over, and it is why ' +
        'the room is worth taking to its limit rather than to a standard that only has to hold until ' +
        'next week. It cuts the other way too. Whatever will not come further is going to be there on ' +
        'the day as well — a screen gone cloudy for good, a bead of sealant past saving, a fan that ' +
        'plainly no longer pulls. Those are photographed and written down before we start, so what we ' +
        'could not change sits on a record with a date instead of being mistaken for something we ' +
        'skipped.',
    },
    {
      type: 'ul',
      text: [
        'Adhesive hooks and pads off the tiles, and the grey shadow they leave',
        'The ring left where a bin or a bath mat has stood for two years',
        'Glue from a stick-on shelf, and the outline of a mirror that has moved',
        'The airing cupboard, its slatted shelves and the floor of it',
        'Screw holes and plugs left by anything we took down, recorded and not filled',
      ],
    },
    {
      type: 'p',
      text:
        'One word on these reports is worth being plain about. A bathroom may be described as ' +
        'hygienically clean or sanitised, and no test is carried out to establish either. It is a ' +
        'visual judgement made by a person with a camera, which in practice means dry surfaces, no ' +
        'film on the glass, nothing dark in a corner and no smell. So every surface in there is dried ' +
        'by hand before we leave the room, because a surface allowed to dry in its own time dries ' +
        'marked, and a marked surface photographs as a dirty one. The vent cover comes down and goes ' +
        'into the sink instead of ' +
        'being wiped where it hangs. And the lavatory is worked inside and underneath first and ' +
        'outside last, which is sequence rather than thoroughness.',
    },
  ],

  // 4 — floors: the map the furniture leaves, and the drying time nobody plans for.
  [
    { type: 'h2', text: 'Floors with the furniture gone, and the marks that stay behind' },
    {
      type: 'p',
      text:
        'A floor is the one surface nobody has seen whole since the day the furniture went in, and on ' +
        'the day it goes out the floor becomes a photograph. What appears is usually a map of where ' +
        'things stood rather than dirt: a paler square where a rug has lain, four dents where a sofa ' +
        'has pressed the pile flat, a band along the window where daylight has taken the colour out ' +
        'of the carpet, a darker path down the middle of the hall. Some of it lifts: a crushed pile ' +
        'comes part of the way back given damp and an hour rather than a machine driven hard over it. ' +
        'The faded band will not come back at all, and a floor cleaned perfectly still shows it — ' +
        'which is why it is worth having on a photograph of ours with a date attached.',
    },
    {
      type: 'ul',
      text: [
        'Pile lifted where a foot has stood, by hand and with patience rather than pressure',
        'Grit out of the carpet gripper at every doorway and metal bar',
        'The gap between a carpet edge and the skirting, brushed rather than passed over',
        'Stair carpet where it tucks into the wall string, a step at a time',
        'Tape residue and old underlay marks where something was fixed down',
        'A swollen laminate joint or a lifted board, put on the record rather than worked at',
      ],
    },
    {
      type: 'p',
      text:
        'If a carpet needs washing rather than cleaning, that is a separate booking, and what decides ' +
        'when it happens is the drying rather than the washing. A carpet done the evening before an ' +
        'appointment is still damp in the morning, it smells of damp, and damp carpet in a photograph ' +
        'reads worse than dry carpet that was only hoovered. So it goes first, with a full day of ' +
        'drying behind it, and everything else is arranged around it. Where a mark is in ' +
        'the fibre rather than on it we say so before anybody pays for a machine on the hope that it ' +
        'shifts. And we do not decide what counts as ordinary use of a floor over three years; that ' +
        'is not a judgement a cleaner is in any position to make.',
    },
  ],

  // 5 — windows, and the second category of miss: the places nobody thinks of as rooms.
  [
    { type: 'h2', text: 'Windows, and the places a last day forgets' },
    {
      type: 'p',
      text:
        'Glass in an empty room gets looked at against the light with nothing in front of it, which is ' +
        'the least forgiving way there is to look at a window, and the sill has nothing on it for the ' +
        "first time in years. That part is straightforward work. This passage is not only about " +
        "windows because a handover has a second category of miss: places that were never part of " +
        "anybody's cleaning and are still part of the property. They turn up on a report as a " +
        'surprise because nobody thinks of them as rooms. A loft with three boxes in it. A meter ' +
        'cupboard with a year of junk mail on the floor. A shed with a bag of charcoal in it. None of ' +
        'those goes anywhere near a hoover in an ordinary week, and all of them are on the inventory.',
    },
    {
      type: 'ul',
      text: [
        'The inside of the letter plate, and the brushes in it',
        'The loft hatch, the ladder, and whatever is still up there',
        'The bins themselves, emptied and rinsed, and the ground they stand on',
        'A shed or a garage swept out, with nothing of yours left in it',
        'The outside face of the front door, and the step in front of it',
        'Window keys, spare keys and fobs, counted and left together',
      ],
    },
    {
      type: 'p',
      text:
        'The other half of a last day is the small fittings that came with the property and have ' +
        'quietly been replaced or taken away. An alarm with the battery out of it. A light fitting ' +
        'swapped for something nicer, with the original in a cupboard. A pole taken down and blinds ' +
        'put up instead. A shower head replaced because the first one had furred. None of that is a ' +
        'problem in itself and most landlords would rather have the better one — but it is a ' +
        'difference from what was recorded, so the useful thing is either to put the original back or ' +
        "to say plainly where it is. Anything of that kind we come across gets pointed out, and " +
        "nothing goes back up or comes down without being asked: deciding what belongs to a property " +
        "is not a cleaner's call.",
    },
  ],

  // 6 — furnished against unfurnished: the furniture is the work, not the obstacle.
  [
    { type: 'h2', text: 'An empty let and a furnished one are two different jobs' },
    {
      type: 'p',
      text:
        'There are two versions of this job and they are quoted differently, so it is worth being ' +
        'clear which one you have. In an unfurnished let the property is the job: bare rooms, ' +
        'everything reachable, nothing to work around. In a furnished or part-furnished one the ' +
        'furniture stays exactly where it is and every piece is a numbered line on the inventory — a ' +
        'sofa, a mattress, a chest of drawers, six dining chairs — which means each is cleaned rather ' +
        'than cleaned around. That is the opposite instinct to cleaning a house somebody lives in, ' +
        'where furniture is a thing to be respectful of and worked past. Here it is the work. A ' +
        'wardrobe is done inside and on top, with the hangers left in it, because the hangers are on ' +
        'the list as well.',
    },
    {
      type: 'ul',
      text: [
        'Sofa cushions out, the frame, the arms, and whatever is down the sides',
        'A mattress turned, both faces, and the base it sits on',
        'Wardrobe and chest interiors, with the hangers counted and left where they were',
        'Dining chairs, the rails under the seats, and the underside of the table',
        'Curtains left hanging and dressed back, since laundering them is another job',
        "Every drawer of the property's own furniture, emptied by you before we arrive",
      ],
    },
    {
      type: 'p',
      text:
        'What has to be out before we start is everything of yours, and the list people leave on ' +
        'purpose is remarkably consistent: food in the freezer, bags stacked by the back door, a mop ' +
        'and a bucket left as a kindness, and the ' +
        'hangers that turn out to be yours after all. Each is a patch of floor or a shelf nobody can ' +
        'get at, and something somebody else has to shift, and a bag standing in a hallway is the ' +
        'easiest line on a report ' +
        'to have avoided. If something genuinely cannot go beforehand, say where it will be, so that ' +
        'it lives in one room and we plan around one room rather than finding it in four. And if the ' +
        'property will not be empty at all — a share where one room is ending and the rest of the ' +
        'house carries on — that is a different job again, and it wants saying when you book rather ' +
        'than when we arrive.',
    },
  ],

  // 7 — the boundary: the headings on a report that were never cleaning.
  [
    { type: 'h2', text: 'The findings a clean cannot answer for' },
    {
      type: 'p',
      text:
        'A check-out report is not a cleaning report. Cleaning is one heading on it and the others ' +
        'are ones no clean can touch however well it is done: condition, contents, decoration, the ' +
        'garden, the keys, the meters. Being straight about that boundary is more use to you than ' +
        'being cheerful about it, because the two get muddled at the worst possible moment. Somebody ' +
        'pays for a thorough clean, gets a report with four lines on it, and only one of the four was ' +
        'ever a cleaning matter. The other three wanted doing a fortnight earlier, by a trade or by ' +
        'you, and by the time a report exists it is late for all of them.',
    },
    {
      type: 'ul',
      text: [
        'Holes from a hook, a shelf or a bracket, where filling and painting is a trade',
        'Scuffs and knocks on the paintwork, which is decorating rather than washing',
        'A cracked pane, a misted unit or a split shelf: replacements, each with a lead time',
        'Anything belonging to the property that is missing, broken or has been swapped',
        'Bulky rubbish, which wants a collection booked rather than a cleaner with a car',
        'A smell that is in the fabric of a room rather than on any of its surfaces',
      ],
    },
    {
      type: 'p',
      text:
        'What we do about the boundary is the part that helps. Anything of the kind we can see on the ' +
        'day is photographed and listed while we are in the property, with what it is and where it ' +
        'is, and you get that list with everything else. Two weeks before the end of a tenancy such a ' +
        'list is a set of jobs; two days after, it is an argument nobody can win. Which means the ' +
        'earlier we are in the property the more use we are. We make no claim ' +
        'about how any of it will be treated or whether it will be raised at all, because that sits ' +
        'between you, the agent and whatever was recorded when you moved in. We would rather say so ' +
        'plainly than let a clean be sold as the answer to something it was never going to reach.',
    },
  ],
];

/**
 * Block 4 — how the job runs. Eight stages, indexed by a town's second variant
 * value, each a sub-heading and three paragraphs, and no list.
 *
 * The stages, in order: booking against dates nobody controls; who arrives; the
 * two passes an empty property is worked in; arriving somewhere with nothing left
 * in it; getting in; how long it takes; what gets photographed before we lock up;
 * and the days either side of the appointment. They are chosen to be ORTHOGONAL
 * to the deck above — that one is eight things the job is done to, this one is
 * eight stages of one fixed day — which is what lets the two axes be selected
 * independently without any pair of pages ever sharing both.
 *
 * EVERY STAGE HERE TURNS ON A DEADLINE SOMEBODY ELSE SET, AND THAT IS WHAT KEEPS
 * IT AWAY FROM ITS SIBLINGS. The seven decks in this directory are structurally
 * parallel by instruction — the same eight stages of a working day for seven
 * different services — so this is the one region where two of them can quietly
 * converge, and it has already happened once: a deck in this directory drafted a
 * whole sub-heading its sibling had used, and every prose gate passed on it,
 * because a shared nine-word heading inside two 280-word passages measures almost
 * nothing on a lexical metric. The way out is that the ARGUMENT has to be this
 * service's own, not the wording. Here that argument is a fixed external
 * appointment. The routine deck describes a standing arrangement and the deep
 * clean deck describes a one-off day; both can run late and be finished
 * differently tomorrow. This one cannot. There is no next visit, there is no
 * tomorrow morning, and the property stops being reachable at a time nobody here
 * chose — so the team is sized backwards from a clock, the day cannot fall back
 * on dropping work, and what is handed over at the end is evidence rather than a
 * standard.
 *
 * NOTHING BELOW RESTATES THE SHARED PROCESS STEPS, which render on every page
 * carrying that band and are stripped out of the counted corpus for that reason.
 * Note that the third of those steps records its remedy wording as a commercial
 * promise still awaiting sign-off, so no passage here states a time window, a
 * return visit or a re-clean commitment. It says what is useful to tell us, what
 * we hand over, and where our part stops.
 *
 * No list block in this deck. The service-detail block above already carries one,
 * both land inside the same prose container, and two bulleted runs back to back
 * is where a page starts reading like a specification.
 */
export const B_VARIANTS = [
  // 0 — the three dates nobody controls, and what a quote actually needs.
  [
    { type: 'h3', text: 'Booking the clean into dates that are already fixed' },
    {
      type: 'p',
      text:
        'Almost every other cleaning job gets arranged around what suits you. This one gets arranged ' +
        'around three dates you do not control: the day the property is empty, the day the check-out ' +
        'appointment is booked for, and the day the keys go back. The clean has to sit between the ' +
        'first two, ideally with a clear day behind it, and there is no version of it that can slide ' +
        'into the following week. So the first thing we ask for is not the size of the property. It ' +
        'is the appointment.',
    },
    {
      type: 'p',
      text:
        'The second thing is a description, and unlike most quotes it can be done over the phone, ' +
        'because the standard here does not vary from one household to the next. There is very little ' +
        'to interpret: how many bedrooms and bathrooms, whether it is furnished, whether a carpet ' +
        'wants a machine, what state the oven is in, and whether the property will be genuinely ' +
        'empty. Those five answers are most of a quote. If the oven has been left to itself for the ' +
        'whole tenancy, that belongs in the description rather than in the surprise.',
    },
    {
      type: 'p',
      text:
        'Two other things are worth a sentence now. Some agents issue a cleaning standard as a ' +
        'document, and if you have been sent one, send it on rather than summarising it, because now ' +
        'and again it asks for something that is not cleaning at all. And tell us whether the water ' +
        'and the power will still be connected, since both are decided by an account being closed ' +
        'rather than by anybody\'s arrangements, and a property with the supply off cannot be cleaned.',
    },
  ],

  // 1 — the team, sized backwards from a clock, for a customer who is not there.
  [
    { type: 'h3', text: 'Who arrives, and why the number is worked back from your appointment' },
    {
      type: 'p',
      text:
        'A team on this job is sized backwards from a time somebody else has set. If the check-out is ' +
        'at ten tomorrow morning then the property has to be finished tonight, and how many people ' +
        'come follows from that rather than from how many bedrooms there are. A property that would ' +
        'take one person two comfortable days gets three people for one day, because the second day ' +
        'does not exist. That is the whole of the arithmetic, and it is why we want the appointment ' +
        'before we say who is coming.',
    },
    {
      type: 'p',
      text:
        'The other thing shaping it is that you are usually not there, and often not in the area any ' +
        'more. Nobody is walking round with us pointing at things and there is nobody in the next ' +
        'room to ask. So what would ordinarily be a conversation on the day has to be a written scope ' +
        'settled beforehand, one person on the team owns that scope, and anything that comes up goes ' +
        'to you as a message with a photograph attached.',
    },
    {
      type: 'p',
      text:
        'Vetting and insurance are not the interesting part of this, and they are not optional either, ' +
        'so: everybody who comes has been through both. What is particular to this job is the ' +
        'position it puts us in. We are inside a building nobody lives in, holding a key that came ' +
        "over an agent's counter, and we are the last people in there before somebody arrives to " +
        'inspect it. So the day ends in writing rather than on a doorstep: who was in the property, ' +
        'the time it was locked, and where the keys went afterwards. Nobody should have to take any ' +
        'of that on trust about a house they are no longer standing in.',
    },
  ],

  // 2 — the sequence: one dry pass down the building, one wet pass back up it.
  [
    { type: 'h3', text: 'Two passes through an empty property: everything dry, then everything wet' },
    {
      type: 'p',
      text:
        'An empty property is worked in two passes rather than room by room, and the first has no ' +
        'water in it at all. It starts at the top of the building and goes through every room, ' +
        'cupboard, drawer and shelf, taking out whatever is still in them and taking down the loose ' +
        'material — and there is a great deal of it: furniture dragged out of a house brings down ' +
        'more dust in an hour than a month of living in it. All of that leaves the building ' +
        'before anything gets wet. Wet dust is mud, and mud on a skirting board is a job made twice.',
    },
    {
      type: 'p',
      text:
        'The second pass is the wet one and it runs the other way, from the bottom of the building ' +
        'upwards. That is deliberately the opposite of how a lived-in house gets cleaned, where the ' +
        'argument for working downwards is that whatever comes off the high surfaces has to land ' +
        'somewhere. Here the high surfaces have already been done dry, so what decides the order ' +
        'instead is where water gets filled and emptied, and which floors get walked on last.',
    },
    {
      type: 'p',
      text:
        'So the kitchen is where the wet pass starts and where it ends, since it is in use all day. ' +
        'And the ' +
        'floors are last, working out of the building, because the difference between this job and ' +
        'every other one is what happens next: the door is locked and nobody walks on any of it ' +
        'again. A floor finished at four in an empty property is exactly as good at ten the following ' +
        'morning, which is when it is being looked at.',
    },
  ],

  // 3 — a property stripped of every consumable, and everything leaving in the van.
  [
    { type: 'h3', text: 'Arriving at a property with nothing left in it' },
    {
      type: 'p',
      text:
        'By the time we arrive the property has been emptied of everything, including all the things ' +
        'a cleaner would ordinarily borrow without thinking. There is no bin and no bag. No hand ' +
        'towel, no kitchen roll, no washing-up liquid, no ladder, and often no ' +
        'bulb in the fitting on the landing because the lamps went with the furniture. Sometimes ' +
        'there is no light at all, because the account has already been closed. So the van arrives ' +
        'self-contained: water carriers in case the supply has gone, a work light, a step, our own ' +
        'sacks, and enough of everything that nothing has to be improvised.',
    },
    {
      type: 'p',
      text:
        'Everything leaves with us as well. There is no ' +
        'collection to put anything in and no bin to leave anything in, so the dust, the dirty water, ' +
        'the used cloths, the packaging and whatever the final days of a move left behind in the ' +
        'kitchen all go into the van. A property we have finished has nothing of ours in it and ' +
        'nothing waiting by the door for somebody else to deal with, because a full sack standing in ' +
        'a hallway is exactly the sort of thing that ends up in a photograph.',
    },
    {
      type: 'p',
      text:
        'Two requests, both about services rather than about cleaning. Leave the water on until after ' +
        'the appointment. And if a final reading is being taken, have it taken after us rather than ' +
        'before, or expect the figures to have moved a little, since a day of hot water and a machine ' +
        'running is a day of use. Both are easier to arrange now than to work around then.',
    },
  ],

  // 4 — the three ways in, and the one that ends the job before it starts.
  [
    { type: 'h3', text: 'Getting in when the property is not yours any more' },
    {
      type: 'p',
      text:
        'There are three ways into a property once a tenancy is ending, and each has its own way of ' +
        'going wrong. You meet us and let us in, which is the simplest and the rarest. A key comes ' +
        'out of a safe, which works until the code has been changed by whoever emptied it last. Or ' +
        'the agent holds the keys, and that is where the planning goes: an office opening at nine ' +
        'when the work needs to start at eight, a set signed out to a viewing that afternoon, and a ' +
        'form to sign at the counter before anything is handed over.',
    },
    {
      type: 'p',
      text:
        'So the way in gets settled when the job is booked rather than on the morning, and we would ' +
        'sooner ring an agent a week early than turn up and discover they have no record of us. The ' +
        'failure that ends this job before it starts is a set of keys handed back early. It is an ' +
        'easy mistake when the end of a tenancy and the move feel like the same day, and once they ' +
        'are over a counter nobody can get in.',
    },
    {
      type: 'p',
      text:
        'Whoever lets us in has often never met you and cannot answer a question about the property, ' +
        'so the questions come to you. We photograph the meters when we arrive and again when we ' +
        'leave and send you both, so you have a dated record, and we report a reading to nobody — ' +
        "that is yours to do. And a residents' permit ends with a tenancy, so if parking needs one, " +
        'say so: a team carrying kit from a street away loses time the property was meant to have.',
    },
  ],

  // 5 — the two ends of the estimate, and the doorstep call when it is not the job described.
  [
    { type: 'h3', text: 'One day, two days, or a call from the doorstep' },
    {
      type: 'p',
      text:
        'The two ends of this are further apart than people expect. An empty two-bedroom flat with a ' +
        'clean oven and almost no carpet is comfortably a day for two people. A furnished ' +
        'four-bedroom house where the oven has had a whole tenancy of use, with two bathrooms and ' +
        'every piece of furniture a line on an inventory, is two days or a bigger team. None of it is ' +
        'about how quickly anybody works; it is about how many separate items are in the building.',
    },
    {
      type: 'p',
      text:
        'When a day turns out to be short, this job cannot do what other cleaning jobs do. There is ' +
        'no next visit and no coming back in the morning, because in the morning the property is ' +
        'being inspected. So the answer is people rather than priorities: another pair of hands that ' +
        'afternoon rather than an agreed list of things to leave out. Leaving things out is how a ' +
        'report comes to be written about the room that ran out of time.',
    },
    {
      type: 'p',
      text:
        'The limit is the case where the property is not the job that was described at all. Furniture ' +
        'still in it. A fridge switched off a fortnight ago and never emptied. A room locked and ' +
        'nobody with a key. None of those is more cleaning; each is a different job with different ' +
        'hours in it, so it is a call from the doorstep and a decision made with you before anything ' +
        'is touched. What we do not do is start quietly, run out of the day and hand back a ' +
        'property half finished with an explanation attached.',
    },
  ],

  // 6 — the deliverable is evidence: a dated set of images and a written list.
  [
    { type: 'h3', text: 'What we photograph before we lock up, and what you are left holding' },
    {
      type: 'p',
      text:
        'What you actually want from this job is not a clean property. It is a clean property and ' +
        'something that shows it was clean when we left, because between our locking the door and ' +
        'somebody opening it with a camera there is usually a day or two in which nobody is ' +
        'responsible for the place. So the final thing that happens before the door is locked is a set ' +
        'of photographs, taken a room at a time and at roughly the distance an inspection works at, ' +
        'and you get all of them the same evening. They are dated, they are taken before anybody else ' +
        'has been in, and they cost us twenty minutes.',
    },
    {
      type: 'p',
      text:
        'They are taken on dry surfaces with the lights on, and the awkward ones are taken on ' +
        'purpose: inside the oven with the door open, a shower screen from the side, the tops of the ' +
        'doors, the floor where the sofa stood. Anywhere that would not come further is photographed ' +
        'too, beside a note of what it is. A record showing only the good half of a property is not ' +
        'much of a record, and the half we could not change is the half most worth having a date ' +
        'against.',
    },
    {
      type: 'p',
      text:
        'Alongside the images comes a short written list in two parts: what was already damaged, ' +
        'missing or worn when we arrived, room by room, and what we could not bring further, with the ' +
        'reason for each. That is all of it. There is no ticked sheet and no certificate, because a ' +
        'certificate would be us grading our own work, and it is not our grade that counts.',
    },
  ],

  // 7 — the gap before the appointment, the appointment itself, and the three kinds of finding.
  [
    { type: 'h3', text: 'After the door is locked: the gap, the appointment, and what follows' },
    {
      type: 'p',
      text:
        'There is a gap and it is worth understanding who owns it. From the moment the property is ' +
        'locked until somebody arrives with a camera, nobody is in it and the photographs are still ' +
        'true. If anybody does go in — you for a last bag, a trades visit the landlord arranged — ' +
        'part of it is not true any more, which is no disaster as long as somebody says so. A hall ' +
        'walked over in wet weather is ten minutes of work if we know, and an unexplained set of ' +
        'prints if we do not.',
    },
    {
      type: 'p',
      text:
        'We are not at the appointment and we will not contact the agent. That surprises people, and ' +
        'the reason is plain: the tenancy is yours and the deposit is yours, and a cleaner writing to ' +
        'an agent adds a third party to a conversation with room for two. What we will do is answer ' +
        'anything you ask about what we did, in writing, including what was recorded as not ours ' +
        'before we started.',
    },
    {
      type: 'p',
      text:
        'Afterwards there are three kinds of finding and they are not treated alike. Something ' +
        'already on the list we handed you is answered, which is why the list exists. Something that ' +
        'was never cleaning — a mark on a wall, a missing shelf, the garden — we will say so, in ' +
        'writing if that helps. And something that is cleaning, in a room nobody has used since we ' +
        'were in it, is ours to look at, and better heard in the days after the appointment while ' +
        'everybody can still tell what happened when. What we will not come ' +
        'back for is a property that has been lived in, emptied or worked in since we left it.',
    },
  ],
];
