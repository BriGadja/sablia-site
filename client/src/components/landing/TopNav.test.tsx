import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OF1_ROUTE } from '@/content/of1'
import { site } from '@/lib/site'
import TopNav from './TopNav'

/**
 * The nav every page gets when no props are passed. Three items since the grill of 2026-09-28
 * (decision 3): Offre · Formations · Ressources, plus « Réserver 30 min ». « Cas clients » and
 * « Contact » left the bar with the sections they pointed at; the footer keeps `/#contact`. The
 * 3-item nav is SITE-WIDE on purpose: LegalShell, ThankYou, Ressources and Ressource render
 * `<TopNav />` without `items`. Two real routes and one hash stay in the bar, so the plain-`<a>` /
 * wouter-Link branch of NavItem is still exercised both ways. The hash is ROOT-relative (`/#…`)
 * because a bare `#formations` points at nothing on the pages that are not the home.
 */
const LANDING_ITEMS: readonly (readonly [string, string])[] = [
  ['Offre', OF1_ROUTE],
  ['Formations', '/#formations'],
  ['Ressources', '/ressources'],
]

/** Every anchor of the bar except the wordmark, which links the site root. */
const navAnchors = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('a')).filter((a) => a.getAttribute('href') !== '/')

describe('TopNav', () => {
  it('CTA opens site.bookingUrl by default', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<TopNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Réserver 30 min' }))
    expect(openSpy.mock.calls[0][0]).toBe(site.bookingUrl)
    openSpy.mockRestore()
  })

  it('CTA opens the overridden bookingUrl and label', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<TopNav bookingUrl="https://x/y" ctaLabel="Go" />)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(openSpy.mock.calls[0][0]).toBe('https://x/y')
    openSpy.mockRestore()
  })

  it('renders exactly the three items of decision 3, in order, in the desktop menu', () => {
    const { container } = render(<TopNav />)
    const rendered = navAnchors(container).map((a) => [
      (a.textContent ?? '').trim(),
      a.getAttribute('href'),
    ])
    expect(rendered).toEqual(LANDING_ITEMS.map(([label, href]) => [label, href]))
  })

  it('renders the same three in the mobile sheet once it is opened', () => {
    const { container } = render(<TopNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const rendered = navAnchors(container)
    expect(rendered).toHaveLength(LANDING_ITEMS.length * 2)
    expect(rendered.slice(LANDING_ITEMS.length).map((a) => a.getAttribute('href'))).toEqual(
      LANDING_ITEMS.map(([, href]) => href),
    )
  })

  it('puts Offre first, in both menus', () => {
    const { container } = render(<TopNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const labels = navAnchors(container).map((a) => (a.textContent ?? '').trim())
    expect(labels[0]).toBe('Offre')
    expect(labels[LANDING_ITEMS.length]).toBe('Offre')
  })

  it('renders the light wordmark in the light tone (the home)', () => {
    const { container } = render(<TopNav tone="light" />)
    expect(container.querySelector('nav img')?.getAttribute('src')).toBe('/wordmark-light.svg')
  })

  it('leaves a page that supplies its own items untouched', () => {
    const { container } = render(
      <TopNav items={[{ label: 'Prix', href: '#prix' }]} bookingUrl="https://x/y" ctaLabel="Go" />,
    )
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('#prix')
    expect(hrefs).not.toContain(OF1_ROUTE)
  })

  /**
   * Runs last: the Offre probe navigates the shared happy-dom location through wouter.
   * `fireEvent.click` returns false when a handler called `preventDefault()`. Wouter's Link always
   * does (it navigates through the history API and never scrolls to a hash), a plain `<a>` never
   * does — which is the whole difference between a working « Formations » entry and a dead one.
   */
  it('renders a root-relative hash item as a plain <a>, and the product page as a wouter Link', () => {
    const { container } = render(<TopNav />)
    const formations = container.querySelector('a[href="/#formations"]')
    expect(formations).not.toBeNull()
    expect(fireEvent.click(formations as Element)).toBe(true)

    const offres = container.querySelector(`a[href="${OF1_ROUTE}"]`)
    expect(offres).not.toBeNull()
    expect(fireEvent.click(offres as Element)).toBe(false)
  })
})
