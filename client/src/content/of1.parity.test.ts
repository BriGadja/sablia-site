/**
 * Parity guard: the typed OF-1 module must never drift from the offer's source of truth.
 *
 * The source of truth is a HUB file (`projects/sablia/offre/of-1-compte-rendu-appel.md`), five
 * levels above this repo. Reading it from here is deliberate: the page renders the offer, it does
 * not restate it. A price, a delay, the guarantee, the team size, the CRM list or the
 * included/excluded counts changing there turns this test RED.
 *
 * Outside the VPS working tree (a standalone clone, a future CI), point OF1_PATH at the file.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { of1 } from './of1'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_OF1_PATH = resolve(HERE, '../../../../../offre/of-1-compte-rendu-appel.md')
const OF1_PATH = process.env.OF1_PATH ?? DEFAULT_OF1_PATH

if (!existsSync(OF1_PATH)) {
  throw new Error(
    `OF-1 source of truth not found at ${OF1_PATH}. This test is hub-bound by design: ` +
      'set OF1_PATH to the offer file to run it elsewhere. It is never skipped.',
  )
}

const RAW = readFileSync(OF1_PATH, 'utf8')

/** Minimal `key: value` frontmatter reader : no new dependency for ten flat lines. */
function frontmatter(source: string): Record<string, string> {
  const block = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (block === null) throw new Error(`OF-1 at ${OF1_PATH} has no YAML frontmatter`)
  const fields: Record<string, string> = {}
  for (const line of block[1].split(/\r?\n/)) {
    const pair = line.match(/^([a-z_]+):\s*(.*)$/)
    if (pair !== null) fields[pair[1]] = pair[2].trim()
  }
  return fields
}

/** Body of a `## {heading}` section, up to the next `## ` heading. */
function section(source: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // `$` is line-anchored under the `m` flag needed by `^## `, hence the explicit end-of-input.
  const end = '(?=\\n## |(?![\\s\\S]))'
  const found = source.match(new RegExp(`^## ${escaped}[^\\n]*\\n([\\s\\S]*?)${end}`, 'm'))
  if (found === null) throw new Error(`OF-1 section "## ${heading}" not found at ${OF1_PATH}`)
  return found[1]
}

function bulletCount(body: string): number {
  return body.split(/\r?\n/).filter((line) => line.startsWith('- ')).length
}

/** One match group, or a failure naming the anchor that vanished from OF-1. */
function capture(source: string, pattern: RegExp, anchor: string): RegExpMatchArray {
  const found = source.match(pattern)
  if (found === null) throw new Error(`OF-1 anchor "${anchor}" no longer matches at ${OF1_PATH}`)
  return found
}

const FR_NUMBERS: Record<string, number> = { une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5 }

const FM = frontmatter(RAW)

describe('OF-1 parity: frontmatter', () => {
  it('carries the offer id and title of the module', () => {
    expect(FM.id).toBe(of1.id)
    expect(FM.titre).toBe(of1.title)
  })

  it('carries the one-shot price, the monthly price and the free first month', () => {
    expect(Number(FM.prix_one_shot)).toBe(of1.price.oneShotHt)
    expect(Number(FM.prix_mensuel)).toBe(of1.price.monthlyHt)
    expect(FM.premier_mois_offert === 'true').toBe(of1.price.firstMonthFree)
  })

  it('carries the delivery delay and the Sablia work-day ceiling', () => {
    expect(Number(FM.delai_jours)).toBe(of1.delay.days)
    expect(Number(FM.plafond_travail_jours)).toBe(of1.delay.sabliaWorkDaysMax)
  })

  it('carries the Claude monthly call allowance and the brick prices', () => {
    expect(Number(FM.claude_appels_inclus_par_mois)).toBe(of1.price.claudeCallsPerMonth)
    expect(Number(FM.prix_brique)).toBe(of1.price.brickHt)
    expect(Number(FM.prix_brique_plancher)).toBe(of1.price.brickFloorHt)
  })
})

describe('OF-1 parity: body', () => {
  it('states the same deposit percentage', () => {
    const found = capture(RAW, /Acompte de (\d+) %/, 'Acompte de N %')
    expect(Number(found[1])).toBe(of1.price.depositPct)
  })

  it('states the same included bricks and extra-brick price', () => {
    const found = capture(
      RAW,
      /Jusqu'à (une|deux|trois|quatre|cinq) briques\. Au-delà, (\d+) €\/mois/,
      "Jusqu'à N briques. Au-delà, N €/mois",
    )
    expect(FR_NUMBERS[found[1]]).toBe(of1.price.bricksIncluded)
    expect(Number(found[2])).toBe(of1.price.extraBrickMonthlyHt)
  })

  it('lists the same CRMs, in the same order', () => {
    const found = capture(RAW, /CRM couverts : (.+)\./, 'CRM couverts : ...')
    expect(found[1].split(', ')).toEqual([...of1.crms])
  })

  it('targets the same team size', () => {
    const found = capture(section(RAW, 'Pour qui'), /(\d+) à (\d+) personnes/, 'N à N personnes')
    expect(Number(found[1])).toBe(of1.teamSize.min)
    expect(Number(found[2])).toBe(of1.teamSize.max)
  })

  it('states the same delivery delay in the body', () => {
    const found = capture(RAW, /Livré sous (\d+) jours/, 'Livré sous N jours')
    expect(Number(found[1])).toBe(of1.delay.days)
  })

  it('carries the guarantee sentence word for word', () => {
    const paragraph = section(RAW, 'Garantie')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ')
    expect(paragraph).toBe(of1.guarantee)
  })

  it('lists the same number of included items', () => {
    expect(bulletCount(section(RAW, 'Ce qui est inclus'))).toBe(of1.included.length)
  })

  it('lists the same number of excluded items', () => {
    expect(bulletCount(section(RAW, 'Ce qui est EXCLU'))).toBe(of1.excluded.length)
  })
})
