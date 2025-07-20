"use client";

/**
 * sonu - Model Status Indicator
 *
 * This component shows the status of the AI model loading
 * and provides guidance for offline use.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, WifiOff, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOffline } from "@/lib/hooks/use-offline";

export function ModelStatusIndicator() {
  const { isOffline } = useOffline();
  const [modelStatus, setModelStatus] = useState<
    "unknown" | "loaded" | "not-loaded"
  >("unknown");
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check if model has been loaded before
    const modelLoaded = localStorage.getItem("sonu-model-loaded") === "true";

    // Only show indicator if offline and model not loaded
    if (isOffline && !modelLoaded) {
      setModelStatus("not-loaded");
      setShowIndicator(true);
    } else if (modelLoaded) {
      setModelStatus("loaded");
      // Briefly show success message if model is loaded
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (!showIndicator) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4"
    >
      <Card
        className={
          modelStatus === "loaded"
            ? "border-green-200 bg-green-50"
            : "border-orange-200 bg-orange-50"
        }
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-full ${
                modelStatus === "loaded" ? "bg-green-100" : "bg-orange-100"
              }`}
            >
              {modelStatus === "loaded" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-orange-600" />
              )}
            </div>

            <div className="flex-1">
              <h3
                className={`font-medium ${
                  modelStatus === "loaded"
                    ? "text-green-700"
                    : "text-orange-700"
                }`}
              >
                {modelStatus === "loaded"
                  ? "AI Model Ready"
                  : "Offline Mode Notice"}
              </h3>

              <p
                className={`text-sm mt-1 ${
                  modelStatus === "loaded"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {modelStatus === "loaded"
                  ? "The AI model is loaded and ready for offline use."
                  : "You're offline and the AI model hasn't been cached yet. Connect to the internet once to enable offline scanning."}
              </p>

              {modelStatus !== "loaded" && (
                <div className="mt-2 flex items-center">
                  <Brain className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-xs text-orange-500">
                    The app needs to download the AI model once while online
                    before it can work offline.
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
