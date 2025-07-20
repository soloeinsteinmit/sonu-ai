# PWA Setup for Sonu - Crop Disease Detection

## Overview

This application is configured as a Progressive Web App (PWA) with full offline functionality, including:

- Offline disease detection using AI models
- Cached pages and resources
- Offline report storage and synchronization
- Install prompt for mobile devices

## Current Configuration

### PWA Package

- **Package**: `@ducanh2912/next-pwa` (latest version compatible with Next.js 15)
- **Service Worker**: Auto-generated at `/public/sw.js`
- **Offline Fallback**: `/offline` page

### Caching Strategies

1. **Images**: CacheFirst (30 days, 100 entries max)
2. **Static Resources**: StaleWhileRevalidate (7 days, 100 entries max)
3. **ML Models**: CacheFirst (30 days, 5 entries max)
4. **API Calls**: NetworkFirst with 10s timeout (5 minutes cache, 50 entries max)

### Offline Features

- ✅ Disease scanning works completely offline
- ✅ Reports saved locally when offline
- ✅ Auto-sync when back online
- ✅ Offline indicator in UI
- ✅ Fallback pages for network failures

## Testing Offline Functionality

### 1. Build and Start Production Server

```bash
npm run build
npm start
```

### 2. Test Offline Mode

1. Open your app in Chrome/Edge at `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to **Application** > **Service Workers**
4. Verify service worker is registered and running
5. Go to **Network** tab and check "Offline" checkbox
6. Navigate through the app - it should work offline!

### 3. Test PWA Installation

1. Open the app in a mobile browser or Chrome desktop
2. Look for the install prompt (should appear after 3 seconds)
3. Click "Install Now" to install as PWA
4. Test the installed app

### 4. Test Offline Disease Detection

1. Go to `/scan` page while online
2. Wait for AI model to load (check console)
3. Go offline (Network tab > Offline)
4. Take/upload a photo - should still work!
5. Reports will be saved locally and sync when back online

## Troubleshooting

### Service Worker Not Registering

- Clear browser cache and reload
- Check console for errors
- Ensure you're on production build (`npm start`, not `npm run dev`)

### Offline Pages Not Working

- Verify service worker is active in DevTools
- Check Network tab shows service worker intercepting requests
- Clear cache and reload to get fresh service worker

### Model Not Loading Offline

- Visit `/scan` page while online first to cache the model
- Check Application > Cache Storage for "ml-models" cache
- Model file is 21MB - ensure good connection for initial load

## Advanced Configuration

### Customizing Cache Strategies

Edit `next.config.ts` to modify caching behavior:

```typescript
runtimeCaching: [
  {
    urlPattern: /^https?.*\.onnx$/,
    handler: "CacheFirst", // Change to "NetworkFirst" for always fresh models
    options: {
      cacheName: "ml-models",
      expiration: {
        maxEntries: 5,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Adjust cache duration
      },
    },
  },
];
```

### Adding New Offline Routes

Update the `fallbacks` configuration in `next.config.ts`:

```typescript
fallbacks: {
  document: "/offline",
  image: "/icons/offline-image.png", // Fallback for images
  audio: "/audio/offline-sound.mp3", // Fallback for audio
}
```

## Deployment Notes

### Production Checklist

- ✅ Service worker generated correctly
- ✅ Manifest.json is valid
- ✅ Icons are properly sized and cached
- ✅ Offline fallback pages exist
- ✅ Critical resources are precached
- ✅ HTTPS enabled (required for PWA)

### Performance Optimizations

- Large files (>21MB) are not precached automatically
- Model files cached on first use
- Images and static assets cached aggressively
- API responses cached with network-first strategy

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Test offline in DevTools:
# 1. F12 > Application > Service Workers (verify registered)
# 2. Network > Offline checkbox
# 3. Navigate app - should work offline!
```

Your PWA is now ready for your hackathon submission! 🚀
