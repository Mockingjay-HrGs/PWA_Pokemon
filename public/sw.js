const CACHE_VERSION = "v3";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
                    .map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);
    if (req.method !== "GET") return;

    if (url.pathname.startsWith("/assets/")) {
        event.respondWith(cacheFirst(req, STATIC_CACHE));
        return;
    }

    if (url.hostname.includes("pokeapi.co")) {
        event.respondWith(networkFirst(req, RUNTIME_CACHE));
        return;
    }

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).catch(() => caches.match("/index.html"))
        );
        return;
    }

    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
});

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
}

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(request);
        cache.put(request, fresh.clone());
        return fresh;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        // fallback minimal
        return new Response(JSON.stringify({ offline: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((fresh) => {
            cache.put(request, fresh.clone());
            return fresh;
        })
        .catch(() => null);

    return cached || (await networkPromise) || fetch(request);
}
