/**
 * /conferences (US-107, plan sablia-site-structure-offre F1, copy deck B4 `conf.*` as corrected after
 * its content review): talks and seminars on request, the price in the quote, three topics with their
 * audience and their own format, and the published recommendation signed by a role and a sector only.
 * The deck strings are typed here, never read back from the source. Every render pins the instant:
 * the webinar reminder between `#preuve` and `#fin` exists only while the session is ahead.
 */
import { fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { openBookingUrl } from '@/lib/booking'
import { site } from '@/lib/site'
import Page, { metadata } from './page'

vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

const BEFORE = '2026-11-20T10:00:00+01:00'
const AFTER = '2026-12-03T12:00:00+01:00'

/** Build stamp and visitor clock on the same instant (static HTML and first render agree). */
function pin(iso: string) {
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', iso)
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}

beforeEach(() => {
  vi.mocked(openBookingUrl).mockClear()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

const decode = (s: string) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
const textOf = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\s\u00a0\u202f]+/g, ' ')

function ssr(iso: string): string {
  pin(iso)
  return decode(renderToString(<Page />))
}

/** The markup of `<section id="…">` up to its closing tag. */
function section(html: string, id: string): string {
  const at = html.indexOf(`id="${id}"`)
  expect(at, id).toBeGreaterThan(0)
  return html.slice(at, html.indexOf('</section>', at))
}

/** Copy deck B4. */
const DECK = {
  title: "Conférences et séminaires sur l'IA, à Rouen · Sablia",
  description:
    "Une conférence ou une matinée de séminaire sur l'IA, pour toute votre équipe. Sur demande, prix sur devis.",
  eyebrow: 'Conférences et séminaires',
  h1: "Une conférence ou une matinée sur l'IA, pour toute votre équipe.",
  lede: "Je viens parler à votre équipe de ce que l'IA fait dans son métier, avec des démonstrations en direct et du temps pour les questions.",
  demande: 'Sur demande, prix sur devis : le devis suit un échange gratuit de 30 minutes.',
  photoAlt:
    "Brice Gachadoat parle debout à un pupitre, devant une salle d'une vingtaine de personnes assises.",
  sujetsEyebrow: 'Les sujets',
  sujetsTitle: 'Trois sujets, à choisir selon votre équipe.',
  preuveEyebrow: 'Recommandation',
  finTitle: 'Trente minutes pour choisir le sujet et le format.',
  finText:
    'Vous me dites qui sera dans la salle et ce que vous en attendez, je vous propose un sujet, un format et un devis.',
}

const TOPICS = [
  {
    title: "Comprendre et utiliser l'IA générative",
    public: 'Toute une équipe, sans prérequis',
    format: "Séminaire, une matinée d'environ 4 h",
    text: "Les bases de l'IA générative, puis des démonstrations sur des cas de votre métier, et un temps sur les garde-fous : données personnelles et confidentialité.",
    history: "Donné en octobre 2026 à l'équipe d'un cabinet de conseil en ingénierie.",
  },
  {
    title: "Votre équipe utilise déjà l'IA. Avec quelles règles ?",
    public: "Une équipe qui se sert déjà de l'IA, et sa direction",
    format: "Conférence d'une heure, questions comprises",
    text: "Des documents de travail fictifs passés à l'IA en direct : ce qu'on lui demande, ce qu'on vérifie, et ce qui ne doit jamais entrer dans un outil d'IA public.",
    history: "Construit pour un webinaire destiné aux bureaux d'études.",
  },
  {
    title: 'IA et coûts : le bon modèle pour la bonne tâche',
    public: 'Direction, équipe technique',
    format: "Intervention d'environ 20 minutes, démonstration en direct comprise",
    text: "Quel modèle choisir selon la demande, comment ne pas payer plus que nécessaire, et quand mieux vaut ne pas utiliser l'IA.",
    history:
      'Donnée en octobre 2026 devant des consultants en IA, avec une démonstration en direct.',
  },
]

/** P-19 of the proof file, word for word (its typographic apostrophes kept). */
const QUOTE =
  'Brice est intervenu pour une matinée de sensibilisation à l’IA avec nos équipes. Le contenu était clair, concret et adapté à nos métiers : chacun est reparti avec des usages applicables dès le lendemain. Très bonne pédagogie et beaucoup d’échanges. Je recommande sans hésiter.'
const SIGNATURE = "Responsable d'activités, cabinet de conseil en ingénierie"

describe('/conferences static HTML (US-107)', () => {
  it('carries top, sujets, preuve and fin in that order, with exactly one h1', () => {
    const html = ssr(BEFORE)
    const at = ['top', 'sujets', 'preuve', 'fin'].map((id) => html.indexOf(`id="${id}"`))
    expect(
      at.every((i) => i >= 0),
      JSON.stringify(at),
    ).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(textOf(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '').trim()).toBe(DECK.h1)
  })

  it('hero: the eyebrow, the lede, « sur demande » and « prix sur devis », a booking button', () => {
    const top = section(ssr(BEFORE), 'top')
    const text = textOf(top)
    expect(text).toContain(DECK.eyebrow)
    expect(text).toContain(DECK.lede)
    expect(text).toContain(DECK.demande)
    expect(top).toMatch(/<button[^>]*data-cta-book[^>]*>[\s\S]*?Réserver 30 min/)
  })

  it('hero: the talk photo of 09/10 (photo 01), responsive, first-screen priority, with its alt', () => {
    const top = section(ssr(BEFORE), 'top')
    const img = top.match(/<img[^>]*>/)?.[0] ?? ''
    expect(img).toContain('src="/photos/formation-01-900.webp"')
    expect(img).toMatch(/srcSet="\/photos\/formation-01-540\.webp 540w, [^"]*900w, [^"]*1200w"/)
    expect(img).toMatch(/width="\d+"/)
    expect(img).toMatch(/height="\d+"/)
    expect(img).toContain(`alt="${DECK.photoAlt}"`)
    expect(img).toMatch(/fetchPriority="high"/i)
    expect(img).not.toContain('loading="lazy"')
  })

  it('sujets: three topics in the deck order, each with its audience and its own format', () => {
    const sujets = section(ssr(BEFORE), 'sujets')
    const text = textOf(sujets)
    expect(text).toContain(DECK.sujetsEyebrow)
    expect(sujets).toMatch(new RegExp(`<h2[^>]*>${DECK.sujetsTitle}</h2>`))
    const titles = [...sujets.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) =>
      textOf(m[1]).trim(),
    )
    expect(titles).toEqual(TOPICS.map((t) => t.title))
    const items = sujets.split(/<li[\s>]/).slice(1)
    expect(items).toHaveLength(3)
    items.forEach((item, i) => {
      const t = textOf(item)
      const topic = TOPICS[i]
      expect(t).toContain('Pour qui')
      expect(t).toContain('Format')
      for (const s of [topic.public, topic.format, topic.text, topic.history])
        expect(t, `${topic.title}: ${s}`).toContain(s)
    })
  })

  it('sujets: the webinar topic is « construit pour », never said to be given', () => {
    const text = textOf(section(ssr(BEFORE), 'sujets'))
    expect(text).toContain("Construit pour un webinaire destiné aux bureaux d'études.")
    expect(text).not.toMatch(/Donné[e]? (le|au) .*webinaire/i)
  })

  it('preuve: the published recommendation word for word, signed by a role and a sector', () => {
    const preuve = section(ssr(BEFORE), 'preuve')
    expect(textOf(preuve)).toContain(DECK.preuveEyebrow)
    const figure = preuve.match(/<figure[^>]*>[\s\S]*?<\/figure>/)?.[0] ?? ''
    const quote = textOf(figure.match(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/)?.[0] ?? '')
    expect(quote).toContain(QUOTE)
    const caption = textOf(
      figure.match(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/)?.[0] ?? '',
    ).trim()
    expect(caption).toBe(SIGNATURE)
  })

  it('closes on the FinBand of the deck', () => {
    const fin = textOf(section(ssr(BEFORE), 'fin'))
    expect(fin).toContain(DECK.finTitle)
    expect(fin).toContain(DECK.finText)
  })

  it('no amount, no generic duration, no deduction promise, no banned word, no em dash', () => {
    const text = textOf(ssr(BEFORE))
    expect(text).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)/i)
    expect(text).not.toContain('€')
    // the deduction rule of the conference option stays on /formations#conference (F6); no « 1 h 30 »
    expect(text).not.toMatch(/1 h 30|déduit/i)
    expect(text).not.toMatch(/\baudits?\b|référent|temps partagé|garanti|rembours/i)
    expect(text).not.toMatch(/\bCPF\b|finançable|certifi|Qualiopi|IAPreneurs?|Noésia/i)
    expect(text).not.toContain('—')
  })
})

