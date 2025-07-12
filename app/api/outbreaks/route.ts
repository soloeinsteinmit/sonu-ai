import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  console.log('Fetching outbreak data...');
  try {
    const filePath = path.join(process.cwd(), 'server', 'predictions.csv');
    console.log('File path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.log('File not found');
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log('File content:', fileContent);

    const lines = fileContent.trim().split('\n');
    const header = lines.shift()?.split(',');

    if (!header) {
      console.log('Empty or invalid header');
      return NextResponse.json([], { status: 200 });
    }

    const outbreaks = lines.map((line, index) => {
      const values = line.split(',');
      const entry = header.reduce((obj, key, i) => {
        obj[key] = values[i];
        return obj;
      }, {} as { [key: string]: string });

      console.log(`Processing line ${index}:`, entry);

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

    console.log('Returning outbreaks:', outbreaks);
    return NextResponse.json(outbreaks, { status: 200 });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ message: 'Error reading outbreak data' }, { status: 500 });
  }
}