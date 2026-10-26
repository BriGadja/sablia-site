#!/usr/bin/env bash
# The only way to run a full `next build` in this tree: one at a time (Next 16 refuses two),
# with the public build env when readable. Fails if Turbopack dropped a CSS rule (it only warns).
set -uo pipefail
cd "$(dirname "$0")/../.."
export BUILD_ENV_FILE=/home/sablia/workspace/.credentials/sablia-site-build.env
export BUILD_LOG="${BUILD_LOG:-$(mktemp)}"

flock .build.lock bash -c '
  if [ -r "$BUILD_ENV_FILE" ]; then set -a; . "$BUILD_ENV_FILE"; set +a; fi
  npm run build 2>&1 | tee "$BUILD_LOG"
  exit "${PIPESTATUS[0]}"
'
rc=$?
if grep -q "Parsing CSS source code failed" "$BUILD_LOG"; then
  echo "build.sh: a CSS rule failed to parse (Turbopack only warns); failing the build" >&2
  rc=1
fi
exit "$rc"
