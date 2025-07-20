"use client";

/**
 * Sonu - Outbreak Details Component
 *
 * Detailed view of selected outbreak information
 * Features:
 * - Complete outbreak information
 * - Location-based deletion capability
 * - Action buttons for reporting
 * - Treatment recommendations
 * - Contact information
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.1.0
 */

import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Phone,
  Trash2,
  Navigation,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OutbreakData } from "@/app/map/page";
import { toast } from "sonner";
import {
  getCurrentLocation,
  isWithinDeletionRange,
  formatDistance,
  calculateDistance,
  UserLocation,
} from "@/lib/utils/location-helper";

/**
 * Props for OutbreakDetails component
 */
interface OutbreakDetailsProps {
  outbreak: OutbreakData;
  onClose: () => void;
  onDelete?: (outbreakId: string) => void;
}

/**
 * Get severity color and description
 */
const getSeverityInfo = (severity: string) => {
  switch (severity) {
    case "low":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        description: "Minimal impact, routine monitoring advised",
      };
    case "medium":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        description: "Moderate concern, preventive measures recommended",
      };
    case "high":
      return {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        description: "Significant threat, immediate action required",
      };
    case "critical":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        description: "Critical situation, urgent intervention needed",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        description: "Unknown severity level",
      };
  }
};

/**
 * Get status color and description
 */
const getStatusInfo = (status: string) => {
  switch (status) {
    case "active":
      return {
        color: "text-red-600",
        description: "Currently spreading, requires attention",
      };
    case "contained":
      return {
        color: "text-orange-600",
        description: "Spread controlled, monitoring continues",
      };
    case "resolved":
      return {
        color: "text-green-600",
        description: "Successfully treated and resolved",
      };
    default:
      return {
        color: "text-gray-600",
        description: "Status unknown",
      };
  }
};

/**
 * Main outbreak details component
 */
