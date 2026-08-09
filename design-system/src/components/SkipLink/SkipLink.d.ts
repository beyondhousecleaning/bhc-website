import type { ReactNode } from 'react';

export interface SkipLinkProps {
  /**
   * The same-document fragment to jump to. Defaults to `#main`, which is the
   * id the root layout puts on its one `<main>`.
   *
   * **The target element must carry `tabindex="-1"`.** Without it Safari and
   * Chrome move the viewport but not the focus ring, so the next Tab press
   * lands back in the header and the link silently does nothing.
   */
  href?: string;
  /** Defaults to `Skip to content`. */
  children?: ReactNode;
  className?: string;
}

/**
 * WCAG 2.4.1. Renders `<a class="bhc-skip-link">`, which is off-canvas until
 * focused. It must be the **first element inside `<body>`**, before `Header`.
 *
 * There is deliberately no `as` prop: this is a fragment link, and a router
 * link component would intercept it and bypass the native focus behaviour it
 * depends on.
 */
export declare function SkipLink(props: SkipLinkProps): JSX.Element;
export default SkipLink;
