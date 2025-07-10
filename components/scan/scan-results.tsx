"use client";

/**
 * AgriSentry AI - Scan Results Component
 *
 * Displays comprehensive disease detection results with treatment
 * recommendations, severity assessment, and actionable insights.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Leaf,
  MapPin,
  Shield,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanResult, Treatment } from "@/lib/types/disease";

interface ScanResultsProps {
  result: ScanResult;
  onNewScan: () => void;
  onReportOutbreak?: () => void;
}

/**
 * Scan Results component with detailed analysis display
 * Features:
 * - Disease identification with confidence
 * - Treatment recommendations with costs
 * - Prevention strategies
 * - Outbreak reporting option
 * - Expandable sections for detailed info
 */
export function ScanResults({
  result,
  onNewScan,
  onReportOutbreak,
}: ScanResultsProps) {
  const [expandedTreatment, setExpandedTreatment] = useState<string | null>(
    null
  );
  const [showAllTreatments, setShowAllTreatments] = useState(false);

  const { detectionResult, disease, recommendations } = result;

  /**
   * Get confidence level color and icon
   */
  const getConfidenceDisplay = () => {
    const { confidence, confidenceLevel } = detectionResult;

    switch (confidenceLevel) {
      case "high":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "High Confidence",
        };
      case "medium":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Medium Confidence",
        };
      default:
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Low Confidence",
        };
    }
  };

  /**
   * Get severity level styling
   */
  const getSeverityDisplay = () => {
    switch (disease.severity) {
      case "critical":
        return {
          color: "text-red-700",
          bgColor: "bg-red-100",
          text: "Critical",
        };
      case "severe":
        return {
          color: "text-orange-700",
          bgColor: "bg-orange-100",
          text: "Severe",
        };
      case "moderate":
        return {
          color: "text-yellow-700",
          bgColor: "bg-yellow-100",
          text: "Moderate",
        };
      default:
        return {
          color: "text-green-700",
          bgColor: "bg-green-100",
          text: "Mild",
        };
    }
  };

  /**
   * Get treatment type styling
   */
  const getTreatmentTypeStyle = (type: string) => {
    switch (type) {
      case "organic":
        return "bg-green-100 text-green-800";
      case "chemical":
        return "bg-blue-100 text-blue-800";
      case "cultural":
        return "bg-purple-100 text-purple-800";
      case "biological":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Toggle treatment details expansion
   */
  const toggleTreatment = (treatmentId: string) => {
    setExpandedTreatment(
      expandedTreatment === treatmentId ? null : treatmentId
    );
  };

  const confidenceDisplay = getConfidenceDisplay();
  const severityDisplay = getSeverityDisplay();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header with Image and Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Analyzed Image */}
            <div className="space-y-3">
              <img
                src={result.imageUrl}
                alt="Analyzed crop"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <div className="text-xs text-muted-foreground text-center">
                Analyzed: {result.createdAt.toLocaleString()}
              </div>
            </div>

            {/* Detection Summary */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Disease Detected
                </h2>
                <h3 className="text-lg font-semibold text-primary">
                  {disease.name}
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  {disease.scientificName}
                </p>
              </div>

              {/* Confidence and Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${confidenceDisplay.bgColor}`}>
                  <div className="flex items-center space-x-2">
                    {confidenceDisplay.icon}
                    <span
                      className={`text-sm font-medium ${confidenceDisplay.color}`}
                    >
                      {confidenceDisplay.text}
                    </span>
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {detectionResult.confidence}%
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${severityDisplay.bgColor}`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span
                      className={`text-sm font-medium ${severityDisplay.color}`}
                    >
                      {severityDisplay.text}
                    </span>
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {detectionResult.affectedArea}% affected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disease Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>Disease Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{disease.description}</p>

          <div>
            <h4 className="font-semibold mb-2">Common Symptoms:</h4>
            <ul className="text-sm space-y-1">
              {disease.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Prevalence in Ghana:</span>
            <div className="flex items-center space-x-2">
              <Progress value={disease.prevalence} className="w-16 h-2" />
              <span className="font-medium">{disease.prevalence}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Treatment Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Recommended Treatment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TreatmentCard
            treatment={recommendations.primary}
            isPrimary={true}
            isExpanded={expandedTreatment === recommendations.primary.id}
            onToggle={() => toggleTreatment(recommendations.primary.id)}
          />
        </CardContent>
      </Card>

      {/* Alternative Treatments */}
      {recommendations.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Alternative Treatments</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTreatments(!showAllTreatments)}
              >
                {showAllTreatments ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </CardTitle>
          </CardHeader>
          {showAllTreatments && (
            <CardContent className="space-y-4">
              {recommendations.alternatives.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  isPrimary={false}
                  isExpanded={expandedTreatment === treatment.id}
                  onToggle={() => toggleTreatment(treatment.id)}
                />
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Prevention Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Prevention Strategies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.prevention.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-green-500 mt-1">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={onNewScan} className="h-12">
          <Leaf className="mr-2 h-4 w-4" />
          Scan Another Plant
        </Button>

        {onReportOutbreak && (
          <Button variant="outline" onClick={onReportOutbreak} className="h-12">
            <MapPin className="mr-2 h-4 w-4" />
            Report to Community
          </Button>
        )}
      </div>

      {/* Low Confidence Warning */}
      {detectionResult.confidenceLevel === "low" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Low confidence detection. Consider taking another photo with better
            lighting or consulting with a local agricultural extension officer
            for confirmation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * Individual treatment card component
 */
interface TreatmentCardProps {
  treatment: Treatment;
  isPrimary: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function TreatmentCard({
  treatment,
  isPrimary,
  isExpanded,
  onToggle,
}: TreatmentCardProps) {
  const getTreatmentTypeStyle = (type: string) => {
    switch (type) {
      case "organic":
        return "bg-green-100 text-green-800";
      case "chemical":
        return "bg-blue-100 text-blue-800";
      case "cultural":
        return "bg-purple-100 text-purple-800";
      case "biological":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        isPrimary ? "border-primary bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold">{treatment.name}</h4>
            <Badge className={getTreatmentTypeStyle(treatment.type)}>
              {treatment.type}
            </Badge>
            {isPrimary && (
              <Badge variant="default" className="bg-primary">
                Recommended
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {treatment.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Cost:</span>
              <div className="text-primary">
                GHS {treatment.cost.min}-{treatment.cost.max}
              </div>
            </div>
            <div>
              <span className="font-medium">Effectiveness:</span>
              <div>{treatment.effectiveness}%</div>
            </div>
            <div>
              <span className="font-medium">Frequency:</span>
              <div>{treatment.frequency}</div>
            </div>
            <div>
              <span className="font-medium">Duration:</span>
              <div>{treatment.duration}</div>
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={onToggle}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t space-y-4">
          <div>
            <h5 className="font-medium mb-2">Application Instructions:</h5>
            <ol className="text-sm space-y-1">
              {treatment.instructions.map((instruction, index) => (
                <li key={index} className="flex space-x-2">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {treatment.safety.warnings.length > 0 && (
            <div>
              <h5 className="font-medium mb-2 text-orange-600">
                Safety Warnings:
              </h5>
              <ul className="text-sm space-y-1">
                {treatment.safety.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {treatment.safety.precautions.length > 0 && (
            <div>
              <h5 className="font-medium mb-2 text-blue-600">Precautions:</h5>
              <ul className="text-sm space-y-1">
                {treatment.safety.precautions.map((precaution, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Shield className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                    <span>{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
