# Sablia Site - Logo & Favicon Full Deployment Plan

## Executive Summary

Logo files were updated in commit `644b486` with the navy-sienna B mark, but the SVG path was auto-traced from a raster image — creating micro-wobbles on edges that should be perfectly straight. This plan covers: (1) straightening the SVG, (2) regenerating ALL raster images from the clean source, and (3) completing the favicon/meta infrastructure.

## Critical Issue: SVG Path Not Straight

The current `logo.svg` and `favicon.svg` use a complex auto-traced `<path>` with hundreds of cubic Bezier curve segments (`c` commands). Horizontal edges that should be perfectly flat have tiny undulations visible on close inspection. The fix requires **reconstructing the path with clean geometry** — straight `L` (line-to) segments with snapped coordinates.

## Current State

- `client/public/favicon.svg` — Auto-traced, wobbly edges
- `client/public/favicon.png` — 32x32 (derived from wobbly SVG)
- `client/public/apple-touch-icon.png` — 180x180 (derived from wobbly SVG)
- `client/public/icon-192.png` — 192x192 (derived from wobbly SVG)
- `client/public/icon-512.png` — 512x512 (derived from wobbly SVG)
- `client/public/logo.svg` — Same wobbly path
- All raster images need regeneration after SVG fix

## What's Missing

1. **SVG path is not straight** — Auto-traced path with wobbly edges
2. **All raster images derived from wobbly SVG** — Need regeneration
3. **No `manifest.json`** — PWA icons not discoverable
4. **No `<meta name="theme-color">`** — Browser chrome won't match brand
5. **No `<link rel="manifest">`** in index.html
6. **OG/Twitter images still old** — From Jan 26, don't match new logo
7. **Missing OG images for sub-pages** — meta-tags.json refs don't exist
8. **`docs/meta-tags.json` references `logo.png`** — Only `logo.svg` exists
9. **No `favicon.ico`** — Legacy fallback
10. **No maskable icons** — Android adaptive icons

## Confidence: 8/10
SVG reconstruction is the trickiest part — need to identify vertices correctly. Rest is straightforward.

---

## Phase Status

| Phase | Name | Tasks |
|-------|------|-------|
| 0 | SVG Straightening & Raster Regeneration | 4 |
| A | Web Manifest & Meta Tags | 4 |
| B | OG/Social Images | 3 |
| C | Legacy & Maskable Icons | 2 |
| D | Documentation Sync & Build | 3 |

---

## Phase 0: SVG Straightening & Raster Regeneration

**This phase is the foundation — all other phases depend on it.**

### Tasks
- [ ] 0.1. Analyze the current SVG path to extract key vertex positions
- [ ] 0.2. Reconstruct the SVG path with clean geometry (straight `L` segments, snapped coordinates)
- [ ] 0.3. Update `logo.svg` and `favicon.svg` with the straightened path
- [ ] 0.4. Regenerate ALL raster images from the clean SVG (favicon.png 32x32, apple-touch-icon.png 180x180, icon-192.png, icon-512.png)

### Technical Details

**Problem:** The current path uses `c` (cubic Bezier) commands for what should be straight lines:
```
m 12.691951,244.96091 c -1.22309,-0.46344 -2.03873,-1.10617 ...
```
These curves approximate straight edges but with sub-pixel wobble visible at any zoom level.

**Approach — Python script with `svgpathtools`:**
1. Parse the SVG path into segments
2. Sample points along each segment at high resolution
3. Identify the key vertices (direction changes > threshold)
4. Classify edges as horizontal (snap Y), vertical (snap X), or diagonal (keep angle)
5. Reconstruct with `M` (move-to) and `L` (line-to) commands only
6. Output clean SVG with the same viewBox and gradient

```python
# Script: tmp/straighten-logo.py
from svgpathtools import parse_path, Line, Path
import re

# Parse existing path d attribute
# Sample vertices
# Snap horizontal/vertical edges
# Output clean path
```

**Raster regeneration (after SVG fix):**
```bash
# Using resvg (best SVG→PNG quality) or Inkscape CLI
# favicon.png (32x32)
resvg --width 32 --height 32 client/public/favicon.svg client/public/favicon.png
# apple-touch-icon (180x180)
resvg --width 180 --height 180 client/public/logo.svg client/public/apple-touch-icon.png
# icon-192 (192x192)
resvg --width 192 --height 192 client/public/logo.svg client/public/icon-192.png
# icon-512 (512x512)
resvg --width 512 --height 512 client/public/logo.svg client/public/icon-512.png
```

If resvg is not available, fallback to:
```bash
# Inkscape CLI
inkscape --export-type=png --export-width=32 --export-height=32 -o favicon.png favicon.svg
# OR ImageMagick (lower quality for SVG)
magick -background none -density 300 favicon.svg -resize 32x32 favicon.png
```

### Validation
- Visual comparison: open cleaned SVG in browser, zoom to 400%+, verify horizontal edges are pixel-perfect straight
- Use Playwright MCP to render logo in Navigation component at high zoom
- Raster images should have crisp edges at their respective sizes
- File sizes should be similar or smaller (clean paths = smaller SVG)

---

## Phase A: Web Manifest & Meta Tags

### Tasks
- [ ] A1. Create `client/public/manifest.json` with full icon set
- [ ] A2. Add `<link rel="manifest" href="/manifest.json">` to `client/index.html`
- [ ] A3. Add `<meta name="theme-color" content="#1a2e4e">` to `client/index.html`
- [ ] A4. Add `<meta name="apple-mobile-web-app-capable" content="yes">` and `<meta name="apple-mobile-web-app-title" content="Sablia">` to index.html

