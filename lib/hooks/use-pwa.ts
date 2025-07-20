/**
 * sonu - PWA Detection Hook
 *
 * Custom hook to detect if the app is running as an installed PWA
 * and provide PWA-specific functionality.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";

export interface PWAState {
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function usePWA(): PWAState {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    // Check if running in browser environment
    if (typeof window === "undefined") return;

    // Check if app is running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    // Check for iOS standalone mode
    const isIOSStandalone = Boolean((window.navigator as any).standalone);

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    setPwaState({
      isInstalled: isStandalone || isIOSStandalone,
      isStandalone: isStandalone || isIOSStandalone,
      isIOS,
      isAndroid,
    });

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPwaState((prev) => ({
        ...prev,
        isInstalled: e.matches || isIOSStandalone,
        isStandalone: e.matches || isIOSStandalone,
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return pwaState;
}

/**
 * Hook to detect if the app is running offline
 * and provide offline-specific functionality.
 */
export function useOfflineDetection() {
  const [isOffline, setIsOffline] = useState(false);
  const { isInstalled } = usePWA();

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return { isOffline, isPWA: isInstalled };
}
