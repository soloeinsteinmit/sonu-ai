# PWA Setup Guide for AgriSentry AI

This guide will help you set up the Progressive Web App (PWA) functionality for proper Android installation.

## Current Issues Fixed

- ✅ Added proper service worker registration
- ✅ Added PWA install prompt for Android users
- ✅ Updated manifest.json with Android-specific requirements
- ✅ Added missing icon files
- ✅ Ensured proper PWA criteria compliance

## Quick Setup

### 1. Generate Missing Icons

You have three options:

#### Option A: Use Sharp (Recommended)
```bash
npm install -g sharp
npm run generate-icons
```

#### Option B: Use ImageMagick (If Installed)
```powershell
# Windows
.\scripts\create-icons.ps1

# Linux/Mac
./scripts/create-icons.sh
```

#### Option C: Manual Download
1. Open `public/generate-icons.html` in your browser
2. Right-click and save each generated icon
3. Place them in the `public/icons/` directory

### 2. Required Icons

After generation, ensure these files exist:
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/icons/maskable-192x192.png`
- `public/icons/maskable-512x512.png`

### 3. Test PWA Installation

#### On Android:
1. Open the app in Chrome
2. Look for the "Install App" prompt or tap the menu (⋮) 
3. Select "Add to Home screen"
4. The app should install as a standalone PWA

#### On iOS:
1. Open Safari (not Chrome)
2. Tap the share button
3. Select "Add to Home Screen"
4. The app should install correctly

## PWA Features Added

### Service Worker
- Automatic registration on page load
- Offline caching support
- Background sync capabilities

### Install Prompt
- Shows automatically for Android users
- Provides clear installation instructions
- Handles both accept/dismiss actions

### Manifest Updates
- Added `id` field for Android compatibility
- Added `display_override` for better Android support
- Updated icon purposes for maskable icons
- Added proper shortcuts for quick actions

## Troubleshooting

### Android Installation Issues

1. **App opens in browser instead of standalone**:
   - Check that `display: "standalone"` is set in manifest.json
   - Ensure `start_url` is correct ("/")
   - Verify all required icons exist

2. **Install prompt not showing**:
   - Ensure HTTPS is enabled (required for PWA)
   - Check browser console for service worker errors
   - Verify manifest.json is valid JSON

3. **Icons not showing**:
   - Check that icon files exist in `public/icons/`
   - Verify icon dimensions match manifest.json specifications

### Testing Checklist

- [ ] All required icons exist
- [ ] Service worker registers successfully
- [ ] Manifest loads without errors
- [ ] HTTPS is enabled (for production)
- [ ] App is installable on Android
- [ ] App opens in standalone mode

## Development Notes

### Local Testing
For local testing with HTTPS:
```bash
npm run dev:ssl
```

### Production Deployment
When deploying to production:
1. Ensure HTTPS is enabled
2. Verify all assets are served from the same origin
3. Check that the service worker scope is correct

## PWA Criteria Met

✅ **HTTPS**: Required for service workers
✅ **Service Worker**: Registers and caches assets
✅ **Web App Manifest**: Valid JSON with required fields
✅ **Icons**: Includes required sizes (192x192, 512x512)
✅ **Start URL**: Points to correct location
✅ **Display Mode**: Set to standalone
✅ **Name/Short Name**: Provided for app drawer