/**
 * InterlinkBlock — Beyond House Cleaning
 *
 * LOCK 6: present on the service, town-hub and combo templates.
 *
 * This is the component that decides whether ~336 pages works.
 *
 * On the live site, four arbitrary combo pages sit in the global footer with
 * 114 inbound links each; the other 91 get a MEDIAN OF 4, all from ad-hoc
 * prose. There is no hub-and-spoke at all. Four hardcoded footer links cannot
 * distribute authority across 336 destinations.
 *
 * The fix: links are COMPUTED FROM GEOGRAPHY, never hand-picked, so they
 * cannot rot as towns are added.
 *
 *   /locations                        -> all ~56 towns
 *   /locations/<town>                 -> that town's 6 services + 6 nearest towns
 *   /location/<region>/<town>/<svc>   -> 5 sibling services, same town
 *                                     -> same service, 5 nearest towns
 *
 * That gives every combo page ~11 semantically meaningful inbound links.
 *
 * The geography lives in ./geo.js — pure, no React — so the linking rule can
 * be tested without a JSX toolchain and computed at build time. Feed it the
 * town list derived from docs/research/service-area-coverage.md.
 */

export { distanceMiles, nearestTowns, buildInterlinks } from './geo.js';

export function InterlinkBlock({
  variant = 'services',
  heading,
  intro,
  links = [],
  className = '',
}) {
  if (!links.length) return null;

  return (
    <section
      className={['bhc-interlink', className].filter(Boolean).join(' ')}
      aria-labelledby={`interlink-${variant}`}
    >
      <div className="bhc-container">
        <h2 className="bhc-interlink__heading" id={`interlink-${variant}`}>
          {heading}
        </h2>
        {intro ? <p className="bhc-hero__lead">{intro}</p> : null}
        <ul className="bhc-interlink__list">
          {links.map((link) => (
            <li key={link.href}>
              <a className="bhc-interlink__link" href={link.href}>
                <span className="bhc-interlink__label">{link.label}</span>
                {link.meta ? <span className="bhc-interlink__meta">{link.meta}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default InterlinkBlock;
