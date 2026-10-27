#!/bin/bash
# deploy.sh — pull-based, atomic deploy of sablia-site to this host (plan sablia-io-lot0-vps, Decision 2).
#
#   deploy.sh <prod|preview> [--force]    build the slot's configured ref if it moved, smoke it, switch, check
#   deploy.sh all                         both slots, prod first (what the timer runs)
#   deploy.sh rollback <prod|preview>     swap <slot> and <slot>.prev (about 3 s)
#
# A slot is a symlink to releases/<sha7>-<UTC time>/ holding bin/start, RELEASE and dist/ (dist/index.js is
# the Express server, dist/public the Next static export: `<route>.html`, or `<route>/index.html`). The unit
# only ever runs <slot>/bin/start. The build runs with SABLIA_SLOT=<slot> so that content-gates.sh --auto is
# strict on prod only. A force trigger (triggers/<slot>-force) is consumed only once the resource gate lets a
# build run, so a publication's rebuild request is never lost under memory or load pressure. Nothing about the live
# slot changes until a candidate has built, been prerendered completely and answered a smoke test on a
# scratch port; after the switch a failing health check flips the slot back by itself.
#
# Trust boundary (security review 2026-10-18): the build runs repository code as the sablia-site user, which
# also owns the release tree. Whoever can push to a CONFIGURED ref can therefore run code as that user (no
# access to the secrets: those are read by systemd only). Hence: refs are set by root, `main` is protected on
# GitHub (orchestrator gesture), releases are read-only once built, and the units drop every capability.
# Separate users per slot would be the next step if the repository ever gets more committers.
#
# Config (root-owned, read here): $CONF_DIR/{prod-ref,preview-ref} (default main), build.env (640, build
# variables: the public anon key), deploy.env (INDEXNOW_ENABLED). Secrets of the RUNNING app live in
# $CONF_DIR/<slot>.env and are read by systemd only. Output goes to the journal; no value from an env
# file is ever printed.
#
# Test seams (environment): SITE_ROOT CONF_DIR REPO_URL SYSTEMCTL PORT_PROD PORT_PREVIEW PORT_SCRATCH
# DEPLOY_MIN_MEM_KB DEPLOY_MAX_LOAD DEPLOY_HEALTH_WAIT DEPLOY_KEEP.
set -u -o pipefail

SITE_ROOT="${SITE_ROOT:-/opt/sablia/sites/sablia-site}"
CONF_DIR="${CONF_DIR:-/etc/sablia-site}"
REPO_URL="${REPO_URL:-https://github.com/BriGadja/sablia-site.git}"
SYSTEMCTL="${SYSTEMCTL:-systemctl}"   # restart rights come from the polkit rule (deploy/50-sablia-site.rules)
PORT_PROD="${PORT_PROD:-5000}"
PORT_PREVIEW="${PORT_PREVIEW:-5001}"
PORT_SCRATCH="${PORT_SCRATCH:-5099}"
MIN_MEM_KB="${DEPLOY_MIN_MEM_KB:-3145728}"
MAX_LOAD="${DEPLOY_MAX_LOAD:-8}"
HEALTH_WAIT="${DEPLOY_HEALTH_WAIT:-30}"
KEEP="${DEPLOY_KEEP:-3}"
BACKOFFS=(300 900 3600)

REPO="$SITE_ROOT/repo.git"
LOG_DIR="$SITE_ROOT/logs"
SMOKE_PID=""

