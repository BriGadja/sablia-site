#!/usr/bin/env python3
"""Prepare site photos: crop or blur what must not show, then export fixed widths as WebP.

Two sets. `accueil` (default): the 2026-06-19 meetup photos, a blurred screen region, two widths.
`formation`: the training-event photos of 2026-10-09, cropped clear of the partner logo, one
printed brand mark erased, the hero's audience softened, three widths. Pillow (+ numpy for the
blur mask). Idempotent: each run overwrites its outputs. WebP carries no EXIF, XMP or ICC chunk (`scripts/prepare-photos.test.sh`).

Usage:
    python3 scripts/prepare-photos.py --src <dir> --out <dir> [--video-thumb <file>]
    python3 scripts/prepare-photos.py --set formation --src <originals dir> --out public/photos
    python3 scripts/prepare-photos.py --set formation --no-blur --src <dir> --out <dir outside git>
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

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

# Training-event photos (2026-10-09). The originals never enter git (this repository is public):
# they come from the Drive folder « Sélection pour le site », file names as the photographer
# numbered them. Boxes are (x0, y0, x1, y1) in original pixels. `logo` is the burned-in partner
# logo measured on each original; the test fails if a crop touches it. `n` is the copy slot of the
# 2026-11-01 run (01 hero, 02 trainer portrait, 03-05 the trainer band). Photo 245 was dropped:
# speaker too small, recognisable audience, 1536 px left after a clean crop.
LANDSCAPE_LOGO = (2180, 1750, 2860, 1895)
FORMATION_WIDTHS = (540, 900, 1200)
FORMATION = [
    {
        # Podium + seated audience, 3:2. Several audience faces are large and recognisable at web
        # size: the audience is softened like a shallow depth of field (`audience_blur`).
        "n": "01",
        "src": "254-ADT28164.jpg",
        # Left edge at 870: the ring light (x <= 850) would show as a white arc at the border.
        "crop": (870, 385, 2880, 1725),
        "logo": LANDSCAPE_LOGO,
        "audience_blur": {"sigma": 12.0, "focus_x": 2033.0, "slope": 0.03, "ramp": 380.0, "top": (730.0, 820.0)},
    },
    # Close portrait, 4:5, nobody else in frame.
    {"n": "02", "src": "248-ADT17808.jpg", "crop": (0, 100, 2880, 3700), "logo": (1830, 4060, 2850, 4275)},
    # Speaking at the lectern, 3:2; starts right of the projection screen so no QR pixel remains.
    # `erase`: the microphone brand printed on the receiver clip on the lectern.
    {
        "n": "03",
        "src": "243-ADT17786.jpg",
        "crop": (800, 80, 2880, 1467),
        "logo": LANDSCAPE_LOGO,
        "erase": [(1836, 1266, 1868, 1316)],
    },
    # Arm toward the screen, 3:2; the laptop screen and the dark screen edge (x < 110) stay outside.
    {"n": "04", "src": "257-ADT17846.jpg", "crop": (114, 0, 2730, 1744), "logo": LANDSCAPE_LOGO},
    # Coffee-break conversation, 3:2; bottom edge above the branded cups (rim at y 1388).
    {"n": "05", "src": "391-ADT18423.jpg", "crop": (600, 250, 2280, 1370), "logo": LANDSCAPE_LOGO},
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


def audience_blur(
    im: Image.Image, sigma: float, focus_x: float, slope: float, ramp: float, top: tuple[float, float]
) -> Image.Image:
    """Soften everything left of the speaker like a shallow depth of field.

    Strength (in Gaussian radius) = sigma x a horizontal ramp (0 on the focus line
    x = focus_x + slope * y, full `ramp` px left of it) x a vertical ramp (0 above top[0], full
    below top[1], so the edge falls on the plain wall above the heads). Four blur levels are
    blended in sequence, which interpolates linearly between the two levels around each pixel.
    """
    w, h = im.size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    horizontal = np.clip((focus_x + slope * yy - xx) / ramp, 0.0, 1.0)
    vertical = np.clip((yy - top[0]) / (top[1] - top[0]), 0.0, 1.0)
    strength = sigma * horizontal * vertical
    levels = [sigma * k / 4 for k in range(1, 5)]
    out = im
    previous = 0.0
    for level in levels:
        weight = np.clip((strength - previous) / (level - previous), 0.0, 1.0)
        mask = Image.fromarray((weight * 255 + 0.5).astype(np.uint8))
        out = Image.composite(im.filter(ImageFilter.GaussianBlur(level)), out, mask)
        previous = level
    return out


def erase_marks(im: Image.Image, boxes: list[tuple[int, int, int, int]], pad: int = 8) -> Image.Image:
    """Remove light printed marks on a dark object: a min filter spreads the dark surface over the
    letters, a soft mask blends the patch in."""
    out = im.copy()
    for x0, y0, x1, y1 in boxes:
        region = im.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad))
        region = region.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(1.5))
        mask = Image.new("L", region.size, 0)
        ImageDraw.Draw(mask).rectangle((pad, pad, pad + x1 - x0, pad + y1 - y0), fill=255)
        out.paste(region, (x0 - pad, y0 - pad), mask.filter(ImageFilter.GaussianBlur(2)))
    return out


def prepare_formation(src_dir: Path, out_dir: Path, blur: bool) -> None:
    for spec in FORMATION:
        im = Image.open(src_dir / spec["src"]).convert("RGB")
        if "erase" in spec:
            im = erase_marks(im, spec["erase"])
        if blur and "audience_blur" in spec:
            im = audience_blur(im, **spec["audience_blur"])
        cropped = im.crop(spec["crop"])
        for width in FORMATION_WIDTHS:
            save_width(cropped, width, out_dir / f"formation-{spec['n']}-{width}.webp")


def save_width(im: Image.Image, width: int, out_path: Path) -> None:
    w, h = im.size
    height = round(width * h / w)
    resized = im.resize((width, height), Image.Resampling.LANCZOS)
    resized.save(out_path, format="WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)
    print(f"{out_path} {os.path.getsize(out_path)} bytes")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--src", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--video-thumb", type=Path, default=None)
    parser.add_argument("--set", choices=("accueil", "formation"), default="accueil")
    parser.add_argument("--no-blur", action="store_true", help="formation set: skip the audience blur")
    args = parser.parse_args()

    out_dir = args.out
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.set == "formation":
        prepare_formation(args.src, out_dir, blur=not args.no_blur)
        return

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
