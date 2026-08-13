---
phase: 03-programmatic-location-service-engine
plan: 05
subsystem: content
tags: [copy-deck, content-depth, similarity-gate, tf-idf, longest-shared-run, combo-pages, end-of-tenancy]

# Dependency graph
requires:
  - phase: 02-page-templates-and-content
    provides: "the authored block shape fixed by web/content/blocks.jsx, the services.js prose-deck house style and module-header conventions, the ~1,000-word move-out-cleaning parent record this deck must not restate, and process.js as the shared band excluded from the counted corpus"
  - phase: 03-programmatic-location-service-engine
    plan: 03
    provides: "the variant-deck file layout, the positional-index docblock, and the services.js control corpus that fixes the vacuous-sibling-sweep problem"
  - phase: 03-programmatic-location-service-engine
    plan: 04
    provides: "the longest-shared-contiguous-run metric, which is the only one of the three that catches a lifted heading or sentence, and the finding that the B-grid is where structurally parallel decks converge"
provides:
  - "web/content/variants/end-of-tenancy-cleaning.js — A_VARIANTS[8], the service-detail block (block 3) for every end-of-tenancy combo page, town-independent"
  - "B_VARIANTS[8] — the how-the-job-runs block (block 4) for the same pages, orthogonal to A_VARIANTS by construction"
  - "The editorial half of the §13-S intent-duplication fix: this deck is written for a tenant with a deposit at stake, leaving the owner-occupier vocabulary entirely to plan 03-09's move-out deck"
  - "The third of the seven variant decks, and the first to sweep against two siblings rather than one or zero"
  - "A measured demonstration that a lifted trust claim survives every planned gate: the vetting-and-insurance sentence shared a 10-token run with the sibling deck AND an 8-token run with services.js, while measuring 0.0117 Jaccard"
affects: [03-09-move-out-deck, 03-14-taxonomy-rename, 03-17-cross-deck-sweep, 03-21-combo-template, 03-23-blanket-lock-assertions, 03-16-towns-data-module]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Measure four things, not the one that is gated: 5-gram Jaccard (lexical), TF-IDF cosine (sees paraphrase), longest shared contiguous run (sees a lifted sentence or heading that Jaccard dilutes to nothing), and headings on their own because they are rendered text"
    - "Sweep headings against services.js headings, not just its prose. This plan's B5 sub-heading shared a 7-token run with a rendered services.js h2 — 'How long it takes, and what happens on the day' — and no gate in any of the three variant plans faces that direction"
    - "A generic trust claim is the highest-risk sentence in a copy deck, because every deck wants to make it and there is only one natural way to say it. The DBS-and-insurance sentence was near-verbatim in three places in this repo before this plan"
    - "The axis that keeps this B-grid apart from its siblings is a deadline somebody else set. A round can run late and a one-off can be finished differently tomorrow; an end-of-tenancy day cannot, because the property stops being reachable at a time nobody here chose"
    - "On this service the deliverable is evidence rather than a standard, which gives the A deck its angle too: the document, not the finding"

key-files:
  created: [web/content/variants/end-of-tenancy-cleaning.js]
  modified: []

