// The identity stamp of an issue page (US-101). The issue page writes it into its head
// (`<meta name="sablia-lettre-version" content="<hex>"/>`), the export guard refuses a page whose stamp
// is not the one of its row, and the hub's publish step computes the same value in Python to prove that
// the live page was built from the row it just wrote. The formula is a contract shared with the hub:
// change it on both sides at once (the test vectors are asserted verbatim there too).
import { createHash } from 'node:crypto'

/**
 * Lowercase hex SHA-256 of the UTF-8 bytes of `JSON.stringify([titre, resume, corps_md, youtube_id ?? null])`:
 * the four columns the page shows, nothing else (slug and dates never count).
 * @param {{ titre: string, resume: string, corps_md?: string, youtube_id?: string | null }} row
 * @returns {string}
 */
export function lettreVersion(row) {
  const text = JSON.stringify([row.titre, row.resume, row.corps_md, row.youtube_id ?? null])
  return createHash('sha256').update(text, 'utf8').digest('hex')
}
