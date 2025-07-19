"use client";

/**
 * AgriSentry AI - Camera Capture Component
 *
 * A mobile-first camera component that allows users to capture images
 * for disease detection. Includes fallback to file upload for devices
 * without camera access.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onImagesCapture: (files: File[]) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

/**
 * Camera capture component with mobile optimization
 * Features:
 * - Live camera preview
 * - Touch-friendly capture button
 * - Image preview and confirmation
 * - File upload fallback
 * - Error handling for camera access
 */
export function CameraCapture({
  onImageCapture,
  onImagesCapture,
  onError,
  disabled = false,
}: CameraCaptureProps) {
  const [isCamera, setIsCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<
    { url: string; file: File }[]
  >([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Check if camera is available in the current environment
   */
  const isCameraAvailable = useCallback(() => {
    return (
      (typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function" &&
        window.location.protocol === "https:") ||
      window.location.hostname === "localhost"
    );
  }, []);

  /**
   * Initialize camera with mobile-optimized constraints
   */
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsProcessing(true);

      // Check if camera is available
      if (!isCameraAvailable()) {
        throw new Error(
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
            ? "Camera access requires HTTPS. Please use file upload instead."
            : "Camera not supported in this browser. Please use file upload instead."
        );
      }

      // Request camera with mobile-first constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera for better crop photos
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCamera(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Camera access denied";
      setCameraError(errorMessage);
      onError(`Camera error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [onError, isCameraAvailable]);

  /**
   * Stop camera and clean up resources
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCamera(false);
    setCapturedImage(null);
  }, []);

  /**
   * Capture image from video stream
   */
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create preview
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
        }
      },
      "image/jpeg",
      0.8
    );
  }, []);

  /**
   * Confirm captured image and convert to file
   */
  const confirmImage = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `crop-scan-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onImageCapture(file);
          stopCamera();
        }
      },
      "image/jpeg",
      0.8
    );
  }, [onImageCapture, stopCamera]);

  /**
   * Handle file upload from input
   */
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      if (files.length === 0) return;

      // Validate files
      const validFiles: File[] = [];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          onError(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          onError(`${file.name} is too large. Please select files under 10MB`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      if (validFiles.length > 1) {
        // Multiple files mode
        const imageData = validFiles.map((file) => ({
          url: URL.createObjectURL(file),
          file: file,
        }));
        setCapturedImages(imageData);
      } else {
        // Single file mode
        onImageCapture(validFiles[0]);
      }
    },
    [onImageCapture, onImagesCapture, onError]
  );

  /**
   * Retake photo - reset to camera view
   */
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  /**
   * Remove image from multiple images array
   */
  const removeImage = useCallback((index: number) => {
    setCapturedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // Clean up URL
      URL.revokeObjectURL(prev[index].url);
      return newImages;
    });
  }, []);

  /**
   * Confirm multiple images and convert to files
   */
  const confirmMultipleImages = useCallback(() => {
    if (capturedImages.length === 0) return;

    const files = capturedImages.map((img) => img.file);
    onImagesCapture(files);

    // Clean up URLs
    capturedImages.forEach((img) => URL.revokeObjectURL(img.url));
    setCapturedImages([]);
  }, [capturedImages, onImagesCapture]);

  /**
   * Add another image in multiple mode
   */
  const addAnotherImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        {/* Camera Error Display */}
        {cameraError && (
          <Alert className="mb-4">
            <X className="h-4 w-4" />
            <AlertDescription>
              Camera not available: {cameraError}. Please use file upload
              instead.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Area */}
        <div className="space-y-4">
          {!isCamera && !capturedImage && (
            /* Initial State - Camera or Upload Options */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Capture Crop Image
                </h3>
                <p className="text-sm text-muted-foreground">
                  Take a clear photo of the affected plant leaves for analysis
                </p>
              </div>

              {/* File Upload Alternative */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Images
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Tips for Better Photos */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  📸 Photo Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use good lighting (natural light preferred)</li>
                  <li>• Focus on affected leaves or plant parts</li>
                  <li>• Keep the camera steady</li>
                  <li>• Fill the frame with the plant</li>
                </ul>
              </div>
            </div>
          )}

          {isCamera && !capturedImage && (
            /* Camera View */
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />

                {/* Camera Controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={stopCamera}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={captureImage}
                    className="bg-white text-black hover:bg-gray-100 w-16 h-16 rounded-full p-0"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-xs">
                  Position the affected plant parts in the frame
                </Badge>
              </div>
            </div>
          )}

          {capturedImage && (
            /* Image Preview and Confirmation */
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured crop"
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={retakePhoto}
                  className="flex-1"
                  disabled={disabled}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>

                <Button
                  onClick={confirmImage}
                  className="flex-1"
                  disabled={disabled}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  Image ready for AI analysis
                </Badge>
              </div>
            </div>
          )}

          {capturedImages.length > 0 && (
            /* Multiple Images Preview and Management */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {capturedImages.length} Images Selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Review your images and add more if needed
                </p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Captured crop ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={addAnotherImage}
                  className="flex-1"
                  disabled={disabled || capturedImages.length >= 10}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add More
                </Button>

                <Button
                  onClick={confirmMultipleImages}
                  className="flex-1"
                  disabled={disabled || capturedImages.length === 0}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Analyze All ({capturedImages.length})
                </Button>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  {capturedImages.length} image
                  {capturedImages.length !== 1 ? "s" : ""} ready for AI analysis
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
