import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OPEN_EVENT } from '@/lib/consent'
import { Cta } from './Cta'
import { Dune } from './Dune'
import { Eyebrow } from './Eyebrow'
import { FinBand } from './FinBand'
import { SandIllustration } from './SandIllustration'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

let pathname = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))

beforeEach(() => {
  pathname = '/'
})

describe('SiteHeader', () => {
  it('is a sticky header whose nav carries the four links and the booking button', () => {
    const { container } = render(<SiteHeader />)
    expect(container.querySelector('header')).not.toBeNull()
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(hrefs).toEqual([
      ['Sablia', '/'],
      ["Compte rendu d'appel", '/#offre'],
      ['Formations', '/formations'],
      ['Accompagnement', '/accompagnement'],
      ['Réalisations', '/#construit'],
    ])
    const book = nav.querySelector('button[data-cta-book]')
    expect(book?.textContent).toBe('Réserver 30 min')
  })

  it('gives each desktop nav link a 44 px hit area that cancels out in layout', () => {
    const css = readFileSync(join(__dirname, 'site-header.css'), 'utf8')
    expect(css).toMatch(
      /\.v2-header-links a \{[^}]*padding-block:\s*14px;[^}]*margin-block:\s*-14px/,
    )
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
    ['/', "Compte rendu d'appel"],
    ['/formations', 'Formations'],
    ['/accompagnement', 'Accompagnement'],
  ])('marks the current page on %s', (path, label) => {
    pathname = path
    render(<SiteHeader />)
    const current = document.querySelectorAll('[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0].textContent).toBe(label)
  })

  it('marks nothing on a page outside the nav', () => {
    pathname = '/ressources'
    render(<SiteHeader />)
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(0)
  })
})

describe('SiteFooter', () => {
  it('lists the legal and resource links, Newsletter right after Ressources', () => {
    render(<SiteFooter />)
    const nav = screen.getByRole('navigation', { name: 'Pied de page' })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ])
    expect(hrefs).toEqual([
      ["L'offre", '/#offre'],
      ['Ressources', '/ressources'],
      ['Newsletter', '/newsletter'],
      ['Vidéos', '/#videos'],
      ['Guide', '/guides/integrer-l-ia-dans-votre-entreprise'],
      ['Mentions légales', '/mentions-legales'],
      ['Confidentialité', '/politique-confidentialite'],
      ['CGV', '/cgv'],
    ])
    expect(screen.getByText(/© 2026 Sablia/)).toBeTruthy()
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
