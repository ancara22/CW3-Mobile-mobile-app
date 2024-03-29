
self.addEventListener('install', event => {
  console.log('Service worker Caching files!')
  event.waitUntil(
    caches.open('lessons-app').then(cache => {
      console.debug('Caching resources...');
      return cache.addAll([
        './index.html',
        './manifest.webmanifest',
        './img/icons/icon-192x192.png',
        './img/icons/icon-512x512.png',
        './custom-service-worker.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('lessons-app').then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

