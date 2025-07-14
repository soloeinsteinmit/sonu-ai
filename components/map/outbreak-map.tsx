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
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    case "low":
      return "#22c55e"; // green
    case "medium":
      return "#eab308"; // yellow
    case "high":
      return "#f97316"; // orange
    case "critical":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
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
 * Get marker color and icon based on disease type
 */
const getDiseaseMarkerInfo = (
  disease: string
): { color: string; icon: string; category: string } => {
  const lowerDisease = disease.toLowerCase();

  // Cashew diseases
  if (lowerDisease.includes("cashew")) {
    if (lowerDisease.includes("anthracnose"))
      return { color: "#8B4513", icon: "🍂", category: "Cashew" };
    if (lowerDisease.includes("gummosis"))
      return { color: "#A0522D", icon: "💧", category: "Cashew" };
    if (
      lowerDisease.includes("leaf_miner") ||
      lowerDisease.includes("leaf miner")
    )
      return { color: "#CD853F", icon: "🐛", category: "Cashew" };
    if (lowerDisease.includes("red_rust") || lowerDisease.includes("red rust"))
      return { color: "#B22222", icon: "🦠", category: "Cashew" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Cashew" };
    return { color: "#8B4513", icon: "🌰", category: "Cashew" };
  }

  // Cassava diseases
  if (lowerDisease.includes("cassava")) {
    if (
      lowerDisease.includes("bacterial_blight") ||
      lowerDisease.includes("bacterial blight")
    )
      return { color: "#4169E1", icon: "🦠", category: "Cassava" };
    if (
      lowerDisease.includes("brown_streak") ||
      lowerDisease.includes("brown streak")
    )
      return { color: "#8B4513", icon: "📏", category: "Cassava" };
    if (
      lowerDisease.includes("green_mottle") ||
      lowerDisease.includes("green mottle")
    )
      return { color: "#32CD32", icon: "🟢", category: "Cassava" };
    if (lowerDisease.includes("mosaic"))
      return { color: "#FFD700", icon: "🎨", category: "Cassava" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Cassava" };
    return { color: "#DEB887", icon: "🍠", category: "Cassava" };
  }

  // Maize diseases
  if (lowerDisease.includes("maize")) {
    if (
      lowerDisease.includes("fall_armyworm") ||
      lowerDisease.includes("fall armyworm")
    )
      return { color: "#8B0000", icon: "🐛", category: "Maize" };
    if (lowerDisease.includes("grasshopper"))
      return { color: "#90EE90", icon: "🦗", category: "Maize" };
    if (
      lowerDisease.includes("leaf_beetle") ||
      lowerDisease.includes("leaf beetle")
    )
      return { color: "#FF4500", icon: "🪲", category: "Maize" };
    if (
      lowerDisease.includes("leaf_blight") ||
      lowerDisease.includes("leaf blight")
    )
      return { color: "#8B4513", icon: "🍂", category: "Maize" };
    if (
      lowerDisease.includes("leaf_spot") ||
      lowerDisease.includes("leaf spot")
    )
      return { color: "#A0522D", icon: "🔴", category: "Maize" };
    if (
      lowerDisease.includes("streak_virus") ||
      lowerDisease.includes("streak virus")
    )
      return { color: "#FF69B4", icon: "🦠", category: "Maize" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Maize" };
    return { color: "#FFD700", icon: "🌽", category: "Maize" };
  }

  // Tomato diseases
  if (lowerDisease.includes("tomato")) {
    if (
      lowerDisease.includes("bacterial_spot") ||
      lowerDisease.includes("bacterial spot")
    )
      return { color: "#8B0000", icon: "🦠", category: "Tomato" };
    if (
      lowerDisease.includes("early_blight") ||
      lowerDisease.includes("early blight")
    )
      return { color: "#A0522D", icon: "🍂", category: "Tomato" };
    if (
      lowerDisease.includes("late_blight") ||
      lowerDisease.includes("late blight")
    )
      return { color: "#2F4F4F", icon: "🌫️", category: "Tomato" };
    if (
      lowerDisease.includes("leaf_mold") ||
      lowerDisease.includes("leaf mold")
    )
      return { color: "#556B2F", icon: "🟢", category: "Tomato" };
    if (
      lowerDisease.includes("septoria_leaf_spot") ||
      lowerDisease.includes("septoria leaf spot")
    )
      return { color: "#8B4513", icon: "🔴", category: "Tomato" };
    if (
      lowerDisease.includes("spider_mites") ||
      lowerDisease.includes("spider mites")
    )
      return { color: "#DC143C", icon: "🕷️", category: "Tomato" };
    if (
      lowerDisease.includes("target_spot") ||
      lowerDisease.includes("target spot")
    )
      return { color: "#B22222", icon: "🎯", category: "Tomato" };
    if (
      lowerDisease.includes("yellow_leaf_curl") ||
      lowerDisease.includes("yellow leaf curl")
    )
      return { color: "#FFD700", icon: "🌀", category: "Tomato" };
    if (lowerDisease.includes("healthy"))
      return { color: "#228B22", icon: "✅", category: "Tomato" };
    return { color: "#FF6347", icon: "🍅", category: "Tomato" };
  }

  // Default
  return { color: "#6b7280", icon: "❓", category: "Unknown" };
};

/**
 * Legend Component
 */
const MapLegend = ({ outbreaks }: { outbreaks: OutbreakData[] }) => {
  // Get unique diseases and their info
  const diseaseInfo = outbreaks.reduce((acc, outbreak) => {
    const info = getDiseaseMarkerInfo(outbreak.disease);
    const key = `${info.category}-${outbreak.disease}`;
    if (!acc[key]) {
      acc[key] = {
        ...info,
        disease: outbreak.disease,
        count: 0,
      };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { color: string; icon: string; category: string; disease: string; count: number }>);

  const diseaseList = Object.values(diseaseInfo);

  // Group by category
  const categories = diseaseList.reduce((acc, disease) => {
    if (!acc[disease.category]) {
      acc[disease.category] = [];
    }
    acc[disease.category].push(disease);
    return acc;
  }, {} as Record<string, typeof diseaseList>);

  if (diseaseList.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-2 flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        Disease Legend
      </h3>

      <div className="space-y-3">
        {Object.entries(categories).map(([category, diseases]) => (
          <div key={category} className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground border-b pb-1">
              {category}
            </h4>
            {diseases.map((disease) => (
              <div
                key={disease.disease}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px]"
                    style={{ backgroundColor: disease.color }}
                  >
                    {disease.icon}
                  </div>
                  <span className="truncate" title={disease.disease}>
                    {disease.disease
                      .replace(/^(Cashew|Cassava|Maize|Tomato)_?/, "")
                      .replace(/_/g, " ")}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1 py-0 h-4 ml-1"
                >
                  {disease.count}
                </Badge>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

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
        console.error("Failed to initialize map:", err);
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
      const size = 20; // Fixed size for consistency

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${diseaseInfo.color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">
            ${diseaseInfo.icon}
          </div>
        `,
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
            console.error("Error fetching location:", error);
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
            className: "current-location-marker",
            html: `
              <div style="
                width: 30px;
                height: 40px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 30px;
                  height: 30px;
                  background-color: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50% 50% 50% 0;
                  transform: rotate(-45deg);
                  box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                  position: absolute;
                  top: 0;
                "></div>
                <div style="
                  color: white;
                  font-size: 16px;
                  z-index: 10;
                  position: relative;
                  transform: rotate(0deg);
                  margin-top: -5px;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                ">
                  📍
                </div>
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
