/**
 * /realisations (US-95): the home's `#construit` band moved as is under a page h1, with the call to
 * book on the formation Calendly. The 01b § 5 strings are typed here, never read back from the source.
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { openBookingUrl } from '@/lib/booking'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { site } from '@/lib/site'
import Page, { metadata } from './page'

vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

beforeEach(() => {
  vi.mocked(openBookingUrl).mockClear()
})

const decode = (s: string) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/[\s ]+/g, ' ')

/** Copy deck B5 of run 2026-11-12-structure-site-offre: `real.meta.title`, `real.meta.description`, `real.head.intro` (US-108). */
const NEW = {
  title: 'Réalisations : automatisations, sites, formations et conférences · Sablia',
  description:
    'Ce que Sablia a construit depuis 2025 : automatisations, sites, applications, formations et conférences.',
  h1: 'Réalisations',
  intro:
    'Automatisations, sites, applications, formations et conférences, réalisés pour des clients depuis 2025.',
}

/** Copy deck B5 `real.besoin.title`, `real.besoin.text`, `real.besoin.cta` (US-108). */
const BESOIN = {
  title: 'Un besoin précis ? Je construis aussi à la demande.',
  text: 'Un outil seul, sans contrat mensuel : on en parle trente minutes, puis vous recevez un devis écrit.',
  cta: 'Réserver 30 min',
}

/**
 * 01b § 5 « Moved as is » (the eyebrow excepted: the h1 takes its role), corrected after the adversarial
 * review K6 of run 2026-11-12-structure-site-offre: the seminar card's tag is « Séminaire »; the voice
 * card's tag is « Agent vocal » (voice is no longer sold), its uncounted « une vingtaine » left, and its
 * 68 bookings are said as proof line P-8 states them (sector and period, no name).
 */
const MOVED = [
  'Exemples de réalisations.',
  'Plus de 20 clients accompagnés depuis 2025.',
  'Mettre en pause',
  'Automatisation · Site',
  'Hélène, psychopraticienne et conseillère en nutrition',
  'Après chaque séance, le compte rendu et le mail de suivi du jeudi soir. Son site aussi.',
  'Un institut de beauté à Rouen',
  'Son site a quitté Wix pour son propre domaine, hébergé à son nom.',
  'Application',
  'Une plateforme de cashback',
  'Les taux de ses concurrents, relevés chaque jour dans une application.',
  '699 000+ relevés',
  'Une entreprise de maintenance du bâtiment',
  "Les demandes d'intervention reçues par mail deviennent fiches, bons et factures, sans ressaisie.",
  'Formation',
  'École Noésia',
  'Le module Claude Code, 10 heures en 29 vidéos, et un atelier toutes les deux semaines.',
  'noesia.school',
  'Séminaire',
  'Un cabinet de conseil en ingénierie',
  "Une matinée pour mettre l'IA générative entre les mains de son équipe.",
  'Agent vocal',
  'Agents vocaux',
  "Accueil téléphonique, rappels, prise de rendez-vous. Les 68 rendez-vous : un agent sortant, dans l'investissement locatif clé en main, d'avril à août 2026.",
  '68 rendez-vous pris en cinq mois',
]

