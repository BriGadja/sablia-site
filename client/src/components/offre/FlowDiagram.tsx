import { useId } from 'react'

/**
 * The OF-1 chain in one hand-made inline SVG: appel -> transcript -> Claude -> CRM à jour.
 *
 * Every colour is `currentColor` or a design-system token, never a literal: the diagram inherits
 * the text colour of the band it sits in, so it reads on the dark hero and on a cream band alike.
 * Horizontal on desktop, vertical on mobile; both carry the same accessible name.
 */

interface FlowDiagramProps {
  orientation: 'horizontal' | 'vertical'
  className?: string
}

interface FlowNode {
  id: string
  lines: readonly string[]
  tone: 'default' | 'ai' | 'outcome'
}

const NODES: readonly FlowNode[] = [
  { id: 'appel', lines: ['Appel'], tone: 'default' },
  { id: 'transcript', lines: ['Transcript'], tone: 'default' },
  { id: 'claude', lines: ['Claude'], tone: 'ai' },
  { id: 'resultat', lines: ['Fiche CRM à jour', '+ tâche de relance'], tone: 'outcome' },
]

const LAYOUT = {
  horizontal: { width: 720, height: 180, nodeW: 150, nodeH: 88, gap: 40, offset: 46 },
  vertical: { width: 280, height: 420, nodeW: 240, nodeH: 68, gap: 40, offset: 20 },
} as const

const TONE_FILL: Record<FlowNode['tone'], string> = {
  default: 'currentColor',
  ai: 'rgb(var(--color-primary))',
  outcome: 'currentColor',
}

const TONE_STROKE: Record<FlowNode['tone'], string> = {
  default: 'currentColor',
  ai: 'rgb(var(--color-primary))',
  outcome: 'rgb(var(--color-accent-teal))',
}

const TONE_TEXT: Record<FlowNode['tone'], string> = {
  default: 'currentColor',
  ai: 'rgb(var(--color-on-primary))',
  outcome: 'currentColor',
}

export default function FlowDiagram({ orientation, className }: FlowDiagramProps) {
  const uid = useId()
  const titleId = `${uid}-title`
  const descId = `${uid}-desc`
  const markerId = `${uid}-arrow`

  const isRow = orientation === 'horizontal'
  const { width, height, nodeW, nodeH, gap, offset } = LAYOUT[orientation]

  const positions = NODES.map((_, index) => {
    const along = offset + index * (isRow ? nodeW + gap : nodeH + gap)
    return isRow ? { x: along, y: (height - nodeH) / 2 } : { x: (width - nodeW) / 2, y: along }
  })

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>Le trajet d'un appel jusqu'à la fiche CRM</title>
      <desc id={descId}>
        Quatre étapes enchaînées : l'appel produit un transcript, Claude en tire une synthèse, et la
        fiche CRM est mise à jour avec sa tâche de relance.
      </desc>

      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <polygon points="0,1 10,5 0,9" fill="currentColor" fillOpacity="0.55" />
        </marker>
      </defs>

      {positions.slice(0, -1).map((from, index) => {
        const to = positions[index + 1]
        const d = isRow
          ? `M${from.x + nodeW + 8} ${from.y + nodeH / 2} L${to.x - 10} ${to.y + nodeH / 2}`
          : `M${from.x + nodeW / 2} ${from.y + nodeH + 8} L${to.x + nodeW / 2} ${to.y - 10}`
        return (
          <path
            key={`arrow-${NODES[index].id}`}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            markerEnd={`url(#${markerId})`}
          />
        )
      })}

      {NODES.map((node, index) => {
        const { x, y } = positions[index]
        const cx = x + nodeW / 2
        const cy = y + nodeH / 2
        return (
          <g key={node.id}>
            <rect
              x={x}
              y={y}
              width={nodeW}
              height={nodeH}
              rx="12"
              fill={TONE_FILL[node.tone]}
              fillOpacity={node.tone === 'ai' ? '1' : '0.05'}
              stroke={TONE_STROKE[node.tone]}
              strokeOpacity={node.tone === 'default' ? '0.28' : '0.85'}
              strokeWidth="1.5"
            />
            <text
              x={cx}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={TONE_TEXT[node.tone]}
              fontFamily="var(--font-sans)"
              fontSize="13"
              fontWeight="500"
            >
              {node.lines.map((line, lineIndex) => (
                <tspan key={line} x={cx} y={cy + (lineIndex - (node.lines.length - 1) / 2) * 19}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export { NODES as FLOW_NODES }
