"use client";

/**
 * sonu - Offline Error Handler Component
 *
 * This component catches and handles errors that occur during offline operation,
 * providing user-friendly error messages and recovery options.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOffline } from "@/lib/hooks/use-offline";

interface OfflineErrorHandlerProps {
  error: string;
  onRetry: () => void;
}

export function OfflineErrorHandler({
  error,
  onRetry,
}: OfflineErrorHandlerProps) {
  const { isOffline } = useOffline();
  const [errorType, setErrorType] = useState<
    "model" | "network" | "permission" | "unknown"
  >("unknown");

  useEffect(() => {
    // Determine error type based on error message
    if (
      error.includes("model") ||
      error.includes("ONNX") ||
      error.includes("inference")
    ) {
      setErrorType("model");
    } else if (
      error.includes("network") ||
      error.includes("fetch") ||
      error.includes("connection")
    ) {
      setErrorType("network");
    } else if (
      error.includes("permission") ||
      error.includes("access") ||
      error.includes("denied")
    ) {
      setErrorType("permission");
    }
  }, [error]);

  const getErrorMessage = () => {
    if (isOffline) {
      switch (errorType) {
        case "model":
          return "The AI model couldn't be loaded in offline mode. This might happen if you haven't used the app online first to cache the model.";
        case "network":
          return "A network resource is needed but you're currently offline. Some features may be limited.";
        case "permission":
          return "The app needs permission to access certain features, even in offline mode.";
        default:
          return "An error occurred while operating in offline mode. Some features may be limited.";
      }
    } else {
      switch (errorType) {
        case "model":
          return "Failed to load the AI model. This could be due to a temporary issue.";
        case "network":
          return "A network error occurred. Please check your connection.";
        case "permission":
          return "The app needs permission to access certain features.";
        default:
          return "An unexpected error occurred. Please try again.";
      }
    }
  };

  const getErrorSolution = () => {
    if (isOffline) {
      switch (errorType) {
        case "model":
          return "Connect to the internet once to download the model, then you can use it offline.";
        case "network":
          return "This feature requires internet access. Try again when you're back online.";
        case "permission":
          return "Please grant the necessary permissions and try again.";
        default:
          return "Try restarting the app or connecting to the internet.";
      }
    } else {
      return "Try refreshing the page or restarting the app.";
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            {isOffline ? (
              <WifiOff className="h-5 w-5 text-red-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-red-700">
              {isOffline ? "Offline Error" : "Error"}
            </h3>
            <p className="text-sm text-red-600 mt-1">{getErrorMessage()}</p>
            <p className="text-xs text-red-500 mt-2">{getErrorSolution()}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
