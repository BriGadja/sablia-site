/** The section's whole animation state, one flat object like the mockup's. `finalState` is the SSR and reduced-motion picture. */

export type AgentPhase = 'idle' | 'type' | 'send' | 'think' | 'out' | 'swap'

export interface FlowState {
  job: number
  shown: number
  aPh: AgentPhase
  typed: number
  aStep: number
  outs: number
  bar: number
  // lead scene
  lN: number
  lIn: boolean
  lAttr: boolean
  lR: number[]
  lEnv: number
  lRow: number
  lX: number | null
  lCnt: number[]
  lMsg: number
  // veille scene
  vT: number
  vScan: number
  vKeep: boolean
  vBul: number
  vSent: boolean
  // intervention scene
  iMail: boolean
  iHl: number
  iDoc: number
  iFlip: boolean
  iStamp: boolean
  iBonT: boolean
  iFa: number
  iTot: number
  iStack: number
  // séance scene
  sP: number
  sMk: number
  sRelu: boolean
  sMail: number
}

type SceneKeys = Exclude<
  keyof FlowState,
  'job' | 'shown' | 'aPh' | 'typed' | 'aStep' | 'outs' | 'bar' | 'lX' | 'lRow'
>

export function sceneReset(): Pick<FlowState, SceneKeys> & { lRow: number } {
  return {
    lN: 0,
    lIn: false,
    lAttr: false,
    lR: [0, 0, 0],
    lEnv: 0,
    lRow: 0,
    lCnt: [0, 0, 0],
    lMsg: -1,
    vT: 0,
    vScan: -1,
    vKeep: false,
    vBul: 0,
    vSent: false,
    iMail: false,
    iHl: 0,
    iDoc: 0,
    iFlip: false,
    iStamp: false,
    iBonT: false,
    iFa: 0,
    iTot: 0,
    iStack: 0,
    sP: 0,
    sMk: 0,
    sRelu: false,
    sMail: 0,
  }
}

export function sceneFinal(): Pick<FlowState, SceneKeys> & { lRow: number } {
  return {
    lN: 1,
    lIn: true,
    lAttr: true,
    lR: [2, 0, 0],
    lEnv: 0,
    lRow: 0,
    lCnt: [1, 1, 0],
    lMsg: 1,
    vT: 1,
    vScan: 9,
    vKeep: true,
    vBul: 3,
    vSent: true,
    iMail: true,
    iHl: 3,
    iDoc: 2,
    iFlip: false,
    iStamp: false,
    iBonT: true,
    iFa: 3,
    iTot: 118,
    iStack: 3,
    sP: 1,
    sMk: 3,
    sRelu: true,
    sMail: 3,
  }
}

/** Everything done, for job `job`: what a paused, reduced-motion or server-rendered section shows. */
export function finalState(job = 0): FlowState {
  return {
    job,
    shown: job,
    aPh: 'out',
    typed: 200,
    aStep: 3,
    outs: 3,
    bar: 1,
    lX: null,
    ...sceneFinal(),
  }
}

/** A job picked while the loop plays: start from a clean scene. */
export function pickedState(job: number): FlowState {
  return { ...finalState(job), aPh: 'idle', typed: 0, aStep: -1, outs: 0, bar: 0, ...sceneReset() }
}
