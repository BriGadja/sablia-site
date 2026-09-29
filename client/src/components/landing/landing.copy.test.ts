/**
 * Coherence guard between the home page (and the guide it links) and the offer the site sells.
 *
 * Found 2026-09-09, the day the OF-1 product page went live: the home still sold
 * "1 000 à 2 000 €", "sous 30 jours" and "2–4 semaines" one click away from a page saying
 * 1 490 € HT delivered in 7 days. Nothing could go red. This test binds the landing's figures to
 * the typed OF-1 module: the price, the delay, the monthly fee and the brick rule come from
 * `@/content/of1`, so a change there propagates or fails here.
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { FAQ_CARRIED } from '../../content/faq-carried'
import { FINAL_CALL_TITLE, FORMATION_QUOTES, PROOF_LINE } from '../../content/home'
import { of1 } from '../../content/of1'
import { eurHt } from '../../lib/format'
import { site } from '../../lib/site'
import { TESTIMONIAL } from './FormationsSection'

const HERE = dirname(fileURLToPath(import.meta.url))
/**
 * Every source of the home (2026-09-28: the five sections, the record card, the nav, the footer,
 * the home content module), plus the pages the nav and the callout open onto, plus llms.txt.
 * Problems, Process, Team, Proof, Catalogue and FAQ left the home that day (decision 4).
 */
const SOURCES = [
  resolve(HERE, 'HeroSection.tsx'),
  resolve(HERE, 'RecordCard.tsx'),
  resolve(HERE, 'CRMStrip.tsx'),
  resolve(HERE, 'OffreSection.tsx'),
  resolve(HERE, 'CalloutSection.tsx'),
  resolve(HERE, 'TopNav.tsx'),
  resolve(HERE, 'FormationsSection.tsx'),
  resolve(HERE, 'ContactForm.tsx'),
  resolve(HERE, 'FooterSection.tsx'),
  resolve(HERE, '../../content/home.ts'),
  resolve(HERE, '../../pages/Landing.tsx'),
  resolve(HERE, '../../pages/GuideIaEntreprise.tsx'),
  resolve(HERE, '../ressources/RessourceForm.tsx'),
  resolve(HERE, '../../pages/Ressources.tsx'),
  resolve(HERE, '../../pages/Ressource.tsx'),
  resolve(HERE, '../../../public/llms.txt'),
].map((path) => ({ path, text: readFileSync(path, 'utf8') }))

/** Claims of the pre-catalogue discourse. Each one was displayed on sablia.io on 2026-09-09. */
const STALE_CLAIMS: RegExp[] = [
  /1 000 et 2 000/,
  /sous 30 jours/,
  /2[–-]4 semaines/,
  /chiffrés? sous 5 jours/,
  /apr[èe]s (le call )?audit, jamais avant/,
  /calendly\.com\/raphael/,
  /sur mesure\./,
  /Témoignage à venir/,
]

/**
 * Names that may only appear once their owner has validated a testimonial in writing (decision A4,
 * 2026-09-17). The home named four clients and quoted one by first name; none of them had signed
 * anything. Brice went further on 2026-09-17: no person name at all, anywhere. A published
 * signature is a role and a company, and the company is named only once it has validated.
 * `landing.copy.test.ts` guards the home; `of1.copy.test.ts` already guards the product page.
 */
const NAMES_PENDING_CONSENT = ['Nestenn', 'Norloc', 'Qwertys', 'VB Mobilier', 'Valentin']

/** Names that never reach a public surface, validated or not: contract, or internal role. */
const NEVER_PUBLIC = ['MASSA', 'Chatflow', 'Raphaël', 'Raphael']

/** Where the proof figures live since 2026-09-28: the offer section and its content module. */
const CONSENT_SCOPED = ['OffreSection.tsx', 'home.ts', 'llms.txt']

/** The sources that render the home itself (llms.txt and the linked pages are not the home). */
const HOME_SOURCE_NAMES = [
  'HeroSection.tsx',
  'RecordCard.tsx',
  'CRMStrip.tsx',
  'OffreSection.tsx',
  'FormationsSection.tsx',
  'ContactForm.tsx',
  'CalloutSection.tsx',
  'TopNav.tsx',
  'FooterSection.tsx',
  'home.ts',
  'Landing.tsx',
]
const HOME_SOURCES = SOURCES.filter((s) => HOME_SOURCE_NAMES.some((n) => s.path.endsWith(n)))
const byName = (name: string) => SOURCES.find((s) => s.path.endsWith(name))

const faqText = FAQ_CARRIED.map((item) => `${item.q} ${item.a}`).join('\n')

