JavaScript
const CACHE = "offline-v1";
const FILES = [
  "/flashcard-N5/",
  "/flashcard-N5/index.html",
  "/flashcard-N5/lessons.html",
  "/flashcard-N5/base.css",
  "/flashcard-N5/index.css",
  "/flashcard-N5/lessons.css",
  "/flashcard-N5/index.js",
  "/flashcard-N5/lessons.js"
];

// test
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});