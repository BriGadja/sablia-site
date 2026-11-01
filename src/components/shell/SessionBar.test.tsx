import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BAR } from '@/content/session-bar'
import { SessionBar } from './SessionBar'

/** US-92: the thin webinar bar, above the header, on every page but /webinaire*, while the session is upcoming. */
let pathname: string | null = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))

const BEFORE = '2026-11-05T10:00:00+01:00'
const at = (iso: string) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}
beforeEach(() => {
  pathname = '/'
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

const bar = () => document.querySelector('aside.v2-sbar')

describe('SessionBar', () => {
  it('before the session: a labelled aside, zone « bar », long and short text, one link to /webinaire', () => {
    at(BEFORE)
    render(<SessionBar />)
    const aside = screen.getByRole('complementary', { name: 'Prochain webinaire' })
    expect(aside.getAttribute('data-zone')).toBe('bar')
    expect(aside.textContent).toContain(BAR.label)
    expect(aside.textContent).toContain(BAR.text)
    expect(aside.textContent).toContain(BAR.textShort)
    const links = aside.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe("Je m'inscris")
    expect(links[0].getAttribute('href')).toBe('/webinaire')
  })

  it('its text is in the server HTML (SSR content rule)', () => {
    at(BEFORE)
    const html = renderToString(<SessionBar />)
    expect(html).toContain('data-zone="bar"')
    expect(html).toContain('Webinaire gratuit')
    expect(html).toContain('Jeudi 19 novembre, 12 h')
  })

  it.each([
    '/webinaire',
    '/webinaire/',
    '/webinaire/merci',
    '/webinaire/merci/',
    '/webinaire/apres-reservation',
    '/webinaire/questionnaire',
  ])('renders nothing on %s', (p) => {
    at(BEFORE)
    pathname = p
    render(<SessionBar />)
    expect(bar()).toBeNull()
  })

  it.each(['/', '/formations', '/offres/compte-rendu-appel'])('shows on %s', (p) => {
    at(BEFORE)
    pathname = p
    render(<SessionBar />)
    expect(bar()).not.toBeNull()
  })

  it('renders nothing at the session start and after', () => {
    for (const iso of ['2026-11-19T12:00:00+01:00', '2026-12-15T09:00:00+01:00']) {
      at(iso)
      const { unmount } = render(<SessionBar />)
      expect(bar()).toBeNull()
      unmount()
    }
  })

  it('gives the link its own 44 px box that cancels out in layout (the bar stays 40 px)', () => {
    const css = readFileSync(join(__dirname, 'session-bar.css'), 'utf8')
    expect(css).toMatch(/\.v2-sbar-cta \{[^}]*min-height:\s*44px;[^}]*margin-block:\s*-2px/)
    expect(css).toMatch(/\.v2-sbar-in \{[^}]*min-height:\s*40px/)
  })

  it('one CSS scope, .v2-sbar, charte hex only', () => {
    const css = readFileSync(join(__dirname, 'session-bar.css'), 'utf8')
    expect(css.startsWith('@layer theme, base, components, utilities;')).toBe(true)
    expect(css).toMatch(/@layer components \{\s*\.v2-sbar \{/)
    expect(css).not.toMatch(/var\(--color-/)
  })
})
