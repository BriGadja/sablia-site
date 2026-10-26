import { BULLETINS, CHAR_MS, FACTURE_AMOUNTS, HOLD_MS, JOBS, LEADS } from './content'
import { type FlowState, sceneReset } from './state'

export interface ScriptDeps {
  set: (patch: Partial<FlowState> | ((s: FlowState) => Partial<FlowState>)) => void
  wait: (ms: number) => Promise<void>
  /** Pixel x (inside the lead scene) where the envelope lands on the receiver's avatar, null on phones. */
  envTarget: (member: number) => number | null
}

async function leads({ set, wait, envTarget }: ScriptDeps) {
  for (let n = 0; n < LEADS.length; n++) {
    const lead = LEADS[n]
    set({ lN: n, lIn: false, lAttr: false, lR: [0, 0, 0], lEnv: 0, lMsg: -1 })
    await wait(300)
    set({ lIn: true })
    await wait(800)
    set({ lAttr: true })
    await wait(700)
    for (let r = 0; r <= lead.m; r++) {
      const rules = [0, 0, 0]
      for (let q = 0; q < r; q++) rules[q] = 1
      rules[r] = r === lead.m ? 2 : 1
      set({ lR: rules })
      await wait(550)
    }
    set({ lEnv: 1, lRow: lead.m, lX: envTarget(lead.m) })
    await wait(40)
    set({ lEnv: 2 })
    await wait(1000)
    set((s) => {
      const lCnt = s.lCnt.slice()
      lCnt[lead.m] += 1
      return { lEnv: 0, lCnt, lMsg: n }
    })
    await wait(n === 0 ? 3600 : 600)
  }
}

async function veille({ set, wait }: ScriptDeps) {
  await wait(700)
  set({ vT: 1 })
  await wait(700)
  for (let i = 0; i < 9; i++) {
    set({ vScan: i })
    await wait(300)
  }
  set({ vScan: 9, vKeep: true })
  await wait(900)
  for (let b = 1; b <= BULLETINS.length; b++) {
    set({ vBul: b })
    await wait(1200)
  }
  set({ vSent: true })
}

async function intervention({ set, wait }: ScriptDeps) {
  await wait(300)
  set({ iMail: true })
  await wait(900)
  for (let h = 1; h <= 3; h++) {
    set({ iHl: h })
    await wait(700)
  }
  set({ iStack: 1 })
  await wait(800)
  set({ iFlip: true })
  await wait(270)
  set({ iDoc: 1, iFlip: false })
  await wait(600)
  set({ iBonT: true })
  await wait(800)
  set({ iStamp: true })
  await wait(1000)
  set({ iStack: 2 })
  await wait(600)
  set({ iFlip: true })
  await wait(270)
  set({ iDoc: 2, iStamp: false, iFlip: false })
  await wait(400)
  let tot = 0
  for (let n = 0; n < FACTURE_AMOUNTS.length; n++) {
    set({ iFa: n + 1 })
    const from = tot
    tot += FACTURE_AMOUNTS[n]
    for (let s = 1; s <= 8; s++) {
      set({ iTot: from + ((tot - from) * s) / 8 })
      await wait(45)
    }
    await wait(350)
  }
  set({ iStack: 3 })
}

async function seance({ set, wait }: ScriptDeps) {
  await wait(400)
  const marks: Record<number, number> = { 9: 1, 20: 2, 31: 3 }
  for (let k = 1; k <= 40; k++) {
    const patch: Partial<FlowState> = { sP: k / 40 }
    if (marks[k]) patch.sMk = marks[k]
    set(patch)
    await wait(110)
  }
  await wait(600)
  set({ sRelu: true })
  await wait(1000)
  set({ sMail: 1 })
  await wait(400)
  set({ sMail: 2 })
  await wait(850)
  set({ sMail: 3 })
}

async function request(deps: ScriptDeps, job: number) {
  const { set, wait } = deps
  const q = JOBS[job].request
  set({ job, shown: job, aPh: 'type', typed: 0, aStep: -1, outs: 0, bar: 0 })
  for (let c = 1; c <= q.length; c++) {
    set({ typed: c })
    await wait(CHAR_MS)
  }
  await wait(350)
  set({ aPh: 'send' })
  await wait(700)
  set({ aPh: 'think', bar: 1 })
  for (let s = 0; s < 3; s++) {
    set({ aStep: s })
    await wait(800)
  }
  set({ aPh: 'out', aStep: 3 })
  for (let n = 1; n <= 3; n++) {
    await wait(420)
    set({ outs: n })
  }
}

const SCENES = [null, leads, veille, intervention, seance]

/** One job from its empty state to its held final picture; job 0 is the typed request, 1-4 are bespoke scenes. */
export async function playJob(job: number, deps: ScriptDeps) {
  if (job === 0) await request(deps, 0)
  else {
    deps.set({ job, shown: job, ...sceneReset() })
    await (SCENES[job] as (d: ScriptDeps) => Promise<void>)(deps)
  }
  await deps.wait(HOLD_MS)
}
