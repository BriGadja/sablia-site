import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PATHS, SESSION } from '@/content/webinaire'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { WEBINAIRE_BAND } from './content'
import { WebinaireBand } from './index'

/**
 * `#webinaire`, the next-session band of the home (plan site-formation-lot1 U8, copy 01b « Next
 * webinar block »). It switches through `WhenUpcoming` only: shown while the 03/12 session is ahead,
 * gone from its start (01b: hidden when no session is upcoming; no countdown, no scarcity).
 */
const BEFORE = new Date('2026-11-05T09:00:00+01:00')
const START = new Date('2026-12-03T12:00:00+01:00')

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function ssrAt(now: Date): string {
  vi.useFakeTimers({ now, toFake: ['Date'] })
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', '')
  return renderToString(<WebinaireBand />).replace(/&#x27;/g, "'")
}

describe('#webinaire before the session', () => {
  it('is the #webinaire section with the scoped class on a dark panel', () => {
    const html = ssrAt(BEFORE)
    expect(html).toContain('id="webinaire"')
    expect(html).toContain('v2-home-webinaire')
    expect(html).toMatch(/class="[^"]*\bpanel\b/)
  })

  it('carries the session from webinaire.ts, never retyped: title as h2, the three facts, the lede', () => {
    const html = ssrAt(BEFORE)
    expect(html).toContain('Prochain webinaire · gratuit')
    expect(html).toMatch(
      /<h2[^>]*>Bureaux d'études : votre équipe utilise déjà l'IA\. Avec quelles règles \?<\/h2>/,
    )
    expect(html).toContain(`>${SESSION.title}<`)
    for (const [label, value] of [
      ['Quand', 'Jeudi 3 décembre, de 12 h à 13 h'],
      ['Où', 'En visio, sur Google Meet'],
      ['Prix', 'Gratuit'],
    ]) {
      expect(html).toContain(`>${label}</dt>`)
      expect(html).toContain(`>${value}</dd>`)
    }
    expect(html).toContain(
      "Une heure en visio pour voir l'IA travailler sur des documents fictifs de bureau d'études, et repartir avec les règles à poser dans votre équipe.",
    )
  })

  it("« Je m'inscris » links to /webinaire (the frozen page), not to a booking popup", () => {
    const html = ssrAt(BEFORE)
    expect(html).toMatch(/<a [^>]*href="\/webinaire"[^>]*>Je m'inscris/)
    expect(WEBINAIRE_BAND.href).toBe(PATHS.page)
  })

  it('the quiet line books the « Échange de 30 minutes » event and counts one cta_book', () => {
    vi.useFakeTimers({ now: BEFORE, toFake: ['Date'] })
    mockReducedMotion(true)
    mockIntersectionObserver()
    const open = vi.fn()
    vi.stubGlobal('open', open)
    render(<WebinaireBand />)
    expect(screen.getByText('Un autre métier ?')).toBeTruthy()
    const btn = screen.getByRole('button', { name: 'Réserver un échange de 30 minutes.' })
    expect(btn.hasAttribute('data-cta-book')).toBe(true)
    fireEvent.click(btn)
    expect(open).toHaveBeenCalledTimes(1)
    expect(open.mock.calls[0][0]).toBe('https://calendly.com/brice-gachadoat/echange-30-minutes')
  })

  it('no countdown, no scarcity, no pilot seats, no price', () => {
    const html = ssrAt(BEFORE)
    expect(html).not.toMatch(/places?|dernières?|plus que|compte à rebours|J-\d|restant/i)
    expect(html).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)/i)
    expect(html).not.toContain('—')
  })
})

describe('#webinaire from the session start', () => {
  it('renders nothing at 03/12 12:00:00 Paris (the boundary second)', () => {
    expect(ssrAt(START)).toBe('')
  })

  it('a page built before the start hides the band once the visitor clock is past it', () => {
    vi.useFakeTimers({ now: new Date('2026-12-04T08:00:00+01:00'), toFake: ['Date'] })
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE.toISOString())
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<WebinaireBand />)
    expect(container.querySelector('#webinaire')).toBeNull()
  })
})

describe('#webinaire source', () => {
  const src = readFileSync(join(__dirname, 'content.ts'), 'utf8')
  const css = readFileSync(join(__dirname, 'webinaire-band.css'), 'utf8')

  it('never types the date or the title twice: both come from webinaire.ts', () => {
    expect(src).not.toMatch(/3 décembre|Bureaux d'études/)
    expect(src).toMatch(/from '@\/content\/webinaire'/)
  })

  it('stops its entrance under reduced motion', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })

  it('clips the panel, so the ticket sliding in from the right never widens the page (390 px: 405)', () => {
    expect(css).toMatch(/\.wb-panel \{[^}]*overflow:\s*clip/)
  })
})
