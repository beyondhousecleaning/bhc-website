/**
 * Prose — Beyond House Cleaning
 *
 * The unglamorous one. It carries 800 to 1,100 words on roughly 336 pages, and
 * content depth is the one metric this site already beats its competitors on —
 * live service pages median 1,183 words. Unreadable prose wastes that.
 *
 * It is a CONTAINER ONLY. It renders no heading of its own, and it must never
 * emit an <h1>: Lock 1 allows exactly one <h1> per page and it belongs to Hero.
 * A Prose that grew an <h1> prop would break that lock on every page it appears
 * on at once, which is the failure mode this comment exists to prevent. Its
 * outline starts at <h2>.
 *
 * Everything else is descendant styling through :where(), which keeps
 * specificity at zero so a component class inside the prose still wins —
 * the same idiom the shipped .bhc-section--navy :where(h1,h2,h3,h4) rule uses.
 */

/*
  Variant lookup with a fallback, per Button.jsx:12-17. `prose` is the 68ch
  measure and emits no modifier; an unknown value degrades to it.
*/
const WIDTHS = {
  prose: '',
  narrow: 'bhc-prose--narrow',
};

export function Prose({ children, width = 'prose', className = '' }) {
  return (
    <div className={['bhc-prose', WIDTHS[width] || WIDTHS.prose, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export default Prose;
