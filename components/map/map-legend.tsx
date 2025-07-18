"use client";

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OutbreakData } from "@/app/map/page";
import { getDiseaseMarkerInfo } from "@/lib/utils/map-helpers";

/**
 * MapLegend component shows all currently visible disease markers grouped by crop category.
 * It was moved out of outbreak-map.tsx for better separation of concerns.
 */
export function MapLegend({ outbreaks }: { outbreaks: OutbreakData[] }) {
  // Aggregate disease occurrences
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
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { color: string; icon: string; category: string; disease: string; count: number }>);

  const diseaseList = Object.values(diseaseInfo);

  // Group by category for display
  const categories = diseaseList.reduce((acc, disease) => {
    if (!acc[disease.category]) acc[disease.category] = [];
    acc[disease.category].push(disease);
    return acc;
  }, {} as Record<string, typeof diseaseList>);

  if (diseaseList.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-sm mb-2 flex items-center">
        <MapPin className="h-4 w-4 mr-1" /> Disease Legend
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
}
