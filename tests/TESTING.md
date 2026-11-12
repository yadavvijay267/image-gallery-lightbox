# Testing — Image Gallery with Lightbox

## Automated check

```bash
python3 tests/validate.py
```

`validate.py` parses `src/index.html` and `src/app.js` and asserts the required structure is present: search input, category filters, shuffle button, lightbox with prev/next/close controls, keyboard handling (arrows + Escape), `IntersectionObserver` lazy loading, a download link, and ≥ 12 photos in the data set. It exits non-zero on any failure.

## Manual test checklist

- [ ] Open `src/index.html` — the gallery renders photos in a masonry grid.
- [ ] Scroll down — images below the fold load only as they approach the viewport (check the Network tab).
- [ ] Click a category pill — only that category's photos show; the count text updates.
- [ ] Type in the search box — photos filter live by title/description; a nonsense query shows the empty state.
- [ ] Click 🔀 Shuffle — the photo order changes.
- [ ] Click a photo — lightbox opens full-screen with title, metadata line (camera/lens/aperture/shutter/ISO), description, and a Download button.
- [ ] In the lightbox, press → and ← — photos change; at the ends it wraps around.
- [ ] Press Esc — lightbox closes; clicking the dark backdrop also closes it.
- [ ] Click Download — the full-resolution photo opens/downloads.
- [ ] Resize to a 360px-wide viewport — grid collapses to one column, lightbox buttons stay reachable.
