import { RatingBadge } from '@bhc/design-system';

const Frame = ({ label, background = 'var(--bhc-paper)', children }: any) => (
  <div style={{ padding: 40, background }}>
    <p
      style={{
        font: '600 12px/1 var(--bhc-font-body)',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--bhc-ink-muted)',
        margin: '0 0 16px',
      }}
    >
      {label}
    </p>
    {children}
  </div>
);

/** The shipped pill — server-rendered, so the rating is indexable content. */
export const Default = () => (
  <Frame label="Pill — the default, on white">
    <RatingBadge rating={4.9} count={175} source="Google" />
  </Frame>
);

/** `bare` drops the pill chrome, for use inside a hero or on a tinted band. */
export const Bare = () => (
  <Frame label="Bare — inside a hero or on a tinted band" background="var(--bhc-paper-tint)">
    <RatingBadge rating={4.9} count={175} source="Google" bare />
  </Frame>
);

/** Star fill rounds to the nearest whole star; the label keeps the exact value. */
export const RatingScale = () => (
  <Frame label="Star fill rounds — the accessible label keeps the exact value">
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <RatingBadge rating={5} count={212} source="Google" />
      <RatingBadge rating={4.9} count={175} source="Google" />
      <RatingBadge rating={4.6} count={38} source="Checkatrade" />
      <RatingBadge rating={4.2} count={11} source="Facebook" />
    </div>
  </Frame>
);

/**
 * Same component with `emitSchema` — adds AggregateRating JSON-LD for the
 * entity graph. At most once per page, and never for SERP stars.
 */
export const WithSchema = () => (
  <div>
    <Frame label="emitSchema — entity graph only, once per page">
      <RatingBadge rating={4.9} count={175} source="Google" emitSchema />
    </Frame>
    <div style={{ padding: '0 40px 32px', background: 'var(--bhc-paper)' }}>
      <p
        style={{
          font: '400 14px/1.6 var(--bhc-font-body)',
          color: 'var(--bhc-ink-muted)',
          margin: 0,
          maxWidth: '70ch',
        }}
      >
        The visible output is identical — the difference is an inline
        <code> AggregateRating</code> block in the page HTML. Self-serving review markup is
        ineligible for SERP stars, so this is for the entity graph, not rich results.
      </p>
    </div>
  </div>
);

/**
 * Light surfaces only. `.bhc-rating__value` and `.bhc-rating__count` set
 * --bhc-ink / --bhc-ink-muted directly rather than inheriting currentColor,
 * so the badge is not usable on navy or any dark band.
 */
export const SurfacesItSupports = () => (
  <div style={{ display: 'grid' }}>
    <Frame label="On white">
      <RatingBadge rating={4.9} count={175} source="Google" />
    </Frame>
    <Frame label="On the warm section band" background="var(--bhc-paper-warm)">
      <RatingBadge rating={4.9} count={175} source="Google" bare />
    </Frame>
    <Frame label="On the card tint" background="var(--bhc-paper-tint)">
      <RatingBadge rating={4.9} count={175} source="Google" bare />
    </Frame>
  </div>
);
