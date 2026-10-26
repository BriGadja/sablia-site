#!/usr/bin/env python3
"""Reference / build screenshots and per-section pixel diff for the sablia.io v2 port.

Pages and sections (ids are the contract: the build must carry the same `#id` on each section root):
  home            top scene automatisations construit formations derriere videos faq fin
  formations      top niveaux outils deroule avis formats questions fin
  accompagnement  top situations parcours livrables exemples pourquoi questions fin
Viewports: 1440x900 and 390x844. Routes on a build: / , /formations , /accompagnement.

Capture kinds (written under <out>/<page>/<vp>/<kind>/):
  final/<section>.png        reduced-motion final state (deterministic), element screenshot.
  at/<section>@<t>s.png      virtual-time samples: t seconds after the section entered the viewport.
  walk/<n>-<page>/<vp>/...   (--walk, build only) final-state shots after CLIENT navigation
                             Home -> /formations -> /accompagnement -> Home; proves the navigation did not
                             reload the document (window marker survives) and diffs each page against the
                             cold-load `final` shots of the same build.

Virtual time: `page.clock.install` + `pause_at`, then `run_for` in `--step` ms slices (run_for, not
fast_forward: fast_forward fires each due timer at most once and would skip the mockup's wait() chains).
The clock controls setTimeout, setInterval, requestAnimationFrame and Date (the mockup's alive()/wait() loops
and the build's hooks alike). It does NOT advance CSS animations or transitions (measured by challenge R2: an
8.5 s animation sat at 433 ms and `animationend` never fired). So after every slice the script ALSO seeks CSS
animations: every DocumentTimeline animation reported by `document.getAnimations()` is paused and its
`currentTime` set to (virtual now - virtual time at which the script first saw it), i.e. the sample timestamp
relative to that animation's own start (quantised by `--step`). Scroll-driven animations (view()/scroll()
timelines) are left alone. `animationend` therefore never fires: loops that advance on animationend (the
`construit` deck bar) are sampled mid-flight only; widen `--at` instead of waiting for the swap.

Reference: the frozen mockup boards (maquette-v143/project/*.dc.html) are served from an in-process HTTP
thread (port >= 5200, nothing to kill) out of a scratch folder holding symlinks to the boards plus a COPY of
artifact-type/dc-runtime.js as support.js (the frozen folder stays byte-identical); `/_blob/<id>` is routed
to the local file listed in blob-map.json; Google Fonts are allowed for the reference only.

Usage:
  shots.py --ref [--pages home,formations] [--sections top,scene] [--vp 1440,390] [--kinds final,at]
  shots.py --base http://127.0.0.1:5111 --tag a7 [--walk] [--diff] [same filters]
  shots.py --tag a7 --diff            # diff only, existing shots
Screenshots go to <hub>/tmp/s-ref (reference) and <hub>/tmp/s-build/<tag> (build), never committed.
A 500 from the server is treated as "shared shell broken": retried (5x), then reported, never fatal.
Exit 0 when the tool ran and wrote its numbers; 2 on bad usage; 1 when nothing could be captured.
"""
from __future__ import annotations

import argparse
import functools
import http.server
import json
import os
import sys
import threading
import time
from pathlib import Path
from urllib.parse import urlsplit

HUB = Path(os.environ.get("SABLIA_HUB", "/home/sablia/workspace"))
MOCKUP = HUB / "research/site-theophile-2026-10/maquette-v143"
REF_OUT = HUB / "tmp/s-ref"
BUILD_OUT = HUB / "tmp/s-build"

