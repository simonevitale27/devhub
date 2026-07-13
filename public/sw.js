// DevHub Service Worker
// Minimal service worker required for PWA installability

const CACHE_NAME = "devhub-v1";

// Install event - cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event - network first, falling back to cache (GET only)
self.addEventListener("fetch", (event) => {
  // Never intercept non-GET requests (Supabase auth/progress POSTs must hit the network directly)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() =>
        // Fallback to cache if network fails; a clean network error otherwise
        caches.match(event.request).then((cached) => cached || Response.error())
      )
  );
});
