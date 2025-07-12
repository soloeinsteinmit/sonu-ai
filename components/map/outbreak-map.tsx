"use client";

/**
 * AgriSentry AI - Outbreak Map Component
 * 
 * Interactive Leaflet map for displaying disease outbreaks
 * Features:
 * - Responsive design for mobile and desktop
 * - Custom markers based on severity
 * - Popup information on marker click
 * - Smooth zoom and pan controls
 * 
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.1.0
 */

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { OutbreakData } from "@/app/map/page";

/**
 * Props for OutbreakMap component
 */
interface OutbreakMapProps {
  outbreaks: OutbreakData[];
  selectedOutbreak: OutbreakData | null;
  onOutbreakSelect: (outbreak: OutbreakData) => void;
}

/**
 * Get marker color based on severity
 */
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "low": return "#22c55e";      // green
    case "medium": return "#eab308";   // yellow
    case "high": return "#f97316";     // orange
    case "critical": return "#ef4444"; // red
    default: return "#6b7280";         // gray
  }
};

/**
 * Get marker size based on affected area
 */
const getMarkerSize = (affectedArea: number): number => {
  if (affectedArea < 2) return 8;
  if (affectedArea < 5) return 12;
  if (affectedArea < 10) return 16;
  return 20;
};

/**
 * Main outbreak map component
 */
export function OutbreakMap({ outbreaks, selectedOutbreak, onOutbreakSelect }: OutbreakMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize Leaflet map
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });

    if (mapRef.current && !mapInstanceRef.current) {
      try {
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
          minZoom: 6,
        }).addTo(map);

        map.on('locationfound', (e: L.LocationEvent) => {
          map.setView(e.latlng, 13);
          L.marker(e.latlng).addTo(map)
            .bindPopup("You are here!").openPopup();
          L.circle(e.latlng, e.accuracy).addTo(map);
        });

        map.on('locationerror', () => {
          // If location fails, default to Ghana view
          map.setView([7.9465, -1.0232], 7);
        });

        // Request user's location
        map.locate({ setView: false }); // setView is false because we handle it in the event

        if (window.innerWidth <= 768) {
          map.zoomControl.setPosition('bottomright');
        }

      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /**
   * Update markers when outbreaks change
   */
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    outbreaks.forEach(outbreak => {
      const color = getSeverityColor(outbreak.severity);
      const size = getMarkerSize(outbreak.affectedArea);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${size * 0.7}px;
            font-weight: bold;
          ">
            ${outbreak.severity === 'critical' ? '⚠' : ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([outbreak.location.lat, outbreak.location.lng], {
        icon: customIcon,
      }).addTo(map);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${outbreak.disease}</h3>
          <div><strong>Location:</strong> ${outbreak.location.name}, ${outbreak.location.region}</div>
          <div><strong>Crop:</strong> ${outbreak.crop}</div>
          <div><strong>Severity:</strong> <span style="text-transform: capitalize;">${outbreak.severity}</span></div>
          <div><strong>Affected Area:</strong> ${outbreak.affectedArea} ha</div>
          <div><strong>Status:</strong> <span style="text-transform: capitalize;">${outbreak.status}</span></div>
          <div><strong>Reported:</strong> ${new Date(outbreak.reportedDate).toLocaleDateString()}</div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, className: 'custom-popup' });
      marker.on('click', () => onOutbreakSelect(outbreak));
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

    const selectedMarker = markersRef.current.find(marker => {
      const markerLatLng = marker.getLatLng();
      return markerLatLng.lat === selectedOutbreak.location.lat &&
             markerLatLng.lng === selectedOutbreak.location.lng;
    });

    if (selectedMarker) {
      map.setView([selectedOutbreak.location.lat, selectedOutbreak.location.lng], 12);
      selectedMarker.openPopup();
    }
  }, [selectedOutbreak]);

  /**
   * Handle map resize and initial layout stabilization
   */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleResize = () => {
      setTimeout(() => map.invalidateSize(), 100);
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 150); // For initial render

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [!isLoading]); // Rerun when loading is finished

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
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg bg-muted/30"
      />

      {isLoading && (
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