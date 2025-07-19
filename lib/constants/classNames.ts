/**
 * AgriSentry AI - Model Class Names
 *
 * This file contains the array of class names that the ONNX model was trained on.
 * The order of these names MUST EXACTLY match the order used during model training.
 * This is critical for correctly mapping the model's output index to a human-readable disease name.
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */
export const MODEL_CLASS_NAMES = [
  "Cashew_anthracnose",
  "Cashew_gumosis",
  "Cashew_healthy",
  "Cashew_leaf_miner", // Corrected from 'leaf miner'
  "Cashew_red_rust",
  "Cassava_bacterial_blight",
  "Cassava_brown_spot",
  "Cassava_green_mite",
  "Cassava_healthy",
  "Cassava_mosaic",
  "Maize_fall_armyworm",
  "Maize_grasshopper",
  "Maize_healthy",
  "Maize_leaf_beetle",
  "Maize_leaf_blight",
  "Maize_leaf_spot",
  "Maize_streak_virus",
  "Tomato_healthy",
  "Tomato_leaf_blight",
  "Tomato_leaf_curl",
  "Tomato_septoria_leaf_spot",
  "Tomato_verticulium_wilt",
];