### Technical Details

**manifest.json:**
```json
{
  "name": "Sablia - Automatisation IA pour PME",
  "short_name": "Sablia",
  "description": "Automatisez vos processus métier avec Sablia",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#1a2e4e",
  "background_color": "#faf6f1",
  "lang": "fr",
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

**index.html additions** (after apple-touch-icon line):
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1a2e4e" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Sablia" />
```

### Validation
- `npm run build` passes
- manifest.json is valid JSON
- Browser DevTools > Application > Manifest shows icons

---

## Phase B: OG/Social Images

### Tasks
- [ ] B1. Regenerate `og-image-home.png` and `twitter-image-home.png` with new logo (1200x630)
- [ ] B2. Create a generic `og-image.png` fallback with new logo (1200x630)
- [ ] B3. Remove references to non-existent per-page OG images from `docs/meta-tags.json` (tarifs, gap, roi, about) — or generate them

### Technical Details

**OG image specs:**
- Size: 1200 x 630 pixels
- Format: PNG
- Background: Sablia parchment (#faf6f1) or navy (#1a2e4e)
- Content: New B mark logo + "Sablia" text + tagline
- File size: < 500KB

**Approach:** Use Playwright MCP to render an HTML card and screenshot it, OR use a simple design tool. The OG images should feature:
- The new navy-sienna B mark prominently
- "Sablia" in Inter Tight or Cormorant Garamond
- Tagline: "Automatisation IA pour PME"
- Clean, professional B2B aesthetic

**meta-tags.json fix:** Change `"logo": "https://sablia.io/logo.png"` → `"logo": "https://sablia.io/logo.svg"`

### Validation
- OG images exist at correct sizes (1200x630)
- Share preview works on https://www.opengraph.xyz/ or similar
- meta-tags.json has no references to non-existent files

---

## Phase C: Legacy & Maskable Icons

### Tasks
- [ ] C1. Generate `favicon.ico` (32x32 ICO format) from favicon.png
- [ ] C2. Generate maskable icons (`icon-maskable-192.png`, `icon-maskable-512.png`) — same logo with 25% padding and solid background

### Technical Details

**favicon.ico generation:**
```bash
# Using ImageMagick (if available)
convert client/public/favicon.png client/public/favicon.ico
# OR use png2ico / icotool
```

**Maskable icons:**
- Same B mark but with 25% padding on all sides
- Solid background (#1a2e4e navy or #faf6f1 parchment)
- Safe zone: center 60% of canvas contains the logo
- Sizes: 192x192 and 512x512

**index.html update:** Add ICO fallback:
```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
```

### Validation
- `favicon.ico` renders in legacy browsers
- Maskable icons pass https://maskable.app/ validation
- manifest.json references all new icons

---

## Phase D: Documentation Sync & Build

### Tasks
- [ ] D1. Update `docs/meta-tags.json` — fix logo.png → logo.svg, clean up missing image refs
- [ ] D2. Update `docs/SITE_CONTENT.md` — reflect new logo description (navy-sienna B mark)
- [ ] D3. Run `npm run build` to sync dist/ folder

### Technical Details

**meta-tags.json changes:**
- Line 51: `"logo": "https://sablia.io/logo.png"` → `"logo": "https://sablia.io/logo.svg"`
- Remove or update references to non-existent OG images for sub-pages (unless Phase B created them)

### Validation
- `npm run build` succeeds
- `npm run check` passes
- All referenced files in meta-tags.json actually exist in client/public/
- Logo renders in Navigation, Footer components (visual check with Playwright)

---

## Files Changed Summary

| File | Action |
|------|--------|
| `client/public/logo.svg` | **UPDATE** (straightened path, clean geometry) |
| `client/public/favicon.svg` | **UPDATE** (straightened path, clean geometry) |
| `client/public/favicon.png` | **REGENERATE** (from clean SVG, 32x32) |
| `client/public/apple-touch-icon.png` | **REGENERATE** (from clean SVG, 180x180) |
| `client/public/icon-192.png` | **REGENERATE** (from clean SVG, 192x192) |
| `client/public/icon-512.png` | **REGENERATE** (from clean SVG, 512x512) |
| `client/public/manifest.json` | **CREATE** |
| `client/public/favicon.ico` | **CREATE** |
| `client/public/icon-maskable-192.png` | **CREATE** (from clean SVG, with 25% padding) |
| `client/public/icon-maskable-512.png` | **CREATE** (from clean SVG, with 25% padding) |
| `client/public/og-image-home.png` | **UPDATE** (regenerate with new logo) |
| `client/public/og-image.png` | **UPDATE** (regenerate with new logo) |
| `client/public/twitter-image-home.png` | **UPDATE** (regenerate with new logo) |
| `client/public/twitter-image.png` | **UPDATE** (regenerate with new logo) |
| `client/index.html` | **EDIT** (add manifest, theme-color, PWA meta) |
| `docs/meta-tags.json` | **EDIT** (fix logo.png ref, clean OG refs) |
| `docs/SITE_CONTENT.md` | **EDIT** (update logo description) |

## Component References (No Changes Needed)

These already reference `/logo.svg` and will automatically use the new logo:
- `Navigation.tsx` (lines 62, 99)
- `Footer.tsx` (line 10)
- `client/index.html` JSON-LD (line 56) — already points to `https://sablia.io/logo.svg`
