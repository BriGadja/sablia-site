/** Copy and data of the Formations hero configurator (mockup Formations.dc.html DCLogic, « je » voice). */

export const EYEBROW = 'Formations'
export const H1 = 'Une formation construite sur votre quotidien.'
export const CLAIM = "Votre secteur, vos cas d'usage, votre aisance avec l'IA : chaque séance part de là."
export const FREE = 'Gratuit, sans engagement.'
export const TAGS = ['Sur site ou à distance', 'De la matinée au cycle de plusieurs semaines', 'Aucun prérequis technique']

export const CFG_TITLE = 'Composez la vôtre'
export const PG_TITLE = 'Votre programme'
export const EX_LABEL = 'Exemple travaillé en séance :'

export const SECTORS = [
  { t: 'Conseil', ex: "une réponse à un appel d'offres" },
  { t: 'Industrie et BTP', ex: "une demande d'intervention" },
  { t: 'Services', ex: 'une demande de devis' },
  { t: 'Commerce', ex: 'la relance d’un client' },
  { t: 'Numérique', ex: 'un ticket de support' },
] as const

export const USES = [
  { t: 'Mails et comptes rendus', m: ['Vos mails et comptes rendus avec Claude', 'Un modèle de compte rendu à votre format'] },
  { t: 'Recrutement et propositions', m: ['Des offres et propositions à votre ton', 'Trier et résumer des candidatures'] },
  { t: 'Prospection et CRM', m: ['Préparer un rendez-vous client', 'Claude branché sur votre CRM'] },
  { t: 'Code et outils internes', m: ['Claude Code dans vos dépôts', 'Tests et revue automatisés'] },
] as const

/** One level vocabulary on the whole site: Débutant / À l'aise / Avancé (CP4 14). */
export const LEVELS = [
  { t: 'Débutant', a: 'Premiers pas : bien demander à Claude', z: 'Les bons réflexes : données et relecture' },
  { t: "À l'aise", a: 'Projets, instructions et documents', z: 'Automatiser une tâche de bout en bout' },
  { t: 'Avancé', a: 'Skills, connecteurs et MCP', z: 'Des agents qui travaillent pour vous' },
] as const

export type Pick3 = { s: number; u: number; l: number }

/**
 * What the auto-demo cycles through, starting from the first paint (START): the mockup's three profiles with
 * profile 2 (Numérique) replaced by Industrie et BTP (CP4 4), so BTP, Commerce, then back to START.
 */
export const PROFILES: readonly Pick3[] = [
  { s: 1, u: 0, l: 1 },
  { s: 3, u: 2, l: 1 },
  { s: 0, u: 1, l: 0 },
]

/** The programme shown on first paint (and settled under reduced motion). */
export const START: Pick3 = { s: 0, u: 1, l: 0 }

export const FIRST_CHANGE_MS = 1500
export const HOLD_MS = 7000
export const STEP_MS = 900

export type Cfg = Pick3 & {
  ps: number
  pu: number
  pl: number
  /** Per-row change counters: odd/even flips between the two roll animations. */
  rv: [number, number, number, number, number]
}

export const initialCfg = (p: Pick3 = START): Cfg => ({ ...p, ps: p.s, pu: p.u, pl: p.l, rv: [0, 0, 0, 0, 0] })

const ROWS_OF = { s: [4], u: [1, 2], l: [0, 3] } as const

export function choose(c: Cfg, key: 's' | 'u' | 'l', i: number): Cfg {
  if (c[key] === i) return c
  const rv = [...c.rv] as Cfg['rv']
  for (const r of ROWS_OF[key]) rv[r]++
  return { ...c, [key]: i, [`p${key}`]: c[key], rv }
}

export type ProgramRow = { n: string; t: string; old: string; flip: '' | 'sa' | 'sb'; late: boolean }

const flipOf = (n: number): '' | 'sa' | 'sb' => (n === 0 ? '' : n % 2 ? 'sa' : 'sb')

export function derive(c: Cfg) {
  const L = LEVELS[c.l]
  const U = USES[c.u]
  const Lp = LEVELS[c.pl]
  const Up = USES[c.pu]
  const now = [L.a, U.m[0], U.m[1], L.z]
  const old = [Lp.a, Up.m[0], Up.m[1], Lp.z]
  const rows: ProgramRow[] = now.map((t, i) => ({
    n: `0${i + 1}`,
    t,
    old: old[i],
    flip: flipOf(c.rv[i]),
    late: i === 2,
  }))
  return {
    rows,
    ex: SECTORS[c.s].ex,
    exOld: SECTORS[c.ps].ex,
    exFlip: flipOf(c.rv[4]),
    summary: `${SECTORS[c.s].t} · ${L.t}`,
  }
}
