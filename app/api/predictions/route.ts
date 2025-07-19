import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

// Default mock outbreaks removed – API will now rely solely on data coming
// from predictions.csv. If the CSV file does not exist yet, the endpoint will
// return an empty array so the UI can handle the "no data" state gracefully.
const mockOutbreaks: any[] = []; // kept for type safety but intentionally empty

export async function GET() {
  // Use a writable directory ("/tmp" on Vercel) or allow override via env
  const dataDir =
    process.env.PREDICTIONS_DIR ||
    (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));
  const filePath = path.join(dataDir, "predictions.csv");
  const csvResults: any[] = [];

  // If the file doesn't exist yet, proceed with just mockOutbreaks so the client
  // still has data to render while we wait for real predictions to be generated.
  const fileExists = fs.existsSync(filePath);

  try {
    // Try to read CSV file if it exists
    if (fileExists) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => csvResults.push(data))
          .on("end", () => resolve(csvResults))
          .on("error", (error) => reject(error));
      });
    }

    // Convert CSV data to outbreak format
    const csvOutbreaks = csvResults
      .filter((row) => row.disease && row.disease.toLowerCase() !== "healthy")
      .map((row, index) => ({
        id: row.id ? `csv-${row.id}` : `csv-${index + 1}`,
        location: {
          lat: parseFloat(row.latitude) || 0,
          lng: parseFloat(row.longitude) || 0,
          name: `AI Detection ${index + 1}`,
          region: "AI Detected",
        },
        disease: row.disease,
        crop: row.crop || "Unknown",
        severity: "medium" as const,
        reportedDate: row.timestamp || new Date().toISOString(),
        reportedBy: "AI Model",
        status: "active" as const,
        description: `AI-detected outbreak of ${row.disease}.`,
      }));

    // Return only CSV-based outbreaks (no defaults)
    return NextResponse.json(csvOutbreaks);
  } catch (error) {
    console.error("Error fetching outbreak data:", error);
    // On error, return an empty array instead of default data
    return NextResponse.json([]);
  }
}
