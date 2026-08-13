export interface InterlinkLink {
  href: string;
  label: string;
  /** Secondary line — a tagline, or "3.2 miles away" for the nearby variant. */
  meta?: string;
}

export interface InterlinkBlockProps {
  /** `services` = same town, other services. `nearby` = same service, nearest towns. */
  variant?: 'services' | 'nearby';
  heading: string;
  intro?: string;
  links: InterlinkLink[];
  className?: string;
}

export interface GeoPoint { lat: number; lon: number }

export interface Town extends GeoPoint {
  slug: string;
  name: string;
  /** URL region segment — warwickshire, west-midlands, staffordshire, … */
  region: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline?: string;
}

export declare function InterlinkBlock(props: InterlinkBlockProps): JSX.Element | null;

export declare function distanceMiles(a: GeoPoint, b: GeoPoint): number;

export declare function nearestTowns(
  town: Town,
  allTowns: Town[],
  count?: number
): { town: Town; miles: number }[];

export declare function buildInterlinks(input: {
  town: Town;
  service: Service;
  allTowns: Town[];
  allServices: Service[];
  nearbyCount?: number;
  /**
   * The secondary line under each **nearby** link, given the destination town
   * and its distance in miles. Defaults to the distance string, so omitting it
   * is today's behaviour. Return `undefined` to render no line at all.
   *
   * The geography belongs in the ordering, not in the copy: a spoke page whose
   * job is to read as local should not annotate its links with how far away
   * they are. At page scale the caller returns the destination's county.
   */
  metaFor?: (destination: Town, miles: number) => string | undefined;
}): { services: InterlinkBlockProps; nearby: InterlinkBlockProps };

export default InterlinkBlock;
