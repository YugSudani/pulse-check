importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Basic PWA functionality
self.addEventListener('install', (event) => {
  //console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  //console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Optional: Add basic caching for offline support
const CACHE_NAME = 'pulse-check-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});