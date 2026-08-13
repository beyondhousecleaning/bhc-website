---
phase: 03-programmatic-location-service-engine
plan: 01
subsystem: testing
tags: [node-test, prerender-manifest, built-html-locks, ci-gate, next-js]

# Dependency graph
requires:
  - phase: 02-page-templates-and-content
    provides: "the 37-lock built-HTML harness, the prerender-manifest route enumeration (delta 1), the self-restoring exemption-set idiom (NO_RATING_YET / NO_PRIMARY_CTA_YET), and the three structural rules in the file header"
provides:
  - "A non-HTML metadata-route partition — PAGE_ROUTES / METADATA_ROUTES — so a future sitemap route cannot exit the harness at module load"
  - "EXPECTED_METADATA_ROUTES, empty, asserted in both directions: Phase 5's change here is one route string"
  - "A template-rule expectation resolver (delta 18): expectationsFor keeps its signature and its throw, and now resolves combo and hub routes by shape"
  - "A route-derived town clause — slugified <h1> must contain the route's town segment as a whole token — the one assertion a content module cannot satisfy by being internally consistent"
  - "A per-template InterlinkBlock requirement (delta 16) plus a self-restoring INTERLINK_PENDING set holding the seven routes plan 03-19 composes"
  - "A per-template photo-state rule (delta 21) replacing the seven-entry route literal"
  - "MIN_APP_ROUTES, a hard-coded integer floor (delta 26), with the batch-1 and full-rollout figures recorded beside it"
affects: [03-18-locations-index, 03-19-interlink-composition, 03-20-interlink-pending-empty, 03-21-combo-template, 03-23-blanket-lock-assertions, phase-05-sitemap, phase-04-photo-backfill]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route classification by shape, not by enumeration — a literal keeps precedence, a template rule follows, an unmatched route still throws"
    - "A filter out of the assertion set must be paired with a both-directions literal, or it becomes a hole routes disappear into"
    - "A lock clause that cannot execute at the current baseline gets a unit-level regression guard in the same commit"

key-files:
  created: []
  modified: [web/scripts/check-html-locks.mjs]

key-decisions:
  - "The metadata-route classifier tests the final path segment for a dot-extension rather than matching known metadata filenames — an allowlist of filenames would need editing for every future metadata route, and the crash it prevents happens at module load where a miss is unrecoverable"
  - "Template expectations are built per-route by a function rather than held as static objects, so townSegment can be derived from the route inside the resolver and every existing call site stays untouched"
  - "The town clause matches whole hyphen-delimited tokens rather than a bare substring: 'warwick' is a substring of 'warwickshire', so substring containment would accept a Warwick hub headed 'House Cleaning in Warwickshire'"
  - "INTERLINK_PENDING is constrained to routes the rule already requires a block of, asserted in the test, so it records unfinished work and cannot be used to move a route out of the negative half"
  - "The non-vacuity assertion for delta 16 asserts the CLASSIFICATION is non-empty rather than that a page is positively asserted — while the pending set is full every required route is suspended, so the classifier silently returning false everywhere is the live vacuity risk"
  - "MIN_APP_ROUTES set to 18 (today's baseline) rather than a batch-1 or rollout figure: a floor above the routes that exist is a red build, and delta 26's floor is raised by the plan that lands the routes"

patterns-established:
  - "Resolution order literal → template → throw: the literal asserts copy on hand-authored pages, the rule asserts only that the generator did not drop a field, and the file records that trade explicitly"
  - "A lock whose clause is unexercised at the current route count is proved at unit level on the shape it exists to reject — the postcode/street-line/dead-anchor guard idiom, extended to the town clause"
  - "Self-restoring pending sets over dormant booleans: a global gate flag forced a rewrite rather than a flip, and a per-route set forces its own emptying one route at a time"

requirements-completed: [REQ-programmatic-page-scale, REQ-hub-and-spoke-architecture, REQ-content-depth-bar]

# Metrics
duration: 34min
completed: 2026-08-13
---

# Phase 3 Plan 01: Wave 0 Lock-Harness Rewrite Summary

**The built-HTML harness now describes pages by template rule instead of by route literal — a combo or hub route resolves an expectation with no hand-written entry, a metadata route is partitioned out instead of crashing the suite at module load, and the suite is green at 39 tests on the unchanged 19-route baseline.**

## Performance

