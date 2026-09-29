import { fireEvent, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OF1_ROUTE } from '@/content/of1'
import OffreCompteRenduAppel from './OffreCompteRenduAppel'

/**
 * The offer page after Brice's 2026-09-29 feedback on the new home: « quand on clique dans le
 * bandeau, c'est compliqué de retourner à la page d'accueil, et j'aimerais que toutes les fenêtres
 * de l'offre soient sur le même ton ». So: the site-wide bar with « Offre » current, and every
 * section on the home's light surface (the footer stays dark, as on the home).
 */
const SITE_NAV: readonly (readonly [string, string])[] = [
  ['Offre', OF1_ROUTE],
  ['Formations', '/#formations'],
  ['Ressources', '/ressources'],
]

/** The ids that links into the page point at; they outlived the page's own anchor bar. */
const SECTION_IDS = ['variantes', 'inclus', 'prix', 'preuve', 'faq']

/** A class that paints a dark band, a dark card or dark-theme text, or the `.on-light` trap. */
const DARK_OR_TRAP =
  /(^|\s)(bg-canvas|bg-canvas-soft|bg-surface-card(\/\S+)?|on-light|text-on-dark(-[a-z]+)?)(\s|$)/

const renderPage = () =>
  render(
    <HelmetProvider>
      <OffreCompteRenduAppel />
    </HelmetProvider>,
  )

/** Every anchor of the bar except the logo, which links the site root. */
const barAnchors = (nav: Element) =>
  Array.from(nav.querySelectorAll('a')).filter((a) => a.getAttribute('href') !== '/')

afterEach(() => {
  window.history.replaceState(null, '', '/')
  vi.restoreAllMocks()
})

describe('offer page: the site-wide bar', () => {
  it('renders Offre · Formations · Ressources and the booking button, with Offre current', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const nav = container.querySelector('nav') as Element
    expect(
      barAnchors(nav).map((a) => [(a.textContent ?? '').trim(), a.getAttribute('href')]),
    ).toEqual(SITE_NAV.map(([label, href]) => [label, href]))
    expect(screen.getByRole('button', { name: 'Réserver 30 min' })).toBeTruthy()

    const current = nav.querySelectorAll('a[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0].getAttribute('href')).toBe(OF1_ROUTE)
  })

  it('marks Offre current in the mobile sheet too, and drops the old anchor bar', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const nav = container.querySelector('nav') as Element
    const anchors = barAnchors(nav)
    expect(anchors).toHaveLength(SITE_NAV.length * 2)
    const current = Array.from(nav.querySelectorAll('a[aria-current="page"]'))
    expect(current.map((a) => a.getAttribute('href'))).toEqual([OF1_ROUTE, OF1_ROUTE])
    const labels = anchors.map((a) => (a.textContent ?? '').trim())
    for (const gone of ['Accueil', 'Deux variantes', 'Ce qui est inclus', 'Prix', 'FAQ']) {
      expect(labels).not.toContain(gone)
    }
    expect(anchors.filter((a) => (a.getAttribute('href') ?? '').startsWith('#'))).toEqual([])
  })

  it('keeps the logo on the home link, on the light bar', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const nav = container.querySelector('nav') as Element
    expect(nav.className).toContain('bg-surface-light')
    expect(nav.querySelector('a[href="/"] [role="img"][aria-label="Sablia"]')).not.toBeNull()
  })
})

