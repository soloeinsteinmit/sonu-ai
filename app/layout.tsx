import type { Metadata, Viewport } from "next";
import {
  Montserrat,
  Merriweather,
  Source_Code_Pro,
  Pacifico,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { NearbyOutbreakAlert } from "@/components/alerts/nearby-outbreak-alert";
import { OfflineIndicator } from "@/components/common/offline-indicator";
import { OfflineSync } from "@/components/common/offline-sync";
import { ModelPreloader } from "@/components/common/model-preloader";

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

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sonu - Crop Disease Detection",
    template: "%s | Sonu",
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
  creator: "Sonu Team",
  publisher: "Sonu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://Sonu-ai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://Sonu-ai.vercel.app",
    title: "Sonu - Crop Disease Detection",
    description:
      "AI-powered crop disease detection and community outbreak tracking for Ghanaian farmers",
    siteName: "Sonu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sonu - Crop Disease Detection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonu - Crop Disease Detection",
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
    title: "Sonu",
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
      className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} ${pacifico.variable}`}
    >
      <head>
        <meta name="application-name" content="Sonu" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sonu" />
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
        <OfflineIndicator />
        <OfflineSync />
        <ModelPreloader />
        {children}
        {/* Show user an alert if they are near an outbreak */}
        <NearbyOutbreakAlert radiusKm={5} />

        <Toaster richColors />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // PWA Install Prompt and Service Worker Registration
            const PROMPT_KEY = 'Sonu-pwa-dismissed';
            let deferredPrompt = null;
            let promptAlreadyShown = false;
            
            // Function to preload the AI model
            async function preloadAIModel() {
              try {
                console.log('Preloading AI model...');
                
                // Try to fetch the model to ensure it's cached
                const modelPaths = [
                  '/model/mobilenet_mobile.onnx'
                ];
                
                for (const modelPath of modelPaths) {
                  try {
                    console.log('Attempting to preload model:', modelPath);
                    const response = await fetch(modelPath, { cache: 'force-cache' });
                    if (response.ok) {
                      console.log('Successfully preloaded model:', modelPath);
                      break; // Stop if one model loads successfully
                    } else {
                      console.warn('Failed to preload model:', modelPath);
                    }
                  } catch (err) {
                    console.warn('Error preloading model:', modelPath, err);
                  }
                }
              } catch (error) {
                console.error('Error in preloadAIModel:', error);
              }
            }
            
            // Function to check if app is installed as PWA
            function isPWA() {
              return window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator.standalone === true);
            }
            
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', async function() {
                try {
                  // Register the main service worker
                  const registration = await navigator.serviceWorker.register('/sw.js');
                  console.log('SW registered successfully');
                  
                  // Wait for the service worker to be ready
                  await navigator.serviceWorker.ready;
                  
                  // Import the custom offline worker script
                  const offlineScript = document.createElement('script');
                  offlineScript.src = '/offline-worker.js';
                  offlineScript.async = true;
                  document.head.appendChild(offlineScript);
                  
                  // Check if service worker is active
                  if (registration.active) {
                    // Create a message channel
                    const messageChannel = new MessageChannel();
                    
                    // Set up the message handler
                    messageChannel.port1.onmessage = function(event) {
                      if (event.data && event.data.registered) {
                        console.log('Custom offline handler registered');
                      }
                    };
                    
                    // Send message to service worker to register custom handler
                    registration.active.postMessage(
                      { type: 'REGISTER_CUSTOM_HANDLER' },
                      [messageChannel.port2]
                    );
                  }
                  
                  // Preload the AI model if we're in a PWA or online
                  if (isPWA() || navigator.onLine) {
                    preloadAIModel();
                  }
                  
                  // Listen for service worker updates
                  registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          console.log('New service worker installed, reloading for updates');
                          // Optional: Show a notification that an update is available
                        }
                      });
                    }
                  });
                } catch (error) {
                  console.error('SW registration failed:', error);
                }
              });
              
              // Listen for offline/online events
              window.addEventListener('online', function() {
                document.body.classList.remove('is-offline');
                document.body.classList.add('is-online');
                console.log('✅ Back online');
                
                // Try to preload the model when we come back online
                if (!isPWA()) {
                  preloadAIModel();
                }
              });
              
              window.addEventListener('offline', function() {
                document.body.classList.remove('is-online');
                document.body.classList.add('is-offline');
                console.log('⚠️ Gone offline');
              });
              
              // Set initial state
              if (navigator.onLine) {
                document.body.classList.add('is-online');
              } else {
                document.body.classList.add('is-offline');
              }
              
              // Listen for PWA display mode changes
              window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
                if (evt.matches) {
                  console.log('App is running as installed PWA');
                  // Preload model when app is installed
                  preloadAIModel();
                }
              });
            }
            
            // Handle install prompt
            window.addEventListener('beforeinstallprompt', function(e) {
              console.log('beforeinstallprompt fired');
              
              // Check if user has permanently dismissed alerts
              if (localStorage.getItem(PROMPT_KEY) === 'true') {
                console.log('User has dismissed PWA prompts permanently');
                return;
              }
              
              // Check if we already showed prompt in this session
              if (promptAlreadyShown) {
                console.log('Prompt already shown this session');
                return;
              }
              
              e.preventDefault();
              deferredPrompt = e;
              promptAlreadyShown = true;
              
              console.log('Showing install prompt...');
              
              // Show install prompt after 3 seconds
              setTimeout(() => {
                showInstallPrompt();
              }, 3000);
            });
            
            function showInstallPrompt() {
              // Remove any existing prompt first
              const existingPrompt = document.getElementById('pwa-install-prompt');
              if (existingPrompt) {
                existingPrompt.remove();
              }
              
              const promptHTML = \`
                <div id="pwa-install-prompt" style="
                  position: fixed;
                  bottom: 20px;
                  right: 20px;
                  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                  color: white;
                  border: none;
                  border-radius: 12px;
                  padding: 20px;
                  box-shadow: 0 8px 25px rgba(22, 163, 74, 0.4);
                  z-index: 9999;
                  max-width: 320px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                ">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="
                        width: 28px; 
                        height: 28px; 
                        background: rgba(255,255,255,0.2); 
                        border-radius: 8px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        font-size: 16px;
                      ">🌱</div>
                      <strong style="color: white; font-size: 18px; font-weight: 600;">Install Sonu</strong>
                    </div>
                    <button onclick="dismissInstallPrompt()" style="
                      background: rgba(255,255,255,0.1);
                      border: none;
                      color: rgba(255,255,255,0.8);
                      cursor: pointer;
                      font-size: 18px;
                      padding: 8px;
                      border-radius: 6px;
                      transition: background 0.2s;
                      line-height: 1;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">×</button>
                  </div>
                  <p style="
                    margin: 0 0 16px 0; 
                    font-size: 14px; 
                    color: rgba(255,255,255,0.9); 
                    line-height: 1.5;
                  ">Get instant access and work offline with our mobile app</p>
                  <div style="display: flex; gap: 12px;">
                    <button onclick="installPWA()" style="
                      background: rgba(255,255,255,0.9);
                      color: #16a34a;
                      border: none;
                      padding: 12px 20px;
                      border-radius: 8px;
                      cursor: pointer;
                      flex: 1;
                      font-weight: 600;
                      font-size: 14px;
                      transition: all 0.2s;
                    " onmouseover="this.style.background='white'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='translateY(0)'">Install Now</button>
                    <button onclick="dismissInstallPrompt()" style="
                      background: transparent;
                      color: rgba(255,255,255,0.9);
                      border: 1px solid rgba(255,255,255,0.3);
                      padding: 12px 20px;
                      border-radius: 8px;
                      cursor: pointer;
                      flex: 1;
                      font-weight: 500;
                      font-size: 14px;
                      transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateY(0)'">Maybe Later</button>
                  </div>
                </div>
              \`;
              
              document.body.insertAdjacentHTML('beforeend', promptHTML);
            }
            
            function installPWA() {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'dismissed') {
                    localStorage.setItem(PROMPT_KEY, 'true');
                  }
                  deferredPrompt = null;
                  removeInstallPrompt();
                });
              }
            }
            
            function dismissInstallPrompt() {
              localStorage.setItem(PROMPT_KEY, 'true');
              removeInstallPrompt();
            }
            
            function removeInstallPrompt() {
              const prompt = document.getElementById('pwa-install-prompt');
              if (prompt) {
                prompt.style.animation = 'slideOutDown 0.3s cubic-bezier(0.4, 0, 0.68, 0.06) forwards';
                setTimeout(() => {
                  if (prompt.parentNode) {
                    prompt.remove();
                  }
                }, 300);
              }
            }
            
            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes slideInUp {
                from {
                  transform: translateY(100px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              @keyframes slideOutDown {
                from {
                  transform: translateY(0);
                  opacity: 1;
                }
                to {
                  transform: translateY(100px);
                  opacity: 0;
                }
              }
            \`;
            document.head.appendChild(style);
            `,
          }}
        />
      </body>
    </html>
  );
}