key-decisions:
  - "The A deck is organised around the check-out DOCUMENT and around fittings nobody lists, because the parent services.js record already covers the report, the oven, the difference from a deep clean, the timing and what happens if the agent comes back. A0 is the shape of the document and who reads it rather than what gets flagged; A1 is the oven as a photographed object rather than as a chemistry problem, which is the deep-cleaning deck's angle"
  - "A1 argues the oven is finished LAST, which is the deliberate opposite of the deep-cleaning deck's B2 (the oven soak starts within ten minutes). Both are correct for their service and the divergence is the point: a lived-in deep clean is chemistry-led, an empty handover is evidence-led, and a door glass that shows a fingerprint from across the room belongs with the rest of the glass"
  - "A3 names etched glass, perished sealant and a dead fan WITHOUT explaining any of them, because the deep-cleaning deck explains all three at length. Here they are things that get photographed and written down before work starts, so what could not be changed sits on a dated record. The deck records the material; the sibling explains it"
  - "A5's list is the forgotten inventory — loft, meter cupboard, bins, shed, letter plate, keys — rather than window frames, drainage slots and trickle vents, which the deep-cleaning deck owns. Windows get three sentences and the rest of the passage is the second category of miss on a last day"
  - "B2 is two passes (everything dry, then everything wet) rather than a room order. Both siblings argue room order, and following their brief would have produced a third room-order argument. This one justifies the plan's bottom-up instruction honestly: the high surfaces were already done dry, so what decides the wet order is where water is filled and emptied and which floors get walked on last"
  - "B7 does not restate the parent's remedy paragraph, and does not invent one. process.js records its remedy wording as awaiting Sam, and the parent page already commits to coming back. So B7 divides the aftermath into three kinds of finding, states that we do not contact the agent because the tenancy and the deposit are the reader's, and names what we will not come back for — with no time window and no re-clean commitment"
  - "No claim anywhere about what an agent or a landlord will decide. T-03-06 makes this a correctness requirement on this service specifically, and A0, A4 and A7 each say so explicitly rather than hedging once in the header"

patterns-established:
  - "Trim the first grid to the file's word band BEFORE writing the second. A_VARIANTS came in at 3,255 words against a 4,200-5,200 file band; caught at the end of task 1 it is an eight-passage edit, caught at the end of task 2 it is a sixteen-passage rewrite"
  - "Report the converging region and name the pair even when it passes. mine B1 vs deep-cleaning's B1 at 0.1785 cosine is this deck's honest headline, and it is the pair 03-17 should read first"

requirements-completed: []

# Metrics
duration: 44min
completed: 2026-08-13
---

# Phase 03 Plan 05: End-of-Tenancy Variant Grid Summary

The 8×8 copy grid for end of tenancy cleaning — sixteen passages, 5,165 authored words, written for a
tenant with a deposit at stake rather than for anybody handing over a house they own. It measures
0.0016 worst 5-gram Jaccard and 0.0724 mean TF-IDF cosine across all 120 internal pairs, and it
found five convergence defects that every gate the plan specifies passed on, including a sentence
that was near-verbatim in **three** places in this repo at once.

## What Was Built

`web/content/variants/end-of-tenancy-cleaning.js` (787 lines, one new file, nothing modified).

**`A_VARIANTS[8]`** — block 3, service detail. Each entry is one section heading, two paragraphs and
one list of five to seven items. Eight subjects, in index order:

| `a` | Heading | Subject |
|---|---|---|
| 0 | What an inspection is, and the words that end up on the report | the document as a template, and the third party who reads it |
| 1 | The oven, and why it is the last thing we finish | the oven as a photographed object, and three reasons it goes last |
| 2 | The kitchen an empty property finally lets you get behind | the back and the bottom of a bare room, and how it goes back |
| 3 | The bathroom is where an inspection slows right down | nothing changes after us, so the limits go on a dated record |
| 4 | Floors with the furniture gone, and the marks that stay behind | a map of where things stood, and drying time as the constraint |
| 5 | Windows, and the places a last day forgets | the loft, the meters, the bins, the shed — and the swapped fittings |
| 6 | An empty let and a furnished one are two different jobs | furniture as the work rather than the obstacle |
| 7 | The findings a clean cannot answer for | the report's other headings, and a list two weeks too early to be an argument |

**`B_VARIANTS[8]`** — block 4, how the job runs. Each entry is one sub-heading and three paragraphs,
no list. Eight stages of one fixed day:

