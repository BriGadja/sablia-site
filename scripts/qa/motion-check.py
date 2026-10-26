#!/usr/bin/env python3
"""Motion gate (D17, AC-9): loops have a working pause, reduced motion shows final states, no label-changing aria-pressed.

Per route and viewport, in the page's OWN headless Chromium (never the shared Chrome on :9222):
 1. LOOPS. Scrolling the page section by section, a loop is (a) a running CSS animation that is infinite or lasts more than
    5 s in total (WAAPI `getAnimations()`, CSSAnimation only), or (b) the DOM still mutating (attributes, text, children)
    during a 2 s window taken 6 s after a scroll stop, on a virtual clock (`page.clock`, so JS timers / rAF advance without
    real waiting). JS loops are sampled from the virtual clock only; CSS animations are not driven by it (see shots.py).
    A region that mutates at first but goes quiet and stays quiet within 22 s of the scroll stop is a finite sequence, not a loop.
    Each loop needs a PAUSE BUTTON on the page: accessible name matching pause|arrêt|stop|figer|geler (not reprendre/lecture/play),
    >= 44x44 px, reached by pressing Tab from the top of the page (<= 400 presses), and activated by the keyboard (Enter) it
    must leave no CSS loop running and the DOM quiet for 2 s. The page with a loop and no button, a small button, an
    unreachable button or a button that does not stop the loop FAILS.
 2. REDUCED MOTION (`prefers-reduced-motion: reduce`, new context): after 2 s of settling there must be no running CSSAnimation,
    no DOM mutation in a 2 s window, and every visible text element must have an effective opacity >= 0.5 (final state held;
    `[aria-hidden=true]`, `[hidden]`, `[inert]` and visibility:hidden subtrees are ignored).
 3. ARIA-PRESSED. A `button[aria-pressed]` whose accessible name (text, aria-label, title) changes when clicked is a FAIL:
    a toggle either keeps its label and uses aria-pressed, or changes its label and does not.
Usage: motion-check.py [--base URL] [--routes /,/formations] [--vp 1440,390]   (default: the preview slot http://127.0.0.1:5001,
  every route of routes.mjs + sitemap + /formations /accompagnement, both viewports)
Exit 1 when any finding is printed (FAIL lines), 0 otherwise, 2 when the route manifest cannot be read.
"""
import argparse, json, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

W = Path(__file__).resolve().parents[2]
VPS = {"1440": (1440, 900), "390": (390, 844)}
PAUSE_RE = r"(pause|arr[êe]t|\bstop|figer|geler)"
NOT_PAUSE_RE = r"(reprendre|reprise|lecture|\bplay|relancer|resume)"

INIT = r"""() => {
  window.__mut = 0;
  const skip = n => { const e = n.nodeType === 1 ? n : n.parentElement; return !e || e.closest('nextjs-portal,script,style'); };
  new MutationObserver(ms => { for (const m of ms) if (!skip(m.target)) window.__mut++; })
    .observe(document, { attributes: true, childList: true, characterData: true, subtree: true });
}"""

JS_LOOPS = r"""() => {
  const out = [];
  const path = el => { const p = []; for (let n = el; n && n.nodeType === 1 && p.length < 4; n = n.parentElement)
    p.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : (typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/)[0] : ''))); return p.join('>'); };
  for (const a of document.getAnimations()) {
    if (!(a instanceof CSSAnimation) || a.playState !== 'running') continue;
    const t = a.effect.getComputedTiming(), el = a.effect.target; if (!el) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const total = t.duration * t.iterations;
    if (t.iterations === Infinity || total > 5000) out.push(a.animationName + ' on ' + path(el));
  }
  return out;
}"""

JS_RUNNING = r"""() => document.getAnimations().filter(a => a instanceof CSSAnimation && a.playState === 'running' && a.effect.getComputedTiming().duration > 0)
  .map(a => a.animationName + ' on ' + (a.effect.target ? a.effect.target.tagName.toLowerCase() + (a.effect.target.className && typeof a.effect.target.className === 'string' ? '.' + a.effect.target.className.trim().split(/\s+/)[0] : '') : '?'))"""