describe('landing copy: no claim of the pre-catalogue discourse survives', () => {
  for (const source of SOURCES) {
    it(`${source.path.split('/').slice(-1)[0]} carries none of the stale claims`, () => {
      for (const claim of STALE_CLAIMS) {
        expect(source.text).not.toMatch(claim)
      }
    })
  }
})

describe('home: no name is published before its owner validated it', () => {
  for (const name of CONSENT_SCOPED) {
    const source = SOURCES.find((s) => s.path.endsWith(name))
    it(`${name} names no client whose consent is not traced`, () => {
      expect(source).toBeDefined()
      for (const client of NAMES_PENDING_CONSENT) {
        expect(source?.text.toLowerCase()).not.toContain(client.toLowerCase())
      }
    })
  }

  for (const source of SOURCES) {
    it(`${source.path.split('/').slice(-1)[0]} names nobody who never goes public`, () => {
      for (const name of NEVER_PUBLIC) {
        expect(source.text.toLowerCase()).not.toContain(name.toLowerCase())
      }
    })
  }
})

describe('landing copy: the figures are the offer figures', () => {
  it('the carried FAQ prices the catalogue offer at OF-1 price and delay, and names the brick floor', () => {
    expect(faqText).toContain(eurHt(of1.price.oneShotHt))
    expect(faqText).toContain(`${of1.price.monthlyHt} € HT`)
    expect(faqText).toContain(`${of1.delay.days} jours`)
    expect(faqText).toContain(eurHt(of1.price.brickFloorHt))
  })

  it('the guide states the same price and delay as the offer', () => {
    const guide = SOURCES.find((s) => s.path.endsWith('GuideIaEntreprise.tsx'))
    expect(guide?.text).toContain('of1.price.oneShotHt')
    expect(guide?.text).toContain('of1.delay.days')
  })
})

describe('home: the product is on the surface (audit 2026-09-09)', () => {
  const hero = SOURCES.find((s) => s.path.endsWith('HeroSection.tsx'))
  const llms = SOURCES.find((s) => s.path.endsWith('llms.txt'))

  it('the hero renders the OF-1 title and no mock dashboard figure', () => {
    expect(hero?.text).toContain('of1.title')
    expect(hero?.text).not.toMatch(/€428k|48,200|Pipeline commercial · Mars/)
  })

  it('llms.txt states the offer price, delay, guarantee and the booking link of the site', () => {
    expect(llms?.text).toContain(eurHt(of1.price.oneShotHt))
    expect(llms?.text).toContain(`${of1.delay.days} jours`)
    expect(llms?.text).toContain(`${of1.price.monthlyHt} €/mois`)
    expect(llms?.text).toContain(site.bookingUrl)
    expect(llms?.text).toContain(`${of1.teamSize.min} à ${of1.teamSize.max}`)
  })
})

/**
 * The home's one quote is the text its author validated, kept in the hub's proof dossier
 * (temoignages/iapreneurs.md, row P-14). The site never carries a wording the hub does not: a
 * retouch made on one side only is exactly the drift this run was opened to close.
 */
describe('home: the testimonial is the hub text, word for word', () => {
  const HUB_TESTIMONIAL = resolve(HERE, '../../../../../../offre/preuve/temoignages/iapreneurs.md')
  /** Whitespace and Markdown blockquote markers collapse, so a wrapped `> ` line still matches. */
  const flat = (text: string) => text.replace(/^>\s?/gm, '').replace(/\s+/g, ' ').trim()

  it('the hub testimonial file exists next to this satellite', () => {
    expect(() => readFileSync(HUB_TESTIMONIAL, 'utf8')).not.toThrow()
  })

  it('quote and signature match the retained text of the hub file', () => {
    const hub = flat(readFileSync(HUB_TESTIMONIAL, 'utf8'))
    expect(hub).toContain(flat(TESTIMONIAL.quote))
    expect(hub).toContain(flat(TESTIMONIAL.who))
  })

  it('llms.txt carries the same quote', () => {
    const llms = SOURCES.find((s) => s.path.endsWith('llms.txt'))
    expect(flat(llms?.text ?? '')).toContain(flat(TESTIMONIAL.quote))
    expect(flat(llms?.text ?? '')).toContain(flat(TESTIMONIAL.who))
  })
})

/**
 * The proof line and the two training quotes Brice supplied on 2026-09-29 are rows P-15, P-16 and
 * P-17 of the hub's proof dossier. Each is compared to its dossier cell as a WHOLE: a word changed
 * on either side, a quote cut short or a credit that grows a surname goes red.
 */
