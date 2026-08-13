export interface FooterLink { label: string; href: string }
export interface FooterColumn { heading: string; links: FooterLink[] }

export interface NAPFooterProps {
  businessName?: string;
  /**
   * The ONE phone number, in any format. The displayed string is DERIVED from
   * it — there is deliberately no prop for display text, so href and label
   * cannot diverge (Lock 4).
   *
   * Optional, and you should leave it unset: it defaults to the package's
   * single canonical constant (`src/phone.js`), which is the only executable
   * place the number exists. Passing a literal here recreates the second
   * source this design removed.
   *
   * A value that cannot be rendered as a dialable number THROWS at build time
   * rather than degrading to `tel:+44`. See `toDial`.
   */
  phone?: string;
  serviceArea?: string;
  hours?: string;
  /**
   * The GBP **place** URL. The live footer links
   * `google.com/maps/place/Royal+Leamington+Spa,+UK` — the town, not the
   * business — which is a wasted local signal.
   *
   * Scheme-validated: anything that is not `http(s)` is dropped, and the whole
   * "Find us on Google" block disappears with it rather than rendering a link
   * that cannot be followed. The same guarded value feeds schema `sameAs`.
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

/**
 * `+447861936533` → `"+44 7861 936533"`. Exported for tests asserting Lock 4.
 *
 * Throws a `TypeError` on any value `toDial` rejects — it calls `toDial` first,
 * so the two reject exactly the same inputs.
 */
export declare function formatPhone(dial: string): string;

/**
 * Any UK form → `+447861936533`. A value already carrying a non-UK country
 * code is passed through with its own code, never given a fabricated `+44`.
 *
 * Throws a `TypeError` rather than degrading: a non-string, a value with no
 * digits, or a UK national part that is not exactly 10 digits has no correct
 * rendering, and the alternative to failing the build is prerendering an empty
 * `tel:` link onto every page (WCAG 2.4.4).
 */
export declare function toDial(value: string): string;

export declare function NAPFooter(props: NAPFooterProps): JSX.Element;
export default NAPFooter;
