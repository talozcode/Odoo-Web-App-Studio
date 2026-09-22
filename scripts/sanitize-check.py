#!/usr/bin/env python3
"""
Blur regions of a captured screenshot and export it as WebP for the Work
page. Every image on that page goes through this script and then through
owner review before it is committed.

Usage:
    python3 scripts/sanitize-check.py capture.png work-slug [--out public/work/<slug>]

Boxes to blur are read from a JSON sidecar next to the capture
(capture.json) with the shape {"blur": [[x, y, w, h], ...]} in pixels.
Without a sidecar the image is only resized and converted.

The script prints the width/height to paste into src/config/work.ts.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

MAX_WIDTH = 1600


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    src = Path(sys.argv[1])
    slug = sys.argv[2]
    out_dir = Path("public/work") / slug
    if "--out" in sys.argv:
        out_dir = Path(sys.argv[sys.argv.index("--out") + 1])
    out_dir.mkdir(parents=True, exist_ok=True)

    image = Image.open(src).convert("RGB")
    sidecar = src.with_suffix(".json")
    if sidecar.exists():
        boxes = json.loads(sidecar.read_text()).get("blur", [])
        for x, y, w, h in boxes:
            region = image.crop((x, y, x + w, y + h)).filter(ImageFilter.GaussianBlur(18))
            image.paste(region, (x, y))
        print(f"blurred {len(boxes)} region(s)")

    if image.width > MAX_WIDTH:
        ratio = MAX_WIDTH / image.width
        image = image.resize((MAX_WIDTH, round(image.height * ratio)), Image.LANCZOS)

    out = out_dir / f"{src.stem}.webp"
    image.save(out, "WEBP", quality=82, method=6)
    print(f"wrote {out}  width={image.width} height={image.height}")
    print("review this image before committing it; nothing identifying may remain")
    return 0


if __name__ == "__main__":
    sys.exit(main())
