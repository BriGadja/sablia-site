---
version: v2
name: Sablier
description: The Sablia charte "Sablier" as built in the v2 site. Desert-at-dusk grounds (sand and rose), a very dark night band, ink text, one signal colour (the gold of the sand), Familjen Grotesk and Fragment Mono, illustrations drawn as gold sand contours on the night.
source: Tokens are the ones declared in src/app/globals.css (@theme) and the hex literals used in src/**/*.css. Charte chosen by Brice on 2026-10-24; this file replaces the coral "Claude design analysis" DESIGN.md of the Vite site.

colors:
  sand: "#F4ECDD"
  card: "#FBF7F0"
  line: "#E4D6C0"
  rose: "#F2E3DF"
  night: "#161B29"
  night-raised: "#1E2436"
  night-sunken: "#242B40"
  night-line: "#323A52"
  violet: "#262038"
  ink: "#131620"
  body: "#3A3F4D"
  muted: "#61677A"
  gold: "#D9A441"
  gold-dark: "#835A0C"
  gold-mid: "#B9852A"
  success: "#2F7A4F"

typography:
  sans: "Familjen Grotesk, variable, 400-700 (self-hosted woff2, latin)"
  mono: "Fragment Mono, 400 (self-hosted woff2, latin)"
---

# DESIGN.md: Sablier

