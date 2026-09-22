/**
 * Reads the content register live from Supabase (NS-19, decision D7).
 *
 * The resources shown on `/ressources` are rows of `contenu_ressources`, a table that lives in
 * the HUB's register (prefix `contenu_`, outside this project's `site_` convention) and that the
 * site only ever reads. Reading it at runtime is the whole point: publishing a resource must not
 * require a redeploy of the site, one per video.
 *
 * The anon key ships in the client bundle — that is its designed role. RLS exposes exactly one
 * thing to it: `contenu_ressources` rows with `published = true`. Transcripts, drafts and
 * publication records have no anon policy at all.
 *
 * Nothing here throws. A missing key, a timeout or a 500 all return `null`, which the pages
 * render as an explicit "unavailable" state rather than a blank screen or an error boundary.
 */

/** Public project ref — no secret, so it stays a constant instead of a second env var. */
export const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const REST = `${SUPABASE_URL}/rest/v1`
const BUCKET = 'contenu-ressources'
const TIMEOUT_MS = 6000

export interface Fichier {
  nom: string
  path: string
  taille_octets: number
  type: string
}

export interface RessourceSummary {
  slug: string
  titre: string
  resume: string | null
  youtube_id: string | null
  published_at: string | null
}

export interface Ressource extends RessourceSummary {
  corps_md: string | null
  fichiers: Fichier[]
}

const LIST_SELECT = 'slug,titre,resume,youtube_id,published_at'
const DETAIL_SELECT = `${LIST_SELECT},corps_md,fichiers`

/** `null` (not an empty string) when the build ran without the Vercel variable. */
export function anonKey(): string | null {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return typeof key === 'string' && key.length > 0 ? key : null
}

/** The public URL of a file in the bucket. The bucket is public; the path is unguessable. */
export function fileUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

async function get<T>(query: string): Promise<T[] | null> {
  const key = anonKey()
  if (!key) return null

  try {
    const response = await fetch(`${REST}/${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const rows = (await response.json()) as T[] | null
    return Array.isArray(rows) ? rows : null
  } catch {
    // A timeout, an offline visitor, a malformed body: all mean "we could not read it".
    return null
  }
}

/** `null` = could not be read. `[]` = read fine, nothing published yet. The two differ on screen. */
export async function fetchRessources(): Promise<RessourceSummary[] | null> {
  return await get<RessourceSummary>(
    `contenu_ressources?select=${LIST_SELECT}&published=eq.true&order=published_at.desc`,
  )
}

/** `null` = could not be read. `undefined` = read fine, no such published resource (a 404). */
export async function fetchRessource(slug: string): Promise<Ressource | null | undefined> {
  const rows = await get<Ressource>(
    `contenu_ressources?select=${DETAIL_SELECT}&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  )
  if (rows === null) return null
  const row = rows[0]
  if (!row) return undefined
  return { ...row, fichiers: Array.isArray(row.fichiers) ? row.fichiers : [] }
}
