import type { Review } from '../ReviewCard/ReviewCard';

export interface ReviewRailProps {
  /**
   * Defaults to `What our customers say`, or to `What {town} customers say`
   * when `town` is given and no heading is. An explicit heading always wins — a
   * page that has said what it wants said does not get it rewritten underneath
   * it.
   *
   * The default names no county on purpose: no review in the data carries a
   * town (02-16) and none may be invented one, so a county in the heading is a
   * claim the data cannot support — and outside Warwickshire it is simply false.
   */
  heading?: string;
  /**
   * **An empty array renders `null`** — no rail, no empty rail, and no
   * "no reviews yet" message. Phase 4 supplies the data; every Phase 2 template
   * composes this component with `[]` on purpose.
   */
  reviews: Review[];
  /** Narrows the default heading and the scroll region's accessible name. */
  town?: string;
  /**
   * The section's anchor id. Defaults to `reviews`.
   *
   * The `Read Our Reviews` call to action points at it and is live again. It
   * had been withdrawn from the closed set precisely because this component
   * rendered nothing without data; the id is what made reinstating that link a
   * data change rather than an API change, which is exactly what happened when
   * the real reviews landed. Override it only if a page needs two rails, and
   * point the action at the one it should reach.
   */
  id?: string;
  className?: string;
}

export declare function ReviewRail(props: ReviewRailProps): JSX.Element | null;
export default ReviewRail;
