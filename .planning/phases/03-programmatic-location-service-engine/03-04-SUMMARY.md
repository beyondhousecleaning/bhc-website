---
phase: 03-programmatic-location-service-engine
plan: 04
subsystem: content
tags: [copy-deck, content-depth, similarity-gate, tf-idf, combo-pages, deep-cleaning]

# Dependency graph
requires:
  - phase: 02-page-templates-and-content
    provides: "the authored block shape fixed by web/content/blocks.jsx, the services.js prose-deck house style and module-header conventions, the ~1,000-word deep-cleaning parent record these passages must not restate, and process.js as the shared band excluded from the counted corpus"
  - phase: 03-programmatic-location-service-engine
    plan: 03
    provides: "the variant-deck file layout, the vacuous-sibling-sweep problem and the services.js control corpus that fixes it, and the self-matching-comment trap stated in its own header"
provides:
  - "web/content/variants/deep-cleaning.js — A_VARIANTS[8], the service-detail block (block 3) for every deep-cleaning combo page, town-independent"
  - "B_VARIANTS[8] — the how-the-job-runs block (block 4) for the same pages, orthogonal to A_VARIANTS by construction"
  - "The second of the seven variant decks, and the first evidence that the sibling sweep becomes non-vacuous as the wave lands: it compared against 1 deck, not 0"
  - "A measured demonstration that the cross-deck B-region converges: mine B6 vs the sibling's B6 measured 0.252 TF-IDF cosine on first draft, which is the failure mode 03-17 exists to catch"
affects: [03-17-cross-deck-sweep, 03-21-combo-template, 03-23-blanket-lock-assertions, 03-16-towns-data-module]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Measure three things, not the one that is gated: 5-gram Jaccard (lexical, blind to paraphrase), TF-IDF cosine (sees paraphrase), and the longest shared contiguous word run (sees a lifted sentence that Jaccard dilutes to nothing across a 350-word passage)"
    - "The longest-shared-run metric is the one that caught this plan's real defect. A shared 9-token run was an entire rendered sub-heading; at 5-gram Jaccard the same pair measured 0.015 and passed"
    - "Sub-headings are rendered output and must be swept like prose. Two decks following the same stage brief produced near-identical h3 text while every prose gate stayed green"
    - "When a plan's stage brief and the plan's own distinctness criterion disagree, the criterion wins: the brief said 'no checklist on the door' and the sibling had already taken that argument, so the passage kept the phrase and changed the reasoning"
    - "A one-off job and a standing arrangement are the axis that keeps two structurally parallel B-grids apart — per-job pricing, a team instead of continuity, and no next visit are three different arguments, not three rewordings"

key-files:
  created: [web/content/variants/deep-cleaning.js]
  modified: []

key-decisions:
  - "The module header states the block shape in words and points at blocks.jsx for the literals. Writing the four block literals in services.js house style would have put a ninth h2, a ninth h3 and a first h1 into the file, taking the three acceptance greps to 9/9/1 against a required 8/8/0 — the fourteenth instance of the self-matching-comment trap, and the header says so"
  - "A_VARIANTS is organised by material and chemistry rather than by room, because the parent service page is already organised by room (kitchen, bathrooms, bedrooms). Grouping by what a surface is made of — carbon, scale, porous cement, silicone, gasket rubber, worn enamel — is the angle the parent does not take and the reason the two do not read as the same page at different lengths"
  - "B_VARIANTS turns every stage on the job being a one-off. The sibling deck describes a round: cover, continuity, a repeating slot. None of that applies here, and that is what makes the same eight stage headings produce eight different arguments rather than eight rewordings"
  - "A7 (what a deep clean will not fix) is the passage that says no, and its list names the trade that owns each problem instead of hedging. A deck of eight enthusiasms reads as marketing, and this is the service on which a reader is most likely to be expecting a clean to undo years of wear"
  - "No remedy promise anywhere in B7. process.js records that its third step's wording is a commercial promise still awaiting Sam, so the passage says what is useful to tell us and what is not needed, and stops — it states no time window, no return visit and no re-clean commitment"
  - "B3 dropped the 'leave your own product out with a note' sentence entirely rather than rewording it. It was verbatim from the sibling deck's B3, and both the parent service page and that deck already make the point; the refusal list that is specific to a deep clean stayed"
  - "A6 leads on appliances rather than on edges. Its first draft argued the edges case — perimeter, the line along the skirting boards, the wide head that cannot reach it — which is the sibling deck's A2 argument almost exactly. The edges survive as list items; the paragraph is now what is behind a washing machine"