- **Duration:** 34 min
- **Started:** 2026-08-13T13:41:00Z
- **Completed:** 2026-08-13T14:15:00Z
- **Tasks:** 3 (landed as one commit, as the plan requires)
- **Files modified:** 1

## Accomplishments

- **All four harness changes plus the metadata filter landed in ONE commit against ONE build**, which is the whole point of Wave 0. `03-RESEARCH.md` measured seven locks failing at once on the 426-route probe with the harness untouched, six of them from the single root cause of `expectationsFor()` throwing.
- **The suite went 37 → 39 tests with zero failures and zero changes to any other file.** No route was added, no page was touched, no package was installed. The mechanism is in place for 167 routes at batch 1 and 426 at full rollout.
- **`npm run verify` exits 0:** 20 design-system locks + 39 built-HTML locks, JS 129.8 KB / 500 KB, worst page 299.4 KB / 1024 KB, 19 routes. Identical to the baseline on every budget figure — this plan adds assertions, not weight.
- **Both mutation proofs the plan demanded were run and recorded** (below). Neither lock reads green for the wrong reason.
- **Fixed a pre-existing rule-3 self-collision** that would have failed this plan's own acceptance grep.

## Task Commits

All three tasks in one commit, against one build, per `<context>`: *"All three tasks land in ONE commit against ONE build. Do not commit between them."*

1. **Tasks 1–3: metadata partition + delta 18 resolver + delta 26 floor + deltas 16 and 21** — `5120f5b` (refactor)

**Plan metadata:** see the docs commit following this summary.

## Files Created/Modified

- `web/scripts/check-html-locks.mjs` — the only file this plan touches. 480 insertions, 60 deletions.

### What changed, by delta

| Delta | Change | Where |
|---|---|---|
| Pitfall 1 | `isMetadataRoute`, `MANIFEST_ROUTES`, `PAGE_ROUTES`, `METADATA_ROUTES`, `EXPECTED_METADATA_ROUTES`; `PAGES` built from `PAGE_ROUTES` | `:192-236` |
| 26 | `MIN_APP_ROUTES = 18`, asserted `APP_PAGES.length >= MIN_APP_ROUTES` | `:302-329`, in the delta 1 route test |
| 18 | `SERVICE_ROUTE`, `COMBO_H1_SHAPE`, `HUB_H1_SHAPE`, `slugify`, `slugHasToken`, `TEMPLATES`, `templateFor`, rewritten `expectationsFor` | `:494-604` |
| 18 | Shape test widened to accept a string OR RegExp `h1`; `crumbDepth` / `townSegment` type-checked where present | delta 1 honesty test |
| 18 | SC-4a compares by equality for a string and by `assert.match` for a RegExp, plus the route-derived town clause | SC-4a |
| 18 | `crumbDepth` asserted as the `bhc-breadcrumbs__sep` count in `class="` form | SC-4b positive branch |
| 16 | `INTERLINK_LOCK_ACTIVE` **deleted**; `interlinkRequired` + `INTERLINK_PENDING` (7 routes) | above the SC-4d test |
| 21 | `PHOTO_PLACEHOLDER_ROUTES` **deleted**; `photoPlaceholderExpected` | above the delta 8 test |

Two new tests (37 → 39), both proving mechanism that no built route exercises yet:
- `delta 1: a non-HTML metadata route is classified, never read as an HTML page`
- `delta 18: a combo and a hub route resolve an expectation by rule, and an unknown one still throws`

## Verification

### Acceptance criteria, all met

| Check | Required | Actual |
|---|---|---|
| `node --test check-html-locks.mjs` | ≥ 38 pass, 0 fail | **39 pass, 0 fail** |
| `grep -c 'EXPECTED_METADATA_ROUTES'` | ≥ 3 | 6 |
| `PAGES` built from `PAGE_ROUTES` | yes | `:232` |
| `grep -v '^ \*' \| grep -c 'routes-manifest'` | 0 | **0** |
| unknown-route throw survives | passes unchanged | passes |
| `grep -c 'MIN_APP_ROUTES'` | ≥ 2, integer on assignment | 3, `= 18` at `:329` |
| `grep -c "from '@/content"` | 0 | 0 |
| `grep -c 'content/towns'` | 0 | 0 |
| `grep -c 'INTERLINK_LOCK_ACTIVE'` | 0 | **0** |
| `grep -c 'PHOTO_PLACEHOLDER_ROUTES'` | 0 | **0** |
| `grep -c 'INTERLINK_PENDING'` | ≥ 3, exactly 7 routes | 5, exactly 7 (`/` + six services) |
| `grep -c 'data-bhc-photo-state="pending"'` | 0 | **0** (was 1 at HEAD — see deviation 1) |
| `npm run verify` | exit 0 | **exit 0** |

