import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button, ButtonLink } from './button'

describe('Button', () => {
  it('renders with tuile variant classes', () => {
    render(<Button variant="tuile">Book</Button>)
    const btn = screen.getByRole('button', { name: 'Book' })
    expect(btn.className).toMatch(/var\(--color-tuile\)/)
  })

  it('renders with ghost variant classes using encre/tuile tokens', () => {
    render(<Button variant="ghost">More</Button>)
    const btn = screen.getByRole('button', { name: 'More' })
    expect(btn.className).toMatch(/var\(--color-encre\)/)
    expect(btn.className).toMatch(/var\(--color-tuile\)/)
  })

  it('fires onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('ButtonLink', () => {
  it('renders an anchor with href', () => {
    render(
      <ButtonLink href="https://example.com" variant="primary">
        Link
      </ButtonLink>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('https://example.com')
  })

  it('applies tuile variant classes', () => {
    render(
      <ButtonLink href="#x" variant="tuile">
        Link
      </ButtonLink>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link.className).toMatch(/var\(--color-tuile\)/)
  })

  it('applies primary variant classes', () => {
    render(
      <ButtonLink href="#x" variant="primary">
        Link
      </ButtonLink>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link.className).toMatch(/var\(--color-encre\)/)
  })
})
