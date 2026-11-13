/**
 * US-110 (plan sablia-site-structure-offre H3): the doors of the site in the measure, clicked where
 * they sit. Each door page is rendered as served (bar, header, page, footer) before and from the
 * 03/12 session start, the clock pinned (build stamp and visitor clock), never the real date. Every
 * link is clicked: a link to a door carries the door's name in `dest` (`responsable-ia`,
 * `formations`, `conferences`, `realisations`, `webinaire`), any other link carries none. Every
 * booking button is clicked: each emits exactly one `cta_book`, with the zone and label of its
 * click, and no two booking buttons of one page share a (zone, label) pair, so Umami's page path and
 * zone tell them apart. Events go through the real `events.ts` and `analytics.ts` to `umami.track`.
 */
import { fireEvent, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConferencesPage from '@/app/conferences/page'
import FormationsPage from '@/app/formations/page'
import HomeRoute from '@/app/page'
import RealisationsPage from '@/app/realisations/page'
import OfferPage from '@/app/responsable-ia-externalise/page'
import { SessionBar } from '@/components/shell/SessionBar'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { clearConsent } from './consent'
import { startEventTracking } from './events'
import { mockIntersectionObserver, mockReducedMotion } from './hooks/test-utils'

let pathname = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))
// A plain anchor in place of next/link (the mock of videos.test.tsx): a click is a plain anchor
// click, which the listener below keeps from navigating.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
// `Videos` is an async server component (its tiles are read at build time): the mock of
// HomePage.test.tsx, its own view with the fallback tiles, so the band keeps its markup and its id.
vi.mock('@/components/home/videos', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/components/home/videos')>()
  const { resolveTiles } = await import('@/components/home/videos/content')
  return { ...real, Videos: () => <real.VideosView tiles={resolveTiles(null)} /> }
})

type TestWindow = Window & { umami?: { track: (n: string, d?: object) => void } }
const w = window as unknown as TestWindow

const BEFORE = '2026-11-20T10:00:00+01:00'
const START = '2026-12-03T12:00:00+01:00'

/** Build stamp and visitor clock on the same instant (static HTML and first render agree). */
function pin(iso: string) {
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', iso)
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}

/** The oracle, written apart from `destOf`: the door each own path names. */
const DOOR: Record<string, string> = {
  '/responsable-ia-externalise': 'responsable-ia',
  '/formations': 'formations',
  '/conferences': 'conferences',
  '/realisations': 'realisations',
  '/webinaire': 'webinaire',
}
function doorOf(href: string): string | undefined {
  const url = new URL(href, 'https://sablia.io/')
  if (url.hostname !== 'sablia.io') return undefined
  return DOOR[url.pathname.replace(/\/$/, '')]
}
const MENU = ['responsable-ia', 'formations', 'conferences', 'realisations']

type Page = { path: string; Page: () => ReactNode; booking: { before: string[]; from: string[] } }
/** Zones of the booking buttons, in page order; from the start the header button joins (`nav`). */
const PAGES: Page[] = [
  {
    path: '/',
    Page: HomeRoute,
    booking: { before: ['hero', 'webinaire', 'fin'], from: ['nav', 'hero', 'fin'] },
  },
  {
    path: '/responsable-ia-externalise',
    Page: OfferPage,
    booking: { before: ['top', 'conditions', 'fin'], from: ['nav', 'top', 'conditions', 'fin'] },
  },
  {
    path: '/formations',
    Page: FormationsPage,
    booking: { before: ['top', 'fin'], from: ['nav', 'top', 'fin'] },
  },
  {
    path: '/conferences',
    Page: ConferencesPage,
    booking: { before: ['top', 'fin'], from: ['nav', 'top', 'fin'] },
  },
  {
    path: '/realisations',
    Page: RealisationsPage,
    booking: { before: ['besoin', 'fin'], from: ['nav', 'besoin', 'fin'] },
  },
]

let track: ReturnType<typeof vi.fn>
let stop: () => void = () => {}
const noNavigation = (e: Event) => e.preventDefault()