describe('/realisations (US-95, server HTML)', () => {
  const html = decode(renderToString(<Page />))
  const text = textOf(html)

  it('has exactly one h1, « Réalisations »', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toMatch(new RegExp(`<h1[^>]*>${NEW.h1}</h1>`))
  })

  it('keeps the band whole: its id, its h2 and its seven cards, between the page top and the closing band', () => {
    const ids = ['top', 'construit', 'fin']
    const at = ids.map((id) => html.indexOf(`id="${id}"`))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    expect(html).toMatch(/<h2[^>]*>Exemples de réalisations\.<\/h2>/)
    expect(html.match(/<article[^>]*class="deck-card"/g)).toHaveLength(7)
  })

  it('does not render the moved eyebrow a second time', () => {
    const band = html.slice(html.indexOf('id="construit"'), html.indexOf('id="fin"'))
    expect(band).not.toContain('v2-eyebrow')
    expect(html.match(/>Réalisations</g)).toHaveLength(1)
  })

  it('shows the band sand drawing once, beside the page h1, and keeps the pause in the band', () => {
    const drawings = html.match(/realisations-contour-nuit\.webp/g) ?? []
    expect(drawings).toHaveLength(1)
    const top = html.slice(html.indexOf('id="top"'), html.indexOf('id="construit"'))
    expect(top).toContain('realisations-contour-nuit.webp')
    const band = html.slice(html.indexOf('id="construit"'), html.indexOf('id="fin"'))
    expect(band).toContain('Mettre en pause')
  })

  it('renders the 01b intro and every moved string in the static HTML', () => {
    expect(text).toContain(NEW.intro)
    for (const s of MOVED) expect(text, s).toContain(s)
  })

  it('says in #top, under the intro and above the wall, that a precise need is built on request (US-108)', () => {
    const top = html.slice(html.indexOf('id="top"'), html.indexOf('id="construit"'))
    const h2 = top.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? ''
    expect(textOf(h2).trim()).toBe(BESOIN.title)
    expect(textOf(top)).toContain(BESOIN.text)
    expect(top.indexOf('<h2')).toBeGreaterThan(top.indexOf(NEW.intro))
    expect(top).toContain('data-zone="besoin"')
    const zone = top.slice(top.indexOf('data-zone="besoin"'))
    expect(zone).toMatch(new RegExp(`<button[^>]*data-cta-book[^>]*>${BESOIN.cta}`))
    expect(textOf(zone)).toContain(BESOIN.title)
    expect(textOf(zone)).toContain(BESOIN.text)
  })

  it('carries the filter row and the count in the band, all seven shown (US-108)', () => {
    const band = html.slice(html.indexOf('id="construit"'), html.indexOf('id="fin"'))
    expect(band).toContain('role="group"')
    expect(band).toContain('aria-label="Filtrer les réalisations"')
    expect(textOf(band)).toContain('7 réalisations sur 7')
    expect(band.match(/<article[^>]*class="deck-card"/g)).toHaveLength(7)
    expect(band).not.toMatch(/<article[^>]*\shidden[=\s>]/)
  })

  it('shows no price and no banned word', () => {
    expect(text).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
    for (const w of ['IAPreneurs', 'CPF', 'finançable', 'certifié', 'Qualiopi', '—'])
      expect(text, w).not.toContain(w)
  })

  it('sets the 01b title and description on its own indexable path', () => {
    expect(metadata.title).toEqual({ absolute: NEW.title })
    expect(metadata.description).toBe(NEW.description)
    expect(metadata.alternates?.canonical).toBe('/realisations')
    expect(metadata.robots).toEqual({ index: true, follow: true })
  })
})

describe('/realisations in the browser', () => {
  it('keeps the same animation: seven rows, the pause control', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Page />)
    const band = container.querySelector('section#construit') as HTMLElement
    act(() => io.trigger(band, true))
    expect(band.querySelectorAll('ol[aria-label="Toutes les réalisations"] li')).toHaveLength(7)
    const grow = () => band.querySelector('.grow') as HTMLElement
    expect(grow().style.animationPlayState).toBe('running')
    fireEvent.click(screen.getByRole('button', { name: /Mettre en pause/ }))
    expect(grow().style.animationPlayState).toBe('paused')
    expect(screen.getByRole('button', { name: /Reprendre le défilement/ })).toBeTruthy()
  })

  it('every « Réserver 30 min » opens the formation Calendly: the « besoin » block and the closing band', () => {
    mockIntersectionObserver()
    const { container } = render(<Page />)
    const buttons = screen.getAllByRole('button', { name: /Réserver 30 min/ })
    expect(buttons).toHaveLength(2)
    expect(buttons[0].closest('[data-zone]')?.getAttribute('data-zone')).toBe('besoin')
    expect(buttons[0].closest('section')?.id).toBe('top')
    expect(buttons[1].closest('section')?.id).toBe('fin')
    expect(container.querySelectorAll('[data-zone="besoin"]')).toHaveLength(1)
    for (const b of buttons) fireEvent.click(b)
    expect(openBookingUrl).toHaveBeenCalledTimes(buttons.length)
    for (const call of vi.mocked(openBookingUrl).mock.calls)
      expect(call[0]).toBe(site.formationBookingUrl)
  })
})
