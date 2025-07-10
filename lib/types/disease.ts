/**
 * AgriSentry AI - Disease Detection Types
 *
 * This file contains all TypeScript interfaces and types related to
 * crop disease detection, treatment recommendations, and related data structures.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

// Supported crop types based on CCMT dataset
export type CropType = "cashew" | "cassava" | "maize" | "tomato";

// Disease severity levels
export type SeverityLevel = "mild" | "moderate" | "severe" | "critical";

// Treatment types available
export type TreatmentType = "organic" | "chemical" | "cultural" | "biological";

// Detection confidence levels
export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * Core disease information structure
 */
export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  symptoms: string[];
  affectedCrops: CropType[];
  severity: SeverityLevel;
  prevalence: number; // 0-100 percentage
}

/**
 * AI detection result from image analysis
 */
export interface DetectionResult {
  diseaseId: string;
  confidence: number; // 0-100 percentage
  confidenceLevel: ConfidenceLevel;
  severity: SeverityLevel;
  affectedArea: number; // 0-100 percentage of image
  detectedAt: Date;
  processingTime: number; // milliseconds
}

/**
 * Treatment recommendation structure
 */
export interface Treatment {
  id: string;
  name: string;
  type: TreatmentType;
  description: string;
  instructions: string[];
  dosage?: string;
  frequency: string;
  duration: string;
  cost: {
    min: number;
    max: number;
    currency: "GHS"; // Ghana Cedis
  };
  effectiveness: number; // 0-100 percentage
  safety: {
    level: "low" | "medium" | "high";
    warnings: string[];
    precautions: string[];
  };
}

/**
 * Complete scan result with disease detection and treatment recommendations
 */
export interface ScanResult {
  id: string;
  imageUrl: string;
  detectionResult: DetectionResult;
  disease: Disease;
  treatments: Treatment[];
  recommendations: {
    primary: Treatment;
    alternatives: Treatment[];
    prevention: string[];
  };
  createdAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    region: string;
    district: string;
  };
}

/**
 * Scan process status for UI state management
 */
export interface ScanStatus {
  isProcessing: boolean;
  progress: number; // 0-100
  stage: "upload" | "analyzing" | "processing" | "complete" | "error";
  message: string;
  error?: string;
}

/**
 * Camera capture options and constraints
 */
export interface CameraOptions {
  facingMode: "environment" | "user";
  resolution: {
    width: number;
    height: number;
  };
  quality: number; // 0-1
}

/**
 * Image preprocessing parameters
 */
export interface ImageProcessing {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: "jpeg" | "webp";
}
