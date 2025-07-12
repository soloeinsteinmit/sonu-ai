
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function GET() {
  const filePath = path.join(process.cwd(), 'server', 'predictions.csv');
  const results: any[] = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });

    const outbreaks = results
      .filter(row => row.disease.toLowerCase() !== 'healthy')
      .map((row, index) => ({
        id: String(index + 1),
        location: {
          lat: parseFloat(row.latitude),
          lng: parseFloat(row.longitude),
          name: `Prediction ${index + 1}`,
          region: 'Unknown',
        },
        disease: row.disease,
        crop: 'Unknown',
        severity: 'high',
        reportedDate: row.timestamp,
        affectedArea: 1,
        reportedBy: 'AI Model',
        status: 'active',
        description: `AI-detected outbreak of ${row.disease}.`,
      }));

    return NextResponse.json(outbreaks);
  } catch (error) {
    console.error('Error reading or parsing CSV file:', error);
    return NextResponse.json({ message: 'Error fetching outbreak data' }, { status: 500 });
  }
}
