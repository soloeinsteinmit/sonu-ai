/**
 * AgriSentry AI - Custom Offline Worker
 *
 * This script enhances the Next.js PWA service worker with custom offline functionality.
 * It's imported by the main service worker and provides additional caching strategies.
 */

// Cache names
const STATIC_CACHE = "sonu-static-v1";
const PAGES_CACHE = "sonu-pages-v1";
const IMAGES_CACHE = "sonu-images-v1";
const MODEL_CACHE = "sonu-model-v1";
const API_CACHE = "sonu-api-v1";

// Resources that must be cached for offline functionality
const CRITICAL_RESOURCES = [
  "/model/mobilenet_mobile.onnx",
  "/offline",
  "/scan",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Caching critical static resources");
        return cache.addAll(CRITICAL_RESOURCES);
      }),

      // Pre-cache the AI model
      caches.open(MODEL_CACHE).then((cache) => {
        console.log("Pre-caching AI model");
        return cache.add("/model/mobilenet_mobile.onnx");
      }),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any old caches that don't match our current versions
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== PAGES_CACHE &&
            cacheName !== IMAGES_CACHE &&
            cacheName !== MODEL_CACHE &&
            cacheName !== API_CACHE &&
            cacheName.startsWith("sonu-")
          ) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Custom fetch handler for specific resources
const handleCustomFetch = async (request) => {
  const url = new URL(request.url);

  // Handle model files with cache-first strategy
  if (url.pathname.includes("/model/")) {
    const modelCache = await caches.open(MODEL_CACHE);
    const cachedResponse = await modelCache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        modelCache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Failed to fetch model:", error);
      return new Response("Failed to fetch model file", { status: 503 });
    }
  }

  // Handle scan page with cache-first strategy
  if (url.pathname === "/scan" || url.pathname === "/scan/") {
    const pageCache = await caches.open(PAGES_CACHE);
    const cachedResponse = await pageCache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        pageCache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Failed to fetch scan page:", error);
      // Return offline page if scan page isn't cached
      const offlineResponse = await caches.match("/offline");
      return (
        offlineResponse || new Response("You are offline", { status: 503 })
      );
    }
  }

  // For all other requests, let the default service worker handle it
  return null;
};

// Register the custom fetch handler with the service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "REGISTER_CUSTOM_HANDLER") {
    self.customFetchHandler = handleCustomFetch;
    event.ports[0].postMessage({ registered: true });
  }
});

// Notify the main thread that the offline worker is ready
self.postMessage({ type: "OFFLINE_WORKER_READY" });
