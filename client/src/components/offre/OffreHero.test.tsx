import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OF1_BOOKING_URL, of1 } from '@/content/of1'
import OffreHero from './OffreHero'

/** Prices are rendered with non-breaking spaces so they never wrap mid-number. */
const plain = (text: string | null): string => (text ?? '').replace(/[\u00A0\u202F\u2009]/g, ' ')

describe('OffreHero', () => {
  it("titles the page with the offer's own words", () => {
    render(<OffreHero />)
    expect(plain(screen.getByRole('heading', { level: 1 }).textContent)).toBe(of1.title)
  })

  it('shows the three price facts as pills', () => {
    const { container } = render(<OffreHero />)
    const pills = Array.from(container.querySelectorAll('li')).map((li) => plain(li.textContent))
    const joined = pills.join(' | ')
    expect(joined).toContain('1 490 € HT')
    expect(joined).toContain('149 €/mois')
    expect(joined).toContain('premier mois offert')
    expect(joined).toContain('7 jours')
  })

  it("opens Brice's Calendly from the primary CTA", () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<OffreHero />)
    fireEvent.click(screen.getByRole('button', { name: /Réserver 30 minutes avec Brice/ }))
    expect(openSpy.mock.calls[0][0]).toBe(OF1_BOOKING_URL)
    openSpy.mockRestore()
  })
})
