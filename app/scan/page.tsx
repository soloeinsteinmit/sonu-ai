"use client";

/**
 * Sonu - Scan Page
 *
 * Main disease detection page that orchestrates the complete workflow:
 * 1. Image capture (camera or upload)
 * 2. AI processing simulation
 * 3. Results display with treatment recommendations
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CameraCapture } from "@/components/scan/camera-capture";
import { AIProcessor } from "@/components/scan/ai-processor";
import { MultiImageProcessor } from "@/components/scan/multi-image-processor";
import { ScanResultsChat } from "@/components/scan/scan-results-chat";
import { MultipleScanResults } from "@/components/scan/multiple-scan-results";
import { ScanResult, MultipleScanResult } from "@/lib/types/disease";
import { FloatingMapButton } from "@/components/common/floating-map-button";

/**
 * Scan workflow stages
 */
type ScanStage = "capture" | "processing" | "results";

/**
 * Main scan page component with complete workflow
 */
export default function ScanPage() {
  const [currentStage, setCurrentStage] = useState<ScanStage>("capture");
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [multipleScanResult, setMultipleScanResult] =
    useState<MultipleScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMultipleMode, setIsMultipleMode] = useState(false);

  /**
   * Handle image(s) capture from camera component - auto-detect single vs multiple
   */
  const handleImageCapture = (file: File) => {
    setCapturedImage(file);
    setCapturedImages([]);
    setIsMultipleMode(false);
    setCurrentStage("processing");
    setError(null);
  };

  /**
   * Handle multiple images capture from camera component
   */
  const handleImagesCapture = (files: File[]) => {
    setCapturedImages(files);
    setCapturedImage(null);
    setIsMultipleMode(files.length > 1);
    setCurrentStage("processing");
    setError(null);
  };

  /**
   * Handle single AI processing completion
   */
  const handleProcessingComplete = (result: ScanResult) => {
    setScanResult(result);
    setCurrentStage("results");
  };

  /**
   * Handle multiple AI processing completion
   */
  const handleMultipleProcessingComplete = (result: MultipleScanResult) => {
    setMultipleScanResult(result);
    setCurrentStage("results");
  };

  /**
   * Handle processing errors
   */
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Stay on current stage to allow retry
  };

  /**
   * Reset to start new scan
   */
  const startNewScan = () => {
    setCurrentStage("capture");
    setCapturedImage(null);
    setCapturedImages([]);
    setScanResult(null);
    setMultipleScanResult(null);
    setIsMultipleMode(false);
    setError(null);
  };

  /**
   * Handle direct image upload from result components
   * This bypasses the camera capture stage and goes directly to processing
   */
  const handleDirectImageUpload = (files: File[]) => {
    if (files.length === 1) {
      // Single image mode
      setCapturedImage(files[0]);
      setCapturedImages([]);
      setIsMultipleMode(false);
    } else {
      // Multiple images mode
      setCapturedImages(files);
      setCapturedImage(null);
      setIsMultipleMode(files.length > 1);
    }

    // Reset previous results
    setScanResult(null);
    setMultipleScanResult(null);
    setError(null);

    // Go directly to processing stage
    setCurrentStage("processing");
  };

  /**
   * Handle outbreak reporting (placeholder for future implementation)
   */
  const handleReportOutbreak = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (scanResult) {
            // Single result
            await savePrediction(latitude, longitude, scanResult.disease.name);
          } else if (multipleScanResult) {
            // Report EACH disease detected in the batch
            const promises = multipleScanResult.results.map((r) =>
              savePrediction(latitude, longitude, r.disease.name)
            );
            await Promise.all(promises);
          }
        },
        (error) => {
          toast.error(
            "Unable to access current location. Please enable GPS or try again."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const savePrediction = async (
    latitude: number,
    longitude: number,
    disease: string
  ) => {
    try {
      const response = await fetch("/api/report-outbreak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude, longitude, disease }),
      });

      if (response.ok) {
        toast.success("Outbreak reported successfully.");
      } else {
        toast.error("Failed to report outbreak. Please try again later.");
      }
    } catch (error) {
      toast.error("An error occurred while reporting outbreak.");
    }
  };

  /**
   * Check if stage is active, completed, or pending
   */
  const getStageStatus = (stage: ScanStage) => {
    const stages: ScanStage[] = ["capture", "processing", "results"];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stage);

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
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
                <h1 className="text-lg font-semibold">Disease Detection</h1>
                {/* <p className="text-sm text-muted-foreground">
                  AI-powered crop disease analysis
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 max-[1024px]:max-w-md">
        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stage Content */}
        <div className="flex justify-center">
          {currentStage === "capture" && (
            <div className="w-full max-w-md space-y-4">
              <CameraCapture
                onImageCapture={handleImageCapture}
                onImagesCapture={handleImagesCapture}
                onError={handleError}
                disabled={false}
              />
            </div>
          )}

          {currentStage === "processing" &&
            capturedImage &&
            !isMultipleMode && (
              <div className="w-full max-w-md">
                <AIProcessor
                  imageFile={capturedImage}
                  onComplete={handleProcessingComplete}
                  onError={handleError}
                />
              </div>
            )}

          {currentStage === "processing" &&
            capturedImages.length > 0 &&
            isMultipleMode && (
              <div className="w-full max-w-2xl">
                <MultiImageProcessor
                  imageFiles={capturedImages}
                  onComplete={handleMultipleProcessingComplete}
                  onError={handleError}
                />
              </div>
            )}

          {currentStage === "results" && scanResult && !isMultipleMode && (
            <div className="w-full">
              <ScanResultsChat
                result={scanResult}
                onNewScan={startNewScan}
                onDirectImageUpload={handleDirectImageUpload}
                onReportOutbreak={handleReportOutbreak}
              />
            </div>
          )}

          {currentStage === "results" &&
            multipleScanResult &&
            isMultipleMode && (
              <div className="w-full">
                <MultipleScanResults
                  result={multipleScanResult}
                  onNewScan={startNewScan}
                  onDirectImageUpload={handleDirectImageUpload}
                  onReportOutbreak={handleReportOutbreak}
                />
              </div>
            )}
        </div>

        <FloatingMapButton />
      </main>
    </div>
  );
}
