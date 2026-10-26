import './dune.css'

type Props = {
  /** Fill of the far dune. */
  back: string
  /** Fill of the near dune: the ground colour of the section it opens. */
  front: string
  /** `top` straddles the section's top edge (default); `bottom` sits on its floor (hero). */
  edge?: 'top' | 'bottom'
}

/**
 * Two parallax dunes. The scroll-driven drift lives in base.css (`.dune`, `.d-back`, `.d-front`);
 * this only places the shapes. The parent section must be `position: relative`.
 */
export function Dune({ back, front, edge = 'top' }: Props) {
  return (
    <svg
      className={`dune v2-dune${edge === 'bottom' ? ' is-bottom' : ''}`}
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
    >
      <path
        className="d-back"
        d="M-80 80L-80 50C40 30 180 16 330 18C400 19 440 30 470 36C610 54 760 10 960 12C1130 14 1270 42 1440 28C1480 24 1500 26 1520 28L1520 80Z"
        fill={back}
      />
      <path
        className="d-front"
        d="M-40 80L-40 64C60 52 140 46 220 46C320 46 420 70 640 54C860 38 1000 26 1180 44C1300 56 1380 52 1440 48C1460 47 1470 47 1480 47L1480 80Z"
        fill={front}
      />
    </svg>
  )
}
