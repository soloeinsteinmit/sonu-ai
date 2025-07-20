/**
 * AgriSentry AI - Offline Detection Hook
 *
 * Custom hook to detect online/offline status and provide
 * offline-specific functionality.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";

export interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
}

export function useOffline(): OfflineState {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Don't reset wasOffline immediately to show "back online" messages
      setTimeout(() => setWasOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  };
}

/**
 * Hook for offline-aware data fetching
 */
export function useOfflineFetch() {
  const { isOnline } = useOffline();

  const fetchWithFallback = async (
    url: string,
    options?: RequestInit,
    fallbackData?: any
  ) => {
    if (!isOnline && fallbackData) {
      return { data: fallbackData, fromCache: true };
    }

    try {
      const response = await fetch(url, {
        ...options,
        // Add timeout for offline detection
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, fromCache: false };
    } catch (error) {
      if (fallbackData) {
        return { data: fallbackData, fromCache: true };
      }
      throw error;
    }
  };

  return { fetchWithFallback, isOnline };
}