patterns-established:
  - "The sibling sweep is worth running even when it was expected to be vacuous. It returned 1 deck rather than 0 and produced the finding that mattered in this plan"
  - "Report the worst cross-deck figure and name the pair, even when it passes. mine B6 vs the sibling's B6 at 0.230 cosine is the honest headline for a region 03-17 will measure over 6,216 pairs"

requirements-completed: []

# Metrics
duration: 47min
completed: 2026-08-13
---

# Phase 03 Plan 04: Deep-Cleaning Variant Grid Summary

The 8×8 copy grid for deep cleaning — sixteen genuinely different passages, 5,118 authored words,
measuring 0.0049 worst 5-gram Jaccard and 0.0786 mean TF-IDF cosine across all 120 internal pairs.
The sibling sweep was not vacuous this time, and it found a defect no other gate in the plan faced:
an entire rendered sub-heading shared with the deck that shipped before it.

## What Was Built

`web/content/variants/deep-cleaning.js` (753 lines, one new file, nothing modified).

**`A_VARIANTS[8]`** — block 3, service detail. Each entry is one section heading, two paragraphs and
one list of six or seven items. Eight subjects, in index order:

| `a` | Heading | Subject |
|---|---|---|
| 0 | The oven, the hob and the hood above it | carbon as a set lacquer: strip, soak, and the three limits |
| 1 | Limescale, and the difference between scale and a stain | scale is chalk not grime — acid, dwell, and where glass has etched |
| 2 | Inside the cupboards, on top of them, and behind | the fat-and-dust varnish above eye level, and the insides |
| 3 | Washing the paintwork, which is not dusting it | the film on gloss, and the patch test matt emulsion fails |
| 4 | Windows on the inside, and the parts of a frame that hold water | the frame is the job; mould inside a gasket is a part |
| 5 | Grout, sealant and the fan: a bathroom past its limescale | three materials, three problems, and the fan that decides all three |
| 6 | The floors a routine clean holds but never resets | grout below the tile face, and what is behind an appliance |
| 7 | What a deep clean will not fix, and who to ask instead | wear, absorption, structure — and the trade that owns each |

**`B_VARIANTS[8]`** — block 4, how the job runs. Each entry is one sub-heading and three paragraphs,
no list. Eight stages of the day, orthogonal to the eight subjects above:

| `b` | Heading | Stage |
|---|---|---|
| 0 | The look round before we quote, and why a photo will not settle it | priced per job, so the state of things has to be seen |
| 1 | How many people come, and why one is rarely enough | the arithmetic of the waits, and what carries the brief |
| 2 | Why the kitchen is not the first room we do | two soaks started first, top down, and the kitchen as workroom |
| 3 | The kit a deep clean arrives with, and what will not go on a surface | chemistry and time instead of pressure; the refusal list |
| 4 | Access, and what needs to be clear before we start | the clearing the price assumes, and what will not be moved |
| 5 | How long a deep clean really takes, and what happens if a day is short | measured in ovens and bathrooms; decided before, not at four |
| 6 | The last walk round, and what counts as finished | dry surfaces, and the spoken list of what would not come further |
| 7 | Keeping it, when the next one is due, and what to tell us | uneven decay, four habits, and the one-off timing asymmetry |

The whole deck is organised around **material and chemistry** on the A axis and around **a one-off
day** on the B axis. Both choices exist to keep it away from something already in the repo: the
parent service page is organised by room, and the sibling deck is organised around a standing
arrangement.

