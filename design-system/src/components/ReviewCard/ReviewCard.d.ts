export interface Review {
  /**
   * **Capped at 320 characters at the DATA LAYER**, truncated at a word
   * boundary with an ellipsis at ingest. There is no CSS clamp and there may
   * not be one: with no client JavaScript there is no "read more", so clamping
   * hides text from sighted users that screen readers still receive, and the
   * loss widens at 200% zoom (WCAG 1.4.4). What ships is exactly what displays.
   *
   * Phase 4's review pull must honour this cap — it is a property of the data
   * contract, not of the styling.
   *
   * The same contract carries an information-disclosure obligation: review text
   * is externally sourced, and a customer who names their street in a review
   * must not have it published. The built-HTML postcode and street-line scan is
   * the backstop, not the primary control.
   */
  quote: string;
  author: string;
  /** First name and initial, or a first name. Never a full name with a street. */
  town?: string;
  /** Out of 5. Rounded for the glyph row; the exact value goes in the label. */
  rating: number;
  /**
   * A rendered string such as `June 2026`, not a Date — the package is pure.
   *
   * OPTIONAL, and it became optional when the real data landed. The review
   * payload the live site carries holds only a name, a body and a star count;
   * it has no per-review date at all. Requiring the field would have made the
   * only way to satisfy the type a fabricated month on every card, which is the
   * same defect as a fabricated review and is a banned practice under the
   * Digital Markets, Competition and Consumers Act 2024. The card already
   * renders the attribution line from whatever it is given, so absence costs
   * nothing. Supply a real one when a source that carries one exists.
   */
  date?: string;
  source?: 'Google';
}

export interface ReviewCardProps {
  /** A single review. A missing or null review renders nothing at all. */
  review: Review;
  className?: string;
}

export declare function ReviewCard(props: ReviewCardProps): JSX.Element | null;
export default ReviewCard;
