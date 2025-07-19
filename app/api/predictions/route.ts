import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function GET() {
  // Use a writable directory ("/tmp" on Vercel) or allow override via env
  const dataDir =
    process.env.PREDICTIONS_DIR ||
    (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));
  const filePath = path.join(dataDir, "predictions.csv");
  const results: any[] = [];

  // If the file doesn't exist yet, return an empty array so the client can handle gracefully
  if (!fs.existsSync(filePath)) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });

    const outbreaks = results
      .filter((row) => row.disease.toLowerCase() !== "healthy")
      .map((row, index) => ({
        id: String(index + 1),
        location: {
          lat: parseFloat(row.latitude),
          lng: parseFloat(row.longitude),
          name: `Prediction ${index + 1}`,
          region: "Unknown",
        },
        disease: row.disease,
        crop: "Unknown",
        severity: "high",
        reportedDate: row.timestamp,
        affectedArea: 1,
        reportedBy: "AI Model",
        status: "active",
        description: `AI-detected outbreak of ${row.disease}.`,
      }));

    return NextResponse.json(outbreaks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching outbreak data" },
      { status: 500 }
    );
  }
}
