#!/usr/bin/env bash
# Test for scripts/prepare-photos.py (formation set): every derivative exists at its width and
# aspect, carries no EXIF/XMP/ICC chunk, and no crop box touches the burned-in partner logo.
# Needs only the committed outputs and the script, never the originals (they stay out of git).
set -u
cd "$(dirname "$0")/.." || exit 1
python3 -I - <<'PY'
import importlib.util
import struct
import sys
from pathlib import Path

fail = []
spec = importlib.util.spec_from_file_location("prep", "scripts/prepare-photos.py")
prep = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(prep)
    photos = prep.FORMATION
except Exception as exc:  # the script or its FORMATION list is missing
    print(f"FAIL cannot load FORMATION from scripts/prepare-photos.py: {exc}")
    sys.exit(1)


def webp_info(path: Path) -> tuple[int, int, set[str]]:
    data = path.read_bytes()
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("not a RIFF/WEBP file")
    chunks, width, height, pos = set(), 0, 0, 12
    while pos + 8 <= len(data):
        tag, size = data[pos : pos + 4].decode("latin-1"), struct.unpack("<I", data[pos + 4 : pos + 8])[0]
        body = data[pos + 8 : pos + 8 + size]
        chunks.add(tag)
        if tag == "VP8 ":
            width, height = struct.unpack("<HH", body[6:10])
            width, height = width & 0x3FFF, height & 0x3FFF
        elif tag == "VP8L":
            bits = int.from_bytes(body[1:5], "little")
            width, height = (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
        elif tag == "VP8X":
            width = int.from_bytes(body[4:7], "little") + 1
            height = int.from_bytes(body[7:10], "little") + 1
        pos += 8 + size + (size & 1)
    return width, height, chunks


def intersects(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> bool:
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


if len(photos) < 4:
    fail.append(f"only {len(photos)} photos in FORMATION (plan floor: 4)")
for p in photos:
    x0, y0, x1, y1 = p["crop"]
    if intersects(p["crop"], p["logo"]):
        fail.append(f"{p['n']}: crop {p['crop']} touches the logo box {p['logo']}")
    for w in prep.FORMATION_WIDTHS:
        f = Path(f"public/photos/formation-{p['n']}-{w}.webp")
        if not f.exists():
            fail.append(f"{f} missing")
            continue
        try:
            fw, fh, chunks = webp_info(f)
        except ValueError as exc:
            fail.append(f"{f}: {exc}")
            continue
        want_h = round(w * (y1 - y0) / (x1 - x0))
        if (fw, fh) != (w, want_h):
            fail.append(f"{f}: {fw}x{fh}, expected {w}x{want_h}")
        meta = chunks & {"EXIF", "XMP ", "ICCP"}
        if meta:
            fail.append(f"{f}: metadata chunk(s) {sorted(meta)}")
if not Path("public/photos/accueil-meetup-ecran-720.webp").exists():
    fail.append("public/photos/accueil-meetup-ecran-720.webp removed (parity probe)")

for line in fail:
    print("FAIL", line)
print(f"prepare-photos tests: {'FAIL' if fail else 'PASS'} ({len(photos)} photos)")
sys.exit(1 if fail else 0)
PY
