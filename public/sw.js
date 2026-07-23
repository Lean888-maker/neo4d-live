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

// 4. Web Push Notification Robot Event Handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'NEO4D 实时开彩通知', body: '今晚 4D 开彩结果已发布！点击查看最新头奖号...' };
  const options = {
    body: data.body || '点击立即查看万能、多多、大马彩 7:00 PM 实时开彩结果！',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || 'https://neo4d.live' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'NEO4D 实时开彩', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || 'https://neo4d.live';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
