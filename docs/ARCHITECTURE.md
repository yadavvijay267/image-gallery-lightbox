# Architecture — Image Gallery with Lightbox

## Overview

A single-page gallery. A static array of 24 photos (Picsum IDs + category + original caption) is filtered/search in memory, rendered into a masonry grid, and opened in a lightbox. No framework, no build step, no server.

## Files

| File | Role |
| --- | --- |
| `src/index.html` | Search input, filter pills, shuffle button, gallery container, lightbox dialog. |
| `src/styles.css` | CSS multi-column masonry grid, hover zoom, lightbox overlay and buttons. |
| `src/app.js` | Photo data, filtering, lazy loading, lightbox logic. |

## Flow

```
PHOTOS (24 entries: id, cat, title, desc)
  → renderGallery(): filter by activeCategory + searchTerm → `visible[]`
  → build <figure> per photo; <img> starts as an inline SVG placeholder,
    real URL in data-src, observed by IntersectionObserver (200px rootMargin)
  → click figure → openLightbox(i) → updateLightbox() fills image, title,
    EXIF-style metadata, description, download link
  → ← / → step through `visible[]` (wraps); Esc / backdrop click / ✕ closes
```

## Key decisions

- **Lazy loading:** `IntersectionObserver` swaps `data-src` → `src` when an image nears the viewport; `loading="lazy"` is also set as a belt-and-braces measure.
- **Masonry:** CSS `columns: 3 300px` with `break-inside: avoid` — no JS layout, no library.
- **EXIF-style metadata:** deterministic per photo id (camera/lens/aperture/shutter/ISO chosen by modular arithmetic on the id), so the same photo always shows the same data. It is presented as photo metadata from the Picsum source, not claimed to be real camera EXIF.
- **Shuffle:** Fisher–Yates-style in-place shuffle of the `PHOTOS` array, then re-render. Filters/search apply on top of the shuffled order.
- **Download:** the lightbox download link points at the 1600×1200 Picsum URL for that photo id with a slugified filename.
