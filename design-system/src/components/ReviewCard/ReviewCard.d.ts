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
  /** A rendered string such as `June 2026`, not a Date — the package is pure. */
  date: string;
  source?: 'Google';
}

export interface ReviewCardProps {
  /** A single review. A missing or null review renders nothing at all. */
  review: Review;
  className?: string;
}

export declare function ReviewCard(props: ReviewCardProps): JSX.Element | null;
export default ReviewCard;
