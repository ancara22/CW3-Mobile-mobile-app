self.__WB_MANIFEST;

//Service
self.addEventListener('install', (event) => {
    console.log('install')
    event.waitUntil(
      caches.open('app-data')
        .then((cache) => {
            return cache.addAll(self.__WB_MANIFEST);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });