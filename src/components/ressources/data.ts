/**
 * Build-time data of the resource pages. Everything here runs on the server during `next build`
 * (or per request under `next dev`), never in the browser.
 *
 * Two modes. Outside strict mode (local build, dev) an unreadable Supabase is a state the pages
 * show. In strict mode (`PRERENDER_STRICT=1`, the deploy, or `VERCEL`) it THROWS, so the slot keeps
 * its previous release instead of publishing a site without its resource pages. An EMPTY answer is
 * never a failure.
 */
import {
  fetchRessource,
  fetchRessources,
  type Ressource,
  type RessourceSummary,
} from '@/lib/contenu'
import { listPublishedSlugs } from '../../../scripts/seo/ressources.mjs'

/** `output: 'export'` rejects an empty `generateStaticParams`; `finalize-export.mjs` deletes this page. */
export const NONE_SLUG = '__none'

type Env = Record<string, string | undefined>

export function isStrict(env: Env = process.env): boolean {
  return Boolean(env.PRERENDER_STRICT || env.VERCEL)
}

function fixtureSlugs(env: Env): string[] {
  return (env.SABLIA_FIXTURE_SLUGS ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
}

interface SlugDeps {
  env?: Env
  list?: () => Promise<{ slug: string }[]>
  warn?: (message: string) => void
}

export async function loadSlugParams({
  env = process.env,
  list = () => listPublishedSlugs() as Promise<{ slug: string }[]>,
  warn = console.warn,
}: SlugDeps = {}): Promise<{ slug: string }[]> {
  const fixtures = fixtureSlugs(env)
  if (fixtures.length > 0) return fixtures.map((slug) => ({ slug }))

  let rows: { slug: string }[]
  try {
    rows = await list()
  } catch (error) {
    if (isStrict(env)) throw error
    warn(`[ressources] could not list the published resources (${String(error)}): none prerendered`)
    rows = []
  }
  return rows.length > 0 ? rows.map(({ slug }) => ({ slug })) : [{ slug: NONE_SLUG }]
}

interface ListDeps {
  env?: Env
  fetchList?: () => Promise<RessourceSummary[] | null>
}

/** `null` = unreadable (the « indisponible » state), `[]` = nothing published yet. */
export async function loadList({
  env = process.env,
  fetchList = fetchRessources,
}: ListDeps = {}): Promise<RessourceSummary[] | null> {
  const rows = await fetchList()
  if (rows === null && isStrict(env)) {
    throw new Error('/ressources: contenu_ressources is unreadable on a strict build')
  }
  return rows
}

interface OneDeps {
  env?: Env
  fetchOne?: (slug: string) => Promise<Ressource | null | undefined>
}

/** `undefined` = no such published resource (a 404). Unreadable throws in strict mode, is a 404 otherwise. */
export async function loadRessource(
  slug: string,
  { env = process.env, fetchOne = fetchRessource }: OneDeps = {},
): Promise<Ressource | undefined> {
  const row = await fetchOne(slug)
  if (row === null && isStrict(env)) {
    throw new Error(`/ressources/${slug}: contenu_ressources is unreadable on a strict build`)
  }
  return row ?? undefined
}
