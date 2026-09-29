import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FORMATION_QUOTES } from '@/content/home'
import FormationsSection from './FormationsSection'

/** The quotes are rendered with non-breaking spaces before « : » and inside the guillemets. */
const plain = (text: string | null): string => (text ?? '').replace(/[  ]/g, ' ')

/**
 * US-1, the two training quotes Brice supplied on 2026-09-29 (dossier rows P-16, P-17): rendered
 * in full, credited by first name and role, each clamped behind an accessible « Lire la suite ».
 */
describe('FormationsSection: the training quotes', () => {
  it('renders both quotes word for word, with their credits', () => {
    const { container } = render(<FormationsSection />)
    const text = plain(container.textContent)
    for (const { quote, who } of FORMATION_QUOTES) {
      expect(text).toContain(quote)
      expect(text).toContain(who)
    }
  })

  it('clamps each quote behind a « Lire la suite » button that reports its state', () => {
    const { container } = render(<FormationsSection />)
    const buttons = screen.getAllByRole('button', { name: /Lire la suite du témoignage de/ })
    expect(buttons).toHaveLength(FORMATION_QUOTES.length)

    for (const button of buttons) {
      const quote = container.querySelector(`#${button.getAttribute('aria-controls')}`)
      expect(quote?.tagName).toBe('BLOCKQUOTE')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(quote?.className).toContain('line-clamp-3')

      fireEvent.click(button)
      expect(button.getAttribute('aria-expanded')).toBe('true')
      expect(quote?.className).not.toContain('line-clamp-3')
      expect(button.textContent).toContain('Réduire')
    }
  })
})