export function OutbreakDetails({
  outbreak,
  onClose,
  onDelete,
}: OutbreakDetailsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState("Unknown");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [distanceToOutbreak, setDistanceToOutbreak] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const severityInfo = getSeverityInfo(outbreak.severity);
  const statusInfo = getStatusInfo(outbreak.status);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `/api/location?lat=${outbreak.location.lat}&lon=${outbreak.location.lng}`
        );
        const data = await response.json();
        setLocation(data.location || "Unknown");
      } catch (error) {
        toast.error("Failed to fetch location");
        setLocation("Unknown");
      }
    };

    if (outbreak.location.lat && outbreak.location.lng) {
      fetchLocation();
    }
  }, [outbreak.location.lat, outbreak.location.lng]);

  /**
   * Automatically check user location when component mounts
   */
  useEffect(() => {
    // Auto-check user location when outbreak details open
    checkUserLocation();
  }, [outbreak.id]); // Re-run when outbreak changes

  /**
   * Get user location and check if they can delete this outbreak
   */
  const checkUserLocation = async (showToast: boolean = false) => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        outbreak.location.lat,
        outbreak.location.lng
      );

      setDistanceToOutbreak(distance);

      // Check if user is within 5km tolerance for deletion
      const withinRange = isWithinDeletionRange(
        location.latitude,
        location.longitude,
        outbreak.location.lat,
        outbreak.location.lng,
        5 // 5km tolerance
      );

      setCanDelete(withinRange);

      // Only show toast when explicitly requested (manual button click)
      if (showToast) {
        if (withinRange) {
          toast.success(
            `You're ${formatDistance(
              distance
            )} from this outbreak. You can help verify this report.`
          );
        } else {
          toast.info(
            `You're ${formatDistance(
              distance
            )} from this outbreak. You need to be within 5km to help moderate this report.`
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get your location";
      toast.error(`${errorMessage}. Please enable location services.`);
      console.error("Location error:", error);
      setUserLocation(null);
      setCanDelete(false);
      setDistanceToOutbreak(null);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * Handle outbreak deletion
   */
  const handleDelete = async () => {
    if (!canDelete || !userLocation) {
      toast.error("You must be within 5km of the outbreak to delete it.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/outbreaks/${outbreak.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLocation: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          reason: "Community moderation - false or outdated report",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to delete outbreak (${response.status})`
        );
      }

      toast.success(
        "Outbreak report has been removed. Thank you for helping keep our community data accurate!"
      );

      // Call the onDelete callback to update the parent component
      if (onDelete) {
        onDelete(outbreak.id);
      }

      onClose();

      // Refresh the browser to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Small delay to let the success toast show
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete outbreak. Please try again.";
      toast.error(errorMessage);
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle sharing outbreak information
   */
  const handleShare = async () => {
    setIsSharing(true);

    const shareData = {
      title: `Disease Outbreak: ${outbreak.disease}`,
      text: `${outbreak.disease} outbreak in ${location}. Severity: ${outbreak.severity}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert("Outbreak information copied to clipboard!");
      }
    } catch (error) {
      toast.error("Error sharing");
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Handle reporting similar outbreak
   */
  const handleReportSimilar = () => {
    // In a real app, this would navigate to a reporting form
    // pre-filled with similar outbreak data
    alert("Reporting feature coming soon!");
  };

  /**
   * Handle contacting reporter
   */
  const handleContact = () => {
    // In a real app, this would open a contact form or messaging system
    alert("Contact feature coming soon!");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{outbreak.disease}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and basic info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 min-w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">
                Reported on{" "}
                {new Date(outbreak.reportedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.ceil(
                  (Date.now() - new Date(outbreak.reportedDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </p>
            </div>
          </div>
        </div>

        {/* Status and severity */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <p className={`text-sm font-medium ${statusInfo.color} capitalize`}>
              {outbreak.status}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Description */}
        {outbreak.description && (
          <div>
            <p className="text-sm font-medium mb-2">Description</p>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {outbreak.description}
            </p>
          </div>
        )}

        {/* Location-based moderation */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Community Moderation</p>
            {distanceToOutbreak !== null && (
              <Badge variant="outline" className="text-xs">
                {formatDistance(distanceToOutbreak)}
              </Badge>
            )}
          </div>

          {isLoadingLocation ? (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600 animate-pulse" />
                <p className="text-sm font-medium text-blue-800">
                  Checking Your Location...
                </p>
              </div>
              <p className="text-sm text-blue-700">
                Getting your location to see if you can help verify this
                outbreak report.
              </p>
            </div>
          ) : !userLocation ? (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Navigation className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">
                  Location Access Needed
                </p>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Please enable location services to help verify outbreak reports
                in your area.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => checkUserLocation(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div
              className={`p-3 rounded-md ${
                canDelete ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Shield
                  className={`h-4 w-4 ${
                    canDelete ? "text-green-600" : "text-gray-600"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    canDelete ? "text-green-800" : "text-gray-800"
                  }`}
                >
                  {canDelete
                    ? "You Can Help Moderate"
                    : "Outside Moderation Range"}
                </p>
              </div>
              <p
                className={`text-sm mb-3 ${
                  canDelete ? "text-green-700" : "text-gray-700"
                }`}
              >
                {canDelete
                  ? `You're ${formatDistance(
                      distanceToOutbreak!
                    )} from this outbreak. You can help remove false or outdated reports.`
                  : `You're ${formatDistance(
                      distanceToOutbreak!
                    )} from this outbreak. You need to be within 5km to help moderate reports.`}
              </p>

              {canDelete && (
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? "Removing..." : "Remove Report"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="z-[9999]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Remove Outbreak Report?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You're about to remove this {outbreak.disease}{" "}
                          outbreak report from{" "}
                          {outbreak.location.name || "the map"}. This action
                          will help keep our community data accurate by removing
                          false or outdated reports.
                          <br />
                          <br />
                          <strong>
                            Are you sure this report is incorrect or no longer
                            relevant?
                          </strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Remove Report
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserLocation(null)}
                    className="text-gray-600 border-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {!canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserLocation(null)}
                  className="text-gray-600 border-gray-200"
                >
                  Try Different Location
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Emergency contact */}
        {outbreak.severity === "critical" && (
          <div className="bg-red-50 p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium text-red-800">
                Emergency Response
              </p>
            </div>
            <p className="text-sm text-red-700 mb-2">
              This is a critical outbreak requiring immediate professional
              intervention.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact Extension Officer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
