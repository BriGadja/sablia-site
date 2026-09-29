#!/usr/bin/env python3
"""Every raster and SVG brand slot, generated from the two marks Brice picked (US-12).

Brice, 2026-09-29, Claude Design round 3: « on prend le 3, et on garde en tête le 12 qui va
permettre d'ajouter un fond quand nécessaire ».
  client/public/brand/symbol.svg  mark 3, the stroked S-hourglass: the mark on a page
                                  (logo.svg for schema.org, nav, footer, OG images).
  client/public/brand/badge.svg   mark 12, the same S cut out of a rounded coral square: every
                                  slot that needs its own background (favicon, app icons).
Writes into client/public/:
  logo.svg (symbol), favicon.svg (badge), favicon.png (32), favicon.ico (16/32/48),
  icon-192/512/1024.png (badge, transparent corners), apple-touch-icon.png (180) and
  icon-maskable-192/512.png (full-bleed tile: the platform crops its own shape, so the badge's
  rounded corners would leave a ring; the S sits at the badge's scale, well inside the 80 % safe zone).
The OG / Twitter images and the lockups are rendered by scripts/og-image.mjs (they need the site font).

Rasterising goes through `rsvg-convert` (no cairosvg / ImageMagick on the VPS). Each ICO frame is
rendered at its own size (a 256 px raster downscaled by Pillow blurs the 1 px cut-out at 16 px);
the 48 px frame is the base image because Pillow silently drops a size larger than its source.
Usage: python3 scripts/brand-assets.py
"""

from __future__ import annotations

import io
import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "client" / "public"
BRAND = PUBLIC / "brand"
CREAM = (245, 242, 236, 255)  # --color-surface-light #F5F2EC
CORAL = (217, 119, 87, 255)  # #D97757, the logo colour (grill 2026-09-28, decision 7)


def rasterise(svg: Path, size: int) -> Image.Image:
    png = subprocess.run(
        ["rsvg-convert", "-w", str(size), "-h", str(size), str(svg)], capture_output=True, check=True
    )
    return Image.open(io.BytesIO(png.stdout)).convert("RGBA")


def badge_scale(badge: Path) -> float:
    """The factor badge.svg scales the symbol's path by, read from the file so the two never drift."""
    match = re.search(r"scale\(([\d.]+)\)", badge.read_text(encoding="utf-8"))
    if not match:
        raise SystemExit(f"{badge} has no scale(...) on its cut-out path")
    return float(match.group(1))


def tile(symbol: Path, size: int, scale: float) -> Image.Image:
    """The badge, full-bleed: a coral square with the S in cream, at the badge's scale."""
    canvas = Image.new("RGBA", (size, size), CORAL)
    mark = rasterise(symbol, round(size * scale))
    offset = (size - mark.size[0]) // 2
    canvas.paste(Image.new("RGBA", mark.size, CREAM), (offset, offset), mark.getchannel("A"))
    return canvas


def save(image: Image.Image, name: str) -> None:
    path = PUBLIC / name
    image.save(path, format="PNG", optimize=True)
    print(f"{path.relative_to(ROOT)} {image.size[0]}x{image.size[1]} {path.stat().st_size} bytes")


def main() -> None:
    symbol = BRAND / "symbol.svg"
    badge = BRAND / "badge.svg"
    for source in (symbol, badge):
        if not source.is_file():
            raise SystemExit(f"{source} missing: extract the chosen marks first (plan Phase E3)")

    scale = badge_scale(badge)

    shutil.copyfile(symbol, PUBLIC / "logo.svg")
    shutil.copyfile(badge, PUBLIC / "favicon.svg")
    print("client/public/logo.svg (symbol), client/public/favicon.svg (badge) copied")

    save(rasterise(badge, 32), "favicon.png")
    save(tile(symbol, 180, scale), "apple-touch-icon.png")
    save(rasterise(badge, 192), "icon-192.png")
    save(rasterise(badge, 512), "icon-512.png")
    save(tile(symbol, 192, scale), "icon-maskable-192.png")
    save(tile(symbol, 512, scale), "icon-maskable-512.png")
    save(rasterise(badge, 1024), "icon-1024.png")

    ico = PUBLIC / "favicon.ico"
    rasterise(badge, 48).save(
        ico,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[rasterise(badge, 16), rasterise(badge, 32)],
    )
    print(f"{ico.relative_to(ROOT)} frames {sorted(Image.open(ico).info['sizes'])}")


if __name__ == "__main__":
    main()
