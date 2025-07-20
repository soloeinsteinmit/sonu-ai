"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCurrentLocation,
  calculateDistance,
} from "@/lib/utils/location-helper";

interface NearbyOutbreakAlertProps {
  /** Distance in kilometers to trigger an alert (default: 5km) */
  radiusKm?: number;
}

/**
 * NearbyOutbreakAlert
 * -------------------
 * When mounted, this component:
 * 1. Requests the user's geolocation.
 * 2. Fetches the latest outbreaks from `/api/outbreaks`.
 * 3. If any outbreak is within `radiusKm`, it shows a toast warning.
 *
 * To avoid spamming the user, we remember the last date we showed an alert in
 * `localStorage` (key: `nearby-alert-shown-YYYY-MM-DD`). The check runs only
 * once per page load.
 */
export function NearbyOutbreakAlert({ radiusKm = 5 }: NearbyOutbreakAlertProps) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const todayKey = `nearby-alert-shown-${new Date().toISOString().slice(0, 10)}`; // e.g., 2025-07-20
    const dismissedKey = 'nearby-alerts-dismissed'; // User can permanently dismiss

    async function runCheck() {
      try {
        // Skip if user permanently dismissed alerts or already shown today
        if (localStorage.getItem(dismissedKey) === "1" || localStorage.getItem(todayKey) === "1") {
          return;
        }

        const location = await getCurrentLocation({ enableHighAccuracy: true });

        const res = await fetch("/api/outbreaks");
        if (!res.ok) return;
        const outbreaks = await res.json();

        // Only alert for outbreaks reported within the last 7 days to avoid old data spam
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentOutbreaks = outbreaks.filter((ob: any) => {
          const reportedDate = new Date(ob.reportedDate);
          return reportedDate >= sevenDaysAgo;
        });

        let nearbyCount = 0;
        let closestOutbreak = null;
        let closestDistance = Infinity;

        for (const ob of recentOutbreaks) {
          if (!ob.location) continue;
          const dist = calculateDistance(
            location.latitude,
            location.longitude,
            ob.location.lat,
            ob.location.lng
          );
          if (dist <= radiusKm) {
            nearbyCount++;
            if (dist < closestDistance) {
              closestDistance = dist;
              closestOutbreak = ob;
            }
          }
        }

        // Show alert only if there are nearby outbreaks
        if (nearbyCount > 0 && closestOutbreak) {
          const message = nearbyCount === 1
            ? `Alert: ${closestOutbreak.disease} outbreak detected ${closestDistance.toFixed(1)}km away in ${closestOutbreak.location.region}. Stay vigilant!`
            : `Alert: ${nearbyCount} outbreaks detected nearby (closest: ${closestOutbreak.disease} at ${closestDistance.toFixed(1)}km). Stay vigilant!`;

          toast.warning(message, {
            duration: 8000,
            action: {
              label: "Don't show again",
              onClick: () => {
                localStorage.setItem(dismissedKey, "1");
                toast.success("Nearby outbreak alerts disabled");
              }
            }
          });
          localStorage.setItem(todayKey, "1");
        }
      } catch (err) {
        // Silently fail (user may deny location permission, etc.)
      } finally {
        setChecked(true);
      }
    }

    if (!checked && typeof window !== "undefined") {
      runCheck();
    }
  }, [checked, radiusKm]);

  return null; // This component renders nothing visible
} 