The look of sablia.io v2. Sablia comes from "sablier" (hourglass): the signal colour is the gold of the sand, the
image signature is an hourglass drawn in gold sand on a night ground, the logo is a gold S-hourglass. There is no
coral anywhere (the old #D97757 / #CC785C read as a generic AI-product coral and left Sablia's identity on 2026-10-24).

Source of truth in the tree: `src/app/globals.css` (tokens), `src/app/base.css` (global element rules, focus ring,
shared scroll effects), `src/components/shell/*.css` (header, footer, buttons, dunes, illustrations). A value in this
file that disagrees with those files is a bug in this file.

## Colour

Tokens are declared in `@theme` of `globals.css` as `--color-<name>`. The ported CSS writes the hex literal, not
`var(--color-*)`: Tailwind v4 only emits theme variables it sees used in a class, so a variable read only from
hand-written CSS would not exist.

| Token | Hex | Role |
|-------|-----|------|
| `sand` | `#F4ECDD` | Page ground (`body` in `base.css`), hero and light sections |
| `card` | `#FBF7F0` | Cards and raised surfaces on sand, the skip link |
| `line` | `#E4D6C0` | Hairlines and card borders on sand |
| `rose` | `#F2E3DF` | Alternate light ground (sections that alternate with sand) |
| `night` | `#161B29` | The dark band, illustration ground, OG images, manifest colours |
| `night-raised` | `#1E2436` | Surface above `night` |
| `night-sunken` | `#242B40` | Surface below or inside `night` |
| `night-line` | `#323A52` | Hairlines on `night` |
| `violet` | `#262038` | The very dark violet band (scene panel, final band) |
| `ink` | `#131620` | Headings, primary text, the dark button, `a` default colour |
| `body` | `#3A3F4D` | Running text |
| `muted` | `#61677A` | Secondary text |
| `gold` | `#D9A441` | THE signal: logo, marks on dark grounds, focus ring on dark bands, eyebrow on dark |
| `gold-dark` | `#835A0C` | Gold as TEXT on light grounds, global focus ring, `a:hover`, eyebrow on light |
| `gold-mid` | `#B9852A` | Decorative strokes on light grounds only (underline, separators), never text |
| `success` | `#2F7A4F` | Validated / done states |

Other literals used in the CSS, kept as they are in the rendered mockup: `#FFFFFF` (pills, inputs), `#F1F2F5` (light
button on night), `#A4AABD` (secondary text on night), `#EFE3CC` (figure ground on sand), `#E3E6EE`, `#DADDE6`,
`#EDEFF4` (cool greys of cards on the dark side), the dune colours (`#C68A8E`, `#E8CFC8`, `#EAD9BD`) and `#8FCB9B`
(success on night).

Contrast, computed with the WCAG 2.x relative-luminance formula on the hex values above:

| Pair | Ratio | Use |
|------|-------|-----|
| ink on sand | 15.38 | headings |
| body on sand | 8.95 | running text |
| muted on sand | 4.80 | secondary text (above 4.5) |
| gold-dark on sand | 5.21 | gold text on light |
| gold-dark on card | 5.73 | gold text on cards |
| gold on night | 7.63 | gold text and marks on dark |
| gold on violet | 6.94 | gold on the violet band |
| sand on night | 14.63 | text on dark |
| #A4AABD on night | 7.41 | secondary text on dark |
| gold-mid on sand | 2.77 | decoration only, never text |
| gold on sand | 1.92 | never: use `gold-dark` |
| success on sand | 4.45 | below 4.5: not for small text on sand |

Rules:
- Gold on a light ground is `gold-dark` as text and `gold-mid` as a stroke. `gold` itself only sits on night or violet.
- One signal colour. Everything else is ink, greys, sand/rose grounds and the night band.
- A dark band (`.panel`, `#scene`, `#videos`, `#fin`) flips the focus ring from `gold-dark` to `gold`.
- The contrast gate (`scripts/qa/contrast.py`, run by `score.py`) and `scripts/qa/axe-check.py` are the metric, not this table.

## Typography

Two faces, both self-hosted through `next/font/local` (`src/app/fonts.ts`, woff2 in `src/app/fonts/`, SIL OFL text
beside them): no request to Google Fonts, which would be a third-party request before consent. next/font's own
variables are `--font-sans-nf` and `--font-mono-nf`; `globals.css` maps them in `@theme inline` to `--font-sans` and
`--font-mono`, and ported CSS refers ONLY to `var(--font-sans)` / `var(--font-mono)` (never the literal family name:
`css-collisions.py` flags it).

| Role | Face | Where |
|------|------|-------|
| Sans | Familjen Grotesk, 400 to 700 | everything: headings (600), buttons (500), text |
| Mono | Fragment Mono 400 | eyebrows, pills, labels, record fields |

Scale as used (px, desktop first; phone values where the CSS changes them under `max-width: 900px`):

| Step | Size / line-height | Notes |
|------|--------------------|-------|
| H1 | 52 / 1.04, weight 600, letter-spacing -0.03em, `text-wrap: balance` | home hero, Accompagnement hero (36 on phone), offer page |
| H1 legal, 404 | 44 | legal pages, not-found (32 on phone); thanks page 40 |
| H2 | 36 | every section title (28 on phone in the shared bands) |
| Final band H2 | 40 | `FinBand` (28 on phone) |
| Body | 16 / 1.6 | running text; 15 and 14 for cards, notes and proof lines |
| Eyebrow | mono 12, uppercase, letter-spacing 0.08em | `Eyebrow`; gold-dark on light, gold with `onDark` |
| Pill, label | mono 12 | |

Floors: no visible text under 12 px (`score.py` counts `small_text`), tap targets 44 px high (24 px for a link inside
a sentence), also checked by `score.py` (`touch_targets`). Headings never wrap into a widow: `text-wrap: balance`.

## Layout and shape

- Container `.wrap`: max-width 1240 px, 32 px side padding (16 px under 900 px). Single breakpoint: `max-width: 900px`
  (35 uses), plus one at 1180 px and one at 640 px. The two checked widths are 1440 and 390.
- Radii: 10 px (buttons md), 12 px (buttons lg, cards), 14 to 16 px (cards), 20 px (illustration frame), 24 px
  (hero figure), 999 px (pills).
- Buttons: ONE look, `Cta` (`src/components/shell/Cta.tsx`): dark = ink on sand, light = pale `#F1F2F5` on night; 44 px
  (md, header) or 48 px (lg, bands); hover lifts 1 px. Every "Réserver 30 min" is `BookingButton` through `Cta`
  without `href`, so the `cta_book` event fires once.
- Sections are separated by dunes (`Dune`), not by hard edges: two SVG paths, back `#C68A8E`, front = the next
  section's own ground; the dune drifts on scroll.

## Illustrations: the sand-drawing rule

Illustrations are objects drawn in gold sand on the night ground, CONTOURS ONLY: never a falling thread of sand, never
a heap ("the sand effect is enough on its own", Brice, 2026-10-24). They are shipped as `public/illus/<name>-contour-nuit.webp`
(offre, automatisations, realisations, formations, faq) plus `fin-banner.webp`, used through `SandIllustration`
(`<figure aria-hidden>`, the image reveals by a mask scrolled with the view timeline). Generator and keying scripts
live in the hub (`projects/sablia/assets/brand/charte-2026-10/`), not in this repository.

The logo is the gold S-hourglass: `public/brand/symbol.svg` (stroked mark) and `public/brand/badge.svg` (night rounded
square with the gold S), from which `scripts/brand-assets.py` and `scripts/og-image.mjs` generate favicons, app
icons, OG and Twitter images and lockups. Guard: `python3 scripts/brand-check.py` (also fails on any coral).

## Motion

Motion is progressive enhancement: the static HTML already carries every readable text (the SSR content rule), and
the animation only stages it.

- **Pause.** Anything that keeps moving longer than 5 seconds has a pause control: an accessible name matching
  pause / arrêt / stop / figer / geler, at least 44 x 44 px, reachable by Tab, and Enter must stop every loop. The
  hook is `usePausable()` (`src/lib/hooks/`): paused by the button, by hover, by focus, or when the document is
  hidden. The Formations configurator opts out of hover (`hover: false`).
- **Reduced motion.** `prefers-reduced-motion: reduce` shows the FINAL state, never a dimmed or half-played one:
  `useReducedMotion()` (listens to the media query `change`), `final()` in `useTimelineLoop`, and CSS blocks in every
  scope plus the shared one in `base.css`. `motion-check.py` fails a text element under 0.5 opacity in that mode.
- **Loops.** `useTimelineLoop(async ({wait}) => {...}, {active, final})`: timers are `setTimeout` and `requestAnimationFrame`
  only, so a virtual clock can drive them; cancellation is internal, scripts do not test `alive()` after each wait.
- **Scroll-driven effects** (dune drift, illustration reveal) use `animation-timeline: view()` inside
  `@supports (animation-timeline: view())`; without support the final state shows.
- **Easing and durations.** Hover and press 0.2 s `cubic-bezier(0.2, 0.7, 0.2, 1)`, the hero underline 0.7 s with the
  same curve; counters ease out (cubic) over 1.4 s and play once; the figure of a counter in the SSR HTML is the final one.
- **No permanent `will-change`**: set it only while an element animates and reset it to `auto` afterwards (the hero does).
- **Events and aria.** A toggle keeps its label and uses `aria-pressed`, or changes its label and does not
  (`motion-check.py` fails the mix).

## Focus and links

`*:focus-visible` is a 2 px `gold-dark` outline, offset 3 px, `!important`; the dark-band override (`gold`) is declared
in the same layer after it. Links are ink and turn `gold-dark` on hover (`base.css`, `@layer base`).

## CSS discipline (why the files look the way they do)

The mockup was written reset-less and its three boards share class names with different bodies, so the port is
isolated by construction (`scripts/qa/css-collisions.py` enforces it, 0 violations required):

1. `globals.css` imports Tailwind WITHOUT preflight: `@layer theme, base, components, utilities;` then
   `tailwindcss/theme.css` and `tailwindcss/utilities.css` only.
2. Every other stylesheet is ONE scope: it opens with the same layer-order statement, then
   `@layer components { .v2-<scope> { ... } }`, with `@keyframes` and `@font-face` beside the rule (nested ones are
   dropped by Turbopack with a warning) and keyframe names prefixed by the scope without `v2-`.
3. Element selectors (`a`, `body`) exist only in `base.css`, in `@layer base`.
4. Fonts only through `var(--font-sans|mono)`.
