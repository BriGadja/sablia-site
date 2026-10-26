#!/usr/bin/env python3
"""The fixed `defects` metric of the sablia.io v2 port (copy of the autoresearch `score.py`, adapted to plain pages).

Lower is better. Opens the page in its OWN headless Chromium (never the shared Chrome on :9222) at 1440x900 then
390x844 and counts the reviewers' recurring findings as deterministic checks; contrast runs `contrast.py` in a
subprocess (1440 only, like the original) and counts each failing pair x3.
Usage: score.py PAGE [--base URL] [--max N] [--out DIR]
  PAGE = home (/) | form (/formations) | acc (/accompagnement); --base defaults to the preview slot http://127.0.0.1:5001.
Prints `defects: N` then one `check: value` line per check; writes DIR/score-PAGE.json.
Exit 1 when defects > --max (default 0); the original always exited 0.
`cause_before_effect` and `offscreen_payoff` read the Accompagnement timeline (`#parcours .tl-line i`, `.tl-step`,
`.tl-dot`, `.on` class): on `acc`, a page without any `.tl-step` counts 1 defect (`timeline_missing`) instead of a silent 0.
"""
import argparse, asyncio, json, re, subprocess, sys
from pathlib import Path
from playwright.async_api import async_playwright

PATHS = {"home": "/", "form": "/formations", "acc": "/accompagnement"}
HERE = Path(__file__).resolve().parent

JS_COMMON = r"""() => {
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const hidden = el => !!el.closest('[aria-hidden="true"]');
  const own = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
  const vh = innerHeight, out = { small_text: [], truncated: [], orphan_dot: [], touch_targets: [], bands: [] };
  const content = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), y = r.top + scrollY;
    const tag = el.tagName;
    if (own(el)) {
      content.push([y, y + r.height]);
      const txt = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!hidden(el) && parseFloat(cs.fontSize) < 12) out.small_text.push(txt);
      if ((cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden' || cs.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
        out.truncated.push(txt);
      for (const n of el.childNodes) {
        if (n.nodeType !== 3) continue;
        const s = n.textContent;
        for (let i = s.indexOf('·'); i >= 0; i = s.indexOf('·', i + 1)) {
          let j = i + 1; while (j < s.length && /\s/.test(s[j])) j++;
          if (j >= s.length) continue;
          const a = document.createRange(); a.setStart(n, i); a.setEnd(n, i + 1);
          const b = document.createRange(); b.setStart(n, j); b.setEnd(n, j + 1);
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          if (ra.height && rb.height && rb.top > ra.top + 2) out.orphan_dot.push(s.trim().slice(0, 40));
        }
      }
    } else if (tag === 'IMG' || tag === 'VIDEO' || (tag === 'svg' && !el.classList.contains('dune') && r.width > 40 && r.height > 40)) {
      content.push([y, y + r.height]);
    }
    if ((tag === 'A' || tag === 'BUTTON') && !hidden(el)) {
      const inline = tag === 'A' && el.parentElement && /^(P|LI|SPAN|FIGCAPTION)$/.test(el.parentElement.tagName) && cs.display === 'inline';
      if (r.height < (inline ? 24 : 44)) out.touch_targets.push((el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) + ' ' + Math.round(r.height));
    }
  }
  content.sort((p, q) => p[0] - q[0]);
  let end = content.length ? content[0][1] : 0;
  for (const [a, b] of content) { if (a - end > vh / 3) out.bands.push([Math.round(end), Math.round(a)]); end = Math.max(end, b); }
  const hdr = document.querySelector('header');
  out.header_h = hdr ? Math.round(hdr.getBoundingClientRect().height) : 0;
  out.vh = vh; out.overflow = document.scrollingElement.scrollWidth > innerWidth + 1;
  return out;
}"""

JS_SCREEN = r"""() => {
  const t = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.5) continue;
    const r = el.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= innerHeight || r.width < 1) continue;
    for (const n of el.childNodes) if (n.nodeType === 3) t.push(n.textContent);
  }
  return t.join(' ');
}"""

