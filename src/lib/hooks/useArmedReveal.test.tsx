import { act, render } from '@testing-library/react'
import { useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from './test-utils'
import { useArmedReveal } from './useArmedReveal'

function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  const phase = useArmedReveal(ref)
  return <div ref={ref} data-testid="probe" data-reveal={phase} />
}

/** Puts the probe's top `top` px from the viewport top (innerHeight is 768 in happy-dom). */
function placeAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 100,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useArmedReveal', () => {
  it('server HTML is the final state', () => {
    expect(renderToString(<Probe />)).toContain('data-reveal="final"')
  })

  it('arms a section still below the fold, then plays it once it scrolls in', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeAt(2000)
    const { getByTestId } = render(<Probe />)
    const el = getByTestId('probe')
    expect(el.dataset.reveal).toBe('armed')
    act(() => io.trigger(el, true))
    expect(el.dataset.reveal).toBe('in')
  })

  it('never hides a section already on screen (an anchor landing on it)', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    placeAt(40)
    const { getByTestId } = render(<Probe />)
    expect(getByTestId('probe').dataset.reveal).toBe('final')
  })

  it('stays final under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    placeAt(2000)
    const { getByTestId } = render(<Probe />)
    expect(getByTestId('probe').dataset.reveal).toBe('final')
  })
})
