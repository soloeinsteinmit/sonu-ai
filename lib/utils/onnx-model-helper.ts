/**
 * Sonu - ONNX Model Helper
 *
 * This utility manages the ONNX inference session. It loads the model,
 * runs inference on a preprocessed image tensor, and processes the output
 * to determine the predicted class and confidence score.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

import * as ort from "onnxruntime-web";
import { MODEL_CLASS_NAMES } from "@/lib/constants/classNames";

export interface Prediction {
  className: string;
  confidence: number;
}

/**
 * Applies the Softmax function to an array of logits to convert them into probabilities.
 * @param {Float32Array} logits The raw output logits from the model.
 * @returns {Float32Array} An array of probabilities.
 */
function softmax(logits: Float32Array): Float32Array {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((logit) => Math.exp(logit - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b);
  return new Float32Array(exps.map((exp) => exp / sumExps));
}

/**
 * Creates an ONNX inference session.
 * @returns {Promise<ort.InferenceSession>} A promise that resolves to the inference session.
 */
export async function createInferenceSession(): Promise<ort.InferenceSession> {
  try {
    // Update: using MobileNet-based model trained for mobile
    // Place the file under /public/model/
    const modelPath = "/model/mobilenet_mobile.onnx";

    try {
      console.log("Loading ONNX model from:", modelPath);
      const session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });
      console.log("ONNX model loaded successfully");
      return session;
    } catch (error) {
      console.error("Failed to load ONNX model:", error);
      throw new Error(
        `Failed to load AI model: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
    return session;
  } catch (e) {
    throw e;
  }
}

/**
 * Runs inference on the ONNX model with the preprocessed image tensor.
 * @param {ort.InferenceSession} session The active ONNX inference session.
 * @param {Float32Array} preprocessedImage The preprocessed image tensor.
 * @returns {Promise<Prediction>} A promise that resolves to the top prediction (class name and confidence).
 */
export async function runInference(
  session: ort.InferenceSession,
  preprocessedImage: Float32Array
): Promise<Prediction> {
  const inputName = session.inputNames[0];

  // The model expects a tensor with shape [1, 3, 224, 224]
  const inputTensor = new ort.Tensor(
    "float32",
    preprocessedImage,
    [1, 3, 224, 224]
  );

  const feeds = { [inputName]: inputTensor };
  const results = await session.run(feeds);

  const outputName = session.outputNames[0];
  const outputData = results[outputName].data as Float32Array;

  // Post-process the output
  const probabilities = softmax(outputData);
  const maxProbability = Math.max(...probabilities);
  const maxIndex = probabilities.indexOf(maxProbability);

  const predictedClassName = MODEL_CLASS_NAMES[maxIndex];
  const confidence = maxProbability;

  return {
    className: predictedClassName,
    confidence: confidence,
  };
}
