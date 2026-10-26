/** State of the path section while its sequence plays (the mockup's `tl`, `tlTo`, `tags`, `conf`, `sum`, `rail`). */
export interface TlState {
  /** Steps lit (step i is on while tl > i). */
  tl: number
  /** Step the rail is heading to (-1 = none yet). */
  tlTo: number
  /** Task tags landed. */
  tags: number
  /** Delegated tasks confirmed (« À confier » → « Confiée »). */
  conf: number
  sum: boolean
  /** Phones: the tasks row the rail is on (-1 = none). */
  rail: number
}

export type TlPatch = Partial<TlState>

export const TL_START: TlState = { tl: 0, tlTo: -1, tags: 0, conf: 0, sum: false, rail: -1 }
export const TL_FINAL: TlState = { tl: 5, tlTo: 4, tags: 4, conf: 3, sum: true, rail: -1 }

/** The mockup's `playTl` chain as data: `[ms from start, patch]`, sorted. Phones shift everything after step 2 by 600 ms. */
export function timeline(phone: boolean): Array<[number, TlPatch]> {
  const o = phone ? 600 : 0
  const ev: Array<[number, TlPatch]> = []
  const reach = (i: number, ms: number) => {
    ev.push([ms, { tlTo: i }], [ms + 500, { tl: i + 1 }])
  }
  reach(0, 150)
  reach(1, 500)
  if (phone) {
    for (const [k, ms] of [1200, 2000, 2800, 4200].entries()) ev.push([ms, { rail: k }])
  }
  for (const [k, ms] of [1100, 1900, 2700, 4100].entries()) ev.push([ms + o, { tags: k + 1 }])
  reach(2, 4700 + o)
  for (const [k, ms] of [5300, 5900, 6500].entries()) ev.push([ms + o, { conf: k + 1 }])
  reach(3, 7000 + o)
  reach(4, 7700 + o)
  ev.push([8000 + o, { sum: true }])
  return ev.sort((a, b) => a[0] - b[0])
}

/** State the sequence has reached at `t` ms (pure, for tests and the virtual-time samples). */
export function applyAt(events: Array<[number, TlPatch]>, t: number): TlState {
  const s = { ...TL_START }
  for (const [ms, p] of events) if (ms <= t) Object.assign(s, p)
  return s
}

/** Height in px of the gold rail fill: the dot of the step being reached (dots are measured by `offsetTop`), or on phones the tasks row. */
export function tlHeight(s: TlState, dotY: number[], railY: number[]): number {
  if (s.tlTo === 1 && s.rail >= 0 && railY[s.rail]) return railY[s.rail] - 8
  if (s.tlTo >= 0 && dotY[s.tlTo]) return Math.max(0, dotY[s.tlTo] - 8)
  return 0
}
