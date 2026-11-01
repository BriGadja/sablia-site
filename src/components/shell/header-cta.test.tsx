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
 * after-pages it is hidden. Every other route of the manifest keeps the booking button.
 */
let pathname: string | null = '/'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

beforeEach(() => {
  pathname = '/'
})

const paths = PAGE_ROUTES.map((r) => r.path)
const isWebinar = (p: string) => p === '/webinaire' || p.startsWith('/webinaire/')

describe('headerCtaFor: the route map', () => {
  it('keeps the booking button on every route of the manifest outside /webinaire', () => {
    const others = paths.filter((p) => !isWebinar(p))
    expect(others.length).toBeGreaterThan(10)
    for (const p of others) expect([p, headerCtaFor(p)]).toEqual([p, { kind: 'book' }])
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

  it('falls back to the booking button when the pathname is unknown', () => {
    expect(headerCtaFor(null)).toEqual({ kind: 'book' })
    expect(headerCtaFor('/webinaires')).toEqual({ kind: 'book' })
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

  it('/ still carries « Réserver 30 min »', () => {
    render(<SiteHeader />)
    expect(nav().querySelector('button[data-cta-book]')?.textContent).toBe('Réserver 30 min')
    expect(screen.queryByRole('link', { name: "Je m'inscris" })).toBeNull()
  })
})
