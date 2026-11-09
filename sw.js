// Bewaart de app zodat hij ook zonder internet opent. Verhoog het versienummer bij een update.
const CACHE = "boekscanner-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png",
  "jspdf.umd.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // eerst internet (zodat updates doorkomen), anders de opgeslagen versie
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
