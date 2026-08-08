/**
 * Next.js configuration — Beyond House Cleaning
 *
 * D-06: `@bhc/design-system` ships untranspiled `.jsx` from a plain
 *       `"type": "module"` package with no build step and no `dist/`. The app
 *       is what compiles it, so a clean checkout needs no design-system build.
 *
 * Turbopack (the Next.js 16 default for both `dev` and `build`) already
 * auto-transpiles npm workspace packages — the 01-RESEARCH.md probe built
 * without this line. It is set anyway: it is the documented lever, it is a
 * no-op when auto-detection works, and it is the only thing that saves the
 * build if the workspace linkage is ever downgraded to a plain `file:` dep.
 *
 * Deliberately absent, all three removed or made fatal in Next.js 16:
 *   - a custom bundler-override key (makes `next build` fail unless the
 *     matching CLI flag is passed)
 *   - an `eslint` key (removed; `next lint` was removed too)
 *   - a `--turbopack` / `--turbo` script flag (now the default, redundant)
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@bhc/design-system'],
};

export default nextConfig;