describe('/conferences webinar reminder (between #preuve and #fin)', () => {
  it('while the session is ahead: one sentence from SESSION and a link to /webinaire', () => {
    const html = ssr(BEFORE)
    const between = html.slice(html.indexOf('id="preuve"'), html.indexOf('id="fin"'))
    expect(textOf(between)).toContain(
      "Webinaire gratuit, jeudi 3 décembre de 12 h à 13 h : « Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? »",
    )
    expect(between).toMatch(/<a [^>]*href="\/webinaire"[^>]*>[\s\S]*?Je m'inscris/)
  })

  it('from the session start: gone, the rest of the page unchanged', () => {
    const html = ssr(AFTER)
    expect(html).not.toContain('href="/webinaire"')
    expect(textOf(html)).not.toContain('Webinaire gratuit')
    for (const id of ['top', 'sujets', 'preuve', 'fin']) expect(html).toContain(`id="${id}"`)
  })
})

describe('/conferences metadata', () => {
  it('title and description of the deck, own canonical, indexable', () => {
    expect(metadata.title).toEqual({ absolute: DECK.title })
    expect(metadata.description).toBe(DECK.description)
    expect(metadata.alternates?.canonical).toBe('/conferences')
    expect(metadata.robots).toEqual({ index: true, follow: true })
  })
})

describe('every « Réserver 30 min » of /conferences opens the « Échange de 30 minutes » Calendly', () => {
  it.each([
    ['before the session', BEFORE],
    ['from the session start', AFTER],
  ])('%s: hero and final band, two booking buttons, both on site.formationBookingUrl', (_, iso) => {
    pin(iso)
    const { container } = render(<Page />)
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('button[data-cta-book]')]
    expect(buttons).toHaveLength(2)
    for (const b of buttons) {
      expect(b.textContent).toContain('Réserver 30 min')
      fireEvent.click(b)
    }
    expect(vi.mocked(openBookingUrl).mock.calls).toEqual([
      [site.formationBookingUrl],
      [site.formationBookingUrl],
    ])
    expect(site.formationBookingUrl).toBe('https://calendly.com/brice-gachadoat/echange-30-minutes')
  })
})

