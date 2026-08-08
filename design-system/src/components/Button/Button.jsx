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
      <a
        className={classes}
        href={href}
        aria-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button" disabled={disabled} {...rest}>
      {content}
    </button>
  );
}

export default Button;
