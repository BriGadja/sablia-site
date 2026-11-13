import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PATHS, SESSION } from '@/content/webinaire'
import { REMINDER, WebinarReminder } from './WebinarReminder'

/**
 * The light webinar reminder of `/formations` and `/conferences` (US-109, US-107, plan
 * sablia-site-structure-offre F2, copy deck B5 `reminder.*`): one sentence built from `SESSION` (never
 * typed twice), a link to `/webinaire`, nothing from the session start, and never a booking button
 * (the `/formations` test pins exactly two). Every render pins the instant.
 */
const BEFORE = '2026-11-20T10:00:00+01:00'
const LAST_SECOND = '2026-12-03T11:59:59+01:00'
const AFTER = '2026-12-03T12:00:00+01:00'

function clock(iso: string) {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&')
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/[\s\u00a0\u202f]+/g, ' ')
const css = readFileSync(join(__dirname, 'webinar-reminder.css'), 'utf8')

describe('REMINDER copy', () => {
  it('is the deck sentence as rendered today, and the deck link', () => {
    expect(REMINDER.text).toBe(
      "Webinaire gratuit, jeudi 3 décembre de 12 h à 13 h : « Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? »",
    )
    expect(REMINDER.cta).toBe("Je m'inscris")
    expect(REMINDER.href).toBe('/webinaire')
  })

  it('derives the day, the hours and the title from SESSION, without the year', () => {
    const day = SESSION.date.replace(/\s+\d{4}$/, '')
    expect(REMINDER.text).toBe(
      `Webinaire gratuit, ${day.charAt(0).toLowerCase()}${day.slice(1)} ${SESSION.hours} : « ${SESSION.title} »`,
    )
    expect(REMINDER.text).not.toMatch(/\d{4}/)
    expect(REMINDER.href).toBe(PATHS.page)
  })

  it('never reads as the first step of the training (/formations page test)', () => {
    expect(REMINDER.text).not.toMatch(/pour commencer|premier pas/i)
    expect(REMINDER.text).not.toContain('—')
  })
})

describe('WebinarReminder', () => {
  it('static HTML while the session is ahead: the sentence, one link to /webinaire, no booking button', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    clock(BEFORE)
    const html = decode(renderToString(<WebinarReminder />))
    expect(textOf(html)).toContain(REMINDER.text)
    const links = html.match(/<a [^>]*href="[^"]*"/g) ?? []
    expect(links).toEqual([expect.stringContaining('href="/webinaire"')])
    expect(html).toMatch(/<a [^>]*>[\s\S]*?Je m'inscris/)
    expect(html).not.toMatch(/<button|data-cta-book|calendly/i)
    expect(html).toContain('data-zone="rappel"')
    expect(html).not.toMatch(/<h[1-6][\s>]/)
  })

  it('static HTML built from the session start: nothing at all', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', AFTER)
    clock(AFTER)
    expect(renderToString(<WebinarReminder />)).toBe('')
  })

  it('built before, visited one second before the start: shown; visited at the start: gone', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    clock(LAST_SECOND)
    const shown = render(<WebinarReminder />)
    expect(shown.container.querySelector('a[href="/webinaire"]')).not.toBeNull()
    shown.unmount()
    clock(AFTER)
    const gone = render(<WebinarReminder />)
    expect(gone.container.innerHTML).toBe('')
  })

  it('keeps the closing guillemet with the last word of the title', () => {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', BEFORE)
    clock(BEFORE)
    expect(renderToString(<WebinarReminder />)).toContain('règles ?\u00a0»')
  })
})

describe('WebinarReminder CSS contract', () => {
  it('opens with the layer order, one scope, hex colours only, a reduced-motion block', () => {
    expect(css.split('\n')[0]).toBe('@layer theme, base, components, utilities;')
    expect(css).toContain('.v2-reminder {')
    expect(css).not.toMatch(/var\(--color-/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })
})