## Measurements

**Word counts** (the two arrays the plan asked to be recorded):

```
A words: [352, 359, 353, 361, 356, 359, 362, 355]   sum 2,857   floor 280
B words: [274, 276, 276, 277, 288, 274, 292, 304]   sum 2,261   floor 240
file total: 5,118 authored words (band 4,200–5,200)
```

**Distinctness — three metrics, because each is blind to something the next one sees:**

| Cohort | Pairs | 5-gram Jaccard | TF-IDF cosine |
|---|---|---|---|
| Within `A_VARIANTS` | 28 | worst **0.0028** (5 vs 6) | mean 0.0866, worst 0.1530 (5 vs 6) |
| Within `B_VARIANTS` | 28 | worst **0.0049** (1 vs 4) | mean 0.0894, worst 0.1502 |
| Cross-grid `A` vs `B` | 64 | worst **0.006** (A2 vs B4) | mean 0.0705, worst 0.1380 |
| All 16 passages | 120 | worst **0.0049** | mean **0.0786**, worst 0.1544 |

**0.0786 is the figure that matters.** Research measured a paraphrase deck at **0.736** on this
metric while it sat near 0.05 on Jaccard and passed the gate; genuinely distinct decks measure a
per-deck mean of **0.069 to 0.118**. This deck sits inside that band. It is higher than 03-03's
0.0709, and the reason is honest rather than concerning: this deck's A axis is eight cleaning
problems, so `grout`, `surface`, `product` and `scale` recur across passages that are nonetheless
about different materials. The worst internal pair, A5 vs A6 at 0.153, is bathroom grout against
floor grout — the same word, two different arguments, and 0.0028 on Jaccard.

Every Jaccard figure is more than an order of magnitude under the 0.10 ceiling.

**The sibling sweep was NOT vacuous.** The plan explicitly licenses
`compared against 0 sibling deck(s)` as a legitimate pass, and 03-03 correctly recorded exactly
that. This run got a real comparison instead, because 03-03 landed first:

```
compared against 1 sibling deck(s); worst cross-deck J 0.005 domestic-cleaning.js #14 vs mine #14
```

That is 256 real pairs against `domestic-cleaning.js`, and the worst pair is `B6` against `B6` —
precisely the region the plan predicted, since all seven B-grids are the same eight stages of a job
for seven different services. **Plan 03-17 task 1 is still the gate that has to hold**, over all
6,216 pairs once seven decks exist; this is one seventh of it.

**Cross-deck, in both metrics:**

| Cohort | Pairs | 5-gram Jaccard | TF-IDF cosine |
|---|---|---|---|
| This deck × `domestic-cleaning.js` | 256 | worst **0.0055** (B6 vs B6) | mean 0.0722, worst **0.2297** (B6 vs B6) |

The 0.230 is reported rather than buried. It is the highest figure anywhere in this plan, it is far
from the 0.736 paraphrase signature, and it is what two decks measure when they describe the same
stage of a job for two different services after the shared arguments have been removed. It was
**0.252** before that removal (see deviation 3).

**A control the plan does not ask for, and the one that found the trap in 03-03:**

| Control | Pairs | Worst 5-gram J | Longest shared word run |
|---|---|---|---|
| All 16 passages × all six shipped `services.js` prose decks | 96 | **0.0018** (`B0` vs `move-out-cleaning`) | **6** — `"it and we will tell you"` |
| All 16 passages × `process.js` (`PROCESS_STEPS`) | 16 | **0.0000** | — |
| All 16 passages × the sibling deck's 16 | 256 | 0.0055 | **6** — `"it is and we will not"` |

