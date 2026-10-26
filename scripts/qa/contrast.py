#!/usr/bin/env python3
"""Contrast gate on a RENDERED page of the sablia.io v2 site (copy of the autoresearch `contrast_canvas.py`, adapted).

A static detector reads the source with its default state; the real colours depend on runtime state (scenes, tabs,
scroll). This scrolls the page step by step in its OWN headless Chromium (never the shared Chrome on :9222) and, at
each step, measures every visible element that owns text: its colour against the first opaque ground behind it
(semi-transparent grounds are blended). Threshold 4.5:1, 3:1 for text >= 24 px. Text over an image or a gradient is
listed apart ("image"), never passed silently. Elements mid-fade (effective opacity < 0.95) are skipped: they are
transitions, not reading states.
Usage: contrast.py [PATH ...] [--base URL] [--width 1440] [--height 900] [--step 600] [--wait 1500] [--out DIR] [--max N]
  PATH defaults to / ; --base defaults to the preview slot http://127.0.0.1:5001.
Exit 1 when more than --max (default 0) measured pairs fail; prints each failing pair once with a text sample.
"""
import argparse, asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

JS = r"""() => {
  const out = [];
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const blend = (top, bot) => { const a = top[3]; return [0,1,2].map(i => top[i] * a + bot[i] * (1 - a)).concat(1); };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    let op = 1, n = el;
    while (n && n.nodeType === 1) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
    if (op < 0.95) continue;
    let fg = parse(cs.color); if (!fg || fg[3] < 0.05) continue;
    // the ground = what is painted under the text's centre: ancestors AND absolute siblings (a sliding pill, an <img>);
    // elementsFromPoint skips pointer-events:none elements, so fall back on the ancestor chain when el is not in it
    const stack = document.elementsFromPoint(Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2)));
    const idx = stack.indexOf(el);
    const below = idx >= 0 ? stack.slice(idx + 1) : (() => { const a = []; let p = el.parentElement; while (p) { a.push(p); p = p.parentElement; } return a; })();
    const layers = []; let img = null;
    const own = parse(cs.backgroundColor); if (own && own[3] > 0) layers.push(own);
    for (const b of (own && own[3] >= 0.999) ? [] : below) {
      if (b.tagName === 'IMG' || b.tagName === 'VIDEO') { img = 'img'; break; }
      const s = getComputedStyle(b);
      if (s.backgroundImage && s.backgroundImage !== 'none') { img = s.backgroundImage.slice(0, 60); break; }
      const c = parse(s.backgroundColor);
      if (c && c[3] > 0) { layers.push(c); if (c[3] >= 0.999) break; }
    }
    if (cs.backgroundImage && cs.backgroundImage !== 'none') img = cs.backgroundImage.slice(0, 60);
    let bg = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    if (fg[3] < 1) fg = blend(fg, bg);
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').replace(/\s+/g, ' ').trim().slice(0, 60);
    out.push({ fg: hex(fg), bg: hex(bg), img, size: parseFloat(cs.fontSize), weight: cs.fontWeight, txt,
               sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
               y: Math.round(r.top + scrollY) });
  }
  return out;
}"""


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


async def measure(browser, url, width, height, step, wait):
    """Returns {key: element} for every distinct (fg, bg, img, selector, text) seen during the scroll sweep."""
    seen = {}
    ctx = await browser.new_context(viewport={"width": width, "height": height})
    page = await ctx.new_page()
    try:
        await page.goto(url, wait_until="load", timeout=45000)
        await page.wait_for_timeout(2500)
        H = await page.evaluate("document.scrollingElement.scrollHeight")
        y = 0
        while y < H:
            await page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
            await page.wait_for_timeout(wait)
            for e in await page.evaluate(JS):
                seen.setdefault((e["fg"], e["bg"], e["img"], e["sel"], e["txt"]), e)
            y += step
            H = max(H, await page.evaluate("document.scrollingElement.scrollHeight"))
    finally:
        await ctx.close()
    return seen


def judge(seen):
    fails, imgs = [], []
    for e in seen.values():
        if e["img"]:
            imgs.append(e)
            continue
        need = 3.0 if e["size"] >= 24 else 4.5
        r = ratio(e["fg"], e["bg"])
        if r < need:
            fails.append((round(r, 2), need, e))
    return fails, imgs


async def run(a):
    total_fail, report = 0, {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        try:
            for path in a.paths:
                seen = await measure(browser, a.base.rstrip("/") + path, a.width, a.height, a.step, a.wait)
                fails, imgs = judge(seen)
                total_fail += len(fails)
                slug = (path.strip("/").replace("/", "_") or "home") + f"-{a.width}"
                report[slug] = {"fails": fails, "image": imgs, "measured": len(seen)}
                print(f"{slug}: {len(seen)} text elements measured, {len(fails)} under threshold, {len(imgs)} over an image/gradient")
                for r, need, e in sorted(fails, key=lambda x: x[0]):
                    print(f"  FAIL {r}:1 (need {need}) {e['fg']} on {e['bg']} {e['size']}px y={e['y']} {e['sel'][:50]} « {e['txt']} »")
                for e in imgs:
                    print(f"  IMG  {e['fg']} over {e['img']} {e['size']}px y={e['y']} {e['sel'][:40]} « {e['txt'][:40]} »")
        finally:
            await browser.close()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "contrast.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    print(f"contrast: {total_fail} failing pair(s), max {a.max}")
    sys.exit(1 if total_fail > a.max else 0)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="*", default=["/"])
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--step", type=int, default=600)
    ap.add_argument("--wait", type=int, default=1500)
    ap.add_argument("--max", type=int, default=0)
    ap.add_argument("--out", default=str(Path(__file__).resolve().parents[2] / "tmp" / "qa-contrast"))
    asyncio.run(run(ap.parse_args()))
