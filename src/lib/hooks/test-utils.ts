import { vi } from 'vitest'

type Listener = () => void

/** Controllable `matchMedia('(prefers-reduced-motion: reduce)')` for tests. */
export function mockReducedMotion(initial: boolean) {
  let matches = initial
  const listeners = new Set<Listener>()
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return matches
    },
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
  }))
  return {
    set(value: boolean) {
      matches = value
      for (const l of [...listeners]) l()
    },
    listenerCount: () => listeners.size,
  }
}

/** Fake IntersectionObserver: `trigger(el, isIntersecting)` fires the callback. */
export function mockIntersectionObserver() {
  const observers: FakeIO[] = []
  class FakeIO {
    elements = new Set<Element>()
    disconnected = false
    constructor(
      public cb: (e: Partial<IntersectionObserverEntry>[]) => void,
      public options?: IntersectionObserverInit,
    ) {
      observers.push(this)
    }
    observe(el: Element) {
      this.elements.add(el)
    }
    unobserve(el: Element) {
      this.elements.delete(el)
    }
    disconnect() {
      this.disconnected = true
      this.elements.clear()
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeIO)
  return {
    observers,
    trigger(el: Element, isIntersecting: boolean) {
      for (const o of observers) {
        if (o.elements.has(el)) o.cb([{ target: el, isIntersecting }])
      }
    },
  }
}