### Mutation proof 1 — the partition classifier (Task 1)

Negating `isMetadataRoute` and re-running: **8 of 39 tests failed**, including the partition test itself (`not ok 2`). With the predicate inverted every route is classified as metadata, `PAGE_ROUTES` empties, and the `PAGE_ROUTES.length` non-vacuity assertion plus the both-directions equality both fire. Predicate restored: **39 pass, 0 fail**.

### Mutation proof 2 — the pending set inverse (Task 3)

Removing `/` from `INTERLINK_PENDING` and re-running: **exactly 1 test failed**, naming the route:

```
not ok 27 - SC-4d / delta 16: an InterlinkBlock renders on exactly the templates that require one
  error: '/: no InterlinkBlock in built HTML, and its template requires one'
```

Route restored: **39 pass, 0 fail**. The set is self-restoring in both directions — a route that starts rendering a block fails the inverse and is forced out; a route removed early fails the positive and is forced back.

### Arithmetic verified before writing the assertion

Measured on the built `services/deep-cleaning.html`, as the plan required:

```
class="[^"]*bhc-breadcrumbs__sep   -> 1     (correct: 2 crumbs, 1 separator)
bare bhc-breadcrumbs__sep          -> 2     (the flight payload doubles it — trap 1)
```

So separators are `crumbDepth − 1`, and `Breadcrumbs.jsx` confirms it structurally: the separator renders for `i > 0`. Combo `crumbDepth: 4` → 3 separators; hub `crumbDepth: 3` → 2.

## Decisions Made

- **The classifier tests for a dot-extension on the final segment, not a filename allowlist.** An allowlist would need an edit for every future metadata route, and the failure it guards is an unrecoverable `process.exit(1)` at module load.
- **Template expectations are functions of the route.** `expectation: (r) => ({ … townSegment: r.split('/')[3] … })` lets the resolver derive the town from the URL while every call site keeps calling `expectationsFor(route)` unchanged — which is what the existing header promised ("without touching a single call site").
- **`MIN_APP_ROUTES = 18`, not 167 or 426.** A floor above the routes that currently exist is a red build. The standing rule and both future figures are written beside the constant so the next raiser has the numbers without re-deriving them.
- **`INTERLINK_PENDING` is asserted to be a subset of what the rule requires.** Otherwise the set is a mechanism for exempting a route from the negative half rather than a record of work owed.
- **Delta 16's non-vacuity assertion checks the classification, not a positively-asserted page.** At this baseline all seven required routes are pending, so no page is held to the positive half; `APP_PAGES.some((p) => interlinkRequired(p.route))` is the property that would actually break if the classifier regressed.
- **`/locations` deliberately throws today.** It matches neither template (the hub rule requires a segment after the prefix) and has no literal entry until plan 03-18 builds it. Asserted explicitly, so the hub rule cannot quietly absorb it later.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] A pre-existing comment matched the grep that polices it**

- **Found during:** Task 3 (delta 21), while running the acceptance greps
- **Issue:** `grep -c 'data-bhc-photo-state="pending"'` returned **1**, and the criterion requires 0. Confirmed pre-existing with `git show HEAD:web/scripts/check-html-locks.mjs | grep -c` → also 1. The delta 8 header explained why the attribute-with-value form is load-bearing by *writing that form out whole* — the exact self-collision the file's own rule 3 forbids and that this project's brief records as having fired twelve times in Phase 2. The lock itself was never wrong (the marker is assembled from fragments and scans built HTML, not its own source), but the acceptance grep is a literal count and this plan would have failed its own gate on inherited text.
- **Fix:** Reworded the paragraph to state the rule instead of instancing it — "the attribute paired with its value reads 1" — and added a note that the acceptance check greps for the paired form and that this paragraph naming it would itself have been the hit. Rule 3's second sanctioned mitigation, used because a comment cannot be assembled from fragments.
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** grep returns 0; suite still 39 pass, 0 fail.
- **Committed in:** `5120f5b`

**2. [Rule 2 - Missing Critical] The town clause accepted a county for a town, and could not execute at all**

