import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "server", "predictions.csv");

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
    console.error("Error reading CSV file:", error);
    return NextResponse.json(
      { message: "Error reading outbreak data" },
      { status: 500 }
    );
  }
}
