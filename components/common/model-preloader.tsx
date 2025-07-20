"use client";

/**
 * sonu - Model Preloader Component
 *
 * This component preloads the AI model when the app starts,
 * ensuring it's available for offline use.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { createInferenceSession } from "@/lib/utils/onnx-model-helper";
import { usePWA } from "@/lib/hooks/use-pwa";

export function ModelPreloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInstalled } = usePWA();

  useEffect(() => {
    // Only preload if we're in a PWA or if we're online
    if (isInstalled || navigator.onLine) {
      preloadModel();
    }
  }, [isInstalled]);

  const preloadModel = async () => {
    // Skip if already loaded or loading
    if (isLoaded || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log("Preloading AI model...");

      // Try to create an inference session to load the model
      await createInferenceSession();

      console.log("AI model preloaded successfully");
      setIsLoaded(true);

      // Store in localStorage that we've loaded the model
      localStorage.setItem("sonu-model-preloaded", "true");
    } catch (err) {
      console.error("Failed to preload AI model:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // This component doesn't render anything visible
  return null;
}
