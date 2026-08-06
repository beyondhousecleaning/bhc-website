import type { ReactNode } from 'react';

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
  className?: string;
}

export declare function Button(props: ButtonProps): JSX.Element;
export default Button;
