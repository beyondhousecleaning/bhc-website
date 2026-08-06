# Logo audit — step 1 "make it pop"

Source files: `assets/logo/beyond-hc-01.png` (3508×2481 RGBA) and `.jpg`. Analysed 2026-08-06.

## What it is

Horizontal arced "swipe" banner in a blue gradient. White condensed uppercase wordmark on the arc — `BEYOND` large, `HOUSE CLEANING` smaller beneath. Orange sponge with white highlight at the right end. Comb-like motion streaks + 2 dots at the left. Three 4-point sparkles.

## Measured palette (sampled from pixels)

| Role | Hex | Notes |
|---|---|---|
| Cyan (gradient start, left) | `#0DA6E8` | lightest point of the banner |
| Mid blue | `#158CD2` | |
| Blue | `#197EC7` | |
| Navy (gradient end, right) | `#2064B1` | darkest sampled |
| Orange (sponge, light) | `#F78C34` | |
| Orange (sponge, deep) | `#F06C24` | |
| Wordmark | `#FFFFFF` | |

Blue range overlaps Arbor Trail's palette almost exactly. **The orange is our differentiator** — no blue-only competitor has it.

## Geometry problems

| Finding | Measurement | Consequence |
|---|---|---|
| Huge dead margin | 29% empty top **and** bottom; 10% each side | In a 48px-tall header the actual mark renders ~20px — looks weak and small |
| Very wide aspect | ink box 2796×1028 = **2.72:1** | Doesn't fit square slots (favicon, GBP photo, social avatar) at all |
| Raster only | PNG/JPG, no vector source found | Can't scale, recolour, or render crisp at small sizes; favicon will be mush |

## Design problems

1. **Arced wordmark.** Text on a curve fights the horizontal baseline of nav items and loses legibility when small.
2. **Two-tier type at one scale.** `HOUSE CLEANING` is far smaller than `BEYOND`; below ~120px wide it becomes an unreadable smear.
3. **Contrast falls off left.** White on `#0DA6E8` is markedly lower contrast than white on `#2064B1` — and the `B` of `BEYOND` sits over the lightest part.
4. **No variant family.** No stacked lockup, no square badge/icon, no one-colour version, no knockout for dark backgrounds.
5. **Sponge is ambiguous** at small sizes — reads as a generic blob.

## Recommendations

**Rebuild as SVG first.** Everything else depends on it.

Then produce a lockup family:

| Variant | Use |
|---|---|
| Horizontal primary | site header, invoices, email signature |
| Stacked | narrow/mobile, van livery, square-ish slots |
| Square badge / icon | favicon, GBP profile photo, social avatars, app icon |
| One-colour (navy) + one-colour (white knockout) | single-colour print, dark backgrounds, watermarks |

Specific fixes:
- Crop the artboard to the ink box — kill the 29% dead margin so the mark fills its space.
- Reduce the arc curvature, or set the wordmark straight and let the swipe carry the motion.
- Raise `HOUSE CLEANING` size relative to `BEYOND` so both survive at small scale.
- Darken the gradient's left end (or add a subtle darker underlay behind `BEYOND`) to hold white-text contrast.
- Simplify the sponge into a recognisable silhouette; it can become the square icon on its own.
- Lock the palette to named tokens so the site, GBP, van, and uniforms all match.
