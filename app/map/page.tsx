"use client";

/**
 * AgriSentry AI - Disease Outbreak Map
 *
 * Interactive map showing disease outbreaks across Ghana
 * Features:
 * - Real-time outbreak visualization
 * - Disease clustering
 * - Location-based filtering
 * - Mobile-optimized controls
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Filter, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const OutbreakMap = dynamic(
  () => import("@/components/map/outbreak-map").then((mod) => mod.OutbreakMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
        <div className="text-center">
          <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ),
  }
);
import { MapFilters } from "@/components/map/map-filters";
import { OutbreakDetails } from "@/components/map/outbreak-details";
import { toast } from "sonner";

/**
 * Disease outbreak data structure
 */
export interface OutbreakData {
  id: string;
  location: {
    lat: number;
    lng: number;
    name?: string;
    region: string;
  };
  disease: string;
  crop: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedDate: string;

  reportedBy: string;
  status: "active" | "contained" | "resolved";
  description?: string;
}

/**
 * Map filters interface
 */
export interface MapFilters {
  diseases: string[];
  crops: string[];
  regions: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Main map page component
 */
export default function MapPage() {
  const [outbreaks, setOutbreaks] = useState<OutbreakData[]>([]);
  const [filteredOutbreaks, setFilteredOutbreaks] = useState<OutbreakData[]>(
    []
  );
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakData | null>(
    null
  );
  const [filters, setFilters] = useState<MapFilters>({
    diseases: [],
    crops: [],
    regions: [],
    dateRange: {
      start: "",
      end: "",
    },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load outbreak data
   */
  useEffect(() => {
    const loadOutbreaks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/predictions");
        if (!response.ok) {
          throw new Error("Failed to fetch outbreak data");
        }
        const data = await response.json();
        setOutbreaks(data);
        setFilteredOutbreaks(data);
      } catch (error) {
        toast.error("Failed to fetch outbreak data");
      } finally {
        setIsLoading(false);
      }
    };

    loadOutbreaks();
  }, []);

  /**
   * Apply filters to outbreak data
   */
  useEffect(() => {
    let filtered = [...outbreaks];

    // Filter by diseases
    if (filters.diseases.length > 0) {
      filtered = filtered.filter((outbreak) =>
        filters.diseases.includes(outbreak.disease)
      );
    }

    // Filter by crops
    if (filters.crops.length > 0) {
      filtered = filtered.filter((outbreak) =>
        filters.crops.includes(outbreak.crop)
      );
    }

    // Filter by regions
    if (filters.regions.length > 0) {
      filtered = filtered.filter((outbreak) =>
        filters.regions.includes(outbreak.location.region)
      );
    }

    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter((outbreak) => {
        const reportedDate = new Date(outbreak.reportedDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return reportedDate >= startDate && reportedDate <= endDate;
      });
    }

    setFilteredOutbreaks(filtered);
  }, [filters, outbreaks]);

  /**
   * Handle outbreak selection
   */
  const handleOutbreakSelect = (outbreak: OutbreakData) => {
    setSelectedOutbreak(outbreak);
  };

  /**
   * Clear filters
   */
  const clearFilters = () => {
    setFilters({
      diseases: [],
      crops: [],
      regions: [],
      dateRange: { start: "", end: "" },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Disease Outbreak Map</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2 sm:mr-0" />
                <span className="hidden sm:block">Filters</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters - Always on top */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filter Outbreaks</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableData={outbreaks}
                filteredCount={filteredOutbreaks.length}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map - First on mobile, right on desktop */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="shadow-lg h-[calc(100vh-120px)]">
              <CardContent className="p-0 h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <OutbreakMap
                    outbreaks={filteredOutbreaks}
                    selectedOutbreak={selectedOutbreak}
                    onOutbreakSelect={handleOutbreakSelect}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Second on mobile, left on desktop */}
          <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            {/* Details or Guide */}
            {selectedOutbreak ? (
              <OutbreakDetails
                outbreak={selectedOutbreak}
                onClose={() => setSelectedOutbreak(null)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Map Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">How to Use</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Click markers to view outbreak details</li>
                      <li>• Use filters to narrow down results</li>
                      <li>• Zoom in for more precise locations</li>
                      <li>• Report new outbreaks from scan results</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" asChild>
                      <Link href="/scan">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Disease
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Outbreaks
                    </span>
                    <Badge variant="secondary">
                      {filteredOutbreaks.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active / Resolved
                    </span>
                    <Badge variant="destructive">
                      {
                        filteredOutbreaks.filter((o) => o.status === "active")
                          .length
                      }{" "}
                      /{" "}
                      {
                        filteredOutbreaks.filter((o) => o.status === "resolved")
                          .length
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
