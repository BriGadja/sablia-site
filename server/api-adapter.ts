import type { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express'

/**
 * `api/*.ts` are Web-standard Fetch handlers (`export default { fetch(Request): Response }`),
 * written for Vercel Functions. This adapter serves them from Express without touching them:
 * it builds a `Request` from the Node request, calls the handler, writes the `Response` back.
 */
export interface FetchHandler {
  fetch(request: Request): Promise<Response>
}

const MAX_BODY_BYTES = 100 * 1024
const DRAIN_LIMIT_BYTES = 1024 * 1024
const REVALIDATE = 'public, max-age=0, must-revalidate'
const SKIP_REQUEST_HEADERS = new Set(['host', 'connection', 'content-length', 'transfer-encoding'])

type Body = { kind: 'ok'; data: Buffer } | { kind: 'too_large' }

async function readBody(req: ExpressRequest): Promise<Body> {
  const chunks: Buffer[] = []
  let size = 0
  let tooLarge = false
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > DRAIN_LIMIT_BYTES) {
      req.destroy()
      return { kind: 'too_large' }
    }
    if (size > MAX_BODY_BYTES) tooLarge = true
    else chunks.push(chunk as Buffer)
  }
  return tooLarge ? { kind: 'too_large' } : { kind: 'ok', data: Buffer.concat(chunks) }
}

function sendJson(res: ExpressResponse, status: number, body: unknown) {
  res.status(status).set('Cache-Control', REVALIDATE).json(body)
}

function adapt(handler: FetchHandler) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const headers = new Headers()
      for (const [name, value] of Object.entries(req.headers)) {
        if (value === undefined || SKIP_REQUEST_HEADERS.has(name)) continue
        if (Array.isArray(value)) for (const v of value) headers.append(name, v)
        else headers.set(name, value)
      }
      const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
      // A copy typed on ArrayBuffer: since @types/node 22 a Buffer may sit on a SharedArrayBuffer, which BodyInit refuses
      let body: Uint8Array<ArrayBuffer> | undefined
      if (hasBody) {
        const read = await readBody(req)
        if (read.kind === 'too_large') {
          sendJson(res, 413, { error: 'Requête trop volumineuse', code: 'payload_too_large' })
          return
        }
        body = new Uint8Array(read.data)
      }
      const url = `${req.protocol}://${req.get('host') ?? 'localhost'}${req.originalUrl}`
      const response = await handler.fetch(new Request(url, { method: req.method, headers, body }))

      res.status(response.status)
      response.headers.forEach((value, name) => {
        if (name !== 'set-cookie') res.setHeader(name, value)
      })
      for (const cookie of response.headers.getSetCookie()) res.append('Set-Cookie', cookie)
      if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', REVALIDATE)

      if (req.method === 'HEAD' || [204, 205, 304].includes(response.status)) {
        res.end()
        return
      }
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (error) {
      console.error('[api] adapter error', error instanceof Error ? error.name : 'unknown')
      if (!res.headersSent) sendJson(res, 500, { error: 'Service indisponible', code: 'internal' })
      else res.end()
    }
  }
}

/** Mounts each route, then answers 404 for every other /api path: Vercel had no function there. */
export function mountApi(app: Express, routes: Record<string, FetchHandler>): void {
  for (const [route, handler] of Object.entries(routes)) app.all(route, adapt(handler))
  app.all(['/api', '/api/*'], (_req, res) => {
    res.status(404).set('Cache-Control', REVALIDATE).type('text/plain').send('Not Found')
  })
}
