/**
 * The star glyph. Exported so `ReviewCard` can render the same five-star row
 * without a second copy of the path data. `aria-hidden` — the meaning lives on
 * the `role="img"` wrapper that groups the five.
 */
export declare function Star(props: { filled: boolean }): JSX.Element;

export interface RatingBadgeProps {
  /** Current: 4.9. Read from the Trustmary payload 2026-08-06. */
  rating?: number;
  /** Current: 175. */
  count?: number;
  source?: string;
  /** Drops the pill chrome — for use inside a hero or on a tinted band. */
  bare?: boolean;
  /**
   * Emit AggregateRating JSON-LD. For the entity graph only — self-serving and
   * third-party-widget review markup are both ineligible for SERP stars.
   * At most once per page.
   */
  emitSchema?: boolean;
  businessName?: string;
  className?: string;
}

export declare function RatingBadge(props: RatingBadgeProps): JSX.Element;
export default RatingBadge;
