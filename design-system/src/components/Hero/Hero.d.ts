import type { RatingBadgeProps } from '../RatingBadge/RatingBadge';

export interface HeroImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  /** Required. Lock 7: every <img> carries non-empty alt. */
  alt: string;
  width?: number;
  height?: number;
}

export interface HeroAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface HeroProps {
  /**
   * Decoration only — "Reliable & Affordable". Renders as a <p>.
   * This is the line that wrongly became the <h1> on 101 live pages.
   */
  eyebrow?: string;
  /**
   * REQUIRED, and ALWAYS the page <h1>. Must carry the service and/or town:
   * "Deep Cleaning in Warwick", not "Reliable & Affordable".
   */
  heading: string;
  lead?: string;
  rating?: RatingBadgeProps;
  actions?: HeroAction[];
  /** The LCP element — rendered eager with high fetch priority. */
  image?: HeroImage;
  align?: 'split' | 'centered';
  className?: string;
}

export declare function Hero(props: HeroProps): JSX.Element;
export default Hero;
