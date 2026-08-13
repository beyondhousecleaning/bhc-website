export interface BreadcrumbItem {
  label: string;
  /**
   * Omit on the final crumb — it renders as the current page.
   *
   * An intermediate crumb may also omit it (a level that exists in the
   * hierarchy but has no page yet). It then renders as plain text and, unlike
   * the final crumb, carries **no** `aria-current`.
   */
  href?: string;
}

export interface BreadcrumbsProps {
  /**
   * The trail, root first. `aria-current="page"` is applied to the LAST item
   * and only the last item, at any trail length — it means "this crumb is the
   * page you are on", so a second one is a contradiction rather than an extra
   * hint. Home is `{ label: 'Home', href: '/' }`; the current page carries no
   * `href`.
   */
  items: BreadcrumbItem[];
  /**
   * Absolute origin used to build the BreadcrumbList `item` URLs. Each `href`
   * is resolved against it with `new URL`, so a missing leading slash or a
   * trailing slash on the origin cannot produce a malformed URL in the schema.
   */
  siteUrl?: string;
  className?: string;
}

export declare function Breadcrumbs(props: BreadcrumbsProps): JSX.Element | null;
export default Breadcrumbs;