Both longest runs are pure function words. Nothing content-bearing is shared with the parent service
page, with the shared process band, or with the sibling deck. The worst figure against the parent
`deep-cleaning` record specifically — the single most likely collision in the repo, since it is the
same service on the service-page side — is **0.0007**.

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
| US vocabulary and dead CTA phrases (case-insensitive) | 0 | **0** |
| the client directive (case-insensitive) | 0 | **0** |
| a heading opening `Deep Cleaning in ` | 0 | **0** |
| smart quote characters | 0 | **0** |

The only non-ASCII character in the file is the em dash, which is what `services.js` and the sibling
deck use. All sixteen headings are distinct from each other and from the sibling deck's sixteen.

**Suite, unmoved as required:** `npm run verify` exit **0** — 21 design-system lock tests, 39
built-HTML locks, **19** prerendered routes, JS 129.8 KB / 500 KB, CSS one shared 4.8 KB file, worst
page 299.5 KB / 1024 KB. Identical to the stated baseline in every figure, which is the correct
result: nothing imports this module yet. `git diff --stat` touched exactly one file.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The module header would have failed the three heading greps that police it**

- **Found during:** Task 1, writing the header
- **Issue:** The `services.js` house style documents the block shape by writing the four block
  literals out. Doing that here puts a ninth `type: 'h2'`, a ninth `type: 'h3'` and a first
  `type: 'h1'` into the file, taking this plan's three acceptance greps to 9, 9 and 1 against
  required values of 8, 8 and 0. This is the fourteenth instance of the trap, and 03-03 hit it as
  the thirteenth in this exact position.
- **Fix:** The header describes the shape in words — "a paragraph, a section heading, a sub-heading,
  or a list whose `text` field carries the ITEMS as an array of strings" — and points at
  `blocks.jsx` for the literals, saying why. The path-alias literal and every banned shape are
  named as rules rather than instanced, for the same reason.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commit:** f63a106

**2. [Rule 1 - Bug] The first draft of `A_VARIANTS` overshot the file's word band**

- **Found during:** Task 1 verification
- **Issue:** The eight A entries came in at 367–406 words each, 3,117 in total. The plan's per-entry
  floor is 280 so every entry passed, but the file band is 4,200–5,200 and eight B entries at their
  own target would have taken the total to roughly 5,300. The gate that would have failed is the one
  measured at the end of task 2, by which point the fix is a rewrite of sixteen passages rather than
  eight.
- **Fix:** Every A entry rewritten at ~355 words by cutting sentences rather than trimming clauses —
  the sentences cut were the ones a list item already covered (the plastic-blade detail in A0
  duplicated its own list) rather than substance. `B_VARIANTS` was then trimmed a second time, from
  2,415 to 2,261, when the total came in at 5,272. Final total 5,118, with 82 words of margin.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commits:** f63a106, a0268c1

**3. [Rule 2 - Missing critical functionality] A whole rendered sub-heading was shared with the sibling deck, and no gate in this plan faces that direction**

