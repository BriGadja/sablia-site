#!/bin/bash
# Test of deploy/install-env.sh: env files written with the right names, modes and owners, from a FAKE
# credential file; values never printed; a missing key stops the script naming only the path.
HERE="$(cd "$(dirname "$0")" && pwd)"
[ -f "$HERE/install-env.sh" ] || { echo "FAIL install-env.sh missing"; exit 1; }
T="$(mktemp -d)"; fails=0; trap 'rm -rf "$T"' EXIT
ok() { echo "PASS $1"; }; bad() { echo "FAIL $1"; fails=$((fails+1)); }
check() { if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (expected '$3', got '$2')"; fi; }

cat > "$T/creds.json" <<'JSON'
{"resend": {"api_key": "re_FAKE_send_only_KEY_0123456789abcdef", "api_key_full": "re_FAKE_full_KEY_should_never_be_used"},
 "supabase": {"sablia": {"service_role": "FAKE-service-role-VALUE-0123456789", "anon_key": "FAKE-anon-VALUE-0123456789"}}}
JSON
chmod 600 "$T/creds.json"
export CONF_DIR="$T/etc" CREDS_FILE="$T/creds.json" ENV_ROOT_USER="$(id -un)" ENV_RUN_GROUP="$(id -gn)"
mkdir -p "$CONF_DIR"

out="$(bash "$HERE/install-env.sh" 2>&1)"; rc=$?
check "exit 0" "$rc" 0
for f in build.env prod.env preview.env; do [ -f "$CONF_DIR/$f" ] && ok "$f written" || bad "$f written"; done
check "prod.env mode" "$(stat -c %a "$CONF_DIR/prod.env")" 600
check "preview.env mode" "$(stat -c %a "$CONF_DIR/preview.env")" 600
check "build.env mode (readable by the build user's group)" "$(stat -c %a "$CONF_DIR/build.env")" 640
check "build.env group" "$(stat -c %G "$CONF_DIR/build.env")" "$ENV_RUN_GROUP"
check "prod.env names" "$(cut -d= -f1 "$CONF_DIR/prod.env" | sort | tr '\n' ' ')" "PORT RESEND_API_KEY SUPABASE_SERVICE_ROLE_KEY "
check "prod port" "$(grep '^PORT=' "$CONF_DIR/prod.env")" "PORT=5000"
check "preview port" "$(grep '^PORT=' "$CONF_DIR/preview.env")" "PORT=5001"
check "build.env names" "$(cut -d= -f1 "$CONF_DIR/build.env" | tr '\n' ' ')" "VITE_SUPABASE_ANON_KEY "
check "the send-only Resend key is the one used" "$(grep -c 'FAKE_send_only' "$CONF_DIR/prod.env")" 1
check "the full-access key is NOT used" "$(grep -l 'should_never_be_used' "$CONF_DIR"/*.env | wc -l)" 0
echo "$out" | grep -q 'FAKE' && bad "a value was printed" || ok "no value printed"
echo "$out" | grep -q 'resend.api_key' && ok "the output names the key PATHS it read" || bad "key paths named in the output"
[ -z "$(ls "$CONF_DIR" | grep -v -E '^(build|prod|preview)\.env$')" ] && ok "no stray file (temp files cleaned)" || bad "stray files: $(ls "$CONF_DIR")"

# idempotent
out2="$(bash "$HERE/install-env.sh" 2>&1)"; check "second run exit 0" "$?" 0

# a missing key: stops, names the path, writes nothing new
python3 - "$T/creds.json" <<'PY'
import json, sys
d = json.load(open(sys.argv[1])); del d["supabase"]["sablia"]["service_role"]; json.dump(d, open(sys.argv[1], "w"))
PY
rm -f "$CONF_DIR"/*.env
out3="$(bash "$HERE/install-env.sh" 2>&1)"; rc=$?
[ "$rc" -ne 0 ] && ok "missing key: non-zero exit" || bad "missing key must fail"
echo "$out3" | grep -q 'supabase.sablia.service_role' && ok "the missing path is named" || bad "missing path named"
[ -z "$(ls "$CONF_DIR" 2>/dev/null)" ] && ok "nothing written when a key is missing" || bad "partial files written"
exit $((fails>0))
