"use client";

/**
 * AgriSentry AI - Offline Indicator Component
 *
 * Shows the user's connection status and provides offline guidance.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOffline } from "@/lib/hooks/use-offline";

export function OfflineIndicator() {
  const { isOnline, isOffline, wasOffline } = useOffline();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);

  useEffect(() => {
    // Always show banner when offline (unless dismissed)
    if (isOffline && !dismissed) {
      setShowBanner(true);
    } else if (isOnline && wasOffline) {
      // Show "back online" message briefly
      setShowBanner(true);
      setDismissed(false); // Reset dismissed state
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    } else if (!isOffline) {
      setShowBanner(false);
    }
  }, [isOnline, isOffline, wasOffline, dismissed]);

  // Check if this is a PWA installation
  useEffect(() => {
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    // If offline and in PWA mode, show the banner more prominently
    if (isOffline && isPWA) {
      setDismissed(false);
      setShowBanner(true);
    }
  }, [isOffline]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    setShowOfflineGuide(false);
  };

  const toggleOfflineGuide = () => {
    setShowOfflineGuide((prev) => !prev);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            isOffline ? "bg-orange-500 text-white" : "bg-green-500 text-white"
          } shadow-lg`}
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isOffline ? (
                  <WifiOff className="h-5 w-5" />
                ) : (
                  <Wifi className="h-5 w-5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {isOffline ? "You're offline" : "Back online!"}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        isOffline
                          ? "bg-orange-600 text-white"
                          : "bg-green-600 text-white"
                      }
                    >
                      {isOffline ? "Offline Mode" : "Connected"}
                    </Badge>
                  </div>

                  <p className="text-sm opacity-90 mt-1">
                    {isOffline
                      ? "Disease detection still works! Map features need internet."
                      : "All features are now available."}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isOffline && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleOfflineGuide}
                    className="text-white hover:bg-white/20"
                  >
                    {showOfflineGuide ? "Hide Guide" : "Show Guide"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Offline Guide */}
            <AnimatePresence>
              {showOfflineGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-white/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <h3 className="font-medium mb-2">What works offline:</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Disease scanning and detection</li>
                        <li>• Viewing previous scan results</li>
                        <li>• Treatment recommendations</li>
                        <li>• Saving outbreak reports (will sync later)</li>
                      </ul>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <h3 className="font-medium mb-2">What needs internet:</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Community outbreak map</li>
                        <li>• YouTube educational videos</li>
                        <li>• Syncing outbreak reports</li>
                        <li>• App updates</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <p>
                      <strong>Tip:</strong> You can continue using the app
                      normally. Your data will be saved locally and synced when
                      you're back online.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
