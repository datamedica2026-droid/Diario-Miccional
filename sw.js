// CURG Service Worker v2.0
const CACHE_NAME = 'curg-v2';
const URLS_TO_CACHE = ['/paciente.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ── NOTIFICATION SCHEDULING ──
// Receives messages from the main app to schedule notifications
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleDaily();
  }
});

function scheduleDaily() {
  // Check and fire notifications at right times
  // Called periodically by the app
}

// Push notifications
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cls => {
    if (cls.length) return cls[0].focus();
    return clients.openWindow('/paciente.html');
  }));
});
