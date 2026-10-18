import { afterEach, describe, expect, it, vi } from 'vitest'
import { track } from './analytics'

type WithUmami = Window & { umami?: { track: (name: string, data?: object) => void } }

describe('track', () => {
  afterEach(() => {
    delete (window as WithUmami).umami
  })

  it('does nothing and does not throw when the tracker is absent or blocked', () => {
    expect(() => track('cta_book', { zone: 'nav' })).not.toThrow()
  })

  it('forwards the event name and its data to Umami', () => {
    const spy = vi.fn()
    ;(window as WithUmami).umami = { track: spy }
    track('cta_book', { zone: 'nav' })
    expect(spy).toHaveBeenCalledWith('cta_book', { zone: 'nav' })
  })

  it('swallows a tracker that throws: a measurement bug never breaks a click', () => {
    ;(window as WithUmami).umami = {
      track: () => {
        throw new Error('boom')
      },
    }
    expect(() => track('cta_book')).not.toThrow()
  })
})
