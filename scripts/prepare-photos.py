#!/usr/bin/env python3
"""Prepare home-page photos: blur a privacy-sensitive region, then export two widths as WebP.

Pillow only. Idempotent: each run overwrites its outputs.

Usage:
    python3 scripts/prepare-photos.py --src <dir> --out <dir> [--video-thumb <file>]
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from PIL import Image, ImageFilter

# (source filename, blur box as fraction of (w, h), blur radius, output widths, output names)
# Each box covers the WHOLE projection screen (QR code + « Scannez » slide text, README rule):
# the plan's first boxes left the QR readable on the Formations photo (visual check 2026-09-28),
# and a box edge on the bezel reads as a lit screen, not as a patch.
PHOTOS = [
    {
        "filename": "2026-06-19-meetup-iap-pointe-ecran-recadree.webp",
        "blur_box_frac": (0.0, 0.0, 0.28, 0.47),
        "blur_radius": 45,
        "widths": [1200, 720],
        "out_names": ["accueil-meetup-ecran-1200.webp", "accueil-meetup-ecran-720.webp"],
    },
    {
        "filename": "2026-06-19-meetup-iap-face-public.webp",
        "blur_box_frac": (0.0, 0.0, 0.28, 0.42),
        "blur_radius": 35,
        "widths": [900, 540],
        "out_names": ["accueil-meetup-public-900.webp", "accueil-meetup-public-540.webp"],
    },
]

WEBP_QUALITY = 80
WEBP_METHOD = 6
VIDEO_THUMB_WIDTH = 960


def blur_region(im: Image.Image, box_frac: tuple[float, float, float, float], radius: int) -> Image.Image:
    w, h = im.size
    x0, y0 = 0, 0
    x1 = round(box_frac[2] * w)
    y1 = round(box_frac[3] * h)
    region = im.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(radius))
    blurred = im.copy()
    blurred.paste(region, (x0, y0))
    return blurred


def save_width(im: Image.Image, width: int, out_path: Path) -> None:
    w, h = im.size
    height = round(width * h / w)
    resized = im.resize((width, height), Image.LANCZOS)
    resized.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)
    print(f"{out_path} {os.path.getsize(out_path)} bytes")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--video-thumb", type=Path, default=None)
    args = parser.parse_args()

    out_dir = args.out
    out_dir.mkdir(parents=True, exist_ok=True)

    for spec in PHOTOS:
        src_path = args.src / spec["filename"]
        im = Image.open(src_path).convert("RGB")
        blurred = blur_region(im, spec["blur_box_frac"], spec["blur_radius"])
        for width, out_name in zip(spec["widths"], spec["out_names"]):
            save_width(blurred, width, out_dir / out_name)

    if args.video_thumb is not None:
        im = Image.open(args.video_thumb).convert("RGB")
        save_width(im, VIDEO_THUMB_WIDTH, out_dir / "video-demo-of1.webp")


if __name__ == "__main__":
    main()
