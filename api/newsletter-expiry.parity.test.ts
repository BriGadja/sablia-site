/**
 * Parity guard: the expiry vectors of an unconfirmed newsletter request are ONE file shared by two
 * codebases (plan sablia-newsletter-circuit-croissance, Q2-A). The hub's `scripts/newsletter.py`
 * (reminder pass, purge) reads `scripts/__test__/fixtures/newsletter-expiry-vectors.json` and asserts
 * its `expired_hub` column; this site reads its copy `api/__fixtures__/newsletter-expiry-vectors.json`
 * and asserts `expired_site` (`api/newsletter.test.ts`, « ancre de péremption »). This file only
 * proves the two copies are byte-identical, so a vector changed on one side turns it RED.
 *
 * The hub file lives five levels above this folder. Outside the VPS working tree (a standalone
 * clone, CI), point NEWSLETTER_VECTORS_HUB_PATH at the hub file. CI excludes this file because it
 * needs the hub tree, exactly like `content.parity.test.ts`; it is never skipped.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const HERE = dirname(fileURLToPath(import.meta.url))
const SITE_PATH = resolve(HERE, '__fixtures__/newsletter-expiry-vectors.json')
const HUB_PATH =
  process.env.NEWSLETTER_VECTORS_HUB_PATH ??
  resolve(HERE, '../../../../../scripts/__test__/fixtures/newsletter-expiry-vectors.json')

if (!existsSync(HUB_PATH)) {
  throw new Error(
    `Hub expiry vectors not found at ${HUB_PATH}. This test is hub-bound by design: set ` +
      'NEWSLETTER_VECTORS_HUB_PATH to the hub file to run it elsewhere. It is never skipped.',
  )
}

describe('newsletter expiry vectors: site copy = hub file', () => {
  it('the two fixture files are byte-identical', () => {
    const site = readFileSync(SITE_PATH)
    const hub = readFileSync(HUB_PATH)
    expect(site.length).toBeGreaterThan(0)
    expect(site.equals(hub)).toBe(true)
  })
})
