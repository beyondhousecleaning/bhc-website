import { Hero } from '@bhc/design-system';

/**
 * Photography is still blocked (all Canva exports carry the old logo), so the
 * media slot uses the same honest placeholder the repo's own preview ships.
 * Lock 7: the alt text is real and non-empty.
 */
const PLACEHOLDER =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23F5EFE8'/%3E%3Ctext x='400' y='295' font-family='sans-serif' font-size='22' fill='%234A5A72' text-anchor='middle'%3EBefore/after photography%3C/text%3E%3Ctext x='400' y='325' font-family='sans-serif' font-size='16' fill='%234A5A72' text-anchor='middle'%3Eblocked on Canva originals%3C/text%3E%3C/svg%3E";

const image = {
  src: PLACEHOLDER,
  alt: 'Placeholder — awaiting original before/after photography',
  width: 800,
  height: 600,
};

const rating = { rating: 4.9, count: 175, source: 'Google' };

/** The canonical combo page: service + town in the h1, rating above it. */
export const LocationPage = () => (
  <Hero
    eyebrow="Reliable & Affordable"
    heading="Deep Cleaning in Warwick"
    lead="DBS-checked local cleaners who turn up when they say they will. Skirting boards to oven interiors, every surface back to new."
    rating={rating}
    actions={[
      { label: 'Get a Free Quote', href: '/get-a-quote' },
      { label: 'Call 07861 936533', href: 'tel:+447861936533' },
    ]}
    image={image}
  />
);

/** A service hub — no town in the heading, so the service carries it alone. */
export const ServicePage = () => (
  <Hero
    eyebrow="Deposit-back guarantee"
    heading="End of Tenancy Cleaning"
    lead="A landlord-ready clean against the full inventory checklist, booked around your move-out date."
    rating={rating}
    actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
    image={image}
  />
);

/** Centred variant — drops the media slot entirely. Used on town hubs. */
export const Centered = () => (
  <Hero
    align="centered"
    eyebrow="56 towns across the West Midlands"
    heading="House Cleaning in Leamington Spa"
    lead="Regular, deep and end-of-tenancy cleans across Warwickshire and the West Midlands."
    rating={rating}
    actions={[
      { label: 'Get a Free Quote', href: '/get-a-quote' },
      { label: 'See Areas We Cover', href: '/locations', variant: 'secondary' as const },
    ]}
  />
);

/** Minimal — heading only. `heading` is required because it IS the page h1. */
export const HeadingOnly = () => <Hero heading="Oven Cleaning in Kenilworth" />;

/**
 * The live-site bug this component's prop split prevents: on 101 of 115 pages
 * the h1 is "Reliable & Affordable" and the keyword line is a styled div.
 */
export const HeadingDiscipline = () => (
  <div>
    <Hero
      eyebrow="Reliable & Affordable"
      heading="Carpet Cleaning in Coventry"
      lead="Stains lifted, pile restored, and dry in a few hours. Stairs, landings and rugs included."
      actions={[{ label: 'Get a Free Quote', href: '/get-a-quote' }]}
    />
    <div style={{ padding: '32px 48px', background: 'var(--bhc-paper)' }}>
      <p
        style={{
          font: '600 12px/1 var(--bhc-font-body)',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: 'var(--bhc-danger)',
          margin: '0 0 12px',
        }}
      >
        The live-site bug this prevents
      </p>
      <p
        style={{
          font: '400 15px/1.6 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: 0,
          maxWidth: '70ch',
        }}
      >
        On 101 of 115 live pages the h1 is “Reliable &amp; Affordable” and the keyword line is a
        div — 0 of 95 location-page H1s contain their town. Here they are separate props and
        <code> heading</code> is always the h1. There is no prop that promotes the eyebrow.
      </p>
    </div>
  </div>
);
