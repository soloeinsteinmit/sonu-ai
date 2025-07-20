"use client";

/**
 * Sonu - Outbreak Map Component
 *
 * Interactive Leaflet map for displaying disease outbreaks
 * Features:
 * - Responsive design for mobile and desktop
 * - Custom markers based on severity
 * - Popup information on marker click
 * - Smooth zoom and pan controls
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.1.0
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { OutbreakData } from "@/app/map/page";
import {
  getDiseaseMarkerInfo,
  buildCircularMarkerHtml,
} from "@/lib/utils/map-helpers";
import { MapLegend } from "@/components/map/map-legend";
import { toast } from "sonner";

/**
 * Props for OutbreakMap component
 */
interface OutbreakMapProps {
  outbreaks: OutbreakData[];
  selectedOutbreak: OutbreakData | null;
  onOutbreakSelect: (outbreak: OutbreakData) => void;
}

/**
 * Main outbreak map component
 */
export function OutbreakMap({
  outbreaks,
  selectedOutbreak,
  onOutbreakSelect,
}: OutbreakMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      try {
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        });
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
          minZoom: 6,
        }).addTo(map);

        if (window.innerWidth <= 768) {
          map.zoomControl.setPosition("bottomright");
        }

        setIsMapReady(true);
      } catch (err) {
        toast.error("Failed to load map");
        setError("Failed to load map");
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [mapRef]);

  /**
   * Update markers when outbreaks change
   */
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    outbreaks.forEach((outbreak) => {
      const diseaseInfo = getDiseaseMarkerInfo(outbreak.disease);
      const size = 20;

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: buildCircularMarkerHtml(
          diseaseInfo.color,
          diseaseInfo.icon,
          size
        ),
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([outbreak.location.lat, outbreak.location.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on("click", async () => {
        onOutbreakSelect(outbreak);
        if (!outbreak.location.name) {
          try {
            const response = await fetch(
              `/api/location?lat=${outbreak.location.lat}&lon=${outbreak.location.lng}`
            );
            const data = await response.json();
            outbreak.location.name = data.location || "Unknown";
          } catch (error) {
            toast.error("Failed to fetch location");
            outbreak.location.name = "Unknown";
          }
        }
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${
              outbreak.disease
            }</h3>
            <div><strong>Location:</strong> ${outbreak.location.name}, ${
          outbreak.location.region
        }</div>
            <div><strong>Crop:</strong> ${outbreak.crop}</div>
            <div><strong>Severity:</strong> <span style="text-transform: capitalize;">${
              outbreak.severity
            }</span></div>
            
            <div><strong>Status:</strong> <span style="text-transform: capitalize;">${
              outbreak.status
            }</span></div>
            <div><strong>Reported:</strong> ${new Date(
              outbreak.reportedDate
            ).toLocaleDateString()}</div>
          </div>
        `;
        marker
          .bindPopup(popupContent, { maxWidth: 300, className: "custom-popup" })
          .openPopup();
      });
      markersRef.current.push(marker);
    });

    if (outbreaks.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 12 });
    }
  }, [outbreaks, onOutbreakSelect]);

  /**
   * Handle selected outbreak change
   */
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedOutbreak) return;
    const map = mapInstanceRef.current;

    const selectedMarker = markersRef.current.find((marker) => {
      const markerLatLng = marker.getLatLng();
      return (
        markerLatLng.lat === selectedOutbreak.location.lat &&
        markerLatLng.lng === selectedOutbreak.location.lng
      );
    });

    if (selectedMarker) {
      map.setView(
        [selectedOutbreak.location.lat, selectedOutbreak.location.lng],
        12
      );
      selectedMarker.openPopup();
    }
  }, [selectedOutbreak]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    // Use ResizeObserver to detect container size changes
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    // Set initial view with geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng: L.LatLngTuple = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          map.setView(latlng, 13);

          // Create custom current location marker with traditional pin shape
          const currentLocationIcon = L.divIcon({
            className: "current-location-pin-wrapper",
            html: `
              <div class="current-location-pin">
                <div class="pin-body"></div>
                <div class="pin-icon">📍</div>
              </div>
            `,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
          });

          L.marker(latlng, { icon: currentLocationIcon })
            .addTo(map)
            .bindPopup("📍 You are here!")
            .openPopup();
        },
        () => {
          map.setView([7.9465, -1.0232], 7); // Default to Ghana
        }
      );
    } else {
      map.setView([7.9465, -1.0232], 7); // Default to Ghana
    }

    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, [isMapReady]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10 text-center">
        <p className="text-destructive mb-2">Failed to load map</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg bg-muted/30" />

      {/* Disease Legend */}
      {isMapReady && !error && <MapLegend outbreaks={outbreaks} />}

      {!isMapReady && !error && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 12px !important;
          line-height: 1.5;
        }
        .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </div>
  );
}
