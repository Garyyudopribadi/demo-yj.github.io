const CACHE_NAME = "yongjin-v3"
const urlsToCache = [
  "/",
  "/events",
  "/careers",
  "/contact",
  "/internal",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell")
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error("Cache install failed:", error)
      }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and non-http requests
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }

        // Fetch from network
        return fetch(event.request).catch(() => {
          // If network fails and it's a navigation request, show offline page
          if (event.request.destination === "document") {
            return caches.match("/offline")
          }
        })
      })
      .catch((error) => {
        console.error("Fetch failed:", error)
        // Return offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/offline")
        }
      }),
  )
})