log()   { echo "[$(date -u +%FT%TZ)] $*"; }
alert() { # <kind> <message>: loud line in the journal + a marker the morning brief reads
  # readable by the human user (the morning brief reads them): the unit's umask is 0027
  mkdir -p "$SITE_ROOT/alerts" && chmod 755 "$SITE_ROOT/alerts"
  local f; f="$SITE_ROOT/alerts/$1-$(date -u +%Y%m%dT%H%M%SZ).txt"
  echo "$(date -u +%FT%TZ) $2" > "$f" && chmod 644 "$f"
  find "$SITE_ROOT/alerts" -name '*.txt' -mtime +14 -delete 2>/dev/null
  echo "ALERT [$1] $2"
}
die()   { log "$*"; exit 1; }
usage() { echo "usage: deploy.sh <prod|preview> [--force] | deploy.sh rollback <prod|preview>" >&2; exit 2; }

port_of() { [ "$1" = prod ] && echo "$PORT_PROD" || echo "$PORT_PREVIEW"; }
valid_slot() { case "${1:-}" in prod|preview) return 0;; *) return 1;; esac; }

cleanup() { [ -n "$SMOKE_PID" ] && kill "$SMOKE_PID" 2>/dev/null; return 0; }
trap cleanup EXIT

release_on_port() { # <port> -> release string from /healthz, empty when unreachable
  curl -fsS --max-time 2 "http://127.0.0.1:$1/healthz" 2>/dev/null | sed -n 's/.*"release":"\([^"]*\)".*/\1/p'
}
wait_release() { # <port> <expected>
  local i
  for i in $(seq 1 "$HEALTH_WAIT"); do
    [ "$(release_on_port "$1")" = "$2" ] && return 0
    sleep 1
  done
  return 1
}

point() { # <link> <target>: atomic symlink replacement
  ln -sfn "$2" "$1.new" && mv -T "$1.new" "$1"
}

restart_slot() { $SYSTEMCTL restart "sablia-site@$1"; }

lock() { # <seconds to wait: 0 = give up at once>
  mkdir -p "$SITE_ROOT"
  exec 9>"$SITE_ROOT/.deploy.lock"
  if [ "$1" = 0 ]; then
    flock -n 9 || { log "another deploy is already running: skipping"; exit 0; }
  else
    flock -w "$1" 9 || die "another deploy is already running: giving up after ${1}s"
  fi
}

resources_ok() {
  local mem load
  mem="$(awk '/MemAvailable/ {print $2}' /proc/meminfo)"
  load="$(cut -d' ' -f1 /proc/loadavg)"
  if [ "${mem:-0}" -lt "$MIN_MEM_KB" ]; then log "skip: MemAvailable ${mem} kB is under ${MIN_MEM_KB} kB, next tick retries"; return 1; fi
  if ! awk -v l="$load" -v m="$MAX_LOAD" 'BEGIN { exit !(l <= m) }'; then log "skip: load average $load is over $MAX_LOAD, next tick retries"; return 1; fi
}

assert_prerendered() { # <build dir>: every sitemap URL has its static page
  local dist="$1/dist/public" loc p f missing=0
  [ -s "$dist/sitemap.xml" ] || { log "build produced no sitemap.xml"; return 1; }
  while read -r loc; do
    p="${loc#*://}"; p="/${p#*/}"; p="${p%/}"
    if [ -z "$p" ]; then f="$dist/index.html"; else f="$dist$p.html"; [ -s "$f" ] || f="$dist$p/index.html"; fi
    [ -s "$f" ] || { log "sitemap lists $loc but neither $dist$p.html nor $dist$p/index.html was prerendered"; missing=1; }
  done < <(grep -o '<loc>[^<]*</loc>' "$dist/sitemap.xml" | sed 's#<loc>##; s#</loc>##')
  return $missing
}

