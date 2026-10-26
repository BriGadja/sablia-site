#!/usr/bin/env python3
"""Brand guard (US-12): every brand slot carries the new logo, none the old mark.

The mark shipped until 2026-09 was derived from a client's brand (grill of 2026-09-28, decision 7).
This check exits 0 only when:
  - no brand file still has the md5 of an old file, and no old wordmark SVG is left;
  - favicon.ico holds EXACTLY the 16, 32 and 48 px frames;
  - the four OG / Twitter images are 1200x630;
  - brand/symbol.svg is paths only (no <image>, no <text>) and is not empty nor a solid block:
    rasterised at 64 px, it shows >= 2 distinct RGBA values among its visible pixels and covers
    between 8 % and 70 % of the square;
  - brand/badge.svg (favicon and app icons) is the Sablier charte tile: the symbol's OWN path (same `d`)
    in gold on a night square, and the S really shows (gold covers 8-40 % of the square);
  - no brand SVG carries the old coral (#D97757, #CC785C), and the maskable tiles are night with gold;
  - the schema.org "logo" of src/components/seo/OrganizationJsonLd.tsx points to a file under public/.

Usage: python3 scripts/brand-check.py [--public public]
One line per check; exit 1 on the first run with any failure (all checks still print).
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
GOLD = (0xD9, 0xA4, 0x41)  # --color-gold, the Sablier charte signal
NIGHT = (0x16, 0x1B, 0x29)  # --color-night
CORAL_HEX = ("#d97757", "#cc785c")

# md5 of every brand file shipped before 2026-09-28 (read from the repo at 69a3830).
OLD_MD5 = {
    "4c3f1d0252d598cca15b797b8253d470",  # logo.svg = favicon.svg
    "852204724faaebdfbe7665d6c21a6200",  # wordmark-dark.svg
    "0abb16676047c931cdb3f48e229e9570",  # wordmark-light.svg
    "4ab52fa3e811d0d50586c4400249480b",  # favicon.ico
    "1c8aa119291b0c3959eb47f114eb4ec6",  # og-image*.png = twitter-image*.png
    "7cdca75a631484949019aed30725beaf",  # favicon.png
    "dec262d1361b7bcf6e30cb4822410e1d",  # apple-touch-icon.png
    "7c04e80c7ba48241fb0b356c22bdf229",  # icon-192.png
    "4e95028e2ff06dd62ccde77c55f5465b",  # icon-512.png
    "1264676ecb9967939e693bf779ec561f",  # icon-maskable-192.png
    "fa24d37cedda10d8ff79c8ff28395671",  # icon-maskable-512.png
    "e3495b766b7bf457970ea8d29a365c02",  # icon-1024.png
}

BRAND_FILES = [
    "logo.svg",
    "favicon.svg",
    "favicon.ico",
    "favicon.png",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "icon-maskable-192.png",
    "icon-maskable-512.png",
    "icon-1024.png",
    "og-image-home.png",
    "og-image.png",
    "twitter-image-home.png",
    "twitter-image.png",
]
OG_FILES = ["og-image-home.png", "og-image.png", "twitter-image-home.png", "twitter-image.png"]
OLD_WORDMARKS = ["wordmark-dark.svg", "wordmark-light.svg"]


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def check_md5(public: Path) -> list[str]:
    errors = []
    for name in BRAND_FILES:
        path = public / name
        if not path.is_file():
            errors.append(f"{name} missing")
        elif md5(path) in OLD_MD5:
            errors.append(f"{name} still has an old md5 ({md5(path)})")
    for name in OLD_WORDMARKS:
        if (public / name).exists():
            errors.append(f"{name} still present")
    return errors


def check_ico(public: Path) -> list[str]:
    path = public / "favicon.ico"
    if not path.is_file():
        return ["favicon.ico missing"]
    sizes = Image.open(path).info.get("sizes", set())
    found = sorted(w for w, _ in sizes)
    return [] if set(sizes) == {(16, 16), (32, 32), (48, 48)} else [f"favicon.ico frames {found}"]


def check_og(public: Path) -> list[str]:
    errors = []
    for name in OG_FILES:
        path = public / name
        if not path.is_file():
            errors.append(f"{name} missing")
            continue
        size = Image.open(path).size
        if size != (1200, 630):
            errors.append(f"{name} is {size[0]}x{size[1]}")
    return errors


def check_symbol(public: Path) -> list[str]:
    path = public / "brand" / "symbol.svg"
    if not path.is_file():
        return ["brand/symbol.svg missing"]
    text = path.read_text(encoding="utf-8")
    errors = []
    if not text.lstrip().startswith("<svg"):
        errors.append("symbol.svg does not start with <svg")
    if "<image" in text:
        errors.append("symbol.svg embeds an <image>")
    if "<text" in text:
        errors.append("symbol.svg contains <text>")
    png = subprocess.run(
        ["rsvg-convert", "-w", "64", "-h", "64", str(path)], capture_output=True, check=False
    )
    if png.returncode != 0:
        return errors + [f"rsvg-convert failed: {png.stderr.decode()[:120]}"]
    raster = Image.open(io.BytesIO(png.stdout)).convert("RGBA")
    data = raster.tobytes()
    visible = [data[i : i + 4] for i in range(0, len(data), 4) if data[i + 3] > 0]
    coverage = len(visible) / (64 * 64)
    distinct = len(set(visible))
    if distinct < 2:
        errors.append(f"symbol raster has {distinct} distinct visible colour(s)")
    if not 0.08 <= coverage <= 0.70:
        errors.append(f"symbol raster covers {coverage:.0%} of the square (expected 8-70 %)")
    return errors


def raster_coverage(path: Path) -> float | None:
    png = subprocess.run(
        ["rsvg-convert", "-w", "64", "-h", "64", str(path)], capture_output=True, check=False
    )
    if png.returncode != 0:
        return None
    data = Image.open(io.BytesIO(png.stdout)).convert("RGBA").getchannel("A").tobytes()
    return sum(1 for alpha in data if alpha > 0) / (64 * 64)


def check_badge(public: Path) -> list[str]:
    symbol, badge = public / "brand" / "symbol.svg", public / "brand" / "badge.svg"
    if not badge.is_file() or not symbol.is_file():
        return ["brand/badge.svg or brand/symbol.svg missing"]
    text = badge.read_text(encoding="utf-8")
    errors = []
    if "<image" in text or "<text" in text:
        errors.append("badge.svg is not paths only")
    path_d = re.search(r'<path[^>]* d="([^"]+)"', symbol.read_text(encoding="utf-8"))
    if not path_d or f'd="{path_d.group(1)}"' not in text:
        errors.append("badge.svg does not cut out the symbol's own path")
    if "#D9A441" not in text or "#161B29" not in text:
        errors.append("badge.svg is not gold (#D9A441) on night (#161B29)")
    colours = pixel_share(badge, 64)
    if colours is None:
        errors.append("rsvg-convert failed on badge.svg")
    elif not 0.08 <= colours.get(GOLD, 0) <= 0.40:
        errors.append(f"badge gold covers {colours.get(GOLD, 0):.0%} of the square (expected 8-40 %)")
    return errors


def pixel_share(path: Path, size: int) -> dict[tuple[int, int, int], float] | None:
    """Share of the square taken by each near-exact opaque colour (anti-aliased edges are ignored)."""
    png = subprocess.run(
        ["rsvg-convert", "-w", str(size), "-h", str(size), str(path)], capture_output=True, check=False
    )
    if png.returncode != 0:
        return None
    raster = Image.open(io.BytesIO(png.stdout)).convert("RGBA")
    counts: dict[tuple[int, int, int], int] = {}
    for r, g, b, a in zip(*[iter(raster.tobytes())] * 4):
        if a == 255:
            counts[(r, g, b)] = counts.get((r, g, b), 0) + 1
    return {k: v / (size * size) for k, v in counts.items()}


def check_no_coral(public: Path) -> list[str]:
    errors = []
    for name in ("logo.svg", "favicon.svg", "brand/symbol.svg", "brand/badge.svg"):
        path = public / name
        if path.is_file() and any(c in path.read_text(encoding="utf-8").lower() for c in CORAL_HEX):
            errors.append(f"{name} still carries the old coral")
    for name in ("icon-maskable-192.png", "icon-maskable-512.png"):
        path = public / name
        if not path.is_file():
            continue
        raw = Image.open(path).convert("RGB").tobytes()
        data = list(zip(*[iter(raw)] * 3))
        total = len(data)
        night = sum(1 for p in data if p == NIGHT) / total
        gold = sum(1 for p in data if p == GOLD) / total
        if night < 0.5 or gold < 0.03:
            errors.append(f"{name} is not night with a gold S (night {night:.0%}, gold {gold:.0%})")
    return errors


def check_schema_logo(public: Path) -> list[str]:
    source = public.parent / "src" / "components" / "seo" / "OrganizationJsonLd.tsx"
    match = re.search(r"logo:\s*`\$\{SITE_ORIGIN\}/([^`]+)`", source.read_text(encoding="utf-8"))
    if not match:
        return ["OrganizationJsonLd.tsx has no logo: `${SITE_ORIGIN}/...` entry"]
    target = public / match.group(1)
    return [] if target.is_file() else [f'schema "logo" points to a missing file: {target.name}']


def check_manifest(public: Path) -> list[str]:
    manifest = json.loads((public / "manifest.json").read_text(encoding="utf-8"))
    missing = [i["src"] for i in manifest.get("icons", []) if not (public / i["src"].lstrip("/")).is_file()]
    return [f"manifest icon missing: {m}" for m in missing]


def main() -> int:
    parser = argparse.ArgumentParser(description="Brand guard (US-12): every brand slot carries the new logo.")
    parser.add_argument("--public", default=str(ROOT / "public"))
    args = parser.parse_args()
    public = Path(args.public)

    checks = [
        ("no old brand file, no old wordmark", check_md5),
        ("favicon.ico = 16/32/48", check_ico),
        ("OG and Twitter images 1200x630", check_og),
        ("symbol.svg paths only, visible, not a block", check_symbol),
        ("badge.svg is the symbol in gold on night", check_badge),
        ("no coral left, maskable tiles night + gold", check_no_coral),
        ("schema.org logo resolves", check_schema_logo),
        ("manifest icons exist", check_manifest),
    ]
    failed = False
    for label, check in checks:
        errors = check(public)
        if errors:
            failed = True
            print(f"FAIL  {label}: " + "; ".join(errors))
        else:
            print(f"ok    {label}")
    print("ROUGE" if failed else "VERT")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
