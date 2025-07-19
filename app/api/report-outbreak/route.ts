import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    const csvLine = `${new Date().toISOString()},${latitude},${longitude},${disease}\n`;
    const filePath = path.join(process.cwd(), "server", "predictions.csv");

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write to the file
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "timestamp,latitude,longitude,disease\n");
    }
    fs.appendFileSync(filePath, csvLine);

    return NextResponse.json(
      { message: "Prediction saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error saving prediction" },
      { status: 500 }
    );
  }
}
