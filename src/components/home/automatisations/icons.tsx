/** Small inline SVG helpers shared by the scenes. */

export function PathIcon({
  d,
  size,
  stroke = 'currentColor',
  width = 1.9,
}: {
  d: string
  size: number
  stroke?: string
  width?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export const CHECK_PATH = 'M5 12l5 5L20 7'

/** The green round tick (`.pp-ok`). */
export function OkDot({ size = 18, pop = false }: { size?: number; pop?: boolean }) {
  return (
    <span className={`pp-ok${pop ? ' pop' : ''}`} style={{ width: size, height: size }}>
      <PathIcon d={CHECK_PATH} size={10} stroke="#FFFFFF" width={3} />
    </span>
  )
}
