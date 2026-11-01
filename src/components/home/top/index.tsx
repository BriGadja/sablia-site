'use client' // the hero recedes under the offer panel (scroll position, viewport width) and draws its underline when seen (tab visibility)

import Link from 'next/link'
import { type RefObject, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { BookingButton } from '@/components/shell/BookingButton'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { WhenUpcoming } from '@/content/session-bar'
import { PATHS } from '@/content/webinaire'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { site } from '@/lib/site'
import { HERO, PHOTO } from './content'
import './top.css'

const WIDE = '(min-width: 901px)'
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
/** The recede is a desktop effect (off at 900 px and below, where the hero is not sticky). */
function useWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  )
}

/**
 * Hero content at recede progress `p` (0: the panel still below the hero, 1: the panel at the
 * viewport top), `travel` being the hero's height. The content rises at 0.6 of the scroll speed, so the
 * panel reaches the two doors no sooner than ordinary scrolling would take them under the header; it
 * shrinks a little and fades late: fully opaque until p = 0.4, still 0.8 when the panel reaches the
 * doors (p about 0.6 at 1440), gone by p = 0.85, before the panel docks (no ghost line).
 */
export function recede(p: number, travel: number) {
  const f = Math.min(1, Math.max(0, (p - 0.4) / 0.45))
  return { y: 0 - p * travel * 0.6, scale: 1 - 0.08 * p, opacity: 1 - f * f }
}

/** Quiet time after which a scroll counts as settled. */
const SETTLE_MS = 160

/**
 * Writes the recede straight onto the grid's style on each animation frame (no React render, no
 * rounding: the content moves with the scroll and must not step). Wide screens only.
 * When a scroll settles with the panel's top on the doors' row (a half-cut button), the page glides
 * on to the dock if the visitor was going down, or back to the uncovered hero if going up.
 */
function useRecede(
  heroRef: RefObject<HTMLElement | null>,
  gridRef: RefObject<HTMLElement | null>,
  on: boolean,
) {
  useEffect(() => {
    const hero = heroRef.current
    const grid = gridRef.current
    const panel = document.getElementById('offre')
    if (!on || !hero || !grid || !panel) return
    const reset = () => {
      grid.style.transform = ''
      grid.style.opacity = ''
      grid.style.willChange = ''
    }
    let raf = 0
    const apply = () => {
      raf = 0
      const travel = hero.offsetHeight || 800
      const p = Math.max(0, Math.min(1, 1 - panel.getBoundingClientRect().top / travel))
      if (p === 0) return reset()
      const r = recede(p, travel)
      grid.style.transform = `translate3d(0, ${r.y.toFixed(1)}px, 0) scale(${r.scale.toFixed(4)})`
      grid.style.opacity = r.opacity.toFixed(3)
      grid.style.willChange = p < 1 ? 'transform, opacity' : ''
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    let lastY = window.scrollY
    let dir = 0
    let settle = 0
    const settled = () => {
      const doors = hero.querySelector('[data-zone="hero"]')
      if (!doors || dir === 0) return
      const t = panel.getBoundingClientRect().top
      const d = doors.getBoundingClientRect()
      if (t <= d.top - 8 || t >= d.bottom + 8) return // doors fully covered or clear
      const line = document.querySelector('.v2-header')?.getBoundingClientRect().bottom ?? 0
      const travel = hero.offsetHeight || 800
      window.scrollBy({ top: dir > 0 ? t - Math.max(0, line) : -(travel - t), behavior: 'smooth' })
    }
    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY) dir = y > lastY ? 1 : -1
      lastY = y
      window.clearTimeout(settle)
      settle = window.setTimeout(settled, SETTLE_MS)
      schedule()
    }
    schedule()
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', schedule)
    return () => {
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      reset()
    }
  }, [heroRef, gridRef, on])
}

/**
 * A door of the receded hero (sticky, under the panel or the header) would take the keyboard focus
 * invisibly: bring the hero back uncovered first. Wide screens only, where the hero is sticky; reduced
 * motion included (the stickiness is CSS); instant.
 */
