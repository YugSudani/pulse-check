importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Service Worker for OneSignal push notifications
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Fetch handler - Skip API calls to prevent duplicate requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip API calls - let browser handle them directly
  // This prevents duplicate network requests
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/user") ||
    url.pathname.startsWith("/monitor") ||
    url.pathname.startsWith("/incident") ||
    event.request.method !== "GET"
  ) {
    return; // Don't intercept, let browser handle normally
  }

  // For HTML and JS files, use network-first to ensure latest code is loaded
  // This fixes PWA install button not working until hard refresh
  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname === "/"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response for offline use
          const responseClone = response.clone();
          caches.open("pwa-cache-v1").then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  // For other static assets (images, CSS, fonts), try cache first, then network
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
