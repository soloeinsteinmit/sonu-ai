// Type declarations for next-pwa
declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
      };
    }>;
    buildExcludes?: RegExp[];
    maximumFileSizeToCacheInBytes?: number;
  }

  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export = withPWA;
}