// sw.js
const CACHE_NAME = 'nihongo-v3'; // Cập nhật version cache mới

// Danh sách tất cả file cần lưu vào Cache để chạy Offline
const STATIC_FILES = [
  './',
  './index.html',
  './lessons.html',
  
  // File CSS
  './css/base.css',
  './css/index.css',
  './css/lessons.css',
  
  // File JS Logic
  './js/index.js',
  './js/lessons.js',
  
  // Component dùng chung
  './components/navbar.html',
  './components/navbar.js',
  
  // Dữ liệu từ vựng
  './data/N5/vocab.js'
];

// 1. Cài đặt Service Worker và Cache các file static
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all static files v3');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting(); // Kích hoạt ngay lập tức
});

// 2. Dọn dẹp Cache cũ khi update version mới
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Xử lý Fetch request: Network First Strategy (Ưu tiên tải code mới từ máy chủ, nếu mất mạng mới lấy trong Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Nếu tải thành công từ mạng, cập nhật luôn vào Cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Nếu mất mạng hoặc lỗi kết nối, lấy file đã lưu trong Cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});