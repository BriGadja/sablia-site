import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Express } from 'express'

/**
 * A dist/public with the SHAPE of the Next `output: 'export'` build (trailingSlash false): one
 * `<route>.html` per page, a directory of the same name beside it for the RSC payloads
 * (`ressources.html` AND `ressources/`), `404.html`, hashed `_next/static` files, a dotfile dir.
 */
export const PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0x10, 0x80,
])

export function makeDist(): string {
  const root = mkdtempSync(join(tmpdir(), 'sablia-dist-'))
  const files: Record<string, string | Buffer> = {
    'index.html':
      '<!doctype html><title>Home</title><script src="/_next/static/chunks/x.js"></script>',
    '404.html': '<!doctype html><title>Introuvable</title>',
    'escalier-modeles.html': '<!doctype html><title>Escalier</title>',
    'cgv.html': '<!doctype html><title>CGV</title>',
    'formations.html': '<!doctype html><title>Formations</title>',
    'offres/compte-rendu-appel.html': '<!doctype html><title>CRA</title>',
    'ressources.html': '<!doctype html><title>Ressources</title>',
    'ressources/pipedrive-nouveau-lead.html': '<!doctype html><title>Pipedrive</title>',
    'ressources/pipedrive-nouveau-lead/__next.ressources.pipedrive-nouveau-lead.txt': 'rsc-slug',
    'ressources/__next.ressources.txt': 'rsc-ressources',
    'ressources/__none.txt': 'must-not-be-served',
    'ressources/__none/__next.ressources.__none.txt': 'must-not-be-served',
    'index.txt': 'rsc-index',
    'formations.txt': 'rsc-formations',
    'formations/__next.formations.__PAGE__.txt': 'rsc-formations-page',
    'formations/__next.$d$slug.txt': 'rsc-dollar',
    '_next/static/chunks/x.js': 'console.log("x")',
    '_next/static/css/app-ff00aa11.css': 'body{margin:0}',
    '.well-known/ai.txt': 'ai policy',
    '.env': 'SECRET_SHOULD_NEVER_BE_SERVED',
    'sitemap.xml': '<?xml version="1.0"?><urlset></urlset>',
    'robots.txt': 'User-agent: *\nAllow: /',
    'b726ffc356cf2894abdd81a5a309a181.txt': 'b726ffc356cf2894abdd81a5a309a181',
    'favicon.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
    'photos/a.webp': PNG,
  }
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, content)
  }
  return root
}

export async function listen(app: Express): Promise<{ url: string; close: () => Promise<void> }> {
  const server = await new Promise<import('node:http').Server>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s))
  })
  const { port } = server.address() as AddressInfo
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  }
}
