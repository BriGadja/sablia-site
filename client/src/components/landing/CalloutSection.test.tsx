import { fireEvent, render, screen } from '@testing-library/react'
import { track } from '@vercel/analytics'
import { describe, expect, it, vi } from 'vitest'
import { FINAL_CALL_TITLE } from '@/content/home'
import { site } from '@/lib/site'
import CalloutSection from './CalloutSection'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

/** US-11, the final call of the home (grill decisions 3 and 6, 2026-09-28). */
describe('CalloutSection', () => {
  it('titles the final call with the new sentence', () => {
    render(<CalloutSection />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(FINAL_CALL_TITLE)
  })

  it('books 30 minutes on the site Calendly and records the book_call event', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<CalloutSection />)
    fireEvent.click(screen.getByRole('button', { name: /Réserver 30 min/ }))
    expect(openSpy.mock.calls[0][0]).toBe(site.bookingUrl)
    expect(track).toHaveBeenCalledWith('book_call', {
      url: site.bookingUrl,
      path: window.location.pathname,
    })
    openSpy.mockRestore()
  })

  it('keeps the second path for visitors not ready to talk', () => {
    const { container } = render(<CalloutSection />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/guides/integrer-l-ia-dans-votre-entreprise')
    expect(hrefs).toContain('https://app.sablia.io/questionnaire')
  })
})