smoke() { # <release dir> <release id>: the candidate on a scratch port, no secrets
  local rel="$1" id="$2" i code
  if curl -fsS --max-time 1 "http://127.0.0.1:$PORT_SCRATCH/healthz" >/dev/null 2>&1; then
    log "smoke: scratch port $PORT_SCRATCH is already in use"; return 1
  fi
  # 9>&-: the candidate must not inherit the deploy lock, or a straggler would block every later deploy
  ( cd "$rel" && HOST=127.0.0.1 PORT="$PORT_SCRATCH" PORT_SCRATCH="$PORT_SCRATCH" RELEASE_FILE="$rel/RELEASE" exec "$rel/bin/start" ) \
    9>&- > "$LOG_DIR/smoke-$id.log" 2>&1 &
  SMOKE_PID=$!
  for i in $(seq 1 20); do
    [ "$(release_on_port "$PORT_SCRATCH")" = "$id" ] && break
    sleep 0.5
  done
  local ok=0
  [ "$(release_on_port "$PORT_SCRATCH")" = "$id" ] || { log "smoke: /healthz did not report release $id on the scratch port"; ok=1; }
  if [ $ok = 0 ]; then
    local b="http://127.0.0.1:$PORT_SCRATCH"
    for path in / /cgv /escalier-modeles /ressources /sitemap.xml; do
      code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$b$path")"
      [ "$code" = 200 ] || { log "smoke: GET $path answered $code, expected 200"; ok=1; }
    done
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$b/__smoke-unknown-path")"
    [ "$code" = 404 ] || { log "smoke: unknown path answered $code, expected 404"; ok=1; }
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$b/api/contact")"
    [ "$code" = 405 ] || { log "smoke: GET /api/contact answered $code, expected 405"; ok=1; }
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$b/api/newsletter")"
    [ "$code" = 405 ] || { log "smoke: GET /api/newsletter answered $code, expected 405"; ok=1; }
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$b/api/nope")"
    [ "$code" = 404 ] || { log "smoke: GET /api/nope answered $code, expected 404"; ok=1; }
  fi
  kill "$SMOKE_PID" 2>/dev/null; wait "$SMOKE_PID" 2>/dev/null; SMOKE_PID=""
  return $ok
}

