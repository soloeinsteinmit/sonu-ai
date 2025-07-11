/**
 * AgriSentry AI - Prediction Pipeline
 *
 * This file orchestrates the entire client-side inference process.
 * It combines image preprocessing and model inference into a single,
 * easy-to-use function that the UI can call.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import * as ort from "onnxruntime-web";
import { preprocessImage } from "./image-helper";
import {
  createInferenceSession,
  runInference,
  Prediction,
} from "./onnx-model-helper";

// A global variable to hold the inference session, so we don't reload it on every prediction.
let session: ort.InferenceSession | null = null;

/**
 * Main prediction function. It takes an image file, preprocesses it, and runs
 * it through the ONNX model to get a disease prediction.
 * @param {File} imageFile The image file to analyze.
 * @returns {Promise<Prediction>} A promise that resolves to the prediction result.
 */
export async function predict(imageFile: File): Promise<Prediction> {
  try {
    // Load the inference session if it hasn't been loaded yet.
    if (!session) {
      console.log("Session not found, creating a new one...");
      session = await createInferenceSession();
    } else {
      console.log("Using existing session.");
    }

    console.log("Preprocessing image...");
    const preprocessedImage = await preprocessImage(imageFile);
    console.log("Image preprocessed successfully.");

    console.log("Running inference...");
    const prediction = await runInference(session, preprocessedImage);
    console.log("Inference completed.", prediction);

    return prediction;
  } catch (error) {
    console.error(
      "❌ An error occurred during the prediction pipeline:",
      error
    );
    // If an error occurs, nullify the session to force a reload on the next attempt.
    session = null;
    throw error;
  }
}