describe('home: the proof line and the Formations quotes are the dossier rows, word for word', () => {
  const DOSSIER = resolve(HERE, '../../../../../../offre/preuve/dossier-de-preuve.md')
  /** The « Formulation publique » cell of a `| P-N | … |` row, whitespace collapsed. */
  const publicCell = (id: string) => {
    const row = readFileSync(DOSSIER, 'utf8')
      .split('\n')
      .find((line) => line.startsWith(`| ${id} |`))
    return (row?.split('|')[3] ?? '').replace(/\s+/g, ' ').trim()
  }

  it('the proof line is row P-15', () => {
    expect(publicCell('P-15')).toBe(PROOF_LINE)
  })

  it('the two quotes and their credits are rows P-16 and P-17', () => {
    expect(FORMATION_QUOTES).toHaveLength(2)
    const [vassili, franky] = FORMATION_QUOTES
    expect(publicCell('P-16')).toBe(`« ${vassili.quote} » ${vassili.who}.`)
    expect(publicCell('P-17')).toBe(`« ${franky.quote} » ${franky.who}.`)
  })

  it('a credit is a first name and a role, never a surname (dossier rule 6)', () => {
    for (const { who } of FORMATION_QUOTES) {
      expect(who).toMatch(/^[A-ZÀ-Ý][a-zà-ÿ]+, [a-zà-ÿ]/)
    }
  })
})

/**
 * The home speaks as « nous » since Brice's decision of 2026-09-18 (D10). The founder section left
 * the home on 2026-09-28 (decision 4); the founder is still named, never counted, in the Formations
 * proof line (« Notre fondateur est responsable pédagogique… »). Nothing on the page may suggest
 * employees that do not exist, nor fall back to the singular third person.
 */
describe('home: the voice is « nous » (A6)', () => {
  const llms = byName('llms.txt')

  it('the Formations section presents « Notre fondateur »', () => {
    expect(byName('FormationsSection.tsx')?.text).toContain('Notre fondateur')
  })

  for (const home of HOME_SOURCES) {
    it(`${home.path.split('/').slice(-1)[0]} never falls back to « lui »`, () => {
      expect(home.text).not.toMatch(/par lui|avec lui|tient lui-même/)
    })
  }

  it('llms.txt drops « tient lui-même » and speaks of « Notre fondateur »', () => {
    expect(llms?.text).not.toContain('tient lui-même')
    expect(llms?.text).toContain('Notre fondateur')
  })
})

/**
 * The Formations section (A3/A4/A5). Its words are Brice's, so they are asserted verbatim, and the
 * forbidden list is page-wide: the academy, the training company and the client whose seminar is
 * not delivered yet may not be named on a public surface, whatever the sentence around them.
 */
describe('home: the Formations section (A3/A4/A5)', () => {
  /**
   * The copy carries `&nbsp;` in JSX and U+00A0 once rendered, and JSX wraps a sentence across
   * source lines; assertions read one flat line of plain spaces, like the hub-parity guard above.
   */
  const flatNbsp = (text: string) =>
    text
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
  const formations = SOURCES.find((s) => s.path.endsWith('FormationsSection.tsx'))
  const llms = SOURCES.find((s) => s.path.endsWith('llms.txt'))

  const FORBIDDEN = [
    'IAPreneurs',
    'MASSA',
    'Chatflow',
    'Madeca',
    'OPCO',
    'Qualiopi',
    'Elorri',
    'convention de formation',
  ]

  it('carries the accroche Brice wrote, word for word', () => {
    const text = flatNbsp(formations?.text ?? '')
    expect(text).toContain(
      "Nous formons votre entreprise à l'IA, du comité de direction aux équipes.",
    )
    for (const title of ['Comex et Codir', 'Vos équipes', "Séminaires et journées d'entreprise"]) {
      expect(text).toContain(title)
    }
  })

  it('carries the proof Brice wrote, word for word', () => {
    const text = flatNbsp(formations?.text ?? '')
    expect(text).toContain(
      "Notre fondateur est responsable pédagogique d'une académie de plus de 1 400 entrepreneurs",
    )
    expect(text).toContain("formés à l'IA et à l'automatisation")
  })

  it('renders the quotes of the home, and the form anchor', () => {
    expect(formations?.text).toContain('TESTIMONIAL')
    expect(formations?.text).toContain('FORMATION_QUOTES.map')
    expect(formations?.text).toContain('id="contact"')
  })

  it('shows no price (A3)', () => {
    expect(formations?.text).not.toContain('€')
  })

  for (const source of SOURCES) {
    it(`${source.path.split('/').slice(-1)[0]} names none of the forbidden references`, () => {
      for (const word of FORBIDDEN) {
        expect(source.text.toLowerCase()).not.toContain(word.toLowerCase())
      }
    })
  }

  it('llms.txt states the offer is on request, without a published price (A9)', () => {
    expect(llms?.text).toContain('Séminaires et formations : sur demande, prix non publié')
  })
})

