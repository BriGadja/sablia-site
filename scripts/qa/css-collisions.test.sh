#!/usr/bin/env bash
# Test for scripts/qa/css-collisions.py: the good fixture must pass, every bad-* fixture must fail
# with the violation code named after it (bad-<code>[-variant] -> CODE).
set -u
cd "$(dirname "$0")/../.."
FX=scripts/qa/fixtures/css-collisions
fail=0
python3 -I scripts/qa/css-collisions.py --root "$FX/good" >/dev/null 2>&1 || { echo "FAIL good fixture rejected"; fail=1; }
expect() { # dir code
  out=$(python3 -I scripts/qa/css-collisions.py --root "$FX/$1" 2>&1); rc=$?
  if [ $rc -ne 1 ] || ! grep -q "$2" <<<"$out"; then echo "FAIL $1: rc=$rc expected 1 with $2"; fail=1; else echo "ok   $1 -> $2"; fi
}
expect bad-no-layer-order NO-LAYER-ORDER
expect bad-unscoped UNSCOPED-RULE
expect bad-unscoped-media UNSCOPED-RULE
expect bad-outside-layer OUTSIDE-LAYER
expect bad-keyframes-nested KEYFRAMES-NESTED
expect bad-keyframes-unprefixed KEYFRAMES-UNPREFIXED
expect bad-dup-keyframes DUP-KEYFRAMES
expect bad-root-id ROOT-ID-DESCENDANT
expect bad-font-literal FONT-LITERAL
expect bad-font-literal-tsx FONT-LITERAL
expect bad-preflight PREFLIGHT
expect bad-preflight-bare PREFLIGHT
expect bad-unscoped-in-globals OUTSIDE-LAYER
[ $fail -eq 0 ] && echo "css-collisions tests: PASS" || echo "css-collisions tests: FAIL"
exit $fail
