/**
 * AgriSentry AI - Offline Storage Utilities
 *
 * Handles offline data storage and synchronization for scan results,
 * outbreak reports, and other app data.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { ScanResult, MultipleScanResult } from "@/lib/types/disease";

const STORAGE_KEYS = {
  SCAN_RESULTS: "sonu-scan-results",
  OFFLINE_REPORTS: "sonu-offline-reports",
  USER_PREFERENCES: "sonu-user-preferences",
  CACHED_LOCATIONS: "sonu-cached-locations",
} as const;

export interface OfflineReport {
  id: string;
  latitude: number;
  longitude: number;
  disease: string;
  timestamp: string;
  synced: boolean;
}

export interface StoredScanResult extends ScanResult {
  storedAt: string;
  synced: boolean;
}

/**
 * Save scan result to local storage
 */
export function saveScanResultOffline(result: ScanResult): void {
  try {
    const storedResult: StoredScanResult = {
      ...result,
      storedAt: new Date().toISOString(),
      synced: false,
    };

    const existingResults = getScanResultsOffline();
    existingResults.unshift(storedResult); // Add to beginning

    // Keep only last 50 results to prevent storage bloat
    const limitedResults = existingResults.slice(0, 50);

    localStorage.setItem(
      STORAGE_KEYS.SCAN_RESULTS,
      JSON.stringify(limitedResults)
    );
  } catch (error) {
    console.warn("Failed to save scan result offline:", error);
  }
}

/**
 * Get all stored scan results
 */
export function getScanResultsOffline(): StoredScanResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SCAN_RESULTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load scan results from storage:", error);
    return [];
  }
}

/**
 * Save outbreak report for offline sync
 */
export function saveOutbreakReportOffline(
  latitude: number,
  longitude: number,
  disease: string
): string {
  try {
    const report: OfflineReport = {
      id: Date.now().toString(),
      latitude,
      longitude,
      disease,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    const existingReports = getOfflineReports();
    existingReports.push(report);

    localStorage.setItem(
      STORAGE_KEYS.OFFLINE_REPORTS,
      JSON.stringify(existingReports)
    );
    return report.id;
  } catch (error) {
    console.warn("Failed to save outbreak report offline:", error);
    throw error;
  }
}

/**
 * Get all unsynced outbreak reports
 */
export function getOfflineReports(): OfflineReport[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_REPORTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load offline reports:", error);
    return [];
  }
}

/**
 * Mark outbreak report as synced
 */
export function markReportAsSynced(reportId: string): void {
  try {
    const reports = getOfflineReports();
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, synced: true } : report
    );

    localStorage.setItem(
      STORAGE_KEYS.OFFLINE_REPORTS,
      JSON.stringify(updatedReports)
    );
  } catch (error) {
    console.warn("Failed to mark report as synced:", error);
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  scanResults: number;
  offlineReports: number;
  totalSize: string;
} {
  try {
    const scanResults = getScanResultsOffline().length;
    const offlineReports = getOfflineReports().length;

    // Estimate storage size
    let totalSize = 0;
    for (const key in STORAGE_KEYS) {
      const item = localStorage.getItem(
        STORAGE_KEYS[key as keyof typeof STORAGE_KEYS]
      );
      if (item) {
        totalSize += new Blob([item]).size;
      }
    }

    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    return {
      scanResults,
      offlineReports,
      totalSize: `${sizeInMB} MB`,
    };
  } catch (error) {
    console.warn("Failed to calculate storage stats:", error);
    return {
      scanResults: 0,
      offlineReports: 0,
      totalSize: "0 MB",
    };
  }
}

/**
 * Clear old data to free up storage
 */
export function clearOldData(daysToKeep: number = 30): void {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Clear old scan results
    const scanResults = getScanResultsOffline();
    const recentScanResults = scanResults.filter(
      (result) => new Date(result.storedAt) > cutoffDate
    );
    localStorage.setItem(
      STORAGE_KEYS.SCAN_RESULTS,
      JSON.stringify(recentScanResults)
    );

    // Clear synced reports older than cutoff
    const reports = getOfflineReports();
    const recentReports = reports.filter(
      (report) => !report.synced || new Date(report.timestamp) > cutoffDate
    );
    localStorage.setItem(
      STORAGE_KEYS.OFFLINE_REPORTS,
      JSON.stringify(recentReports)
    );
  } catch (error) {
    console.warn("Failed to clear old data:", error);
  }
}

/**
 * Check if we're running in offline mode
 */
export function isOfflineMode(): boolean {
  return !navigator.onLine;
}

/**
 * Sync offline data when connection is restored
 */
export async function syncOfflineData(): Promise<{
  success: boolean;
  syncedReports: number;
  errors: string[];
}> {
  if (isOfflineMode()) {
    return { success: false, syncedReports: 0, errors: ["Still offline"] };
  }

  const reports = getOfflineReports().filter((r) => !r.synced);
  const errors: string[] = [];
  let syncedCount = 0;

  for (const report of reports) {
    try {
      const response = await fetch("/api/report-outbreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: report.latitude,
          longitude: report.longitude,
          disease: report.disease,
        }),
      });

      if (response.ok) {
        markReportAsSynced(report.id);
        syncedCount++;
      } else {
        errors.push(
          `Failed to sync report ${report.id}: HTTP ${response.status}`
        );
      }
    } catch (error) {
      errors.push(`Failed to sync report ${report.id}: ${error}`);
    }
  }

  return {
    success: errors.length === 0,
    syncedReports: syncedCount,
    errors,
  };
}
