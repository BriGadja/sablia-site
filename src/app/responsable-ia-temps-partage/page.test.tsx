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

  // AC-23 design evaluation #8 (US-99): a referred owner looks for a named person in Rouen; the
  // first phone screen named nobody (the name came seven screens down, in #qui).
  it('names the person in the hero, under the lede and before the booking button', () => {
    const top = html.slice(html.indexOf('id="top"'), html.indexOf('id="role"'))
    const by = top.indexOf('class="tph-by"')
    expect(by, 'byline').toBeGreaterThan(top.indexOf('class="tph-lede"'))
    expect(by, 'byline').toBeLessThan(top.indexOf('data-cta-book'))
    expect(textOf(top.slice(by))).toContain('Brice Gachadoat, fondateur de Sablia, à Rouen.')
    expect(HERO.byline).toBe(QUI.title)
  })

  // AC-23 #11: « Votre responsable / IA à temps… » split the role at 390 (and 920-1000 px).
  it('keeps « responsable IA » on one line at every width', () => {
    const h1 = html.match(/<h1[\s>][\s\S]*?<\/h1>/)?.[0] ?? ''
    expect(h1).toMatch(/<span class="tph-nowrap">responsable IA<\/span>/)
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

// AC-23 design evaluation #1 (US-99): DESIGN.md « Sections are separated by dunes, not by hard
// edges ». Each section's ground is the first `background` of its stylesheet; wherever two
// neighbours differ, the later one opens on a dune whose near shape is its own ground, or the
// earlier one ends on a floor dune (`is-bottom`, the hero) in that ground.
describe('/responsable-ia-temps-partage section edges', () => {
  const html = renderToString(<Page />)
  const SHEETS: readonly (readonly [string, string])[] = [
    ['top', '../../components/temps-partage/hero/hero.css'],
    ['role', '../../components/temps-partage/role/role.css'],
    ['premier-mois', '../../components/temps-partage/premier-mois/premier-mois.css'],
    ['chaque-mois', '../../components/temps-partage/chaque-mois/chaque-mois.css'],
    ['gardez', '../../components/temps-partage/gardez/gardez.css'],
    ['conditions', '../../components/temps-partage/conditions/conditions.css'],
    ['qui', '../../components/temps-partage/qui/qui.css'],
    ['questions', '../../components/temps-partage/questions/questions.css'],
    ['fin', '../../components/shell/fin-band.css'],
  ]
  const ground = (rel: string) =>
    readFileSync(join(__dirname, rel), 'utf8')
      .match(/background:\s*(#[0-9a-f]{6})/i)?.[1]
      ?.toLowerCase()
  /** The markup of section `id`, up to the next section of the list. */
  const block = (id: string, next?: string) => {
    const at = html.indexOf(`id="${id}"`)
    return html.slice(at, next ? html.indexOf(`id="${next}"`) : undefined)
  }
  /** The near-shape fill of a dune svg, lower-cased. */
  const front = (svg: string | undefined) =>
    svg?.match(/class="d-front"[^>]*fill="(#[0-9a-f]{6})"/i)?.[1]?.toLowerCase()
  /** The dune that is the section's FIRST child (it straddles the section's top edge). */
  const opening = (markup: string) =>
    markup.slice(markup.indexOf('>') + 1).match(/^<svg class="dune v2-dune"[\s\S]*?<\/svg>/)?.[0]
  /** A floor dune (`is-bottom`) anywhere in the section. */
  const floor = (markup: string) =>
    markup.match(/<svg class="dune v2-dune is-bottom"[\s\S]*?<\/svg>/)?.[0]

  it('reads a ground for every section', () => {
    for (const [id, rel] of SHEETS) expect(ground(rel), id).toMatch(/^#[0-9a-f]{6}$/)
  })

  for (let i = 1; i < SHEETS.length; i++) {
    const [prev, prevSheet] = SHEETS[i - 1]
    const [id, sheet] = SHEETS[i]
    it(`#${prev} → #${id}: a change of ground is a dune, never a straight edge`, () => {
      const from = ground(prevSheet)
      const to = ground(sheet)
      if (from === to) return
      const opens = front(opening(block(id, SHEETS[i + 1]?.[0])))
      const floors = front(floor(block(prev, id)))
      expect(opens === to || floors === to, `${from} → ${to}`).toBe(true)
    })
  }
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

  // AC-23 #7: the charte's type scale table is the reference (DESIGN.md: « a value in this file that
  // disagrees with those files is a bug in this file »); the h1 was 56 and the #qui title 44.
  it('sets the h1 and the #qui title on the steps of the DESIGN.md scale', () => {
    const design = css('../../../DESIGN.md')
    const h1 = design.match(/^\| H1 \| (\d+) \//m)?.[1]
    const h1Phone = design.match(/^\| H1 \|[^\n]*offer page \([^)\n]*?(\d+) on phone\)/m)?.[1]
    const h2 = design.match(/^\| H2 \| (\d+) \|/m)?.[1]
    expect([h1, h1Phone, h2]).toEqual(['52', '36', '36'])
    const hero = css('../../components/temps-partage/hero/hero.css')
    const sizes = [...hero.matchAll(/\n {4,6}h1 \{[^}]*?font-size: (\d+)px/g)].map((m) => m[1])
    expect(sizes[0], 'desktop h1').toBe(h1)
    expect(sizes.at(-1), 'phone h1').toBe(h1Phone)
    const qui = css('../../components/temps-partage/qui/qui.css')
    expect(qui.match(/\n {4}h2 \{[^}]*?font-size: (\d+)px/)?.[1], '#qui h2').toBe(h2)
  })

  // AC-23 #5: the sans face's word space is 0.2 em, and the negative tracking of the semibold
  // 17-26 px strings closed it further (« PMEde 10 à 50 personnes », « Riende technique »).
  it('opens the word spaces of the semibold facts and leads, tracking 0 below 24 px', () => {
    const rules = [
      [
        'hero facts',
        css('../../components/temps-partage/hero/hero.css').match(/\n {6}dd \{([^}]*)\}/)?.[1],
      ],
      [
        'gardez leads',
        css('../../components/temps-partage/gardez/gardez.css').match(
          /\.tpg-lead \{([^}]*)\}/,
        )?.[1],
      ],
    ] as const
    for (const [name, body] of rules) {
      expect(body, name).toBeDefined()
      expect(body, name).toMatch(/word-spacing: 0\.0[5-9]em/)
      expect(body, name).not.toMatch(/letter-spacing: -/)
    }
  })

  // AC-23 evaluation 2 #2: four stroke pictograms over four sentences beside an empty column read as
  // a template; the page already has its own list language, the ruled items of #premier-mois.
  it('sets #chaque-mois as the ruled list of #premier-mois, under its title, without pictograms', () => {
    const html = renderToString(<Page />)
    const at = html.indexOf('id="chaque-mois"')
    const block = html.slice(at, html.indexOf('</section>', at))
    expect(block).not.toMatch(/<svg/)
    expect(block).toMatch(/<li class="tpc-item"[^>]*>[^<]/)
    const decl = (body: string | undefined, prop: string) =>
      body?.match(new RegExp(`(?:^|[;{\\s])${prop}: ([^;]+);`))?.[1]
    const tpm = css('../../components/temps-partage/premier-mois/premier-mois.css')
    const tpc = css('../../components/temps-partage/chaque-mois/chaque-mois.css')
    const tpmLi = tpm.match(/\.tpm-items \{[\s\S]*?\n {6}li \{([^}]*)\}/)?.[1]
    const tpcLi = tpc.match(/\.tpc-item \{([^}]*?)(?:&|\})/)?.[1]
    for (const prop of ['padding', 'border-top', 'font-size', 'line-height', 'color'])
      expect(decl(tpcLi, prop), prop).toBe(decl(tpmLi, prop))
    expect(tpm).toMatch(/li:first-child \{\s*border-top: 1\.5px solid #131620;/)
    expect(tpc).toMatch(/&:nth-child\(-n \+ 2\) \{\s*border-top: 1\.5px solid #131620;/)
    // the title is not a column of its own: the list follows it
    expect(tpc).not.toMatch(/\.tpc-grid \{[^}]*grid-template-columns/)
  })

  // AC-23 evaluation 2 #3: DESIGN.md « Gold on a light ground is gold-dark as text and gold-mid as a
  // stroke. gold itself only sits on night or violet »; the #role grain was #d9a441 on rose (1.80:1).
  it('keeps the gold of the night off the light grounds, the #role grain a gold-mid stroke', () => {
    const light = ['hero/hero.css', 'role/role.css', 'chaque-mois/chaque-mois.css']
      .concat(['gardez/gardez.css', 'qui/qui.css', 'questions/questions.css'])
      .map((rel) => [rel, css(`../../components/temps-partage/${rel}`)] as const)
    for (const [rel, sheet] of light) {
      expect(sheet, rel).toMatch(/^ {4}background: #f(4ecdd|2e3df);/m)
      expect(sheet.toLowerCase(), rel).not.toContain('#d9a441')
    }
    const grain = css('../../components/temps-partage/role/role.css').match(
      /&::before \{[^}]*?background: (#[0-9a-f]{6})/,
    )?.[1]
    expect(grain).toBe('#b9852a')
  })

  // AC-23 evaluation 2 #4: a `min-height` of two lines split « Rien de technique à apprendre : »
  // from « je construis… » by ~40 px at 1440; a measure that wraps every lead onto two lines does not.
  it('wraps the #gardez leads on their own measure, with no reserved height', () => {
    const lead =
      css('../../components/temps-partage/gardez/gardez.css').match(
        /\.tpg-lead \{([^}]*)\}/,
      )?.[1] ?? ''
    expect(lead).not.toMatch(/min-height/)
    expect(lead).toMatch(/text-wrap: balance/)
    const measure = Number(lead.match(/max-width: ([\d.]+)em/)?.[1])
    expect(measure).toBeGreaterThanOrEqual(10)
    expect(measure).toBeLessThanOrEqual(13)
  })

  // AC-23 evaluation 2 #7: `.tpk-item { max-width: 40em }` also bounded the rules between the
  // conditions, which stopped 23 px short of the column at 1440.
  it('runs the #conditions rules the full column, the measure on the text only', () => {
    const sheet = css('../../components/temps-partage/conditions/conditions.css')
    const item = sheet.match(/\.tpk-item \{([^}]*)\}/)?.[1] ?? ''
    expect(item).toMatch(/border-top: 1px solid #323a52/)
    expect(item).not.toMatch(/max-width/)
    expect(sheet).toMatch(/\.tpk-text \{[^}]*max-width: 40em/)
    const html = renderToString(<Page />)
    const at = html.indexOf('id="conditions"')
    const items = [
      ...html
        .slice(at, html.indexOf('</section>', at))
        .matchAll(/<li class="tpk-item[^>]*>(.*?)<\/li>/g),
    ]
    expect(items).toHaveLength(CONDITIONS.items.length)
    for (const [li, inner] of items) expect(inner, li).toMatch(/^<span class="tpk-text">/)
  })

  // AC-23 evaluation 2 #8: the price was 38 px on phones, a step on no table; the table now has a
  // « Price figure » row (48, 36 on phone: the H2 step) and the stylesheet sits on it.
  it('sets the #conditions price on the « Price figure » row of the DESIGN.md scale', () => {
    const design = css('../../../DESIGN.md')
    const row = design.match(/^\| Price figure \| (\d+) \/[^\n]*?\((\d+) on phone\)/m)
    expect(row?.slice(1)).toEqual(['48', '36'])
    expect(design.match(/^\| H2 \| (\d+) \|/m)?.[1], 'phone price = the H2 step').toBe(row?.[2])
    const sheet = css('../../components/temps-partage/conditions/conditions.css')
    const sizes = [...sheet.matchAll(/&\.is-mensuel \{[^}]*?font-size: (\d+)px/g)].map((m) => m[1])
    expect(sizes).toEqual(['48', '36'])
  })
})
