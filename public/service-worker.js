self.addEventListener("install", (event) => {
  console.log("📦 Service Worker installé");
  event.waitUntil(
    caches.open("zena-cache-v1").then((cache) =>
      cache.addAll(["/", "/index.html", "/favicon.png"])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
