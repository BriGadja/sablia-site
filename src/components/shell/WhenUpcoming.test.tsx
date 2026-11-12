import { act, render, screen } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSessionUpcoming, WhenUpcoming } from '@/content/session-bar'

/**
 * Plan site-formation-lot1, Data contract « Build-time clock »: the first render is the state at
 * build time (identical in the static HTML and in the first client render, so no hydration
 * mismatch), then an effect re-evaluates with the visitor's clock.
 */
const BEFORE = '2026-11-05T10:00:00+01:00'
const AFTER = '2026-12-03T12:00:00+01:00'
const at = (iso: string) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

const ui = <WhenUpcoming upcoming={<p>avant</p>} past={<p>après</p>} />

/** Puts server HTML in a fresh container the way the browser receives it (parsed, not built by React). */
function staticHtml(markup: string): HTMLDivElement {
  const container = document.createElement('div')
  const parsed = new DOMParser().parseFromString(`<body>${markup}</body>`, 'text/html')
  container.append(...Array.from(parsed.body.childNodes))
  document.body.appendChild(container)
  return container
}

describe('WhenUpcoming', () => {
  it('server HTML = the build-time state, whatever the clock of the machine that renders', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    at(AFTER)
    expect(renderToString(ui)).toBe('<p>avant</p>')
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', AFTER)
    at(BEFORE)
    expect(renderToString(ui)).toBe('<p>après</p>')
  })

  it('after mount, the visitor clock wins (built before, visited after the start)', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    at(AFTER)
    render(ui)
    expect(screen.getByText('après')).toBeTruthy()
    expect(screen.queryByText('avant')).toBeNull()
  })

  it('without a build stamp (tests, a bare dev run) it uses the clock directly', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', '')
    at(BEFORE)
    expect(renderToString(ui)).toBe('<p>avant</p>')
  })

  it('hydrates the stale static HTML without a mismatch, then switches', async () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    at(BEFORE)
    const container = staticHtml(renderToString(ui))
    expect(container.textContent).toBe('avant')
    at(AFTER)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const recoverable = vi.fn()
    await act(async () => {
      hydrateRoot(container, ui, { onRecoverableError: recoverable })
    })
    expect(recoverable).not.toHaveBeenCalled()
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
    expect(container.textContent).toBe('après')
    container.remove()
  })
})

describe('useSessionUpcoming', () => {
  function Probe() {
    return <span>{useSessionUpcoming() ? 'oui' : 'non'}</span>
  }
  it('is true one second before the start and false at the start (visitor clock)', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    at('2026-12-03T11:59:59+01:00')
    const { unmount } = render(<Probe />)
    expect(screen.getByText('oui')).toBeTruthy()
    unmount()
    at(AFTER)
    render(<Probe />)
    expect(screen.getByText('non')).toBeTruthy()
  })
})

describe('next.config build stamp', () => {
  it('inlines NEXT_PUBLIC_BUILD_AT as an ISO date, overridable from the environment', async () => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', '')
    const fresh = (await import('../../../next.config')).default
    const stamp = fresh.env?.NEXT_PUBLIC_BUILD_AT ?? ''
    expect(stamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    expect(Number.isNaN(Date.parse(stamp))).toBe(false)
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', AFTER)
    const pinned = (await import('../../../next.config')).default
    expect(pinned.env?.NEXT_PUBLIC_BUILD_AT).toBe(AFTER)
  })
})
