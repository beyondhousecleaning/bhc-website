import type { ElementType, ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  /** Renders an `<a>` instead of a `<button>`. Most CTAs are links to the quote flow. */
  href?: string;
  /** `primary` is orange with an ink label — 5.17:1. Never white-on-orange (3.05:1). */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  /**
   * The element rendered for the `href` branch. Defaults to `'a'`; the
   * `<button>` branch ignores it.
   *
   * The escape hatch exists so a router link component can be substituted once,
   * at the composition layer, instead of editing sixteen call sites when the
   * site stops being a static export. Nothing in Phase 2 passes it.
   */
  as?: ElementType;
  className?: string;
}

export declare function Button(props: ButtonProps): JSX.Element;
export default Button;