beforeEach(() => {
  window.localStorage.clear()
  clearConsent()
  track = vi.fn()
  w.umami = { track }
  vi.stubGlobal('open', vi.fn())
  mockReducedMotion(false)
  mockIntersectionObserver()
  stop = startEventTracking()
  document.addEventListener('click', noNavigation)
})
afterEach(() => {
  stop()
  document.removeEventListener('click', noNavigation)
  delete w.umami
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function served({ path, Page }: Page) {
  pathname = path
  return render(
    <>
      <SessionBar />
      <SiteHeader />
      <Page />
      <SiteFooter />
    </>,
  )
}

type Data = { zone: string; label: string; dest?: string }
const events = (name: string) =>
  track.mock.calls.filter((c) => c[0] === name).map((c) => c[1] as Data)

/** Where a link sits in the served page: the header, the footer, else the page between them. */
const placeOf = (a: Element) =>
  a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : 'page'

/**
 * Clicks every link; returns « zone:dest », « place:dest » and « place>zone:dest » for each door
 * click. The place is read from the DOM; the zone is what the measure records: the menu reads `nav`,
 * the footer `footer` (its `data-zone`, although its links sit in a `<nav>`), so a door taken in the
 * menu and one taken in the footer are told apart in Umami too.
 */
function clickLinks(root: HTMLElement): Set<string> {
  const seen = new Set<string>()
  for (const a of Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
    const href = a.getAttribute('href') ?? ''
    track.mockClear()
    fireEvent.click(a)
    const [click] = events('click')
    expect(click, `no click event for ${href}`).toBeDefined()
    expect(click.dest, `${href} in zone ${click.zone}`).toBe(doorOf(href))
    if (click.dest) {
      seen.add(`${click.zone}:${click.dest}`)
      seen.add(`${placeOf(a)}:${click.dest}`)
      seen.add(`${placeOf(a)}>${click.zone}:${click.dest}`)
    }
  }
  return seen
}

describe.each([
  ['before', BEFORE],
  ['from', START],
] as const)('the doors %s the 03/12 session start', (when, iso) => {
  describe.each(PAGES)('$path', (page) => {
    it('a link to a door carries the door, any other link none; the menu and the footer carry the four doors', () => {
      pin(iso)
      const { container } = served(page)
      const seen = clickLinks(container)
      for (const dest of MENU) {
        expect(seen.has(`header:${dest}`), `menu ${dest}`).toBe(true)
        expect(seen.has(`header>nav:${dest}`), `menu ${dest} zone`).toBe(true)
        expect(seen.has(`footer:${dest}`), `footer ${dest}`).toBe(true)
        expect(seen.has(`footer>footer:${dest}`), `footer ${dest} zone`).toBe(true)
      }
      // no footer click reads the menu's zone, no menu click the footer's
      expect(
        [...seen].filter((s) => s.startsWith('footer>nav:') || s.startsWith('header>footer:')),
      ).toEqual([])
      const webinar = [...seen].filter((s) => s.endsWith(':webinaire'))
      if (when === 'before') {
        // the header button, the bar and the footer entry, while the session is ahead
        for (const key of ['header', 'bar', 'footer'])
          expect(webinar, `${key}:webinaire`).toContain(`${key}:webinaire`)
        expect(webinar).toContain('footer>footer:webinaire')
      } else {
        expect(webinar).toEqual([])
      }
    })

    it('each booking button emits one cta_book with its click zone and label, no pair twice', () => {
      pin(iso)
      const { container } = served(page)
      const pairs: Data[] = []
      for (const b of Array.from(container.querySelectorAll<HTMLElement>('[data-cta-book]'))) {
        track.mockClear()
        fireEvent.click(b)
        const [click] = events('click')
        const booked = events('cta_book')
        expect(booked, `${click?.zone} ${click?.label}`).toHaveLength(1)
        expect(booked[0]).toEqual({ zone: click.zone, label: click.label })
        pairs.push(booked[0])
      }
      expect(pairs.map((p) => p.zone)).toEqual(
        when === 'before' ? page.booking.before : page.booking.from,
      )
      const keys = pairs.map((p) => `${p.zone}|${p.label}`)
      expect(new Set(keys).size, keys.join(' · ')).toBe(keys.length)
    })
  })

  it('the home names each door where a visitor meets it: hero, #mensuel, #conferences, #videos', () => {
    pin(iso)
    const home = PAGES[0]
    const seen = clickLinks(served(home).container)
    for (const dest of MENU) expect(seen.has(`hero:${dest}`), `hero ${dest}`).toBe(true)
    expect(seen.has('mensuel:responsable-ia')).toBe(true)
    expect(seen.has('conferences:conferences')).toBe(true)
    expect(seen.has('videos:realisations')).toBe(true)
    expect(seen.has('hero:webinaire')).toBe(when === 'before')
  })

  // Brice at VP2 (13/11, question 8): the line before the closing band of these three pages is a door to
  // the monthly offer, measured in the zone « mensuel » (the home's monthly block carries the same zone).
  it.each([
    '/formations',
    '/conferences',
    '/realisations',
  ])('%s: the line before the closing band is a door to the monthly offer, zone « mensuel »', (path) => {
    pin(iso)
    const page = PAGES.find((p) => p.path === path) as Page
    const seen = clickLinks(served(page).container)
    expect(seen.has('page>mensuel:responsable-ia')).toBe(true)
  })

  it.each([
    '/formations',
    '/conferences',
  ])('%s: the webinar reminder is a door while the session is ahead', (path) => {
    pin(iso)
    const page = PAGES.find((p) => p.path === path) as Page
    const seen = clickLinks(served(page).container)
    expect(seen.has('rappel:webinaire')).toBe(when === 'before')
  })
})
