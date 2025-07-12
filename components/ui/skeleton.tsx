"use client";

import React from "react";

/**
 * Skeleton Loader Component
 * Simple animated placeholder for loading UI states
 * Tailwind CSS required
 */
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-muted/40 rounded ${className}`}
      {...props}
    />
  );
}
