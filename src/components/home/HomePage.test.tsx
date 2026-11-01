/**
 * The assembled training home (plan site-formation-lot1 U13b, Data contract « Home order »): ten
 * bands in order inside `main#contenu`, each id once, the hash anchors the footer, `/about` (301 to
 * `/#derriere`) and the closing band rely on, and none of the bands that left the home (`scene` went
 * to the CRM offer page, `construit` to /realisations). `#webinaire` and the closing band's webinar
 * link exist only while the 19/11 session is ahead, so every case fixes the clock, never the real date.
 */
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { HomePage } from './HomePage'
import { resolveTiles } from './videos/content'

// `Videos` is an async server component (its tiles are read at build time); the home test renders
// its own view with the fallback tiles, so the band keeps its real markup and its id.
vi.mock('./videos', async (importOriginal) => {
  const real = await importOriginal<typeof import('./videos')>()
  return { ...real, Videos: () => <real.VideosView tiles={resolveTiles(null)} /> }
})

const BEFORE = new Date('2026-11-05T09:00:00+01:00')
const START = new Date('2026-11-19T12:00:00+01:00')

const ORDER = [
  'top',
  'offre',
  'automatisations',
  'formations',
  'derriere',
  'webinaire',
  'apres',
  'videos',
  'faq',
  'fin',
]
const ANCHORS = ['top', 'offre', 'derriere', 'videos', 'faq', 'fin']
const WEBINAR_LINK = 'Pas encore prêt ? Le webinaire gratuit du jeudi 19 novembre.'

function at(now: Date) {
  vi.useFakeTimers({ now, toFake: ['Date'] })
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', '')
}

/** Ids of the bands: sections with an id that sit in no other section. */
function bands(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('section[id]'))
    .filter((s) => s.parentElement?.closest('section') == null)
    .map((s) => s.id)
}

beforeEach(() => {
  mockReducedMotion(false)
  mockIntersectionObserver()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('home before the 19/11 session', () => {
  it('mounts the ten bands in the contract order inside main#contenu', () => {
    at(BEFORE)
    const { container } = render(<HomePage />)
    const main = container.querySelector('main#contenu') as HTMLElement
    expect(main).not.toBeNull()
    expect(main.getAttribute('tabindex')).toBe('-1')
    expect(bands(main)).toEqual(ORDER)
  })

  it('carries each hash anchor exactly once, and no band that left the home', () => {
    at(BEFORE)
    render(<HomePage />)
    for (const id of [...ANCHORS, 'webinaire', 'apres', 'formations', 'automatisations']) {
      expect(document.querySelectorAll(`[id="${id}"]`), `#${id}`).toHaveLength(1)
    }
    expect(document.getElementById('scene')).toBeNull()
    expect(document.getElementById('construit')).toBeNull()
  })

  it('the static HTML (what crawlers read) has the same bands in the same order', () => {
    at(BEFORE)
    const html = renderToString(<HomePage />)
    const idx = ORDER.map((id) => html.indexOf(`id="${id}"`))
    expect(idx.every((i) => i >= 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    expect(html).not.toContain('id="scene"')
    expect(html).not.toContain('id="construit"')
  })

  it('the closing band keeps its quiet link to the webinar and its booking button', () => {
    at(BEFORE)
    render(<HomePage />)
    const fin = document.getElementById('fin') as HTMLElement
    const link = fin.querySelector('a[href="/webinaire"]')
    expect(link?.textContent).toBe(WEBINAR_LINK)
    expect(fin.querySelector('button')?.textContent).toContain('Réserver 30 min')
  })
})

describe('home from the session start (19/11 12:00 Paris)', () => {
  it('drops #webinaire and keeps every other band in order', () => {
    at(START)
    const { container } = render(<HomePage />)
    const main = container.querySelector('main#contenu') as HTMLElement
    expect(bands(main)).toEqual(ORDER.filter((id) => id !== 'webinaire'))
    for (const id of ANCHORS) expect(document.getElementById(id), `#${id}`).not.toBeNull()
  })

  it('the closing band no longer names the past session, its booking button stays', () => {
    at(START)
    render(<HomePage />)
    const fin = document.getElementById('fin') as HTMLElement
    expect(fin.querySelector('a[href="/webinaire"]')).toBeNull()
    expect(fin.textContent).not.toContain('19 novembre')
    expect(fin.querySelector('button')?.textContent).toContain('Réserver 30 min')
  })
})