// Brice at VP2 (13/11, question 8): before the closing band, a line leads to the monthly offer (the home's
// first door and its monthly link, copy deck B2). A link, not a booking button; after the webinar reminder
// while the session is ahead, alone from its start.
describe('/conferences line toward the monthly offer (just before #fin)', () => {
  for (const [when, iso] of [
    ['before', BEFORE],
    ['from', AFTER],
  ] as const) {
    it(`${when} the session start: one line and one link to the offer page, after #preuve and the reminder`, () => {
      const html = ssr(iso)
      const zone = html.indexOf('data-zone="mensuel"')
      expect(html.match(/data-zone="mensuel"/g)).toHaveLength(1)
      expect(zone).toBeGreaterThan(html.indexOf('id="preuve"'))
      expect(zone).toBeLessThan(html.indexOf('id="fin"'))
      if (when === 'before') expect(zone).toBeGreaterThan(html.indexOf('data-zone="rappel"'))
      const line = html.slice(zone, html.indexOf('id="fin"'))
      expect(textOf(line)).toContain(
        "Responsable IA externalisé : quelqu'un qui construit et entretient vos outils, chaque mois.",
      )
      expect(line).toMatch(
        /<a [^>]*href="\/responsable-ia-externalise"[^>]*>[\s\S]*?Voir l'offre mensuelle/,
      )
      expect(line).not.toContain('data-cta-book')
    })
  }
})
