import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Reveal } from './reveal'

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: ObserverCallback
  observed: Element[] = []

  constructor(cb: ObserverCallback) {
    this.callback = cb
    MockIntersectionObserver.instances.push(this)
  }

  observe(el: Element) {
    this.observed.push(el)
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      this.observed.map(
        (target) =>
          ({
            isIntersecting,
            target,
          }) as unknown as IntersectionObserverEntry,
      ),
    )
  }
}

describe('Reveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
    Element.prototype.getBoundingClientRect = () =>
      ({
        top: 900,
        bottom: 1000,
        left: 0,
        right: 0,
        width: 0,
        height: 100,
        x: 0,
        y: 900,
        toJSON: () => ({}),
      }) as DOMRect
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders children inside default div with reveal class', () => {
    render(
      <Reveal>
        <span>hello</span>
      </Reveal>,
    )
    expect(screen.getByText('hello')).toBeDefined()
    const root = screen.getByText('hello').parentElement
    expect(root?.classList.contains('reveal')).toBe(true)
  })

  it('respects the `as` prop to render a different tag', () => {
    render(
      <Reveal as="section" data-testid="sec">
        <p>child</p>
      </Reveal>,
    )
    expect(screen.getByText('child').parentElement?.tagName).toBe('SECTION')
  })

  it('sets --reveal-delay CSS variable from delay prop', () => {
    const { container } = render(
      <Reveal delay={400}>
        <span>a</span>
      </Reveal>,
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('400ms')
  })

  it('adds is-visible class when observer intersects', () => {
    const { container } = render(
      <Reveal>
        <span>x</span>
      </Reveal>,
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.classList.contains('is-visible')).toBe(false)
    MockIntersectionObserver.instances[0]?.trigger(true)
    expect(el.classList.contains('is-visible')).toBe(true)
  })
})
