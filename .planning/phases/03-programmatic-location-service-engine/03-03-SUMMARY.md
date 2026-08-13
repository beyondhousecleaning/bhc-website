---
phase: 03-programmatic-location-service-engine
plan: 03
subsystem: content
tags: [copy-deck, content-depth, similarity-gate, tf-idf, combo-pages, domestic-cleaning]

# Dependency graph
requires:
  - phase: 02-page-templates-and-content
    provides: "the authored block shape fixed by web/content/blocks.jsx, the services.js prose-deck house style and module-header conventions, and process.js as the shared band this deck must not restate"
provides:
  - "web/content/variants/domestic-cleaning.js — A_VARIANTS[8], the service-detail block (block 3) for every domestic-cleaning combo page, town-independent"
  - "B_VARIANTS[8] — the how-the-job-runs block (block 4) for the same pages, orthogonal to A_VARIANTS by construction"
  - "The first of the seven variant decks, and therefore the shape the other six inherit: a positional-index docblock, two orthogonal axes, one list block in A and none in B"
  - "A measured baseline for the paraphrase question: all-16 TF-IDF cosine mean 0.0709, which is what a genuinely distinct deck looks like"
affects: [03-17-cross-deck-sweep, 03-21-combo-template, 03-23-blanket-lock-assertions, 03-16-towns-data-module]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A positional index is data: the docblock states that reordering either array silently re-assigns every published town's copy and that no gate downstream can catch it, because every assertion is about the passages rather than about which town received which one"
    - "Two orthogonal decks rather than two rewordings — one axis is the house, the other is the visit — so 64 combinations stay 64 rather than collapsing towards 8"
    - "A deck of eight ends on the passage that says no: the entry naming the work a routine visit deliberately leaves alone is the one a reader believes"
    - "Measure distinctness with both metrics, not the gated one: 5-gram Jaccard is lexical and cannot see paraphrase, TF-IDF cosine can"
    - "When the sibling sweep is vacuous, substitute a control that is not — the six shipped services.js prose decks were available and gave a real 0.0088 figure"

key-files:
  created: [web/content/variants/domestic-cleaning.js]
  modified: []

key-decisions:
  - "Each A entry is heading + two paragraphs + one list, matching §10.2's block 3 exactly rather than the three-paragraph shape the word floor made tempting — the 280-word floor was met by writing longer paragraphs instead of an extra one"
  - "B carries no list block at all: A already has one, both blocks render inside the same prose container, and two bulleted runs back to back is where a page starts reading like a specification"
  - "The module header does NOT contain the literal block-type strings for the heading levels. A block-shape comment written the usual way would have made the h2 and h3 grep counts 9 instead of 8 and the h1 count 1 instead of 0 — the comment would have failed the three greps that police it, which is the thirteenth-time trap stated in the header itself"
  - "The header also omits the path-alias literal and every banned-shape example, for the same reason: it states the rule and names the gate rather than instancing the string"
  - "A6 (choosing an interval) was written as arithmetic — the list is fixed, the load differs — rather than as three sub-sections, because services.js already ships weekly/fortnightly/monthly as three h3s and repeating that structure is how a deck starts paraphrasing the site it sits on"
  - "Continuity of cleaner appears in both A1 and B1 but with disjoint evidence: A1 is product and room knowledge inside a bathroom, B1 is the round-versus-day argument and cover. The examples in B1 were deliberately changed off services.js's (the Tuesday office door, the dripping tap) once they were found to be near-verbatim"
  - "No fabricated figure anywhere: the deck talks about halves of hours, fortnights and 'three visits running' but states no price, no guaranteed window and no re-clean commitment — process.js records that the remedy wording is still awaiting Sam, so this deck does not pre-empt it"

patterns-established:
  - "The variant-deck file layout the remaining six decks should copy: house-style header, a per-deck docblock naming the subjects in index order, one numbered comment per entry, implicit string concatenation with a trailing space per line"
  - "A vacuous gate is reported as vacuous. `compared against 0 sibling deck(s)` is recorded as an early warning that found nothing because there was nothing to find, not as coverage"

requirements-completed: []

