#!/bin/bash
# Proves the Caddy blocks of deploy/Caddyfile.sablia-site against a PRIVATE Caddy on 127.0.0.1:18080
# (never /etc/caddy, never a reload of the live one) fronting the real dist/ build on 5001 and the
# real Umami on 3100. Needs: dist/ built, the Umami stack up, `caddy`, `curl`.
# usage: UMAMI_CREDENTIALS=<json> bash deploy/caddy.test.sh        exit 0 = every assertion holds
# (E2E=1 also runs scripts/analytics-e2e.mjs; E2E_REPLAY=1 adds the tier-2 proof)
cd "$(dirname "$0")/.." || exit 2
T="$(mktemp -d)"; fails=0; PIDS=()
cleanup() { for p in "${PIDS[@]}"; do kill "$p" 2>/dev/null; done; rm -rf "$T"; }
trap cleanup EXIT
ok()   { echo "PASS $1"; }
bad()  { echo "FAIL $1"; fails=$((fails+1)); }
check() { if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (expected '$3', got '$2')"; fi; }

[ -f deploy/Caddyfile.sablia-site ] || { echo "FAIL deploy/Caddyfile.sablia-site missing"; exit 1; }
[ -f dist/index.js ] || { echo "FAIL dist/index.js missing: run the build first"; exit 2; }
CREDS="${UMAMI_CREDENTIALS:?set UMAMI_CREDENTIALS to the Umami credentials JSON}"
WID="$(python3 -c "import json;print(json.load(open('$CREDS'))['websites']['preview'])")"

# throwaway preview password (the real one never touches this test)
HASH="$(printf 'testpass\n' | caddy hash-password)"
{
  printf '{\n\tadmin off\n\tauto_https off\n\torder rate_limit first\n}\n'
  sed -e "s#^preview.sablia.io {#http://preview.sablia.io:18080 {#" \
      -e "s#^stats.sablia.io {#http://stats.sablia.io:18080 {#" \
      -e "s#^sablia.io {#http://sablia.io:18080 {#" \
      -e "s#^www.sablia.io {#http://www.sablia.io:18080 {#" \
      -e "s#__APEX_TLS__##" -e "s#__PREVIEW_HASH__#$HASH#" \
      -e "s#127.0.0.1:{args\[1\]}#127.0.0.1:{args[1]}#" deploy/Caddyfile.sablia-site
} > "$T/Caddyfile"
caddy validate --config "$T/Caddyfile" --adapter caddyfile >"$T/validate.log" 2>&1 && ok "caddy validate" || { bad "caddy validate"; cat "$T/validate.log"; }

echo 'testsha-20261018T100000Z' > "$T/RELEASE"
HOST=127.0.0.1 PORT=5001 RELEASE_FILE="$T/RELEASE" node dist/index.js >"$T/app.log" 2>&1 & PIDS+=($!)
# apex upstream is port 5000 in the real file: start a second copy so the apex block is exercised too
HOST=127.0.0.1 PORT=5000 RELEASE_FILE="$T/RELEASE" node dist/index.js >"$T/app0.log" 2>&1 & PIDS+=($!)
caddy run --config "$T/Caddyfile" --adapter caddyfile >"$T/caddy.log" 2>&1 & PIDS+=($!)
for i in $(seq 1 40); do curl -s -o /dev/null --resolve preview.sablia.io:18080:127.0.0.1 http://preview.sablia.io:18080/robots.txt && break; sleep 0.25; done

c() { # c <host> <curl args...> -> prints "status"
  local host="$1"; shift
  curl -s -o /dev/null -w '%{http_code}' --resolve "$host:18080:127.0.0.1" "$@"
}
body() { local host="$1"; shift; curl -s --resolve "$host:18080:127.0.0.1" "$@"; }
hdr() { local host="$1"; shift; curl -s -D - -o /dev/null --resolve "$host:18080:127.0.0.1" "$@"; }
P=http://preview.sablia.io:18080
A=http://sablia.io:18080

echo "-- preview: protected, noindex, but /m/* and robots.txt open"
check "preview / without credentials -> 401" "$(c preview.sablia.io $P/)" 401
check "preview / with credentials -> 200" "$(c preview.sablia.io -u sablia:testpass $P/)" 200
check "preview / wrong password -> 401" "$(c preview.sablia.io -u sablia:nope $P/)" 401
hdr preview.sablia.io $P/ | grep -qi '^x-robots-tag: noindex, nofollow' && ok "x-robots-tag on the 401" || bad "x-robots-tag on the 401"
hdr preview.sablia.io -u sablia:testpass $P/ | grep -qi '^x-robots-tag: noindex' && ok "x-robots-tag on the 200" || bad "x-robots-tag on the 200"
body preview.sablia.io $P/robots.txt | grep -q '^Disallow: /' && ok "robots.txt disallows everything, no password" || bad "robots.txt"
hdr preview.sablia.io -u sablia:testpass $P/ | grep -qi '^strict-transport-security: max-age=63072000' && ok "HSTS 2 years" || bad "HSTS 2 years"
hdr preview.sablia.io -u sablia:testpass $P/ | grep -qi '^x-frame-options' && bad "no X-Frame-Options expected" || ok "no X-Frame-Options (heatmap framing)"
check "preview /healthz release reaches the app" "$(body preview.sablia.io -u sablia:testpass $P/healthz)" '{"ok":true,"release":"testsha-20261018T100000Z"}'

echo "-- /m allowlist (no credentials)"
check "GET /m/a.js -> 200" "$(c preview.sablia.io $P/m/a.js)" 200
hdr preview.sablia.io $P/m/a.js | grep -qiE '^content-type: (application|text)/javascript' && ok "a.js is JavaScript" || bad "a.js content-type"
check "GET /m/r.js -> 200" "$(c preview.sablia.io $P/m/r.js)" 200
body preview.sablia.io $P/m/r.js | head -c 40 | grep -q 'function' && ok "r.js is the recorder" || bad "r.js body"
check "GET /m/api/websites/<id>/recorder -> 200" "$(c preview.sablia.io $P/m/api/websites/$WID/recorder)" 200
check "POST /m/api/send reaches Umami (not 404)" "$([ "$(c preview.sablia.io -X POST -H 'content-type: application/json' -d '{}' $P/m/api/send)" != 404 ] && echo reached)" reached
check "POST /m/api/record reaches Umami (not 404)" "$([ "$(c preview.sablia.io -X POST -H 'content-type: application/json' -d '{}' $P/m/api/record)" != 404 ] && echo reached)" reached
for deny in "GET /m/api/send" "GET /m/api/record" "POST /m/api/auth/login" "GET /m/api/me" "GET /m/api/websites" "GET /m/api/websites/$WID/stats" "GET /m/api/websites/$WID/replays" "GET /m/login" "GET /m/" "GET /m/a.js.map" "GET /m/api/heartbeat" "POST /m/a.js" "GET /m/api/websites/not-a-uuid/recorder"; do
  set -- $deny
  check "denied: $deny -> 404" "$(c preview.sablia.io -X "$1" -H 'content-type: application/json' $P$2)" 404
done

echo "-- stats dashboard"
check "stats login page -> 200" "$(c stats.sablia.io http://stats.sablia.io:18080/login)" 200

echo "-- apex and www (production blocks)"
check "apex / -> 200" "$(c sablia.io $A/)" 200
check "apex /cgv -> 200 (no 301)" "$(c sablia.io $A/cgv)" 200
check "apex /m/a.js -> 200" "$(c sablia.io $A/m/a.js)" 200
check "apex /m/api/me -> 404" "$(c sablia.io $A/m/api/me)" 404
check "apex /api/contact GET -> 405" "$(c sablia.io $A/api/contact)" 405
hdr sablia.io $A/ | grep -qi '^x-frame-options' && bad "apex must not send X-Frame-Options" || ok "apex sends no X-Frame-Options"
hdr sablia.io $A/ | grep -qi '^x-robots-tag' && bad "apex must not be noindex" || ok "apex is indexable"
hdr www.sablia.io http://www.sablia.io:18080/cgv?x=1 | head -1 | grep -q ' 308' && ok "www -> 308" || bad "www -> 308"
hdr www.sablia.io http://www.sablia.io:18080/cgv?x=1 | grep -qi '^location: https://sablia.io/cgv?x=1' && ok "www keeps path and query" || bad "www redirect target"

echo "-- restart window: an upstream that is down for 2 s does not surface a 502"
OLD=${PIDS[1]}; kill "$OLD"; wait "$OLD" 2>/dev/null
( sleep 2; HOST=127.0.0.1 PORT=5000 RELEASE_FILE="$T/RELEASE" node dist/index.js >"$T/app0b.log" 2>&1 & echo $! > "$T/newpid" ) &
st="$(c sablia.io $A/healthz)"; check "request during a 2 s restart -> 200 (retried by Caddy)" "$st" 200
sleep 0.5; [ -f "$T/newpid" ] && PIDS+=("$(cat "$T/newpid")")
if [ "${E2E:-0}" = 1 ]; then
  echo "-- browser end-to-end (analytics-e2e.mjs) through the private Caddy"
  printf 'machine preview.sablia.io login sablia password testpass\n' > "$T/netrc"; chmod 600 "$T/netrc"
  node scripts/analytics-e2e.mjs --base "$P" --map preview.sablia.io=127.0.0.1 --netrc "$T/netrc" ${E2E_REPLAY:+--replay} || fails=$((fails+1))
fi
exit $((fails>0))
