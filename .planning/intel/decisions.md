# Decisions

No documents in this ingest set were classified `ADR`. The entries below are decisions embedded
in PRD/SPEC/DOC-classified documents that the classifiers explicitly flagged as locked,
ADR-shaped content (status "already agreed by Sam," dated, with rejected-alternative reasoning)
despite lacking ADR frontmatter/structure. They are preserved here as locked decisions, each
tagged with the precedence level of its source document (no auto-promotion to ADR-level
precedence occurred — see `SYNTHESIS.md` for the reasoning).

Source precedence for this doc set: PRD (goals.md) > SPEC (design-system.md, photo-spec.md) >
DOC (brand-brief.md, logo-audit.md, and the rest) — per default ordering with brand-brief.md's
locked content treated as companion-SPEC-weight per synthesis instruction (see note on each
entry).

---

## D1 — Service area: expand, don't pivot

- **Source:** `docs/goals.md` (PRD) — "DECIDED 2026-08-06"
- **Decision:** Keep existing Warwickshire + Coventry + Solihull South coverage (19 towns, 95
  live pages) and add five new postcode areas — B (Birmingham), DY (Dudley), TF (Telford),
  WS (Walsall), WV (Wolverhampton) — on top. Combined ≈56 unique towns.
- **Status:** Locked (PRD-level).
- **Scope:** service-area coverage, page count targets.

## D2 — Keep the existing URL pattern

- **Source:** `docs/goals.md` (PRD)
- **Decision:** `/location/<region>/<town>/<service>` is preserved for all combo pages,
  including the 95 already-indexed Warwickshire pages — zero redirects required for those.
  New region slugs: `west-midlands`, `staffordshire`, `shropshire`, `worcestershire`.
- **Status:** Locked (PRD-level).
- **Scope:** URL architecture.
- **Note:** `docs/research/seo-audit-2026-08-06.md` (§10, item b2) flags a conditional caveat —
  this claim only holds if the new locations-index/town-hub layer uses a *different* URL prefix
  than the combo pages. `docs/design/design-system.md` (SPEC) resolves this explicitly by
  putting the index/hub at `/locations` and `/locations/<town>` (plural) while combos stay at
  `/location/<region>/<town>/<service>` (singular) — see auto-resolved INFO entry in
  `INGEST-CONFLICTS.md`.

## D3 — Keep the Leamington pin; new areas are organic-only

- **Source:** `docs/goals.md` (PRD), confirmed in `docs/research/seo-audit-2026-08-06.md` (DOC,
  measurement-only, does not out-rank the PRD but corroborates it)
- **Decision:** Do not relocate the GBP pin. Registered office (residential, Leamington Spa) is
  Leamington Spa, CV32 6EQ (geocoded 52.29358, −1.55378) remains the pin. Map-pack is a
  Warwickshire/Coventry-only win; all five new postcode areas (≥18.8 miles out) are treated as
  organic-only unless a second staffed premises with its own GBP is opened.
- **Status:** Locked (PRD-level).
- **Scope:** local SEO strategy, GBP configuration.

## D4 — Hide the address everywhere (🔒 marked in source)

- **Source:** `docs/goals.md` (PRD), "decided 2026-08-06"; independently corroborated in
  `docs/research/seo-audit-2026-08-06.md` §7 ("Resolved 2026-08-06 (Sam)")
- **Decision:** CV32 6EQ is residential — suppress it everywhere. GBP already correctly
  configured as a service-area business with address suppressed (confirmed by Sam, nothing to
  change). Site footer carries a service-area statement + exactly one phone number, no street
  address. Schema uses `LocalBusiness` + `areaServed` with **no `streetAddress`** anywhere.
- **Status:** Locked (PRD-level). Also codified as CI Lock #5 in `design-system.md` (SPEC):
  "No street address or UK postcode in any rendered output."
- **Scope:** privacy/address handling, schema markup, footer content.

## D5 — Platform: Next.js on Vercel, not Webflow

- **Source:** `docs/goals.md` (PRD)
- **Decision:** Build on Next.js/Vercel rather than continuing on Webflow. Rationale: ~336
  programmatic pages generated from one `towns.ts` data file crossed with a canonical services
  list is trivial in code, gives full control of schema/canonicals/Core Web Vitals/redirects —
  the areas Arbor Trail (and the current site) fail on.
