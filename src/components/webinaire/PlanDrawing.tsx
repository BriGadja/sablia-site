import type { CSSProperties } from 'react'

/**
 * Hero drawing of `/webinaire`: a bureau d'études' plan sheet (floor plan, dimension line, title
 * block with the hourglass in its corner) and a reading lens passing over it, drawn as gold sand
 * contours on the night (the sand-drawing rule: contours only, no heap, no falling thread). Each
 * stroke draws itself once at load; reduced motion shows the finished drawing.
 */
const STROKES: readonly string[] = [
  // sheet with a folded corner
  'M24 20h232l20 20v170H24z',
  'M256 20v20h20',
  // title block (cartouche)
  'M176 168h100M176 168v42M176 182h100M176 196h52M228 182v28',
  // floor plan: outer walls, inner walls, door swing, window
  'M48 60h112v92H48z',
  'M48 104h52M124 104h36M100 60v24',
  'M100 104a24 24 0 0 1 24 -24',
  'M160 76v20M164 76v20',
  // dimension line with its ticks
  'M48 44h112M48 38v12M160 38v12M52 44l-4 0M156 44l4 0',
  // side notes (written lines)
  'M184 64h64M184 76h48M184 88h56M184 112h64M184 124h40',
  // hourglass in the title block
  'M240 188h20M240 206h20M242 188c0 6 16 6 16 9s-16 3-16 9M258 188c0 6-16 6-16 9s16 3 16 9',
  // reading lens over the plan
  'M150 132m-26 0a26 26 0 1 0 52 0a26 26 0 1 0 -52 0',
  'M169 151l20 20',
]

export function PlanDrawing() {
  return (
    <svg
      className="wbn-plan"
      viewBox="0 0 300 230"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {STROKES.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          className="wbn-plan-stroke"
          style={{ '--i': String(index) } as CSSProperties}
        />
      ))}
    </svg>
  )
}
