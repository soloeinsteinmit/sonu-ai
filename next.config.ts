import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Remove autoPrerender as it's not a valid option
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
  runtimeCaching: [
    // Cache the app shell (HTML pages) with CacheFirst for offline access
    {
      urlPattern: /^https?.*\/(scan|map|$)/,
      handler: "CacheFirst",
      options: {
        cacheName: "pages-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache static assets (JS, CSS, images) with CacheFirst
    {
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache AI model files with CacheFirst (they don't change often)
    {
      urlPattern: /\/model\/.*\.onnx$/,
      handler: "CacheFirst",
      options: {
        cacheName: "ai-models",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
        },
      },
    },
    // Cache audio files with CacheFirst
    {
      urlPattern: /\/audio\/.*\.wav$/,
      handler: "CacheFirst",
      options: {
        cacheName: "audio-files",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // API calls - try network first, fallback to cache, with offline fallback
    {
      urlPattern: /^https?.*\/api\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
    // External resources (fonts, etc.) - StaleWhileRevalidate
    {
      urlPattern: /^https?:\/\/(?!.*\/(scan|map|api)).*/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "external-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest.json$/],
  fallbacks: {
    document: "/offline",
  },
};

export default isDevelopment
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: false,
      runtimeCaching: [
        // Cache the app shell (HTML pages) with CacheFirst for offline access
        {
          urlPattern: /^https?.*\/(scan|offline|$)/,
          handler: "CacheFirst",
          options: {
            cacheName: "sonu-pages-v1",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        // Cache map pages with NetworkFirst (they need fresh data but should work offline)
        {
          urlPattern: /^https?.*\/map/,
          handler: "NetworkFirst",
          options: {
            cacheName: "sonu-map-pages-v1",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            },
          },
        },
        // Cache static assets (JS, CSS, images) with CacheFirst
        {
          urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "sonu-static-v1",
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        // Cache AI model files with CacheFirst (they don't change often)
        {
          urlPattern: /\/model\/.*\.onnx$/,
          handler: "CacheFirst",
          options: {
            cacheName: "sonu-model-v1",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
            },
          },
        },
        // Cache audio files with CacheFirst
        {
          urlPattern: /\/audio\/.*\.wav$/,
          handler: "CacheFirst",
          options: {
            cacheName: "sonu-audio-v1",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        // API calls - try network first, fallback to cache
        {
          urlPattern: /^https?.*\/api\/.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "sonu-api-v1",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 5 * 60, // 5 minutes
            },
          },
        },
        // External resources (fonts, etc.) - StaleWhileRevalidate
        {
          urlPattern: /^https?:\/\/(?!.*\/(scan|map|api)).*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "sonu-external-v1",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60, // 1 day
            },
          },
        },
        // Still inside withPWA
        {
          urlPattern: /^https:\/\/(a|b|c)\.tile\.openstreetmap\.org\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "osm-tiles",
            expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
          },
        },
        // OpenStreetMap tile images - cache first
        {
          urlPattern: /^https?:\/\/(a|b|c)\.tile\.openstreetmap\.org\/.*$/,
          handler: "CacheFirst",
          options: {
            cacheName: "osm-tiles",
            expiration: {
              maxEntries: 2000,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
      ],
      buildExcludes: [/middleware-manifest.json$/],
      maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
      // @ts-expect-error - next-pwa supports fallbacks
      fallbacks: {
        document: "/offline",
        image: "/icons/offline-image.png",
      },
      // Make sure the custom offline-enhancement worker is loaded by Workbox
      // This pulls in "public/offline-worker.js" at runtime so all the extra
      // caching logic (models, WASM, custom fetch routing, etc.) becomes
      // available without having to re-implement it inside the auto-generated
      // sw.js.
      importScripts: ["/offline-worker.js"],
      additionalManifestEntries: [
        { url: "/_next/static/chunks/app/map/page-*.js", revision: null }, // glob
        { url: "/_next/static/chunks/app/offline/page-*.js", revision: null },
      ],
    })(nextConfig);
