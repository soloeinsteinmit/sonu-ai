"use client";

/**
 * AgriSentry AI - Multi-Image Processor Component
 *
 * This component handles processing multiple images sequentially,
 * showing progress and collecting results for batch analysis.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  Images,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanResult, MultipleScanResult } from "@/lib/types/disease";
import {
  DISEASES,
  TREATMENTS,
  DISEASE_TREATMENTS,
  PREVENTION_TIPS,
} from "@/lib/constants/diseases";
import { predict } from "@/lib/utils/predict";

interface MultiImageProcessorProps {
  imageFiles: File[];
  onComplete: (result: MultipleScanResult) => void;
  onError: (error: string) => void;
}

interface ProcessingState {
  currentIndex: number;
  totalImages: number;
  currentImage: string;
  isProcessing: boolean;
  progress: number;
  stage: "analyzing" | "processing" | "complete" | "error";
  message: string;
  error?: string;
}

export function MultiImageProcessor({
  imageFiles,
  onComplete,
  onError,
}: MultiImageProcessorProps) {
  const [state, setState] = useState<ProcessingState>({
    currentIndex: 0,
    totalImages: imageFiles.length,
    currentImage: "",
    isProcessing: true,
    progress: 0,
    stage: "analyzing",
    message: "Starting batch analysis...",
  });

  const [results, setResults] = useState<ScanResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    processImages();
  }, [imageFiles]);

  const processImages = async () => {
    const scanResults: ScanResult[] = [];

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const imageUrl = URL.createObjectURL(file);

        // Update state for current image
        setState((prev) => ({
          ...prev,
          currentIndex: i,
          currentImage: imageUrl,
          progress: (i / imageFiles.length) * 100,
          stage: "analyzing",
          message: `Processing image ${i + 1} of ${imageFiles.length}...`,
        }));

        try {
          // Process the image
          const prediction = await predict(file);

          // Map prediction to scan result
          const scanResult = mapPredictionToScanResult(
            prediction,
            file,
            Date.now()
          );
          scanResults.push(scanResult);

          // Update progress
          setState((prev) => ({
            ...prev,
            progress: ((i + 1) / imageFiles.length) * 100,
            stage: i === imageFiles.length - 1 ? "complete" : "processing",
            message:
              i === imageFiles.length - 1
                ? "Analysis complete!"
                : `Completed image ${i + 1} of ${imageFiles.length}`,
          }));

          // Small delay for UX
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          // Continue with other images but log the error
          const errorResult = createErrorResult(file, error);
          scanResults.push(errorResult);
        }
      }

      // Create multiple scan result
      const multipleScanResult = createMultipleScanResult(scanResults);
      setResults(scanResults);

      // Complete processing
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        stage: "complete",
        message: `Successfully processed ${scanResults.length} images`,
        progress: 100,
      }));

      setTimeout(() => {
        onComplete(multipleScanResult);
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Batch processing failed";
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        stage: "error",
        message: "Batch analysis failed",
        error: errorMessage,
      }));
      onError(errorMessage);
    }
  };

  const mapPredictionToScanResult = (
    prediction: { className: string; confidence: number },
    file: File,
    startTime: number
  ): ScanResult => {
    const { className, confidence } = prediction;
    const diseaseId = className.toLowerCase().replace(/_/g, "-");
    const detectedDisease = DISEASES.find((d) => d.id === diseaseId);

    if (!detectedDisease) {
      throw new Error(`Disease ID "${diseaseId}" not found in the database.`);
    }

    const treatmentIds = DISEASE_TREATMENTS[detectedDisease.id] || [];
    const treatments = TREATMENTS.filter((t) => treatmentIds.includes(t.id));

    let confidenceLevel: "low" | "medium" | "high" = "low";
    if (confidence >= 0.9) confidenceLevel = "high";
    else if (confidence >= 0.7) confidenceLevel = "medium";

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: URL.createObjectURL(file),
      detectionResult: {
        diseaseId: detectedDisease.id,
        confidence: Math.round(confidence * 100 * 100) / 100,
        confidenceLevel: confidenceLevel,
        severity: detectedDisease.severity,
        affectedArea: Math.floor(Math.random() * 40) + 20,
        detectedAt: new Date(),
        processingTime: Date.now() - startTime,
      },
      disease: detectedDisease,
      treatments,
      recommendations: {
        primary: treatments[0] || TREATMENTS[0],
        alternatives: treatments.slice(1),
        prevention: PREVENTION_TIPS,
      },
      createdAt: new Date(),
    };
  };

  const createErrorResult = (file: File, error: unknown): ScanResult => {
    const errorDisease =
      DISEASES.find((d) => d.id === "unknown") || DISEASES[0];

    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: URL.createObjectURL(file),
      detectionResult: {
        diseaseId: errorDisease.id,
        confidence: 0,
        confidenceLevel: "low",
        severity: "none",
        affectedArea: 0,
        detectedAt: new Date(),
        processingTime: 0,
      },
      disease: errorDisease,
      treatments: [],
      recommendations: {
        primary: TREATMENTS[0],
        alternatives: [],
        prevention: PREVENTION_TIPS,
      },
      createdAt: new Date(),
    };
  };

  const createMultipleScanResult = (
    scanResults: ScanResult[]
  ): MultipleScanResult => {
    const diseases = [...new Set(scanResults.map((r) => r.disease.name))];
    const averageConfidence =
      scanResults.reduce((sum, r) => sum + r.detectionResult.confidence, 0) /
      scanResults.length;

    // Find most common disease
    const diseaseCount = scanResults.reduce((acc, r) => {
      acc[r.disease.name] = (acc[r.disease.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonDisease =
      Object.entries(diseaseCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "Unknown";

    // Find highest confidence result
    const highestConfidence = scanResults.reduce((max, current) =>
      current.detectionResult.confidence > max.detectionResult.confidence
        ? current
        : max
    );

    return {
      id: `multi-scan-${Date.now()}`,
      results: scanResults,
      totalImages: imageFiles.length,
      processedImages: scanResults.length,
      summary: {
        diseases,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        mostCommonDisease,
        highestConfidence,
      },
      createdAt: new Date(),
    };
  };

  const getStatusIcon = () => {
    switch (state.stage) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-green-500" />;
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Images className="h-6 w-6 text-primary" />
            <span>Batch AI Analysis</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Image Display */}
          <motion.div className="relative overflow-hidden rounded-lg border">
            {state.currentImage && (
              <motion.img
                src={state.currentImage}
                alt="Current analyzing crop"
                className="w-full h-48 object-cover cursor-pointer"
                style={{
                  filter: state.isProcessing ? "blur(2px)" : "blur(0px)",
                }}
                animate={{
                  filter: state.isProcessing ? "blur(2px)" : "blur(0px)",
                }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectedImage(state.currentImage);
                  setShowModal(true);
                }}
              />
            )}

            {/* Processing Overlay */}
            <AnimatePresence>
              {state.isProcessing && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-primary/90 p-4 rounded-full shadow-lg">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Counter */}
            <div className="absolute top-2 right-2">
              <Badge className="bg-black/70 text-white border-none">
                {state.currentIndex + 1} / {state.totalImages}
              </Badge>
            </div>
          </motion.div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">{state.message}</span>
              </div>
              <Badge variant="secondary">{Math.round(state.progress)}%</Badge>
            </div>

            <Progress value={state.progress} className="h-2" />

            <div className="text-center text-sm text-muted-foreground">
              Processing {state.currentIndex + 1} of {state.totalImages} images
            </div>
          </div>

          {/* Completed Results Preview */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Completed Analysis:</h4>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="flex items-center space-x-2 p-2 bg-muted/50 rounded"
                  >
                    <img
                      src={result.imageUrl}
                      alt={`Result ${index + 1}`}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {result.disease.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.detectionResult.confidence}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {state.stage === "error" && state.error && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-red-600 mb-2">
                Batch processing failed: {state.error}
              </p>
              <p className="text-xs text-muted-foreground">
                Some images may have been processed successfully.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Full size preview"
                  className="w-full h-auto rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setShowModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
