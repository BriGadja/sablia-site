import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearConsent } from '@/lib/consent'
import { startEventTracking } from '@/lib/events'
import { BookingButton } from './BookingButton'

type TestWindow = Window & { umami?: { track: (n: string, d?: object) => void } }
const w = window as unknown as TestWindow

let track: ReturnType<typeof vi.fn>
let stop: () => void
let open: ReturnType<typeof vi.fn>

beforeEach(() => {
  window.localStorage.clear()
  clearConsent()
  track = vi.fn()
  w.umami = { track }
  open = vi.fn()
  vi.stubGlobal('open', open)
  stop = startEventTracking()
})
afterEach(() => {
  stop()
  vi.unstubAllGlobals()
  delete w.umami
})

describe('BookingButton', () => {
  it('carries data-cta-book and the default label', () => {
    render(<BookingButton />)
    const button = screen.getByRole('button', { name: 'Réserver 30 min' })
    expect(button.hasAttribute('data-cta-book')).toBe(true)
  })

  it('opens the Calendly popup and reports cta_book exactly once, with the nav zone', () => {
    render(
      <nav>
        <BookingButton />
      </nav>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Réserver 30 min' }))
    expect(open).toHaveBeenCalledTimes(1)
    expect(open.mock.calls[0][0]).toBe('https://calendly.com/brice-gachadoat/30min')
    const booked = track.mock.calls.filter((c) => c[0] === 'cta_book')
    expect(booked).toEqual([['cta_book', { zone: 'nav', label: 'Réserver 30 min' }]])
  })

  it('does not swallow the next booking click', async () => {
    render(<BookingButton />)
    const button = screen.getByRole('button', { name: 'Réserver 30 min' })
    fireEvent.click(button)
    await new Promise((resolve) => setTimeout(resolve, 5))
    fireEvent.click(button)
    expect(track.mock.calls.filter((c) => c[0] === 'cta_book')).toHaveLength(2)
  })
})
