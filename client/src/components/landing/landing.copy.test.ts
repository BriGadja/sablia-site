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
import { OF1_ROUTE, of1 } from '../../content/of1'
import { eurHt } from '../../lib/format'
import { site } from '../../lib/site'
import { FAQ } from './FaqSection'
import { TESTIMONIAL } from './FormationsSection'
import { STEPS } from './ProcessSection'

const HERE = dirname(fileURLToPath(import.meta.url))
const SOURCES = [
  resolve(HERE, 'FaqSection.tsx'),
  resolve(HERE, 'ProcessSection.tsx'),
  resolve(HERE, 'CalloutSection.tsx'),
  resolve(HERE, 'HeroSection.tsx'),
  resolve(HERE, 'CatalogueSection.tsx'),
  resolve(HERE, 'TeamSection.tsx'),
  resolve(HERE, 'ProofSection.tsx'),
  resolve(HERE, 'ProblemsSection.tsx'),
  resolve(HERE, 'TopNav.tsx'),
  resolve(HERE, 'FormationsSection.tsx'),
  resolve(HERE, 'ContactForm.tsx'),
  resolve(HERE, 'FooterSection.tsx'),
  resolve(HERE, '../../pages/GuideIaEntreprise.tsx'),
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

const CONSENT_SCOPED = ['ProofSection.tsx', 'llms.txt']

/**
 * The home's proof section stopped being a testimonials section on 2026-09-17, and the nav label
 * kept promising testimonials for a while. A label that describes a section it no longer matches
 * is the cheap half of the same defect the name guard exists for.
 */
const PROOF_NAV_LABEL = 'Cas clients'

const faqText = FAQ.map((item) => `${item.q} ${item.a}`).join('\n')
const stepsText = STEPS.map((step) => `${step.title} ${step.desc} ${step.dur}`).join('\n')

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

describe('home: the nav describes the section it points at', () => {
  it('labels the proof anchor by what the section actually shows', () => {
    const nav = SOURCES.find((s) => s.path.endsWith('TopNav.tsx'))
    expect(nav?.text).toContain(`{ label: '${PROOF_NAV_LABEL}', href: '/#proof' }`)
    expect(nav?.text).not.toMatch(/label: 'T[ée]moignages'/)
  })
})

describe('landing copy: the figures are the offer figures', () => {
  it('the FAQ prices the catalogue offer at OF-1 price and delay, and names the brick floor', () => {
    expect(faqText).toContain(eurHt(of1.price.oneShotHt))
    expect(faqText).toContain(`${of1.price.monthlyHt} € HT`)
    expect(faqText).toContain(`${of1.delay.days} jours`)
    expect(faqText).toContain(eurHt(of1.price.brickFloorHt))
  })

  it('the FAQ links to the product page', () => {
    expect(FAQ.some((item) => item.href === OF1_ROUTE)).toBe(true)
  })

  it('the process states the offer delay and the recurring fee', () => {
    expect(stepsText).toContain(`${of1.delay.days} jours`)
    expect(stepsText).toContain(`${of1.price.monthlyHt} €`)
  })

  it('the process no longer promises training beyond what OF-1 includes', () => {
    expect(stepsText.toLowerCase()).not.toContain('formation')
    const processSource = SOURCES.find((s) => s.path.endsWith('ProcessSection.tsx'))
    expect(processSource?.text.toLowerCase()).not.toContain('formons')
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
 * The home speaks as « nous » since Brice's decision of 2026-09-18 (D10). The founder section is
 * included: the visitor never reads the size of the team, and the founder is named, not counted.
 * Nothing on the page may suggest employees that do not exist — which is why the guard is a ban on
 * the singular third person in that one section, not a demand for a plural noun somewhere.
 */
describe('home: the voice is « nous » (A6)', () => {
  const team = SOURCES.find((s) => s.path.endsWith('TeamSection.tsx'))
  const llms = SOURCES.find((s) => s.path.endsWith('llms.txt'))

  it('the founder section presents « Notre fondateur », never « lui »', () => {
    expect(team?.text).toContain('Notre fondateur')
    expect(team?.text).not.toMatch(/\blui\b/)
    expect(team?.text).not.toMatch(/par lui|avec lui/)
  })

  it('the founder section promises one reachable interlocutor', () => {
    expect(team?.text).toContain('joignable directement pendant la mission')
  })

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

  it('renders the one quote of the home, and the form anchor', () => {
    expect(formations?.text).toContain('TESTIMONIAL')
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
 * AC-1 reads the Landing source, not the rendered page: a rendered count would also count
 * `CRMStrip`, which the brief's section list does not. The order is the brief's, and the only way
 * to change it is to change this list on purpose.
 */
describe('home: the sections come in the brief order (AC-1)', () => {
  const EXPECTED = [
    'HeroSection',
    'CRMStrip',
    'CatalogueSection',
    'ProblemsSection',
    'ProcessSection',
    'TeamSection',
    'ProofSection',
    'FormationsSection',
    'CalloutSection',
    'FaqSection',
  ]

  it('Landing.tsx renders them in that order inside <main>', () => {
    const landing = readFileSync(resolve(HERE, '../../pages/Landing.tsx'), 'utf8')
    const main = landing.slice(landing.indexOf('<main>'), landing.indexOf('</main>'))
    const rendered = Array.from(main.matchAll(/<([A-Z][A-Za-z0-9]*)\s*\/>/g)).map((m) => m[1])
    expect(rendered).toEqual(EXPECTED)
  })
})
