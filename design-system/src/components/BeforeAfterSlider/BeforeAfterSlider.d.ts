export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  /** Defaults to `(min-width: 768px) 45vw, 85vw` — two panes side by side. */
  sizes?: string;
  /**
   * **Required, and enforced by a throw.** An unlabelled photograph on seven
   * templates is not shippable, and the image lock scans previews only, so
   * nothing downstream would catch a data file that omitted it.
   *
   * Describe the room and what changed — `Kitchen worktops and splashback after
   * a deep clean` — never `before` or `after` alone. The pane already says
   * which half it is, in real text.
   */
  alt: string;
  width?: number;
  height?: number;
}

export interface BeforeAfterPair {
  before: ResponsiveImage;
  after: ResponsiveImage;
  /** `Kitchen` */
  room: string;
  /** `Deep clean` */
  service: string;
  town?: string;
}

export interface BeforeAfterSliderProps {
  /**
   * Renders an `<h2>` above the figure. Omit it when a `SectionBand` already
   * carries the section heading — that is how every Phase 2 template composes
   * this component.
   */
  heading?: string;
  /** A lead paragraph under the heading. Renders with or without one. */
  intro?: string;
  /**
   * **Absent, null or empty renders the pending state, never `null`.** This is
   * the one component in the package that does not disappear without data:
   * ROADMAP SC-3 requires a visible, clearly labelled state so that no page is
   * blocked on photography that does not exist yet.
   *
   * Supplying pairs switches the figure to `data-bhc-photo-state="live"`. Phase
   * 4 asserts the pending marker reaches zero on the pages it has backfilled.
   */
  pairs?: BeforeAfterPair[];
  className?: string;
}

export declare function BeforeAfterSlider(props: BeforeAfterSliderProps): JSX.Element;
export default BeforeAfterSlider;
