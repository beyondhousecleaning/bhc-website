export interface BreadcrumbItem {
  label: string;
  /** Omit on the final crumb — it renders as the current page. */
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Absolute origin used to build the BreadcrumbList `item` URLs. */
  siteUrl?: string;
  className?: string;
}

export declare function Breadcrumbs(props: BreadcrumbsProps): JSX.Element | null;
export default Breadcrumbs;
