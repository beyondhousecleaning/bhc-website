/**
 * Interlink geography — pure, no React.
 *
 * Lives apart from InterlinkBlock.jsx so the linking rule can be tested
 * without a JSX toolchain, and so page code can compute links at build time.
 *
 * PUBLISHED AS THE `./geo` SUBPATH, not only through the barrel. The barrel
 * re-exports these three functions through InterlinkBlock.jsx, so importing
 * them from `.` drags a .jsx specifier in and a plain `node` process cannot
 * resolve it (there is no JSX loader — five plans in Phase 2 hit this). The
 * subpath is one line in the exports map: no dependency, no build step, and
 * `files: ["src"]` already carried this file. It is what lets a data or
 * composition module that computes links be checked by bare `node`.
 *
 * The whole point: internal links are DERIVED from geography, never
 * hand-picked. On the live site four arbitrary combo pages sit in the global
 * footer with 114 inbound links each while the other 91 get a median of 4.
 * Hand-picked links rot; computed ones cannot.
 */

const R_MILES = 3958.8;
const rad = (d) => (d * Math.PI) / 180;

/** Great-circle distance in miles. */
export function distanceMiles(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_MILES * Math.asin(Math.sqrt(h));
}

/** The `count` towns nearest to `town`, excluding itself, nearest first. */
export function nearestTowns(town, allTowns, count = 5) {
  return allTowns
    .filter((t) => t.slug !== town.slug)
    .map((t) => ({ town: t, miles: distanceMiles(town, t) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count);
}

/**
 * Build both interlink blocks for a combo page.
 * Returns `{ services, nearby }`, each ready to spread into <InterlinkBlock />.
 *
 * `metaFor(destination, miles)` is an OPTIONAL formatter for the secondary line
 * under each NEARBY link. It defaults to the string this module has always
 * produced, so a caller that does not pass one gets today's behaviour
 * unchanged — the optional-with-fallback idiom TownCard.jsx uses for
 * `HEADING_TAGS[headingLevel] || HEADING_TAGS[3]`, which itself cites
 * Button.jsx:12-17. A default rather than a throw, deliberately: there are no
 * existing callers to break, and the point is that later phases inherit a
 * component whose behaviour did not change underneath them.
 *
 * WHY IT EXISTS. The geography belongs in the ORDERING — which town is nearest
 * is what makes an interlink computed rather than hand-picked, and that is the
 * whole of what Success Criterion 4 requires. The DISTANCE is a separate thing,
 * and publishing it works against the page: a spoke page whose entire job is to
 * read as local should not annotate its own links with how far away they are.
 * The default is kept for the component's own preview and for any caller that
 * genuinely wants a distance; at page scale the caller passes the destination's
 * county instead. Returning `undefined` suppresses the line entirely —
 * InterlinkBlock.jsx:54 renders the span only for a truthy `meta`.
 *
 * The SERVICES block's `meta` is the service tagline and is not affected.
 */
export function buildInterlinks({
  town,
  service,
  allTowns,
  allServices,
  nearbyCount = 5,
  metaFor = (destination, miles) => `${miles.toFixed(1)} miles away`,
}) {
  const services = {
    variant: 'services',
    heading: `Other cleaning services in ${town.name}`,
    links: allServices
      .filter((s) => s.slug !== service.slug)
      .map((s) => ({
        href: `/location/${town.region}/${town.slug}/${s.slug}`,
        label: `${s.name} in ${town.name}`,
        meta: s.tagline,
      })),
  };

  const nearby = {
    variant: 'nearby',
    heading: `${service.name} in nearby towns`,
    links: nearestTowns(town, allTowns, nearbyCount).map(({ town: t, miles }) => ({
      href: `/location/${t.region}/${t.slug}/${service.slug}`,
      label: `${service.name} in ${t.name}`,
      meta: metaFor(t, miles),
    })),
  };

  return { services, nearby };
}