PAGES = {
    "home": {"board": "Main.dc.html", "route": "/",
             "sections": ["top", "scene", "automatisations", "construit", "formations", "derriere", "videos", "faq", "fin"]},
    "formations": {"board": "Formations.dc.html", "route": "/formations",
                   "sections": ["top", "niveaux", "outils", "deroule", "avis", "formats", "questions", "fin"]},
    "accompagnement": {"board": "Accompagnement.dc.html", "route": "/accompagnement",
                       "sections": ["top", "situations", "parcours", "livrables", "exemples", "pourquoi", "questions", "fin"]},
}
VIEWPORTS = {1440: 900, 390: 844}
# Default virtual-time samples (seconds after entering view), per (page, section); fallback 2,6.
AT_DEFAULT = {
    ("home", "top"): [2, 6, 10], ("home", "scene"): [2, 5, 9], ("home", "automatisations"): [1, 5, 9],
    ("home", "construit"): [2, 6], ("home", "formations"): [2], ("home", "faq"): [1, 3],
    ("formations", "top"): [2, 9, 16], ("formations", "niveaux"): [2, 5], ("formations", "deroule"): [2, 5],
    ("accompagnement", "top"): [2, 6], ("accompagnement", "parcours"): [2, 5, 9],
}
T0_MS = 1_000_000_000_000  # fixed fake epoch


def log(*a):
    print(*a, flush=True)


# --------------------------------------------------------------------------- reference server
def start_ref_server():
    scratch = REF_OUT / "_serve"
    scratch.mkdir(parents=True, exist_ok=True)
    for p in PAGES.values():
        link = scratch / p["board"]
        if link.is_symlink() or link.exists():
            link.unlink()
        link.symlink_to(MOCKUP / "project" / p["board"])
    (scratch / "support.js").write_bytes((MOCKUP / "artifact-type/dc-runtime.js").read_bytes())

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    handler = functools.partial(Quiet, directory=str(scratch))
    for port in range(5200, 5300):
        try:
            srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
            break
        except OSError:
            continue
    else:
        raise SystemExit("no free port in 5200-5299")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{port}"


def route_blobs(context) -> None:
    blob_map = json.loads((MOCKUP / "blob-map.json").read_text())

    def handle(route):
        bid = urlsplit(route.request.url).path.rsplit("/", 1)[-1].split(".")[0]
        rel = blob_map.get(bid)
        f = HUB / rel if rel else None
        if f and f.is_file():
            route.fulfill(path=str(f))
        else:
            route.fulfill(status=404, body="")

    context.route("**/_blob/*", handle)


# --------------------------------------------------------------------------- page helpers
SEEK_JS = """
(vt) => {
  const seen = window.__shotsSeen || (window.__shotsSeen = new WeakMap());
  let n = 0;
  for (const a of document.getAnimations()) {
    if (a.timeline && a.timeline.constructor.name !== 'DocumentTimeline') continue;
    if (!seen.has(a)) seen.set(a, vt);
    a.pause();
    a.currentTime = Math.max(0, vt - seen.get(a));
    n++;
  }
  return n;
}
"""

SCROLL_THROUGH_JS = """
async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 150));
}
"""


def goto(page, url: str, tries: int = 5) -> int:
    status = 0
    for i in range(tries):
        resp = page.goto(url, wait_until="load", timeout=120_000)
        status = resp.status if resp else 0
        if status < 500:
            break
        log(f"  ! {status} on {url}: shared shell broken, retry {i + 1}/{tries}")
        time.sleep(3)
    try:
        page.evaluate("document.fonts && document.fonts.ready")
    except Exception:
        pass
    return status


def shoot(page, section: str, dest: Path) -> str:
    loc = page.locator(f"#{section}").first
    if loc.count() == 0:
        return "missing"
    dest.parent.mkdir(parents=True, exist_ok=True)
    loc.screenshot(path=str(dest), timeout=60_000)
    return "ok"


def new_context(browser, width: int, reduced: bool, with_blobs: bool):
    ctx = browser.new_context(viewport={"width": width, "height": VIEWPORTS[width]},
                              reduced_motion="reduce" if reduced else "no-preference",
                              device_scale_factor=1)
    if with_blobs:
        route_blobs(ctx)
    return ctx


