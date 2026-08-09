import type { ElementType, ReactNode } from 'react';

export interface ServiceCardProps {
  /** The link text AND the card's accessible name. There is no separate label prop. */
  title: string;
  href: string;
  /** One or two sentences. Longer copy belongs on the service page this links to. */
  summary?: string;
  /**
   * Decorative only — the title beside it already names the service, so the
   * component wraps it in `aria-hidden="true"`.
   */
  icon?: ReactNode;
  /**
   * Up to three bullets; a fourth is dropped rather than rendered. Null entries
   * are filtered, because from Phase 3 this is a data-module field and one bad
   * entry must not throw during server render.
   */
  includes?: string[];
  /**
   * The card title's level. Defaults to `3`, which is what keeps the outline
   * legal for the normal case: a grid of cards nested under a section `<h2>`.
   * Pass `2` only when the grid is the section and nothing above it supplies a
   * heading.
   */
  headingLevel?: 2 | 3 | 4;
  /**
   * The element rendered for the card's single link. Defaults to `'a'`.
   *
   * UI-SPEC §13-J: the package is dependency-free and cannot import a router's
   * link component, so this is the one-line escape hatch. Nothing in Phase 2
   * passes it.
   */
  as?: ElementType;
  className?: string;
}

export declare function ServiceCard(props: ServiceCardProps): JSX.Element;
export default ServiceCard;
