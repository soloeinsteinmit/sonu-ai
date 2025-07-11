/**
 * AgriSentry AI - Disease Database Constants
 *
 * This file contains mock disease data and treatment recommendations
 * based on common crop diseases in Ghana. In production, this would
 * be fetched from a backend API or database.
 *
 * @author Alhassan Mohammed Nuruddin & Solomon Eshun
 * @version 1.0.0
 */

import { Disease, Treatment, CropType } from "../types/disease";
import { MODEL_CLASS_NAMES } from "./classNames";

/**
 * Generates a disease ID from a model class name.
 * e.g., "Cashew_anthracnose" -> "cashew-anthracnose"
 * @param className The name from the model's class list.
 * @returns A formatted string ID.
 */
const createDiseaseId = (className: string) =>
  className.toLowerCase().replace(/_/g, "-");

/**
 * Mock disease database for demonstration.
 * It's dynamically populated based on the model's class names to ensure consistency.
 */
export const DISEASES: Disease[] = MODEL_CLASS_NAMES.map((name) => {
  const isHealthy = name.includes("_healthy");
  const crop = name.split("_")[0].toLowerCase() as CropType;
  const diseaseName = name.replace(/_/g, " ");

  return {
    id: createDiseaseId(name),
    name: diseaseName,
    scientificName: isHealthy ? "Sanus plantis" : "Morbus plantarum",
    description: isHealthy
      ? `The ${crop} plant appears to be healthy and free from common diseases.`
      : `Common ${diseaseName} affecting ${crop} crops in Ghana.`,
    symptoms: isHealthy
      ? ["No visible signs of disease", "Healthy leaf color", "Normal growth"]
      : [
          `Visible ${diseaseName} symptoms on leaves`,
          "Reduced plant vigor",
          "Potential yield loss if untreated",
        ],
    affectedCrops: [crop as CropType],
    severity: isHealthy
      ? "none"
      : Math.random() > 0.7
      ? "critical"
      : Math.random() > 0.4
      ? "severe"
      : "mild",
    prevalence: Math.floor(Math.random() * 50) + 10,
    riskFactors: [
      "High humidity",
      "Poor drainage",
      "Overcrowding",
      "Contaminated tools",
    ],
    commonInRegions: ["Greater Accra", "Ashanti", "Northern"],
  };
});

/**
 * Treatment database with organic and chemical options.
 * Costs are in Ghana Cedis (GHS).
 */
