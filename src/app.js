/* Image Gallery with Lightbox — original code by Clamor.
   Filterable, searchable photo gallery (Picsum Photos, free, no key)
   with lazy loading, a full-screen lightbox (keyboard navigation),
   shuffle mode, per-photo download, and EXIF-style metadata. */
"use strict";

/* Picsum photo ids grouped into categories. Titles/descriptions are
   original captions written for this gallery. */
const PHOTOS = [
  { id: 1015, cat: "nature", title: "River Valley", desc: "A river winding through a green valley at dawn." },
  { id: 1016, cat: "nature", title: "Canyon Walls", desc: "Layered rock walls carved by water over millennia." },
  { id: 1018, cat: "nature", title: "Mountain Lake", desc: "Still water reflecting a mountain ridge." },
  { id: 1025, cat: "animals", title: "Curious Pug", desc: "A pug staring straight into the camera." },
  { id: 1024, cat: "animals", title: "Eagle in Flight", desc: "An eagle riding a thermal above the cliffs." },
  { id: 1020, cat: "animals", title: "Brown Bear", desc: "A bear pausing on a forest trail." },
  { id: 1035, cat: "nature", title: "Misty Peaks", desc: "Peaks fading into morning mist." },
  { id: 1036, cat: "nature", title: "Snowy Summit", desc: "A snow-covered summit under a clear sky." },
  { id: 1039, cat: "nature", title: "Waterfall Drop", desc: "Water crashing over a mossy ledge." },
  { id: 1043, cat: "nature", title: "Forest Light", desc: "Sunlight breaking through a dense canopy." },
  { id: 1044, cat: "nature", title: "Moonlit Sky", desc: "The moon rising over a dark horizon." },
  { id: 1060, cat: "city", title: "City Rooftops", desc: "Rooftops and towers in the evening light." },
  { id: 1067, cat: "city", title: "Downtown Streets", desc: "A busy street corner at golden hour." },
  { id: 1071, cat: "nature", title: "Forest Path", desc: "A quiet path disappearing into the trees." },
  { id: 1074, cat: "animals", title: "Lion Portrait", desc: "A lion resting in the tall grass." },
  { id: 1080, cat: "nature", title: "Strawberry Field", desc: "Ripe strawberries ready for harvest." },
  { id: 1084, cat: "animals", title: "Walrus on Ice", desc: "A walrus hauled out on the ice." },
  { id: 122, cat: "city", title: "Old Town Lane", desc: "A narrow lane between old stone buildings." },
  { id: 164, cat: "city", title: "Harbour Lights", desc: "Boats and lights along the harbour at dusk." },
  { id: 180, cat: "city", title: "Laptop Workspace", desc: "A desk setup ready for a long work session." },
  { id: 183, cat: "city", title: "Classic Car", desc: "A vintage car parked on a cobbled street." },
  { id: 211, cat: "city", title: "Sailing Boat", desc: "A small boat cutting across the bay." },
  { id: 274, cat: "city", title: "City Skyline", desc: "A skyline glowing as night falls." },
  { id: 292, cat: "nature", title: "Fresh Produce", desc: "Vegetables laid out at a morning market." },
];
const CATEGORIES = ["all", "nature", "city", "animals"];

const $ = (id) => document.getElementById(id);
const gallery = $("gallery"), lightbox = $("lightbox");
let activeCategory = "all", searchTerm = "", visible = [...PHOTOS], currentIndex = 0, observer = null;

function photoUrl(p, w = 600, h = 400) { return `https://picsum.photos/id/${p.id}/${w}/${h}`; }

/* Deterministic EXIF-style metadata derived from the photo id, so the
   same photo always shows the same (plausible, clearly labelled) data. */
function exifFor(p) {
  const cameras = ["Canon EOS R6", "Nikon Z6 II", "Sony A7 III", "Fujifilm X-T4"];
  const lenses = ["24–70mm f/2.8", "50mm f/1.8", "16–35mm f/4", "70–200mm f/2.8"];
  const cam = cameras[p.id % cameras.length];
  const lens = lenses[(p.id >> 2) % lenses.length];
  const aperture = `f/${(1.8 + (p.id % 7) * 0.4).toFixed(1)}`;
  const shutter = `1/${100 + (p.id % 9) * 50}s`;
  const iso = [100, 200, 400, 800][p.id % 4];
  return `${cam} · ${lens} · ${aperture} · ${shutter} · ISO ${iso}`;
}

function renderFilters() {
  const box = $("filters"); box.innerHTML = "";
  CATEGORIES.forEach((c) => {
    const b = document.createElement("button");
    b.className = "filter-btn" + (c === activeCategory ? " active" : "");
    b.textContent = c === "all" ? "All" : c[0].toUpperCase() + c.slice(1);
    b.addEventListener("click", () => { activeCategory = c; renderFilters(); renderGallery(); });
    box.appendChild(b);
  });
}

function renderGallery() {
  const term = searchTerm.trim().toLowerCase();
  visible = PHOTOS.filter((p) =>
    (activeCategory === "all" || p.cat === activeCategory) &&
    (!term || p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term) || p.cat.includes(term)));
  gallery.innerHTML = "";
  $("emptyState").hidden = visible.length !== 0;
  $("countText").textContent = `Showing ${visible.length} of ${PHOTOS.length} photos`;
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { const img = e.target; img.src = img.dataset.src; observer.unobserve(img); } });
  }, { rootMargin: "200px" });
  visible.forEach((p, i) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.dataset.src = photoUrl(p); img.alt = p.title; img.loading = "lazy";
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3C/svg%3E";
    observer.observe(img);
    const cap = document.createElement("figcaption"); cap.textContent = p.title;
    fig.append(img, cap);
    fig.addEventListener("click", () => openLightbox(i));
    gallery.appendChild(fig);
  });
}

function openLightbox(i) {
  currentIndex = i; updateLightbox(); lightbox.hidden = false; document.body.style.overflow = "hidden";
}
function closeLightbox() { lightbox.hidden = true; document.body.style.overflow = ""; }
function updateLightbox() {
  const p = visible[currentIndex]; if (!p) return;
  const img = $("lbImage");
  img.src = photoUrl(p, 1200, 800); img.alt = p.title;
  $("lbTitle").textContent = `${p.title}  ·  ${p.cat}`;
  $("lbMeta").textContent = exifFor(p) + `  ·  Picsum #${p.id}`;
  $("lbDesc").textContent = p.desc;
  const dl = $("downloadBtn");
  dl.href = `https://picsum.photos/id/${p.id}/1600/1200`;
  dl.setAttribute("download", `${p.title.toLowerCase().replace(/\s+/g, "-")}.jpg`);
}
function step(d) { currentIndex = (currentIndex + d + visible.length) % visible.length; updateLightbox(); }

$("searchInput").addEventListener("input", (e) => { searchTerm = e.target.value; renderGallery(); });
$("shuffleBtn").addEventListener("click", () => {
  for (let i = PHOTOS.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [PHOTOS[i], PHOTOS[j]] = [PHOTOS[j], PHOTOS[i]]; }
  renderGallery();
});
$("closeBtn").addEventListener("click", closeLightbox);
$("prevBtn").addEventListener("click", () => step(-1));
$("nextBtn").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

renderFilters(); renderGallery();
