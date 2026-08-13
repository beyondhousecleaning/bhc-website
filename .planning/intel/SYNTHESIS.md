# Synthesis Summary — BHC website rebuild doc ingest

Mode: `new`. Classifications consumed: 10, all from
`/Users/samgastonclarke/projects/bhc-website/.planning/intel/classifications/`.

## Doc counts by type

| Type | Count | Docs |
|---|---|---|
| ADR | 0 | — |
| SPEC | 2 | `docs/design/design-system.md`, `docs/brand/photo-spec.md` |
| PRD | 1 | `docs/goals.md` |
| DOC | 7 | `docs/brand/brand-brief.md`, `docs/brand/logo-audit.md`, `docs/research/competitor-arbor-trail.md`, `docs/research/seo-audit-2026-08-06.md`, `docs/research/service-area-coverage.md`, `docs/seo/skills.md`, `docs/seo/audit-kickoff-prompt.md` |

No document was classified `UNKNOWN` or flagged `low` confidence — nothing surfaces as a
re-tag-and-rerun blocker.

## Decisions locked (`decisions.md`) — 13

No ADRs exist in this set, so none of these carry ADR-level precedence. They are decisions
embedded in PRD/SPEC/DOC content that the classifiers explicitly flagged as locked/ADR-shaped
(dated, reasoned against rejected alternatives, stated as already agreed by Sam) and are
preserved at their source document's precedence level:

- PRD-level (`docs/goals.md`): D1 service-area expansion, D2 URL pattern preserved, D3 keep
  Leamington pin / new areas organic-only, D4 hide address everywhere, D5 platform = Next.js on
  Vercel.
- SPEC-level (`docs/design/design-system.md`, corroborated at DOC-level by
  `docs/brand/brand-brief.md`): D6 colour strategy, D7 visual direction B, D8 prescriptiveness
  split, D9 deliverable format, D11 accessibility contrast rules, D12 warm neutrals, D13 FAQPage
  schema excluded.
- Elevated-DOC (`docs/brand/brand-brief.md`, explicitly reasoned/dated, overriding a plain DOC
  recommendation): D10 logo lockup priority (square badge first).

## Requirements extracted (`requirements.md`) — 9

`REQ-organic-visibility`, `REQ-programmatic-page-scale`, `REQ-review-count-visible`,
`REQ-fix-duplicate-coventry`, `REQ-canonical-service-taxonomy` (OPEN — not yet decided),
`REQ-content-priority-sequencing` (OPEN — recommended but not marked DECIDED),
`REQ-content-depth-bar`, `REQ-hub-and-spoke-architecture`, `REQ-nap-consistency`.

Two requirements are explicitly flagged OPEN — no doc in this set contradicts the recommended
answer, but Sam has not marked either DECIDED the way D1–D5 are. Roadmapper should treat these
as decisions to route back to Sam, not as settled requirements.

## Constraints (`constraints.md`) — breakdown

- schema: design tokens, component contracts, page templates, JSON-LD schema-to-emit.
- nfr: 11 SEO CI locks (build-time assertions), location-page targeting rule (promoted from
  `service-area-coverage.md`), promoted (a)/(b)/(c) fix-list constraints from the SEO audit
  (promoted from `seo-audit-2026-08-06.md`, DOC-classified).
- protocol: before/after photo spec (format, naming, transfer, SEO priority order) from
  `photo-spec.md`.

## Context topics (`context.md`) — 8

Competitor model (Arbor Trail), live-site audit general findings, SEO tooling installed, logo
audit measured findings, service-area postcode data, kickoff process note, photography
positioning rationale, brand positioning statement.

## Conflicts: 0 blockers, 0 competing-variants, 4 auto-resolved/info

Full detail in `../INGEST-CONFLICTS.md`. Two items in the INFO bucket are cross-reference
cycles (`brand-brief.md`<->`design-system.md`, `goals.md`<->`seo-audit-2026-08-06.md`) that a
strict reading of the cycle-detection rule would treat as blockers; they were evaluated as
benign companion-doc mutual references (not decision-dependency deadlocks — the paired docs
agree with each other in every case checked) and synthesized rather than excluded. This is a
judgment call, documented in full in the conflicts report — flag for review if a stricter
reading is wanted. The other two INFO entries are genuine precedence-driven auto-resolutions:
brand-brief.md's logo-priority decision overriding logo-audit.md's default recommendation, and
design-system.md's URL-prefix choice settling a caveat the SEO audit raised about goals.md's
zero-redirect claim.

## Pointers

- Conflict report: `../INGEST-CONFLICTS.md`
- Decisions: `decisions.md`
- Requirements: `requirements.md`
- Constraints: `constraints.md`
- Context: `context.md`
