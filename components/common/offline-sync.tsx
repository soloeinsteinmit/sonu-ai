"use client";

/**
 * sonu - Offline Sync Component
 *
 * Handles automatic synchronization of offline data when
 * the user comes back online.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOffline } from "@/lib/hooks/use-offline";
import {
  syncOfflineData,
  getOfflineReports,
} from "@/lib/utils/offline-storage";
import { toast } from "sonner";

export function OfflineSync() {
  const { isOnline, wasOffline } = useOffline();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [pendingReports, setPendingReports] = useState(0);

  // Check for pending reports when component mounts or comes online
  useEffect(() => {
    const checkPendingReports = () => {
      const reports = getOfflineReports().filter((r) => !r.synced);
      setPendingReports(reports.length);

      // Show sync prompt if we have pending reports and just came online
      if (isOnline && wasOffline && reports.length > 0) {
        setShowSyncPrompt(true);
      }
    };

    checkPendingReports();

    // Check periodically for pending reports
    const interval = setInterval(checkPendingReports, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, wasOffline]);

  const handleSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }

    setIsSyncing(true);

    try {
      const result = await syncOfflineData();

      if (result.success) {
        toast.success(`Successfully synced ${result.syncedReports} reports`);
        setPendingReports(0);
        setShowSyncPrompt(false);
      } else {
        toast.error(`Sync completed with ${result.errors.length} errors`);
        console.warn("Sync errors:", result.errors);
      }
    } catch (error) {
      toast.error("Sync failed. Please try again later.");
      // console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const dismissSyncPrompt = () => {
    setShowSyncPrompt(false);
  };

  // Don't show anything if no pending reports
  if (pendingReports === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {showSyncPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-16 left-4 right-4 z-40 max-w-md mx-auto"
        >
          <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span className="font-medium">Sync Available</span>
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {pendingReports} pending
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissSyncPrompt}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm opacity-90 mb-3">
              You have {pendingReports} outbreak report
              {pendingReports !== 1 ? "s" : ""} saved offline. Sync now to share
              with the community.
            </p>

            <div className="flex space-x-2">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-white text-blue-500 hover:bg-gray-100 flex-1"
                size="sm"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>

              <Button
                onClick={dismissSyncPrompt}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
