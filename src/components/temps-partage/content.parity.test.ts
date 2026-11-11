/**
 * Parity guard: the offer page copy must never drift from the offer's source of truth.
 *
 * The source of truth is a HUB file (`projects/sablia/offre/temps-partage/offre.md`), five levels
 * above this folder. Reading it from here is deliberate: the page renders the offer, it does not
 * restate it. A price, the opening count, the engagement, the first-month clause, or a promise of
 * the three monthly sections changing there turns this test RED, and the page copy follows.
 *
 * The FAQ answers that quote the meeting script read `script-rdv.md`, beside `offre.md`.
 *
 * Outside the VPS working tree (a standalone clone, CI), point TEMPS_PARTAGE_PATH at the offer file
 * (the script must sit beside it). CI excludes this file because it needs the hub tree; it is never
 * skipped.
 *
 * Comparisons run on normalised spaces: the page glues amounts with no-break spaces (« 2 000 € HT »),
 * the source writes plain ones.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { REFERENT } from '../accompagnement/content'
import * as COPY from './content'
import { CHAQUE_MOIS, CONDITIONS, GARDEZ, HERO, PREMIER_MOIS, QUESTIONS, QUI } from './content'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_PATH = resolve(HERE, '../../../../../offre/temps-partage/offre.md')
const OFFRE_PATH = process.env.TEMPS_PARTAGE_PATH ?? DEFAULT_PATH
const SCRIPT_PATH = resolve(dirname(OFFRE_PATH), 'script-rdv.md')

for (const path of [OFFRE_PATH, SCRIPT_PATH]) {
  if (!existsSync(path)) {
    throw new Error(
      `Offer source of truth not found at ${path}. This test is hub-bound by design: ` +
        'set TEMPS_PARTAGE_PATH to the offer file (script-rdv.md beside it) to run it elsewhere. ' +
        'It is never skipped.',
    )
  }
}

const RAW = readFileSync(OFFRE_PATH, 'utf8')
const SCRIPT = readFileSync(SCRIPT_PATH, 'utf8')

/** No-break spaces (U+00A0, U+202F) become plain spaces, runs collapse, bold markers drop. */
function squash(text: string): string {
  return text
    .replaceAll('**', '')
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Body of a `## {heading}` section, up to the next `## ` heading. */
function section(heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // `$` is line-anchored under the `m` flag needed by `^## `, hence the explicit end-of-input.
  const end = '(?=\\n## |(?![\\s\\S]))'
  const found = RAW.match(new RegExp(`^## ${escaped}[^\\n]*\\n([\\s\\S]*?)${end}`, 'm'))
  if (found === null) throw new Error(`offre.md section "## ${heading}" not found at ${OFFRE_PATH}`)
  return found[1]
}

/** Bullets of a section, continuation lines folded in, spacing normalised. */
function bullets(body: string): string[] {
  const items: string[] = []
  for (const line of body.split(/\r?\n/)) {
    if (line.startsWith('- ')) items.push(line.slice(2))
    else if (line.trim().length === 0) {
      if (items.length > 0) break
    } else if (items.length > 0) items[items.length - 1] += ` ${line.trim()}`
  }
  return items.map(squash)
}

/** Paragraphs of a block of Markdown, continuation lines folded, spacing normalised. */
function paragraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map(squash)
    .filter((block) => block.length > 0)
}

/** One match, or a failure naming the anchor that vanished from its source file. */
function capture(
  source: string,
  pattern: RegExp,
  anchor: string,
  path: string = OFFRE_PATH,
): RegExpMatchArray {
  const found = source.match(pattern)
  if (found === null) throw new Error(`anchor "${anchor}" no longer matches in ${path}`)
  return found
}

/** « 2 000 » → 2000. */
function amount(text: string): number {
  return Number(text.replace(/\s/g, ''))
}

const FR_NUMBERS: Record<string, number> = {
  un: 1,
  une: 1,
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  six: 6,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,
}

/** « 48 » or « Deux » → 48 or 2; anything else → undefined (a duration the test cannot read fails). */
function count(token: string): number | undefined {
  return /^\d+$/.test(token) ? Number(token) : FR_NUMBERS[token.toLowerCase()]
}

