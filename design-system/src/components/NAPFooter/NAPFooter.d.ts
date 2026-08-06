export interface FooterLink { label: string; href: string }
export interface FooterColumn { heading: string; links: FooterLink[] }

export interface NAPFooterProps {
  businessName?: string;
  /**
   * The ONE phone number, in any format. The displayed string is DERIVED from
   * it — there is deliberately no prop for display text, so href and label
   * cannot diverge (Lock 4).
   */
  phone?: string;
  serviceArea?: string;
  hours?: string;
  /**
   * The GBP **place** URL. The live footer links
   * `google.com/maps/place/Royal+Leamington+Spa,+UK` — the town, not the
   * business — which is a wasted local signal.
   */
  mapsUrl?: string;
  social?: FooterLink[];
  columns?: FooterColumn[];
  legal?: FooterLink[];
  siteUrl?: string;
  /** City names for schema `areaServed`. No street address — Lock 5. */
  areaServed?: string[];
  className?: string;
}

/** `+447861936533` → `"+44 7861 936533"`. Exported for tests asserting Lock 4. */
export declare function formatPhone(dial: string): string;

export declare function NAPFooter(props: NAPFooterProps): JSX.Element;
export default NAPFooter;
