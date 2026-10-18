import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OPEN_EVENT } from '@/lib/consent'
import FooterSection from './FooterSection'

/** US-66: withdrawing a consent is as easy as giving it — a permanent footer link reopens the banner. */
describe('FooterSection: « Gérer mes choix »', () => {
  it('is a button next to the legal links, and asks the banner to open', () => {
    render(<FooterSection />)
    const button = screen.getByRole('button', { name: 'Gérer mes choix' })
    expect(button.getAttribute('type')).toBe('button')
    const open = vi.fn()
    window.addEventListener(OPEN_EVENT, open)
    fireEvent.click(button)
    window.removeEventListener(OPEN_EVENT, open)
    expect(open).toHaveBeenCalledTimes(1)
  })

  it('keeps the three legal links', () => {
    render(<FooterSection />)
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining(['/mentions-legales', '/politique-confidentialite', '/cgv']),
    )
  })
})
