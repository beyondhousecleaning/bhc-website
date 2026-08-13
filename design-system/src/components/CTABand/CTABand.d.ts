export interface CTAAction {
  label: string;
  href: string;
  /**
   * Defaults to `primary` for the first action and `ghost` for the rest. On a
   * navy band a `secondary` is coerced to `ghost`: outlined ink measures 2.65:1
   * against `--bhc-navy` and disappears.
   */
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface CTABandProps {
  /** Required. Renders the band's `<h2>` — the closing ask, e.g. "Ready for a properly clean home?". */
  heading: string;
  /** The supporting line under it. Flips to `--bhc-paper` on navy (5.97:1). */
  lead?: string;
  /**
   * One `primary` and one `ghost`. Defaults to `[]`, and null entries are
   * filtered — this band renders on every route, so a malformed data-file entry
   * must not throw during server render.
   */
  actions?: CTAAction[];
  /**
   * `navy` is **the one dark band on the page**, always immediately above the
   * footer, never more than one per page. `tint` is the quiet alternative for a
   * page that already carries its dark note elsewhere. An unknown value
   * degrades to `navy`.
   */
  tone?: 'navy' | 'tint';
  /** Anchor target for the `<section>`. */
  id?: string;
  className?: string;
}

export declare function CTABand(props: CTABandProps): JSX.Element;
export default CTABand;
