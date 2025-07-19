"use client";

/**
 * AgriSentry AI - Real-Time AI Processor Component
 *
 * This component orchestrates the real-time, client-side disease detection.
 * It uses the ONNX runtime to perform inference directly in the browser,
 * providing a truly offline-capable experience with beautiful animations.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, AlertCircle, Loader2, X, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScanStatus, ScanResult, ConfidenceLevel } from "@/lib/types/disease";
import {
  DISEASES,
  TREATMENTS,
  DISEASE_TREATMENTS,
  PREVENTION_TIPS,
} from "@/lib/constants/diseases";
import { predict } from "@/lib/utils/predict"; // Using the real prediction pipeline
import { toast } from "sonner";

interface AIProcessorProps {
  imageFile: File;
  onComplete: (result: ScanResult) => void;
  onError: (error: string) => void;
}

const PROCESSING_STAGES = [
  { stage: "analyzing", message: "Preprocessing image...", progress: 25 },
  {
    stage: "processing",
    message: "AI model detecting diseases...",
    progress: 75,
  },
  { stage: "complete", message: "Analysis complete!", progress: 100 },
] as const;

export function AIProcessor({
  imageFile,
  onComplete,
  onError,
}: AIProcessorProps) {
  const [status, setStatus] = useState<ScanStatus>({
    isProcessing: true,
    progress: 0,
    stage: "analyzing",
    message: "Initializing AI analysis...",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Create image URL for preview
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const processImage = async () => {
      try {
        const startTime = Date.now();

        // Stage 1: Preprocessing
        setStatus((prev) => ({
          ...prev,
          stage: "analyzing",
          message: PROCESSING_STAGES[0].message,
          progress: 10,
        }));

        // The actual prediction function handles preprocessing and inference
        const prediction = await predict(imageFile);

        // Stage 2: Inference
        setStatus((prev) => ({
          ...prev,
          stage: "processing",
          message: PROCESSING_STAGES[1].message,
          progress: 50,
        }));

        // Simulate some time for the progress bar to feel natural
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Stage 3: Formatting results
        setStatus((prev) => ({
          ...prev,
          stage: "complete",
          message: PROCESSING_STAGES[2].message,
          progress: 100,
        }));

        // Map the prediction result to our ScanResult type
        const scanResult = mapPredictionToScanResult(
          prediction,
          imageFile,
          startTime
        );
        setResult(scanResult);

        setTimeout(() => {
          onComplete(scanResult);
        }, 1000);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during processing.";
        toast.error("Inference Error in AIProcessor");
        setStatus((prev) => ({
          ...prev,
          stage: "error",
          message: "Analysis Failed",
          isProcessing: false,
          error: errorMessage,
        }));
        onError(errorMessage);
      }
    };

    processImage();
  }, [imageFile, onComplete, onError]);

  const mapPredictionToScanResult = (
    prediction: { className: string; confidence: number },
    file: File,
    startTime: number
  ): ScanResult => {
    const { className, confidence } = prediction;

    // Convert model class name (e.g., 'Cassava_mosaic') to disease ID ('cassava-mosaic')
    const diseaseId = className.toLowerCase().replace(/_/g, "-");
    const detectedDisease = DISEASES.find((d) => d.id === diseaseId);

    if (!detectedDisease) {
      throw new Error(`Disease ID "${diseaseId}" not found in the database.`);
    }

    const treatmentIds = DISEASE_TREATMENTS[detectedDisease.id] || [];
    const treatments = TREATMENTS.filter((t) => treatmentIds.includes(t.id));

    let confidenceLevel: ConfidenceLevel = "low";
    if (confidence >= 0.9) confidenceLevel = "high";
    else if (confidence >= 0.7) confidenceLevel = "medium";

    return {
      id: `scan-${Date.now()}`,
      imageUrl: URL.createObjectURL(file),
      detectionResult: {
        diseaseId: detectedDisease.id,
        confidence: Math.round(confidence * 100 * 100) / 100, // Round to 2 decimal places
        confidenceLevel: confidenceLevel,
        severity: detectedDisease.severity, // Using mock severity for now
        affectedArea: Math.floor(Math.random() * 40) + 20, // Mock affected area
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

  const getStatusIcon = () => {
    switch (status.stage) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-green-500" />;
    }
  };

  const isProcessing = status.stage !== "complete" && status.stage !== "error";

  return (
    <>
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>Real-Time AI Analysis</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Image with Loading Animation */}
          <motion.div className="relative overflow-hidden rounded-lg border">
            {imageUrl && (
              <motion.img
                src={imageUrl}
                alt="Analyzing crop"
                className="w-full h-48 object-cover cursor-pointer"
                style={{
                  filter: isProcessing ? "blur(4px)" : "blur(0px)",
                }}
                animate={{
                  filter: isProcessing ? "blur(4px)" : "blur(0px)",
                }}
                transition={{ duration: 0.5 }}
                onClick={() => !isProcessing && result && setShowModal(true)}
              />
            )}

            {/* Simple Loading Overlay */}
            <AnimatePresence>
              {isProcessing && (
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

            {/* Click hint for completed analysis */}
            {!isProcessing && result && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className="bg-black/70 text-white border-none cursor-pointer">
                  <Eye className="w-3 h-3 mr-1" />
                  Click to expand
                </Badge>
              </motion.div>
            )}
          </motion.div>

          {/* Status and Progress */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>

          {/* Model Info */}
          <motion.div
            className="bg-muted/50 rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-medium mb-2 flex items-center">
              🧠 ONNX Model Details
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Running inference directly in your browser</li>
              <li>• Model: `agrisentry_model.onnx`</li>
              <li>• This works 100% offline!</li>
              <li>
                • File: {imageFile.name} (
                {(imageFile.size / 1024 / 1024).toFixed(1)} MB)
              </li>
            </ul>
          </motion.div>

          {/* Error Display */}
          {status.stage === "error" && status.error && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm text-red-600 mb-2">
                Processing failed: {status.error}
              </p>
              <p className="text-xs text-muted-foreground">
                Please try another image or ensure your browser is up-to-date.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Full size analysis"
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

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">
                    {result.disease.name}
                  </h3>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {result.disease.scientificName}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary">
                        {result.detectionResult.confidence}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">
                        {result.detectionResult.affectedArea}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Affected Area
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed">
                    {result.disease.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
