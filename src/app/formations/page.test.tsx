import { fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SHORT_FORMATS } from '@/components/formations/deroule/content'
import { openBookingUrl } from '@/lib/booking'
import { site } from '@/lib/site'
import Page, { metadata } from './page'

vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

const decode = (s: string) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;| | /g, ' ')

// Plan site-formation-lot1, U10 (US-93): /formations is the offer page « L'IA au travail ».
// Strings below are anchored on the run's copy draft (01b § 3), not on the components' own constants.
describe('/formations static HTML (SSR content rule)', () => {
  const html = decode(renderToString(<Page />))
  const text = html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')

  it('carries the eight sections in the copy order', () => {
    const ids = ['top', 'pourqui', 'deroule', 'inclus', 'conference', 'preuve', 'questions', 'fin']
    const at = ids.map((id) => html.indexOf(`id="${id}"`))
    expect(
      at.every((i) => i >= 0),
      JSON.stringify(at),
    ).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('has one h1, « L’IA au travail », with the C10 lede verbatim', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>L'IA au travail<\/h1>/)
    expect(text).toContain(
      "Trois jours sur vos propres dossiers : chaque participant repart avec ses outils en place, l'entreprise avec ses règles sur les données, et on mesure le temps passé avant et après.",
    )
  })

  it('hero: the four facts and the reassurance under the button', () => {
    for (const s of [
      'Formation pour équipes',
      'Durée',
      'Trois jours, en six demi-journées',
      'Groupe',
      "Jusqu'à 12 personnes",
      'Lieu',
      'Dans vos locaux',
      'Outil',
      'Gratuit, sans engagement. Le devis suit l’échange.'.replace('’', "'"),
    ])
      expect(text).toContain(s)
  })

  it('pour qui: teams of 10 to 50 people', () => {
    expect(text).toContain('Des entreprises de 10 à 50 personnes.')
    expect(text).toContain(
      'Dans les entreprises de services. Un programme réunit jusqu’à 12 participants.'.replace(
        '’',
        "'",
      ),
    )
  })

  it('déroulé: a bar of six half-days and the three groups of the offer sheet', () => {
    expect(text).toContain('Six demi-journées sur vos dossiers.')
    const bar = html.slice(
      html.indexOf('class="dr-bar'),
      html.indexOf('</ol>', html.indexOf('class="dr-bar')),
    )
    expect(bar.match(/class="dr-seg[ "]/g)).toHaveLength(6)
    for (const s of [
      'Demi-journée 1, avec la direction',
      "Les cas d'usage, les règles sur les données, l'espace de travail configuré, la mesure « avant ».",
      'Demi-journées 2 à 5, par métier',
      'Chaque équipe travaille sur ses dossiers réels.',
      'Demi-journée 6, clôture',
      'La mesure « après », le plan de formation documenté, et la suite si vous la voulez.',
      'Les trois jours peuvent se suivre ou s’étaler. Le programme exact est fixé dans la convention de formation.'.replace(
        '’',
        "'",
      ),
    ])
      expect(text).toContain(s)
  })

  it('inclus: the four bonuses and the C9 sentence, no value in euros', () => {
    expect(text).toContain('Ce qui reste après les trois jours.')
    for (const s of [
      "La charte IA de l'entreprise.",
      'Le plan de formation documenté.',
      '30 jours de questions par mail, réponse sous 48 h.',
      'La bibliothèque des consignes et assistants créés en séance, par métier.',
      'Une attestation de fin de formation est remise à chaque participant.',
    ])
      expect(text).toContain(s)
  })

  it('conference: an option to see before deciding, never a first step (G0 contradiction 1)', () => {
    // The free webinar is the only first step (home, JSON-LD); the conference is an option.
    expect(text).not.toMatch(/pour commencer|premier pas/i)
    const at = html.indexOf('id="conference"')
    const conf = html
      .slice(at, html.indexOf('</section>', at))
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
    expect(conf).toContain('En option')
    expect(conf).toContain('Une conférence, pour voir avant de décider.')
  })

  // Brice at VP2 (13/11, question 5): /conferences gives each talk the duration of what exists, so this
  // option no longer announces « 1 h 30 à 2 h »; the deduction rule stays.
  it('conference: deducted from the signed programme, without its price nor a duration', () => {
    expect(text).toContain(
      'Une conférence pour votre équipe. Son prix est déduit du programme s’il est signé dans les 30 jours.'.replace(
        '’',
        "'",
      ),
    )
    expect(text).not.toMatch(/1 h 30|à 2 h\b/)
  })

  // Brice at VP2 (13/11, question 8): the score comes from a one-morning seminar, not the three days,
  // so the block is titled for what it is.
  it('preuve: titled « Retours d’un séminaire », never « Déjà formés »', () => {
    const at = html.indexOf('id="preuve"')
    const block = html
      .slice(at, html.indexOf('</section>', at))
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
    expect(block).toContain("Retours d'un séminaire")
    expect(text).not.toContain('Déjà formés')
  })

  it('preuve: 9,1/10 with its base right next to it (R05), four answers as written', () => {
    const at = text.indexOf('9,1/10')
    expect(at).toBeGreaterThan(0)
    const base = text.indexOf('(7 réponses sur 23 participants)')
    expect(base - at).toBeGreaterThan(0)
    expect(base - at).toBeLessThan(250)
    for (const a of [
      'Très bon pédagogue',
      "Super à l'écoute sur les questions",
      'La clarté des explications',
      'Très instructif, belle découverte',
    ])
      expect(text).toContain(a)
    expect(html.match(/class="[^"]*\btemoignage\b/g)).toHaveLength(4)
  })

  it('questions: the home FAQ items 1 to 6 and 9, same strings', () => {
    expect(text).toContain('Ce qu’on me demande avant.'.replace('’', "'"))
    for (const q of [
      'Combien ça coûte ?',
      'Mon équipe utilise déjà Copilot ou ChatGPT.',
      'Où se passe la formation ?',
      'Combien de personnes ?',
      'Que faut-il préparer ?',
      'Nos dossiers sont confidentiels.',
      "Mon équipe n'a jamais utilisé l'IA.",
    ])
      expect(text).toContain(q)
    expect(text).toContain(
      'Le prix dépend de votre équipe et du format retenu. Il arrive dans le devis, après l’échange de 30 minutes. Le webinaire et l’échange sont gratuits.'.replaceAll(
        '’',
        "'",
      ),
    )
    expect(text).not.toContain('Et après les trois jours ?')
    expect(text).not.toContain('Qui anime ?')
  })

  it('closes on the training FinBand', () => {
    expect(text).toContain('Trente minutes pour cadrer votre formation.')
    expect(text).toContain(
      'Vous me parlez de votre équipe et de ses dossiers, je vous envoie un programme et son devis.',
    )
  })

  it('shows three photos of 09/10 with srcset, dimensions and an alt', () => {
    const imgs = [...html.matchAll(/<img[^>]*src="\/photos\/formation-0\d-\d+\.webp"[^>]*>/g)].map(
      (m) => m[0],
    )
    expect(imgs.length).toBeGreaterThanOrEqual(3)
    for (const img of imgs) {
      expect(img).toMatch(/srcSet="\/photos\/formation-0\d-540\.webp 540w, [^"]*900w, [^"]*1200w"/i)
      expect(img).toMatch(/width="\d+"/)
      expect(img).toMatch(/height="\d+"/)
      expect(img).toMatch(/alt="Brice Gachadoat [^"]+"/)
    }
  })

  it('no price, no guarantee, no banned word, no em dash, nothing left of the old page', () => {
    expect(text).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)/i)
    expect(text).not.toContain('€')
    expect(text).not.toMatch(/garanti|rembours|sans risque/i)
    expect(text).not.toMatch(/\bCPF\b|finançable|certifi|Qualiopi|IAPreneurs?|Noésia/i)
    expect(text).not.toContain('—')
    expect(text).not.toContain('Composez')
    expect(text).not.toContain('Mon équipe est déjà avancée.')
  })
})

