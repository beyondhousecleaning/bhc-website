import type { Review } from '../ReviewCard/ReviewCard';

export interface ReviewRailProps {
  /**
   * Defaults to `What Warwickshire customers say`, or to
   * `What {town} customers say` when `town` is given and no heading is. An
   * explicit heading always wins — a page that has said what it wants said does
   * not get it rewritten underneath it.
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
   * Nothing links to it in Phase 2: the `Read Our Reviews` call to action was
   * withdrawn from the closed set precisely because this component renders
   * nothing without data. The id exists so Phase 4 reinstates that link with a
   * data change rather than an API change.
   */
  id?: string;
  className?: string;
}

export declare function ReviewRail(props: ReviewRailProps): JSX.Element | null;
export default ReviewRail;