- **Found during:** Task 2, running the longest-shared-run control
- **Issue:** `B6`'s sub-heading was `The walk round at the end, and what "done" means without a tick
  sheet`. The sibling deck's `B6` is `The check at the end, and what "done" means without a
  checklist`. Those share a **9-token contiguous run**, and both are rendered as visible `<h3>`
  text — so any two pages sharing `b = 6` across the two services would have published near-
  identical sub-headings. Every gate in the plan passed on it: the pair measured **0.015** 5-gram
  Jaccard, because nine shared tokens inside two ~280-word passages dilute to nothing. Five further
  headings echoed the sibling's less severely (`Who comes … how many of them`, `The order the house
  gets worked in`, `and what gives when`, `Getting in,`, `Afterwards:`). The cause is structural
  rather than careless: both plans give their stage-6 brief in nearly the same words, and both
  executors wrote the brief into the heading.
- **Fix:** Six sub-headings reworded to be this service's own — `The last walk round, and what counts
  as finished`, `How many people come, and why one is rarely enough`, `Why the kitchen is not the
  first room we do`, `Access, and what needs to be clear before we start`, `How long a deep clean
  really takes, and what happens if a day is short`, `Keeping it, when the next one is due, and what
  to tell us`. Longest shared run with the sibling deck fell from 9 to 6, and the remaining 6 is
  `"it is and we will not"`.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commit:** a0268c1

**4. [Rule 2 - Missing critical functionality] `B6`'s prose restated the sibling's argument in different words**

- **Found during:** Task 2, running the cross-deck TF-IDF cosine
- **Issue:** `B6` measured **0.252** cosine against the sibling deck's `B6`, the highest figure
  anywhere in this plan. Reading the pair, two of its three moves were the sibling's: glass checked
  against the light to tell dried from wiped, and the argument that a ticked list can be entirely
  true while a house is still wrong. That second one is the sibling's reasoning restated — exactly
  the paraphrase failure the depth bar exists to prevent, arriving from a direction the plan's own
  gates do not face. The plan's stage-6 brief asks for `what "done" means when there is no checklist
  on the door`, so following the brief is what produced it.
- **Fix:** Both moves replaced with deep-clean-specific ones. The light check became re-checking an
  oven cavity once it has gone cold, "because a warm oven flatters itself". The ticked-list argument
  became the one-off's own: a one-off has no history to be measured against, no last fortnight and
  no standard already set, so what stands in place of a checklist is the quote on one side and the
  spoken list of exceptions on the other. The phrase the brief asked for stayed; the reasoning is
  now this service's. Cosine 0.252 → **0.230**, Jaccard 0.015 → **0.0055**.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commit:** a0268c1

**5. [Rule 1 - Bug] One sentence verbatim from the sibling deck, and three shared noun phrases**

- **Found during:** Tasks 1 and 2, running the longest-shared-run control against the sibling deck
- **Issue:** `B3` contained "if you would rather we used something of yours, leave it out with a note
  and that is what gets used" — word for word from the sibling deck's `B3`. Three further runs of 5
  to 7 tokens were shared: `and the strip under a kitchen plinth`, `the tops of the wall units`,
  `a spray and a wipe` (which is also in `services.js`, making it the third use in the repo), and
  `a fixed number of hours in it`.
- **Fix:** The verbatim sentence was **deleted rather than reworded** — the parent service page and
  the sibling deck both already make the point, and `B3`'s value is the refusal list, which is
  specific to a deep clean. The noun phrases were varied (`the plinth strip in a kitchen`, `the flat
  tops of the wall units`) and `a spray and a wipe` was replaced with a different image entirely —
  "cleaning the face of a tile does nothing at all for the joint beside it".
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commits:** f63a106, a0268c1

**6. [Rule 1 - Bug] `A6`'s second paragraph was the sibling deck's argument**

- **Found during:** Task 1, comparing against the sibling deck's `A2`
- **Issue:** `A6` (floors) had been drafted with the edges argument as its second paragraph — the
  perimeter, the line along the skirting boards, the wide head that cannot reach it, and the fact
  that it is the first thing dropped when a visit runs late. The sibling deck's `A2` makes that
  argument at length. Both would have rendered on combo pages for two services.
- **Fix:** The paragraph now leads on what is behind an appliance — a washing machine and a fridge
  drawn out on the slack in their hoses, and the compacted mat behind them, which is a
  deep-clean-only finding and appears nowhere in the sibling deck. The edges survive as list items
  where they belong. `six years`, which the sibling also uses, became `a decade`.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commit:** f63a106

**7. [Rule 1 - Bug] Two typographic apostrophes**

- **Found during:** Task 2, before commit
- **Issue:** `one person’s day` and `the next visit’s list` carried `’` rather than `'`, which drifts
  from every other content module and would render a different character from the rest of the site's
  prose. This is 03-03's third deviation, repeated.
- **Fix:** Both rephrased to avoid the possessive — `a whole day for one person` and `the list for
  the next visit`. A scan for all four smart-quote characters over the file now returns 0, and the
  only non-ASCII character left is the em dash.
- **Files modified:** web/content/variants/deep-cleaning.js
- **Commit:** a0268c1

