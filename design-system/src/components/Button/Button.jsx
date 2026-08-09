/**
 * Button — Beyond House Cleaning
 *
 * Renders an <a> when `href` is given, otherwise a <button>. Every CTA on the
 * site converges on the quote flow, so the anchor form is the common case.
 *
 * ACCESSIBILITY LOCK: the primary variant is orange with an INK label.
 * White on #F06C24 measures 3.05:1 against a 4.5:1 requirement. Ink on orange
 * is 5.17:1. Do not "fix" the label to white.
 */

const SIZES = { sm: 'bhc-btn--sm', md: 'bhc-btn--md', lg: 'bhc-btn--lg' };
const VARIANTS = {
  primary: 'bhc-btn--primary',
  secondary: 'bhc-btn--secondary',
  ghost: 'bhc-btn--ghost',
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  className = '',
  /*
    UI-SPEC §13-J: every link-bearing component takes `as`, defaulting to 'a'.
    It applies to the href branch only — the <button> branch is a <button>.
    The escape hatch exists so a router link component can be substituted at
    the composition layer rather than at sixteen call sites; nothing in Phase 2
    passes it, because Next resolves plain <a> for a static export.
  */
  as: As = 'a',
  ...rest
}) {
  const classes = [
    'bhc-btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {iconLeft ? <span aria-hidden="true">{iconLeft}</span> : null}
      <span>{children}</span>
      {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
    </>
  );

  if (href) {
    return (
      <As
        className={classes}
        href={href}
        aria-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        {content}
      </As>
    );
  }

  return (
    <button className={classes} type="button" disabled={disabled} {...rest}>
      {content}
    </button>
  );
}

export default Button;
