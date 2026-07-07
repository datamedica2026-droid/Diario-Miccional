// Service Worker — Diario Miccional v2.0
// Estrategia: Network First con fallback a cache
// Esto permite que la app funcione aunque haya mala señal,
// y se actualiza automáticamente cada vez que subes cambios a Vercel.

const CACHE_NAME = 'diario-miccional-v2';
const ASSETS_TO_CACHE = [
  '/paciente.html',
  '/medico.html',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js'
];

// Instalación: guarda los recursos principales en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Si algún asset falla, continúa igual
      });
    })
  );
  self.skipWaiting();
});

// Activación: limpia cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network First — intenta la red, si falla usa caché
self.addEventListener('fetch', event => {
  // Solo intercepta GET, no Firebase ni APIs externas de datos
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  // No interceptar Firebase (datos en tiempo real siempre van directo)
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis.com') && url.pathname.includes('/v1/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda en caché la respuesta más reciente
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sin red: usa caché
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Si es una navegación y no hay caché, devuelve paciente.html
          if (event.request.mode === 'navigate') {
            return caches.match('/paciente.html');
          }
        });
      })
  );
});