describe('/formations metadata', () => {
  it('title and description from the copy, canonical /formations', () => {
    expect(metadata.title).toEqual({
      absolute: "L'IA au travail, formation à Claude pour votre équipe · Sablia",
    })
    expect(metadata.description).toBe(
      "Trois jours dans vos locaux, jusqu'à 12 personnes : votre équipe apprend Claude sur ses propres dossiers, avec ses règles sur les données. Le devis suit un échange gratuit de 30 minutes.",
    )
    expect(metadata.alternates?.canonical).toBe('/formations')
  })
})

describe('every « Réserver 30 min » of /formations opens the « Échange de 30 minutes » Calendly', () => {
  beforeEach(() => {
    vi.mocked(openBookingUrl).mockClear()
  })

  it('hero and final band: two booking buttons, both on site.formationBookingUrl', () => {
    const { container } = render(<Page />)
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('button[data-cta-book]')]
    expect(buttons).toHaveLength(2)
    for (const b of buttons) {
      expect(b.textContent).toContain('Réserver 30 min')
      fireEvent.click(b)
    }
    expect(openBookingUrl).toHaveBeenCalledTimes(2)
    expect(vi.mocked(openBookingUrl).mock.calls).toEqual([
      [site.formationBookingUrl],
      [site.formationBookingUrl],
    ])
    expect(site.formationBookingUrl).toBe('https://calendly.com/brice-gachadoat/echange-30-minutes')
  })
})

