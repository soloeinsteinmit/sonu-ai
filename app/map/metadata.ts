import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disease Outbreak Map - Community Tracking",
  description: "Track crop disease outbreaks across Ghana in real-time. See disease patterns in your area, get early warnings, and connect with other farmers. Community-powered agricultural intelligence.",
  keywords: [
    "crop disease map Ghana",
    "agricultural outbreak tracking",
    "disease surveillance Ghana",
    "farming community map",
    "crop disease alerts",
    "agricultural intelligence",
    "disease pattern tracking",
    "farming outbreak map",
    "Ghana agriculture map",
    "crop health monitoring",
    "community farming data",
    "agricultural early warning"
  ],
  openGraph: {
    title: "Disease Outbreak Map - Community Tracking | Sonu",
    description: "🗺️ Real-time crop disease tracking across Ghana! See outbreaks in your area, get early warnings, and connect with farming community.",
    url: "https://Sonu.vercel.app/map",
    images: [
      {
        url: "/og-map-page.png",
        width: 1200,
        height: 630,
        alt: "Sonu disease outbreak map showing real-time crop disease tracking across Ghana"
      }
    ],
  },
  twitter: {
    title: "Disease Outbreak Map - Community Tracking 🗺️🌾",
    description: "🗺️ Track crop diseases across Ghana in real-time! Early warnings + community intelligence = better harvests. #AgriMap #Ghana",
    images: ["/twitter-map-card.png"],
  },
  alternates: {
    canonical: "/map",
  },
};