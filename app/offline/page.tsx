"use client";

/**
 * sonu - Offline Fallback Page
 *
 * Displayed when the user is offline and tries to access a page
 * that hasn't been cached yet.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { WifiOff, ArrowRight, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-orange-100 p-4 rounded-full">
            <WifiOff className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-foreground">
            You're offline
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {isOnline
              ? "Your connection has been restored! Redirecting..."
              : "This page isn't available offline"}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium">Available offline features:</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Disease Detection</p>
                <p className="text-sm text-muted-foreground">
                  Scan plants for diseases even without internet
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Offline Reporting</p>
                <p className="text-sm text-muted-foreground">
                  Save reports locally and sync when back online
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {isOnline ? (
            <Button asChild className="w-full">
              <Link href="/">
                Return to Home <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link href="/scan">
                  Go to Disease Scanner <Camera className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Disease detection works offline. Your device will store results
                until you're back online.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
