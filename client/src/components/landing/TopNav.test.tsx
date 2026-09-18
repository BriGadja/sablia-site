import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OF1_ROUTE } from '@/content/of1'
import { site } from '@/lib/site'
import TopNav from './TopNav'

/**
 * The nav the Landing (and the legal pages) get when no props are passed. Five items since Brice's
 * decision of 2026-09-18 (A2): Problèmes, Fondateur and FAQ stay on the page and leave the menu.
 * The anchors are ROOT-relative (`/#…`) because this nav is also rendered on ThankYou and on the
 * three legal pages through `LegalShell`, where a bare `#contact` pointed at nothing.
 */
const LANDING_ITEMS: readonly (readonly [string, string])[] = [
  ['Offres', OF1_ROUTE],
  ['Méthode', '/#process'],
  ['Cas clients', '/#proof'],
  ['Formations', '/#formations'],
  ['Contact', '/#contact'],
]

/** Every anchor of the bar except the wordmark, which links the site root. */
const navAnchors = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('a')).filter((a) => a.getAttribute('href') !== '/')

describe('TopNav', () => {
  it('CTA opens site.bookingUrl by default', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<TopNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Réserver un call audit' }))
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

  it('renders exactly the five items of A2, in order, in the desktop menu', () => {
    const { container } = render(<TopNav />)
    const rendered = navAnchors(container).map((a) => [
      (a.textContent ?? '').trim(),
      a.getAttribute('href'),
    ])
    expect(rendered).toEqual(LANDING_ITEMS.map(([label, href]) => [label, href]))
  })

  it('renders the same five in the mobile sheet once it is opened', () => {
    const { container } = render(<TopNav />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const rendered = navAnchors(container)
    expect(rendered).toHaveLength(LANDING_ITEMS.length * 2)
    expect(rendered.slice(LANDING_ITEMS.length).map((a) => a.getAttribute('href'))).toEqual(
      LANDING_ITEMS.map(([, href]) => href),
    )
  })

  it('puts Offres before the section anchors, in both menus', () => {
    const { container } = render(<TopNav />)
    const labels = Array.from(container.querySelectorAll('a'))
      .map((a) => (a.textContent ?? '').trim())
      .filter((label) => label === 'Offres' || label === 'Méthode')
    expect(labels.slice(0, 2)).toEqual(['Offres', 'Méthode'])
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
   * Runs last: the Offres probe navigates the shared happy-dom location through wouter.
   * `fireEvent.click` returns false when a handler called `preventDefault()`. Wouter's Link always
   * does (it navigates through the history API and never scrolls to a hash), a plain `<a>` never
   * does — which is the whole difference between a working « Contact » entry and a dead one.
   */
  it('renders a root-relative hash item as a plain <a>, and the product page as a wouter Link', () => {
    const { container } = render(<TopNav />)
    const contact = container.querySelector('a[href="/#contact"]')
    expect(contact).not.toBeNull()
    expect(fireEvent.click(contact as Element)).toBe(true)

    const offres = container.querySelector(`a[href="${OF1_ROUTE}"]`)
    expect(offres).not.toBeNull()
    expect(fireEvent.click(offres as Element)).toBe(false)
  })
})
