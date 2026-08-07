// sw.js
const CACHE_NAME = 'nihongo-v2'; // Đổi version cache để trình duyệt cập nhật lại

// Danh sách tất cả file cần lưu vào Cache để chạy Offline
const STATIC_FILES = [
  './',
  './index.html',
  './lessons.html',
  
  // File CSS
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
      console.log('[Service Worker] Caching all static files');
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

// 3. Xử lý Fetch request (Cache First Strategy - Lấy từ cache trước, nếu không có mới gọi mạng)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Tùy chọn: Tự động lưu bổ sung các tài nguyên mới gọi vào cache
        return networkResponse;
      });
    }).catch(() => {
      // Trả về trang chủ/fallback nếu mất mạng hoàn toàn và không có trong cache
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});