const cacheName = 'v1';
const cacheAssets = [
    'index.html',
    'style.css',
    'index.js',
    'icons/all-in.svg',
    'icons/closeIcon.png'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');

    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files  ');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    )
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// Call fetch event

self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                // Make copy/clone of response
                const resClone = res.clone();
                // Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // Add response to cache
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request).then(res => res))
    )
})