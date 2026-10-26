'use client'

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { ACC_DATA, type AccData, type Mode } from './data'

interface ModeValue {
  mode: Mode
  /** Bumped on every real switch: sections key their entrance animations on it to replay them. */
  ver: number
  data: AccData
  setMode: (m: Mode) => void
}

const Ctx = createContext<ModeValue>({ mode: 0, ver: 0, data: ACC_DATA[0], setMode: () => {} })

/** Holds the « Pour vous / Pour votre équipe » choice for the whole /accompagnement page. */
export function AccompagnementModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ mode: Mode; ver: number }>({ mode: 0, ver: 0 })
  const setMode = useCallback((m: Mode) => {
    setState((s) => (s.mode === m ? s : { mode: m, ver: s.ver + 1 }))
  }, [])
  const value = useMemo(() => ({ ...state, data: ACC_DATA[state.mode], setMode }), [state, setMode])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** `{ mode, ver, data, setMode }`; `data` is the active audience's copy (situs, delivs, steps...). */
export function useAccompagnementMode(): ModeValue {
  return useContext(Ctx)
}
