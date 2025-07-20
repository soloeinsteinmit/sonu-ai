# PWA Setup Guide for sonu

This guide will help you set up the Progressive Web App (PWA) functionality for proper Android and iOS installation.

## Offline-First PWA

This PWA is configured to be offline-first. The `next.config.ts` uses `next-pwa` to implement a `CacheFirst` strategy for all assets.

### Key Features:
- **Offline Availability**: Once the app is loaded, it is fully functional without an internet connection.
- **Cache-First Strategy**: All pages and assets are served from the cache first, ensuring fast load times and offline access.
- **Custom Offline Page**: A fallback page (`/offline`) is displayed if a user tries to access a non-cached page while offline.

## Quick Setup

### 1. Install Dependencies
Ensure you have all the necessary packages installed:
```bash
npm install --legacy-peer-deps
```

### 2. Run the Development Server
For local testing, run the development server:
```bash
npm run dev
```

### 3. Test PWA Installation

#### On Android:
1. Open the app in Chrome.
2. Look for the "Install App" prompt or tap the menu (⋮).
3. Select "Add to Home screen".
4. The app should install as a standalone PWA.

#### On iOS:
1. Open Safari (not Chrome).
2. Tap the share button.
3. Select "Add to Home Screen".
4. The app should install correctly.

## PWA Configuration

### `next.config.ts`
The PWA configuration is handled in `next.config.ts` using `next-pwa`. The `runtimeCaching` is configured with a `CacheFirst` strategy.

### `manifest.json`
The `public/manifest.json` file is configured with the necessary properties for the PWA to be installable, including `name`, `short_name`, `icons`, and `start_url`.

## Troubleshooting

### Android/iOS Installation Issues
1. **App opens in browser instead of standalone**:
   - Check that `display: "standalone"` is set in `manifest.json`.
   - Ensure `start_url` is correct (`/`).

2. **Install prompt not showing**:
   - Ensure you are using HTTPS (required for PWAs).
   - Check the browser console for any service worker errors.

### Offline Issues
1. **App not working offline**:
   - Verify that the service worker is registered and running.
   - Check the cache storage in your browser's developer tools to ensure assets are being cached.

## Deployment
When deploying to production, ensure that your hosting environment supports service workers and HTTPS.