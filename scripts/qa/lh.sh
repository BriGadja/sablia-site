#!/usr/bin/env bash
# Lighthouse 13.5.0, mobile, on the four reference routes. Own headless Chromium (never the shared Chrome on :9222).
# Usage: lh.sh [--base URL] [--out FILE.json] [--check]
#   --base   default http://127.0.0.1:5001 (the preview slot)
#   --out    write the per-route numbers as JSON (default: stdout summary only)
#   --check  exit 1 when a target is missed (a11y>=95, seo>=95, best-practices>=90, perf>=75, CLS<=0.1, LCP<=3.0 s, TBT<=300 ms)
set -u
BASE=http://127.0.0.1:5001; OUT=""; CHECK=0
while [ $# -gt 0 ]; do case "$1" in
  --base) BASE="$2"; shift 2;; --out) OUT="$2"; shift 2;; --check) CHECK=1; shift;; *) echo "usage: lh.sh [--base URL] [--out FILE] [--check]" >&2; exit 2;; esac; done
BASE="${BASE%/}"
CHROME_PATH="${CHROME_PATH:-$(python3 -c 'from playwright.sync_api import sync_playwright
with sync_playwright() as p: print(p.chromium.executable_path)')}"
export CHROME_PATH
TMP="${TMPDIR:-/tmp}/lh-$$"; mkdir -p "$TMP"; trap 'rm -rf "$TMP"' EXIT
i=0
for route in / /formations /accompagnement /ressources; do
  i=$((i+1))
  npx --yes lighthouse@13.5.0 "$BASE$route" --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$TMP/$i.json" --quiet >"$TMP/$i.log" 2>&1 \
    || { echo "lighthouse failed on $route:" >&2; tail -5 "$TMP/$i.log" >&2; echo "$route" >"$TMP/$i.route"; }
  echo "$route" >"$TMP/$i.route"
done
python3 - "$TMP" "$BASE" "$OUT" "$CHECK" <<'PY'
import json, sys, pathlib
tmp, base, out, check = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4] == "1"
T = {"accessibility": (">=", 95), "seo": (">=", 95), "best-practices": (">=", 90), "performance": (">=", 75),
     "cls": ("<=", 0.1), "lcp_s": ("<=", 3.0), "tbt_ms": ("<=", 300)}
res, miss = {}, []
for i in range(1, 5):
    route = (tmp / f"{i}.route").read_text().strip()
    f = tmp / f"{i}.json"
    if not f.exists():
        res[route] = {"error": "lighthouse produced no report"}; miss.append((route, "no report", None)); continue
    r = json.loads(f.read_text()); c, a = r["categories"], r["audits"]
    m = {"performance": round(c["performance"]["score"] * 100), "accessibility": round(c["accessibility"]["score"] * 100),
         "best-practices": round(c["best-practices"]["score"] * 100), "seo": round(c["seo"]["score"] * 100),
         "cls": round(a["cumulative-layout-shift"]["numericValue"], 3), "lcp_s": round(a["largest-contentful-paint"]["numericValue"] / 1000, 2),
         "tbt_ms": round(a["total-blocking-time"]["numericValue"]), "finalUrl": r.get("finalDisplayedUrl")}
    res[route] = m
    for k, (op, v) in T.items():
        if (op == ">=" and m[k] < v) or (op == "<=" and m[k] > v): miss.append((route, k, m[k]))
doc = {"base": base, "tool": "lighthouse@13.5.0 mobile", "targets": T, "routes": res, "misses": [list(x) for x in miss]}
if out: pathlib.Path(out).write_text(json.dumps(doc, indent=1, ensure_ascii=False) + "\n")
for route, m in res.items(): print(route, m)
for route, k, v in miss: print(f"MISS {route} {k}={v} (target {T.get(k)})")
sys.exit(1 if (check and miss) else 0)
PY
