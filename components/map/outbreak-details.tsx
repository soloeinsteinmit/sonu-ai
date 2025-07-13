"use client";

/**
 * AgriSentry AI - Outbreak Details Component
 * 
 * Detailed view of selected outbreak information
 * Features:
 * - Complete outbreak information
 * - Action buttons for reporting
 * - Treatment recommendations
 * - Contact information
 * 
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  User, 
  Phone, 
  MessageSquare,
  ExternalLink,
  Share2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OutbreakData } from "@/app/map/page";

/**
 * Props for OutbreakDetails component
 */
interface OutbreakDetailsProps {
  outbreak: OutbreakData;
  onClose: () => void;
}

/**
 * Get severity color and description
 */
const getSeverityInfo = (severity: string) => {
  switch (severity) {
    case "low":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        description: "Minimal impact, routine monitoring advised"
      };
    case "medium":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        description: "Moderate concern, preventive measures recommended"
      };
    case "high":
      return {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        description: "Significant threat, immediate action required"
      };
    case "critical":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        description: "Critical situation, urgent intervention needed"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        description: "Unknown severity level"
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
        description: "Currently spreading, requires attention"
      };
    case "contained":
      return {
        color: "text-orange-600",
        description: "Spread controlled, monitoring continues"
      };
    case "resolved":
      return {
        color: "text-green-600",
        description: "Successfully treated and resolved"
      };
    default:
      return {
        color: "text-gray-600",
        description: "Status unknown"
      };
  }
};

/**
 * Main outbreak details component
 */
export function OutbreakDetails({ outbreak, onClose }: OutbreakDetailsProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState("Unknown");
  
  const severityInfo = getSeverityInfo(outbreak.severity);
  const statusInfo = getStatusInfo(outbreak.status);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/location?lat=${outbreak.location.lat}&lon=${outbreak.location.lng}`);
        const data = await response.json();
        setLocation(data.location || "Unknown");
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation("Unknown");
      }
    };

    if (outbreak.location.lat && outbreak.location.lng) {
      fetchLocation();
    }
  }, [outbreak.location.lat, outbreak.location.lng]);

  /**
   * Handle sharing outbreak information
   */
  const handleShare = async () => {
    setIsSharing(true);
    
    const shareData = {
      title: `Disease Outbreak: ${outbreak.disease}`,
      text: `${outbreak.disease} outbreak in ${location}. Severity: ${outbreak.severity}. Affected area: ${outbreak.affectedArea} hectares.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Outbreak information copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
    alert('Reporting feature coming soon!');
  };

  /**
   * Handle contacting reporter
   */
  const handleContact = () => {
    // In a real app, this would open a contact form or messaging system
    alert('Contact feature coming soon!');
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
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{location}</p>
              <p className="text-sm text-muted-foreground">{outbreak.location.region} Region</p>
            </div>
          </div>

          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm">
                Reported on {new Date(outbreak.reportedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.ceil((Date.now() - new Date(outbreak.reportedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </div>
          </div>
        </div>

        {/* Status and severity */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm font-medium mb-1">Severity Level</p>
            <Badge className={`text-xs ${severityInfo.color}`}>
              {outbreak.severity.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {severityInfo.description}
            </p>
          </div>
          
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

        {/* Crop and affected area */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Affected Crop</p>
            <Badge variant="outline" className="text-xs">
              {outbreak.crop}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Affected Area</p>
            <p className="text-sm">{outbreak.affectedArea} hectares</p>
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

        {/* Reporter information */}
        <div>
          <p className="text-sm font-medium mb-2">Reported By</p>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{outbreak.reportedBy}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Actions</p>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReportSimilar}
              className="justify-start"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Similar Outbreak
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleContact}
              className="justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Reporter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {isSharing ? 'Sharing...' : 'Share Information'}
            </Button>
          </div>
        </div>

        {/* Treatment recommendations */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Treatment Recommendations</p>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Immediate Actions:</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Isolate affected plants immediately</li>
              <li>• Remove and destroy infected plant material</li>
              <li>• Apply appropriate fungicide/pesticide treatment</li>
              <li>• Monitor surrounding areas for spread</li>
            </ul>
            <div className="mt-3 pt-2 border-t border-blue-200">
              <Button
                variant="link"
                size="sm"
                className="text-blue-600 p-0 h-auto"
                onClick={() => window.open('/scan', '_blank')}
              >
                <FileText className="h-3 w-3 mr-1" />
                Get detailed treatment plan
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        {outbreak.severity === 'critical' && (
          <div className="bg-red-50 p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium text-red-800">Emergency Response</p>
            </div>
            <p className="text-sm text-red-700 mb-2">
              This is a critical outbreak requiring immediate professional intervention.
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