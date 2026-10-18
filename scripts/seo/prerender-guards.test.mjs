// Prerendered HTML is served to everybody before any consent exists: it must never carry the
// consent banner, the tracker or the recorder (plan sablia-io-lot0-vps, R9). No network.
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { assertCleanStaticHtml } from './prerender-guards.mjs'

const PAGE =
  '<!doctype html><html><head><title>Sablia</title></head><body><main>Bonjour</main></body></html>'

describe('assertCleanStaticHtml', () => {
  it('accepts an ordinary prerendered page', () => {
    assert.doesNotThrow(() => assertCleanStaticHtml(PAGE, '/'))
  })

  it('accepts a privacy page that merely NAMES the buttons in its text', () => {
    assert.doesNotThrow(() =>
      assertCleanStaticHtml(
        PAGE.replace('Bonjour', 'Cliquez sur « Tout accepter » ou « Tout refuser »'),
        '/politique-confidentialite',
      ),
    )
  })

  it('rejects the consent banner (its data-consent-banner marker)', () => {
    assert.throws(
      () =>
        assertCleanStaticHtml(
          PAGE.replace('Bonjour', '<div data-consent-banner=""></div>'),
          '/cgv',
        ),
      /banner/,
    )
  })

  it('rejects the tracker and recorder scripts', () => {
    for (const src of ['/m/a.js', '/m/r.js']) {
      const html = PAGE.replace(
        '</head>',
        `<script defer src="${src}" data-website-id="x"></script></head>`,
      )
      assert.throws(() => assertCleanStaticHtml(html, '/'), /tracker|recorder|script/)
    }
  })

  it('accepts a page that merely names the stored key (the privacy page does)', () => {
    assert.doesNotThrow(() =>
      assertCleanStaticHtml(
        PAGE.replace('Bonjour', 'clé sablia_consent'),
        '/politique-confidentialite',
      ),
    )
  })

  it('names the route in the error', () => {
    assert.throws(
      () =>
        assertCleanStaticHtml(
          PAGE.replace('Bonjour', '<div data-consent-banner></div>'),
          '/ressources',
        ),
      /\/ressources/,
    )
  })
})
