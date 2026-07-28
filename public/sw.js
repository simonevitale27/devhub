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

// Fetch event - network first, falling back to cache (same-origin static GET only)
self.addEventListener("fetch", (event) => {
  // Never intercept non-GET requests (auth/progress writes must hit the network directly)
  if (event.request.method !== "GET") return;

  // Only cache same-origin app assets. Cross-origin GETs — PocketBase API
  // (user_progress/records, user records), fonts — must never be cached: they
  // carry per-user data o devono restare fresche.
  // Nota: Pyodide non e' piu' fra questi. Ora e' servito dal nostro dominio
  // (/pyodide/), quindi ricade nel ramo cacheabile: era proprio l'esclusione
  // cross-origin a rendere il service worker inutile quando il CDN era bloccato.
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response for caching. Con Pyodide self-hosted qui passano
        // anche ~79 MB di wasm e wheel: e' un vantaggio (Python resta usabile
        // offline dopo il primo caricamento), ma se la quota di storage si
        // esaurisce cache.put viene rifiutata. Senza catch sarebbe un rejection
        // non gestito a ogni richiesta; la pagina funziona comunque, perche' la
        // risposta di rete viene restituita a prescindere dalla cache.
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone).catch(() => {});
        });
        return response;
      })
      .catch(() =>
        // Fallback to cache if network fails; a clean network error otherwise
        caches.match(event.request).then((cached) => cached || Response.error())
      )
  );
});
