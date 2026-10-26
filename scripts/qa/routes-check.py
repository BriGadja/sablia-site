#!/usr/bin/env python3
"""Every route of the sablia.io v2 site answers what it must (US-69.. continuity gate, AC-9).

Expected, no redirect followed:
  200  every non-draft route of scripts/seo/routes.mjs (resolveRoutes), every <loc> of /sitemap.xml, the v2 pages
       (/formations, /accompagnement) and the static extras (/sitemap.xml /robots.txt /llms.txt, the IndexNow key file,
       /.well-known/ai.txt, /favicon.svg, /brand/symbol.svg, /escalier-modeles, /cgv/, /index.html)
  301  /roi and /about (with a Location header)
  404  /nimporte-quoi, /assets/x.js, /ressources/__none, /api/nope
Usage: routes-check.py [--base URL]   (default: the preview slot http://127.0.0.1:5001)
Exit 0 when every row matches, 1 otherwise (one line per row, FAIL rows first-class), 2 when the route manifest cannot be read.
"""
import argparse, http.client, json, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

W = Path(__file__).resolve().parents[2]
STATIC_200 = ["/sitemap.xml", "/robots.txt", "/llms.txt", "/b726ffc356cf2894abdd81a5a309a181.txt", "/.well-known/ai.txt",
              "/favicon.svg", "/brand/symbol.svg", "/escalier-modeles", "/cgv/", "/index.html", "/formations", "/accompagnement"]
REDIRECT_301 = ["/roi", "/about"]
NOT_FOUND_404 = ["/nimporte-quoi", "/assets/x.js", "/ressources/__none", "/api/nope"]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def fetch(url):
    try:
        with OPENER.open(urllib.request.Request(url, headers={"User-Agent": "sablia-routes-check"}), timeout=30) as r:
            return r.status, r.headers.get("Location", ""), r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location", ""), e.read()
    except Exception as e:  # connection refused, timeout: a row that cannot be answered is a FAIL
        return 0, str(e), b""


def manifest_paths():
    js = "import('./scripts/seo/routes.mjs').then(m=>console.log(JSON.stringify(m.resolveRoutes().filter(r=>!r.draft).map(r=>r.path))))"
    p = subprocess.run(["node", "-e", js], cwd=W, capture_output=True, text=True)
    if p.returncode:
        print("cannot read scripts/seo/routes.mjs:", p.stderr.strip()[:300], file=sys.stderr)
        sys.exit(2)
    return json.loads(p.stdout)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    base = ap.parse_args().base.rstrip("/")
    rows = {}  # path -> expected status
    for p in manifest_paths():
        rows[p] = 200
    st, _, body = fetch(base + "/sitemap.xml")
    if st == 200:
        for loc in re.findall(r"<loc>([^<]+)</loc>", body.decode("utf8", "replace")):
            rows.setdefault(urllib.parse.urlparse(loc).path or "/", 200)
    for p in STATIC_200:
        rows[p] = 200
    for p in REDIRECT_301:
        rows[p] = 301
    for p in NOT_FOUND_404:
        rows[p] = 404
    bad = 0
    for path, want in rows.items():
        got, loc, _ = fetch(base + path)
        ok = got == want and (want != 301 or bool(loc))
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {path} want {want} got {got}" + (f" -> {loc}" if got in (301, 302, 308) or got == 0 else ""))
    print(f"routes-check: {len(rows) - bad}/{len(rows)} rows match")
    sys.exit(1 if bad else 0)


main()
