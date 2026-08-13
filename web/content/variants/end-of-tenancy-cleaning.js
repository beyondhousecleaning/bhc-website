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
        'The clean at the end of a tenancy is the only one anybody writes down. Somebody walks the ' +
        'property with a camera and a printed template, room by room, and produces a document that ' +
        'is then read by people who never stood in it — you, the agent, a landlord who may live ' +
        'nowhere near, possibly somebody settling a disagreement months afterwards. That changes ' +
        'what the job is. A home people are living in gets judged by how it feels. An empty property ' +
        'at the end of a tenancy gets judged by a close photograph lit by a phone flash, taken by ' +
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
        'standard is a remark on thoroughness rather than on mess. None of it is ours to decide and ' +
        'we will not pretend to know what any particular agent accepts. What we can do is work to the ' +
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
        'reads worse than dry carpet that was only hoovered. So it goes first in the sequence with a ' +
        'clear day behind it and the rest of the property is arranged around that. Where a mark is in ' +
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
        'those is anywhere near a hoover in an ordinary week, and every one is on the inventory.',
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
        'hangers that turn out to be yours after all. Each of those is somewhere we cannot clean and ' +
        'somebody else has to shift, and a bag standing in a hallway is the easiest line on a report ' +
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
