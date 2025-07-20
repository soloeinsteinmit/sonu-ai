import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const runtime = "nodejs";

/**
 * Generate the next available ID by reading existing CSV data
 */
async function getNextId(filePath: string): Promise<number> {
  if (!fs.existsSync(filePath)) {
    return 1;
  }

  return new Promise((resolve, reject) => {
    const ids: number[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.id && !isNaN(parseInt(row.id))) {
          ids.push(parseInt(row.id));
        }
      })
      .on("end", () => {
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        resolve(maxId + 1);
      })
      .on("error", (error) => {
        console.error("Error reading CSV for ID generation:", error);
        // Fallback to timestamp-based ID if reading fails
        resolve(Date.now() % 10000);
      });
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, disease } = body;

    if (!latitude || !longitude || !disease) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "server", "predictions.csv");

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file with header if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "id,timestamp,latitude,longitude,disease\n");
    }

    // Get the next available ID
    const nextId = await getNextId(filePath);

    // Create CSV line with ID
    const csvLine = `${nextId},${new Date().toISOString()},${latitude},${longitude},${disease}\n`;

    // Append to file
    fs.appendFileSync(filePath, csvLine);

    return NextResponse.json(
      {
        message: "Prediction saved successfully",
        id: nextId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving prediction:", error);
    return NextResponse.json(
      { message: "Error saving prediction" },
      { status: 500 }
    );
  }
}