JS_FADED = r"""() => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    if (el.closest('[aria-hidden="true"],[hidden],[inert],nextjs-portal,.sr-only')) continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    let op = 1, n = el, hid = false;
    while (n && n.nodeType === 1) { const s = getComputedStyle(n); op *= parseFloat(s.opacity); if (s.visibility === 'hidden' || s.display === 'none') hid = true; n = n.parentElement; }
    if (!hid && op < 0.5) out.push(el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '') + ' op=' + op.toFixed(2) + ' « ' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) + ' »');
  }
  return out;
}"""

JS_PAUSE_BTNS = r"""([pauseRe, notRe]) => {
  const P = new RegExp(pauseRe, 'i'), N = new RegExp(notRe, 'i');
  return [...document.querySelectorAll('button,[role="button"],a[href]')].map((el, i) => {
    const name = ((el.getAttribute('aria-label') || '') + ' ' + (el.textContent || '') + ' ' + (el.getAttribute('title') || '')).trim().replace(/\s+/g, ' ');
    return { el, name };
  }).filter(x => P.test(x.name) && !N.test(x.name)).map((x, i) => { x.el.setAttribute('data-mc-pause', String(i)); return { i, name: x.name.slice(0, 40) }; });
}"""


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
    for p in ("/formations", "/accompagnement"):
        out.setdefault(p)
    return list(out)


def new_page(browser, w, h, reduced, clock):
    ctx = browser.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce" if reduced else "no-preference")
    page = ctx.new_page()
    page.add_init_script(f"({INIT})()")
    if clock:
        page.clock.install(time=1_000_000)
    return ctx, page


def start(page, url, clock):
    page.goto(url, wait_until="load", timeout=45000)
    if clock:
        page.clock.pause_at(1_005_000)
    page.wait_for_timeout(600)  # real time: IntersectionObserver callbacks run on rendering, not on the fake clock


