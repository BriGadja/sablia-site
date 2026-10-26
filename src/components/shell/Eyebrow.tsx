import type { ReactNode } from 'react'
import './eyebrow.css'

/** The small mono kicker above a section title. `onDark` swaps the dark gold for the light gold. */
export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <div className={`v2-eyebrow${onDark ? ' is-dark' : ''}`}>{children}</div>
}
