import type { ElementType } from 'react';

export interface TownCardProps {
  /**
   * The post town or named suburb — the link text and the card's accessible name.
   *
   * **Never a bare postcode district** (`CV32` is not a place anyone lives in or
   * searches for) and **never a full postcode** anywhere in it. D4 and Lock 5:
   * the registered office is residential, this card renders on ~56 index cards
   * plus every town hub, and one bad data row publishes it site-wide. Asserted
   * in package source by Lock 5 and in built HTML by SC-2d.
   */
  town: string;
  href: string;
  /** The first half of the meta line — `Warwickshire`, `West Midlands`. */
  region?: string;
  /**
   * The second half of the meta line. Rendered as `6 services`; `0` and a
   * non-number render nothing rather than `0 services`, because a town with no
   * pages yet is a data state, not a claim.
   */
  serviceCount?: number;
  /**
   * The card title's level. Defaults to `3` — the normal case is a grid nested
   * under a section `<h2>`. Pass `2` only when the grid is the section itself.
   */
  headingLevel?: 2 | 3 | 4;
  /**
   * The element rendered for the card's single link. Defaults to `'a'`.
   * UI-SPEC §13-J's one-line escape hatch; nothing in Phase 2 passes it.
   */
  as?: ElementType;
  className?: string;
}

export declare function TownCard(props: TownCardProps): JSX.Element;
export default TownCard;
