/**
 * Footer — Beyond House Cleaning
 *
 * THIS COMPONENT EMITS NO <footer> ELEMENT. It is a composition layer: it
 * supplies sitewide column, legal, social and service-area data to NAPFooter,
 * which owns the landmark, the single tel: link and the
 * HomeAndConstructionBusiness JSON-LD. `check-html-locks.mjs` asserts exactly
 * one <footer> per page, and a second landmark would also break the structural
 * argument behind REQ-nap-consistency — the guarantee is that the NAP block
 * exists once, in one component, rendered from one place.
 *
 * areaServed AND hours ARE FORWARDED, AND THAT IS THE POINT OF THIS FILE.
 * The shipped layout passes both straight to NAPFooter. Plan 02-13 replaces
 * that call with <Footer …/>, so anything this component does not forward is
 * lost from the structured data on all 18 pages with a fully green CI:
 * NAPFooter emits areaServed City nodes ONLY when the array is non-empty
 * (NAPFooter.jsx:44, :68-70), no assertion anywhere counts City nodes, and the
 * JSON-LD BLOCK count is unchanged because areaServed is a property rather
 * than a block. ROADMAP Phase 5 SC-1 requires LocalBusiness + areaServed, so
 * the loss would surface three phases later as a ranking defect with no
 * failing test pointing at its cause.
 *
 * Both are forwarded UNDEFAULTED. NAPFooter's own defaults ([] and the hours
 * string) are the fallback, so a caller that forgets one gets NAPFooter's
 * documented behaviour rather than a second opinion invented here. A default
 * in this file would paper the omission over and make it unfindable.
 *
 * mapsUrl IS PASSED THROUGH UNMODIFIED. NAPFooter applies the WR-10 scheme
 * guard (`/^https?:\/\//i`, NAPFooter.jsx:58) and drops the whole block when
 * it fails. Normalising, trimming or defaulting the value here would defeat
 * that guard from the one place upstream of it.
 *
 * NO phone PROP. The number lives once, in src/phone.js, and NAPFooter
 * defaults from it. Restating it here would be the second source the design
 * removed.
 *
 * NO `as` PROP EITHER, and that is a decision rather than an omission.
 * UI-SPEC §13-J's escape hatch belongs on the component that renders the
 * anchor, and this one renders none: every <a> in the output is NAPFooter's,
 * and NAPFooter takes no `as`. Accepting one here would be dropped silently at
 * a call site that believed it had substituted its router link component. The
 * substitution point is NAPFooter, and it gains the prop there when a router
 * link is actually needed. Omitting it means a typed caller passing `as` gets
 * a compile error instead of a no-op. See the prompt doc.
 */

import { NAPFooter } from '../NAPFooter/NAPFooter.jsx';

export function Footer({
  columns = [],
  legal = [],
  social = [],
  /** Passed through unmodified so NAPFooter's scheme guard applies. */
  mapsUrl,
  /** Forwarded, never defaulted — see the header. */
  areaServed,
  /** Forwarded, never defaulted — see the header. */
  hours,
  className = '',
}) {
  /*
    The NAPFooter guard idiom (NAPFooter.jsx:105-123), applied one level up.
    This component sits in the root layout, so a single malformed entry in a
    Phase-3 nav data file would 500 EVERY route rather than break one list.

    NAPFooter already guards `columns` and `col.links`. It does NOT guard
    `legal` — NAPFooter.jsx:131 maps it unfiltered — so the filter below is
    the only thing standing between a null legal entry and a 500 on all 18
    pages. Same for `social`, which feeds schema `sameAs` through `s.href`.
  */
  const safeColumns = columns.filter(Boolean).map((col) => ({
    heading: col.heading,
    links: (col.links || []).filter(Boolean),
  }));

  return (
    <NAPFooter
      columns={safeColumns}
      legal={legal.filter(Boolean)}
      social={social.filter(Boolean)}
      mapsUrl={mapsUrl}
      areaServed={areaServed}
      hours={hours}
      className={className}
    />
  );
}

export default Footer;
