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
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    for (const windowClient of windowClients) {
      windowClient.navigate(windowClient.url)
    }
  })
})