# Metrics
duration: 41min
completed: 2026-08-13
---

# Phase 03 Plan 03: Domestic-Cleaning Variant Grid Summary

The 8×8 copy grid for domestic cleaning — sixteen genuinely different passages, 4,798 authored
words, measuring 0.0003 mean 5-gram Jaccard and 0.0709 mean TF-IDF cosine across all 120 internal
pairs, which is what a distinct deck measures rather than what a paraphrase deck does.

## What Was Built

`web/content/variants/domestic-cleaning.js` (711 lines, one new file, nothing modified).

**`A_VARIANTS[8]`** — block 3, service detail. Each entry is one section heading, two paragraphs and
one list of six or seven items. Eight different subjects, in index order:

| `a` | Heading | Subject |
|---|---|---|
| 0 | The kitchen, every visit and by rotation | the every-time core vs the recorded rotation |
| 1 | Bathrooms, and what a fortnight of hard water does | limescale, dwell time, the four recurring failures |
| 2 | Floors, and the part of the job that is not hoovering | technique, edges, the hard boundary of a machine |
| 3 | Dust does not settle evenly, so the dusting cannot either | where it actually sits, and direction of work |
| 4 | Beds, laundry, and the edges of somebody else's room | the boundaries in a private room, and the laundry limit |
| 5 | Houses with a dog in them, and houses with a toddler | hair and knee-height mess, and where cleaning stops |
| 6 | Weekly, fortnightly or monthly: one list, three loads | what changes at each interval, and how to choose |
| 7 | The work a routine visit deliberately leaves alone | the fixed-hours argument, and what belongs elsewhere |

**`B_VARIANTS[8]`** — block 4, how the job runs. Each entry is one sub-heading and three paragraphs,
no list. Eight stages of a visit, orthogonal to the eight subjects above:

| `b` | Heading | Stage |
|---|---|---|
| 0 | The first visit, and the walk round that sets up the rest | what is asked, and that it is written to a file |
| 1 | Who comes through the door, and how many of them | one or two, round-not-day, and how cover works |
| 2 | The order a house gets worked in, which is not the obvious one | dwell time, downhill and towards the door |
| 3 | What we bring, what of yours we will use, and what we will not | the kit, cloth discipline, and a two-way refusal list |
| 4 | Getting in, getting out, and who is holding a key | keys and codes, the change that costs a visit |
| 5 | How long a visit runs, and what gives when a house needs more | the slot, and what slips in a decided order |
| 6 | The check at the end, and what "done" means without a checklist | looking from the doorway, and no card on the door |
| 7 | Afterwards: putting things right, breakages, and changes | remedy, telling before finding, changing the arrangement |

The module header carries the house-style contract: what the file is for, that the index is data
rather than presentation, why eight subjects and not eight rewordings, that the two decks must stay
orthogonal, that the shared process copy is not to be restated, no place names anywhere including
the comments, no address/postcode/district/phone/email/price, the block shape, the outline
discipline, and the voice.

## Measurements

**Word counts** (the two arrays the plan asked to be recorded):

```
A words: [300, 350, 337, 318, 318, 353, 316, 322]   sum 2,614   floor 280
B words: [277, 251, 268, 287, 284, 279, 266, 272]   sum 2,184   floor 240
file total: 4,798 authored words (band 4,200–5,200)
```

**Distinctness.** Both metrics, because the gated one cannot see the failure mode:

| Cohort | Pairs | 5-gram Jaccard | TF-IDF cosine |
|---|---|---|---|
| Within `A_VARIANTS` | 28 | mean 0.0002, worst **0.0031** (2 vs 7) | mean 0.0672, worst 0.1040 (2 vs 5) |
| Within `B_VARIANTS` | 28 | worst **0.0158** (1 vs 7) | — |
| Cross-grid `A` vs `B` | 64 | worst **0.005** | — |
| All 16 passages | 120 | mean 0.0003, worst **0.0158** | mean **0.0709**, worst 0.1298 |