/**
 * AC-1 reads the Landing source, not the rendered page. The order is the grill's (2026-09-28,
 * decision 3: first screen, CRM strip, offer, Formations, final call), and the only way to change
 * it is to change this list on purpose.
 */
describe('home: the sections come in the brief order (AC-1)', () => {
  const EXPECTED = [
    'HeroSection',
    'CRMStrip',
    'OffreSection',
    'FormationsSection',
    'CalloutSection',
  ]

  it('Landing.tsx renders them in that order inside <main>', () => {
    const landing = readFileSync(resolve(HERE, '../../pages/Landing.tsx'), 'utf8')
    const main = landing.slice(landing.indexOf('<main>'), landing.indexOf('</main>'))
    const rendered = Array.from(main.matchAll(/<([A-Z][A-Za-z0-9]*)\s*\/>/g)).map((m) => m[1])
    expect(rendered).toEqual(EXPECTED)
  })
})

/**
 * The home of 2026-09-28 (grill decisions 3 to 6). Decision 5 was reversed by Brice the same day:
 * the offer card SHOWS the delivery delay, but only as `of1.delay.days`, so the day the offer's
 * delay changes the home follows or this goes red. A delay typed by hand on the home is the defect.
 */
describe('home: the offer section of 2026-09-28', () => {
  const offre = byName('OffreSection.tsx')
  const home = byName('home.ts')
  const nav = byName('TopNav.tsx')

  it('the home delay comes from the module, never a literal', () => {
    // Built from the module (and never spelled out here, so the plan's AC-3 grep over this folder
    // does not match its own guard): a typed « N jours » is caught whatever the delay becomes.
    const TYPED_DELAY = new RegExp(`${of1.delay.days}(\\s|&nbsp;|\\u00a0)jours|sept\\s+jours`)
    expect(offre?.text).toContain('of1.delay.days')
    for (const s of HOME_SOURCES) {
      expect(s.text, s.path).not.toMatch(TYPED_DELAY)
    }
  })

  it('carries the one-sentence proof line, no call figure, and renders the guarantee from the module', () => {
    // Brice, 2026-09-29, on the preview: « ne parle pas d'appels ». The call and meeting figures
    // (dossier rows P-7, P-8) left the home; the line is row P-15, pinned in the block below.
    expect(home?.text).toContain('PROOF_LINE')
    expect(offre?.text).toContain('frenchSpacing(PROOF_LINE)')
    for (const s of HOME_SOURCES) {
      expect(s.text, s.path).not.toMatch(/289|326|68 rendez-vous|Déjà en production/)
    }
    expect(offre?.text).toContain('{of1.guarantee}')
  })

  it('embeds the video on youtube-nocookie, mounted only after a click', () => {
    expect(offre?.text).toContain('youtube-nocookie.com/embed/')
    expect(offre?.text).toContain('useState')
  })

  it('sells nothing the grill took off the home', () => {
    for (const s of HOME_SOURCES) {
      expect(s.text, s.path).not.toMatch(/Bientôt : la relance|€\/mois|par mois/)
    }
  })

  it('the nav has the three items of decision 3, in order, and none of the old ones', () => {
    const text = nav?.text ?? ''
    const offer = text.indexOf("{ label: 'Offre', href: OF1_ROUTE }")
    const formations = text.indexOf("{ label: 'Formations', href: '/#formations' }")
    const ressources = text.indexOf("{ label: 'Ressources', href: '/ressources' }")
    expect(offer).toBeGreaterThan(-1)
    expect(formations).toBeGreaterThan(offer)
    expect(ressources).toBeGreaterThan(formations)
    expect(text).not.toMatch(/label: '(Cas clients|Contact|Offres)'/)
  })

  it('the two new sentences exist once, in home.ts, and nowhere else', () => {
    for (const sentence of [PROOF_LINE, FINAL_CALL_TITLE]) {
      const holders = SOURCES.filter((s) => s.text.includes(sentence))
      expect(holders.map((s) => s.path.split('/').slice(-1)[0])).toEqual(['home.ts'])
      expect(home?.text.split(sentence)).toHaveLength(2)
    }
  })
})
