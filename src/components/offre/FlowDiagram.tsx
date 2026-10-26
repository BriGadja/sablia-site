'use client'

import { useRef, useState } from 'react'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import './flow.css'

interface FlowNode {
  id: string
  name: string
  sub: string
  tone: 'default' | 'ai' | 'out'
}

/** The chain of the offer, drawn: the animation carries the logic, the text only names the steps. */
export function flowNodes(tool = 'CRM'): readonly FlowNode[] {
  return [
    { id: 'appel', name: 'Appel', sub: 'Le commercial raccroche', tone: 'default' },
    { id: 'transcript', name: 'Transcript', sub: 'Téléphonie ou note vocale', tone: 'default' },
    { id: 'claude', name: 'Claude', sub: 'Une synthèse structurée', tone: 'ai' },
    {
      id: 'resultat',
      name: `Fiche ${tool} à jour`,
      sub: 'Avec sa tâche de relance',
      tone: 'out',
    },
  ]
}

const HOLD_MS = 4000

/**
 * Lights the four steps one after the other, holds the final state 4 s, starts again. It runs only
 * while in view and not paused; the server-rendered and reduced-motion state is « all lit ».
 */
export function FlowDiagram({ tool }: { tool?: string }) {
  const nodes = flowNodes(tool)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.35 })
  const pause = usePausable()
  const [lit, setLit] = useState(nodes.length)

  useTimelineLoop(
    async ({ wait }) => {
      setLit(0)
      await wait(700)
      for (let i = 1; i <= nodes.length; i++) {
        setLit(i)
        await wait(i === nodes.length ? HOLD_MS : 1000)
      }
    },
    { active: inView && !pause.paused, final: () => setLit(nodes.length) },
  )

  return (
    <figure
      ref={ref}
      className="v2-flow"
      aria-label="Ce qui se passe quand votre commercial raccroche"
      {...pause.bind}
    >
      <div className="flow-head">
        <span className="flow-title">Quand votre commercial raccroche</span>
        <button type="button" className="flow-pause" onClick={pause.toggle}>
          {pause.userPaused ? 'Reprendre' : 'Pause'}
        </button>
      </div>
      <ol className="flow-list">
        {nodes.map((node, i) => (
          <li key={node.id} className={`flow-node is-${node.tone}${i < lit ? ' is-on' : ''}`}>
            <span className="flow-n">{`0${i + 1}`}</span>
            <strong className="flow-name">{node.name}</strong>
            <span className="flow-sub">{node.sub}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
