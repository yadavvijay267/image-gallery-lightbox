#!/usr/bin/env python3
"""Automated structural validation for the Image Gallery with Lightbox.
Checks that src/index.html + src/app.js contain every element the
guide entry requires. Run: python3 tests/validate.py (exit 0 = pass)."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "src" / "index.html").read_text()
js = (ROOT / "src" / "app.js").read_text()
css = (ROOT / "src" / "styles.css").read_text()

checks = [
    ("index.html exists and references styles.css", 'href="styles.css"' in html),
    ("index.html references app.js", 'src="app.js"' in html),
    ("gallery container present", 'id="gallery"' in html),
    ("search input present", 'id="searchInput"' in html),
    ("filters container present", 'id="filters"' in html),
    ("shuffle button present", 'id="shuffleBtn"' in html),
    ("lightbox present", 'id="lightbox"' in html),
    ("lightbox prev/next/close buttons present", all(x in html for x in ('id="prevBtn"', 'id="nextBtn"', 'id="closeBtn"'))),
    ("download button present", 'id="downloadBtn"' in html),
    ("photo data set has >= 12 photos", len(re.findall(r"\bid: \d+", js)) >= 12),
    ("three categories present", all(c in js for c in ('"nature"', '"city"', '"animals"'))),
    ("lazy loading via IntersectionObserver", "IntersectionObserver" in js),
    ("keyboard arrows handled", "ArrowLeft" in js and "ArrowRight" in js),
    ("Escape closes lightbox", '"Escape"' in js),
    ("Picsum Photos source used", "picsum.photos" in js),
    ("EXIF-style metadata generated", "exifFor" in js and "ISO" in js),
    ("masonry columns styled", "columns:" in css),
]
failed = [name for name, ok in checks if not ok]
for name, ok in checks:
    print(("PASS " if ok else "FAIL ") + name)
print(f"{len(checks) - len(failed)}/{len(checks)} checks passed")
sys.exit(1 if failed else 0)
