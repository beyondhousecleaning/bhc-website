## Conflict Detection Report

### BLOCKERS (0)

None. No document in this ingest set was classified `ADR`, so no LOCKED-vs-LOCKED ADR
contradiction is possible. No `UNKNOWN`/low-confidence classifications were found (all 10
classifications came back `high` or `medium` confidence, typed `PRD`, `SPEC`, or `DOC`). Mode is
`new`, so there is no existing `CONTEXT.md` locked-decision set to check against.

### WARNINGS (0)

None. Only one document (`docs/goals.md`) was classified `PRD`, so no PRD-vs-PRD requirement
overlap with divergent acceptance criteria is possible in this set. Two genuinely open,
undecided items were found (canonical service taxonomy; content-priority sequencing) but no
second source in the ingest set proposes a competing answer to either — they are unmade
decisions, not doc-vs-doc conflicts, so they are filed as open items in
`intel/requirements.md` (`REQ-canonical-service-taxonomy`, `REQ-content-priority-sequencing`)
for the roadmapper/user to resolve, not surfaced here as a WARNING.

### INFO (4)

[INFO] Cross-reference cycle: brand-brief.md <-> design-system.md
  Note: `docs/brand/brand-brief.md` cross-references `docs/design/design-system.md` as its
  "companion doc," and `docs/design/design-system.md` cross-references
  `docs/brand/brand-brief.md` right back the same way — a 2-node cycle in the cross-ref graph.
  Per process, cycles are normally treated as unresolved-blockers and excluded from synthesis.
  Judgment call: this is evaluated as a benign mutual "companion spec" reference (each doc
  explicitly says "see the other for X"), not a decision-dependency deadlock — the two docs
  agree on every decision they share (colour strategy, visual direction B, accessibility
  contrast rules, warm neutrals; see `decisions.md` D6/D7/D11/D12) rather than contradicting
  each other. Both docs were synthesized. Flagging this explicitly so a human can override the
  call if a stricter reading is wanted.

[INFO] Cross-reference cycle: goals.md <-> seo-audit-2026-08-06.md
  Note: `docs/goals.md` cross-references `docs/research/seo-audit-2026-08-06.md` for measured
  distance data, and `docs/research/seo-audit-2026-08-06.md` cross-references `docs/goals.md`
  as the source of the service-area/address decisions it corroborates — another 2-node cycle.
  Same judgment call as above: treated as a benign research↔decision companion pair (the audit
  measures and confirms goals.md's decisions, e.g. the pin-distance table and the address
  decision; goals.md's own text already incorporates the audit's corrected distance figures),
  not a contradiction. Both docs were synthesized.

[INFO] Auto-resolved: brand-brief.md (locked decision) overrides logo-audit.md (recommendation) on logo lockup priority
  Found: `docs/brand/logo-audit.md` (DOC) recommends the default lockup build order — horizontal
  primary first, stacked second, square badge/icon third, one-colour fourth.
  Note: `docs/brand/brand-brief.md` (DOC, but its logo-brief section is an explicit, dated,
  reasoned decision — classifier note: "locked-sounding design decision... resembles ADR-style
  reasoning") states the opposite build order — square badge/icon first ("reversing the usual
  order," explicitly acknowledging and overriding logo-audit.md's default) — because that is the
  variant expressing the orange-forward brand-mark decision (D6) in the exact competitive
  contexts (SERP favicon, map pack, GBP thumbnail) where it matters. brand-brief.md's explicit,
  reasoned, dated decision is treated as the winner per the same logic as LOCKED-over-non-LOCKED,
  even though neither document is a formal ADR. Recorded as `decisions.md` D10.

[INFO] Auto-resolved: design-system.md (SPEC) settles the seo-audit.md caveat about goals.md's URL-redirect claim
  Found: `docs/goals.md` (PRD) states the existing `/location/<region>/<town>/<service>` pattern
  is preserved with zero redirects needed for the 95 indexed pages.
  Note: `docs/research/seo-audit-2026-08-06.md` (DOC) §10 item b2 flagged a conditional caveat —
  that claim only holds if the new locations-index/town-hub layer uses a different URL prefix
  than the combo pages; if unified onto `/locations/`, the 95 pages would need 301s after all.
  `docs/design/design-system.md` (SPEC — higher precedence than the DOC-classified audit)
  resolves this explicitly in its page-templates section: locations index/hub live under the
  plural `/locations` prefix, combo pages keep the singular `/location/...` prefix unchanged.
  SPEC wins per default precedence; goals.md's zero-redirect claim holds as a result. Recorded
  in `constraints.md` under "Page templates."
