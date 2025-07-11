"use client";

/**
 * AgriSentry AI - Scan Results with Chat Interface
 *
 * Simplified results display that focuses on AI chat interaction
 * rather than static information cards. Shows basic detection
 * results and prominent chat button for conversational assistance.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import {
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Camera,
  MapPin,
  Brain,
  Leaf,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanResult } from "@/lib/types/disease";
import { AIChat } from "./ai-chat";

interface ScanResultsChatProps {
  result: ScanResult;
  onNewScan: () => void;
  onReportOutbreak?: () => void;
}

/**
 * Simplified scan results with AI chat focus
 * Features:
 * - Quick detection summary
 * - Prominent AI chat button
 * - Mobile-optimized layout
 * - Conversational assistance
 */
export function ScanResultsChat({
  result,
  onNewScan,
  onReportOutbreak,
}: ScanResultsChatProps) {
  const [showChat, setShowChat] = useState(false);

  const { detectionResult, disease } = result;

  /**
   * Get confidence level styling and icon
   */
  const getConfidenceDisplay = () => {
    const { confidence, confidenceLevel } = detectionResult;

    switch (confidenceLevel) {
      case "high":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <CheckCircle className="h-5 w-5" />,
          text: "High Confidence",
        };
      case "medium":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          icon: <AlertTriangle className="h-5 w-5" />,
          text: "Medium Confidence",
        };
      default:
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: <AlertTriangle className="h-5 w-5" />,
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
          emoji: "🚨",
        };
      case "severe":
        return {
          color: "text-orange-700",
          bgColor: "bg-orange-100",
          text: "Severe",
          emoji: "⚠️",
        };
      default:
        return {
          color: "text-green-700",
          bgColor: "bg-green-100",
          text: "Mild",
          emoji: "🟢",
        };
    }
  };

  const confidenceDisplay = getConfidenceDisplay();
  const severityDisplay = getSeverityDisplay();

  // Show chat interface if user clicked on AI chat
  if (showChat) {
    return (
      <div className="w-full max-w-md mx-auto">
        <AIChat scanResult={result} onClose={() => setShowChat(false)} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Detection Summary Card */}
      <Card>
        <CardHeader className="text-center pb-1">
          <CardTitle className="flex items-center justify-center space-x-2 text-lg">
            <Brain className="h-6 w-6 text-primary" />
            <span>Disease Detected</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              Processed in {detectionResult.processingTime}ms
            </Badge>
          </div>
          {/* Analyzed Image */}
          <div className="relative">
            <img
              src={result.imageUrl}
              alt="Analyzed crop"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-black/70 text-white border-none">
                AI Analyzed
              </Badge>
            </div>
          </div>

          {/* Disease Information */}
          <div className="text-center space-y-3">
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">
                {disease.name}
              </h3>
              <p className="text-sm text-muted-foreground italic">
                {disease.scientificName}
              </p>
            </div>

            {/* Confidence and Severity Grid */}

            <div
              className={`p-4 rounded-lg ${confidenceDisplay.bgColor} text-center`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                {confidenceDisplay.icon}
                <span
                  className={`text-sm font-medium ${confidenceDisplay.color}`}
                >
                  {confidenceDisplay.text}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {detectionResult.confidence}%
              </div>
            </div>
          </div>

          {/* Quick Disease Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-center mb-3">
              <h4 className="font-medium text-sm mb-2">🔬 Disease Overview</h4>
              <p className="text-sm leading-relaxed">
                {disease.name === "Cashew healthy" &&
                  "The cashew plant appears to be healthy and free from common diseases."}
                {disease.name === "Cassava healthy" &&
                  "The cassava plant shows no signs of disease and appears to be in good condition."}
                {disease.name === "Maize healthy" &&
                  "The maize plant is healthy with no visible disease symptoms."}
                {disease.name === "Tomato healthy" &&
                  "The tomato plant appears to be healthy and free from common diseases."}
                {disease.name.includes("anthracnose") &&
                  "Anthracnose is a fungal disease that causes dark, sunken lesions on leaves and fruits. It thrives in warm, humid conditions."}
                {disease.name.includes("mosaic") &&
                  "Mosaic virus causes yellow and green mottled patterns on leaves, often stunting plant growth."}
                {disease.name.includes("blight") &&
                  "Blight is a serious fungal disease that causes rapid browning and death of plant tissues."}
                {disease.name.includes("armyworm") &&
                  "Fall armyworm is a destructive pest that feeds on leaves, creating large holes and can severely damage crops."}
                {disease.name.includes("wilt") &&
                  "Wilt disease affects the plant's vascular system, causing leaves to droop and eventually die."}
                {disease.name.includes("rust") &&
                  "Rust disease appears as orange or brown pustules on leaves and can spread rapidly in humid conditions."}
                {!disease.name.includes("healthy") &&
                  !disease.name.includes("anthracnose") &&
                  !disease.name.includes("mosaic") &&
                  !disease.name.includes("blight") &&
                  !disease.name.includes("armyworm") &&
                  !disease.name.includes("wilt") &&
                  !disease.name.includes("rust") &&
                  `This is a ${disease.name
                    .toLowerCase()
                    .replace(
                      /_/g,
                      " "
                    )} affecting your crop. Early detection and proper treatment are key to preventing spread.`}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <span>📍 Affects: {disease.affectedCrops.join(", ")}</span>
              <span>📊 Prevalence: {disease.prevalence}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <Button onClick={onNewScan} variant="outline" className="h-12">
          <Camera className="mr-2 h-4 w-4" />
          Scan Another Plant
        </Button>

        {onReportOutbreak && (
          <Button variant="outline" onClick={onReportOutbreak} className="h-12">
            <MapPin className="mr-2 h-4 w-4" />
            Report to Community Map
          </Button>
        )}
      </div>
      {/* AI Chat Invitation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold">Ask AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get treatment advice & farming tips
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowChat(true)}
            className="w-full h-10"
            size="default"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat with AI
          </Button>
        </CardContent>
      </Card>

      {/* Low Confidence Warning */}
      {detectionResult.confidenceLevel === "low" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low confidence detection.</strong> Consider taking another
            photo with better lighting or ask the AI assistant for advice on
            improving image quality.
          </AlertDescription>
        </Alert>
      )}

      {/* Processing Info */}
      <div className="text-center">
        <Badge variant="outline" className="text-xs">
          Ghana AI Focused
        </Badge>
      </div>
    </div>
  );
}
