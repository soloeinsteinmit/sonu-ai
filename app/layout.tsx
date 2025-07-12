import type { Metadata, Viewport } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AgriSentry AI - Crop Disease Detection",
    template: "%s | AgriSentry AI",
  },
  description:
    "AI-powered crop disease detection and community outbreak tracking for Ghanaian farmers. Detect diseases instantly, get treatment recommendations, and track community outbreaks.",
  keywords: [
    "agriculture",
    "AI",
    "crop disease",
    "Ghana",
    "farming",
    "plant health",
    "disease detection",
  ],
  authors: [{ name: "Alhassan Mohammed Nuruddin" }, { name: "Solomon Eshun" }],
  creator: "AgriSentry AI Team",
  publisher: "AgriSentry AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://agrisentry-ai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agrisentry-ai.vercel.app",
    title: "AgriSentry AI - Crop Disease Detection",
    description:
      "AI-powered crop disease detection and community outbreak tracking for Ghanaian farmers",
    siteName: "AgriSentry AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgriSentry AI - Crop Disease Detection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriSentry AI - Crop Disease Detection",
    description: "AI-powered crop disease detection for Ghanaian farmers",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriSentry AI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable}`}
    >
      <head>
        <meta name="application-name" content="AgriSentry AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgriSentry AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#16a34a"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="antialiased min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
