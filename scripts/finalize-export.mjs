// Turns Next's static export (`out`) into the layout the server and deploy expect:
// dist/public (the site) beside dist/index.js (written later by build-server.mjs).
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'out')
const dist = join(root, 'dist')

if (!existsSync(out)) {
  console.error('finalize-export: `out` is missing, did `next build` run with output: export?')
  process.exit(1)
}

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist)
renameSync(out, join(dist, 'public'))

// The placeholder of a dynamic route with nothing published (generateStaticParams needs one entry)
// leaves a directory of RSC payloads as well as the HTML: remove every trace of it, for the resources
// and for the issues of the letter.
for (const route of ['ressources', 'lettre']) {
  const dir = join(dist, 'public', route)
  if (!existsSync(dir)) continue
  rmSync(join(dir, '__none'), { recursive: true, force: true })
  for (const f of ['__none.html', '__none.txt']) rmSync(join(dir, f), { force: true })
}
