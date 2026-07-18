self.addEventListener('install', (event) => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 1. Wipe absolutely EVERY cache to destroy the broken cache loop
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[ServiceWorker] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 2. Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // 3. Bypass all Service Worker caching. Force the browser to go to the network (or rely on standard Cloudflare HTTP caching).
  // This guarantees the user ALWAYS gets the live site and the middleware redirects work flawlessly.
  event.respondWith(fetch(event.request));
});
