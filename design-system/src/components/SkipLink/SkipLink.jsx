/**
 * SkipLink — Beyond House Cleaning
 *
 * WCAG 2.4.1 Bypass Blocks. The first element inside <body>, before Header,
 * so the first Tab press on any page offers a jump past the global navigation.
 *
 * THIS COMPONENT ADDS NO CSS. `.bhc-skip-link` has been in styles.css since
 * Phase 1 (styles.css:51-62) — an off-canvas absolute position that animates
 * to `top: var(--bhc-space-4)` on :focus. This file is a wrapper over shipped
 * rules, not a new stylesheet, and appending a block for it would give the
 * class two definitions in one file.
 *
 * THE TARGET MUST CARRY tabindex="-1". The layout renders
 * <main id="main" tabIndex={-1}> (layout.jsx:69). Without it Safari and Chrome
 * scroll the viewport to the fragment and leave focus where it was, so the
 * next Tab press returns to the header — the link appears to work and does
 * not. Plan 02-02 already added the wrapper; this component's contract is
 * that `href` names an element that has it.
 *
 * No `as` prop. UI-SPEC §13-J scopes the escape hatch to link-bearing
 * components whose destination is a route; this one is a same-document
 * fragment, and a router link component would intercept it, push a history
 * entry and skip the native fragment-navigation focus behaviour that is the
 * entire mechanism here.
 */

export function SkipLink({
  /** The fragment to jump to. The target must carry tabindex="-1". */
  href = '#main',
  children = 'Skip to content',
  className = '',
}) {
  return (
    <a className={['bhc-skip-link', className].filter(Boolean).join(' ')} href={href}>
      {children}
    </a>
  );
}

export default SkipLink;