// US-109 (plan sablia-site-structure-offre F4, copy deck B5 `form.short` and `reminder.*`): two
// additions only, nothing of the page above is reworded. Each render pins the instant (build stamp
// and visitor clock), before and from the session start.
describe('/formations additions (US-109)', () => {
  const BEFORE = '2026-11-20T10:00:00+01:00'
  const AFTER = '2026-12-03T12:00:00+01:00'
  const REMINDER =
    "Webinaire gratuit, jeudi 3 décembre de 12 h à 13 h : « Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? »"
  const flat = (s: string) =>
    decode(s)
      .replace(/<[^>]*>/g, ' ')
      .replace(/[\s\u00a0\u202f]+/g, ' ')

  /** Renders the page at `iso` (static HTML as built at that instant) and restores the clock. */
  function at<T>(iso: string, run: () => T): T {
    vi.stubEnv('NEXT_PUBLIC_BUILD_AT', iso)
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(iso))
    try {
      return run()
    } finally {
      vi.useRealTimers()
      vi.unstubAllEnvs()
    }
  }

  it('says formats start at a half-day, on request, in the déroulé right after its note', () => {
    expect(SHORT_FORMATS).toBe('Des formats dès une demi-journée, sur demande.')
    const html = at(BEFORE, () => renderToString(<Page />))
    const start = html.indexOf('id="deroule"')
    const deroule = flat(html.slice(start, html.indexOf('</section>', start)))
    const note = deroule.indexOf('Le programme exact est fixé dans la convention de formation.')
    expect(note).toBeGreaterThan(0)
    expect(deroule.indexOf(SHORT_FORMATS)).toBeGreaterThan(note)
  })

  it('while the session is ahead: the webinar reminder between #conference and #preuve, linked to /webinaire', () => {
    const html = at(BEFORE, () => renderToString(<Page />))
    const from = html.indexOf('id="conference"')
    const between = html.slice(html.indexOf('</section>', from), html.indexOf('id="preuve"'))
    expect(flat(between)).toContain(REMINDER)
    expect(decode(between)).toMatch(/<a [^>]*href="\/webinaire"[^>]*>[\s\S]*?Je m'inscris/)
    expect(flat(html).match(/Webinaire gratuit/g)).toHaveLength(1)
  })

  it('from the session start: the reminder is gone, the half-day sentence stays', () => {
    const html = at(AFTER, () => renderToString(<Page />))
    expect(html).not.toContain('href="/webinaire"')
    expect(flat(html)).not.toContain('Webinaire gratuit')
    expect(flat(html)).toContain(SHORT_FORMATS)
  })

  it('the reminder adds no booking button: still exactly two, before and from the session start', () => {
    for (const iso of [BEFORE, AFTER]) {
      at(iso, () => {
        const { container, unmount } = render(<Page />)
        expect(container.querySelectorAll('button[data-cta-book]')).toHaveLength(2)
        unmount()
      })
    }
  })
})

// Brice at VP2 (13/11, question 8): an addition, as the two of US-109. Before the closing band, a line leads
// to the monthly offer (the home's first door and its monthly link, copy deck B2); a link, not a third
// booking button.
describe('/formations line toward the monthly offer (just before #fin)', () => {
  it('sits after #questions, before #fin, with one link to the offer page', () => {
    const html = decode(renderToString(<Page />))
    const zone = html.indexOf('data-zone="mensuel"')
    expect(html.match(/data-zone="mensuel"/g)).toHaveLength(1)
    expect(zone).toBeGreaterThan(html.indexOf('id="questions"'))
    expect(zone).toBeLessThan(html.indexOf('id="fin"'))
    const line = html.slice(zone, html.indexOf('id="fin"'))
    expect(line.replace(/<[^>]*>/g, ' ').replace(/[\s\u00a0\u202f]+/g, ' ')).toContain(
      "Responsable IA externalisé : quelqu'un qui construit et entretient vos outils, chaque mois.",
    )
    expect(line).toMatch(
      /<a [^>]*href="\/responsable-ia-externalise"[^>]*>[\s\S]*?Voir l'offre mensuelle/,
    )
    expect(line).not.toContain('data-cta-book')
  })
})