describe('offer page: one light tone', () => {
  it('puts every section on the light surface, without the on-light class', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const sections = Array.from(container.querySelectorAll('main section'))
    expect(sections.length).toBeGreaterThanOrEqual(9)
    for (const section of sections) {
      expect(section.className, section.id).toMatch(/(^|\s)bg-surface-light(\s|$)/)
    }
  })

  it('paints no dark band, card or dark-theme text, except the button on the coral card', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const main = container.querySelector('main') as Element
    const offenders = Array.from(main.querySelectorAll('*'))
      .filter((el) => DARK_OR_TRAP.test(el.getAttribute('class') ?? ''))
      // the home's final call does the same: a dark button on the coral card
      .filter((el) => !(el.tagName === 'BUTTON' && el.closest('.bg-primary') !== null))
      .map((el) => `${el.tagName.toLowerCase()}.${el.getAttribute('class')}`)
    expect(offenders).toEqual([])
  })

  it('lets the booking button on the coral card wrap on a phone', () => {
    // An unconditional `whitespace-nowrap` sized the card's grid track to the button's text: at
    // 390 px the button, title and paragraph ran 32 px past the card (measured on sablia.io and on
    // the preview, 2026-09-29), and on the cream band the white words past the edge disappear.
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const button = container.querySelector('main .bg-primary button') as Element
    expect(button.textContent).toContain('Réserver 30 minutes avec Brice')
    expect(button.className).not.toMatch(/(^|\s)whitespace-nowrap(\s|$)/)
  })

  it('lets the free-month badge go under its label on a phone', () => {
    // A `shrink-0` badge beside a label in a row that could not wrap: at 390 px « Premier mois
    // offert » ran 32 px past its price card (187 to 375 px for a card ending at 343, on
    // sablia.io and on the preview, 2026-09-29).
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    renderPage()
    const badge = screen.getByText('Premier mois offert')
    expect((badge.parentElement as Element).className).toMatch(/(^|\s)flex-wrap(\s|$)/)
  })

  it('keeps the section ids that deep links point at', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    renderPage()
    for (const id of SECTION_IDS) {
      expect(document.getElementById(id), id).not.toBeNull()
    }
  })
})

/**
 * Records which elements were scrolled into view, and lets a test decide when the webfonts are in.
 * happy-dom has no `document.fonts`; the page reads it through `?.`.
 */
function scrollHarness() {
  const scrolled: string[] = []
  const original = HTMLElement.prototype.scrollIntoView
  HTMLElement.prototype.scrollIntoView = function scrollIntoView(this: HTMLElement) {
    scrolled.push(this.id)
  }
  let fontsIn: () => void = () => undefined
  const ready = new Promise<void>((resolve) => {
    fontsIn = resolve
  })
  Object.defineProperty(document, 'fonts', { value: { ready }, configurable: true })
  const restore = () => {
    HTMLElement.prototype.scrollIntoView = original
    Reflect.deleteProperty(document, 'fonts')
  }
  return { scrolled, fontsIn, restore }
}

describe('offer page: where it opens', () => {
  it('lands a deep link on its section, and again once the webfonts are in', async () => {
    // The swap reflows the text above the target right after the first landing: with scroll
    // anchoring off, the section ended up to 166 px off at 390 px (preview, 2026-09-29).
    window.history.replaceState(null, '', `${OF1_ROUTE}#prix`)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const h = scrollHarness()
    try {
      renderPage()
      expect(h.scrolled).toEqual(['prix'])
      h.fontsIn()
      await Promise.resolve()
      await Promise.resolve()
      expect(h.scrolled).toEqual(['prix', 'prix'])
    } finally {
      h.restore()
    }
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('turns scroll anchoring off on the page', () => {
    // With it on, Chrome moved a deep link 98 to 207 px off its section after the landing, in 6 of
    // 6 trials at 390 px; with it off, 15 of 15 landed at 0 (preview, 2026-09-29).
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = renderPage()
    const page = (container.querySelector('nav') as Element).parentElement as Element
    expect(page.contains(container.querySelector('main'))).toBe(true)
    expect(page.className).toContain('[overflow-anchor:none]')
  })

  it('does not pull the visitor back once they have started to scroll', async () => {
    window.history.replaceState(null, '', `${OF1_ROUTE}#faq`)
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const h = scrollHarness()
    try {
      renderPage()
      window.dispatchEvent(new Event('wheel'))
      h.fontsIn()
      await Promise.resolve()
      await Promise.resolve()
      expect(h.scrolled).toEqual(['faq'])
    } finally {
      h.restore()
    }
  })

  it('opens at the top without a hash', () => {
    window.history.replaceState(null, '', OF1_ROUTE)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    renderPage()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