export const TREATMENTS: Treatment[] = [
  // --- General & Broad-Spectrum Treatments ---
  {
    id: "neem-oil-spray",
    name: "Neem Oil Spray",
    type: "organic",
    description:
      "A broad-spectrum organic pesticide and fungicide effective against many common pests and diseases like mites, rust, and blight.",
    instructions: [
      "Mix 30ml neem oil with 1 liter of water.",
      "Add a few drops of liquid soap to emulsify.",
      "Spray thoroughly on all parts of the plant, especially under leaves.",
      "Apply every 7-14 days as a preventive measure or weekly to treat infestations.",
    ],
    frequency: "Weekly/Bi-weekly",
    duration: "Ongoing",
    cost: { min: 25, max: 50, currency: "GHS" },
    effectiveness: 70,
    safety: {
      level: "low",
      warnings: ["Can be harmful to beneficial insects if applied directly."],
      precautions: [
        "Apply in the early morning or late evening to avoid sun damage and harm to pollinators.",
      ],
    },
  },
  {
    id: "copper-fungicide",
    name: "Copper-Based Fungicide",
    type: "chemical",
    description:
      "A widely used chemical fungicide for controlling bacterial and fungal diseases like blights, leaf spots, and anthracnose.",
    instructions: [
      "Follow manufacturer's instructions for mixing rates (e.g., 20g per liter).",
      "Spray every 10-14 days, starting when conditions are favorable for disease.",
      "Ensure complete coverage of all plant surfaces.",
    ],
    dosage: "Varies by product",
    frequency: "10-14 days",
    duration: "As needed during growing season",
    cost: { min: 45, max: 70, currency: "GHS" },
    effectiveness: 85,
    safety: {
      level: "medium",
      warnings: ["Can be toxic to fish.", "May cause skin irritation."],
      precautions: [
        "Wear protective gear (gloves, mask).",
        "Observe the pre-harvest interval specified on the label.",
      ],
    },
  },
  // --- Cultural & Specific Treatments ---
  {
    id: "cassava-resistant-varieties",
    name: "Plant Resistant Varieties",
    type: "cultural",
    description:
      "The most effective long-term strategy for managing diseases like Cassava Mosaic Virus is to plant resistant cultivars.",
    instructions: [
      "Source certified disease-free planting material from reputable suppliers.",
      "Choose varieties known for resistance in your region (e.g., TME 419, Afisiafi).",
    ],
    frequency: "One-time per planting",
    duration: "Full crop cycle",
    cost: { min: 50, max: 150, currency: "GHS" },
    effectiveness: 95,
    safety: { level: "low", warnings: [], precautions: [] },
  },
  {
    id: "remove-infected-plants",
    name: "Sanitation and Removal",
    type: "cultural",
    description:
      "For viral diseases like Maize Streak or Tomato Leaf Curl, removing and destroying infected plants early is crucial to stop spread.",
    instructions: [
      "Scout fields regularly (at least weekly).",
      "Uproot infected plants immediately upon detection.",
      "Burn or bury the plants far from the field; do not compost them.",
    ],
    frequency: "As needed",
    duration: "Ongoing",
    cost: { min: 0, max: 10, currency: "GHS" },
    effectiveness: 50,
    safety: {
      level: "low",
      warnings: [],
      precautions: ["Wash hands and tools after handling infected plants."],
    },
  },
  {
    id: "fall-armyworm-control",
    name: "Fall Armyworm Control",
    type: "chemical",
    description:
      "Specific insecticides are often required to control Fall Armyworm infestations in maize.",
    instructions: [
      "Apply insecticides like Emamectin Benzoate early in the morning or late in the evening when larvae are active.",
      "Direct the spray into the whorl of the maize plant where the larvae feed.",
      "Rotate different types of insecticides to prevent resistance.",
    ],
    dosage: "As per product label",
    frequency: "As needed based on scouting",
    duration: "During vegetative stage",
    cost: { min: 60, max: 100, currency: "GHS" },
    effectiveness: 80,
    safety: {
      level: "high",
      warnings: ["Highly toxic.", "Follow all label instructions carefully."],
      precautions: [
        "Full PPE required.",
        "Strict adherence to pre-harvest intervals.",
      ],
    },
  },
];

/**
 * Disease-to-treatment mapping. This is now also dynamically populated
 * for better coverage and easier maintenance.
 */
export const DISEASE_TREATMENTS: Record<string, string[]> = {};

DISEASES.forEach((disease) => {
  if (disease.id.includes("healthy")) {
    DISEASE_TREATMENTS[disease.id] = [];
    return;
  }

  // Assign treatments based on keywords in the disease ID
  const treatments: string[] = [];
  if (disease.id.includes("blight") || disease.id.includes("spot")) {
    treatments.push("copper-fungicide", "neem-oil-spray");
  } else if (disease.id.includes("anthracnose")) {
    treatments.push("copper-fungicide");
  } else if (disease.id.includes("mite") || disease.id.includes("miner")) {
    treatments.push("neem-oil-spray");
  } else if (disease.id.includes("mosaic") || disease.id.includes("virus")) {
    treatments.push("cassava-resistant-varieties", "remove-infected-plants");
  } else if (disease.id.includes("armyworm")) {
    treatments.push("fall-armyworm-control", "neem-oil-spray");
  } else {
    // Default fallback
    treatments.push("neem-oil-spray", "remove-infected-plants");
  }

  DISEASE_TREATMENTS[disease.id] = [...new Set(treatments)]; // Ensure unique treatments
});

/**
 * General prevention tips for all crops.
 */
export const PREVENTION_TIPS = [
  "Use certified disease-free planting materials.",
  "Practice crop rotation to break disease cycles.",
  "Ensure adequate plant spacing for good air circulation.",
  "Remove and destroy infected plant debris after harvest.",
  "Keep fields free of weeds, which can host pests and diseases.",
  "Monitor crops regularly for early signs of trouble.",
  "Use resistant crop varieties whenever available.",
  "Avoid overhead irrigation, which can spread fungal spores.",
  "Maintain balanced soil fertility.",
];
