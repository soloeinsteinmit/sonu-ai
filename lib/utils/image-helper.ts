/**
 * Sonu - Image Helper for ONNX Model
 *
 * This utility handles the crucial step of image preprocessing. It takes a raw
 * image file and converts it into the specific tensor format that the ONNX model
 * requires for inference. This involves resizing, normalizing, and reordering
 * pixel data to match the transformations used during model training in Python.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { Jimp } from "jimp";
import { ResizeStrategy } from "@jimp/plugin-resize";

const MODEL_INPUT_WIDTH = 224;
const MODEL_INPUT_HEIGHT = 224;

/**
 * Pre-processes a single image file for ONNX model inference.
 * This function replicates the torchvision.transforms used in the Python script.
 * @param {File} imageFile The image file uploaded by the user.
 * @returns {Promise<Float32Array>} A promise that resolves to the processed image tensor as a Float32Array.
 */
export async function preprocessImage(imageFile: File): Promise<Float32Array> {
  const imageBuffer = await imageFile.arrayBuffer();
  const image = await Jimp.read(Buffer.from(imageBuffer));

  // 1. Resize the image to the model's expected input size (224x224)
  image.resize({
    w: MODEL_INPUT_WIDTH,
    h: MODEL_INPUT_HEIGHT,
    mode: ResizeStrategy.BILINEAR,
  });

  // 2. Convert the image to a tensor-like structure (ndarray)
  const [channels, height, width] = [3, MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH];
  const tensor = new Float32Array(channels * height * width);

  // This loop iterates through the flat Jimp image data buffer, which stores
  // pixels in RGBA format (4 bytes per pixel).
  // It correctly extracts R, G, B values, normalizes them to the [0.0, 1.0] range,
  // and then places them into the final tensor in the required CHW format.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4; // Each pixel has 4 values (R, G, B, A)
      const r = image.bitmap.data[idx] / 255;
      const g = image.bitmap.data[idx + 1] / 255;
      const b = image.bitmap.data[idx + 2] / 255;

      // Place the normalized pixel data into the CHW tensor
      tensor[y * width + x] = r; // Red channel
      tensor[width * height + y * width + x] = g; // Green channel
      tensor[2 * width * height + y * width + x] = b; // Blue channel
    }
  }

  // 3. Normalize each channel using the ImageNet mean and standard deviation.
  // We now do this on the already constructed CHW tensor.
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];
  const channelSize = width * height;

  for (let c = 0; c < channels; c++) {
    for (let i = 0; i < channelSize; i++) {
      const index = c * channelSize + i;
      tensor[index] = (tensor[index] - mean[c]) / std[c];
    }
  }

  return tensor;
}
