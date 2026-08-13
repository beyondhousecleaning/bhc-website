import type { ElementType, ReactNode } from 'react';

export interface NavItem {
  label: string;
  /**
   * The destination. Optional, and **ignored entirely when `children` is
   * present**: an item with children renders as a `<summary>` carrying its
   * label, and its own `href` is never emitted.
   *
   * Two independent reasons. `/services` 404s in Phase 2, so a linked parent
   * would put a dead internal link on all 18 pages and fail the link-resolution
   * lock. And giving the parent one of its children's hrefs would put the same
   * href in the DOM twice, which fails the no-duplicate-href assertion. The
   * shipped nav data omits it; this rule keeps the component correct if a later
   * data edit adds one.
   */
  href?: string;
  children?: NavItem[];
}

export interface HeaderProps {
  /**
   * The brand mark. Defaults to a **typographic wordmark**, not the raster
   * logo: `assets/logo/` holds only a 189 KB PNG and a 679 KB JPG of the mark
   * `brand-brief.md` is replacing, at a resolution that renders about 20px tall
   * in a 48px header. Shipping it would put a superseded logo on ~410 pages.
   *
   * Typed as `ReactNode` so the SVG lockup drops in later with no API change
   * and no page edits.
   */
  logo?: ReactNode;
  /**
   * The nav tree. Null entries are filtered — this component sits in the root
   * layout, so a malformed entry in a data file would 500 every route.
   */
  nav?: NavItem[];
  /** The primary CTA, shown at 768px and above. Omit it to render none. */
  cta?: { label: string; href: string };
  /**
   * **Omit it.** Defaults to the canonical number in `src/phone.js`. The
   * displayed label and the `tel:` href are both derived from this one value,
   * so they cannot diverge — there is deliberately no prop for the displayed
   * text.
   *
   * A malformed value **throws** rather than rendering `tel:+44`, which would
   * otherwise be an empty interactive element in the header of every page.
   */
  phone?: string;
  /**
   * The element rendered for the brand link, every nav link, the phone link and
   * the CTA. Defaults to `'a'`. UI-SPEC §13-J's escape hatch; nothing in
   * Phase 2 passes it.
   */
  as?: ElementType;
  className?: string;
}

/**
 * The one `<header>` and the one `<nav aria-label="Primary">` on every page.
 *
 * **No `<h1>`.** The brand is an `<a>` with
 * `aria-label="Beyond House Cleaning — home"`. A `<span>` styled at heading
 * size is the live-site bug that cost 101 of 115 pages their `<h1>`.
 *
 * The mobile disclosure works with JavaScript disabled: a contentless
 * `<details>` state carrier whose `<summary>` toggles a **sibling** `<ul>`
 * through a sibling combinator. The list is rendered **once**, so every
 * navigation link appears in the DOM exactly once. Do not move the `<ul>`
 * inside the `<details>` — see `Header.prompt.md`.
 */
export declare function Header(props: HeaderProps): JSX.Element;
export default Header;
