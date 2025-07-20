import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Disease Scanner - Instant AI Detection",
  description: "Scan your crops instantly with AI! Take a photo of cassava, maize, tomato, or cashew plants to detect diseases with 96% accuracy. Get immediate treatment recommendations and protect your harvest.",
  keywords: [
    "crop disease scanner",
    "plant disease camera", 
    "AI crop diagnosis",
    "instant disease detection",
    "mobile crop scanner",
    "agricultural photo analysis",
    "crop health checker",
    "disease identification app",
    "cassava disease scanner",
    "maize disease detector",
    "tomato plant scanner",
    "cashew crop analyzer"
  ],
  openGraph: {
    title: "Crop Disease Scanner - Instant AI Detection | Sonu",
    description: "📸 Take a photo, get instant results! AI-powered crop disease detection for cassava, maize, tomato & cashew. 96% accuracy + treatment advice.",
    url: "https://sonu-ai.vercel.app/scan",
    images: [
      {
        url: "/og-scan-page.png",
        width: 1200,
        height: 630,
        alt: "Sonu crop disease scanner interface showing camera capture and AI analysis"
      }
    ],
  },
  twitter: {
    title: "Crop Disease Scanner - Instant AI Detection 📸🌾",
    description: "📸 Snap a photo → Get instant AI diagnosis → Protect your crops! 96% accuracy for Ghana's major crops. #CropScanner #AgTech",
    images: ["/twitter-scan-card.png"],
  },
  alternates: {
    canonical: "/scan",
  },
};