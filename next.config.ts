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
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
  reloadOnOnline: false,
  cacheStartUrl: true,
  cacheOnFrontEndNav: true,
  dynamicStartUrl: false,
  buildExcludes: [/middleware-manifest\.json$/],
  // Force new service worker with timestamp
  additionalManifestEntries: [
    {
      url: '/_offline',
      revision: Date.now().toString(),
    },
  ],
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/localhost:3000\/.*/,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "sonu-pages-v3-" + Date.now(),
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "sonu-assets-v3-" + Date.now(),
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
  fallbacks: {
    document: "/offline",
  },
  maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
};

export default withPWA(pwaConfig)(nextConfig);