- **Status:** Locked (PRD-level). Assumed as a precondition throughout `design-system.md` (SPEC)
  and reinforced by `seo-audit-2026-08-06.md` §10 (b8: "Next.js/Vercel drops the 720 KB Webflow
  runtime + 87 KB jQuery for free").
- **Scope:** platform/hosting choice.

## D6 — Colour strategy: blue structures, orange owns actions, marks go orange-forward

- **Source:** `docs/design/design-system.md` (SPEC, "Decisions locked" table); identical
  decision independently stated with full rationale in `docs/brand/brand-brief.md` (DOC, "The
  decision: split the palette by context")
- **Decision:** On-site, blue (`--navy`/`--blue`/`--cyan`) structures headers/section
  surfaces/trust; orange (`--action`) owns every action (buttons, links, active states). On
  brand marks (favicon, square badge, GBP profile photo, social avatar) go orange-forward.
  Rationale: Arbor Trail's palette is near-identical to BHC's blue range, so orange is the only
  differentiator, and it matters most in competitive contexts (SERP favicon, map pack, GBP
  thumbnail).
- **Status:** Locked (SPEC-level, corroborated at DOC-level by brand-brief.md — no conflict,
  identical content from two sources).
- **Scope:** visual design tokens, brand marks.

## D7 — Visual direction: B, "warm local craft"

- **Source:** `docs/design/design-system.md` (SPEC, "Decisions locked" table); full
  rejected-alternatives reasoning in `docs/brand/brand-brief.md` (DOC)
- **Decision:** Chosen from four candidates (bold trades confidence / clean editorial /
  bright & energetic / warm local craft). Direction B: humanist sans, rounded corners, generous
  whitespace, subtle texture; before/after pairs and real people lead the page; reads as "a real
  local team, not a call centre." Layout borrows Arbor Trail's proven section order; appearance
  deliberately does not.
- **Status:** Locked (SPEC-level, corroborated at DOC-level).
- **Scope:** visual design direction, positioning.

## D8 — Prescriptiveness: lock what SEO needs, leave the visual open

- **Source:** `docs/design/design-system.md` (SPEC, "Decisions locked" table)
- **Decision:** The design system locks only what the SEO audit requires (H1 structure,
  breadcrumbs, rating badge, NAP footer, interlinking, schema — see "The locks," 11 CI
  assertions). Everything else (final typeface, exact photographic treatment, specific layout
  polish) is left to Claude Design's latitude.
- **Status:** Locked (SPEC-level).
- **Scope:** design governance / division of authority between Claude Design and the SEO locks.

## D9 — Deliverable format: tokens as code + React components, not markdown

- **Source:** `docs/design/design-system.md` (SPEC, "Decisions locked" table)
- **Decision:** Design system ships as `tokens.css` + React components (`.jsx`/`.html`/`.d.ts`/
  `.prompt.md` per component, matching the Project BK V3 package shape), not a markdown
  handoff document — to prevent design→build drift.
- **Status:** Locked (SPEC-level).
- **Scope:** build tooling / design-to-code workflow.

## D10 — Logo lockup priority: square badge first, reversing the usual order

- **Source:** `docs/brand/brand-brief.md` (DOC, explicitly reasoned "locked decision" per
  classifier note — treated as companion-SPEC-weight alongside design-system.md)
- **Decision:** Build the square badge/icon lockup **first** (favicon, GBP profile photo,
  social avatars — where the orange-forward decision is expressed and where BHC currently looks
  identical to competitors), then horizontal primary, then stacked, then one-colour
  navy+knockout last.
- **Status:** Locked (elevated DOC — see `INGEST-CONFLICTS.md` INFO entry; this explicitly
  supersedes the plain recommendation order in `docs/brand/logo-audit.md`, which lists
  horizontal primary first and square badge third).
- **Scope:** logo rebuild sequencing.

## D11 — Accessibility contrast rules (orange/cyan text pairing)

- **Source:** `docs/design/design-system.md` (SPEC, measured contrast table); restated in
  `docs/brand/brand-brief.md` (DOC)
- **Decision:** Orange fills (`--action`) always take `--ink` (dark navy) labels, never white
  (white-on-orange measures 3.05:1, fails the 4.5:1 AA requirement). `--cyan` never carries
  white text (2.75:1, fails even large text) but is fine as a surface with `--ink` on top
  (5.75:1). `--blue` is not a body-text surface for white copy — use `--navy` instead.
- **Status:** Locked (SPEC-level, corroborated at DOC-level).
- **Scope:** colour/contrast/accessibility rules, component styling.

## D12 — Warm, not cold, neutrals

- **Source:** `docs/design/design-system.md` (SPEC); reasoned in `docs/brand/brand-brief.md`
  (DOC)
- **Decision:** Use warm off-whites (`--paper-warm` #FBF8F5, `--paper-tint` #F5EFE8) for
  section bands/cards instead of Arbor Trail's cold blue tint (`#eef7ff`). Do not substitute
  neutral greys.
- **Status:** Locked (SPEC-level, corroborated at DOC-level).
- **Scope:** colour tokens.

## D13 — FAQPage schema excluded; accordion stays for users only

- **Source:** `docs/design/design-system.md` (SPEC, "Deliberately excluded" table); corroborated
  in `docs/research/seo-audit-2026-08-06.md` and `docs/brand/brand-brief.md`
- **Decision:** Do not design around `FAQPage` rich-result schema — Google retired FAQ rich
  results 2026-05-07. Keep the FAQ accordion for users/AI-readability only.
- **Status:** Locked (SPEC-level).
- **Scope:** schema markup scope, component design.

## D14 — Canonical service taxonomy: UK vocabulary throughout

- **Source:** Sam, decided during `/gsd:ingest-docs` routing 2026-08-08, resolving the item
  `docs/goals.md` and `docs/research/seo-audit-2026-08-06.md` §10 (b3) both flagged as open.
- **Decision:** One slug per concept, UK vocabulary throughout — matching what the location
  pages already use and what the audit recommended (no doc proposed a competing answer):
  `domestic-cleaning`, `end-of-tenancy-cleaning`, `deep-cleaning`, `apartment-cleaning`,
  `move-in-cleaning`, `move-out-cleaning`, `short-term-rental-cleaning`,
  `post-construction-cleaning`. The 4 existing Americanised service-page slugs
  (`standard-home-cleaning` → `domestic-cleaning`, etc.) get 301s; the 57 location pages using
  UK slugs already need none.
- **Status:** Locked (decided directly by Sam, PRD-equivalent weight).
- **Scope:** URL/service taxonomy, redirects. Supersedes the OPEN status of
  `REQ-canonical-service-taxonomy` in `requirements.md`.
