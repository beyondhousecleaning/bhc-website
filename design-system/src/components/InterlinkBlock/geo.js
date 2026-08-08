/**
 * Interlink geography — pure, no React.
 *
 * Lives apart from InterlinkBlock.jsx so the linking rule can be tested
 * without a JSX toolchain, and so page code can compute links at build time.
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
 */
export function buildInterlinks({ town, service, allTowns, allServices, nearbyCount = 5 }) {
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
      meta: `${miles.toFixed(1)} miles away`,
    })),
  };

  return { services, nearby };
}
