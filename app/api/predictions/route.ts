import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

// Mock outbreak data that can be deleted by users
const mockOutbreaks = [
  {
    id: "outbreak-1",
    location: { 
      lat: 5.6037, 
      lng: -0.1870, 
      name: "Accra Central",
      region: "Greater Accra" 
    },
    disease: "Cassava Mosaic",
    crop: "Cassava",
    severity: "high" as const,
    reportedDate: "2025-01-15T10:30:00Z",
    reportedBy: "Farmer John Mensah",
    status: "active" as const,
    description: "Widespread mosaic symptoms observed in cassava plantation. Affecting approximately 60% of plants."
  },
  {
    id: "outbreak-2", 
    location: { 
      lat: 6.6885, 
      lng: -1.6244, 
      name: "Kumasi",
      region: "Ashanti" 
    },
    disease: "Maize Streak Virus",
    crop: "Maize",
    severity: "medium" as const,
    reportedDate: "2025-01-14T14:15:00Z",
    reportedBy: "Agricultural Extension Officer",
    status: "contained" as const,
    description: "Streak symptoms in young maize plants. Treatment measures have been applied."
  },
  {
    id: "outbreak-3",
    location: { 
      lat: 5.5500, 
      lng: -0.2167, 
      name: "Tema",
      region: "Greater Accra" 
    },
    disease: "Tomato Leaf Blight",
    crop: "Tomato",
    severity: "critical" as const,
    reportedDate: "2025-01-13T08:45:00Z",
    reportedBy: "Greenhouse Manager",
    status: "active" as const,
    description: "Rapid spread of leaf blight in greenhouse facility. Immediate intervention required."
  },
  {
    id: "outbreak-4",
    location: { 
      lat: 7.9465, 
      lng: -1.0232, 
      name: "Tamale",
      region: "Northern" 
    },
    disease: "Cashew Anthracnose",
    crop: "Cashew",
    severity: "medium" as const,
    reportedDate: "2025-01-12T16:20:00Z",
    reportedBy: "Cashew Farmer Association",
    status: "active" as const,
    description: "Anthracnose symptoms detected in cashew trees. Monitoring ongoing."
  },
  {
    id: "outbreak-5",
    location: { 
      lat: 5.1200, 
      lng: -1.2800, 
      name: "Cape Coast",
      region: "Central" 
    },
    disease: "Cassava Brown Spot",
    crop: "Cassava",
    severity: "low" as const,
    reportedDate: "2025-01-11T11:10:00Z",
    reportedBy: "Community Farmer",
    status: "contained" as const,
    description: "Brown spot disease identified in small cassava plot. Localized treatment applied."
  }
];

export async function GET() {
  const filePath = path.join(process.cwd(), "server", "predictions.csv");
  const csvResults: any[] = [];

  try {
    // Try to read CSV file if it exists
    if (fs.existsSync(filePath)) {
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
        id: `csv-${index + 1}`,
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

    // Combine mock outbreaks with CSV data
    const allOutbreaks = [...mockOutbreaks, ...csvOutbreaks];

    return NextResponse.json(allOutbreaks);
  } catch (error) {
    console.error("Error fetching outbreak data:", error);
    // Return just mock data if CSV reading fails
    return NextResponse.json(mockOutbreaks);
  }
}
