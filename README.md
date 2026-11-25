# 🖼️ Image Gallery with Lightbox

A fast, filterable photo gallery with a full-screen lightbox, keyboard navigation, and lazy loading. Photos come from Picsum Photos (free, no key) and only load when they scroll into view.

## Features

- **Category filters & search** — filter by Nature, City, or Animals, and search by title or keyword.
- **Lightbox** — click any photo for a full-screen view with previous/next buttons, left/right arrow-key navigation, and Escape (or backdrop click) to close.
- **Lazy loading** — images load via `IntersectionObserver` only when they approach the viewport, so the page stays fast.
- **Masonry-style responsive grid** — CSS multi-column layout that adapts to any screen size.
- **Shuffle mode** — one click re-orders the whole gallery.
- **Download button per image** — grab the full-resolution version of the photo you're viewing.
- **EXIF-style metadata in the lightbox** — camera, lens, aperture, shutter speed and ISO shown for every photo (deterministic per photo, labelled as photo data from Picsum).

## Tech Stack

- HTML, CSS, JavaScript (no frameworks, no build step)
- Picsum Photos API (free, no key) — `https://picsum.photos/id/{id}/{w}/{h}`

## How to Run

No installation needed:

```bash
# Option 1: just open the file
open src/index.html        # macOS
xdg-open src/index.html    # Linux
start src/index.html       # Windows

# Option 2: serve it locally
python3 -m http.server --directory src 8000
# then visit http://localhost:8000
```

Note: photos load from picsum.photos, so you need internet access to see the images. The layout, filters, and lightbox all work offline.

## How to Use

1. Use the filter pills or the search box to narrow the gallery.
2. Click **🔀 Shuffle** to re-order the photos.
3. Click any photo to open the lightbox; use **← →** to browse, **Esc** to close, or the **Download** button to save the photo.

## Screenshots

Screenshots live in [`screenshots/`](screenshots/) — see `SCREENSHOTS.md` there for the naming convention.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Clamor.
