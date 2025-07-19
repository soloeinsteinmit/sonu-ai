"use client";

/**
 * AgriSentry AI - Map Filters Component
 *
 * Filter controls for the outbreak map
 * Features:
 * - Disease type filtering
 * - Crop type filtering
 * - Region filtering
 * - Severity level filtering
 * - Date range filtering
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapFilters as MapFiltersType, OutbreakData } from "@/app/map/page";

/**
 * Props for MapFilters component
 */
interface MapFiltersProps {
  filters: MapFiltersType;
  onFiltersChange: (filters: MapFiltersType) => void;
  availableData: OutbreakData[];
  filteredCount: number;
}

/**
 * Filter dropdown component
 */
interface FilterDropdownProps {
  title: string;
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
}

function FilterDropdown({
  title,
  options,
  selected,
  onSelectionChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelectionChange(selected.filter((item) => item !== option));
    } else {
      onSelectionChange([...selected, option]);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Label className="text-sm font-medium mb-2 block">{title}</Label>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selected.length === 0
            ? `All ${title.toLowerCase()}`
            : selected.length === 1
            ? selected[0]
            : `${selected.length} selected`}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {selected.length > 0 && (
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={clearAll}
              >
                <X className="h-3 w-3 mr-2" />
                Clear all
              </Button>
            </div>
          )}

          <div className="p-1">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <div className="flex items-center justify-center w-4 h-4 border border-input rounded-sm">
                  {selected.includes(option) && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main map filters component
 */
export function MapFilters({
  filters,
  onFiltersChange,
  availableData,
  filteredCount,
}: MapFiltersProps) {
  // Extract unique values from available data
  const availableDiseases = [
    ...new Set(availableData.map((item) => item.disease)),
  ].sort();
  const availableCrops = [
    ...new Set(availableData.map((item) => item.crop)),
  ].sort();
  const availableRegions = [
    ...new Set(availableData.map((item) => item.location.region)),
  ].sort();

  /**
   * Update specific filter
   */
  const updateFilter = (key: keyof MapFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  /**
   * Handle date range changes
   */
  const handleDateChange = (type: "start" | "end", value: string) => {
    updateFilter("dateRange", {
      ...filters.dateRange,
      [type]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Active filters summary */}
      {(filters.diseases.length > 0 ||
        filters.crops.length > 0 ||
        filters.regions.length > 0) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {filters.diseases.map((disease) => (
              <Badge key={disease} variant="secondary" className="text-xs">
                {disease}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() =>
                    updateFilter(
                      "diseases",
                      filters.diseases.filter((d) => d !== disease)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.crops.map((crop) => (
              <Badge key={crop} variant="secondary" className="text-xs">
                {crop}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() =>
                    updateFilter(
                      "crops",
                      filters.crops.filter((c) => c !== crop)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.regions.map((region) => (
              <Badge key={region} variant="secondary" className="text-xs">
                {region}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() =>
                    updateFilter(
                      "regions",
                      filters.regions.filter((r) => r !== region)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Disease filter */}
        <FilterDropdown
          title="Diseases"
          options={availableDiseases}
          selected={filters.diseases}
          onSelectionChange={(selected) => updateFilter("diseases", selected)}
        />

        {/* Crop filter */}
        <FilterDropdown
          title="Crops"
          options={availableCrops}
          selected={filters.crops}
          onSelectionChange={(selected) => updateFilter("crops", selected)}
        />

        {/* Region filter */}
        <FilterDropdown
          title="Regions"
          options={availableRegions}
          selected={filters.regions}
          onSelectionChange={(selected) => updateFilter("regions", selected)}
        />
      </div>

      {/* Date range filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="start-date"
              className="text-xs text-muted-foreground"
            >
              From
            </Label>
            <Input
              id="start-date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="text-xs text-muted-foreground">
              To
            </Label>
            <Input
              id="end-date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Filter summary */}
      <div className="text-sm text-muted-foreground">
        {availableData.length === 0
          ? "No outbreak data available"
          : `Showing ${filteredCount} of ${availableData.length} outbreak${
              availableData.length !== 1 ? "s" : ""
            }`}
      </div>
    </div>
  );
}