def run_for(page, ms, clock):
    if clock:
        for _ in range(ms // 250):
            page.clock.run_for(250)
    else:
        page.wait_for_timeout(ms)


def mutating(page, clock):
    """True when the DOM mutates during a 2 s window."""
    before = page.evaluate("window.__mut")
    run_for(page, 2000, clock)
    return page.evaluate("window.__mut") - before > 0


def still_mutating_at_end(page, until=22000, waited=8000):
    """Called once the DOM mutated in the 6-8 s window after a scroll stop. A loop keeps mutating until the end of the
    observation (22 s after the scroll stop) or mutates again after a quiet window; a sequence that goes quiet and stays
    quiet is finite (WCAG 2.2.2 pause rule is about loops, not one-shot sequences)."""
    quiet = False
    while waited < until:
        m = mutating(page, True)
        waited += 2000
        if m and quiet:
            return True  # restarted after a pause: repeats
        if not m:
            quiet = True
    return not quiet


def scroll_steps(page):
    h = page.evaluate("document.scrollingElement.scrollHeight")
    vh = page.evaluate("innerHeight")
    return list(range(0, max(h - vh, 0) + 1, int(vh * 0.9))) or [0]


def check_loops(browser, base, path, w, h, out):
    tag = f"{path} @{w}"
    ctx, page = new_page(browser, w, h, False, True)
    try:
        start(page, base + path, True)
        loops = {}
        for y in scroll_steps(page):
            page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
            page.wait_for_timeout(400)
            run_for(page, 6000, True)
            for l in page.evaluate(JS_LOOPS):
                loops.setdefault("css: " + l, y)
            if mutating(page, True) and still_mutating_at_end(page):
                loops.setdefault(f"js: DOM keeps mutating at scroll {y}", y)
        if not loops:
            print(f"ok   {tag} no loop found")
            return
        btns = page.evaluate(JS_PAUSE_BTNS, [PAUSE_RE, NOT_PAUSE_RE])
        if not btns:
            for l in loops:
                out.append(f"{tag} loop without any pause button: {l}")
            return
        reached = 0
        for b in btns:
            loc = page.locator(f'[data-mc-pause="{b["i"]}"]')
            page.evaluate("document.scrollingElement.scrollTo(0,0)")
            box = loc.evaluate("e => { e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return [r.width, r.height, e.disabled === true, e.tabIndex]; }")
            if box[0] < 44 or box[1] < 44:
                out.append(f"{tag} pause button '{b['name']}' is {round(box[0])}x{round(box[1])} px, needs >= 44x44")
                continue
            if box[2] or box[3] < 0:
                out.append(f"{tag} pause button '{b['name']}' is not keyboard focusable (disabled or tabindex<0)")
                continue
            page.evaluate("document.scrollingElement.scrollTo(0,0); document.activeElement && document.activeElement.blur()")
            ok = False
            for _ in range(400):
                page.keyboard.press("Tab")
                if page.evaluate(f"document.activeElement && document.activeElement.getAttribute('data-mc-pause') === '{b['i']}'"):
                    ok = True
                    break
            if not ok:
                out.append(f"{tag} pause button '{b['name']}' not reached by 400 Tab presses")
                continue
            reached += 1
            page.keyboard.press("Enter")
        if not reached:
            return
        run_for(page, 1500, True)
        still = page.evaluate(JS_LOOPS)
        if still:
            out.append(f"{tag} CSS loop still running after the pause button: {still[0]}")
        elif any("js:" in l for l in loops) and mutating(page, True):
            out.append(f"{tag} DOM still mutating after the pause button")
        else:
            print(f"ok   {tag} {len(loops)} loop(s), pause button reached by Tab, 44px, stops them")
    finally:
        ctx.close()


def check_reduced(browser, base, path, w, h, out):
    tag = f"{path} @{w} reduced-motion"
    ctx, page = new_page(browser, w, h, True, True)
    try:
        start(page, base + path, True)
        run_for(page, 2000, True)
        bad = []
        for y in scroll_steps(page):
            page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
            page.wait_for_timeout(400)
            run_for(page, 2000, True)
            for a in page.evaluate(JS_RUNNING):
                bad.append(f"running animation at scroll {y}: {a}")
            if mutating(page, True):
                bad.append(f"DOM keeps mutating at scroll {y}")
            for f in page.evaluate(JS_FADED):
                bad.append(f"text not in its final state at scroll {y}: {f}")
        seen = set()
        for b in bad:
            k = b.split(": ", 1)[-1]
            if k not in seen:
                seen.add(k)
                out.append(f"{tag} {b}")
        if not bad:
            print(f"ok   {tag} no running animation, final states held")
    finally:
        ctx.close()


def check_pressed(browser, base, path, w, h, out):
    tag = f"{path} @{w}"
    ctx, page = new_page(browser, w, h, False, False)
    try:
        start(page, base + path, False)
        n = page.locator("button[aria-pressed]").count()
        for i in range(n):
            b = page.locator("button[aria-pressed]").nth(i)
            name = lambda: b.evaluate("e => ((e.getAttribute('aria-label') || '') + '|' + e.textContent + '|' + (e.getAttribute('title') || '')).replace(/\\s+/g, ' ').trim()")
            try:
                b.scroll_into_view_if_needed(timeout=3000)
                before = name()
                b.click(timeout=3000)
                page.wait_for_timeout(300)
                after = name()
                if before != after:
                    out.append(f"{tag} aria-pressed button changes its label on click: '{before}' -> '{after}'")
                if page.url.rstrip("/") != (base + path).rstrip("/"):
                    page.goto(base + path, wait_until="load")
                    break
                b.click(timeout=3000)
            except Exception:
                pass
    finally:
        ctx.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    ap.add_argument("--routes", default="")
    ap.add_argument("--vp", default="1440,390")
    a = ap.parse_args()
    base = a.base.rstrip("/")
    paths = [r for r in a.routes.split(",") if r] or routes(base)
    out = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        for path in paths:
            for vp in a.vp.split(","):
                w, h = VPS[vp]
                try:
                    check_loops(browser, base, path, w, h, out)
                    check_reduced(browser, base, path, w, h, out)
                    check_pressed(browser, base, path, w, h, out)
                except Exception as e:
                    out.append(f"{path} @{w} check crashed: {str(e)[:200]}")
        browser.close()
    for f in out:
        print("FAIL", f)
    print(f"motion-check: {len(out)} finding(s) on {len(paths)} route(s)")
    sys.exit(1 if out else 0)


main()
