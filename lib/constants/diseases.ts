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

import { Disease, Treatment } from "../types/disease";

/**
 * Mock disease database for demonstration
 * Based on CCMT dataset and common Ghanaian crop diseases
 */
export const DISEASES: Disease[] = [
  {
    id: "cassava-mosaic",
    name: "Cassava Mosaic Disease",
    scientificName: "Cassava mosaic virus (CMV)",
    description:
      "A viral disease causing yellow mosaic patterns on cassava leaves, severely reducing yield.",
    symptoms: [
      "Yellow mosaic patterns on leaves",
      "Stunted plant growth",
      "Reduced leaf size",
      "Poor root development",
    ],
    affectedCrops: ["cassava"],
    severity: "severe",
    prevalence: 85,
  },
  {
    id: "maize-streak",
    name: "Maize Streak Disease",
    scientificName: "Maize streak virus (MSV)",
    description:
      "A viral disease transmitted by leafhoppers, causing characteristic streaks on maize leaves.",
    symptoms: [
      "White or yellow streaks on leaves",
      "Stunted growth",
      "Reduced grain yield",
      "Premature plant death in severe cases",
    ],
    affectedCrops: ["maize"],
    severity: "moderate",
    prevalence: 70,
  },
  {
    id: "tomato-blight",
    name: "Tomato Early Blight",
    scientificName: "Alternaria solani",
    description:
      "A fungal disease causing dark spots on tomato leaves and fruits.",
    symptoms: [
      "Dark brown spots with concentric rings",
      "Yellowing of lower leaves",
      "Defoliation in severe cases",
      "Fruit rot and quality reduction",
    ],
    affectedCrops: ["tomato"],
    severity: "moderate",
    prevalence: 60,
  },
  {
    id: "cashew-anthracnose",
    name: "Cashew Anthracnose",
    scientificName: "Colletotrichum gloeosporioides",
    description: "A fungal disease affecting cashew leaves, shoots, and nuts.",
    symptoms: [
      "Dark brown leaf spots",
      "Premature leaf drop",
      "Blackened shoot tips",
      "Nut quality deterioration",
    ],
    affectedCrops: ["cashew"],
    severity: "moderate",
    prevalence: 55,
  },
];

/**
 * Treatment database with organic and chemical options
 * Costs are in Ghana Cedis (GHS)
 */
export const TREATMENTS: Treatment[] = [
  // Cassava Mosaic Disease Treatments
  {
    id: "cassava-resistant-varieties",
    name: "Resistant Varieties",
    type: "cultural",
    description: "Plant cassava varieties that are resistant to mosaic virus.",
    instructions: [
      "Source certified disease-free planting material",
      "Choose resistant varieties like TME 419 or Afisiafi",
      "Ensure proper field sanitation",
      "Remove and destroy infected plants",
    ],
    frequency: "One-time planting",
    duration: "Permanent solution",
    cost: { min: 50, max: 150, currency: "GHS" },
    effectiveness: 90,
    safety: {
      level: "low",
      warnings: [],
      precautions: ["Ensure planting material is certified"],
    },
  },
  {
    id: "neem-oil-spray",
    name: "Neem Oil Treatment",
    type: "organic",
    description:
      "Organic treatment using neem oil to reduce viral transmission.",
    instructions: [
      "Mix 30ml neem oil with 1 liter water",
      "Add 2ml liquid soap as emulsifier",
      "Spray early morning or late evening",
      "Apply to both sides of leaves",
    ],
    frequency: "Weekly",
    duration: "4-6 weeks",
    cost: { min: 25, max: 40, currency: "GHS" },
    effectiveness: 65,
    safety: {
      level: "low",
      warnings: ["May cause skin irritation"],
      precautions: [
        "Wear gloves during application",
        "Avoid spraying in direct sunlight",
      ],
    },
  },
  // Maize Streak Disease Treatments
  {
    id: "early-planting",
    name: "Early Planting Strategy",
    type: "cultural",
    description: "Plant maize early to avoid peak leafhopper activity.",
    instructions: [
      "Plant at the beginning of rainy season",
      "Use certified hybrid seeds",
      "Maintain proper plant spacing",
      "Control weeds around the field",
    ],
    frequency: "Seasonal",
    duration: "Per growing season",
    cost: { min: 80, max: 120, currency: "GHS" },
    effectiveness: 75,
    safety: {
      level: "low",
      warnings: [],
      precautions: [
        "Monitor weather patterns",
        "Ensure adequate soil moisture",
      ],
    },
  },
  // Tomato Blight Treatments
  {
    id: "copper-fungicide",
    name: "Copper-based Fungicide",
    type: "chemical",
    description:
      "Chemical treatment using copper fungicide for blight control.",
    instructions: [
      "Mix 20g copper oxychloride per liter of water",
      "Spray every 10-14 days",
      "Start application at first sign of disease",
      "Ensure complete leaf coverage",
    ],
    dosage: "20g per liter",
    frequency: "Bi-weekly",
    duration: "6-8 weeks",
    cost: { min: 45, max: 65, currency: "GHS" },
    effectiveness: 85,
    safety: {
      level: "medium",
      warnings: ["Harmful if ingested", "May cause skin irritation"],
      precautions: [
        "Wear protective clothing",
        "Do not spray during windy conditions",
        "Observe 7-day pre-harvest interval",
      ],
    },
  },
  {
    id: "baking-soda-spray",
    name: "Baking Soda Solution",
    type: "organic",
    description: "Organic fungal control using sodium bicarbonate.",
    instructions: [
      "Mix 5g baking soda with 1 liter water",
      "Add 2ml liquid soap",
      "Spray affected areas thoroughly",
      "Apply in early morning",
    ],
    frequency: "Weekly",
    duration: "4-5 weeks",
    cost: { min: 15, max: 25, currency: "GHS" },
    effectiveness: 60,
    safety: {
      level: "low",
      warnings: [],
      precautions: ["Test on small area first", "Avoid over-application"],
    },
  },
];

/**
 * Disease-to-treatment mapping for quick lookup
 */
export const DISEASE_TREATMENTS: Record<string, string[]> = {
  "cassava-mosaic": ["cassava-resistant-varieties", "neem-oil-spray"],
  "maize-streak": ["early-planting", "neem-oil-spray"],
  "tomato-blight": ["copper-fungicide", "baking-soda-spray"],
  "cashew-anthracnose": ["copper-fungicide", "neem-oil-spray"],
};

/**
 * General prevention tips for all crops
 */
export const PREVENTION_TIPS = [
  "Use certified disease-free planting materials",
  "Maintain proper field sanitation",
  "Practice crop rotation",
  "Ensure adequate plant spacing for air circulation",
  "Remove and destroy infected plant debris",
  "Monitor crops regularly for early disease detection",
  "Use resistant varieties when available",
  "Avoid overhead irrigation to reduce leaf moisture",
];