The TF-IDF figure is the one that matters. Research measured a paraphrase deck at **0.736** on this
metric while it sat at ≈0.05 on Jaccard and passed the gate; real distinct decks measure a per-deck
mean of **0.069 to 0.118**. This deck's 0.0709 sits at the clean end of that band, so the passages
are different in subject matter and not in wording. Every Jaccard figure is an order of magnitude
under the 0.10 ceiling.

**A control the sibling sweep could not provide.** The plan's cross-deck sweep is honest about being
an early warning; it ran and reported `compared against 0 sibling deck(s); worst cross-deck J 0.000`
— vacuous, and legitimately a pass, because 03-03 through 03-08 are wave-mates with no ordering
between them. That is recorded as vacuous rather than as coverage. **Plan 03-17 task 1 is the gate
that actually holds**, over all 6,216 cross-deck pairs once the seven decks exist.

Because a vacuous pass proves nothing, a non-vacuous control was substituted: all 16 passages
against all six shipped `services.js` prose decks, 96 pairs. **Worst 5-gram Jaccard 0.0088**
(`B1` vs `standard-home-cleaning`, which is the same service on the service-page side and therefore
the single most likely collision in the repo). This deck is new prose, not recycled house copy.

**Grep gates, over the whole file including comments:**

| Grep | Result |
|---|---|
| the 17 town and county names | **0** |
| scoped postcode districts `\b(B\|CV\|DY\|TF\|WS\|WV\|WR\|ST\|SY\|OX\|NN)[0-9]{1,2}[A-Z]?\b` | **0** |
| price / phone digits / email-shaped | **0** |
| `type: 'h1'` | **0** |
| `&amp;` | **0** |
| `type: 'h2'` | **8** |
| `type: 'h3'` | **8** |
| US vocabulary and dead CTA phrases (case-insensitive) | **0** |

All sixteen headings are distinct and none begins with the display noun followed by ` in `, which
belongs to the page's `<h1>` alone.

**Suite, unmoved as required:** `npm run verify` exit **0** — 21 design-system lock tests, 39
built-HTML locks, **19** prerendered routes, JS 129.8 KB / 500 KB, CSS one shared 4.8 KB file, worst
page 299.5 KB / 1024 KB. Identical to the 03-02 baseline in every figure, which is the correct
result: nothing imports this module yet.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] The module header would have failed the three heading greps that police it**

- **Found during:** Task 1, while writing the header
- **Issue:** The `services.js` house style documents the block shape by writing the four block
  literals out. Doing that here would have put a ninth `type: 'h2'` and a ninth `type: 'h3'` into the
  file and a first `type: 'h1'`, taking the three acceptance greps to 9, 9 and 1 against required
  values of 8, 8 and 0. This is the exact self-matching-comment trap the plan warns has fired twelve
  times, and the header states the rule as its thirteenth instance.
- **Fix:** The header describes the block shape in words — "a paragraph, a section heading, a
  sub-heading, or a list whose `text` field carries the ITEMS" — and points at `blocks.jsx` and
  `services.js:51-59` for the literals. The path-alias literal was dropped for the same reason.
- **Files modified:** web/content/variants/domestic-cleaning.js
- **Commit:** a3aa922

**2. [Rule 1 - Bug] Two A-deck passages were one and five words under the 280-word floor**

- **Found during:** Task 1 verification (`short A variant: 279`)
- **Issue:** `A_VARIANTS[0]` measured 279 against a floor of 280 and `A_VARIANTS[6]` measured 284 —
  a one-word margin is not a margin, and a later copy-edit removing a clause would turn a green
  plan red retrospectively.
- **Fix:** Added substantive sentences rather than padding: entry 0 now states that a written
  rotation survives a cleaner's fortnight off, and entry 6 contrasts a tidy four-bedroom house with
  two adults out at work against a two-bed with a dog, a toddler and a tiled hall. 300 and 316
  words respectively — a 20-word margin on the tightest entry.
- **Files modified:** web/content/variants/domestic-cleaning.js
- **Commit:** a3aa922

**3. [Rule 1 - Bug] Typographic apostrophes in five strings**

- **Found during:** Tasks 1 and 2, before commit
- **Issue:** Five strings carried `’` rather than `'`, which drifts from every other content module
  and would render a different character in built HTML from the rest of the site's prose.
