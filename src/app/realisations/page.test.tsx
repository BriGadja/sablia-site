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

/** 01b § 5 « New strings ». */
const NEW = {
  title: 'Réalisations : automatisations, sites et formations · Sablia',
  description:
    'Ce que Sablia a construit depuis 2025 : automatisations, sites, applications et formations, et des agents vocaux sur demande.',
  h1: 'Réalisations',
  intro:
    'Automatisations, sites, applications et formations, construits pour nos clients depuis 2025.',
}

/** 01b § 5 « Moved as is » (the eyebrow excepted: the h1 takes its role). */
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
  'Un cabinet de conseil en ingénierie',
  "Une matinée pour mettre l'IA générative entre les mains de son équipe.",
  'Sur demande',
  'Agents vocaux',
  'Une vingtaine mis en service depuis 2024 : accueil téléphonique, rappels, prise de rendez-vous.',
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

  it('every « Réserver 30 min » opens the formation Calendly', () => {
    mockIntersectionObserver()
    render(<Page />)
    const buttons = screen.getAllByRole('button', { name: /Réserver 30 min/ })
    expect(buttons.length).toBeGreaterThanOrEqual(1)
    for (const b of buttons) fireEvent.click(b)
    expect(openBookingUrl).toHaveBeenCalledTimes(buttons.length)
    for (const call of vi.mocked(openBookingUrl).mock.calls)
      expect(call[0]).toBe(site.formationBookingUrl)
  })
})