def capture_final(browser, base, ref, page_key, width, sections, out: Path):
    spec = PAGES[page_key]
    ctx = new_context(browser, width, True, ref)
    page = ctx.new_page()
    url = base + ("/" + spec["board"] if ref else spec["route"])
    st = goto(page, url)
    log(f"[final] {page_key} {width} {url} -> {st}")
    page.evaluate(SCROLL_THROUGH_JS)
    for s in sections:
        if s == "top":
            page.evaluate("window.scrollTo(0, 0)")
        res = shoot(page, s, out / page_key / str(width) / "final" / f"{s}.png")
        log(f"  {s}: {res}")
    ctx.close()


def capture_at(browser, base, ref, page_key, width, sections, out: Path, ats_override, step):
    spec = PAGES[page_key]
    for s in sections:
        ats = ats_override or AT_DEFAULT.get((page_key, s), [2, 6])
        ctx = new_context(browser, width, False, ref)
        page = ctx.new_page()
        page.clock.install(time=T0_MS)
        url = base + ("/" + spec["board"] if ref else spec["route"])
        st = goto(page, url)
        if page.locator(f"#{s}").count() == 0:
            log(f"[at] {page_key} {width} {s}: missing")
            ctx.close()
            continue
        page.clock.pause_at(T0_MS + 5_000)
        if s != "top":
            page.evaluate(f"document.getElementById('{s}').scrollIntoView({{block:'start'}})")
        page.wait_for_timeout(400)  # real time: IntersectionObserver callbacks run on rendering, not on the fake clock
        vt = 0
        page.evaluate(SEEK_JS, vt)
        for t in sorted(ats):
            target = int(t * 1000)
            while vt < target:
                d = min(step, target - vt)
                page.clock.run_for(d)
                vt += d
                page.evaluate(SEEK_JS, vt)
            page.wait_for_timeout(60)
            res = shoot(page, s, out / page_key / str(width) / "at" / f"{s}@{t}s.png")
            log(f"[at] {page_key} {width} {s} t={t}s (http {st}): {res}")
        ctx.close()


def capture_walk_routes(browser, base, width, routes, out: Path):
    """Mechanism check on arbitrary routes (--walk-routes): click each <a href>, report client-nav vs reload."""
    ctx = new_context(browser, width, True, False)
    page = ctx.new_page()
    goto(page, base + "/")
    page.evaluate("window.__walkMarker = 'alive'")
    for n, route in enumerate(routes, 1):
        link = page.locator(f"a[href='{route}']").first
        if link.count() == 0:
            log(f"[walk-routes] {width} -> {route}: no <a href> on the current page, stop")
            break
        link.evaluate("el => el.click()")
        page.wait_for_timeout(800)
        alive = page.evaluate("window.__walkMarker === 'alive'")
        log(f"[walk-routes] {width} step {n} -> {route}: path={page.evaluate('location.pathname')} "
            f"{'client-nav' if alive else 'FULL-RELOAD'}")
        dest = out / "walk-routes" / f"{n}" / str(width) / "viewport.png"
        dest.parent.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(dest))
    ctx.close()


def capture_walk(browser, base, width, sections_by_page, out: Path):
    """Client navigation Home -> /formations -> /accompagnement -> Home on one document."""
    ctx = new_context(browser, width, True, False)
    page = ctx.new_page()
    goto(page, base + "/")
    page.evaluate("window.__walkMarker = 'alive'")
    page.evaluate(SCROLL_THROUGH_JS)
    report = []
    for n, key in enumerate(["formations", "accompagnement", "home"], 1):
        route = PAGES[key]["route"]
        link = page.locator(f"a[href='{route}']").first
        if link.count() == 0:
            log(f"[walk] {width} -> {route}: no <a href='{route}'> on the current page, stop")
            report.append((key, "no-link"))
            break
        link.evaluate("el => el.click()")  # works for links hidden behind the phone hamburger too
        try:
            page.wait_for_function(f"location.pathname === '{route}'", timeout=15_000)
        except Exception:
            log(f"[walk] {width}: url never reached {route}")
        page.wait_for_timeout(600)
        alive = page.evaluate("window.__walkMarker === 'alive'")
        status = "client-nav" if alive else "FULL-RELOAD"
        log(f"[walk] {width} step {n} -> {route}: {status}")
        report.append((key, status))
        page.evaluate(SCROLL_THROUGH_JS)
        for s in sections_by_page[key]:
            if s == "top":
                page.evaluate("window.scrollTo(0, 0)")
            res = shoot(page, s, out / "walk" / f"{n}-{key}" / str(width) / f"{s}.png")
            log(f"    {s}: {res}")
    ctx.close()
    return report


