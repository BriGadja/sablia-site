/**
 * Build-time data of the issue pages `/lettre/<slug>` and of the list on `/newsletter` (US-101,
 * US-102). Everything here runs on the server during `next build` (or per request under `next dev`),
 * never in the browser.
 *
 * ONE read of `contenu_lettres` per process: the params, every issue page and the `/newsletter` list
 * share a memoised call to the one reader of `scripts/seo/ressources.mjs` (three tries, fixtures
 * first, strict semantics there). A dev server therefore shows a new issue after a restart.
 */
import { NONE_SLUG } from '@/components/ressources/data'
import { listPublishedLettres } from '../../../scripts/seo/ressources.mjs'

/** A published row of `contenu_lettres`, as the hub writes it (body already cleaned). */
export interface Lettre {
  slug: string
  titre: string
  resume: string
  corps_md: string
  youtube_id: string | null
  /** The instant of the send (the `sent` line of the hub journal), ISO 8601. */
  published_at: string
  /** Moves only when the text changes (conditional trigger on the hub side). */
  updated_at: string
}

export function lettreStore(list: () => Promise<Lettre[]>) {
  let memo: Promise<Lettre[]> | undefined

  /** Published issues, newest first. A failed read is not kept: the next call tries again. */
  function loadLettres(): Promise<Lettre[]> {
    if (!memo) {
      const pending = list()
      memo = pending
      pending.catch(() => {
        if (memo === pending) memo = undefined
      })
    }
    return memo
  }

  /** `generateStaticParams`: the slugs, or the one placeholder that `output: 'export'` needs. */
  async function loadLettreParams(): Promise<{ slug: string }[]> {
    const rows = await loadLettres()
    return rows.length > 0 ? rows.map(({ slug }) => ({ slug })) : [{ slug: NONE_SLUG }]
  }

  /** `undefined` = not a published issue (the placeholder included): a 404. */
  async function loadLettre(slug: string): Promise<Lettre | undefined> {
    return (await loadLettres()).find((row) => row.slug === slug)
  }

  return { loadLettres, loadLettreParams, loadLettre }
}

export const { loadLettres, loadLettreParams, loadLettre } = lettreStore(
  () => listPublishedLettres() as Promise<Lettre[]>,
)
