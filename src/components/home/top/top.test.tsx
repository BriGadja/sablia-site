import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NAV_LINKS } from '@/components/shell/nav-links'
import { SESSION } from '@/content/webinaire'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { site } from '@/lib/site'
import * as content from './content'
import { PANEL_ID, recede, Top } from './index'

/**
 * US-104 (home hero, plan sablia-site-structure-offre E1/E2, copy deck B2 `home.*`): the promise of
 * what Sablia does for an SME, the four doors of the site (the monthly offer first) as plain links,
 * and the first button on today's switch: the webinar link then the call while a session is upcoming,
 * the call alone once it has started. One image only: the 09/10 photo, loaded eagerly.
 */
const BEFORE = '2026-11-05T10:00:00+01:00'
const AFTER = '2026-12-03T12:00:00+01:00'
const at = (iso: string) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}

beforeEach(() => {
  mockReducedMotion(false)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const H1 = "L'IA mise en place dans votre PME, et votre équipe formée."
const SUB =
  "Brice Gachadoat, fondateur de Sablia, à Rouen, pour les PME de 10 à 50 personnes qui n'ont personne en interne pour s'en occuper."
const PILL = 'Sablia, à Rouen · PME de 10 à 50 personnes'
const DOORS = [
  {
    href: '/responsable-ia-externalise',
    label: 'Responsable IA externalisé',
    line: "Quelqu'un qui construit et entretient vos outils, chaque mois.",
  },
  {
    href: '/formations',
    label: 'Formations',
    line: "D'une demi-journée à trois jours, pour votre équipe.",
  },
  {
    href: '/conferences',
    label: 'Conférences',
    line: 'Une conférence ou un séminaire, sur demande.',
  },
  {
    href: '/realisations',
    label: 'Réalisations',
    line: 'Outils, sites et formations construits pour des clients.',
  },
]

/** The actionable elements of the hero's button row, in document order. */
function actions(section: Element | null): HTMLElement[] {
  const row = section?.querySelector('.cta-row[data-zone="hero"]')
  return Array.from(row?.querySelectorAll<HTMLElement>('a, button') ?? [])
}

/** The four door links, in document order. */
function doors(section: Element | null): HTMLAnchorElement[] {
  const row = section?.querySelector('.doors[data-zone="hero"]')
  return Array.from(row?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
}

describe('Top, hero of the site', () => {
  it('is the #top section with the deck h1, sub, pill and reassurance', () => {
    at(BEFORE)
    const { container } = render(<Top />)
    const section = container.querySelector('section#top.v2-top')
    expect(section).not.toBeNull()
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent).toBe(H1)
    expect(h1s[0].querySelector('.hx-u')?.textContent).toBe('votre équipe formée')
    expect(section?.textContent).toContain(SUB)
    expect(section?.textContent).toContain(PILL)
    expect(section?.textContent).toContain('Webinaire et échange gratuits, sans engagement.')
  })

  it('opens the four doors of the site, the monthly offer first, as plain links in the hero zone', () => {
    at(BEFORE)
    const { container } = render(<Top />)
    const links = doors(container.querySelector('#top'))
    expect(links.map((a) => a.getAttribute('href'))).toEqual(DOORS.map((d) => d.href))
    links.forEach((a, i) => {
      expect(a.textContent).toContain(DOORS[i].label)
      expect(a.textContent).toContain(DOORS[i].line)
      expect(a.getAttribute('target')).toBeNull()
    })
    // The same four intents as the menu, in the same order and words (US-103).
    expect(DOORS.map((d) => [d.href, d.label])).toEqual(NAV_LINKS.map((l) => [l.href, l.label]))
  })

  it('before the session: the webinar link first, « Réserver 30 min » second on the formation Calendly', () => {
    at(BEFORE)
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = render(<Top />)
    const [first, second, ...rest] = actions(container.querySelector('#top'))
    expect(rest).toHaveLength(0)
    expect(first.tagName).toBe('A')
    expect(first.getAttribute('href')).toBe('/webinaire')
    expect(first.textContent).toBe('Prochain webinaire : jeudi 3 décembre')
    expect(second.matches('button[data-cta-book]')).toBe(true)
    expect(second.textContent).toBe('Réserver 30 min')
    fireEvent.click(second)
    expect(open).toHaveBeenCalledTimes(1)
    expect(open.mock.calls[0][0]).toBe(site.formationBookingUrl)
    expect(open.mock.calls[0][0]).not.toBe(site.bookingUrl)
  })

  it('takes the webinar day from SESSION (never typed twice)', () => {
    at(BEFORE)
    const day = SESSION.date.replace(/\s+\d{4}$/, '')
    expect(content.HERO.cta.webinaire).toBe(
      `Prochain webinaire : ${day.charAt(0).toLowerCase()}${day.slice(1)}`,
    )
  })

  it('from the session start: « Réserver 30 min » alone in the button row, no webinar link, the four doors stay', () => {
    at(AFTER)
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { container } = render(<Top />)
    const section = container.querySelector('#top')
    const [first, ...rest] = actions(section)
    expect(rest).toHaveLength(0)
    expect(first.matches('button[data-cta-book]')).toBe(true)
    expect(first.textContent).toContain('Réserver 30 min')
    fireEvent.click(first)
    expect(open.mock.calls[0][0]).toBe(site.formationBookingUrl)
    expect(section?.querySelector('a[href="/webinaire"]')).toBeNull()
    expect(doors(section).map((a) => a.getAttribute('href'))).toEqual(DOORS.map((d) => d.href))
  })

  it('static HTML built before the session carries the text, the webinar link and the doors', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    at(AFTER)
    const html = renderToString(<Top />).replace(/&#x27;/g, "'")
    expect(html).toContain('id="top"')
    expect(html).toContain('href="/webinaire"')
    expect(html).toContain('data-zone="hero"')
    expect(html).toMatch(/<h1[^>]*>.*votre équipe formée.*<\/h1>/)
    expect(html).toContain(SUB)
    for (const d of DOORS) {
      expect(html).toContain(`href="${d.href}"`)
      expect(html).toContain(d.line)
    }
  })

  it('shows the 09/10 photo with its alt text, sizes and srcset, loaded eagerly, and no other image', () => {
    at(BEFORE)
    const { container } = render(<Top />)
    expect(container.querySelectorAll('#top img')).toHaveLength(1)
    const img = container.querySelector('#top img')
    expect(img?.getAttribute('alt')).toBe(
      "Brice Gachadoat parle debout à un pupitre, devant une salle d'une vingtaine de personnes assises.",
    )
    expect(img?.getAttribute('src')).toBe('/photos/formation-01-1200.webp')
    const srcset = img?.getAttribute('srcset') ?? ''
    for (const w of [540, 900, 1200])
      expect(srcset).toContain(`/photos/formation-01-${w}.webp ${w}w`)
    expect(img?.getAttribute('width')).toBe('1200')
    expect(img?.getAttribute('height')).toBe('800')
    expect(img?.getAttribute('loading')).not.toBe('lazy')
    expect(img?.getAttribute('fetchpriority')).toBe('high')
  })

  it('carries no price, no retired offer word, no CRM loop and no em dash', () => {
    at(BEFORE)
    const { container } = render(<Top />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/€|euros?\b|\bprix\b|tarif/i)
    expect(text).not.toMatch(/temps partagé|référent|audit/i)
    expect(text).not.toMatch(/CRM|Paul Lemoine|Appel terminé/)
    expect(text).not.toContain('—')
    expect(container.querySelector('button[aria-label*="pause" i]')).toBeNull()
    for (const gone of ['CALLERS', 'proofLine', 'derive', 'FINAL_FRAME', 'H1_LINES'])
      expect(Object.keys(content)).not.toContain(gone)
    // The quiet « Voir l'offre en détail » door left with the four doors (deck `home.hero.cta`).
    expect(Object.keys(content.HERO.cta)).not.toContain('offre')
  })
})

/**
 * US-104 Exemple (E-fix): at 390 px the first screen shows the h1, the four doors and the webinar
 * button. On phones the hero is one column in reading order, so the doors come before the photo in
 * the DOM (screen readers and the phone layout agree) and as compact rows (label and arrow, 48 px; the
 * line stays the door's description, visually hidden); on wide screens the grid areas keep the photo
 * beside the copy and the doors under both, as before.
 */
describe('the four doors before the photo, on the first phone screen', () => {
  const css = readFileSync(join(__dirname, 'top.css'), 'utf8')
  /** The rule or at-rule that opens with `head`, braces balanced. */
  function block(src: string, head: string): string {
    const i = src.indexOf(head)
    if (i < 0) return ''
    let depth = 0
    for (let j = src.indexOf('{', i); j > 0 && j < src.length; j++) {
      if (src[j] === '{') depth++
      else if (src[j] === '}' && --depth === 0) return src.slice(i, j + 1)
    }
    return ''
  }

  it('the hero reads copy, doors, photo, and the photo is still there', () => {
    at(BEFORE)
    const { container } = render(<Top />)
    const grid = container.querySelector('#top .hero-grid') as HTMLElement
    expect(Array.from(grid.children).map((c) => c.className)).toEqual(['copy', 'doors', 'photo'])
    expect(grid.querySelector('.photo img')?.getAttribute('fetchpriority')).toBe('high')
  })

  it('wide screens keep the photo beside the copy and the doors under both (grid areas)', () => {
    const wide = block(css, '.hero-grid {')
    expect(wide).toMatch(/grid-template-areas:\s*'copy photo'\s*'doors doors'/)
    for (const area of ['copy', 'photo', 'doors'])
      expect(block(css, `.${area} {`), area).toMatch(new RegExp(`grid-area:\\s*${area};`))
  })

  it('phones stack copy, doors, photo', () => {
    const phone = block(css, '@media (max-width: 900px)')
    expect(block(phone, '.hero-grid {')).toMatch(
      /grid-template-areas:\s*'copy'\s*'doors'\s*'photo'/,
    )
  })

  it('small phones: each door is a 48 px row, its line visually hidden but still read', () => {
    const small = block(css, '@media (max-width: 640px)')
    expect(small).not.toBe('')
    expect(block(small, '.door {')).toMatch(/min-height:\s*48px/)
    const line = block(small, '.door-line {')
    expect(line).toMatch(/position:\s*absolute/)
    expect(line).toMatch(/clip-path:\s*inset\(50%\)/)
    expect(line).not.toMatch(/display:\s*none/)
  })
})

/**
 * U7b (critic of U7): the gold underline is a gesture, so it must play where the visitor can see it:
 * the static HTML holds it undrawn, and it draws once the tab is visible, the hero is in view and the
 * photo and fonts are ready (at most 1.2 s of waiting for those two). It plays once.
 */
describe('the gold underline under « votre équipe formée »', () => {
  const state = (c: Element) => c.querySelector('#top')?.getAttribute('data-underline')
  const photo = (c: Element) => c.querySelector('#top img') as HTMLImageElement

  it('waits, undrawn, in the static HTML', () => {
    at(BEFORE)
    const html = renderToString(<Top />)
    expect(html).toContain('data-underline="hold"')
  })

  it('waits while the tab is hidden, draws once it is shown, and never replays', async () => {
    at(BEFORE)
    const io = mockIntersectionObserver()
    const vis = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    const { container } = render(<Top />)
    await act(async () => {
      photo(container).dispatchEvent(new Event('load'))
      io.trigger(container.querySelector('#top') as Element, true)
    })
    expect(state(container)).toBe('hold')
    vis.mockReturnValue('visible')
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(state(container)).toBe('draw')
    vis.mockReturnValue('hidden')
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(state(container)).toBe('draw')
  })

  it('waits for the hero to be in view', async () => {
    at(BEFORE)
    const io = mockIntersectionObserver()
    const { container } = render(<Top />)
    await act(async () => {
      photo(container).dispatchEvent(new Event('load'))
    })
    expect(state(container)).toBe('hold')
    await act(async () => {
      io.trigger(container.querySelector('#top') as Element, true)
    })
    expect(state(container)).toBe('draw')
  })

  it('waits for the photo, but never more than 1.2 s', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(BEFORE))
    const io = mockIntersectionObserver()
    const { container } = render(<Top />)
    await act(async () => {
      io.trigger(container.querySelector('#top') as Element, true)
      await vi.advanceTimersByTimeAsync(1100)
    })
    expect(state(container)).toBe('hold')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })
    expect(state(container)).toBe('draw')
  })

  it('is drawn at once under reduced motion', () => {
    at(BEFORE)
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Top />)
    expect(state(container)).toBe('final')
  })
})

