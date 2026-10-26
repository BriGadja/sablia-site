#!/usr/bin/env python3
"""axe-core 4.14.0 on every route at 1440 and 390: zero serious or critical violations (AC-9).

Injects node_modules/axe-core/axe.min.js (the version pinned by package.json) through Python Playwright into the page's OWN
headless Chromium (never the shared Chrome on :9222). The page is scrolled once end to end before the run so lazily revealed
sections are in the DOM state a visitor reaches. Moderate and minor findings are printed as `note` and do not fail.
Routes: scripts/seo/routes.mjs (non-draft) + the sitemap + /formations /accompagnement + an unknown path (the 404 page).
Usage: axe-check.py [--base URL] [--routes /,/formations] [--vp 1440,390]   (default: the preview slot http://127.0.0.1:5001)
Exit 1 when any serious/critical violation is found, 0 otherwise, 2 when axe-core or the route manifest cannot be read.
"""
import argparse, json, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

W = Path(__file__).resolve().parents[2]
AXE = W / "node_modules" / "axe-core" / "axe.min.js"
VPS = {"1440": (1440, 900), "390": (390, 844)}


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
    for p in ("/formations", "/accompagnement", "/nimporte-quoi"):
        out.setdefault(p)
    return list(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    ap.add_argument("--routes", default="")
    ap.add_argument("--vp", default="1440,390")
    a = ap.parse_args()
    base = a.base.rstrip("/")
    if not AXE.exists():
        print(f"axe-core missing: {AXE} (run npm ci)", file=sys.stderr)
        sys.exit(2)
    paths = [r for r in a.routes.split(",") if r] or routes(base)
    blocking = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        for path in paths:
            for vp in a.vp.split(","):
                w, h = VPS[vp]
                ctx = browser.new_context(viewport={"width": w, "height": h})
                page = ctx.new_page()
                try:
                    page.goto(base + path, wait_until="load", timeout=45000)
                    page.wait_for_timeout(1500)
                    H = page.evaluate("document.scrollingElement.scrollHeight")
                    for y in range(0, H, int(h * 0.8)):
                        page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
                        page.wait_for_timeout(200)
                    page.evaluate("document.scrollingElement.scrollTo(0,0)")
                    page.wait_for_timeout(500)
                    page.add_script_tag(path=str(AXE))
                    ver = page.evaluate("axe.version")
                    res = page.evaluate("axe.run(document, {resultTypes: ['violations']}).then(r => r.violations.map(v => ({id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ')), n: v.nodes.length})))")
                except Exception as e:
                    blocking += 1
                    print(f"FAIL {path} @{w} could not run axe: {str(e)[:160]}")
                    continue
                finally:
                    ctx.close()
                bad = [v for v in res if v["impact"] in ("serious", "critical")]
                blocking += len(bad)
                print(f"{'FAIL' if bad else 'ok  '} {path} @{w} axe {ver}: {len(bad)} serious/critical, {len(res) - len(bad)} other")
                for v in res:
                    tag = "  " + ("VIOLATION" if v in bad else "note     ")
                    print(f"{tag} {v['impact']} {v['id']} x{v['n']}: {v['help']} e.g. {'; '.join(v['nodes'])[:140]}")
        browser.close()
    print(f"axe-check: {blocking} serious/critical violation(s) on {len(paths)} route(s)")
    sys.exit(1 if blocking else 0)


main()
