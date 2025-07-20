"use client";

/**
 * Sonu - Scan Results with Chat Interface
 *
 * Simplified results display that focuses on AI chat interaction
 * rather than static information cards. Shows basic detection
 * results and prominent chat button for conversational assistance.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Camera,
  MapPin,
  X,
  Eye,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScanResult } from "@/lib/types/disease";
import { AIChat } from "./ai-chat";
import { YouTubeVideos } from "./youtube-videos";

interface ScanResultsChatProps {
  result: ScanResult;
  onNewScan: () => void;
  onDirectImageUpload?: (files: File[]) => void;
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
  onDirectImageUpload,
  onReportOutbreak,
}: ScanResultsChatProps) {
  const [showChat, setShowChat] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { detectionResult, disease } = result;

  const playAudio = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    } else {
      const newAudio = new Audio(
        `/audio/${disease.name.replace(/ /g, "_")}.wav`
      );
      setAudio(newAudio);
      newAudio.play();
      newAudio.onended = () => setAudio(null);
    }
  };

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

  /**
   * Handle direct file upload from New Scan button
   */
  const handleDirectFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      if (files.length === 0) return;

      // Validate files
      const validFiles: File[] = [];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(
            `${file.name} is too large. Please select files under 10MB`
          );
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      // Call the direct upload handler if provided, otherwise fall back to onNewScan
      if (onDirectImageUpload) {
        onDirectImageUpload(validFiles);
      } else {
        // If no direct handler, fall back to original behavior
        onNewScan();
      }

      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    },
    [onDirectImageUpload, onNewScan]
  );

  /**
   * Handle New Scan button click - directly trigger file upload
   */
  const handleNewScanClick = useCallback(() => {
    if (onDirectImageUpload) {
      // Directly trigger file upload dialog
      fileInputRef.current?.click();
    } else {
      // Fall back to original behavior
      onNewScan();
    }
  }, [onDirectImageUpload, onNewScan]);

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
    <>
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Detection Summary Card */}
        <Card>
          {/* <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2 text-lg">
              <Brain className="h-6 w-6 text-primary" />
              <span>Disease Detected</span>
            </CardTitle>
          </CardHeader> */}

          <CardContent className="space-y-6">
            {/* Analyzed Image with Click to Expand */}
            <div className="relative">
              <motion.img
                src={result.imageUrl}
                alt="Analyzed crop"
                className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-black/70 text-white border-none">
                  AI Analyzed
                </Badge>
              </div>
              <motion.div
                className="absolute top-2 left-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Badge className="bg-primary/90 text-white border-none cursor-pointer">
                  <Eye className="w-3 h-3 mr-1" />
                  Click to expand
                </Badge>
              </motion.div>
            </div>

            {/* Disease Information */}
            <div className="text-center space-y-3">
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {disease.name}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={playAudio}>
                    {audio ? (
                      <Volume2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </Button>
                </div>
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
          </CardContent>
        </Card>

        {/* YouTube Educational Videos */}
        <YouTubeVideos diseaseId={result.disease.id} />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between w-full max-w-md ">
          <Button
            onClick={handleNewScanClick}
            variant="outline"
            className="h-12 w-[48%]"
          >
            <Camera className="mr-2 h-4 w-4" />
            New Scan
          </Button>

          {onReportOutbreak && (
            <Button
              variant="outline"
              onClick={async () => {
                await onReportOutbreak();
              }}
              className="h-12 w-[48%]"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Report to Map
            </Button>
          )}
        </div>
        <Button
          onClick={() => setShowChat(true)}
          className="w-full h-10"
          size="default"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat with AI
        </Button>
        {/* AI Chat Invitation */}
      </div>

      {/* Hidden file input for direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleDirectFileUpload}
        className="hidden"
      />

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && (
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
                  src={result.imageUrl}
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
                  <h3 className="text-xl font-bold mb-2">{disease.name}</h3>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {disease.scientificName}
                  </p>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">
                      {detectionResult.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
