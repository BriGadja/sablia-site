import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FAQ_CARRIED } from '@/content/faq-carried'
import { of1 } from '@/content/of1'
import OffreFaq from './OffreFaq'

/**
 * US-13: the five questions that lived on the home until 2026-09-28 now follow the five OF-1
 * questions on the offer page (grill decision 4), appended AFTER `of1.faq` so the parity anchors
 * of `of1.parity.test.ts` keep their indices.
 */
describe('OffreFaq', () => {
  it('lists the OF-1 questions, then the five carried from the home', () => {
    const { container } = render(<OffreFaq />)
    const questions = Array.from(container.querySelectorAll('button[aria-expanded]')).map((b) =>
      (b.textContent ?? '').trim(),
    )
    expect(questions).toHaveLength(of1.faq.length + FAQ_CARRIED.length)
    expect(questions).toHaveLength(10)
    expect(questions[5]).toBe('Devrons-nous changer de CRM ?')
    expect(questions.slice(of1.faq.length)).toEqual(FAQ_CARRIED.map((item) => item.q))
  })

  it('opens a carried question onto its answer, figures read from the module', () => {
    render(<OffreFaq />)
    const button = screen.getByRole('button', { name: 'Devrons-nous changer de CRM ?' })
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '')
    expect(panel?.textContent).toBe(
      `Non. Nous nous adaptons à votre outil (${of1.crms.join(', ')}). Vous conservez votre stack.`,
    )
  })
})
