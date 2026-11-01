import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FinBand } from '@/components/shell/FinBand'
import { SESSION } from '@/content/webinaire'
import { openBookingUrl } from '@/lib/booking'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { site } from '@/lib/site'
import { FAQS, FIN_BAND } from './content'
import { Faq } from './index'

vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const PRICE = /\d[\d\s\u00a0.,]*\s?(€|euros?)/i
const byQ = (q: string) => {
  const f = FAQS.find((x) => x.q === q)
  if (!f) throw new Error(`missing question: ${q}`)
  return f
}

// Plan site-formation-lot1, U9 (US-98): the training FAQ of 01b replaces the nine CRM questions.
describe('content', () => {
  it('holds the nine training questions in the 01b order', () => {
    expect(FAQS.map((f) => f.q)).toEqual([
      'Combien ça coûte ?',
      'Mon équipe utilise déjà Copilot ou ChatGPT.',
      'Où se passe la formation ?',
      'Combien de personnes ?',
      'Que faut-il préparer ?',
      'Nos dossiers sont confidentiels.',
      'Et après les trois jours ?',
      'Qui anime ?',
      "Mon équipe n'a jamais utilisé l'IA.",
    ])
  })

  it('« Combien ça coûte ? » sends the price to the quote after the 30-minute call, with no amount', () => {
    const { a } = byQ('Combien ça coûte ?')
    expect(a).toContain('dépend de votre équipe et du format')
    expect(a).toContain("dans le devis, après l'échange de 30 minutes")
    expect(a).not.toMatch(PRICE)
  })

  it('the Copilot / ChatGPT answer says Claude today and the call, never another training', () => {
    const { a } = byQ('Mon équipe utilise déjà Copilot ou ChatGPT.')
    expect(a).toContain("La formation se fait aujourd'hui sur Claude.")
    expect(a).toContain("dites-le pendant l'échange")
    expect(a).not.toMatch(/(form\w*)[^.]*\b(Copilot|ChatGPT)\b/i)
  })

  it('the confidentiality answer keeps the verified Anthropic default, nothing more', () => {
    const { a } = byQ('Nos dossiers sont confidentiels.')
    expect(a).toContain(
      'Sur les offres de Claude pour les entreprises, Anthropic ne se sert pas par défaut de vos échanges pour entraîner ses modèles.',
    )
    expect(a).not.toMatch(/conforme RGPD|sous-traitant|zéro rétention/i)
  })

  it('no amount in euros, no em dash, no banned wording anywhere in the FAQ', () => {
    const all = FAQS.map((f) => `${f.q} ${f.a}`).join(' ')
    expect(all).not.toMatch(PRICE)
    expect(all).not.toMatch(/—|IAPreneurs|CPF|finançable|certifié|Qualiopi/i)
  })

  it('no longer reads the CRM offer module', () => {
    const src = readFileSync(join(__dirname, 'content.ts'), 'utf8')
    expect(src).not.toMatch(/of1|eurHt/)
  })

  it('gives the home closing band the training copy, the webinar link and the formation Calendly', () => {
    expect(FIN_BAND).toEqual({
      title: 'Trente minutes pour parler de votre équipe.',
      text: 'Vous nous parlez de vos dossiers, nous vous envoyons un programme et son devis.',
      link: {
        href: '/webinaire',
        label: 'Pas encore prêt ? Le webinaire gratuit du jeudi 19 novembre.',
      },
      bookingUrl: site.formationBookingUrl,
    })
    // The link names the session date: a new SESSION must update this label too.
    const day = SESSION.date.replace(/\s+\d{4}$/, '').toLowerCase()
    expect(FIN_BAND.link.label).toContain(day)
    expect(`${FIN_BAND.title} ${FIN_BAND.text}`).not.toMatch(PRICE)
  })

  it('the home FinBand built from FIN_BAND books on the formation Calendly', () => {
    const { container } = render(<FinBand {...FIN_BAND} />)
    fireEvent.click(container.querySelector('button[data-cta-book]') as HTMLButtonElement)
    expect(openBookingUrl).toHaveBeenCalledWith(site.formationBookingUrl)
    expect(container.querySelector('a[href="/webinaire"]')?.textContent).toBe(FIN_BAND.link.label)
  })
})

describe('Faq', () => {
  it('server-renders every answer, nine buttons and the live stack', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const section = container.querySelector('section#faq.v2-faq')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      "Ce qu'on nous demande avant d'appeler.",
    )
    expect(section?.querySelectorAll('button.qbtn').length).toBe(9)
    for (const f of FAQS) expect(section?.textContent).toContain(f.a)
    expect(section?.querySelector('[aria-live="polite"]')).not.toBeNull()
  })

  it('stages question 1 first, the others stay out of view', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const shown = container.querySelectorAll('.fq-pair:not([hidden])')
    expect(shown.length).toBe(1)
    expect(shown[0].textContent).toContain(FAQS[0].a)
    expect(container.querySelector('button.qbtn[aria-pressed="true"]')?.textContent).toBe(FAQS[0].q)
  })

  it('keeps the last three asked questions and moves the pressed state', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const btn = (i: number) => container.querySelectorAll('button.qbtn')[i] as HTMLElement
    for (const i of [1, 2, 3]) fireEvent.click(btn(i))
    const shown = [...container.querySelectorAll('.fq-pair:not([hidden])')]
    expect(shown.length).toBe(3)
    expect(shown.map((s) => s.querySelector('.fq-q')?.textContent)).toEqual([
      FAQS[1].q,
      FAQS[2].q,
      FAQS[3].q,
    ])
    expect(container.querySelectorAll('button.qbtn[aria-pressed="true"]').length).toBe(1)
    expect(btn(3).getAttribute('aria-pressed')).toBe('true')
  })

  it('types dots then answers after a click, and shows no dots under reduced motion', () => {
    mockReducedMotion(false)
    const a = render(<Faq />)
    fireEvent.click(a.container.querySelectorAll('button.qbtn')[1])
    expect(a.container.querySelector('.fq-dots')).not.toBeNull()
    a.unmount()

    mockReducedMotion(true)
    const b = render(<Faq />)
    fireEvent.click(b.container.querySelectorAll('button.qbtn')[1])
    expect(b.container.querySelector('.fq-dots')).toBeNull()
    expect(b.container.querySelectorAll('.fq-pair:not([hidden])').length).toBe(2)
  })

  it('replays question 1 once when the section first scrolls into view', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Faq />)
    expect(container.querySelector('.fq-dots')).toBeNull()
    const section = container.querySelector('section#faq') as Element
    await act(async () => io.trigger(section, true))
    expect(container.querySelector('.fq-dots')).not.toBeNull()
  })
})
