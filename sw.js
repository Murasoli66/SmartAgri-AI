// sw.js - A minimal service worker for installation.

// This event fires when the service worker is first installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // You can pre-cache assets here if needed.
  // For now, we'll just log the event.
});

// This event fires when the service worker is activated.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // This is a good place to clean up old caches.
});

// This event fires for every network request.
self.addEventListener('fetch', (event) => {
  // This service worker doesn't intercept fetch requests.
  // It allows them to pass through to the network as usual.
  // console.log('Service Worker: Fetching ', event.request.url);
});