| `b` | Heading | Stage |
|---|---|---|
| 0 | Booking the clean into dates that are already fixed | three dates nobody controls, and the five answers that make a quote |
| 1 | Who arrives, and why the number is worked back from your appointment | sized backwards from a clock, for a customer who is not there |
| 2 | Two passes through an empty property: everything dry, then everything wet | one dry pass down the building, one wet pass back up it |
| 3 | Arriving at a property with nothing left in it | no bin, no bulb, no supply — and everything leaving in the van |
| 4 | Getting in when the property is not yours any more | three ways in, and the one that ends the job before it starts |
| 5 | One day, two days, or a call from the doorstep | adding people rather than dropping work, and the doorstep call |
| 6 | What we photograph before we lock up, and what you are left holding | the deliverable is a dated set of images and a written list |
| 7 | After the door is locked: the gap, the appointment, and what follows | who owns the gap, why we do not contact the agent, three findings |

**The editorial split is the point of this file, and it is stated in the header as a hard rule.**
This concept and `move-out-cleaning` are one UK query intent that 36 frozen legacy pages already
compete for. The structural fix is §13-S and belongs to the data plan; the editorial half is that
this deck's vocabulary is *tenancy, check-out, inventory, agent, landlord, deposit* and it contains
no reference to buying, selling, a chain, the day such a transaction closes, or the professionals
involved in one. Plan 03-09 gets the whole owner-occupier vocabulary to itself.

## Measurements

**Word counts** (the two arrays the plan asked to be recorded):

```
A words: [346, 346, 366, 368, 370, 364, 386, 355]   sum 2,901   floor 280
B words: [277, 297, 279, 273, 286, 272, 283, 297]   sum 2,264   floor 240
file total: 5,165 authored words (band 4,200–5,200, 35 words of margin)
```

**Distinctness — four metrics, because each is blind to what the next one sees:**

| Cohort | Pairs | 5-gram Jaccard | TF-IDF cosine |
|---|---|---|---|
| Within `A_VARIANTS` | 28 | worst **0.0000** | mean 0.0626, worst 0.1041 (A1 vs A5) |
| Within `B_VARIANTS` | 28 | worst **0.0000** | mean 0.0876, worst 0.1768 (B1 vs B7) |
| Cross-grid `A` vs `B` | 64 | worst **0.0016** (A7 vs B4) | mean 0.0701, worst 0.1251 |
| All 16 passages | 120 | worst **0.0016** | mean **0.0724**, worst 0.1768 |

**0.0724 is the figure that matters.** A paraphrase deck measures 0.736 on this metric while sitting
near 0.05 on Jaccard and passing the lexical gate; genuinely distinct decks measure a per-deck mean
of 0.069 to 0.118. This deck sits at 0.0724, between 03-03's 0.0709 and 03-04's 0.0786. Every
Jaccard figure is nearly two orders of magnitude under the 0.10 ceiling.

**Longest shared contiguous run — the metric that found this plan's real defects:**

| Cohort | Longest run | What it is |
|---|---|---|
| Internal, all 120 pairs | **5** | function words |
| vs `deep-cleaning.js`, 256 pairs | **5** | function words |
| vs `domestic-cleaning.js`, 256 pairs | **5** | function words |
| vs all six `services.js` prose decks, 96 pairs | **5** | `"the list below is the"` |
| vs `process.js` (`PROCESS_STEPS`), 16 pairs | **2** | — |
| all 16 headings vs all sibling and `services.js` headings | **0 runs of 4+** | — |

Nothing content-bearing is shared with either sibling deck, with the parent service page, with the
shared process band, or with any rendered heading in the repo. All sixteen headings are unique and
distinct from the 32 already shipped in this directory.

**The sibling sweep, run twice as instructed and once more than instructed:**

```
compared against 2 sibling deck(s); worst cross-deck J 0.003 domestic-cleaning.js #3 vs mine #14
```

That is 512 real pairs. Both siblings had landed, so this is the first non-vacuous two-deck run;
03-03 recorded 0 decks and 03-04 recorded 1.

