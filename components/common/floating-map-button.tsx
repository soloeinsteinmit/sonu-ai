"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FloatingMapButton renders a fixed round button at the bottom-right corner
 * that navigates to the /map page. It hides itself when already on /map
 * routes so as not to be redundant.
 */
export function FloatingMapButton() {
  const pathname = usePathname();

  // Don't render on the /map route (and its sub-routes)
  if (pathname.startsWith("/map")) return null;

  return (
    <Link
      href="/map"
      className="fixed bottom-6 left-6 z-[1000] hover:opacity-90 transition-opacity"
    >
      <Button
        size="icon"
        className="rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <MapPin className="h-6 w-6" />
      </Button>
    </Link>
  );
}
