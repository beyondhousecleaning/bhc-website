import type { FooterColumn, FooterLink } from '../NAPFooter/NAPFooter';

export type { FooterColumn, FooterLink };

export interface FooterProps {
  /**
   * The three sitewide link columns (UI-SPEC §7.2: Services · Company ·
   * Customers). Null entries and null links are filtered before they reach
   * `NAPFooter`; a column without `links` renders its heading and an empty list
   * rather than throwing.
   */
  columns?: FooterColumn[];
  /**
   * The legal bottom row — Privacy Policy · Terms of Service · Customer Service
   * Agreement. **Not** a fourth column: it is a separate slot below the grid.
   *
   * Null entries are filtered here because `NAPFooter` maps this array
   * unguarded, and this component sits in the root layout.
   */
  legal?: FooterLink[];
  /** Social profiles. Their `href`s also feed schema `sameAs`. */
  social?: FooterLink[];
  /**
   * The Google Business Profile **place** URL, passed through **unmodified**.
   *
   * `NAPFooter` scheme-validates it (`/^https?:\/\//i`) and drops the whole
   * "Find us on Google" block, and the schema `sameAs` entry, when it fails.
   * Do not normalise, trim or default it here — that would defeat the guard
   * from the one place upstream of it.
   */
  mapsUrl?: string;
  /**
   * City names for the sitewide `HomeAndConstructionBusiness` JSON-LD's
   * `areaServed`. **Forwarded unchanged and never defaulted.**
   *
   * `NAPFooter` emits the City nodes only when this array is non-empty. If it
   * is not threaded through from the layout, all 18 pages silently lose
   * `areaServed` from their structured data: nothing counts City nodes, and the
   * JSON-LD block count is unchanged because this is a property, not a block.
   * ROADMAP Phase 5 SC-1 requires it. `web/content/site.js` exports
   * `AREA_SERVED` for exactly this hand-off.
   */
  areaServed?: string[];
  /**
   * Opening hours. **Forwarded unchanged and never defaulted** so it travels
   * with `areaServed` and the pair cannot drift. `web/content/site.js` exports
   * `HOURS`.
   */
  hours?: string;
  /** Merged onto `NAPFooter`'s root `<footer>`. */
  className?: string;
}

/**
 * A composition layer, **not a landmark**. `Footer` emits no `<footer>` element
 * of its own — it renders exactly one `NAPFooter`, which owns the landmark, the
 * single `tel:` link and the `HomeAndConstructionBusiness` JSON-LD. Exactly one
 * `<footer>` per page is lock-asserted.
 *
 * There is deliberately **no `as` prop**, despite UI-SPEC §7.2 listing one.
 * This component renders no anchors: every `<a>` in the output is `NAPFooter`'s,
 * and `NAPFooter` takes no `as`. A declared-but-unforwarded `as` would be a
 * silent no-op at a call site that believed it had substituted its link
 * component. The substitution point is `NAPFooter`.
 *
 * There is also no `phone` prop. The number lives once, in `src/phone.js`.
 */
export declare function Footer(props: FooterProps): JSX.Element;
export default Footer;
