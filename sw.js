const STATIC_CACHE = 'static-cache-v1';

const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './script.js',
  './images/mainPageBackGround.webp',
  './images/startGameBackGround.webp',
  './images/androidIcon-192x192.png',
  './images/androidIcon-512x512.png',
  './images/appleIcon.png'
];

async function preCache() {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS);
}

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
    event.waitUntil(preCache());
});

async function cleanCache() {
    const keys = await caches.keys();
    const deletePromises = keys.map((key) => {
        if (key !== STATIC_CACHE) {
            return caches.delete(key);
        }
    });
    return Promise.all(deletePromises);
}

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(cleanCache());
});

async function fetchAssets(event) {
    try {
        const response = await fetch(event.request);
        return response;
    }
    catch (err) {
        const cache = await caches.open(STATIC_CACHE);
        return cache.match(event.request);
    }
}

self.addEventListener('fetch', (event) => {
    console.log('Service Worker fetched');
    event.respondWith(fetchAssets(event));
});