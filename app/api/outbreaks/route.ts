import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Build path to predictions.csv using writable directory logic
    const dataDir =
      process.env.PREDICTIONS_DIR ||
      (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));

    const filePath = path.join(dataDir, "predictions.csv");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");

    const lines = fileContent.trim().split("\n");
    const header = lines.shift()?.split(",");

    if (!header) {
      return NextResponse.json([], { status: 200 });
    }

    const outbreaks = lines.map((line, index) => {
      const values = line.split(",");
      const entry = header.reduce((obj, key, i) => {
        obj[key] = values[i];
        return obj;
      }, {} as { [key: string]: string });

      return {
        id: index.toString(),
        location: {
          lat: parseFloat(entry.latitude),
          lng: parseFloat(entry.longitude),
          name: `Reported at ${new Date(entry.timestamp).toLocaleTimeString()}`,
        },
        disease: entry.disease,
      };
    });

    return NextResponse.json(outbreaks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error reading outbreak data" },
      { status: 500 }
    );
  }
}
