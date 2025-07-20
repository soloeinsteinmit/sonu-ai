import { NextResponse } from "next/server";

// Ensure this route runs in the Node.js runtime where custom outbound requests are fully supported on Vercel.
export const runtime = "nodejs";

// Use the Node.js fetch cache behaviour (always dynamic) – reverse-geocoding responses should not be cached by the
// Next.js router. This avoids returning stale results if the user moves.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ Attempt reverse-geocoding with OpenStreetMap Nominatim. The API REQUIRES a descriptive
    //    `User-Agent` or `Referer` header – otherwise requests may be rate-limited or rejected (see
    //    https://operations.osmfoundation.org/policies/nominatim/). We comply by sending a short UA.
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const nominatimResponse = await fetch(nominatimUrl, {
      // IMPORTANT: Nominatim usage policy requires a descriptive UA / Referer
      headers: {
        "User-Agent": "SonuAI/1.0 (+https://sonu-ai.vercel.app)",
        "Accept": "application/json",
        "Referer": "https://sonu-ai.vercel.app",
      },
    });

    if (nominatimResponse.ok) {
      const data = await nominatimResponse.json();
      const location = data.display_name as string | undefined;

      if (location) {
        return NextResponse.json({ location });
      }
    }

    // 2️⃣ Fallback – use BigDataCloud’s free reverse-geocode endpoint which does not require an API key.
    //    This ensures the feature still works if Nominatim is busy or blocked.
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const bdcResponse = await fetch(bdcUrl);

    if (bdcResponse.ok) {
      const data = await bdcResponse.json();
      const {
        city,
        locality,
        principalSubdivision,
        countryName,
      } = data;

      // Compose a human-readable location string. We filter out empty parts and join with commas.
      const parts = [locality || city, principalSubdivision, countryName].filter(Boolean);
      if (parts.length) {
        const location = parts.join(", ");
        return NextResponse.json({ location });
      }
    }

    // If all providers fail, fall through to error response below.
    return NextResponse.json(
      {
        error: "Unable to determine location from coordinates. All providers failed.",
      },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch location",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