- **Found during:** Task 2 (delta 18)
- **Issue:** Two holes in the clause as specified. (a) The plan says the slugified `<h1>` "must **contain** the town segment". Bare containment is unsound here: `warwick` is a substring of `warwickshire`, so a hub for Warwick headed *"House Cleaning in Warwickshire"* would pass — a page titled for the county it sits in rather than the town it is for, which is precisely the class of defect delta 28 exists for. (b) The clause is **unexercised at the 19-route baseline** — no built route resolves to a template, so `townSegment` is `undefined` on all 18 app pages and the assertion never runs. It goes live on the first generated route, which is the worst possible moment to discover it stopped working. This file treats an unexercisable lock as a defect and guards three others the same way (postcode, street line, dead anchor).
- **Fix:** (a) Added `slugHasToken(slug, token)`, which pads both sides and matches whole hyphen-delimited runs — the same boundary trick `\b` plays for the postcode matchers. (b) Added a unit-level regression guard inside the new delta 18 test, asserting the clause accepts the correct town, rejects a different town (`Kenilworth` on a Warwick route), rejects the county (`Warwickshire` on a Warwick route, the case a substring test would have accepted), and handles the two awkward real slugs (`stourport-on-severn`, `south-coventry`). Added as assertions to an existing test, not a new test, per rule 1 in the header (the test count should track invariants).
- **Files modified:** `web/scripts/check-html-locks.mjs`
- **Verification:** all five town-check assertions pass; the county case returns `false` where bare containment returned `true`.
- **Committed in:** `5120f5b`

**3. [Rule 1 - Bug] The state SDK recorded three requirements and a phase as complete when they are not**

- **Found during:** the state-update step
- **Issue:** Three things, all false-green bookkeeping. (a) `requirements.mark-complete`, called with this plan's frontmatter IDs as the workflow directs, flipped `REQ-programmatic-page-scale`, `REQ-content-depth-bar` and `REQ-hub-and-spoke-architecture` to `[x]` / `Complete`. Those three IDs are claimed by **20 of this phase's 24 plans**; this plan builds zero pages, there is still no locations index, no town hub and no combo page, and the route count is unchanged at 19. (b) `state.update-progress` set `completed_phases: 2`, but Phase 2 is 14/15 with 02-15's blocking checkpoint unanswered — ROADMAP.md itself still reads "In Progress", and STATE.md's own body says "The phase is NOT verified". (c) `state.record-session` and `state.advance-plan` each replaced the first line of a multi-line hand-written field, orphaning the continuation lines — `Status:` became "Ready to execute" followed by a subjectless fragment beginning "is a `checkpoint:human-verify` and has NOT been answered", which is the standing gate on the entire project reduced to gibberish.
- **Fix:** (a) Reverted `.planning/REQUIREMENTS.md` with `git checkout -- .planning/REQUIREMENTS.md` (the file had no other changes). Those requirements belong to the plans that land the routes. (b) Set `completed_phases` back to `1` and reconciled the stale frontmatter `percent: 33` with the recomputed bar (`50`). (c) Rewrote both orphaned blocks so the Phase 2 gate is stated in full and labelled as carried-forward, and recorded 03-01's actual outcome above it.
- **Files modified:** `.planning/STATE.md` (`.planning/REQUIREMENTS.md` restored to HEAD)
- **Verification:** `git diff .planning/REQUIREMENTS.md` is empty; STATE.md frontmatter agrees with the progress bar and with ROADMAP.md's Phase 2 row; both multi-line fields read as coherent prose.
- **Committed in:** the docs commit for this plan

**Note for the phase verifier:** the three requirement IDs in this plan's frontmatter are aspirational for the phase, not deliverable by plan 01. Whichever plan lands batch 1's routes should mark them, or they should be marked at phase completion.

---

**Total deviations:** 3 auto-fixed (2 bugs, 1 missing critical)
**Impact on plan:** Deviations 1 and 2 are inside this plan's own file and its own acceptance criteria — 1 was required to pass a stated gate, and 2 closes a soundness hole and a vacuity hole in the single clause the plan calls "what keeps the lock honest". Deviation 3 is planning-bookkeeping only and touched no code. No scope creep — no route, page, component, content module or package was touched.

## Issues Encountered

