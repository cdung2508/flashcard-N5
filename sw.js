JavaScript
const CACHE = "offline-v2";
const FILES = [
  "./",
  "./index.html",
  "./lessons.html",
  "./components/navbar.html",
  "./components/navbar.js",
  "./css/base.css",
  "./css/navbar.css",
  "./css/index.css",
  "./css/lessons.css",
  "./js/lessons.js",
  "./data/vocab-data.js"
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