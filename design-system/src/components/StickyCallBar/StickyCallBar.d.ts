import type { ElementType } from 'react';

export interface StickyCallBarProps {
  /** The quote-flow destination. Defaults to `/get-a-quote`. */
  quoteHref?: string;
  /**
   * **Omit it.** Defaults to the canonical number in `src/phone.js`. The `tel:`
   * href is derived from this one value.
   *
   * A malformed value **throws** rather than rendering `tel:+44`, which would
   * otherwise be an empty interactive element fixed to the bottom of every
   * mobile page.
   */
  phone?: string;
  /**
   * The element rendered for both actions. Defaults to `'a'`. UI-SPEC §13-J's
   * escape hatch; nothing in Phase 2 passes it.
   */
  as?: ElementType;
  className?: string;
}

/**
 * A fixed two-action bar at the bottom of the viewport below 768px, and
 * **`display: none`** at 768px and above — removed from the accessibility tree,
 * not merely painted out of view, so a desktop keyboard user cannot tab into an
 * invisible bar.
 *
 * The call action's visible label is the single word `Call`, **with no digits**,
 * and it carries `aria-label="Call Beyond House Cleaning"` because a one-word
 * link is ambiguous out of context. If a digit-bearing label is ever wanted it
 * must render exactly `+44 7861 936533` — see the prompt doc.
 *
 * The component also declares `body { padding-bottom: 64px }` inside its own
 * narrow media query, so the bar never covers the footer's last row.
 */
export declare function StickyCallBar(props: StickyCallBarProps): JSX.Element;
export default StickyCallBar;
