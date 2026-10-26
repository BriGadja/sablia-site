#!/usr/bin/env python3
"""Zero third-party request before consent, on EVERY route (D12 spirit, US-65).

Cold load per route (fresh browser context: no cookie, no storage, so no consent given), 1440x900 then a scroll sweep
to wake lazy content, then every request and WebSocket the page made is checked: the host must be the origin of --base.
`data:` and `blob:` URLs are not network requests and are ignored. Own headless Chromium (never the shared Chrome on :9222).
Routes: scripts/seo/routes.mjs (non-draft) + the sitemap + /formations /accompagnement + an unknown path (the 404 page).
Usage: origin-check.py [--base URL]   (default: the preview slot http://127.0.0.1:5001)
Exit 1 when any route made a request to another host (each printed once per route), 0 otherwise.
"""
import argparse, json, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

W = Path(__file__).resolve().parents[2]
EXTRA = ["/formations", "/accompagnement", "/nimporte-quoi"]


def routes(base):
    js = "import('./scripts/seo/routes.mjs').then(m=>console.log(JSON.stringify(m.resolveRoutes().filter(r=>!r.draft).map(r=>r.path))))"
    p = subprocess.run(["node", "-e", js], cwd=W, capture_output=True, text=True)
    if p.returncode:
        print("cannot read scripts/seo/routes.mjs:", p.stderr.strip()[:300], file=sys.stderr)
        sys.exit(2)
    out = dict.fromkeys(json.loads(p.stdout))
    try:
        xml = urllib.request.urlopen(base + "/sitemap.xml", timeout=30).read().decode("utf8", "replace")
        for loc in re.findall(r"<loc>([^<]+)</loc>", xml):
            out.setdefault(urllib.parse.urlparse(loc).path or "/")
    except Exception as e:
        print(f"warning: sitemap unreadable ({e}); manifest routes only", file=sys.stderr)
    for p in EXTRA:
        out.setdefault(p)
    return list(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    base = ap.parse_args().base.rstrip("/")
    own = urllib.parse.urlparse(base).netloc
    bad = 0
    paths = routes(base)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        for path in paths:
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            foreign = {}
            def on_req(r):
                u = urllib.parse.urlparse(r.url)
                if u.scheme in ("data", "blob", "about", "chrome-extension"):
                    return
                if u.netloc != own:
                    foreign.setdefault(u.netloc, r.url)
            page.on("request", on_req)
            page.on("websocket", lambda ws: on_req(type("R", (), {"url": ws.url})()))
            try:
                page.goto(base + path, wait_until="load", timeout=45000)
                page.wait_for_timeout(1500)
                h = page.evaluate("document.scrollingElement.scrollHeight")
                for y in range(0, h, 700):
                    page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
                    page.wait_for_timeout(250)
                page.wait_for_timeout(1000)
            except Exception as e:
                foreign["<load failed>"] = str(e)[:120]
            finally:
                ctx.close()
            bad += bool(foreign)
            if foreign:
                print(f"FAIL {path}")
                for host, url in foreign.items():
                    print(f"     {host}  {url[:140]}")
            else:
                print(f"ok   {path}")
        browser.close()
    print(f"origin-check: {len(paths) - bad}/{len(paths)} routes clean, origin {own}")
    sys.exit(1 if bad else 0)


main()
