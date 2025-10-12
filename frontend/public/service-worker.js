// Basic Service Worker for QUAlibrate PWA
// Provides installability without offline functionality

const CACHE_NAME = 'qualibrate-basic-v4';

// Minimal service worker for PWA installability
self.addEventListener('install', (event) => {
  console.log('[SW] Service worker installing for PWA installability');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Minimal fetch handler - just passes through all requests
self.addEventListener('fetch', (event) => {
  // Let all requests go through to the network normally
  // This ensures your app works exactly as before, just with PWA install capability
  return;
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});