| Cohort | Pairs | 5-gram Jaccard | TF-IDF cosine |
|---|---|---|---|
| This deck × `deep-cleaning.js` | 256 | worst 0.0018 (B6 vs B6) | mean 0.0642, worst **0.1785** (B1 vs B1) |
| This deck × `domestic-cleaning.js` | 256 | worst 0.0034 (B6 vs A3) | mean 0.0649, worst 0.1650 (B1 vs B1) |

**0.1785 is reported rather than buried.** It is the highest figure anywhere in this plan and it sits
in exactly the region 03-04 predicted: `B1 × B1`, who-arrives against who-arrives, for two services.
It is below 03-04's own worst of 0.230 and nowhere near the 0.736 paraphrase signature. It was
**0.1977** before deviation 3 removed the shared trust sentence and deviation 5 removed the shared
"roughly when" move.

**The `services.js` control, which the plan does not ask for:**

| Control | Pairs | Worst 5-gram J |
|---|---|---|
| All 16 passages × all six shipped `services.js` prose decks | 96 | **0.0016** (`A7` vs `move-out-cleaning`) |
| All 16 passages × `process.js` | 16 | **0.0000** |

`0.0016` against the **parent record** is the number to look at, because `move-out-cleaning` is this
concept's own service page — the single most likely collision in the repo, and the one plan 03-14
renames to this deck's slug. It is lower than 03-03's 0.0088 and comparable to 03-04's 0.0018,
and it took three rounds of fixes to get there (deviations 3, 4 and 6).

**Grep gates, over the whole file including comments:**

| Grep | Required | Result |
|---|---|---|
| the 17 town and county names | 0 | **0** |
| scoped postcode districts `\b(B\|CV\|DY\|TF\|WS\|WV\|WR\|ST\|SY\|OX\|NN)[0-9]{1,2}[A-Z]?\b` | 0 | **0** |
| price / 5-digit run / email-shaped | 0 | **0** |
| `type: 'h1'` | 0 | **0** |
| `&amp;` | 0 | **0** |
| `type: 'h2'` | 8 | **8** |
| `type: 'h3'` | 8 | **8** |
| audience: `deposit\|check-out\|inventory\|tenancy` | ≥ 4 | **21** |
| owner-occupier: `completion day\|solicitor\|removal van` | 0 | **0** |
| US vocabulary and dead CTA phrases (case-insensitive) | 0 | **0** |
| the client directive (case-insensitive) | 0 | **0** |
| a heading opening `End of Tenancy Cleaning in ` | 0 | **0** |
| smart quote characters | 0 | **0** |

The only non-ASCII character in the file is the em dash (52 of them), which is what `services.js`
and both siblings use.

**Suite, unmoved as required:** `npm run verify` exit **0** — **21** design-system lock tests, **39**
built-HTML locks, **19** prerendered routes, JS 129.8 KB / 500 KB, CSS one shared 4.8 KB file, worst
page 299.5 KB / 1024 KB. Identical to the stated baseline in all five figures, which is the correct
result: nothing imports this module yet. `git diff --stat` touched exactly one file across both
commits, with no deletions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The module header failed a gate that polices it — twice over**

- **Found during:** Task 1, writing the header
- **Issue:** Two instances of the same trap. First the familiar one: documenting the block shape in
  `services.js` house style puts a ninth `type: 'h2'`, a ninth `type: 'h3'` and a first `type: 'h1'`
  into the file, taking three acceptance greps to 9/9/1 against a required 8/8/0. Second, and new to
  this plan: the header's paragraph explaining the editorial split from the owner-occupier deck
  originally listed the vocabulary it was banning, including the word for the professional who
  handles a house sale. `grep -Eic 'completion day|solicitor|removal van'` is an acceptance criterion
  required to return **0** and it returned **1** — the header's own prohibition was the only violation
  of it in the file.
