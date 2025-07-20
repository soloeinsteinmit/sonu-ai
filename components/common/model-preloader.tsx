"use client";

/**
 * sonu - AI Model Preloader Component
 *
 * Preloads the ONNX model for offline usage and provides
 * loading status to users.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useOffline } from "@/lib/hooks/use-offline";

export function ModelPreloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOffline();

  useEffect(() => {
    // Check if model is already cached
    checkModelCache();

    // Preload model if online and not already cached
    if (isOnline && !isLoaded) {
      preloadModel();
    }
  }, [isOnline]);

  const checkModelCache = async () => {
    try {
      if ("caches" in window) {
        const cache = await caches.open("ml-models");
        const cachedResponse = await cache.match(
          "/model/mobilenet_mobile.onnx"
        );
        if (cachedResponse) {
          setIsLoaded(true);
          // console.log("✅ AI Model already cached and ready for offline use");
        }
      }
    } catch (error) {
      console.warn("Error checking model cache:", error);
    }
  };

  const preloadModel = async () => {
    if (isLoading || isLoaded) return;

    setIsLoading(true);
    setShowStatus(true);
    setError(null);

    try {
      // console.log("🤖 Preloading AI model for offline use...");

      const response = await fetch("/model/mobilenet_mobile.onnx", {
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.status}`);
      }

      // The service worker should cache this automatically
      setIsLoaded(true);
      // console.log("✅ AI Model cached successfully");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    } catch (error) {
      // console.error("❌ Error preloading model:", error);
      setError(error instanceof Error ? error.message : "Failed to load model");

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show anything if everything is working normally
  if (!showStatus && !error && !isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {(showStatus || isLoading || error) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-background border rounded-lg shadow-lg p-4">
            <div className="flex items-center space-x-3 z-[9999]">
              {isLoading ? (
                <>
                  <Download className="h-5 w-5 text-blue-500 animate-pulse" />
                  <div>
                    <p className="font-medium text-sm">Loading AI Model</p>
                    <p className="text-xs text-muted-foreground">
                      Preparing for offline use...
                    </p>
                  </div>
                </>
              ) : isLoaded ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Model Ready</p>
                    <p className="text-xs text-muted-foreground">
                      Disease detection works offline
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    Cached
                  </Badge>
                </>
              ) : error ? (
                <>
                  <WifiOff className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Model Load Failed</p>
                    <p className="text-xs text-muted-foreground">
                      {isOnline
                        ? "Will retry automatically"
                        : "Waiting for connection"}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {!isOnline ? "Offline" : "Error"}
                  </Badge>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
