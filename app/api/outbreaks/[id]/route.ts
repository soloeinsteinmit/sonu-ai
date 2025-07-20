export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import {
  isWithinDeletionRange,
  isValidCoordinates,
  isWithinGhanaBounds,
} from "@/lib/utils/location-helper";
import fs from "fs";
import path from "path";

/**
 * Sonu - Outbreak Deletion API
 *
 * Handles location-based deletion of outbreak reports
 * Users can only delete outbreaks within 5km of their location
 *
 * @author Mohammed Nuruddin Alhassan & Solomon Eshun
 * @version 1.0.0
 */

// Default mock outbreaks removed – API now relies entirely on predictions.csv
// for both fetching and deletion operations.

/**
 * DELETE /api/outbreaks/[id]
 * Delete an outbreak report with location verification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Parse request body once (for both mock and csv branches)
    const body = await request.json();
    const { userLocation, reason } = body;

    // Validate user location early
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return NextResponse.json(
        { error: "User location is required for deletion" },
        { status: 400 }
      );
    }

    const { latitude: userLat, longitude: userLon } = userLocation;

    // Validate coordinates
    if (!isValidCoordinates(userLat, userLon)) {
      return NextResponse.json(
        { error: "Invalid coordinates provided" },
        { status: 400 }
      );
    }

    // Check if coordinates are within Ghana bounds
    if (!isWithinGhanaBounds(userLat, userLon)) {
      return NextResponse.json(
        { error: "Location must be within Ghana" },
        { status: 400 }
      );
    }

    // Handle deletion for AI-generated outbreaks stored in predictions.csv
    if (id.startsWith("csv-")) {
      const indexStr = id.replace("csv-", "");
      const targetId = parseInt(indexStr, 10);

      if (isNaN(targetId) || targetId < 1) {
        return NextResponse.json(
          { error: "Invalid outbreak ID" },
          { status: 400 }
        );
      }

      // Build path to predictions.csv (same logic used elsewhere)
      const dataDir =
        process.env.PREDICTIONS_DIR ||
        (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));
      const filePath = path.join(dataDir, "predictions.csv");

      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: "No outbreak data found" },
          { status: 404 }
        );
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const lines = fileContent.trim().split("\n");

      if (lines.length <= 1) {
        return NextResponse.json(
          { error: "No outbreak data found" },
          { status: 404 }
        );
      }

      const header = lines[0];
      const dataLines = lines.slice(1);

      const headerKeys = header.split(",");
      const entry: { [key: string]: string } = {};

      let deleteIndex = -1;
      dataLines.forEach((line, idx) => {
        const values = line.split(",");
        headerKeys.forEach((key, i) => {
          entry[key] = values[i];
        });
        const currentId = parseInt(entry.id, 10);
        if (currentId === targetId) {
          deleteIndex = idx;
        }
      });

      if (deleteIndex === -1) {
        return NextResponse.json(
          { error: "Outbreak not found" },
          { status: 404 }
        );
      }

      const targetValues = dataLines[deleteIndex].split(",");
      headerKeys.forEach((key, i) => {
        entry[key] = targetValues[i];
      });

      // Check deletion range as before
      const outbreakLat = parseFloat(entry.latitude);
      const outbreakLon = parseFloat(entry.longitude);

      const canDeleteCsv = isWithinDeletionRange(
        userLat,
        userLon,
        outbreakLat,
        outbreakLon,
        5
      );

      if (!canDeleteCsv) {
        return NextResponse.json(
          {
            error:
              "You must be within 5km of the outbreak location to delete it",
            distance: calculateDistance(
              userLat,
              userLon,
              outbreakLat,
              outbreakLon
            ),
          },
          { status: 403 }
        );
      }

      // Remove the specific line and rewrite file
      dataLines.splice(deleteIndex, 1);
      const newContent = [header, ...dataLines].join("\n") + "\n";
      fs.writeFileSync(filePath, newContent, "utf-8");

      // console.log(
      //   `CSV outbreak ${id} deleted by user at ${userLat}, ${userLon}. Reason: ${
      //     reason || "No reason provided"
      //   }`
      // );

      return NextResponse.json(
        { message: "Outbreak successfully deleted" },
        { status: 200 }
      );
    }

    // Non-CSV IDs are considered invalid now that default outbreaks are gone
    return NextResponse.json({ error: "Outbreak not found" }, { status: 404 });
  } catch (error) {
    // console.error("Error deleting outbreak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/outbreaks/[id]
 * Get specific outbreak details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Outbreak ID is required" },
        { status: 400 }
      );
    }

    // Fetch outbreak details from CSV
    if (id.startsWith("csv-")) {
      const targetId = parseInt(id.replace("csv-", ""), 10);
      if (isNaN(targetId) || targetId < 1) {
        return NextResponse.json(
          { error: "Outbreak not found" },
          { status: 404 }
        );
      }

      const dataDir =
        process.env.PREDICTIONS_DIR ||
        (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));
      const filePath = path.join(dataDir, "predictions.csv");

      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: "Outbreak not found" },
          { status: 404 }
        );
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const lines = fileContent.trim().split("\n");
      if (lines.length <= 1) {
        return NextResponse.json(
          { error: "Outbreak not found" },
          { status: 404 }
        );
      }

      const headerKeys = lines[0].split(",");
      for (const line of lines.slice(1)) {
        const values = line.split(",");
        const entry: { [key: string]: string } = {};
        headerKeys.forEach((k, i) => (entry[k] = values[i]));
        if (parseInt(entry.id, 10) === targetId) {
          return NextResponse.json(entry);
        }
      }

      return NextResponse.json(
        { error: "Outbreak not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: "Outbreak not found" }, { status: 404 });
  } catch (error) {
    // console.error("Error fetching outbreak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function for distance calculation (duplicated here for API use)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