/**
 * U7b: while the night panel slides over the sticky hero, the hero content rises at 0.6 of the scroll
 * speed, so the panel reaches the doors no sooner than ordinary scrolling would take them under
 * the header; the fade comes late, the doors stay readable over the first third of the slide.
 * US-104 (E3): the panel is the monthly offer, the band that now follows the hero, named once.
 */
describe('the panel that slides over the hero', () => {
  it('is the monthly offer band (#mensuel)', () => {
    expect(PANEL_ID).toBe('mensuel')
  })
})

describe('recede(p, travel)', () => {
  it('is the identity before the slide', () => {
    expect(recede(0, 560)).toEqual({ y: 0, scale: 1, opacity: 1 })
  })
  it('lifts the content at 0.6 of the scroll speed', () => {
    for (const p of [0.25, 0.5, 1]) expect(recede(p, 560).y).toBeCloseTo(-336 * p, 5)
  })
  it('keeps the doors readable over the first third and while the panel reaches them', () => {
    expect(recede(0.35, 560).opacity).toBeGreaterThanOrEqual(0.9)
    expect(recede(0.6, 560).opacity).toBeGreaterThanOrEqual(0.8) // 1440: the panel reaches the doors at p ≈ 0.59
  })
  it('has faded out completely by 85 % of the slide, before the dock (no ghost line under the header)', () => {
    expect(recede(0.85, 560).opacity).toBeCloseTo(0, 5)
    expect(recede(1, 560).opacity).toBeCloseTo(0, 5)
    expect(recede(1, 560).scale).toBeCloseTo(0.92, 5)
  })
})

