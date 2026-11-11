import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CHAQUE_MOIS,
  CONDITIONS,
  FIN,
  GARDEZ,
  HERO,
  META,
  PARCOURS,
  PREMIER_MOIS,
  QUESTIONS,
  QUI,
  ROLE,
} from '@/components/temps-partage/content'
import { openBookingUrl } from '@/lib/booking'
import { site } from '@/lib/site'
import Page, { metadata } from './page'

vi.mock('@/lib/booking', () => ({ openBookingUrl: vi.fn() }))

/** Entities out; no-break spaces (U+00A0, U+202F) and runs of spaces folded to one plain space. */
const fold = (s: string) => s.replace(/[\s\u00a0\u202f]+/g, ' ').trim()
const decode = (s: string) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')

/** Inline tags and React's text separators join their words; every other tag is a word break. */
const INLINE = /<\/?(a|strong|em|b|i|span|small|time)(\s[^>]*)?>|<!--[\s\S]*?-->/g
const textOf = (html: string) =>
  fold(
    html
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(INLINE, '')
      .replace(/<[^>]*>/g, ' '),
  )

/** Every string of a copy object, recursively (links, keys and numbers are not visitor text). */
function strings(value: unknown, key = ''): string[] {
  if (typeof value === 'string') return ['key', 'href'].includes(key) ? [] : [value]
  if (Array.isArray(value)) return value.flatMap((v) => strings(v))
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

// Plan sablia-site-seo-offre-lettres, Phase B, B1 (US-99): the offer page, price shown, FAQ as text.
describe('/responsable-ia-temps-partage static HTML (SSR content rule)', () => {
  const html = decode(renderToString(<Page />))
  const text = textOf(html)

  it('carries the nine sections in the copy order, then the shell #fin', () => {
    const ids = [
      'top',
      'role',
      'premier-mois',
      'chaque-mois',
      'gardez',
      'conditions',
      'qui',
      'questions',
      'fin',
    ]
    const at = ids.map((id) => html.indexOf(`id="${id}"`))
    expect(
      at.every((i) => i >= 0),
      JSON.stringify(at),
    ).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('has exactly one h1, naming the role and Rouen', () => {
    const h1s = html.match(/<h1[\s>][\s\S]*?<\/h1>/g) ?? []
    expect(h1s).toHaveLength(1)
    const h1 = textOf(h1s[0] ?? '')
    expect(h1).toContain('responsable IA à temps partagé')
    expect(h1).toContain('Rouen')
  })

  it('shows both prices, the searched words of the role and the region', () => {
    for (const s of [
      '2 000 € HT par mois',
      '1 500 € HT par mois',
      'consultant IA',
      'DSI à temps partagé',
      'Normandie',
    ])
      expect(text, s).toContain(s)
  })

  it('puts the price, the commitment and the audience in a facts list of the hero', () => {
    const top = html.slice(html.indexOf('id="top"'), html.indexOf('id="role"'))
    const dl = top.match(/<dl[\s>][\s\S]*?<\/dl>/)?.[0] ?? ''
    const facts = textOf(dl)
    for (const s of [
      'Prix',
      '2 000 € HT par mois',
      'Engagement',
      'Trois mois, puis résiliable chaque mois',
      'Pour qui',
      'PME de 10 à 50 personnes',
    ])
      expect(facts, s).toContain(s)
  })

  it('carries the four conditions in #conditions, the first-month clause word for word', () => {
    const at = html.indexOf('id="conditions"')
    const block = textOf(html.slice(at, html.indexOf('</section>', at)))
    expect(block).toContain('2 000 € HT par mois.')
    expect(block).toContain(
      "Prix d'ouverture : 1 500 € HT par mois pour les cinq premières entreprises, en échange d'un bilan avec moi à la fin du troisième mois.",
    )
    expect(block).toContain('Engagement de trois mois, puis résiliable chaque mois.')
    expect(block).toContain(
      'Si le premier mois ne vous convient pas, vous arrêtez là et vous ne payez pas les deux mois suivants.',
    )
  })

  it('renders every question and every answer as text, in a visible <dl>', () => {
    const at = html.indexOf('id="questions"')
    const block = html.slice(at, html.indexOf('</section>', at))
    expect(block).toMatch(/<dl[\s>]/)
    expect(QUESTIONS.items.length).toBeGreaterThanOrEqual(5)
    expect(QUESTIONS.items.length).toBeLessThanOrEqual(7)
    for (const { q, a } of QUESTIONS.items) {
      expect(text, q).toContain(fold(q))
      expect(text, a).toContain(fold(a))
    }
  })

  it('renders every visitor string of the copy module (nothing left to an effect)', () => {
    const copy = {
      HERO,
      ROLE,
      PREMIER_MOIS,
      PARCOURS,
      CHAQUE_MOIS,
      GARDEZ,
      CONDITIONS,
      QUI,
      QUESTIONS,
      FIN,
    }
    for (const s of strings(copy)) expect(text, s).toContain(fold(s))
  })

  it("labels the journey drawing an example, never the reader's own journey", () => {
    const at = html.indexOf('id="premier-mois"')
    const block = textOf(html.slice(at, html.indexOf('</section>', at)))
    expect(block).toContain('Exemple de parcours client')
    expect(block).not.toContain('Votre parcours client')
  })

  it('links the school named in « Qui je suis », as the home does', () => {
    const at = html.indexOf('id="qui"')
    const block = html.slice(at, html.indexOf('</section>', at))
    expect(block).toMatch(
      new RegExp(
        `<a[^>]*href="${QUI.school.href.replace(/\./g, '\\.')}"[^>]*>${QUI.school.link}</a>`,
      ),
    )
  })

  it('ships every section in its final state (no armed reveal in the server HTML)', () => {
    expect(html).not.toMatch(/data-reveal="(armed|in)"/)
    expect(html).not.toMatch(/style="[^"]*opacity:\s*0[;"]/)
  })

  it('shows real photos of Brice only, with an alt, dimensions and a srcset', () => {
    const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
    const photos = imgs.filter((img) => /src="\/photos\//.test(img))
    expect(photos.length).toBeGreaterThanOrEqual(1)
    for (const img of photos) {
      expect(img).toMatch(/src="\/photos\/formation-0\d-\d+\.webp"/)
      expect(img).toMatch(/srcSet="\/photos\/formation-0\d-540\.webp 540w, [^"]*900w, [^"]*1200w"/i)
      expect(img).toMatch(/width="\d+"/)
      expect(img).toMatch(/height="\d+"/)
      expect(img).toMatch(/alt="Brice Gachadoat [^"]+"/)
    }
    // Every other image is decorative (the closing band's banner) or under public/.
    for (const img of imgs) expect(img).toMatch(/src="\/(photos|illus)\//)
  })

  it('carries no page-level structured data (no FAQPage: the FAQ is visible text)', () => {
    expect(html).not.toContain('application/ld+json')
    expect(html).not.toContain('FAQPage')
  })

  it('says nothing the offer forbids: no guarantee, no funding word, no old school name, no em dash', () => {
    expect(text).not.toMatch(/garanti|rembours|sans risque/i)
    expect(text).not.toMatch(/\bCPF\b|finançable|certifi|Qualiopi|IAPreneurs?/i)
    expect(text).not.toContain('—')
    expect(text).not.toMatch(/900\s?€/)
  })
})

describe('/responsable-ia-temps-partage metadata', () => {
  it('title and description from the copy, canonical on the path (outside /offres/**)', () => {
    expect(metadata.title).toEqual({ absolute: META.title })
    expect(metadata.title).toEqual({
      absolute: 'Responsable IA à temps partagé pour PME, à Rouen · Sablia',
    })
    expect(metadata.description).toBe(META.description)
    expect(metadata.alternates?.canonical).toBe('/responsable-ia-temps-partage')
    expect(metadata.robots).toEqual({ index: true, follow: true })
  })
})

describe('every « Réserver 30 min » of the offer page opens the « Échange de 30 minutes » Calendly', () => {
  beforeEach(() => {
    vi.mocked(openBookingUrl).mockClear()
  })

  it('opens site.formationBookingUrl from every booking button, never site.bookingUrl', () => {
    const { container } = render(<Page />)
    const buttons = [...container.querySelectorAll<HTMLButtonElement>('button[data-cta-book]')]
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    for (const b of buttons) {
      expect(b.textContent).toContain('Réserver 30 min')
      fireEvent.click(b)
    }
    const urls = vi.mocked(openBookingUrl).mock.calls.map((c) => c[0])
    expect(urls).toHaveLength(buttons.length)
    for (const u of urls) expect(u).toBe(site.formationBookingUrl)
    expect(urls).not.toContain(site.bookingUrl)
    expect(site.formationBookingUrl).toBe('https://calendly.com/brice-gachadoat/echange-30-minutes')
  })
})

// Offer-page review F6 #1 and #6 (US-99), read from the stylesheets: no gate measures focus rings,
// and none tells a styled word from a link.
describe('/responsable-ia-temps-partage stylesheets', () => {
  const css = (rel: string) => readFileSync(join(__dirname, rel), 'utf8')

  it('flips the focus ring to gold on the night band #conditions, as on #fin (DESIGN.md § Colour)', () => {
    const gold =
      css('../base.css').match(/([^{}]*)\{\s*outline-color:\s*#D9A441\s*!important;\s*\}/i)?.[1] ??
      ''
    for (const band of ['.v2-tp-conditions', '#fin'])
      expect(gold, band).toContain(`${band} :focus-visible`)
    expect(css('../../components/temps-partage/conditions/conditions.css')).toMatch(
      /\.v2-tp-conditions \{[^}]*background: #161b29/,
    )
  })

  it('sets the three verbs of #role in bold, without the underline that marks a link', () => {
    const verb =
      css('../../components/temps-partage/role/role.css').match(/\.tpr-verb \{([^}]*)\}/)?.[1] ?? ''
    expect(verb).toMatch(/font-weight:\s*600/)
    expect(verb).not.toMatch(/text-decoration|text-underline/)
  })
})
