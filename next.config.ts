import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  register: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB for large model files
    additionalManifestEntries: [
      { url: "/", revision: null },
      { url: "/scan", revision: null },
      { url: "/map", revision: null },
      { url: "/offline", revision: null },
      // Audio files for offline farmer descriptions
      { url: "/audio/Cashew_anthracnose.wav", revision: null },
      { url: "/audio/Cashew_gumosis.wav", revision: null },
      { url: "/audio/Cashew_healthy.wav", revision: null },
      { url: "/audio/Cashew_leaf_miner.wav", revision: null },
      { url: "/audio/Cashew_red_rust.wav", revision: null },
      { url: "/audio/Cassava_bacterial_blight.wav", revision: null },
      { url: "/audio/Cassava_brown_spot.wav", revision: null },
      { url: "/audio/Cassava_green_mite.wav", revision: null },
      { url: "/audio/Cassava_healthy.wav", revision: null },
      { url: "/audio/Cassava_mosaic.wav", revision: null },
      { url: "/audio/Maize_fall_armyworm.wav", revision: null },
      { url: "/audio/Maize_grasshopper.wav", revision: null },
      { url: "/audio/Maize_healthy.wav", revision: null },
      { url: "/audio/Maize_leaf_beetle.wav", revision: null },
      { url: "/audio/Maize_leaf_blight.wav", revision: null },
      { url: "/audio/Maize_leaf_spot.wav", revision: null },
      { url: "/audio/Maize_streak_virus.wav", revision: null },
      { url: "/audio/Tomato_healthy.wav", revision: null },
      { url: "/audio/Tomato_leaf_blight.wav", revision: null },
      { url: "/audio/Tomato_leaf_curl.wav", revision: null },
      { url: "/audio/Tomato_septoria_leaf_spot.wav", revision: null },
      { url: "/audio/Tomato_verticulium_wilt.wav", revision: null },
    ],
    runtimeCaching: [
      {
        urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /^https?.*\.(wav|mp3|ogg|m4a|aac)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "audio-files",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /^https?.*\.(js|css|woff2?|woff|ttf)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /^https?.*\.onnx$/,
        handler: "CacheFirst",
        options: {
          cacheName: "ml-models",
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: ({ request }) => request.destination === "document",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          networkTimeoutSeconds: 3,
        },
      },
      {
        urlPattern: /\/api\/.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60, // 5 minutes
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
    navigateFallback: "/offline",
    navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
  },
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
