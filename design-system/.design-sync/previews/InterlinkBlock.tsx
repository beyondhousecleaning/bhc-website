import { InterlinkBlock, buildInterlinks, nearestTowns } from '@bhc/design-system';

/**
 * Real service-area geography. Coordinates match the set the lock tests use,
 * so the "N miles away" strings below are computed, not written by hand.
 */
const TOWNS = [
  { slug: 'warwick', name: 'Warwick', region: 'warwickshire', lat: 52.2819, lon: -1.5849 },
  { slug: 'leamington-spa', name: 'Leamington Spa', region: 'warwickshire', lat: 52.2852, lon: -1.5201 },
  { slug: 'kenilworth', name: 'Kenilworth', region: 'warwickshire', lat: 52.3417, lon: -1.5822 },
  { slug: 'coventry', name: 'Coventry', region: 'west-midlands', lat: 52.4068, lon: -1.5197 },
  { slug: 'stratford-upon-avon', name: 'Stratford-upon-Avon', region: 'warwickshire', lat: 52.1917, lon: -1.7073 },
  { slug: 'rugby', name: 'Rugby', region: 'warwickshire', lat: 52.3705, lon: -1.2646 },
  { slug: 'solihull', name: 'Solihull', region: 'west-midlands', lat: 52.4118, lon: -1.7776 },
  { slug: 'birmingham', name: 'Birmingham', region: 'west-midlands', lat: 52.4797, lon: -1.9026 },
];

const SERVICES = [
  { slug: 'deep-cleaning', name: 'Deep Cleaning', tagline: 'Top to bottom, twice a year' },
  { slug: 'domestic-cleaning', name: 'Domestic Cleaning', tagline: 'Weekly or fortnightly' },
  { slug: 'end-of-tenancy-cleaning', name: 'End of Tenancy Cleaning', tagline: 'Deposit-back standard' },
  { slug: 'apartment-cleaning', name: 'Apartment Cleaning', tagline: 'Communal areas included' },
  { slug: 'move-out-cleaning', name: 'Move-Out Cleaning', tagline: 'Booked around completion' },
  { slug: 'short-term-rental-cleaning', name: 'Short-Term Rental Cleaning', tagline: 'Same-day changeovers' },
];

const warwick = TOWNS[0];
const deepCleaning = SERVICES[0];

const built = buildInterlinks({
  town: warwick,
  service: deepCleaning,
  allTowns: TOWNS,
  allServices: SERVICES,
  nearbyCount: 5,
});

/** Sibling services in the same town — the `services` variant. */
export const SiblingServices = () => <InterlinkBlock {...built.services} />;

/**
 * The same service in the nearest towns. Every `meta` string is a computed
 * great-circle distance, so the block cannot rot as towns are added.
 */
export const NearbyTowns = () => <InterlinkBlock {...built.nearby} />;

/** With an intro line, as the town hub uses it. */
export const WithIntro = () => (
  <InterlinkBlock
    variant="services"
    heading="Cleaning services in Leamington Spa"
    intro="Every service below is available across Leamington Spa and the surrounding Warwickshire towns."
    links={SERVICES.map((s) => ({
      href: `/location/warwickshire/leamington-spa/${s.slug}`,
      label: `${s.name} in Leamington Spa`,
      meta: s.tagline,
    }))}
  />
);

/**
 * Why the links are computed. Warwick's five nearest towns, in order, with the
 * distances the component puts in `meta` — Telford at ~46 miles never appears.
 */
export const DerivedNotHandPicked = () => (
  <div>
    <InterlinkBlock {...built.nearby} />
    <div style={{ padding: '24px 40px 32px', background: 'var(--bhc-paper)' }}>
      <p
        style={{
          font: '600 12px/1 var(--bhc-font-body)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--bhc-danger)',
          margin: '0 0 12px',
        }}
      >
        The live-site problem this solves
      </p>
      <p
        style={{
          font: '400 14px/1.6 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: '0 0 12px',
          maxWidth: '70ch',
        }}
      >
        Four arbitrary combo pages sit in the live global footer with 114 inbound links each; the
        other 91 get a median of 4. Four hardcoded links cannot distribute authority across ~336
        pages. Above, the order and the distances came from{' '}
        <code>nearestTowns(warwick, TOWNS, 5)</code>:
      </p>
      <ol
        style={{
          font: '400 14px/1.7 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: 0,
          paddingLeft: '1.4em',
        }}
      >
        {nearestTowns(warwick, TOWNS, 5).map(({ town, miles }) => (
          <li key={town.slug}>
            {town.name} — {miles.toFixed(1)} miles
          </li>
        ))}
      </ol>
    </div>
  </div>
);
