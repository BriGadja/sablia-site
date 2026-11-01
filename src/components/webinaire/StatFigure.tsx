'use client' // the count-up runs in the browser once the figure scrolls into view

import { useRef } from 'react'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { useInView } from '@/lib/hooks/useInView'

/**
 * A big branch figure (« 86 % ») that counts up once when it scrolls in. The server HTML carries
 * the final figure (the count-up returns its target before it plays and under reduced motion), and
 * screen readers read the final figure only.
 */
export function StatFigure({ figure, label }: { figure: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.5, once: true })
  const target = Number.parseInt(figure, 10)
  const value = useCountUp(target, { active: inView })
  const suffix = figure.slice(String(target).length).trim()
  return (
    <div ref={ref} className="wbn-stat">
      <p className="wbn-stat-figure">
        <span aria-hidden="true">
          {value}
          {' '}
          {suffix}
        </span>
        <span className="sr-only">{figure}</span>
      </p>
      <p className="wbn-stat-label">{label}</p>
    </div>
  )
}
