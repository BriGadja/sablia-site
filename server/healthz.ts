import { readFileSync } from 'node:fs'
import type { Express, Request } from 'express'

/**
 * `/healthz` is public and says only `{ok, release}` — the deploy script and the uptime probe read
 * the release. `/healthz/full` adds which API secrets are PRESENT (booleans, never values) and is
 * answered to loopback callers only: behind Caddy, `req.ip` is the visitor (trust proxy), so a
 * public request never passes.
 */
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

function readRelease(file: string): string {
  try {
    return readFileSync(file, 'utf8').trim() || 'dev'
  } catch {
    return 'dev'
  }
}

export function mountHealthz(
  app: Express,
  { releaseFile, env = process.env }: { releaseFile: string; env?: NodeJS.ProcessEnv },
): void {
  const release = readRelease(releaseFile)
  const base = { ok: true, release }

  app.get('/healthz', (_req, res) => {
    res.set('Cache-Control', 'no-store').json(base)
  })

  app.get('/healthz/full', (req: Request, res) => {
    if (!LOOPBACK.has(req.ip ?? '')) {
      res.status(403).set('Cache-Control', 'no-store').json({ error: 'forbidden' })
      return
    }
    const configured = Boolean(env.RESEND_API_KEY) && Boolean(env.SUPABASE_SERVICE_ROLE_KEY)
    res.set('Cache-Control', 'no-store').json({
      ...base,
      api: { contact: configured, ressources: configured },
    })
  })
}
