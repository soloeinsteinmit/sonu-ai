"use client";

/**
 * AgriSentry AI - Multiple Scan Results Component
 *
 * Displays the results of multiple image scans with summary statistics
 * and individual result details.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Images,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { MultipleScanResult, ScanResult } from "@/lib/types/disease";
import { AIChat } from "./ai-chat";
import { MultipleDiseaseVideos } from "./multiple-disease-videos";

interface MultipleScanResultsProps {
  result: MultipleScanResult;
  onNewScan: () => void;
  onReportOutbreak?: () => void;
}

export function MultipleScanResults({
  result,
  onNewScan,
  onReportOutbreak,
}: MultipleScanResultsProps) {
  const [showChat, setShowChat] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);
  const [expandedResults, setExpandedResults] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const { summary, results, totalImages, processedImages } = result;

  const playAudio = (disease: any) => {
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

  // Show chat interface if user clicked on AI chat
  if (showChat) {
    return (
      <div className="w-full max-w-md mx-auto">
        <AIChat
          scanResult={summary.highestConfidence}
          onClose={() => setShowChat(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2 text-lg">
              <Images className="h-6 w-6 text-primary" />
              <span>Batch Analysis Complete</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Processing Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {processedImages}
                </div>
                <div className="text-sm text-muted-foreground">
                  Images Processed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.diseases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Diseases Found
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.averageConfidence}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.highestConfidence.detectionResult.confidence}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Highest Confidence
                </div>
              </div>
            </div>

            {/* Most Common Disease */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Most Common Disease
              </h3>
              <div className="text-xl font-bold text-primary">
                {summary.mostCommonDisease}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Found in{" "}
                {
                  results.filter(
                    (r) => r.disease.name === summary.mostCommonDisease
                  ).length
                }{" "}
                of {processedImages} images
              </div>
            </div>

            {/* Disease Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Disease Distribution
              </h4>
              {summary.diseases.map((disease, index) => {
                const count = results.filter(
                  (r) => r.disease.name === disease
                ).length;
                const percentage = (count / processedImages) * 100;
                return (
                  <div key={disease} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{disease}</span>
                      <span>
                        {count} image{count !== 1 ? "s" : ""} (
                        {Math.round(percentage)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Individual Results</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedResults(!expandedResults)}
              >
                {expandedResults ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </CardTitle>
          </CardHeader>

          <AnimatePresence>
            {expandedResults && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {results.map((scanResult, index) => (
                      <motion.div
                        key={scanResult.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg"
                      >
                        <div className="relative">
                          <img
                            src={scanResult.imageUrl}
                            alt={`Analysis ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setSelectedResult(scanResult);
                              setShowModal(true);
                            }}
                          />
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-primary text-white text-xs">
                              {index + 1}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {scanResult.disease.name}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {scanResult.disease.scientificName}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Confidence:
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {scanResult.detectionResult.confidence}%
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedResult(scanResult);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Educational Videos for All Detected Diseases */}
        <MultipleDiseaseVideos results={results} />

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          <Button
            onClick={() => setShowChat(true)}
            className="w-full h-12 bg-primary hover:bg-primary/90"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Ask AI About Results
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={onNewScan}
              variant="outline"
              className="h-12 flex-1"
            >
              <Camera className="mr-2 h-4 w-4 " />
              New Scan
            </Button>

            {onReportOutbreak && (
              <Button
                variant="outline"
                onClick={async () => {
                  await onReportOutbreak();
                  toast.success("Activity reported to map.");
                }}
                className="h-12 flex-1"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Report to Map
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Disease Details Modal */}
      <AnimatePresence>
        {showModal && selectedResult && (
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
                  src={selectedResult.imageUrl}
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
                  <div className="flex items-center justify-center space-x-2">
                    <h3 className="text-xl font-bold mb-1">
                      {selectedResult.disease.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => playAudio(selectedResult.disease)}
                      className="mb-1"
                    >
                      {audio ? (
                        <Volume2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Volume2 className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    {selectedResult.disease.scientificName}
                  </p>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-primary">
                      {selectedResult.detectionResult.confidence}%
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