function useFocusUncover(heroRef: RefObject<HTMLElement | null>, on: boolean) {
  useEffect(() => {
    const hero = heroRef.current
    const panel = document.getElementById('offre')
    if (!on || !hero || !panel) return
    const onFocus = () => {
      const travel = hero.offsetHeight || 800
      const t = panel.getBoundingClientRect().top
      if (t < travel) window.scrollBy({ top: -(travel - t), behavior: 'auto' })
    }
    hero.addEventListener('focusin', onFocus)
    return () => hero.removeEventListener('focusin', onFocus)
  }, [heroRef, on])
}

/** Longest wait for the photo and the fonts before the underline draws anyway. */
const READY_CAP_MS = 1200

/** `hold` = undrawn (static HTML), `draw` = drawing then drawn, `final` = drawn at once (reduced motion). */
type Underline = 'hold' | 'draw' | 'final'

/**
 * The gold underline is a gesture, so it plays where the visitor sees it: once the tab is visible,
 * the hero is in view and the photo and fonts are ready (or 1.2 s have passed). It plays once.
 */
function useUnderline(heroRef: RefObject<HTMLElement | null>): Underline {
  const reduced = useReducedMotion()
  const inView = useInView(heroRef, { threshold: 0.5, once: true })
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [go, setGo] = useState(false)

  useEffect(() => {
    const read = () => setVisible(document.visibilityState === 'visible')
    read()
    document.addEventListener('visibilitychange', read)
    return () => document.removeEventListener('visibilitychange', read)
  }, [])

  useEffect(() => {
    let alive = true
    const done = () => {
      if (alive) setReady(true)
    }
    const cap = window.setTimeout(done, READY_CAP_MS)
    const img = heroRef.current?.querySelector('img')
    const photo =
      !img || (img.complete && img.naturalWidth > 0)
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
          })
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    Promise.all([photo, fonts]).then(done, done)
    return () => {
      alive = false
      window.clearTimeout(cap)
    }
  }, [heroRef])

  useEffect(() => {
    if (visible && ready && inView) setGo(true)
  }, [visible, ready, inView])

  if (reduced) return 'final'
  return go ? 'draw' : 'hold'
}

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

/**
 * Home hero: the promise, two doors in order (the webinar while a session is upcoming, then the
 * 30-minute call on the formation Calendly) and a real photo of the trainer. The section is sticky on
 * wide screens and recedes while the night `#offre` panel slides over it.
 */
export function Top() {
  const wide = useWide()
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  useRecede(heroRef, gridRef, wide && !reduced)
  useFocusUncover(heroRef, wide)
  const underline = useUnderline(heroRef)

  return (
    <section id="top" ref={heroRef} className="v2-top" data-underline={underline}>
      <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
      <div className="wrap">
        <div className="hero-grid" ref={gridRef}>
          <div className="copy">
            <div className="pill">
              <span className="pill-dot" aria-hidden="true" />
              {HERO.pill}
            </div>
            <h1 className="h1">
              {HERO.h1.lead}
              <span className="hx-u">{HERO.h1.mark}</span>
              {HERO.h1.tail}
            </h1>
            <p className="claim">{HERO.sub}</p>
            <div className="cta-row" data-zone="hero">
              <WhenUpcoming
                upcoming={
                  <>
                    <Cta size="lg" arrow href={PATHS.page}>
                      {HERO.cta.webinaire}
                    </Cta>
                    <BookingButton className="quiet" url={site.formationBookingUrl}>
                      <CalendarIcon />
                      <span className="quiet-t">{HERO.cta.book}</span>
                    </BookingButton>
                  </>
                }
                past={
                  <>
                    <Cta size="lg" arrow url={site.formationBookingUrl}>
                      {HERO.cta.book}
                    </Cta>
                    <Link className="quiet" href="/formations">
                      <span className="quiet-t">{HERO.cta.offre}</span>
                    </Link>
                  </>
                }
              />
            </div>
            <p className="free">{HERO.reassure}</p>
          </div>

          <figure className="photo">
            {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
            <img
              src={PHOTO.src}
              srcSet={PHOTO.srcSet}
              sizes="(max-width: 900px) calc(100vw - 32px), 560px"
              width={PHOTO.width}
              height={PHOTO.height}
              alt={PHOTO.alt}
              fetchPriority="high"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
