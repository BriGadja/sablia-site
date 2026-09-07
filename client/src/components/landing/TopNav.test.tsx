import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OF1_ROUTE } from '@/content/of1'
import { site } from '@/lib/site'
import TopNav from './TopNav'

/** The nav the Landing (and the legal pages) get when no props are passed. */
const LANDING_ANCHORS = ['#problemes', '#process', '#equipe', '#proof', '#faq']

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

  // Replaces the old "Landing byte-identical" floor: the nav is shared, so the Landing now
  // legitimately CHANGES. What must hold is that it gains the Offres entry and loses nothing.
  it('offers the product page, and keeps every Landing section link', () => {
    const { container } = render(<TopNav />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))

    expect(hrefs).toContain(OF1_ROUTE)
    for (const anchor of LANDING_ANCHORS) {
      expect(hrefs).toContain(anchor)
    }
    expect(screen.getAllByRole('link', { name: 'Offres' }).length).toBeGreaterThan(0)
  })

  it('puts Offres before the section anchors, in both menus', () => {
    const { container } = render(<TopNav />)
    const labels = Array.from(container.querySelectorAll('a'))
      .map((a) => (a.textContent ?? '').trim())
      .filter((label) => label === 'Offres' || label === 'Problématiques')
    expect(labels.slice(0, 2)).toEqual(['Offres', 'Problématiques'])
  })

  it('leaves a page that supplies its own items untouched', () => {
    const { container } = render(
      <TopNav items={[{ label: 'Prix', href: '#prix' }]} bookingUrl="https://x/y" ctaLabel="Go" />,
    )
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('#prix')
    expect(hrefs).not.toContain(OF1_ROUTE)
  })
})