/** Every amount followed by « € » or « euros », as numbers. */
function amounts(text: string): Set<number> {
  return new Set(
    [...squash(text).matchAll(/(\d[\d ]*\d|\d) ?(?:€|euros?\b)/gi)].map((hit) => amount(hit[1])),
  )
}

/** Every « N jours » / « N heures » of a text, as [unit, the word before it]. */
function durations(text: string): [string, string][] {
  return [...squash(text).matchAll(/([\p{L}\d]+) (jours|heures)\b/giu)].map((hit) => [
    hit[2].toLowerCase(),
    hit[1],
  ])
}

const TITLE = capture(RAW, /^# (.+)$/m, '# title')[1].trim()
/** The two paragraphs between the title and the first `## ` section. */
const PREAMBLE = paragraphs(capture(RAW, /^# .+\n([\s\S]*?)\n## /m, 'preamble')[1])
const CONDITION_BULLETS = bullets(section('Conditions'))

describe('offer parity: the page opens on the offer', () => {
  it('names the role of the offer title in the h1, with Rouen', () => {
    expect(squash(HERO.h1)).toContain(TITLE)
    expect(HERO.h1).toContain('Rouen')
  })

  it('renders the promise and the audience sentence word for word', () => {
    expect(PREAMBLE).toHaveLength(2)
    expect(squash(HERO.lede)).toBe(PREAMBLE[0])
    expect(squash(HERO.audience)).toBe(PREAMBLE[1])
  })

  it('states the same company size in the facts', () => {
    const [, min, max] = capture(PREAMBLE[1], /(\d+) à (\d+) personnes/, 'N à N personnes')
    const forWhom = HERO.facts.find((fact) => fact.key === 'pour-qui')
    expect(forWhom?.value).toContain(`${min} à ${max} personnes`)
  })
})

describe('offer parity: § Conditions', () => {
  it('carries the four bullets, in order, word for word', () => {
    expect(CONDITION_BULLETS).toHaveLength(4)
    expect(CONDITIONS.items.map((item) => squash(item.text))).toEqual(CONDITION_BULLETS)
  })

  it('carries the first-month clause word for word, without normalising', () => {
    const clause = CONDITION_BULLETS.find((bullet) => bullet.startsWith('Si le premier mois'))
    if (clause === undefined) throw new Error('offre.md § Conditions lost its first-month clause')
    expect(CONDITIONS.items.map((item) => item.text)).toContain(clause)
  })

  it('pins the offer of 11/11 as numbers', () => {
    expect(CONDITIONS.price).toEqual({
      monthlyHt: 2000,
      openingHt: 1500,
      openingCount: 5,
      engagementMonths: 3,
    })
  })

  it('reads the same numbers in offre.md', () => {
    const monthly = capture(
      CONDITION_BULLETS[0],
      /^(\d[\d ]*) € HT par mois\.$/,
      'N € HT par mois.',
    )
    expect(amount(monthly[1])).toBe(CONDITIONS.price.monthlyHt)

    const opening = capture(
      CONDITION_BULLETS[1],
      /^Prix d'ouverture : (\d[\d ]*) € HT par mois pour les (\w+) premières entreprises/,
      "Prix d'ouverture : N € HT par mois pour les N premières entreprises",
    )
    expect(amount(opening[1])).toBe(CONDITIONS.price.openingHt)
    expect(FR_NUMBERS[opening[2]]).toBe(CONDITIONS.price.openingCount)

    const engagement = capture(
      CONDITION_BULLETS[2],
      /^Engagement de (\w+) mois, puis résiliable chaque mois\.$/,
      'Engagement de N mois, puis résiliable chaque mois.',
    )
    expect(FR_NUMBERS[engagement[1]]).toBe(CONDITIONS.price.engagementMonths)
  })

  it('shows the monthly price and the engagement in the hero facts', () => {
    const price = HERO.facts.find((fact) => fact.key === 'prix')
    const engagement = HERO.facts.find((fact) => fact.key === 'engagement')
    expect(squash(`${price?.value}.`)).toBe(CONDITION_BULLETS[0])
    expect(squash(engagement?.value ?? '').toLowerCase()).toBe(
      CONDITION_BULLETS[2]
        .replace(/^Engagement de /, '')
        .replace(/\.$/, '')
        .toLowerCase(),
    )
  })

  // The WHOLE module (META, the Google snippet, ROLE and FIN included): an amount typed by hand
  // anywhere escapes `PRICE` (offer-page review F6 #2).
  it('names no amount in the copy module other than the two prices of offre.md', () => {
    const offered = amounts(CONDITION_BULLETS.join(' '))
    expect([...offered].sort()).toEqual([1500, 2000])
    expect([...amounts(JSON.stringify(COPY))].sort()).toEqual([...offered].sort())
  })

  it('names no amount on /accompagnement other than the two prices of offre.md', () => {
    const offered = amounts(CONDITION_BULLETS.join(' '))
    for (const shown of amounts(REFERENT.more.text)) expect(offered).toContain(shown)
  })
})

/**
 * § Chaque mois ensuite gives the offer's two durations (« Deux jours de travail », « 48 heures
 * ouvrées »); every « N jours » and « N heures » restated elsewhere (META, ROLE, the questions, the
 * sentence of /accompagnement that links here) must say the same (offer-page review F6 #2).
 */
describe('offer parity: every duration restated is the one of § Chaque mois ensuite', () => {
  const offered = new Map<string, number | undefined>()
  for (const [unit, word] of durations(section('Chaque mois ensuite'))) {
    if (offered.has(unit) && offered.get(unit) !== count(word))
      throw new Error(`offre.md § Chaque mois ensuite gives two numbers of ${unit}`)
    offered.set(unit, count(word))
  }

  it('reads one number of days and one number of hours in offre.md', () => {
    expect(offered.get('jours')).toBeGreaterThan(0)
    expect(offered.get('heures')).toBeGreaterThan(0)
  })

  const restated: readonly (readonly [string, string])[] = [
    ['the copy module', JSON.stringify(COPY)],
    ['REFERENT.more on /accompagnement', REFERENT.more.text],
  ]
  for (const [where, text] of restated) {
    it(`${where}: every « N jours » and « N heures » is the offer's`, () => {
      const found = durations(text)
      expect(found.length).toBeGreaterThan(0)
      for (const [unit, word] of found)
        expect(count(word), `${where}: « ${word} ${unit} »`).toBe(offered.get(unit))
    })
  }
})

/**
 * The three monthly sections: the page may adapt a word, so each bullet is compared on the key
 * nouns and numbers below. Every anchor must still be in offre.md (a stale anchor fails) and in
 * the page item of the same rank (a dropped promise fails). Case-insensitive on normalised spaces.
 */
const SECTIONS: readonly {
  heading: string
  items: readonly { text: string }[]
  anchors: readonly (readonly string[])[]
}[] = [
  {
    heading: 'Le premier mois',
    items: PREMIER_MOIS.items,
    anchors: [
      [
        'diagnostic chiffré',
        'parcours client',
        'vous découvrent',
        'vous contactent',
        'signent',
        'reviennent',
        "l'étape qui coince",
      ],
      [
        'premier outil',
        'votre équipe',
        'avant la fin du mois',
        "dans l'heure",
        'compte rendu',
        'CRM',
        'relances',
      ],
    ],
  },
  {
    heading: 'Chaque mois ensuite',
    items: CHAQUE_MOIS.items,
    anchors: [
      ['Deux jours', "l'étape suivante"],
      ['séance', 'votre équipe', "l'outil de tous"],
      ['suivi', 'je vérifie', 'je corrige', 'je mets à jour'],
      ['par mail', '48 heures ouvrées'],
    ],
  },
  {
    heading: 'Ce que vous gardez',
    items: GARDEZ.items,
    anchors: [
      ['vos propres comptes', 'propriétaire des outils', 'vos données restent chez vous'],
      ['avant et après', "chiffres à l'appui"],
      ['Rien de technique', 'je construis', "votre équipe s'en sert"],
    ],
  },
]

describe('offer parity: the three monthly sections', () => {
  for (const { heading, items, anchors } of SECTIONS) {
    it(`§ ${heading}: the same number of bullets as offre.md`, () => {
      expect(items).toHaveLength(bullets(section(heading)).length)
      expect(anchors).toHaveLength(items.length)
    })

    it(`§ ${heading}: every bullet keeps its key nouns and numbers`, () => {
      const source = bullets(section(heading))
      anchors.forEach((words, rank) => {
        for (const word of words) {
          expect(source[rank].toLowerCase(), `offre.md § ${heading} #${rank + 1}`).toContain(
            word.toLowerCase(),
          )
          expect(
            squash(items[rank].text).toLowerCase(),
            `page § ${heading} #${rank + 1}`,
          ).toContain(word.toLowerCase())
        }
      })
    })
  }
})

describe('offer parity: § Qui je suis', () => {
  it('renders the paragraph word for word, title then text', () => {
    expect(squash(`${QUI.title} ${QUI.text}`)).toBe(paragraphs(section('Qui je suis'))[0])
  })

  it('links the school named in the text', () => {
    expect(QUI.text).toContain(QUI.school.link)
  })
})

describe('offer parity: the questions quote the offer', () => {
  const answers = QUESTIONS.items.map((item) => squash(item.a))

  it('answers the first-month question with the clause of § Conditions', () => {
    const tail = capture(
      CONDITION_BULLETS[3],
      /vous arrêtez là et (.+)\.$/,
      'vous arrêtez là et ...',
    )[1]
    expect(answers.some((a) => a.includes(tail))).toBe(true)
  })

  it('answers the price question with the prices and terms of § Conditions', () => {
    const price = answers.find((a) => a.includes('€'))
    expect(price).toBeDefined()
    expect(price).toContain(CONDITION_BULLETS[0].replace(/\.$/, ''))
    expect(price).toContain(
      capture(CONDITION_BULLETS[1], /(\d[\d ]*€ HT par mois)/, 'opening price')[1],
    )
    expect(price).toContain(
      capture(CONDITION_BULLETS[1], /(en échange d'un bilan .+)\.$/, 'bilan')[1],
    )
    // the engagement, without its « Engagement de » (offer-page review F6 #2)
    expect(price?.toLowerCase()).toContain(
      CONDITION_BULLETS[2]
        .replace(/^Engagement de /, '')
        .replace(/\.$/, '')
        .toLowerCase(),
    )
  })
})

/**
 * Answers built from the meeting script (`script-rdv.md`, § 4 and § 6). Offer-page review and AC-24
 * evaluation of 11/11: an answer says what I do, never what others do, and keeps the script's words
 * where it quotes them (no widening of « de votre taille » to a size range).
 */
describe('offer parity: the questions quote the meeting script', () => {
  const answerTo = (question: string): string => {
    const found = QUESTIONS.items.find((item) => item.q === question)
    if (found === undefined) throw new Error(`the page lost the question « ${question} »`)
    return squash(found.a)
  }

  it("answers « Deux jours par mois, c'est assez ? » with the script's objection answer, the oral extra day left out", () => {
    const quote = squash(
      capture(
        SCRIPT,
        /« Deux jours, c'est peu »\*\*\s*:\s*«\s*(.+?)\s*»\s*$/m,
        "Deux jours, c'est peu",
        SCRIPT_PATH,
      )[1],
    )
    const said = quote
      .split(/(?<=\.) /)
      .filter((sentence) => !sentence.includes('€'))
      .join(' ')
    expect(said).toContain('deux jours suffisent')
    expect(answerTo("Deux jours par mois, c'est assez ?")).toBe(said)
  })

  it('answers « Quelle différence avec un consultant IA ? » with what I do, from the offer and the script', () => {
    const answer = answerTo('Quelle différence avec un consultant IA ?')
    const sources: readonly (readonly [string, string])[] = [
      [bullets(section('Le premier mois'))[0], "l'étape qui coince"],
      [bullets(section('Le premier mois'))[1], 'avant la fin du mois'],
      [bullets(section('Ce que vous gardez'))[0], 'vos propres comptes'],
      [
        squash(capture(SCRIPT, /^- \*\*Entretenir\*\*.+$/m, '**Entretenir**', SCRIPT_PATH)[0]),
        "chaque mois à l'étape suivante",
      ],
    ]
    for (const [source, words] of sources) {
      expect(source.toLowerCase(), `source of « ${words} »`).toContain(words)
      expect(answer.toLowerCase(), `answer « ${words} »`).toContain(words)
    }
    expect(answer).not.toMatch(/recommandation|je ne m'arrête/i)
  })
})
