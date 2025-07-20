/**
 * sonu - Custom Offline Worker
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
  "/offline",
  "/scan",
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-192x192.png",
  "/icons/maskable-512x512.png",
  "/icons/offline-image.png",
];

// Model files to cache
const MODEL_FILES = ["/model/mobilenet_mobile.onnx"];

// WASM files needed for ONNX runtime
const WASM_FILES = [
  "/_next/static/media/ort-wasm-simd-threaded.jsep.09e91cb9.wasm",
  "/_next/static/media/ort.bundle.min.d9de45e6.mjs",
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("Service worker installing...");

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Caching critical static resources");
        return cache.addAll(CRITICAL_RESOURCES);
      }),

      // Pre-cache the AI models
      caches.open(MODEL_CACHE).then(async (cache) => {
        console.log("Pre-caching AI models");

        // Try to cache each model file
        const modelPromises = MODEL_FILES.map(async (modelFile) => {
          try {
            console.log(`Caching model: ${modelFile}`);
            await cache.add(new Request(modelFile, { cache: "no-store" }));
            console.log(`Successfully cached: ${modelFile}`);
            return true;
          } catch (error) {
            console.error(`Failed to cache model ${modelFile}:`, error);
            return false;
          }
        });

        return Promise.all(modelPromises);
      }),

      // Pre-cache WASM files needed for ONNX runtime
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log("Pre-caching WASM files");

        const wasmPromises = WASM_FILES.map(async (wasmFile) => {
          try {
            console.log(`Caching WASM file: ${wasmFile}`);
            await cache.add(new Request(wasmFile, { cache: "no-store" }));
            console.log(`Successfully cached: ${wasmFile}`);
            return true;
          } catch (error) {
            console.error(`Failed to cache WASM file ${wasmFile}:`, error);
            return false;
          }
        });

        return Promise.all(wasmPromises);
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
    console.log(`Handling model request: ${url.pathname}`);
    const modelCache = await caches.open(MODEL_CACHE);
    const cachedResponse = await modelCache.match(request);

    if (cachedResponse) {
      console.log(`Serving model from cache: ${url.pathname}`);
      return cachedResponse;
    }

    // If not in cache, try both model files
    for (const modelPath of ["/model/mobilenet_mobile.onnx"]) {
      try {
        // Check if we have this alternative model in cache
        const altModelRequest = new Request(modelPath);
        const altCachedResponse = await modelCache.match(altModelRequest);

        if (altCachedResponse) {
          console.log(`Serving alternative model from cache: ${modelPath}`);
          return altCachedResponse;
        }
      } catch (err) {
        console.warn(`Failed to check alternative model: ${modelPath}`, err);
      }
    }

    // If no cached models found, try network
    try {
      console.log(`Fetching model from network: ${url.pathname}`);
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        console.log(`Caching model from network: ${url.pathname}`);
        modelCache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Failed to fetch model:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to load model",
          message:
            "Please ensure you've used the app online at least once to cache the model.",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Handle WASM files needed for ONNX runtime
  if (
    url.pathname.includes("ort-wasm") ||
    url.pathname.includes("ort.bundle")
  ) {
    console.log(`Handling WASM request: ${url.pathname}`);
    const staticCache = await caches.open(STATIC_CACHE);
    const cachedResponse = await staticCache.match(request);

    if (cachedResponse) {
      console.log(`Serving WASM from cache: ${url.pathname}`);
      return cachedResponse;
    }

    try {
      console.log(`Fetching WASM from network: ${url.pathname}`);
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        console.log(`Caching WASM from network: ${url.pathname}`);
        staticCache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Failed to fetch WASM file:", error);
      return new Response("Failed to load WASM runtime", { status: 503 });
    }
  }

  // Handle scan page with cache-first strategy
  if (url.pathname === "/scan" || url.pathname === "/scan/") {
    console.log("Handling scan page request");
    const pageCache = await caches.open(PAGES_CACHE);
    const cachedResponse = await pageCache.match(request);

    if (cachedResponse) {
      console.log("Serving scan page from cache");
      return cachedResponse;
    }

    try {
      console.log("Fetching scan page from network");
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        console.log("Caching scan page from network");
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

  // Handle home page
  if (url.pathname === "/" || url.pathname === "") {
    console.log("Handling home page request");
    const pageCache = await caches.open(PAGES_CACHE);
    const cachedResponse = await pageCache.match(request);

    if (cachedResponse) {
      console.log("Serving home page from cache");
      return cachedResponse;
    }

    try {
      console.log("Fetching home page from network");
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        console.log("Caching home page from network");
        pageCache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Failed to fetch home page:", error);
      // Return offline page if home page isn't cached
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

// Add a global fetch handler
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Handle the request with our custom handler
  event.respondWith(
    (async () => {
      // Try our custom handler first
      const customResponse = await handleCustomFetch(request);
      if (customResponse) {
        return customResponse;
      }

      // If custom handler didn't handle it, try the cache
      const cache = await caches.open(STATIC_CACHE);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, try the network
      try {
        const networkResponse = await fetch(request);

        // Cache successful responses for static assets
        if (
          networkResponse.ok &&
          (request.url.match(/\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/) ||
            request.url.includes("/model/") ||
            request.url.includes("/audio/"))
        ) {
          const clonedResponse = networkResponse.clone();
          cache.put(request, clonedResponse);
        }

        return networkResponse;
      } catch (error) {
        // If network fails and it's a page request, show offline page
        if (request.mode === "navigate") {
          const offlineResponse = await caches.match("/offline");
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // For other resources, return a simple error response
        return new Response("Network error happened", {
          status: 408,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});

// Notify the main thread that the offline worker is ready
self.postMessage({ type: "OFFLINE_WORKER_READY" });
