#!/bin/bash
# Hermetic test of deploy/deploy.sh (US-64, AC-3). Fake `git`, `npm`, `systemctl`, `sudo` on PATH and a
# stub app server stand in for the real ones; nothing touches /opt, /etc or the network.
# usage: bash deploy/deploy.test.sh        exit 0 = every scenario holds
HERE="$(cd "$(dirname "$0")" && pwd)"
DEPLOY="$HERE/deploy.sh"
[ -f "$DEPLOY" ] || { echo "FAIL deploy.sh missing"; exit 1; }

T="$(mktemp -d)"; fails=0
PIDF="$T/pids"; mkdir -p "$PIDF"
cleanup() { for f in "$PIDF"/*; do [ -f "$f" ] && kill "$(cat "$f")" 2>/dev/null; done; rm -rf "$T"; }
trap cleanup EXIT
ok()    { echo "PASS $1"; }
bad()   { echo "FAIL $1"; fails=$((fails+1)); }
check() { if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (expected '$3', got '$2')"; fi; }

export SITE_ROOT="$T/site" CONF_DIR="$T/etc" FAKE_REMOTE="$T/remote" FAKE_CALLS="$T/calls.log" FAKE_PIDS="$PIDF"
export REPO_URL="https://example.invalid/sablia-site.git" SYSTEMCTL="systemctl"
export PORT_PROD=15000 PORT_PREVIEW=15001 PORT_SCRATCH=15099
export DEPLOY_MIN_MEM_KB=1 DEPLOY_MAX_LOAD=100000 DEPLOY_HEALTH_WAIT=8
export FAKE_STUB="$T/stub-server.js"
mkdir -p "$SITE_ROOT" "$CONF_DIR" "$FAKE_REMOTE/heads" "$FAKE_REMOTE/trees" "$T/bin"
printf 'VITE_SUPABASE_ANON_KEY=SECRETVALUE-do-not-print\n' > "$CONF_DIR/build.env"
printf 'INDEXNOW_ENABLED=0\n' > "$CONF_DIR/deploy.env"
echo main > "$CONF_DIR/prod-ref"; echo feature > "$CONF_DIR/preview-ref"
: > "$FAKE_CALLS"

cat > "$FAKE_STUB" <<'JS'
const http = require('http'), fs = require('fs'), path = require('path')
const port = +process.env.PORT, host = process.env.HOST || '127.0.0.1'
const rel = fs.readFileSync(process.env.RELEASE_FILE, 'utf8').trim()
const fp = path.join(__dirname, 'flags')
const flags = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : ''
const scratch = port === +process.env.PORT_SCRATCH
http.createServer((req, res) => {
  const u = req.url.split('?')[0]
  if (u === '/healthz') {
    if (flags.includes('post=broken') && !scratch) { res.statusCode = 500; return res.end('{}') }
    const r = flags.includes('smoke=broken') && scratch ? 'wrong' : rel
    res.setHeader('content-type', 'application/json')
    return res.end(JSON.stringify({ ok: true, release: r }))
  }
  if (u === '/api/contact' && req.method === 'GET') { res.statusCode = 405; res.setHeader('allow', 'POST'); return res.end() }
  if (u.startsWith('/api/')) { res.statusCode = 404; return res.end('Not Found') }
  if (u === '/' && flags.includes('smoke=home500')) { res.statusCode = 500; return res.end('boom') }
  res.statusCode = 200; res.end('<html>ok</html>')
}).listen(port, host)
process.on('SIGTERM', () => process.exit(0))
JS

# ── fakes ────────────────────────────────────────────────────────────────────
cat > "$T/bin/git" <<'EOF'
#!/bin/bash
echo "git $*" >> "$FAKE_CALLS"
args=("$@"); [ "${args[0]}" = "-C" ] && { REPO="${args[1]}"; args=("${args[@]:2}"); }
case "${args[0]}" in
  ls-remote) f="$FAKE_REMOTE/heads/$(echo "${args[2]#refs/heads/}" | tr / _)"; [ -f "$f" ] || exit 2; printf '%s\t%s\n' "$(cat "$f")" "${args[2]}";;
  init|remote|config|fetch) [ "${args[0]}" = init ] && mkdir -p "${args[-1]}"; exit 0;;
  archive) sha="${args[-1]}"; tar -C "$FAKE_REMOTE/trees/$sha" -cf - .;;
  *) exit 0;;
esac
EOF
cat > "$T/bin/npm" <<'EOF'
#!/bin/bash
echo "npm $* (cwd $(basename "$PWD"))" >> "$FAKE_CALLS"
flags="$(cat .fake-flags 2>/dev/null)"
case "$1" in
  ci) case "$flags" in *npm-ci=fail*) exit 1;; esac; mkdir -p node_modules; touch node_modules/.fake; exit 0;;
  run)
    [ -n "${FAKE_BUILD_SLEEP:-}" ] && sleep "$FAKE_BUILD_SLEEP"
    case "$flags" in *build=fail*) echo "vite: build exploded" >&2; exit 1;; esac
    [ "${PRERENDER_STRICT:-}" = 1 ] || { echo "PRERENDER_STRICT not set" >&2; exit 1; }
    [ -n "${VITE_SUPABASE_ANON_KEY:-}" ] || { echo "anon key missing from build env" >&2; exit 1; }
    mkdir -p dist/public/cgv dist/public/ressources/demo
    echo home > dist/public/index.html; echo cgv > dist/public/cgv/index.html; echo demo > dist/public/ressources/demo/index.html
    case "$flags" in *sitemap=missing-page*) locs='<loc>https://sablia.io/</loc><loc>https://sablia.io/ressources/ghost/</loc>';; *) locs='<loc>https://sablia.io/</loc><loc>https://sablia.io/cgv</loc><loc>https://sablia.io/ressources/demo</loc>';; esac
    echo "<urlset>$locs</urlset>" > dist/public/sitemap.xml
    cp "$FAKE_STUB" dist/index.js; echo "$flags" > dist/flags
    exit 0;;
esac
EOF
cat > "$T/bin/systemctl" <<'EOF'
#!/bin/bash
echo "systemctl $*" >> "$FAKE_CALLS"
[ "$1" = restart ] || exit 0
slot="${2#sablia-site@}"
[ -f "$FAKE_PIDS/$slot" ] && { kill "$(cat "$FAKE_PIDS/$slot")" 2>/dev/null; rm -f "$FAKE_PIDS/$slot"; sleep 0.2; }
port=$PORT_PROD; [ "$slot" = preview ] && port=$PORT_PREVIEW
# 9>&- on the whole subshell: the "service" must not inherit deploy.sh's lock (systemd would not pass it on)
# A simple command (no && list) so that $! is the server's own PID: nohup and bin/start both exec.
( cd "$SITE_ROOT/$slot" 2>/dev/null || exit 1
  HOST=127.0.0.1 PORT=$port RELEASE_FILE="$SITE_ROOT/$slot/RELEASE" PORT_SCRATCH=$PORT_SCRATCH nohup "$SITE_ROOT/$slot/bin/start" >/dev/null 2>&1 &
  echo $! > "$FAKE_PIDS/$slot" ) 9>&-
exit 0
EOF
cat > "$T/bin/sudo" <<'EOF'
#!/bin/bash
[ "$1" = -n ] && shift; exec "$@"
EOF
chmod +x "$T"/bin/*
export PATH="$T/bin:$PATH"

# fake indexnow: records its argv, exit code from the tree flag
make_commit() { # <name> [flags...] -> sets SHA; publishes it as <ref>
  local name="$1"; shift; local ref="$1"; shift
  SHA="$(printf '%s' "$name-$RANDOM-$RANDOM" | sha1sum | cut -c1-40)"
  local d="$FAKE_REMOTE/trees/$SHA"; mkdir -p "$d/scripts/seo"
  echo "{}" > "$d/package.json"; echo "$*" > "$d/.fake-flags"
  cat > "$d/scripts/seo/indexnow.mjs" <<JS
import { appendFileSync } from 'node:fs'
appendFileSync(process.env.FAKE_CALLS, 'indexnow ' + process.argv.slice(2).join(' ') + '\n')
process.exit(process.env.INDEXNOW_EXIT ? +process.env.INDEXNOW_EXIT : 0)
JS
  echo '{"host":"sablia.io","key":"k"}' > "$d/scripts/seo/indexnow.config.json"
  echo "$SHA" > "$FAKE_REMOTE/heads/$ref"
}
slotrel() { cat "$SITE_ROOT/$1/RELEASE" 2>/dev/null; }
slotdir() { readlink -f "$SITE_ROOT/$1" 2>/dev/null; }
calls() { grep -c "$1" "$FAKE_CALLS"; }
health() { curl -s --max-time 2 "http://127.0.0.1:$1/healthz" | sed -n 's/.*"release":"\([^"]*\)".*/\1/p'; }

echo "-- 1. first deploy of the preview slot"
make_commit one feature ""
bash "$DEPLOY" preview > "$T/out1.log" 2>&1; check "first deploy exits 0" "$?" 0
R1="$(slotrel preview)"; check "preview slot serves release <sha7>-<ts>" "${R1%%-*}" "${SHA:0:7}"
check "the slot is a symlink into releases/" "$(slotdir preview | sed "s#$SITE_ROOT/##;s#/.*##")" releases
[ -x "$SITE_ROOT/preview/bin/start" ] && ok "bin/start is executable" || bad "bin/start missing"
[ -s "$SITE_ROOT/preview/dist/index.js" ] && ok "dist/index.js present" || bad "dist/index.js"
[ -d "$SITE_ROOT/preview/node_modules" ] && bad "release must not ship node_modules" || ok "no node_modules in the release"
[ -e "$SITE_ROOT/preview.prev" ] && bad "no .prev on a first deploy" || ok "no .prev yet"
check "the running slot answers the release on its port" "$(health $PORT_PREVIEW)" "$R1"
check "systemd was asked to restart sablia-site@preview once" "$(calls 'systemctl restart sablia-site@preview')" 1
grep -q "npm ci --ignore-scripts" "$FAKE_CALLS" && ok "npm ci runs with --ignore-scripts (R1)" || bad "npm ci --ignore-scripts"
grep -q SECRETVALUE "$T/out1.log" && bad "the build env value leaked into the output" || ok "no env value in the output"
[ -d "$SITE_ROOT/build" ] && [ -n "$(ls -A "$SITE_ROOT/build" 2>/dev/null)" ] && bad "build tree left behind" || ok "build tree removed"

echo "-- 2. same sha: no-op"
before="$(calls 'npm ')"
bash "$DEPLOY" preview > "$T/out2.log" 2>&1; check "no-op exits 0" "$?" 0
check "no build for an unchanged sha" "$(calls 'npm ')" "$before"
check "no second restart" "$(calls 'systemctl restart sablia-site@preview')" 1

echo "-- 3. a failing build leaves the slot untouched; backoff; --force"
make_commit two feature "build=fail"
BAD="$SHA"
bash "$DEPLOY" preview > "$T/out3.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "failed build exits non-zero" || bad "failed build must exit non-zero"
check "slot still on release one" "$(slotrel preview)" "$R1"
check "slot still served" "$(health $PORT_PREVIEW)" "$R1"
[ -f "$SITE_ROOT/failed/${BAD:0:7}" ] && ok "failed marker written" || bad "failed marker"
ls "$SITE_ROOT"/alerts/* >/dev/null 2>&1 && ok "alert written" || bad "alert written"
before="$(calls 'npm ')"
bash "$DEPLOY" preview > "$T/out3b.log" 2>&1; check "within the backoff: skipped, exit 0" "$?" 0
check "no rebuild during the backoff" "$(calls 'npm ')" "$before"
bash "$DEPLOY" preview --force > "$T/out3c.log" 2>&1; [ "$(calls 'npm ')" -gt "$before" ] && ok "--force retries" || bad "--force retries"
check "slot still on release one after the forced failure" "$(slotrel preview)" "$R1"
[ -e "$SITE_ROOT/releases" ] && [ "$(ls "$SITE_ROOT/releases" | wc -l)" = 1 ] && ok "no half-built release kept" || bad "half-built release kept"

echo "-- 4. a failing smoke test leaves the slot untouched"
make_commit three feature "smoke=broken"
bash "$DEPLOY" preview > "$T/out4.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "smoke failure exits non-zero" || bad "smoke failure exit"
check "slot still on release one" "$(slotrel preview)" "$R1"
check "no restart happened" "$(calls 'systemctl restart sablia-site@preview')" 1
make_commit threeb feature "smoke=home500"
bash "$DEPLOY" preview > "$T/out4b.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "a 500 on / fails the smoke" || bad "500 on / must fail"
check "slot still on release one (500 on /)" "$(slotrel preview)" "$R1"
grep -q "scratch\|smoke" "$T/out4.log" && ok "the log names the smoke step" || bad "smoke named in the log"

echo "-- 5. a sitemap page that was not prerendered refuses the build"
make_commit four feature "sitemap=missing-page"
bash "$DEPLOY" preview > "$T/out5.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "missing prerendered page exits non-zero" || bad "missing prerendered page"
check "slot still on release one" "$(slotrel preview)" "$R1"
grep -q "ressources/ghost" "$T/out5.log" && ok "the missing page is named" || bad "missing page named"

echo "-- 6. post-switch health failure flips back"
make_commit five feature "post=broken"
bash "$DEPLOY" preview > "$T/out6.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "post-check failure exits non-zero" || bad "post-check failure exit"
check "slot is back on release one" "$(slotrel preview)" "$R1"
check "release one answers again" "$(health $PORT_PREVIEW)" "$R1"
check "restarted twice (switch + revert)" "$(calls 'systemctl restart sablia-site@preview')" 3

echo "-- 7. healthy deploy, then rollback and roll forward"
make_commit six feature ""
bash "$DEPLOY" preview > "$T/out7.log" 2>&1; check "deploy exits 0" "$?" 0
R2="$(slotrel preview)"; [ "$R2" != "$R1" ] && ok "slot moved to a new release" || bad "slot moved"
check ".prev holds release one" "$(cat "$SITE_ROOT/preview.prev/RELEASE")" "$R1"
bash "$DEPLOY" rollback preview > "$T/out7b.log" 2>&1; check "rollback exits 0" "$?" 0
check "rollback puts release one back" "$(slotrel preview)" "$R1"
check "and it answers" "$(health $PORT_PREVIEW)" "$R1"
check ".prev now holds release two" "$(cat "$SITE_ROOT/preview.prev/RELEASE")" "$R2"
bash "$DEPLOY" rollback preview > "$T/out7c.log" 2>&1; check "a second rollback rolls forward" "$(slotrel preview)" "$R2"
bash "$DEPLOY" rollback nope > "$T/out7d.log" 2>&1; [ $? -ne 0 ] && ok "rollback of an unknown slot refused" || bad "unknown slot"
bash "$DEPLOY" "../etc" > "$T/out7e.log" 2>&1; [ $? -eq 2 ] && ok "a path-like slot is refused (exit 2)" || bad "path-like slot"

echo "-- 8. retention keeps the last 3 releases (and what the slots reference)"
for n in 7 8 9 10; do make_commit "r$n" feature ""; sleep 1; bash "$DEPLOY" preview > "$T/out8-$n.log" 2>&1; done
check "three releases kept" "$(ls "$SITE_ROOT/releases" | wc -l)" 3

echo "-- 9. two deploys never overlap"
make_commit slow feature ""
( FAKE_BUILD_SLEEP=3 bash "$DEPLOY" preview > "$T/out9a.log" 2>&1 ) &
sleep 1
before="$(calls 'npm run')"
bash "$DEPLOY" preview > "$T/out9b.log" 2>&1; check "the second run exits 0 at once" "$?" 0
grep -qi "already running\|another deploy" "$T/out9b.log" && ok "it says why" || bad "lock message"
wait
check "the second run started no build of its own" "$(calls 'npm run')" "$before"

echo "-- 10. resource guard"
make_commit heavy feature ""
before="$(calls 'npm ')"
DEPLOY_MIN_MEM_KB=999999999999 bash "$DEPLOY" preview > "$T/out10.log" 2>&1; check "low memory: skipped, exit 0" "$?" 0
check "no build when memory is short" "$(calls 'npm ')" "$before"
DEPLOY_MAX_LOAD=0 bash "$DEPLOY" preview > "$T/out10b.log" 2>&1; check "high load: skipped, exit 0" "$?" 0
check "no build when the host is loaded" "$(calls 'npm ')" "$before"

echo "-- 11. IndexNow: prod only, gated, right arguments"
: > "$FAKE_CALLS"
make_commit p1 main ""
bash "$DEPLOY" prod > "$T/out11a.log" 2>&1; check "prod deploy with the gate closed exits 0" "$?" 0
check "gate closed (INDEXNOW_ENABLED=0): IndexNow not called" "$(calls '^indexnow')" 0
printf 'INDEXNOW_ENABLED=1\n' > "$CONF_DIR/deploy.env"
make_commit p2 main ""; sleep 1
bash "$DEPLOY" prod > "$T/out11b.log" 2>&1; check "prod deploy with the gate open exits 0" "$?" 0
P2="$(slotrel prod)"; PRIOR="$(cat "$SITE_ROOT/prod.prev/RELEASE")"
line="$(grep '^indexnow' "$FAKE_CALLS" | tail -1)"
case "$line" in *"--sitemap $SITE_ROOT/releases/$P2/dist/public/sitemap.xml --previous-sitemap $SITE_ROOT/releases/$PRIOR/dist/public/sitemap.xml"*) ok "IndexNow gets the new and the previous sitemap files";; *) bad "IndexNow arguments: $line";; esac
make_commit pre feature ""
bash "$DEPLOY" preview > "$T/out11c.log" 2>&1
check "a preview deploy never calls IndexNow" "$(calls '^indexnow')" 1
# first prod deploy ever -> --all
rm -rf "$SITE_ROOT/prod" "$SITE_ROOT/prod.prev"; : > "$FAKE_CALLS"
bash "$DEPLOY" prod --force > "$T/out11d.log" 2>&1
line="$(grep '^indexnow' "$FAKE_CALLS" | tail -1)"
case "$line" in *"--previous-sitemap"*) bad "no previous release: must not pass --previous-sitemap";; *"--all"*"") case "$line" in *"--sitemap "*) ok "no previous release: --sitemap … --all";; *) bad "--all fallback: $line";; esac;; *) bad "--all fallback: $line";; esac
# IndexNow failure is loud but never undoes a live deploy
make_commit p3 main ""; sleep 1
INDEXNOW_EXIT=1 bash "$DEPLOY" prod > "$T/out11e.log" 2>&1; check "IndexNow failure: the deploy still exits 0" "$?" 0
ls "$SITE_ROOT"/alerts/indexnow* >/dev/null 2>&1 && ok "IndexNow failure leaves an alert marker" || bad "IndexNow alert marker"
check "the new prod release is live" "$(health $PORT_PROD)" "$(slotrel prod)"

echo "-- 12. \`all\` deploys both slots, and one failing slot does not stop the other"
make_commit allprod main ""; make_commit allpre feature ""
before_prod="$(slotrel prod)"; before_pre="$(slotrel preview)"
bash "$DEPLOY" all > "$T/out12a.log" 2>&1; check "all: exit 0" "$?" 0
[ "$(slotrel prod)" != "$before_prod" ] && [ "$(slotrel preview)" != "$before_pre" ] && ok "all: both slots moved" || bad "all: both slots moved"
make_commit allprod2 main "build=fail"; make_commit allpre2 feature ""
before_pre="$(slotrel preview)"
bash "$DEPLOY" all > "$T/out12b.log" 2>&1; rc=$?; [ $rc -ne 0 ] && ok "all: exit non-zero when one slot failed" || bad "all: exit status"
[ "$(slotrel preview)" != "$before_pre" ] && ok "all: the healthy slot still deployed" || bad "all: healthy slot deployed after the failing one"

echo "-- 13. a trigger file forces a rebuild of the same sha (a resource was published) and is consumed"
make_commit same preview_unused ""
make_commit forced feature ""
bash "$DEPLOY" preview > "$T/out13a.log" 2>&1
R_BEFORE="$(slotrel preview)"; before="$(calls 'npm run')"
bash "$DEPLOY" preview > "$T/out13b.log" 2>&1; check "unchanged sha without a trigger: nothing" "$(calls 'npm run')" "$before"
mkdir -p "$SITE_ROOT/triggers"; : > "$SITE_ROOT/triggers/preview-force"
sleep 1
bash "$DEPLOY" preview > "$T/out13c.log" 2>&1; check "trigger present: exit 0" "$?" 0
[ "$(slotrel preview)" != "$R_BEFORE" ] && [ "$(slotrel preview | cut -d- -f1)" = "${R_BEFORE%%-*}" ] && ok "same sha, new release id" || bad "same sha rebuilt under a new release id"
[ -e "$SITE_ROOT/triggers/preview-force" ] && bad "the trigger must be consumed" || ok "the trigger file was consumed"
check "prod trigger does not force the preview slot" "$(touch "$SITE_ROOT/triggers/prod-force"; before="$(calls 'npm run')"; bash "$DEPLOY" preview >/dev/null 2>&1; echo $(( $(calls 'npm run') - before )))" 0
rm -f "$SITE_ROOT/triggers/prod-force"

echo "-- 14. no secret value anywhere in the logs"
grep -rq SECRETVALUE "$T"/out*.log "$SITE_ROOT/logs" 2>/dev/null && bad "SECRETVALUE leaked" || ok "no env value in any log"
if [ "$fails" -gt 0 ]; then
  echo "---- logs of the failing run (tail of each) ----"
  for f in "$T"/out*.log; do echo "== $(basename "$f")"; tail -n 12 "$f"; done
fi
exit $((fails>0))
