// Build step: downloads each published video's poster into public/_posters/<id>.webp so a visitor's
// browser never requests i.ytimg.com (the content gate bans that host from the export). A failed
// fetch logs and falls back to the facade's generic poster; it never fails the build. A failure to
// LIST the resources is not this script's to report: `generateStaticParams` throws on it in strict mode.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/
// Best first. 4:3 variants carry letterbox bars; the 16:9 cover crop below removes exactly those.
const SIZES = ['maxresdefault', 'sddefault', 'hqdefault']
const TIMEOUT_MS = 8000

export async function fetchPosters({
  rows,
  outDir,
  fetch: doFetch = globalThis.fetch,
  sharp,
  log = console.warn,
}) {
  mkdirSync(outDir, { recursive: true })
  for (const { youtube_id: id } of rows) {
    if (!id || !YOUTUBE_ID.test(id)) continue
    const target = join(outDir, `${id}.webp`)
    if (existsSync(target)) continue
    let done = false
    for (const size of SIZES) {
      try {
        const res = await doFetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`, {
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        if (!res.ok) continue
        const webp = await sharp(Buffer.from(await res.arrayBuffer()))
          .resize(960, 540, { fit: 'cover', withoutEnlargement: false })
          .webp({ quality: 78 })
          .toBuffer()
        writeFileSync(target, webp)
        done = true
        break
      } catch (error) {
        log(`[posters] ${id} ${size}: ${String(error)}`)
      }
    }
    if (!done) log(`[posters] ${id}: no poster downloaded, the generic poster will show`)
  }
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  try {
    const { listPublishedSlugs } = await import('./seo/ressources.mjs')
    const sharp = (await import('sharp')).default
    const rows = await listPublishedSlugs()
    await fetchPosters({ rows, outDir: join(root, 'public', '_posters'), sharp })
  } catch (error) {
    console.warn(`[posters] skipped: ${String(error)}`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main()