- **Fix:** The block shape is described in words and points at `blocks.jsx` for the literals. The
  banned vocabulary is now described rather than listed ("about buying or selling a house, about a
  chain, about the day such a transaction closes, or about the professionals and the lorries involved
  in one"), with a sentence saying why it is described rather than listed. This is the sixteenth
  instance in this repo and the first to fire on a content grep rather than a structural one.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commit:** 27dc0a4

**2. [Rule 1 - Bug] `A_VARIANTS` overshot the file's word band by enough to make it unfixable later**

- **Found during:** Task 1 verification
- **Issue:** The eight A entries came in at 378–431 words each, 3,255 total. Every entry cleared its
  own 280-word floor, so the plan's task-1 verify passed. But the file band is 4,200–5,200 and eight
  B entries at their own target would have taken the total to roughly 5,600 — a gate that only
  measures at the end of task 2, by which point the fix is a sixteen-passage rewrite. 03-04 recorded
  the same finding and its advice was followed.
- **Fix:** Every A entry trimmed to 346–386 by cutting whole sentences and list items that another
  block already covered, not by trimming clauses — the mattress and cushion sentences in A6 duplicated
  its own list, A4's grit example was also a list item. Total fell to 2,901. `B_VARIANTS` then landed
  at 2,348 for a total of 5,251, still 51 over, and five B passages were trimmed a second time. Final
  total 5,165.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commits:** 27dc0a4, 9dd7838

**3. [Rule 2 - Missing critical functionality] One sentence was near-verbatim in three places in this repo**

- **Found during:** Task 2, running the longest-shared-run control
- **Issue:** `B1`'s vetting-and-insurance sentence read "Everyone working for us is checked before
  their first job and we are insured for work inside a property." `domestic-cleaning.js` `B1` reads
  "Everyone who works for us is checked before their first job and we carry insurance for the work we
  do inside your home", and `services.js`'s `standard-home-cleaning` record carries the same claim in
  the same words. That is a **10-token contiguous run** with the sibling deck and an **8-token run**
  with a live service page. Every gate in the plan passed on it: the pair measured 0.0117 5-gram
  Jaccard. It would have shipped as an invisible near-duplicate across a service page, 58
  domestic-cleaning combo pages and 58 of these. The cause is structural — a generic trust claim is
  the one sentence every deck wants to make and there is only one natural way to say it.
- **Fix:** The claim is kept, because it is true and load-bearing, but it is now made in one clause
  and the paragraph spends its words on what is particular to this job: "We are inside a building
  nobody lives in, holding a key that came over an agent's counter, and we are the last people in
  there before somebody arrives to inspect it." Longest run with the sibling fell from 10 to 5, and
  the remaining 5 are function words. Cosine on that pair fell from 0.1977 to 0.1785.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commit:** 9dd7838

**4. [Rule 2 - Missing critical functionality] A sub-heading collided with a rendered `services.js` heading**

- **Found during:** Task 2, extending the longest-run control to headings and to `services.js`
- **Issue:** `B5`'s sub-heading was *How long it takes, and what happens if the property is worse than
  described*. `services.js`'s `deep-cleaning` record ships an `<h2>` reading *How long it takes, and
  what happens on the day* — a **7-token shared run** between two pieces of **visible heading text**,
  one on a service page and one on 58 combo pages. It also shared a 5-token run with
  `deep-cleaning.js`'s `B5` heading. 03-04's worst defect was a heading against a sibling deck; this
  is the same defect against the parent corpus, and neither that plan's gates nor this one's face
  that direction.
- **Fix:** Renamed to *One day, two days, or a call from the doorstep*, which is also a better
  description of the passage — its argument is that this job adds people rather than dropping work,
  and that anything worse than the description is a doorstep call rather than a quiet overrun. A
  heading-level sweep now reports no shared run of 4 or more tokens against any of the 32 sibling
  headings or any `services.js` heading.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commit:** 9dd7838

**5. [Rule 1 - Bug] Three more shared runs with the siblings, one of them a whole argument**

- **Found during:** Tasks 1 and 2, running the longest-run control against both siblings
- **Issue:** `A3` contained "finished dry rather than left to", a 6-token run with
  `domestic-cleaning.js`'s `A1` list item "Bath, basin and overflow finished dry rather than left to
  spot" — two bathroom passages, both rendered. `B6` shared "the last part of the day" and "room by
  room in the order" with `deep-cleaning.js`'s `B6`, which is the same end-of-day passage for another
  service. And `B1`'s closing move ("roughly when they expect to be finished") was
  `deep-cleaning.js`'s `B1` closing move ("You are told how many to expect and roughly when").
- **Fix:** `A3` now says every surface is dried by hand before we leave the room. `B6` opens on "the
  final thing that happens before the door is locked" and photographs "a room at a time". `B1` closes
  on something neither sibling has: the day ends in writing rather than on a doorstep, with who was in
  the property, the time it was locked and where the keys went — which fits this deck's evidence theme
  without duplicating `B6`'s photographs. `what we will not do is` was also varied, since it appeared
  in both siblings and twice here.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commits:** 27dc0a4, 9dd7838

**6. [Rule 1 - Bug] Five phrases lifted from the parent service page and its neighbour**

- **Found during:** Task 2, running the longest-run control against all six `services.js` decks
- **Issue:** Six-token runs with the records this deck sits closest to. `A5` ended "and every one is
  on the inventory" against the parent's "and every one is on the report" — the same sentence shape as
  well as the same words. `A6` had "is somewhere we cannot clean and" from the parent's "anything we
  cannot move is somewhere we cannot clean". `B3` had "the last week of a move" from
  `move-in-cleaning`. `A4` had "and the rest of the property" from `post-construction-cleaning`. `A0`
  had "and we will not pretend", which is the parent's own closing phrase. None of these is a whole
  argument, but the parent record is the one page in the repo these 58 pages are guaranteed to be
  compared against.
- **Fix:** All five reworded — "all of them are on the inventory", "a patch of floor or a shelf nobody
  can get at", "the final days of a move", "everything else is arranged around it", "we do not claim
  to know what any particular agent accepts". Two internal repetitions found in the same pass were
  also fixed: "at the end of a tenancy" appeared in both `A0` and `B4`, and "with a clear day behind
  it" in both `A4` and `B0`, either of which would have rendered twice on one page.
- **Files modified:** web/content/variants/end-of-tenancy-cleaning.js
- **Commits:** 27dc0a4, 9dd7838

### Judgement calls worth flagging, not deviations

**The stage brief and the distinctness criterion pointed in opposite directions three times, and the
criterion won each time**, exactly as 03-04 predicted. `B2`'s brief asks for the order an empty
property is worked in; both siblings already argue room order, so writing the brief faithfully would
have produced a third room-order argument. It became two passes — everything dry, then everything wet
— which justifies the plan's bottom-up instruction honestly rather than asserting it. `B1`'s brief
says the team size is set by the deadline rather than the house, which is nearly `deep-cleaning`'s
one-is-rarely-enough argument; it became sized-backwards-from-an-appointment plus the fact that the
customer is usually not in the building. `A1`'s brief asks why the oven is done near the end, which
is the *opposite* of `deep-cleaning`'s oven-soak-first — so the passage states the three reasons that
are specific to an empty property and says nothing about chemistry, which is the sibling's territory.

**`A3` deliberately does not explain etched glass, perished sealant or a failed fan**, though all
three are the honest limits of the room, because `deep-cleaning`'s `A1` and `A5` explain all three at
length. Here they are named in a single clause as things that get photographed and written down
before work starts. That is a real editorial cost — this passage is thinner on material science than
it could be — paid to keep 58 pages from reading like 58 other pages.

## Authentication Gates

None.

## Known Stubs

None. Both exports are complete at eight entries each. The module is not imported by any route yet,
by design — 03-21 builds the combo template and 03-17 composes the decks against `towns.js`.

## Threat Flags

None. The plan's register lists T-03-05 (information disclosure through authored prose), T-03-06
(claims about deposits and reports) and T-03-SC (package installs). All three are mitigated and none
is a new surface. There is no address, postcode, district, phone number, email or price in the copy
or the comments, and no number in the file is a statistic. T-03-06 is the one that needed real care
on this service: `A0` says the report's grading is not ours to decide and that we do not claim to know
what any particular agent accepts; `A4` says we do not decide what counts as ordinary use of a floor
over three years; `A7` says we make no claim about how any finding will be treated or whether it will
be raised at all. No passage states a remedy window, a return visit or a re-clean commitment, because
`process.js` records that wording as still awaiting Sam — and `B7` names what we will not come back
for instead of what we will. This plan installed nothing.

## Requirements

**Deliberately none marked complete**, on the same reasoning 03-03 and 03-04 recorded. The
frontmatter claims `REQ-content-depth-bar`, `REQ-canonical-service-taxonomy` and
`REQ-programmatic-page-scale`. None is satisfied by a copy deck that no page renders: the depth bar
is a measurement over built HTML, the page scale is a route count, and the taxonomy requirement is
satisfied by the slug rename and the redirect map in 03-14, not by prose. `REQUIREMENTS.md` was not
touched, and neither was `STATE.md`.

## For the Next Plan

- **03-09 owns the other half of this file's reason for existing.** This deck has taken the tenant
  vocabulary — tenancy, check-out, inventory, agent, landlord, deposit — and has deliberately left
  buying, selling, chains, the day a transaction closes and the professionals involved in one
  entirely alone. Write that deck for somebody handing over a house they own, and check it against
  this one first: `move-out` and `end-of-tenancy` are one query intent, so those two decks are the
  most likely pair in the whole grid to converge, and 03-17's sweep will measure all 256 of their
  cross pairs.
- **03-06 through 03-08:** four checks the plan's gates will not run for you. **(1)** Your sixteen
  headings against every sibling deck's headings **and against every `services.js` heading** — this
  plan's fourth defect was a sub-heading colliding with a rendered service-page `<h2>`, which no
  variant plan's criteria face. **(2)** The longest shared contiguous run, not just Jaccard, against
  both siblings and all six `services.js` decks. **(3)** Your generic trust claim — the DBS and
  insurance sentence, the "everything arrives with the cleaner" sentence, the "say what is delicate
  beforehand" sentence. These are the sentences with one natural wording and they are already in the
  repo two or three times each. **(4)** Your total word count against the 4,200–5,200 band before you
  write the second grid.
- **03-14** renames `services.js`'s `move-out-cleaning` record to this deck's slug and migrates its
  `Get the deposit back` eyebrow. This deck does not restate that record — worst 5-gram Jaccard
  0.0016 against it — but it is written on the assumption that the record still exists as the parent.
- **03-17 task 1** now has three of seven decks. The pair to read first is `B1 × B1` between this
  deck and `deep-cleaning.js` at 0.1785 cosine, and the region to read first is `B × B`, which is
  where all three decks' worst cross figures have landed so far.
- **03-21** consumes `A_VARIANTS[a]` and `B_VARIANTS[b]`. Both are plain arrays of block arrays,
  directly renderable by `renderBlocks`. The `B` heading is one level below the `A` heading and both
  land inside the same prose container.

## Self-Check: PASSED

- `web/content/variants/end-of-tenancy-cleaning.js` — FOUND (787 lines, ≥ 200 required)
- Exports `A_VARIANTS` and `B_VARIANTS`, both length 8 — FOUND, verified by module import
- Commit `27dc0a4` — FOUND in `git log`
- Commit `9dd7838` — FOUND in `git log`
- Both of the plan's `<verify>` commands — exit 0
- The plan's cross-deck sweep command — exit 0, `compared against 2 sibling deck(s)`
- All thirteen acceptance greps — required values met
- `npm run verify` — exit 0, 21 + 39 tests, 19 routes, 129.8 KB JS, 299.5 KB worst page
- `git diff --stat` — exactly one file touched across both commits, no deletions
- `STATE.md` — not read, not written, no `state.*` or `requirements.*` helper invoked
