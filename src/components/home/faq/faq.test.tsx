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
  // US-104, adversarial review K6 (pos-3): on the home, which opens on the monthly offer, the two
  // questions whose answers hold for the training alone name the training (`/formations` keeps its own).
  it('holds the nine questions in the 01b order, the two training-only ones naming the training', () => {
    expect(FAQS.map((f) => f.q)).toEqual([
      'Combien ça coûte ?',
      'Mon équipe utilise déjà Copilot ou ChatGPT.',
      'Où se passe la formation ?',
      'Combien de personnes par formation ?',
      'Que faut-il préparer pour la formation ?',
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

  // US-104 (copy deck B2 `home.faq.prix.a`): the monthly offer's price is public, on its own page.
  it('« Combien ça coûte ? » says the monthly offer shows its price on its page, still with no amount', () => {
    expect(byQ('Combien ça coûte ?').a).toBe(
      "Pour le responsable IA externalisé, le prix est affiché sur sa page. Pour une formation ou une conférence, le prix dépend de votre équipe et du format retenu. Il arrive dans le devis, après l'échange de 30 minutes. Le webinaire et l'échange sont gratuits.",
    )
  })

  // US-104, adversarial review K6 (tel-6): « sa page » is a link, on the answer's own words.
  it('« Combien ça coûte ? » links the words « responsable IA externalisé » to the offer page', () => {
    const f = byQ('Combien ça coûte ?')
    expect(f.link).toEqual({
      text: 'responsable IA externalisé',
      href: '/responsable-ia-externalise',
    })
    expect(f.a).toContain(`Pour le ${f.link?.text}, le prix est affiché sur sa page.`)
    for (const other of FAQS.filter((x) => x !== f)) expect(other.link, other.q).toBeUndefined()
  })

  // US-104 (copy deck B2 `home.faq.apres.a`): after the three days, the monthly offer, never the
  // retired « référent IA » nor its hours.
  it('« Et après les trois jours ? » points to the monthly offer, without the référent', () => {
    const { a } = byQ('Et après les trois jours ?')
    expect(a).toBe(
      "Trente jours de questions par mail sont inclus, avec une réponse sous 48 h. Ensuite, si vous voulez que quelqu'un construise et entretienne vos outils chaque mois, c'est le rôle du responsable IA externalisé.",
    )
    expect(a).not.toMatch(/référent|2 h par mois|temps partagé/i)
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

  // US-104 (copy deck B2 `home.fin.*`): the closing text holds for the monthly offer, a training or a
  // talk alike (« un programme et son devis » was true of the training only).
  it('gives the home closing band the deck copy, the webinar link and the formation Calendly', () => {
    expect(FIN_BAND).toEqual({
      title: 'Trente minutes pour parler de votre équipe.',
      text: 'Vous me parlez de vos dossiers et de ce que vous avez déjà essayé, je vous dis par où commencer.',
      link: {
        href: '/webinaire',
        label: 'Pas encore prêt ? Le webinaire gratuit du jeudi 3 décembre.',
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
  // US-104: the band now follows a sand band (the webinar band, then `#derriere` from the session
  // start), no longer the night `#videos`: it opens on its own dune, front = its rose ground.
  it('opens on its own dune, front = its rose ground', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const dune = container.querySelector('#faq > svg.v2-dune')
    expect(dune?.querySelector('.d-back')?.getAttribute('fill')).toBe('#C68A8E')
    expect(dune?.querySelector('.d-front')?.getAttribute('fill')).toBe('#F2E3DF')
  })

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

  // tel-6: the link sits inside the first answer, in the server HTML, its text unchanged.
  it('renders the price answer with its words linked to /responsable-ia-externalise', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const answer = container.querySelector('.fq-pair:not([hidden]) .fq-a')
    expect(answer?.textContent).toBe(FAQS[0].a)
    const link = answer?.querySelector('a.fq-link')
    expect(link?.getAttribute('href')).toBe('/responsable-ia-externalise')
    expect(link?.textContent).toBe('responsable IA externalisé')
    expect(container.querySelectorAll('.fq-a a')).toHaveLength(1)
    // inline in the sentence's own run (score.py and WCAG 2.5.8 read a link in a text run as inline,
    // 24 px; directly in the bubble's block it would need 44 px)
    expect(link?.parentElement?.tagName).toBe('SPAN')
    expect(link?.parentElement?.textContent).toBe(FAQS[0].a)
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
