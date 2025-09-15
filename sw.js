const STATIC_CACHE = 'static-cache-v1';

const STATIC_ASSETS = [
  'index.html',
  '/style.css',
  '/script.js',
  '/images/mainPageBackGround.webp',
  '/images/startGameBackGround.webp',
  '/images/siteIcon.ico',
  '/images/androidIcon-192x192.png',
  '/images/androidIcon-512x512.png',
  '/images/appleIcon.png',
];

async function preCache() {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS).catch(err => console.error('Failed to pre-cache assets:', err));
}

self.addEventListener('install', (event) => {
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
    event.waitUntil(cleanCache());
    self.clients.claim();
});

async function fetchAssets(event) {
    try {
        const networkResponse = await fetch(event.request);
        if (event.request.method === 'GET' && new URL(event.request.url).origin === self.location.origin) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(event.request, networkResponse.clone()).catch(() => {});
        }
        return networkResponse;
    } catch (err) {
        const cache = await caches.open(STATIC_CACHE);

        const cachedExact = await cache.match(event.request);
        if (cachedExact) return cachedExact;

        const url = new URL(event.request.url);
        const tryPaths = [
            url.pathname,
            url.pathname.replace(/^\//, ''),
            '/index.html',
            '/'
        ];
        for (const p of tryPaths) {
            const m = await cache.match(p);
            if (m) return m;
        }

        const accept = event.request.headers.get('accept') || '';
        if (event.request.mode === 'navigate' || accept.includes('text/html')) {
            const html = await cache.match('/index.html') || await cache.match('/'); 
            if (html) return html;
        }

        return new Response('Service Unavailable (offline)', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

self.addEventListener('fetch', (event) => {
    event.respondWith(fetchAssets(event));
});