# --------------------------------------------------------------------------- diff
def pair_diff(a: Path, b: Path):
    import numpy as np
    from PIL import Image
    ia, ib = Image.open(a).convert("RGB"), Image.open(b).convert("RGB")
    w, h = max(ia.width, ib.width), max(ia.height, ib.height)
    ca = Image.new("RGB", (w, h), (255, 255, 255))
    ca.paste(ia)
    cb = Image.new("RGB", (w, h), (255, 255, 255))
    cb.paste(ib)
    d = np.abs(np.asarray(ca, dtype=np.int16) - np.asarray(cb, dtype=np.int16)).mean() / 255 * 100
    return round(float(d), 2), ia.size, ib.size


def run_diff(ref_dir: Path, build_dir: Path, pages, sections, out_json: Path):
    rows = []
    for ref_png in sorted(ref_dir.glob("*/*/*/*.png")):
        page_key, vp, kind = ref_png.parts[-4:-1]
        sec = ref_png.stem.split("@")[0]
        if page_key not in pages or sec not in sections.get(page_key, []):
            continue
        if not (build_dir / page_key / vp / kind).is_dir():
            continue  # that kind was not captured for the build: not a miss
        b = build_dir / ref_png.relative_to(ref_dir)
        if not b.is_file():
            rows.append({"page": page_key, "vp": vp, "kind": kind, "shot": ref_png.stem, "diff_pct": None})
            continue
        d, rs, bs = pair_diff(ref_png, b)
        rows.append({"page": page_key, "vp": vp, "kind": kind, "shot": ref_png.stem, "diff_pct": d,
                     "ref_size": list(rs), "build_size": list(bs), "height_delta": bs[1] - rs[1]})
    log("\nDIFF reference vs build (mean abs pixel difference %, white-padded; lower is closer)")
    log(f"{'page':15} {'vp':>5} {'kind':6} {'shot':22} {'diff%':>7} {'ref WxH':>11} {'build WxH':>11} {'dH':>6}")
    for r in rows:
        if r["diff_pct"] is None:
            log(f"{r['page']:15} {r['vp']:>5} {r['kind']:6} {r['shot']:22} {'MISSING':>7}")
        else:
            rs, bs = r["ref_size"], r["build_size"]
            log(f"{r['page']:15} {r['vp']:>5} {r['kind']:6} {r['shot']:22} {r['diff_pct']:7.2f} "
                f"{str(rs[0]) + 'x' + str(rs[1]):>11} {str(bs[0]) + 'x' + str(bs[1]):>11} {r['height_delta']:+6d}")
    vals = [r["diff_pct"] for r in rows if r["diff_pct"] is not None]
    if vals:
        log(f"mean over {len(vals)} shots: {sum(vals) / len(vals):.2f}%   missing: {len(rows) - len(vals)}")
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(rows, indent=1))


def run_walk_diff(build_out: Path, sections):
    log("\nWALK vs COLD (same build, final state; needs the cold `final` shots of this tag)")
    log(f"{'step':22} {'vp':>5} {'shot':18} {'diff%':>7}")
    for w in sorted((build_out / "walk").glob("*/*/*.png")):
        step, vp = w.parts[-3], w.parts[-2]
        page_key = step.split("-", 1)[1]
        if w.stem not in sections.get(page_key, []):
            continue
        cold = build_out / page_key / vp / "final" / w.name
        if not cold.is_file():
            log(f"{step:22} {vp:>5} {w.stem:18} {'no cold shot':>7}")
            continue
        d, _, _ = pair_diff(cold, w)
        log(f"{step:22} {vp:>5} {w.stem:18} {d:7.2f}")


