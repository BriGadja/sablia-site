import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NDA_LINE } from '@/content/declaration'
import { openBookingUrl } from '@/lib/booking'
import { OPEN_EVENT } from '@/lib/consent'
import { site } from '@/lib/site'
import { Cta } from './Cta'
import { Dune } from './Dune'
import { Eyebrow } from './Eyebrow'
import { FinBand } from './FinBand'
import { NAV_LINKS } from './nav-links'
import { SandIllustration } from './SandIllustration'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

let pathname = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))
vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

// Plan site-formation-lot1 (US-92): the header button depends on the clock, so every header case pins it.
// BEFORE is the last second before the start, AFTER the start second itself.
const BEFORE = new Date('2026-12-03T11:59:59+01:00')
const AFTER = new Date('2026-12-03T12:00:00+01:00')
const at = (d: Date) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(d)
}

beforeEach(() => {
  pathname = '/'
  at(BEFORE) // no case reads the real clock; a case that needs the start moves it
  vi.mocked(openBookingUrl).mockClear()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('SiteHeader', () => {
  // US-103: the menu ranges the site by intent, the monthly offer first; « Prochain webinaire » is
  // the header button while the session is ahead, never a menu entry.
  it('is a sticky header whose nav carries the menu by intent and, before the session, « Prochain webinaire »', () => {
    at(BEFORE)
    const { container } = render(<SiteHeader />)
    expect(container.querySelector('header')).not.toBeNull()
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(hrefs).toEqual([
      ['Sablia', '/'],
      ['Responsable IA externalisé', '/responsable-ia-externalise'],
      ['Formations', '/formations'],
      ['Conférences', '/conferences'],
      ['Réalisations', '/realisations'],
      ['Prochain webinaire', '/webinaire'],
    ])
    expect(nav.querySelector('[data-cta-book]')).toBeNull()
  })

  it('from the session start the header button opens the formation Calendly', () => {
    at(AFTER)
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    const book = nav.querySelector('button[data-cta-book]') as HTMLButtonElement
    expect(book.textContent).toBe('Réserver 30 min')
    fireEvent.click(book)
    expect(openBookingUrl).toHaveBeenCalledExactlyOnceWith(site.formationBookingUrl)
  })

  it('from the session start the menu is the same four links and nothing in the header goes to /webinaire', () => {
    at(AFTER)
    const { container } = render(<SiteHeader />)
    const links = document.getElementById('nav-links') as HTMLElement
    expect(Array.from(links.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual([
      '/responsable-ia-externalise',
      '/formations',
      '/conferences',
      '/realisations',
    ])
    expect(container.querySelector('a[href="/webinaire"]')).toBeNull()
  })

  // The menu no longer depends on the clock: the one `/webinaire` href of a page built before the
  // start is the header button's, which turns into « Réserver 30 min » once hydrated after it.
  it('a page built before the start carries « Prochain webinaire » in its HTML, hydrates without a mismatch, then drops it; the menu is unchanged', async () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE.toISOString())
    at(AFTER)
    const html = renderToString(<SiteHeader />)
    expect(html.match(/href="\/webinaire"/g)).toHaveLength(1)
    const menu = html.slice(html.indexOf('id="nav-links"'))
    expect(menu.slice(0, menu.indexOf('</div>'))).not.toContain('href="/webinaire"')
    // parsed the way the browser receives the static HTML, not built by React
    const container = document.createElement('div')
    const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
    container.append(...Array.from(parsed.body.childNodes))
    document.body.appendChild(container)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const recoverable = vi.fn()
    try {
      await act(async () => {
        hydrateRoot(container, <SiteHeader />, { onRecoverableError: recoverable })
      })
      expect(recoverable).not.toHaveBeenCalled()
      expect(errors).not.toHaveBeenCalled()
      expect(container.querySelector('a[href="/webinaire"]')).toBeNull()
      expect(container.querySelector('button[data-cta-book]')?.textContent).toBe('Réserver 30 min')
      expect(
        Array.from(container.querySelectorAll('#nav-links a')).map((a) => a.getAttribute('href')),
      ).toEqual(NAV_LINKS.map((l) => l.href))
    } finally {
      errors.mockRestore()
      container.remove()
    }
  })

  it('on /offres/** the header button keeps the CRM Calendly (default url)', () => {
    at(BEFORE)
    pathname = '/offres/compte-rendu-appel/hubspot'
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    fireEvent.click(nav.querySelector('button[data-cta-book]') as HTMLButtonElement)
    expect(openBookingUrl).toHaveBeenCalledExactlyOnceWith(undefined)
  })

  it('gives each desktop nav link a 44 px hit area that cancels out in layout', () => {
    const css = readFileSync(join(__dirname, 'site-header.css'), 'utf8')
    expect(css).toMatch(
      /\.v2-header-links a \{[^}]*padding-block:\s*14px;[^}]*margin-block:\s*-14px/,
    )
  })

  // US-103 D4 sweep: at 320 px (a 1280 px screen at 400 % zoom) « Responsable IA externalisé » ran into
  // « Formations » in two equal columns; each phone-menu column now takes at least its longest label.
  it('sizes each phone-menu column to at least its longest label, without shrinking the type', () => {
    const css = readFileSync(join(__dirname, 'site-header.css'), 'utf8')
    const open = css.match(/\.v2-header \.v2-header-links\.is-open \{([^}]*)\}/)?.[1] ?? ''
    expect(open).toMatch(/grid-template-columns:\s*repeat\(2, minmax\(max-content, 1fr\)\)/)
    expect(css).toMatch(/\.v2-header-links \{[^}]*font-size:\s*14px/)
  })

  it('opens and closes the phone menu with aria-expanded wired to the links list', () => {
    render(<SiteHeader />)
    const btn = screen.getByRole('button', { name: 'Menu' })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    const list = document.getElementById(btn.getAttribute('aria-controls') as string)
    expect(list).not.toBeNull()
    expect(list?.className).not.toContain('is-open')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    expect(list?.className).toContain('is-open')
    fireEvent.click(screen.getByText('Formations'))
    expect(btn.getAttribute('aria-expanded')).toBe('false')
  })

  it.each([
    ['/responsable-ia-externalise', 'Responsable IA externalisé'],
    ['/formations', 'Formations'],
    ['/conferences', 'Conférences'],
    ['/realisations', 'Réalisations'],
  ])('marks the current page on %s', (path, label) => {
    at(BEFORE)
    pathname = path
    render(<SiteHeader />)
    const current = document.querySelectorAll('[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0].textContent).toBe(label)
  })

  it.each([
    '/',
    '/ressources',
    '/webinaire',
    '/webinaire/merci',
    '/offres/compte-rendu-appel',
  ])('marks nothing on %s (outside the menu)', (p) => {
    pathname = p
    render(<SiteHeader />)
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(0)
  })
})

describe('SiteFooter', () => {
  // US-103: the four menu entries first (same labels and hrefs), then the webinar while it is ahead,
  // the CRM page, resources and the legal row. The footer keeps its own list on purpose.
  it('lists the four menu entries first, then the webinar, the CRM page, resources and legal links', () => {
    at(BEFORE)
    const { container } = render(<SiteFooter />)
    expect(screen.getByRole('navigation', { name: 'Pied de page' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Informations légales' })).toBeTruthy()
    const hrefs = Array.from(container.querySelectorAll('footer nav a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(hrefs).toEqual([
      ['Responsable IA externalisé', '/responsable-ia-externalise'],
      ['Formations', '/formations'],
      ['Conférences', '/conferences'],
      ['Réalisations', '/realisations'],
      ['Webinaires', '/webinaire'],
      ["Compte rendu d'appel", '/offres/compte-rendu-appel'],
      ['Ressources', '/ressources'],
      ['Newsletter', '/newsletter'],
      ['Vidéos', '/#videos'],
      ['Guide', '/guides/integrer-l-ia-dans-votre-entreprise'],
      ['Mentions légales', '/mentions-legales'],
      ['Confidentialité', '/politique-confidentialite'],
      ['CGV', '/cgv'],
    ])
    expect(hrefs.slice(0, 4)).toEqual(NAV_LINKS.map((l) => [l.label, l.href]))
    expect(screen.getByText(/© 2026 Sablia/)).toBeTruthy()
  })

  it('from the session start drops « Webinaires » (the one session page) and keeps every other link', () => {
    at(AFTER)
    const { container } = render(<SiteFooter />)
    const hrefs = Array.from(container.querySelectorAll('footer nav a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).not.toContain('/webinaire')
    expect(hrefs.slice(0, 5)).toEqual([
      '/responsable-ia-externalise',
      '/formations',
      '/conferences',
      '/realisations',
      '/offres/compte-rendu-appel',
    ])
    expect(hrefs).toHaveLength(12)
  })

  // US-100: the structured data says Rouen, so every page says it in visible text too.
  it('the footer says Rouen in plain text', () => {
    const { container } = render(<SiteFooter />)
    const place = Array.from(container.querySelectorAll('p')).find((p) =>
      p.textContent?.includes('Rouen'),
    )
    expect(place?.textContent).toBe(
      'Sablia, à Rouen. Interventions en Normandie et partout en France.',
    )
    expect(place?.closest('nav')).toBeNull()
  })

  it('carries the activity declaration in its exact L6352-12 form, after the links, beside the copyright', () => {
    const { container } = render(<SiteFooter />)
    const line = Array.from(container.querySelectorAll('p')).find((p) => p.textContent === NDA_LINE)
    expect(line).toBeTruthy()
    expect(line?.closest('nav')).toBeNull()
    expect(container.textContent?.split(NDA_LINE)).toHaveLength(2)
    const text = container.textContent ?? ''
    expect(text.indexOf(NDA_LINE)).toBeGreaterThan(text.indexOf('Gérer mes choix'))
    expect(text.indexOf(NDA_LINE)).toBeLessThan(text.indexOf('© 2026 Sablia'))
  })

  it('« Gérer mes choix » reopens the consent banner', () => {
    render(<SiteFooter />)
    const seen = vi.fn()
    window.addEventListener(OPEN_EVENT, seen)
    fireEvent.click(screen.getByRole('button', { name: 'Gérer mes choix' }))
    window.removeEventListener(OPEN_EVENT, seen)
    expect(seen).toHaveBeenCalledTimes(1)
  })
})

describe('FinBand', () => {
  it('is the #fin band: heading, text, banner image, booking CTA, optional guide link', () => {
    const { container } = render(
      <FinBand
        title="Trente minutes pour voir."
        text="Vous nous montrez votre CRM."
        link={{ href: '/ressources', label: 'Le guide.' }}
      />,
    )
    const section = container.querySelector('section#fin')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Trente minutes pour voir.')
    expect(screen.getByText('Vous nous montrez votre CRM.')).toBeTruthy()
    const img = section?.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/illus/fin-banner.webp')
    expect(img?.getAttribute('alt')).toBe('')
    expect(section?.querySelector('button[data-cta-book]')?.textContent).toContain(
      'Réserver 30 min',
    )
    expect(screen.getByRole('link', { name: 'Le guide.' }).getAttribute('href')).toBe('/ressources')
    expect(section?.querySelector('svg.dune')).not.toBeNull()
  })

  it('omits the link when none is given', () => {
    const { container } = render(<FinBand title="T" text="x" />)
    expect(container.querySelectorAll('a')).toHaveLength(0)
  })

  it('forwards bookingUrl to its booking button (formation pages pass the formation Calendly)', () => {
    const { container } = render(
      <FinBand title="T" text="x" bookingUrl={site.formationBookingUrl} />,
    )
    fireEvent.click(container.querySelector('button[data-cta-book]') as HTMLButtonElement)
    expect(openBookingUrl).toHaveBeenCalledExactlyOnceWith(site.formationBookingUrl)
  })

  it('keeps the default (CRM) Calendly when no bookingUrl is given', () => {
    const { container } = render(<FinBand title="T" text="x" />)
    fireEvent.click(container.querySelector('button[data-cta-book]') as HTMLButtonElement)
    expect(openBookingUrl).toHaveBeenCalledExactlyOnceWith(undefined)
  })
})

describe('Cta', () => {
  it('is a booking button by default', () => {
    render(<Cta />)
    expect(screen.getByRole('button').hasAttribute('data-cta-book')).toBe(true)
  })

  it('is a link when it has an href', () => {
    render(<Cta href="/formations">Voir</Cta>)
    expect(screen.getByRole('link', { name: 'Voir' }).getAttribute('href')).toBe('/formations')
  })

  it('carries variant and size classes', () => {
    render(<Cta variant="light" size="lg" />)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('v2-cta')
    expect(cls).toContain('is-light')
    expect(cls).toContain('is-lg')
  })
})

describe('Dune', () => {
  it('is a decorative two-path svg carrying the shared effect classes', () => {
    const { container } = render(<Dune back="#C68A8E" front="#161B29" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('class')).toContain('dune')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 1440 80')
    expect(container.querySelector('path.d-back')?.getAttribute('fill')).toBe('#C68A8E')
    expect(container.querySelector('path.d-front')?.getAttribute('fill')).toBe('#161B29')
  })

  it('sits at the bottom edge on request', () => {
    const { container } = render(<Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('is-bottom')
  })
})

describe('SandIllustration', () => {
  it('is a decorative figure with a scroll-drawn image', () => {
    const { container } = render(
      <SandIllustration src="/illus/offre-contour-nuit.webp" height={220} bare />,
    )
    const fig = container.querySelector('figure')
    expect(fig?.getAttribute('aria-hidden')).toBe('true')
    expect(fig?.className).toContain('is-bare')
    expect((fig as HTMLElement).style.getPropertyValue('--ill-h')).toBe('220px')
    const img = fig?.querySelector('img')
    expect(img?.className).toContain('ill-draw')
    expect(img?.getAttribute('alt')).toBe('')
  })
})

describe('Eyebrow', () => {
  it('renders its label', () => {
    render(<Eyebrow>L'offre</Eyebrow>)
    expect(screen.getByText("L'offre").className).toContain('v2-eyebrow')
  })

  it('switches tone on a dark band', () => {
    render(<Eyebrow onDark>Formations</Eyebrow>)
    expect(screen.getByText('Formations').className).toContain('is-dark')
  })
})
