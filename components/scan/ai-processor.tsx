"use client";

/**
 * AgriSentry AI - AI Processing Component
 *
 * Simulates AI disease detection processing with realistic timing
 * and progress feedback. In production, this would integrate with
 * the actual ML model API.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScanStatus, ScanResult } from "@/lib/types/disease";
import {
  DISEASES,
  TREATMENTS,
  DISEASE_TREATMENTS,
} from "@/lib/constants/diseases";

interface AIProcessorProps {
  imageFile: File;
  onComplete: (result: ScanResult) => void;
  onError: (error: string) => void;
}

/**
 * AI Processing stages with realistic timing
 */
const PROCESSING_STAGES = [
  { stage: "upload", message: "Uploading image...", duration: 1000 },
  { stage: "analyzing", message: "Analyzing image quality...", duration: 1500 },
  {
    stage: "processing",
    message: "AI model detecting diseases...",
    duration: 3000,
  },
  { stage: "complete", message: "Analysis complete!", duration: 500 },
] as const;

/**
 * AI Processor component with realistic simulation
 * Features:
 * - Progressive loading states
 * - Realistic processing timing
 * - Error handling simulation
 * - Visual progress feedback
 */
export function AIProcessor({
  imageFile,
  onComplete,
  onError,
}: AIProcessorProps) {
  const [status, setStatus] = useState<ScanStatus>({
    isProcessing: true,
    progress: 0,
    stage: "upload",
    message: "Initializing AI analysis...",
  });

  /**
   * Simulate AI processing with realistic stages and timing
   */
  useEffect(() => {
    const processImage = async () => {
      try {
        let totalProgress = 0;
        const progressPerStage = 100 / PROCESSING_STAGES.length;

        for (const stageInfo of PROCESSING_STAGES) {
          setStatus((prev) => ({
            ...prev,
            stage: stageInfo.stage,
            message: stageInfo.message,
            progress: totalProgress,
          }));

          // Simulate processing time with progress updates
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              totalProgress += progressPerStage / (stageInfo.duration / 100);
              setStatus((prev) => ({
                ...prev,
                progress: Math.min(
                  totalProgress,
                  (PROCESSING_STAGES.indexOf(stageInfo) + 1) * progressPerStage
                ),
              }));
            }, 100);

            setTimeout(() => {
              clearInterval(interval);
              resolve(void 0);
            }, stageInfo.duration);
          });
        }

        // Generate realistic scan result
        const result = generateScanResult(imageFile);

        setStatus((prev) => ({
          ...prev,
          progress: 100,
          stage: "complete",
          message: "Analysis complete!",
          isProcessing: false,
        }));

        // Delay before showing results for better UX
        setTimeout(() => {
          onComplete(result);
        }, 500);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Processing failed";
        setStatus((prev) => ({
          ...prev,
          stage: "error",
          message: errorMessage,
          isProcessing: false,
          error: errorMessage,
        }));
        onError(errorMessage);
      }
    };

    processImage();
  }, [imageFile, onComplete, onError]);

  /**
   * Generate realistic scan result based on mock data
   */
  const generateScanResult = (file: File): ScanResult => {
    // Randomly select a disease for demonstration
    const randomDisease = DISEASES[Math.floor(Math.random() * DISEASES.length)];
    const treatmentIds = DISEASE_TREATMENTS[randomDisease.id] || [];
    const treatments = TREATMENTS.filter((t) => treatmentIds.includes(t.id));

    // Generate realistic confidence based on image quality simulation
    const confidence = Math.floor(Math.random() * 25) + 75; // 75-100%
    const confidenceLevel =
      confidence >= 90 ? "high" : confidence >= 75 ? "medium" : "low";

    const scanResult: ScanResult = {
      id: `scan-${Date.now()}`,
      imageUrl: URL.createObjectURL(file),
      detectionResult: {
        diseaseId: randomDisease.id,
        confidence,
        confidenceLevel,
        severity: randomDisease.severity,
        affectedArea: Math.floor(Math.random() * 40) + 20, // 20-60%
        detectedAt: new Date(),
        processingTime: 4000, // Total processing time
      },
      disease: randomDisease,
      treatments,
      recommendations: {
        primary: treatments[0],
        alternatives: treatments.slice(1),
        prevention: [
          "Use certified disease-free planting material",
          "Maintain proper field sanitation",
          "Monitor crops regularly for early detection",
          "Ensure adequate plant spacing",
        ],
      },
      createdAt: new Date(),
    };

    return scanResult;
  };

  /**
   * Get status icon based on current stage
   */
  const getStatusIcon = () => {
    switch (status.stage) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  /**
   * Get progress bar color based on stage
   */
  const getProgressColor = () => {
    switch (status.stage) {
      case "complete":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span>AI Analysis</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Processing Status */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{status.message}</span>
          </div>

          <div className="space-y-2">
            <Progress value={status.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(status.progress)}%</span>
            </div>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className="flex justify-center space-x-2">
          {PROCESSING_STAGES.map((stage, index) => {
            const isActive = stage.stage === status.stage;
            const isCompleted =
              PROCESSING_STAGES.findIndex((s) => s.stage === status.stage) >
              index;

            return (
              <Badge
                key={stage.stage}
                variant={
                  isActive ? "default" : isCompleted ? "secondary" : "outline"
                }
                className={`text-xs ${isActive ? "animate-pulse" : ""}`}
              >
                {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)}
              </Badge>
            );
          })}
        </div>

        {/* Processing Details */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            🧠 AI Processing Details
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Using EfficientNet-B0 model</li>
            <li>• Analyzing 24 disease types</li>
            <li>• Processing {imageFile.name}</li>
            <li>• Size: {(imageFile.size / 1024 / 1024).toFixed(1)} MB</li>
          </ul>
        </div>

        {/* Error State */}
        {status.stage === "error" && status.error && (
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">
              Processing failed: {status.error}
            </p>
            <p className="text-xs text-muted-foreground">
              Please try again with a different image or check your connection.
            </p>
          </div>
        )}

        {/* Success State */}
        {status.stage === "complete" && (
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-green-700 bg-green-50">
              ✓ Disease Detection Complete
            </Badge>
            <p className="text-xs text-muted-foreground">
              Preparing detailed analysis results...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
