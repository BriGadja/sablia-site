#!/usr/bin/env python3
"""Every raster and SVG brand slot, generated from the ONE chosen symbol (US-12).

Source: client/public/brand/symbol.svg (the Claude Design track Brice picked), and
client/public/brand/favicon-16.svg when the track has a 16 px simplification.
Writes into client/public/:
  logo.svg (schema.org logo), favicon.svg, favicon.png (32), favicon.ico (16/32/48),
  apple-touch-icon.png (180, cream background, 12 % padding), icon-192/512.png (transparent),
  icon-maskable-192/512.png (cream background, 20 % safe zone), icon-1024.png (transparent).
The OG / Twitter images are rendered by scripts/og-image.mjs (they need the site font).

Rasterising goes through `rsvg-convert` (no cairosvg / ImageMagick on the VPS). The ICO frames come
from a 256 px raster: Pillow silently drops a size larger than its source.
Usage: python3 scripts/brand-assets.py
"""

from __future__ import annotations

import io
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "client" / "public"
BRAND = PUBLIC / "brand"
CREAM = (245, 242, 236, 255)  # --color-surface-light #F5F2EC


def rasterise(svg: Path, size: int) -> Image.Image:
    png = subprocess.run(
        ["rsvg-convert", "-w", str(size), "-h", str(size), str(svg)], capture_output=True, check=True
    )
    return Image.open(io.BytesIO(png.stdout)).convert("RGBA")


def padded(svg: Path, size: int, padding: float, background: tuple[int, int, int, int] | None) -> Image.Image:
    inner = round(size * (1 - 2 * padding))
    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    mark = rasterise(svg, inner)
    offset = (size - inner) // 2
    canvas.alpha_composite(mark, (offset, offset))
    return canvas


def save(image: Image.Image, name: str) -> None:
    path = PUBLIC / name
    image.save(path, format="PNG", optimize=True)
    print(f"{path.relative_to(ROOT)} {image.size[0]}x{image.size[1]} {path.stat().st_size} bytes")


def main() -> None:
    symbol = BRAND / "symbol.svg"
    small = BRAND / "favicon-16.svg"
    favicon_src = small if small.is_file() else symbol
    if not symbol.is_file():
        raise SystemExit(f"{symbol} missing: extract the chosen track first (plan Phase E3)")

    shutil.copyfile(symbol, PUBLIC / "logo.svg")
    shutil.copyfile(favicon_src, PUBLIC / "favicon.svg")
    print("client/public/logo.svg, client/public/favicon.svg copied")

    save(padded(favicon_src, 32, 0.0, None), "favicon.png")
    save(padded(symbol, 180, 0.12, CREAM), "apple-touch-icon.png")
    save(padded(symbol, 192, 0.0, None), "icon-192.png")
    save(padded(symbol, 512, 0.0, None), "icon-512.png")
    save(padded(symbol, 192, 0.20, CREAM), "icon-maskable-192.png")
    save(padded(symbol, 512, 0.20, CREAM), "icon-maskable-512.png")
    save(padded(symbol, 1024, 0.0, None), "icon-1024.png")

    ico = PUBLIC / "favicon.ico"
    rasterise(favicon_src, 256).save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"{ico.relative_to(ROOT)} frames {sorted(Image.open(ico).info['sizes'])}")


if __name__ == "__main__":
    main()
