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

    // Determine next incremental ID for stable deletion handling
    const dataDir =
      process.env.PREDICTIONS_DIR ||
      (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "server"));
    const filePath = path.join(dataDir, "predictions.csv");

    let nextId = 1;
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8").trim();
      const lines = fileContent.split("\n");
      if (lines.length > 1) {
        const lastLine = lines[lines.length - 1];
        const [lastId] = lastLine.split(",");
        const lastIdNum = parseInt(lastId, 10);
        if (!isNaN(lastIdNum)) nextId = lastIdNum + 1;
      }
    }

    const csvLine = `${nextId},${new Date().toISOString()},${latitude},${longitude},${disease}\n`;

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write to the file
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "id,timestamp,latitude,longitude,disease\n");
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
