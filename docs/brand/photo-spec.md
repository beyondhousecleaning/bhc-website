# Before/after photo spec

## What we need

| Requirement | Value |
|---|---|
| Format | JPEG or HEIC **exactly as the camera produced it** — no conversion, resize, or pre-optimisation |
| Resolution | ≥2400px long edge; 3000–4000px ideal |
| Orientation | Consistent. Landscape 3:2 or 4:3 preferred; portrait fine if before **and** after match |
| Pairing | **Matched framing** — same angle, distance, height, similar lighting. The eye should see dirt disappear, not the camera move |
| Transfer | AirDrop / Drive / Dropbox at original quality. **Never WhatsApp** (recompresses to ~1MP, permanent loss) |
| Quantity | 10–15 excellent matched pairs beats 60 mediocre ones |

Send raw. The build generates AVIF/WebP at multiple widths per device automatically, so maximum fidelity in = optimal output.

## Metadata needed per pair

**Room/area + service type** (and town if known). This is worth more than any other input — it drives filenames and alt text.

Naming: `kitchen-deep-clean-01-before.jpg` / `kitchen-deep-clean-01-after.jpg`. Or keep pairs on consecutive pages in before→after order and we script the rename.

## What actually helps image SEO

In order of real impact:

1. **Descriptive filenames** — `deep-clean-kitchen-oven-before.jpg`, never `IMG_4021.jpg`
2. **Alt text** — biggest on-page image factor, plus accessibility
3. **File weight → Core Web Vitals** — images are the usual LCP killer; page speed is a ranking factor
4. **Image sitemap + `ImageObject`** markup on service pages

### Two myths to skip

- **EXIF geotagging is not a ranking signal.** Google strips EXIF on processing. Don't spend time on it.
- **Photos will not win local rankings.** They won't put us in the Wolverhampton map pack. What before/afters do is *convert* — the highest-converting element on a cleaning site. Optimise for persuasion and speed, not SEO theatre. Reusing the same images across 336 location pages adds no ranking value, and we don't fake town-specific imagery.

## Audit 2026-08-06 — the Canva export is not usable as source

Folder: `Desktop/Beyond House Cleaning/Cladue Web - Before & After/` — 199 files.

| Finding | Detail |
|---|---|
| Dimensions | **All 199 are exactly 1080×1080**, median 135KB — 1× Instagram export |
| Content | **Composited social posts**, not photos: before\|after side by side in one square |
| Baked-in assets | **Old logo** at top (y<185) and `BEFORE`/`AFTER` labels burned over the photo |
| Recoverable photo area | Panel spans y 185–988 → ~**530 × 803px per half**; ~530 × 690px after cropping labels |

**Rejected for site use, two independent reasons:**

1. 530×690px is a 265×345 slot at retina 2× — thumbnail territory. Splitting them isn't worth doing.
2. The baked-in logo is the mark being replaced in step 1, so all 199 would ship a superseded logo.

Usable only as a temporary composited gallery row (Arbor Trail does exactly that) — but throwaway once the logo changes.

**Action:** pull originals from **canva.com → Projects → Uploads**, which supports multi-select bulk download. Fallback: editor sidebar → Uploads → hover → ⋯ → Download.

Getting originals pays off twice: a real before/after slider on the site, **and** automated regeneration of all 199 social composites in the new brand.
