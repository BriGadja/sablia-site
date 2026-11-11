import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LettreBody } from './LettreBody'

/** The body of an issue (US-101): the hub's Markdown, rendered as React nodes on the server. */
const html = (markdown: string) => renderToStaticMarkup(<LettreBody markdown={markdown} />)

describe('LettreBody', () => {
  it('wraps the body in its marked block, with no inner <div> (the export guard reads up to the first </div>)', () => {
    const out = html('## Un\n\nTexte.\n\n- a\n- b\n\n> cité')
    expect(out.startsWith('<div class="lt-body" data-body="lettre">')).toBe(true)
    expect(out.match(/<div\b/g)).toHaveLength(1)
  })

  it('renders headings without the generated id, and a # heading as an h2 (one h1 per page)', () => {
    const out = html('# Grand titre\n\n## Pourquoi cette vidéo\n\n### Détail')
    expect(out).toContain('<h2>Grand titre</h2>')
    expect(out).toContain('<h2>Pourquoi cette vidéo</h2>')
    expect(out).toContain('<h3>Détail</h3>')
    expect(out).not.toMatch(/<h1/)
    expect(out).not.toMatch(/\sid="/)
  })

  it('renders a list and keeps a single line break inside its paragraph', () => {
    const out = html('Une ligne\net la suivante.\n\n- un\n- deux')
    expect(out).toContain('<p>Une ligne\net la suivante.</p>')
    expect(out).toContain('<ul><li>un</li><li>deux</li></ul>')
  })

  it('renders a lone line (the signature) as a paragraph', () => {
    expect(html('Brice')).toBe('<div class="lt-body" data-body="lettre"><p>Brice</p></div>')
  })

  it('links a Markdown link and a bare URL; noopener only on another host', () => {
    const out = html(
      'Voir [la page](https://sablia.io/ressources), [ailleurs](https://example.org/a) et https://calendly.com/x?utm_source=sablia.io&utm_medium=lettre',
    )
    expect(out).toContain('<a href="https://sablia.io/ressources">la page</a>')
    expect(out).toContain('<a href="https://example.org/a" rel="noopener">ailleurs</a>')
    expect(out).toContain(
      '<a href="https://calendly.com/x?utm_source=sablia.io&amp;utm_medium=lettre" rel="noopener">',
    )
  })

  it('keeps relative, mailto and own-subdomain links without rel, and never throws on them', () => {
    const out = html('[r](/newsletter) [m](mailto:brice@sablia.io) [w](https://www.sablia.io/x)')
    expect(out).toContain('<a href="/newsletter">r</a>')
    expect(out).toContain('<a href="mailto:brice@sablia.io">m</a>')
    expect(out).toContain('<a href="https://www.sablia.io/x">w</a>')
    expect(out).not.toContain('rel=')
  })

  it('shows raw HTML as text: <script> and <b> never become elements', () => {
    const out = html('Avant <script>alert(1)</script> et <b>gras</b> après.')
    expect(out).not.toMatch(/<script|<b>/)
    expect(out).toContain('&lt;script&gt;')
    expect(out).toContain('&lt;b&gt;gras&lt;/b&gt;')
  })

  it('drops the href of a javascript: link', () => {
    const out = html('[mal](javascript:alert(1))')
    expect(out).toContain('<a>mal</a>')
    expect(out).not.toContain('javascript:')
  })

  it('renders no <img> for a Markdown image', () => {
    expect(html('![une image](https://example.com/a.png)')).not.toMatch(/<img/)
  })

  it('is a Server Component that never injects raw HTML', () => {
    const source = readFileSync(join(__dirname, 'LettreBody.tsx'), 'utf8')
    expect(source).not.toContain(`'use client'`)
    expect(source).not.toContain(['dangerously', 'SetInnerHTML'].join(''))
  })
})
