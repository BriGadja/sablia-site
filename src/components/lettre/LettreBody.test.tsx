import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { assertLettreHtml, lettreTitle } from '../../../scripts/seo/ressources.mjs'
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

  it('renders a footnote with no <div>, no id and no second <footer>: the guard still reads the whole body', () => {
    const out = html(
      'Texte[^1] et suite.\n\n[^1]: Note de bas de page\n\nAprès.\n\nFin[^contenu].\n\n[^contenu]: Autre note',
    )
    expect(out.match(/<div\b/g)).toHaveLength(1)
    expect(out.indexOf('</div>')).toBe(out.length - '</div>'.length)
    expect(out).not.toMatch(/\sid="/)
    expect(out).not.toMatch(/<footer/)
    // The note marks and texts stay readable; a mark no longer links to an anchor that is gone.
    expect(out).toContain('<sup>1</sup>')
    expect(out).toContain('Note de bas de page')
    expect(out).toContain('Autre note')
    expect(out).not.toContain('href="#')
  })

  it('shows an autolinked bare URL without scheme, utm_* parameters and fragment; its href stays whole', () => {
    const out = html(
      'Réservez : https://calendly.com/x/y?utm_source=sablia.io&utm_medium=lettre#haut et <https://example.org/a/?b=1>',
    )
    expect(out).toContain(
      '<a href="https://calendly.com/x/y?utm_source=sablia.io&amp;utm_medium=lettre#haut" rel="noopener">calendly.com/x/y</a>',
    )
    expect(out).toContain(
      '<a href="https://example.org/a/?b=1" rel="noopener">example.org/a/?b=1</a>',
    )
    expect(out).not.toMatch(/>https?:\/\//)
  })

  it('keeps the other parameters of an autolinked bare URL in its text: a YouTube link keeps its video id', () => {
    const out = html(
      'La vidéo : https://www.youtube.com/watch?v=d5fo00AFqVM&utm_source=sablia.io&utm_medium=lettre et https://a.org/p?utm_source=x&q=1&utm_campaign=y#f',
    )
    expect(out).toContain(
      '<a href="https://www.youtube.com/watch?v=d5fo00AFqVM&amp;utm_source=sablia.io&amp;utm_medium=lettre" rel="noopener">www.youtube.com/watch?v=d5fo00AFqVM</a>',
    )
    expect(out).toContain(
      '<a href="https://a.org/p?utm_source=x&amp;q=1&amp;utm_campaign=y#f" rel="noopener">a.org/p?q=1</a>',
    )
  })

  it('leaves a labelled Markdown link and a bare email as written', () => {
    const out = html(
      '[le lien complet](https://calendly.com/x/y?utm_source=a) et brice@sablia.io et [https://a.org/?q=1](https://b.org/)',
    )
    expect(out).toContain(
      '<a href="https://calendly.com/x/y?utm_source=a" rel="noopener">le lien complet</a>',
    )
    expect(out).toContain('>brice@sablia.io</a>')
    expect(out).toContain('<a href="https://b.org/" rel="noopener">https://a.org/?q=1</a>')
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

/**
 * The export guard (`assertLettreHtml`) wants the body to carry the words of the first `##` heading of
 * corps_md. Checked here on the REAL render: a correct page never fails the build, whatever Markdown
 * its first heading holds; a page whose body lost that heading still does.
 */
describe('LettreBody under the export guard', () => {
  /** Runs the guard on an issue page whose body is the render of `rendered` (corps_md by default). */
  const guard = (corps_md: string, rendered = corps_md) => {
    const row = {
      slug: '2026-11-17-x',
      titre: 'Titre',
      resume: 'Résumé.',
      corps_md,
      youtube_id: null,
      published_at: '2026-11-17T08:00:00+00:00',
    }
    const article = {
      '@type': 'Article',
      datePublished: row.published_at,
      author: { '@type': 'Person', name: 'Brice Gachadoat' },
    }
    const page = `<main id="contenu" data-ready="true"><script type="application/ld+json">${JSON.stringify(article)}</script>${html(rendered)}</main>`
    const dom = {
      title: lettreTitle(row),
      canonical: `https://sablia.io/lettre/${row.slug}`,
      description: row.resume,
      h1: row.titre,
      text: `${row.titre} ${row.resume}`,
      html: page,
    }
    return () => assertLettreHtml(dom, row)
  }
  const issue = (heading: string, rest = '') => `Bonjour,\n\n${heading}\n\nTexte.${rest}\n\nBrice`

  it.each([
    ['an entity outside the decoded set', issue('## Et ensuite&hellip;')],
    ['an entity inside a word', issue('## Le r&eacute;sum&eacute; du mois')],
    [
      'a heading that is only a bare URL',
      issue('## https://calendly.com/x/y?utm_source=sablia.io'),
    ],
    ['an angle-bracket URL', issue('## Réservez <https://calendly.com/x>')],
    ['a bare URL inside the text', issue('## Réservez sur https://calendly.com/x/y ce mois')],
    ['a reference link', issue('## Voir [la page][r]', '\n\n[r]: https://sablia.io/x')],
    ['a link label with brackets', issue('## Voir [a [b] c](https://a.org/)')],
    ['a numeric reference in inline code', issue('## Le caractère `&#233;` en code')],
    ['a hexadecimal reference in inline code', issue('## Le code `caf&#xE9;` du menu')],
    ['a digit reference in inline code', issue('## Le code `&#49;` seul')],
    ['a backslash-escaped numeric reference', issue('## Le texte \\&#233;t\\&#233; affiché')],
  ])('passes a correct page whose first heading holds %s', (_shape, corps) => {
    expect(guard(corps)).not.toThrow()
  })

  it('still fails a page whose body lacks the plain words of a heading holding code or a reference', () => {
    const corps = issue('## Le caractère `&#233;` en code')
    expect(guard(corps, issue('## Autre chose'))).toThrow(/first ## heading/)
  })

  it('fails a page whose body lacks the words of the first heading, or holds them out of order', () => {
    const corps = issue('## Pourquoi cette vidéo')
    expect(guard(corps, issue('## Autre chose'))).toThrow(/first ## heading/)
    expect(guard(issue('## Partie deux'), issue('## Deux', ' Partie.'))).toThrow(/first ## heading/)
  })

  it('still fails an empty body when the first heading leaves no word to look for', () => {
    expect(guard(issue('## https://calendly.com/x'), '')).toThrow(/body block is empty/)
  })
})
