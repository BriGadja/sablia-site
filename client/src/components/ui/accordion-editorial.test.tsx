import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AccordionEditorial, type AccordionEditorialItem } from './accordion-editorial'

const items: AccordionEditorialItem[] = [
  { id: 'a', question: 'Question A', answer: <p>Answer A</p> },
  { id: 'b', question: 'Question B', answer: <p>Answer B</p> },
  { id: 'c', question: 'Question C', answer: <p>Answer C</p> },
]

describe('AccordionEditorial', () => {
  it('opens the first item by default', () => {
    render(<AccordionEditorial items={items} />)
    const firstBtn = screen.getByRole('button', { name: /Question A/i })
    expect(firstBtn.getAttribute('aria-expanded')).toBe('true')
  })

  it('respects defaultOpenId=null to start closed', () => {
    render(<AccordionEditorial items={items} defaultOpenId={null} />)
    for (const it of items) {
      const btn = screen.getByRole('button', { name: new RegExp(it.question, 'i') })
      expect(btn.getAttribute('aria-expanded')).toBe('false')
    }
  })

  it('only keeps one item open at a time (open-one-at-a-time)', () => {
    render(<AccordionEditorial items={items} defaultOpenId={null} />)
    const btnB = screen.getByRole('button', { name: /Question B/i })
    fireEvent.click(btnB)
    expect(btnB.getAttribute('aria-expanded')).toBe('true')

    const btnC = screen.getByRole('button', { name: /Question C/i })
    fireEvent.click(btnC)
    expect(btnC.getAttribute('aria-expanded')).toBe('true')
    expect(btnB.getAttribute('aria-expanded')).toBe('false')
  })

  it('clicking the open item closes it', () => {
    render(<AccordionEditorial items={items} />)
    const btnA = screen.getByRole('button', { name: /Question A/i })
    expect(btnA.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(btnA)
    expect(btnA.getAttribute('aria-expanded')).toBe('false')
  })

  it('renders folio markers Q·01, Q·02, Q·03', () => {
    render(<AccordionEditorial items={items} />)
    expect(screen.getByText('Q·01')).toBeDefined()
    expect(screen.getByText('Q·02')).toBeDefined()
    expect(screen.getByText('Q·03')).toBeDefined()
  })
})