JS_TL = r"""() => {
  const line = document.querySelector('#parcours .tl-line i'); const L = line ? line.getBoundingClientRect() : null;
  return [...document.querySelectorAll('#parcours .tl-step')].map(s => { const d = s.querySelector('.tl-dot'); const r = (d || s).getBoundingClientRect();
    return { on: s.classList.contains('on'), cy: r.top + r.height / 2, top: r.top, bottom: r.bottom, lineBottom: L ? L.bottom : null, vh: innerHeight }; });
}"""

async def run(a):
    res = {}
    url = a.base.rstrip("/") + PATHS[a.page]
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        try:
            for w, h in ((1440, 900), (390, 844)):
                ctx = await b.new_context(viewport={"width": w, "height": h})
                page = await ctx.new_page()
                try:
                    await page.goto(url, wait_until="load", timeout=45000)
                    await page.wait_for_timeout(2500)
                    res[f"w{w}"] = await page.evaluate(JS_COMMON)
                    if a.page == "home" and w == 1440:
                        seen = ""
                        for y in (0, 800):
                            await page.evaluate(f"document.scrollingElement.scrollTo(0,{y})")
                            await page.wait_for_timeout(1500)
                            seen += await page.evaluate(JS_SCREEN)
                        norm = seen.replace(" ", " ").replace(" ", " ").lower()
                        res["first_screens_missing"] = [s for s in ("1 490", "rembours", "Brice") if s.lower() not in norm]
                    if a.page == "acc" and w == 1440:
                        if not await page.locator("#parcours .tl-step").count():
                            res["timeline_missing"] = 1
                        else:
                            await page.locator("#parcours").first.evaluate("e => e.scrollIntoView({block: 'start'})")
                            early, offscreen, was_on = set(), set(), set()
                            for _ in range(80):
                                await page.wait_for_timeout(100)
                                for i, s in enumerate(await page.evaluate(JS_TL)):
                                    if s["on"] and i not in was_on:
                                        was_on.add(i)
                                        if s["bottom"] < 0 or s["top"] > s["vh"]:
                                            offscreen.add(i)
                                    if s["on"] and s["lineBottom"] is not None and s["cy"] > s["lineBottom"] + 6:
                                        early.add(i)
                            res["cause_before_effect"] = sorted(early)
                            res["offscreen_payoff"] = sorted(offscreen)
                finally:
                    await ctx.close()
        finally:
            await b.close()
    # contrast: the rendered gate (its own scroll sweep), 1440 only like the original
    cp = subprocess.run([sys.executable, str(HERE / "contrast.py"), PATHS[a.page], "--base", a.base, "--out", a.out],
                        capture_output=True, text=True)
    m = re.search(r"(\d+) under threshold", cp.stdout)
    res["contrast_fails"] = int(m.group(1)) if m else 99
    d, W = res["w1440"], res["w390"]
    checks = {
        "first_screens": len(res.get("first_screens_missing", [])),
        "cause_before_effect": len(res.get("cause_before_effect", [])),
        "offscreen_payoff": len(res.get("offscreen_payoff", [])),
        "timeline_missing": res.get("timeline_missing", 0),
        "empty_bands": len(d["bands"]),
        "phone_header": int(W["header_h"] > 0.15 * W["vh"]),
        "truncated": len(d["truncated"]) + len(W["truncated"]) + len(d["orphan_dot"]) + len(W["orphan_dot"]),
        "small_text": len(d["small_text"]) + len(W["small_text"]),
        "touch_targets": len(W["touch_targets"]),
        "h_overflow": 3 * int(W["overflow"]),
        "contrast": 3 * res["contrast_fails"],
    }
    total = sum(checks.values())
    Path(a.out).mkdir(parents=True, exist_ok=True)
    (Path(a.out) / f"score-{a.page}.json").write_text(json.dumps({"defects": total, "checks": checks, "raw": res}, ensure_ascii=False, indent=1))
    print(f"defects: {total}")
    for k, v in checks.items():
        print(f"{k}: {v}")
    sys.exit(1 if total > a.max else 0)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("page", choices=list(PATHS))
    ap.add_argument("--base", default="http://127.0.0.1:5001")
    ap.add_argument("--max", type=int, default=0)
    ap.add_argument("--out", default=str(HERE.parents[1] / "tmp" / "qa-score"))
    asyncio.run(run(ap.parse_args()))