/**
 * U7b, second critic: a visitor who stops while the panel's top lies on a row of doors would rest on
 * a half-cut button. When the scroll settles there (wide screens, motion allowed), the page glides on
 * to the dock if the visitor was going down, or back to the uncovered hero if going up. US-104: the
 * hero has two such rows (the buttons, then the four doors), each one counts.
 */
describe('never rests on a half-covered door', () => {
  const H = 800 // happy-dom has no layout: the hero's travel falls back to 800
  function wide(reduced = false) {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('min-width: 901px')
        ? true
        : query.includes('reduce')
          ? reduced
          : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
  }
  const ROWS = { cta: { top: 300, bottom: 348 }, doors: { top: 420, bottom: 500 } }
  function layout(panel: { top: number }, rows = ROWS) {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const box = (top: number, bottom: number) =>
        ({
          top,
          bottom,
          left: 0,
          right: 1000,
          width: 1000,
          height: bottom - top,
          x: 0,
          y: top,
          toJSON: () => ({}),
        }) as DOMRect
      if (this.classList.contains('v2-header')) return box(0, 72)
      if (this.id === PANEL_ID) return box(panel.top, panel.top + 900)
      if (this.getAttribute('data-zone') === 'hero') {
        const row = this.classList.contains('doors') ? rows.doors : rows.cta
        return box(row.top, row.bottom)
      }
      return box(0, 0)
    })
  }
  async function scrollTo(scroll: { y: number }, ...ys: number[]) {
    for (const y of ys) {
      scroll.y = y
      await act(async () => {
        document.dispatchEvent(new Event('scroll'))
        await vi.advanceTimersByTimeAsync(20)
      })
    }
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
  }
  const page = () =>
    render(
      <>
        <header className="v2-header" />
        <Top />
        <section id={PANEL_ID} />
      </>,
    )

  function setup(reduced = false) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(BEFORE))
    wide(reduced)
    const scroll = { y: 0 }
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scroll.y)
    const by = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
    return { scroll, by }
  }

  it('going down, it glides on to the dock', async () => {
    const { scroll, by } = setup()
    layout({ top: 320 })
    page()
    await scrollTo(scroll, 400, 420)
    expect(by).toHaveBeenCalledTimes(1)
    expect(by).toHaveBeenCalledWith({ top: 320 - 72, behavior: 'smooth' })
  })

  it('going up, it glides back to the uncovered hero', async () => {
    const { scroll, by } = setup()
    layout({ top: 320 })
    page()
    await scrollTo(scroll, 420, 400)
    expect(by).toHaveBeenCalledWith({ top: -(H - 320), behavior: 'smooth' })
  })

  it('a stop on the row of the four doors glides too', async () => {
    const { scroll, by } = setup()
    layout({ top: 460 })
    page()
    await scrollTo(scroll, 200, 220)
    expect(by).toHaveBeenCalledTimes(1)
    expect(by).toHaveBeenCalledWith({ top: 460 - 72, behavior: 'smooth' })
  })

  it('leaves the page alone when every row is clear or fully covered', async () => {
    const { scroll, by } = setup()
    const panel = { top: 560 } // both rows clear
    layout(panel)
    page()
    await scrollTo(scroll, 100, 120)
    panel.top = 380 // the buttons clear, the doors fully covered
    await scrollTo(scroll, 300, 320)
    panel.top = 200 // both rows fully covered
    await scrollTo(scroll, 600, 620)
    expect(by).not.toHaveBeenCalled()
  })

  it('a door focused by keyboard while the hero is receded brings the hero back (even under reduced motion)', async () => {
    for (const reduced of [false, true]) {
      const { by } = setup(reduced)
      const panel = { top: 300 }
      layout(panel)
      const { container, unmount } = page()
      const door = container.querySelector('#top [data-zone="hero"] a') as HTMLElement
      fireEvent.focusIn(door)
      expect(by).toHaveBeenLastCalledWith({ top: -(H - 300), behavior: 'auto' })
      by.mockClear()
      panel.top = H // hero not receded: nothing to do
      fireEvent.focusIn(door)
      expect(by).not.toHaveBeenCalled()
      unmount()
      vi.restoreAllMocks()
    }
  })

  it('does nothing under reduced motion', async () => {
    const { scroll, by } = setup(true)
    layout({ top: 320 })
    page()
    await scrollTo(scroll, 400, 420)
    expect(by).not.toHaveBeenCalled()
  })
})
