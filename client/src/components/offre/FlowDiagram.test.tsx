import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FlowDiagram from './FlowDiagram'

const SOURCE = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), 'FlowDiagram.tsx'),
  'utf8',
)

const LABELS = ['Appel', 'Transcript', 'Claude', 'Fiche CRM à jour', '+ tâche de relance']

describe('FlowDiagram', () => {
  it('exposes an image role with an accessible name, in both orientations', () => {
    const { unmount } = render(<FlowDiagram orientation="horizontal" />)
    const horizontal = screen.getByRole('img')
    expect(horizontal.getAttribute('viewBox')).toBe('0 0 720 180')
    expect(horizontal.textContent).toContain("Le trajet d'un appel")
    expect(horizontal.getAttribute('aria-labelledby')).toBeTruthy()
    unmount()

    render(<FlowDiagram orientation="vertical" />)
    expect(screen.getByRole('img').getAttribute('viewBox')).toBe('0 0 280 420')
  })

  it('labels the four steps of the chain', () => {
    const { container } = render(<FlowDiagram orientation="horizontal" />)
    const texts = Array.from(container.querySelectorAll('text'))
    expect(texts).toHaveLength(4)
    const rendered = texts.map((node) => node.textContent ?? '').join(' | ')
    for (const label of LABELS) {
      expect(rendered).toContain(label)
    }
  })

  it('draws exactly three arrows between the four nodes', () => {
    const { container } = render(<FlowDiagram orientation="vertical" />)
    expect(container.querySelectorAll('path')).toHaveLength(3)
    expect(container.querySelectorAll('rect')).toHaveLength(4)
  })

  it('hard-codes no colour: the source carries no hex literal', () => {
    expect(SOURCE).not.toMatch(/#[0-9a-fA-F]{3,6}\b/)
  })

  it('paints only with currentColor or design tokens, including on a light band', () => {
    const { container } = render(
      <div className="on-light">
        <FlowDiagram orientation="horizontal" />
      </div>,
    )
    const painted = Array.from(container.querySelectorAll('rect, path, text, polygon'))
    expect(painted.length).toBeGreaterThan(0)
    for (const node of painted) {
      for (const attribute of ['fill', 'stroke']) {
        const value = node.getAttribute(attribute)
        if (value === null) continue
        expect(value === 'none' || value === 'currentColor' || value.startsWith('rgb(var(')).toBe(
          true,
        )
      }
    }
  })
})