### Judgement call worth flagging, not a deviation

Deviations 3, 4 and 6 all resolve the same tension: **the plan's stage brief and the plan's own
distinctness criterion point in opposite directions.** The seven B-grids are described to seven
executors in nearly the same words, and writing the brief faithfully is what makes two decks
converge. In each case the criterion won — the subject stayed where the plan put it and the argument
was made the service's own. Any deck still to be written should expect this and resolve it the same
way; a passage that satisfies its brief and duplicates a sibling has failed the plan, not passed it.

## Authentication Gates

None.

## Known Stubs

None. Both exports are complete at eight entries each. The module is not imported by any route yet,
by design — 03-21 builds the combo template and 03-17 composes the decks against `towns.js`.

## Threat Flags

None. The plan's register lists T-03-05 (information disclosure through authored prose), T-03-06
(fabricated claims) and T-03-SC (package installs). All three are mitigated and none is a new
surface: the file has no address, postcode, district, phone, email or price in copy or comments; no
number in it is a statistic, and the only quantities are qualitative work estimates of the kind the
parent service page already makes; no passage states a remedy window or a re-clean commitment,
because `process.js` records that wording as still awaiting Sam; and this plan installed nothing.

## Requirements

**Deliberately none marked complete**, on the same reasoning 03-03 recorded. The frontmatter claims
`REQ-content-depth-bar` and `REQ-programmatic-page-scale`; neither is satisfied by a copy deck no
page renders, since the depth bar is a measurement over built HTML and the page scale is a route
count. The plan that lands batch 1's routes owns both. `REQUIREMENTS.md` was not touched.

## For the Next Plan

- **03-05 through 03-08.** Three things to copy from this file and 03-03's: the header's refusal to
  instance any banned shape or heading literal, the numbered per-entry comment, and the
  positional-index warning. Four things to check that the plan's own gates will not check for you:
  **(1)** your sixteen sub-headings and section headings against every shipped deck's, as rendered
  text — this plan's worst defect was a heading, and it measured 0.015 Jaccard; **(2)** the longest
  shared contiguous word run against `services.js` and against every sibling deck, not just the
  Jaccard, because a lifted sentence inside a 300-word passage dilutes to nothing; **(3)** TF-IDF
  cosine, since Jaccard cannot see a paraphrase; **(4)** your total word count against the
  4,200–5,200 band *before* you write the second grid, not after.
- **The B-grid is where the decks converge, and it is worse than the plan's warning suggests.** The
  brief for each stage is worded almost identically across the seven plans, so following it
  faithfully produces convergence. Find your service's own version of each stage — for this one it
  was that a deep clean is a one-off, so the quote needs eyes, a team replaces continuity, and there
  is no next visit to catch anything.
- **03-17 task 1** now has two of seven decks to sweep. The `B6 × B6` pair between this deck and
  `domestic-cleaning.js` is the current worst at 0.230 cosine / 0.0055 Jaccard, and it is the pair
  to look at first when the other five arrive.
- **03-21** consumes `A_VARIANTS[a]` and `B_VARIANTS[b]`. Both are plain arrays of block arrays,
  directly renderable by `renderBlocks`. The `B` heading is one level below the `A` heading and both
  land inside the same prose container.

## Self-Check: PASSED

- `web/content/variants/deep-cleaning.js` — FOUND (753 lines, ≥200 required)
- Exports `A_VARIANTS` and `B_VARIANTS`, both length 8 — FOUND, verified by module import
- Commit `f63a106` — FOUND in `git log`
- Commit `a0268c1` — FOUND in `git log`
- Both of the plan's `<verify>` commands — exit 0
- The plan's cross-deck sweep command — exit 0, `compared against 1 sibling deck(s)`
- All eleven acceptance greps — required values met
- `npm run verify` — exit 0, 21 + 39 tests, 19 routes, 129.8 KB JS, 299.5 KB worst page
- `git diff --stat` — exactly one file touched, no deletions
