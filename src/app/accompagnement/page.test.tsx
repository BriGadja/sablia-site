import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { openBookingUrl } from '@/lib/booking'
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
/** Tags out, every space (no-break spaces of « 2 h » / « 48 h » included) folded to one plain space. */
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/[\s\u00a0]+/g, ' ')

/** US-94 oracle: the 01b § 4 strings, typed here so the test never reads them back from content.ts. */
const COPY_01B = [
  'Après la formation',
  'Après les trois jours.',
  'Deux façons de continuer : un référent IA qui suit votre équipe chaque mois, ou des outils construits pour elle.',
  'Réserver 30 min',
  'Référent IA',
  'Un appui chaque mois.',
  'Une séance de 2 h par mois avec votre équipe, et vos questions sous 48 h.',
  'Trois mois au moins, puis résiliable chaque mois. Le prix est dans le devis.',
  'Sur mesure',
  'Claude branché sur vos outils.',
  "L'intégration de Claude dans votre CRM, et des automatisations pour les tâches qui reviennent.",
  "Le compte rendu d'appel dans votre CRM",
  'HubSpot',
  'Pipedrive',
  'Zoho',
  'Salesforce',
  'Google Sheets',
  'Excel',
  'Voir les réalisations',
  'Trente minutes pour préparer la suite.',
  'On regarde votre semaine ensemble, je vous dis ce que Claude peut prendre.',
]

const CRM = '/offres/compte-rendu-appel'
const VARIANTS = ['hubspot', 'pipedrive', 'zoho', 'salesforce', 'google-sheets', 'excel-365']

describe('/accompagnement = « Après la formation » (US-94, server HTML)', () => {
  const html = decode(renderToString(<Page />))
  const text = textOf(html)

  it('carries the four section ids in order', () => {
    const ids = ['top', 'referent', 'surmesure', 'fin']
    const at = ids.map((id) => html.indexOf(`id="${id}"`))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('has one h1, « Après les trois jours. »', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>Après les trois jours\.<\/h1>/)
  })

  it('renders every 01b string of the page in the static HTML', () => {
    for (const s of COPY_01B) expect(text, s).toContain(s)
  })

  it('links the CRM offer, its six variants and the realisations', () => {
    expect(html).toContain(`href="${CRM}"`)
    for (const v of VARIANTS) expect(html, v).toContain(`href="${CRM}/${v}"`)
    expect(html).toContain('href="/realisations"')
    expect(html).toMatch(/aria-label="Le compte rendu d'appel, selon votre CRM"/)
  })

  it('shows the conversation photo of 09/10 with its alt text, loaded first', () => {
    const img = html.match(/<img[^>]*formation-05-[^>]*>/)?.[0] ?? ''
    expect(img).toContain('alt="Brice Gachadoat échange avec deux participants pendant la pause."')
    expect(img).toMatch(/srcSet="[^"]*formation-05-540\.webp 540w/)
    expect(img).toMatch(/width="\d+"/)
    expect(img).toMatch(/height="\d+"/)
    expect(img).not.toContain('loading="lazy"')
  })

  it('shows no price, no em dash, no banned word, nothing of the old page', () => {
    expect(text).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
    expect(text).not.toMatch(/\b600\b/)
    expect(text).not.toContain('—')
    for (const w of ['IAPreneurs', 'Noésia', 'CPF', 'finançable', 'certifié', 'Qualiopi'])
      expect(text, w).not.toContain(w)
    for (const old of ['Pour votre équipe', 'Vous vous reconnaissez', 'Vous repartez avec.'])
      expect(text, old).not.toContain(old)
    expect(html).not.toContain('id="parcours"')
  })

  it('sets the 01b title and description, canonical unchanged', () => {
    expect(metadata.title).toEqual({
      absolute: 'Après la formation : référent IA et sur-mesure · Sablia',
    })
    expect(metadata.description).toBe(
      'Après les trois jours, un référent IA pour votre équipe (une séance de 2 h par mois, vos questions sous 48 h), ou Claude intégré sur mesure dans votre CRM et vos outils.',
    )
    expect(metadata.alternates?.canonical).toBe('/accompagnement')
  })
})

describe('/accompagnement booking', () => {
  it('both « Réserver 30 min » buttons (hero, closing band) open the formation Calendly', () => {
    render(<Page />)
    const buttons = screen.getAllByRole('button', { name: /Réserver 30 min/ })
    expect(buttons).toHaveLength(2)
    for (const b of buttons) fireEvent.click(b)
    expect(openBookingUrl).toHaveBeenCalledTimes(2)
    for (const call of vi.mocked(openBookingUrl).mock.calls)
      expect(call[0]).toBe(site.formationBookingUrl)
  })

  it('the CRM lead link goes to the offer page', () => {
    render(<Page />)
    const lead = screen.getByRole('link', { name: /Le compte rendu d'appel dans votre CRM/ })
    expect(lead.getAttribute('href')).toBe(CRM)
  })
})