- **The plan's delta-16 non-vacuity wording cannot be satisfied literally at this baseline.** It asks for "a non-vacuity assertion that at least one app page is held to the positive half", but all seven routes the positive half would hold are in `INTERLINK_PENDING`, so a literal `some(p => positively asserted)` fails on a correct build. Resolved by asserting the classification is non-empty instead — which is the property the pending set suspends rather than removes, and the one that breaks if the classifier regresses. Recorded here because it is a wording difference, not a weakening: it is strictly the assertion that catches the real failure mode.
- **`INTERLINK_LOCK_ACTIVE` was not flipped.** Confirmed against source before touching it, as the brief insisted: under `true` the old test runs `assert.ok(n >= 1)` inside the `APP_PAGES` loop. It was deleted and replaced, and its identifier is named nowhere in the file (grep returns 0).
- No blockers. No package installs — this phase installs zero packages by contract (UI-SPEC §6, D-06), and nothing here needed one.

## Known Stubs

None. `EXPECTED_METADATA_ROUTES` and `INTERLINK_PENDING` are **not** stubs — each is an asserted literal doing active work:

- `EXPECTED_METADATA_ROUTES` is empty and asserted equal to `METADATA_ROUTES` in both directions. Empty is the correct current value (the app has no metadata route), and the assertion is what makes a metadata route arriving without a spec clause a red build. Phase 5 adds one route string to it in the same commit that adds the sitemap.
- `INTERLINK_PENDING` holds seven routes and is asserted in the inverse. Plan 03-19 composes those blocks and empties the set; plan 03-23 asserts it is empty. The set fails and forces its own removal one route at a time.

## Threat Flags

None. The two dispositions in this plan's register are both mitigated as written: T-03-01 (`EXPECTED_METADATA_ROUTES` asserted in both directions, plus a losslessness assertion on the partition) and T-03-02 (`MIN_APP_ROUTES` a hard-coded integer, with `grep` confirming no content-module import in the file). T-03-SC is empty by construction — no install occurred.

## Next Phase Readiness

**Wave 0 is done and the critical path is clear.** Every later plan in this phase can now add routes without reddening the harness:

- **Plan 03-18** (`/locations`): add its literal entry to `PAGE_EXPECTATIONS` and raise `MIN_APP_ROUTES`. The index currently throws by design, and the new delta 18 test asserts it does — that assertion must be updated in the same change.
- **Plan 03-19** (InterlinkBlock composition): empty `INTERLINK_PENDING`. Removing a route before its block renders fails the positive half naming the route (proved above).
- **Plan 03-21** (combo template): the combo rule expects `h1` matching `/^.+ in .+$/`, `crumbDepth: 4`, `ldJsonBlocks: 2`, `reviewCards: 3`, one pending photo marker, and an `<h1>` whose slug carries the route's town segment as a whole token.
- **Hub template:** `HUB_H1_SHAPE` is `/^House Cleaning in .+$/`, `crumbDepth: 3`, and **no** photo marker.
- **Phase 5** (sitemap): add the one route string to `EXPECTED_METADATA_ROUTES` in the same commit as `app/sitemap.js`. Without it the build is red — deliberately — rather than silently unasserted.
- **Phase 4** (photo backfill): narrow `photoPlaceholderExpected` rather than editing a route list.

**Carried forward, unchanged by this plan:** 02-15's `checkpoint:human-verify` is still unanswered and remains the Phase 2 gate. Deltas 17, 19, 20, 22–25, 27–29 are still open and belong to later plans in this phase; delta 27 is a new lock in the design-system band-adjacency extractor, not an extension of anything in this file.

## Self-Check: PASSED

- `web/scripts/check-html-locks.mjs` — FOUND
- `.planning/phases/03-programmatic-location-service-engine/03-01-SUMMARY.md` — FOUND
- commit `5120f5b` — FOUND in `git log --all`
- every identifier this summary claims exists, confirmed by grep: `EXPECTED_METADATA_ROUTES` `:227`, `PAGES = PAGE_ROUTES` `:232`, `MIN_APP_ROUTES = 18` `:329`, `slugHasToken` `:545`, `TEMPLATES` `:558`, `interlinkRequired` `:1437`, `INTERLINK_PENDING` `:1454`, `photoPlaceholderExpected` `:1554`
- `npm run verify` exit 0, re-confirmed after the final edit: 20 + 39 tests, 0 failures
- no file deletions in the commit (`git diff --diff-filter=D HEAD~1 HEAD` empty), no untracked files left behind

---
*Phase: 03-programmatic-location-service-engine*
*Completed: 2026-08-13*
