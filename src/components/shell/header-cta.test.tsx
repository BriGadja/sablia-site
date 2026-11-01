import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WebinairePage from '@/app/webinaire/page'
import { PAGE_ROUTES } from '../../../scripts/seo/routes.mjs'
import { headerCtaFor } from './header-cta'
import { SiteHeader } from './SiteHeader'

/**
 * Plan webinaire-bureaux-etudes-2026-11-01, unit U3b: ONE call to action on the webinar pages. The
 * header's « Réserver 30 min » opens the CRM Calendly (`site.bookingUrl`, CRM event type and CRM mail
 * sequences, amendment A1); on `/webinaire` it becomes « Je m'inscris » to the form, on the three
 * after-pages it is hidden. Every other route follows the 2026-11-01 contract (plan site-formation-lot1, US-92): the clock decides.
 */
let pathname: string | null = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

beforeEach(() => {
  pathname = '/'
  vi.useRealTimers()
})

const paths = PAGE_ROUTES.map((r) => r.path)
const isWebinar = (p: string) => p === '/webinaire' || p.startsWith('/webinaire/')
// Plan site-formation-lot1 (US-92): the header depends on the clock; every case passes `now`.
const BEFORE = new Date('2026-11-05T10:00:00+01:00')
const AFTER = new Date('2026-11-19T12:00:00+01:00')
const NEXT_WEBINAR = { kind: 'link', href: '/webinaire', label: 'Prochain webinaire' }

describe('headerCtaFor: the route map', () => {
  it('while the session is upcoming: « Prochain webinaire » on every route outside /webinaire and /offres', () => {
    const others = paths.filter((p) => !isWebinar(p) && !p.startsWith('/offres'))
    expect(others.length).toBeGreaterThan(8)
    for (const p of others) expect([p, headerCtaFor(p, BEFORE)]).toEqual([p, NEXT_WEBINAR])
  })

  it('while the session is upcoming: /offres/** keeps the CRM booking button', () => {
    const offres = paths.filter((p) => p.startsWith('/offres'))
    expect(offres.length).toBeGreaterThan(2)
    for (const p of offres) expect([p, headerCtaFor(p, BEFORE)]).toEqual([p, { kind: 'book' }])
  })

  it('from the session start: the formation booking button outside /webinaire and /offres, CRM on /offres/**', () => {
    for (const p of paths.filter((p) => !isWebinar(p) && !p.startsWith('/offres')))
      expect([p, headerCtaFor(p, AFTER)]).toEqual([p, { kind: 'book-formation' }])
    for (const p of paths.filter((p) => p.startsWith('/offres')))
      expect([p, headerCtaFor(p, AFTER)]).toEqual([p, { kind: 'book' }])
  })

  it('points /webinaire (with or without a trailing slash) to its form', () => {
    for (const p of ['/webinaire', '/webinaire/']) {
      expect(headerCtaFor(p)).toEqual({ kind: 'link', href: '#inscription', label: "Je m'inscris" })
    }
  })

  it('hides it on the three after-pages, and the manifest has no other webinar route', () => {
    const after = paths.filter((p) => isWebinar(p) && p !== '/webinaire').sort()
    expect(after).toEqual([
      '/webinaire/apres-reservation',
      '/webinaire/merci',
      '/webinaire/questionnaire',
    ])
    for (const p of after) expect([p, headerCtaFor(p)]).toEqual([p, { kind: 'none' }])
  })

  it('treats an unknown pathname like any page outside /webinaire and /offres', () => {
    expect(headerCtaFor(null, BEFORE)).toEqual(NEXT_WEBINAR)
    expect(headerCtaFor('/webinaires', BEFORE)).toEqual(NEXT_WEBINAR)
    expect(headerCtaFor(null, AFTER)).toEqual({ kind: 'book-formation' })
    expect(headerCtaFor('/webinaires', AFTER)).toEqual({ kind: 'book-formation' })
  })

  it('targets an anchor that exists on /webinaire', () => {
    expect(renderToString(<WebinairePage />)).toContain('id="inscription"')
  })
})

describe('SiteHeader on the webinar routes', () => {
  const nav = () => screen.getByRole('navigation', { name: 'Navigation principale' })

  it("/webinaire: « Je m'inscris » to #inscription, no booking button", () => {
    pathname = '/webinaire'
    render(<SiteHeader />)
    expect(nav().querySelector('[data-cta-book]')).toBeNull()
    const link = screen.getByRole('link', { name: "Je m'inscris" })
    expect(link.getAttribute('href')).toBe('#inscription')
    expect(link.className).toBe('v2-cta is-dark is-md')
  })

  it.each([
    '/webinaire/merci',
    '/webinaire/apres-reservation',
    '/webinaire/questionnaire',
  ])('%s: no call to action in the header', (p) => {
    pathname = p
    render(<SiteHeader />)
    expect(nav().querySelector('.v2-cta')).toBeNull()
    expect(nav().querySelectorAll('a')).toHaveLength(5)
  })

  it('/ before the session: « Prochain webinaire » to /webinaire, no booking button', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(BEFORE)
    render(<SiteHeader />)
    expect(nav().querySelector('[data-cta-book]')).toBeNull()
    expect(screen.getByRole('link', { name: 'Prochain webinaire' }).getAttribute('href')).toBe(
      '/webinaire',
    )
  })

  it('/ from the session start: « Réserver 30 min »', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(AFTER)
    render(<SiteHeader />)
    expect(nav().querySelector('button[data-cta-book]')?.textContent).toBe('Réserver 30 min')
    expect(screen.queryByRole('link', { name: 'Prochain webinaire' })).toBeNull()
  })

  it('/offres/compte-rendu-appel keeps « Réserver 30 min » (CRM) even before the session', () => {
    pathname = '/offres/compte-rendu-appel'
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(BEFORE)
    render(<SiteHeader />)
    expect(nav().querySelector('button[data-cta-book]')?.textContent).toBe('Réserver 30 min')
  })
})
