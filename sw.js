// CURG Diario Miccional — Service Worker v2.1
// by InnoIA · verificado CURG
const CACHE = 'curg-v2.1';
const CACHE_URLS = [
  '/paciente.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install: cache key assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      // Cache what we can, ignore failures for CDN resources
      return Promise.allSettled(CACHE_URLS.map(url => c.add(url).catch(() => {})));
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fall back to cache
self.addEventListener('fetch', e => {
  // Skip non-GET and Firebase requests (need live data)
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('firestore.googleapis.com')) return;
  if (e.request.url.includes('firebase')) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cls => {
      if (cls.length) return cls[0].focus();
      return clients.openWindow('/paciente.html');
    })
  );
});