# --------------------------------------------------------------------------- main
def main() -> int:
    ap = argparse.ArgumentParser(description="Reference/build screenshots and pixel diff (see module docstring).")
    ap.add_argument("--ref", action="store_true", help="capture the frozen mockup into tmp/s-ref")
    ap.add_argument("--base", help="capture this server (dev 5111, slot 5001...) into tmp/s-build/<tag>")
    ap.add_argument("--tag", default="build", help="build output sub-folder (one per unit avoids collisions)")
    ap.add_argument("--pages", default="home,formations,accompagnement")
    ap.add_argument("--sections", help="comma list of section ids (default: all of each page)")
    ap.add_argument("--vp", default="1440,390")
    ap.add_argument("--kinds", default="final,at", help="comma list of: final, at")
    ap.add_argument("--at", help="override virtual-time samples in seconds, e.g. 2,6,10")
    ap.add_argument("--step", type=int, default=100, help="virtual clock slice in ms (CSS seek granularity)")
    ap.add_argument("--walk", action="store_true", help="build only: client navigation walk + diff vs cold loads")
    ap.add_argument("--walk-routes", help="mechanism test on other routes, e.g. /ressources,/ (comma list of hrefs to click in turn)")
    ap.add_argument("--diff", action="store_true", help="print per-shot pixel difference reference vs build")
    args = ap.parse_args()

    pages = [p for p in args.pages.split(",") if p]
    vps = [int(v) for v in args.vp.split(",") if v]
    if any(p not in PAGES for p in pages) or any(v not in VIEWPORTS for v in vps):
        log(f"bad --pages/--vp (pages {list(PAGES)}, vp {list(VIEWPORTS)})")
        return 2
    only = [s for s in (args.sections or "").split(",") if s]
    sections = {p: [s for s in PAGES[p]["sections"] if not only or s in only] for p in pages}
    kinds = [k for k in args.kinds.split(",") if k]
    ats = [float(x) if "." in x else int(x) for x in args.at.split(",")] if args.at else None
    build_out = BUILD_OUT / args.tag

    targets = []
    if args.ref:
        targets.append(("ref", None))
    if args.base:
        targets.append(("build", args.base.rstrip("/")))
    if not targets and not (args.diff or args.walk):
        ap.print_usage()
        return 2

    ok = 0
    if targets:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            srv = None
            try:
                for label, base in targets:
                    ref = label == "ref"
                    out = REF_OUT if ref else build_out
                    if ref:
                        srv, base = start_ref_server()
                        log(f"reference served at {base}")
                    for pk in pages:
                        for w in vps:
                            try:
                                if "final" in kinds and sections[pk]:
                                    capture_final(browser, base, ref, pk, w, sections[pk], out)
                                if "at" in kinds and sections[pk]:
                                    capture_at(browser, base, ref, pk, w, sections[pk], out, ats, args.step)
                                ok += 1
                            except Exception as e:  # one broken page must not hide the others
                                log(f"! {label} {pk} {w}: {type(e).__name__}: {str(e)[:200]}")
                    if not ref and args.walk_routes:
                        for w in vps:
                            capture_walk_routes(browser, base, w, args.walk_routes.split(","), build_out)
                    if not ref and args.walk:
                        for w in vps:
                            try:
                                capture_walk(browser, base, w, sections, build_out)
                            except Exception as e:
                                log(f"! walk {w}: {type(e).__name__}: {str(e)[:200]}")
                    if srv:
                        srv.shutdown()
                        srv = None
            finally:
                browser.close()
        if not ok:
            return 1

    if args.walk and (build_out / "walk").exists():
        run_walk_diff(build_out, sections)
    if args.diff:
        if not build_out.exists():
            log(f"no build shots in {build_out}")
            return 1
        run_diff(REF_OUT, build_out, pages, sections, build_out / "diff.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
