/**
 * JSON-LD serialisation — pure, no React.
 *
 * Lives apart from the three .jsx emitters for two independent reasons:
 * (a) `node --test` has no JSX transform, so logic in a .jsx file is
 *     untestable without a toolchain this package deliberately does not have;
 * (b) the `claude-seo` PostToolUse hook rejects any .jsx/.tsx write containing
 *     the case-insensitive substring REPLACE — which every `.replace(` call
 *     contains. Every `.replace(` in this package is in a .js file. Keep it so.
 *
 * What it defends against: bare `JSON.stringify` does NOT escape a `</script>`
 * sequence, so a value carrying one BREAKS OUT of the inline JSON-LD block and
 * the rest of the value is parsed as markup. Harmless today — every value
 * passed to NAPFooter, Breadcrumbs and RatingBadge is hardcoded. Material from
 * Phase 3, when ~56 town names and 8 service names arrive from a data file and
 * feed these same three components across ~336 pages.
 *
 * Escaping `<` is sufficient and lossless: `<` is a valid JSON string
 * escape, so the emitted payload still parses as JSON while `</script>` can no
 * longer terminate the enclosing script element.
 *
 * Package-internal plumbing — deliberately NOT re-exported from src/index.js.
 */

/** Serialise JSON-LD safely for inline <script> embedding. */
export const safeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
