import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Router } from 'wouter'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the footer with company name', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    )

    const sabliaElements = screen.getAllByText(/Sablia/i)
    expect(sabliaElements.length).toBeGreaterThan(0)
  })

  it('displays copyright with current year', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    )

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${currentYear}.*Sablia`, 'i'))).toBeDefined()
  })

  it('has email contact link', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    )

    const emailLink = screen.getByText(/brice@sablia.io/i)
    expect(emailLink).toBeDefined()
    expect(emailLink.closest('a')?.getAttribute('href')).toBe('mailto:brice@sablia.io')
  })

  it('has legal links', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    )

    expect(screen.getByText(/Mentions légales/i)).toBeDefined()
    expect(screen.getByText(/Politique de confidentialité/i)).toBeDefined()
    expect(screen.getByText(/CGV/i)).toBeDefined()
  })

  it('has resource links', () => {
    render(
      <Router>
        <Footer />
      </Router>,
    )

    expect(screen.getByText(/FAQ/)).toBeDefined()
    expect(screen.getByText(/Cas clients/)).toBeDefined()
    expect(screen.getByText(/Calculateur ROI/)).toBeDefined()
  })
})
