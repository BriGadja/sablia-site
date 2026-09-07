import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { site } from '@/lib/site'
import TopNav from './TopNav'

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
})
