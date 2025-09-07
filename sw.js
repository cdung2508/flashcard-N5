const CACHE = "offline-v1";
const FILES = [
  "/flashcard-N5/",
  "/flashcard-N5/index.html"
];


self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});