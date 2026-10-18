# Caddy blocks for sablia.io on the VPS

`Caddyfile.sablia-site` holds everything Caddy needs for the site: two snippets (`sablia_headers`, `sablia_m`,
`sablia_app`, `umami_upstream`) and four site blocks — `preview.sablia.io`, `stats.sablia.io`, `sablia.io`,
`www.sablia.io`. **It is a template**: two placeholders (the bcrypt hash of the preview password, the optional
`tls <cert> <key>` of the apex and www blocks) are filled by a script that lives outside this public repository,
and the result is appended to the host's Caddyfile by a human. Nothing here edits or reloads Caddy.

## What each block does
| Block | Role |
|---|---|
| `preview.sablia.io` | the next release for a human check: basic auth, `X-Robots-Tag: noindex`, `robots.txt` disallow. `/m/*` and `robots.txt` are exempt from the password (the tracker fetches with credentials omitted) |
| `stats.sablia.io` | the Umami dashboard (its own login), rate limited |
| `sablia.io` | production: `/m/*` allowlist, `/api/*` stricter rate limit, everything else to the Node process on `127.0.0.1:5000`. No `X-Frame-Options`: Umami's heatmap view frames the real page |
| `www.sablia.io` | `308` to the apex, path and query kept (what Vercel answered) |

`/m/*` is an **allowlist** (`sablia_m`): `GET /m/a.js` (tracker), `GET /m/r.js` (recorder), `POST /m/api/send`,
`POST /m/api/record`, `GET /m/api/websites/<uuid>/recorder`. Everything else under `/m/` — the Umami login, its
API, its dashboard — answers 404 on the public site. Every upstream call retries for 5 s (`lb_try_duration`) so a
deploy restart is invisible to a visitor.

## Prove them before applying (no root, no live Caddy)
```
UMAMI_CREDENTIALS=<json> bash deploy/caddy.test.sh          # 41 assertions on a private Caddy, 127.0.0.1:18080
E2E=1 E2E_REPLAY=1 UMAMI_CREDENTIALS=<json> bash deploy/caddy.test.sh   # + the browser end to end
```

## Apply (a human, one change at a time)
1. Render: the hub script `scripts/sablia-site-caddy-render.py --out <file>` (adds `--create-credentials` the first
   time, `--apex-tls "<fullchain> <privkey>"` for the apex/www blocks). It validates the result appended to a COPY
   of the live Caddyfile.
2. Snapshot the live file, append the rendered file, `caddy validate`, then `systemctl reload caddy`.
3. Check: `curl -I https://preview.sablia.io` is 401, with the password 200 and `x-robots-tag: noindex`.

## Roll back
Restore the snapshot of the Caddyfile and `systemctl reload caddy`. Remove only the blocks you added: other sessions
edit that file too (compare its mtime with Caddy's last reload before you restore).