prune_releases() {
  local keep_refs="" l d
  for l in prod prod.prev preview preview.prev; do
    d="$(readlink -f "$SITE_ROOT/$l" 2>/dev/null)" && keep_refs="$keep_refs $d"
  done
  ls -1dt "$SITE_ROOT"/releases/*/ 2>/dev/null | sed 's#/$##' | tail -n +"$((KEEP + 1))" | while read -r d; do
    case " $keep_refs " in *" $d "*) ;; *) chmod -R u+w "$d" && rm -rf "$d" && log "pruned $(basename "$d")";; esac
  done
}

indexnow() { # <slot> <release dir> <previous release dir or empty>
  [ "$1" = prod ] || return 0
  local enabled args=()
  enabled="$( [ -r "$CONF_DIR/deploy.env" ] && . "$CONF_DIR/deploy.env" 2>/dev/null; echo "${INDEXNOW_ENABLED:-0}" )"
  if [ "$enabled" != 1 ]; then log "IndexNow disabled (INDEXNOW_ENABLED=$enabled): nothing submitted"; return 0; fi
  args=(--sitemap "$2/dist/public/sitemap.xml")
  if [ -n "$3" ] && [ -s "$3/dist/public/sitemap.xml" ]; then args+=(--previous-sitemap "$3/dist/public/sitemap.xml"); else args+=(--all); fi
  log "IndexNow: node seo/indexnow.mjs ${args[*]}"
  if ! node "$2/seo/indexnow.mjs" "${args[@]}" >> "$LOG_DIR/indexnow.log" 2>&1; then
    alert indexnow "IndexNow refused the submission (400/403) or the key file did not answer: see $LOG_DIR/indexnow.log"
  fi
  return 0
}

# ── rollback ─────────────────────────────────────────────────────────────────
rollback() {
  local slot="$1" link="$SITE_ROOT/$1" cur prev
  lock 60
  [ -L "$link.prev" ] || die "no previous release to roll back to for $slot"
  cur="$(readlink -f "$link")"; prev="$(readlink -f "$link.prev")"
  [ -d "$prev" ] || die "previous release $prev no longer exists"
  point "$link" "$prev"; point "$link.prev" "$cur"
  restart_slot "$slot"
  if wait_release "$(port_of "$slot")" "$(cat "$link/RELEASE")"; then
    log "rolled $slot back to $(cat "$link/RELEASE") (was $(cat "$cur/RELEASE"))"
  else
    point "$link" "$cur"; point "$link.prev" "$prev"; restart_slot "$slot"
    die "rollback of $slot failed its health check: restored $(cat "$cur/RELEASE")"
  fi
}

# ── deploy ───────────────────────────────────────────────────────────────────
deploy() {
  local slot="$1" force="$2" link="$SITE_ROOT/$1" ref sha short cur id work rel prev_target="" i
  lock 0
  mkdir -p "$SITE_ROOT/releases" "$SITE_ROOT/build" "$SITE_ROOT/failed" "$LOG_DIR" "$SITE_ROOT/.npm-cache"
  resources_ok || return 0
  # A trigger file asks for a rebuild of the CURRENT sha (a resource was published: scripts/site-redeploy.py).
  # It is read AFTER the resource gate (a skipped tick keeps it) and consumed at once, so a failing forced
  # build is not retried every minute.
  if [ -f "$SITE_ROOT/triggers/$slot-force" ]; then
    rm -f "$SITE_ROOT/triggers/$slot-force"; force=1
    log "$slot: forced rebuild requested (trigger consumed)"
  fi

  ref="$(cat "$CONF_DIR/$slot-ref" 2>/dev/null || echo main)"
  case "$ref" in ""|*[!A-Za-z0-9._/-]*|*..*) die "refusing ref '$ref' (characters outside [A-Za-z0-9._/-])";; esac
  sha="$(git ls-remote "$REPO_URL" "refs/heads/$ref" 2>/dev/null | awk '{print $1}' | head -1)"
  if [ -z "$sha" ]; then alert resolve "cannot resolve refs/heads/$ref on $REPO_URL (network or wrong ref): retrying next tick"; return 0; fi
  short="${sha:0:7}"
  cur="$(cat "$link/RELEASE" 2>/dev/null || true)"
  if [ "$force" = 0 ] && [ "${cur%%-*}" = "$short" ]; then return 0; fi

  if [ "$force" = 0 ] && [ -f "$SITE_ROOT/failed/$short" ]; then
    local n t next
    read -r n t < "$SITE_ROOT/failed/$short"
    next=$(( t + ${BACKOFFS[$(( (n > 3 ? 3 : n) - 1 ))]} ))
    if [ "$(date +%s)" -lt "$next" ]; then log "skip $short: failed $n time(s), next attempt in $(( next - $(date +%s) ))s (--force overrides)"; return 0; fi
  fi

  id="${short}-$(date -u +%Y%m%dT%H%M%SZ)"
  work="$SITE_ROOT/build/$id"; rel="$SITE_ROOT/releases/$id"
  local blog="$LOG_DIR/build-$id.log"
  fail() { # <what>: record the failure, keep the live slot, clean up
    local n=0 t
    [ -f "$SITE_ROOT/failed/$short" ] && read -r n t < "$SITE_ROOT/failed/$short"
    echo "$(( n + 1 )) $(date +%s)" > "$SITE_ROOT/failed/$short"
    alert deploy "$slot $short: $1 (live slot unchanged; log $blog)"
    [ -s "$blog" ] && tail -n 15 "$blog" | sed 's/^/    | /'
    rm -rf "$work" "$rel"
    return 1
  }

  log "$slot: $ref moved to $short (was ${cur:-none}); building $id"
  mkdir -p "$work"
  [ -d "$REPO" ] || git init --bare "$REPO" >> "$blog" 2>&1
  git -C "$REPO" fetch --depth=1 "$REPO_URL" "$sha" >> "$blog" 2>&1 || { fail "git fetch of $sha failed"; return 1; }
  git -C "$REPO" archive --format=tar "$sha" 2>> "$blog" | tar -x -C "$work" || { fail "git archive of $sha failed"; return 1; }

  ( cd "$work" || exit 1
    npm ci --ignore-scripts --no-audit --no-fund --cache "$SITE_ROOT/.npm-cache" ) >> "$blog" 2>&1 || { fail "npm ci failed"; return 1; }
  ( cd "$work" || exit 1
    set -a; [ -r "$CONF_DIR/build.env" ] && . "$CONF_DIR/build.env"; set +a
    export PRERENDER_STRICT=1 SABLIA_SLOT="$slot"
    npm run build ) >> "$blog" 2>&1 || { fail "build failed"; return 1; }
  assert_prerendered "$work" >> "$blog" 2>&1 || { tail -n 5 "$blog"; fail "a page listed in the sitemap was not prerendered"; return 1; }

  mkdir -p "$rel/bin" "$rel/seo"
  mv "$work/dist" "$rel/dist" || { fail "could not assemble the release"; return 1; }
  cp "$work/scripts/seo/indexnow.mjs" "$work/scripts/seo/indexnow.config.json" "$rel/seo/" 2>/dev/null || true
  printf '#!/bin/sh\ncd "$(dirname "$0")/.." || exit 1\nexec node dist/index.js\n' > "$rel/bin/start"
  chmod 755 "$rel/bin/start"
  echo "$id" > "$rel/RELEASE"
  rm -rf "$work"

  smoke "$rel" "$id" >> "$blog" 2>&1 || { tail -n 8 "$blog"; fail "smoke test failed on the scratch port"; return 1; }
  log "$slot: $id passed the smoke test; switching"
  # Read-only from here on: a later build (another slot, a mistaken script) cannot rewrite a release in place.
  chmod -R a-w "$rel"

  [ -L "$link" ] && prev_target="$(readlink -f "$link")"
  local prev_prev=""
  [ -L "$link.prev" ] && prev_prev="$(readlink -f "$link.prev")"
  point "$link" "$rel"
  [ -n "$prev_target" ] && point "$link.prev" "$prev_target"
  restart_slot "$slot"
  if ! wait_release "$(port_of "$slot")" "$id"; then
    log "$slot: post-switch health check failed: reverting"
    if [ -n "$prev_target" ]; then
      point "$link" "$prev_target"
      if [ -n "$prev_prev" ]; then point "$link.prev" "$prev_prev"; else rm -f "$link.prev"; fi
      restart_slot "$slot"
      wait_release "$(port_of "$slot")" "$(cat "$link/RELEASE")" || alert down "$slot is DOWN after a failed switch and a failed revert"
    else
      rm -f "$link"; alert down "$slot is DOWN: the first release failed its health check"
    fi
    fail "post-switch health check failed (reverted)"
    return 1
  fi
  rm -f "$SITE_ROOT/failed/$short"
  log "$slot: now serving $id"
  prune_releases
  indexnow "$slot" "$rel" "$prev_target"
  return 0
}

# ── main ─────────────────────────────────────────────────────────────────────
refuse_root() {
  # A build as root would leave root-owned files under the site tree: the service user could not clean them.
  [ "$(id -u)" != 0 ] || [ -n "${DEPLOY_ALLOW_ROOT:-}" ] || die "refusing to build as root: run it as the sablia-site user (the systemd unit does)"
}
case "${1:-}" in
  rollback) valid_slot "${2:-}" || usage; rollback "$2";;
  prod|preview) refuse_root; force=0; [ "${2:-}" = "--force" ] && force=1; deploy "$1" "$force";;
  all) # both slots, prod first; one failing slot never stops the other; non-zero if any failed
    refuse_root; rc=0
    for slot in prod preview; do ( deploy "$slot" 0 ) || rc=1; done
    exit $rc;;
  *) usage;;
esac