- **Fix:** Rewrote three lines onto double-quoted strings with straight apostrophes (the
  `services.js` convention) and rephrased two others to avoid the possessive. `grep` for all four
  smart-quote characters over the file now returns nothing.
- **Files modified:** web/content/variants/domestic-cleaning.js
- **Commits:** a3aa922, 8e2c986

**4. [Rule 2 - Missing critical functionality] Two B-deck passages were near-verbatim `services.js`**

- **Found during:** Task 2, drafting `B_VARIANTS[1]`
- **Issue:** The continuity argument had been drafted with `services.js`'s own examples — the office
  door that stays shut on a Tuesday, the tap that drips if you turn it hard, and the sentence "None
  of that is written down anywhere useful, and every new face starts from nothing". Those are exact
  multi-word runs from the live service page. Nothing in this plan's gates looks at `services.js`, so
  this would have shipped as an invisible near-duplicate between a service page and 58 combo pages —
  precisely the failure the depth bar exists to prevent, arriving from the direction the gate does
  not face. `B_VARIANTS[3]` had the same problem with "a fragrance-free range because somebody
  reacts to scent" and "nobody should have to lend a cleaner a hoover".
- **Fix:** Both passages rewritten with their own specifics (the sticking side gate, the alarm panel
  behind the coats, an unscented range, a household machine being the wrong tool). Then the whole
  deck was measured against all six shipped prose decks as a standing control — worst 0.0088.
- **Files modified:** web/content/variants/domestic-cleaning.js
- **Commit:** 8e2c986

### Structural choice worth flagging, not a deviation

The plan specifies each `A` entry as "one `h2`, one or two `p`, and one `ul`" at ≥280 words. Reaching
280 with two paragraphs meant writing paragraphs of 130 to 200 words rather than adding a third.
Several drafts began as three shorter paragraphs and were merged. The result matches §10.2's block 3
exactly, and the merged paragraphs read denser than the drafts did — but the remaining six decks
should expect the same tension and resolve it the same way rather than quietly shipping three
paragraphs.

## Authentication Gates

None.

## Known Stubs

None. Both exports are complete at eight entries each. The module is not imported by any route yet,
by design — plan 03-21 builds the combo template and 03-17 composes the decks against `towns.js`.

## Requirements

**Deliberately none marked complete.** The plan frontmatter claims `REQ-content-depth-bar` and
`REQ-programmatic-page-scale`, and 20 of this phase's 24 plans claim the same pair. Neither is
satisfied by a copy deck that no page renders: the depth bar is a measurement over built HTML and the
page scale is a route count. The plan that lands batch 1's routes owns both. `REQUIREMENTS.md` was
not touched.

## For the Next Plan

- **03-04 through 03-08** inherit this file's layout. The three things worth copying verbatim: the
  header's refusal to instance any banned shape or heading literal, the numbered per-entry comment,
  and the positional-index warning. The three things worth checking: your `h2`/`h3` grep counts are
  exactly 8 (a conventional block-shape comment breaks this), your entries clear the floor by more
  than a word, and your deck measured against `services.js` as well as against its siblings.
- **03-17 task 1** is the real cross-deck gate. Note that all seven B-grids are structurally
  parallel by instruction — the same eight stages for seven services — so the B×B region is where
  6,216 pairs will converge if any deck was written generically. This deck's B passages were kept
  specific to a routine domestic visit for that reason.
- **03-21** consumes `A_VARIANTS[a]` and `B_VARIANTS[b]`. Both are plain arrays of block arrays,
  directly renderable by `renderBlocks`. The `B` heading is one level below the `A` heading and both
  land inside the same prose container.

## Self-Check: PASSED

- `web/content/variants/domestic-cleaning.js` — FOUND (711 lines, ≥200 required)
- Exports `A_VARIANTS` and `B_VARIANTS`, both length 8 — FOUND, verified by module import
- Commit `a3aa922` — FOUND in `git log`
- Commit `8e2c986` — FOUND in `git log`
- `npm run verify` — exit 0, 21 + 39 tests, 19 routes, 299.5 KB worst page
