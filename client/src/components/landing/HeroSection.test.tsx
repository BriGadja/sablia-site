import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { of1 } from '@/content/of1'
import { site } from '@/lib/site'
import HeroSection from './HeroSection'

/**
 * US-9, the first screen of 2026-09-28 (grill decision 2): the offer's title, the real photo of
 * Brice with the CRM contact record over it (option A, Brice 2026-09-29; the card's own words,
 * motion and contrast are pinned in RecordCard.test.tsx), and one booking button.
 */
describe('HeroSection', () => {
  it("titles the home with the offer's own words", () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(`${of1.title}.`)
  })

  it('renders the prepared photo, eager and high priority, with its intrinsic size', () => {
    const { container } = render(<HeroSection />)
    const img = container.querySelector('img[srcset*="accueil-meetup-ecran-1200.webp"]')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('loading')).toBe('eager')
    // Lowercase on purpose: react-dom 18.3.1 has no `fetchPriority` mapping (plan, design unit).
    expect(img?.getAttribute('fetchpriority')).toBe('high')
    expect(Number(img?.getAttribute('width'))).toBeGreaterThan(0)
    expect(Number(img?.getAttribute('height'))).toBeGreaterThan(0)
  })

  it('lays the contact record over the photo, its four rows typed in (option A, 2026-09-29)', () => {
    const { container } = render(<HeroSection />)
    const card = container.querySelector('figure > .record-card')
    expect(card?.previousElementSibling?.tagName).toBe('IMG')
    expect(card?.classList.contains('absolute')).toBe(true)
    expect(card?.getAttribute('aria-hidden')).toBe('true')
    expect(card?.querySelectorAll('.record-row .record-value')).toHaveLength(4)
    expect(container.querySelectorAll('.record-bar')).toHaveLength(0)
  })

  it('books 30 minutes on the site Calendly', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<HeroSection />)
    fireEvent.click(screen.getByRole('button', { name: /Réserver 30 min/ }))
    expect(openSpy.mock.calls[0][0]).toBe(site.bookingUrl)
    openSpy.mockRestore()
  })
})
